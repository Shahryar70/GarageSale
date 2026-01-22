// src/pages/Inbox.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../services/messageService';
import { FaEnvelope, FaUser, FaClock, FaSearch } from 'react-icons/fa';

export default function Inbox() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      if (response.data.success) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please login to view messages</h2>
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="opacity-90">Your conversations</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading conversations...</p>
              </div>
            ) : filteredConversations.length > 0 ? (
              <div>
                {filteredConversations.map((conv, index) => (
                  <Link
                    key={index}
                    to={`/conversation/${conv.otherUserId}`}
                    className="block p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          {conv.otherUserName ? (
                            <span className="text-green-800 font-medium">
                              {conv.otherUserName.charAt(0)}
                            </span>
                          ) : (
                            <FaUser className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {conv.otherUserName || 'Unknown User'}
                          </h3>
                          <p className="text-gray-600 text-sm truncate max-w-[200px]">
                            {conv.lastMessage || 'No messages yet'}
                          </p>
                          {conv.itemTitle && (
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                              About: {conv.itemTitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {conv.lastMessageDate ? 
                            new Date(conv.lastMessageDate).toLocaleDateString() : 
                            'Recently'
                          }
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="inline-block bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                            {conv.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-4">
                  Start a conversation by messaging a seller from an item page
                </p>
                <Link
                  to="/browse-items"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Browse Items
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-blue-600 mr-3">ℹ️</div>
            <div>
              <h4 className="font-medium text-blue-800">Inbox Information</h4>
              <p className="text-blue-700 text-sm mt-1">
                • Click on any conversation to view messages<br/>
                • Red badge shows unread messages<br/>
                • Search conversations by user name or message content
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}