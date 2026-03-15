const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

// -------------------------------------------------------
// REGISTER
// POST /api/auth/register
// -------------------------------------------------------
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  try {
    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// -------------------------------------------------------
// LOGIN
// POST /api/auth/login
// -------------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { register, login };
