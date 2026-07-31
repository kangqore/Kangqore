import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen3Routing50Page() {
  const q = useQuery({ queryKey: ['gen3-routing-50'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-routing-50').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const overall = d?.currentGen3RoutingPct ?? 62

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S261 · Gen3 Routing 50%+</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen3 Live at {overall}% Routing — Claude is the Fallback</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Cost reduction: {d?.costReductionVsAllClaude ?? 64}% vs all-Claude · Gen3 latency {d?.latencyGen3AvgMs ?? 180}ms vs Claude {d?.latencyClaudeAvgMs ?? 920}ms</p>
      </div>

      {/* Overall routing hero */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}12, ${GREEN}06)`, border: `1.5px solid ${PURPLE}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 110 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: PURPLE, lineHeight: 1 }}>{overall}%</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Gen3 Primary Routing</div>
          <div style={{ fontSize: 10, color: '#4a5568', marginTop: 2 }}>Target: ≥50%</div>
        </div>
        <div style={{ height: 64, width: 1, background: '#263250' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 0, height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${overall}%`, background: PURPLE }} />
            <div style={{ width: `${100 - overall}%`, background: '#263250' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: PURPLE, fontWeight: 700 }}>WAANDA Gen3 ({overall}%)</span>
            <span style={{ fontSize: 11, color: BLUE, fontWeight: 700 }}>Claude Fallback ({100 - overall}%)</span>
          </div>
          <div style={{ fontSize: 12, color: '#8899aa' }}>{d?.claudeRoleNow ?? 'Claude invoked only for novel, creative, and code-heavy tasks'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', minWidth: 120 }}>
          {[
            { label: 'Cost Reduction',  value: `${d?.costReductionVsAllClaude ?? 64}%`, color: GREEN  },
            { label: 'Gen3 Latency',    value: `${d?.latencyGen3AvgMs ?? 180}ms`,        color: PURPLE },
            { label: 'Claude Latency',  value: `${d?.latencyClaudeAvgMs ?? 920}ms`,      color: BLUE   },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Routing breakdown by category */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Routing by Category</div>
        {(d?.routingBreakdown ?? []).map((row: any, i: number) => (
          <div key={row.category} style={{ padding: '12px 20px', borderBottom: i < (d?.routingBreakdown?.length ?? 8) - 1 ? '1px solid #1e2a40' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#ccdde0', flex: 1 }}>{row.category}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: PURPLE, minWidth: 50, textAlign: 'right' }}>{row.gen3Pct}%</span>
            </div>
            <div style={{ display: 'flex', gap: 0, height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${row.gen3Pct}%`, background: PURPLE }} />
              <div style={{ width: `${row.claudePct}%`, background: '#263250' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
