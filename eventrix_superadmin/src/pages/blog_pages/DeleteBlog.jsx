import React, { useEffect, useState } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const DeleteBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendGlobalRoute}/api/all-blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage("Failed to fetch blogs.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      // Use the correct backend route (should match your backend route)
      await axios.delete(`${backendGlobalRoute}/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Blog deleted successfully.");
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (err) {
      setMessage("Failed to delete blog.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Delete Blogs</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : blogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="relative bg-white rounded shadow p-4 flex flex-col"
            >
              <button
                onClick={() => handleDelete(blog._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-700"
                title="Delete Blog"
              >
                Delete
              </button>
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
              <div className="text-gray-500 text-xs mb-2">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
              </div>
              <div className="text-gray-700 line-clamp-3 mb-2">{blog.summary || blog.body?.slice(0, 100) + "..."}</div>
              <div className="text-xs text-gray-400">By: {blog.author?.name || blog.author || "Unknown"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteBlog;
