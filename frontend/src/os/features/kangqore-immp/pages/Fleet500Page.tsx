import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function Fleet500Page() {
  const q = useQuery({ queryKey: ['fleet-500'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet-500').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S281 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>500-Fleet Milestone — {d?.regions ?? 12} Regions · COIG avg {d?.avgCOIG ?? 16.4}</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.totalCustomers ?? 500} customers · {d?.regions ?? 12} regions · NPS {d?.fleetNPS ?? 67} · churn {d?.churnRate ?? 2.8}%</p>
      </div>

      {/* Hero stats */}
      <div style={{ background: `linear-gradient(135deg, ${TEAL}12, ${GREEN}06)`, border: `2px solid ${TEAL}35`, borderRadius: 18, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ textAlign: 'center', minWidth: 120 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: TEAL, lineHeight: 1 }}>{d?.totalCustomers ?? 500}</div>
          <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>Enterprise Customers</div>
        </div>
        <div style={{ height: 64, width: 1, background: '#263250' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, flex: 1 }}>
          {[
            { label: 'Total ARR',   value: `£${((d?.totalARR ?? 8_700_000) / 1e6).toFixed(1)}M`, color: AMBER },
            { label: 'COIG avg',    value: `+${d?.avgCOIG ?? 16.4}`,                               color: GREEN },
            { label: 'Fleet NPS',   value: d?.fleetNPS ?? 67,                                      color: BLUE  },
            { label: 'Churn rate',  value: `${d?.churnRate ?? 2.8}%`,                              color: GREEN },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#8899aa', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* COIG journey */}
      {d?.coigMilestones && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>COIG Fleet Average — Journey from S182</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
            {(d.coigMilestones ?? []).map((m: any, i: number) => {
              const h = Math.round((m.coig / 20) * 100)
              return (
                <div key={m.sprint} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, color: GREEN, fontWeight: 700 }}>+{m.coig}</div>
                  <div style={{ width: '100%', height: `${h}%`, background: i === (d.coigMilestones.length - 1) ? TEAL : `${GREEN}50`, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                  <div style={{ fontSize: 8, color: '#4a5568', whiteSpace: 'nowrap' }}>{m.sprint}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Region breakdown */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.2fr 80px 80px 110px 60px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Region</span><span>Customers</span><span>COIG avg</span><span>ARR</span><span>Share</span>
        </div>
        {(d?.regionBreakdown ?? []).map((r: any, i: number) => (
          <div key={r.region} style={{ padding: '11px 20px', borderBottom: i < (d?.regionBreakdown?.length ?? 12) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.2fr 80px 80px 110px 60px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{r.region}</span>
            <span style={{ color: TEAL, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{r.customers}</span>
            <span style={{ color: r.coigAvg >= 16 ? GREEN : AMBER, fontWeight: 700 }}>+{r.coigAvg}</span>
            <span style={{ color: BLUE, fontVariantNumeric: 'tabular-nums' }}>{r.arr >= 1e6 ? `£${(r.arr/1e6).toFixed(1)}M` : `£${(r.arr/1000).toFixed(0)}K`}</span>
            <span style={{ color: '#4a5568', fontSize: 10 }}>{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
