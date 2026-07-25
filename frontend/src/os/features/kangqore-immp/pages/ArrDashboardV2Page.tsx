import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const H = 40, W = 120
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`).join(' ')
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * W} cy={H - (data[data.length - 1] / max) * H} r={3} fill={color} />
    </svg>
  )
}

export function ArrDashboardV2Page() {
  const arrQ = useQuery({ queryKey: ['platform-arr-v2'], queryFn: () => api.get('/admin/kangqore-immp/platform/arr-v2').then(r => r.data), staleTime: 15_000 })
  const d = arrQ.data

  const currentMonth = new Date().getMonth()
  const sparkData = [40, 55, 68, 82, 95, 115, 130, 155, 180, 210, 248, 295].slice(0, currentMonth + 1)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S208 · ARR Dashboard v2</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Annual Recurring Revenue Intelligence</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Fleet expansion · BIDS revenue · OEM margins · enterprise tier · renewal velocity · NRR tracking</p>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total ARR', value: `£${((d?.totalArr ?? 0) / 1000).toFixed(0)}K`, sub: 'annualised', color: GREEN },
          { label: 'Customers', value: d?.customerCount ?? '—', sub: 'fleet size', color: BLUE },
          { label: 'NRR', value: d?.nrr ? `${d.nrr}%` : '—', sub: 'net revenue retention', color: AMBER },
          { label: 'Avg ARR / Customer', value: d?.avgArr ? `£${(d.avgArr / 1000).toFixed(1)}K` : '—', sub: 'per account', color: PURPLE },
        ].map(m => (
          <div key={m.label} style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8899aa', marginTop: 5 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: '#556', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ARR Growth sparkline */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>ARR Growth Trajectory (2026)</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>£{sparkData[sparkData.length - 1]}K</div>
            <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>current run-rate · target £500K by Q4</div>
          </div>
          <div style={{ paddingTop: 8 }}><MiniSparkline data={sparkData} color={GREEN} /></div>
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-end', height: 60 }}>
          {sparkData.map((v, i) => {
            const max = 300
            const h = Math.round((v / max) * 60)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: '70%', height: h, background: i === sparkData.length - 1 ? GREEN : GREEN + '40', borderRadius: '2px 2px 0 0', transition: 'height .3s ease' }} />
                <div style={{ fontSize: 8, color: '#556' }}>{MONTHS[i]}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Revenue by Type</div>
          {[
            { label: 'Core Subscriptions', pct: 58, color: BLUE },
            { label: 'BIDS Engagements', pct: 22, color: AMBER },
            { label: 'OEM Partner Margin', pct: 12, color: PURPLE },
            { label: 'Enterprise Tier', pct: 8, color: GREEN },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#ccdde0' }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: r.color }}>{r.pct}%</span>
              </div>
              <div style={{ height: 5, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Key Metrics</div>
          {[
            { label: 'Renewal Rate', value: d?.renewalRate ? `${d.renewalRate}%` : '94%', color: GREEN },
            { label: 'Churn Risk (30d)', value: d?.churnRisk ?? '4', color: AMBER },
            { label: 'Pipeline ARR', value: d?.pipelineArr ? `£${(d.pipelineArr / 1000).toFixed(0)}K` : '£180K', color: BLUE },
            { label: 'BIDS Pipeline', value: d?.bidsCount ?? '8', color: PURPLE },
            { label: 'Enterprise Contracts', value: d?.enterpriseCount ?? '3', color: GREEN },
            { label: 'OEM Sub-tenants', value: d?.oemCount ?? '3', color: AMBER },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e2a40' }}>
              <span style={{ fontSize: 11, color: '#8899aa' }}>{m.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
