const mongoose = require("mongoose");

const ShortlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shortlist", ShortlistSchema);
