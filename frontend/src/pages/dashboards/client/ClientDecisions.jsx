import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  GitCommit, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Info,
  Shield,
  Wallet,
  Brain,
  Lock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react';

import { useClientDecisions } from '../../../hooks/useDashboardData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ClientDecisions = ({ isTabContent = false }) => {
  const { data: decisions, isLoading, error } = useClientDecisions();
  // We need to map the backend decision object to the frontend expectations if they differ.
  // Backend returns: 
  // { id, title, description, status, priority, dueDate, project: { title }, approver: { name }, clientId }
  // Frontend expects:
  // { id, title, date, requested_by: { name, role, org }, approved_by: { name, role, org }, execution_owner, impact_summary ... }
  
  // Since we haven't seeded full rich data in backend yet, we'll map what we can 
  // and keep some mock defaults for UI richness until Admin Form is fully built.
  
  const DECISIONS = decisions ? decisions.map(d => ({
      id: d.id,
      title: d.title,
      date: new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      requested_by: { name: 'Admin', role: 'Project Manager', org: 'Kangqore' }, // Default for now
      approved_by: d.approver ? { 
          name: d.approver.name, 
          role: d.approvalRole || d.approver.authorityRole || 'Authorized Signatory', // Gap 1 linked
          org: 'Client', 
          type: 'Authority' 
      } : { name: 'Pending Client Approval', role: '-', org: 'Client', type: 'Pending' },
      execution_owner: { name: 'Kangqore Team', type: 'Execution' },
      status: d.status === 'PENDING_APPROVAL' ? 'Pending' : d.status === 'APPROVED' ? 'Approved' : d.status,
      description: d.description,
      
      // Transparency Fields
      rationale: d.rationale,
      tradeoffs: d.tradeoffs,
      acknowledgedAt: d.acknowledgedAt,
      acknowledgedBy: d.acknowledgedBy,

      // Real Relations (Gap 3)
      risk: d.risk, 
      changeRequest: d.changeRequest,
      
      // Impact Summary (for badges) - Derived from impact data or default
      impact_summary: d.impactSummary || [],

      // Impact Data (Gap 7 - Decision Consequence Model)
      impact: {
          time: d.impact ? d.impactTime : 'N/A', // Defensive check
          cost: d.impact ? d.impactCost : 'N/A',
          risk: d.impact ? d.impactRisk : 'LOW'
      },

      // Defaults for fields not yet in DB Schema (Enterprise richness)
      authority_type: 'Technical',
      authority_source: 'MSA Schedule A',
      escalation: 'PM -> VP',
      audit_trail: { meeting: 'Weekly Sync', doc: 'Spec.pdf' }
  })) : [];

  const [expandedRows, setExpandedRows] = useState({});
  const [viewStartTimes, setViewStartTimes] = React.useState({});

  if (isLoading) {
     const loadingContent = (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        </div>
     );
     if (isTabContent) return loadingContent;

     return (
         <DashboardLayout role="client" title="Decision Log" subtitle="Traceability of all strategic and technical approvals">
            {loadingContent}
         </DashboardLayout>
     );
  }

  if (error) {
     const errorContent = (
        <div className="p-8 text-center text-red-500">
            Failed to load decisions. Please try again later.
        </div>
     );
     if (isTabContent) return errorContent;

     return (
         <DashboardLayout role="client" title="Decision Log" subtitle="Traceability of all strategic and technical approvals">
            {errorContent}
         </DashboardLayout>
     );
  }



  const toggleRow = async (id) => {
    const isExpanding = !expandedRows[id];
    setExpandedRows(prev => ({ ...prev, [id]: isExpanding }));

    if (isExpanding) {
        // Record start time for duration tracking
        setViewStartTimes(prev => ({ ...prev, [id]: Date.now() }));

        // Track Client Hesitation (Gap 9)
        try {
            await fetch(`/api/decisions/${id}/view`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (e) {
            console.error("Failed to track decision view", e);
        }
    } else {
        // Record duration when closing
        const startTime = viewStartTimes[id];
        if (startTime) {
            const duration = Math.floor((Date.now() - startTime) / 1000); // seconds
            try {
                await fetch(`/api/decisions/${id}/track-duration`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ duration })
                });
            } catch (e) {
                console.error("Failed to record view duration", e);
            }
            // Clear start time
            setViewStartTimes(prev => {
                const newTimes = { ...prev };
                delete newTimes[id];
                return newTimes;
            });
        }
    }
  };


  const content = (
      <div className="space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase">Total Decisions</p>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24</h3>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-[#050505] rounded-lg"><GitCommit className="w-5 h-5 text-gray-400" /></div>
            </div>
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase">Pending</p>
                   <h3 className="text-2xl font-bold text-amber-600">1</h3>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
            </div>
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-gray-500 uppercase">Approved this Month</p>
                   <h3 className="text-2xl font-bold text-green-600">6</h3>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            </div>
        </div>
        
        {/* Search */}
        <div className="flex gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search decisions by title, ID, or owner..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                />
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium text-sm">
                <Filter className="w-4 h-4" /> Filter
            </button>
        </div>

        {/* Decision Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
                        <tr>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase w-[30%]">Decision Summary</th>
                             
                             {/* Requested By */}
                             <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase">
                                <div className="flex items-center gap-1 group cursor-help relative w-fit">
                                    Requested By
                                    <Info className="w-3 h-3 text-gray-400" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl z-20 font-normal normal-case">
                                        <span className="font-bold text-blue-200">Initiator:</span> Validates need, prepares justification, and triggers workflow.
                                    </div>
                                </div>
                             </th>

                             {/* Flow Arrow Header (Empty) */}
                             <th className="w-8 py-4"></th>

                             {/* Approved By */}
                             <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase">
                                <div className="flex items-center gap-1 group cursor-help relative w-fit">
                                    Approved By
                                    <Info className="w-3 h-3 text-gray-400" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 bg-gray-900 text-white text-[10px] p-2 rounded shadow-xl z-20 font-normal normal-case">
                                         <span className="font-bold text-green-200">Authority:</span> Accountable for risk acceptance, budget compliance, and final sign-off.
                                    </div>
                                </div>
                             </th>

                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Execution Owner</th>
                             <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {DECISIONS.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr className={`hover:bg-gray-50 dark:bg-[#050505] transition-colors group cursor-pointer ${expandedRows[item.id] ? 'bg-blue-50/30' : ''}`} onClick={() => toggleRow(item.id)}>
                                    <td className="px-6 py-4 align-top">
                                       <div className="flex flex-col">
                                          <div className="flex items-center gap-2 mb-1">
                                             <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-blue transition-colors">{item.title}</span>
                                             {expandedRows[item.id] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                          </div>
                                          
                                          {/* Impact Summary (New) */}
                                          <div className="flex flex-wrap gap-2 mb-2">
                                              {item.impact_summary.map((impact, idx) => (
                                                  <span key={idx} className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200">
                                                      {impact}
                                                  </span>
                                              ))}
                                          </div>

                                          <div className="flex items-center gap-2 mt-1">
                                              <span className="text-[10px] text-gray-400 font-mono">{item.id}</span>
                                              <span className="text-[10px] text-gray-400">•</span>
                                              <span className="text-[10px] text-gray-500">{item.date}</span>
                                          </div>
                                       </div>
                                    </td>
                                    
                                    <td className="px-4 py-4 align-top">
                                       <div className="flex flex-col">
                                          <span className="text-sm font-bold text-gray-900 dark:text-white">{item.requested_by.name}</span>
                                          <span className="text-xs text-gray-500">{item.requested_by.role}</span>
                                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-1 w-fit border ${
                                              item.requested_by.org === 'Kangqore' ? 'bg-blue-50 dark:bg-blue-900/20 text-brand-blue border-blue-100' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 border-purple-100'
                                          }`}>
                                              {item.requested_by.org}
                                          </span>
                                       </div>
                                    </td>

                                    {/* Visual Flow Arrow */}
                                    <td className="w-8 py-4 align-middle text-center">
                                        <ArrowRight className="w-4 h-4 text-gray-300 mx-auto" />
                                    </td>

                                    <td className="px-4 py-4 align-top">
                                       <div className="flex flex-col">
                                          <span className="text-sm font-bold text-gray-900 dark:text-white">{item.approved_by.name}</span>
                                          <span className="text-xs text-gray-500">{item.approved_by.role}</span>
                                          <div className="flex items-center gap-2">
                                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase mt-1 w-fit border ${
                                                  item.approved_by.org === 'Kangqore' ? 'bg-blue-50 dark:bg-blue-900/20 text-brand-blue border-blue-100' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 border-purple-100'
                                              }`}>
                                                  {item.approved_by.org}
                                              </span>
                                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 px-1.5 py-0.5 rounded uppercase mt-1 border border-gray-200">
                                                  {item.approved_by.type}
                                              </span>
                                          </div>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{item.execution_owner.name}</span>
                                            <span className="text-xs text-gray-500">{item.execution_owner.type}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 align-top text-center">
                                       {item.status === 'Approved' ? (
                                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                               <CheckCircle className="w-3 h-3" /> Approved
                                           </span>
                                       ) : (
                                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                               <Clock className="w-3 h-3" /> Pending
                                           </span>
                                       )}
                                    </td>
                                </tr>

                                {/* Expanded Audit Trail Row */}
                                {expandedRows[item.id] && (
                                    <tr className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 border-b border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <td colSpan="6" className="px-6 pb-6 pt-2">
                                            {/* Decision Consequence Model (Gap 7) */}
                                            {/* Decision Consequence Model (Refined Narrative) */}
                                            {(item.impact.time || item.impact.cost || item.impact.risk) && (
                                                <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Brain className="w-5 h-5 text-brand-blue" />
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Decision Consequence Preview</h4>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Approval Scenario */}
                                                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-3 rounded-md border border-slate-100 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                                <span className="text-xs font-bold text-green-700 uppercase">If Approved</span>
                                                            </div>
                                                            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                                                                Approving this decision will 
                                                                {item.impact.time && <span className="font-bold text-amber-700"> push the timeline by {item.impact.time}</span>}
                                                                {item.impact.time && item.impact.cost && <span> and </span>}
                                                                {item.impact.cost && <span className="font-bold text-slate-900 dark:text-white"> impact the budget by {item.impact.cost}</span>}
                                                                .
                                                            </p>
                                                        </div>

                                                        {/* Rejection Scenario (Inferred) */}
                                                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-3 rounded-md border border-slate-100 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                                <span className="text-xs font-bold text-red-700 uppercase">If Rejected</span>
                                                            </div>
                                                            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                                                                {item.impact?.risk === 'HIGH' || item.impact?.risk === 'CRITICAL' 
                                                                    ? "Rejection maintains the current high-risk state and may delay subsequent milestones."
                                                                    : "Rejection will require an alternative approach to be formulated, potentially pausing dependent tasks."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
                                                
                                                {/* Left: Rationale & Context */}
                                                <div className="space-y-4">
                                                    
                                                    {/* Transparency Layer: Rationale */}
                                                    {item.rationale && (
                                                        <div className="bg-blue-50 dark:bg-blue-900/20/50 p-3 rounded-lg border border-blue-100">
                                                            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                                <Brain className="w-3 h-3" /> Decision Rationale
                                                            </h4>
                                                            <p className="text-sm text-blue-950 font-medium italic">
                                                                "{item.rationale}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Transparency Layer: Trade-offs */}
                                                    {item.tradeoffs && (
                                                        <div>
                                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Trade-offs Considered</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 pl-3">
                                                                {item.tradeoffs}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Description</h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                                                    </div>
                                                    
                                                    {/* Governance Framework (New Enterprise Layer) */}
                                                    <div className="pt-3 border-t border-gray-100">
                                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2 flex items-center gap-1">
                                                            <Shield className="w-3 h-3 text-brand-blue" /> Governance Framework
                                                        </h4>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">Authority Source</span>
                                                                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{item.authority_source}</span>
                                                            </div>
                                                            
                                                            {/* Acknowledgement Action */}
                                                            {item.status === 'Approved' && !item.acknowledgedAt && (
                                                            <button 
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        const token = localStorage.getItem('token');
                                                                        await fetch(`${BACKEND_URL}/api/decisions/${item.id}/acknowledge`, { // Using BACKEND_URL constant if available, else relative
                                                                            method: 'POST',
                                                                            headers: { Authorization: `Bearer ${token}` }
                                                                        });
                                                                        // Optimistic update or refetch needed here
                                                                        // For now, simple alert or toast
                                                                        alert("Decision Acknowledged");
                                                                    } catch (err) { console.error(err); }
                                                                }}
                                                                className="px-3 py-1.5 bg-brand-gradient text-white text-xs font-bold rounded shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="w-3 h-3" /> Acknowledge
                                                            </button>
                                                            )}

                                                            {item.acknowledgedAt && (
                                                                <div className="text-right">
                                                                     <span className="text-[10px] text-green-600 uppercase font-bold block flex items-center gap-1 justify-end">
                                                                        <CheckCircle className="w-3 h-3" /> Acknowledged
                                                                     </span>
                                                                     <span className="text-[10px] text-gray-400">
                                                                        by {item.acknowledgedBy} on {new Date(item.acknowledgedAt).toLocaleDateString()}
                                                                     </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Audit Artifacts */}
                                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg p-4 border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                                        <Lock className="w-3 h-3 text-gray-400" /> Audit Trail Artifacts
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {isLoading ? <p className="text-xs text-gray-400">Loading context...</p> : (
                                                            <>
                                                                {/* Context Threading: Decision -> Risk */}
                                                                {item.risk ? (
                                                                    <div className="flex items-center justify-between text-sm group/item">
                                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                            <Shield className="w-4 h-4 text-orange-500" />
                                                                            <span>Mitigates Risk</span>
                                                                        </div>
                                                                        <a href="/dashboard/client/risks" className="text-brand-blue hover:underline text-xs flex items-center gap-1 font-medium bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                                                                            {item.risk.title} <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                                                                        <Shield className="w-4 h-4 text-gray-300" /> No linked risk
                                                                    </div>
                                                                )}

                                                                {/* Context Threading: Decision -> Change Request */}
                                                                {item.changeRequest ? (
                                                                    <div className="flex items-center justify-between text-sm group/item">
                                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                            <GitCommit className="w-4 h-4 text-purple-500" />
                                                                            <span>Mandates Change</span>
                                                                        </div>
                                                                        <a href="/dashboard/client/change-requests" className="text-brand-blue hover:underline text-xs flex items-center gap-1 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded border border-purple-100">
                                                                            {item.changeRequest.title} <ExternalLink className="w-3 h-3" />
                                                                        </a>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                                                                        <GitCommit className="w-4 h-4 text-gray-300" /> No linked change
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex justify-center">
                 <button className="text-sm font-medium text-gray-500 hover:text-brand-blue transition-colors">View All Decisions History</button>
            </div>
        </div>

      </div>
  );

  if (isTabContent) return content;

  return (
    <DashboardLayout role="client" title="Decision Log" subtitle="Traceability of all strategic and technical approvals">
      {content}
    </DashboardLayout>
  );
};

export default ClientDecisions;
