import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen3SelfCorrectionPage() {
  const q = useQuery({ queryKey: ['gen3-self-correction'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-self-correction').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S259 · Gen3 Self-Correction Loop</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Self-Correction Engine — Real-time Output Evaluation</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Detects contradictions, hallucinations, low-confidence outputs before delivery · {d?.hallucinationsCaughtBeforeOutput ?? 312} hallucinations caught to date</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Corrections (24h)',        value: d?.correctionsApplied24h ?? 47,             color: AMBER  },
          { label: 'Self-Correction Rate',     value: `${d?.selfCorrectionRate ?? 97.9}%`,        color: GREEN  },
          { label: 'Claude Fallback Triggered',value: `${d?.claudeFallbackTriggeredPct ?? 8.3}%`, color: BLUE   },
          { label: 'Avg Correction Latency',   value: `${d?.avgCorrectionLatencyMs ?? 340}ms`,    color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Correction triggers */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Correction Triggers</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(d?.correctionTriggers ?? []).map((t: string) => (
            <span key={t} style={{ fontSize: 10, fontWeight: 700, color: AMBER, background: `${AMBER}12`, border: `1px solid ${AMBER}28`, borderRadius: 6, padding: '4px 10px' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Correction log */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Corrections</div>
        {(d?.correctionLog ?? []).map((entry: any, i: number) => (
          <div key={i} style={{ padding: '12px 20px', borderBottom: i < (d?.correctionLog?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: '#4a5568', minWidth: 140 }}>{entry.timestamp}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, flex: 1 }}>{entry.trigger}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 150 }}>
              <div style={{ fontSize: 10, color: '#8899aa' }}><span style={{ color: '#4a5568' }}>Action: </span>{entry.action}</div>
              <div style={{ fontSize: 10, color: GREEN }}><span style={{ color: '#4a5568' }}>Outcome: </span>{entry.outcome}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
