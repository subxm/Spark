const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, (req, res) => {
  res.json({ message: "Generate route coming in Week 2" });
});

module.exports = router;
