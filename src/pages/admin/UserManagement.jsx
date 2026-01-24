// src/pages/admin/UserManagement.jsx - UPDATED
import { useState, useEffect } from 'react';
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaUserLock,
  FaUserCheck,
  FaUserSlash
} from 'react-icons/fa';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified, pending, rejected

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/Admin/users');
      console.log('📊 Users API response:', response.data);
      
      // API returns { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        setUsers(response.data.data);
      } else {
        console.error('❌ Invalid response structure:', response.data);
      }
    } catch (err) {
      console.error('❌ Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.FullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'Verified') {
      matchesFilter = user.VerificationStatus === 'Verified';
    } else if (filter === 'Pending') {
      matchesFilter = user.VerificationStatus === 'Pending';
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Call API to update user status
      await api.put(`/Admin/users/${userId}/status`, {
        IsActive: newStatus === 'activate' ? true : false
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.UserId === userId 
          ? { ...user, IsActive: newStatus === 'activate' } 
          : user
      ));
      
      alert(`User ${newStatus === 'activate' ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('❌ Error updating user status:', err);
      alert('Failed to update user status');
    }
  };

  const VerificationBadge = ({ status }) => {
    switch(status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <FaCheckCircle size={10} />
            Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <FaEye size={10} />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <FaTimesCircle size={10} />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilter('Verified')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'Verified' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setFilter('Pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Verification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.UserId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{user.FullName}</div>
                          <div className="text-sm text-gray-500">{user.Email}</div>
                          <div className="text-xs text-gray-400">{user.City}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Joined: {new Date(user.CreatedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            user.UserType === 'Donor' 
                              ? 'bg-blue-100 text-blue-800' 
                              : user.UserType === 'Receiver'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.UserType || 'User'}
                          </span>
                        </div>
                        <VerificationBadge status={user.VerificationStatus} />
                        {user.VerificationStatus === 'Verified' && user.PriorityLevel > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Priority: {user.PriorityLevel}/10
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          user.IsActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.IsActive ? (
                            <>
                              <FaUserCheck size={10} />
                              Active
                            </>
                          ) : (
                            <>
                              <FaUserSlash size={10} />
                              Inactive
                            </>
                          )}
                        </span>
                        {user.Rating > 0 && (
                          <div className="text-xs text-gray-600 mt-1">
                            Rating: {user.Rating}/5
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newStatus = user.IsActive ? 'deactivate' : 'activate';
                              handleStatusChange(user.UserId, newStatus);
                            }}
                            className={`px-3 py-1 rounded text-sm ${
                              user.IsActive 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.IsActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}