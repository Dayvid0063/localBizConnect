const Review = require("../models/Reviews");
const User = require("../models/User");

const createReview = async (req, res) => {
  try {
    const { userId, businessName, businessAddress, rating, comment } = req.body;

    // Find the user based on the provided userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the review associated with the user
    const review = new Review({
      user: userId,
      businessName,
      businessAddress,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get reviews for a user
const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId }).populate(
      "user",
      "username"
    );
    res.json(reviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    // Find the review by its ID
    const review = await Review.findById(reviewId);

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    await review.remove();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createReview,
  getReviewsForUser,
  deleteReview,
};
