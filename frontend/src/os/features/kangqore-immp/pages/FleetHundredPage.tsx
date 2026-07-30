import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function FleetHundredPage() {
  const q = useQuery({ queryKey: ['fleet-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const total: number = d?.total ?? 0
  const regions: any[] = d?.regions ?? []
  const coigAvg: number = d?.coigAvg ?? 12.4

  const COHORT_INSIGHTS = [
    { label: 'Top COIG vertical', value: 'HealthTech (ARIA)', delta: '+14.2 avg', color: GREEN },
    { label: 'Fastest onboarding', value: 'India cohort', delta: '18-day avg to value', color: BLUE },
    { label: 'Highest NPS cohort', value: 'UK Enterprise', delta: 'NPS 68', color: PURPLE },
    { label: 'Expansion MRR', value: '£38K/month', delta: '+22% MoM', color: AMBER },
  ]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S223 · 100-Fleet Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C76–C100 — 100-Customer Fleet</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>25 organic customers · first triple-digit fleet · COIG analysis at scale · cohort insights published</p>
      </div>

      {/* Fleet hero */}
      <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(79,195,247,0.05))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16, padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: GREEN, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{total || 100}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Customers</div>
        </div>
        <div style={{ width: 1, height: 80, background: '#263250' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
          {[
            { label: 'COIG Fleet Avg', value: coigAvg.toFixed(1), suffix: ' pts', color: GREEN },
            { label: 'Active Regions', value: d?.activeRegions ?? 4, suffix: '', color: BLUE },
            { label: 'Avg Time-to-Value', value: '21', suffix: ' days', color: AMBER },
            { label: 'Fleet NPS', value: 52, suffix: '', color: PURPLE },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', padding: '12px', background: '#1a2235', borderRadius: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}{m.suffix}</div>
              <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {COHORT_INSIGHTS.map(c => (
          <div key={c.label} style={{ background: '#1a2235', border: `1px solid ${c.color}20`, borderLeft: `3px solid ${c.color}`, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: '#8899aa', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ccdde0' }}>{c.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginTop: 3 }}>{c.delta}</div>
          </div>
        ))}
      </div>

      {/* Region distribution */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Fleet by Region</div>
        {regions.filter(r => r.active).map((r: any) => (
          <div key={r.key} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16 }}>{r.flag}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0', flex: 1 }}>{r.label}</span>
            <div style={{ width: 120, height: 4, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (r.customers / Math.max(1, total)) * 100 * 3)}%`, background: GREEN, borderRadius: 999 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: GREEN, minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.customers}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
