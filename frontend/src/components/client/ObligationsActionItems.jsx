import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CheckSquare, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const ObligationsActionItems = () => {
  const queryClient = useQueryClient();

  const { data: obligations, isLoading } = useQuery({
    queryKey: ['obligations', 'client'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/client/obligations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.obligations;
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      await axios.patch(`${backendUrl}/api/client/obligations/${id}/resolve`, {}, { // Need client endpoint or admin? Admin only in admin.ts. Client needs specific route if self-resolving is allowed.
        // Wait, accountability service has createObligation/resolveObligation.
        // I only added POST /api/admin/accountability/obligations/:id/resolve.
        // Client can't resolve their own obligations yet via API.
        // EXCEPT: Resolving implies doing the work (e.g. Approve Decision).
        // The SYSTEM should auto-resolve when the work is done.
        // Manual resolve: "I have read this".
        // Let's assume for now this widget is READ-ONLY or links to the action.
        // "Go to Action".
      });
    }
  });

  if (isLoading) return <div className="text-gray-400 text-sm">Loading actions...</div>;
  if (!obligations || obligations.length === 0) return null; // Don't show if empty

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          My Action Items
        </h3>
        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">
          {obligations.length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {obligations.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-200">
            <div className="mt-1">
              {item.status === 'OVERDUE' ? (
                <AlertCircle className="w-5 h-5 text-amber-600" /> // Use Amber instead of Red for lighter touch
              ) : (
                <Clock className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.description}</p>
              {item.linkedEvent?.summary && (
                <p className="text-xs text-gray-500 mt-1">Context: {item.linkedEvent.summary}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.status === 'OVERDUE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status === 'OVERDUE' ? 'ACTION REQUIRED' : 'OPEN'}
                </span>
                {item.dueDate && (
                  <span className="text-[10px] text-gray-500">
                    Target: {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 p-1">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ObligationsActionItems;
