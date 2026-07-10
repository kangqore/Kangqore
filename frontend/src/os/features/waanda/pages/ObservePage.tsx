import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
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

const surface  = '#ffffff'
const border   = '1px solid rgba(37,100,234,0.10)'

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
      <div style={{ background: surface, border, borderRadius: 12, padding: '16px 20px' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className={S.label} style={{ marginBottom: 4 }}>Governance Pulse · AEGIS</div>
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{ background: `${verdictColor(verdictLabel)}20`, color: verdictColor(verdictLabel) }}
              >
                {verdictLabel === 'ALL_PASS'       ? 'CLEAR'      :
                 verdictLabel === 'WARN_ISSUES'    ? 'MONITORING' :
                 verdictLabel === 'CRITICAL_ISSUES' ? 'ATTENTION'  :
                 verdictLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-2xl font-light" style={{ color: '#f43f5e' }}>{critical24h}</div>
              <div className={S.muted} style={{ fontSize: 11 }}>critical 24h</div>
            </div>
            <div>
              <div className="text-2xl font-light" style={{ color: '#f59e0b' }}>{warn24h}</div>
              <div className={S.muted} style={{ fontSize: 11 }}>warnings 24h</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KIMMP intelligence feed */}
      {activeInsights.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">KIMMP Intelligence</div>
            <span className="text-[11px] text-slate-400">{activeInsights.length} active</span>
          </div>
          <div className="space-y-2">
            {activeInsights.map(insight => (
              <div
                key={insight.id}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: `${PRIORITY_COLOR[insight.priority]}08`, border: `1px solid ${PRIORITY_COLOR[insight.priority]}20` }}
              >
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{ background: `${PRIORITY_COLOR[insight.priority]}20`, color: PRIORITY_COLOR[insight.priority] }}
                >
                  {insight.priority.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-700 leading-snug">{insight.title}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">{insight.summary}</div>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{insight.module}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Two-column: signals + sessions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Signal feed */}
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className={S.label}>Enterprise Signals</div>
            <span className={S.muted} style={{ fontSize: 11 }}>last 20</span>
          </div>

          {signals.isLoading ? (
            <div className={S.muted}>Loading signals…</div>
          ) : signalList.length === 0 ? (
            <div className={S.muted}>No signals yet. WAANDA is watching.</div>
          ) : (
            <div className="space-y-2" style={{ maxHeight: 340, overflowY: 'auto' }}>
              {signalList.map((sig: any, i: number) => (
                <div
                  key={sig.id ?? i}
                  className="flex items-start gap-3 py-2"
                  style={{ borderBottom: i < signalList.length - 1 ? '1px solid rgba(37,100,234,0.08)' : 'none' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: severityColor(sig.severity) }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700 truncate">{sig.signalValue ?? sig.title ?? 'Signal'}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px]" style={{ color: severityColor(sig.severity) }}>
                        {sig.severity ?? 'LOW'}
                      </span>
                      <span className="text-[11px] text-slate-400">{sig.sourceModule ?? sig.module ?? ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live visitor perceptions */}
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className={S.label}>Active Perceptions</div>
            <span className={S.muted} style={{ fontSize: 11 }}>{sessionList.length} visitors</span>
          </div>

          {sessions.isLoading ? (
            <div className={S.muted}>Loading perceptions…</div>
          ) : sessionList.length === 0 ? (
            <div className={S.muted}>No active visitors right now. WAANDA is ready to perceive.</div>
          ) : (
            <div className="space-y-2" style={{ maxHeight: 340, overflowY: 'auto' }}>
              {sessionList.map((s: any, i: number) => (
                <div
                  key={s.id ?? i}
                  className="flex items-center gap-3 py-2"
                  style={{ borderBottom: i < sessionList.length - 1 ? '1px solid rgba(37,100,234,0.08)' : 'none' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                    style={{ background: `rgba(37,100,234,0.10)`, color: '#2564ea' }}
                  >
                    {s.trustScore ?? 0}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-700 truncate">
                      {s.name ? s.name : 'Anonymous visitor'}
                      {s.company && <span className="text-slate-500"> · {s.company}</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{s.lastAction ?? 'No intent recorded'}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
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
