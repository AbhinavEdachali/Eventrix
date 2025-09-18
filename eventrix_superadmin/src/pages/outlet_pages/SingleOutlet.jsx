import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaBox,
} from "react-icons/fa";
import backendGlobalRoute from "../../config/config";

const SingleOutlet = () => {
  const { outletId } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [products, setProducts] = useState([]); // Separate state for products
  const [loading, setLoading] = useState(true);

  // Fetch outlet details
  useEffect(() => {
    const fetchOutletDetails = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/get-outlet-by-id/${outletId}`
        );
        setOutlet(response.data);
      } catch (error) {
        console.error("Error fetching outlet details:", error);
      }
    };

    fetchOutletDetails();
  }, [outletId]);

  // Fetch products for the outlet
  useEffect(() => {
    const fetchOutletProducts = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/products-by-outlet/${outletId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching outlet products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletProducts();
  }, [outletId]);

  if (loading) {
    return <div>Loading outlet details...</div>;
  }

  if (!outlet) {
    return <div>Outlet not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Column - Outlet Details */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold leading-7 text-gray-900">
              Outlet Information
            </h3>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Link to="/all-outlets">
                <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow text-sm hover:opacity-90 transition-opacity">
                  Go to All Outlets
                </button>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-6">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaUser className="text-indigo-600 mr-2" /> Outlet Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {outlet.outlet_name}
                </dd>
              </div>
              {/* Other details */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <FaBuilding className="text-blue-600 mr-2" /> Company Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {outlet.company_name}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column - Outlet Products */}
        <div>
          <h3 className="text-lg font-semibold leading-7 text-gray-900 mb-4">
            Products ({products.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product._id || index}
                  className={`rounded-lg shadow p-4 flex flex-col items-center text-center ${
                    product.stock <= 5
                      ? "bg-red-500 text-white animate-pulse"
                      : product.stock <= 20
                      ? "bg-yellow-300 text-gray-900"
                      : "bg-green-200 text-gray-900"
                  }`}
                >
                  {product.product_image ? (
                    <img
                      src={`${backendGlobalRoute}/${product.product_image}`}
                      alt={product.product_name}
                      className="h-16 w-16 object-cover rounded-full mb-2"
                    />
                  ) : (
                    <FaBox className="text-3xl" />
                  )}
                  <p className="mt-2 text-sm font-medium">
                    {product.product_name}
                  </p>
                  <p className="mt-1 text-xs">
                    Stock: {product.stock || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>No products available for this outlet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOutlet;
