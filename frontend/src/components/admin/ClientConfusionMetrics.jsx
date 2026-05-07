import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AlertTriangle, Clock, RefreshCw, Eye, Brain } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const ClientConfusionMetrics = ({ clientId }) => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['client-confusion', clientId],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/api/admin/client-confusion/${clientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    },
    enabled: !!clientId
  });

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;
  if (!metrics || !metrics.summary) return null;

  const { confusion_score, risk_level, summary, metrics: details } = metrics;

  const getRiskColor = (level) => {
    switch(level) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-100';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getScoreColor = (score) => {
    if (score > 60) return '#ef4444'; // Red
    if (score > 30) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Brain className="w-5 h-5 text-gray-400" /> Client Confusion & Cognitive Load
           </h3>
           <p className="text-xs text-gray-500 mt-1">Behavioral signals indicating client hesitation or overwhelm</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getRiskColor(risk_level)}`}>
           {risk_level} CONFUSION
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         {/* Confusion Score */}
         <div className="col-span-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden border border-gray-100">
             <div className="relative z-10">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confusion Score</p>
                 <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{confusion_score}/100</h2>
                 <p className="text-[10px] text-gray-500 mt-1">Higher = more confused/stuck</p>
             </div>
             <div className="relative z-10">
                 <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg" 
                      style={{ borderColor: getScoreColor(confusion_score), color: getScoreColor(confusion_score) }}>
                     {confusion_score}
                 </div>
             </div>
         </div>

         {/* Hesitation Zones */}
         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-amber-100 rounded-xl p-3 shadow-sm">
             <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
                     <RefreshCw className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-gray-500">Hesitation Zones</span>
             </div>
             <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.total_hesitations}</p>
             <p className="text-[10px] text-gray-400">Decisions revisited &gt;3 times</p>
         </div>

         {/* Time Paralysis */}
         <div className={`bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-xl p-3 shadow-sm ${
            summary.total_paralysis > 0 ? 'border-red-100 bg-red-50/30' : 'border-gray-100'
         }`}>
             <div className="flex items-center gap-2 mb-2">
                 <div className={`p-1.5 rounded ${
                    summary.total_paralysis > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-500'
                 }`}>
                     <Clock className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-medium text-gray-500">Time Paralysis</span>
             </div>
             <p className="text-lg font-bold text-gray-900 dark:text-white">{summary.total_paralysis}</p>
             <p className="text-[10px] text-gray-400">&gt;10min per decision</p>
         </div>

         {/* Decision Reopens */}
         <div className="col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded">
                     <Eye className="w-4 h-4" />
                 </div>
                 <div>
                     <p className="text-xs font-medium text-gray-500">Decision Reopens</p>
                     <p className="text-sm font-bold text-gray-900 dark:text-white">{summary.total_reopens} times</p>
                 </div>
             </div>
             <span className="text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2 py-1 rounded border">
                Buyer's remorse signals
             </span>
         </div>
      </div>

      {/* Drill-down Details */}
      {(details.hesitation_zones.length > 0 || details.time_paralysis_cases.length > 0) && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 dark:text-gray-300 uppercase mb-3">Problematic Decisions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                  {details.hesitation_zones.slice(0, 3).map(d => (
                      <div key={d.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded border border-amber-100 text-xs">
                          <p className="font-bold text-gray-800 dark:text-gray-50">{d.title}</p>
                          <div className="flex gap-3 mt-1 text-gray-500">
                              <span>🔄 {d.viewCount} revisits</span>
                              <span>⏱️ {Math.floor(d.totalDuration / 60)}min total</span>
                          </div>
                      </div>
                  ))}
                  {details.time_paralysis_cases.slice(0, 3).map(d => (
                      <div key={d.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded border border-red-100 text-xs">
                          <p className="font-bold text-gray-800 dark:text-gray-50">{d.title}</p>
                          <div className="flex gap-3 mt-1 text-gray-500">
                              <span>⏱️ {Math.floor(d.totalDuration / 60)}min cumulative</span>
                              <span>📊 Avg {Math.floor(d.averageDuration / 60)}min/view</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
      
      {risk_level === 'HIGH' && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 text-xs p-3 rounded-lg border border-red-100 flex items-start gap-2 mt-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                  <span className="font-bold">Client is struggling.</span> Simplify decision language, add video explanations, or schedule a walkthrough call immediately.
              </div>
          </div>
      )}
    </div>
  );
};

export default ClientConfusionMetrics;
