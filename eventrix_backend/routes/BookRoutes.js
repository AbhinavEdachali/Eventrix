const express = require("express");
const router = express.Router();

const {
  addBook,
  bookUpload,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/BookController");

// Add a new booking (accepts multiple product images)
router.post(
  "/book/add",
  bookUpload.fields([{ name: "product_images", maxCount: 10 }]),
  addBook
);

// Get all bookings
router.get("/book/all-books", getAllBooks);

// Get a single booking by ID
router.get("/book/book/:id", getBookById);

// Update a booking by ID (accepts multiple product images)
router.put(
  "/book/update-book/:id",
  bookUpload.fields([{ name: "product_images", maxCount: 10 }]),
  updateBook
);

// Delete a booking by ID
router.delete("/book/delete-book/:id", deleteBook);

// Add this route to fetch bookings for a specific user
const Book = require("../models/BookModel");
router.get("/book/user/:userId", async (req, res) => {
  try {
    const bookings = await Book.find({ user: req.params.userId })
      .populate("products.product")
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;