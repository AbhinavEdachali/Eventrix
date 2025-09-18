import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import Header from "../../components/header_components/Header";
import Footer from "../../components/footer_components/Footer";
import bgImg from "../../assets/images/home2.jpeg"; // same background as login

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    gstNumber: "",
    registerWithGST: false,
    promotionalConsent: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // new state for server errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    const formErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      formErrors.email = "Invalid email format.";

    if (!passwordRegex.test(formData.password))
      formErrors.password = "Password must be strong.";

    if (formData.registerWithGST && !formData.companyName) {
      formErrors.companyName = "Company name is required.";
    }

    if (formData.registerWithGST && !formData.gstNumber) {
      formErrors.gstNumber = "GST number is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // clear previous server error
    if (validateForm()) {
      try {
        await axios.post(`${backendGlobalRoute}/api/register`, formData);
        alert("Registration Successful. Redirecting to login page.");
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Unable to register. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex flex-col justify-center mt-12 mb-12 w-[500px] max-w-2xl bg-white bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md px-8 py-6"
          style={{ minHeight: "520px", maxHeight: "700px" }}
        >
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-800 mb-4">
            Create a new account
          </h2>
          {serverError && (
            <div className="mb-4 text-center text-red-600 text-base font-medium">
              {serverError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto">
            <div>
              <label className="block text-base font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="registerWithGST"
                checked={formData.registerWithGST}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-900">
                Register with GST?
              </label>
            </div>

            {formData.registerWithGST && (
              <>
                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-900">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
                  />
                  {errors.gstNumber && (
                    <p className="text-sm text-red-600">{errors.gstNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Company Email
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="promotionalConsent"
                checked={formData.promotionalConsent}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-900">
                I agree to receive promotional emails.
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:via-teal-600 hover:to-indigo-600"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-lg text-gray-800">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-red-600 hover:text-black"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
