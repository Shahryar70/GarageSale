import { useState, useEffect, useCallback } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaFilter, FaTag, FaExchangeAlt, FaGift } from 'react-icons/fa';
import { itemsService } from '../services/itemsService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItemFilter from '../components/ItemFilter';
import ItemCard from '../components/ItemCard';
import { processImagesArray } from '../utils/imageUtils'; 
export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    itemType: '',
    city: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    condition: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchItems = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...(filters.category && { category: filters.category }),
      ...(filters.itemType && { itemType: filters.itemType }),
      ...(filters.city && { city: filters.city }),
      ...(filters.search && { search: filters.search })
    };

    console.log('📡 Fetching items with params:', params);
    const data = await itemsService.getItems(params);
    
    // Process items - ensure images are properly formatted
    const processedItems = (data.items || []).map(item => {
      // Use the utility function to process images
      const images = processImagesArray(item.images || item.Images || []);
      
      return {
        ...item,
        images: images
      };
    });
    
    setItems(processedItems);
    setPagination(data.pagination || {
      page: 1,
      pageSize: 20,
      totalItems: 0,
      totalPages: 1
    });
  } catch (err) {
    console.error('❌ Error fetching items:', err);
    setError('Failed to load items. Please try again.');
    setItems([]);
  } finally {
    setLoading(false);
  }
}, [filters, pagination.page, pagination.pageSize]);

  // Fetch categories and conditions
const fetchCategoriesAndConditions = async () => {
  try {
    const [categoriesData, conditionsData] = await Promise.all([
      itemsService.getCategories(),
      itemsService.getConditions()
    ]);
    setCategories(categoriesData);
    setConditions(conditionsData);
  } catch (err) {
    console.error('Error fetching categories/conditions:', err);
    // Use default values if API fails
    setCategories(['Furniture', 'Electronics', 'Clothing', 'Books', 'Other']);
    setConditions(['New', 'Like New', 'Good', 'Fair', 'Poor']);
  }
};

  // Initialize from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    
    ['category', 'itemType', 'city', 'search', 'minPrice', 'maxPrice', 'condition'].forEach(param => {
      const value = searchParams.get(param);
      if (value) urlFilters[param] = value;
    });
    
    setFilters(prev => ({ ...prev, ...urlFilters }));
  }, [location.search]);

  // Fetch data when filters or page change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchCategoriesAndConditions();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
    
    // Update URL
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        searchParams.set(key, value);
      }
    });
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const handleResetFilters = () => {
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
    setFilters(resetFilters);
    navigate('', { replace: true });
  };

  const getItemTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'donate': return 'bg-green-100 text-green-800';
      case 'swap': return 'bg-blue-100 text-blue-800';
      case 'sell': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'donate': return <FaGift className="mr-1" />;
      case 'swap': return <FaExchangeAlt className="mr-1" />;
      case 'sell': return <FaTag className="mr-1" />;
      default: return <FaTag className="mr-1" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Items</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchItems}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Amazing Items</h1>
          <p className="text-green-100">Browse through items to donate, swap, or buy</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ItemFilter
              filters={filters}
              categories={categories}
              conditions={conditions}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar and Mobile Filter Button */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                      placeholder="Search items (title, description)..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </form>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition"
                >
                  <FaFilter />
                  Filters
                  {Object.values(filters).filter(v => v).length > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.category && (
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange({ ...filters, category: '' })}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.itemType && (
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    Type: {filters.itemType}
                    <button
                      onClick={() => handleFilterChange({ ...filters, itemType: '' })}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.city && (
                  <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    Location: {filters.city}
                    <button
                      onClick={() => handleFilterChange({ ...filters, city: '' })}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button
                      onClick={() => handleFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {Object.values(filters).filter(v => v).length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-lg w-full max-w-md mt-20">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <ItemFilter
                      filters={filters}
                      categories={categories}
                      conditions={conditions}
                      onFilterChange={handleFilterChange}
                      onReset={handleResetFilters}
                      isMobile={true}
                    />
                  </div>
                  <div className="p-4 border-t">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {loading ? 'Loading items...' : `${pagination.totalItems} items found`}
                </h2>
                <p className="text-gray-600 text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Items Grid */}
            {!loading && items.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!loading && items.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {items.map((item) => (
    <ItemCard
      key={item.itemId || item.ItemId || `item-${Math.random()}`}
      item={item}
      isAuthenticated={isAuthenticated}
    />
  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 border rounded-lg ${
                              pagination.page === pageNum
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}