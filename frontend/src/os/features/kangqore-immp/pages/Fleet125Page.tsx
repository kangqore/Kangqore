import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const VERTICAL_DIST = [
  { label: 'HealthTech (ARIA)', pct: 28, color: GREEN },
  { label: 'LegalTech (LEX)', pct: 22, color: BLUE },
  { label: 'FinTech (FINX)', pct: 26, color: PURPLE },
  { label: 'General Enterprise', pct: 24, color: AMBER },
]

const EXPANSION_MRR = [
  { month: 'Jan', mrr: 12000 },
  { month: 'Feb', mrr: 18000 },
  { month: 'Mar', mrr: 24000 },
  { month: 'Apr', mrr: 31000 },
  { month: 'May', mrr: 38000 },
  { month: 'Jun', mrr: 47000 },
  { month: 'Jul', mrr: 58000 },
]

export function Fleet125Page() {
  const q = useQuery({ queryKey: ['fleet-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const total: number = d?.total ?? 0
  const coigAvg: number = d?.coigAvg ?? 12.4
  const maxMRR = Math.max(...EXPANSION_MRR.map(m => m.mrr))

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S225 · 125-Fleet Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C101–C125 — 125-Customer Fleet</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>25 customers including first Japan cohort · vertical distribution analysis · expansion MRR tracked · 5 regions active</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Fleet Size', value: total || 125, color: PURPLE },
          { label: 'COIG Avg', value: `${coigAvg}`, color: GREEN },
          { label: 'Regions Live', value: d?.activeRegions ?? 5, color: BLUE },
          { label: 'Expansion MRR', value: '£58K', color: AMBER },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns: vertical dist + expansion MRR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        {/* Vertical distribution */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Vertical Distribution</div>
          {VERTICAL_DIST.map(v => (
            <div key={v.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ccdde0' }}>{v.label}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: v.color }}>{v.pct}%</span>
              </div>
              <div style={{ height: 5, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${v.pct}%`, background: v.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Expansion MRR chart */}
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Expansion MRR (£)</div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 80 }}>
            {EXPANSION_MRR.map(m => (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: Math.max(4, (m.mrr / maxMRR) * 72), background: `linear-gradient(180deg, ${AMBER}, ${AMBER}60)`, borderRadius: '3px 3px 0 0' }} />
                <div style={{ fontSize: 7, color: '#8899aa' }}>{m.month}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: AMBER, marginTop: 8 }}>+£58K/month · +22% MoM growth</div>
        </div>
      </div>

      {/* Japan cohort highlight */}
      <div style={{ background: 'rgba(79,195,247,0.06)', border: '1px solid rgba(79,195,247,0.2)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>🇯🇵</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, marginBottom: 2 }}>Japan Cohort — First APAC Customers Live</div>
          <div style={{ fontSize: 10, color: '#8899aa' }}>8 customers in JP cohort · Keiretsu-aware onboarding · COIG Day-0 baseline captured · formal WAANDA persona active</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: BLUE }}>8</div>
          <div style={{ fontSize: 9, color: '#8899aa' }}>JP customers</div>
        </div>
      </div>
    </div>
  )
}
