import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Activity, ShieldAlert, Zap, Server, Brain,
  TrendingUp, ActivitySquare, Shield, Check, X,
  Edit2
} from 'lucide-react';
import { api } from '@lib/api';
import { Spinner } from '@design-system/components/Spinner';
import { EvidenceExplorer } from '../components/EvidenceExplorer';
import { ReasoningExplorer } from '../components/ReasoningExplorer';
import { GraphHealth } from '../components/GraphHealth';
import { getSocket, connectSocket } from '../../../lib/socket';

export function WaandaMissionControl() {
  const queryClient = useQueryClient();

  const { data: missionControl, isLoading: loadingMission } = useQuery({
    queryKey: ['hcip-mission-control'],
    queryFn: () => api.get('/admin/hcip/mission-control').then(r => r.data),
    refetchInterval: 5000,
  });

  const { data: queueData, isLoading: loadingQueue } = useQuery({
    queryKey: ['hcip-recommendation-queue'],
    queryFn: () => api.get('/admin/hcip/recommendation-queue').then(r => r.data),
    refetchInterval: 5000,
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: any) => api.post('/admin/hcip/feedback', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hcip-recommendation-queue'] });
    },
  });

  const [urgentAlerts, setUrgentAlerts] = useState<any[]>([]);

  useEffect(() => {
    try { connectSocket(); } catch {}
    const socket = getSocket();

    const handleAgentUpdate = (agent: any) => {
      if (agent.status === 'ERROR') {
        setUrgentAlerts(prev => {
          if (prev.find(a => a.agentId === agent.id)) return prev;
          
          // Audibly announce the anomaly via the reliable backend TTS endpoint
          try {
            const audio = new Audio(`/api/admin/kangqore-immp/tts?text=${encodeURIComponent(`Urgent signal detected. Agent ${agent.id} has encountered a critical anomaly.`)}`);
            audio.play().catch(e => console.warn('[WAANDA Urgent Alert Audio Blocked]', e));
          } catch (e) {
            console.warn('[WAANDA TTS Error]', e);
          }

          return [...prev, { 
            id: Date.now(), 
            agentId: agent.id, 
            message: `URGENT SIGNAL: Agent ${agent.id} entered ERROR state. Neural loop broken.`, 
            time: new Date().toLocaleTimeString() 
          }];
        });
      } else if (agent.status === 'IDLE' || agent.status === 'WORKING') {
         setUrgentAlerts(prev => prev.filter(a => a.agentId !== agent.id));
      }
    };

    socket.on('AGENT_UPDATED', handleAgentUpdate);
    return () => {
      socket.off('AGENT_UPDATED', handleAgentUpdate);
    };
  }, []);

  if (loadingMission || loadingQueue) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const metrics = missionControl?.metrics || {};
  const trends = missionControl?.trends || {};
  const alerts = missionControl?.alerts || [];
  const queue = queueData?.queue || [];

  return (
    <div className="space-y-6">
      {/* 0. Urgent System Signals (Real-time Socket Telemetry) */}
      {urgentAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {urgentAlerts.map(alert => (
            <div key={alert.id} className="relative overflow-hidden rounded-xl bg-red-950/40 border-2 border-red-500/50 p-5 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse">
              <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none mix-blend-overlay" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <ShieldAlert className="w-6 h-6 text-red-500 animate-[spin_3s_linear_infinite]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black tracking-widest text-red-400 uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Critical Anomaly Detected
                  </h3>
                  <p className="text-red-200 mt-1 font-mono text-xs">{alert.message}</p>
                  <p className="text-red-500/50 mt-1 font-mono text-[10px]">TIME: {alert.time} // WAANDA IS MONITORING RECOVERY PROTOCOLS</p>
                </div>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg text-xs transition-colors" onClick={() => setUrgentAlerts(prev => prev.filter(a => a.id !== alert.id))}>
                  ACKNOWLEDGE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. Mission Status */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          <ActivitySquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Mission Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise Intelligence Operating System
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Total Visitors" value={metrics.totalVisitors} trend="Active Sessions" icon={Activity} />
        <MetricCard title="Enterprise Prospects" value={metrics.enterpriseProspects} trend={trends.enterpriseProspects} icon={Brain} color="#7c3aed" />
        <MetricCard title="High Intent" value={metrics.highIntent} trend="Ready for Sales" icon={TrendingUp} color="#059669" />
        <MetricCard title="Pricing Shock" value={metrics.pricingShock} trend={trends.pricingShock} icon={Zap} color="#e11d48" />
      </div>

      {/* 2. Alert Center */}
      {alerts.length > 0 && (
        <div className="rounded-xl p-4 bg-rose-500/10 border border-rose-500/20 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-rose-500 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Critical Alerts
          </h3>
          {alerts.map((alert: any) => (
            <div key={alert.id} className="text-sm text-white font-medium pl-6">
              • {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* 3. Business Objectives */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
        <h3 className="text-xs font-bold text-[var(--os-text-3)] uppercase mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Active Business Objectives
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white">Increase Enterprise Conversions</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>
            </div>
            <p className="text-xs text-slate-400">Targeting VP/Director personas in active evaluation.</p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-white">Reduce Pricing Shock</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">Active</span>
            </div>
            <p className="text-xs text-slate-400">Intercepting users frustrated by unlisted pricing.</p>
          </div>
        </div>
      </div>

      {/* 4. Priority Queue */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
        <h3 className="text-xs font-bold text-[var(--os-text-3)] uppercase mb-4 flex items-center gap-2">
          <Server className="w-4 h-4" /> Priority Operator Queue
        </h3>
        
        {queue.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No high-priority recommendations waiting.
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] flex items-start gap-4 transition-all hover:border-indigo-500/30">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Priority {item.recommendation.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Objective: {item.recommendation.objective}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">Action: {item.recommendation.suggestedAction || 'Review Context'}</h4>
                  <p className="text-sm text-slate-400 mt-1">{item.recommendation.reason}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => feedbackMutation.mutate({
                      recommendationId: item.recommendation.id,
                      visitorId: item.session.visitorId,
                      sessionId: item.session.sessionId,
                      operatorId: 'operator-1', // Mock
                      engineVersion: item.recommendation.engineVersion,
                      action: 'approve'
                    })}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold border border-emerald-500/20 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button 
                    onClick={() => feedbackMutation.mutate({
                      recommendationId: item.recommendation.id,
                      visitorId: item.session.visitorId,
                      sessionId: item.session.sessionId,
                      operatorId: 'operator-1', // Mock
                      engineVersion: item.recommendation.engineVersion,
                      action: 'modify'
                    })}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold border border-amber-500/20 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Modify
                  </button>
                  <button 
                    onClick={() => feedbackMutation.mutate({
                      recommendationId: item.recommendation.id,
                      visitorId: item.session.visitorId,
                      sessionId: item.session.sessionId,
                      operatorId: 'operator-1', // Mock
                      engineVersion: item.recommendation.engineVersion,
                      action: 'reject'
                    })}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold border border-rose-500/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Live Intelligence / Explorer */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <GraphHealth />
          <EvidenceExplorer sessions={missionControl?.sessions || []} />
        </div>
        <div className="col-span-2">
          {/* We pass a mock or selected session ID to ReasoningExplorer. For now we use the first active session if available, or 'mock' */}
          <ReasoningExplorer sessionId={missionControl?.sessions?.[0]?.sessionId || ''} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color = "#6366f1" }: any) {
  return (
    <div className="p-4 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{title}</div>
        <div className="text-[11px] text-slate-400 mt-1">{trend}</div>
      </div>
    </div>
  );
}
