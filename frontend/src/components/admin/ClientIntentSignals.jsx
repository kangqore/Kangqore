import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertTriangle, Clock, MessageSquare, Activity, UserX } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const ClientIntentSignals = ({ clientId }) => {
  const { data: signals, isLoading } = useQuery({
    queryKey: ['client-signals', clientId],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/client-signals/${clientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    },
    enabled: !!clientId
  });

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;
  if (!signals || !signals.signals) return null;

  const { intent_score, risk_level, approval_latency_hours, silence_days, response_delay_hours } = signals.signals;

  const getRiskColor = (level) => {
    switch(level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getScoreColor = (score) => {
    if (score < 50) return '#ef4444'; // Red
    if (score < 80) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Activity className="w-5 h-5 text-gray-400" /> Client Intent Signals
           </h3>
           <p className="text-xs text-gray-500 mt-1">Behavioral predictors of churn & delay</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getRiskColor(risk_level)}`}>
           {risk_level} RISK
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         {/* Intent Score */}
         <div className="col-span-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
             <div className="relative z-10">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Intent Score</p>
                 <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{intent_score}/100</h2>
             </div>
             <div className="relative z-10">
                 {/* Visual Indicator of trend could go here */}
                 <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg" style={{ borderColor: getScoreColor(intent_score), color: getScoreColor(intent_score) }}>
                     {intent_score}%
                 </div>
             </div>
         </div>

         {/* Approval Latency */}
         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl p-3 shadow-sm">
             <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded">
                     <Clock className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-gray-500">Decision Speed</span>
             </div>
             <p className="text-lg font-bold text-gray-900 dark:text-white">{approval_latency_hours}h</p>
             <p className="text-[10px] text-gray-400">Avg. time to approve</p>
         </div>

         {/* Silence */}
         <div className={`bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-xl p-3 shadow-sm ${silence_days > 3 ? 'border-red-100 bg-red-50/30' : 'border-gray-100'}`}>
             <div className="flex items-center gap-2 mb-2">
                 <div className={`p-1.5 rounded ${silence_days > 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-500'}`}>
                     <UserX className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-gray-500">Radio Silence</span>
             </div>
             <p className="text-lg font-bold text-gray-900 dark:text-white">{silence_days} Days</p>
             <p className="text-[10px] text-gray-400">Since last interaction</p>
         </div>

         {/* Response Time */}
         <div className="col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded">
                     <MessageSquare className="w-4 h-4" />
                 </div>
                 <div>
                     <p className="text-xs font-medium text-gray-500">Response Delay</p>
                     <p className="text-sm font-bold text-gray-900 dark:text-white">{response_delay_hours}h Avg</p>
                 </div>
             </div>
             <div className="h-8 w-24">
                 {/* Mini sparkline placeholder */}
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{v:10}, {v:15}, {v:8}, {v:12}, {v:20}, {v:10}]}>
                       <Area type="monotone" dataKey="v" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                    </AreaChart>
                 </ResponsiveContainer>
             </div>
         </div>
      </div>
      
      {risk_level === 'HIGH' && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 text-xs p-3 rounded-lg border border-red-100 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                  <span className="font-bold">Intervention Recommended.</span> Client is checking out. Schedule a heartbeat call immediately.
              </div>
          </div>
      )}
    </div>
  );
};

export default ClientIntentSignals;
