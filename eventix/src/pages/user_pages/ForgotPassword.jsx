import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey } from "react-icons/fa"; // Import icons
import backendGlobalRoute from "../../config/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Send OTP to user's email
  const handleSendOtp = async () => {
    try {
      await axios.post(`${backendGlobalRoute}/api/forgot-password`, {
        email,
      });
      alert("OTP sent successfully to your email!");
      setOtpSent(true);
      setError("");
    } catch (error) {
      setError("Failed to send OTP. Please check your email and try again.");
    }
  };

  // Verify OTP and proceed to reset password
  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${backendGlobalRoute}/api/verify-otp`, {
        email,
        otp,
      });
      alert("OTP verified! Redirecting to reset password page...");
      navigate("/reset-password", { state: { email, otp } }); // Pass both email and otp
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <FaKey className="text-gray-600 mx-auto mb-2" size={48} />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-600">
          Forgot Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
            >
              <FaEnvelope className="text-blue-500 mr-2" /> Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleSendOtp}
                className="flex-none rounded-md bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:via-teal-600 hover:to-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full"
              >
                Send OTP
              </button>
            </div>
          </div>

          {otpSent && (
            <>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  <FaKey className="text-purple-500 mr-2" /> OTP
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="flex-none rounded-md bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:via-teal-600 hover:to-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
