const Category = require("../models/CategoryModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configure Multer storage for category images
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/category_images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Multer middleware for uploading category images
const categoryUpload = multer({ storage: categoryStorage });

// Controller to add a new category
const addCategory = async (req, res) => {
  try {
    const {
      category_name,
      description,
      vendorEnabled,
      outletEnabled,
      properties,
      tags,
      locationEnabled,
      location, // this comes as an object: { address, latitude, longitude }
      category_types, // New field
    } = req.body;

    // Check if category already exists
    const existing = await Category.findOne({ category_name });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Process uploaded image
    const category_image = req.file ? req.file.path : "";

    // Parse properties and include options for dropdowns
    let parsedProperties = [];
    if (properties) {
      parsedProperties =
        typeof properties === "string" ? JSON.parse(properties) : properties;

      // Ensure dropdown options are included
      parsedProperties = parsedProperties.map((prop) => {
        if (prop.type === "dropdown" && !prop.options) {
          prop.options = []; // Default to an empty array if options are missing
        }
        return prop;
      });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }

    // Parse location
    let parsedLocation = {};
    if (locationEnabled && location) {
      const locObj = typeof location === "string" ? JSON.parse(location) : location;
      parsedLocation = {
        address: locObj.address || "",
        latitude: locObj.latitude || "",
        longitude: locObj.longitude || "",
      };
    }

    // Parse category types
    const parsedCategoryTypes = category_types
      ? typeof category_types === "string"
        ? JSON.parse(category_types)
        : category_types
      : [];

    // Ensure `parsedCategoryTypes` is an array
    if (!Array.isArray(parsedCategoryTypes)) {
      return res.status(400).json({ error: "Invalid category_types format" });
    }

    const newCategory = new Category({
      category_name,
      description,
      category_image,
      vendorEnabled,
      outletEnabled,
      properties: parsedProperties,
      tags: parsedTags,
      locationEnabled: locationEnabled === "true" || locationEnabled === true,
      location: parsedLocation,
      category_types: parsedCategoryTypes, // Save category types
    });

    await newCategory.save();

    res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error); // Log the exact error
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to fetch all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("products");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// Controller to fetch top 3 categories (e.g., for homepage)
const getTopThreeCategories = async (req, res) => {
  try {
    const sortOrder = req.query.sort === "asc" ? 1 : -1; // Determine sort order based on query parameter
    const categories = await Category.find()
      .sort({ createdAt: sortOrder }) // Sort by creation date
      .limit(3)
      .populate("products");

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching top 3 categories:", error);
    res.status(500).json({ message: "Error fetching top categories" });
  }
};

// Controller to fetch a single category by ID
const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
};

// Controller to update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_name,
      description,
      vendorEnabled,
      outletEnabled,
      properties,
      tags,
      locationEnabled,
      location,
      category_types,
    } = req.body;

    // Parse properties, tags, location, and category_types if needed
    let parsedProperties = [];
    if (properties) {
      parsedProperties =
        typeof properties === "string" ? JSON.parse(properties) : properties;
    }
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    }
    let parsedLocation = {};
    if (locationEnabled && location) {
      const locObj = typeof location === "string" ? JSON.parse(location) : location;
      parsedLocation = {
        address: locObj.address || "",
        latitude: locObj.latitude || "",
        longitude: locObj.longitude || "",
      };
    }
    const parsedCategoryTypes = category_types
      ? typeof category_types === "string"
        ? JSON.parse(category_types)
        : category_types
      : [];

    // Build update object
    const updateObj = {
      category_name,
      description,
      vendorEnabled,
      outletEnabled,
      properties: parsedProperties,
      tags: parsedTags,
      locationEnabled: locationEnabled === "true" || locationEnabled === true,
      location: parsedLocation,
      category_types: parsedCategoryTypes,
      updatedAt: Date.now(),
    };

    // Remove undefined fields
    Object.keys(updateObj).forEach(
      (key) => updateObj[key] === undefined && delete updateObj[key]
    );

    const updated = await Category.findByIdAndUpdate(id, updateObj, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully", category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

// Controller to delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getTopThreeCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  categoryUpload,
};
