const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const generateRoutes = require("./routes/generateRoutes");
const historyRoutes = require("./routes/historyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "⚡ Spark API is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Spark backend running on port ${PORT}`);
});
