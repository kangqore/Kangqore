import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { ChevronRight } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'

const REGION_META: Record<string, { color: string; flag: string; path: string }> = {
  UK:    { color: '#3b82f6', flag: '🇬🇧', path: 'uk-launch'    },
  EU:    { color: '#7c3aed', flag: '🇪🇺', path: 'eu-launch'    },
  INDIA: { color: '#f59e0b', flag: '🇮🇳', path: 'india-launch' },
}

export function RegionalAnalyticsPage() {
  const analyticsQ = useQuery({
    queryKey: ['intl-regional-analytics'],
    queryFn:  () => api.get('/admin/kangqore-immp/intl/regional-analytics').then(r => r.data),
    staleTime: 30_000,
  })

  const data = analyticsQ.data ?? {}
  const byRegion: any[] = data.byRegion ?? []
  const totalMRR: number = data.totalMRR ?? 0
  const totalCustomers: number = data.totalCustomers ?? 0

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">

      {/* Header */}
      <div style={{ padding: '18px 22px', borderRadius: 14, background: GREEN + '08', border: `1px solid ${GREEN}25` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>S156 — Regional Analytics</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: T1, marginBottom: 4 }}>International Revenue & OIS — by Region</div>
        <div style={{ fontSize: 12, color: T2 }}>ARR by region normalised to GBP (EUR×0.86, INR×0.0091) · OIS by geography · customer distribution</div>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Total Intl MRR',       value: `£${totalMRR.toLocaleString()}`,   color: GREEN },
          { label: 'Intl Customers',        value: totalCustomers,                    color: '#3b82f6' },
          { label: 'Regions Commercially Live', value: byRegion.filter(r => r.isLive).length + ' / 3', color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-region cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {byRegion.map(r => {
          const meta = REGION_META[r.region] ?? { color: '#64748b', flag: '🌍', path: 'intl-analytics' }
          return (
            <div key={r.region} style={{ background: CARD, border: `1px solid ${meta.color}20`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{meta.flag}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{r.region}</div>
                  <div style={{ fontSize: 10, color: T2 }}>{r.currency} pricing · {r.isLive ? 'LIVE' : 'Pending'}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: meta.color, fontVariantNumeric: 'tabular-nums' }}>{r.symbol}{(r.mrrLocal ?? 0).toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 700 }}>Local MRR · £{(r.mrrGBP ?? 0).toLocaleString()} GBP</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: T1, fontVariantNumeric: 'tabular-nums' }}>{r.customerCount}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 700 }}>Customers</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: r.avgOIS >= 75 ? GREEN : '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>{r.avgOIS > 0 ? r.avgOIS : '—'}</div>
                    <div style={{ fontSize: 9, color: T2, fontWeight: 700 }}>Avg OIS</div>
                  </div>
                </div>
              </div>

              {/* Customer mini-list */}
              {r.customers && r.customers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {r.customers.map((c: any, i: number) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: meta.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 900, color: meta.color }}>{c.customerRef}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: T2 }}>{c.industry} · {c.planTier} · DPA {c.dpaSigned ? '✓' : '—'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: meta.color, fontVariantNumeric: 'tabular-nums' }}>OIS {(c.oisCurrent ?? 0).toFixed(1)}</div>
                        <div style={{ fontSize: 9, color: T2 }}>from {(c.oisBaseline ?? 0).toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {r.customers?.length === 0 && (
                <div style={{ padding: '14px 20px', fontSize: 11, color: T2 }}>
                  No customers yet — use the region launch page to seed the cohort.
                </div>
              )}

              <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Link to={`/kangqore-view/admin/kangqore-immp/${meta.path}`}
                  style={{ fontSize: 10, fontWeight: 700, color: meta.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Region Config <ChevronRight style={{ width: 11, height: 11 }} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {byRegion.length === 0 && (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '24px', textAlign: 'center', color: T2, fontSize: 12 }}>
          No regional data yet — seed UK, EU, and India from their launch pages.
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/intl-gate-s157" style={{ fontSize: 11, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Gate S157 <ChevronRight style={{ width: 12, height: 12 }} /></Link>
        <Link to="/kangqore-view/admin/kangqore-immp/intl-personas"   style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Regional Personas <ChevronRight style={{ width: 12, height: 12 }} /></Link>
      </div>
    </div>
  )
}
