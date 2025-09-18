import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { FaStar, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../../components/footer_components/Footer";

// Header component definition
const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full  top-2 left-0 z-50 bg-transparent text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Icons Section */}
        <div
              style={{ position: "absolute", top: "26px", left: "-50px" }}
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
        <nav className="absolute left-[525px] mt-9 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
          <a href="all-blogs" className="hover:text-gray-300">BLOG</a>
          <a href="/contact-us" className="hover:text-gray-300">CONTACT</a>
          <a href="/about-us" className="hover:text-gray-300">ABOUT</a>
        </nav>

        {/* Service Button Section */}
        <div className="absolute right-[30px] mt-9">
          <a
            href="/services"
            className="border border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-white hover:bg-black transition duration-300"
          >
            BOOK YOUR SESSION
          </a>
        </div>

        {/* Account Section */}
        <div className="absolute right-[-60px] mt-9 group">
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

const ShortlistPage = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [shortlistedProducts, setShortlistedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlistedProducts = async () => {
      if (!loggedInUser) return;

      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/shortlist/${loggedInUser.id}`
        );

        const productsWithLocation = await Promise.all(
          response.data.map(async (item) => {
            const productResponse = await axios.get(
              `${backendGlobalRoute}/api/products/${item.productId._id}`
            );
            const productDetails = productResponse.data;

            // Fetch reviews and calculate average rating
            const reviewsResponse = await axios.get(
              `${backendGlobalRoute}/api/allreviews?productId=${item.productId._id}`
            );
            const reviews = reviewsResponse.data;
            const totalReviews = reviews.length;
            const averageRating =
              totalReviews > 0
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
                : "0.0";

            return {
              ...item,
              productDetails: {
                ...productDetails,
                selling_price: productDetails.selling_price.toFixed(2),
                display_price: productDetails.display_price
                  ? productDetails.display_price.toFixed(2)
                  : null,
                averageRating, // Add averageRating
                totalReviews, // Add totalReviews
              },
            };
          })
        );

        setShortlistedProducts(productsWithLocation);
      } catch (error) {
        console.error("Error fetching shortlisted products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistedProducts();
  }, [loggedInUser]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          Loading shortlisted products...
        </div>
      </>
    );
  }

  if (shortlistedProducts.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-gray-500 ">
          No shortlisted products found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 mt-10">
        <h1 className="text-3xl font-semibold mb-6">My Shortlisted Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {shortlistedProducts.map((item) => {
            const product = item.productDetails;
            const location = product.location?.address || "Location not available";

            return (
              <Link
                to={`/product/${product._id}`}
                key={item._id}
                className="w-full sm:w-[360px] mx-auto overflow-hidden font-sans rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={`${backendGlobalRoute}/${product.product_image.replace(/\\/g, "/")}`}
                    alt={product.product_name}
                    className="w-full h-[200px] object-cover"
                  />
                </div>

                {/* Content */}
                <div className="px-3 pt-1 space-y-2">
                  {/* Title and Rating */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
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
                      <div className="font-bold">₹ {product.selling_price}</div>
                    </div>
                    {product.display_price && (
                      <div>
                        <div className="text-gray-500">Selling Price</div>
                        <div className="font-bold line-through">₹ {product.display_price}</div>
                      </div>
                    )}
                  </div>

                  {/* Capacity and Rooms */}
                </div>
              </Link>
            );
          })}
        </div>
      
      </div>
      <Footer />
    </>
  );
};

export default ShortlistPage;
