import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';

const HealthScorecard = ({ data: health, isLoading }) => {
  // Removed internal useQuery


  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-green-500';
      case 'Watch': return 'bg-amber-500';
      case 'At Risk': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getTextColor = (status) => {
      switch (status) {
        case 'Healthy': return 'text-green-600';
        case 'Watch': return 'text-amber-600';
        case 'At Risk': return 'text-red-600';
        default: return 'text-gray-500';
      }
  };

  const getStatusLabel = (status) => {
    return status || 'Unknown';
  };

  if (isLoading) return <div className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-blue" /> Health Scorecard
        </h2>
        <span className="text-xs text-gray-500">Live Assessment</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Schedule */}
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
            <div className={`w-3 h-3 rounded-full mb-2 ${health?.details?.overdueTasks > 0 ? 'bg-amber-500' : 'bg-green-500'} shadow-sm`} />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Schedule</span>
            <span className={`text-sm font-bold ${health?.details?.overdueTasks > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {health?.details?.overdueTasks > 0 ? 'Delayed' : 'On Track'}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">{health?.details?.overdueTasks || 0} Overdue Tasks</p>
        </div>

        {/* Budget (Placeholder/Mock as backend isn't real yet) */}
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
            <div className={`w-3 h-3 rounded-full mb-2 bg-green-500 shadow-sm`} />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Budget</span>
            <span className={`text-sm font-bold text-green-600`}>
                On Track
            </span>
            <p className="text-[10px] text-gray-400 mt-1">65% Utilized</p>
        </div>

        {/* Risk / Quality */}
        <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
            <div className={`w-3 h-3 rounded-full mb-2 ${getStatusColor(health?.status)} shadow-sm`} />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Overall</span>
            <span className={`text-sm font-bold ${getTextColor(health?.status)}`}>
                {getStatusLabel(health?.status)}
            </span>
            <p className="text-[10px] text-gray-400 mt-1">{health?.details?.openCriticalRisks || 0} Critical / {health?.details?.openHighRisks || 0} High</p>
        </div>
      </div>
    </div>
  );
};

export default HealthScorecard;
