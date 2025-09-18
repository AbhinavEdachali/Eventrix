import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import Sidebar from "../common_pages/Sidebar";
import { FaStar, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../../components/common_components/AuthContext";
import Footer from "../../components/footer_components/Footer";
import "./CategoryProductpage.css";

// Header component definition
const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full absolute top-2 left-0 z-50 bg-transparent text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Icons Section */}
        <div
              style={{ position: "absolute", top: "26px", left: "-80px" }}
              className="absolute left-[-50px] font-serif text-black text-5xl font-bold"
            >
              <button
                onClick={() => (window.location.href = "/")}
                className="text-black hover:text-gray-500 transition duration-300"
              >
                EVENTRIX
              </button>
            </div>

        {/* Navigation Section */}
        <nav className="absolute left-[525px] mt-7 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
          <a href="/all-blogs" className="hover:text-gray-300">BLOG</a>
          <a href="/contact-us" className="hover:text-gray-300">CONTACT</a>
          <a href="/about-us" className="hover:text-gray-300">ABOUT</a>
        </nav>

        {/* Heart Icon Button (Visible only if logged in) */}
        {user && (
          <div className="absolute right-[30px] mt-9">
            <a
              href="/shortlistpage"
              className=" text-2xl hover:text-red-500 transition duration-300"
            >
              <FaRegHeart />
            </a>
          </div>
        )}

        {/* Service Button Section */}
        <div className="absolute right-[70px] mt-7">
          <a
            href="/services"
            className="border border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-white hover:bg-black transition duration-300"
          >
            BOOK YOUR SESSION
          </a>
        </div>

        {/* Account Section */}
        <div className="absolute right-[-60px] mt-7 group">
          {user ? (
            <div className="relative">
              <span
                className="cursor-pointer"
                onClick={() => window.location.href = `/user-dashboard/${user.id}`}
              >
                {user.name}
              </span>
            </div>
          ) : (
            <div className="relative">
              <button className="cursor-pointer">ACCOUNT</button>
              <ul className="absolute left-0 hidden group-hover:block bg-transparent text-white text-left min-w-[100px] z-50">
                <li>
                  <a className="block px-2 py-1 " href="/login">
                    Login
                  </a>
                </li>
                <li>
                  <a
                    className="block px-2 py-1 "
                    href="/register"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [filters, setFilters] = useState({});
  const placeholderImage = "/path-to-your-placeholder-image.jpg";

  useEffect(() => {
    const fetchProductsWithRatings = async () => {
      try {
        const res = await axios.get(
          `${backendGlobalRoute}/api/products/category/${categoryId}`
        );
        const products = res.data.products;

        const productsWithRatings = await Promise.all(
          products.map(async (product) => {
            const reviewsResponse = await axios.get(
              `${backendGlobalRoute}/api/allreviews?productId=${product._id}`
            );
            const reviews = reviewsResponse.data;
            const totalReviews = reviews.length;
            const averageRating =
              totalReviews > 0
                ? (
                    reviews.reduce((sum, review) => sum + review.rating, 0) /
                    totalReviews
                  ).toFixed(1)
                : "0.0";

            return {
              ...product,
              averageRating,
              totalReviews,
            };
          })
        );

        setProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings); // Initially, show all
        setCategoryName(res.data.categoryName);
      } catch (error) {
        console.error("Error fetching products with ratings:", error);
      }
    };

    fetchProductsWithRatings();
  }, [categoryId]);

  // Separate search filter function
  const filterBySearch = (products, searchTerm) => {
    if (!searchTerm) return products;
    const lowerSearch = searchTerm.toLowerCase();
    return products.filter((product) => {
      const nameMatch = (product.product_name || "").toLowerCase().includes(lowerSearch);
      const descMatch = (product.description || "").toLowerCase().includes(lowerSearch);

      // All property values
      const propMatch = Object.values(product.properties || {}).some(
        (value) => String(value).toLowerCase().includes(lowerSearch)
      );

      // Robust location search: check all possible location fields
      let locationMatch = false;
      if (product.location) {
        if (typeof product.location === "string") {
          locationMatch = product.location.toLowerCase().includes(lowerSearch);
        }
        if (typeof product.location === "object") {
          if (product.location.address && typeof product.location.address === "string") {
            locationMatch = locationMatch || product.location.address.toLowerCase().includes(lowerSearch);
          }
          if (product.location.city && typeof product.location.city === "string") {
            locationMatch = locationMatch || product.location.city.toLowerCase().includes(lowerSearch);
          }
          if (product.location.state && typeof product.location.state === "string") {
            locationMatch = locationMatch || product.location.state.toLowerCase().includes(lowerSearch);
          }
          if (product.location.country && typeof product.location.country === "string") {
            locationMatch = locationMatch || product.location.country.toLowerCase().includes(lowerSearch);
          }
        }
      }

      return (
        nameMatch ||
        descMatch ||
        propMatch ||
        locationMatch
      );
    });
  };

  // Calculate min and max price from all products
  const prices = products.map((p) => p.selling_price || 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 10000;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    let filtered = [...products];

    // Category Type filter (multi-select)
    if (newFilters.categoryType && newFilters.categoryType.length > 0) {
      const selectedTypes = newFilters.categoryType.map((t) => t.toLowerCase());
      filtered = filtered.filter(
        (product) =>
          product.category_type &&
          selectedTypes.includes(product.category_type.toLowerCase())
      );
    }

    // Price range filter
    if (newFilters.price && Array.isArray(newFilters.price)) {
      const [min, max] = newFilters.price;
      filtered = filtered.filter(
        (product) =>
          (product.selling_price || 0) >= min &&
          (product.selling_price || 0) <= max
      );
    }

    for (const key in newFilters) {
      if (key === "search" || key === "price" || key === "categoryType") continue;
      const values = newFilters[key];
      if (values.length === 0) continue;

      filtered = filtered.filter((product) => {
        if (key === "vendor") {
          return values.includes(product.vendor?._id);
        } else if (key === "location") {
          const address = (product.location && product.location.address)
            ? String(product.location.address).toLowerCase()
            : "";
          return values.some((val) =>
            address.includes(String(val).toLowerCase())
          );
        } else if (product.properties && product.properties[key]) {
          return values.some((filterVal) => {
            const propVal = product.properties[key];
            const rangeMatch = String(filterVal).match(/^\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?|Above)\s*$/i);
            if (rangeMatch) {
              const min = parseFloat(rangeMatch[1]);
              const maxStr = rangeMatch[2];
              const val = parseFloat(propVal);
              if (!isNaN(val)) {
                if (maxStr.toLowerCase() === "above") {
                  return val >= min;
                } else {
                  const max = parseFloat(maxStr);
                  return val >= min && val <= max;
                }
              }
              return false;
            }
            return String(propVal) === String(filterVal);
          });
        }
        return false;
      });
    }

    // Now apply search filter last, on the already filtered products
    const searchTerm = newFilters.search || "";
    const finalFiltered = filterBySearch(filtered, searchTerm);

    setFilteredProducts(finalFiltered);
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          onFilterChange={handleFilterChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        {/* Main Content */}
        <section className="flex-1 py-12 bg-gray-50 px-4 mt-11">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {categoryName || "Products"}
            </h2>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    className="w-full sm:w-[360px] mx-auto overflow-hidden font-sans rounded-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={
                          product.product_image
                            ? `${backendGlobalRoute}/${product.product_image.replace(/\\/g, "/")}`
                            : placeholderImage
                        }
                        alt={product.product_name}
                        className="w-full h-[200px] object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="px-3 pt-1 space-y-2">
                      {/* Title and Rating */}
                      <div className="flex justify-between items-center">
                        <h3
                          className="text-lg font-semibold text-gray-800 truncate"
                          style={{
                            maxWidth: "170px", // adjust as needed for your layout
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            minHeight: "28px", // ensures consistent height (1 line)
                            display: "block",
                          }}
                          title={product.product_name}
                        >
                          {product.product_name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaStar className="text-pink-500 mr-1" />
                          <span className="font-semibold">{product.averageRating}</span>
                          <span className="ml-1 text-gray-500">({product.totalReviews} reviews)</span>
                        </div>
                      </div>

                      {/* Location or Description */}
                      {product.location?.address ? (
                        <div className="flex items-center text-gray-600 text-sm">
                          <FaMapMarkerAlt className="mr-1" />
                          <span className="truncate">{product.location.address}</span>
                        </div>
                      ) : (
                        <div className="text-gray-600 text-sm truncate">
                          {product.description || "No description available."}
                        </div>
                      )}

                      {/* Pricing */}
                      <div className="flex justify-start text-sm text-gray-800 gap-6 mb-3">
                        <div>
                          <div className="text-gray-500">Current Price</div>
                          <div className="font-bold">₹ {product.selling_price.toFixed(2)}</div>
                        </div>
                        {product.display_price && (
                          <div>
                            <div className="text-gray-500">Selling Price</div>
                            <div className="font-bold line-through">₹ {product.display_price.toFixed(2)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No products match the selected filters.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CategoryProducts;
