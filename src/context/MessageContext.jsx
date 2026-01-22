// src/context/MessageContext.jsx - CORRECTED VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  sendMessage as sendMessageService,
  getConversations as getConversationsService,
  getConversation as getConversationService,
  getUnreadCount as getUnreadCountService,
  markAsRead as markAsReadService,
  deleteMessage as deleteMessageService
} from '../services/messageService';

const MessageContext = createContext();

export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch conversations and unread count when user logs in
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchUnreadCount();
      
      // Set mock notifications for now
      setNotifications([
        {
          id: 1,
          type: 'message',
          message: 'Welcome to Garage Sale Messaging!',
          timestamp: new Date()
        }
      ]);
    } else {
      setConversations([]);
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('🔍 Fetching conversations...');
      const response = await getConversationsService();
      console.log('📦 API Response:', response);
      console.log('📦 Response data:', response.data);
      
      if (response.data.success) {
        console.log('✅ Raw conversations data:', response.data.data);
        setConversations(response.data.data || []);
      } else {
        console.log('❌ API returned success: false');
        console.log('❌ Error message:', response.data.message);
      }
    } catch (error) {
      console.log('❌ Error fetching conversations:', error);
      console.log('❌ Error response:', error.response);
      console.log('❌ Error data:', error.response?.data);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      const response = await getUnreadCountService();
      
      if (response.data.success) {
        setUnreadCount(response.data.data?.unreadCount || 0);
      }
    } catch (error) {
      console.log('Error fetching unread count:', error.message);
      setUnreadCount(0);
    }
  };

  const sendMessage = async (receiverId, content, itemId = null) => {
    try {
      console.log('📤 Sending message to:', receiverId);
      console.log('📤 Message content:', content);
      console.log('📤 Item ID:', itemId);
      
      const response = await sendMessageService(receiverId, content, itemId);
      console.log('✅ Send message response:', response);
      
      if (response.data.success) {
        // Refresh conversations after sending message
        await fetchConversations();
        await fetchUnreadCount();
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      // Check if it's a 404 (endpoint might not be fully implemented yet)
      if (error.response?.status === 404) {
        alert('Messaging feature is being implemented. Please try again later!');
      } else {
        alert('Failed to send message. Please try again.');
      }
      throw error;
    }
  };

  const getConversation = async (userId) => {
    try {
      const response = await getConversationService(userId);
      
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await markAsReadService(messageId);
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteMessageService(messageId);
      await fetchConversations();
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const value = {
    conversations,
    unreadCount,
    notifications,
    loading,
    sendMessage,
    getConversation,
    markAsRead,
    deleteMessage,
    fetchConversations,
    addNotification
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};