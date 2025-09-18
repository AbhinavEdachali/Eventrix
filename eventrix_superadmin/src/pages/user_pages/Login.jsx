import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/common_components/AuthContext";
import { MdLogin } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import backendGlobalRoute from "../../config/config.js"; // Ensure correct API base URL

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email-password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${backendGlobalRoute}/api/login`, {
        ...formData,
        loginType: "email",
      });

      const { token, user } = response.data;

      if (token && user) {
        login(token); // Save token and decode user details in context
        navigate(`/${user.role}-dashboard/${user._id}`);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 lg:px-8 mb-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <MdLogin className="mx-auto h-12 w-12 text-gray-600" />
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-600">
          Log in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-900"
              >
                Password
              </label>
              <div>
                <a
                  href="/forgot-password"
                  className="font-semibold text-red-600"
                >
                  forgot password ?
                </a>
              </div>
            </div>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400"
            />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-200 rounded"
          >
            Sign in
          </button>
        </form>
        <p className="mt-10 text-center text-lg text-gray-800">
          Need an account?{" "}
          <a
            href="/register"
            className="font-semibold text-orange-500 hover:text-black"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
