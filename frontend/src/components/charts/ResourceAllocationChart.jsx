import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const ResourceAllocationChart = ({ data }) => {
  const chartData = data || [
    { name: 'Week 1', Engineering: 400, Governance: 240, Strategy: 240 },
    { name: 'Week 2', Engineering: 300, Governance: 139, Strategy: 221 },
    { name: 'Week 3', Engineering: 200, Governance: 980, Strategy: 229 },
    { name: 'Week 4', Engineering: 278, Governance: 390, Strategy: 200 },
    { name: 'Week 5', Engineering: 189, Governance: 480, Strategy: 218 },
    { name: 'Week 6', Engineering: 239, Governance: 380, Strategy: 250 },
    { name: 'Week 7', Engineering: 349, Governance: 430, Strategy: 210 },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorStrat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Area 
            type="monotone" 
            dataKey="Engineering" 
            stackId="1" 
            stroke="#2563eb" 
            fillOpacity={1} 
            fill="url(#colorEng)" 
          />
          <Area 
            type="monotone" 
            dataKey="Governance" 
            stackId="1" 
            stroke="#7c3aed" 
            fillOpacity={1} 
            fill="url(#colorGov)" 
          />
          <Area 
            type="monotone" 
            dataKey="Strategy" 
            stackId="1" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorStrat)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResourceAllocationChart;
