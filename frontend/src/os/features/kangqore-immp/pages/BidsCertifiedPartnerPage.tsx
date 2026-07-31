import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Award } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const TIER_COLORS: Record<string, string> = { GOLD: AMBER, SILVER: BLUE, BRONZE: '#cd7f32' }

export function BidsCertifiedPartnerPage() {
  const q = useQuery({ queryKey: ['bids-partner-network'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-partner-network').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S241 · BIDS™ Certified Partner Network</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>10 Certified BIDS™ Partners</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Partner training programme · co-delivery model · 70 Kangqore / 30 partner revenue share</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Certified Partners', value: d?.certified ?? 10, color: AMBER },
          { label: 'Partner Engagements', value: d?.totalPartnerEngagements ?? '—', color: GREEN },
          { label: 'Kangqore Revenue Share', value: d?.revenueModel?.kangqoreShare ? `${d.revenueModel.kangqoreShare}%` : '70%', color: BLUE },
          { label: 'Partner Revenue Share', value: d?.revenueModel?.partnerShare ? `${d.revenueModel.partnerShare}%` : '30%', color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue model */}
      <div style={{ background: `linear-gradient(90deg, ${GREEN}10, ${AMBER}08)`, border: `1px solid ${GREEN}28`, borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', gap: 0, height: 10, borderRadius: 6, overflow: 'hidden', width: 200, flexShrink: 0 }}>
          <div style={{ width: '70%', background: GREEN }} />
          <div style={{ width: '30%', background: AMBER }} />
        </div>
        <div style={{ fontSize: 12, color: '#ccdde0' }}>
          <strong style={{ color: GREEN }}>70%</strong> Kangqore · <strong style={{ color: AMBER }}>30%</strong> Partner · Co-delivery model · Min {d?.revenueModel?.minimumEngagementsPerYear ?? 3} engagements/year
        </div>
      </div>

      {/* Partner table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '40px 1fr 80px 70px 80px 1fr', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>#</span><span>Partner</span><span>Tier</span><span>Region</span><span>Engagements</span><span>Specialisation</span>
        </div>
        {(d?.partners ?? []).map((p: any, i: number) => {
          const tierColor = TIER_COLORS[p.tier] ?? BLUE
          return (
            <div key={p.id} style={{ padding: '10px 20px', borderBottom: i < (d?.partners?.length ?? 10) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '40px 1fr 80px 70px 80px 1fr', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={12} color={tierColor} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ccdde0' }}>{p.name}</span>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: tierColor + '18', color: tierColor }}>{p.tier}</span>
              <span style={{ fontSize: 11, color: '#8899aa' }}>{p.region}</span>
              <span style={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>{p.engagements}</span>
              <span style={{ fontSize: 10, color: '#8899aa' }}>{p.specialisation}</span>
            </div>
          )
        })}
      </div>

      {/* Training modules */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Certification Training Modules</div>
        {(d?.trainingModules ?? []).map((m: any, i: number) => (
          <div key={m.module} style={{ padding: '10px 20px', borderBottom: i < (d?.trainingModules?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: m.required ? `${PURPLE}18` : '#263250', color: m.required ? PURPLE : '#8899aa', flexShrink: 0 }}>{m.required ? 'Required' : 'Optional'}</span>
            <span style={{ fontSize: 12, color: '#ccdde0', flex: 1 }}>{m.module}</span>
            <span style={{ fontSize: 10, color: '#8899aa' }}>{m.duration}</span>
            <span style={{ fontSize: 10, color: BLUE, fontWeight: 600 }}>{m.format}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
