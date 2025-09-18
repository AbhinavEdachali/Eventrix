const express = require("express");
const router = express.Router();

const {
  addToShortlist,
  getShortlistByUser,
  removeFromShortlist,
} = require("../controllers/ShortlistController");

// Route to add a product to the shortlist
router.post("/shortlist/add", addToShortlist);

// Route to remove a product from the shortlist
router.post("/shortlist/remove", removeFromShortlist);

// Route to get all shortlisted products for a user
router.get("/shortlist/:userId", getShortlistByUser);

module.exports = router;
