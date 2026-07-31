import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', TEAL = '#06b6d4'

export function Fleet250Page() {
  const q = useQuery({ queryKey: ['fleet-250'], queryFn: () => api.get('/admin/kangqore-immp/platform/fleet-250').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S275 · Chapter 12 T3 — 500-Customer Fleet</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>250-Fleet Milestone — 10 Regions · COIG avg {d?.avgCOIG ?? 14.1}</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.totalCustomers ?? 250} customers · {d?.regions ?? 10} regions · NPS {d?.fleetNPS ?? 61} · churn {d?.churnRate ?? 3.8}%</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Customers', value: d?.totalCustomers ?? 250,                           color: TEAL  },
          { label: 'COIG Avg',        value: `+${d?.avgCOIG ?? 14.1}`,                           color: GREEN },
          { label: 'Total ARR',       value: `£${((d?.totalARR ?? 3_470_000) / 1e6).toFixed(1)}M`, color: AMBER },
          { label: 'Fleet NPS',       value: d?.fleetNPS ?? 61,                                  color: BLUE  },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Region breakdown table */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #263250', display: 'grid', gridTemplateColumns: '1.2fr 80px 80px 110px 60px', fontSize: 10, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span>Region</span><span>Customers</span><span>COIG avg</span><span>ARR</span><span>Share</span>
        </div>
        {(d?.regionBreakdown ?? []).map((r: any, i: number) => (
          <div key={r.region} style={{ padding: '11px 20px', borderBottom: i < (d?.regionBreakdown?.length ?? 10) - 1 ? '1px solid #1e2a40' : 'none', display: 'grid', gridTemplateColumns: '1.2fr 80px 80px 110px 60px', alignItems: 'center', fontSize: 11 }}>
            <span style={{ color: '#ccdde0', fontWeight: 700 }}>{r.region}</span>
            <span style={{ color: TEAL, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{r.customers}</span>
            <span style={{ color: r.coigAvg >= 14 ? GREEN : AMBER, fontWeight: 700 }}>+{r.coigAvg}</span>
            <span style={{ color: BLUE, fontVariantNumeric: 'tabular-nums' }}>£{(r.arr / 1000).toFixed(0)}K</span>
            <span style={{ color: '#4a5568', fontSize: 10 }}>{r.pct}%</span>
          </div>
        ))}
      </div>

      {/* Top performer */}
      {d?.topPerformer && (
        <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25`, borderRadius: 12, padding: '12px 18px' }}>
          <span style={{ fontSize: 12, color: '#8899aa' }}>Top performer: <span style={{ color: GREEN, fontWeight: 700 }}>{d.topPerformer.region}</span> at COIG +{d.topPerformer.coig} · {d.topPerformer.note}</span>
        </div>
      )}
    </div>
  )
}
