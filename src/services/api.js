// src/services/api.js
import axios from 'axios';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5293/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// In api.js, update request interceptor:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Update response interceptor:
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log error details
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // Handle specific errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
// Auth service functions
export const authService = {
  register: async (registerData) => {
    try {
      // Remove userType from data being sent
      const { userType, ...dataToSend } = registerData;
      
      console.log('📡 Sending registration (userType removed):', dataToSend);
      
      const response = await api.post('/Auth/register', dataToSend);
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (loginData) => {
    try {
      const response = await api.post('/Auth/login', loginData);
      
      // Store token and user
      if (response.data.Token) {
        localStorage.setItem('token', response.data.Token);
        localStorage.setItem('user', JSON.stringify(response.data.User));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/Auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/Auth/me');
      return response.data;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      throw error.response?.data || { message: 'Failed to get user' };
    }
  }
};

// Export api instance and auth service
export { api };
export default api;