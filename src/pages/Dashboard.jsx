// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileUpdateModal from '../components/Modals/ProfileUpdateModal';
import { FaEdit } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{user?.fullName}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                EcoScore: {user?.ecoScore || 0}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user?.userType}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <FaEdit />
            Edit Profile
          </button>
        </div>
        
        {/* Additional profile info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium">{user?.phone || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Location</p>
            <p className="font-medium">{user?.location || 'Not set'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Rating</p>
            <p className="font-medium">{user?.rating?.toFixed(1) || '0.0'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="font-medium">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {user?.bio && (
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-2">Bio</p>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Profile Update Modal */}
      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}