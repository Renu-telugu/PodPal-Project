const express = require("express");
const multer = require("multer");
const path = require("path");
const Podcast = require("../models/Podcast");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose"); // Added mongoose import

const router = express.Router();

// Configure multer for file uploads with more robust handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";
    if (file.fieldname === "audioFile") {
      uploadPath = path.join(__dirname, "..", "uploads", "podcasts", "audio");
    } else if (file.fieldname === "coverImage") {
      uploadPath = path.join(__dirname, "..", "uploads", "podcasts", "covers");
    }

    // Ensure directory exists
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      console.error("Error creating upload directory:", err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2, // Limit to 2 files (audio and cover)
  },
  fileFilter: (req, file, cb) => {
    const allowedAudioTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    try {
      if (
        file.fieldname === "audioFile" &&
        allowedAudioTypes.includes(file.mimetype)
      ) {
        cb(null, true);
      } else if (
        file.fieldname === "coverImage" &&
        allowedImageTypes.includes(file.mimetype)
      ) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`), false);
      }
    } catch (err) {
      cb(err, false);
    }
  },
});

// Inline authentication middleware with detailed logging
const authenticateToken = async (req, res, next) => {
  console.log("Request Headers:", JSON.stringify(req.headers, null, 2));

  const authHeader = req.headers["authorization"];
  console.log("Raw Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("No token found in Authorization header");
    return res.status(401).json({
      message: "No token provided",
      details: "Include a valid JWT token in the Authorization header",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure .env has JWT_SECRET
    const userId = decoded.id;

    console.log("Decoded JWT:", decoded);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        details: "Extracted user ID from token is not a valid MongoDB ObjectId",
        receivedId: userId,
      });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      console.error("User not found for decoded ID", { userId });
      return res.status(401).json({
        message: "User not found",
        details: "No user exists with the ID from the token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification or DB error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    if (
      error.name === "CastError" ||
      error.name === "BSONTypeError" ||
      error.name === "TypeError"
    ) {
      return res.status(400).json({
        message: "Invalid user ID format",
        details: "The provided user ID is not in a valid format",
      });
    }

    return res.status(403).json({
      message: "Authentication failed",
      details: error.message,
    });
  }
};

// Podcast upload route with authentication
router.post(
  "/upload",
  authenticateToken,
  upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Request Body:", req.body);
      console.log("Request Files:", req.files);
      console.log("Authenticated User:", req.user);

      const { audioFile, coverImage } = req.files || {};
      const {
        title,
        description,
        genre,
        language,
        explicit,
        tags,
        publishDate,
      } = req.body;

      if (!audioFile || !coverImage) {
        return res
          .status(400)
          .json({ message: "Both audio file and cover image are required" });
      }

      const podcastData = {
        title,
        description,
        genre: genre || "Other",
        audioPath: audioFile[0].path,
        coverImagePath: coverImage[0].path,
        creator: req.user._id,
        creatorDetails: {
          name: req.user.name,
          profilePicture: req.user.profilePicture || "default-profile.jpg",
        },
        language: language || "English",
        explicit: explicit === "true" || explicit === true,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      };

      const newPodcast = new Podcast(podcastData);
      await newPodcast.save();

      res.status(201).json({
        message: "Podcast uploaded successfully",
        podcast: newPodcast,
      });
    } catch (error) {
      console.error("Error uploading podcast:", error.message);
      res
        .status(500)
        .json({ message: "Error uploading podcast", error: error.message });
    }
  }
);

// Error handling middleware specific to this router
router.use((err, req, res, next) => {
  console.error("Multer/Route error:", {
    message: err.message,
    name: err.name,
    stack: err.stack,
  });

  // Remove any uploaded files in case of an error
  if (req.files) {
    Object.values(req.files).forEach((fileGroup) => {
      fileGroup.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      });
    });
  }

  res.status(400).json({
    success: false,
    message: err.message || "Upload failed",
    error:
      process.env.NODE_ENV === "development"
        ? {
            message: err.message,
            name: err.name,
          }
        : {},
  });
});

module.exports = router;
