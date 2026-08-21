import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel = "from last month", 
  trendUp, 
  trendNeutral,
  color = "blue", 
  loading 
}) => {
  const bgColors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    cyan: "bg-cyan-50 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent dark:bg-cyan-900/30 dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  const selectedColorClass = bgColors[color] || bgColors.blue;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse flex flex-col justify-between h-[140px]">
        <div className="flex justify-between items-start">
           <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
           <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded mt-4"></div>
        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded mt-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200 group">
       <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${selectedColorClass} group-hover:scale-110 transition-transform duration-200`}>
             {Icon && <Icon className="w-6 h-6" />}
          </div>
       </div>
       
       {(trend || trendNeutral) && (
         <div className="flex items-center text-sm">
            {trendNeutral ? (
               <span className="flex items-center font-medium text-gray-500 bg-gray-50 dark:bg-[#050505] px-2 py-0.5 rounded-full">
                 <Minus className="w-3 h-3 mr-1" />
                 0%
               </span>
            ) : (
                <span className={`flex items-center font-medium px-2 py-0.5 rounded-full ${
                    trendUp ? 'text-green-700 bg-green-50 dark:bg-green-900/20' : 'text-red-700 bg-red-50 dark:bg-red-900/20'
                }`}>
                   {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                   {trend}
                </span>
            )}
            <span className="text-gray-400 ml-2 text-xs">{trendLabel}</span>
         </div>
       )}
    </div>
  );
};

export default StatCard;
