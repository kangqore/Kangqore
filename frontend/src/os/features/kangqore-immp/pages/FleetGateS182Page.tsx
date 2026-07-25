import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight, Star } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b', TEAL = '#00ddaa', BLUE = '#4fc3f7'

const FLEET_LINKS = [
  { title: 'Fleet Intelligence',    path: 'fleet-intelligence',     icon: '🛰️' },
  { title: 'Health Score v2',       path: 'health-score-v2',        icon: '💚' },
  { title: 'Playbook Engine',       path: 'playbook-engine',        icon: '📋' },
  { title: 'Renewal Intel v2',      path: 'renewal-intel-v2',       icon: '🔄' },
  { title: 'Onboarding Engine',     path: 'onboarding-engine',      icon: '🚀' },
  { title: 'Case Studies',          path: 'fleet-seventy-five',     icon: '📊' },
]

export function FleetGateS182Page() {
  const [publishing, setPublishing] = useState(false)
  const q = useQuery({
    queryKey: ['s182-status'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/s182-status').then(r => r.data),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  })

  const criteria: any[]   = q.data?.criteria ?? []
  const passed            = q.data?.passed ?? 0
  const total             = q.data?.total  ?? 5
  const score             = q.data?.score  ?? 0
  const fleetSize         = q.data?.fleetSize ?? 0
  const coigCoverage      = q.data?.coigCoverage ?? 0
  const avgOisTarget      = q.data?.avgOisTarget ?? 0
  const renewalRate       = q.data?.renewalRate ?? 0
  const renewalCohortSize = q.data?.renewalCohortSize ?? 0
  const topCandidate      = q.data?.topCandidate ?? null
  const caseStudyPublished= q.data?.caseStudyPublished ?? false
  const allPass           = passed === total && total > 0

  const publishCaseStudy = async () => {
    setPublishing(true)
    await api.post('/admin/kangqore-immp/customers/fleet/case-studies/publish').catch(() => {})
    await q.refetch()
    setPublishing(false)
  }

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">

      {/* Hero */}
      <div style={{
        padding: '24px 28px', borderRadius: 18,
        background: allPass ? 'rgba(16,185,129,0.06)' : 'rgba(0,221,170,0.04)',
        border: `1px solid ${allPass ? 'rgba(16,185,129,0.25)' : 'rgba(0,221,170,0.15)'}`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 58, height: 58, borderRadius: 16, flexShrink: 0,
          background: allPass ? 'rgba(16,185,129,0.12)' : 'rgba(0,221,170,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trophy style={{ width: 30, height: 30, color: allPass ? GREEN : TEAL }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: TEAL, marginBottom: 4 }}>
            ⭐ Gate S182 · Track 1 Gate
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T1, lineHeight: 1.2 }}>
            75-Customer Fleet · COIG North Star Live
          </div>
          <div style={{ fontSize: 12, color: T2, marginTop: 4 }}>
            Fleet health dashboard passes · COIG tracked for every customer · First case study published
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: allPass ? GREEN : TEAL, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 700, marginTop: 4 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Fleet metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Fleet Size',       value: fleetSize,         color: '#a78bfa', suffix: '' },
          { label: 'COIG Coverage',    value: coigCoverage,      color: TEAL,      suffix: '%' },
          { label: 'Avg OIS Target',   value: avgOisTarget,      color: BLUE,      suffix: ' pts' },
          { label: 'Gate Score',       value: score,             color: allPass ? GREEN : AMBER, suffix: '%' },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {m.value}{m.suffix}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginTop: 6 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Star style={{ width: 14, height: 14, color: TEAL }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Gate S182 Criteria</span>
        </div>
        {q.isLoading ? (
          <p style={{ padding: 24, color: T2, fontSize: 12 }}>Evaluating criteria…</p>
        ) : (
          <div>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px',
                borderTop: i > 0 ? `1px solid ${BDR}` : undefined,
                background: c.passed ? 'rgba(16,185,129,0.02)' : undefined,
              }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? T1 : T2 }}>{c.label}</div>
                  {c.detail && (
                    <div style={{ fontSize: 11, color: c.passed ? 'rgba(16,185,129,0.7)' : T2, marginTop: 3 }}>{c.detail}</div>
                  )}
                </div>

                {/* G5 publish button */}
                {c.id === 'G5' && !c.passed && topCandidate && (
                  <button
                    onClick={publishCaseStudy}
                    disabled={publishing}
                    style={{
                      background: 'rgba(0,221,170,0.12)', border: '1px solid rgba(0,221,170,0.3)',
                      color: TEAL, padding: '6px 14px', borderRadius: 8, cursor: publishing ? 'default' : 'pointer',
                      fontSize: 11, fontWeight: 700, flexShrink: 0, opacity: publishing ? 0.6 : 1,
                    }}
                  >
                    {publishing ? 'Publishing…' : `Publish: ${topCandidate.name}`}
                  </button>
                )}

                {/* G4 renewal detail */}
                {c.id === 'G4' && renewalCohortSize === 0 && (
                  <Link
                    to="/kangqore-view/admin/kangqore-immp/renewal-intel-v2"
                    style={{ fontSize: 11, fontWeight: 700, color: BLUE, textDecoration: 'none', flexShrink: 0 }}
                  >
                    Log outcomes →
                  </Link>
                )}

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

      {/* COIG North Star declaration */}
      <div style={{
        padding: '22px 26px', borderRadius: 16,
        background: 'rgba(0,221,170,0.04)', border: '1px solid rgba(0,221,170,0.15)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: TEAL, marginBottom: 10 }}>
          COIG North Star Declaration
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: T1, lineHeight: 1.7, marginBottom: 12 }}>
              <strong style={{ color: TEAL }}>COIG</strong> — Customer Outcomes Intelligence Gate — is Kangqore's north-star metric.
              It measures the <em>delta</em> in Organisational Intelligence Score (OIS) attributable to WAANDA deployment across the customer fleet.
            </div>
            <div style={{ fontSize: 12, color: T2, lineHeight: 1.7 }}>
              Every active blueprint tracks an OIS baseline, a contracted target, and real-time attribution signals.
              Gate S182 declares COIG fully live when 80%+ of the fleet has active measurement and the first
              public case study validates the model.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Fleet covered',     value: `${coigCoverage}%`,   ok: coigCoverage >= 80,  desc: 'blueprints with active OIS baseline' },
              { label: 'Avg OIS trajectory',value: `${avgOisTarget} pts`,ok: avgOisTarget >= 70,  desc: 'contracted target across fleet' },
              { label: 'Renewal cohort',    value: renewalCohortSize > 0 ? `${renewalRate}%` : '—', ok: renewalCohortSize > 0 && renewalRate >= 80, desc: 'Day-90 renewal rate' },
              { label: 'Case study',        value: caseStudyPublished ? 'Live' : 'Pending', ok: caseStudyPublished, desc: 'public COIG validation' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: m.ok ? GREEN : AMBER,
                  boxShadow: m.ok ? `0 0 6px ${GREEN}80` : undefined,
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{m.label}</span>
                  <span style={{ fontSize: 11, color: T2, marginLeft: 6 }}>— {m.desc}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: m.ok ? TEAL : AMBER, fontVariantNumeric: 'tabular-nums' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links to fleet feature pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {FLEET_LINKS.map((l, i) => (
          <Link
            key={l.title}
            to={`/kangqore-view/admin/kangqore-immp/${l.path}`}
            style={{
              display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px',
              borderRadius: 12, background: CARD,
              border: `1px solid ${i < passed ? 'rgba(16,185,129,0.25)' : BDR}`,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{l.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: TEAL, marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* All-pass celebration */}
      {allPass && (
        <div style={{
          padding: '22px 26px', borderRadius: 16,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, marginBottom: 8 }}>
            🏆 Gate S182 PASSED — COIG North Star is Live
          </div>
          <div style={{ fontSize: 13, color: T2, lineHeight: 1.7 }}>
            {fleetSize} organic customers provisioned. COIG measured across {coigCoverage}% of fleet.
            Fleet avg OIS trajectory: {avgOisTarget} pts. Renewal cohort active at {renewalRate}%.
            First COIG case study published. Chapter 10 intelligence foundation is complete.
          </div>
        </div>
      )}
    </div>
  )
}
