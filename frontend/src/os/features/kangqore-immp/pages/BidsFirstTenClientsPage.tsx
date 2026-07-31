import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { ArrowRight } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsFirstTenClientsPage() {
  const q = useQuery({ queryKey: ['bids-first-ten'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-first-ten-clients').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S235 · BIDS™ First 10 Enterprise Clients</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Enterprise Cohort: C76–C85</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>All 10 enterprise clients on BIDS™ · ROI Projection Reports published · Blueprint conversion tracked</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Engagements', value: d?.total ?? 10, color: BLUE },
          { label: 'Completed', value: d?.completed ?? '—', color: GREEN },
          { label: 'Blueprint Conversions', value: d?.blueprintConversions ?? '—', color: AMBER },
          { label: 'Conversion Rate', value: d?.conversionRate ? `${d.conversionRate}%` : '—', color: PURPLE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Avg BIDS score */}
      <div style={{ background: `linear-gradient(90deg, ${BLUE}10, #1a2235)`, border: `1px solid ${BLUE}28`, borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: BLUE }}>{d?.avgBidsScore ?? 63}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Average BIDS™ Score (C76–C85)</div>
          <div style={{ fontSize: 11, color: '#8899aa' }}>Developing band · Primary gaps: Data Intelligence · AI Maturity</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ width: 120, height: 8, background: '#263250', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${d?.avgBidsScore ?? 63}%`, height: '100%', background: BLUE, borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 9, color: '#8899aa', textAlign: 'right', marginTop: 2 }}>/ 100</div>
        </div>
      </div>

      {/* Client table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px 100px 90px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Client</span><span>Sector</span><span>BIDS™ Score</span><span>ROI Proj.</span><span>Pillars</span><span>Blueprint?</span><span>Status</span>
        </div>
        {(d?.clients ?? []).map((c: any, i: number) => (
          <div key={c.id} style={{ padding: '12px 20px', borderBottom: i < (d?.clients?.length ?? 10) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 80px 100px 90px', alignItems: 'center', fontSize: 12 }}>
            <span style={{ fontWeight: 800, color: BLUE }}>{c.id}</span>
            <span style={{ color: '#ccdde0' }}>{c.sector}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 50, height: 4, background: '#263250', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${c.bidsScore}%`, height: '100%', background: c.bidsScore >= 65 ? GREEN : c.bidsScore >= 50 ? BLUE : AMBER }} />
              </div>
              <span style={{ color: '#ccdde0', fontSize: 11 }}>{c.bidsScore}</span>
            </div>
            <span style={{ color: GREEN, fontWeight: 600 }}>{c.roiProjection}</span>
            <span style={{ color: '#8899aa' }}>{c.pillarsCritical} critical</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {c.blueprintConversion ? (
                <><ArrowRight size={10} color={GREEN} /><span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>Converted</span></>
              ) : (
                <span style={{ fontSize: 10, color: '#8899aa' }}>In progress</span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: c.status === 'COMPLETED' ? `${GREEN}18` : `${AMBER}18`, color: c.status === 'COMPLETED' ? GREEN : AMBER }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
