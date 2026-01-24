// src/pages/admin/AdminDashboard.jsx - COMPLETE ADMIN DASHBOARD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaClock,
  FaGift,
  FaCheckCircle,
  FaChartLine,
  FaCity,
  FaUserCheck,
  FaUserTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log('📊 Fetching admin dashboard stats...');
      const response = await api.get('/Admin/dashboard');
      console.log('📊 Full API response:', response);
      console.log('📊 Response data:', response.data);
      console.log('📊 Response data.data:', response.data.data);
      
      // The data is in response.data.data
      if (response.data.success && response.data.data) {
        setStats(response.data.data);
      } else {
        console.error('❌ Invalid response structure:', response.data);
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response,
        request: err.request
      });
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon className={`text-3xl ${color.replace('border-', 'text-')}`} />
      </div>
      {link && (
        <Link to={link} className="text-sm text-blue-600 hover:text-blue-800 mt-4 block">
          View details →
        </Link>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and statistics</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.TotalUsers || 0}
          icon={FaUsers}
          color="border-blue-500"
          link="/admin/users"
        />
        <StatCard
          title="Pending Verifications"
          value={stats?.PendingVerifications || 0}
          icon={FaClock}
          color="border-yellow-500"
          link="/admin/verifications"
        />
        <StatCard
          title="Total Donations"
          value={stats?.TotalDonations || 0}
          icon={FaGift}
          color="border-green-500"
          link="/admin/donations"
        />
        <StatCard
          title="Completed Donations"
          value={stats?.CompletedDonations || 0}
          icon={FaCheckCircle}
          color="border-purple-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/admin/verifications"
                className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-4 flex items-center gap-4 transition-colors"
              >
                <FaClock className="text-2xl text-yellow-600" />
                <div>
                  <h3 className="font-medium text-yellow-800">Review Verifications</h3>
                  <p className="text-sm text-yellow-700">
                    {stats?.PendingVerifications || 0} pending
                  </p>
                </div>
              </Link>
              
              <Link
                to="/admin/users"
                className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center gap-4 transition-colors"
              >
                <FaUsers className="text-2xl text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-800">Manage Users</h3>
                  <p className="text-sm text-blue-700">
                    {stats?.TotalUsers || 0} total users
                  </p>
                </div>
              </Link>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
                <FaChartLine className="text-2xl text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Donation Reports</h3>
                  <p className="text-sm text-green-700">
                    {stats?.CompletedDonations || 0} completed
                  </p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-4">
                <FaExclamationTriangle className="text-2xl text-red-600" />
                <div>
                  <h3 className="font-medium text-red-800">Flagged Items</h3>
                  <p className="text-sm text-red-700">3 items need review</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaUserCheck className="text-green-500" />
                  <div>
                    <p className="font-medium">User verified</p>
                    <p className="text-sm text-gray-500">Ayesha Khan - Just now</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">Approved</span>
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaGift className="text-blue-500" />
                  <div>
                    <p className="font-medium">Donation completed</p>
                    <p className="text-sm text-gray-500">Winter Jacket donated - 2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm text-blue-600">Completed</span>
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaUserTimes className="text-red-500" />
                  <div>
                    <p className="font-medium">User rejected</p>
                    <p className="text-sm text-gray-500">Invalid CNIC documents - 4 hours ago</p>
                  </div>
                </div>
                <span className="text-sm text-red-600">Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Users by City */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Users by City</h2>
            <div className="space-y-3">
              {stats?.UsersByCity && Object.entries(stats.UsersByCity).map(([city, count]) => (
                <div key={city} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <FaCity className="text-gray-400" />
                    <span>{city}</span>
                  </div>
                  <span className="font-medium">{count} users</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Platform Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Donation Success Rate</span>
                  <span className="text-sm font-medium">
                    {stats?.TotalDonations ? 
                      Math.round((stats.CompletedDonations / stats.TotalDonations) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats?.TotalDonations ? 
                        Math.round((stats.CompletedDonations / stats.TotalDonations) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Active Users Today</span>
                  <span className="text-sm font-medium">{stats?.ActiveUsersToday || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(((stats?.ActiveUsersToday || 0) / (stats?.TotalUsers || 1)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Donors</span>
                  <span className="font-medium">{stats?.TotalDonors || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Receivers</span>
                  <span className="font-medium">{stats?.TotalReceivers || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Pending Donations</span>
                  <span className="font-medium">{stats?.PendingDonations || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}