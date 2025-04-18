const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  uploads: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Podcast",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Podcast",
    },
  ],
  subscribers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "Welcome to my channel!",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Channel", ChannelSchema);
