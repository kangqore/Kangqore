import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const ThreeDPieChart = ({ data, title }) => {
    // Expected data: [{ label: 'High', value: 30, color: '#ef4444' }, ...]
    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold pointer-events-none">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label || item.name}</p>
                    <p className="text-xs text-gray-500">
                        Distribution: <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-[350px] relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-4 flex flex-col"
        >
            {title && (
                <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-900 dark:text-white font-bold mb-2 z-10 relative"
                >
                    {title}
                </motion.h3>
            )}
            
            <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={() => setActiveIndex(null)}
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color} 
                                    stroke="transparent"
                                    style={{
                                        filter: activeIndex === index ? `drop-shadow(0px 0px 10px ${entry.color}80)` : 'none',
                                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transformOrigin: 'center center',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Central Stat/Graphic (Donut Hole Content) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                       <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Total</span>
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">100%</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ThreeDPieChart;
