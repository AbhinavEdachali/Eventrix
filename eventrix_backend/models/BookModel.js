const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  // Reference to the user who made the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // User email
  email: {
    type: String,
    required: true,
  },

  // Array of products booked (with product image, no quantity)
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      product_image: { type: String },
    },
  ],

  // Optional: Vendor reference (if enabled for products/cars)
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: false,
  },

  // Optional: Outlet reference (if enabled for products)
  outlet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outlet",
    required: false,
  },

  // Booking date and time
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Status of the booking
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  // Additional notes or instructions
  notes: {
    type: String,
  },

  // Timestamps for creation and update
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Payment method
  paymentMethod: {
    type: String,
    enum: ["cod", "card"],
    required: true,
  },

  // Card payment details (only if paymentMethod is "card")
  cardDetails: {
    cardNumber: { type: String },
    cardName: { type: String },
    cardExpiry: { type: String }, // MM/YYYY or MM/YY
    cardCVV: { type: String },
  },
});

// Update updatedAt on save
bookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Book", bookSchema);