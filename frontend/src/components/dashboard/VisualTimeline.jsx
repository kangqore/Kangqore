import React from 'react';
import { 
    Clock, 
    CheckCircle, 
    MessageSquare, 
    Flag, 
    AlertTriangle, 
    FileText,
    Calendar,
    ArrowRight
} from 'lucide-react';

const VisualTimeline = ({ events, loading }) => {
    
    const getIcon = (type) => {
        switch(type?.toLowerCase()) {
            case 'milestone': return <Flag className="w-4 h-4 text-white" />;
            case 'approval': return <CheckCircle className="w-4 h-4 text-white" />;
            case 'risk': return <AlertTriangle className="w-4 h-4 text-white" />;
            case 'document': return <FileText className="w-4 h-4 text-white" />;
            case 'meeting': return <Calendar className="w-4 h-4 text-white" />;
            default: return <MessageSquare className="w-4 h-4 text-white" />;
        }
    };

    const getColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'milestone': return 'bg-purple-500 shadow-purple-200';
            case 'approval': return 'bg-emerald-500 shadow-emerald-200';
            case 'risk': return 'bg-red-500 shadow-red-200';
            case 'document': return 'bg-blue-500';
            case 'meeting': return 'bg-amber-500 shadow-amber-200';
            default: return 'bg-gray-400 shadow-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 dark:bg-[#0a0a0c] rounded w-3/4"></div>
                            <div className="h-3 bg-gray-50 dark:bg-[#050505] rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No recent activity to report.</p>
            </div>
        );
    }

    return (
        <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 dark:bg-[#0a0a0c]">
            {events.slice(0, 5).map((event, index) => (
                <div key={event.id || index} className="relative flex gap-6 group">
                    {/* Icon Node */}
                    <div className={`
                        relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                        shadow-lg transition-transform duration-300 group-hover:scale-110
                        ${getColor(event.type || 'update')}
                    `}>
                        {getIcon(event.type || 'update')}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-default">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`
                                text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block
                                ${event.type === 'RISK' ? 'bg-red-50 text-red-600' : 
                                  event.type === 'APPROVAL' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 dark:bg-[#050505] text-gray-500'}
                            `}>
                                {event.type || 'Update'}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                                {new Date(event.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-50 leading-relaxed">
                            {event.message}
                        </p>

                        {event.link && (
                            <a href={event.link} className="mt-3 text-xs font-bold text-brand-blue flex items-center gap-1 hover:underline">
                                View Details <ArrowRight className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VisualTimeline;
