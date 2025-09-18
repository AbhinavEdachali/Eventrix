// controllers/SideBarController.js
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const SideBarModel = require("../models/SideBarModel");

// POST /api/sidebar/:categoryId  — to add/update sidebar content
exports.addSidebarContent = async (req, res) => {
  const { categoryId, propertyValues = {}, displayTypes = {}, locations = [] } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: "categoryId is required" });
  }

  // overwrite existing or create new
  await SideBarModel.findOneAndUpdate(
    { categoryId },
    { propertyValues, displayTypes, locations },
    { upsert: true }
  );

  return res.status(201).json({ message: "Sidebar content saved." });
};

// GET /api/sidebar/:categoryId  — to fetch the config
exports.getSidebarContent = async (req, res) => {
  const { categoryId } = req.params;

  // If categoryId is "all" or not a valid ObjectId, return all sidebar configs
  if (
    categoryId === "all" ||
    !/^[0-9a-fA-F]{24}$/.test(categoryId)
  ) {
    // Fetch all sidebars and their categories with types
    const allSidebars = await SideBarModel.find().lean();
    // Fetch all categories referenced by sidebars
    const categoryIds = allSidebars.map(sb => sb.categoryId);
    const categories = await Category.find({ _id: { $in: categoryIds } }).lean();

    // Map categoryId to category object for quick lookup
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat;
    });

    // Attach category types to each sidebar
    const result = allSidebars.map(sb => ({
      ...sb,
      categoryTypes: categoryMap[sb.categoryId?.toString()]?.category_types || [],
      categoryName: categoryMap[sb.categoryId?.toString()]?.category_name || "",
    }));

    return res.json(result);
  }

  // Otherwise, fetch by ObjectId
  const sidebar = await SideBarModel.findOne({ categoryId });
  if (!sidebar) return res.status(404).json({ error: "No sidebar config found." });

  // Fetch category name and types
  const category = await Category.findById(categoryId);

  res.json({
    propertyValues: sidebar.propertyValues,
    displayTypes: sidebar.displayTypes,
    locations: sidebar.locations,
    categoryName: category?.category_name || "",
    categoryTypes: category?.category_types || [],
  });
};
