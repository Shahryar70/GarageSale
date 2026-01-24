// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userData, statsData] = await Promise.all([
        userService.getCurrentUser(),
        userService.getUserStats()
      ]);
      setUser(userData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const updateData = {
      fullName: formData.get('fullName'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      bio: formData.get('bio')
    };

    try {
      const response = await userService.updateProfile(updateData);
      setUser(response.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const passwordData = {
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword')
    };

    try {
      await userService.changePassword(passwordData);
      setSuccess('Password changed successfully!');
      e.target.reset();
    } catch (err) {
      setError(err.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Update Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={user?.fullName}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={user?.phone}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={user?.location}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={user?.bio}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>

     {/* Right Column - Stats */}
<div className="space-y-8">
  {/* User Stats */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold mb-6">Your Stats</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
        <span className="font-medium">EcoScore</span>
        <span className="text-2xl font-bold text-green-600">{user?.ecoScore || 0}</span>
      </div>
      {/* ... other stats ... */}
    </div>
  </div>
{/* Verification Status Card */}
<div className="bg-white rounded-xl shadow-lg p-6">
  <h2 className="text-xl font-bold mb-6">Verification Status</h2>
  <div className="space-y-4">
    {/* Verification Badge */}
    <div className={`p-3 rounded-lg ${
      user?.verificationStatus === 'Verified' ? 'bg-green-50 border border-green-200' :
      user?.verificationStatus === 'Pending' ? 'bg-yellow-50 border border-yellow-200' :
      'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex justify-between items-center">
        <span className="font-medium">Status:</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          user?.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
          user?.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user?.verificationStatus || 'Not Verified'}
        </span>
      </div>
      
      {/* Priority Level */}
      {user?.verificationStatus === 'Verified' && user?.priorityLevel > 0 && (
        <div className="mt-3 flex justify-between items-center">
          <span className="font-medium">Priority Level:</span>
          <div className="flex items-center">
            {[...Array(user.priorityLevel)].map((_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
            {[...Array(10 - user.priorityLevel)].map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300">★</span>
            ))}
            <span className="ml-2 font-bold text-blue-600">{user.priorityLevel}/10</span>
          </div>
        </div>
      )}
    </div>

    {/* Monthly Donation Limit */}
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">Monthly Donation Limit</span>
        <span className="text-lg font-bold text-blue-600">
          {(user?.itemsReceivedThisMonth || 0)} / 2 items
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${Math.min(((user?.itemsReceivedThisMonth || 0) / 2) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Resets on the 1st of each month
      </p>
    </div>

    {/* Verification Action Button */}
    {user?.verificationStatus !== 'Verified' && (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 mb-3">
          {user?.verificationStatus === 'Pending' 
            ? 'Your verification is under review. This usually takes 24-48 hours.'
            : 'Verification is required to request donation items.'}
        </p>
        <Link
          to="/verification"
          className="block w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition font-medium text-center"
        >
          {user?.verificationStatus === 'Pending' ? 'Check Status' : 'Start Verification'}
        </Link>
      </div>
    )}

    {/* Donation History Link */}
    {user?.verificationStatus === 'Verified' && (
      <Link
        to="/my-donations"
        className="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-center"
      >
        View My Donations
      </Link>
    )}
  </div>
</div>
  {/* Account Info */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold mb-6">Account Information</h2>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">User Type</span>
        <span className="font-medium">{user?.userType}</span>
      </div>
      {/* ... other info ... */}
    </div>
  </div>
</div>
      </div>
    </div>
  );
}