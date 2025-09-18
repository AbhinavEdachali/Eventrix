import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa"; // Import icon for password fields
import backendGlobalRoute from "../../config/config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and otp from location state
  const email = location.state?.email;
  const otp = location.state?.otp;

  // Handle new password input change
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle password reset submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    console.log("Reset Password Attempt:");
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("New Password:", newPassword);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendGlobalRoute}/api/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );
      console.log("Password reset response:", response.data);
      alert("Password reset successfully! Redirecting to login page...");
      navigate("/login");
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <FaLock className="text-red-600 mx-auto mb-2" size={48} />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaLock className="text-blue-500 mr-2" /> New Password
            </label>
            <div className="mt-2">
              <input
                id="new-password"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={handleNewPasswordChange}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaLock className="text-purple-500 mr-2" /> Confirm New Password
            </label>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700"
            >
              Reset Password
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
