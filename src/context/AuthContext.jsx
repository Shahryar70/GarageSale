// src/context/AuthContext.jsx - UPDATED
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      console.log('📝 AuthContext Register:', userData);
      
      const response = await authService.register(userData);
      console.log('📝 AuthContext Register Response:', response);
      
      // Handle different response formats
      if (response.success || response.token) {
        // Store token if provided
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
        }
        return { success: true, data: response };
      } else {
        // If we got here, registration worked but response format is unexpected
        console.log('Registration succeeded but response format unexpected:', response);
        return { 
          success: true, 
          data: { 
            message: 'Registration successful',
            user: response 
          } 
        };
      }
    } catch (error) {
      console.error('AuthContext Register Error:', error);
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('🔑 AuthContext Login:', credentials);
      
      const response = await authService.login(credentials);
      console.log('🔑 AuthContext Login Response:', response);
      
      // Handle both uppercase and lowercase success property
      if (response.Success || response.success || response.token) {
        // Update user state
        const user = response.User || response.user;
        if (user) {
          setUser(user);
        }
        return { success: true, data: response };
      } else {
        throw new Error(response.Message || response.message || 'Login failed');
      }
    } catch (error) {
      console.error('AuthContext Login Error:', error);
      setError(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🔥 ADD THIS: isAuthenticated property
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated, // 🔥 ADD THIS LINE
    register,
    login,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};