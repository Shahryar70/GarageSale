// src/pages/Register.jsx - Update the entire file

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPhone, 
  FaMapMarkerAlt,
  FaCheckCircle 
} from 'react-icons/fa';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  location: '',
  // No userType field
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError(null);
  };

// Update the validateForm function - REMOVE the userType validation
const validateForm = () => {
  const newErrors = {};
  
  if (!formData.fullName.trim()) {
    newErrors.fullName = 'Full name is required';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }
  
  // REQUIRED: Phone validation
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  }
  
  // REMOVE THIS SECTION - No more userType validation
  // if (!['Donor', 'Receiver', 'Admin'].includes(formData.userType)) {
  //   newErrors.userType = 'Please select a valid user type';
  // }
  
  return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setErrors({});
  
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
  
  setLoading(true);
  
  // 🔥 CHANGE TO PascalCase to match C# DTO
  const registerData = {
    FullName: formData.fullName,
    Email: formData.email,
    Password: formData.password,
    Phone: formData.phone,
    Location: formData.location || null
  };
  
  console.log('Registration data being sent:', JSON.stringify(registerData, null, 2));
  
  try {
    const result = await register(registerData);
    
    setLoading(false);
    
    if (result.success) {
      console.log('Registration successful!', result);
      alert('Registration successful! Redirecting...');
      navigate('/dashboard');
    } else {
      console.log('Registration failed:', result.error);
      setError(result.error || 'Registration failed');
    }
  } catch (err) {
    setLoading(false);
    console.error('Registration catch error:', err);
    
    if (err.message) {
      setError(err.message);
    } else if (err.errors) {
      const backendErrors = Object.values(err.errors).flat();
      setError(backendErrors.join(', '));
    } else {
      setError('Registration failed. Please check console for details.');
    }
  }
};
  // ... (rest of the component remains the same, but update the form fields)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Benefits (same as before) */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-cyan-700 text-white p-12 flex-col justify-between">
          <div>
            <Link to="/" className="text-3xl font-bold flex items-center gap-2 mb-8">
              <span className="text-white">Garage</span>
              <span className="text-green-200">Sale</span>
            </Link>
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-blue-100 text-lg mb-8">
              Sign up to start sharing, swapping, and making a difference.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-2xl text-green-300 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Donate First</h4>
                  <p className="text-blue-200">Help someone in need</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-2xl text-green-300 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Swap Second</h4>
                  <p className="text-blue-200">Trade items you need</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-2xl text-green-300 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Earn EcoScore</h4>
                  <p className="text-blue-200">Get rewarded for sustainability</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-blue-200 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="md:hidden mb-8">
            <Link to="/" className="text-3xl font-bold">
              <span className="text-green-600">Garage</span>
              <span className="text-blue-600">Sale</span>
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Start your sustainable sharing journey today</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email Address *
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
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password *
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* REQUIRED: Phone Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Optional: Location Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Location (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="City, State"
                    disabled={loading}
                  />
                </div>
              </div>


<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
  <div className="flex items-center">
    <div className="text-blue-600 mr-3">ℹ️</div>
    <div>
      <p className="font-medium text-blue-800">All users are registered as regular members</p>
      <p className="text-blue-600 text-sm">You can browse items, post items, and message other users after registration.</p>
    </div>
  </div>
</div>
              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-5 h-5 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  disabled={loading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-600 hover:underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-600 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              By creating an account, you agree to our commitment to sustainability and community building.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}