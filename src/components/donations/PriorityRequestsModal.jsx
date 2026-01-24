// src/components/donations/PriorityRequestsModal.jsx
import { useState, useEffect } from 'react';
import { 
  FaFemale, 
  FaWheelchair, 
  FaHome, 
  FaUsers, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaStar
} from 'react-icons/fa';
import api from '../services/api';

export default function PriorityRequestsModal({ itemId, onClose, onSelect }) {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPriorityRequests();
  }, [itemId]);

  const fetchPriorityRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Donations/items/${itemId}/requests-priority`);
      
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching priority requests:', err);
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priorityScore) => {
    if (priorityScore >= 70) return { color: 'bg-red-100 text-red-800', label: 'Highest' };
    if (priorityScore >= 50) return { color: 'bg-orange-100 text-orange-800', label: 'High' };
    if (priorityScore >= 30) return { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' };
    return { color: 'bg-green-100 text-green-800', label: 'Normal' };
  };

  const handleAcceptRequest = async (requestId, receiverId) => {
    try {
      if (onSelect) {
        onSelect(requestId, receiverId);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Donation Requests by Priority</h2>
              <p className="text-gray-600">Select the most deserving person for your donation</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 my-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Requests List */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request, index) => {
                const priorityBadge = getPriorityBadge(request.PriorityScore);
                
                return (
                  <div 
                    key={request.DonationId} 
                    className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.color}`}>
                            #{index + 1} • {priorityBadge.label} Priority
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            Score: {request.PriorityScore}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.ReceiverName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {request.IsSingleMother && (
                            <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                              <FaFemale /> Single Mother
                            </span>
                          )}
                          {request.IsDisabled && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              <FaWheelchair /> Disabled
                            </span>
                          )}
                          {request.IsOrphanage && (
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                              <FaHome /> Orphanage
                            </span>
                          )}
                          {request.FamilySize > 5 && (
                            <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              <FaUsers /> Family of {request.FamilySize}
                            </span>
                          )}
                          {request.MonthlyIncomeRange === '<30k' && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              <FaMoneyBillWave /> Low Income
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          Items this month: {request.ItemsReceivedThisMonth}/2
                        </div>
                        <button
                          onClick={() => handleAcceptRequest(request.DonationId, request.ReceiverId)}
                          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          <FaCheckCircle />
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Request Message */}
                    {request.RequestMessage && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-sm">{request.RequestMessage}</p>
                      </div>
                    )}

                    {/* Priority Factors */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium">Priority Score</div>
                        <div className="text-green-600 font-bold">{request.PriorityScore}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Family Size</div>
                        <div className="text-gray-700">{request.FamilySize}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Monthly Income</div>
                        <div className="text-gray-700">{request.MonthlyIncomeRange || 'Not specified'}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Status</div>
                        <div className={`px-2 py-1 rounded-full ${request.VerificationStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {request.VerificationStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {requests.length} request{requests.length !== 1 ? 's' : ''} sorted by priority
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}