import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Star, AlertTriangle, Trash2, Calendar, BookmarkCheck, User } from 'lucide-react';
import axios from 'axios';

const ITEM_TYPE_CONFIG = {
  important: { title: 'Important', icon: Star, color: 'yellow', enum: 'IMPORTANT' },
  starred: { title: 'Starred', icon: BookmarkCheck, color: 'blue', enum: 'STARRED' },
  scheduled: { title: 'Scheduled', icon: Calendar, color: 'purple', enum: 'SCHEDULED' },
  lead: { title: 'Leads', icon: User, color: 'green', enum: 'LEAD' }, // Added Lead
  spam: { title: 'Spam', icon: AlertTriangle, color: 'orange', enum: 'SPAM' },
  trash: { title: 'Trash', icon: Trash2, color: 'red', enum: 'TRASH' }
};

import DashboardLayout from '../../components/DashboardLayout';

const AdminItemsPage = ({ type }) => {
  const [items, setItems] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const config = ITEM_TYPE_CONFIG[type] || ITEM_TYPE_CONFIG.important;
  const IconComponent = config.icon;
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/items?type=${config.enum}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedItems = response.data.items || [];
      setItems(fetchedItems);
      
      // Fetch user details for user-type items
      const userIds = fetchedItems
        .filter(item => item.entityType === 'user')
        .map(item => item.entityId);
      
      if (userIds.length > 0) {
        const usersResponse = await axios.get(`${BACKEND_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersMap = {};
        (usersResponse.data.users || []).forEach(user => {
          usersMap[user.id] = user;
        });
        setUserDetails(usersMap);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Remove this item from the list?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/admin/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // For trash items, permanently delete
  const handlePermanentDelete = async (item) => {
    if (!window.confirm('PERMANENTLY delete this user? This cannot be undone!')) return;
    try {
      const token = localStorage.getItem('token');
      // Delete user permanently
      await axios.delete(`${BACKEND_URL}/api/admin/users/${item.entityId}?hard=true`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from admin items
      await axios.delete(`${BACKEND_URL}/api/admin/items/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
      alert('User permanently deleted');
    } catch (error) {
      console.error('Error permanently deleting:', error);
      alert('Failed to delete user');
    }
  };

  // Restore from trash
  const handleRestore = async (item) => {
    try {
      const token = localStorage.getItem('token');
      // Activate user
      await axios.put(`${BACKEND_URL}/api/admin/users/${item.entityId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from trash
      await axios.delete(`${BACKEND_URL}/api/admin/items/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
      alert('User restored');
    } catch (error) {
      console.error('Error restoring:', error);
      alert('Failed to restore user');
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      yellow: 'bg-yellow-100 text-yellow-600',
      blue: 'bg-blue-100 text-brand-blue',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <DashboardLayout 
      role="admin" 
      title={config.title}
      subtitle={type === 'trash' ? 'Deleted users' : `Users marked as ${config.title.toLowerCase()}`}
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
            <Link
                to="/dashboard/admin"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </Link>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <IconComponent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No {config.title.toLowerCase()} users</p>
              <p className="text-sm text-gray-400 mt-2">
                {type === 'trash' 
                  ? 'Users you delete will appear here'
                  : `Users you mark as ${config.title.toLowerCase()} will appear here`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const user = userDetails[item.entityId];
                return (
                  <div key={item.id} className="p-4 hover:bg-gray-50 dark:bg-[#050505] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center">
                        {user?.name ? (
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p 
                          className="font-medium text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer transition-colors"
                          onClick={() => navigate(`/dashboard/admin/users/${item.entityId}/edit`)}
                        >
                          {user?.name || `User ${item.entityId.substring(0, 8)}...`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.email || 'Unknown email'}
                        </p>
                        {user?.customId && (
                          <span className="text-xs font-mono text-brand-blue bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded mt-1 inline-block">
                            {user.customId}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Added {new Date(item.createdAt).toLocaleDateString()} by {item.admin?.name || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {type === 'trash' ? (
                        <>
                          <button
                            onClick={() => handleRestore(item)}
                            className="px-3 py-1.5 text-green-600 hover:bg-green-50 dark:bg-green-900/20 rounded-lg text-sm font-medium transition-colors"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item)}
                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 dark:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete Forever
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Export individual page components
export const ImportantPage = () => <AdminItemsPage type="important" />;
export const StarredPage = () => <AdminItemsPage type="starred" />;
export const ScheduledPage = () => <AdminItemsPage type="scheduled" />;
export const LeadsPage = () => <AdminItemsPage type="lead" />; // Added LeadsPage
export const SpamPage = () => <AdminItemsPage type="spam" />;
export const TrashPage = () => <AdminItemsPage type="trash" />;

export default AdminItemsPage;
