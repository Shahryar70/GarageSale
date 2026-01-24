// src/components/donations/PhotoProofVerification.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaImage, FaUser, FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
export default function PhotoProofVerification() {
  const { donationId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [proof, setProof] = useState(null);
  const [donation, setDonation] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProofDetails();
  }, [donationId]);

  const fetchProofDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/PhotoProof/${donationId}`);
      
      if (response.data.success) {
        setProof(response.data.data);
        
        // Also get donation details
        const donationRes = await api.get(`/Donations/${donationId}`);
        if (donationRes.data) {
          setDonation(donationRes.data);
        }
      }
    } catch (err) {
      console.error('Error fetching proof:', err);
      setError('Failed to load proof details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (action) => { // 'approve' or 'reject'
    if (action === 'reject' && !rejectReason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const response = await api.put(`/PhotoProof/verify/${donationId}`, {
        action: action,
        reason: rejectReason
      });

      if (response.data.success) {
        alert(`Proof ${action}d successfully!`);
        navigate('/my-donations'); // Go back to donations page
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || `Failed to ${action} proof.`);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proof details...</p>
        </div>
      </div>
    );
  }

  if (error || !proof) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Proof</h2>
            <p className="text-red-700 mb-4">{error || 'No proof found for this donation.'}</p>
            <button
              onClick={() => navigate('/my-donations')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Donations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Proof Photo
          </h1>
          <p className="text-gray-600">
            Donation #{donationId.substring(0, 8)} • Item: {proof.DonationStatus}
          </p>
          
          {/* Receiver Info */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <FaUser className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Receiver Information</h3>
                <p className="text-blue-700">
                  {proof.UploadedBy} • Uploaded: {new Date(proof.UploadedDate).toLocaleDateString()}
                </p>
                {donation?.ReceiverPriority > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    Priority Level: {donation.ReceiverPriority}/10
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Proof Photo */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <FaImage className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Proof Photo</h2>
          </div>

          {proof.ImageUrl ? (
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={proof.ImageUrl} 
                alt="Proof of receipt" 
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FaImage className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photo available</p>
            </div>
          )}

          {/* Message from Receiver */}
          {proof.Message && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Message from Receiver:</h4>
              <p className="text-gray-700">{proof.Message}</p>
            </div>
          )}
        </div>

        {/* Verification Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Decision</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Reject Reason Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Reason for Rejection (if rejecting):
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Please explain why you're rejecting this proof (e.g., wrong item, unclear photo, etc.)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleVerify('approve')}
              disabled={verifying}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
            >
              <FaCheckCircle />
              {verifying ? 'Verifying...' : 'Approve Proof'}
            </button>
            
            <button
              onClick={() => handleVerify('reject')}
              disabled={verifying || !rejectReason.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
            >
              <FaTimesCircle />
              {verifying ? 'Processing...' : 'Reject Proof'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Verification Guidelines:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✓ Approve if the photo shows the correct item you donated</li>
              <li>✓ Approve if the receiver is clearly visible with the item</li>
              <li>✓ Reject if the photo is unclear or shows wrong item</li>
              <li>✓ Reject if you suspect fraudulent activity</li>
              <li>✓ Your decision affects the receiver's trust score</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}