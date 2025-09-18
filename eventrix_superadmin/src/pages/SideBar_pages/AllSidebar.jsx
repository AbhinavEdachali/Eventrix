import React, { useEffect, useState } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AllSidebar = () => {
  const [sidebars, setSidebars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarsAndCategories = async () => {
      setLoading(true);
      try {
        const [sidebarRes, categoryRes] = await Promise.all([
          axios.get(`${backendGlobalRoute}/api/sidebar/all`),
          axios.get(`${backendGlobalRoute}/api/all-categories`),
        ]);
        setSidebars(Array.isArray(sidebarRes.data) ? sidebarRes.data : []);
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
      } catch {
        setSidebars([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSidebarsAndCategories();
  }, []);

  // Helper to get category name by id
  const getCategoryName = (catId) => {
    const found = categories.find(
      (cat) => cat._id === (catId?._id || catId)
    );
    return found ? found.category_name : catId;
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">All Sidebar Contents</h2>
      {loading ? (
        <div>Loading...</div>
      ) : sidebars.length === 0 ? (
        <div className="text-gray-500">No sidebar content found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-indigo-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Properties</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Display Types</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Locations</th>
              </tr>
            </thead>
            <tbody>
              {sidebars.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 font-semibold text-indigo-700">
                    {getCategoryName(item.categoryId)}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.propertyValues && Object.keys(item.propertyValues).length > 0
                      ? Object.entries(item.propertyValues).map(([k, v]) => (
                          <div key={k} className="text-xs">
                            <span className="font-semibold">{k}:</span> {Array.isArray(v) ? v.join(", ") : v}
                          </div>
                        ))
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.displayTypes && Object.keys(item.displayTypes).length > 0
                      ? Object.entries(item.displayTypes).map(([k, v]) => (
                          <div key={k} className="text-xs">
                            <span className="font-semibold">{k}:</span> {v}
                          </div>
                        ))
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {item.locations && item.locations.length > 0
                      ? item.locations.map((loc, i) => (
                          <div key={i} className="text-xs">{loc}</div>
                        ))
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllSidebar;
