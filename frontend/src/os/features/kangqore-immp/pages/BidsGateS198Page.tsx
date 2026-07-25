import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@lib/api'
import { CheckCircle2, XCircle, Trophy, ChevronRight } from 'lucide-react'

const T1 = 'var(--os-text-1)', T2 = 'var(--os-text-2)', BDR = 'var(--os-border)', CARD = 'var(--os-card)'
const GREEN = '#10b981', AMBER = '#f59e0b', BLUE = '#4fc3f7'

const BIDS_LINKS = [
  { title: 'Scorecard Engine',      path: 'bids-scorecard',             icon: '📊', desc: 'S191 · 16-pillar scoring' },
  { title: 'Report Generator',      path: 'bids-report-generator',      icon: '📋', desc: 'S192 · 10 deliverables' },
  { title: 'Client Portal',         path: 'bids-client-portal',         icon: '🖥️',  desc: 'S193 · engagement progress' },
  { title: 'Blueprint Prescription',path: 'bids-blueprint-prescription', icon: '🗺️', desc: 'S194 · diagnostic → blueprint' },
  { title: 'Vertical Packs',        path: 'bids-vertical-packs',        icon: '🎯', desc: 'S195 · ARIA · LEX · FINX' },
  { title: 'Partner Delivery',      path: 'bids-partner-delivery',      icon: '🤝', desc: 'S196 · OEM white-label' },
  { title: 'SMB Self-Serve',        path: 'bids-smb-scan',              icon: '⚡', desc: 'S197 · £2,499 quick-scan' },
]

export function BidsGateS198Page() {
  const q = useQuery({
    queryKey: ['s198-status'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/s198-status').then(r => r.data),
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  })

  const criteria: any[] = q.data?.criteria ?? []
  const passed           = q.data?.passed   ?? 0
  const total            = q.data?.total    ?? 5
  const score            = q.data?.score    ?? 0
  const activeEngagements      = q.data?.activeEngagements      ?? 0
  const uniqueDeliverableTypes = q.data?.uniqueDeliverableTypes ?? 0
  const partnerEngagements     = q.data?.partnerEngagements     ?? 0
  const smbComplete            = q.data?.smbComplete            ?? 0
  const convertedEngagements   = q.data?.convertedEngagements   ?? 0
  const allPass = passed === total && total > 0

  return (
    <div style={{ maxWidth: 960 }} className="space-y-6">

      {/* Hero */}
      <div style={{
        padding: '24px 28px', borderRadius: 18,
        background: allPass ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.03)',
        border: `1px solid ${allPass ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.12)'}`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{ width: 58, height: 58, borderRadius: 16, flexShrink: 0, background: allPass ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy style={{ width: 30, height: 30, color: GREEN }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: GREEN, marginBottom: 4 }}>Gate S198 · BIDS™ v1.0 Commercial</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T1, lineHeight: 1.2 }}>Diagnostic Intelligence System — Commercial Launch</div>
          <div style={{ fontSize: 12, color: T2, marginTop: 4 }}>
            16-pillar scoring · 10 WAANDA deliverables · OEM partner delivery · SMB self-serve · Blueprint conversion
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: allPass ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{score}%</div>
          <div style={{ fontSize: 10, color: T2, fontWeight: 700, marginTop: 4 }}>{passed}/{total} criteria</div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Engagements',   value: activeEngagements,       color: BLUE   },
          { label: 'Deliverable Types',    value: `${uniqueDeliverableTypes}/10`, color: GREEN  },
          { label: 'OEM Engagements',      value: partnerEngagements,      color: '#a78bfa' },
          { label: 'SMB Scans',            value: smbComplete,             color: AMBER  },
          { label: 'Converted → Blueprint',value: convertedEngagements,    color: GREEN  },
        ].map(m => (
          <div key={m.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T2, marginTop: 5 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Gate criteria */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, fontSize: 13, fontWeight: 800, color: T1 }}>
          BIDS™ v1.0 Commercial — Gate Criteria
        </div>
        {q.isLoading ? (
          <p style={{ padding: 24, color: T2, fontSize: 12 }}>Evaluating gate…</p>
        ) : (
          <div>
            {criteria.map((c: any, i: number) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderTop: i > 0 ? `1px solid ${BDR}` : undefined, background: c.passed ? 'rgba(16,185,129,0.02)' : undefined }}>
                {c.passed
                  ? <CheckCircle2 style={{ width: 18, height: 18, color: GREEN, flexShrink: 0 }} />
                  : <XCircle     style={{ width: 18, height: 18, color: AMBER, flexShrink: 0 }} />
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? T1 : T2 }}>{c.label}</div>
                  {c.detail && <div style={{ fontSize: 11, color: c.passed ? 'rgba(16,185,129,0.7)' : T2, marginTop: 3 }}>{c.detail}</div>}
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 999, flexShrink: 0, background: c.passed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: c.passed ? GREEN : AMBER, border: `1px solid ${c.passed ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                  {c.passed ? 'PASS' : 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick-links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {BIDS_LINKS.map(l => (
          <Link key={l.title} to={`/kangqore-view/admin/kangqore-immp/${l.path}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 16px', borderRadius: 12, background: CARD, border: `1px solid ${BDR}`, textDecoration: 'none' }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div style={{ fontSize: 12, fontWeight: 800, color: T1 }}>{l.title}</div>
            <div style={{ fontSize: 10, color: T2 }}>{l.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: GREEN, marginTop: 4 }}>
              Open <ChevronRight style={{ width: 11, height: 11 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* All-pass banner */}
      {allPass && (
        <div style={{ padding: '22px 26px', borderRadius: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, marginBottom: 8 }}>🏆 Gate S198 PASSED — BIDS™ v1.0 Commercial Live</div>
          <div style={{ fontSize: 13, color: T2, lineHeight: 1.7 }}>
            {activeEngagements} active engagement{activeEngagements !== 1 ? 's' : ''}. All 10 WAANDA deliverables generating. {partnerEngagements} OEM partner engagement{partnerEngagements !== 1 ? 's' : ''} live. {smbComplete} SMB self-serve scan{smbComplete !== 1 ? 's' : ''} completed. {convertedEngagements} BIDS→Blueprint conversion{convertedEngagements !== 1 ? 's' : ''}. BIDS™ Diagnostic Intelligence System is commercially live.
          </div>
        </div>
      )}
    </div>
  )
}
