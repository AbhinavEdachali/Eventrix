const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema({
  category_name: { type: String, required: true }, // Remove `unique: true`
  description: { type: String },
  category_image: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  vendorEnabled: { type: Boolean, default: false },
  outletEnabled: { type: Boolean, default: false },
  locationEnabled: { type: Boolean, default: false },

  properties: [
    {
      name: { type: String },
      type: { type: String },
      options: [{ type: String }], // New field for dropdown options
    }
  ],
  tags: [{ type: String }], // ✅ New field for tags

  // ✅ Simplified location as strings (no geospatial format)
  location: {
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },

  category_types: [{ type: String }], // New field for category types

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update 'updatedAt' field automatically
categorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
