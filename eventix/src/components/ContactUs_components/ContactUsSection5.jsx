"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Phone } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backendGlobalRoute from "../../config/config";
import rose from "../../assets/images/rose.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const ContactUsSection5 = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    message_text: "",
    agreeToLicense: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data being sent:", formData);

    try {
      const response = await axios.post(
        `${backendGlobalRoute}/api/add-contact-message`,
        formData
      );

      if (response.status === 201) {
        await axios.post(`${backendGlobalRoute}/api/send-contact-email`, {
          to: "eventrixofficial@gmail.com",
          subject: "New Contact Form Submission",
          message: `
            Name: ${formData.firstName}
            Email: ${formData.email}
            Phone: ${formData.phone}
            Message: ${formData.message_text}
          `,
        }).then((response) => {
          console.log("Email sent response:", response.data); // Log success response
        }).catch((error) => {
          console.error("Error sending email:", error.response?.data || error.message); // Log detailed error
        });

        await axios.post(`${backendGlobalRoute}/api/send-contact-email`, {
          to: formData.email,
          subject: "Thank You for Your Feedback",
          message: `Dear ${formData.firstName},\n\nThank you for reaching out to us. We appreciate your feedback and will get back to you shortly.\n\nBest regards,\nEventrix Team`,
        });

        toast.success(
          "Message successfully sent! You will be notified within 24 hours.",
          { position: "top-right" }
        );

        setFormData({
          firstName: "",
          email: "",
          phone: "",
          message_text: "",
          agreeToLicense: false,
        });
        navigate("/contact-us");
      }
    } catch (error) {
      console.error(
        "Error submitting contact message:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "There was an issue submitting your message. Please try again.",
        { position: "top-right" }
      );
    }
  };

  return (
    <div
      className="relative bg-cover bg-center py-16 px-6 overflow-hidden" // Added `overflow-hidden`
      style={{
        backgroundImage: `url(${rose})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-transparent"></div>
      <ToastContainer />
      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-serif text-[#c2a792] mb-4">Contact</h2>
          <p className="font-bold text-gray-800">Address</p>
          <p className="text-gray-600">NO 167, 5th Main, Industrial Suburb Near ESIC Hospital, Peenya II stage Bangalore-560022</p>
          <div className="flex items-center gap-2 mt-4">
            < Phone className="text-gray-700" />
            <p className="font-bold text-gray-800">+91 9141180962</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Mail className="text-gray-700" />
            <p className="text-gray-800 font-bold">eventrixofficial@gmail.com</p>
          </div>
          <p className="font-bold mt-6">Follow us</p>
          <div className="flex gap-4 mt-2">
            <Facebook className="text-gray-800 w-6 h-6 cursor-pointer hover:text-[#3b5998]" />
            <Instagram className="text-gray-800 w-6 h-6 cursor-pointer hover:text-[#e4405f]" />
            <Linkedin className="text-gray-800 w-6 h-6 cursor-pointer hover:text-[#0077b5]" />
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-[500px] left-[70px] bg-[#d4c4b5] p-8 rounded-lg relative">
          <h3 className="text-2xl font-serif text-gray-800 mb-4 ">Write to us!</h3>
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Jane"
            />

            <label className="block text-sm font-bold mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="abc@gamil.com"
            />

            <label className="block text-sm font-bold mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="+123456789"
            />

            <label className="block text-sm font-bold mb-1">Message</label>
            <textarea
              name="message_text"
              value={formData.message_text}
              onChange={handleChange}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded h-24"
              placeholder="Write your message"
            ></textarea>

            <label className="block text-sm font-bold mb-1">
              <input
                type="checkbox"
                name="agreeToLicense"
                checked={formData.agreeToLicense}
                onChange={handleChange}
                required
              />
              I agree to the terms and conditions
            </label>
            <button
              type="submit"
              className="bg-[#443a3a] text-white py-2 px-6 font-semibold 
                  rounded-tl-[30px] rounded-br-[30px] shadow-2xl 
                  w-[31%] transition duration-300 
                  hover:shadow-white ml-[290px]"
            >
              SEND
            </button>
          </form>
        </div>
      </div>
      <div className="text-center text-white text-base absolute bottom-0 w-full">
        © 2025 Eventrix. All rights reserved.
      </div>
      <div className="absolute bottom-[100px] left-[200px] text-black font-serif font-semibold">
        <div className="flex items-center space-x-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          <span className="text-gray-800">|</span>
          <a href="all-blogs" className="hover:text-gray-400">Blog</a>
          <span className="text-gray-800 ">|</span>
          <a href="/services" className="hover:text-gray-400">All Services</a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsSection5;
