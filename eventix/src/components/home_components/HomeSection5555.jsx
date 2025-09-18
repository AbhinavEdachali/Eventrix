import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#fdfaf5] flex justify-center items-center py-10">
      <div className="w-full max-w-7xl flex flex-row justify-between px-10">
        {/* Left Navigation */}
        <div className="w-1/4">
          <h3 className="text-gray-500 tracking-wide">NAVIGATE</h3>
          <ul className="mt-4 space-y-2 text-lg">
            <li className="font-semibold">HOME</li>
            <li className="font-semibold">ABOUT</li>
            <li className="font-semibold">SERVICES</li>
            <li className="font-semibold">GALLERY</li>
            <li className="font-semibold">CONTACT</li>
          </ul>
        </div>

        {/* Center Content */}
        <div className="w-1/2 text-center">
          <h2 className="text-4xl font-bold">JOIN THE LIST</h2>
          <p className="mt-2 text-lg text-gray-600">
            Sign up to receive my free elopement preparation checklist!
          </p>
          <div className="mt-6 flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 px-4 py-3 w-72 rounded-md text-lg"
            />
            <button className="bg-gray-100 px-6 py-3 ml-2 text-lg font-semibold rounded-md">
              SIGN UP
            </button>
          </div>
        </div>

        {/* Right Connect Section */}
        <div className="w-1/4 text-right">
          <h3 className="text-gray-500 tracking-wide">CONNECT</h3>
          <ul className="mt-4 space-y-2 text-lg">
            <li className="font-semibold">BOOK A SESSION</li>
            <li className="font-semibold">EMAIL HAILEY</li>
            <li className="font-semibold">CLIENT PORTAL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
