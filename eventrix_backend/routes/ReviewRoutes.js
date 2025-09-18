const express = require("express");
const router = express.Router();
const {
    addReview,
    getAllReviews,
    updateReview,
    deleteReview,
    reviewUpload,
} = require("../controllers/ReviewController");

// Add a new review (with multiple photo uploads)
router.post("/add", reviewUpload, addReview);

// Get all reviews
router.get("/allreviews", getAllReviews);

// Update a review (with multiple photo uploads)
router.put("/update/:reviewId", reviewUpload, updateReview); // Ensure this route is correctly configured

// Delete a review
router.delete("/delete/:reviewId", deleteReview);

module.exports = router;
