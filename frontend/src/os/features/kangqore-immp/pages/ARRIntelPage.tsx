import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { TrendingUp } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b'

function fmt(n: number) { return n >= 1_000_000 ? `£${(n/1_000_000).toFixed(2)}M` : `£${n.toLocaleString()}` }

export function ARRIntelPage() {
  const q = useQuery({ queryKey: ['arr-intelligence'], queryFn: () => api.get('/admin/kangqore-immp/revenue/arr-intelligence').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">
      <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: 'rgba(251,191,36,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp style={{ width: 28, height: 28, color: AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>S167 — ARR Intelligence Dashboard</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>MRR → ARR projection · cohort revenue analysis · LTV · burn multiple · regional breakdown</div>
        </div>
        {d && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: AMBER, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.arrGbp)}</div>
            <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>Annual Recurring Revenue</div>
          </div>
        )}
      </div>

      {d && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { label: 'MRR',          value: fmt(d.mrrGbp),         color: AMBER },
              { label: 'ARR',          value: fmt(d.arrGbp),         color: GREEN },
              { label: 'LTV (est.)',   value: fmt(d.ltv),            color: '#a78bfa' },
              { label: 'Burn Multiple',value: `${d.burnMultiple}x`,  color: d.burnMultiple < 1 ? GREEN : AMBER },
            ].map(m => (
              <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>ARR Movement</div>
              {[
                { label: 'New ARR',         value: fmt(d.newArr),         color: GREEN },
                { label: 'Expansion ARR',   value: fmt(d.expansionArr),   color: '#3b82f6' },
                { label: 'Churned ARR',     value: `-${fmt(d.churnedArr)}`, color: '#ef4444' },
                { label: 'Resurrected ARR', value: fmt(d.resurrectedArr), color: AMBER },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${BDR}` }}>
                  <span style={{ fontSize: 12, color: T2 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: r.color, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Regional ARR Breakdown</div>
              {d.regionBreakdown.map((r: any, i: number) => {
                const pct = d.arrGbp > 0 ? Math.round((r.arr / d.arrGbp) * 100) : 0
                return (
                  <div key={r.region} style={{ marginBottom: i < d.regionBreakdown.length - 1 ? 10 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: T2 }}>{r.region}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T1, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.arr)} <span style={{ color: T2 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                      <div style={{ height: 4, width: `${pct}%`, background: AMBER, borderRadius: 999 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T2, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Cohort ARR by Plan Tier</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {d.cohortBreakdown.map((c: any) => {
                const pct = d.arrGbp > 0 ? Math.round((c.arr / d.arrGbp) * 100) : 0
                return (
                  <div key={c.label} style={{ flex: 1, textAlign: 'center', padding: '14px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${BDR}` }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: AMBER, fontVariantNumeric: 'tabular-nums' }}>{fmt(c.arr)}</div>
                    <div style={{ fontSize: 10, color: T2, fontWeight: 700, marginTop: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 10, color: T2, marginTop: 2 }}>{pct}% of ARR</div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
