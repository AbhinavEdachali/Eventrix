import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdViewList, MdDelete, MdEdit, MdSave, MdImage } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

export default function SingleAddedProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [productUpdates, setProductUpdates] = useState({});
  const [forceRender, setForceRender] = useState(false);
  const [newProductImage, setNewProductImage] = useState(null);

  // New state for dropdowns
  const [vendors, setVendors] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [categoryTypes, setCategoryTypes] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${backendGlobalRoute}/api/single-product/${id}`
        );
        setProductData(response.data);
        setProductUpdates(response.data);

        // Fetch vendors and outlets if needed
        if (response.data.category?.vendorEnabled) {
          axios
            .get(`${backendGlobalRoute}/api/all-vendors`)
            .then((res) => setVendors(res.data || []));
        }
        if (response.data.category?.outletEnabled) {
          axios
            .get(`${backendGlobalRoute}/api/all-outlets`)
            .then((res) => setOutlets(res.data || []));
        }
        // Fetch category types if present
        if (
          response.data.category?.category_types &&
          response.data.category.category_types.length > 0
        ) {
          setCategoryTypes(response.data.category.category_types);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id, forceRender]);

  const handleDeleteProduct = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmation) return;

    try {
      await axios.delete(`${backendGlobalRoute}/api/delete-product/${id}`);
      alert("Product deleted successfully.");
      navigate("/all-added-products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `${backendGlobalRoute}/api/update-product/${id}`,
        {
          ...productUpdates,
          // Ensure outlets is an array of IDs if present
          outlets:
            Array.isArray(productUpdates.outlets) && productUpdates.outlets.length > 0
              ? productUpdates.outlets.map((o) =>
                  typeof o === "object" && o._id ? o._id : o
                )
              : [],
        }
      );

      setProductData(response.data);
      setProductUpdates(response.data);

      alert("Product updated successfully!");
      setEditing(false);
      setForceRender(!forceRender);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProductUpdates({ ...productUpdates, [field]: value });
  };

  // For multi-select outlets
  const handleOutletsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setProductUpdates({ ...productUpdates, outlets: selected });
  };

  const handleProductImageChange = (e) => {
    setNewProductImage(e.target.files[0]);
  };

  const handleProductImageUpload = async () => {
    if (!newProductImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("product_image", newProductImage);

    try {
      const response = await axios.put(
        `${backendGlobalRoute}/api/update-product-image/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Product image updated successfully!");
      setForceRender(!forceRender);
      setNewProductImage(null);
    } catch (error) {
      console.error("Error updating product image:", error);
    }
  };

  const goToManageImagesPage = () => {
    navigate(`/manage-product-images/${id}`);
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      const normalizedPath = imageUrl
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `${backendGlobalRoute}/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  // Helper: get current vendor id
  const currentVendorId =
    typeof productUpdates.vendor === "object"
      ? productUpdates.vendor?._id
      : productUpdates.vendor;

  // Helper: get current outlets as array of ids
  const currentOutletIds =
    Array.isArray(productUpdates.outlets)
      ? productUpdates.outlets.map((o) => (typeof o === "object" ? o._id : o))
      : [];

  // Helper: get current location object
  const currentLocation =
    productUpdates.location && typeof productUpdates.location === "object"
      ? productUpdates.location
      : { address: "", coordinates: [0, 0] };

  // Helper: get current latitude/longitude from coordinates array
  const currentLat =
    Array.isArray(currentLocation.coordinates) && currentLocation.coordinates.length === 2
      ? currentLocation.coordinates[1]
      : "";
  const currentLng =
    Array.isArray(currentLocation.coordinates) && currentLocation.coordinates.length === 2
      ? currentLocation.coordinates[0]
      : "";

  // Handler for location fields
  const handleLocationChange = (field, value) => {
    let updatedLocation = { ...currentLocation };
    if (field === "address") {
      updatedLocation.address = value;
    } else if (field === "latitude") {
      const lat = parseFloat(value) || "";
      updatedLocation.coordinates = [
        currentLng !== "" ? parseFloat(currentLng) : 0,
        lat,
      ];
    } else if (field === "longitude") {
      const lng = parseFloat(value) || "";
      updatedLocation.coordinates = [
        lng,
        currentLat !== "" ? parseFloat(currentLat) : 0,
      ];
    }
    setProductUpdates({ ...productUpdates, location: updatedLocation });
  };

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Product Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={editing ? handleUpdateProduct : () => setEditing(true)}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              {editing ? <MdSave className="mr-1" /> : <MdEdit className="mr-1" />}
              {editing ? "Save" : "Edit"}
            </button>
            <button
              onClick={handleDeleteProduct}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              <MdDelete className="mr-1" />
              Delete
            </button>
            <button
              onClick={() => navigate("/all-added-products")}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              <MdViewList className="mr-1" />
              All Products
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="w-full sm:w-1/2">
            {/* Main Product Image */}
            <div
              className="relative w-full h-auto object-cover rounded-lg"
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={getImageUrl(productData.product_image)}
                alt={productData.product_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                className="rounded-lg"
              />
              {editing && (
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {/* Remove main image */}
                  <button
                    type="button"
                    className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg opacity-80 hover:opacity-100"
                    title="Remove Main Image"
                    onClick={async () => {
                      try {
                        await axios.put(
                          `${backendGlobalRoute}/api/update-product/${id}`,
                          { product_image: "" }
                        );
                        setForceRender((prev) => !prev);
                      } catch (error) {
                        alert("Failed to remove main image.");
                      }
                    }}
                  >
                    ×
                  </button>
                  {/* Upload new main image */}
                  <label className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg cursor-pointer opacity-80 hover:opacity-100" title="Change Main Image">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        if (!e.target.files[0]) return;
                        const formData = new FormData();
                        formData.append("product_image", e.target.files[0]);
                        try {
                          await axios.put(
                            `${backendGlobalRoute}/api/update-product-image/${id}`,
                            formData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                          );
                          setForceRender((prev) => !prev);
                        } catch (error) {
                          alert("Failed to update main image.");
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            {/* Additional Images */}
            <div className="flex mt-4 space-x-2 flex-wrap">
              {productData.all_product_images?.length > 0
                ? productData.all_product_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(image)}
                        alt={`Additional ${index}`}
                        className="object-cover rounded-lg"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                      {editing && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                          title="Remove"
                          onClick={async () => {
                            try {
                              const updatedImages = productData.all_product_images.filter(
                                (_, i) => i !== index
                              );
                              await axios.put(
                                `${backendGlobalRoute}/api/update-product/${id}`,
                                { all_product_images: updatedImages }
                              );
                              setForceRender((prev) => !prev);
                            } catch (error) {
                              alert("Failed to remove image.");
                            }
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                : "No additional images available."}
              {/* Add new additional images */}
              {editing && (
                <label className="flex flex-col items-center justify-center w-20 h-20 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
                  <span className="text-2xl text-blue-600">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      if (!e.target.files.length) return;
                      const formData = new FormData();
                      for (let i = 0; i < e.target.files.length; i++) {
                        formData.append("additional_images", e.target.files[i]);
                      }
                      try {
                        await axios.put(
                          `${backendGlobalRoute}/api/update-product/${id}`,
                          formData,
                          { headers: { "Content-Type": "multipart/form-data" } }
                        );
                        setForceRender((prev) => !prev);
                      } catch (error) {
                        alert("Failed to add images.");
                      }
                    }}
                  />
                </label>
              )}
            </div>
            {/* Remove the old "Update Product Image" and "Manage Images" buttons */}
          </div>
          <div className="w-full sm:w-1/2">
            <h3 className="text-lg font-semibold text-gray-900">
              Product:{" "}
              {editing ? (
                <input
                  type="text"
                  value={productUpdates.product_name || ""}
                  onChange={(e) =>
                    handleInputChange("product_name", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              ) : (
                productData.product_name || "N/A"
              )}
            </h3>
            <div className="mt-4 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* Description */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <textarea
                        value={productUpdates.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.description || "N/A"
                    )}
                  </dd>
                </div>

                {/* Category */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.category?.category_name || "N/A"}
                  </dd>
                </div>

                {/* Vendor (dropdown always shown) */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Vendor</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <select
                        value={currentVendorId || ""}
                        onChange={(e) =>
                          handleInputChange("vendor", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.vendor_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      productData.vendor?.vendor_name || "N/A"
                    )}
                  </dd>
                </div>

                {/* Outlets (dropdown always shown, single select) */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Outlet</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <select
                        value={currentOutletIds[0] || ""}
                        onChange={(e) =>
                          setProductUpdates({
                            ...productUpdates,
                            outlets: [e.target.value],
                          })
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option value="">Select Outlet</option>
                        {outlets.map((o) => (
                          <option key={o._id} value={o._id}>
                            {o.outlet_name}
                          </option>
                        ))}
                      </select>
                    ) : productData.outlets && productData.outlets.length > 0 ? (
                      productData.outlets
                        .map((outlet) => outlet.outlet_name)
                        .join(", ")
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>

                {/* Category Type (dropdown if available) */}
                {categoryTypes.length > 0 && (
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium text-gray-900">
                      Category Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                      {editing ? (
                        <select
                          value={productUpdates.category_type || ""}
                          onChange={(e) =>
                            handleInputChange("category_type", e.target.value)
                          }
                          className="w-full px-4 py-2 border rounded-md"
                        >
                          <option value="">Select Category Type</option>
                          {categoryTypes.map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        productData.category_type || "N/A"
                      )}
                    </dd>
                  </div>
                )}

                {/* Selling Price */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Selling Price
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="number"
                        value={productUpdates.selling_price || ""}
                        onChange={(e) =>
                          handleInputChange("selling_price", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.selling_price
                    )}
                  </dd>
                </div>

                {/* Display Price */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Display Price
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="number"
                        value={productUpdates.display_price || ""}
                        onChange={(e) =>
                          handleInputChange("display_price", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.display_price
                    )}
                  </dd>
                </div>

                {/* SKU */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">SKU</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.SKU}
                  </dd>
                </div>

                {/* Availability Status */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Availability Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <select
                        value={productUpdates.availability_status || ""}
                        onChange={(e) =>
                          handleInputChange("availability_status", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    ) : productData.availability_status === "available" ? (
                      "Available"
                    ) : (
                      "Unavailable"
                    )}
                  </dd>
                </div>

                {/* Properties */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Properties
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.properties && Object.keys(productData.properties).length > 0
                      ? Object.entries(productData.properties).map(([key, value]) => (
                          <div key={key}>
                            <strong>{key}:</strong> {value}
                          </div>
                        ))
                      : "N/A"}
                  </dd>
                </div>

                {/* Location (always show, editable if editing) */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Address"
                          value={currentLocation.address || ""}
                          onChange={(e) =>
                            handleLocationChange("address", e.target.value)
                          }
                          className="w-full px-4 py-2 border rounded-md mb-1"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            value={currentLat}
                            onChange={(e) =>
                              handleLocationChange("latitude", e.target.value)
                            }
                            className="w-1/2 px-4 py-2 border rounded-md"
                          />
                          <input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            value={currentLng}
                            onChange={(e) =>
                              handleLocationChange("longitude", e.target.value)
                            }
                            className="w-1/2 px-4 py-2 border rounded-md"
                          />
                        </div>
                      </div>
                    ) : productData.location?.address ? (
                      <>
                        <div>
                          <strong>Address:</strong> {productData.location.address}
                        </div>
                        {Array.isArray(productData.location.coordinates) &&
                        productData.location.coordinates.length === 2 ? (
                          <div>
                            <strong>Latitude:</strong> {productData.location.coordinates[1]}
                            <br />
                            <strong>Longitude:</strong> {productData.location.coordinates[0]}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>

                {/* Created At */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Product Added On
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {new Date(productData.createdAt).toLocaleString()}
                  </dd>
                </div>

                {/* Updated At */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Updated At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {new Date(productData.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
