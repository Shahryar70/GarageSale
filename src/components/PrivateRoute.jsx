// src/components/PrivateRoute.jsx - UPDATED
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Prevent admin users from accessing regular dashboard through this route
  // (they should use the admin dashboard instead)
  const isAdmin = 
    user.role === 'admin' || 
    user.Role === 'admin' || 
    user.role === 'Admin' || 
    user.Role === 'Admin' ||
    user.userType === 'admin' ||
    user.UserType === 'admin' ||
    user.userType === 'Admin' ||
    user.UserType === 'Admin';

  // If an admin user tries to access regular user routes, redirect them to admin dashboard
  if (isAdmin && location.pathname === '/dashboard') {
    console.log('🔄 Admin user accessing regular dashboard, redirecting to admin dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}