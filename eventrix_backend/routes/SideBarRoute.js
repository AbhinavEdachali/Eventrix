// routes/SideBarRoute.js
const express = require("express");
const router = express.Router();
const {
  addSidebarContent,
  getSidebarContent,
} = require("../controllers/SideBarController");

// Add or update sidebar content
router.post("/sidebar", addSidebarContent);

// Fetch sidebar config for a category
router.get("/sidebar/:categoryId", getSidebarContent);

// Delete sidebar config for a category
router.delete("/sidebar/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const SideBarModel = require("../models/SideBarModel");
    const deleted = await SideBarModel.findOneAndDelete({ categoryId });
    if (!deleted) {
      return res.status(404).json({ message: "Sidebar not found" });
    }
    res.json({ message: "Sidebar deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting sidebar" });
  }
});

module.exports = router;
