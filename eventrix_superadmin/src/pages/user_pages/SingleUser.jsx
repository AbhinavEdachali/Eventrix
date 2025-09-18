import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import backendGlobalRoute from "../../config/config";

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success alert

  // Fetch user details by ID
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/user/${id}`, // Correct API endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(response.data); // Store fetched user details in state
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        toast.error("Failed to fetch user details.");
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    fetchUserDetails();
  }, [id]);

  // Handle role update
  const handleRoleUpdate = async () => {
    if (!newRole) {
      toast.error("Please select a role to update.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to update the role to ${newRole}?`
    );
    if (!confirm) return;

    try {
      const response = await axios.put(
        `${backendGlobalRoute}/api/update-user-role/${id}`, // API endpoint for updating role
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Role updated successfully to ${newRole}`);
        setSuccessMessage(
          `Role has been updated from ${user.role} to ${newRole}`
        );
        setUser({ ...user, role: newRole }); // Update role in state
      } else {
        throw new Error(response.data?.message || "Failed to update role.");
      }
    } catch (error) {
      console.error("Error updating role:", error.message);
      toast.error("Failed to update role. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10 shadow p-5 rounded z-10">
      <h1 className="text-3xl font-bold mb-6">{user.name}'s Profile</h1>

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Success!</strong> {successMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg">
        <p className="mb-4">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="mb-4">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="mb-4">
          <strong>Role:</strong> {user.role}
        </p>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Update Role</label>
          <select
            className="border w-full p-2 rounded"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="vendor">Vendor</option>
            <option value="outlet">Outlet</option>
            <option value="user">User / Customer</option>
            <option value="delivery_agent">Delivery Agent</option>
          </select>
        </div>
        <button
          onClick={handleRoleUpdate}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-pill transition-colors"
        >
          Update Role
        </button>
      </div>
    </div>
  );
};

export default SingleUser;
