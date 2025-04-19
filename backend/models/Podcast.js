const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a podcast title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a podcast description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    audioPath: {
      type: String,
      required: [true, "Please upload an audio file"],
    },
    coverImagePath: {
      type: String,
      default: "default-podcast-cover.jpg",
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Podcast must have a creator"],
    },
    creatorDetails: {
      name: {
        type: String,
        required: [true, "Creator name is required"],
      },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    lastUpdatedDetails: {
      name: String,
      username: String,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    genre: {
      type: String,
      enum: [
        "Art",
        "Business",
        "Comedy",
        "Education",
        "Fiction",
        "Government",
        "Health & Fitness",
        "Health & Wellness",
        "History",
        "Kids & Family",
        "Leisure",
        "Music",
        "Nature",
        "News",
        "Religion & Spirituality",
        "Science",
        "Society & Culture",
        "Sports",
        "Technology",
        "True Crime",
        "TV & Film",
        "Other"
      ],
      default: "Other",
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    language: {
      type: String,
      default: "English",
    },
    explicit: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  }
);

// Create index for efficient searching
PodcastSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Podcast", PodcastSchema);
