const express = require("express");
const router = express.Router();
const { register, login, googleLogin, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/google
router.post("/google", googleLogin);

// PUT /api/auth/profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
