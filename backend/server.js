const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/auth");
const podcastUploadRoutes = require("./routes/podcastUpload");
const podcastRoutes = require("./routes/podcast");
const channelRoutes = require("./routes/channel");
// Add this to the imports
const adminRoutes = require("./routes/admin");

const fs = require("fs");
dotenv.config();

const app = express();

// More permissive CORS to allow requests from any origin during development
app.use(
  cors({
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Increase JSON payload limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static file serving for uploads with enhanced logging
app.use(
  "/uploads",
  (req, res, next) => {
    console.log(`Static file request: ${req.originalUrl}`);
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Add a route to debug file paths
app.get("/debug-file/:filepath", (req, res) => {
  const filepath = req.params.filepath;
  const fullPath = path.join(__dirname, filepath);

  console.log("Debug file request:", {
    requestedPath: filepath,
    fullPath: fullPath,
    exists: fs.existsSync(fullPath),
  });

  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.status(404).json({
      error: "File not found",
      requestedPath: filepath,
      fullPath: fullPath,
    });
  }
});

// Routes
// Add this to the routes section
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastUploadRoutes);
app.use("/api/general-podcasts", podcastRoutes);
app.use("/api/channel", channelRoutes);

// Root route with more detailed health check
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth/",
      podcasts: "/api/podcasts/",
      generalPodcasts: "/api/general-podcasts/",
      channel: "/api/channel/",
    },
  });
});

// Comprehensive error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? {
            message: err.message,
            stack: err.stack.split("\n").slice(0, 5),
          }
        : {},
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected:", process.env.MONGO_URI);
    // Add this to verify database connection
    const db = mongoose.connection.db;
    console.log("Connected Database Name:", db.databaseName);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    console.error("Please make sure MongoDB is running and accessible");
  });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "podcasts", "audio");
const coversDir = path.join(__dirname, "uploads", "podcasts", "covers");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
