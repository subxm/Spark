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

    const systemPrompt = `You are an expert web developer. Create a beautiful, modern HTML/JSX component based on this user prompt.

Requirements:
- Generate ONLY valid HTML or JSX code
- Use inline styles (no external CSS)
- Make it visually appealing with modern design
- Use a nice color palette or gradients
- Ensure it's self-contained and works standalone
- Return ONLY the code, no explanations or markdown
- No code blocks (triple backticks), just raw HTML/JSX

Start with <div or <section and close properly.`;

    const userPrompt = `Create based on: "${prompt}"`;

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
