import React, { useEffect, useState } from "react";
import { FaUser, FaEdit } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export default function SingleCategory() {
  const [categoryData, setCategoryData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/single-category/${id}`
        );
        setCategoryData(response.data);
        setUpdatedCategoryName(response.data.category_name); // Initialize the editable field
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleUpdateCategory = async () => {
    if (!updatedCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      await axios.put(`${backendGlobalRoute}/api/update-category/${id}`, {
        category_name: updatedCategoryName,
      });
      alert("Category name updated successfully!");
      window.location.reload(); // Reload the page to show the updated name
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update the category. Please try again.");
    }
  };

  if (!categoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold text-gray-900">Main Category</h2>
          <div className="flex space-x-2 flex-wrap">
            {/* Link to View All Categories */}
            <Link
              to="/all-categories"
              className="flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              All Categories
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start">
          <div className="w-full shadow rounded lg:p-5 sm:p-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {categoryData.category_name} Category Details
            </h3>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* Category Name */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                    <FaUser className="text-indigo-600 mr-2" /> Category Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center gap-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={updatedCategoryName}
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                    ) : (
                      categoryData.category_name
                    )}
                    <button
                      onClick={() =>
                        editMode ? handleUpdateCategory() : setEditMode(true)
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                      {editMode ? "Save" : <FaEdit />}
                    </button>
                  </dd>
                </div>

                {/* Creation Date */}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {new Date(categoryData.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
