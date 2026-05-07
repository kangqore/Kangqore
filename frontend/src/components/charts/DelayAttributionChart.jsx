import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Loader, AlertTriangle } from 'lucide-react';

const COLORS = {
  clientDelay: '#FF6B6B', // Red
  kangqoreDelay: '#4ECDC4', // Teal
  externalDelay: '#FFE66D'  // Yellow
};

const LABELS = {
  clientDelay: 'Client Delay',
  kangqoreDelay: 'Kangqore Delay',
  externalDelay: 'External Delay'
};

const DelayAttributionChart = ({ projectId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['delay-attribution', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/client/projects/${projectId}/impact-attribution`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Attribution Data:", res.data);
      return res.data;
    },
    enabled: !!projectId
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400"><Loader className="animate-spin w-5 h-5 mr-2" /></div>;
  if (error) return <div className="h-64 flex items-center justify-center text-red-500"><AlertTriangle className="w-5 h-5 mr-2" /> Failed to load data</div>;

  // Transform object to array for Recharts
  const chartData = [
    { name: LABELS.clientDelay, value: data.clientDelay, color: COLORS.clientDelay },
    { name: LABELS.kangqoreDelay, value: data.kangqoreDelay, color: COLORS.kangqoreDelay },
    { name: LABELS.externalDelay, value: data.externalDelay, color: COLORS.externalDelay }
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-dashed border-gray-200">
         <p>No recorded delays</p>
         <span className="text-xs text-gray-300 mt-1">Project is on track</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
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
          <Tooltip 
            formatter={(value) => `${value} Days`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DelayAttributionChart;
