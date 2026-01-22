// src/pages/Messages.jsx - COMPLETE FIXED VERSION
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { 
  FaEnvelope, 
  FaPaperPlane, 
  FaComments, 
  FaSearch, 
  FaUser, 
  FaExclamationTriangle,
  FaSpinner,
  FaCheck,
  FaCheckDouble
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Messages() {
  const { user } = useAuth();
  const { conversations, loading, getConversation, fetchConversations, sendMessage } = useMessages();
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to get properties in either case
  const getConvProp = (conv, propName) => {
    // Try camelCase first, then PascalCase
    return conv?.[propName] || 
           conv?.[propName.charAt(0).toUpperCase() + propName.slice(1)] || 
           '';
  };

  // Helper function to get user ID (handles different property names)
  const getUserId = () => {
    return user?.userId || user?.UserId || user?.id || user?.Id || '';
  };

  // Load conversation when selected
  useEffect(() => {
    if (selectedConversation) {
      const userId = getConvProp(selectedConversation, 'otherUserId');
      if (userId) {
        loadConversation(userId);
      }
    }
  }, [selectedConversation]);

  // Refresh conversations on mount
  useEffect(() => {
    if (user) {
      refreshConversations();
    }
  }, [user]);

  const refreshConversations = async () => {
    try {
      setError('');
      await fetchConversations();
    } catch (err) {
      setError('Failed to load conversations. Please try again.');
      console.error('Error refreshing conversations:', err);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const messages = await getConversation(userId);
      console.log('📨 Loaded conversation messages:', messages);
      console.log('🔍 Current user ID:', getUserId());
      
      if (messages && messages.length > 0) {
        console.log('🔍 First message sender ID:', messages[0]?.senderId || messages[0]?.SenderId);
        console.log('🔍 Is same as user ID?', String(messages[0]?.senderId || messages[0]?.SenderId) === String(getUserId()));
      }
      
      setConversationMessages(messages || []);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation messages.');
    }
  };

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) {
      return;
    }

    const receiverId = getConvProp(selectedConversation, 'otherUserId');
    if (!receiverId) {
      setError('Cannot send message: No receiver ID');
      return;
    }

    setSending(true);
    try {
      console.log('📤 Sending message to:', receiverId);
      console.log('📤 Message:', newMessage);
      
      const response = await sendMessage(receiverId, newMessage);
      console.log('✅ Send response:', response);
      
      if (response.success) {
        // Clear input
        setNewMessage('');
        
        // Reload conversation messages
        await loadConversation(receiverId);
        
        // Refresh conversations list
        await refreshConversations();
      } else {
        setError(response.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('❌ Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    getConvProp(conv, 'otherUserName')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getConvProp(conv, 'lastMessage')?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="opacity-90">Chat with other users about items</p>
            </div>
            <div className="text-right">
              <button 
                onClick={refreshConversations}
                className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded mb-2"
              >
                Refresh
              </button>
              <div className="text-sm opacity-90">You have {conversations.length} conversations</div>
              {conversations.some(c => getConvProp(c, 'unreadCount') > 0) && (
                <div className="mt-1">
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    {conversations.reduce((sum, conv) => sum + (getConvProp(conv, 'unreadCount') || 0), 0)} unread
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <FaExclamationTriangle className="mr-3" />
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-700 hover:text-red-900 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Debug Button - REMOVE THIS IN PRODUCTION */}
        <button 
          onClick={() => {
            console.log('🔍 User object:', user);
            console.log('🔍 User ID (getUserId):', getUserId());
            console.log('🔍 Selected conversation:', selectedConversation);
            console.log('🔍 Conversation messages:', conversationMessages);
            
            if (conversationMessages.length > 0) {
              conversationMessages.forEach((msg, index) => {
                console.log(`🔍 Message ${index}:`, {
                  senderId: msg?.senderId || msg?.SenderId,
                  userId: getUserId(),
                  isEqual: String(msg?.senderId || msg?.SenderId) === String(getUserId())
                });
              });
            }
          }}
          className="mb-4 text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Debug IDs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Search Bar */}
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

              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setSelectedTab('inbox')}
                  className={`flex-1 py-3 font-medium text-center ${
                    selectedTab === 'inbox'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaEnvelope className="inline mr-2" />
                  Inbox
                </button>
                <button
                  onClick={() => setSelectedTab('sent')}
                  className={`flex-1 py-3 font-medium text-center ${
                    selectedTab === 'sent'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaPaperPlane className="inline mr-2" />
                  Sent
                </button>
              </div>

              {/* Conversations List */}
              <div className="max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div>
                    {filteredConversations.map((conv, index) => (
                      <div
                        key={getConvProp(conv, 'otherUserId') || index}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          getConvProp(selectedConversation, 'otherUserId') === getConvProp(conv, 'otherUserId') ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              {getConvProp(conv, 'otherUserName') ? (
                                <span className="text-green-800 font-medium">
                                  {getConvProp(conv, 'otherUserName').charAt(0)}
                                </span>
                              ) : (
                                <FaUser className="text-green-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {getConvProp(conv, 'otherUserName') || 'Unknown User'}
                              </h3>
                              <p className="text-gray-600 text-sm truncate max-w-[150px]">
                                {getConvProp(conv, 'lastMessage') || 'No messages yet'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              {getConvProp(conv, 'lastMessageDate') ? 
                                new Date(getConvProp(conv, 'lastMessageDate')).toLocaleDateString() : 
                                'Recently'
                              }
                            </div>
                            {(getConvProp(conv, 'unreadCount') || 0) > 0 && (
                              <span className="inline-block bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                                {getConvProp(conv, 'unreadCount')} new
                              </span>
                            )}
                          </div>
                        </div>
                        {getConvProp(conv, 'itemTitle') && (
                          <div className="mt-2">
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              About: {getConvProp(conv, 'itemTitle')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaComments className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {conversations.length === 0 
                        ? "No conversations yet" 
                        : "No conversations match your search"
                      }
                    </h3>
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
          </div>

          {/* Right Column - Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          {getConvProp(selectedConversation, 'otherUserName') ? (
                            <span className="text-green-800 font-medium">
                              {getConvProp(selectedConversation, 'otherUserName').charAt(0)}
                            </span>
                          ) : (
                            <FaUser className="text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {getConvProp(selectedConversation, 'otherUserName') || 'Unknown User'}
                          </h3>
                          {getConvProp(selectedConversation, 'itemTitle') && (
                            <p className="text-sm text-gray-600">
                              About: {getConvProp(selectedConversation, 'itemTitle')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversationMessages.length > 0 && (
                          <span>{conversationMessages.length} messages</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto max-h-[400px]">
                    {conversationMessages.length > 0 ? (
                      <div className="space-y-4">
                        {conversationMessages.map((msg, index) => {
                          // Helper for message properties
                          const getMsgProp = (propName) => {
                            return msg?.[propName] || 
                                   msg?.[propName.charAt(0).toUpperCase() + propName.slice(1)] || 
                                   '';
                          };
                          
                          const senderId = getMsgProp('senderId');
                          const content = getMsgProp('content') || getMsgProp('text');
                          const sentDate = getMsgProp('sentDate') || getMsgProp('createdAt');
                          const isRead = getMsgProp('isRead') || getMsgProp('read');
                          
                          // FIX: Compare as STRINGS to handle GUID/UUID formats
                          const isMyMessage = String(senderId).toLowerCase() === String(getUserId()).toLowerCase();
                          
                          // Get sender name
                          const senderName = isMyMessage 
                            ? 'You' 
                            : getConvProp(selectedConversation, 'otherUserName') || 'Unknown User';
                          
                          return (
                            <div
                              key={getMsgProp('messageId') || index}
                              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%] ${isMyMessage ? 'mr-2' : 'ml-2'}`}>
                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    isMyMessage
                                      ? 'bg-green-600 text-white rounded-br-none' // Your messages - Green
                                      : 'bg-gray-100 text-gray-800 rounded-bl-none' // Other's messages - Light gray
                                  }`}
                                >
                                  <p className="break-words">{content}</p>
                                  <div className={`text-xs mt-2 flex items-center justify-between ${
                                    isMyMessage ? 'text-green-200' : 'text-gray-500'
                                  }`}>
                                    {/* Show sender name */}
                                    <span className={`font-medium ${isMyMessage ? '' : ''}`}>
                                      {senderName}
                                    </span>
                                    
                                    {/* Time and status on the right */}
                                    <div className="flex items-center">
                                      <span className="mr-2">
                                        {sentDate ? 
                                          new Date(sentDate).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                          }) : 
                                          'Recently'
                                        }
                                      </span>
                                      {isMyMessage && (
                                        <span title={isRead ? 'Read' : 'Sent'}>
                                          {isRead ? (
                                            <FaCheckDouble className="text-blue-300" />
                                          ) : (
                                            <FaCheck className="opacity-50" />
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <FaComments className="text-4xl text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No messages in this conversation yet</p>
                          <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${getConvProp(selectedConversation, 'otherUserName')}...`}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Send
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}