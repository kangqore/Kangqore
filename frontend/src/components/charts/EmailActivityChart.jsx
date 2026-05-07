import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-3 border border-gray-100 shadow-xl rounded-xl text-xs">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
        <div className="space-y-1">
            <p className="text-brand-blue flex items-center justify-between gap-3">
                <span>Sent:</span>
                <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-purple-500 flex items-center justify-between gap-3">
                <span>Received:</span>
                <span className="font-bold">{payload[1].value}</span>
            </p>
        </div>
      </div>
    );
  }
  return null;
};

const EmailActivityChart = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Email Activity</h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
            />
            <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
            <Bar dataKey="sent" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} stackId="a" />
            <Bar dataKey="received" fill="#A855F7" radius={[4, 4, 0, 0]} barSize={20} stackId="b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmailActivityChart;
