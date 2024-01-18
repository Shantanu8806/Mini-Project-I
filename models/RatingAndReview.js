const mongoose = require('mongoose');

const parkingSpaceRatingReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ParkingSpaceRatingReview = mongoose.model('ParkingSpaceRatingReview', parkingSpaceRatingReviewSchema);

module.exports = ParkingSpaceRatingReview;
