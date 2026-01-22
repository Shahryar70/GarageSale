// src/components/ItemCard.jsx - COMPLETE VERSION
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEye, FaHeart, FaTag, FaExchangeAlt, FaGift } from 'react-icons/fa';
import { getFirstImageUrl } from '../utils/imageUtils';

export default function ItemCard({ item, isAuthenticated }) {
  // Create a safe item object with proper fallbacks
  const itemData = {
    itemId: item?.itemId || item?.ItemId || '',
    title: item?.title || item?.Title || 'No Title',
    description: item?.description || item?.Description || '',
    category: item?.category || item?.Category || 'Other',
    condition: item?.condition || item?.Condition || '',
    itemType: item?.itemType || item?.ItemType || 'Donate',
    askingPrice: item?.askingPrice || item?.AskingPrice || null,
    city: item?.city || item?.City || '',
    images: item?.images || item?.Images || [],
    views: item?.views || item?.Views || 0,
    interestCount: item?.interestCount || item?.InterestCount || 0,
    urgent: item?.urgent || item?.Urgent || false,
    isOwner: item?.isOwner || item?.IsOwner || false,
    ownerName: item?.ownerName || item?.OwnerName || '',
    createdDate: item?.createdDate || item?.CreatedDate || null
  };

  // Helper functions
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
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

  const getConditionColor = (condition) => {
    switch(condition?.toLowerCase()) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get the first valid image URL
  const firstImageUrl = getFirstImageUrl(itemData.images);

  return (
    <Link to={`/items/${itemData.itemId}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {firstImageUrl ? (
            <img
              src={firstImageUrl}
              alt={itemData.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaTag className="text-4xl" />
              <span className="ml-2 text-sm">No Image</span>
            </div>
          )}
          
          {/* Item Type Badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getItemTypeColor(itemData.itemType)}`}>
            <span className="flex items-center">
              {getItemTypeIcon(itemData.itemType)}
              {itemData.itemType}
            </span>
          </div>
          
          {/* Condition Badge */}
          {itemData.condition && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(itemData.condition)}`}>
              {itemData.condition}
            </div>
          )}
          
          {/* Urgent Badge */}
          {itemData.urgent && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-medium">
              ⚡ Urgent
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{itemData.title}</h3>
            <span className="font-bold text-green-600 text-lg">
              {itemData.itemType === 'Donate' ? 'FREE' : formatPrice(itemData.askingPrice)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {itemData.description}
          </p>

          {/* Category */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <FaTag className="mr-1" size={12} />
            <span className="capitalize">{itemData.category}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <FaMapMarkerAlt className="mr-1" size={12} />
            <span className="truncate">{itemData.city || 'Location not specified'}</span>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3">
            <div className="flex items-center">
              <FaEye className="mr-1" />
              <span>{itemData.views || 0} views</span>
            </div>
            <div className="flex items-center">
              <FaHeart className="mr-1" />
              <span>{itemData.interestCount || 0} interested</span>
            </div>
          </div>

          {/* Owner Badge */}
          {itemData.isOwner && (
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Your Item
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}