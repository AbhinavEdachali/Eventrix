const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    functionDate: {
      type: Date,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: false, // Make optional
    },
    vendorName: {
      type: String,
      required: false, // Make optional
    },
    vendorEmail: {
      type: String,
      required: false, // Make optional
      trim: true,
      lowercase: true,
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: false, // Make optional
    },
    outletName: {
      type: String,
      required: false, // Make optional
    },
    outletEmail: {
      type: String,
      required: false, // Make optional
      trim: true,
      lowercase: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure user ID is always stored
    },
    userName: {
      type: String,
      required: true, // Ensure user name is always stored
      trim: true,
    },
    replies: [
      {
        name: String,
        email: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("enquiries", EnquirySchema);
