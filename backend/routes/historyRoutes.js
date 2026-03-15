const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "History route coming in Week 4" });
});

module.exports = router;
