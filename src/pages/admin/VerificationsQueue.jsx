// src/pages/admin/VerificationsQueue.jsx - UPDATED
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function VerificationsQueue() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPendingVerifications();
  }, []);
  
  const fetchPendingVerifications = async () => {
    try {
      const response = await api.get('/Admin/verifications/pending');
      console.log('📊 Pending verifications response:', response.data);
      
      // API returns { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        setPendingUsers(response.data.data);
      } else {
        console.error('❌ Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching pending verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (userId, action) => {
    try {
      await api.put(`/Admin/verifications/${userId}/action`, {
        Action: action,
        Reason: action === 'reject' ? 'Please provide valid documents' : ''
      });
      
      fetchPendingVerifications(); // Refresh
      alert(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('❌ Error processing verification:', error);
      alert('Error processing verification');
    }
  };

  const VerificationBadge = ({ status }) => {
    switch(status) {
      case 'Verified':
        return <span className="badge badge-success">Verified</span>;
      case 'Pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'Rejected':
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge">Unverified</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pending Verifications</h1>
          <p className="text-gray-600">Review and verify user applications</p>
          <div className="mt-2 text-sm text-gray-500">
            {pendingUsers.length} pending verification{pendingUsers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Clear!</h3>
            <p className="text-gray-500">No pending verifications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingUsers.map(user => (
              <div key={user.UserId} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{user.FullName}</h3>
                      <p className="text-sm text-gray-600">{user.Email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(user.CreatedDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Priority: {user.PriorityLevel || 0}/10
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">CNIC/NICOP:</span>
                      <span className="text-gray-900 font-mono">{user.CNIC_NICOP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Monthly Income:</span>
                      <span className="text-gray-900">{user.MonthlyIncomeRange || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Family Size:</span>
                      <span className="text-gray-900">{user.FamilySize || 'N/A'} members</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Annual Income:</span>
                      <span className="text-gray-900">${user.AnnualIncome?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.IsSingleMother && (
                      <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">
                        Single Mother
                      </span>
                    )}
                    {user.IsDisabled && (
                      <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Disabled
                      </span>
                    )}
                    {user.IsOrphanage && (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Orphanage
                      </span>
                    )}
                  </div>
                  
                  {user.NeedsDescription && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Needs Description:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {user.NeedsDescription}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerificationAction(user.UserId, 'approve')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleVerificationAction(user.UserId, 'reject')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}