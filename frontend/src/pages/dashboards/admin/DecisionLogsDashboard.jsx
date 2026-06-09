import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { GitCommit, Tag, User, Search } from 'lucide-react';

const DecisionLogsDashboard = () => {
  const { data: decisionsData, isLoading } = useQuery({
    queryKey: ['admin-decisions'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || ''}/api/admin/decisions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  const decisions = decisionsData?.decisions || [];

  if (isLoading) {
      return (
          <DashboardLayout role="admin" title="Decision Logs">
              <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
              </div>
          </DashboardLayout>
      );
  }

  return (
    <DashboardLayout role="admin" title="Decision Logs" subtitle="Tracking architectural and strategic decisions.">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header / Search */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search decisions..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
           </div>
           <button className="bg-brand-gradient text-white px-4 py-2 rounded-lg font-medium hover:opacity-90">
              + New Decision Record
           </button>
        </div>

        {/* Decision List */}
        <div className="divide-y divide-gray-100">
           {decisions.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <GitCommit className="w-12 h-12 text-gray-300 mb-3" />
                <p>No decision records found.</p>
              </div>
           )}
           {decisions.map((dec) => (
              <div key={dec.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                       <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                          <GitCommit className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{dec.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                             <span className="font-mono text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-[#0a0a0c] rounded text-xs">
                                {dec.id.substring(0,8).toUpperCase()}
                             </span>
                             <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {dec.approver?.name || dec.client?.name || 'Unknown'}
                             </span>
                             <span>•</span>
                             <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4">
                       <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
                          <Tag className="w-3 h-3" /> {dec.category || 'General'}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          dec.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          dec.status === 'PROPOSED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300'
                       }`}>
                          {dec.status}
                       </span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DecisionLogsDashboard;
