import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../components/common_components/AuthContext";
import {
  FiHome,
  FiBox,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import backendGlobalRoute from "../../config/config";

const OutletDashboard = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [counts, setCounts] = useState({
    totalOrders: 0,
    statusCounts: {},
  });

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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/my-account");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch total orders separately
        const totalOrdersResponse = await axios.get(
          `${backendGlobalRoute}/api/get-total-order-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch delivery status counts
        const deliveryStatusResponse = await axios.get(
          `${backendGlobalRoute}/api/get-delivery-status-counts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCounts({
          totalOrders: totalOrdersResponse.data.totalOrders || 0,
          statusCounts: deliveryStatusResponse.data.statusCounts || {},
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const filteredCards = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return [
      {
        title: "Total Orders",
        value: counts.totalOrders,
        link: "/all-orders",
        bgColor: "bg-blue-100",
        textColor: "text-blue-500",
      },
      ...Object.entries(counts.statusCounts).map(([status, value]) => ({
        title: `${status} Orders`,
        value,
        link: "/all-orders",
        bgColor: getCardBgColor(status),
        textColor: getCardTextColor(status),
      })),
    ].filter((card) => card.title.toLowerCase().includes(lowerKeyword));
  };

  const getCardBgColor = (status) => {
    const colors = {
      Assigned: "bg-teal-100",
      "Picked Up": "bg-indigo-100",
      "Out for Delivery": "bg-cyan-100",
      Pending: "bg-yellow-100",
      Shipped: "bg-green-100",
      Delivered: "bg-lime-100",
      "Not Delivered": "bg-red-100",
      Returned: "bg-pink-100",
      Cancelled: "bg-gray-100",
    };
    return colors[status] || "bg-gray-100";
  };

  const getCardTextColor = (status) => {
    const colors = {
      Assigned: "text-teal-500",
      "Picked Up": "text-indigo-500",
      "Out for Delivery": "text-cyan-500",
      Pending: "text-yellow-500",
      Shipped: "text-green-500",
      Delivered: "text-lime-500",
      "Not Delivered": "text-red-500",
      Returned: "text-pink-500",
      Cancelled: "text-gray-500",
    };
    return colors[status] || "text-gray-500";
  };

  const cardsToRender = filteredCards(searchTerm);

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row w-full md:w-5/6 mx-auto py-6 px-4 gap-6">
        {/* Modern Left Navigation */}
        <div className="w-full md:w-1/5 p-4 bg-gray-50 shadow-md rounded-lg">
          <ul className="space-y-4">
            <li>
              <Link
                to={`/${
                  role === "superadmin"
                    ? `superadmin-dashboard/${id}`
                    : role === "admin"
                    ? `admin-dashboard/${id}`
                    : role === "employee"
                    ? `employee-dashboard/${id}`
                    : role === "outlet"
                    ? `outlet-dashboard/${id}`
                    : role === "vendor"
                    ? `vendor-dashboard/${id}`
                    : `user-dashboard/${id}`
                }`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiHome size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/my-orders/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiBox size={20} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/addresses/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
              >
                <FiMapPin size={20} />
                <span>Addresses</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${id}`}
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
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
                className="flex items-center gap-4 p-3 rounded-lg text-gray-800 hover:bg-maroon-500 hover:text-orange-700 hover:underline"
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
            <div>
              <p className="text-3xl font-semibold text-gray-700">
                Outlet Dashboard
              </p>
            </div>
            <div className="relative w-1/2 md:w-1/3">
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full shadow focus:outline-none focus:ring focus:ring-blue-300"
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                <FiSearch size={20} />
              </span>
            </div>
          </div>

          {/* Filtered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-3">
            {cardsToRender.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className={`relative card h-full ${card.bgColor} border-0 shadow hover:scale-105 transition-transform`}
              >
                <div className="card-body text-center">
                  <h5 className={`card-title text-gray-900`}>{card.title}</h5>
                  <p className={`card-text ${card.textColor} text-2xl`}>
                    {card.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletDashboard;
