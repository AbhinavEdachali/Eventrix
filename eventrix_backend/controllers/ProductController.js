const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const Vendor = require("../models/VendorModel"); // Import Vendor model
const Outlet = require("../models/OutletModel"); // Import Outlet model

// Multer setup
// Handles image uploads for products
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/product_images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const productUpload = multer({ storage: productStorage });

// SKU generator
const generateSKU = () => {
  return `SKU-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000).toString(36).toUpperCase()}`;
};

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      product_name,
      description,
      availability_status,
      category,
      vendor,
      outlet,
      outlets,
      selling_price,
      display_price,
      properties,
      location, // New location data
      category_type, // New field
    } = req.body;

    // Validate Category
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (categoryDoc.vendorEnabled && !vendor) {
      return res.status(400).json({ message: "Vendor is required for this category" });
    }

    if (categoryDoc.outletEnabled && !(outlets || outlet)) {
      return res.status(400).json({ message: "Outlet is required for this category" });
    }

    // Parse and validate dynamic properties
    const parsedProperties = properties ? JSON.parse(properties) : {};
    const validProperties = {};

    if (Array.isArray(categoryDoc.properties)) {
      categoryDoc.properties.forEach((prop) => {
        if (parsedProperties[prop.name] !== undefined) {
          validProperties[prop.name] = parsedProperties[prop.name];
        }
      });
    }

    // Transform location into GeoJSON format with fallback for missing coordinates
    let locationData = null;
    if (location) {
      try {
        const parsedLocation = JSON.parse(location);
        if (parsedLocation.address || (parsedLocation.coordinates && parsedLocation.coordinates.lat && parsedLocation.coordinates.lng)) {
          locationData = {
            type: "Point",
            coordinates: parsedLocation.coordinates
              ? [parsedLocation.coordinates.lng, parsedLocation.coordinates.lat]
              : undefined,
            address: parsedLocation.address,
          };
        }
      } catch (error) {
        return res.status(400).json({ message: "Error parsing location data" });
      }
    }

    // Image handling
    let product_image = null;
    let all_product_images = [];

    if (req.files?.main_image?.[0]) {
      product_image = req.files.main_image[0].path;
    }

    if (req.files?.additional_images) {
      all_product_images = req.files.additional_images.map((file) => file.path);
    }

    // Use single outlet or multiple
    const outletArray = outlets
      ? JSON.parse(outlets)
      : outlet
      ? [outlet]
      : [];

    // Create product with properties and location
    const newProduct = new Product({
      product_name,
      description,
      category,
      vendor: vendor || undefined,
      availability_status,
      SKU: generateSKU(),
      product_image,
      all_product_images,
      outlets: outletArray,
      selling_price: parseFloat(selling_price),
      display_price: parseFloat(display_price),
      properties: validProperties,
      location: locationData, // Save location data
      category_type, // Save category type
    });

    const savedProduct = await newProduct.save();

    // Update vendor's products array if vendor is provided
    if (vendor) {
      await Vendor.findByIdAndUpdate(vendor, {
        $push: { products: { product: savedProduct._id, quantity: 1 } },
      });
    }

    // Update outlet's products array if outlet(s) are provided
    if (outletArray.length > 0) {
      await Outlet.updateMany(
        { _id: { $in: outletArray } },
        { $push: { products: { product: savedProduct._id, quantity: 1 } } }
      );
    }

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
};

// Get All Products
const getAllAddedProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("vendor")
      .populate("outlets");

    const enrichedProducts = products.map((product) => {
      return {
        ...product.toObject(),
        lowestPrice: product.selling_price || 0,
      };
    });

    res.status(200).json(enrichedProducts);
  } catch (error) {
    console.error("Error fetching all added products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Products By Category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: categoryId })
      .populate("vendor")
      .populate("outlets");

    res.status(200).json({
      categoryName: category.category_name,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products by category", error: error.message });
  }
};

// Get Single Product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("Fetching product with ID:", productId); // Debug log

    const product = await Product.findById(productId)
      .populate("category")
      .populate("vendor")
      .populate({
        path: "outlets",
        model: "Outlet", // Populate the outlets array
        select: "outlet_name outlet_email outlet_phone", // Fetch only necessary fields
      });

    if (!product) {
      console.error("Product not found for ID:", productId); // Debug log
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Fetched product with populated outlets:", product); // Debug log

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching single product:", error); // Debug log
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

// Update Product by ID
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateFields = req.body;

    // Optionally: Validate fields here before updating

    // If properties is a stringified object, parse it
    if (typeof updateFields.properties === "string") {
      try {
        updateFields.properties = JSON.parse(updateFields.properties);
      } catch (e) {
        // ignore parse error, keep as is
      }
    }

    // If location is a stringified object, parse it
    if (typeof updateFields.location === "string") {
      try {
        updateFields.location = JSON.parse(updateFields.location);
      } catch (e) {
        // ignore parse error, keep as is
      }
    }

    updateFields.updatedAt = Date.now();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    )
      .populate("category")
      .populate("vendor")
      .populate({
        path: "outlets",
        model: "Outlet",
        select: "outlet_name outlet_email outlet_phone",
      });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// Delete Product by ID
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = {
  addProduct,
  productUpload,
  getAllAddedProducts,
  getSingleProduct,
  getProductsByCategory, // Exporting new controller
  updateProduct, // <-- export the new controller
  deleteProduct, // <-- export the new controller
};
