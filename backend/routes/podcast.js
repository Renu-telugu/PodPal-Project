const express = require("express");
const Podcast = require("../models/Podcast");
const User = require("../models/User");
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
router.get("/liked", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const likedPodcasts = await Podcast.find({ likes: userId })
      .populate('creatorDetails', 'name');
    
    console.log('User liked podcasts:', likedPodcasts);
    res.status(200).json({ podcasts: likedPodcasts });
  } catch (error) {
    console.error("Error fetching liked podcasts:", error.message);
    res.status(500).json({ message: "Error fetching liked podcasts" });
  }
});
router.get("/saved", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'savedPodcasts',
      populate: {
        path: 'creatorDetails',
        select: 'name'
      }
    });
    
    console.log('User saved podcasts:', user.savedPodcasts);
    res.status(200).json({ podcasts: user.savedPodcasts || [] });
  } catch (error) {
    console.error("Error fetching saved podcasts:", error.message);
    res.status(500).json({ message: "Error fetching saved podcasts" });
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

// router.post("/:podcastId/like", authenticateToken, async (req, res) => {
//   try {
//     const podcast = await Podcast.findByIdAndUpdate(
//       req.params.podcastId,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );

//     if (!podcast) {
//       return res.status(404).json({ message: "Podcast not found" });
//     }

//     res.status(200).json({ success: true, podcast });
//   } catch (error) {
//     console.error("Error liking podcast:", error.message);
//     res.status(500).json({ message: "Error liking podcast" });
//   }
// });

// Save a podcast to the user's saved podcasts
router.post("/:podcastId/like", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID
    const podcast = await Podcast.findById(req.params.podcastId);

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Initialize likes array if it doesn't exist
    if (!podcast.likes) {
      podcast.likes = [];
    }

    // Check if the user has already liked the podcast
    const alreadyLiked = podcast.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike the podcast
      podcast.likes = podcast.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like the podcast
      podcast.likes.push(userId);
    }

    await podcast.save();

    res.status(200).json({
      success: true,
      podcast,
      liked: !alreadyLiked,
      userId: userId
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ 
      message: "Error toggling like", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
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

// Get recently played podcasts
router.get("/recently-played", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate({
        path: 'recentlyPlayed',
        populate: {
          path: 'creatorDetails',
          select: 'name'
        }
      })
      .select('recentlyPlayed');
    
    console.log('Recently played podcasts:', user.recentlyPlayed);
    res.status(200).json({ podcasts: user.recentlyPlayed || [] });
  } catch (error) {
    console.error("Error fetching recently played podcasts:", error.message);
    res.status(500).json({ message: "Error fetching recently played podcasts" });
  }
});

// Route to increment listeners count when podcast is played
router.post("/:podcastId/increment-listeners", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const podcastId = req.params.podcastId;

    // Update podcast listeners count
    const podcast = await Podcast.findByIdAndUpdate(
      podcastId,
      { $inc: { listeners: 1 } },
      { new: true }
    );

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Add to user's recently played list
    await User.findByIdAndUpdate(
      userId,
      { 
        $pull: { recentlyPlayed: podcastId },  // Remove if exists
        $push: { recentlyPlayed: { $each: [podcastId], $position: 0, $slice: 10 } }  // Add to start, keep last 10
      }
    );

    res.status(200).json({ 
      success: true, 
      listeners: podcast.listeners 
    });
  } catch (error) {
    console.error("Error incrementing listeners:", error);
    res.status(500).json({ 
      message: "Error incrementing listeners count",
      error: error.message 
    });
  }
});

module.exports = router;
