const express = require("express");
const Channel = require("../models/Channel");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findOne({ user: req.params.userId })
      .populate("uploads")
      .populate("likes")
      .populate("subscribers", "name email");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching channel details",
      error: error.message,
    });
  }
});
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findOne({ user: req.user._id })
      .populate("uploads")
      .populate("likes")
      .populate("subscribers", "name email");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching channel details",
      error: error.message,
    });
  }
});

module.exports = router;
