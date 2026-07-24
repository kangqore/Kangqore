import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const PURPLE = '#a78bfa', GREEN = '#10b981', AMBER = '#f59e0b'

export function Gen4EvalPage() {
  const qc = useQueryClient()
  const resultsQ = useQuery({ queryKey: ['gen4-evals'], queryFn: () => api.get('/admin/kangqore-immp/gen4/eval/results').then(r => r.data), staleTime: 30_000 })
  const jobsQ    = useQuery({ queryKey: ['training-jobs'], queryFn: () => api.get('/admin/kangqore-immp/gen4/training/jobs').then(r => r.data), staleTime: 60_000 })
  const evalM = useMutation({
    mutationFn: (trainingJobId: string) => api.post('/admin/kangqore-immp/gen4/eval/run', { trainingJobId }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen4-evals'] }),
  })
  const results: any[] = resultsQ.data ?? []
  const completedJobs: any[] = (jobsQ.data ?? []).filter((j: any) => j.status === 'COMPLETED' && !results.find(r => r.trainingJobId === j.id))
  const latest = results[0]

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: latest?.passedThreshold ? 'rgba(16,185,129,0.06)' : 'rgba(167,139,250,0.06)', border: `1px solid ${latest?.passedThreshold ? 'rgba(16,185,129,0.2)' : 'rgba(167,139,250,0.2)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BarChart3 style={{ width: 28, height: 28, color: PURPLE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S162 — Gen4 Evaluation Suite</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>500 held-out decisions · accuracy / latency / cost vs Claude Gen1 · parity score ≥ 80% target</div>
        </div>
        {latest && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: latest.passedThreshold ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{(latest.parityScore * 100).toFixed(1)}%</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Parity Score</div>
          </div>
        )}
      </div>

      {completedJobs.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1, marginBottom: 12 }}>Run Evaluation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {completedJobs.map((j: any) => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: T1, flex: 1 }}>{j.jobRef} · {j.baseModel} · loss {j.trainLoss}</span>
                <button onClick={() => evalM.mutate(j.id)} disabled={evalM.isPending} style={{ padding: '7px 16px', borderRadius: 8, background: PURPLE, color: '#fff', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {evalM.isPending ? 'Evaluating…' : 'Run Eval'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Evaluation Results</div>
          {results.map((r: any, i: number) => (
            <div key={r.id} style={{ padding: '16px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                {r.passedThreshold ? <CheckCircle2 style={{ width: 16, height: 16, color: GREEN }} /> : <XCircle style={{ width: 16, height: 16, color: AMBER }} />}
                <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{r.trainingJob?.jobRef ?? 'Eval'}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: r.passedThreshold ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: r.passedThreshold ? GREEN : AMBER, border: `1px solid ${r.passedThreshold ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                  {r.passedThreshold ? 'PASSED' : 'BELOW TARGET'}
                </span>
                <span style={{ fontSize: 10, color: T2, marginLeft: 'auto' }}>{r.evalSetSize} decisions evaluated</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {[
                  { label: 'Gen4 Accuracy', value: `${r.gen4Accuracy}%`, color: PURPLE },
                  { label: 'Claude Accuracy', value: `${r.claudeAccuracy}%`, color: '#3b82f6' },
                  { label: 'Parity Score', value: `${(r.parityScore * 100).toFixed(1)}%`, color: r.passedThreshold ? GREEN : AMBER },
                  { label: 'Cost Reduction', value: r.gen4CostPerInference ? `-${(((r.claudeCostPerInference - r.gen4CostPerInference) / r.claudeCostPerInference) * 100).toFixed(0)}%` : '—', color: GREEN },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              {r.gen4AvgLatencyMs && (
                <div style={{ marginTop: 8, fontSize: 11, color: T2 }}>
                  Latency — Gen4: {r.gen4AvgLatencyMs.toFixed(0)}ms · Claude: {r.claudeAvgLatencyMs?.toFixed(0)}ms
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {completedJobs.length === 0 && results.length === 0 && (
        <div style={{ padding: '24px', textAlign: 'center', color: T2, fontSize: 13 }}>
          Complete a training job (S160–S161) to run evaluation.
        </div>
      )}
    </div>
  )
}
