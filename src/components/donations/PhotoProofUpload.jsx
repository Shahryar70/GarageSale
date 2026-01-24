// src/components/donations/PhotoProofUpload.jsx
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  FaCamera, 
  FaUpload, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowLeft,
  FaImage
} from 'react-icons/fa';

export default function PhotoProofUpload() {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleUpload = async () => {
    if (!photo) {
      setError('Please select a photo first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('photoFile', photo);
      if (message) formData.append('message', message);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/PhotoProof/upload/${donationId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Proof uploaded successfully! Donor will verify it.');
        setTimeout(() => {
          navigate('/my-donations');
        }, 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <FaCamera className="text-green-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Upload Proof Photo
              </h1>
              <p className="text-gray-600">
                Donation #{donationId?.substring(0, 8)}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">📸 How to take a good proof photo:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✓ Show yourself clearly holding the item</li>
              <li>✓ Make sure the item is visible and recognizable</li>
              <li>✓ Good lighting so photo is clear</li>
              <li>✓ Include any packaging or documentation</li>
              <li>✓ Smile! 😊 This makes donors happy</li>
            </ul>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <FaTimesCircle className="mr-2" />
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <FaCheckCircle className="mr-2" />
                {success}
              </div>
            </div>
          )}

          {/* Photo Preview/Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Proof Photo *
            </label>
            
            {preview ? (
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Proof preview" 
                  className="w-full h-64 object-cover rounded-lg border-2 border-green-200"
                />
                <button
                  onClick={() => {
                    setPhoto(null);
                    setPreview('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition"
              >
                <FaImage className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to select photo</p>
                <p className="text-sm text-gray-500">Max 5MB • JPG, PNG, GIF</p>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Optional Message to Donor
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Thank you for the donation! This will really help my family..."
            />
            <p className="text-sm text-gray-500 mt-1">
              A thank you message increases trust and makes donors happy
            </p>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                required 
                className="mt-1" 
                id="terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I confirm this photo shows me receiving the actual item I requested.
                I understand that submitting fake photos may result in account suspension.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !photo}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaUpload className="mr-2" />
                  Upload Proof
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Why Photo Proof?</h3>
          <p className="text-sm text-yellow-700">
            This system prevents fraud and builds trust in our community. 
            Donors can see their items actually reach people in need, which encourages more donations.
            Your photo will only be visible to the donor and admin.
          </p>
        </div>
      </div>
    </div>
  );
}