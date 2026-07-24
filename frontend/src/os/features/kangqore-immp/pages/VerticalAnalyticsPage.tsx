import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { ChevronRight } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'

const COLORS: Record<string, string> = {
  healthtech: '#10b981',
  legaltech:  '#3b82f6',
  fintech:    '#f59e0b',
}
const LABELS: Record<string, string> = {
  healthtech: 'HealthTech',
  legaltech:  'LegalTech',
  fintech:    'FinTech',
}

export function VerticalAnalyticsPage() {
  const overview = useQuery({
    queryKey: ['vertical-analytics-overview'],
    queryFn:  () => api.get('/admin/kangqore-immp/vertical-analytics/overview').then(r => r.data),
    staleTime: 60_000,
  })
  const oisDist = useQuery({
    queryKey: ['vertical-ois-distribution'],
    queryFn:  () => api.get('/admin/kangqore-immp/vertical-analytics/ois-distribution').then(r => r.data.distribution as any[]),
    staleTime: 60_000,
  })

  const summary: any[] = overview.data?.summary ?? []
  const totalMRR: number = overview.data?.totalVerticalMRR ?? 0
  const totalCustomers: number = overview.data?.totalCustomers ?? 0
  const vertCustomers: number = overview.data?.totalVerticalCustomers ?? 0
  const distribution: any[] = oisDist.data ?? []

  return (
    <div style={{ maxWidth: 1100 }} className="space-y-6">

      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: T1, margin: 0 }}>Vertical Analytics</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>OIS distribution, MRR breakdown, and cohort performance across all three vertical editions.</p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Fleet',           value: totalCustomers,               color: T1    },
          { label: 'Vertical Customers',    value: vertCustomers,                color: '#7c3aed' },
          { label: 'Total Vertical MRR',    value: `£${totalMRR.toLocaleString()}`, color: '#10b981' },
          { label: 'Vertical Penetration',  value: totalCustomers > 0 ? `${Math.round((vertCustomers / totalCustomers) * 100)}%` : '—', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-edition breakdown */}
      {summary.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {summary.map((ed: any) => {
            const color = COLORS[ed.slug] ?? '#7c3aed'
            const plans: Record<string, number> = ed.planBreakdown ?? {}
            return (
              <div key={ed.slug} style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: T1 }}>{LABELS[ed.slug] ?? ed.slug}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color, letterSpacing: '.07em' }}>{ed.personaName} PERSONA</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>£{ed.mrrGBP.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 600 }}>MRR</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>{ed.customers}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 600 }}>Customers</div>
                  </div>
                  {Object.entries(plans).map(([tier, cnt]) => (
                    <div key={tier} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color }}>{String(cnt)}</div>
                      <div style={{ fontSize: 9, color: T2, fontWeight: 600 }}>{tier}</div>
                    </div>
                  ))}
                </div>
                {/* Mini bar */}
                {ed.customers > 0 && (
                  <div style={{ height: 5, borderRadius: 99, background: 'var(--os-surface-0)', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, ed.customers * 10)}%`, height: '100%', background: color, borderRadius: 99 }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* OIS Distribution table */}
      {distribution.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>OIS Distribution by Vertical</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--os-surface-0)' }}>
                {['Vertical', 'Blueprints', 'Avg OIS', 'Min OIS', 'Max OIS', 'Range'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: T2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distribution.map((d: any, i: number) => {
                const color = COLORS[d.slug] ?? '#7c3aed'
                return (
                  <tr key={d.slug} style={{ borderTop: `1px solid ${BDR}`, background: i % 2 === 0 ? undefined : 'var(--os-surface-0)' }}>
                    <td style={{ padding: '10px 16px', fontWeight: 800, color }}>{LABELS[d.slug] ?? d.slug}</td>
                    <td style={{ padding: '10px 16px', color: T1, fontVariantNumeric: 'tabular-nums' }}>{d.count}</td>
                    <td style={{ padding: '10px 16px', color, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{d.avg}</td>
                    <td style={{ padding: '10px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>{d.min}</td>
                    <td style={{ padding: '10px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>{d.max}</td>
                    <td style={{ padding: '10px 16px', color: T2, fontVariantNumeric: 'tabular-nums' }}>{d.count > 0 ? (d.max - d.min).toFixed(1) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-editions"
          style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Edition Pricing <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-gate-s140"
          style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Gate S140 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}
