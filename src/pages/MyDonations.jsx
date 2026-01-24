// src/pages/MyDonations.jsx - UPDATED & FIXED
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaGift,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaUser,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../services/api';

export default function MyDonations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'donating'
  const [donationRequests, setDonationRequests] = useState([]);
  const [itemsDonating, setItemsDonating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch donation requests (items user requested to receive)
      const requestsRes = await api.get('/Donations/my-requests');
      console.log('📊 My requests response:', requestsRes.data);
      
      if (requestsRes.data && Array.isArray(requestsRes.data)) {
        setDonationRequests(requestsRes.data);
      } else {
        setDonationRequests([]);
      }
      
      // Fetch items user is donating (items user is giving away)
      const donatingRes = await api.get('/Donations/my-donations');
      console.log('📊 My donations response:', donatingRes.data);
      
      if (donatingRes.data && Array.isArray(donatingRes.data)) {
        setItemsDonating(donatingRes.data);
      } else {
        setItemsDonating([]);
      }
      
    } catch (err) {
      console.error('❌ Error fetching donations:', err);
      setError('Failed to load donations data. Please try again.');
      
      // Set empty arrays on error
      setDonationRequests([]);
      setItemsDonating([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (donationId) => {
    try {
      // TODO: Call API to accept request
      console.log('Accepting donation:', donationId);
      alert('Donation accepted! Arrange meeting with recipient.');
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (donationId) => {
    try {
      // TODO: Call API to reject request
      console.log('Rejecting donation:', donationId);
      alert('Request rejected');
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  const handleCancelRequest = async (donationId) => {
    try {
      if (window.confirm('Are you sure you want to cancel this donation request?')) {
        await api.delete(`/Donations/${donationId}`);
        fetchDonations(); // Refresh data
        alert('Donation request cancelled successfully');
      }
    } catch (err) {
      console.error('❌ Error cancelling donation:', err);
      alert('Failed to cancel request');
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'requested':
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: FaClock,
          text: 'Pending'
        };
      case 'accepted':
        return {
          color: 'bg-green-100 text-green-800',
          icon: FaCheckCircle,
          text: 'Accepted'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: FaTimesCircle,
          text: 'Rejected'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: FaCheckCircle,
          text: 'Completed'
        };
      case 'proofsubmitted':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: FaCamera,
          text: 'Proof Submitted'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: FaClock,
          text: status || 'Pending'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donations...</p>
        </div>
      </div>
    );
  }

  // Check if user needs verification (only for receivers, not for admins)
  const isAdmin = user?.UserType === 'Admin' || user?.userType === 'Admin';
  const needsVerification = !isAdmin && user?.VerificationStatus !== 'Verified';

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Verification Required</h2>
            <p className="text-yellow-700 mb-4">
              {user?.VerificationStatus === 'Pending' 
                ? 'Your verification is pending approval. You can still browse items but cannot request donations until verified.'
                : 'You need to complete identity verification to request donations.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/verification"
                className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-medium"
              >
                {user?.VerificationStatus === 'Pending' ? 'Check Status' : 'Start Verification'}
              </Link>
              <Link
                to="/browse-items"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600">Manage your donation requests and items you're donating</p>
          
          {/* Show stats only for non-admin users */}
          {!isAdmin && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Verification: {user?.VerificationStatus || 'Unverified'}
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                Priority Level: {user?.PriorityLevel || 0}/10
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Items this month: {(user?.ItemsReceivedThisMonth || 0)}/2
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaGift className="inline mr-2" />
            My Requests ({donationRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('donating')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'donating'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaBox className="inline mr-2" />
            Items I'm Donating ({itemsDonating.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'requests' ? (
            <div>
              {donationRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <FaGift className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Donation Requests</h3>
                  <p className="text-gray-500 mb-4">
                    {isAdmin 
                      ? 'Admins don\'t request donations.' 
                      : 'You haven\'t requested any donation items yet.'}
                  </p>
                  {!isAdmin && (
                    <Link
                      to="/browse-items"
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Browse Items to Request
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y">
                  {donationRequests.map((request) => {
                    const statusConfig = getStatusBadge(request.Status);
                    const StatusIcon = statusConfig.icon; // Store icon in variable
                    
                    return (
                      <div key={request.DonationId} className="p-6 hover:bg-gray-50 transition">
                        {request.Status === 'Accepted' && (
                          <div className="mt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                              <h4 className="font-medium text-green-800 mb-2">📸 Ready to Upload Proof!</h4>
                              <p className="text-green-700 text-sm mb-3">
                                You received the item? Upload a photo to complete the donation.
                              </p>
                              <Link
                                to={`/donations/${request.DonationId}/upload-proof`}
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                              >
                                <FaCamera />
                                Upload Proof Photo
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {request.Status === 'ProofSubmitted' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              📸 Proof Submitted - Waiting for donor verification
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{request.ItemTitle}</h3>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.color}`}>
                                <StatusIcon size={12} />
                                {statusConfig.text}
                              </span>
                              <div className="flex items-center text-gray-600 text-sm">
                                <FaUser className="mr-1" />
                                <span>Donor: {request.DonorName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <FaCalendarAlt className="inline mr-1" />
                            Requested: {new Date(request.RequestDate).toLocaleDateString()}
                          </div>
                        </div>

                        {request.RequestMessage && (
                          <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                            {request.RequestMessage}
                          </p>
                        )}

                        {request.Status === 'Accepted' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-green-800 mb-2">Meeting Arranged!</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {request.MeetingDate && (
                                <div>
                                  <span className="text-sm text-gray-600">Meeting Date:</span>
                                  <p className="font-medium">
                                    {new Date(request.MeetingDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {request.MeetingLocation && (
                                <div>
                                  <span className="text-sm text-gray-600">Location:</span>
                                  <p className="font-medium flex items-center">
                                    <FaMapMarkerAlt className="mr-1" />
                                    {request.MeetingLocation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <Link
                            to={`/items/${request.ItemId}`}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            View Item Details →
                          </Link>
                          
                          {request.Status === 'Requested' && (
                            <button
                              onClick={() => handleCancelRequest(request.DonationId)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {itemsDonating.length === 0 ? (
                <div className="p-8 text-center">
                  <FaBox className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Items Donating</h3>
                  <p className="text-gray-500 mb-4">You haven't posted any items for donation.</p>
                  <Link
                    to="/add-item"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Add Item to Donate
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {itemsDonating.map((item) => {
                    const statusConfig = getStatusBadge(item.Status);
                    const StatusIcon = statusConfig.icon; // Store icon in variable
                    
                    return (
                      <div key={item.DonationId} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.ItemTitle}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${statusConfig.color}`}>
                                <StatusIcon size={10} />
                                {statusConfig.text}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/items/${item.ItemId}`}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            View Item →
                          </Link>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Receiver:</span>
                              <p className="font-medium">{item.ReceiverName || 'Not assigned yet'}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Request Date:</span>
                              <p className="font-medium">
                                {item.RequestDate ? new Date(item.RequestDate).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          
                          {item.RequestMessage && (
                            <div className="mt-3">
                              <span className="text-sm text-gray-600">Receiver's Message:</span>
                              <p className="text-gray-700 mt-1">{item.RequestMessage}</p>
                            </div>
                          )}

                          {/* ✅ Proof Submitted Section for Donors */}
                          {item.Status === 'ProofSubmitted' && (
                            <div className="mt-3">
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <h4 className="font-medium text-yellow-800 mb-1">📸 Proof Submitted</h4>
                                <p className="text-yellow-700 text-sm mb-2">
                                  {item.ReceiverName} has uploaded proof photo. Please verify it.
                                </p>
                                <Link
                                  to={`/donations/${item.DonationId}/verify-proof`}
                                  className="inline-flex items-center gap-1 bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 text-sm"
                                >
                                  <FaCamera />
                                  Verify Proof
                                </Link>
                              </div>
                            </div>
                          )}

                          {item.Status === 'Requested' && (
                            <div className="flex gap-3 mt-4">
                              <button
                                onClick={() => handleAcceptRequest(item.DonationId)}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                              >
                                Accept Request
                              </button>
                              <button
                                onClick={() => handleRejectRequest(item.DonationId)}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}