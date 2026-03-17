const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../config/db");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt },
    ]);

    const generatedCode = result.response.candidates[0].content.parts[0].text;

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

    if (error.message.includes("RESOURCE_EXHAUSTED")) {
      return res
        .status(429)
        .json({ message: "API quota exceeded. Try again later." });
    }

    return res.status(500).json({
      message: "Failed to generate code. Please try again.",
      error: error.message,
    });
  }
});

module.exports = router;
