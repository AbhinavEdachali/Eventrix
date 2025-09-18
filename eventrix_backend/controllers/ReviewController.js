const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Review = require("../models/ReviewModel");
const User = require("../models/UserModel"); // Import User model

// Multer setup for review photos
const reviewStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/review_photos";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const reviewUpload = multer({
    storage: reviewStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array("photos", 5); // Allow up to 5 photos

// Add Review
const addReview = async (req, res) => {
    try {
        const { userId, rating, reviewContent, productName, productId, adminResponse } = req.body;

        // Debugging log
        console.log("User ID from request:", userId);

        // Fetch the username from the User model using userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const username = user.name;

        const photos = req.files ? req.files.map((file) => file.path) : []; // Save multiple photo paths

        const newReview = new Review({
            username,
            userId,
            rating,
            reviewContent,
            photos,
            productName,
            productId,
            adminResponse,
        });

        const savedReview = await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: savedReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};

// Get All Reviews
const getAllReviews = async (req, res) => {
    try {
        const { productId } = req.query; // Get productId from query params
        const filter = productId ? { productId } : {}; // Filter by productId if provided
        const reviews = await Review.find(filter).populate("userId").populate("productId");
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

// Update Review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params; // Get review ID from route params
        const { rating, reviewContent, adminResponse } = req.body;

        const updatedData = {
            ...(rating && { rating }), // Update rating if provided
            ...(reviewContent && { reviewContent }), // Update review content if provided
            ...(adminResponse && { adminResponse }), // Update admin response if provided
        };

        if (req.files && req.files.length > 0) {
            updatedData.photos = req.files.map((file) => file.path); // Update photos if new ones are uploaded
        }

        const updatedReview = await Review.findByIdAndUpdate(reviewId, updatedData, { new: true }); // Update review by ID
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated successfully", review: updatedReview });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Failed to update review", error: error.message });
    }
};

// Delete Review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Delete photo file if it exists
        if (deletedReview.photo && fs.existsSync(deletedReview.photo)) {
            fs.unlinkSync(deletedReview.photo);
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
};

module.exports = {
    addReview,
    getAllReviews,
    updateReview,
    deleteReview,
    reviewUpload,
};
