import React, { useState, useEffect } from 'react';
import { 
  HeartbeatIcon, 
  BrainIcon, 
  ClockCounterClockwiseIcon, 
  ScalesIcon,
  ChartBarIcon,
  UsersIcon,
  FingerprintIcon,
  DatabaseIcon,
  PulseIcon,
  CrosshairIcon,
  CircleNotchIcon,
  CheckCircleIcon
} from '@phosphor-icons/react';
import { cn } from '@design-system/cn';
import {
  fetchLiveSessions, fetchEvidenceLedger, fetchDigitalTwin,
  triggerReplayQueue, updateGovernance,
  LiveSession, EvidenceRow, DigitalTwin
} from './urgiService';

export default function RelationshipStudio() {
  const [activeTab, setActiveTab] = useState('LIVE_SESSIONS');
  
  // Data States
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
  
  // Form/UI States
  const [twinId, setTwinId] = useState('');
  const [twinData, setTwinData] = useState<DigitalTwin | null>(null);
  const [twinLoading, setTwinLoading] = useState(false);
  
  const [replayStart, setReplayStart] = useState('');
  const [replayEnd, setReplayEnd] = useState('');
  const [replayStatus, setReplayStatus] = useState('');

  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  useEffect(() => {
    if (activeTab === 'LIVE_SESSIONS') {
      loadSessions();
    } else if (activeTab === 'EVIDENCE_LEDGER') {
      loadEvidence();
    }
  }, [activeTab]);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const data = await fetchLiveSessions();
      setSessions(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingSessions(false);
  };

  const loadEvidence = async () => {
    setLoadingEvidence(true);
    try {
      const data = await fetchEvidenceLedger();
      setEvidence(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingEvidence(false);
  };
  
  const handleAnalyzeTwin = async () => {
    if (!twinId) return;
    setTwinLoading(true);
    try {
      const data = await fetchDigitalTwin(twinId);
      setTwinData(data);
    } catch (e) {
      console.error(e);
    }
    setTwinLoading(false);
  };

  const handleInitReplay = async () => {
    if (!replayStart || !replayEnd) return;
    try {
      const res = await triggerReplayQueue(replayStart, replayEnd);
      setReplayStatus(res.message || 'Simulation Started');
      setTimeout(() => setReplayStatus(''), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfigurePolicies = async () => {
    try {
      await updateGovernance('REVIEW_POLICIES');
      alert('Policies updated successfully via Governance Engine!');
    } catch (e) {
      console.error(e);
    }
  };

  const TABS = [
    { id: 'LIVE_SESSIONS', label: 'Live Sessions', icon: PulseIcon },
    { id: 'DIGITAL_TWIN', label: 'Digital Twin', icon: BrainIcon },
    { id: 'EVIDENCE_LEDGER', label: 'Evidence Ledger', icon: ChartBarIcon },
    { id: 'REPLAY_ENGINE', label: 'Replay Engine', icon: ClockCounterClockwiseIcon },
    { id: 'GOVERNANCE', label: 'Governance', icon: ScalesIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 text-slate-800 relative overflow-hidden font-sans">
      {/* Background Ambient FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
      </div>

      {/* Header */}
      <header className="px-8 py-5 border-b border-slate-200 flex items-center justify-between relative z-10 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl border border-pink-100">
            <HeartbeatIcon weight="duotone" className="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">URGI — Relationship Intelligence</h1>
            <p className="text-sm font-semibold text-blue-600/80 uppercase tracking-widest mt-0.5">WAANDA · Understand Stage</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-green-600 rounded-full shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]"></span>
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">Production (Shadow Mode)</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 text-white rounded font-mono text-xs font-medium">
            v1.2.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Sidebar Nav */}
        <nav className="w-72 border-r border-slate-200 bg-white/60 backdrop-blur-xl p-6 flex flex-col gap-3 relative">
          <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase mb-2 pl-2">System Modules</div>
          
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-100 text-white shadow-md font-bold" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-transparent font-medium"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500"></div>
                )}
                <tab.icon weight={isActive ? 'duotone' : 'regular'} className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive ? "text-white scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn("tracking-wide", isActive ? "text-white" : "")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* View Area */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out]">
            
            {activeTab === 'LIVE_SESSIONS' && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Live Sessions</h2>
                    <p className="text-slate-500 text-sm">Monitor active interactions flowing through the URGI pipeline in real-time.</p>
                  </div>
                  <button 
                    onClick={loadSessions}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-sm">
                    <CircleNotchIcon className={cn("w-4 h-4 text-white", loadingSessions && "animate-spin")} />
                    Syncing Stream
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.length === 0 && !loadingSessions && (
                     <div className="col-span-full py-12 text-center text-slate-500">No active sessions found.</div>
                  )}
                  {sessions.map(session => (
                    <div key={session.id} className="group p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
                      
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 rounded-2xl border border-blue-100">
                            <FingerprintIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-blue-600 font-bold tracking-widest uppercase">ID: {session.id}</span>
                            <div className="text-slate-900 font-semibold text-sm">Unknown Visitor</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-green-600 text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-2xl flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          {session.status}
                        </span>
                      </div>
                      
                      <div className="space-y-4 mb-6 relative z-10">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trust Score</span>
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-500">{session.trustScore}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000" style={{ width: `${session.trustScore}%` }}></div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Maturity Level</span>
                            <span className="text-lg text-slate-900 font-bold">{session.maturityLevel}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${session.maturityLevel}%` }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                           setActiveTab('DIGITAL_TWIN');
                           setTwinId(session.id);
                        }}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 group/btn">
                        <CrosshairIcon className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-300" />
                        View Digital Twin
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'DIGITAL_TWIN' && (
              <div className="space-y-8 h-full flex flex-col">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Relationship Digital Twin</h2>
                  <p className="text-slate-500 text-sm">Search and view the unified relationship profile for any visitor.</p>
                </div>
                
                <div className="flex gap-3 shadow-sm max-w-2xl">
                    <input 
                      type="text" 
                      value={twinId}
                      onChange={(e) => setTwinId(e.target.value)}
                      placeholder="Enter Visitor ID or Identity hash..." 
                      className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono" 
                    />
                    <button 
                      onClick={handleAnalyzeTwin}
                      disabled={!twinId || twinLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {twinLoading && <CircleNotchIcon className="w-4 h-4 animate-spin text-white" />}
                      Analyze
                    </button>
                </div>

                {!twinData ? (
                  <div className="flex-1 p-12 border border-slate-200 bg-white/60 backdrop-blur-sm border-dashed rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="p-6 bg-blue-50 rounded-full mb-6 border border-blue-100 shadow-sm">
                      <BrainIcon weight="duotone" className="w-20 h-20 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Select a visitor to view their Twin</h3>
                    <p className="text-sm text-slate-500 max-w-md">The digital twin visualizes Memory, Identity, and Adaptive Personality models derived from raw interaction events.</p>
                  </div>
                ) : (
                  <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
                       <div>
                         <h3 className="text-2xl font-bold text-slate-900 mb-1">{twinData.identity}</h3>
                         <p className="text-slate-500 font-mono text-sm">Visitor ID: {twinData.id}</p>
                       </div>
                       <div className="flex gap-4 text-center">
                          <div className="bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-md border border-emerald-500">
                             <div className="text-xs font-bold uppercase tracking-wider mb-1 text-emerald-100">Trust</div>
                             <div className="text-xl font-bold">{twinData.trustScore}</div>
                          </div>
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md border border-blue-500">
                             <div className="text-xs font-bold uppercase tracking-wider mb-1 text-blue-100">Maturity</div>
                             <div className="text-xl font-bold">{twinData.maturity}</div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><DatabaseIcon className="w-5 h-5 text-indigo-500" /> Relationship Facts</h4>
                         <ul className="space-y-3">
                           {(twinData.recentFacts ?? []).map((fact, idx) => (
                             <li key={idx} className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 text-sm font-medium text-white shadow-sm">
                               <CheckCircleIcon className="w-4 h-4 text-green-400" />
                               {fact}
                             </li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BrainIcon className="w-5 h-5 text-pink-500" /> Behavioral Traits</h4>
                         <div className="flex flex-wrap gap-2">
                           {(twinData.behavioralTraits ?? []).length === 0 ? (
                             <span className="text-sm text-slate-400 italic">No inferred traits yet</span>
                           ) : (twinData.behavioralTraits ?? []).map((trait, idx) => (
                             <span key={idx} className="px-3 py-1.5 bg-pink-600 text-white text-sm font-bold rounded-2xl shadow-sm border border-pink-500">
                               {trait}
                             </span>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'EVIDENCE_LEDGER' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Evidence Ledger</h2>
                  <p className="text-slate-500 text-sm">Immutable timeline of verified and unverified facts.</p>
                </div>
                
                <div className="w-full border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-md">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Timestamp</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Visitor</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Fact Key</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Confidence</th>
                        <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingEvidence && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading evidence...</td></tr>
                      )}
                      {evidence.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{new Date(row.timestamp).toLocaleTimeString()}</td>
                          <td className="px-6 py-4 font-mono font-semibold text-blue-600">{row.visitor}</td>
                          <td className="px-6 py-4 font-medium text-slate-800">{row.factKey}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs text-slate-500 w-8">{row.confidence}%</span>
                              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${row.confidence}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-2xl text-white shadow-sm",
                              row.status === 'VERIFIED' ? "bg-green-600" : 
                              row.status === 'HYPOTHESIS' ? "bg-amber-500" :
                              "bg-indigo-600"
                            )}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'REPLAY_ENGINE' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Replay Engine</h2>
                  <p className="text-slate-500 text-sm">Simulate historical events against new models without affecting production.</p>
                </div>
                <div className="p-10 bg-white border border-indigo-100 rounded-3xl relative overflow-hidden group hover:border-indigo-300 transition-colors shadow-sm hover:shadow-md">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-100 transition-all duration-700"></div>
                  
                  <div className="flex items-start gap-6 mb-8 relative z-10">
                    <div className="p-4 bg-indigo-600 rounded-2xl border border-indigo-500 shadow-sm">
                      <ClockCounterClockwiseIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Start a Simulation</h3>
                      <p className="text-slate-600 leading-relaxed max-w-xl">Replay historical Visitor Interactions through the new URGI logic pipeline in isolated <span className="text-white font-mono font-semibold bg-indigo-600 px-2 py-0.5 rounded shadow-sm">SHADOW</span> mode to measure diffs before promoting to Production.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 max-w-xl">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                       <input 
                         type="datetime-local" 
                         value={replayStart}
                         onChange={(e) => setReplayStart(e.target.value)}
                         className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                       <input 
                         type="datetime-local"
                         value={replayEnd}
                         onChange={(e) => setReplayEnd(e.target.value)} 
                         className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm" 
                       />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <button 
                      onClick={handleInitReplay}
                      disabled={!replayStart || !replayEnd}
                      className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <DatabaseIcon weight="bold" />
                      Initialize Replay Queue
                    </button>
                    {replayStatus && <span className="text-sm font-semibold text-green-600">{replayStatus}</span>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'GOVERNANCE' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Governance & Policy Engine</h2>
                  <p className="text-slate-500 text-sm">Manage data retention, consent flags, and PII restrictions.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-8 bg-white border border-red-100 rounded-3xl relative overflow-hidden group hover:border-red-200 hover:shadow-md transition-all shadow-sm">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-full blur-3xl group-hover:bg-red-100 transition-colors"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                       <div className="p-2 bg-red-50 rounded-2xl border border-red-100">
                         <ScalesIcon className="w-6 h-6 text-red-600" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900">Restricted Fact Keys</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-6 relative z-10">Facts with these semantic keys will be blocked by the Memory Governor and will not enter the Evidence Ledger.</p>
                    
                    <ul className="space-y-3 relative z-10">
                      {['Social Security Number', 'Health Conditions', 'Political Affiliations', 'Credit Card Information'].map(item => (
                        <li key={item} className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                           <span className="text-white font-semibold text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="p-8 bg-white border border-emerald-100 rounded-3xl relative overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all shadow-sm">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                       <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <FingerprintIcon className="w-6 h-6 text-emerald-600" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900">Consent Engine</h3>
                    </div>
                    
                    <div className="bg-emerald-600 border border-emerald-500 rounded-2xl p-5 mb-6 relative z-10 shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"></div>
                        <div>
                           <h4 className="font-bold text-white mb-1">Implicit Opt-In Active</h4>
                           <p className="text-sm text-emerald-100 leading-relaxed font-medium">All incoming traffic is currently implicitly opted-in for internal URGI scoring. Explicit cookie consent is not required for anonymous profile building.</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleConfigurePolicies}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all"
                    >
                      Configure Policies
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
