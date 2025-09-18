import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import { AuthContext } from "../../components/common_components/AuthContext";
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import Footer from "../../components/footer_components/Footer";

export default function AboutUs() {
  const [vendors, setVendors] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${backendGlobalRoute}/api/all-vendors`)
      .then((res) => setVendors(res.data))
      .catch(() => setVendors([]));

    axios
      .get(`${backendGlobalRoute}/api/all-outlets`)
      .then((res) => setOutlets(res.data))
      .catch(() => setOutlets([]));
  }, []);

  return (
    <section>
      {/* Header Section */}
      <header className="w-full absolute top-2 left-0 z-50 bg-[#EAE8E1] text-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          {/* Icons Section */}
          <div
              style={{ position: "absolute", top: "26px", left: "-50px" }}
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
          <nav className="absolute left-[550px] mt-9 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
            <a href="all-blogs" className="hover:text-gray-500">BLOG</a>
            <a href="/contact-us" className="hover:text-gray-500">CONTACT</a>
            
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
                  onClick={() => window.location.href = `/user-dashboard/${user.id}`}
                >
                  {user.name}
                </span>
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

      <div className="min-h-screen bg-[#EAE8E1] py-10 px-4 sm:px-6 lg:px-8 text-gray-800 mt-5">
        {/* Vendors Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Our Vendors</h2>
          {vendors.length === 0 ? (
            <p className="text-center text-gray-500">No vendors found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <li key={vendor._id} className="bg-white p-5 rounded-lg shadow text-center">
                  <h3 className="font-semibold text-lg">{vendor.vendor_name}</h3>
                  <p className="text-sm text-gray-500">{vendor.vendor_email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Outlets Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Our Outlets</h2>
          {outlets.length === 0 ? (
            <p className="text-center text-gray-500">No outlets found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {outlets.map((outlet) => (
                <li key={outlet._id} className="bg-white p-5 rounded-lg shadow text-center">
                  <h3 className="font-semibold text-lg">{outlet.outlet_name}</h3>
                  <p className="text-sm text-gray-500">{outlet.outlet_email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-700">Why Choose Eventrix?</h2>
          <ul className="text-left list-disc pl-5 space-y-3 text-gray-700">
            <li><strong>Curated Vendors:</strong> Access a wide range of verified vendors for venues, makeup, catering, decoration, and more.</li>
            <li><strong>Customized Packages:</strong> Build personalized event packages based on your preferences and budget.</li>
            <li><strong>Real-Time Availability:</strong> Check availability and book your preferred vendors instantly.</li>
            <li><strong>One-Stop Platform:</strong> Manage your entire wedding or event from planning to execution, all in one place.</li>
            <li><strong>Transparent Pricing:</strong> View detailed pricing with no hidden charges—plan with confidence.</li>
            <li><strong>Location-Based Services:</strong> Discover vendors and outlets based on your location or event venue.</li>
          </ul>
        </div>

        {/* About Us Section */}
        <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Eventrix</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            We're a team of BCA students passionate about tech, design, and events. 
            Eventrix is our way of simplifying event planning by connecting users with the best vendors and outlets, all on one platform. 
            Built with love, for memorable celebrations.
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
}
