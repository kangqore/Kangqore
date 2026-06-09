import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowLeft, RefreshCw, User, Mail } from 'lucide-react';
import axios from 'axios';

const ApprovalsManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/auth/admin/pending-approvals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingUsers(response.data.pending_users || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/api/auth/admin/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingApprovals();
    } catch (error) {
      console.error('Error approving user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/api/auth/admin/users/${userId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingApprovals();
    } catch (error) {
      console.error('Error rejecting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      CLIENT: 'bg-blue-100 text-blue-700',
      PARTNER: 'bg-green-100 text-green-700',
      INVESTOR: 'bg-purple-100 text-purple-700',
      JOB_SEEKER: 'bg-yellow-100 text-yellow-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button + Header */}
        <div className="mb-8">
          <Link
            to="/dashboard/admin"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pending Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and approve new user registrations</p>
        </div>

        {/* Stats */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-900">{pendingUsers.length}</p>
              <p className="text-yellow-700">Pending Approvals</p>
            </div>
          </div>
        </div>

        {/* Pending Users */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending approvals</p>
              <p className="text-sm text-gray-400 mt-2">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 
                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer transition-colors"
                            onClick={() => navigate(`/dashboard/admin/users/${user.id}/edit`)}
                          >
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Role</p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        {user.company && (
                          <div>
                            <p className="text-xs text-gray-500">Company</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user.company}</p>
                          </div>
                        )}
                        {user.phone && (
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user.phone}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500">Requested</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
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
    </div>
  );
};

export default ApprovalsManagement;
