const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});


// =====================================================
// CREATE PREDICTION
// =====================================================

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided"
        });
      }

      const formData = new FormData();

      formData.append(
        "file",
        req.file.buffer,
        {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        }
      );

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders()
          },
          maxBodyLength: Infinity
        }
      );

      const prediction =
        response.data.prediction;

      const confidence =
        response.data.confidence;

      const gradcamImage =
        response.data.gradcam_image;

      const result = await pool.query(
        `INSERT INTO predictions
          (user_id, image_path, prediction, confidence)
         VALUES
          ($1, $2, $3, $4)
         RETURNING
          id,
          user_id,
          image_path,
          prediction,
          confidence,
          created_at`,
        [
          req.user.id,
          req.file.originalname,
          prediction,
          confidence
        ]
      );

      const savedPrediction =
        result.rows[0];

      res.json({
        success: true,
        id: savedPrediction.id,
        user_id: savedPrediction.user_id,
        filename: response.data.filename,
        prediction:
          savedPrediction.prediction,
        confidence:
          Number(savedPrediction.confidence),
        gradcam_image:
          gradcamImage,
        created_at:
          savedPrediction.created_at
      });

    } catch (error) {
      console.error(
        "Prediction error:",
        error.response?.data ||
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Prediction failed",
        error:
          error.response?.data?.detail ||
          error.message
      });
    }
  }
);


// =====================================================
// PATIENT PREDICTION HISTORY
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          user_id,
          image_path,
          prediction,
          confidence,
          created_at
         FROM predictions
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id]
      );

      res.json({
        success: true,
        predictions:
          result.rows
      });

    } catch (error) {
      console.error(
        "History error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to retrieve prediction history"
      });
    }
  }
);


// =====================================================
// DOCTOR DASHBOARD
// =====================================================

router.get(
  "/doctor",
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== "doctor") {
        return res.status(403).json({
          success: false,
          message: "Doctor access required"
        });
      }

      const result = await pool.query(
        `SELECT
          predictions.id,
          predictions.user_id,
          users.name AS patient_name,
          users.email AS patient_email,
          predictions.image_path,
          predictions.prediction,
          predictions.confidence,
          predictions.created_at
         FROM predictions
         INNER JOIN users
           ON predictions.user_id = users.id
         ORDER BY predictions.created_at DESC`
      );

      res.json({
        success: true,
        predictions:
          result.rows
      });

    } catch (error) {
      console.error(
        "Doctor prediction error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to retrieve doctor prediction data"
      });
    }
  }
);


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/admin",
  authMiddleware,
  async (req, res) => {
    try {

      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required"
        });
      }

      const result = await pool.query(
        `SELECT
          predictions.id,
          predictions.user_id,
          users.name AS patient_name,
          users.email AS patient_email,
          predictions.image_path,
          predictions.prediction,
          predictions.confidence,
          predictions.created_at
         FROM predictions
         INNER JOIN users
           ON predictions.user_id = users.id
         ORDER BY predictions.created_at DESC`
      );

      res.json({
        success: true,
        predictions:
          result.rows
      });

    } catch (error) {
      console.error(
        "Admin prediction error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to retrieve admin prediction data"
      });
    }
  }
);


module.exports = router;