// src/components/PrivateRoute.jsx - UPDATED
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute Debug:', { 
    user, 
    loading, 
    pathname: location.pathname,
    localStorageToken: localStorage.getItem('token')
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} />;
}