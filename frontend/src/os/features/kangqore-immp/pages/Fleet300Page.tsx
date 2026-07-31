import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function Fleet300Page() {
  const q = useQuery({ queryKey: ['fleet-300'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet-300').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const g = d?.gate282Progress

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S277 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>300-Fleet Milestone — 12 Regions · COIG avg {d?.avgCOIG ?? 14.8}</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.totalCustomers ?? 300} customers · {d?.regionsActive ?? 12} regions · NPS {d?.fleetNPS ?? 62} · churn {d?.churnRate ?? 3.4}%</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Customers',  value: d?.totalCustomers ?? 300,                             color: TEAL  },
          { label: 'COIG Avg',         value: `+${d?.avgCOIG ?? 14.8}`,                             color: GREEN },
          { label: 'Total ARR',        value: `£${((d?.totalARR ?? 3_800_000) / 1e6).toFixed(1)}M`, color: AMBER },
          { label: 'BIDS Engagements', value: d?.bidsEngagements ?? 118,                             color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Gate 282 progress */}
      {g && (
        <div style={{ background: `${TEAL}08`, border: `1.5px solid ${TEAL}28`, borderRadius: 14, padding: '18px 22px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: TEAL, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Gate S282 Progress</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { label: 'Customers',  current: g.customers, target: g.target,   unit: '',    pct: g.pct,  color: TEAL  },
              { label: 'ARR',        current: `£${(g.arr/1e6).toFixed(1)}M`, target: `£${(g.arrTarget/1e6).toFixed(0)}M`, unit: '', pct: Math.round(g.arr / g.arrTarget * 100), color: AMBER },
              { label: 'COIG avg',   current: `+${g.coig}`, target: `+${g.coigTarget}`, unit: '', pct: Math.round(g.coig / g.coigTarget * 100), color: GREEN },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#8899aa' }}>{m.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#263250', overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ width: `${Math.min(m.pct, 100)}%`, height: '100%', background: m.color }} />
                </div>
                <div style={{ fontSize: 10, color: '#4a5568' }}>{m.current} / {m.target}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cohort table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1fr 1.2fr 80px 80px 80px 90px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Cohort</span><span>Region Mix</span><span>Count</span><span>COIG D0</span><span>COIG Now</span><span>BIDS Adopt</span>
        </div>
        {(d?.cohorts ?? []).map((c: any, i: number) => (
          <div key={c.cohort} style={{ padding: '11px 20px', borderBottom: i < (d?.cohorts?.length ?? 4) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1fr 1.2fr 80px 80px 80px 90px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: TEAL, fontWeight: 800 }}>{c.cohort}</span>
            <span style={{ color: '#8899aa' }}>{c.region}</span>
            <span style={{ color: '#ccdde0' }}>{c.customers}</span>
            <span style={{ color: '#8899aa' }}>{c.coigDay0}</span>
            <span style={{ color: GREEN, fontWeight: 700 }}>{c.coigCurrent}</span>
            <span style={{ color: AMBER }}>{Math.round(c.bidsAdoption * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
