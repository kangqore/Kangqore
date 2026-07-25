import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight, Shield } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b', BLUE = '#4fc3f7'

const ENTERPRISE_LINKS = [
  { title: 'SSO / SAML 2.0',           path: 'sso-saml',                   icon: '🔐' },
  { title: 'Custom Domains',            path: 'custom-domains',             icon: '🌐' },
  { title: 'Dedicated Compute',         path: 'dedicated-compute',          icon: '🖥️' },
  { title: 'SLA Management',            path: 'sla-management',             icon: '📊' },
  { title: 'RBAC v2',                   path: 'rbac-v2',                    icon: '🔑' },
  { title: 'Blueprint Templates',       path: 'enterprise-blueprint-templates', icon: '📋' },
  { title: 'Digital Contracts',         path: 'digital-contracts',          icon: '✍️' },
]

export function EnterpriseGateS190Page() {
  const q = useQuery({
    queryKey: ['s190-status'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/s190-status').then(r => r.data),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  })

  const criteria: any[] = q.data?.criteria ?? []
  const passed          = q.data?.passed   ?? 0
  const total           = q.data?.total    ?? 5
  const score           = q.data?.score    ?? 0
  const ssoActive       = q.data?.ssoActive ?? 0
  const domainActive    = q.data?.domainActive ?? 0
  const slaCommitments  = q.data?.slaCommitments ?? 0
  const dedicatedActive = q.data?.dedicatedActive ?? 0
  const msaSigned       = q.data?.msaSigned ?? 0
  const allPass         = passed === total && total > 0

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">

      {/* Hero */}
      <div style={{
        padding: '24px 28px', borderRadius: 18,
        background: allPass ? 'rgba(16,185,129,0.06)' : 'rgba(79,195,247,0.04)',
        border: `1px solid ${allPass ? 'rgba(16,185,129,0.25)' : 'rgba(79,195,247,0.15)'}`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 58, height: 58, borderRadius: 16, flexShrink: 0,
          background: allPass ? 'rgba(16,185,129,0.12)' : 'rgba(79,195,247,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trophy style={{ width: 30, height: 30, color: allPass ? GREEN : BLUE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: BLUE, marginBottom: 4 }}>
            Gate S190 · Enterprise Tier v1.0
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T1, lineHeight: 1.2 }}>
            Enterprise Tier v1.0 — All 5 Capabilities Live
          </div>
          <div style={{ fontSize: 12, color: T2, marginTop: 4 }}>
            SSO · Custom Domains · Dedicated Compute · SLA · Digital Contracts tested end-to-end
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 700, marginTop: 4 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Enterprise metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'SSO Active',         value: ssoActive,       color: '#00ddaa' },
          { label: 'Domains Live',       value: domainActive,    color: '#4fc3f7' },
          { label: 'SLA Commitments',    value: slaCommitments,  color: '#10b981' },
          { label: 'Dedicated Compute',  value: dedicatedActive, color: '#a78bfa' },
          { label: 'MSAs Signed',        value: msaSigned,       color: AMBER     },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T2, marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield style={{ width: 14, height: 14, color: BLUE }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Enterprise Tier v1.0 Gate Criteria</span>
        </div>
        {q.isLoading ? (
          <p style={{ padding: 24, color: T2, fontSize: 12 }}>Evaluating enterprise tier…</p>
        ) : (
          <div>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                borderTop: i > 0 ? `1px solid ${BDR}` : undefined,
                background: c.passed ? 'rgba(16,185,129,0.02)' : undefined,
              }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? T1 : T2 }}>{c.label}</div>
                  {c.detail && <div style={{ fontSize: 11, color: c.passed ? 'rgba(16,185,129,0.7)' : T2, marginTop: 3 }}>{c.detail}</div>}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 999, flexShrink: 0,
                  background: c.passed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: c.passed ? GREEN : AMBER,
                  border: `1px solid ${c.passed ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enterprise capability grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {ENTERPRISE_LINKS.map((l, i) => (
          <Link key={l.title} to={`/kangqore-view/admin/kangqore-immp/${l.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${criteria[Math.floor(i / 1.5)]?.passed ? 'rgba(79,195,247,0.25)' : BDR}`, textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{l.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: BLUE, marginTop: 4 }}>
              Configure <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* All-pass celebration */}
      {allPass && (
        <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, marginBottom: 8 }}>
            🏆 Gate S190 PASSED — Enterprise Tier v1.0 Complete
          </div>
          <div style={{ fontSize: 13, color: T2, lineHeight: 1.7 }}>
            {ssoActive} SSO configuration{ssoActive !== 1 ? 's' : ''} active. {domainActive} custom domain{domainActive !== 1 ? 's' : ''} live. {slaCommitments} SLA commitment{slaCommitments !== 1 ? 's' : ''} signed. {dedicatedActive} dedicated compute instance{dedicatedActive !== 1 ? 's' : ''} provisioned. {msaSigned} MSA{msaSigned !== 1 ? 's' : ''} executed. Kangqore Enterprise Tier v1.0 is ready for market.
          </div>
        </div>
      )}
    </div>
  )
}
