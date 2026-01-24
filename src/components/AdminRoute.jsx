// src/components/AdminRoute.jsx - UPDATED
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user is admin - handle different property names
  console.log('🔍 AdminRoute - User object:', user);
  console.log('🔍 AdminRoute - Checking role:', {
    role: user.role,
    Role: user.Role,
    userType: user.userType,
    UserType: user.UserType
  });

  // Try different possible property names
  const isAdmin = 
    user.role === 'admin' || 
    user.Role === 'admin' || 
    user.role === 'Admin' || 
    user.Role === 'Admin' ||
    user.userType === 'admin' ||
    user.UserType === 'admin' ||
    user.userType === 'Admin' ||
    user.UserType === 'Admin';

  console.log('🔍 AdminRoute - Is admin?', isAdmin);

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}