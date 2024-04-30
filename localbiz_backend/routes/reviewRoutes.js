const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a review
router.post("/", reviewController.createReview);

// Get reviews by user ID
router.get("/user/:userId", reviewController.getReviewsForUser);

// Delete a review
router.delete("/:reviewId", reviewController.deleteReview);

module.exports = router;
