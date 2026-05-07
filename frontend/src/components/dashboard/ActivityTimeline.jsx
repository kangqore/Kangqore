import React from 'react';
import { Clock, User, FileText, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const ActivityTimeline = ({ activities = [], loading }) => {
  if (loading) {
     return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6 h-full">
           <div className="h-6 w-32 bg-gray-100 dark:bg-[#0a0a0c] rounded mb-6 animate-pulse"></div>
           <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                 <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0a0a0c] shrink-0"></div>
                    <div className="flex-1 space-y-2">
                       <div className="h-4 w-3/4 bg-gray-100 dark:bg-[#0a0a0c] rounded"></div>
                       <div className="h-3 w-1/2 bg-gray-100 dark:bg-[#0a0a0c] rounded"></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     );
  }

  const getIcon = (type) => {
     switch(type) {
        case 'user_signup': return { icon: User, color: 'text-blue-500 bg-blue-50', border: 'border-blue-100' };
        case 'content_publish': return { icon: FileText, color: 'text-purple-500 bg-purple-50', border: 'border-purple-100' };
        case 'task_complete': return { icon: CheckCircle, color: 'text-green-500 bg-green-50', border: 'border-green-100' };
        case 'alert': return { icon: AlertCircle, color: 'text-red-500 bg-red-50', border: 'border-red-100' };
        case 'event': return { icon: Calendar, color: 'text-amber-500 bg-amber-50', border: 'border-amber-100' };
        default: return { icon: Clock, color: 'text-gray-500 bg-gray-50', border: 'border-gray-100' };
     }
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6 h-full">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <button className="text-sm text-brand-blue hover:underline font-medium">View All</button>
       </div>
       
       <div className="relative pl-4 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-0.5 before:bg-gray-100 dark:bg-[#0a0a0c]">
          {activities.length > 0 ? activities.map((item, idx) => {
             const style = getIcon(item.type);
             const Icon = style.icon;
             
             return (
                <div key={idx} className="relative flex gap-4 group">
                   <div className={`
                      relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                      ${style.color} border-2 ${style.border} group-hover:scale-110 transition-transform ring-4 ring-white
                   `}>
                      <Icon className="w-4 h-4" />
                   </div>
                   <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                         {item.title}
                         {item.highlight && <span className="ml-1 text-brand-blue">{item.highlight}</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {item.time}
                      </p>
                   </div>
                </div>
             );
          }) : (
             <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
          )}
       </div>
    </div>
  );
};

export default ActivityTimeline;
