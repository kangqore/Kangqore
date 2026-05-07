import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader, AlertOctagon, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const ObligationsWidget = () => {
  const { data: obligations, isLoading, error } = useQuery({
    queryKey: ['admin-overdue-obligations'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/admin/accountability/obligations/overdue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.obligations;
    }
  });

  if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader className="animate-spin text-brand-blue" /></div>;
  if (error) return <div className="h-48 flex items-center justify-center text-red-500">Failed to load obligations</div>;

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-red-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-red-50 bg-red-50 dark:bg-red-900/20/30 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 dark:text-gray-50 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          Overdue Client Obligations
        </h3>
        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
          {obligations?.length || 0} ITEMS
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-0">
        {(!obligations || obligations.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
            <CheckCircle className="w-12 h-12 text-green-100 mb-2" />
            <p>No overdue obligations</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {obligations.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 dark:bg-[#050505] transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.linkedEvent?.summary || item.description || 'Action Required'}</span>
                  <span className="text-xs font-bold text-red-600 whitespace-nowrap">
                    {item.dueDate ? format(new Date(item.dueDate), 'MMM d') : 'Overdue'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 dark:bg-[#0a0a0c] px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 font-medium">
                      {item.client?.company || 'Unknown Client'}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{item.project?.title}</span>
                  </div>
                  
                  <button className="text-brand-blue opacity-0 group-hover:opacity-100 font-medium hover:underline transition-opacity">
                    Remind
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObligationsWidget;
