// src/pages/Verification.jsx - COMPLETE VERIFICATION PAGE
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaIdCard,
  FaCamera,
  FaMoneyBillWave,
  FaUsers,
  FaFemale,
  FaWheelchair,
  FaHome,
  FaCheckCircle,
  FaArrowLeft,
  FaFileUpload
} from 'react-icons/fa';
import api from '../services/api';

export default function Verification() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    CNIC_NICOP: '',
    IDFrontImage: '',
    IDBackImage: '',
    SelfieWithID: '',
    AnnualIncome: '',
    FamilySize: '',
    MonthlyIncomeRange: '',
    IsSingleMother: false,
    IsDisabled: false,
    IsOrphanage: false,
    NeedsDescription: ''
  });

  const steps = [
    { number: 1, title: 'CNIC Details', icon: FaIdCard },
    { number: 2, title: 'Financial Info', icon: FaMoneyBillWave },
    { number: 3, title: 'Family Details', icon: FaUsers },
    { number: 4, title: 'Needs Assessment', icon: FaCheckCircle }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: 'Image must be less than 5MB' }));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [field]: 'Please upload an image file' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.CNIC_NICOP.trim()) newErrors.CNIC_NICOP = 'CNIC/NICOP is required';
      else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.CNIC_NICOP)) {
        newErrors.CNIC_NICOP = 'Format: XXXXX-XXXXXXX-X';
      }
      if (!formData.IDFrontImage) newErrors.IDFrontImage = 'Front image is required';
      if (!formData.IDBackImage) newErrors.IDBackImage = 'Back image is required';
      if (!formData.SelfieWithID) newErrors.SelfieWithID = 'Selfie with ID is required';
    }
    
    if (step === 2) {
      if (!formData.AnnualIncome) newErrors.AnnualIncome = 'Annual income is required';
      else if (formData.AnnualIncome < 0) newErrors.AnnualIncome = 'Income cannot be negative';
      if (!formData.MonthlyIncomeRange) newErrors.MonthlyIncomeRange = 'Income range is required';
    }
    
    if (step === 3) {
      if (!formData.FamilySize) newErrors.FamilySize = 'Family size is required';
      else if (formData.FamilySize < 1) newErrors.FamilySize = 'Family size must be at least 1';
      else if (formData.FamilySize > 20) newErrors.FamilySize = 'Family size cannot exceed 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };
const handleSubmit = async () => {
  if (!validateStep(step)) return;
  
  setLoading(true);
  setErrors({});
  setSuccess('');
  
  try {
    const response = await api.post('/verification/submit', formData);
    
    // FIX: Handle response without success property
    if (response.status === 200 && response.data) {
      const data = response.data;
      
      // Update user context
      updateUser({
        ...user,
        verificationStatus: data.VerificationStatus || 'Pending',
        priorityLevel: data.PriorityLevel || 0
      });
      
      setSuccess('Verification submitted successfully! Admin will review within 24-48 hours.');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      setErrors({ 
        submit: 'Submission failed. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    setErrors({ 
      submit: error.response?.data?.message || 'Submission failed. Please try again.' 
    });
  } finally {
    setLoading(false);
  }
};


  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                CNIC/NICOP Number *
              </label>
              <input
                type="text"
                name="CNIC_NICOP"
                value={formData.CNIC_NICOP}
                onChange={handleChange}
                placeholder="XXXXX-XXXXXXX-X"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.CNIC_NICOP ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.CNIC_NICOP && (
                <p className="text-red-500 text-sm mt-1">{errors.CNIC_NICOP}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Pakistani CNIC format: 13 digits with hyphens
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  CNIC Front *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.IDFrontImage ? (
                    <img src={formData.IDFrontImage} alt="CNIC Front" className="h-32 mx-auto mb-2 rounded" />
                  ) : (
                    <FaFileUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('IDFrontImage', e)}
                    className="hidden"
                    id="frontImage"
                  />
                  <label
                    htmlFor="frontImage"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    {formData.IDFrontImage ? 'Change Image' : 'Upload Front'}
                  </label>
                  {errors.IDFrontImage && (
                    <p className="text-red-500 text-sm mt-1">{errors.IDFrontImage}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  CNIC Back *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.IDBackImage ? (
                    <img src={formData.IDBackImage} alt="CNIC Back" className="h-32 mx-auto mb-2 rounded" />
                  ) : (
                    <FaFileUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('IDBackImage', e)}
                    className="hidden"
                    id="backImage"
                  />
                  <label
                    htmlFor="backImage"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    {formData.IDBackImage ? 'Change Image' : 'Upload Back'}
                  </label>
                  {errors.IDBackImage && (
                    <p className="text-red-500 text-sm mt-1">{errors.IDBackImage}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Selfie with ID *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.SelfieWithID ? (
                    <img src={formData.SelfieWithID} alt="Selfie" className="h-32 mx-auto mb-2 rounded" />
                  ) : (
                    <FaCamera className="text-gray-400 text-3xl mx-auto mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('SelfieWithID', e)}
                    className="hidden"
                    id="selfieImage"
                  />
                  <label
                    htmlFor="selfieImage"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    {formData.SelfieWithID ? 'Change Selfie' : 'Upload Selfie'}
                  </label>
                  {errors.SelfieWithID && (
                    <p className="text-red-500 text-sm mt-1">{errors.SelfieWithID}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Your ID photos will be reviewed by our admin team. 
                We do not share this information with third parties.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Annual Income (PKR) *
              </label>
              <input
                type="number"
                name="AnnualIncome"
                value={formData.AnnualIncome}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.AnnualIncome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="300000"
              />
              {errors.AnnualIncome && (
                <p className="text-red-500 text-sm mt-1">{errors.AnnualIncome}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Monthly Income Range *
              </label>
              <select
                name="MonthlyIncomeRange"
                value={formData.MonthlyIncomeRange}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.MonthlyIncomeRange ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select range</option>
                <option value="<30k">Less than 30,000 PKR</option>
                <option value="30-50k">30,000 - 50,000 PKR</option>
                <option value="50-100k">50,000 - 100,000 PKR</option>
                <option value=">100k">More than 100,000 PKR</option>
              </select>
              {errors.MonthlyIncomeRange && (
                <p className="text-red-500 text-sm mt-1">{errors.MonthlyIncomeRange}</p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>How this helps:</strong> This information helps us prioritize 
                donations to those who need them most.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Family Size *
              </label>
              <input
                type="number"
                name="FamilySize"
                value={formData.FamilySize}
                onChange={handleChange}
                min="1"
                max="20"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.FamilySize ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="4"
              />
              {errors.FamilySize && (
                <p className="text-red-500 text-sm mt-1">{errors.FamilySize}</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Special Circumstances</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="IsSingleMother"
                  checked={formData.IsSingleMother}
                  onChange={handleChange}
                  id="singleMother"
                  className="w-5 h-5 text-green-600 rounded"
                />
                <label htmlFor="singleMother" className="flex items-center space-x-2">
                  <FaFemale className="text-pink-500" />
                  <span>I am a single mother</span>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="IsDisabled"
                  checked={formData.IsDisabled}
                  onChange={handleChange}
                  id="disabled"
                  className="w-5 h-5 text-green-600 rounded"
                />
                <label htmlFor="disabled" className="flex items-center space-x-2">
                  <FaWheelchair className="text-blue-500" />
                  <span>I have a disability</span>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="IsOrphanage"
                  checked={formData.IsOrphanage}
                  onChange={handleChange}
                  id="orphanage"
                  className="w-5 h-5 text-green-600 rounded"
                />
                <label htmlFor="orphanage" className="flex items-center space-x-2">
                  <FaHome className="text-orange-500" />
                  <span>I represent an orphanage</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Why do you need donations? *
              </label>
              <textarea
                name="NeedsDescription"
                value={formData.NeedsDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Please describe your situation and what items you need..."
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FaCheckCircle className="text-green-500 mt-1" />
                <div>
                  <h4 className="font-medium text-green-800">Priority Benefits</h4>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    {formData.IsSingleMother && (
                      <li>✓ Single mothers get highest priority</li>
                    )}
                    {formData.IsDisabled && (
                      <li>✓ Disabled persons get priority access</li>
                    )}
                    {formData.FamilySize > 5 && (
                      <li>✓ Large families get priority</li>
                    )}
                    {formData.MonthlyIncomeRange === '<30k' && (
                      <li>✓ Low-income households get priority</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Terms & Conditions</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span>I declare that all information provided is true and accurate</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span>I agree to provide photo proof after receiving donation items</span>
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" required className="mt-1" />
                  <span>I understand fraudulent claims may lead to account suspension</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-green-600 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((stepItem) => (
              <div key={stepItem.number} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  step >= stepItem.number 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <stepItem.icon size={20} />
                </div>
                <span className={`text-sm mt-2 ${
                  step >= stepItem.number ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Identity Verification
          </h1>
          <p className="text-gray-600 mb-6">
            Required for requesting donations. This helps ensure items reach genuinely needy people.
          </p>

          {/* Error/Success Messages */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.submit}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Current Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="ml-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Verification'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Why Verification?</h3>
          <p className="text-sm text-blue-700">
            This verification system ensures that donations reach genuinely needy people in Pakistan.
            By verifying identities and needs, we prevent fraud and ensure your help goes to those who truly need it.
          </p>
        </div>
      </div>
    </div>
  );
}