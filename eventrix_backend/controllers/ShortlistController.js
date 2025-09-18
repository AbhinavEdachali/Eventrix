const Shortlist = require("../models/ShortlistModel");

// Add to shortlist
const addToShortlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const exists = await Shortlist.findOne({ userId, productId });
    if (exists) return res.status(400).json({ message: "Already shortlisted" });

    const entry = new Shortlist({ userId, productId });
    await entry.save();

    res.status(201).json({ message: "Product shortlisted", entry });
  } catch (error) {
    res.status(500).json({ message: "Error adding to shortlist", error: error.message });
  }
};

// Get all shortlist items for a user
const getShortlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const shortlist = await Shortlist.find({ userId }).populate("productId");
    res.status(200).json(shortlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shortlist", error: error.message });
  }
};

// Remove from shortlist
const removeFromShortlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await Shortlist.findOneAndDelete({ userId, productId });
    res.status(200).json({ message: "Removed from shortlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from shortlist", error: error.message });
  }
};

module.exports = {
  addToShortlist,
  getShortlistByUser,
  removeFromShortlist,
};
