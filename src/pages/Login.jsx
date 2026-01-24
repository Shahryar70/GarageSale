// src/pages/Login.jsx
import { useState,useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && (user.role === 'admin' || user.Role === 'admin')) {
    navigate('/admin/dashboard', { replace: true });
  }
}, [navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

// In Login.jsx - Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  console.log('🔄 Login form submitted:', formData);
  
  const result = await login(formData);
  
  setLoading(false);
  console.log('🔄 Login result:', result);
  
  if (result.success) {
    // Get user from result
    const user = result.user || JSON.parse(localStorage.getItem('user'));
    console.log('✅ Login successful, user:', user);
    
    // Check user role
    const isAdmin = 
      user?.role === 'admin' || 
      user?.Role === 'admin' || 
      user?.role === 'Admin' || 
      user?.Role === 'Admin' ||
      user?.userType === 'admin' ||
      user?.UserType === 'admin' ||
      user?.userType === 'Admin' ||
      user?.UserType === 'Admin';
    
    let redirectPath;
    
    if (isAdmin) {
      redirectPath = '/admin/dashboard';
      console.log('🔄 Redirecting ADMIN to:', redirectPath);
    } else {
      // For regular users, check if 'from' path is safe
      redirectPath = from || '/dashboard';
      
      // Prevent regular users from being redirected to admin routes
      if (redirectPath.startsWith('/admin/')) {
        redirectPath = '/dashboard';
      }
      
      console.log('🔄 Redirecting USER to:', redirectPath);
    }
    
    navigate(redirectPath, { replace: true });
  } else {
    console.log('❌ Login failed:', result.error);
    setError(result.error || 'Login failed');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex bg-gradient-to-br from-green-600 to-emerald-700 text-white p-12 flex-col justify-between">
          <div>
            <Link to="/" className="text-3xl font-bold flex items-center gap-2 mb-8">
              <span className="text-white">Garage</span>
              <span className="text-blue-200">Sale</span>
            </Link>
            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
            <p className="text-green-100 text-lg mb-8">
              Continue your sustainable journey. Login to access your dashboard, manage items, and connect with our community.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <FaEnvelope className="text-2xl" />
              </div>
              <div>
                <h4 className="font-bold">50,000+ Members</h4>
                <p className="text-green-200 text-sm">Join our growing community</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FaLock className="text-2xl" />
              </div>
              <div>
                <h4 className="font-bold">Secure & Safe</h4>
                <p className="text-green-200 text-sm">Your data is protected</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-green-200">
              New to GarageSale?{' '}
              <Link to="/register" className="text-white font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12">
          <div className="md:hidden mb-8">
            <Link to="/" className="text-3xl font-bold">
              <span className="text-green-600">Garage</span>
              <span className="text-blue-600">Sale</span>
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">Access your account to continue sharing sustainably</p>
            </div>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3.5 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

        
            {/* Sign Up Link */}
            <div className="mt-8 text-center md:hidden">
              <p className="text-gray-600">
                New to GarageSale?{' '}
                <Link to="/register" className="text-green-600 font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}