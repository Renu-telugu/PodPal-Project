const express = require('express');
const { signup, login } = require('../controllers/auth');

const router = express.Router();

// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

module.exports = router; 