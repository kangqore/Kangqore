import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const surface = 'rgba(255,255,255,0.04)'
const border  = '1px solid rgba(255,255,255,0.08)'

function phaseColor(status: string) {
  if (status === 'ok')    return '#10b981'
  if (status === 'warn')  return '#f59e0b'
  if (status === 'error') return '#f43f5e'
  return '#6b7280'
}

export function LearnPage() {
  const qc = useQueryClient()

  // Per-system learning stats
  const learning = useQuery({
    queryKey:  ['waanda-learning'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/learning/summary').then(r => r.data),
    staleTime: 60_000,
  })

  // Boot manifest
  const status = useQuery({
    queryKey:  ['waanda-status'],
    queryFn:   () => api.get('/admin/waanda/status').then(r => r.data),
    staleTime: 60_000,
  })

  // Last 5 briefings for feedback
  const history = useQuery({
    queryKey:  ['waanda-history-learn'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/history').then(r => r.data),
    staleTime: 30_000,
  })

  // Feedback mutation
  const feedback = useMutation({
    mutationFn: ({ id, verdict }: { id: string; verdict: string }) =>
      api.post(`/admin/kangqore-immp/systems/dispatch/${id}/feedback`, { verdict }),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-history-learn'] }) },
  })

  const phases: any[]     = status.data?.phases ?? []
  const learningData: any = learning.data
  // Backend returns { history: [...] } — each item is one system dispatch record
  const briefings: any[]  = (history.data?.history ?? []).slice(0, 5)

  // Boot health % = phases with status 'ok' / total
  const okPhases  = phases.filter(p => p.status === 'ok').length
  const capacity  = phases.length > 0 ? Math.round((okPhases / phases.length) * 100) : 0

  // Backend returns { summary: { EQORE: {...}, LEAD_INTEL: {...}, ... } } — convert to array
  const summaryObj: Record<string, any> = learningData?.summary ?? {}
  const systems: any[] = Object.entries(summaryObj).map(([systemId, data]: [string, any]) => ({ systemId, ...data }))

  return (
    <div className="space-y-8">

      {/* ── System health as operational capacity */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">
            WAANDA Operating Capacity
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-light"
              style={{ color: capacity >= 90 ? '#10b981' : capacity >= 60 ? '#f59e0b' : '#f43f5e' }}
            >
              {capacity}%
            </div>
            <div className="text-xs text-white/35">{okPhases} / {phases.length} phases nominal</div>
          </div>
        </div>

        {status.isLoading ? (
          <div className="text-sm text-white/40">Loading boot manifest…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {phases.map((p: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px]"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: phaseColor(p.status) }} />
                <span className="text-white/50 truncate">{p.phase?.replace(/Phase \d+ · /, '') ?? p.phase}</span>
                <span className="text-white/25 ml-auto flex-shrink-0">{p.ms}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Per-system confidence */}
      {systems.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
            Reasoning Confidence
          </div>
          <div className="space-y-4">
            {systems.map((sys: any, i: number) => {
              const acceptance = sys.acceptanceRate ?? 0
              const dismissal  = sys.dismissalRate  ?? 0
              return (
                <div key={sys.systemId ?? i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/65">{sys.systemId}</span>
                    <span className="text-sm text-white/35">{acceptance}% confidence</span>
                  </div>
                  {/* Acceptance bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${acceptance}%`, background: '#10b981' }}
                    />
                  </div>
                  {/* Agent chips */}
                  {((sys.topAgents ?? []).length > 0 || (sys.weakAgents ?? []).length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(sys.topAgents as string[] ?? []).map((a: string, j: number) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                          {a}
                        </span>
                      ))}
                      {(sys.weakAgents as string[] ?? []).map((a: string, j: number) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Feedback: did WAANDA get this right? */}
      {briefings.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase mb-4">
            Did WAANDA Get This Right?
          </div>
          <div className="space-y-3">
            {briefings.map((b: any, i: number) => (
              <div
                key={b.id ?? i}
                className="p-4 rounded-xl flex items-start justify-between gap-4"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                    {b.summary ?? 'Briefing summary unavailable'}
                  </div>
                  <div className="text-[11px] text-white/25 mt-1">
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {['ACCEPTED', 'DISMISSED', 'CORRECTED'].map(verdict => (
                    <button
                      key={verdict}
                      onClick={() => feedback.mutate({ id: b.id, verdict })}
                      disabled={feedback.isPending}
                      className="px-2 py-1 rounded text-[10px] font-medium transition-colors"
                      style={{
                        background: b.feedback === verdict
                          ? verdict === 'ACCEPTED'   ? 'rgba(16,185,129,0.25)'
                          : verdict === 'DISMISSED'  ? 'rgba(244,63,94,0.25)'
                          : 'rgba(245,158,11,0.25)'
                          : 'rgba(255,255,255,0.06)',
                        color: b.feedback === verdict
                          ? verdict === 'ACCEPTED'   ? '#10b981'
                          : verdict === 'DISMISSED'  ? '#f43f5e'
                          : '#f59e0b'
                          : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {verdict === 'ACCEPTED' ? '✓' : verdict === 'DISMISSED' ? '✕' : '~'}
                      {' '}{verdict.charAt(0) + verdict.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
