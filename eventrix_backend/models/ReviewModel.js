const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    reviewContent: {
        type: String,
        required: true,
    },
    photos: [
        {
            type: String, // Array of URLs or file paths for uploaded photos
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    adminResponse: {
        type: String,
    },
    productName: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});

module.exports = mongoose.model('Review', ReviewSchema);
