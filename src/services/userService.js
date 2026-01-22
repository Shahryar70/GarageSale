// src/services/userService.js
import api from './api';

const userService = {
  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/Users/me');
      return response.data;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw error.response?.data || { message: 'Failed to get user profile' };
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID (GUID)
   * @returns {Promise} User data
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/Users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get user by ID error:', error);
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @param {string} [profileData.fullName] - New full name
   * @param {string} [profileData.phone] - New phone number
   * @param {string} [profileData.location] - New location
   * @param {string} [profileData.bio] - New bio
   * @returns {Promise} Updated user data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/Users/me', profileData);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @returns {Promise} Success message
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/Users/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  /**
   * Get user statistics
   * @returns {Promise} User statistics
   */
  getUserStats: async () => {
    try {
      const response = await api.get('/Users/stats/me');
      return response.data;
    } catch (error) {
      console.error('❌ Get user stats error:', error);
      throw error.response?.data || { message: 'Failed to get user statistics' };
    }
  },

  // ADMIN FUNCTIONS

  /**
   * Get all users (Admin only)
   * @returns {Promise} Array of all users
   */
  getAllUsers: async () => {
    try {
      const response = await api.get('/Users');
      return response.data;
    } catch (error) {
      console.error('❌ Get all users error:', error);
      throw error.response?.data || { message: 'Failed to get all users' };
    }
  },

  /**
   * Update user status (Admin only)
   * @param {string} userId - User ID to update
   * @param {boolean} isActive - New status
   * @returns {Promise} Success message
   */
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/Users/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('❌ Update user status error:', error);
      throw error.response?.data || { message: 'Failed to update user status' };
    }
  },

  /**
   * Upload profile image
   * @param {File} imageFile - Image file to upload
   * @returns {Promise} Uploaded image URL
   */
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/Users/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload profile image error:', error);
      throw error.response?.data || { message: 'Failed to upload image' };
    }
  }
};

export default userService;