const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  categoryUpload,
  getTopThreeCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory, // <-- Add this import
} = require("../controllers/CategoryController");

// Add category with image
router.post(
  "/add-category",
  categoryUpload.single("category_image"), // Field name should match frontend
  addCategory
);

// Get all categories
router.get("/all-categories", getAllCategories);
router.get("/top-categories", getTopThreeCategories);

// Get single category by ID
router.get("/single-category/:id", getSingleCategory);

// Add this route for updating a category
router.put("/update-category/:id", updateCategory);

// Add this route for deleting a category
router.delete("/delete-category/:id", deleteCategory);

module.exports = router;
