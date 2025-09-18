import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(""); // The ObjectId of the author
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const titleRef = useRef();
  const bodyRef = useRef();
  const authorRef = useRef();
  const summaryRef = useRef();
  const tagsRef = useRef();
  const categoryRef = useRef();
  const seoTitleRef = useRef();
  const metaDescriptionRef = useRef();
  const featuredImageRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.id && user.id.length === 24) {
          setAuthor(user.id);
        } else {
          console.error("Invalid user ID: ", user);
          setAuthor(null);
        }
      } else {
        console.error("No user found in localStorage.");
        setAuthor(null);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setAuthor(null);
    }
  }, []);

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for all fields
    const newErrors = {};
    let firstInvalidRef = null;
    if (!title) {
      newErrors.title = "Title is required.";
      firstInvalidRef = firstInvalidRef || titleRef;
    }
    if (!body) {
      newErrors.body = "Body is required.";
      firstInvalidRef = firstInvalidRef || bodyRef;
    }
    if (!author || author.length !== 24) {
      newErrors.author = "Invalid author ID. Please log in again.";
      firstInvalidRef = firstInvalidRef || authorRef;
    }
    if (!summary) {
      newErrors.summary = "Summary is required.";
      firstInvalidRef = firstInvalidRef || summaryRef;
    }
    if (!tags) {
      newErrors.tags = "Tags are required.";
      firstInvalidRef = firstInvalidRef || tagsRef;
    }
    if (!category) {
      newErrors.category = "Category is required.";
      firstInvalidRef = firstInvalidRef || categoryRef;
    }
    if (!seoTitle) {
      newErrors.seoTitle = "SEO Title is required.";
      firstInvalidRef = firstInvalidRef || seoTitleRef;
    }
    if (!metaDescription) {
      newErrors.metaDescription = "Meta Description is required.";
      firstInvalidRef = firstInvalidRef || metaDescriptionRef;
    }
    if (!featuredImage) {
      newErrors.featuredImage = "Featured image is required.";
      firstInvalidRef = firstInvalidRef || featuredImageRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("author", author);
    formData.append("summary", summary);
    formData.append("tags", tags);
    formData.append("category", category);
    formData.append("seoTitle", seoTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("published", published);
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }

    try {
      const response = await axios.post(
        `${backendGlobalRoute}/api/add-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Blog added successfully!");
      setTitle("");
      setBody("");
      setSummary("");
      setTags("");
      setCategory("");
      setSeoTitle("");
      setMetaDescription("");
      setPublished(false);
      setFeaturedImage(null);
      setErrors({});
      alert("New Blog added successfully.");
    } catch (error) {
      // Handle duplicate key error for any field
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.code === 11000
      ) {
        const keyPattern = error.response.data.error.keyPattern;
        const field = keyPattern ? Object.keys(keyPattern)[0] : "field";
        if (field === "slug" || field === "title") {
          setErrors((prev) => ({
            ...prev,
            title: "A blog with this title already exists. Please use a different title.",
          }));
          setMessage("A blog with this title already exists. Please use a different title.");
          alert("A blog with this title already exists. Please use a different title.");
        } else {
          setMessage(
            `A blog with this ${field} already exists. Please use a different value for ${field}.`
          );
          alert(
            `A blog with this ${field} already exists. Please use a different value for ${field}.`
          );
        }
      } else {
        console.error("There was an error adding the blog!", error);
        setMessage("Error adding blog. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Blog</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            ref={titleRef}
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.title && (
            <span className="block mt-1 text-red-500 text-xs">{errors.title}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
            Body
          </label>
          <textarea
            ref={bodyRef}
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="5"
          ></textarea>
          {errors.body && (
            <span className="block mt-1 text-red-500 text-xs">{errors.body}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
            Summary
          </label>
          <textarea
            ref={summaryRef}
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="2"
          ></textarea>
          {errors.summary && (
            <span className="block mt-1 text-red-500 text-xs">{errors.summary}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            ref={tagsRef}
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.tags && (
            <span className="block mt-1 text-red-500 text-xs">{errors.tags}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            ref={categoryRef}
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.category && (
            <span className="block mt-1 text-red-500 text-xs">{errors.category}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seoTitle">
            SEO Title
          </label>
          <input
            ref={seoTitleRef}
            id="seoTitle"
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.seoTitle && (
            <span className="block mt-1 text-red-500 text-xs">{errors.seoTitle}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metaDescription">
            Meta Description
          </label>
          <textarea
            ref={metaDescriptionRef}
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="2"
          ></textarea>
          {errors.metaDescription && (
            <span className="block mt-1 text-red-500 text-xs">{errors.metaDescription}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            Publish
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="featuredImage">
            Featured Image
          </label>
          <input
            ref={featuredImageRef}
            id="featuredImage"
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.featuredImage && (
            <span className="block mt-1 text-red-500 text-xs">{errors.featuredImage}</span>
          )}
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add Blog
          </button>
        </div>
        {errors.author && (
          <span className="block mt-1 text-red-500 text-xs">{errors.author}</span>
        )}
      </form>
    </div>
  );
}
