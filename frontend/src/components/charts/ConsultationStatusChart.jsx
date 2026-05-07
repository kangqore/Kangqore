import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  PENDING: '#FBBF24',   // Amber
  SCHEDULED: '#3B82F6', // Blue
  COMPLETED: '#10B981', // Emerald
  CANCELLED: '#EF4444'   // Red
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-3 border border-gray-100 shadow-xl rounded-xl text-xs">
        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
        <p className="text-gray-600 dark:text-gray-400">
          {payload[0].value} Request{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const ConsultationStatusChart = ({ data, loading }) => {
  // Transform data object to array
  const chartData = [
    { name: 'Pending', value: data?.pending || 0, color: COLORS.PENDING },
    { name: 'Scheduled', value: data?.scheduled || 0, color: COLORS.SCHEDULED },
    { name: 'Completed', value: data?.completed || 0, color: COLORS.COMPLETED },
    { name: 'Cancelled', value: data?.rejected || 0, color: COLORS.CANCELLED }, // Keeping prop name 'rejected' from backend for now to verify match
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
     return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px] flex flex-col items-center justify-center text-gray-400">
           <p>No consultation data available</p>
        </div>
     )
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm h-[300px]">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Consultation Status</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value, entry) => (
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConsultationStatusChart;
