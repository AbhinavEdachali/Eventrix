// models/SideBarModel.js

const mongoose = require("mongoose");

const SideBarSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  propertyValues: {
    type: Map,
    of: [mongoose.Schema.Types.Mixed], // support string, boolean, etc.
    required: true,
  },
  displayTypes: {
    type: Map,
    of: String, // "text" or "checkbox"
    required: true,
  },
  locations: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("SideBar", SideBarSchema);
