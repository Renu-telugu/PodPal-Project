const express = require('express');
const multer = require('multer');
const path = require('path');
const Podcast = require('../models/Podcast');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads with more robust handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';
    if (file.fieldname === 'audioFile') {
      uploadPath = path.join(__dirname, '..', 'uploads', 'podcasts', 'audio');
    } else if (file.fieldname === 'coverImage') {
      uploadPath = path.join(__dirname, '..', 'uploads', 'podcasts', 'covers');
    }
    
    // Ensure directory exists
    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      console.error('Error creating upload directory:', err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2 // Limit to 2 files (audio and cover)
  },
  fileFilter: (req, file, cb) => {
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    try {
      if (file.fieldname === 'audioFile' && allowedAudioTypes.includes(file.mimetype)) {
        cb(null, true);
      } else if (file.fieldname === 'coverImage' && allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${
          file.fieldname === 'audioFile' 
            ? allowedAudioTypes.join(', ') 
            : allowedImageTypes.join(', ')
        }`), false);
      }
    } catch (err) {
      console.error('File filter error:', err);
      cb(err, false);
    }
  }
});

router.post('/upload', 
  upload.fields([
    { name: 'audioFile', maxCount: 1 }, 
    { name: 'coverImage', maxCount: 1 }
  ]), 
  async (req, res) => {
    console.log('Upload request received:', {
      body: req.body,
      files: req.files ? Object.keys(req.files) : 'No files'
    });

    try {
      // Basic validation
      const { title, description, genre } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      // Check if files were uploaded
      if (!req.files || !req.files['audioFile'] || !req.files['coverImage']) {
        return res.status(400).json({
          success: false,
          message: 'Both audio file and cover image are required',
          files: req.files ? Object.keys(req.files) : 'No files received'
        });
      }

      const audioFile = req.files['audioFile'][0];
      const coverImage = req.files['coverImage'][0];

      console.log('File details:', {
        audioFile: audioFile.path,
        coverImage: coverImage.path
      });

      const podcast = new Podcast({
        title,
        description,
        genre: genre || 'Other',
        audioPath: audioFile.path,
        coverImagePath: coverImage.path,
        // Optional: If you have authentication, replace null with actual user ID
        creator: null, 
        duration: 0 // You'd calculate this using audio metadata library
      });

      await podcast.save();

      res.status(201).json({
        success: true,
        message: 'Podcast uploaded successfully',
        data: {
          id: podcast._id,
          title: podcast.title
        }
      });
    } catch (error) {
      // Log the full error for debugging
      console.error('Upload error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        validationErrors: error.errors // Mongoose validation errors
      });

      // If save fails, remove uploaded files
      if (req.files) {
        Object.values(req.files).forEach(fileGroup => {
          fileGroup.forEach(file => {
            try {
              fs.unlinkSync(file.path);
            } catch (unlinkError) {
              console.error('Error deleting file:', unlinkError);
            }
          });
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload podcast',
        error: process.env.NODE_ENV === 'development' 
          ? { 
              message: error.message, 
              name: error.name,
              validationErrors: error.errors // Include validation errors
            } 
          : 'Internal server error'
      });
    }
  }
);

// Error handling middleware specific to this router
router.use((err, req, res, next) => {
  console.error('Multer/Route error:', {
    message: err.message,
    name: err.name,
    stack: err.stack
  });
  
  // Remove any uploaded files in case of an error
  if (req.files) {
    Object.values(req.files).forEach(fileGroup => {
      fileGroup.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    });
  }

  res.status(400).json({
    success: false,
    message: err.message || 'Upload failed',
    error: process.env.NODE_ENV === 'development' 
      ? { 
          message: err.message, 
          name: err.name 
        } 
      : {}
  });
});

module.exports = router;