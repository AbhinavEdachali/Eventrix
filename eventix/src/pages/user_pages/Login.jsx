import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../components/common_components/AuthContext";
import { MdLogin } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import backendGlobalRoute from "../../config/config.js"; // Ensure correct API base URL
import Footer from "../../components/footer_components/Footer";
import bgImg from "../../assets/images/home2.jpeg"; // <-- import your background image
import { FaRegHeart } from "react-icons/fa";

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="w-full absolute top-2 left-0 z-50 bg-transparent text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Icons Section */}
        <div
          style={{ position: "absolute", top: "20px", left: "-70px" }}
          className="absolute left-[-50px] font-serif text-black text-5xl font-bold"
        >
          <button
            onClick={() => (window.location.href = "/")}
            className="text-black hover:text-gray-500 transition duration-300"
          >
            EVENTRIX
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="absolute left-[525px] mt-7 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
          <a href="all-blogs" className="hover:text-gray-300">BLOG</a>
          <a href="/contact-us" className="hover:text-gray-300">CONTACT</a>
          <a href="/about-us" className="hover:text-gray-300">ABOUT</a>
        </nav>

        {/* Heart Icon Button (Visible only if logged in) */}
        {user && (
          <div className="absolute right-[30px] mt-9">
            <a
              href="/shortlistpage"
              className=" text-2xl hover:text-red-500 transition duration-300"
            >
              <FaRegHeart />
            </a>
          </div>
        )}

        {/* Service Button Section */}
        <div className="absolute right-[70px] mt-9">
          <a
            href="/services"
            className="border border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-white hover:bg-black transition duration-300"
          >
            BOOK YOUR SESSION
          </a>
        </div>

        {/* Account Section */}
        <div className="absolute right-[-60px] mt-9 group">
          {user ? (
            <div className="relative">
              <span
                className="cursor-pointer"
                onClick={() => navigate(`/user-dashboard/${user.id}`)}
              >
                {user.name}
              </span>
              {/* Logout button removed */}
            </div>
          ) : (
            <div className="relative">
              <button className="cursor-pointer">ACCOUNT</button>
              <ul className="absolute left-0 hidden group-hover:block bg-transparent text-black text-left min-w-[100px] z-50">
                <li>
                  <a className="block px-2 py-1 " href="/login">
                    Login
                  </a>
                </li>
                <li>
                  <a
                    className="block px-2 py-1 "
                    href="/register"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false); // Toast state
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

    // Debug: log formData
    console.log("Login formData:", formData);

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${backendGlobalRoute}/api/login`, {
        ...formData,
        loginType: "email",
      });

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (token && user) {
        login(token); // Save token and decode user details in context
        setShowToast(true); // Show toast
        setTimeout(() => {
          setShowToast(false);
          navigate(`/${user.role}-dashboard/${user._id}`);
        }, 1500); // 1.5s delay before redirect
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      // Debug: log error response
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <Header />
      {/* Toast message */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-all">
          Login successful! Redirecting...
        </div>
      )}
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex flex-1 flex-col justify-center lg:px-12 mt-12 mb-12 w-[500px] max-w-2xl bg-white bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md"
          style={{ height: "470px", minHeight: "470px", maxHeight: "570px" }}
        >
          <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
            {/* Removed <MdLogin /> icon */}
            <h2 className="text-center text-2xl font-bold tracking-tight text-gray-800  mb-2">
              Log in to your account
            </h2>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
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
                className="flex-none rounded-md bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:via-teal-600 hover:to-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full"
              >
                Sign in
              </button>
            </form>
            <p className="mt-10 text-center text-lg text-gray-800">
              Need an account?{" "}
              <a
                href="/register"
                className="font-semibold text-red-600 hover:text-black"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
