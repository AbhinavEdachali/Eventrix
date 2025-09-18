import React, { useEffect, useState } from "react";
import { FaThList, FaThLarge, FaTh, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AllAddedPage = () => {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-added-products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchAllProducts();
  }, []);

  const getImageUrl = (imagePath) => {
    if (imagePath) {
      const normalized = imagePath.replace(/\\/g, "/").split("uploads/").pop();
      return `${backendGlobalRoute}/uploads/${normalized}`;
    }
    return "https://via.placeholder.com/150"; // fallback
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            All Products
          </h2>
          <div className="flex items-center space-x-4">
            <FaThList
              className={`text-xl cursor-pointer ${view === "list" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${view === "card" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${view === "grid" ? "text-indigo-600" : "text-gray-600"}`}
              onClick={() => setView("grid")}
            />
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/add-product">
              <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:opacity-90 transition-opacity">
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Product Display */}
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/single-added-product/${product._id}`}
                  key={product._id}
                  className="flex flex-col items-start relative"
                >
                  <img
                    src={getImageUrl(product.product_image)}
                    alt={product.product_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h3 className="mt-2 text-md font-semibold text-gray-900 text-left">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-500">
                    Display Price: ₹{product.display_price?.toFixed(2) ?? 0}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/single-added-product/${product._id}`}
                  key={product._id}
                  className="flex flex-col bg-white rounded-lg shadow p-4"
                >
                  <img
                    src={getImageUrl(product.product_image)}
                    alt={product.product_name}
                    className="w-full h-72 object-cover rounded-lg"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 text-left">
                    {product.product_name}
                  </h3>
                  <p className="text-gray-500">
                    Display Price: ₹{product.display_price?.toFixed(2) ?? 0}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/single-added-product/${product._id}`}
                  key={product._id}
                  className="flex items-center space-x-4 bg-white rounded-lg shadow p-4"
                >
                  <img
                    src={getImageUrl(product.product_image)}
                    alt={product.product_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500">
                      Display Price: ₹{product.display_price?.toFixed(2) ?? 0}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAddedPage;
