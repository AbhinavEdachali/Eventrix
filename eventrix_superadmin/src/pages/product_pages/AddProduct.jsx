import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [sellingPrice, setSellingPrice] = useState("");
  const [displayPrice, setDisplayPrice] = useState("");
  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [outlet, setOutlet] = useState(""); // ✅ Added outlet state
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [dynamicFields, setDynamicFields] = useState({});
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoryType, setCategoryType] = useState(""); // State for category type
  const [errors, setErrors] = useState({});

  const productNameRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();
  const sellingPriceRef = useRef();
  const displayPriceRef = useRef();
  const categoryTypeRef = useRef();
  const vendorRef = useRef();
  const outletRef = useRef();
  const addressRef = useRef();
  const latitudeRef = useRef();
  const longitudeRef = useRef();
  const mainImageRef = useRef();

  // Handle dynamic fields for dropdown properties
  const handleDynamicDropdownChange = (propertyName, value) => {
    setDynamicFields({
      ...dynamicFields,
      [propertyName]: value,
    });
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-vendors`);
        setVendors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setVendors([]);
      }
    };

    fetchVendors();
  }, []);

  // Fetch outlets
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-outlets`);
        console.log("Fetched outlets:", res.data); // ✅ Debug log
        setOutlets(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch outlets:", err);
        setOutlets([]);
      }
    };

    fetchOutlets();
  }, []);

  const selectedCategory = categories.find((cat) => cat._id === category);
  const dynamicProperties = selectedCategory?.properties || [];
  const vendorEnabled = selectedCategory?.vendorEnabled;
  const outletEnabled = selectedCategory?.outletEnabled;
  const locationEnabled = selectedCategory?.locationEnabled;
  const categoryTypes = selectedCategory?.category_types || []; // Fetch category types from selected category

  const handleDynamicFieldChange = (e) => {
    setDynamicFields({
      ...dynamicFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    let firstInvalidRef = null;

    if (!productName) {
      newErrors.productName = "Product name is required.";
      firstInvalidRef = firstInvalidRef || productNameRef;
    }
    if (!description) {
      newErrors.description = "Description is required.";
      firstInvalidRef = firstInvalidRef || descriptionRef;
    }
    if (!category) {
      newErrors.category = "Category is required.";
      firstInvalidRef = firstInvalidRef || categoryRef;
    }
    if (!sellingPrice) {
      newErrors.sellingPrice = "Selling price is required.";
      firstInvalidRef = firstInvalidRef || sellingPriceRef;
    }
    // Display price is now required
    if (!displayPrice) {
      newErrors.displayPrice = "Display price is required.";
      firstInvalidRef = firstInvalidRef || displayPriceRef;
    } else if (isNaN(Number(displayPrice))) {
      newErrors.displayPrice = "Display price must be a number.";
      firstInvalidRef = firstInvalidRef || displayPriceRef;
    }
    if (categoryTypes.length > 0 && !categoryType) {
      newErrors.categoryType = "Category type is required.";
      firstInvalidRef = firstInvalidRef || categoryTypeRef;
    }
    if (vendorEnabled && !vendor) {
      newErrors.vendor = "Vendor is required.";
      firstInvalidRef = firstInvalidRef || vendorRef;
    }
    if (outletEnabled && !outlet) {
      newErrors.outlet = "Outlet is required.";
      firstInvalidRef = firstInvalidRef || outletRef;
    }
    if (locationEnabled) {
      if (!address) {
        newErrors.address = "Address is required.";
        firstInvalidRef = firstInvalidRef || addressRef;
      }
      if (!latitude) {
        newErrors.latitude = "Latitude is required.";
        firstInvalidRef = firstInvalidRef || latitudeRef;
      }
      if (!longitude) {
        newErrors.longitude = "Longitude is required.";
        firstInvalidRef = firstInvalidRef || longitudeRef;
      }
    }
    if (!mainImage) {
      newErrors.mainImage = "Main image is required.";
      firstInvalidRef = firstInvalidRef || mainImageRef;
    }

    setErrors(newErrors);

    // Focus the first invalid field
    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("description", description);
    formData.append("availability_status", availabilityStatus);
    formData.append("selling_price", sellingPrice);

    // Always append display_price (now required and validated)
    formData.append("display_price", displayPrice);

    formData.append("category", category);
    formData.append("category_type", categoryType);

    // Combine address, latitude, and longitude into a single location JSON string only if locationEnabled
    let location = null;
    if (locationEnabled && (address || latitude || longitude)) {
      location = JSON.stringify({
        address,
        coordinates: {
          lat: parseFloat(latitude) || null,
          lng: parseFloat(longitude) || null,
        },
      });
      formData.append("location", location);
    }

    // Vendor and outlet fields only added if enabled and filled
    if (vendorEnabled && vendor) {
      formData.append("vendor", vendor);
    }

    if (outletEnabled && outlet) {
      formData.append("outlet", outlet);
    }

    if (mainImage) {
      formData.append("main_image", mainImage);
    }

    additionalImages.forEach((img) => {
      formData.append("additional_images", img);
    });

    // Send all dynamic fields as one JSON blob
    formData.append("properties", JSON.stringify(dynamicFields));

    try {
      await axios.post(`${backendGlobalRoute}/api/add-product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product created successfully!");
      // Reset all form fields after successful submission
      setProductName("");
      setDescription("");
      setAvailabilityStatus("available");
      setMainImage(null);
      setAdditionalImages([]);
      setSellingPrice("");
      setDisplayPrice("");
      setCategory("");
      setVendor("");
      setOutlet("");
      setDynamicFields({});
      setAddress("");
      setLatitude("");
      setLongitude("");
      setCategoryType("");
      setErrors({});
    } catch (err) {
      // Show backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        alert("Failed to create product: " + err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.error) {
        alert("Failed to create product: " + err.response.data.error);
      } else {
        alert("Failed to create product.");
      }
      console.error("Error creating product:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            ref={categoryRef}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setDynamicFields({});
              setVendor("");
              setOutlet("");
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.category}
            </span>
          )}
        </div>
        {/* Product Name */}
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            ref={productNameRef}
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.productName && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.productName}
            </span>
          )}
        </div>
        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.description && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.description}
            </span>
          )}
        </div>
        {/* Availability */}
        <div>
          <label className="block font-medium">Availability Status</label>
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        {/* Main Image */}
        <div>
          <label className="block font-medium">Main Image</label>
          <input
            ref={mainImageRef}
            type="file"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
          {errors.mainImage && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.mainImage}
            </span>
          )}
        </div>
        {/* Additional Images */}
        <div>
          <label className="block font-medium">Additional Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setAdditionalImages(Array.from(e.target.files))}
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Selling Price */}
        <div>
          <label className="block font-medium">Selling Price</label>
          <input
            ref={sellingPriceRef}
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.sellingPrice && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.sellingPrice}
            </span>
          )}
        </div>
        {/* Display Price */}
        <div>
          <label className="block font-medium">Display Price</label>
          <input
            ref={displayPriceRef}
            type="number"
            value={displayPrice}
            onChange={(e) => setDisplayPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
          {errors.displayPrice && (
            <span className="block mt-1 text-red-500 text-xs">
              {errors.displayPrice}
            </span>
          )}
        </div>
        {/* Category Type */}
        {categoryTypes.length > 0 && (
          <div>
            <label className="block font-medium">Category Type</label>
            <select
              ref={categoryTypeRef}
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select category type</option>
              {categoryTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.categoryType && (
              <span className="block mt-1 text-red-500 text-xs">
                {errors.categoryType}
              </span>
            )}
          </div>
        )}
        {/* Vendor (if enabled) */}
        {vendorEnabled && (
          <div>
            <label className="block font-medium">Vendor</label>
            <select
              ref={vendorRef}
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select vendor</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vendor_name}
                </option>
              ))}
            </select>
            {errors.vendor && (
              <span className="block mt-1 text-red-500 text-xs">
                {errors.vendor}
              </span>
            )}
          </div>
        )}
        {/* Outlet (if enabled) */}
        {outletEnabled && (
          <div>
            <label className="block font-medium">Outlet</label>
            <select
              ref={outletRef}
              value={outlet}
              onChange={(e) => setOutlet(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select outlet</option>
              {outlets.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.outlet_name || o.name}
                </option>
              ))}
            </select>
            {errors.outlet && (
              <span className="block mt-1 text-red-500 text-xs">
                {errors.outlet}
              </span>
            )}
          </div>
        )}
        {/* Location Fields (if enabled) */}
        {locationEnabled && (
          <>
            <div>
              <label className="block font-medium">Address</label>
              <input
                ref={addressRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter full address"
              />
              {errors.address && (
                <span className="block mt-1 text-red-500 text-xs">
                  {errors.address}
                </span>
              )}
            </div>
            <div>
              <label className="block font-medium">Latitude</label>
              <input
                ref={latitudeRef}
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter latitude"
              />
              {errors.latitude && (
                <span className="block mt-1 text-red-500 text-xs">
                  {errors.latitude}
                </span>
              )}
            </div>
            <div>
              <label className="block font-medium">Longitude</label>
              <input
                ref={longitudeRef}
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter longitude"
              />
              {errors.longitude && (
                <span className="block mt-1 text-red-500 text-xs">
                  {errors.longitude}
                </span>
              )}
            </div>
          </>
        )}
        {/* Dynamic Fields */}
        {dynamicProperties.map((prop, index) => (
          <div key={index}>
            <label className="block font-medium capitalize">{prop.name}</label>
            {prop.type === "boolean" ? (
              <select
                name={prop.name}
                value={dynamicFields[prop.name] || ""}
                onChange={handleDynamicFieldChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : prop.type === "dropdown" ? (
              <select
                name={prop.name}
                value={dynamicFields[prop.name] || ""}
                onChange={(e) =>
                  handleDynamicDropdownChange(prop.name, e.target.value)
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select</option>
                {(prop.options || []).map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={prop.type || "text"}
                name={prop.name}
                value={dynamicFields[prop.name] || ""}
                onChange={handleDynamicFieldChange}
                className="w-full border p-2 rounded"
              />
            )}
          </div>
        ))}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;