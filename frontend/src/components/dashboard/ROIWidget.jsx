import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ROIWidget = () => {
  const { data: roi, isLoading } = useQuery({
    queryKey: ['client-roi'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/client/metrics/roi`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  const { data: health } = useQuery({
    queryKey: ['client-health'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/client/metrics/health`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    }
  });

  const [showBreakdown, setShowBreakdown] = React.useState(false);

  if (isLoading) return <div className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;

  const chartData = [
    { name: 'Investment', value: roi?.investment || 0, color: '#94a3b8' }, // Slate-400
    { name: 'Value', value: roi?.valueRealized || 0, color: '#2563eb' }   // Brand Blue
  ];

  // Helper for color mapping
  const getStatusColor = (status) => {
      if (['RED', 'Critical Attention', 'Review Needed', 'Action Required'].includes(status)) return 'text-red-600';
      if (['AMBER', 'Monitoring', 'Approaching Limit', 'At Risk'].includes(status)) return 'text-amber-600';
      return 'text-green-600';
  };

  const getStatusBg = (status) => {
      if (['RED', 'Critical Attention', 'Review Needed', 'Action Required'].includes(status)) return 'bg-red-500';
      if (['AMBER', 'Monitoring', 'Approaching Limit', 'At Risk'].includes(status)) return 'bg-amber-500';
      return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-blue" /> Value Realization
        </h2>
        <button 
            onClick={() => setShowBreakdown(!showBreakdown)}
            className={`text-xs font-bold px-2 py-1 rounded-full border transition-all ${
                roi?.roiPercentage >= 0 
                ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
                : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 border-gray-200'
            }`}
        >
            {roi?.roiPercentage ? `${roi.roiPercentage.toFixed(1)}% ROI` : 'Calculating...'}
        </button>
      </div>

      {showBreakdown && health?.narrative && (
          <div className="absolute top-16 right-4 z-10 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl rounded-xl border border-gray-100 p-4 w-64 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Health Breakdown</h4>
              <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Speed</span>
                      <span className={`font-bold flex items-center gap-1 ${getStatusColor(health.schedule)}`}>
                          <div className={`w-2 h-2 rounded-full ${getStatusBg(health.schedule)}`}></div> 
                          {health.narrative.schedule.status}
                      </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Dependencies</span>
                      <span className={`font-bold flex items-center gap-1 ${getStatusColor(health.narrative.schedule.status)}`}> 
                          {/* Note: Dependencies is heuristic, using Project Schedule status for now */}
                           <div className={`w-2 h-2 rounded-full ${getStatusBg(health.narrative.schedule.status)}`}></div>
                           {health.narrative.schedule.message}
                      </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Budget</span>
                      <span className={`font-bold flex items-center gap-1 ${getStatusColor(health.budget)}`}>
                          <div className={`w-2 h-2 rounded-full ${getStatusBg(health.budget)}`}></div> 
                          {health.narrative.budget.status}
                      </span>
                  </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 text-center">
                  Values verified by Kangqore Admin
              </div>
          </div>
      )}

      <div className="h-24 w-full">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} barSize={12}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
         </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs">
          <div>
              <p className="text-gray-400 uppercase tracking-wider font-bold">Total Invested</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">₹{(roi?.investment || 0).toLocaleString()}</p>
          </div>
          <div className="text-right">
              <p className="text-gray-400 uppercase tracking-wider font-bold">Value Delivered</p>
              <p className="text-sm font-bold text-brand-blue">₹{(roi?.valueRealized || 0).toLocaleString()}</p>
          </div>
      </div>
    </div>
  );
};

export default ROIWidget;
