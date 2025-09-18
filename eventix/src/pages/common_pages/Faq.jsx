import React, { useState, useContext } from 'react';
import { AuthContext } from '../../components/common_components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";

const faqs = [
  {
    question: "What services do you offer for wedding events?",
    answer:
      "We offer complete wedding planning services including venue selection, decoration, catering, photography, makeup artists, entertainment, and guest management.",
  },
  {
    question: "How far in advance should I book your services?",
    answer:
      "We recommend booking at least 6–12 months in advance to ensure availability and ample time for personalized planning.",
  },
  {
    question: "Can I customize the wedding package?",
    answer:
      "Absolutely! All our packages are fully customizable to suit your preferences, budget, and vision.",
  },
  {
    question: "Do you handle destination weddings?",
    answer:
      "Yes, we specialize in destination weddings and will assist with travel arrangements, logistics, and local vendor coordination.",
  },
  {
    question: "Do you provide vendor recommendations?",
    answer:
      "Yes, we have a network of trusted vendors including photographers, florists, makeup artists, and caterers you can choose from.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 60 days prior to the event will receive a partial refund, minus the planning fees. Please refer to our terms and conditions for full details.",
  },
  {
    question: "Can I see a portfolio of past weddings you’ve planned?",
    answer:
      "Yes, we’d love to share our portfolio! Visit our gallery or contact us to request a personalized presentation.",
  },
];

// Header component as per your prompt
const Header = () => {
  const { user, logout } = useContext(AuthContext);
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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <div className="bg-[#fffaf7] min-h-screen py-16 px-6 md:px-20 mt-11">
        <h2 className="text-4xl font-bold text-center text-pink-700 mb-10 font-cursive">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-pink-200 rounded-xl bg-white shadow-sm transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 font-medium text-pink-800 hover:text-pink-600 focus:outline-none flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <span className="text-2xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
