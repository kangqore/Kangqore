import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, RefreshCw, XCircle, FolderKanban, FileText, LogIn, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const UsersManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialStatus = searchParams.get('status') || 'all';
  
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');

  // ... (rest of state)

  // Update filter when URL param changes
  useEffect(() => {
      const status = searchParams.get('status');
      if (status && status !== filter) {
          setFilter(status);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when filter changes
  const handleFilterChange = (newStatus) => {
      setFilter(newStatus);
      if (newStatus === 'all') {
          setSearchParams({});
      } else {
          setSearchParams({ status: newStatus });
      }
  };

  // ... (rest of functions)

  // In JSX, update filter buttons to use handleFilterChange
  // <button onClick={() => handleFilterChange(status)} ...

  // In Admin Actions (Drawer):
  // ...
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleMarkUserAs(selectedUser.id, 'LEAD')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        🎯 Mark Lead
                      </button>
                      <button
                        onClick={() => handleMarkUserAs(selectedUser.id, 'IMPORTANT')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
                      >
                        ⭐ Important
                      </button>
                      <button
                        onClick={() => handleMarkUserAs(selectedUser.id, 'STARRED')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        🔖 Starred
                      </button>
                      <button
                        onClick={() => handleMarkUserAs(selectedUser.id, 'SCHEDULED')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                      >
                        📅 Scheduled
                      </button>
                      <button
                        onClick={() => handleMarkUserAs(selectedUser.id, 'SPAM')}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
                      >
                        ⚠️ Spam
                      </button>
                    </div>
  // ...
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // profile, projects, documents
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Inspector Data State
  const [userProjects, setUserProjects] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchUsers();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url;
      // Handle "Item" types (Important, Starred, etc)
      const itemTypes = ['important', 'starred', 'scheduled', 'lead', 'spam', 'trash'];
      
      if (itemTypes.includes(filter)) {
        // Map filter to backend enum
        const typeMap = {
          important: 'IMPORTANT',
          starred: 'STARRED',
          scheduled: 'SCHEDULED',
          lead: 'LEAD',
          spam: 'SPAM',
          trash: 'TRASH'
        };
        url = `${BACKEND_URL}/api/admin/items?type=${typeMap[filter]}`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Transform items to include user details
        const items = response.data.items || [];
        const userIds = items.map(item => item.entityId);
        
        if (userIds.length > 0) {
           // Fetch full user objects for these IDs
           // Note: In a real app efficiently, we might want a bulk fetch endpoint.
           // Here we'll fetch all and filter client-side or use existing if cached, 
           // but for correctness let's fetch 'all' and filter.
           // Optimization: ideally create /api/admin/users?ids=...
           
           const usersRes = await axios.get(`${BACKEND_URL}/api/admin/users`, {
             headers: { Authorization: `Bearer ${token}` }
           });
           const allFetchedUsers = usersRes.data.users || [];
           
           // Map items to users, adding metadata
           const mappedUsers = items.map(item => {
             const user = allFetchedUsers.find(u => u.id === item.entityId);
             if (!user) return null;
             return { ...user, adminItem: item }; // Attach item data (id, etc)
           }).filter(Boolean);
           
           setUsers(mappedUsers);
        } else {
          setUsers([]);
        }

      } else {
        // Standard User Status Filters
        url = filter === 'all'
          ? `${BACKEND_URL}/api/admin/users`
          : `${BACKEND_URL}/api/admin/users?status=${filter.toUpperCase()}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || []);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setDetailLoading(true);
      setIsDetailOpen(true);
      setActiveTab('profile'); // Reset tab
      const token = localStorage.getItem('token');
      
      // 1. Fetch User Profile
      const response = await axios.get(`${BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(response.data.user);

      // 2. Mock Fetch Projects/Docs (Replace with real API calls when available)
      // In a real app: await axios.get(`${BACKEND_URL}/api/admin/users/${userId}/projects`)
      setUserProjects([
        { id: 1, title: 'Cloud Migration Phase 1', status: 'In Progress', progress: 65, lastUpdate: '2h ago' },
        { id: 2, title: 'Security Audit', status: 'Completed', progress: 100, lastUpdate: '1d ago' },
        { id: 3, title: 'AI Integration Strategy', status: 'Planning', progress: 15, lastUpdate: '3d ago' }
      ]);
      
      setUserDocuments([
         { id: 1, title: 'MSA_Agreement.pdf', type: 'Contract', size: '2.4 MB', date: 'Jan 10, 2026' },
         { id: 2, title: 'Q4_Report.pdf', type: 'Report', size: '1.1 MB', date: 'Jan 05, 2026' },
      ]);

    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback
      const fallbackUser = users.find(u => u.id === userId);
      if (fallbackUser) setSelectedUser({ ...fallbackUser, _count: {} });
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedUser(null);
  };

  // === ADMIN ACTION HANDLERS ===
  // === ADMIN ACTION HANDLERS ===
  const handleMarkUserAs = async (userId, type) => {
    try {
      const token = localStorage.getItem('token');
      const existingItem = selectedUser.adminItems?.find(item => item.type === type);

      if (existingItem) {
        // Toggle OFF (Delete)
        await axios.delete(`${BACKEND_URL}/api/admin/items/${existingItem.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update local state
        setSelectedUser(prev => ({
          ...prev,
          adminItems: prev.adminItems.filter(item => item.id !== existingItem.id)
        }));
      } else {
        // Toggle ON (Create)
        const response = await axios.post(`${BACKEND_URL}/api/admin/items`, {
          type,
          entityType: 'user',
          entityId: userId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update local state
        setSelectedUser(prev => ({
          ...prev,
          adminItems: [...(prev.adminItems || []), response.data.item]
        }));
      }
    } catch (error) {
      console.error('Error toggling user marker:', error);
    }
  };

  const isMarked = (type) => selectedUser?.adminItems?.some(item => item.type === type);

  // ... (handleSuspend, handleActivate, handleDelete remain same) ...
  const handleSuspend = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/api/admin/users/${userId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      // Update local state instead of closing
      setSelectedUser(prev => ({ ...prev, status: 'SUSPENDED' }));
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleActivate = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BACKEND_URL}/api/admin/users/${userId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      // Update local state instead of closing
      setSelectedUser(prev => ({ ...prev, status: 'ACTIVE' }));
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };


  const handleDelete = async (userId, hard = false) => {
    const confirmMsg = hard ? 'Permanently delete this user?' : 'Mark this user as inactive?';
    if (!window.confirm(confirmMsg)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/admin/users/${userId}?hard=${hard}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      
      if (hard) {
        closeDetail();
      } else {
        // Soft delete updates status to INACTIVE
        setSelectedUser(prev => ({ ...prev, status: 'INACTIVE' }));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditProfile = (userId) => {
    navigate(`/dashboard/admin/users/${userId}/edit`);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      // Optimistic update
      setSelectedUser(prev => ({ ...prev, role: newRole }));
      
      await axios.patch(`${BACKEND_URL}/api/admin/users/${userId}/profile`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchUsers(); // Refresh list to reflect changes
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
      // Revert on error
      fetchUserDetails(userId);
    }
  };

  // Track which user is being impersonated to show loading state
  const [impersonatingId, setImpersonatingId] = useState(null);

  const handleImpersonate = async (userId) => {
    // Remove window.confirm to avoid "glitch" perception
    // The button action is explicit enough for admins
    
    try {
      setImpersonatingId(userId);
      const token = localStorage.getItem('token');
      const currentUserStr = localStorage.getItem('user');
      
      const res = await axios.post(`${BACKEND_URL}/api/admin/users/${userId}/impersonate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { token: newToken, user } = res.data;
      
      // Save Admin credentials for "Exit Impersonation"
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', currentUserStr);

      // Store new token and user data needed by AuthContext
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Determine redirect path based on role
      let path = '/dashboard/client'; // Default fallback
      if (user.role === 'INVESTOR') path = '/dashboard/investor';
      else if (user.role === 'PARTNER') path = '/dashboard/partner';
      else if (user.role === 'JOB_SEEKER') path = '/dashboard/careers';
      else if (user.role === 'ADMIN') path = '/dashboard/admin';
      
      // Force reload to apply new auth state
      window.location.href = path;
      
    } catch (error) {
      console.error('Error impersonating user:', error);
      setImpersonatingId(null);
      // Show explicit error from backend if available
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to impersonate user';
      alert(`Impersonation Failed: ${errMsg}`);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-700',
      CLIENT: 'bg-blue-100 text-blue-700',
      PARTNER: 'bg-green-100 text-green-700',
      INVESTOR: 'bg-purple-100 text-purple-700',
      JOB_SEEKER: 'bg-yellow-100 text-yellow-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      REJECTED: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout 
      role="admin" 
      title="User Management" 
      subtitle="Manage user accounts, roles, and permissions"
    >
      <div className="space-y-6">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_users || 0}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-green-700 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-900">{stats.active_users || 0}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-yellow-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending_users || 0}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-blue-700 mb-1">By Role</p>
              <p className="text-sm text-blue-900">
                {stats.users_by_role ? Object.keys(stats.users_by_role).length : 0} roles
              </p>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm p-4 flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {[
                { id: 'all', label: 'All Users' },
                { id: 'active', label: 'Active' },
                { id: 'pending', label: 'Pending' },
                { id: 'suspended', label: 'Suspended' },
                { id: 'lead', label: 'Leads', icon: '🎯' },
                { id: 'important', label: 'Important', icon: '⭐' },
                { id: 'starred', label: 'Starred', icon: '🔖' },
                { id: 'scheduled', label: 'Scheduled', icon: '📅' },
                { id: 'spam', label: 'Spam', icon: '⚠️' },
                { id: 'trash', label: 'Trash', icon: '🗑️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-brand-gradient text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {tab.icon && <span>{tab.icon}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm p-4 w-full lg:w-80">
            <div className="relative">
              <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : users.filter(u => 
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.company?.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-2xl border-2 border-dashed border-gray-100">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 inline-block p-6 rounded-3xl shadow-sm mb-4">
                <Users className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">No matching users</p>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto px-4">
                {searchTerm 
                  ? `We couldn't find any users matching "${searchTerm}". Try a different name, email, or company.`
                  : "There are no users to display at the moment."}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 px-6 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-brand-blue font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Governance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200">
                  {users
                    .filter(u => 
                      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.company?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           {/* Avatar/Initial */}
                           <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0a0a0c] flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                              {user.name?.charAt(0) || '?'}
                           </div>
                           <div>
                              <p 
                                className="font-medium text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer transition-colors"
                                onClick={() => fetchUserDetails(user.id)} // Open Inspector
                              >
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CLIENT' ? (
                          user.clientProfile?.rulesAcknowledgedAt ? (
                            // Check if rules were updated after acknowledgement
                            user.clientProfile.rulesLastUpdated && 
                            new Date(user.clientProfile.rulesLastUpdated) > new Date(user.clientProfile.rulesAcknowledgedAt) ? (
                              <span className="text-amber-600 flex items-center gap-1.5 text-xs font-medium">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Re-ack Required
                              </span>
                            ) : (
                              <span className="text-green-600 flex items-center gap-1.5 text-xs font-medium">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Acknowledged
                              </span>
                            )
                          ) : (
                            user.clientProfile?.governanceRules ? (
                              <span className="text-amber-600 flex items-center gap-1.5 text-xs font-medium">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Pending
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">No rules set</span>
                            )
                          )
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {user.company || <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {filter === 'trash' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleActivate(user.id)} // Reuse activate for restore
                              className="text-green-600 hover:text-green-800 text-sm font-semibold"
                            >
                              Restore
                            </button>
                            <span className="text-gray-300">|</span>
                             <button 
                              onClick={() => handleDelete(user.id, true)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                              Delete Forever
                            </button>
                          </div>
                        ) : ['important', 'starred', 'scheduled', 'lead', 'spam'].includes(filter) ? (
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => fetchUserDetails(user.id)}
                               className="text-brand-blue hover:text-blue-800 text-sm font-semibold"
                             >
                               Inspect
                             </button>
                             <span className="text-gray-300">|</span>
                             <button 
                              onClick={() => handleMarkUserAs(user.id, filter.toUpperCase())}
                              className="text-gray-500 hover:text-red-600 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => fetchUserDetails(user.id)}
                            className="text-brand-blue hover:text-blue-800 text-sm font-semibold"
                          >
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* INSPECTOR DRAWER */}
      {isDetailOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity" 
            onClick={closeDetail}
          />
          <div className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto flex flex-col">
            {detailLoading || !selectedUser ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-8 h-8 text-brand-blue animate-spin" />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex-none bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-100 flex items-center justify-between p-6 z-10">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
                      <p className="text-sm text-gray-500">User Inspector Mode</p>
                   </div>
                  <button onClick={closeDetail} className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full">
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex-none px-6 border-b border-gray-100 flex gap-6">
                   <button 
                      onClick={() => setActiveTab('profile')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                   >
                      Profile
                   </button>
                   <button 
                      onClick={() => setActiveTab('projects')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'projects' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                   >
                      Projects ({userProjects.length})
                   </button>
                   <button 
                      onClick={() => setActiveTab('documents')}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                   >
                      Documents ({userDocuments.length})
                   </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#050505]/50">
                   
                   {/* PROFILE TAB */}
                   {activeTab === 'profile' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {/* User Avatar & Role */}
                         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-bold text-brand-blue">
                               {selectedUser.name?.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                            <p className="text-gray-500 text-sm mb-3">{selectedUser.email}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)} mb-4 inline-block`}>
                               {selectedUser.role}
                            </span>
                            
                            <div className="mt-2 text-left">
                               <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Change Role To:</label>
                               <select 
                                 value={selectedUser.role} 
                                 onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                                 className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow"
                               >
                                 <option value="CLIENT">Client</option>
                                 <option value="PARTNER">Partner</option>
                                 <option value="INVESTOR">Investor</option>
                                 <option value="JOB_SEEKER">Job Seeker</option>
                                 <option value="ADMIN">Admin</option>
                               </select>
                            </div>
                         </div>

                         {/* Contact Info */}
                         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h4>
                            <div className="space-y-3 text-sm">
                               <div className="flex justify-between border-b border-gray-50 pb-2">
                                  <span className="text-gray-500">Company</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{selectedUser.company || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between border-b border-gray-50 pb-2">
                                  <span className="text-gray-500">Phone</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{selectedUser.phone || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-gray-500">LinkedIn</span>
                                  <a href={selectedUser.linkedin} target="_blank" rel="noreferrer" className="text-brand-blue hover:underline max-w-[200px] truncate">{selectedUser.linkedin || 'N/A'}</a>
                               </div>
                            </div>
                         </div>

                         {/* Admin Actions */}
                         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Actions</h4>
                            
                            {/* Impersonation Button */}
                            <button
                              onClick={() => handleImpersonate(selectedUser.id)}
                              disabled={impersonatingId === selectedUser.id}
                              className={`w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-black hover:to-gray-900 transition-all shadow-lg text-sm font-bold ${impersonatingId === selectedUser.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {impersonatingId === selectedUser.id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Switching...
                                </>
                              ) : (
                                <>
                                  <LogIn className="w-4 h-4" />
                                  Login as {selectedUser.name}
                                </>
                              )}
                            </button>
                            
                            {/* Marking Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleMarkUserAs(selectedUser.id, 'LEAD')}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  isMarked('LEAD') 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                              >
                                {isMarked('LEAD') ? '🎯 Lead Marked' : '🎯 Mark Lead'}
                              </button>
                              <button
                                onClick={() => handleMarkUserAs(selectedUser.id, 'IMPORTANT')}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  isMarked('IMPORTANT') 
                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                              >
                                {isMarked('IMPORTANT') ? '⭐ Important!' : '⭐ Important'}
                              </button>
                              <button
                                onClick={() => handleMarkUserAs(selectedUser.id, 'STARRED')}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  isMarked('STARRED') 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                              >
                                {isMarked('STARRED') ? '🔖 Starred' : '🔖 Star'}
                              </button>
                              <button
                                onClick={() => handleMarkUserAs(selectedUser.id, 'SPAM')}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  isMarked('SPAM') 
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                                }`}
                              >
                                {isMarked('SPAM') ? '⚠️ Spam!' : '⚠️ Mark Spam'}
                              </button>
                            </div>

                            {/* Status & Edit Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleEditProfile(selectedUser.id)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                              >
                                ✏️ Edit Profile
                              </button>
                              {selectedUser.status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleSuspend(selectedUser.id)}
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                >
                                  ⏸️ Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(selectedUser.id)}
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                >
                                  ✅ Activate
                                </button>
                              )}
                            </div>

                            {/* Delete Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                              <button
                                onClick={() => handleDelete(selectedUser.id, false)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                              >
                                🗑️ Soft Delete
                              </button>
                              <button
                                onClick={() => handleDelete(selectedUser.id, true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                💀 Hard Delete
                              </button>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* PROJECTS TAB (Read Only) */}
                   {activeTab === 'projects' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {userProjects.length > 0 ? (
                            userProjects.map((project) => (
                               <div key={project.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                           <FolderKanban className="w-5 h-5 text-brand-blue" />
                                        </div>
                                        <div>
                                           <h4 className="font-bold text-gray-900 dark:text-white text-sm">{project.title}</h4>
                                           <p className="text-xs text-gray-500">Updated {project.lastUpdate}</p>
                                        </div>
                                     </div>
                                     <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                                     }`}>
                                        {project.status}
                                     </span>
                                  </div>
                                  <div className="mt-3">
                                     <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                     </div>
                                     <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-brand-blue h-full rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                                     </div>
                                  </div>
                               </div>
                            ))
                         ) : (
                            <div className="text-center py-10 text-gray-500">No projects found.</div>
                         )}
                      </div>
                   )}

                   {/* DOCUMENTS TAB (Read Only) */}
                   {activeTab === 'documents' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {userDocuments.length > 0 ? (
                            userDocuments.map((doc) => (
                               <div key={doc.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <FileText className="w-5 h-5 text-red-500" />
                                     </div>
                                     <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{doc.title}</h4>
                                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                                     </div>
                                  </div>
                                  <span className="text-xs text-gray-400">{doc.date}</span>
                               </div>
                            ))
                         ) : (
                            <div className="text-center py-10 text-gray-500">No documents found.</div>
                         )}
                      </div>
                   )}

                </div>
              </>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default UsersManagement;
