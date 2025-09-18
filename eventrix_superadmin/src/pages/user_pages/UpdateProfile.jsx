import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import backendGlobalRoute from "../../config/config";

export default function UpdateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
    shipping_address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    avatar: null,
    role: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authorized. Please log in.");
          return navigate("/login");
        }

        const response = await axios.get(
          `${backendGlobalRoute}/api/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedData = response.data;
        setUserData({
          ...fetchedData,
          address: fetchedData.address || {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
          shipping_address: fetchedData.shipping_address || {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [type]: { ...userData[type], [name]: value },
    });
  };

  const handleFileChange = (e) =>
    setUserData({ ...userData, avatar: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return navigate("/login");
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email); // Include email if it's editable
    formData.append("phone", userData.phone);
    formData.append("address", JSON.stringify(userData.address)); // Send as JSON string
    formData.append(
      "shipping_address",
      JSON.stringify(userData.shipping_address)
    ); // Send as JSON string

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    try {
      const response = await axios.put(
        `${backendGlobalRoute}/api/update-user/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully!");
      setUserData(response.data); // Update the state with the response data
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile.");
    }
  };

  const getImageUrl = (avatar, role) => {
    if (typeof avatar === "string" && avatar.startsWith("uploads/")) {
      const parts = avatar.split("/");
      if (parts[1] !== role) {
        parts[1] = role; // Replace the folder with the correct role
      }
      return `${backendGlobalRoute}/${parts.join("/")}`;
    }
    if (typeof avatar === "string") {
      return `${backendGlobalRoute}/uploads/${role}/${avatar}`;
    }
    return "https://via.placeholder.com/150";
  };

  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <img
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          src={getImageUrl(userData.avatar, userData.role)}
          alt={userData.name}
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg sm:rounded-xl mb-4 sm:mb-0 sm:mr-6"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <div className="w-full">
          <h3
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base font-semibold leading-7 text-gray-900 text-left"
          >
            Update Profile
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <EditableField
                  icon={<FaUser className="text-indigo-600 mr-2" />}
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
                <EditableField
                  icon={<FaEnvelope className="text-green-500 mr-2" />}
                  label="Email Address"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
                <EditableField
                  icon={<FaPhone className="text-yellow-500 mr-2" />}
                  label="Phone"
                  name="phone"
                  value={userData.phone || ""}
                  onChange={handleInputChange}
                />
                {["street", "city", "state", "postalCode", "country"].map(
                  (field) => (
                    <EditableField
                      key={field}
                      icon={<FaMapMarkerAlt className="text-blue-500 mr-2" />}
                      label={`Address ${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }`}
                      name={field}
                      value={userData.address[field] || ""}
                      onChange={(e) => handleAddressChange(e, "address")}
                    />
                  )
                )}
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                    Avatar
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <input type="file" onChange={handleFileChange} />
                  </dd>
                </div>
              </dl>
            </div>
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
              className="mt-6 flex justify-center"
            >
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditableField({ icon, label, name, value, onChange }) {
  return (
    <div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
    >
      <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
        {icon} {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </dd>
    </div>
  );
}
