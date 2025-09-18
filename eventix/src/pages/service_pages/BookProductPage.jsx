import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/common_components/AuthContext"; // Import AuthContext
import { FaRegHeart, FaMapMarkerAlt, FaRegImage, FaPen, FaShareAlt, FaHeart, FaStar } from "react-icons/fa";
import Footer from "../../components/footer_components/Footer";
import Modal from "react-modal";

// Header component as described in your prompt
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
                onClick={() => navigate(`/user-dashboard/${user.id || user._id}`)}
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

// Add for Modal accessibility
Modal.setAppElement("#root");

const BookProductPage = () => {
  const { user: authUser } = useContext(AuthContext); // Get user from AuthContext
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    user: "",
    email: "",
    products: [],
    vendor: "",
    outlet: "",
    bookingDate: "",
    notes: "",
    paymentMethod: "cod",
    cardNumber: "",
    cardName: "",
    cardExpiryMM: "",
    cardExpiryYY: "",
    cardCVV: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigate = useNavigate();

  // Helper to get query params
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const productId = query.get("productId");

  // Debug log
  useEffect(() => {
    console.log("BookProductPage: productId", productId, "authUser", authUser);
  }, [productId, authUser]);

  useEffect(() => {
    const fetchUserAndProduct = async () => {
      try {
        // Use AuthContext user id if available
        let userId = authUser?.id || authUser?._id;
        if (!userId) {
          // fallback to token-based fetch if not in context
          const token = localStorage.getItem("token");
          const userRes = await axios.get(
            `${backendGlobalRoute}/api/user`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(userRes.data);
          userId = userRes.data._id;
          setForm((prev) => ({
            ...prev,
            user: userRes.data._id,
            email: userRes.data.email,
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            user: userId,
            email: authUser.email,
          }));
        }

        // Fetch product details
        if (productId) {
          const prodRes = await axios.get(
            `${backendGlobalRoute}/api/products/${productId}`
          );
          setProduct(prodRes.data);
          setForm((prev) => ({
            ...prev,
            products: [
              {
                product: prodRes.data._id,
                product_image: prodRes.data.product_image,
              },
            ],
            vendor: prodRes.data.vendor?._id || "",
            outlet: prodRes.data.outlets?.[0]?._id || "",
          }));
        }
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProduct();
    // eslint-disable-next-line
  }, [productId, authUser]);

  // Fetch reviews for average rating
  useEffect(() => {
    if (productId) {
      axios
        .get(`${backendGlobalRoute}/api/allreviews?productId=${productId}`)
        .then((res) => setReviews(res.data || []))
        .catch(() => setReviews([]));
    }
  }, [productId]);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Combine MM and YYYY for card expiry
  const getCardExpiry = () => {
    const mm = form.cardExpiryMM.padStart(2, "0");
    let yyyy = form.cardExpiryYY;
    if (yyyy.length === 2) yyyy = `20${yyyy}`;
    return mm && yyyy ? `${mm}/${yyyy}` : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        bookingDate: form.bookingDate ? new Date(form.bookingDate) : new Date(),
      };
      if (payload.paymentMethod === "card") {
        payload.cardExpiry = getCardExpiry();
      }
      // Remove card fields if paymentMethod is not card
      if (payload.paymentMethod !== "card") {
        delete payload.cardNumber;
        delete payload.cardName;
        delete payload.cardExpiry;
        delete payload.cardExpiryMM;
        delete payload.cardExpiryYY;
        delete payload.cardCVV;
      } else {
        delete payload.cardExpiryMM;
        delete payload.cardExpiryYY;
      }
      await axios.post(
        `${backendGlobalRoute}/api/book/add`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking successful!");
      // Redirect to the user's dashboard after booking
      const userId = authUser?.id || authUser?._id || user?.id || user?._id;
      if (userId) {
        navigate(`/user-dashboard/${userId}`);
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert("Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!loading && !productId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No product selected for booking.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load product details. Please check the URL or try again.
      </div>
    );
  }

  // Leaflet expects [lat, lng] format, but some APIs give [lng, lat]
  const locationCoords = Array.isArray(product.location?.coordinates)
    ? [product.location.coordinates[1], product.location.coordinates[0]]
    : null;

  return (
    <>
      <Header />
      <div className="w-full bg-gray-50 mt-20">
        {/* Top Image + Price + Contact Card */}
        <div className="flex flex-col lg:flex-row gap-x-6 w-full max-w-7xl mx-auto mt-6">
          {/* Left Image Section */}
          <div className="lg:w-[750px] relative">
            <img
              src={
                product.product_image
                  ? `${backendGlobalRoute}/${product.product_image.replace(/\\/g, "/")}`
                  : "/placeholder.jpg"
              }
              alt={product.product_name}
              className="w-full h-[400px] object-cover"
            />
            {/* Average Rating Badge - now right of the name container */}
            <div className="absolute left-9 bg-white px-4 py-4 shadow-md w-[90%] top-[350px] h-[120px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl">{product.product_name}</h2>
                  {locationCoords && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 w-full">
                      <FaMapMarkerAlt className="text-black flex-shrink-0" />
                      <p className="text-gray-600 text-sm break-all flex-1">
                        {product.location?.address}
                      </p>
                      <button
                        onClick={() => setIsMapOpen(true)}
                        className="text-sm text-cyan-600 px-2 py-1 ml-auto whitespace-nowrap"
                        style={{ minWidth: "fit-content" }}
                      >
                        (View on Map)
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex items-center">
                  <div className="bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md flex items-center">
                    <span className="mr-1">★</span>
                    <span>{averageRating}</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Additional Photos Section moved below main image and booking form */}
            <div className="max-w-7xl mx-auto bg-transparent mt-24  p-4 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold border-b-2 border-pink-600 pb-1">Additional Photos</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {product.all_product_images?.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${backendGlobalRoute}/${img.replace(/\\/g, "/")}`}
                    alt={`Product Image ${idx + 1}`}
                    className="rounded"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Booking Form Container - Right Side */}
          <div className="lg:w-2/5 w-full p-4 lg:pr-6 space-y-6">
            {/* Price Section */}
            <div className="p-4 bg-white border">
              <div className="text-left text-sm text-gray-600 mb-2 font-bold">Price</div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold text-gray-800">₹{product.selling_price.toFixed(2)}</div>
                  {product.display_price && (
                    <div className="text-sm text-gray-500 line-through mt-1">
                      ₹{product.display_price.toFixed(2)}
                    </div>
                  )}
                </div>
                {product.display_price && (
                  <div className="text-green-600 font-semibold text-lg">
                    You Save: ₹{(product.display_price - product.selling_price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            {/* Booking Form */}
            <div className="p-4 bg-white border">
              <h3 className="text-base mb-4">
                Fill out this form to book the product.
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    value={authUser?.name || user?.name || ""}
                    disabled
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    name="email"
                    onChange={handleChange}
                    className="w-full border p-2 rounded bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Product</label>
                  <input
                    type="text"
                    value={product?.product_name || ""}
                    disabled
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </div>
                {product?.vendor && (
                  <div>
                    <label className="block font-medium">Vendor</label>
                    <input
                      type="text"
                      value={product.vendor.vendor_name}
                      disabled
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  </div>
                )}
                {product?.outlets?.length > 0 && (
                  <div>
                    <label className="block font-medium">Outlet</label>
                    <input
                      type="text"
                      value={product.outlets[0]?.outlet_name || ""}
                      disabled
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-medium">Booking Date</label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={form.bookingDate}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="cod">Cash on Hand</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                {form.paymentMethod === "card" && (
                  <div className="space-y-4 bg-white p-4 rounded-md shadow">
                    <div>
                      <label className="block font-medium">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={form.cardNumber}
                        onChange={handleChange}
                        maxLength={16}
                        pattern="\d*"
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Card Number"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Card Holder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        value={form.cardName}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Name as per card"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block font-medium">Expiry (MM/YYYY)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="cardExpiryMM"
                            value={form.cardExpiryMM}
                            onChange={handleChange}
                            maxLength={2}
                            pattern="\d*"
                            required
                            className="w-16 border rounded p-2"
                            placeholder="MM"
                          />
                          <span className="self-center">/</span>
                          <input
                            type="text"
                            name="cardExpiryYY"
                            value={form.cardExpiryYY}
                            onChange={handleChange}
                            maxLength={4}
                            pattern="\d*"
                            required
                            className="w-20 border rounded p-2"
                            placeholder="YYYY"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block font-medium">CVV</label>
                        <input
                          type="password"
                          name="cardCVV"
                          value={form.cardCVV}
                          onChange={handleChange}
                          maxLength={4}
                          pattern="\d*"
                          required
                          className="w-full border rounded p-2"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block font-medium">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    placeholder="Additional notes (optional)"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded"
                  disabled={submitting}
                >
                  {submitting ? "Booking..." : "Book Now"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Map Modal */}
        <Modal
          isOpen={isMapOpen}
          onRequestClose={() => setIsMapOpen(false)}
          className="relative w-[80vw] max-w-4xl h-[70vh] bg-white rounded-lg shadow-lg p-0 overflow-hidden"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
        >
          <div className="absolute top-3 right-3 z-50">
            <button
              onClick={() => setIsMapOpen(false)}
              className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex h-full">
            {/* Map Section */}
            <div className="w-2/3 h-full">
              {locationCoords ? (
                <iframe
                  title="Product Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${locationCoords[0]},${locationCoords[1]}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Location data is not available.
                </div>
              )}
            </div>
            {/* Address Section */}
            <div className="w-1/3 bg-white p-6 border-l overflow-y-auto">
              <h3 className="text-xl font-semibold mb-2">{product.product_name}</h3>
              <p className="text-sm text-gray-500">
                {product.location?.address || "Address not available"}
              </p>
            </div>
          </div>
        </Modal>
        {/* About and Product Properties Section */}
        <div className="container mx-auto bg-white mt-7 border p-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              About {product.product_name} - {product.category?.category_name || "Category"}
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-700">{product.description || "No description available."}</p>
                <div className="mt-4 text-sm text-gray-600">
                  <h3 className="font-semibold">Location</h3>
                  <p>Located in {product.location?.address || "Address not available"}.</p>
                </div>
              </div>
              {product?.vendor && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600">Vendor Details</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="">Name:</span> {product.vendor.vendor_name}
                    </p>
                    <p>
                      <span className="">Email:</span> {product.vendor.vendor_email}
                    </p>
                    <p>
                      <span className="">Phone:</span> {product.vendor.vendor_phone}
                    </p>
                  </div>
                </div>
              )}
              {product?.outlets?.length > 0 && (
                <div className="space-y-4">
                  <h3 className=" font-semibold text-gray-600">Outlet Details</h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="">Name:</span> {product.outlets[0]?.outlet_name}
                    </p>
                    <p>
                      <span className="">Email:</span> {product.outlets[0]?.outlet_email}
                    </p>
                    <p>
                      <span className="">Phone:</span> {product.outlets[0]?.outlet_phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="my-6 border-black border-2" />
          <div>
            <h2 className="text-lg font-semibold mb-4">Product Properties</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
              {product.properties &&
                Object.entries(product.properties).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-semibold capitalize">{key}:</span> {value}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default BookProductPage;
