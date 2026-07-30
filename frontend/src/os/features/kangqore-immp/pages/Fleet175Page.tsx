import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const OEM_REGIONS = [
  { partner: 'Nexus Intelligence (NOVA)', regions: ['UK', 'EU', 'India'], color: BLUE, customers: 12 },
  { partner: 'Pacific Bridge Partners', regions: ['Japan', 'ANZ'], color: AMBER, customers: 8 },
  { partner: 'LatAm Tech Alliance', regions: ['Brazil', 'Mexico'], color: GREEN, customers: 6 },
]

const MENA_PIPELINE = [
  { company: 'Dubai FinTech Hub', sector: 'FinTech', status: 'LOI signed', color: GREEN },
  { company: 'NEOM Smart City Initiative', sector: 'Enterprise', status: 'Demo stage', color: AMBER },
  { company: 'Riyadh Capital', sector: 'Finance', status: 'RFP submitted', color: BLUE },
  { company: 'Abu Dhabi Digital Authority', sector: 'GovTech', status: 'Scoping call', color: PURPLE },
]

export function Fleet175Page() {
  const q = useQuery({ queryKey: ['fleet-status'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const total: number = d?.total ?? 175
  const coigAvg: number = d?.coigAvg ?? 12.4

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S229 · 175-Fleet Milestone</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>C151–C175 — 175-Customer Fleet</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>25 customers · first LatAm cohort live · MENA pipeline building · OEM partners active in 3+ regions</p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Fleet Size', value: total || 175, color: AMBER },
          { label: 'COIG Avg', value: `+${coigAvg}`, color: GREEN },
          { label: 'Active Regions', value: 7, color: BLUE },
          { label: 'OEM Customers', value: 26, color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* OEM partner activity */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>OEM Partners — Active in 3+ Regions</div>
        {OEM_REGIONS.map(o => (
          <div key={o.partner} style={{ padding: '12px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 3 }}>{o.partner}</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {o.regions.map(r => (
                  <span key={r} style={{ fontSize: 9, padding: '1px 7px', borderRadius: 3, background: o.color + '12', color: o.color, fontWeight: 700 }}>{r}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: o.color }}>{o.customers}</div>
              <div style={{ fontSize: 9, color: '#8899aa' }}>sub-tenants</div>
            </div>
          </div>
        ))}
      </div>

      {/* MENA pipeline */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>MENA Sales Pipeline — Pre-Launch</div>
        {MENA_PIPELINE.map(p => (
          <div key={p.company} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{p.company}</div>
              <div style={{ fontSize: 10, color: '#8899aa' }}>{p.sector}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 4, background: p.color + '12', color: p.color }}>{p.status}</span>
          </div>
        ))}
        <div style={{ padding: '10px 18px', background: 'rgba(245,158,11,0.04)', fontSize: 10, color: '#8899aa' }}>
          🇦🇪 MENA launches with S230 — pipeline converting to first customers at S230 gate
        </div>
      </div>
    </div>
  )
}
