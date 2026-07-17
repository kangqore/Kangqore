import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { useKIMMPStore } from '@store/kimmp'

const surface = '#ffffff'
const border  = '1px solid rgba(37,100,234,0.10)'

function phaseColor(status: string) {
  if (status === 'ok')    return '#10b981'
  if (status === 'warn')  return '#f59e0b'
  if (status === 'error') return '#f43f5e'
  return '#6b7280'
}

export function LearnPage() {
  const qc = useQueryClient()

  const insights        = useKIMMPStore(s => s.insights)
  const acknowledgedIds = useKIMMPStore(s => s.acknowledgedIds)
  const allMemory       = useKIMMPStore(s => s.memoryEntries)

  const W = { critical: 20, high: 8, medium: 3, low: 1 } as Record<string, number>

  const healthScore = useMemo(() => {
    const active = insights.filter(i => i.type !== 'predictive' && !acknowledgedIds.includes(i.id))
    return Math.max(0, Math.min(100, 100 - active.reduce((s, i) => s + (W[i.priority] ?? 0), 0)))
  }, [insights, acknowledgedIds])

  const memoryEntries = useMemo(() => allMemory.slice(0, 8), [allMemory])

  const learning = useQuery({
    queryKey:  ['waanda-learning'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/learning/summary').then(r => r.data),
    staleTime: 60_000,
  })

  const status = useQuery({
    queryKey:  ['waanda-status'],
    queryFn:   () => api.get('/admin/waanda/status').then(r => r.data),
    staleTime: 60_000,
  })

  const history = useQuery({
    queryKey:  ['waanda-history-learn'],
    queryFn:   () => api.get('/admin/kangqore-immp/systems/history').then(r => r.data),
    staleTime: 30_000,
  })

  const feedback = useMutation({
    mutationFn: ({ id, verdict }: { id: string; verdict: string }) =>
      api.post(`/admin/kangqore-immp/systems/dispatch/${id}/feedback`, { verdict }),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['waanda-history-learn'] }) },
  })

  const examples = useQuery({
    queryKey:  ['learning-examples-recent'],
    queryFn:   () => api.get('/admin/kangqore-immp/learning/examples?limit=5').then(r => r.data),
    staleTime: 60_000,
  })

  const phases: any[]     = status.data?.phases ?? []
  const learningData: any = learning.data
  const briefings: any[]  = (history.data?.history ?? []).slice(0, 5)
  const exampleList: any[] = examples.data?.examples ?? examples.data ?? []

  const okPhases  = phases.filter(p => p.status === 'ok').length
  const capacity  = phases.length > 0 ? Math.round((okPhases / phases.length) * 100) : 0

  const summaryObj: Record<string, any> = learningData?.summary ?? {}
  const systems: any[] = Object.entries(summaryObj).map(([systemId, data]: [string, any]) => ({ systemId, ...data }))

  return (
    <div className="space-y-8">

      {/* ── System health as operational capacity */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="flex items-start justify-between mb-4">
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase">
            WAANDA Operating Capacity
          </div>
          <div className="flex items-end gap-6 text-right">
            <div>
              <div
                className="text-3xl font-light"
                style={{ color: healthScore >= 80 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#f43f5e' }}
              >
                {healthScore}
              </div>
              <div className="text-xs text-slate-400">enterprise health</div>
            </div>
            <div>
              <div
                className="text-3xl font-light"
                style={{ color: capacity >= 90 ? '#10b981' : capacity >= 60 ? '#f59e0b' : '#f43f5e' }}
              >
                {capacity}%
              </div>
              <div className="text-xs text-slate-400">{okPhases} / {phases.length} phases nominal</div>
            </div>
          </div>
        </div>

        {status.isLoading ? (
          <div className="text-sm text-slate-500">Loading boot manifest…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {phases.map((p: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px]"
                style={{ background: 'rgba(37,100,234,0.03)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: phaseColor(p.status) }} />
                <span className="text-slate-500 truncate">{p.phase?.replace(/Phase \d+ · /, '') ?? p.phase}</span>
                <span className="text-slate-400 ml-auto flex-shrink-0">{p.ms}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Per-system confidence */}
      {systems.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            Reasoning Confidence
          </div>
          <div className="space-y-4">
            {systems.map((sys: any, i: number) => {
              const acceptance = sys.acceptanceRate ?? 0
              return (
                <div key={sys.systemId ?? i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{sys.systemId}</span>
                    <span className="text-sm text-slate-400">{acceptance}% confidence</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${acceptance}%`, background: '#10b981' }}
                    />
                  </div>
                  {((sys.topAgents ?? []).length > 0 || (sys.weakAgents ?? []).length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(sys.topAgents ?? []).map((a: any, j: number) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                          {a?.agentType ?? a}
                        </span>
                      ))}
                      {(sys.weakAgents ?? []).map((a: any, j: number) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                          {a?.agentType ?? a}
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

      {/* ── KIMMP memory log */}
      {memoryEntries.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            KIMMP Memory · What Was Acted On
          </div>
          <div className="space-y-1.5" style={{ maxHeight: 260, overflowY: 'auto' }}>
            {memoryEntries.map(entry => (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
                style={{ background: 'rgba(37,100,234,0.02)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: entry.action === 'acted' ? '#10b981' : '#2564ea' }}
                />
                <span className="text-slate-600 flex-1 truncate">{entry.signalTitle}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: entry.action === 'acted' ? 'rgba(16,185,129,0.12)' : 'rgba(37,100,234,0.12)',
                    color:      entry.action === 'acted' ? '#10b981' : '#2564ea',
                  }}
                >
                  {entry.action.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-300 flex-shrink-0">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Rated learning examples */}
      <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
        <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
          Learning Examples · Recent Rated
        </div>
        {examples.isLoading ? (
          <div className="text-sm text-slate-400">Loading examples…</div>
        ) : exampleList.length === 0 ? (
          <div className="text-sm text-slate-400">
            No rated examples yet. WAANDA improves as decisions receive feedback.
          </div>
        ) : (
          <div className="space-y-3">
            {exampleList.map((ex: any, i: number) => {
              const quality: string = ex.qualityLabel ?? ex.quality ?? ''
              const qualityColor =
                quality === 'excellent' || quality === 'good' ? '#10b981' :
                quality === 'poor'      || quality === 'bad'  ? '#f43f5e' :
                '#f59e0b'
              const qualityBg =
                quality === 'excellent' || quality === 'good' ? 'rgba(16,185,129,0.10)' :
                quality === 'poor'      || quality === 'bad'  ? 'rgba(244,63,94,0.10)'  :
                'rgba(245,158,11,0.10)'
              return (
                <div
                  key={ex.id ?? i}
                  className="p-4 rounded-xl space-y-2"
                  style={{ background: 'rgba(37,100,234,0.03)', border: '1px solid rgba(37,100,234,0.07)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-slate-400 truncate">
                      {ex.systemPromptPreview ?? ex.prompt?.slice(0, 60) ?? `Example ${i + 1}`}
                    </span>
                    {quality && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize"
                        style={{ background: qualityBg, color: qualityColor }}
                      >
                        {quality}
                      </span>
                    )}
                  </div>
                  {ex.outputPreview ?? ex.output ? (
                    <div className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {ex.outputPreview ?? ex.output}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400">
                    {ex.agentType && <span>{ex.agentType}</span>}
                    {ex.rating !== undefined && (
                      <span className="flex items-center gap-1">
                        Rating: <span className="font-semibold text-slate-500">{ex.rating}/5</span>
                      </span>
                    )}
                    {ex.createdAt && (
                      <span className="ml-auto">{new Date(ex.createdAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Feedback: did WAANDA get this right? */}
      {briefings.length > 0 && (
        <div style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
          <div className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4">
            Did WAANDA Get This Right?
          </div>
          <div className="space-y-3">
            {briefings.map((b: any, i: number) => (
              <div
                key={b.id ?? i}
                className="p-4 rounded-xl flex items-start justify-between gap-4"
                style={{ background: 'rgba(37,100,234,0.03)' }}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {b.summary ?? 'Briefing summary unavailable'}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
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
                          ? verdict === 'ACCEPTED'  ? 'rgba(16,185,129,0.25)'
                          : verdict === 'DISMISSED' ? 'rgba(244,63,94,0.25)'
                          : 'rgba(245,158,11,0.25)'
                          : '#f1f5f9',
                        color: b.feedback === verdict
                          ? verdict === 'ACCEPTED'  ? '#10b981'
                          : verdict === 'DISMISSED' ? '#f43f5e'
                          : '#f59e0b'
                          : '#64748b',
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
