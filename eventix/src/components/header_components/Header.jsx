import React, { useContext } from "react";
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../../components/common_components/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="w-full absolute top-2 left-0 z-50 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Icons Section */}
        <div className="absolute left-[-50px] mt-9 flex items-center space-x-4 text-white text-lg">
          <FaInstagram />
          <FaFacebookF />
          <FaPinterestP />
        </div>

        {/* Navigation Section */}
        <nav className="absolute left-[525px] mt-9 flex justify-center items-center space-x-8 text-white text-sm tracking-widest font-medium">
          <a href="/all-blogs" className="hover:text-gray-300">BLOG</a>
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
            className="border border-white text-sm tracking-widest px-8 py-3 rounded-full hover:text-black hover:bg-white transition duration-300"
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
              <button
                onClick={logout}
                className="absolute hidden group-hover:block bg-transparent text-white text-sm py-1 px-2 rounded shadow-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="relative">
              <button className="cursor-pointer">ACCOUNT</button>
              <ul className="absolute left-0 hidden group-hover:block bg-transparent text-white text-left min-w-[100px] z-50">
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

export default Header;

