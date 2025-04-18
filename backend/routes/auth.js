const express = require('express');
const { signup, login, getPasswordRequirements } = require('../controllers/auth');

const router = express.Router();

// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get password requirements
router.get('/password-requirements', getPasswordRequirements);

module.exports = router; 