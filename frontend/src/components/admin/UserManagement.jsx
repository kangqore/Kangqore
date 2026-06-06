import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Clock, CheckCircle, XCircle, 
  Building2, Handshake, TrendingUp, Briefcase, RefreshCw,
  Search, Filter, MoreVertical, Eye, Lock, Mail, Phone, Calendar,
  Star, AlertTriangle, Ban, Trash2, UserCog, Flag, Tag, Edit3
} from 'lucide-react';

/**
 * User Management Component for Admin Dashboard
 * Displays comprehensive user database with Prisma Studio-like visibility
 */
const UserManagement = ({
  stats,
  allUsers = [],
  loading,
  actionLoading,
  onApprove,
  onReject,
  onRefresh
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ search: '', role: 'all', status: 'all' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userItems, setUserItems] = useState({}); // Track marked items per user
  const [actionInProgress, setActionInProgress] = useState(null);
  
  // Local state for fetched data if not passed from parent
  const [localUsers, setLocalUsers] = useState([]);
  const [localStats, setLocalStats] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  
  const API_URL = process.env.REACT_APP_BACKEND_URL || '';
  const getToken = () => localStorage.getItem('token');

  // Action handlers
  const handleSuspend = async (userId) => {
    setActionInProgress(userId);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        onRefresh?.();
        setSelectedUser(null);
      }
    } catch (err) { console.error(err); }
    setActionInProgress(null);
  };

  const handleActivate = async (userId) => {
    setActionInProgress(userId);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/activate`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        onRefresh?.();
        setSelectedUser(null);
      }
    } catch (err) { console.error(err); }
    setActionInProgress(null);
  };

  const handleDelete = async (userId, hard = false) => {
    if (!window.confirm(hard ? 'Permanently delete this user? This cannot be undone.' : 'Mark this user as inactive?')) return;
    setActionInProgress(userId);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}?hard=${hard}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        onRefresh?.();
        setSelectedUser(null);
      }
    } catch (err) { console.error(err); }
    setActionInProgress(null);
  };

  const handleToggleFlag = async (userId) => {
    setActionInProgress(userId);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/flag`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) onRefresh?.();
    } catch (err) { console.error(err); }
    setActionInProgress(null);
  };

  const handleMarkItem = async (userId, type) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/items`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, entityType: 'user', entityId: userId })
      });
      if (res.ok) {
        setUserItems(prev => ({ ...prev, [`${userId}_${type}`]: true }));
      }
    } catch (err) { console.error(err); }
  };

  const handleEditProfile = (userId) => {
    navigate(`/dashboard/admin/users/${userId}/edit`);
  };

  // Fetch data if not provided via props
  React.useEffect(() => {
    if (allUsers.length === 0) {
      fetchUsers();
      fetchStats();
    } else {
       setLocalUsers(allUsers);
    }
    if (!stats) {
       fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, onRefresh, allUsers, stats]);

  const fetchUsers = async () => {
    setLocalLoading(true);
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || '';
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '50', // Fetch more for administration
        ...filter
      });

      const res = await fetch(`${API_URL}/api/admin/users?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        setLocalUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || '';
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setLocalStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  // Use local data if props are missing
  const effectiveUsers = allUsers.length > 0 ? allUsers : localUsers;
  const effectiveStats = stats || localStats;
  const effectiveLoading = loading || localLoading;

  const getRoleIcon = (role) => {
    const icons = { 
      client: Building2, 
      partner: Handshake, 
      investor: TrendingUp, 
      job_seeker: Briefcase, 
      admin: Shield 
    };
    return icons[role?.toLowerCase()] || Users;
  };

  // Filter users
  const filteredUsers = allUsers.filter(user => {
    const searchMatch = !filter.search || 
      user.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filter.search.toLowerCase()) ||
      user.company?.toLowerCase().includes(filter.search.toLowerCase());
    
    const roleMatch = filter.role === 'all' || user.role === filter.role;
    const statusMatch = filter.status === 'all' || user.status === filter.status;
    
    return searchMatch && roleMatch && statusMatch;
  });

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 shadow-sm" data-testid="total-users-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-sm text-gray-500">Total Users</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{effectiveStats?.total_users || 0}</h3>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 shadow-sm" data-testid="clients-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-blue" />
            </div>
            <span className="text-sm text-gray-500">Clients</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{effectiveStats?.by_role?.clients || 0}</h3>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 shadow-sm" data-testid="partners-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Handshake className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Partners</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{effectiveStats?.by_role?.partners || 0}</h3>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 shadow-sm" data-testid="investors-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-500">Investors</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{effectiveStats?.by_role?.investors || 0}</h3>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 shadow-sm" data-testid="job-seekers-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Job Seekers</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{effectiveStats?.by_role?.job_seekers || 0}</h3>
        </div>
      </div>

      {/* Main Data Table Area */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter.role}
                onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-900 dark:border-gray-800"
              >
                <option value="all">All Roles</option>
                <option value="CLIENT">Clients</option>
                <option value="PARTNER">Partners</option>
                <option value="INVESTOR">Investors</option>
                <option value="JOB_SEEKER">Job Seekers</option>
                <option value="ADMIN">Admins</option>
              </select>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-900 dark:border-gray-800"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={onRefresh} 
            className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg text-gray-500"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#050505]">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">User</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Role</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Company</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Joined</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center overflow-hidden">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div 
                              className="font-medium text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer transition-colors"
                              onClick={() => navigate(`/dashboard/admin/users/${user.id}/edit`)}
                            >
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                          <RoleIcon className="w-3.5 h-3.5" />
                          {user.role?.toLowerCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                        {user.company || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700' 
                            : user.status === 'SUSPENDED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.status === 'ACTIVE' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'SUSPENDED' && <XCircle className="w-3 h-3" />}
                          {user.status === 'INACTIVE' && <Clock className="w-3 h-3" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleMarkItem(user.id, 'STARRED')}
                            className={`p-1.5 rounded-lg transition-colors ${userItems[`${user.id}_STARRED`] ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}
                            title="Star"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleFlag(user.id)}
                            className={`p-1.5 rounded-lg transition-colors ${user.isRedFlagged ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:bg-red-900/20'}`}
                            title="Flag"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditProfile(user.id)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {user.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Suspend"
                              disabled={actionInProgress === user.id}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors"
                              title="Activate"
                              disabled={actionInProgress === user.id}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                            disabled={actionInProgress === user.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer (Placeholder for now as frontend handles filtering) */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
          <span>
            Showing {filteredUsers.length} of {allUsers.length} users
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white dark:bg-gray-900 dark:border-gray-800 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-white dark:bg-gray-900 dark:border-gray-800 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* User Details Modal - Prisma Studio Style Raw Data */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-sm flex items-center justify-center">
                  <span className="text-xl font-bold text-brand-blue">
                    {selectedUser.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button 
                  onClick={() => handleEditProfile(selectedUser.id)}
                  className="py-2 px-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
                <button 
                  onClick={() => handleMarkItem(selectedUser.id, 'STARRED')}
                  className="py-2 px-3 bg-amber-50 text-amber-700 rounded-lg font-medium text-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4" /> Star
                </button>
                <button 
                  onClick={() => handleMarkItem(selectedUser.id, 'IMPORTANT')}
                  className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-4 h-4" /> Important
                </button>
                <button 
                  onClick={() => handleMarkItem(selectedUser.id, 'LEAD')}
                  className="py-2 px-3 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-4 h-4" /> Lead
                </button>
                <button 
                  onClick={() => handleMarkItem(selectedUser.id, 'SPAM')}
                  className="py-2 px-3 bg-gray-50 dark:bg-[#050505] text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-100 dark:bg-[#0a0a0c] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-4 h-4" /> Spam
                </button>
                {selectedUser.status === 'ACTIVE' ? (
                  <button 
                    onClick={() => handleSuspend(selectedUser.id)}
                    className="py-2 px-3 bg-orange-50 text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5"
                    disabled={actionInProgress === selectedUser.id}
                  >
                    <Ban className="w-4 h-4" /> Suspend
                  </button>
                ) : (
                  <button 
                    onClick={() => handleActivate(selectedUser.id)}
                    className="py-2 px-3 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg font-medium text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-1.5"
                    disabled={actionInProgress === selectedUser.id}
                  >
                    <CheckCircle className="w-4 h-4" /> Activate
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(selectedUser.id)}
                  className="py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-700 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                  disabled={actionInProgress === selectedUser.id}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button 
                  onClick={() => handleDelete(selectedUser.id, true)}
                  className="py-2 px-3 bg-red-100 text-red-800 rounded-lg font-medium text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-1.5"
                  disabled={actionInProgress === selectedUser.id}
                >
                  <Trash2 className="w-4 h-4" /> Hard Delete
                </button>
              </div>

              {/* Data Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Profile Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.role}</span>
                        <span className="text-xs text-gray-500">{selectedUser.company || 'No Company'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">System Metadata</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Created At</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{new Date(selectedUser.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Last Login</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data View (Prisma Studio style) */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Raw Database Record</h4>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    {JSON.stringify(selectedUser, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-center">
              <span className="text-xs text-gray-400">User ID: {selectedUser.id}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
