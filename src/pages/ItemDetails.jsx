// src/pages/ItemDetails.jsx - COMPLETE FIXED VERSION
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaTag, 
  FaEye, 
  FaHeart, 
  FaUser, 
  FaArrowLeft,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaExchangeAlt,
  FaGift
} from 'react-icons/fa';
import MessageButton from '../components/messages/MessageButton';
import { useAuth } from '../context/AuthContext';
import { itemsService } from '../services/itemsService';
import { processImagesArray } from '../utils/imageUtils';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const itemData = await itemsService.getItem(id);
      
      console.log('🔍 Item details response:', itemData);
      
      // Use the utility function to process images
      itemData.images = processImagesArray(itemData.images || itemData.Images || []);
      
      setItem(itemData);
    } catch (err) {
      console.error('Error fetching item:', err);
      setError('Item not found or an error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely get item properties (handle both camelCase and PascalCase)
  const getItemProperty = (item, propName) => {
    if (!item) return '';
    // Try camelCase first, then PascalCase
    return item[propName] || item[propName.charAt(0).toUpperCase() + propName.slice(1)] || '';
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
      case 'donate': return <FaGift className="inline mr-1" />;
      case 'swap': return <FaExchangeAlt className="inline mr-1" />;
      case 'sell': return <FaDollarSign className="inline mr-1" />;
      default: return <FaTag className="inline mr-1" />;
    }
  };

  const getConditionColor = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'new': return 'text-green-600';
      case 'like new': return 'text-blue-600';
      case 'good': return 'text-yellow-600';
      case 'fair': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/items/${id}` } });
      return;
    }
    // TODO: Implement messaging
    alert('Messaging feature coming soon!');
  };

  const handleEdit = () => {
    navigate(`/edit-item/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await itemsService.deleteItem(id);
      alert('Item deleted successfully!');
      navigate('/browse-items');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert(err.response?.data?.message || 'Failed to delete item. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The item you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/browse-items')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  // Safely get all properties
  const title = getItemProperty(item, 'title');
  const description = getItemProperty(item, 'description');
  const category = getItemProperty(item, 'category');
  const subCategory = getItemProperty(item, 'subCategory');
  const condition = getItemProperty(item, 'condition');
  const itemType = getItemProperty(item, 'itemType');
  const askingPrice = item.askingPrice || item.AskingPrice || 0;
  const city = getItemProperty(item, 'city');
  const state = getItemProperty(item, 'state');
  const views = item.views || item.Views || 0;
  const interestCount = item.interestCount || item.InterestCount || 0;
  const createdDate = item.createdDate || item.CreatedDate;
  const ownerName = item.ownerName || item.OwnerName || 'Unknown';
  const isOwner = item.isOwner || item.IsOwner || false;
  const ownerId = item.ownerId || item.OwnerId || '';
  const sellerInfo = {
    userId: ownerId,
    fullName: ownerName
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse-items')}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="h-96 flex items-center justify-center bg-gray-100">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[activeImage]}
                    alt={title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <FaTag className="text-6xl mx-auto mb-4" />
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      activeImage === index ? 'border-green-600' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U21hbGw8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Item Type Badge and Actions */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getItemTypeColor(itemType)}`}>
                    {getItemTypeIcon(itemType)}
                    {itemType}
                  </span>
                  
                  {/* Owner Actions */}
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        <FaTrash size={12} />
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaHeart />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaShareAlt />
                  </button>
                </div>
              </div>

              {/* Title and Price */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {itemType === 'Donate' ? 'FREE' : `$${parseFloat(askingPrice || 0).toFixed(2)}`}
                </span>
              </div>

              {/* Condition */}
              <div className="mb-4">
                <span className="text-sm text-gray-600">Condition: </span>
                <span className={`font-medium ${getConditionColor(condition)}`}>
                  {condition}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span>{city}{state ? `, ${state}` : ''}</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {description || 'No description provided.'}
                </p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {category || 'Uncategorized'}
                  </span>
                  {subCategory && (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {subCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Item Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm text-gray-600">Listing Type:</span>
                    <div className="font-medium">{itemType}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="font-medium">{item.status || 'Available'}</div>
                  </div>
                  {item.urgent && (
                    <div className="col-span-2">
                      <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        ⚡ Urgent Listing
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex space-x-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center">
                  <FaEye className="mr-1" />
                  <span>{views} views</span>
                </div>
                <div className="flex items-center">
                  <FaHeart className="mr-1" />
                  <span>{interestCount} interested</span>
                </div>
                <div className="text-gray-400">
                  Listed {createdDate ? new Date(createdDate).toLocaleDateString() : 'Recently'}
                </div>
              </div>

             <div className="border-t pt-6">
        {!isAuthenticated ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              <span className="font-semibold">Login required:</span> You need to login to contact the seller.
            </p>
            <Link
              to="/login"
              state={{ from: `/items/${id}` }}
              className="inline-block mt-2 text-green-600 hover:text-green-800 font-medium"
            >
              Login Now
            </Link>
          </div>
        ) : isOwner ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium">This is your item.</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Edit Item
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaTrash />
                  {deleting ? 'Deleting...' : 'Delete Item'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Replace the old contact button with MessageButton */}
            <MessageButton 
              seller={sellerInfo}
              itemId={id}
              itemTitle={title}
              itemType={itemType}
            />
            
            {/* Optional: Keep other action buttons based on item type */}
            {itemType === 'Sell' && (
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Make Offer
              </button>
            )}
          </div>
        )}
      </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{ownerName}</h4>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaMapMarkerAlt className="mr-1" size={12} />
                    <span>{city || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaTag className="mr-1" size={12} />
                    <span>Member since {createdDate ? new Date(createdDate).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  {item.rating && (
                    <div className="mt-2">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        ⭐ {item.rating}/5 Rating
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}