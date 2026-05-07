import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    Shield, 
    AlertTriangle, 
    Gavel, 
    GitCommit, 
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const ClientAuditWidget = () => {
    const navigate = useNavigate();

    // Mock data matching the structure in ClientAudit.jsx
    // In a real implementation, this would come from the same API hook
    const RECENT_EVENTS = [
        {
            id: '5',
            type: 'DELIVERABLE_ACCEPTED',
            title: 'GDPR-Compliant Storage System',
            timestamp: '2026-02-05T11:00:00Z',
            icon: 'CheckCircle',
            color: 'green',
            actor: 'Mukesh Ambani'
        },
        {
            id: '4',
            type: 'CHANGE_REQUEST_APPROVED',
            title: 'Multi-Region Failover Approved',
            timestamp: '2026-01-26T11:30:00Z',
            icon: 'CheckCircle',
            color: 'green',
            actor: 'Admin Team'
        },
        {
            id: '3',
            type: 'CHANGE_REQUEST_SUBMITTED',
            title: 'Add Multi-Region Failover Support',
            timestamp: '2026-01-25T10:00:00Z',
            icon: 'GitCommit',
            color: 'blue',
            actor: 'Mukesh Ambani'
        }
    ];

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
            case 'Gavel': return <Gavel className="w-4 h-4 text-purple-600" />;
            case 'GitCommit': return <GitCommit className="w-4 h-4 text-blue-600" />;
            case 'CheckCircle': return <CheckCircle className="w-4 h-4 text-green-600" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getColorClass = (color) => {
        switch (color) {
            case 'red': return 'bg-red-50 text-red-700 border-red-100';
            case 'amber': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'green': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 h-full flex flex-col group hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span> 
                    Audit Logs
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-200">
                        Governance
                    </span>
                </h2>
                <button 
                    onClick={() => navigate('/dashboard/client/audit')}
                    className="p-2 hover:bg-gray-50 dark:bg-[#050505] rounded-lg text-gray-400 hover:text-brand-blue transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {RECENT_EVENTS.map((event, index) => (
                    <div 
                        key={event.id} 
                        className="flex gap-4 group/item cursor-pointer"
                        onClick={() => navigate('/dashboard/client/audit')}
                    >
                        <div className="relative">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getColorClass(event.color)} group-hover/item:scale-110 transition-transform`}>
                                {getIcon(event.icon)}
                            </div>
                            {index !== RECENT_EVENTS.length - 1 && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-100 dark:bg-[#0a0a0c] -mb-4 group-hover/item:bg-gray-200 transition-colors"></div>
                            )}
                        </div>
                        
                        <div className="flex-1 pb-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover/item:text-brand-blue transition-colors leading-tight">
                                    {event.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                    {new Date(event.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Action by <span className="font-medium text-gray-700 dark:text-gray-300">{event.actor}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50">
                <button 
                    onClick={() => navigate('/dashboard/client/audit')}
                    className="w-full py-2 bg-gray-50 dark:bg-[#050505] hover:bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    View Full Audit Trail
                </button>
            </div>
        </div>
    );
};

export default ClientAuditWidget;
