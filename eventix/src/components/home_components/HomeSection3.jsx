import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config"; // Import backend route configuration

const HomeSection3 = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/top-categories?sort=asc`); // Add query parameter for sorting
        console.log("Fetched categories:", response.data); // Debug log
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Fallback to an empty array on error
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white py-20 px-4"> {/* Updated to ensure full width */}
      <div className="max-w-6xl mx-auto">
        {/* Top Text */}
        <div className="flex justify-between text-sm uppercase tracking-widest text-gray-700 px-4">
          <span>Explore how we can work together</span>
          <span>Texas & Destinations</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 my-6"></div>

        {/* Services Section with Vertical Lines */}
        <div className="grid grid-cols-3 gap-8 items-start">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={category._id}
                className={`flex flex-col items-center text-center ${
                  index !== 0 ? "border-l border-gray-300" : ""
                }`}
              >
                <div
                  className="relative w-full h-80 cursor-pointer"
                  onClick={() => navigate(`/category/${category._id}`)} // Make the image clickable
                >
                  <img
                    src={
                      category.category_image
                        ? `${backendGlobalRoute}/${category.category_image.replace(
                            /\\/g,
                            "/"
                          )}`
                        : "/path-to-your-placeholder-image.jpg"
                    }
                    alt={category.category_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl italic text-gray-700 mt-4">
                  {category.category_name}
                </h2>
                <p className="text-gray-600 text-sm mt-2 px-4">
                  {category.description
                    ? category.description.split(" ").slice(0, 10).join(" ") + (category.description.split(" ").length > 10 ? "..." : "")
                    : "Provide a summary of your packages right here, and why it's best for them."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-3">
              No categories available at the moment.
            </p>
          )}
        </div>

        {/* Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/services")}
            className="px-6 py-3 border-2 border-gray-600 rounded-full text-gray-800 uppercase text-xs tracking-widest hover:bg-gray-700 hover:text-white transition duration-300"
          >
            Explore Services →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeSection3;
