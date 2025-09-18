import React, { useState, useEffect } from "react";
import {
  FaThList,
  FaThLarge,
  FaTh,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export default function AllVendors() {
  const [vendors, setVendors] = useState([]);
  const [view, setView] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/all-vendors`
        );
        setVendors(response.data); // Update state with the fetched vendors
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  // Delete a vendor
  const deleteVendor = async (vendorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vendor? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `${backendGlobalRoute}/api/delete-vendor/${vendorId}`
        );
        alert("Vendor deleted successfully.");
        setVendors(vendors.filter((vendor) => vendor._id !== vendorId)); // Update state
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete the vendor. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center flex-wrap">
          {/* Header */}
          <div>
            <h2 className="text-left text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              All Vendors
            </h2>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 flex-wrap">
            {/* View Controls */}
            <FaThList
              className={`text-xl cursor-pointer ${
                view === "list" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("list")}
            />
            <FaThLarge
              className={`text-xl cursor-pointer ${
                view === "card" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("card")}
            />
            <FaTh
              className={`text-xl cursor-pointer ${
                view === "grid" ? "text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setView("grid")}
            />

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Add Vendor Button */}
            <Link to="/add-vendor">
              <button className="ml-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:opacity-90 transition-opacity">
                Add Vendor
              </button>
            </Link>
          </div>
        </div>

        {/* Vendor Display */}
        <div className="mt-10">
          {view === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {vendors
                .filter((vendor) =>
                  vendor.vendor_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((vendor) => (
                  <div
                    key={vendor._id}
                    className="relative bg-white p-4 shadow rounded-lg"
                  >
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`/single-vendor/${vendor._id}`}
                      className="flex flex-col items-start"
                    >
                      <h3 className="text-md font-semibold text-gray-900 text-left">
                        {vendor.vendor_name}
                      </h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}

          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors
                .filter((vendor) =>
                  vendor.vendor_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((vendor) => (
                  <div
                    key={vendor._id}
                    className="relative bg-white p-6 shadow-lg rounded-lg"
                  >
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`/single-vendor/${vendor._id}`}
                      className="flex flex-col items-start"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 text-left">
                        {vendor.vendor_name}
                      </h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}

          {view === "list" && (
            <div className="space-y-6">
              {vendors
                .filter((vendor) =>
                  vendor.vendor_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((vendor) => (
                  <div
                    key={vendor._id}
                    className="relative bg-white p-4 shadow rounded-lg flex items-center space-x-4"
                  >
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`/single-vendor/${vendor._id}`}
                      className="flex-1"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 text-left">
                        {vendor.vendor_name}
                      </h3>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
