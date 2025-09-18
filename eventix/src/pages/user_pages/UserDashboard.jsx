import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/common_components/AuthContext";
import backendGlobalRoute from "../../config/config";
import { FaInstagram, FaFacebookF, FaPinterestP, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import Footer from "../../components/footer_components/Footer";
import jsPDF from "jspdf";

const UserDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token: contextToken, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();
  const [bookings, setBookings] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Try to get token from context or localStorage
  const token = contextToken || localStorage.getItem("token");

  useEffect(() => {
    console.log("UserDashboard Auth Debug:", { user, contextToken, token });
    const fetchUser = async () => {
      if (!token) {
        setErrorMsg("You are not authenticated. Please log in again.");
        setLoading(false);
        return;
      }
      try {
        const apiUrl = `${backendGlobalRoute}/api/user/${id}`;
        console.log("Fetching user from:", apiUrl);
        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.error("Non-JSON response:", text);
          setErrorMsg("Server error: Non-JSON response received");
          setUserData(null);
          setLoading(false);
          return;
        }

        console.log("User fetch response:", data);

        if (!res.ok) {
          setErrorMsg(data.message || "Failed to fetch user");
          setUserData(null);
        } else {
          setUserData(data);
          setErrorMsg("");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setErrorMsg("Network error or server not reachable: " + err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token, user, contextToken]);

  // When userData loads, sync editForm
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  // Fetch bookings for the user
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData?._id) return;
      try {
        const token = contextToken || localStorage.getItem("token");
        const res = await axios.get(
          `${backendGlobalRoute}/api/book/user/${userData._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data || []);
      } catch (err) {
        setBookings([]);
      }
    };
    fetchBookings();
  }, [userData, contextToken]);

  // Fetch shortlist for the user
  useEffect(() => {
    const fetchShortlist = async () => {
      if (!userData?._id) return;
      try {
        const token = contextToken || localStorage.getItem("token");
        const res = await axios.get(
          `${backendGlobalRoute}/api/shortlist/${userData._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShortlist(res.data || []);
      } catch (err) {
        setShortlist([]);
      }
    };
    fetchShortlist();
  }, [userData, contextToken]);

  // Fetch categories for the dashboard
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-categories`);
        setCategories(res.data || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch reviews made by the logged in user
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userData?._id) return;
      try {
        const res = await axios.get(
          `${backendGlobalRoute}/api/allreviews`
        );
        // Only keep reviews where userId matches the logged in user
        setReviews((res.data || []).filter(r => r.userId?._id === userData._id || r.userId === userData._id));
      } catch (err) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [userData]);

  // Fetch blogs for the dashboard
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-blogs`);
        setBlogs(res.data || []);
      } catch (err) {
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = contextToken || localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const res = await fetch(
        `${backendGlobalRoute}/api/update-user/${userData._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to update profile");
        return;
      }
      const updated = await res.json();
      setUserData(updated);
      setIsEditing(false);
      setAvatarFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Helper to download booking as PDF
  const handleDownloadPDF = async (booking) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking Receipt", 14, 18);
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 14, 30);
    doc.text(`Date: ${booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : "-"}`, 14, 38);
    doc.text(`Status: ${booking.status}`, 14, 46);
    doc.text(`User: ${userData?.name || ""}`, 14, 54);
    doc.text(`Email: ${userData?.email || ""}`, 14, 62);

    // Product details (fetch if only IDs are present)
    let y = 74;
    if (Array.isArray(booking.products) && booking.products.length > 0) {
      doc.text("Product Details:", 14, y);
      y += 8;
      for (let i = 0; i < booking.products.length; i++) {
        const prod = booking.products[i];
        let productName = "";
        let productId = "";
        // If populated, use product_name, else fetch from backend
        if (prod.product_name) {
          productName = prod.product_name;
          productId = prod.product?._id || prod.product || "";
        } else if (prod.product) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const res = await axios.get(`${backendGlobalRoute}/api/products/${prod.product}`);
            const product = res.data;
            productName = product.product_name || "";
            productId = product._id || prod.product;
          } catch (e) {
            productName = prod.product?.toString() || "Unknown";
            productId = prod.product?.toString() || "";
          }
        } else if (typeof prod === "string") {
          // If just an ID string
          try {
            // eslint-disable-next-line no-await-in-loop
            const res = await axios.get(`${backendGlobalRoute}/api/products/${prod}`);
            const product = res.data;
            productName = product.product_name || "";
            productId = product._id || prod;
          } catch (e) {
            productName = prod;
            productId = prod;
          }
        }
        doc.text(`- ${productName} (ID: ${productId})`, 18, y);
        y += 8;
      }
    } else {
      doc.text("Product Details: None", 14, y);
      y += 8;
    }

    doc.text(`Notes: ${booking.notes || "-"}`, 14, y + 8);

    doc.save(`booking-receipt-${booking._id}.pdf`);
  };

  return (
    <>
      <header className="w-full absolute top-2 left-0 z-50 bg-white text-black">
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
          <nav className="absolute left-[525px] mt-9 flex justify-center items-center space-x-8 text-black text-sm tracking-widest font-medium">
            <a href="/all-blogs" className="hover:text-gray-700">BLOG</a>
            <a href="/contact-us" className="hover:text-gray-700">CONTACT</a>
            <a href="/about-us" className="hover:text-gray-700">ABOUT</a>
          </nav>

          {/* Heart Icon Button (Visible only if logged in) */}
          {user && (
            <div className="absolute right-[30px] mt-9">
              <a
                href="/shortlistpage"
                className="text-2xl hover:text-red-500 transition duration-300 text-black"
              >
                <FaRegHeart />
              </a>
            </div>
          )}

          {/* Service Button Section */}
          <div className="absolute right-[70px] mt-9">
            <a
              href="/services"
              className="border border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-white hover:bg-orange-200 transition duration-300 text-black"
            >
              BOOK YOUR SESSION
            </a>
          </div>

          {/* Account Section */}
          <div className="absolute right-[-60px] mt-9 group">
            {user ? (
              <div className="relative">
                {/* Logout button triggers handleLogout */}
                <button
                  onClick={handleLogout}
                  className=" text-black text-md py-1 px-2 rounded "
                >
                  Logout
                </button>
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
      <div style={{ paddingTop: "120px", background: "white", color: "black" }}>
        {loading && <div className="p-8">Loading...</div>}
        {errorMsg && <div className="p-8 text-red-500">{errorMsg}</div>}
        {!loading && !errorMsg && userData && (
          <div>
            {/* Dashboard UI */}
            <div className="bg-[#f5f5f5] min-h-screen p-6 grid grid-cols-1 gap-6 text-[#1C1C1E] font-sans">
              {/* Activity Section */}
                
              {/* Account Section */}
              <div className="bg-white rounded-2xl shadow p-6 col-span-1">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-xl font-bold tracking-wide">Account Overview</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage your profile and personal information</p>
                  </div>
                  {!isEditing && (
                    <button
                      className="text-xs px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800 shadow"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-center mt-6 mb-4">
                  <div className="relative group">
                    {isEditing ? (
                      <>
                        {avatarFile ? (
                          <img
                            src={URL.createObjectURL(avatarFile)}
                            alt="Preview"
                            className="w-28 h-28 object-cover rounded-full border-4 border-gray-200 shadow"
                          />
                        ) : userData.avatar ? (
                          <img
                            src={`${backendGlobalRoute}/${userData.avatar.replace(/\\/g, "/")}`}
                            alt="Profile"
                            className="w-28 h-28 object-cover rounded-full border-4 border-gray-200 shadow"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold border-4 border-gray-200 shadow">
                            {userData.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleAvatarChange}
                        />
                        <button
                          type="button"
                          className="absolute bottom-2 right-2 bg-black text-white text-xs px-3 py-1 rounded-full shadow hover:bg-gray-800"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Change
                        </button>
                      </>
                    ) : (
                      <>
                        {userData.avatar ? (
                          <img
                            src={`${backendGlobalRoute}/${userData.avatar.replace(/\\/g, "/")}`}
                            alt="Profile"
                            className="w-28 h-28 object-cover rounded-full border-4 border-gray-200 shadow"
                          />
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold border-4 border-gray-200 shadow">
                            {userData.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {!isEditing ? (
                    <div className="w-full mt-4 text-center">
                      <div className="text-xl font-semibold">{userData.name}</div>
                      <div className="text-sm text-gray-600">{userData.email}</div>
                      {userData.phone && (
                        <div className="text-sm text-gray-600">{userData.phone}</div>
                      )}
                      {userData.role && (
                        <div className="inline-block mt-2 px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded-full capitalize font-medium">
                          {userData.role}
                        </div>
                      )}
                    </div>
                  ) : (
                    <form className="w-full mt-4" onSubmit={handleEditSubmit}>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          placeholder="Name"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          placeholder="Email"
                          type="email"
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          placeholder="Phone"
                        />
                      </div>
                      <div className="flex gap-2 mt-4 justify-center">
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-5 py-1 rounded-full font-semibold shadow hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-gray-400 text-white px-5 py-1 rounded-full font-semibold shadow hover:bg-gray-500"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              name: userData.name || "",
                              email: userData.email || "",
                              phone: userData.phone || "",
                            });
                            setAvatarFile(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              {/* My Bookings as Progress Statistics Style */}
              <div className="bg-white rounded-2xl shadow p-6 col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Bookings</h2>
                  <button
                    className="bg-purple-700 text-white px-4 py-1 rounded-full text-xs hover:bg-purple-800 transition"
                    onClick={() => alert(`Total bookings: ${bookings.length}\n\n${bookings.map(b => (b.products?.[0]?.product_name || "Product")).join(", ")}`)}
                  >
                    Show All Bookings
                  </button>
                </div>
                <div className="flex flex-wrap gap-8 mb-6">
                  <div className="flex-1 min-w-[180px] bg-purple-50 rounded-xl p-4 flex flex-col items-center shadow">
                    <span className="text-3xl font-bold text-purple-700">{bookings.length}</span>
                    <span className="text-sm text-gray-600 mt-1">Total Bookings</span>
                  </div>
                  <div className="flex-1 min-w-[180px] bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
                    <span className="text-3xl font-bold text-green-700">
                      {bookings.filter(b => b.status === "confirmed").length}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">Confirmed</span>
                  </div>
                  <div className="flex-1 min-w-[180px] bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow">
                    <span className="text-3xl font-bold text-yellow-700">
                      {bookings.filter(b => b.status === "pending").length}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">Pending</span>
                  </div>
                  <div className="flex-1 min-w-[180px] bg-red-50 rounded-xl p-4 flex flex-col items-center shadow">
                    <span className="text-3xl font-bold text-red-700">
                      {bookings.filter(b => b.status === "cancelled").length}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">Cancelled</span>
                  </div>
                </div>
                {/* Bookings Table with vertical scroll if more than 3 rows */}
                <div
                  className="overflow-x-auto"
                  style={
                    bookings.length > 2
                      ? { maxHeight: "160px", overflowY: "auto", paddingRight: "8px" }
                      : {}
                  }
                >
                  <table className="min-w-full border rounded-lg overflow-hidden bg-white shadow">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="py-2 px-4 text-left">Product</th>
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Notes</th>
                        <th className="py-2 px-4 text-center">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-gray-500 text-center py-8">
                            Book Your Session!
                          </td>
                        </tr>
                      ) : (
                        bookings.slice(0, 5).map((booking, idx) => (
                          <tr key={booking._id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-2 px-4 flex items-center gap-2">
                              {booking.products?.[0]?.product_image && (
                                <img
                                  src={`${backendGlobalRoute}/${booking.products[0].product_image.replace(/\\/g, "/")}`}
                                  alt="Product"
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <span className="font-medium">
                                {booking.products?.[0]?.product_name || "Product"}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              {booking.bookingDate
                                ? new Date(booking.bookingDate).toLocaleString()
                                : "-"}
                            </td>
                            <td className="py-2 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : booking.status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-sm text-gray-600">
                              {booking.notes
                                ? booking.notes.length > 30
                                  ? booking.notes.slice(0, 30) + "..."
                                  : booking.notes
                                : "-"}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <button
                                className="bg-black text-white px-4 py-1 rounded-full text-xs hover:bg-gray-800 transition"
                                onClick={() => handleDownloadPDF(booking)}
                              >
                                Download PDF
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {bookings.length > 5 && (
                    <div className="text-center mt-2 text-xs text-gray-500">
                      Showing {Math.min(5, bookings.length)} of {bookings.length} bookings.
                    </div>
                  )}
                </div>
              </div>

              {/* Categories and Shortlist Row */}
              <div className="w-full flex flex-col lg:flex-row gap-6 col-span-3">
                {/* Categories Section (small) */}
                <div className="bg-white rounded-2xl shadow p-6 flex-1 flex flex-col min-w-[260px] max-w-[400px] border border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      Categories
                    </h2>
                    
                   <div className="flex mt-[-8px]">
                      <span className="text-xs text-gray-500 mt-[15px] mr-5">{categories.length} items</span>
                      {categories.length > 3 && (
                        <div className="text-center mt-2">
                          <button
      className="text-xs bg-blue-100 text-blue-700 px-4 py-1 rounded-full hover:bg-blue-200 transition"
      onClick={() => navigate("/services")}
    >
      Show More
    </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {categories.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No categories found.</div>
                  ) : (
                    <div className="space-y-4">
                      {categories.slice(0, 4).map((cat, idx) => (
                        <div
                          key={cat._id}
                          className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 shadow hover:bg-blue-100 transition"
                        >
                          {cat.category_image ? (
                            <img
                              src={`${backendGlobalRoute}/${cat.category_image.replace(/\\/g, "/")}`}
                              alt={cat.category_name}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">
                              ?
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-base truncate">{cat.category_name}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {cat.description && cat.description.length > 10
                                ? cat.description.slice(0, 10) + "..."
                                : cat.description || ""}
                            </div>
                          </div>
                          <a
                            href={`/category/${cat._id}`}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
                          >
                            View
                          </a>
                        </div>
                      ))}
                      
                    </div>
                  )}
                </div>
                {/* Reviews Section (replaces wide categories) */}
                <div className="bg-white rounded-2xl shadow p-6 flex-[2] flex flex-col min-w-[260px] border border-green-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-green-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      My Reviews
                    </h2>
                   <div className="flex ">
                     <span className="text-xs text-gray-500 mt-[12px] mr-3">{reviews.length} reviews</span>
                     {reviews.length > 3 && (
                        <div className="text-center mt-2">
                          <button
                            className="text-xs bg-green-100 text-green-700 px-4 py-1 rounded-full hover:bg-green-200 transition"
                            onClick={() => alert("Show more reviews coming soon!")}
                          >
                            Show More
                          </button>
                        </div>
                      )}
                   </div>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">Review Product!</div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.slice(0, 3).map((review, idx) => (
                        <div
                          key={review._id}
                          className="flex items-start gap-4 bg-green-50 rounded-lg p-3 shadow hover:bg-green-100 transition"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-green-300 flex items-center justify-center text-lg font-bold text-white">
                              {review.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{review.rating}★</div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base truncate">{review.productName || "Product"}</div>
                            <div className="text-xs text-gray-700 mt-1 mb-1">
                              {review.reviewContent && review.reviewContent.length > 100
                                ? review.reviewContent.slice(0, 100) + "..."
                                : review.reviewContent || ""}
                            </div>
                            {review.photos && review.photos.length > 0 && (
                              <div className="flex gap-2 mt-1">
                                {review.photos.slice(0, 2).map((photo, i) => (
                                  <img
                                    key={i}
                                    src={`${backendGlobalRoute}/${photo.replace(/\\/g, "/")}`}
                                    alt="Review"
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ))}
                                {review.photos.length > 2 && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    +{review.photos.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                            {review.adminResponse && (
                              <div className="text-xs text-green-800 mt-2 bg-green-100 rounded px-2 py-1">
                                <span className="font-semibold">Admin:</span> {review.adminResponse}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                     
                    </div>
                  )}
                </div>

                {/* Shortlist Section */}
                <div className="bg-white rounded-2xl shadow p-6 flex-1 flex flex-col min-w-[260px] max-w-[400px] border border-purple-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-purple-700 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
                      My Shortlist
                    </h2>
                    <span className="text-xs text-gray-500">{shortlist.length} items</span>
                  </div>
                  {shortlist.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No shortlisted products.</div>
                  ) : (
                    <div className="space-y-4">
                      {shortlist.slice(0, 4).map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 bg-purple-50 rounded-lg p-3 shadow hover:bg-purple-100 transition"
                        >
                          {item.productId?.product_image ? (
                            <img
                              src={`${backendGlobalRoute}/${item.productId.product_image.replace(/\\/g, "/")}`}
                              alt={item.productId.product_name}
                              className="w-14 h-14 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">
                              ?
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base truncate">{item.productId?.product_name || "Product"}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {item.productId?.description && item.productId.description.length > 8
                                ? item.productId.description.slice(0, 8) + "..."
                                : item.productId?.description || ""}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={`/product/${item.productId?._id}`}
                              className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition block"
                              style={{ maxWidth: "80px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                      {shortlist.length > 3 && (
                        <div className="text-center mt-2">
                          <button
                            className="text-xs bg-purple-100 text-purple-700 px-4 py-1 rounded-full hover:bg-purple-200 transition"
                            onClick={() => alert("Show more shortlist coming soon!")}
                          >
                            Show More
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Blogs Section */}
              <div className=" rounded-2xl  p-6 col-span-3 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-pink-600 rounded-full"></span>
                    Latest Blogs
                  </h2>
                  <span className="text-sm text-gray-500">{blogs.length} blogs</span>
                </div>
                {blogs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No blogs found.</div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {blogs.slice(0, 3).map((blog) => (
                      <div
                        key={blog._id}
                        className="bg-pink-50 rounded-xl p-4 flex flex-col shadow hover:bg-pink-100 transition border border-pink-100"
                      >
                        {blog.featuredImage && (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <div className="font-semibold text-base truncate">{blog.title}</div>
                        <div className="text-xs text-gray-500 mt-1 mb-2 truncate">
                          {blog.summary && blog.summary.length > 80
                            ? blog.summary.slice(0, 80) + "..."
                            : blog.summary || ""}
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            {blog.publishedDate
                              ? new Date(blog.publishedDate).toLocaleDateString()
                              : ""}
                          </span>
                          <a
                            href={`/single-blog/${blog._id}`}
                            className="text-xs bg-pink-600 text-white px-3 py-1 rounded-full hover:bg-pink-700 transition"
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default UserDashboard;
