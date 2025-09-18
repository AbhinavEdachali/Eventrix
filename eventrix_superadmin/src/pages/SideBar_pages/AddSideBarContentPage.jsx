import React, { useState, useEffect } from "react";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const AddSideBarContentPage = () => {
  const [categories, setCategories] = useState([]);
  const [sidebars, setSidebars] = useState([]); // Track existing sidebars
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState(null);

  // propName -> chosen values array
  const [valuesMap, setValuesMap] = useState({});
  // propName -> "text" | "checkbox"
  const [typeMap, setTypeMap] = useState({});
  // propName -> temp input for custom values
  const [inputMap, setInputMap] = useState({});

  // Locations
  const [locations, setLocations] = useState([]);
  const [locationInput, setLocationInput] = useState("");

  // Load categories and sidebars once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, sidebarRes] = await Promise.all([
          axios.get(`${backendGlobalRoute}/api/all-categories`),
          axios.get(`${backendGlobalRoute}/api/sidebar/all`),
        ]);
        setCategories(catRes.data || []);
        setSidebars(Array.isArray(sidebarRes.data) ? sidebarRes.data : []);
      } catch (err) {
        setCategories([]);
        setSidebars([]);
      }
    };
    fetchData();
  }, []);

  // When selected category changes, initialize maps
  useEffect(() => {
    const cat = categories.find((c) => c._id === categoryId) || null;
    setCategory(cat);

    if (!cat) {
      setValuesMap({});
      setTypeMap({});
      setInputMap({});
      setLocations([]);
      setLocationInput("");
      return;
    }

    const vm = {}, tm = {}, im = {};
    cat.properties.forEach((p) => {
      vm[p.name] = [];
      tm[p.name] = "checkbox";
      im[p.name] = "";
    });

    setValuesMap(vm);
    setTypeMap(tm);
    setInputMap(im);
    setLocations([]);
    setLocationInput("");
  }, [categoryId, categories]);

  // Add a value (from dropdown or custom)
  const addValue = (propName, val) => {
    if (!val) return;
    setValuesMap((vm) => {
      if (vm[propName].includes(val)) return vm;
      return { ...vm, [propName]: [...vm[propName], val] };
    });
    // clear temp input
    setInputMap((im) => ({ ...im, [propName]: "" }));
  };

  // Remove a single value
  const removeValue = (propName, val) => {
    setValuesMap((vm) => ({
      ...vm,
      [propName]: vm[propName].filter((x) => x !== val),
    }));
  };

  // Remove the entire property card
  const removeProperty = (propName) => {
    setCategory((c) => ({
      ...c,
      properties: c.properties.filter((p) => p.name !== propName),
    }));
    setValuesMap((vm) => {
      const copy = { ...vm };
      delete copy[propName];
      return copy;
    });
    setTypeMap((tm) => {
      const copy = { ...tm };
      delete copy[propName];
      return copy;
    });
    setInputMap((im) => {
      const copy = { ...im };
      delete copy[propName];
      return copy;
    });
  };

  // Add location
  const handleAddLocation = () => {
    const v = locationInput.trim();
    if (!v || locations.includes(v)) return;
    setLocations((ls) => [...ls, v]);
    setLocationInput("");
  };

  // Submit payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      categoryId,
      displayTypes: typeMap,
      propertyValues: valuesMap,
      locations: category.locationEnabled ? locations : [],
    };

    try {
      await axios.post(`${backendGlobalRoute}/api/sidebar`, payload);
      alert("Sidebar saved!");
      // Refresh sidebars after adding
      const sidebarRes = await axios.get(`${backendGlobalRoute}/api/sidebar/all`);
      setSidebars(Array.isArray(sidebarRes.data) ? sidebarRes.data : []);
      setCategoryId(""); // Reset selection
    } catch (err) {
      console.error(err);
      alert("Error saving sidebar");
    }
  };

  // Delete sidebar config for a category
  const handleDeleteSidebar = async (catId) => {
    if (!window.confirm("Delete sidebar for this category?")) return;
    try {
      await axios.delete(`${backendGlobalRoute}/api/sidebar/${catId}`);
      // Refresh sidebars after deletion
      const sidebarRes = await axios.get(`${backendGlobalRoute}/api/sidebar/all`);
      setSidebars(Array.isArray(sidebarRes.data) ? sidebarRes.data : []);
      setCategoryId(""); // Reset selection if deleted
      alert("Sidebar deleted.");
    } catch (err) {
      alert("Error deleting sidebar.");
    }
  };

  // Get category IDs that already have a sidebar
  const sidebarCategoryIds = sidebars.map((sb) =>
    typeof sb.categoryId === "object" && sb.categoryId._id
      ? sb.categoryId._id
      : sb.categoryId
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configure Sidebar</h1>

      {/* Category Selector */}
      <select
        className="w-full border p-2 rounded"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">— Select Category —</option>
        {categories
          .filter((c) => !sidebarCategoryIds.includes(c._id))
          .map((c) => (
            <option key={c._id} value={c._id}>
              {c.category_name}
            </option>
          ))}
      </select>

      {category && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Cards */}
          {category.properties.map((p) => {
            // Determine available options
            const opts =
              p.options?.length
                ? p.options
                : p.type === "boolean"
                ? ["true", "false"]
                : [];

            return (
              <div key={p.name} className="border p-4 rounded relative">
                {/* Remove property button */}
                <button
                  type="button"
                  onClick={() => removeProperty(p.name)}
                  className="absolute top-2 right-2 text-red-600 font-bold"
                >
                  ×
                </button>

                <h2 className="font-semibold mb-2">{p.name}</h2>

                {/* Display Type */}
                <div className="mb-2">
                  <label className="mr-2">Display as:</label>
                  <select
                    className="border p-1 rounded"
                    value={typeMap[p.name]}
                    onChange={(e) =>
                      setTypeMap((tm) => ({
                        ...tm,
                        [p.name]: e.target.value,
                      }))
                    }
                  >
                    <option value="text">Text</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>

                {/* Predefined Options Dropdown */}
                {opts.length > 0 && (
                  <select
                    className="border p-2 rounded w-full mb-2"
                    defaultValue=""
                    onChange={(e) => addValue(p.name, e.target.value)}
                  >
                    <option value="">— Choose {p.name} —</option>
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                )}

                {/* Custom Option Input */}
                {opts.length === 0 && (
                  <div className="flex gap-2 mb-2">
                    <input
                      className="flex-1 border p-2 rounded"
                      placeholder={`Add ${p.name}`}
                      value={inputMap[p.name] || ""}
                      onChange={(e) =>
                        setInputMap((im) => ({
                          ...im,
                          [p.name]: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="bg-green-600 px-4 text-white rounded"
                      onClick={() => addValue(p.name, inputMap[p.name])}
                    >
                      Add
                    </button>
                  </div>
                )}

                {/* Chosen Values List */}
                <ul className="space-y-1">
                  {valuesMap[p.name]?.map((val) => (
                    <li
                      key={val}
                      className="flex justify-between px-3 py-1 bg-gray-100 rounded"
                    >
                      <span>{val}</span>
                      <button
                        type="button"
                        className="text-red-600 font-bold"
                        onClick={() => removeValue(p.name, val)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Locations: only if enabled on category */}
          {category.locationEnabled && (
            <div className="border p-4 rounded">
              <h2 className="font-semibold mb-2">Locations</h2>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border p-2 rounded"
                  placeholder="Add location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 rounded"
                  onClick={handleAddLocation}
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1">
                {locations.map((loc) => (
                  <li
                    key={loc}
                    className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      className="text-red-600 font-bold"
                      onClick={() =>
                        setLocations((ls) => ls.filter((x) => x !== loc))
                      }
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Save Button */}
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Save Sidebar
          </button>
        </form>
      )}
    </div>
  );
};

export default AddSideBarContentPage;
