import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Link as LinkIcon,
  Shield
} from 'lucide-react';

import { useClientRisks } from '../../../hooks/useDashboardData';

const ClientRisks = () => {
  const { data: risks, isLoading, error } = useClientRisks();
  // Ensure we map any missing defaults if backend creates them empty
  const RISKS = (risks || []).map(r => ({
      ...r,
      riskOwner: r.riskOwner || (r.owner ? r.owner.toUpperCase() : 'SHARED'), // Fallback to legacy owner if needed
      trend: r.trend || 'STABLE'
  }));

  const [selectedRisk, setSelectedRisk] = React.useState(null);
  const [signature, setSignature] = React.useState('');
  const [note, setNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (isLoading) return (
     <DashboardLayout role="client" title="Risks & Dependencies" subtitle="Active tracking of impediments and external blockers">
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        </div>
     </DashboardLayout>
  );

  if (error) return (
     <DashboardLayout role="client" title="Risks & Dependencies" subtitle="Active tracking of impediments and external blockers">
        <div className="p-8 text-center text-red-500">
            Failed to load risks. Please try again later.
        </div>
     </DashboardLayout>
  );

  const handleOpenAccept = (risk) => {
    setSelectedRisk(risk);
    setSignature('');
    setNote('');
  };

  const handleAcceptRisk = async () => {
    if (!signature.trim()) return alert('Please sign to accept');
    setIsSubmitting(true);
    try {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/risks/${selectedRisk.id}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ signature, note })
        });
        window.location.reload(); // Simple reload to refresh state
    } catch (e) {
        console.error(e);
        alert('Failed to accept risk');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="client" title="Risks & Dependencies" subtitle="Active tracking of impediments and external blockers">
      <div className="space-y-8">

        {/* Premium Header Summary */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gradient opacity-5 rounded-bl-[100px] transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10">
                 <div>
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-brand-gradient tracking-tight mb-1">Current Risk Exposure</h3>
                    <p className="text-sm text-gray-500 font-medium">Real-time health assessment of project delivery</p>
                 </div>
                 <span className="mt-4 md:mt-0 px-4 py-1.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider border border-gray-100 shadow-sm">
                    Calculated: Today
                 </span>
             </div>
             
             {/* Modern Progress Bar */}
             <div className="flex h-4 rounded-full overflow-hidden mb-8 bg-gray-100 dark:bg-[#0a0a0c] p-1">
                 <div className="flex-1 h-full rounded-l-full bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all hover:brightness-110 relative group/bar" title="Critical">
                    <div className="absolute inset-0 bg-white dark:bg-black/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                 </div>
                 <div className="flex-1 h-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all hover:brightness-110 relative group/bar" title="Warning">
                    <div className="absolute inset-0 bg-white dark:bg-black/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                 </div>
                 <div className="flex-[3] h-full rounded-r-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all hover:brightness-110 relative group/bar" title="Stable">
                    <div className="absolute inset-0 bg-white dark:bg-black/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20/50 border border-red-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-red-100/50">
                     <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-3xl font-black text-red-600 leading-none mb-1">{RISKS.filter(r => r.severity === 'Critical' && r.status === 'OPEN').length}</p>
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Critical Blockers</p>
                     </div>
                 </div>
                 <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100/50">
                     <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <AlertCircle className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-3xl font-black text-amber-600 leading-none mb-1">{RISKS.filter(r => r.severity === 'High' && r.status === 'OPEN').length}</p>
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">At Risk</p>
                     </div>
                 </div>
                 <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100/50">
                     <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <Shield className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-3xl font-black text-emerald-600 leading-none mb-1">{RISKS.filter(r => r.status === 'ACCEPTED' || r.status === 'MITIGATED').length}</p>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Mitigated</p>
                     </div>
                 </div>
             </div>
        </div>

        {/* Modal */}
        {selectedRisk && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
                    <button onClick={() => setSelectedRisk(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Formal Risk Acceptance</h3>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Governance Record</p>
                        </div>
                    </div>

                    <div className="p-5 bg-amber-50/80 border border-amber-100 rounded-2xl mb-6 text-sm text-amber-900 leading-relaxed shadow-sm">
                        By signing this, you acknowledge the risk <strong className="text-amber-700">"{selectedRisk.title}"</strong> and accept full accountability for its potential impact on the project timeline, budget, and deliverables.
                    </div>
                    
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Mitigation Note (Optional)</label>
                            <textarea 
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                rows="3"
                                placeholder="e.g. We will monitor traffic... (Enter details)"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Digital Signature</label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={signature}
                                    onChange={e => setSignature(e.target.value)} 
                                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-gray-200 rounded-xl font-script text-2xl text-gray-800 dark:text-gray-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:font-sans placeholder:text-sm placeholder:text-gray-400"
                                    placeholder="Type your full name to sign"
                                    style={{ fontFamily: 'cursive' }}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-500 font-bold uppercase">
                                    Official
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 ml-1 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Digital signature is legally binding for project governance.
                            </p>
                        </div>
                        <button 
                            onClick={handleAcceptRisk}
                            disabled={isSubmitting || !signature}
                            className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:from-black hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] mt-2"
                        >
                            {isSubmitting ? 'Processing Acceptance...' : 'Sign & Accept Risk'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Split Views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Client Owned Risks */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-8 py-6 border-b border-gray-100 bg-red-50 dark:bg-red-900/20/40 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Client Attention Required
                        </h3>
                        <p className="text-xs text-red-600/80 mt-1 font-medium">Blockers assigned to your team</p>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-black uppercase tracking-wide shadow-sm">Action Needed</span>
                </div>
                <div className="divide-y divide-gray-50 flex-1">
                    {RISKS.filter(r => r.owner === 'CLIENT').map(risk => (
                        <div key={risk.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505]/80 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border shadow-sm ${
                                        risk.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                        risk.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                        'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 border-gray-100'
                                    }`}>
                                        {risk.severity} Severity
                                    </span>
                                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-500 shadow-sm">
                                        Tasks
                                    </span>
                                </div>
                                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                                    risk.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {risk.status}
                                </span>
                            </div>
                            
                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-red-600 transition-colors">{risk.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{risk.description}</p>
                            
                            {/* Mitigation Plan Visibility */}
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl text-xs border border-gray-100">
                                <p className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1.5">
                                    <Shield className="w-3 h-3 text-gray-400" />
                                    Required Mitigation:
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                                    "{risk.mitigationPlan || "No specific mitigation plan recorded yet."}"
                                </p>
                            </div>

                            {/* Actions Area */}
                            <div className="flex flex-col gap-3">
                                {risk.riskOwner === 'CLIENT' && !risk.clientAcceptedAt && (
                                    <div className="w-full">
                                        {risk.clientResponse ? (
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs border border-blue-100 flex items-start gap-3">
                                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 mt-0.5">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-blue-900 mb-0.5">Response Logged</p>
                                                    <p className="text-blue-700 leading-snug">{risk.clientResponse}</p>
                                                    <span className="text-[10px] text-blue-400 mt-1 block font-mono">
                                                        {new Date(risk.clientResponseAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    const response = prompt("Log your mitigation action or response:");
                                                    if (response) {
                                                        // In a real app, use a proper modal. For MVP quick action:
                                                        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/risks/${risk.id}/response`, {
                                                            method: 'POST',
                                                            headers: { 
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                            },
                                                            body: JSON.stringify({ response })
                                                        }).then(() => window.location.reload());
                                                    }
                                                }}
                                                className="w-full py-2.5 text-xs text-brand-blue font-bold border border-blue-100 rounded-xl hover:bg-blue-50 dark:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span>+ Log Mitigation Response</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                                
                                {risk.status === 'ACCEPTED' ? (
                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                                        <div className="p-1.5 bg-emerald-100 rounded-full text-emerald-600">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-emerald-900 font-bold">
                                                Risk Formally Accepted
                                            </p>
                                            <p className="text-[10px] text-emerald-700 font-script opacity-80 mt-0.5">
                                                By: {risk.acceptanceSignature || risk.clientAcceptedBy}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleOpenAccept(risk)}
                                        className="w-full py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-2 border-red-100 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:shadow-sm transition-all uppercase tracking-wide flex items-center justify-center gap-2 group/btn"
                                    >
                                        <AlertTriangle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        Review & Accept Risk
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {RISKS.filter(r => r.owner === 'CLIENT').length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center h-64">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 text-emerald-500 shadow-sm">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">All Clear!</h4>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                No critical blockers assigned to your team. You're up to date.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Shared & Kangqore Risks */}
            <div className="space-y-8 h-full flex flex-col">
                
                {/* SHARED RISKS */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1">
                    <div className="px-8 py-6 border-b border-gray-100 bg-purple-50 dark:bg-purple-900/20/40 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-purple-600" />
                                Shared Responsibility
                            </h3>
                            <p className="text-xs text-purple-600/80 mt-1 font-medium">Joint mitigation efforts</p>
                        </div>
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black uppercase tracking-wide shadow-sm">Collaboration</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {RISKS.filter(r => r.owner === 'SHARED').map(risk => (
                            <div key={risk.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            risk.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                            risk.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 border-gray-100'
                                        }`}>
                                            {risk.severity}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-700 border border-purple-100">
                                            Owner: Shared
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">{risk.status}</span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">{risk.title}</h4>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{risk.description}</p>
                                {/* Shared Mitigation Plan */}
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20/30 rounded-lg text-xs border border-purple-100/50 flex gap-2">
                                    <LinkIcon className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-purple-900 mb-0.5">Joint Plan:</p>
                                        <p className="text-purple-800 leading-relaxed">
                                            {risk.mitigationPlan || "Joint mitigation strategy defined in weekly steerco."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {RISKS.filter(r => r.owner === 'SHARED').length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-sm italic">
                                No active shared risks.
                            </div>
                        )}
                    </div>
                </div>

                {/* KANGQORE RISKS */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1">
                    <div className="px-8 py-6 border-b border-gray-100 bg-brand-blue/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-brand-blue" />
                                Kangqore Responsibility
                            </h3>
                            <p className="text-xs text-brand-blue/80 mt-1 font-medium">Internal blockers we are resolving</p>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-brand-blue px-3 py-1 rounded-full font-black uppercase tracking-wide shadow-sm">Monitoring</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {RISKS.filter(r => r.owner === 'KANGQORE' || (!r.owner && r.owner !== 'CLIENT')).map(risk => (
                            <div key={risk.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            risk.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                            risk.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 border-gray-100'
                                        }`}>
                                            {risk.severity}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            Owner: Kangqore
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">{risk.status}</span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">{risk.title}</h4>
                                <p className="text-xs text-gray-500">{risk.description}</p>
                            </div>
                        ))}
                        {RISKS.filter(r => r.owner === 'KANGQORE' || (!r.owner && r.owner !== 'CLIENT')).length === 0 && (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3 text-brand-blue/50">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <p className="font-medium text-gray-600 dark:text-gray-400 text-sm">Delivery is on track.</p>
                                <p className="text-xs text-gray-400 mt-1">No Kangqore-owned blockers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ClientRisks;
