const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  description: { type: String, required: true },
  availability_status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available",
  },
  SKU: {
    type: String,
    required: true,
    unique: true,
  },
  product_image: { type: String, required: true },
  all_product_images: [{ type: String }],

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  category_type: { type: String }, // New field for category type

  outlets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet", // Reference to the Outlet model
    },
  ],

  selling_price: { type: Number, required: true },
  display_price: { type: Number },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },

  properties: {
    type: Map,
    of: String,
  },

  // ✅ New location field
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
    },
    address: { type: String }, // Optional address field
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add geospatial index to the location field
productSchema.index({ location: "2dsphere" });

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);
