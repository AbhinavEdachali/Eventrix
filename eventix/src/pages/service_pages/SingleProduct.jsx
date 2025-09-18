import React, { useEffect, useState, useContext, useRef } from "react"; // Add useRef
import { useParams, Link, useNavigate } from "react-router-dom"; // Add useNavigate
import axios from "axios";
import backendGlobalRoute from "../../config/config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCartPlus, FaMapMarkerAlt, FaStar } from "react-icons/fa"; // Add FaStar to the import
import Modal from "react-modal"; // Import Modal for popup
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaRegImage, FaRegHeart, FaPen, FaShareAlt, FaHeart, FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa"; // Import filled heart icon and additional icons
import { AuthContext } from "../../components/auth_components/AuthManager"; // Import AuthContext
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Footer from "../../components/footer_components/Footer";
// Set the root element for accessibility
Modal.setAppElement("#root");

// Custom icon instance (outside component to avoid recreation)
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SingleProduct = () => {
  const { user, logout } = useContext(AuthContext); // Use user and logout from AuthContext
  const { productId } = useParams();
  const navigate = useNavigate(); // Add this line
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null); // State to store vendor details
  const [outlet, setOutlet] = useState(null); // State to store outlet details
  const [loading, setLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false); // State to control map popup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    functionDate: "",
    message: "", // Add message field
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    reviewContent: "",
    photos: [],
  });
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [isEditing, setIsEditing] = useState(false); // State to track if editing
  const [editingReviewId, setEditingReviewId] = useState(null); // Track the review being edited
  const [selectedRatings, setSelectedRatings] = useState([]); // Track selected ratings for filtering
  const [isShortlisted, setIsShortlisted] = useState(false); // Track if the product is shortlisted

  const reviewFormRef = useRef(null); // Move useRef to the top
  const additionalPhotosRef = useRef(null); // New ref for the additional photos section
  const aboutSectionRef = useRef(null); // New ref for the about section
  const scrollContainerRef = useRef(null); // New ref for the scroll container

  const placeholderImage = "/placeholder.jpg"; // <-- Update with correct path

  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are present
    if (!formData.name || !formData.email || !formData.phone || !formData.functionDate) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit an enquiry.");
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Enquiry for ${product.product_name}`, // Default message if not provided
      functionDate: formData.functionDate,
      productId: product._id, // Include product ID
      productName: product.product_name, // Include product name
      vendorId: vendor?._id || null, // Set to null if vendor is not available
      vendorName: vendor?.vendor_name || null, // Set to null if vendor is not available
      vendorEmail: vendor?.vendor_email || null, // Set to null if vendor is not available
      outletId: outlet?._id || null, // Include outlet ID
      outletName: outlet?.outlet_name || null, // Include outlet name
      outletEmail: outlet?.outlet_email || null, // Include outlet email
      userId: user.id, // Include user ID
      userName: user.username || user.name || "Anonymous", // Use username or fallback to name
    };

    console.log("Submitting enquiry data:", data); // Log the data being sent

    try {
      setIsSubmitting(true); // Show loader
      const response = await axios.post(`${backendGlobalRoute}/api/submit-enquiry`, data);
      alert("Your enquiry has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", functionDate: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting enquiry:", error.response?.data || error.message);
      alert("Failed to send your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewData.rating || !reviewData.reviewContent) {
      alert("Please provide a rating and review content.");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", reviewData.rating);
    formData.append("reviewContent", reviewData.reviewContent);
    Array.from(reviewData.photos).forEach((photo) => formData.append("photos", photo)); // Append multiple photos
    formData.append("username", user.username); // Use user from AuthContext
    formData.append("userId", user.id);
    formData.append("productName", product.product_name);
    formData.append("productId", product._id);

    try {
      await axios.post(`${backendGlobalRoute}/api/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Review submitted successfully!");
      setReviewData({ rating: 0, reviewContent: "", photos: [] });

      // Refresh reviews after successful submission
      const response = await axios.get(`${backendGlobalRoute}/api/allreviews?productId=${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
        await axios.delete(`${backendGlobalRoute}/api/delete/${reviewId}`);
        alert("Review deleted successfully!");
        setReviews(reviews.filter((review) => review._id !== reviewId)); // Remove the deleted review from state
    } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review. Please try again.");
    }
};

const handleEditReview = (review) => {
    setReviewData({
        rating: review.rating,
        reviewContent: review.reviewContent,
        photos: [], // Editing photos is optional; handle it as needed
    });
    setIsEditing(true); // Enable editing mode
    setEditingReviewId(review._id); // Track the review being edited

    // Scroll to the review form
    if (reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
};

const handleUpdateReview = async () => {
    if (!editingReviewId) return;

    const updatedFormData = new FormData();
    updatedFormData.append("rating", reviewData.rating);
    updatedFormData.append("reviewContent", reviewData.reviewContent);
    Array.from(reviewData.photos).forEach((photo) => updatedFormData.append("photos", photo)); // Append multiple photos

    try {
        const response = await axios.put(
            `${backendGlobalRoute}/api/update/${editingReviewId}`,
            updatedFormData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        alert("Review updated successfully!");
        setReviews((prevReviews) =>
            prevReviews.map((r) => (r._id === editingReviewId ? response.data.review : r))
        ); // Update the review in the state
        setIsEditing(false); // Exit editing mode
        setEditingReviewId(null); // Clear the editing review ID
        setReviewData({ rating: 0, reviewContent: "", photos: [] }); // Reset the form
    } catch (error) {
        console.error("Error updating review:", error);
        alert("Failed to update review. Please try again.");
    }
};

// Calculate average rating and rating distribution
const calculateRatingStats = () => {
    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 for 1-star, 1 for 2-star, etc.

    reviews.forEach((review) => {
        ratingCounts[5 - review.rating]++; // Fix: Correct index calculation for ratingCounts
    });

    const averageRating =
        totalReviews > 0
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
            : 0;

    return { averageRating, ratingCounts, totalReviews };
};

const { averageRating, ratingCounts, totalReviews } = calculateRatingStats();

// Handle rating filter
const handleRatingFilter = (rating) => {
    setSelectedRatings((prev) =>
        prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
};

// Filter reviews based on selected ratings
const filteredReviews =
    selectedRatings.length > 0
        ? reviews.filter((review) => selectedRatings.includes(review.rating))
        : reviews;

// Check if the product is already shortlisted
useEffect(() => {
    const fetchShortlistStatus = async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${backendGlobalRoute}/api/shortlist/${user.id}`);
            const shortlistedProducts = response.data.map((item) => item.productId._id);
            setIsShortlisted(shortlistedProducts.includes(productId));
        } catch (error) {
            console.error("Error fetching shortlist status:", error);
        }
    };

    if (productId) {
        fetchShortlistStatus();
    }
}, [productId, user]);

