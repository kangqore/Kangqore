import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

function CompBar({ label, val, color, max }: { label: string; val: number; color: string; max: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, minWidth: 60 }}>{label}</div>
      <div style={{ flex: 1, height: 8, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(val / max) * 100}%`, background: color, borderRadius: 999, transition: 'width .4s ease' }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color, minWidth: 45, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
    </div>
  )
}

export function Gen5EvalSuitePage() {
  const qc = useQueryClient()
  const evalQ = useQuery({ queryKey: ['gen5-eval-results'], queryFn: () => api.get('/admin/kangqore-immp/gen5/eval/results').then(r => r.data), staleTime: 10_000 })
  const runMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen5/eval/run', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gen5-eval-results'] }),
  })

  const results: any[] = evalQ.data?.results ?? []
  const latest = results[0]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S204 · Gen5 Evaluation Suite</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>1,000-Decision Benchmark</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gen5 vs Gen4 vs Claude · accuracy · latency · cost · chain-of-thought coherence</p>
      </div>

      {/* Run button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#8899aa' }}>
          {results.length > 0 ? `${results.length} eval run${results.length !== 1 ? 's' : ''} complete` : 'No eval runs yet — click Run Benchmark'}
        </div>
        <button onClick={() => runMut.mutate()} disabled={runMut.isPending}
          style={{ background: PURPLE, border: 'none', color: '#fff', padding: '10px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: runMut.isPending ? 0.7 : 1 }}>
          {runMut.isPending ? 'Running 1,000-decision eval…' : '⚡ Run Benchmark'}
        </button>
      </div>

      {/* Latest eval */}
      {latest && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { model: 'Gen5 (WAANDA)', accuracy: latest.gen5Accuracy, latency: latest.gen5Latency, cost: latest.gen5Cost, color: AMBER },
              { model: 'Gen4 (WAANDAx)', accuracy: latest.gen4Accuracy, latency: latest.gen4Latency, cost: latest.gen4Cost, color: BLUE },
              { model: 'Claude (Fallback)', accuracy: latest.claudeAccuracy, latency: latest.claudeLatency, cost: null, color: GREEN },
            ].map(m => (
              <div key={m.model} style={{ background: m.color + '08', border: `1px solid ${m.color}25`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: m.color, marginBottom: 12 }}>{m.model}</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: '#8899aa', marginBottom: 3 }}>Accuracy</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.accuracy}%</div>
                  {m.accuracy >= 88 && <div style={{ fontSize: 9, fontWeight: 800, color: GREEN, marginTop: 2 }}>✓ Gate parity met</div>}
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 9, color: '#8899aa' }}>Avg latency</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{m.latency}ms</div>
                  </div>
                  {m.cost != null && <div>
                    <div style={{ fontSize: 9, color: '#8899aa' }}>Cost / 1K</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>£{m.cost}</div>
                  </div>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Accuracy Comparison</div>
              <CompBar label="Gen5"   val={latest.gen5Accuracy}   color={AMBER} max={100} />
              <CompBar label="Gen4"   val={latest.gen4Accuracy}   color={BLUE}  max={100} />
              <CompBar label="Claude" val={latest.claudeAccuracy} color={GREEN} max={100} />
            </div>
            <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Latency (ms, lower = better)</div>
              <CompBar label="Gen5"   val={latest.gen5Latency}   color={AMBER} max={1200} />
              <CompBar label="Gen4"   val={latest.gen4Latency}   color={BLUE}  max={1200} />
              <CompBar label="Claude" val={latest.claudeLatency} color={GREEN} max={1200} />
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>CoT Coherence Score</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: PURPLE, fontVariantNumeric: 'tabular-nums' }}>{latest.coherenceScore}</span>
                  <span style={{ fontSize: 12, color: '#8899aa' }}>/ 100 · chain-of-thought quality</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Eval history */}
      {results.length > 1 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Eval History</div>
          {results.slice(0, 5).map((r: any) => (
            <div key={r.id} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: 11, color: '#8899aa', minWidth: 120 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0', flex: 1 }}>{r.runLabel}</div>
              <span style={{ fontSize: 12, fontWeight: 800, color: r.gen5Accuracy >= 88 ? GREEN : AMBER }}>{r.gen5Accuracy}%</span>
              <span style={{ fontSize: 11, color: '#8899aa' }}>{r.decisionCount.toLocaleString()} decisions</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
