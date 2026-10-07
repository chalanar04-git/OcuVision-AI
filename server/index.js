const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database Test Route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "PostgreSQL is connected",
      time: result.rows[0].now
    });

  } catch (error) {
    console.error(
      "Database error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Backend Test Route
app.get("/", (req, res) => {
  res.send("OcuVision AI Backend is Running 🚀");
});

// Authentication Routes
app.use(
  "/api/auth",
  authRoutes
);

// Prediction Routes
app.use(
  "/api/predictions",
  predictionRoutes
);

// PDF Report Routes
app.use(
  "/api/reports",
  reportRoutes
);

// Start Server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} 🚀`
  );
});