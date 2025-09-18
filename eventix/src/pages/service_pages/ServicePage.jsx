import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import backendGlobalRoute from "../../config/config";
import "./ServicePage.css";
import { AuthContext } from "../../components/common_components/AuthContext";
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa"; // Import icons
import Footer from "../../components/footer_components/Footer";

const ServicePages = () => {
  const { user, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filterText, setFilterText] = useState("");
  const placeholderImage = "/path-to-your-placeholder-image.jpg";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/all-categories`
        );
        setCategories(response.data);
        setFilteredCategories(response.data); // Initialize filtered categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const lowerCaseFilter = filterText.toLowerCase();
    const filtered = categories.filter(
      (category) =>
        category.category_name.toLowerCase().includes(lowerCaseFilter) ||
        (category.tags &&
          category.tags.some((tag) =>
            tag.toLowerCase().includes(lowerCaseFilter)
          ))
    );
    setFilteredCategories(filtered);
  }, [filterText, categories]); // Trigger filtering on filterText or categories change

  return (
    <section>
      {/* Header Section */}
      <div style={{ position: "absolute", top: "0px", left: "0px", width: "100%" }}>
        <header className="w-full bg-white text-black">
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
            <nav
              style={{ position: "absolute", top: "40px", left: "528px" }}
              className="flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium"
            >
              <a href="all-blogs" className="hover:text-gray-500">BLOG</a>
              <a href="/contact-us" className="hover:text-gray-500">CONTACT</a>
              <a href="/about-us" className="hover:text-gray-500">ABOUT</a>
            </nav>

            {/* Heart Icon Button (Visible only if logged in) */}
            {user && (
              <div
                style={{ position: "absolute", top: "40px", right: "30px" }}
                className="flex items-center space-x-4"
              >
                <a
                  href="/shortlistpage"
                  className="text-2xl hover:text-red-500 transition duration-300"
                >
                  <FaRegHeart />
                </a>
              </div>
            )}

            {/* Filter Section */}
            <div
              style={{ position: "absolute", top: "30px", right: "70px" }}
              className="flex items-center"
            >
              <input
                type="text"
                placeholder="Filter by name or tags..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} // Live filtering
                className="border border-black rounded-l px-4 py-2"
              />
            </div>

            {/* Account Section */}
            <div
              style={{ position: "absolute", top: "40px", right: "-60px" }}
              className="group"
            >
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
                      <a className="block px-2 py-1" href="/login">Login</a>
                    </li>
                    <li>
                      <a className="block px-2 py-1" href="/register">Sign Up</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Main Content Section */}
      <div className="projects container mt-28">
        <p className="text-4xl">Explore Our Services</p>

        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <article className="project" key={category._id}>
              <div className="project__img-container">
                <img
                  className="project__img"
                  src={
                    category.category_image
                      ? `${backendGlobalRoute}/${category.category_image.replace(
                          /\\/g,
                          "/"
                        )}`
                      : placeholderImage
                  }
                  alt={category.category_name}
                />
              </div>

              <div className="project__content grid-flow">
                <h3 className="project__title">
                  {category.category_name}
                </h3>

                {/* Dynamically fetched tags, capped at 5 with “+N” toggler */}
                <TagList tags={category.tags} />

                <p>
                  {category.description ||
                    "Provide a summary of your packages right here, and why it's best for them."}
                </p>

                <Link
                  className="project__cta"
                  to={`/category/${category._id}`}
                >
                  View Service
                </Link>
              </div>
            </article>
          ))
        ) : (
          <p className="text-center text-gray-600">No categories found.</p>
        )}
      </div>
      <Footer />
    </section>
  );
};

// New helper component for tag‐list with “show more”
const TagList = ({ tags }) => {
  const [expanded, setExpanded] = useState(false);
  if (!tags || tags.length === 0) return null;

  const limit = 5;
  const visibleTags = expanded ? tags : tags.slice(0, limit);
  const hiddenCount = tags.length - limit;

  return (
    <>
      <ul className="project__tags flex-group" role="list">
        {visibleTags.map((tag, i) => (
          <li key={i} className="project__tag">
            {tag}
          </li>
        ))}

        {!expanded && hiddenCount > 0 && (
          <li
            className="project__tag cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            +{hiddenCount}
          </li>
        )}

        {expanded && tags.length > limit && (
          <li
            className="project__tag project__tag--showless cursor-pointer"
            onClick={() => setExpanded(false)}
          >
            Show less
          </li>
        )}
      </ul>
    </>
  );
};

export default ServicePages;
