import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react'

const T1    = 'var(--os-text-1)'
const T2    = 'var(--os-text-2)'
const BDR   = 'var(--os-border)'
const CARD  = 'var(--os-card)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'

const INTL_PILLARS = [
  { title: 'UK Commercial Launch',  desc: 'GBP pricing + ICO persona + Stripe checkout active',            path: 'uk-launch',       flag: '🇬🇧' },
  { title: 'EU Commercial Launch',  desc: 'EUR pricing + GDPR-first onboarding + EU data residency',       path: 'eu-launch',       flag: '🇪🇺' },
  { title: 'India Commercial Launch', desc: 'INR/Razorpay + DPDP Act + India data residency',             path: 'india-launch',    flag: '🇮🇳' },
  { title: 'Regional Personas',     desc: 'WAANDA tuned per region (UK/EU/India tone + regulatory)',       path: 'intl-personas',   flag: '🤖' },
  { title: 'International Fleet',   desc: '6 customers provisioned (C30–C35) across UK/EU/India',          path: 'intl-analytics',  flag: '👥' },
]

export function IntlGatePage() {
  const gateQ = useQuery({
    queryKey: ['s157-status'],
    queryFn:  () => api.get('/admin/kangqore-immp/platform/s157-status').then(r => r.data),
    staleTime: 30_000,
  })

  const criteria: any[] = gateQ.data?.criteria ?? []
  const passed: number  = gateQ.data?.passed ?? 0
  const total: number   = gateQ.data?.total  ?? 5
  const score: number   = gateQ.data?.score  ?? 0
  const totalIntl: number = gateQ.data?.totalIntl ?? 0
  const allPass = passed === total

  return (
    <div style={{ maxWidth: 920 }} className="space-y-6">

      {/* Gate header */}
      <div style={{ padding: '22px 26px', borderRadius: 16, background: allPass ? GREEN + '08' : AMBER + '06', border: `1px solid ${allPass ? GREEN : AMBER}25`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: allPass ? GREEN + '15' : AMBER + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Trophy style={{ width: 28, height: 28, color: allPass ? GREEN : AMBER }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: T1 }}>Gate S157 — International GTM v1.0</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>3 regions live · 35 customers (C0–C35) · international ARR tracking</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 600 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>Gate Criteria</div>
        {gateQ.isLoading ? (
          <p style={{ padding: 20, color: T2, fontSize: 12 }}>Checking…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: c.passed ? T1 : T2 }}>{c.label}</div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: c.passed ? GREEN + '12' : AMBER + '10', color: c.passed ? GREEN : AMBER, border: `1px solid ${c.passed ? GREEN : AMBER}20` }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'Intl Customers',     value: totalIntl,     color: '#3b82f6' },
          { label: 'Total Fleet (C0-C35)', value: 30 + totalIntl, color: GREEN },
          { label: 'Regions Live',       value: criteria.filter((c: any) => c.id !== 'I4' && c.id !== 'I5' && c.passed).length + ' / 3', color: AMBER },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pillars nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {INTL_PILLARS.map((p, i) => (
          <Link key={p.title} to={`/kangqore-view/admin/kangqore-immp/${p.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${criteria[i]?.passed ? GREEN + '30' : BDR}`, textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>{p.flag}</span>
              {criteria[i]?.passed && <span style={{ fontSize: 9, fontWeight: 800, color: GREEN }}>✓</span>}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{p.title}</div>
            <div style={{ fontSize: 10, color: T2, lineHeight: 1.45 }}>{p.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#3b82f6', marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {allPass && (
        <div style={{ padding: '16px 22px', borderRadius: 14, background: GREEN + '08', border: `1px solid ${GREEN}25` }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: GREEN, marginBottom: 4 }}>✓ International GTM v1.0 declared — Track 3 complete</div>
          <div style={{ fontSize: 12, color: T2 }}>3 regions commercially live. 35-customer fleet achieved. Regional ARR intelligence active. Track 4 (Krisnam Gen4) begins next.</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/intl-analytics" style={{ fontSize: 11, fontWeight: 700, color: GREEN, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Regional Analytics <ChevronRight style={{ width: 12, height: 12 }} /></Link>
        <Link to="/kangqore-view/admin/kangqore-immp/oem-gate-s148"  style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>← Gate S148 (OEM) <ChevronRight style={{ width: 12, height: 12 }} /></Link>
      </div>
    </div>
  )
}
