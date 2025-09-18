const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Book = require("../models/BookModel");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Vendor = require("../models/VendorModel");
const Outlet = require("../models/OutletModel");

// Multer setup for product images in booking
const bookStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/book_product_images";
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
const bookUpload = multer({ storage: bookStorage });

// Add a new booking
const addBook = async (req, res) => {
  try {
    const {
      user,
      products,
      vendor,
      outlet,
      bookingDate,
      status,
      notes,
      email,
      paymentMethod,
      cardNumber,
      cardName,
      cardExpiry,
      cardCVV,
    } = req.body;

    // Parse products if it is a string
    let parsedProducts = [];
    if (typeof products === "string") {
      parsedProducts = JSON.parse(products);
    } else if (Array.isArray(products)) {
      parsedProducts = products;
    } else if (typeof products === "object" && products) {
      parsedProducts = [products];
    }

    // Attach uploaded images to products if any
    if (req.files && req.files.product_images) {
      req.files.product_images.forEach((file, idx) => {
        if (parsedProducts[idx]) {
          parsedProducts[idx].product_image = file.path;
        }
      });
    }

    // Validate user
    const userDoc = await User.findById(user);
    if (!userDoc) return res.status(400).json({ message: "Invalid user" });

    // Validate products
    for (const prod of parsedProducts) {
      if (prod.product) {
        const prodDoc = await Product.findById(prod.product);
        if (!prodDoc) return res.status(400).json({ message: `Invalid product: ${prod.product}` });
      }
    }

    // Optional: Validate vendor and outlet
    if (vendor) {
      const vendorDoc = await Vendor.findById(vendor);
      if (!vendorDoc) return res.status(400).json({ message: "Invalid vendor" });
    }
    if (outlet) {
      const outletDoc = await Outlet.findById(outlet);
      if (!outletDoc) return res.status(400).json({ message: "Invalid outlet" });
    }

    // Prepare cardDetails if paymentMethod is card
    let cardDetails = undefined;
    if (paymentMethod === "card") {
      cardDetails = {
        cardNumber,
        cardName,
        cardExpiry,
        cardCVV,
      };
    }

    const newBook = new Book({
      user,
      email,
      products: parsedProducts,
      vendor: vendor || undefined,
      outlet: outlet || undefined,
      bookingDate: bookingDate ? new Date(bookingDate) : undefined,
      status,
      notes,
      paymentMethod,
      cardDetails,
    });

    const savedBook = await newBook.save();
    res.status(201).json({ message: "Booking created successfully", book: savedBook });
  } catch (error) {
    console.error("Error adding booking:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// Fetch all bookings
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate("user")
      .populate("products.product")
      .populate("vendor")
      .populate("outlet");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Fetch single booking by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id)
      .populate("user")
      .populate("products.product")
      .populate("vendor")
      .populate("outlet");
    if (!book) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
};

// Update booking by ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // If products is a stringified array, parse it
    if (typeof updateFields.products === "string") {
      updateFields.products = JSON.parse(updateFields.products);
    }

    // Attach uploaded images to products if any
    if (req.files && req.files.product_images && updateFields.products) {
      req.files.product_images.forEach((file, idx) => {
        if (updateFields.products[idx]) {
          updateFields.products[idx].product_image = file.path;
        }
      });
    }

    updateFields.updatedAt = Date.now();

    const updatedBook = await Book.findByIdAndUpdate(id, updateFields, { new: true })
      .populate("user")
      .populate("products.product")
      .populate("vendor")
      .populate("outlet");

    if (!updatedBook) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

// Delete booking by ID
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) return res.status(404).json({ message: "Booking not found" });

    // Optionally, remove product images from disk
    if (deletedBook.products && deletedBook.products.length > 0) {
      deletedBook.products.forEach((prod) => {
        if (prod.product_image && fs.existsSync(prod.product_image)) {
          fs.unlinkSync(prod.product_image);
        }
      });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking", error: error.message });
  }
};

module.exports = {
  addBook,
  bookUpload,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};