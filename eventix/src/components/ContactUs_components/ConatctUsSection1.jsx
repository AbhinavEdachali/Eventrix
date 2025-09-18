import React, { useRef, useContext } from "react";
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import abc from "../../assets/images/abcd.jpg";
import { AuthContext } from "../../components/common_components/AuthContext";

const AboutUsHero = ({ scrollToSection5 }) => {
    const endOfPageRef = useRef(null);
    const { user, logout } = useContext(AuthContext);

    const scrollToEnd = () => {
        endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div>
            <header className="w-full absolute top-2 left-0 z-50 bg-transparent text-white font-semibold">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
                    {/* Replace Icons Section with Big Text */}
                    <div className="absolute left-[-50px] mt-9 font-serif text-black text-5xl font-bold">
                        EVENTRIX
                    </div>

                    {/* Navigation Section */}
                    <nav className="absolute left-[525px] mt-9 flex justify-center items-center space-x-8 text-white text-sm tracking-widest font-medium">
                        <a href="all-blogs" className="hover:text-gray-300">BLOG</a>
                        <a href="/" className="hover:text-gray-300">HOME</a>
                        <a href="/about-us" className="hover:text-gray-300">ABOUT</a>
                    </nav>

                    {/* Heart Icon Button (Visible only if logged in) */}
                    {user && (
                        <div className="absolute right-[30px] mt-9">
                            <a
                                href="/shortlistpage"
                                className="text-2xl text-black hover:text-red-500 transition duration-300"
                            >
                                <FaRegHeart />
                            </a>
                        </div>
                    )}

                    {/* Service Button Section */}
                    <div className="absolute right-[70px] mt-9">
                        <a
                            href="/services"
                            className="border bg-[#ffebda] text-black border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-black hover:bg-white transition duration-300"
                        >
                            BOOK YOUR SESSION
                        </a>
                    </div>

                    {/* Account Section */}
                    <div className="absolute right-[-60px] mt-9 group">
                        {user ? (
                            <div className="relative">
                                <span
                                    className="cursor-pointer text-black"
                                    onClick={() => window.location.href = `/user-dashboard/${user.id}`}
                                >
                                    {user.name}
                                </span>
                                {/* Logout hover button removed */}
                            </div>
                        ) : (
                            <div className="relative">
                                <button className="cursor-pointer text-black">ACCOUNT</button>
                                <ul className="absolute left-0 hidden group-hover:block bg-transparent text-black text-left min-w-[100px] z-50">
                                    <li>
                                        <a className="block px-2 py-1" href="/login">
                                            Login
                                        </a>
                                    </li>
                                    <li>
                                        <a className="block px-2 py-1" href="/register">
                                            Sign Up
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <section className="relative w-full h-screen flex items-center justify-start bg-[#F9F6F2] px-10 lg:px-32">
    <div className="max-w-lg z-10">
        <h1 className="text-[55px] leading-none font-serif text-[#C4A991] whitespace-nowrap">
        CRAFTED WIT<span className="text-white">H LOVE</span>
        </h1>
        <h2 className="text-lg font-semibold text-gray-800 mt-4">
            Elegant Planning, Seamless Execution
        </h2>
        <p className="text-gray-600 mt-4">
            We craft unforgettable weddings — from venues to décor,
            <br />
            we handle it all with style and care.
        </p>
        <button
            className="mt-6 px-8 py-3 bg-[#3D3144] text-white font-semibold 
            rounded-tl-[30px] rounded-br-[30px] shadow-md w-[50%] hover:bg-[#2B1E2D]"
            onClick={scrollToSection5}
        >
            CONTACT US
        </button>
        <div className="flex space-x-4 mt-6">
                        <a href="#" className="text-gray-600 text-2xl">&#xf09a;</a>
                        <a href="#" className="text-gray-600 text-2xl">&#xf16d;</a>
                        <a href="#" className="text-gray-600 text-2xl">&#xf0e1;</a>
                    </div>
    </div>
    <div className="absolute right-20 top-50 w-3/5 h-full flex items-center justify-center">
        <div className="relative w-[100%] h-[150%] bottom-[50%] rounded-t-[48%] bg-white/70 shadow-lg overflow-hidden">
            <img
                src={abc}
                alt="Wedding Couple"
                className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    </div>
    <div ref={endOfPageRef} className="h-0"></div>
</section>

        </div>
    );
};

export default AboutUsHero;
