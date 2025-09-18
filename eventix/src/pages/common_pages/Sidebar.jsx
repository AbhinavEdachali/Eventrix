import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import backendGlobalRoute from "../../config/config";

const Sidebar = ({ onFilterChange, minPrice, maxPrice }) => {
  const { categoryId } = useParams();
  const [sidebarData, setSidebarData] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([minPrice || 0, maxPrice || 10000]);

  useEffect(() => {
    if (!categoryId) return;
    axios
      .get(`${backendGlobalRoute}/api/sidebar/${categoryId}`)
      .then((res) => setSidebarData(res.data))
      .catch((err) => console.error("Sidebar fetch error:", err));
  }, [categoryId]);

  // Update price range if minPrice/maxPrice props change
  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 10000]);
  }, [minPrice, maxPrice]);

  // Emit generic filters (checkboxes/buttons) and search
  const handleFilterChange = (property, value) => {
    setFilters((prev) => {
      let updated;
      if (property === "categoryType") {
        // Allow multiple selection: toggle value in array
        const current = prev.categoryType || [];
        const nextValues = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        updated = { ...prev, categoryType: nextValues };
      } else {
        const current = prev[property] || [];
        const nextValues = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        updated = { ...prev, [property]: nextValues };
      }
      setTimeout(() => onFilterChange?.(updated), 0);
      return updated;
    });
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    // Call onFilterChange OUTSIDE of render, after state update
    setTimeout(() => onFilterChange?.({ ...filters, search: q.toLowerCase() }), 0);
  };

  // Handle price slider change
  const handlePriceChange = (e, idx) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      // Ensure min <= max
      if (updated[0] > updated[1]) {
        if (idx === 0) updated[1] = updated[0];
        else updated[0] = updated[1];
      }
      // Emit filter to parent
      onFilterChange?.({
        ...filters,
        price: [updated[0], updated[1]],
      });
      return updated;
    });
  };

  if (!sidebarData) return <aside className="p-4">Loading...</aside>;

  const { propertyValues = {}, displayTypes = {}, locations = [], categoryTypes = [] } = sidebarData;

  return (
    <aside className="w-full md:w-80 bg-[#EAE8E1] p-4 space-y-4">
      <h3 className="text-xl font-semibold mt-[80px]">
        Filter {sidebarData?.categoryName || ""}
      </h3>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 rounded border"
      />

      {/* Location filters... scrollable */}
      {locations.length > 0 && (
        <div>
          <h4 className="font-medium">Location</h4>
          <div
            className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2"
            style={{ minHeight: "40px" }}
          >
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => handleFilterChange("location", loc)}
                className={`px-3 py-1 rounded border ${
                  (filters.location || []).includes(loc)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex items-center justify-between text-sm mb-2">
          <span>₹{minPrice}</span>
          <span>₹{maxPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Min: ₹{priceRange[0]}</span>
          <span>Max: ₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Other filters... */}
      {Object.entries(propertyValues).map(([prop, values]) => {
        const type = displayTypes[prop] || "text";
        return (
          <div key={prop}>
            <h4 className="font-medium capitalize">{prop}</h4>
            {type === "checkbox" ? (
              <div className="flex flex-wrap ">
                {values.map((v, idx) => (
                  <label
                    key={v}
                    className="flex items-center w-1/2 min-w-[120px] max-w-[50%] whitespace-nowrap"
                    style={{ marginBottom: "0.25rem" }}
                  >
                    <input
                      type="checkbox"
                      checked={(filters[prop] || []).includes(v)}
                      onChange={() => handleFilterChange(prop, v)}
                      className="mr-2"
                    />
                    {v}
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleFilterChange(prop, v)}
                    className={`px-3 py-1 rounded border ${
                      (filters[prop] || []).includes(v)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {/* Category Types */}
      {categoryTypes && categoryTypes.length > 0 && (
        <div>
          <h4 className="font-medium">Category Types</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {categoryTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange("categoryType", type)}
                className={`px-3 py-1 rounded border ${
                  (filters.categoryType || []).includes(type)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      
    </aside>
  );
};

export default Sidebar;
