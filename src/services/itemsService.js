// src/services/itemsService.js
import api from './api';

export const itemsService = {
  // Get all items with filters
  getItems: async (params = {}) => {
    try {
      const response = await api.get('/Items', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Get single item by ID
  getItem: async (itemId) => {
    try {
      const response = await api.get(`/Items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  },

  // Create new item
  createItem: async (itemData) => {
    try {
      console.log('Creating item:', itemData);
      const response = await api.post('/Items', itemData);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`/Items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (itemId) => {
    try {
      const response = await api.delete(`/Items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Get user's items
  getMyItems: async () => {
    try {
      const response = await api.get('/Items/my-items');
      return response.data;
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await api.get('/Items/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return ['Furniture', 'Electronics', 'Clothing', 'Books', 'Other'];
    }
  },

  // Get conditions
  getConditions: async () => {
    try {
      const response = await api.get('/Items/conditions');
      return response.data;
    } catch (error) {
      console.error('Error fetching conditions:', error);
      return ['New', 'Like New', 'Good', 'Fair', 'Poor'];
    }
  }
};