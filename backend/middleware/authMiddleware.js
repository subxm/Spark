const jwt = require("jsonwebtoken");
require("dotenv").config();

// Runs on every protected route
// Checks if a valid JWT token exists in the Authorization header
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Token must be sent as: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided. Access denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
