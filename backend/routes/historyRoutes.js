const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/history - Fetch all generations for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, prompt, generated_code, is_favourite, created_at FROM generations WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error fetching history:", error.message);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

// DELETE /api/history/:id - Delete a specific generation
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM generations WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Generation not found or unauthorized" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Database error deleting history:", error.message);
    res.status(500).json({ message: "Failed to delete history" });
  }
});

// PATCH /api/history/:id/favourite - Toggle favourite status
router.patch("/:id/favourite", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE generations SET is_favourite = NOT is_favourite WHERE id = $1 AND user_id = $2 RETURNING is_favourite",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Generation not found or unauthorized" });
    }

    res.status(200).json({
      message: "Favourite status updated",
      is_favourite: result.rows[0].is_favourite,
    });
  } catch (error) {
    console.error("Database error updating favourite:", error.message);
    res.status(500).json({ message: "Failed to update favourite status" });
  }
});

module.exports = router;
