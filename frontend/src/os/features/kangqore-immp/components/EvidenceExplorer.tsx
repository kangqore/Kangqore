import { useState } from 'react';
import { Shield, Target, User, LineChart, ChevronRight } from 'lucide-react';

export function EvidenceExplorer({ sessions = [] }: { sessions: any[] }) {
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 text-center text-slate-500">
        No active sessions to explore.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
      <h3 className="text-xs font-bold text-[var(--os-text-3)] uppercase mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4" /> Evidence Explorer
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {/* Session List */}
        <div className="col-span-1 border-r border-[var(--os-border)] pr-4 space-y-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Sessions</h4>
          {sessions.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelectedSession(s)}
              className={`w-full text-left p-3 rounded-2xl transition-colors ${selectedSession?.sessionId === s.sessionId ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-[var(--os-surface-0)] border border-[var(--os-border)] hover:border-slate-600'}`}
            >
              <div className="text-xs font-bold text-white mb-1">Visitor {s.visitorId.substring(0, 6)}</div>
              <div className="text-[10px] text-slate-400">{s.persona} • {s.decisionState}</div>
            </button>
          ))}
        </div>

        {/* Selected Session Details */}
        {selectedSession ? (
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Persona
                </h5>
                <div className="text-lg font-bold text-white">{selectedSession.persona}</div>
                <div className="text-xs text-slate-400 mt-1">Confidence: {selectedSession.confidence?.persona || 0}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5" /> Decision State
                </h5>
                <div className="text-lg font-bold text-white">{selectedSession.decisionState}</div>
                <div className="text-xs text-slate-400 mt-1">Confidence: {selectedSession.confidence?.decisionState || 0}%</div>
              </div>
            </div>

            {/* Relationship Tree */}
            <div>
              <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <LineChart className="w-3.5 h-3.5" /> Relationship Tree
              </h5>
              <div className="p-4 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm font-mono text-slate-300">
                <div className="flex flex-col gap-1">
                  <div>Visitor: {selectedSession.visitorId.substring(0, 8)}</div>
                  <div className="flex items-center gap-2 text-slate-400"><ChevronRight className="w-3 h-3" /> Persona: {selectedSession.persona}</div>
                  <div className="flex items-center gap-2 text-slate-400 ml-4"><ChevronRight className="w-3 h-3" /> State: {selectedSession.decisionState}</div>
                  <div className="flex items-center gap-2 text-slate-400 ml-8"><ChevronRight className="w-3 h-3" /> Risk: {selectedSession.riskSignals?.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>

            {/* Evidence Chain */}
            <div>
              <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Evidence Chain</h5>
              <div className="space-y-2">
                {selectedSession.reasons?.map((reason: string, i: number) => (
                  <div key={i} className="text-xs text-slate-300 p-2 rounded bg-slate-800/50 border border-slate-700/50">
                    • {reason}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Confidence Volatility */}
            <div className="p-4 rounded-2xl bg-indigo-900/20 border border-indigo-500/20">
               <h5 className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mb-1">Confidence Stability</h5>
               <div className="text-sm font-bold text-white">{selectedSession.confidence?.stability || 'High'}</div>
               {selectedSession.confidence?.stabilityReason && (
                 <div className="text-xs text-indigo-300 mt-1">{selectedSession.confidence.stabilityReason}</div>
               )}
            </div>

          </div>
        ) : (
          <div className="col-span-2 flex items-center justify-center text-sm text-slate-500">
            Select a session to explore evidence.
          </div>
        )}
      </div>
    </div>
  );
}
