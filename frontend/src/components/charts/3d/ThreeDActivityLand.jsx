import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const ThreeDActivityLand = ({ data, title }) => {
    // Expected data: [{ name: 'Project A', value: 80, color: '#3b82f6' }, ...]
    const [activeIndex, setActiveIndex] = useState(null);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in duration-200">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-gray-300">
                        Activity: <span className="font-bold text-blue-400">{item.value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-[350px] relative bg-slate-900 rounded-2xl p-4 flex flex-col overflow-hidden"
        >
            {/* Background Gradient Mesh for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50 z-0 pointer-events-none" />
            
            {title && (
                <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white font-bold mb-4 z-10 relative"
                >
                    {title}
                </motion.h3>
            )}
            
            <div className="flex-1 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#9ca3af" 
                            tick={{ fill: '#9ca3af', fontSize: 12 }} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                            content={<CustomTooltip />} 
                        />
                        <Bar 
                            dataKey="value" 
                            radius={[4, 4, 0, 0]}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            isAnimationActive={true}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color || '#3b82f6'} 
                                    style={{
                                        filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color || '#3b82f6'})` : 'none',
                                        transition: 'filter 0.3s ease'
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ThreeDActivityLand;
