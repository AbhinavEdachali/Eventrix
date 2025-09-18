import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import backendGlobalRoute from "../../config/config";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      fetchUserData(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `${backendGlobalRoute}/api/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUserData(response.data);
      console.log("Fetched user data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = () => {
    navigate(`/update-profile/${userData._id}`);
  };

  const getImageUrl = (avatar, role) => {
    if (typeof avatar === "string" && avatar.startsWith("uploads/")) {
      const parts = avatar.split("/");
      if (parts[1] !== role) {
        parts[1] = role;
      }
      return `${backendGlobalRoute}/${parts.join("/")}`;
    }
    if (typeof avatar === "string") {
      return `${backendGlobalRoute}/uploads/${role}/${avatar}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <img
          src={getImageUrl(userData.avatar, userData.role)}
          alt={userData.name}
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-0 sm:mr-6"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />

        <div className="w-full">
          <h3 className="text-xl font-bold text-gray-900">
            Profile Information
          </h3>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <ProfileField
                icon={<FaUser className="text-indigo-600 mr-2" />}
                label="Full Name"
                value={userData.name}
              />
              <ProfileField
                icon={<FaEnvelope className="text-indigo-600 mr-2" />}
                label="Email Address"
                value={userData.email}
              />
              <ProfileField
                icon={<FaPhone className="text-indigo-600 mr-2" />}
                label="Phone"
                value={userData.phone || "N/A"}
              />
              <ProfileField
                icon={<FaUserShield className="text-indigo-600 mr-2" />}
                label="Role"
                value={userData.role}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-indigo-600 mr-2" />}
                label="Street"
                value={userData.address?.street || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-indigo-600 mr-2" />}
                label="City"
                value={userData.address?.city || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-indigo-600 mr-2" />}
                label="State"
                value={userData.address?.state || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-indigo-600 mr-2" />}
                label="Postal Code"
                value={userData.address?.postalCode || "N/A"}
              />
              <ProfileField
                icon={<FaMapMarkerAlt className="text-indigo-600 mr-2" />}
                label="Country"
                value={userData.address?.country || "N/A"}
              />
            </dl>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpdateProfile}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
            >
              <MdEdit className="mr-2" />
              Update Billing Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );
}
