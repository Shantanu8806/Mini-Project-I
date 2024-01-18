const ParkingSpace = require('../models/parkingSpace');
const RatingAndReview = require('../models/RatingAndReview');
const User = require('../models/user');

// Controller function for users to give ratings and reviews for a parking space
const rateAndReviewParkingSpace = async (req, res) => {
  try {
    const { userId, parkingSpaceId, rating, review } = req.body;

    // Check if the user and parking space exist
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);

    if (!parkingSpace) {
      return res.status(404).json({ error: 'Parking space not found' });
    }

    // Check if the user has already rated and reviewed this parking space
    const existingRatingAndReview = await RatingAndReview.findOne({
      user: userId,
      parkingSpace: parkingSpaceId,
    });

    if (existingRatingAndReview) {
      return res.status(409).json({ error: 'You have already rated and reviewed this parking space' });
    }

    // Create a new rating and review
    const newRatingAndReview = new RatingAndReview({
      user: userId,
      parkingSpace: parkingSpaceId,
      rating,
      review,
    });

    // Save the rating and review to the database
    await newRatingAndReview.save();

    // Update the average rating of the parking space
    const allRatingsAndReviews = await RatingAndReview.find({ parkingSpace: parkingSpaceId });
    const totalRating = allRatingsAndReviews.reduce((sum, ratingAndReview) => sum + ratingAndReview.rating, 0);
    const averageRating = totalRating / allRatingsAndReviews.length;

    parkingSpace.averageRating = averageRating;
    await parkingSpace.save();

    res.status(201).json({ message: 'Rating and review added successfully', ratingAndReview: newRatingAndReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { rateAndReviewParkingSpace };
