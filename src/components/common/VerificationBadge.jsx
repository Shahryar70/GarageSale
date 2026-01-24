import { FaCheckCircle, FaClock, FaTimesCircle, FaStar } from 'react-icons/fa';

export default function VerificationBadge({ status = 'Unverified', priorityLevel = 0 }) {
  const getBadgeConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return {
          icon: FaCheckCircle,
          text: 'Verified',
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-500'
        };
      case 'pending':
        return {
          icon: FaClock,
          text: 'Pending Verification',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          iconColor: 'text-yellow-500'
        };
      case 'rejected':
        return {
          icon: FaTimesCircle,
          text: 'Rejected',
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-500'
        };
      default:
        return {
          icon: FaClock,
          text: 'Not Verified',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.color}`}>
        <config.icon className={`text-sm ${config.iconColor}`} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
      
      {status === 'Verified' && priorityLevel > 0 && (
        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
          <FaStar className="text-xs" />
          <span className="text-xs font-medium">Priority: {priorityLevel}/10</span>
        </div>
      )}
    </div>
  );
}