// src/services/messageService.js - UPDATED with both named and default exports
import api from './api';

// Named exports
export const sendMessage = async (receiverId, content, itemId = null, donationId = null, swapId = null) => {
  return api.post('/Messages', {
    receiverId,
    content,
    itemId,
    donationId,
    swapId
  });
};

export const getConversations = async () => {
  return api.get('/Messages/conversations');
};

export const getConversation = async (userId) => {
  return api.get(`/Messages/conversation/${userId}`);
};

export const getUnreadCount = async () => {
  return api.get('/Messages/unread-count');
};

export const markAsRead = async (messageId) => {
  return api.put(`/Messages/${messageId}/read`, { isRead: true });
};

export const deleteMessage = async (messageId) => {
  return api.delete(`/Messages/${messageId}`);
};

export const searchMessages = async (query) => {
  return api.get(`/Messages/search?query=${encodeURIComponent(query)}`);
};

export const getMessagesForItem = async (itemId) => {
  return api.get(`/Messages/with-item/${itemId}`);
};

// Default export (object with all methods)
const messageService = {
  sendMessage,
  getConversations,
  getConversation,
  getUnreadCount,
  markAsRead,
  deleteMessage,
  searchMessages,
  getMessagesForItem
};

export default messageService;