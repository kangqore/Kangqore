import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const surface = 'rgba(255,255,255,0.04)'
const border  = '1px solid rgba(255,255,255,0.08)'

function priorityColor(p: string) {
  if (!p) return '#6b7280'
  const u = p.toUpperCase()
  if (u === 'CRITICAL') return '#f43f5e'
  if (u === 'HIGH')     return '#f59e0b'
  if (u === 'MEDIUM')   return '#2564ea'
  return '#6b7280'
}

export function DecidePage() {
  const history = useQuery({
    queryKey:  ['waanda-history'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/history').then(r => r.data),
    staleTime: 30_000,
  })

  // Backend returns { history: [...] } where each item is one system dispatch record
  const records: any[] = history.data?.history ?? []
  // Most recent record drives the synthesis text; all recent records are the "reasoning evidence"
  const latest    = records[0]
  const synthesis: string = latest?.summary ?? ''
  const alerts: any[]    = latest?.alerts ?? []
  // Each record IS one system's reasoning — show last 4 runs as reasoning evidence
  const systems: any[] = records.slice(0, 4)

  return (
    <div className="space-y-8">

      {/* WAANDA's governing synthesis */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 24 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
          WAANDA's Reasoning
        </div>

        {history.isLoading ? (
          <div className="text-sm text-white/40">Loading reasoning…</div>
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
            <p className="text-lg font-light leading-relaxed" style={{ color: 'rgba(226,232,240,0.85)' }}>
              {synthesis}
            </p>
          </>
        ) : (
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            WAANDA hasn't reasoned yet. Trigger a cognitive cycle from the{' '}
            <span className="text-[#2564ea]">Act</span> workspace.
          </div>
        )}
      </div>

      {/* System reasoning breakdown */}
      {systems.length > 0 && (
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-3">
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
                    <span className="text-sm font-medium text-white/70">{sys.system ?? sys.trigger ?? `Run ${i + 1}`}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: `${priorityColor(sys.priority)}20`, color: priorityColor(sys.priority) }}
                    >
                      {sys.priority}
                    </span>
                  </div>
                  {sys.confidence !== undefined && (
                    <span className="text-xs text-white/35">{sys.confidence}% confident</span>
                  )}
                </div>

                <p className="text-sm text-white/50 mb-3 leading-relaxed">{sys.summary}</p>

                {(sys.keyFindings ?? []).length > 0 && (
                  <div className="space-y-1 mb-2">
                    {(sys.keyFindings as string[]).slice(0, 3).map((f, j) => (
                      <div key={j} className="flex gap-2 text-[12px] text-white/45">
                        <span style={{ color: '#10b981' }}>›</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(sys.recommendations ?? []).length > 0 && (
                  <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="text-[10px] text-white/25 mb-1">Recommendations</div>
                    {(sys.recommendations as string[]).slice(0, 2).map((r, j) => (
                      <div key={j} className="flex gap-2 text-[12px] text-white/40">
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
