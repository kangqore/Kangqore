import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const StrategicRadarChart = ({ data }) => {
  // Default design-system values if no data is provided
  const chartData = data || [
    { subject: 'Delivery', A: 120, B: 110, fullMark: 150 },
    { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
    { subject: 'Governance', A: 86, B: 130, fullMark: 150 },
    { subject: 'Compliance', A: 99, B: 100, fullMark: 150 },
    { subject: 'Alignment', A: 85, B: 90, fullMark: 150 },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 150]} 
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#2563eb"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Radar
            name="Baseline"
            dataKey="B"
            stroke="#94a3b8"
            strokeWidth={1}
            fill="#cbd5e1"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrategicRadarChart;
