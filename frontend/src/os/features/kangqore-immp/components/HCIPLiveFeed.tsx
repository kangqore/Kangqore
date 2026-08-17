import React, { useState, useEffect, useRef } from 'react';
import { api } from '@lib/api';
import { Brain, Activity, Clock, Crosshair, X } from 'lucide-react';
import { getSocket } from '../../../../lib/socket';

export function HCIPLiveFeed() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/hcip/sessions');
      // Sort by timeline length descending (most active first)
      const sorted = res.data.sessions.sort((a: any, b: any) => b.journeyTimeline.length - a.journeyTimeline.length);
      setSessions(sorted);
    } catch (e) {}
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Fallback poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handler = (data: any) => {
        // Update the sessions list with the new HCO
        setSessions(prev => {
          const idx = prev.findIndex(s => s.sessionId === data.hco.sessionId);
          const next = [...prev];
          if (idx >= 0) {
            next[idx] = data.hco;
          } else {
            next.unshift(data.hco);
          }
          return next;
        });

        // If this is the active session, append to timeline
        if (selectedSession === data.hco.sessionId) {
          setTimeline(data.hco.journeyTimeline);
          endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      };
      socket.on('hcip_event', handler);
      return () => {
        socket.off('hcip_event', handler);
      };
    }
  }, [selectedSession]);

  const openReplay = async (sessionId: string) => {
    setSelectedSession(sessionId);
    try {
      const res = await api.get(`/hcip/replay/${sessionId}`);
      setTimeline(res.data.timeline);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {}
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'ENTERPRISE_BUYER': return '#00c875';
      case 'DEVELOPER': return '#579bfc';
      case 'JOB_SEEKER': return '#7f53f9';
      default: return 'var(--os-text-2)';
    }
  };

  return (
    <div className="space-y-4">
      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map(s => (
          <div key={s.sessionId} onClick={() => openReplay(s.sessionId)} 
               className="p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
               style={{ background: 'var(--os-card)', border: `1px solid ${getPersonaColor(s.persona)}30` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[var(--os-text-2)] font-mono truncate mr-2">{s.sessionId.split('-')[0]}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: getPersonaColor(s.persona), background: `${getPersonaColor(s.persona)}15` }}>
                {s.persona.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-3.5 h-3.5" style={{ color: getPersonaColor(s.persona) }} />
              <span className="text-xs font-semibold text-[var(--os-text-1)]">{s.decisionState.replace('_', ' ')}</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-[var(--os-text-2)] mt-4">
              <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {s.confidence.overall}% Conf</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.journeyTimeline.length} events</span>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-full p-8 text-center text-[var(--os-text-2)] text-sm border border-dashed rounded-2xl" style={{ borderColor: 'var(--os-border)' }}>
            No active sessions detected on the public website.
          </div>
        )}
      </div>

      {/* Flight Recorder Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
             onClick={() => setSelectedSession(null)}>
          <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
               style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
               onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--os-border)', background: 'var(--os-card)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--os-text-1)]">WAANDA Flight Recorder</h3>
                  <p className="text-[10px] text-[var(--os-text-2)] font-mono">Session: {selectedSession}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {timeline.map((evt, i) => (
                <div key={evt.eventId || i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: evt.eventType.includes('CONFUSED') ? '#e2445c' : '#579bfc' }} />
                    {i !== timeline.length - 1 && <div className="w-px h-full my-1" style={{ background: 'var(--os-border)' }} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--os-text-1)]">{evt.eventType}</span>
                      <span className="text-[10px] text-[var(--os-text-2)]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-[var(--os-text-2)] font-mono">{evt.page}</p>
                    {evt.metadata && Object.keys(evt.metadata).length > 0 && evt.eventType !== 'PAGE_VIEW' && (
                      <pre className="mt-2 p-2 rounded-2xl text-[10px] overflow-x-auto" style={{ background: 'var(--os-card)', color: 'var(--os-text-2)' }}>
                        {JSON.stringify(evt.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
