import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io"; // Import new icon

const HomeSection10 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null); // Ref for the horizontal scroll container
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/products/category/682cb950c0abbe0d7f485bec`
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(handleScrollVisibility, 300);
    }
  };

  const handleScrollVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScrollVisibility);
      handleScrollVisibility(); // Initial check
    }
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScrollVisibility);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        Loading products...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-4xl font-bold mb-9 text-left text-gray-800">
        Popular Venues in Bangalore
      </h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden space-x-4 relative"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[500px] h-48 bg-white shadow-md overflow-hidden flex"
              >
                {/* Image on the left */}
                <img
                  src={`${backendGlobalRoute}/${product.product_image.replace(/\\/g, "/")}`}
                  alt={product.product_name}
                  className="w-[400px] h-full object-cover"
                />

                {/* Content on the right */}
                <div className="w-1/2 p-4 flex flex-col justify-start">
                  <h3 className="text-md font-semibold text-gray-800">
                    {product.product_name}
                  </h3>
                  {product.locationEnabled && product.location?.address ? (
                    <p className="text-sm text-pink-500 mt-1">
                      {product.location.address}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">Location not available</p>
                  )}
                  <a
                    href={`/product/${product._id}`}
                    className="text-sm text-pink-500 mt-2 hover:underline"
                  >
                    More
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found in this category.</p>
          )}
        </div>

        {/* Scroll Buttons */}
        {showLeftButton && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <IoIosArrowForward className="rotate-180 text-lg" />
          </button>
        )}
        {showRightButton && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <IoIosArrowForward className="text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeSection10;
