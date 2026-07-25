import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const PACKS = [
  {
    dept: 'Projects',
    icon: '📋',
    color: BLUE,
    deliverables: ['Full PMO setup · milestone taxonomy', 'Risk register · resource plan', '8-week delivery sprint blueprint', 'WAANDA PMO integration', 'Stakeholder reporting templates'],
    price: '£12,000',
    duration: '4–6 weeks',
  },
  {
    dept: 'Finance',
    icon: '💷',
    color: GREEN,
    deliverables: ['Chart of accounts setup', 'Budget modelling · variance analysis', 'Cash flow + ARR reporting', 'WAANDA Finance integration', 'Board pack template'],
    price: '£10,000',
    duration: '3–4 weeks',
  },
  {
    dept: 'Sales',
    icon: '🎯',
    color: AMBER,
    deliverables: ['CRM pipeline architecture', 'ICP definition + qualification playbook', 'Revenue intelligence wiring', 'WAANDA Sales assistant', 'Deal velocity dashboard'],
    price: '£9,500',
    duration: '3–4 weeks',
  },
  {
    dept: 'HR',
    icon: '👥',
    color: PURPLE,
    deliverables: ['OKR framework setup', 'Performance review templates', 'Onboarding playbook', 'WAANDA HR integration', 'Team health scoring'],
    price: '£8,000',
    duration: '2–3 weeks',
  },
]

export function ProfServicesPackPage() {
  const q = useQuery({ queryKey: ['professional-services'], queryFn: () => api.get('/admin/kangqore-immp/platform/professional-services').then(r => r.data), staleTime: 30_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S209 · Professional Services Pack v1.0</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Kangqore Professional Services</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>4 dept packs · fixed-scope delivery · WAANDA wiring included · Projects / Finance / Sales / HR</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Engagements', value: d?.active ?? '—', color: TEAL },
          { label: 'Completed', value: d?.completed ?? '—', color: GREEN },
          { label: 'Total Revenue', value: d?.revenueGbp ? `£${(d.revenueGbp / 1000).toFixed(0)}K` : '—', color: AMBER },
          { label: 'NPS (Delivered)', value: d?.nps ?? '—', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Pack cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {PACKS.map(p => (
          <div key={p.dept} style={{ background: p.color + '06', border: `1px solid ${p.color}25`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${p.color}20`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{p.dept} Pack</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: p.color }}>{p.price}</span>
                  <span style={{ fontSize: 9, color: '#8899aa' }}>·</span>
                  <span style={{ fontSize: 9, color: '#8899aa' }}>{p.duration}</span>
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 4, background: p.color + '18', color: p.color }}>AVAILABLE</span>
            </div>
            <div style={{ padding: '14px 20px' }}>
              {p.deliverables.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#b0c0d0', lineHeight: 1.4 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
