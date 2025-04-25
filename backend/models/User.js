const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: function() {
      // Only require password for regular users, not for mock or emergency users
      return !this.mockId;
    },
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  podcasts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Podcast"
  }],
  savedPodcasts: [{
    type: mongoose.Schema.ObjectId,
    ref: "Podcast"
  }],
  recentlyPlayed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast'
  }],
  // Add mockId for frontend mock users
  mockId: {
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness if the field exists
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  console.log("Pre-save hook called:", {
    email: this.email,
    isModified: this.isModified("password"),
    hasMockId: !!this.mockId
  });

  // If mockId exists, we don't need to hash the password
  if (this.mockId) {
    console.log("Skipping password hashing for mock user:", this.mockId);
    return next();
  }

  if (!this.isModified("password")) {
    return next();
  }

  // Only hash the password if it exists
  if (!this.password) {
    console.log("No password to hash");
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully for:", this.email);
    next();
  } catch (error) {
    console.error("Password hashing error:", error);
    next(error);
  }
});

// Add a method to log all users (for debugging)
UserSchema.statics.logAllUsers = async function () {
  try {
    const users = await this.find({});
    console.log("All Users:", users);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
