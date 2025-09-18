import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io"; // Import arrow icon
import { motion } from "framer-motion"; // Import motion from framer-motion
import backendGlobalRoute from "../../config/config";

const HomeSection11 = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null); // Ref for the horizontal scroll container
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/all-blogs`);
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-4xl font-bold mb-9 text-left text-gray-800">
        Latest Blogs
      </h2>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden space-x-4 relative"
        >
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link key={blog._id} to={`/single-blog/${blog._id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 w-[500px] h-48 bg-white shadow-md overflow-hidden flex"
                >
                  {/* Image on the left */}
                  <img
                    src={blog.featuredImage || "/placeholder.jpg"}
                    alt={blog.title}
                    className="w-[400px] h-full object-cover"
                  />

                  {/* Content on the right */}
                  <div className="w-1/2 p-4 flex flex-col justify-start">
                    <h3 className="text-md font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {blog.summary || "No summary available"}
                    </p>
                    <p className="text-sm text-pink-500 mt-2 hover:underline">
                      Read More
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No blogs found.</p>
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

export default HomeSection11;
