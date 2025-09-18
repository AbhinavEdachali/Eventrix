import React, { useEffect, useState } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const DeleteSidebar = () => {
  const [categoriesWithSidebar, setCategoriesWithSidebar] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch only categories that have sidebar content
  useEffect(() => {
    const fetchCategoriesWithSidebar = async () => {
      try {
        const [sidebarsRes, categoriesRes] = await Promise.all([
          axios.get(`${backendGlobalRoute}/api/sidebar/all`),
          axios.get(`${backendGlobalRoute}/api/all-categories`),
        ]);
        const sidebars = Array.isArray(sidebarsRes.data) ? sidebarsRes.data : [];
        const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        // Only include categories that have a sidebar
        const sidebarCategoryIds = sidebars.map((sb) =>
          typeof sb.categoryId === "object" && sb.categoryId._id
            ? sb.categoryId._id
            : sb.categoryId
        );
        const filteredCategories = categories.filter((cat) =>
          sidebarCategoryIds.some((id) => id === cat._id)
        );
        setCategoriesWithSidebar(filteredCategories);
      } catch {
        setCategoriesWithSidebar([]);
      }
    };
    fetchCategoriesWithSidebar();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategoryId) {
      setMessage("Please select a category.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete the sidebar for this category?")) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await axios.delete(`${backendGlobalRoute}/api/sidebar/${selectedCategoryId}`);
      setMessage("Sidebar deleted successfully.");
      setCategoriesWithSidebar((prev) =>
        prev.filter((cat) => cat._id !== selectedCategoryId)
      );
      setSelectedCategoryId("");
    } catch (err) {
      setMessage("Failed to delete sidebar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Delete Sidebar Content</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Select Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Choose a category --</option>
          {categoriesWithSidebar.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDelete}
        disabled={loading || !selectedCategoryId}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        {loading ? "Deleting..." : "Delete Sidebar"}
      </button>
      {message && <div className="mt-4 text-center text-sm">{message}</div>}
    </div>
  );
};

export default DeleteSidebar;
