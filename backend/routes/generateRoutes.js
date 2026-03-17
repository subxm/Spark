const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../config/db");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error) => {
  const message = String(error?.message || "").toUpperCase();
  return (
    message.includes("503") ||
    message.includes("SERVICEUNAVAILABLE") ||
    message.includes("UNAVAILABLE") ||
    message.includes("HIGH DEMAND") ||
    message.includes("TRY AGAIN LATER")
  );
};

const isQuotaExceededGeminiError = (error) => {
  const message = String(error?.message || "").toUpperCase();
  return (
    message.includes("429") ||
    message.includes("TOO MANY REQUESTS") ||
    message.includes("QUOTA EXCEEDED") ||
    message.includes("RESOURCE_EXHAUSTED")
  );
};

const extractRetryAfterSeconds = (error) => {
  const message = String(error?.message || "");
  const match = message.match(/retry in\s+([\d.]+)s/i);
  if (!match) return null;
  const seconds = Number.parseFloat(match[1]);
  return Number.isFinite(seconds) ? Math.ceil(seconds) : null;
};

const extractGeneratedCode = (result) => {
  const parts = result?.response?.candidates?.[0]?.content?.parts || [];
  const fromParts = parts
    .map((part) => part?.text || "")
    .join("")
    .trim();
  const fromTextFn =
    typeof result?.response?.text === "function"
      ? result.response.text().trim()
      : "";
  const text = fromParts || fromTextFn;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
};

const generateWithModel = async (modelName, systemPrompt, userPrompt) => {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userPrompt },
  ]);
  return extractGeneratedCode(result);
};

const generateWithRetryAndFallback = async (systemPrompt, userPrompt) => {
  const modelsToTry = [PRIMARY_MODEL];

  if (FALLBACK_MODEL && FALLBACK_MODEL !== PRIMARY_MODEL) {
    modelsToTry.push(FALLBACK_MODEL);
  }

  let lastError = null;

  for (const modelName of modelsToTry) {
    const maxAttempts = modelName === PRIMARY_MODEL ? 3 : 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        console.log(
          `🤖 Gemini request -> model=${modelName}, attempt=${attempt}/${maxAttempts}`,
        );
        return await generateWithModel(modelName, systemPrompt, userPrompt);
      } catch (error) {
        lastError = error;
        const retryable = isRetryableGeminiError(error);
        const quotaExceeded = isQuotaExceededGeminiError(error);

        if (quotaExceeded) {
          console.warn(
            `⚠️ Model ${modelName} quota exceeded. Trying next model if available.`,
          );
          break;
        }

        if (!retryable) {
          throw error;
        }

        if (attempt < maxAttempts) {
          const backoffMs = 700 * 2 ** (attempt - 1);
          console.warn(
            `⚠️ Gemini transient failure (${modelName}) attempt ${attempt} -> retrying in ${backoffMs}ms`,
          );
          await delay(backoffMs);
          continue;
        }

        console.warn(`⚠️ Model ${modelName} exhausted retries.`);
      }
    }
  }

  throw lastError || new Error("Generation failed after retries and fallback.");
};

// -------------------------------------------------------
// GENERATE UI CODE FROM PROMPT
// POST /api/generate
// -------------------------------------------------------
router.post("/", authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  // Validation
  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    // Call Gemini API to generate code
    console.log("🤖 Calling Gemini API with prompt:", prompt);

    const systemPrompt = `You are an expert web developer. Create a well-structured HTML component based on the user's prompt.

IMPORTANT: Return the code in this EXACT structure:

<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component</title>
  <style>
    /* CSS organized by sections with comments */
    /* =========================== */
    /* Put your CSS here */
    /* =========================== */
  </style>
</head>
<body>
  <!-- HTML Structure -->
  <div class="container">
    <!-- Your HTML content here -->
  </div>
  
  <script>
    // Optional: Add minimal JavaScript if needed
  </script>
</body>
</html>

Requirements:
- Create a complete, valid HTML page
- Organize CSS in the <style> section (NOT inline)
- Use comments to separate sections (HTML, CSS)
- Make it visually stunning with modern design
- Use professional color palettes and layouts
- Ensure responsive design
- Return ONLY the HTML code, no markdown or explanations
- No code blocks (triple backticks)`;

    const userPrompt = `Create a ${prompt}`;

    const generatedCode = await generateWithRetryAndFallback(
      systemPrompt,
      userPrompt,
    );

    // Save to database
    try {
      const dbResult = await pool.query(
        "INSERT INTO generations (user_id, prompt, generated_code) VALUES ($1, $2, $3) RETURNING id, created_at",
        [userId, prompt, generatedCode],
      );

      const generation = dbResult.rows[0];

      return res.status(200).json({
        message: "Code generated successfully.",
        id: generation.id,
        code: generatedCode,
        createdAt: generation.created_at,
      });
    } catch (dbError) {
      console.error("❌ Database save error:", dbError.message);
      // Still return the generated code even if DB save fails
      return res.status(200).json({
        message: "Code generated (DB save failed, but code is valid).",
        code: generatedCode,
      });
    }
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);

    if (
      error.message.includes("API key") ||
      error.message.includes("INVALID_ARGUMENT")
    ) {
      return res
        .status(401)
        .json({ message: "Invalid Gemini API key. Check .env file." });
    }

    if (isQuotaExceededGeminiError(error)) {
      const retryAfterSeconds = extractRetryAfterSeconds(error);
      return res.status(429).json({
        message:
          "Free AI quota expired for now. Please try again later. If Spark helped you, consider sponsoring the developer.",
        ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
      });
    }

    if (isRetryableGeminiError(error)) {
      return res.status(503).json({
        message: "AI model is temporarily busy. Please retry in a few seconds.",
      });
    }

    return res.status(500).json({
      message: "Failed to generate code. Please try again.",
      error: error.message,
    });
  }
});

module.exports = router;
