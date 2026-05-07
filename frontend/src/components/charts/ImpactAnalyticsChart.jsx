import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { AlertCircle } from 'lucide-react';

const ImpactAnalyticsChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['impact-analytics-history'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      // Fetch both summary and history
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const [historyRes, summaryRes] = await Promise.all([
        axios.get(`${backendUrl}/api/client/analytics/impact-history`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${backendUrl}/api/client/analytics/impact-distribution`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      return { history: historyRes.data, summary: summaryRes.data };
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading analytics...</div>;
  if (error) return <div className="h-64 flex items-center justify-center text-red-500">Failed to load analytics</div>;
  if (!data) return null;

  const { history, summary } = data;
  const totalDelay = (summary.clientDelay || 0) + (summary.vendorDelay || 0) + (summary.externalDelay || 0);

  // Fallback if history is empty (show at least one 0 point or summary point)
  const chartData = history.length > 0 ? history.map(h => ({
      name: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Client: h.clientDelay,
      Kangqore: h.vendorDelay,
      External: h.externalDelay
  })) : [
      { name: 'Start', Client: 0, Kangqore: 0, External: 0 },
      { name: 'Today', Client: summary.clientDelay, Kangqore: summary.vendorDelay, External: summary.externalDelay }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cumulative Delay Impact</p>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
             Total: {totalDelay} Days
           </h3>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
           <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorKangqore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Client" stackId="1" stroke="#3b82f6" fill="url(#colorClient)" />
            <Area type="monotone" dataKey="Kangqore" stackId="1" stroke="#10b981" fill="url(#colorKangqore)" />
            {/* <Area type="monotone" dataKey="External" stackId="1" stroke="#6b7280" fill="#gray" /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 text-center">
        Visualize attribution of project slippage over time.
      </p>
    </div>
  );
};

export default ImpactAnalyticsChart;
