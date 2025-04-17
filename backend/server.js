const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/auth");
const podcastUploadRoutes = require("./routes/podcastUpload");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/podcasts", podcastUploadRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Comprehensive error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', {
    message: err.message,
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' 
      ? { 
          message: err.message, 
          stack: err.stack.split('\n').slice(0, 5) 
        } 
      : {}
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'podcasts', 'audio');
const coversDir = path.join(__dirname, 'uploads', 'podcasts', 'covers');

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
});
