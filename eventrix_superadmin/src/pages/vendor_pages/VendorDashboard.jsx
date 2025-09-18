import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/common_components/AuthContext";
import { FiHome, FiBox, FiUser, FiLogOut } from "react-icons/fi";
import backendGlobalRoute from "../../config/config";

const VendorDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [productsCount, setProductsCount] = useState(0);
  const [rawMaterialsCount, setRawMaterialsCount] = useState(0);

  // Decode token and set user details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setId(decodedToken.id);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
        navigate("/my-account");
      }
    } else {
      logout();
      navigate("/my-account");
    }
  }, [logout, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  // Fetch vendor's product and raw material counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch product count
        const productsResponse = await axios.get(
          `${backendGlobalRoute}/api/all-added-products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const vendorProducts = productsResponse.data.filter(
          (product) => product.vendor && product.vendor.toString() === id
        );
        setProductsCount(vendorProducts.length);

        // Fetch raw material count
        const rawMaterialsResponse = await axios.get(
          `${backendGlobalRoute}/api/all-raw-materials`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const vendorRawMaterials = rawMaterialsResponse.data.filter(
          (rawMaterial) => rawMaterial.vendor && rawMaterial.vendor._id === id
        );
        setRawMaterialsCount(vendorRawMaterials.length);
      } catch (error) {
        console.error("Error fetching vendor counts:", error);
      }
    };

    if (id) {
      fetchCounts();
    }
  }, [id]);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Left Navigation */}
        <div className="w-full md:w-1/5 bg-gray-50 shadow-md rounded-lg p-4 self-start">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "vendor"
                    ? `vendor-dashboard/${id}`
                    : `user-dashboard/${id}`
                }`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-gray-200 hover:text-blue-700"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-gray-200 hover:text-blue-700"
              >
                <FiUser size={20} />
                <span>Account Details</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                  navigate("/my-account");
                }}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-gray-200 hover:text-red-700"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-3xl font-semibold text-gray-700">
              Vendor Dashboard
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Products Card */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Products
              </h3>
              <p className="text-gray-600">
                Total Products:{" "}
                <span className="text-blue-500 font-semibold">
                  {productsCount}
                </span>
              </p>
              <Link
                to={`/vendor-products/${id}`}
                className="text-blue-600 hover:underline mt-3 block"
              >
                View Products
              </Link>
            </div>

            {/* Raw Materials Card */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                Raw Materials
              </h3>
              <p className="text-gray-600">
                Total Raw Materials:{" "}
                <span className="text-green-500 font-semibold">
                  {rawMaterialsCount}
                </span>
              </p>
              <Link
                to={`/vendor-raw-materials/${id}`}
                className="text-green-600 hover:underline mt-3 block"
              >
                View Raw Materials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
