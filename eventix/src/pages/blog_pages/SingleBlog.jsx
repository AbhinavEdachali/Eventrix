import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaTh,
  FaAlignLeft,
  FaAlignRight,
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaRegHeart,
} from "react-icons/fa";
import { AuthContext } from "../../components/common_components/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import Footer from "../../components/footer_components/Footer";

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [view, setView] = useState("right-sidebar");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!isValidObjectId(id)) {
      console.error("Invalid blog ID");
      return;
    }

    const controller = new AbortController();
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/single-blogs/${id}`,
          { signal: controller.signal }
        );
        setBlog(preprocessBlogDescription(response.data));
      } catch (error) {
        console.error(
          "Error fetching the blog:",
          error.response || error.message
        );
      }
    };

    fetchBlog();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const response = await axios.get(`${backendGlobalRoute}/api/all-blogs`);
        setRelatedBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error("Error fetching related blogs:", error);
      }
    };

    fetchRelatedBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = relatedBlogs.filter((b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(relatedBlogs);
    }
  }, [searchTerm, relatedBlogs]);

  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

  const preprocessBlogDescription = (blog) => {
    if (!blog || !blog.body) return blog;

    const paragraphs = blog.body.split("\n");
    const sections = [];
    let currentSection = [];

    paragraphs.forEach((paragraph) => {
      const trimmed = paragraph.trim();

      if (trimmed.endsWith("?")) {
        if (currentSection.length > 0) {
          sections.push(currentSection);
          currentSection = [];
        }
        sections.push([{ type: "question", text: trimmed }]);
      } else if (
        currentSection.length > 0 &&
        currentSection[0].type === "question"
      ) {
        sections.push([{ type: "answer", text: trimmed }]);
      } else {
        currentSection.push({ type: "text", text: trimmed });
      }
    });

    if (currentSection.length > 0) {
      sections.push(currentSection);
    }

    return { ...blog, processedBody: sections };
  };

  const renderDescription = () => {
    if (!blog || !blog.processedBody) return null;

    return blog.processedBody.map((section, index) => (
      <div key={index} className="mb-8">
        {section.map((content, idx) => {
          if (content.type === "question") {
            return (
              <p key={idx} className="font-bold text-lg mb-4 mt-6">
                {content.text}
              </p>
            );
          } else if (content.type === "answer") {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-blue-500 pl-4 text-gray-700 italic mb-6"
              >
                {content.text}
              </blockquote>
            );
          } else {
            return (
              <p key={idx} className="text-gray-800 text-lg mb-4">
                {content.text}
              </p>
            );
          }
        })}
      </div>
    ));
  };

  const renderSidebar = () => (
    <div className="p-4 mt-4 lg:w-80 border border-gray-200 rounded-md">
      {/* Author */}
      <div className="mb-4">
        <div className="text-base text-gray-700">
          <span className="font-semibold">Author:</span>{" "}
          {blog.author?.name || "Unknown"}
        </div>
      </div>
      {/* Categories */}
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-bold text-left border-b mb-0 mr-2">Category:</h3>
        <span className="text-base text-gray-700">
          {blog && blog.category ? blog.category : ""}
        </span>
      </div>
      {/* Summary */}
      {blog.summary && (
        <div className="mb-4 text-gray-600">
          <span className="font-semibold">Summary:</span> {blog.summary}
        </div>
      )}
      {/* Tags */}
      <h3 className="text-lg font-bold mb-2 text-left border-b">Tags</h3>
      <div className="flex flex-wrap mb-4">
        {blog &&
          blog.tags &&
          blog.tags.map((tag, index) => (
            <button
              key={index}
              className="text-xs bg-gray-200 text-gray-700 p-2 mr-2 mb-2 rounded"
            >
              {tag}
            </button>
          ))}
      </div>
      {/* Blogs */}
      <h3 className="text-lg font-bold mb-4 text-left border-b">Blogs</h3>
      <ul className="mb-4">
        {filteredBlogs
          .filter((relatedBlog) => relatedBlog._id !== blog?._id)
          .map((relatedBlog) => (
            <li
              key={relatedBlog._id}
              className="flex items-center mb-4 cursor-pointer border-b"
              onClick={() => navigate(`/single-blog/${relatedBlog._id}`)}
            >
              <img
                src={
                  relatedBlog.featuredImage || "https://via.placeholder.com/100"
                }
                alt={relatedBlog.title}
                className="w-12 h-12 mr-2 rounded-md"
              />
              <div className="text-sm">
                <Link to={`/single-blog/${relatedBlog._id}`}>
                  {relatedBlog.title}
                </Link>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );

  const handlePreviousNextNavigation = (direction) => {
    const currentIndex = relatedBlogs.findIndex((b) => b._id === blog?._id);

    if (direction === "previous") {
      const previousIndex =
        currentIndex === 0 ? relatedBlogs.length - 1 : currentIndex - 1;
      navigate(`/single-blog/${relatedBlogs[previousIndex]._id}`);
    } else if (direction === "next") {
      const nextIndex =
        currentIndex === relatedBlogs.length - 1 ? 0 : currentIndex + 1;
      navigate(`/single-blog/${relatedBlogs[nextIndex]._id}`);
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <>
      {/* Header Section */}
      <header className="w-full top-2 left-0 z-50 bg-transparent text-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          {/* Icons Section */}
          <div
              style={{ position: "absolute", top: "26px", left: "-70px" }}
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
          <nav className="absolute left-[525px] mt-9 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
            <a href="all-blogs" className="hover:text-gray-500">BLOG</a>
            <a href="/contact-us" className="hover:text-gray-500">CONTACT</a>
            <a href="/about-us" className="hover:text-gray-500">ABOUT</a>
          </nav>

          {/* Heart Icon Button (Visible only if logged in) */}
          {user && (
            <div className="absolute right-[10px] mt-9">
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
                {/* Logout hover button removed */}
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

      <motion.div
        className="max-w-7xl mx-auto p-4 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <div className="flex space-x-2">
            <FaTh
              className={`cursor-pointer ${
                view === "wide" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("wide")}
            />
            <FaAlignLeft
              className={`cursor-pointer ${
                view === "left-sidebar" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("left-sidebar")}
            />
            <FaAlignRight
              className={`cursor-pointer ${
                view === "right-sidebar" ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => setView("right-sidebar")}
            />
          </div>
        </div>
        <p className="text-gray-600 mb-4 text-left">{`Published on ${new Date(
          blog.publishedDate
        ).toLocaleDateString()}`}</p>

        <div className="flex lg:flex-row flex-col">
          {view === "left-sidebar" && (
            <div className="lg:w-1/4 w-full lg:mr-8 mb-8 lg:mb-0">
              {renderSidebar()}
            </div>
          )}
          <div className="flex-1">
            <motion.img
              src={
                blog.featuredImage
                  ? `${backendGlobalRoute}/${blog.featuredImage.replace(
                      /\\/g,
                      "/"
                    )}`
                  : "https://via.placeholder.com/800x400"
              }
              alt={blog.title}
              className="w-full h-auto p-4 object-cover rounded-lg"
            />
            {renderDescription()}
          </div>
          {view === "right-sidebar" && (
            <div className="lg:w-1/4 w-full lg:ml-8 mb-8 lg:mb-0">
              {renderSidebar()}
            </div>
          )}
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default SingleBlog;
