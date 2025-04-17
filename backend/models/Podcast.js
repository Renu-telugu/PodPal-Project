const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a podcast title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a podcast description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  audioPath: {
    type: String,
    required: [true, 'Please upload an audio file']
  },
  coverImagePath: {
    type: String,
    default: 'default-podcast-cover.jpg'
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  genre: {
    type: String,
    enum: [
      'Technology', 
      'News', 
      'Comedy', 
      'Education', 
      'Sports', 
      'Health & Wellness', 
      'True Crime', 
      'Business', 
      'Other'
    ],
    default: 'Other'
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for efficient searching
PodcastSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Podcast', PodcastSchema);