import React, { useState } from 'react';
import { 
    Shield, 
    GitCommit, 
    AlertTriangle, 
    GitPullRequest, 
    Users, 
    CheckCircle, 
    Clock, 
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
    useClientDecisions, 
    useClientRisks, 
    useClientChangeRequests, 
    useClientDashboard 
} from '../../hooks/useDashboardData';

const ClientGovernance = () => {
    const [activeTab, setActiveTab] = useState('decisions');

    const { data: decisions, isLoading: loadingDecisions } = useClientDecisions();
    const { data: risks, isLoading: loadingRisks } = useClientRisks();
    const { data: changes, isLoading: loadingChanges } = useClientChangeRequests();
    const { settings: settingsQuery } = useClientDashboard();

    const tabs = [
        { id: 'decisions', label: 'Decision Log', icon: GitCommit },
        { id: 'risks', label: 'Delivery Risks', icon: AlertTriangle },
        { id: 'changes', label: 'Change History', icon: GitPullRequest },
        { id: 'escalation', label: 'Escalation Matrix', icon: Users },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'decisions':
                return (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Recent Decisions</h4>
                                <p className="text-xs text-gray-500">Formal approvals and strategic directions</p>
                            </div>
                            <Link to="/dashboard/client/decisions" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
                                View Full Log <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        {loadingDecisions ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-50 dark:bg-[#050505] rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : decisions && decisions.length > 0 ? (
                            <div className="space-y-3">
                                {decisions.slice(0, 3).map(decision => (
                                    <div key={decision.id} className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-100 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{decision.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    decision.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                    decision.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {decision.status === 'PENDING_APPROVAL' ? 'Pending Approval' : decision.status}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(decision.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {decision.status === 'APPROVED' && decision.approver && (
                                                <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Approved by {decision.approver.name}
                                                </p>
                                            )}
                                            {decision.status === 'PENDING_APPROVAL' && (
                                                <p className="text-[10px] text-amber-600 mt-1 font-bold animate-pulse">
                                                    Action Required
                                                </p>
                                            )}
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-300 mt-1" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs">
                                No decisions recorded yet.
                            </div>
                        )}
                    </div>
                );

            case 'risks':
                return (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Delivery Risks</h4>
                                <p className="text-xs text-gray-500">Items potentially impacting delivery</p>
                            </div>
                            <Link to="/dashboard/client/risks" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
                                View Register <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {loadingRisks ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-16 bg-gray-50 dark:bg-[#050505] rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : risks && risks.filter(r => ['HIGH', 'CRITICAL'].includes(r.severity) && r.status === 'OPEN').length > 0 ? (
                            <div className="space-y-3">
                                {risks.filter(r => ['HIGH', 'CRITICAL'].includes(r.severity) && r.status === 'OPEN').slice(0, 3).map(risk => (
                                    <div key={risk.id} className="p-3 bg-red-50 dark:bg-red-900/20/50 rounded-lg border border-red-100 flex items-start gap-3">
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{risk.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">{risk.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100">
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-bold text-green-700">No risks identified for this engagement.</p>
                                <p className="text-[10px] text-green-600">Active monitoring in progress.</p>
                            </div>
                        )}
                    </div>
                );

            case 'changes':
                return (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Change History</h4>
                                <p className="text-xs text-gray-500">Approved scope & budget adjustments</p>
                            </div>
                            <Link to="/dashboard/client/change-requests" className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
                                View Details <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {loadingChanges ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-16 bg-gray-50 dark:bg-[#050505] rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        ) : changes && changes.length > 0 ? (
                            <div className="space-y-3">
                                {changes.slice(0, 3).map(change => (
                                    <div key={change.id} className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{change.title}</p>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                change.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {change.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{new Date(change.createdAt).toLocaleDateString()}</span>
                                            {change.costImpact && (
                                                <span className="font-medium text-gray-700 dark:text-gray-300">Impact: +${change.costImpact}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs">
                                No change requests filed.
                            </div>
                        )}
                    </div>
                );

            case 'escalation':
                return (
                     <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Escalation Matrix</h4>
                                <p className="text-xs text-gray-500">Key contacts for resolution</p>
                            </div>
                            <Link to="/console/settings" className="text-xs font-bold text-brand-blue hover:underline">
                                Configure
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             {/* Client Side */}
                             <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Your Team</p>
                                 {settingsQuery.data?.escalationMatrix?.length > 0 ? (
                                     settingsQuery.data.escalationMatrix.map((person, idx) => (
                                         <div key={idx} className="flex items-center gap-2 mb-2 last:mb-0">
                                             <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-700 uppercase">
                                                 {person.name ? person.name.slice(0, 2) : '??'}
                                             </div>
                                             <div className="overflow-hidden">
                                                 <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{person.name}</p>
                                                 <p className="text-[10px] text-gray-500 truncate">{person.level || 'Stakeholder'}</p>
                                             </div>
                                         </div>
                                     ))
                                 ) : (
                                     <div className="text-xs text-gray-400 italic">No stakeholders defined</div>
                                 )}
                             </div>

                             {/* Kangqore Side */}
                             <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kangqore Team</p>
                                 <div className="space-y-3">
                                     <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-[10px] font-bold text-white">RS</div>
                                         <div>
                                             <p className="text-xs font-bold text-gray-900 dark:text-white">Rahul Sharma</p>
                                             <p className="text-[10px] text-gray-500">Account Manager</p>
                                         </div>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-800">PM</div>
                                         <div>
                                             <p className="text-xs font-bold text-gray-900 dark:text-white">Priya Mehta</p>
                                             <p className="text-[10px] text-gray-500">Delivery Manager</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                     </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-blue" /> Project Governance
                </h2>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded-full">
                    Active
                </span>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1">
                {/* Navigation Sidebar */}
                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-r border-gray-100 md:w-48 p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full text-left whitespace-nowrap ${
                                    isActive 
                                    ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue shadow-sm border border-gray-200' 
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 bg-white dark:bg-black min-h-[300px]">
                    {renderContent()}
                </div>
            </div>
            
            {/* Footer Assurance */}
            <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between items-center">
                <span>Governed by MSA Schedule A</span>
                <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" /> Compliance 100%
                </span>
            </div>
        </div>
    );
};

// Helper for 'decisions' tab (to avoid undefined error in rendering if I used variable directly)
const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default ClientGovernance;
