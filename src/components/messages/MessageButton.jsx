// src/components/MessageButton.jsx - FIXED VERSION
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';
import { FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
export default function MessageButton({ seller, itemId, itemTitle, itemType }) {
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    setSending(true);
    setError('');
    
    try {
      await sendMessage(seller.userId, message, itemId);
      setSuccess(true);
      setMessage('');
      
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // If not logged in
  if (!user) {
    return (
      <button
        onClick={() => window.location.href = `/login?redirect=/items/${itemId}`}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <FaPaperPlane />
        Login to Message Seller
      </button>
    );
  }

  // If user is the seller
  if (user.userId === seller.userId) {
    return (
      <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed">
        This is your item
      </button>
    );
  }

  // Get default message based on item type
  const getDefaultMessage = () => {
    const baseMessage = `Hi! I'm interested in your item "${itemTitle}". `;
    
    switch(itemType?.toLowerCase()) {
      case 'donate':
        return `Hi! I'd like to receive your donated item "${itemTitle}". `;
      case 'swap':
        return `Hi! I'd like to propose a swap for "${itemTitle}". `;
      case 'sell':
        return `Hi! I'm interested in purchasing "${itemTitle}". `;
      default:
        return baseMessage;
    }
  };

  // Get button text based on item type
  const getButtonText = () => {
    switch(itemType?.toLowerCase()) {
      case 'donate':
        return 'Request Item';
      case 'swap':
        return 'Propose Swap';
      case 'sell':
        return 'Message Seller';
      default:
        return 'Message Seller';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <FaPaperPlane />
        {getButtonText()}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 right-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-lg">Message {seller.fullName}</h3>
              <p className="text-sm text-gray-600">About: {itemTitle}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-3 text-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-50 text-green-700 p-3 rounded text-center">
              Message sent successfully!
            </div>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getDefaultMessage()}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3 min-h-[100px] resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={sending}
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}