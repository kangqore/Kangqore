import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Bell, FileText, Calendar } from 'lucide-react';
import axios from 'axios';

const InvestorUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/investor/updates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpdates(res.data.updates);
      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <DashboardLayout role="investor" title="Updates" subtitle="Company announcements and milestones">
       <div className="space-y-6">
        {loading ? (
             <div className="p-8 text-center text-gray-500">Loading updates...</div>
        ) : updates.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No updates yet</h3>
                <p className="text-gray-500">Check back later for company news.</p>
            </div>
        ) : (
            updates.map((update) => (
                <div key={update.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                update.type === 'Financial' ? 'bg-green-100 text-green-700' :
                                update.type === 'Milestone' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300'
                            }`}>
                                {update.type}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(update.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{update.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{update.content}</p>
                </div>
            ))
        )}
       </div>
    </DashboardLayout>
  );
};

export default InvestorUpdates;
