import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Activity, Users, ShieldAlert, Cpu, Eye } from 'lucide-react'
import { api, isDemo } from '@lib/api'
import { getSocket } from '@lib/socket'
import { useKIMMPStore } from '@store/kimmp'

const S = {
  card:   'rounded-xl p-5 flex flex-col gap-3',
  label:  'text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase',
  h2:     'text-base font-semibold text-slate-800',
  muted:  'text-sm text-slate-500',
  row:    'flex items-center justify-between',
}

const surfaceClass = "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-2xl p-6 transition-all duration-300"

function severityColor(s: string) {
  if (!s) return '#6b7280'
  const u = s.toUpperCase()
  if (u === 'CRITICAL') return '#f43f5e'
  if (u === 'HIGH')     return '#f59e0b'
  if (u === 'MODERATE') return '#2564ea'
  return '#6b7280'
}

function verdictColor(v: string) {
  if (!v) return '#6b7280'
  const u = v.toUpperCase()
  if (u === 'CRITICAL' || u === 'CRITICAL_ISSUES') return '#f43f5e'
  if (u === 'WARNING'  || u === 'WARN_ISSUES')      return '#f59e0b'
  if (u === 'PASS'     || u === 'ALL_PASS')          return '#10b981'
  return '#6b7280'
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#f43f5e',
  high:     '#f59e0b',
  medium:   '#2564ea',
  low:      '#6b7280',
}

