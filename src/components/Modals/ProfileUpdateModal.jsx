// src/components/ProfileUpdateModal.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import { FaTimes } from 'react-icons/fa';

export default function ProfileUpdateModal({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      
      if (response.user) {
        setUser(response.user);
      }
      
      setSuccess('Profile updated!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              defaultValue={user?.fullName || ''}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={user?.phone || ''}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={user?.location || ''}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={user?.bio || ''}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}