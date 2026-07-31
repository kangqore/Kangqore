import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function BidsAnnualSubscriptionPage() {
  const q = useQuery({ queryKey: ['bids-subscription'], queryFn: () => api.get('/admin/kangqore-immp/platform/bids-subscription').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const fmt = (n: number) => `£${(n / 1000).toFixed(0)}K`

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S239 · BIDS™ Annual Subscription</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Subscription Plans</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Quarterly re-scan · WAANDA trend alerts · benchmark drift detection · annual health report · £12K–£48K/year</p>
      </div>

      {/* ARR hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Projected Subscription ARR', value: d?.projectedArr ? `£${(d.projectedArr / 1000).toFixed(0)}K` : '—', color: GREEN },
          { label: 'Subscription % of BIDS ARR', value: d?.subscriptionArrPct ? `${d.subscriptionArrPct}%` : '—', color: AMBER },
          { label: 'Price Range', value: '£12K–£48K', color: BLUE },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subscription plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {(d?.plans ?? []).map((plan: any, i: number) => {
          const accent = [GREEN, BLUE, PURPLE][i]
          return (
            <div key={plan.tier} style={{ background: '#1a2235', border: `1px solid ${accent}30`, borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{plan.tier}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: accent, marginBottom: 2 }}>{fmt(plan.pricePerYear)}</div>
              <div style={{ fontSize: 11, color: '#8899aa', marginBottom: 14 }}>per year · {plan.rescans} rescans</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(plan.features ?? []).map((f: string) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <CheckCircle2 size={11} color={accent} style={{ marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#8899aa' }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '8px 12px', background: accent + '10', border: `1px solid ${accent}25`, borderRadius: 8, fontSize: 10, color: accent, fontWeight: 700, textAlign: 'center' }}>
                Target ARR: {fmt(plan.targetRevenue)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quarterly deliverables */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Quarterly Deliverables</div>
        {(d?.quarterlyDeliverables ?? []).map((q2: any, i: number) => {
          const accent = [BLUE, GREEN, AMBER, PURPLE][i]
          return (
            <div key={q2.quarter} style={{ padding: '12px 20px', borderBottom: i < 3 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: accent + '18', border: `1.5px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: accent, flexShrink: 0 }}>{q2.quarter}</div>
              <span style={{ fontSize: 12, color: '#ccdde0' }}>{q2.deliverable}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
