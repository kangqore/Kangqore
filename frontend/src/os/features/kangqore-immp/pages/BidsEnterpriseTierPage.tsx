import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsEnterpriseTierPage() {
  const q = useQuery({ queryKey: ['bids-enterprise-tier'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-enterprise-tier').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S234 · BIDS™ Enterprise Tier</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Enterprise Engagement</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Full 16-pillar engagement · dedicated WAANDA analyst · Board Presentation™ · Executive Workshop™ live facilitation</p>
      </div>

      {/* Pricing tiers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {(d?.pricing ?? []).map((p: any, i: number) => {
          const accent = [GREEN, PURPLE, AMBER][i]
          const isHighlight = i === 1
          return (
            <div key={p.tier} style={{ background: isHighlight ? `linear-gradient(135deg, ${accent}12, #1a2235)` : '#1a2235', border: `1px solid ${isHighlight ? accent + '45' : '#263250'}`, borderRadius: 14, padding: '20px 22px' }}>
              {isHighlight && <div style={{ fontSize: 9, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Most Popular</div>}
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{p.tier}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, marginBottom: 2 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 12 }}>per engagement</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Turnaround', value: p.turnaround },
                  { label: 'Delivery', value: p.delivery },
                  { label: 'Analyst', value: p.analyst ? 'Dedicated WAANDA' : 'Self-serve' },
                  { label: 'Workshop', value: p.workshop ? 'Executive Workshop™' : 'Not included' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, borderBottom: '1px solid #1e2a40', paddingBottom: 4 }}>
                    <span style={{ color: '#8899aa' }}>{row.label}</span>
                    <span style={{ color: row.value.includes('Not') ? '#4a5568' : '#ccdde0', fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Deliverables */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Enterprise Deliverables ({d?.deliverables?.length ?? 7})</div>
        {(d?.deliverables ?? []).map((del: any, i: number) => (
          <div key={del.id} style={{ padding: '13px 20px', borderBottom: i < (d?.deliverables?.length ?? 7) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{del.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{del.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa' }}>{del.desc}</div>
            </div>
            {del.included && <CheckCircle2 size={14} color={GREEN} style={{ flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
        {[{ icon: '🎯', label: 'Board Presentation™', color: PURPLE }, { icon: '🤝', label: 'Executive Workshop™', color: BLUE }, { icon: '💹', label: 'ROI Projection', color: GREEN }].map(b => (
          <div key={b.label} style={{ flex: 1, background: b.color + '08', border: `1px solid ${b.color}25`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{b.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
