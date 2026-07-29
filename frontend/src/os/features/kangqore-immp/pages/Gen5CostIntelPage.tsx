import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function Gen5CostIntelPage() {
  const q = useQuery({ queryKey: ['gen5-cost-intelligence'], queryFn: () => api.get('/admin/kangqore-immp/gen5/cost-intelligence').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const monthly: any[] = d?.monthlyData ?? []

  const maxSavings = Math.max(...monthly.map((m: any) => m.savingsGbp ?? 0), 1)

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S219 · Cost Intelligence</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Cost Dashboard — £/Decision vs Claude</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Cumulative savings ROI · per-model cost benchmarks · monthly savings trajectory</p>
      </div>

      {/* Cost benchmark cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Claude Baseline', sub: 'per 1K decisions', value: `£${d?.claudeBaselineCostPer1K?.toFixed(2) ?? '4.50'}`, color: '#8899aa', badge: 'REFERENCE' },
          { label: 'Gen4 Cost', sub: 'per 1K decisions', value: `£${d?.gen4CostPer1K?.toFixed(2) ?? '1.20'}`, color: BLUE, badge: 'BACKUP', savings: d?.gen4SavingsPct ?? 73 },
          { label: 'Gen5 Cost', sub: 'per 1K decisions', value: `£${d?.gen5CostPer1K?.toFixed(2) ?? '0.42'}`, color: GREEN, badge: 'PRIMARY', savings: d?.savingsVsClaude ?? 90.7 },
        ].map(m => (
          <div key={m.label} style={{ background: m.color === '#8899aa' ? '#1a2235' : m.color + '06', border: `1px solid ${m.color}25`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0' }}>{m.label}</div>
                <div style={{ fontSize: 10, color: '#8899aa', marginTop: 2 }}>{m.sub}</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: m.color + '18', color: m.color }}>{m.badge}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 6 }}>{m.value}</div>
            {'savings' in m && m.savings !== undefined && (
              <div style={{ fontSize: 11, color: GREEN, fontWeight: 700 }}>↓ {m.savings.toFixed(1)}% vs Claude</div>
            )}
          </div>
        ))}
      </div>

      {/* Monthly savings bar chart */}
      {monthly.length > 0 && (
        <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '20px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Monthly Savings vs All-Claude Baseline (£)</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
            {monthly.map((m: any) => (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: GREEN, fontVariantNumeric: 'tabular-nums' }}>£{(m.savingsGbp ?? 0).toLocaleString()}</div>
                <div style={{ width: '100%', height: Math.max(4, (m.savingsGbp / maxSavings) * 96), background: `linear-gradient(180deg, ${GREEN}, ${GREEN}60)`, borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                <div style={{ fontSize: 7, color: '#8899aa', textAlign: 'center', whiteSpace: 'nowrap' }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cumulative ROI */}
      <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '18px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Cumulative Savings — ROI Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { label: 'Total Saved (vs Claude)', value: `£${(d?.cumulativeSavingsGbp ?? 0).toLocaleString()}`, color: GREEN },
            { label: 'AI Infra Cost Reduction', value: `${d?.savingsVsClaude?.toFixed(1) ?? '90.7'}%`, color: AMBER },
            { label: 'Decisions Routed Gen5', value: (d?.decisionsRouted ?? 0).toLocaleString(), color: PURPLE },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
