
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, 
    Gavel, 
    GitCommit, 
    CheckCircle, 
    ArrowDown,
    Calendar,
    Search,
    Filter,
    LifeBuoy,
    Plus
} from 'lucide-react';

const ClientAudit = ({ isTabContent = false }) => {
    const navigate = useNavigate();
    // Mock data for demonstration - replace with real API call when backend is ready
    const MOCK_EVENTS = [
        {
            id: '1',
            type: 'RISK_ACCEPTED',
            title: 'Data Residency Compliance',
            description: 'Formally accepted by Mukesh Ambani',
            timestamp: '2026-01-15T14:30:00Z',
            icon: 'AlertTriangle',
            color: 'amber',
            metadata: { clientName: 'Mukesh Ambani', impact: 'High', status: 'Accepted' }
        },
        {
            id: '2',
            type: 'DECISION_APPROVED',
            title: 'Build Multi-Region Data Storage',
            description: 'Approved by Mukesh Ambani',
            timestamp: '2026-01-20T16:15:00Z',
            icon: 'Gavel',
            color: 'blue',
            metadata: { 
                approvedBy: 'Mukesh Ambani', 
                costImpact: '+₹40L', 
                timelineImpact: '+2 weeks',
                linkedRisk: 'Data Residency Compliance'
            }
        },
        {
            id: '3',
            type: 'CHANGE_REQUEST_SUBMITTED',
            title: 'Add Multi-Region Failover Support',
            description: 'Change request submitted by Mukesh Ambani',
            timestamp: '2026-01-25T10:00:00Z',
            icon: 'GitCommit',
            color: 'blue',
            metadata: { submittedBy: 'Mukesh Ambani', priority: 'High' }
        },
        {
            id: '4',
            type: 'CHANGE_REQUEST_APPROVED',
            title: 'Multi-Region Failover Approved',
            description: 'Approved by Admin Team',
            timestamp: '2026-01-26T11:30:00Z',
            icon: 'CheckCircle',
            color: 'green',
            metadata: { approvedBy: 'Admin Team' }
        },
        {
            id: '5',
            type: 'DELIVERABLE_ACCEPTED',
            title: 'GDPR-Compliant Storage System',
            description: 'Accepted by Mukesh Ambani',
            timestamp: '2026-02-05T11:00:00Z',
            icon: 'CheckCircle',
            color: 'green',
            metadata: { 
                acceptedBy: 'Mukesh Ambani',
                linkedDecision: 'Multi-Region Data Storage',
                linkedRisk: 'Data Residency Compliance',
                artifact: 'https://deployment.kangqore.com/gdpr-storage'
            }
        }
    ];

    const events = MOCK_EVENTS;
    const isLoading = false;

    /* Real API call - uncomment when backend is ready
    const { data: events, isLoading } = useQuery({
        queryKey: ['client-audit-story'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/audit-story`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            return res.data.events;
        }
    });
    */

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'Gavel': return <Gavel className="w-5 h-5 text-amber-500" />;
            case 'GitCommit': return <GitCommit className="w-5 h-5 text-blue-500" />;
            case 'CheckCircle': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
        }
    };

    const getColorClass = (color) => {
        switch (color) {
            case 'red': return 'bg-red-50 border-red-100 ring-red-100';
            case 'amber': return 'bg-amber-50 border-amber-100 ring-amber-100';
            case 'blue': return 'bg-blue-50 border-blue-100 ring-blue-100';
            case 'green': return 'bg-green-50 border-green-100 ring-green-100';
            default: return 'bg-gray-50 border-gray-100 ring-gray-100';
        }
    };

    const getStats = () => {
        const total = events.length;
        const decisions = events.filter(e => e.type.includes('DECISION')).length;
        const risks = events.filter(e => e.type.includes('RISK')).length;
        return { total, decisions, risks };
    };

    const stats = getStats();

    if (isLoading) {
         const loadingContent = (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
         );
         if (isTabContent) return loadingContent;

         return (
             <DashboardLayout role="client" title="Governance Audit Story" subtitle="The 'Chain of Truth' - From Risk to Delivery">
                {loadingContent}
             </DashboardLayout>
         );
    }

    const content = (
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 1. Stats Row - New Addition */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <GitCommit className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Events</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-amber-100 shadow-sm bg-gradient-to-br from-white to-amber-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Risks Mitigated</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.risks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-purple-100 shadow-sm bg-gradient-to-br from-white to-purple-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Gavel className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Decisions Made</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.decisions}</p>
                            </div>
                        </div>
                    </div>

                    {/* Support Button Banner - Request from User */}
                    <div 
                        className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-md text-white relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        onClick={() => navigate('/dashboard/client/support')}
                    >
                        <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
                            <LifeBuoy className="w-24 h-24 rotate-12" />
                        </div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Raise Ticket</h3>
                                <p className="text-blue-100 text-xs text-opacity-90">Report an issue or request service</p>
                            </div>
                            
                            <button className="mt-3 w-full py-2 bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Create New
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Enhanced Header Card */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue"></div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Governance Timeline</h2>
                                <p className="text-sm text-gray-500 mt-1">Traceable history of all project governance actions</p>
                            </div>
                            
                            {/* Search & Filter */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Search events..." 
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                                    />
                                </div>
                                <button className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 hover:text-brand-blue transition-colors">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="relative pb-4">
                            {/* Improved Vertical Line - dashed/gradient */}
                            <div className="absolute left-6 top-4 bottom-0 w-px bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200"></div>

                            <div className="space-y-8 relative">
                                {events && events.length > 0 ? events.map((event, idx) => (
                                    <div key={`${event.type}-${event.id}`} className="relative flex gap-6 group animate-in slide-in-from-bottom-2 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        
                                        {/* Improved Icon Bubble */}
                                        <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-4 border-white shadow-md ring-1 ring-black/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${getColorClass(event.color)}`}>
                                            {getIcon(event.icon)}
                                        </div>

                                        {/* Content Card with Hover Effect */}
                                        <div className="flex-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative group-hover:border-gray-200/80">
                                            {/* Arrow */}
                                            <div className="absolute left-0 top-6 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-l border-b border-gray-100 rotate-45 transform group-hover:border-gray-200/80 transition-colors"></div>

                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${getColorClass(event.color).replace('ring', 'text-gray-700 dark:text-gray-300').replace('bg-', 'bg-opacity-50 bg-')}`}>
                                                            {event.type.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-brand-blue transition-colors">{event.title}</h3>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2.5 py-1.5 rounded-md border border-gray-100">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {/* FIX: Use event.timestamp instead of event.date */}
                                                        {new Date(event.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed border-l-2 border-gray-100 pl-3">
                                                {event.description}
                                            </p>

                                            {/* Metadata Chips if available */}
                                            {event.metadata && (
                                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50">
                                                    {Object.entries(event.metadata).map(([key, value]) => (
                                                        <span key={key} className="text-[10px] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 border border-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                                            <span className="font-semibold opacity-60 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> 
                                                            {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 pl-16">
                                        <p className="text-gray-400">No governance events recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    );

    if (isTabContent) return content;

    return (
        <DashboardLayout role="client" title="Kangqore Audit Logs" subtitle="Your governance chain of truth">
            {content}
        </DashboardLayout>
    );
};

export default ClientAudit;