// Handle shortlist toggle
const handleShortlistToggle = async () => {
    if (!user) {
        toast.error("You must be logged in to use the shortlist feature."); // Show error toast
        return;
    }

    try {
        if (isShortlisted) {
            // Remove from shortlist
            await axios.post(`${backendGlobalRoute}/api/shortlist/remove`, {
                userId: user.id,
                productId,
            });
            setIsShortlisted(false);
            toast.info(`${product.product_name} removed from shortlist.`); // Show info toast
        } else {
            // Add to shortlist
            await axios.post(`${backendGlobalRoute}/api/shortlist/add`, {
                userId: user.id,
                productId,
            });
            setIsShortlisted(true);
            toast.success(`${product.product_name} added to shortlist.`); // Show success toast
        }
    } catch (error) {
        console.error("Error toggling shortlist:", error);
        toast.error("Failed to update shortlist. Please try again."); // Show error toast
    }
};

const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false); // State to control photo modal
const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Track the current photo index

const openPhotoModal = (index) => {
  setCurrentPhotoIndex(index);
  setIsPhotoModalOpen(true);
};

const closePhotoModal = () => {
  setIsPhotoModalOpen(false);
};

const handleNextPhoto = () => {
  setCurrentPhotoIndex((prevIndex) =>
    prevIndex === product.all_product_images.length - 1 ? 0 : prevIndex + 1
  );
};

const handlePreviousPhoto = () => {
  setCurrentPhotoIndex((prevIndex) =>
    prevIndex === 0 ? product.all_product_images.length - 1 : prevIndex - 1
  );
};

