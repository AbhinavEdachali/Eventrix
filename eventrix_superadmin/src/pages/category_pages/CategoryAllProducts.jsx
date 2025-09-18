import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaFilter,
  FaArrowLeft,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

const CategoryAllProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768); // Track screen size

  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      const normalizedPath = imageUrl
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${backendGlobalRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  useEffect(() => {
    const fetchCategoryAndSubcategories = async () => {
      try {
        const categoryResponse = await axios.get(
          `${backendGlobalRoute}/api/single-category/${categoryId}`
        );
        setCategoryName(categoryResponse.data.category_name);

        const subcategoryResponse = await axios.get(
          `${backendGlobalRoute}/api/all-subcategories/${categoryId}`
        );
        setSubcategories(subcategoryResponse.data);

        if (subcategoryResponse.data.length > 0) {
          setSelectedSubcategory(subcategoryResponse.data[0]);
        }
      } catch (error) {
        console.log("No subcategories found.");
      }
    };
    if (categoryId) {
      fetchCategoryAndSubcategories();
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedSubcategory) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${backendGlobalRoute}/api/products-by-subcategory/${selectedSubcategory._id}`
          );
          setProducts(response.data);
        } catch (error) {
          console.error(
            "Error fetching products:",
            error.response?.data || error.message
          );
        }
      };
      fetchProducts();
    }
  }, [selectedSubcategory]);

  // Handle screen resizing and update the state accordingly
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.weight && product.weight.toString().includes(searchTerm)) ||
      (product.selling_price &&
        product.selling_price.toString().includes(searchTerm))
  );

  const handleSort = (key) => {
    let sortedProducts = [...filteredProducts];
    if (sortConfig && sortConfig.key === key && sortConfig.order === "asc") {
      sortedProducts.sort((a, b) => (a[key] > b[key] ? -1 : 1));
      setSortConfig({ key, order: "desc" });
    } else {
      sortedProducts.sort((a, b) => (a[key] > b[key] ? 1 : -1));
      setSortConfig({ key, order: "asc" });
    }
    setProducts(sortedProducts);
  };

  // Function to add a product to the cart using API
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to add products to your cart.");
        return;
      }

      // Debugging: Check if the token is present and valid
      console.log("Token being sent in the request:", token);

      const cartItem = {
        productId: product._id,
        quantity: 1,
        priceAtPurchase: product.selling_price,
      };

      // Make the API call to add the item to the cart
      const response = await axios.post(
        `${backendGlobalRoute}/api/cart`,
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is passed correctly
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Product added to cart successfully!");
      } else {
        alert("Product is already in the cart. Quantity has been updated.");
      }
    } catch (error) {
      console.error(
        "Error adding product to the cart:",
        error.response?.data || error.message
      );
      alert("Failed to add the product to the cart.");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-16 max-w-5xl transition-all duration-500 ease-in-out">
      {/* Header Section with Back Button, Category Name, Search, and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out"
          >
            <FaArrowLeft className="inline mr-2" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{categoryName}</h1>
          <span className="text-gray-500 text-sm ml-2 flex items-center">
            {filteredProducts.length} products
          </span>
        </div>

        {/* Search Field and Filters */}
        <div className="flex flex-col md:flex-row w-full md:w-auto items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transform transition-all duration-300 w-full md:w-64 bg-white"
            style={{ boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}
          />
          <div className="flex items-center space-x-2">
            <button
              className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white p-2 text-xs rounded-md shadow-sm flex items-center transform transition-all duration-300 hover:scale-105"
              onClick={() => handleSort("product_name")}
            >
              <FaSortAlphaDown className="mr-1" /> Name
            </button>

            <button
              className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white p-2 text-xs rounded-md shadow-sm flex items-center transform transition-all duration-300 hover:scale-105"
              onClick={() => handleSort("selling_price")}
            >
              <FaSortAlphaUp className="mr-1" /> Price
            </button>

            <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white p-2 text-xs rounded-md shadow-sm flex items-center transform transition-all duration-300 hover:scale-105">
              <FaFilter className="mr-1" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Border After Header */}
      <hr className="border-t border-gray-200 my-4" />

      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-6 animate-fade-in-up">
        {/* Left Sidebar - Subcategories */}
        <div
          className={`col-span-12 md:col-span-2 space-y-4 ${
            isDesktop ? "border-r border-gray-200 pr-4" : ""
          }`}
        >
          <ul className="flex md:block space-x-4 md:space-x-0 overflow-x-auto">
            {subcategories.map((subcategory) => (
              <li
                key={subcategory._id}
                className={`cursor-pointer text-center text-sm  p-2 ${
                  selectedSubcategory &&
                  selectedSubcategory._id === subcategory._id
                    ? "text-green-600"
                    : ""
                } ${
                  selectedSubcategory &&
                  selectedSubcategory._id === subcategory._id &&
                  isDesktop
                    ? "border-l-4 border-green-600"
                    : ""
                }`}
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                <img
                  src={getImageUrl(subcategory.subcategory_image)}
                  alt={subcategory.subcategory_name}
                  className="w-12 h-12 mx-auto object-cover mb-2 rounded-md"
                />
                <span
                  className={`text-sm font-medium ${
                    selectedSubcategory &&
                    selectedSubcategory._id === subcategory._id
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {subcategory.subcategory_name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Section */}
        <div className="col-span-12 md:col-span-10">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="text-center">
                  <img
                    src={getImageUrl(product.product_image)}
                    alt={product.product_name}
                    className="w-full h-32 object-cover rounded-md transform transition duration-300 hover:scale-105"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold">
                      {product.product_name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Price: ${product.selling_price}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-1 p-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white rounded-md text-xs transform transition-all hover:bg-indigo-700 w-2/3"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No products available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAllProducts;
