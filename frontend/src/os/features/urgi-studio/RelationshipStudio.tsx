import React, { useState } from 'react';
import { 
  HeartbeatIcon, 
  BrainIcon, 
  ClockCounterClockwiseIcon, 
  ScalesIcon,
  ChartBarIcon,
  UsersIcon
} from '@phosphor-icons/react';
import { cn } from '@design-system/cn';

export default function RelationshipStudio() {
  const [activeTab, setActiveTab] = useState('LIVE_SESSIONS');

  const TABS = [
    { id: 'LIVE_SESSIONS', label: 'Live Sessions', icon: UsersIcon },
    { id: 'DIGITAL_TWIN', label: 'Digital Twin', icon: BrainIcon },
    { id: 'EVIDENCE_LEDGER', label: 'Evidence Ledger', icon: ChartBarIcon },
    { id: 'REPLAY_ENGINE', label: 'Replay Engine', icon: ClockCounterClockwiseIcon },
    { id: 'GOVERNANCE', label: 'Governance', icon: ScalesIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--os-bg)] text-[var(--os-text-1)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--os-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartbeatIcon weight="duotone" className="w-8 h-8 text-pink-500" />
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">Relationship Studio</h1>
            <p className="text-sm text-[var(--os-text-2)]">URGI Platform Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-400">Production (Shadow Mode)</span>
          </div>
          <div className="px-3 py-1 bg-[var(--os-border)] rounded text-xs font-mono">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Nav */}
        <nav className="w-64 border-r border-[var(--os-border)] p-4 flex flex-col gap-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left",
                activeTab === tab.id 
                  ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" 
                  : "text-[var(--os-text-2)] hover:bg-[var(--os-border)] hover:text-white"
              )}
            >
              <tab.icon weight={activeTab === tab.id ? 'fill' : 'regular'} className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* View Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {activeTab === 'LIVE_SESSIONS' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Live Sessions</h2>
                <p className="text-[var(--os-text-2)]">Monitor active interactions flowing through the URGI pipeline in real-time.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-[var(--os-border)] bg-[#111115] shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                          <span className="text-xs font-mono text-blue-400">Visitor_849{i}</span>
                        </div>
                        <span className="text-xs text-[var(--os-text-3)]">Active</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--os-text-2)]">Trust Score</span>
                          <span className="text-green-400 font-bold">7{i}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--os-text-2)]">Maturity</span>
                          <span className="text-white">{10 * i + 40}%</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-[var(--os-border)] hover:bg-pink-500/20 hover:text-pink-400 text-sm font-medium rounded transition-colors">
                        View Digital Twin
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'DIGITAL_TWIN' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Relationship Digital Twin</h2>
                <p className="text-[var(--os-text-2)]">Search and view the unified relationship profile for any visitor.</p>
                <div className="p-12 border border-[var(--os-border)] border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                  <BrainIcon weight="duotone" className="w-16 h-16 text-[var(--os-text-3)] mb-4" />
                  <h3 className="text-lg font-medium">Select a visitor to view their Twin</h3>
                  <p className="text-sm text-[var(--os-text-2)] mt-2">The twin visualizes Memory, Identity, and Adaptive Personality models.</p>
                </div>
              </div>
            )}

            {activeTab === 'EVIDENCE_LEDGER' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Evidence Ledger</h2>
                <p className="text-[var(--os-text-2)]">Immutable timeline of verified and unverified facts.</p>
                {/* Mock Table */}
                <div className="w-full border border-[var(--os-border)] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#1a1a20]">
                      <tr>
                        <th className="px-4 py-3 font-medium text-[var(--os-text-2)]">Timestamp</th>
                        <th className="px-4 py-3 font-medium text-[var(--os-text-2)]">Visitor</th>
                        <th className="px-4 py-3 font-medium text-[var(--os-text-2)]">Fact Key</th>
                        <th className="px-4 py-3 font-medium text-[var(--os-text-2)]">Confidence</th>
                        <th className="px-4 py-3 font-medium text-[var(--os-text-2)]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--os-border)] bg-[#111115]">
                      {[
                        { t: '10:42 AM', v: 'Visitor_8491', k: 'Role', c: '95%', s: 'VERIFIED' },
                        { t: '10:45 AM', v: 'Visitor_8492', k: 'Budget', c: '40%', s: 'HYPOTHESIS' },
                        { t: '11:01 AM', v: 'Visitor_8491', k: 'Company', c: '99%', s: 'VERIFIED' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[var(--os-border)]/50 transition-colors">
                          <td className="px-4 py-3 text-[var(--os-text-2)] font-mono text-xs">{row.t}</td>
                          <td className="px-4 py-3 font-mono text-xs text-blue-400">{row.v}</td>
                          <td className="px-4 py-3 font-medium">{row.k}</td>
                          <td className="px-4 py-3 text-[var(--os-text-2)]">{row.c}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-1 text-xs font-bold rounded",
                              row.s === 'VERIFIED' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                            )}>
                              {row.s}
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Replay Engine</h2>
                <p className="text-[var(--os-text-2)]">Simulate historical events against new models without affecting production.</p>
                <div className="p-8 bg-[#111115] border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <ClockCounterClockwiseIcon className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-medium">Start a Simulation</h3>
                      <p className="text-sm text-[var(--os-text-2)]">Select an event timeframe to replay through Shadow Mode.</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded shadow transition-colors">
                    Initialize Replay Queue
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'GOVERNANCE' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Governance & Policy Engine</h2>
                <p className="text-[var(--os-text-2)]">Manage data retention, consent flags, and PII restrictions.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#111115] border border-[var(--os-border)] rounded-xl">
                    <h3 className="text-lg font-medium text-red-400 mb-2">Restricted Fields</h3>
                    <ul className="list-disc list-inside text-[var(--os-text-2)] space-y-1">
                      <li>Social Security Number</li>
                      <li>Health Conditions</li>
                      <li>Political Affiliations</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-[#111115] border border-[var(--os-border)] rounded-xl">
                    <h3 className="text-lg font-medium text-green-400 mb-2">Consent Status</h3>
                    <p className="text-[var(--os-text-2)]">All incoming traffic is implicitly opted-in for internal URGI scoring.</p>
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
