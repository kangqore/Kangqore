import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { Shield, ChevronRight, Cpu, Scale, HeartPulse } from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'

const EDITION_META: Record<string, { Icon: any; cohort: string; cohortPath: string }> = {
  healthtech: { Icon: HeartPulse, cohort: 'C21–C23',  cohortPath: 'twenty-one'   },
  legaltech:  { Icon: Scale,      cohort: 'C24–C26',  cohortPath: 'twenty-four'  },
  fintech:    { Icon: Cpu,        cohort: 'C27–C29',  cohortPath: 'twenty-seven' },
}

const TIERS = ['STARTER', 'PRO', 'ENTERPRISE'] as const

export function VerticalEditionPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['vertical-editions-pricing'],
    queryFn:  () => api.get('/admin/kangqore-immp/vertical-editions/pricing').then(r => r.data.pricing as any[]),
    staleTime: 60_000,
  })

  return (
    <div style={{ maxWidth: 1200 }} className="space-y-6">

      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: T1, margin: 0 }}>Vertical SaaS Editions</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>
          Three purpose-built editions with dedicated AI personas, compliance profiles, and vertical-specific pricing.
        </p>
      </div>

      {/* Edition Cards */}
      {isLoading ? (
        <p style={{ color: T2, fontSize: 12 }}>Loading editions…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {(data ?? []).map((ed: any) => {
            const meta = EDITION_META[ed.slug] ?? {}
            const Icon = meta.Icon ?? Shield
            const tiers: Record<string, any> = ed.planTiers ?? {}
            return (
              <div key={ed.slug} style={{ background: CARD, border: `1px solid ${ed.personaColor}30`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${BDR}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: ed.personaColor + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 20, height: 20, color: ed.personaColor }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: T1 }}>{ed.displayName}</div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: ed.personaColor, letterSpacing: '.08em' }}>
                        {ed.personaName} PERSONA
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {(ed.complianceFlags ?? []).map((f: string) => (
                      <span key={f} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: ed.personaColor + '10', color: ed.personaColor, border: `1px solid ${ed.personaColor}25` }}>{f}</span>
                    ))}
                  </div>
                </div>

                {/* Pricing tiers */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TIERS.map(tier => {
                    const t = tiers[tier]
                    if (!t) return null
                    return (
                      <div key={tier} style={{ padding: '12px 14px', borderRadius: 10, background: tier === 'ENTERPRISE' ? ed.personaColor + '08' : 'var(--os-surface-0)', border: `1px solid ${tier === 'ENTERPRISE' ? ed.personaColor + '25' : BDR}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: tier === 'ENTERPRISE' ? ed.personaColor : T2 }}>{tier}</span>
                          <span style={{ fontSize: 18, fontWeight: 900, color: T1, fontVariantNumeric: 'tabular-nums' }}>
                            £{t.priceGBP.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 600, color: T2 }}>/mo</span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {(t.features ?? []).map((f: string) => (
                            <div key={f} style={{ fontSize: 10, color: T2, display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                              <span style={{ color: ed.personaColor, lineHeight: 1.5, flexShrink: 0 }}>✓</span>{f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: T2 }}>Cohort: {meta.cohort ?? '—'}</span>
                  <Link
                    to={`/kangqore-view/admin/kangqore-immp/customers/${meta.cohortPath ?? ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: ed.personaColor, textDecoration: 'none' }}
                  >
                    View first customer <ChevronRight style={{ width: 11, height: 11 }} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Comparison table */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Edition Comparison</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--os-surface-0)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: T2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em' }}>Feature</th>
                {['HealthTech', 'LegalTech', 'FinTech'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 700, color: T1, fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['WAANDA Persona',        'ARIA',           'LEX',             'FINX'],
                ['Primary Compliance',     'HIPAA',          'GDPR + BAR',      'SOX + PCI'],
                ['Starter Price',          '£299/mo',        '£349/mo',         '£399/mo'],
                ['Enterprise Price',       '£1,999/mo',      '£2,199/mo',       '£2,499/mo'],
                ['Domain OIS Pack',        'Clinical-Ops',   'Matter-Mgmt',     'Trade-Compliance'],
                ['AEGIS Profile',          'Clinical audit', 'Jurisdiction-aware', 'Risk monitoring'],
                ['Data sensitivity',       'PHI / ePHI',     'PII / Privileged', 'Financial records'],
              ].map(([feature, ...vals], i) => (
                <tr key={feature} style={{ borderTop: `1px solid ${BDR}`, background: i % 2 === 0 ? undefined : 'var(--os-surface-0)' }}>
                  <td style={{ padding: '10px 16px', color: T2, fontWeight: 600 }}>{feature}</td>
                  {vals.map((v, j) => {
                    const colors = ['#10b981', '#3b82f6', '#f59e0b']
                    return (
                      <td key={j} style={{ padding: '10px 16px', textAlign: 'center', color: colors[j], fontWeight: 700 }}>{v}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-analytics"
          style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Vertical Analytics <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/vertical-gate-s140"
          style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Gate S140 <ChevronRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>
    </div>
  )
}
