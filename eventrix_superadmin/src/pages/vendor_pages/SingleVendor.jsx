import React, { useEffect, useState } from "react";
import { FaUser, FaEdit, FaBox, FaBuilding } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export default function SingleVendor() {
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedVendor, setUpdatedVendor] = useState({});
  const { vendorId } = useParams();

  // Fetch vendor details
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        // Fetch Vendor Details
        const vendorResponse = await axios.get(
          `${backendGlobalRoute}/api/get-vendor-by-id/${vendorId}`
        );
        setVendorData(vendorResponse.data);
        setUpdatedVendor(vendorResponse.data);

        // Fetch All Products and Filter by Vendor ID
        const productsResponse = await axios.get(
          "${backendGlobalRoute}/api/all-added-products"
        );
        const vendorProducts = productsResponse.data.filter(
          (product) => product.vendor && product.vendor.toString() === vendorId
        );
        setProducts(vendorProducts);
      } catch (error) {
        console.error("Error fetching vendor data or products:", error);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  // Update Vendor Details
  const handleUpdateVendor = async () => {
    try {
      await axios.put(`${backendGlobalRoute}/api/updatae-vendor/${vendorId}`, {
        ...updatedVendor,
      });
      alert("Vendor details updated successfully!");
      setVendorData(updatedVendor);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor details. Please try again.");
    }
  };

  const handleChange = (field, value) => {
    setUpdatedVendor({ ...updatedVendor, [field]: value });
  };

  if (!vendorData) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Vendor Details - Left Side */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vendor Details
          </h2>
          <div className="divide-y divide-gray-200">
            {/* Dynamic Fields */}
            {[
              { label: "Vendor Name", key: "vendor_name", icon: <FaUser /> },
              { label: "Email", key: "vendor_email", icon: <FaUser /> },
              { label: "Phone", key: "vendor_phone", icon: <FaUser /> },
              {
                label: "Company Name",
                key: "company_name",
                icon: <FaBuilding />,
              },
            ].map((field) => (
              <div
                className="py-4 flex items-center justify-between"
                key={field.key}
              >
                <div className="flex items-center">
                  <span className="text-indigo-600 mr-2">{field.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {field.label}:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedVendor[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    <span className="text-gray-900">
                      {vendorData[field.key]}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Edit Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() =>
                  editMode ? handleUpdateVendor() : setEditMode(true)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {editMode ? "Save Changes" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {/* Products - Right Side */}
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Vendor Products
          </h2>
          {products.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li
                  key={product._id}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <FaBox className="text-green-500 mr-2" />
                    <Link
                      to={`/single-product/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.product_name}
                    </Link>
                  </div>
                  <span className="text-gray-500">Stock: {product.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No products available for this vendor.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
