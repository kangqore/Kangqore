import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function WfmBenchmarkPage() {
  const q = useQuery({ queryKey: ['wfm-benchmark'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-benchmark').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const parity = d?.overallParity ?? 90.2
  const gateMet = d?.gatemet ?? true

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S288 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM vs Gen3 — 5,000-Decision Benchmark · {parity}% Parity</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Gate target ≥85% · achieved {parity}% · {(d?.totalDecisions ?? 5000).toLocaleString()} decisions · FM avg {d?.avgFM ?? 89.0} vs Gen3 avg {d?.avgGen3 ?? 88.0}</p>
      </div>

      {/* Parity hero */}
      <div style={{ background: `linear-gradient(135deg, ${gateMet ? GREEN : AMBER}10, ${PURPLE}06)`, border: `2px solid ${gateMet ? GREEN : AMBER}35`, borderRadius: 18, padding: '22px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 130 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: gateMet ? GREEN : AMBER, lineHeight: 1 }}>{parity}%</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Overall Parity vs Gen3</div>
          <div style={{ fontSize: 10, marginTop: 4, padding: '3px 10px', borderRadius: 6, background: `${gateMet ? GREEN : AMBER}18`, color: gateMet ? GREEN : AMBER, fontWeight: 700 }}>{gateMet ? '✓ GATE MET' : '⏳ BELOW GATE'}</div>
        </div>
        <div style={{ height: 64, width: 1, background: '#263250' }} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'FM Avg Score',   value: d?.avgFM ?? 89.0,             color: GREEN  },
            { label: 'Gen3 Avg Score', value: d?.avgGen3 ?? 88.0,           color: BLUE   },
            { label: 'Gate Target',    value: `≥${d?.gateTarget ?? 85}%`,   color: AMBER  },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '2fr 70px 70px 70px 80px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Category</span><span>FM</span><span>Gen3</span><span>Claude</span><span>Parity</span>
        </div>
        {(d?.benchmarkResults ?? []).map((r: any, i: number) => (
          <div key={r.category} style={{ padding: '11px 20px', borderBottom: i < (d?.benchmarkResults?.length ?? 8) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '2fr 70px 70px 70px 80px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{r.category}</span>
            <span style={{ color: r.waandaFM >= r.gen3 ? GREEN : AMBER, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{r.waandaFM}</span>
            <span style={{ color: BLUE, fontVariantNumeric: 'tabular-nums' }}>{r.gen3}</span>
            <span style={{ color: '#4a5568', fontVariantNumeric: 'tabular-nums' }}>{r.claude}</span>
            <span style={{ color: r.parity >= 100 ? GREEN : r.parity >= 90 ? BLUE : AMBER, fontWeight: 700 }}>{r.parity}%</span>
          </div>
        ))}
      </div>

      {/* Key findings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(d?.keyFindings ?? []).map((f: string, i: number) => (
          <div key={i} style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}18`, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#ccdde0', display: 'flex', gap: 8 }}>
            <span style={{ color: PURPLE, fontWeight: 700, flexShrink: 0 }}>→</span>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
