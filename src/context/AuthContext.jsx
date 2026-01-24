// src/context/AuthContext.jsx - UPDATED VERSION WITH ROLE-BASED REDIRECTION
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
        // Add role to user data if not present
        const userWithRole = {
          ...userData,
          role: userData.role || userData.Role || 'user', // Handle both uppercase and lowercase
          verificationStatus: userData.verificationStatus || 'Unverified',
          priorityLevel: userData.priorityLevel || 0,
          itemsReceivedThisMonth: userData.itemsReceivedThisMonth || 0,
          cnicNicop: userData.cnicNicop || null,
          isSingleMother: userData.isSingleMother || false,
          isDisabled: userData.isDisabled || false
        };
        setUser(userWithRole);
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
      
      if (response.success || response.token) {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.user) {
          // Add role to registered user
          const userWithRole = {
            ...response.user,
            role: response.user.role || response.user.Role || 'user',
            verificationStatus: response.user.verificationStatus || 'Unverified',
            priorityLevel: response.user.priorityLevel || 0,
            itemsReceivedThisMonth: response.user.itemsReceivedThisMonth || 0,
            cnicNicop: response.user.cnicNicop || null,
            isSingleMother: response.user.isSingleMother || false,
            isDisabled: response.user.isDisabled || false
          };
          localStorage.setItem('user', JSON.stringify(userWithRole));
          setUser(userWithRole);
        }
        return { success: true, data: response };
      } else {
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
    
    if (response.Success || response.success || response.token) {
      const user = response.User || response.user || response.data?.user;
      if (user) {
        // Add role checking with better validation
        const userRole = user.role || user.Role || user.roleType || 'user';
        console.log('🔑 Detected user role:', userRole);
        
        const userWithVerification = {
          ...user,
          role: userRole,
          verificationStatus: user.verificationStatus || 'Unverified',
          priorityLevel: user.priorityLevel || 0,
          itemsReceivedThisMonth: user.itemsReceivedThisMonth || 0,
          cnicNicop: user.cnicNicop || null,
          isSingleMother: user.isSingleMother || false,
          isDisabled: user.isDisabled || false
        };
        
        console.log('🔑 Final user object:', userWithVerification);
        setUser(userWithVerification);
        localStorage.setItem('user', JSON.stringify(userWithVerification));
        
        if (response.token || response.data?.token) {
          const token = response.token || response.data.token;
          localStorage.setItem('token', token);
        }
        
        return { 
          success: true, 
          user: userWithVerification, 
          data: response 
        };
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

  // Update User Function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Helper function to check user role
  const isAdmin = () => {
    return user?.role === 'admin' || user?.Role === 'admin';
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin: isAdmin(), // Add isAdmin check
    register,
    login,
    logout,
    setError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};