export function ObservePage() {
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)

  const storeInsights   = useKIMMPStore(s => s.insights)
  const acknowledgedIds = useKIMMPStore(s => s.acknowledgedIds)
  const activeInsights  = storeInsights
    .filter(i => i.type !== 'predictive' && !acknowledgedIds.includes(i.id))
    .slice(0, 5)

  const signals = useQuery({
    queryKey:      ['waanda-signals'],
    queryFn:       () => api.get('/admin/kangqore-immp/signals', { params: { limit: 20, sortBy: 'severity' } }).then(r => r.data),
    refetchInterval: 30_000,
    staleTime:     20_000,
  })

  const sessions = useQuery({
    queryKey:      ['waanda-live-sessions'],
    queryFn:       () => api.get('/kangqore/urgi/sessions/live').then(r => r.data),
    refetchInterval: 30_000,
    staleTime:     20_000,
  })

  const aegis = useQuery({
    queryKey:      ['waanda-aegis-summary'],
    queryFn:       () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    refetchInterval: 30_000,
    staleTime:     20_000,
  })

  useEffect(() => {
    if (isDemo()) return
    const socket = getSocket()
    socketRef.current = socket
    const refresh = () => {
      signals.refetch()
      sessions.refetch()
      aegis.refetch()
    }
    socket.on('aegis:verdict', refresh)
    socket.on('kimmp:signal',  refresh)
    return () => {
      socket.off('aegis:verdict', refresh)
      socket.off('kimmp:signal',  refresh)
    }
  }, [])

  const signalList: any[] = signals.data?.data ?? signals.data?.signals ?? []
  const sessionList: any[] = sessions.data?.data ?? []
  const aegisData: any = aegis.data

  const verdictLabel = aegisData?.overallVerdict ?? 'LOADING'
  const critical24h  = aegisData?.critical24h    ?? 0
  const warn24h      = aegisData?.warn24h        ?? 0

  return (
    <div className="space-y-8">

      {/* ── Governance pulse */}
      <div className={`${surfaceClass} animate-fade-in-up`} style={{ animationDelay: '0ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`${S.label} flex items-center gap-2 mb-2`}>
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              Governance Pulse · AEGIS
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="text-sm font-bold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2"
                style={{ background: `linear-gradient(135deg, ${verdictColor(verdictLabel)}15 0%, ${verdictColor(verdictLabel)}05 100%)`, color: verdictColor(verdictLabel), border: `1px solid ${verdictColor(verdictLabel)}30` }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: verdictColor(verdictLabel), boxShadow: `0 0 8px ${verdictColor(verdictLabel)}` }} />
                {verdictLabel === 'ALL_PASS'       ? 'CLEAR'      :
                 verdictLabel === 'WARN_ISSUES'    ? 'MONITORING' :
                 verdictLabel === 'CRITICAL_ISSUES' ? 'ATTENTION'  :
                 verdictLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-right">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-light tracking-tight" style={{ color: '#f43f5e', textShadow: '0 2px 10px rgba(244,63,94,0.2)' }}>{critical24h}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">critical 24h</div>
            </div>
            <div className="w-px h-12 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-light tracking-tight" style={{ color: '#f59e0b', textShadow: '0 2px 10px rgba(245,158,11,0.2)' }}>{warn24h}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">warnings 24h</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KIMMP intelligence feed */}
      {activeInsights.length > 0 && (
        <div className={`${surfaceClass} animate-fade-in-up`} style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div className={`${S.label} flex items-center gap-2`}><Cpu className="w-4 h-4 text-blue-500" /> KIMMP Intelligence</div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">{activeInsights.length} active</span>
          </div>
          <div className="space-y-3">
            {activeInsights.map(insight => (
              <div
                key={insight.id}
                className="flex items-start gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md cursor-default group"
                style={{ background: `linear-gradient(135deg, ${PRIORITY_COLOR[insight.priority]}05 0%, transparent 100%)`, border: `1px solid ${PRIORITY_COLOR[insight.priority]}20` }}
              >
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-md flex-shrink-0 mt-0.5 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${PRIORITY_COLOR[insight.priority]}20 0%, ${PRIORITY_COLOR[insight.priority]}10 100%)`, color: PRIORITY_COLOR[insight.priority] }}
                >
                  {insight.priority.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">{insight.title}</div>
                  <div className="text-[13px] text-slate-500 mt-1 line-clamp-1">{insight.summary}</div>
                </div>
                <span className="text-[10px] font-medium text-slate-400 flex-shrink-0 mt-0.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{insight.module}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Two-column: signals + sessions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Signal feed */}
        <div className={`${surfaceClass} animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div className={`${S.label} flex items-center gap-2`}><Activity className="w-4 h-4 text-blue-500" /> Enterprise Signals</div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">last 20</span>
          </div>

          {signals.isLoading ? (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">Loading signals…</div>
          ) : signalList.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">No signals yet. WAANDA is watching.</div>
          ) : (
            <div className="space-y-1 pr-2" style={{ maxHeight: 380, overflowY: 'auto' }}>
              {signalList.map((sig: any, i: number) => (
                <div
                  key={sig.id ?? i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 shadow-sm"
                    style={{ background: severityColor(sig.severity), boxShadow: `0 0 6px ${severityColor(sig.severity)}80` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-700 truncate">{sig.signalValue ?? sig.title ?? 'Signal'}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-1.5 rounded-sm" style={{ color: severityColor(sig.severity), background: `${severityColor(sig.severity)}15` }}>
                        {sig.severity ?? 'LOW'}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{sig.sourceModule ?? sig.module ?? ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live visitor perceptions */}
        <div className={`${surfaceClass} animate-fade-in-up`} style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div className={`${S.label} flex items-center gap-2`}><Eye className="w-4 h-4 text-blue-500" /> Active Perceptions</div>
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{sessionList.length} visitors</span>
          </div>

          {sessions.isLoading ? (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">Loading perceptions…</div>
          ) : sessionList.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">No active visitors right now. WAANDA is ready to perceive.</div>
          ) : (
            <div className="space-y-1 pr-2" style={{ maxHeight: 380, overflowY: 'auto' }}>
              {sessionList.map((s: any, i: number) => (
                <div
                  key={s.id ?? i}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm"
                    style={{ background: `linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)`, color: '#2564ea', border: '1px solid #bfdbfe' }}
                  >
                    {s.trustScore ?? 0}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {s.name ? s.name : 'Anonymous visitor'}
                      {s.company && <span className="text-slate-500 font-normal"> · {s.company}</span>}
                    </div>
                    <div className="text-[12px] text-slate-500 truncate mt-0.5">{s.lastAction ?? 'No intent recorded'}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', color: '#059669', border: '1px solid #a7f3d0' }}>
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
