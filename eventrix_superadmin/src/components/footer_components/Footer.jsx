import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Import icons
import { useState } from 'react'; // Import useState for newsletter functionality
import axios from 'axios';
import backendGlobalRoute from '../../config/config';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendGlobalRoute}/api/subscribe`, { email });
      setMessage(response.data.message);
      setEmail(''); // Clear the input field
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <footer className="bg-[#EAE8E1] text-gray-800 px-6 md:px-16 mx-2 py-8 text-base mt-2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-6">
        <div>
          <h3 className="font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="/contact-us" className="hover:text-gray-900">Contact Us</a>
            </li>
            <li>
              <a href="/faq" className="hover:text-gray-900">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="/about-us" className="hover:text-gray-900">About Us</a>
            </li>
            <li>
              <a href="/all-blogs" className="hover:text-gray-900">Blog</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Subscribe to Our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 px-3 py-2 w-full sm:w-auto sm:flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition"
            >
              Subscribe
            </button>
          </form>
          {message && <p className="text-gray-500 mt-2">{message}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex justify-between items-center mt-4">
        <div className="text-gray-400 text-sm">
          © 2025 Eventrix. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
            <FaFacebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
