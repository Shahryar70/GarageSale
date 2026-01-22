// src/pages/EditItem.jsx - COMPLETE WITH ALL FORM FIELDS
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { itemsService } from '../services/itemsService';
import { 
  FaImage, 
  FaMapMarkerAlt, 
  FaDollarSign,
  FaExchangeAlt,
  FaGift,
  FaPlusCircle,
  FaArrowLeft,
  FaSave,
  FaTag
} from 'react-icons/fa';
import { processImagesArray } from '../utils/imageUtils';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    condition: '',
    itemType: 'Donate',
    price: '',
    city: '',
    state: '',
    postalCode: '',
    images: [],
    isDeliveryAvailable: false,
    deliveryRange: '',
    preferredSwapCategory: '',
    urgent: false,
    expiryDate: ''
  });

  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchItem();
    fetchCategoriesAndConditions();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const itemData = await itemsService.getItem(id);
      
      // Check if user owns this item
      const isOwner = itemData.isOwner || itemData.IsOwner || false;
      if (!isOwner) {
        alert('You do not have permission to edit this item.');
        navigate(`/items/${id}`);
        return;
      }

      // Helper to get property
      const getProp = (prop) => itemData[prop] || itemData[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';

      // Process images
      const images = processImagesArray(itemData.images || itemData.Images || []);
      
      setFormData({
        title: getProp('title'),
        description: getProp('description'),
        category: getProp('category'),
        subCategory: getProp('subCategory'),
        condition: getProp('condition'),
        itemType: getProp('itemType'),
        price: itemData.askingPrice || itemData.AskingPrice || '',
        city: getProp('city'),
        state: getProp('state'),
        postalCode: getProp('postalCode'),
        images: images,
        isDeliveryAvailable: itemData.isDeliveryAvailable || itemData.IsDeliveryAvailable || false,
        deliveryRange: itemData.deliveryRange || itemData.DeliveryRange || '',
        preferredSwapCategory: getProp('preferredSwapCategory'),
        urgent: itemData.urgent || itemData.Urgent || false,
        expiryDate: itemData.expiryDate || itemData.ExpiryDate || ''
      });

      // Set image previews
      setImagePreviews(images);

    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Failed to load item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndConditions = async () => {
    try {
      const [catsData, condsData] = await Promise.all([
        itemsService.getCategories(),
        itemsService.getConditions()
      ]);
      setCategories(catsData);
      setConditions(condsData);
    } catch (err) {
      console.error('Error fetching categories/conditions:', err);
      setCategories(['Furniture', 'Electronics', 'Clothing', 'Books', 'Other']);
      setConditions(['New', 'Like New', 'Good', 'Fair', 'Poor']);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        setError('Only image files are allowed');
        return false;
      }
      if (!isValidSize) {
        setError('Image size should be less than 5MB');
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    const readerPromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.condition) {
      setError('Condition is required');
      return false;
    }
    if (!formData.city) {
      setError('Location is required');
      return false;
    }
    if (formData.itemType === 'Sell' && !formData.price) {
      setError('Price is required for items for sale');
      return false;
    }
    if (formData.itemType === 'Sell' && parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const imagesString = formData.images.join(';');
      
      const itemData = {
        Title: formData.title,
        Description: formData.description,
        Category: formData.category,
        SubCategory: formData.subCategory || null,
        Condition: formData.condition,
        ItemType: formData.itemType,
        Price: formData.itemType === 'Sell' ? parseFloat(formData.price) : null,
        City: formData.city,
        State: formData.state || null,
        PostalCode: formData.postalCode || null,
        Images: imagesString,
        IsDeliveryAvailable: formData.isDeliveryAvailable,
        DeliveryRange: formData.deliveryRange ? parseInt(formData.deliveryRange) : null,
        PreferredSwapCategory: formData.preferredSwapCategory || null,
        Urgent: formData.urgent,
        ExpiryDate: formData.expiryDate || null
      };

      console.log('📡 Updating item with data:', itemData);
      const result = await itemsService.updateItem(id, itemData);
      console.log('✅ Item updated:', result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/items/${id}`);
        }, 2000);
      } else {
        setError(result.message || 'Failed to update item.');
      }
    } catch (err) {
      console.error('❌ Error updating item:', err);
      let errorMessage = 'Failed to update item. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const backendErrors = Object.values(err.response.data.errors).flat();
        errorMessage = backendErrors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login', { state: { from: `/edit-item/${id}` } });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(`/items/${id}`)}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Item
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Item</h1>
            <p className="text-gray-600">Update your item details</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Item updated successfully! Redirecting...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Basic Information
                </h2>
                
                {/* Title */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What are you listing?"
                    maxLength={100}
                    disabled={submitting}
                  />
                  <p className="text-sm text-gray-500 mt-1">Be descriptive and clear</p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your item in detail..."
                    maxLength={1000}
                    disabled={submitting}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
                </div>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={submitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-category */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sub-category (Optional)
                  </label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Sofa, Laptop, T-shirt"
                    disabled={submitting}
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={submitting}
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Item Type */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Listing Type
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: 'Donate', price: '' }))}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.itemType === 'Donate'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <FaGift className="text-2xl mx-auto mb-2 text-green-600" />
                    <div className="font-medium">Donate</div>
                    <p className="text-sm text-gray-600 mt-1">Give away for free</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: 'Swap', price: '' }))}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.itemType === 'Swap'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <FaExchangeAlt className="text-2xl mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Swap</div>
                    <p className="text-sm text-gray-600 mt-1">Trade for something else</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: 'Sell' }))}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.itemType === 'Sell'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <FaDollarSign className="text-2xl mx-auto mb-2 text-purple-600" />
                    <div className="font-medium">Sell</div>
                    <p className="text-sm text-gray-600 mt-1">Sell for money</p>
                  </button>
                </div>

                {/* Price Field (only for Sell) */}
                {formData.itemType === 'Sell' && (
                  <div className="mb-6 max-w-xs">
                    <label className="block text-gray-700 font-medium mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaDollarSign className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                {/* Preferred Swap Category (only for Swap) */}
                {formData.itemType === 'Swap' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      What would you like to swap for? (Optional)
                    </label>
                    <input
                      type="text"
                      name="preferredSwapCategory"
                      value={formData.preferredSwapCategory}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Books, Kitchenware, Electronics"
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Images
                </h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Images (Max 5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Drag & drop images or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={submitting || formData.images.length >= 5}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaPlusCircle className="inline mr-2" />
                      Choose Images
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Up to 5 images, each under 5MB
                    </p>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-gray-700 font-medium mb-3">Selected Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location & Delivery */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Location & Delivery
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* City */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Your city"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      State (Optional)
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="State/Province"
                      disabled={submitting}
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="ZIP/Postal code"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDeliveryAvailable"
                      name="isDeliveryAvailable"
                      checked={formData.isDeliveryAvailable}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      disabled={submitting}
                    />
                    <label htmlFor="isDeliveryAvailable" className="ml-2 text-gray-700">
                      I can deliver this item
                    </label>
                  </div>

                  {formData.isDeliveryAvailable && (
                    <div className="ml-6">
                      <label className="block text-gray-700 font-medium mb-2">
                        Delivery Range (Optional)
                      </label>
                      <input
                        type="text"
                        name="deliveryRange"
                        value={formData.deliveryRange}
                        onChange={handleChange}
                        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 10 miles, City-wide"
                        disabled={submitting}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                  Additional Options
                </h2>
                
                <div className="space-y-4">
                  {/* Urgent */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgent"
                      name="urgent"
                      checked={formData.urgent}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      disabled={submitting}
                    />
                    <label htmlFor="urgent" className="ml-2 text-gray-700">
                      Mark as Urgent Listing
                    </label>
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      ⚡ High Priority
                    </span>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={submitting}
                    />
                    <p className="text-sm text-gray-500 mt-1">Item will be auto-removed after this date</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Item...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Item
                    </>
                  )}
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  By updating this item, you confirm these changes are accurate.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}