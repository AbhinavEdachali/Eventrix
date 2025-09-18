const express = require("express");
const router = express.Router();

const {
  addProduct,
  productUpload,
  getAllAddedProducts,
  getProductsByCategory,
  getSingleProduct,
  updateProduct, // <-- add this import
  deleteProduct, // <-- add this import
} = require("../controllers/ProductController");

// Route to add a new product
router.post(
  "/add-product",
  productUpload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "additional_images", maxCount: 10 },
  ]),
  addProduct
);

// Route to get all added products
router.get("/all-added-products", getAllAddedProducts);

// Route to get products by category
router.get("/products/category/:categoryId", getProductsByCategory);

// Route to get a single product by ID (for /api/single-product/:productId)
router.get('/single-product/:productId', getSingleProduct);

router.get('/products/:productId', getSingleProduct);

// Route to update a product by ID
router.put('/update-product/:productId', updateProduct);

// Route to update the main product image by ID
router.put(
  '/update-product-image/:productId',
  productUpload.fields([{ name: "product_image", maxCount: 1 }]),
  async (req, res, next) => {
    // This middleware will handle the image upload and update
    const Product = require("../models/ProductModel");
    try {
      const { productId } = req.params;
      if (!req.files || !req.files.product_image || req.files.product_image.length === 0) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      const imagePath = req.files.product_image[0].path;
      const updated = await Product.findByIdAndUpdate(
        productId,
        { product_image: imagePath, updatedAt: Date.now() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product image", error: error.message });
    }
  }
);

// Route to delete a product by ID
router.delete('/delete-product/:productId', deleteProduct);

module.exports = router;
