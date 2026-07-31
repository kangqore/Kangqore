import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function Bids200EngagementsPage() {
  const q = useQuery({ queryKey: ['bids-200-engagements'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-200-engagements').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S280 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ 200-Engagement Milestone — {d?.totalEditions ?? 10} Editions · {d?.certifiedPartners ?? 33} Partners</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.totalEngagements ?? 203} total engagements · {Math.round((d?.zeroTouchPct ?? 0.81) * 100)}% zero-touch · {d?.turnaroundHrs ?? 22}h avg turnaround · {Math.round((d?.blueprintConversionRate ?? 0.68) * 100)}% Blueprint conversion</p>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Engagements',  value: d?.totalEngagements ?? 203,                                      color: TEAL  },
          { label: 'Avg BIDS Score',     value: `${d?.avgBIDSScore ?? 63.8}/100`,                                color: GREEN },
          { label: 'BIDS ARR',           value: `£${((d?.revenue?.totalARR ?? 2_376_000) / 1e6).toFixed(2)}M`,  color: AMBER },
          { label: 'Certified Partners', value: d?.certifiedPartners ?? 33,                                      color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue breakdown */}
      <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}22`, borderRadius: 12, padding: '14px 18px', marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Standard MRR',     value: `£${((d?.revenue?.standardMRR ?? 42_000) / 1000).toFixed(0)}K`,    color: BLUE  },
          { label: 'Enterprise MRR',   value: `£${((d?.revenue?.enterpriseMRR ?? 118_000) / 1000).toFixed(0)}K`, color: AMBER },
          { label: 'Subscription MRR', value: `£${((d?.revenue?.subscriptionMRR ?? 38_000) / 1000).toFixed(0)}K`,color: GREEN },
        ].map(r => (
          <div key={r.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: r.color }}>{r.value}</div>
            <div style={{ fontSize: 10, color: '#8899aa', marginTop: 3 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Edition breakdown table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.6fr 80px 80px 110px 90px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Edition</span><span>Engagements</span><span>Avg Score</span><span>Avg ROI</span><span>Partners</span>
        </div>
        {(d?.editionBreakdown ?? []).map((e: any, i: number) => (
          <div key={e.edition} style={{ padding: '11px 20px', borderBottom: i < (d?.editionBreakdown?.length ?? 10) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.6fr 80px 80px 110px 90px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{e.edition}</span>
            <span style={{ color: TEAL, fontWeight: 800 }}>{e.engagements}</span>
            <span style={{ color: e.avgScore >= 65 ? GREEN : AMBER }}>{e.avgScore}</span>
            <span style={{ color: BLUE }}>{e.avgROI}</span>
            <span style={{ color: '#8899aa' }}>{e.certifiedPartners}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
