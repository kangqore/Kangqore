import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useKIMMPStore } from '@store/kimmp'

const surface = '#ffffff'
const border  = '1px solid rgba(37,100,234,0.10)'

function priorityColor(p: string) {
  if (!p) return '#6b7280'
  const u = p.toUpperCase()
  if (u === 'CRITICAL') return '#f43f5e'
  if (u === 'HIGH')     return '#f59e0b'
  if (u === 'MEDIUM')   return '#2564ea'
  return '#6b7280'
}

export function DecidePage() {
  const insights        = useKIMMPStore(s => s.insights)
  const acknowledgedIds = useKIMMPStore(s => s.acknowledgedIds)

  const decisionQueue = useMemo(() =>
    insights
      .filter(i => i.type !== 'predictive' && !acknowledgedIds.includes(i.id))
      .filter(i => i.priority === 'critical' || i.priority === 'high')
      .slice(0, 6),
    [insights, acknowledgedIds]
  )

  const history = useQuery({
    queryKey:  ['waanda-history'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/history').then(r => r.data),
    staleTime: 30_000,
  })

  const records: any[] = history.data?.history ?? []
  const latest    = records[0]
  const synthesis: string = latest?.summary ?? ''
  const alerts: any[]    = latest?.alerts ?? []
  const systems: any[] = records.slice(0, 4)

  return (
    <div className="space-y-8">

      {/* ── KIMMP decision queue */}
      {decisionQueue.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">
              KIMMP Decision Queue
            </div>
            <span className="text-[11px] text-slate-400">{decisionQueue.length} requiring decision</span>
          </div>
          <div className="space-y-2.5">
            {decisionQueue.map(insight => (
              <div
                key={insight.id}
                className="p-3 rounded-xl"
                style={{ background: 'rgba(37,100,234,0.03)', border: `1px solid ${priorityColor(insight.priority)}25` }}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="text-sm font-medium text-slate-700 leading-snug">
                    {insight.title}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${priorityColor(insight.priority)}20`, color: priorityColor(insight.priority) }}
                  >
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">{insight.summary}</div>
                {insight.action && (
                  <div className="mt-2 flex gap-2 text-[12px]">
                    <span style={{ color: '#2564ea' }}>→</span>
                    <span className="text-slate-600">{insight.action}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WAANDA's governing synthesis */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 24 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
          WAANDA's Reasoning
        </div>

        {history.isLoading ? (
          <div className="text-sm text-slate-500">Loading reasoning…</div>
        ) : synthesis ? (
          <>
            {alerts.length > 0 && (
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
                style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}
              >
                <span>⚠</span>
                <span>{alerts[0]}</span>
              </div>
            )}
            <p className="text-lg font-light leading-relaxed text-slate-800">
              {synthesis}
            </p>
          </>
        ) : (
          <div className="text-sm text-slate-400">
            WAANDA hasn't reasoned yet. Trigger a cognitive cycle from the{' '}
            <span className="text-[#2564ea]">Act</span> workspace.
          </div>
        )}
      </div>

      {/* System reasoning breakdown */}
      {systems.length > 0 && (
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-3">
            Reasoning Evidence
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys: any, i: number) => (
              <div
                key={sys.id ?? i}
                style={{ background: surface, border, borderRadius: 12, padding: 18 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{sys.system ?? sys.trigger ?? `Run ${i + 1}`}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: `${priorityColor(sys.priority)}20`, color: priorityColor(sys.priority) }}
                    >
                      {sys.priority}
                    </span>
                  </div>
                  {sys.confidence !== undefined && (
                    <span className="text-xs text-slate-400">{sys.confidence}% confident</span>
                  )}
                </div>

                <p className="text-sm text-slate-500 mb-3 leading-relaxed">{sys.summary}</p>

                {(sys.keyFindings ?? []).length > 0 && (
                  <div className="space-y-1 mb-2">
                    {(sys.keyFindings as string[]).slice(0, 3).map((f, j) => (
                      <div key={j} className="flex gap-2 text-[12px] text-slate-500">
                        <span style={{ color: '#10b981' }}>›</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(sys.recommendations ?? []).length > 0 && (
                  <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(37,100,234,0.08)' }}>
                    <div className="text-[10px] text-slate-400 mb-1">Recommendations</div>
                    {(sys.recommendations as string[]).slice(0, 2).map((r, j) => (
                      <div key={j} className="flex gap-2 text-[12px] text-slate-500">
                        <span style={{ color: '#2564ea' }}>→</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
