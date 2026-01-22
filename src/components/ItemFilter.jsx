// src/components/ItemFilter.jsx
import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

export default function ItemFilter({ filters, categories, conditions, onFilterChange, onReset, isMobile }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      itemType: '',
      city: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      condition: ''
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${isMobile ? '' : 'sticky top-24'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <FaFilter className="mr-2" />
          Filters
        </h3>
        <button
          onClick={handleReset}
          className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          <FaTimes className="mr-1" />
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={localFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Item Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Type
          </label>
          <select
            value={localFilters.itemType}
            onChange={(e) => handleChange('itemType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Donate">Donate</option>
            <option value="Swap">Swap</option>
            <option value="Sell">Sell</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={localFilters.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Any Condition</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">For "Sell" items only</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            placeholder="Enter city"
            value={localFilters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Mobile Apply Button */}
        {isMobile && (
          <button
            onClick={applyFilters}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Apply Filters
          </button>
        )}

        {/* Desktop auto-applies */}
        {!isMobile && (
          <button
            onClick={applyFilters}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          >
            Apply Changes
          </button>
        )}
      </div>
    </div>
  );
}