const express = require("express");
const {
  blogUpload,
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog, // <-- import controller
} = require("../controllers/BlogController");

const router = express.Router();

// Add a new blog
router.post("/add-blog", blogUpload.single("featuredImage"), addBlog);

// Fetch all blogs
router.get("/all-blogs", getAllBlogs);

// Fetch a single blog by ID
router.get("/single-blogs/:id", getBlogById);

// Delete a blog by ID
router.delete("/blogs/:id", deleteBlog);

module.exports = router;
