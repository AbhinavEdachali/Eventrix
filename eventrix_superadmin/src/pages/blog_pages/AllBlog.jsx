import React, { useEffect, useState } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${backendGlobalRoute}/api/all-blogs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlogs(res.data);
      } catch (error) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Blogs</h2>
      {blogs.length === 0 ? (
        <div>No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded shadow p-4">
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600">{blog.summary}</p>
              <div className="text-sm text-gray-500 mt-2">
                Author: {blog.author?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-500">
                Published: {blog.published ? "Yes" : "No"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(blog.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBlog;