const [isReviewPhotoModalOpen, setIsReviewPhotoModalOpen] = useState(false); // State to control review photo modal
const [currentReviewPhotoIndex, setCurrentReviewPhotoIndex] = useState(0); // Track the current review photo index

const openReviewPhotoModal = (index) => {
  setCurrentReviewPhotoIndex(index);
  setIsReviewPhotoModalOpen(true);
};

const closeReviewPhotoModal = () => {
  setIsReviewPhotoModalOpen(false);
};

const handleNextReviewPhoto = (photos) => {
  setCurrentReviewPhotoIndex((prevIndex) =>
    prevIndex === photos.length - 1 ? 0 : prevIndex + 1
  );
};

const handlePreviousReviewPhoto = (photos) => {
  setCurrentReviewPhotoIndex((prevIndex) =>
    prevIndex === 0 ? photos.length - 1 : prevIndex - 1
  );
};

const [relatedProducts, setRelatedProducts] = useState([]); // State for related products

useEffect(() => {
  const fetchProductVendorAndOutlet = async () => {
    try {
      // Fetch product details
      console.log("Fetching product details for ID:", productId); // Debug log
      const productRes = await axios.get(`${backendGlobalRoute}/api/products/${productId}`);
      console.log("Fetched product details:", productRes.data); // Debug log
      setProduct(productRes.data);

      // Fetch vendor details using the vendor ID from the product
      if (productRes.data.vendor && productRes.data.vendor._id) {
        console.log("Fetching vendor details for ID:", productRes.data.vendor._id); // Debug log
        const vendorRes = await axios.get(
          `${backendGlobalRoute}/api/get-vendor-by-id/${productRes.data.vendor._id}`
        );
        console.log("Fetched vendor details:", vendorRes.data); // Debug log
        setVendor(vendorRes.data);
      }

      // Fetch outlet details if outlet is enabled
      if (productRes.data.outlets?.length > 0) {
        const outletId = productRes.data.outlets[0]._id; // Extract the _id field
        console.log("Fetching outlet details for ID:", outletId); // Debug log
        const outletRes = await axios.get(
          `${backendGlobalRoute}/api/get-outlet-by-id/${outletId}`
        );
        console.log("Fetched outlet details:", outletRes.data); // Debug log
        setOutlet(outletRes.data);
      }
    } catch (err) {
      console.error("Error fetching product, vendor, or outlet:", err); // Debug log
    } finally {
      setLoading(false);
    }
  };

  fetchProductVendorAndOutlet();
}, [productId]);

