import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const TIER_COLOR: Record<string, string> = { PLATINUM: PURPLE, GOLD: AMBER, SILVER: BLUE }
const STATUS_COLOR: Record<string, string> = { LIVE: GREEN, PENDING: AMBER }

export function ResellersProgramPage() {
  const q = useQuery({ queryKey: ['resellers-program'], queryFn: () => api.get('/admin/kangqore-immp/platform/resellers-program').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S268 · Enterprise Reseller Programme</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>KPMG · Deloitte · Accenture — Tier-1 Reseller Partners</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.livePartners ?? 3} partners live · £{((d?.totalACVSourced ?? 10600000) / 1e6).toFixed(1)}M ACV sourced · {d?.avgCommissionPct ?? 17}% avg commission</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Partners',     value: d?.totalPartners ?? 5,                                         color: BLUE   },
          { label: 'Live Partners',      value: d?.livePartners ?? 3,                                           color: GREEN  },
          { label: 'ACV Sourced',        value: `£${((d?.totalACVSourced ?? 10600000) / 1e6).toFixed(1)}M`,   color: PURPLE },
          { label: 'Certified Resellers',value: d?.certifiedResellers ?? 3,                                    color: AMBER  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Partner table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.5fr 90px 80px 70px 120px 80px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Partner</span><span>Tier</span><span>Status</span><span>Deals</span><span>ACV Sourced</span><span>Commission</span>
        </div>
        {(d?.partners ?? []).map((p: any, i: number) => {
          const tierColor = TIER_COLOR[p.tier] ?? BLUE
          const statusColor = STATUS_COLOR[p.status] ?? AMBER
          return (
            <div key={p.name} style={{ padding: '11px 20px', borderBottom: i < (d?.partners?.length ?? 5) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.5fr 90px 80px 70px 120px 80px', alignItems: 'center', fontSize: 11 }}>
              <span style={{ color: '#ccdde0', fontWeight: 700 }}>{p.name}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${tierColor}18`, color: tierColor }}>{p.tier}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${statusColor}18`, color: statusColor }}>{p.status}</span>
              <span style={{ color: '#8899aa' }}>{p.dealsReferred}</span>
              <span style={{ color: p.acvSourced > 0 ? PURPLE : '#4a5568', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{p.acvSourced > 0 ? `£${(p.acvSourced / 1e6).toFixed(1)}M` : '—'}</span>
              <span style={{ color: '#8899aa' }}>{p.commissionPct}%</span>
            </div>
          )
        })}
      </div>

      {/* Partner benefits */}
      <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}22`, borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Partner Benefits</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(d?.partnerBenefits ?? []).map((b: string) => (
            <span key={b} style={{ fontSize: 10, fontWeight: 700, color: PURPLE, background: `${PURPLE}12`, border: `1px solid ${PURPLE}28`, borderRadius: 6, padding: '4px 10px' }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
