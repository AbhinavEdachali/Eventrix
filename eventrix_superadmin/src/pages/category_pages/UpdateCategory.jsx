import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const UpdateCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categoryTypeInput, setCategoryTypeInput] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch all categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/all-categories`);
        setCategories(res.data);
      } catch (err) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch selected category details
  useEffect(() => {
    if (!selectedCategoryId) {
      setCategory(null);
      setCategoryName("");
      setDescription("");
      setTags([]);
      setCategoryTypes([]);
      setProperties([]);
      return;
    }
    const fetchCategory = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendGlobalRoute}/api/single-category/${selectedCategoryId}`);
        setCategory(res.data);
        setCategoryName(res.data.category_name || "");
        setDescription(res.data.description || "");
        setTags(res.data.tags || []);
        setCategoryTypes(res.data.category_types || []);
        setProperties(res.data.properties || []);
      } catch (err) {
        setError("Failed to fetch category.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [selectedCategoryId]);

  // Tag handlers
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

  // Category type handlers
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

  // Property handlers
  const handlePropertyChange = (idx, key, value) => {
    setProperties((prev) =>
      prev.map((prop, i) =>
        i === idx
          ? { ...prop, [key]: value, ...(key === "type" && value !== "dropdown" ? { options: undefined } : {}) }
          : prop
      )
    );
  };
  const addProperty = () => setProperties((prev) => [...prev, { name: "", type: "text" }]);
  const removeProperty = (idx) => setProperties((prev) => prev.filter((_, i) => i !== idx));
  const addDropdownOption = (pIdx) => {
    setProperties((prev) =>
      prev.map((prop, i) =>
        i === pIdx
          ? { ...prop, options: [...(prop.options || []), ""] }
          : prop
      )
    );
  };
  const handleDropdownOptionChange = (pIdx, oIdx, value) => {
    setProperties((prev) =>
      prev.map((prop, i) =>
        i === pIdx
          ? {
              ...prop,
              options: prop.options.map((opt, j) => (j === oIdx ? value : opt)),
            }
          : prop
      )
    );
  };
  const removeDropdownOption = (pIdx, oIdx) => {
    setProperties((prev) =>
      prev.map((prop, i) =>
        i === pIdx
          ? { ...prop, options: prop.options.filter((_, j) => j !== oIdx) }
          : prop
      )
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.put(`${backendGlobalRoute}/api/update-category/${selectedCategoryId}`, {
        category_name: categoryName,
        description,
        tags,
        category_types: categoryTypes,
        properties,
      });
      alert("Category updated successfully!");
      navigate("/all-categories");
    } catch (err) {
      setError("Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-xl px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Edit Category
          </h2>
          <Link
            to="/all-categories"
            className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow hover:opacity-90 transition-opacity"
          >
            Back to Categories
          </Link>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Category
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Choose a category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
        {selectedCategoryId && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-lg shadow space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tags</label>
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
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category Types</label>
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
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Properties
              </label>
              {properties.map((prop, idx) => (
                <div key={idx} className="flex flex-col gap-2 mb-2 border p-2 rounded">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Property Name"
                      value={prop.name || ""}
                      onChange={(e) => handlePropertyChange(idx, "name", e.target.value)}
                      className="border px-2 py-1 rounded flex-1"
                    />
                    <select
                      value={prop.type || "text"}
                      onChange={(e) => handlePropertyChange(idx, "type", e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Boolean</option>
                      <option value="dropdown">Dropdown</option>
                    </select>
                    <button type="button" onClick={() => removeProperty(idx)} className="text-red-500">Remove</button>
                  </div>
                  {prop.type === "dropdown" && (
                    <div className="ml-4">
                      <label className="block text-gray-600 mb-1">Options</label>
                      {(prop.options || []).map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleDropdownOptionChange(idx, oIdx, e.target.value)}
                            className="border px-2 py-1 rounded flex-1"
                          />
                          <button type="button" onClick={() => removeDropdownOption(idx, oIdx)} className="text-red-500">Remove</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addDropdownOption(idx)} className="text-blue-500 mt-1">Add Option</button>
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addProperty} className="text-blue-500 mt-1">Add Property</button>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-6 rounded-md shadow hover:opacity-90 transition-opacity"
            >
              {saving ? "Saving..." : "Update Category"}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        )}
        {loading && <div className="p-8">Loading...</div>}
        {error && !selectedCategoryId && <div className="p-8 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default UpdateCategory;
