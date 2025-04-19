const express = require('express');
const { signup, login, getPasswordRequirements } = require('../controllers/auth');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get password requirements
router.get('/password-requirements', getPasswordRequirements);

// Debug endpoint to check MongoDB connection
router.get('/debug', async (req, res) => {
  try {
    // Check MongoDB connection
    const connectionState = mongoose.connection.readyState;
    const stateNames = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Get database information
    const dbInfo = {
      state: stateNames[connectionState] || 'unknown',
      name: mongoose.connection.name || 'none',
      host: mongoose.connection.host || 'none',
      port: mongoose.connection.port || 'none',
      user: process.env.DB_USER || 'unknown',
      connected: connectionState === 1
    };
    
    // Try to count users as additional connection test
    const userCount = await User.countDocuments();
    
    // Return debug information
    return res.status(200).json({
      success: true,
      database: dbInfo,
      server: process.env.NODE_ENV || 'development',
      userCount: userCount,
      timestamp: new Date().toISOString(),
      usersExist: userCount > 0
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'MongoDB connection error',
      error: error.message
    });
  }
});

module.exports = router; 