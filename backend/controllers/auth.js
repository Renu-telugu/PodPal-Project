const User = require("../models/User");
const Channel = require("../models/Channel"); // Import the Channel model
const mongoose = require("mongoose");

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Improved validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide name, email and password" 
      });
    }
    
    // Email format validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a valid email address" 
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }
    
    const passwordRegex = {
      hasUppercase: /[A-Z]/,
      hasLowercase: /[a-z]/,
      hasNumber: /[0-9]/,
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
    };
    
    const passwordChecks = {
      uppercase: passwordRegex.hasUppercase.test(password),
      lowercase: passwordRegex.hasLowercase.test(password),
      number: passwordRegex.hasNumber.test(password),
      special: passwordRegex.hasSpecial.test(password)
    };
    
    if (!passwordChecks.uppercase || !passwordChecks.lowercase || 
        !passwordChecks.number || !passwordChecks.special) {
      return res.status(400).json({
        success: false,
        message: "Password must include uppercase, lowercase, number and special character",
        passwordRequirements: passwordChecks
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the user
      const user = await User.create([{ 
        name, 
        email, 
        password, 
        role: "user" 
      }], { session });
      
      if (!user || user.length === 0) {
        throw new Error("Failed to create user");
      }
      
      const newUser = user[0];
      
      // Create a channel for the user
      const channelName = `${newUser.name}'s Channel`;
      const channel = await Channel.create([{
        user: newUser._id,
        name: channelName,
        description: `Welcome to ${newUser.name}'s podcast channel!`
      }], { session });
      
      if (!channel || channel.length === 0) {
        throw new Error("Failed to create channel");
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      // Generate JWT token
      const token = newUser.getSignedJwtToken();
      
      // Return success response
      res.status(201).json({
        success: true,
        message: "Registration successful! Your channel has been created.",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          channelName
        },
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user by email or username
    const user = await User.findOne({
      $or: [
        { email: email },
        { name: email }  // This allows login with username (stored in name field)
      ]
    }).select("+password");
    
    if (!user) {
      console.log(`Login failed: No user found with email/username: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Get user's channel
    const channel = await Channel.findOne({ user: user._id });
    const channelName = channel ? channel.name : null;

    // Create token
    const token = user.getSignedJwtToken();
    
    console.log(`Login successful for user: ${user.name} (${user.email})`);
    
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        channelName
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get password requirements
// @route   GET /api/auth/password-requirements
// @access  Public
exports.getPasswordRequirements = (req, res) => {
  res.status(200).json({
    success: true,
    requirements: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true
    }
  });
};
