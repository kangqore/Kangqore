import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertTriangle, Clock, ArrowRight, CheckCircle, AlertOctagon, FileText, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientActionLedger = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['client-actions'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/actions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.actions;
    }
  });

  if (isLoading) return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm mb-8 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
            <div className="h-12 w-full bg-gray-100 dark:bg-[#0a0a0c] rounded"></div>
            <div className="h-12 w-full bg-gray-100 dark:bg-[#0a0a0c] rounded"></div>
        </div>
    </div>
  );

  if (error) return null; // Fail gracefully if API errors

  if (!data || data.length === 0) return null; // Don't show if empty

  const getIcon = (type) => {
    switch (type) {
        case 'DELIVERABLE': return <FileText className="w-5 h-5 text-blue-600" />;
        case 'RISK': return <AlertOctagon className="w-5 h-5 text-amber-600" />;
        case 'DECISION': return <Gavel className="w-5 h-5 text-purple-600" />;
        case 'CHANGE_REQUEST': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
        default: return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
        case 'DELIVERABLE': return 'Approval Required';
        case 'RISK': return 'Risk Liability';
        case 'DECISION': return 'Decision Needed';
        case 'CHANGE_REQUEST': return 'Change Approval';
        default: return 'Action Item';
    }
  };

  const getLink = (item) => {
     // Map to correct dashboards
     switch (item.type) {
         case 'DELIVERABLE': return '/dashboard/client/deliverables';
         case 'RISK': return '/dashboard/client/risks'; // Assuming route exists
         case 'DECISION': return '/dashboard/client/decisions'; // Assuming route exists
         case 'CHANGE_REQUEST': return '/dashboard/client/change-requests'; // Corrected route
         default: return '/dashboard/client';
     }
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-1 border border-red-100 shadow-sm mb-8">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Action Required</h3>
                        <p className="text-xs text-red-600 font-semibold">{data.length} items blocking progress</p>
                    </div>
                </div>
                {/* <button className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-50">Dismiss All</button> */}
            </div>

            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-red-100 rounded-lg hover:shadow-md transition-shadow hover:border-red-200 group">
                        <div className="flex items-start gap-4 mb-3 md:mb-0">
                            <div className="mt-1 p-2 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors">
                                {getIcon(item.type)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                                        {getTypeLabel(item.type)}
                                    </span>
                                    {item.dueDate && (
                                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Due: {new Date(item.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-blue transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-red-600 mt-1 font-medium bg-red-50 dark:bg-red-900/20 inline-block px-1.5 py-0.5 rounded">
                                    Impact: {item.impact} 
                                </p>
                            </div>
                        </div>
                        
                        <Link 
                            to={getLink(item)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors min-w-[100px]"
                        >
                            Take Action <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ClientActionLedger;
