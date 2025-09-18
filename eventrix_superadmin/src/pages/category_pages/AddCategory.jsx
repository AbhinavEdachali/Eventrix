import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [customProperties, setCustomProperties] = useState([]);
  const [message, setMessage] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [vendorEnabled, setVendorEnabled] = useState(false);
  const [outletEnabled, setOutletEnabled] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryTypeInput, setCategoryTypeInput] = useState("");

  const [categories, setCategories] = useState([]); // State to store existing categories
  const [errors, setErrors] = useState({});

  const categoryNameRef = useRef();
  const descriptionRef = useRef();
  const categoryImageRef = useRef();

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryTypeKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && categoryTypeInput.trim()) {
      e.preventDefault();
      const newType = categoryTypeInput.trim();
      if (!categoryTypes.includes(newType)) {
        setCategoryTypes([...categoryTypes, newType]);
      }
      setCategoryTypeInput("");
    }
  };

  const removeCategoryType = (indexToRemove) => {
    setCategoryTypes(categoryTypes.filter((_, index) => index !== indexToRemove));
  };

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  // Add support for dropdown options in custom properties
  const handleCustomPropertyChange = (index, key, value) => {
    const updated = [...customProperties];
    updated[index][key] = value;
    if (key === "type" && value !== "dropdown") {
      delete updated[index].options; // Remove options if type is not dropdown
    }
    setCustomProperties(updated);
  };

  const addDropdownOption = (index) => {
    const updated = [...customProperties];
    if (!updated[index].options) {
      updated[index].options = [];
    }
    updated[index].options.push("");
    setCustomProperties(updated);
  };

  const handleDropdownOptionChange = (index, optionIndex, value) => {
    const updated = [...customProperties];
    if (updated[index].options) {
      updated[index].options[optionIndex] = value;
    }
    setCustomProperties(updated);
  };

  const removeDropdownOption = (index, optionIndex) => {
    const updated = [...customProperties];
    if (updated[index].options) {
      updated[index].options.splice(optionIndex, 1);
    }
    setCustomProperties(updated);
  };

  const addPropertyField = () => {
    setCustomProperties([...customProperties, { name: "", type: "text" }]);
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };
  
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  

  const removePropertyField = (index) => {
    const updated = [...customProperties];
    updated.splice(index, 1);
    setCustomProperties(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    let firstInvalidRef = null;
    if (!categoryName) {
      newErrors.categoryName = "Category name is required.";
      firstInvalidRef = firstInvalidRef || categoryNameRef;
    }
    if (!description) {
      newErrors.description = "Description is required.";
      firstInvalidRef = firstInvalidRef || descriptionRef;
    }
    if (!categoryImage) {
      newErrors.categoryImage = "Category image is required.";
      firstInvalidRef = firstInvalidRef || categoryImageRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    // Check if category name already exists
    const isDuplicate = categories.some(
      (cat) => cat.category_name.toLowerCase() === categoryName.toLowerCase()
    );
    if (isDuplicate) {
      alert("Category name already exists. Please choose a different name.");
      return;
    }

    const filteredCustomProps = customProperties.filter(
      (prop) => prop.name.trim() !== ""
    );

    const formData = new FormData();
    formData.append("category_name", categoryName);
    formData.append("description", description);
    if (categoryImage) {
      formData.append("category_image", categoryImage);
    }
    formData.append("properties", JSON.stringify(filteredCustomProps));
    formData.append("vendorEnabled", vendorEnabled);
    formData.append("outletEnabled", outletEnabled);
    formData.append("locationEnabled", locationEnabled);
    formData.append("tags", JSON.stringify(tags));
    formData.append("category_types", JSON.stringify(categoryTypes));

    try {
      const response = await axios.post(
        `${backendGlobalRoute}/api/add-category`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Category added successfully!");
      setMessage("Category added successfully!");

      // Reset form fields
      setCategoryName("");
      setDescription("");
      setCategoryImage(null);
      setCustomProperties([]);
      setVendorEnabled(false);
      setOutletEnabled(false);
      setTags([]);
      setTagInput("");

      // Reset the file input field visually
      document.getElementById("categoryImage").value = "";
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error);
      setMessage("Error adding category. Please try again.");
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Category</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
            Category Name
          </label>
          <input
            ref={categoryNameRef}
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.categoryName && (
            <span className="block mt-1 text-red-500 text-xs">{errors.categoryName}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            ref={descriptionRef}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows="3"
          ></textarea>
          {errors.description && (
            <span className="block mt-1 text-red-500 text-xs">{errors.description}</span>
          )}
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryImage">
            Category Image
          </label>
          <input
            ref={categoryImageRef}
            id="categoryImage"
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.categoryImage && (
            <span className="block mt-1 text-red-500 text-xs">{errors.categoryImage}</span>
          )}
        </div>


        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Enter a tag and press Enter"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Category Types */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category Types</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {categoryTypes.map((type, index) => (
              <span
                key={index}
                className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full"
              >
                {type}
                <button
                  type="button"
                  onClick={() => removeCategoryType(index)}
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={categoryTypeInput}
            onChange={(e) => setCategoryTypeInput(e.target.value)}
            onKeyDown={handleCategoryTypeKeyDown}
            placeholder="Enter a type and press Enter"
            className="w-full px-3 py-2 border rounded"
          />
        </div>


        {/* Custom Properties */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Custom Properties
          </label>
          {customProperties.map((prop, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Property Name"
                value={prop.name}
                onChange={(e) =>
                  handleCustomPropertyChange(index, "name", e.target.value)
                }
                className="w-1/2 px-3 py-2 border rounded"
              />
              <select
                value={prop.type}
                onChange={(e) =>
                  handleCustomPropertyChange(index, "type", e.target.value)
                }
                className="w-1/3 px-3 py-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean</option>
                <option value="dropdown">Dropdown</option>
              </select>
              {prop.type === "dropdown" && (
                <div className="w-full">
                  {prop.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Option"
                        value={option}
                        onChange={(e) =>
                          handleDropdownOptionChange(index, optionIndex, e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeDropdownOption(index, optionIndex)}
                        className="text-red-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDropdownOption(index)}
                    className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    + Add Option
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => removePropertyField(index)}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPropertyField}
            className="mt-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Property
          </button>
        </div>

        {/* Vendor & Outlet Checkboxes */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Additional Fields Options
          </label>
          <div className="flex gap-6 flex-wrap">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={vendorEnabled}
                onChange={(e) => setVendorEnabled(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Enable Vendor Field</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={outletEnabled}
                onChange={(e) => setOutletEnabled(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Enable Outlet Field</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={locationEnabled}
                onChange={(e) => setLocationEnabled(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Enable Location Field</span>
            </label>
          </div>
        </div>


        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}
