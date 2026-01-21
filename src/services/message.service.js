// src/services/message.service.js
import api from "./api";

export const getConversations = () => api.get("/conversations");
export const getMessages = (id) => api.get(`/conversations/${id}/messages`);
export const sendMessage = (id, data) =>
  api.post(`/conversations/${id}/messages`, data);
