const express = require("express");
const Podcast = require("../models/Podcast");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();
router.get("/", authenticateToken, async (req, res) => {
  try {
    const podcasts = await Podcast.find().populate("creatorDetails", "name");
    res.status(200).json({ podcasts });
  } catch (error) {
    console.error("Error fetching podcasts:", error.message);
    res.status(500).json({ message: "Error fetching podcasts" });
  }
});

// Route to fetch podcast details by ID
router.get("/:podcastId", authenticateToken, async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.podcastId,
      { $inc: { views: 1 } }, // Increment views
      { new: true }
    );

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    res.status(200).json(podcast);
  } catch (error) {
    console.error("Error fetching podcast details:", error.message);
    res.status(500).json({
      message: "Error fetching podcast details",
      error: error.message,
    });
  }
});

router.post("/:podcastId/like", authenticateToken, async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.podcastId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    res.status(200).json({ success: true, podcast });
  } catch (error) {
    console.error("Error liking podcast:", error.message);
    res.status(500).json({ message: "Error liking podcast" });
  }
});

// Save a podcast to the user's saved podcasts
router.post("/:podcastId/save", authenticateToken, async (req, res) => {
  try {
    const user = req.user; // Assuming `req.user` contains the authenticated user
    const podcastId = req.params.podcastId;

    // Add the podcast to the user's saved podcasts
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { savedPodcasts: podcastId }, // Prevent duplicates
    });

    res
      .status(200)
      .json({ success: true, message: "Podcast saved successfully" });
  } catch (error) {
    console.error("Error saving podcast:", error.message);
    res.status(500).json({ message: "Error saving podcast" });
  }
});
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's ID
    const podcasts = await Podcast.find({ creator: userId });
    res.status(200).json({ success: true, podcasts });
  } catch (error) {
    console.error("Error fetching user's podcasts:", error.message);
    res.status(500).json({ message: "Error fetching user's podcasts" });
  }
});
module.exports = router;