useEffect(() => {
  const fetchRelatedProducts = async () => {
    if (product?.category?._id) {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/products/category/${product.category._id}`
        );
        const filteredProducts = response.data.products.filter(
          (p) => p._id !== productId // Exclude the current product
        );
        setRelatedProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    }
  };

  fetchRelatedProducts();
}, [product?.category?._id, productId]);

useEffect(() => {
  const fetchReviews = async () => {
      try {
          const response = await axios.get(`${backendGlobalRoute}/api/allreviews?productId=${productId}`);
          setReviews(response.data);
      } catch (error) {
          console.error("Error fetching reviews:", error);
      }
  };

  if (productId) {
      fetchReviews();
  }
}, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Product not found
      </div>
    );
  }

  // Leaflet expects [lat, lng] format, but some APIs give [lng, lat]
  const locationCoords = Array.isArray(product.location?.coordinates)
    ? [product.location.coordinates[1], product.location.coordinates[0]]
    : null;

  const scrollToReviewForm = () => {
    if (reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the review form
    }
  };

  const scrollToAdditionalPhotos = () => {
    if (additionalPhotosRef.current) {
      additionalPhotosRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the additional photos section
    }
  };

  const scrollToAboutSection = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the about section
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const showLeftButton = scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 0;
  const showRightButton =
    scrollContainerRef.current &&
    scrollContainerRef.current.scrollLeft <
      scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

  return (
    <div className="w-full bg-gray-50">
      {/* Header Section */}
      <header className="w-full top-2 left-0 z-50 bg-transparent text-black mb-11">
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
            {product?.category ? (
              <Link
                className="border border-black text-sm tracking-widest px-8 py-3 rounded-full hover:text-white hover:bg-black transition duration-300"
                to={`/category/${product.category._id}`}
              >
                {product.category.category_name}
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Category not available</span>
            )}
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
              {/* Removed hover logout button */}
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

      {/* Top Image + Price + Contact Card */}
      <div className="flex flex-col lg:flex-row gap-x-6 w-full max-w-7xl mx-auto mt-6">
        {/* Left Image Section */}
        <div className="lg:w-[750px] relative">
          <img
            src={
              product.product_image
                ? `${backendGlobalRoute}/${product.product_image.replace(/\\/g, "/")}`
                : placeholderImage
            }
            alt={product.product_name}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute left-9 bg-white px-4 py-4 shadow-md w-[90%] top-[350px] h-[150px] flex flex-col justify-between">
            {/* Average Rating */}
            <div className="absolute top-[10px] right-[20px] bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-md shadow-md flex items-center">
              <span className="mr-1">★</span>
              <span>{averageRating}</span>
            </div>
            <div className="absolute top-[45px] right-[38px] text-gray-700 text-xs">
              {totalReviews} reviews
            </div>
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

            {/* Section below the address */}
            <div className="flex justify-center items-center bg-white py-1 mt-auto">
              <div className="flex items-center space-x-2 px-6 border-r-2 border-gray-400">
                <FaRegImage className="text-gray-700 w-5 h-5" /> {/* Photos Icon */}
                <span className="text-sm text-gray-800 font-medium">
                  {product.all_product_images?.length || 0} Photos
                </span>
              </div>
              <button
                onClick={handleShortlistToggle}
                className="flex items-center space-x-2 px-6 border-r-2 border-gray-400"
              >
                {isShortlisted ? (
                  <>
                    <FaHeart className="text-red-500 w-5 h-5" /> {/* Filled Heart Icon */}
                    <span className="text-sm text-gray-800 font-medium">Shortlisted</span>
                  </>
                ) : (
                  <>
                    <FaRegHeart className="text-gray-700 w-5 h-5" /> {/* Outline Heart Icon */}
                    <span className="text-sm text-gray-800 font-medium">Shortlist</span>
                  </>
                )}
              </button>
              <button
                onClick={scrollToReviewForm} // Scroll to the review form
                className="flex items-center space-x-2 px-6 border-r-2 border-gray-400"
              >
                <FaPen className="text-gray-700 w-5 h-5" /> {/* Review Icon */}
                <span className="text-sm text-gray-800 font-medium">Write a Review</span>
              </button>
              <div className="flex items-center space-x-2 px-6">
                <FaShareAlt className="text-gray-700 w-5 h-5" /> {/* Share Icon */}
                <span className="text-sm text-gray-800 font-medium">Share</span>
              </div>
            </div>
          </div>

          {/* Dummy Section with Buttons */}
          <div className="max-w-7xl mx-auto mt-[120px] bg-white border">
            <div className="flex gap-4">
              <button className="px-6 py-2 ext-gray-700 rounded" onClick={scrollToAdditionalPhotos}>Photos</button>
              <button className="px-6 py-2 text-gray-700 rounded" onClick={scrollToAboutSection}>About</button>
              <button className="px-6 py-2 text-gray-700 rounded" onClick={scrollToReviewForm}>Reviews</button>
            </div>
          </div>

          {/* Additional Photos Section */}
          <div ref={additionalPhotosRef} className="max-w-7xl mx-auto bg-transparent mt-4 p-4 border">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold border-b-2 border-pink-600 pb-1">Additional Photos</h2>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {product.all_product_images?.map((img, idx) => (
      <img
        key={idx}
        src={`${backendGlobalRoute}/${img.replace(/\\/g, "/")}`}
        alt={`Product Image ${idx + 1}`}
        className="rounded cursor-pointer"
        onClick={() => openPhotoModal(idx)} // Open modal on click
      />
    ))}
  </div>
</div>

{/* Photo Modal */}
{isPhotoModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    {/* Image Container */}
    <div className="relative flex items-center justify-center w-[50vw] h-[50vh] bg-transparent rounded-lg overflow-hidden">
      {/* Close Button */}
      <button
        onClick={closePhotoModal}
        className="absolute top-2 right-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white"
      >
        ✕
      </button>

      {/* Previous Button */}
      {product.all_product_images.length > 1 && (
        <button
          onClick={handlePreviousPhoto}
          className="absolute left-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-300"
        >
          ◀
        </button>
      )}

      {/* Image */}
      <img
        src={`${backendGlobalRoute}/${product.all_product_images[currentPhotoIndex].replace(/\\/g, "/")}`}
        alt={`Product Image ${currentPhotoIndex + 1}`}
        className="w-full h-full object-contain"
      />

      {/* Next Button */}
      {product.all_product_images.length > 1 && (
        <button
          onClick={handleNextPhoto}
          className="absolute right-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-300"
        >
          ▶
        </button>
      )}
    </div>
  </div>
)}

        </div>

        {/* Right Contact Card */}
        <div className="lg:w-2/5 w-full p-4 lg:pr-6 space-y-6">
          {/* Price Section */}
          <div className="p-4 bg-white border">
  <div className="text-left text-sm text-gray-600 mb-2 font-bold">Price</div> {/* Align text to the left */}
  <div className="flex justify-between items-center">
    {/* Left Side: Current Price and Display Price */}
    <div>
      <div className="text-3xl font-bold text-gray-800">₹{product.selling_price.toFixed(2)}</div>
      {product.display_price && (
        <div className="text-sm text-gray-500 line-through mt-1">
          ₹{product.display_price.toFixed(2)}
        </div>
      )}
    </div>
    {/* Right Side: Saved Price */}
    {product.display_price && (
      <div className="text-green-600 font-semibold text-lg">
        You Save: ₹{(product.display_price - product.selling_price).toFixed(2)}
      </div>
    )}
  </div>
</div>

          {/* Enquiry Form Section */}
          <div className="p-4 bg-white border">
            <h3 className="text-base  mb-4">
              Fill out this form to enquire about the product with the vendor.
            </h3>
            <form className="space-y-2 text-sm" onSubmit={handleSubmit}>
              <input
                className="w-full border p-2 rounded"
                placeholder="Full name*"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="flex gap-2">
                <span className="flex items-center border p-2 rounded w-1/4">+91</span>
                <input
                  className="w-3/4 border p-2 rounded"
                  placeholder="Phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                className="w-full border p-2 rounded"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Function date*"
                name="functionDate"
                value={formData.functionDate}
                onChange={handleInputChange}
                required
              />
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Message (optional)"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded"
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? "Sending..." : "Check Availability & Prices"}
              </button>
            </form>
          </div>

          {/* Book Now Section */}
          <div className="p-4 bg-white border mt-4 flex justify-center">
            <button
              className="w-[50%] bg-pink-600 text-white py-2 rounded"
              onClick={() => {
                if (!user) {
                  alert("You must be logged in to book this product.");
                  navigate("/login");
                  return;
                }
                navigate(`/book-page?productId=${product._id}`);
              }}
            >
              Book Now
            </button>
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
  {/* Close Button Inside Top-Right */}
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
        <MapContainer
          center={locationCoords}
          zoom={15}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={locationCoords} icon={customIcon}>
            <Popup>{product.location?.address || "Location"}</Popup>
          </Marker>
        </MapContainer>
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
        {product.location?.address || "Dharam Colony, Palam Vihar, Gurugram, Haryana, India"}
      </p>
    </div>
  </div>
</Modal>


      {/* About and Product Properties Section */}
<div ref={aboutSectionRef} className="container mx-auto bg-white mt-7 border p-6 mb-6">
  {/* About Section */}
  <div>
    <h2 className="text-lg font-semibold mb-4">
      About {product.product_name} - {product.category?.category_name || "Category"}
    </h2>
    <div className="space-y-6"> {/* Changed to vertical layout */}
      {/* Product Details */}
      <div className="space-y-4">
        <p className="text-gray-700">{product.description || "No description available."}</p>
        <div className="mt-4 text-sm text-gray-600">
          <h3 className="font-semibold">Location</h3>
          <p>Located in {product.location?.address || "Address not available"}.</p>
        </div>
      </div>

      {/* Vendor Details */}
      {vendor && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-600">Vendor Details</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="">Name:</span> {vendor.vendor_name}
            </p>
            <p>
              <span className="">Email:</span> {vendor.vendor_email}
            </p>
            <p>
              <span className="">Phone:</span> {vendor.vendor_phone}
            </p>
          </div>
        </div>
      )}

      {/* Outlet Details */}
      {outlet && (
        <div className="space-y-4">
          <h3 className=" font-semibold text-gray-600">Outlet Details</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <span className="">Name:</span> {outlet.outlet_name}
            </p>
            <p>
              <span className="">Email:</span> {outlet.outlet_email}
            </p>
            <p>
              <span className="">Phone:</span> {outlet.outlet_phone}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Horizontal Line */}
  <hr className="my-6 border-black border-2" />

  {/* Product Properties Section */}
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

      {/* Review Section */}
      <div className="container mx-auto bg-white mt-4 border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Reviews for {product.product_name}</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Rating Breakdown */}
          <div className="w-full md:w-1/3">
    <h3 className="text-sm font-semibold text-gray-700">Rating Breakdown</h3>
    <div className="w-full border-r p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Rating Distribution</h3>
        <div className="flex items-center justify-between">
            <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded-sm">★</span> {averageRating}
            </span>
            <span className="text-xs text-gray-500">{totalReviews} reviews</span>
        </div>
        {[5, 4, 3, 2, 1].map((rating, index) => {
            const percentage = totalReviews > 0 ? (ratingCounts[5 - rating] / totalReviews) * 100 : 0;
            return (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingFilter(rating)}
                    />
                    <span>{rating} ★</span>
                    <div className="w-2/3 h-2 bg-gray-200 rounded relative">
                        <div
                            className="absolute top-0 left-0 h-2 bg-green-500 rounded"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <span>{ratingCounts[5 - rating]} reviews</span>
                </div>
            );
        })}
        <p className="text-xs text-gray-500 pt-2">Last Review Updated on {new Date().toLocaleDateString()}</p>
    </div>
</div>

          {/* Submit/Edit Review Section */}
          <div className="w-full md:w-2/3" ref={reviewFormRef}> {/* Attach ref to the review form */}
  <h3 className="font-semibold text-gray-700">{isEditing ? "Edit Your Review" : "Submit Your Review"}</h3>
  <div className="p-4">
    <label className="block mt-2 text-sm font-medium">Rate {product.product_name}</label>
    <div className="flex gap-2 mt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 flex items-center justify-center border cursor-pointer ${
            reviewData.rating >= i + 1 ? "bg-green-500" : "bg-gray-200"
          }`}
          onClick={() =>
            setReviewData({
              ...reviewData,
              rating: reviewData.rating === i + 1 ? 0 : i + 1, // Toggle color if clicked on the same box
            })
          }
        >
          {/* No number inside the box */}
        </div>
      ))}
    </div>
    <textarea
      className="mt-4 w-full border rounded p-2 text-sm"
      rows={4}
      placeholder="Write your review..."
      value={reviewData.reviewContent}
      onChange={(e) => setReviewData({ ...reviewData, reviewContent: e.target.value })}
    ></textarea>
    <input
      type="file"
      className="w-full mt-2 border rounded p-2 text-sm"
      multiple
      onChange={(e) => setReviewData({ ...reviewData, photos: e.target.files })}
    />
    <div className="flex items-center gap-2 mt-4">
      {isEditing ? (
        <button
          onClick={handleUpdateReview}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={handleSubmitReview}
          className="bg-pink-500 text-white px-4 py-2 rounded text-sm"
        >
          Submit
        </button>
      )}
      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingReviewId(null);
            setReviewData({ rating: 0, reviewContent: "", photos: [] }); // Reset the form
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
</div>

        </div>

        {/* Existing Reviews Section */}
        <div className="border-t pt-4">
  <h3 className="font-semibold text-gray-700 mb-4">Customer Reviews</h3>
  {filteredReviews.length > 0 ? (
    filteredReviews.map((review, reviewIndex) => (
      <div key={review._id} className="border-t p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="text-sm font-medium">{review.username}</div>
          <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded-sm">
            ★ {review.rating}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-gray-700">{review.reviewContent}</p>
        {review.photos && review.photos.length > 0 && (
          <div className="flex gap-2 mt-2">
            {review.photos.map((photo, index) => (
              <img
                key={index}
                src={`${backendGlobalRoute}/${photo.replace(/\\/g, "/")}`}
                alt={`Review Photo ${index + 1}`}
                className="w-16 h-16 object-cover rounded cursor-pointer"
                onClick={() => openReviewPhotoModal(index)} // Open modal on click
              />
            ))}
          </div>
        )}
        {user && user.id === review.userId?._id && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleEditReview(review)}
              className="bg-blue-500 text-white px-4 py-1 rounded text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteReview(review._id)}
              className="bg-red-500 text-white px-4 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500">No reviews yet for this product.</p>
  )}
</div>

      </div>

{/* Review Photo Modal */}
{isReviewPhotoModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="relative flex items-center justify-center w-[50vw] h-[50vh] bg-transparent rounded-lg overflow-hidden">
      {/* Close Button */}
      <button
        onClick={closeReviewPhotoModal}
        className="absolute top-2 right-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white"
      >
        ✕
      </button>

      {/* Previous Button */}
      {reviews[currentReviewPhotoIndex]?.photos.length > 1 && (
        <button
          onClick={() =>
            handlePreviousReviewPhoto(reviews[currentReviewPhotoIndex].photos)
          }
          className="absolute left-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-300"
        >
          ◀
        </button>
      )}

      {/* Image */}
      <img
        src={`${backendGlobalRoute}/${reviews[currentReviewPhotoIndex]?.photos[currentReviewPhotoIndex].replace(
          /\\/g,
          "/"
        )}`}
        alt={`Review Photo ${currentReviewPhotoIndex + 1}`}
        className="w-full h-full object-contain"
      />

      {/* Next Button */}
      {reviews[currentReviewPhotoIndex]?.photos.length > 1 && (
        <button
          onClick={() =>
            handleNextReviewPhoto(reviews[currentReviewPhotoIndex].photos)
          }
          className="absolute right-2 bg-gray-200 text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-300"
        >
          ▶
        </button>
      )}
    </div>    </div>
   



)}  

{/* Similar Products Section */}
{relatedProducts.length > 0 && (
  <div className="container mx-auto px-6 py-8">
    <h2 className="text-2xl font-bold mb-6">
      Similar Products in "{product.category.category_name}"
    </h2>
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-hidden gap-6 pb-4" // Changed overflow-x-auto to overflow-hidden
      >
        {relatedProducts.map((relatedProduct, index) => {
          const location = relatedProduct.location?.address || "Location not available";

          return (
            <Link
              key={relatedProduct._id || index} // Ensure unique key for each card
              to={`/product/${relatedProduct._id}`} // Correctly set the `to` prop
              className="flex-shrink-0 w-[300px] mx-auto overflow-hidden font-sans rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`${backendGlobalRoute}/${relatedProduct.product_image.replace(/\\/g, "/")}`}
                  alt={relatedProduct.product_name}
                  className="w-full h-[200px] object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-3 pt-1 space-y-2">
                {/* Title and Rating */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {relatedProduct.product_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaStar className="text-pink-500 mr-1" />
                    <span className="font-semibold">{relatedProduct.averageRating}</span>
                    <span className="ml-1 text-gray-500">({relatedProduct.totalReviews} reviews)</span>
                  </div>
                </div>

                {/* Location or Description */}
                {relatedProduct.location?.address ? (
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="truncate">{relatedProduct.location.address}</span>
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm truncate">
                    {relatedProduct.description || "No description available."}
                  </div>
                )}

                {/* Pricing */}
                <div className="flex justify-start text-sm text-gray-800 gap-6 mb-3">
                  <div>
                    <div className="text-gray-500">Current Price</div>
                    <div className="font-bold">₹ {relatedProduct.selling_price.toFixed(2)}</div>
                  </div>
                  {relatedProduct.display_price && (
                    <div>
                      <div className="text-gray-500">Selling Price</div>
                      <div className="font-bold line-through">₹ {relatedProduct.display_price.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Scroll Buttons */}
      {showLeftButton && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute top-1/2 left-[-20px] transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          ◀
        </button>
      )}
      {showRightButton && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          ▶
        </button>
      )}
    </div>
  </div>
)}

<Footer /> {/* Render Footer */}
</div>  );

};

export default SingleProduct;
