import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Activity, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VelocityChart = () => {
    // Ideally this endpoint would return time-series data of completed deliverables
    // For MVP, we might simulate or fetch all deliverables and aggregate client-side if dataset is small
    // Let's assume a new endpoint /api/client/metrics/velocity or just use deliverables data
    
    // For now, let's just mock the visualization structure as if we had the data, 
    // or add the endpoint to metrics.ts
    const { data: velocityData, isLoading } = useQuery({
        queryKey: ['client-velocity'],
        queryFn: async () => {
             // We can Reuse the /metrics/health or add a specific one. 
             // Let's add /metrics/velocity to backend for cleanliness.
             const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/client/metrics/velocity`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              });
              return res.data;
        }
    });

    if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;

    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Delivery Velocity
                </h2>
                <div className="flex gap-2">
                     <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-[#0a0a0c] px-2 py-1 rounded">Last 6 Months</span>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={velocityData?.chart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                         <Bar dataKey="delivered" name="Items Delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <p className="text-xs text-center text-gray-400 mt-4">
                Average Velocity: <span className="font-bold text-gray-900 dark:text-white">{velocityData?.average || 0} items/month</span>
            </p>
        </div>
    );
};

export default VelocityChart;
