import { useRef, useEffect } from 'react'
import {
  Printer, TrendingUp, AlertTriangle, CheckCircle2,
  FileText, Calendar, Sparkles, Shield, Activity,
  ArrowRight, Clock,
} from 'lucide-react'
import { useClientProjects, useClientInvoices, useClientRisks, type ClientProject } from '../useClientData'

// ── Design tokens (match ClientDashboard) ─────────────────────────────────────

const CARD  = 'rgba(15, 23, 42, 0.5)'
const RAISE = 'rgba(30, 41, 59, 0.5)'
const EDGE  = 'rgba(30, 41, 59, 0.6)'
const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _injected2 = false
function ensureKeyframes() {
  if (_injected2) return; _injected2 = true
  const s = document.createElement('style')
  s.textContent = `@keyframes _rptFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`
  document.head.appendChild(s)
}

function anim(ms: number): React.CSSProperties {
  return { animation: `_rptFadeUp 0.5s ${EASE} ${ms}ms both` }
}

// ── Static data ────────────────────────────────────────────────────────────────

const SLA_ITEMS = [
  { metric: 'P1 Response SLA',   target: '< 2h',   current: '1.4h',  met: true,  pct: 93 },
  { metric: 'P2 Response SLA',   target: '< 8h',   current: '6.2h',  met: true,  pct: 78 },
  { metric: 'Staging Uptime',    target: '99.5%',  current: '99.8%', met: true,  pct: 99 },
  { metric: 'Sprint Delivery',   target: '90%',    current: '87%',   met: false, pct: 87 },
  { metric: 'Change Lead Time',  target: '< 5d',   current: '4.1d',  met: true,  pct: 82 },
]

const RECENT_ACTIVITY = [
  { type: 'delivery',  label: 'Sprint 13 build deployed to staging',     date: '17 Jun', color: BLUE   },
  { type: 'document',  label: 'HIPAA audit Phase 2 report shared',       date: '14 Jun', color: PURPLE },
  { type: 'meeting',   label: 'Monthly steering committee completed',     date: '12 Jun', color: PURPLE },
  { type: 'invoice',   label: 'Invoice INV-2026-041 issued — ₹42,000',   date: '10 Jun', color: AMBER  },
  { type: 'milestone', label: 'Patient Portal beta scope finalised',      date: '7 Jun',  color: GREEN  },
  { type: 'change',    label: 'Change request CR-014 approved',           date: '5 Jun',  color: BLUE   },
]

const ACTIVITY_COLOR: Record<string, string> = {
  delivery: BLUE, document: PURPLE, meeting: PURPLE,
  invoice: AMBER, milestone: GREEN, change: BLUE,
}

const HEALTH_COLOR: Record<string, string> = {
  'on-track': GREEN, 'at-risk': AMBER, 'behind': RED, 'completed': BLUE,
}

const SEV_COLOR: Record<string, string> = {
  CRITICAL: RED, HIGH: AMBER, MEDIUM: '#0073ea', LOW: '#64748b',
}

const fmt     = (n: number) => `₹${n.toLocaleString()}`
const today   = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const period  = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label, color, delay = 0 }: {
  value: string | number; label: string; color: string; delay?: number
}) {
  return (
    <div style={{
      ...anim(delay),
      borderRadius: 16, padding: '18px 20px',
      background: CARD, border: `1px solid ${color}18`,
      borderTop: `2px solid ${color}50`,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <p style={{ fontSize: 28, fontWeight: 900, color: '#f1f5f9', margin: 0, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{label}</p>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function Section({ title, icon: Icon, iconColor, children, delay = 0 }: {
  title: string; icon: React.ElementType; iconColor: string; children: React.ReactNode; delay?: number
}) {
  return (
    <div style={anim(delay)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon style={{ width: 14, height: 14, color: iconColor }} />
        <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function Bar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.width = '0%'
    const id = setTimeout(() => { el.style.width = `${pct}%` }, 400)
    return () => clearTimeout(id)
  }, [pct])
  return (
    <div style={{ height: 4, borderRadius: 999, background: EDGE, overflow: 'hidden', marginTop: 8 }}>
      <div ref={ref} style={{
        height: '100%', borderRadius: 999,
        background: color, boxShadow: `0 0 8px ${color}55`,
        width: '0%', transition: `width 0.9s ${EASE}`,
      }} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientExecutiveReport() {
  useEffect(() => { ensureKeyframes() }, [])

  const { data: apiProjects } = useClientProjects()
  const { data: apiInvoices } = useClientInvoices()
  const { data: apiRisks }    = useClientRisks()

  const projects: ClientProject[] = apiProjects ?? []
  const invoices = (apiInvoices as Record<string, unknown>[] | undefined) ?? []
  const risks    = (apiRisks as { id: string; title: string; severity: string; owner?: string; due: string }[] | undefined) ?? []

  const totalInvoiced  = invoices.reduce((s, i) => s + Number(i.amount ?? 0), 0)
  const totalCollected = invoices
    .filter(i => String(i.status ?? '').toLowerCase() === 'paid')
    .reduce((s, i) => s + Number(i.amount ?? 0), 0)
  const outstanding    = totalInvoiced - totalCollected

  const onTrack   = projects.filter(p => p.health === 'on-track').length
  const atRisk    = projects.filter(p => p.health === 'at-risk' || p.health === 'behind').length
  const slaScore  = Math.round(SLA_ITEMS.filter(s => s.met).length / SLA_ITEMS.length * 100)

  const waandaBrief = projects.length === 0
    ? `No active projects found for this account. Contact your account manager to get started.`
    : atRisk === 0
      ? `All ${projects.length} engagement${projects.length > 1 ? 's are' : ' is'} progressing on schedule. SLA compliance at ${slaScore}% — all critical response targets met. ${risks.length === 0 ? 'No open risks this period.' : `${risks.length} risk${risks.length > 1 ? 's' : ''} under active monitoring.`}`
      : `${onTrack} of ${projects.length} projects are on track. ${projects.find(p => p.health !== 'on-track')?.name} requires attention — milestone sign-off is client-blocked and deadline risk is elevated. Immediate stakeholder alignment recommended.`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        ...anim(0),
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', margin: '0 0 6px' }}>
            Confidential · Client Report
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
            Executive Engagement Report
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0' }}>
            Kangqore × GlobeMed Group · {period} · Generated {today}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 10, flexShrink: 0,
            background: RAISE, border: `1px solid ${EDGE}`,
            color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: `all 0.2s ${EASE}`,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f1f5f9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8' }}
        >
          <Printer style={{ width: 13, height: 13, flexShrink: 0 }} />
          Export PDF
        </button>
      </div>

      {/* ── WAANDA synthesis ────────────────────────────────────────────────── */}
      <div style={{
        ...anim(60),
        borderRadius: 16,
        background: 'rgba(127, 83, 249, 0.05)',
        border: '1px solid rgba(127, 83, 249, 0.15)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'rgba(127,83,249,0.15)', border: '1px solid rgba(127,83,249,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        }}>
          <Sparkles style={{ width: 14, height: 14, color: '#a78bfa' }} />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', margin: '0 0 6px' }}>
            WAANDA Executive Synthesis
          </p>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{waandaBrief}</p>
        </div>
      </div>

      {/* ── Portfolio KPIs ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard value={projects.length} label="Active projects"   color={BLUE}   delay={80}  />
        <StatCard value={onTrack}         label="On track"          color={GREEN}  delay={140} />
        <StatCard value={atRisk}          label="At risk"           color={AMBER}  delay={200} />
        <StatCard value={`${slaScore}%`}  label="SLA compliance"    color={PURPLE} delay={260} />
        <StatCard value={risks.length}    label="Open risks"        color={RED}    delay={320} />
      </div>

      {/* ── Projects ────────────────────────────────────────────────────────── */}
      <Section title="Project Portfolio" icon={Activity} iconColor={BLUE} delay={320}>
        {projects.length === 0 ? (
          <div style={{ borderRadius: 14, padding: 24, background: CARD, border: `1px solid ${EDGE}`, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>No active projects. Contact your account manager to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map(p => {
              const hc = HEALTH_COLOR[p.health] ?? AMBER
              const budgetPct = p.budget > 0 ? Math.round(p.spent / p.budget * 100) : 0
              const milestoneLabel = p.nextMilestone && p.nextMilestone !== '—' ? p.nextMilestone : null
              const milestoneDate  = p.milestoneDate
                ? new Date(p.milestoneDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : ''
              return (
                <div key={p.id} style={{
                  borderRadius: 14, padding: 16,
                  background: CARD, border: `1px solid ${EDGE}`,
                  borderLeft: `3px solid ${hc}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{p.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          padding: '2px 8px', borderRadius: 999,
                          color: hc, background: `${hc}14`, border: `1px solid ${hc}25`,
                        }}>
                          {p.health === 'on-track' ? 'On Track' : p.health === 'at-risk' ? 'At Risk' : 'Behind'}
                        </span>
                        {p.budget > 0 && (
                          <span style={{ fontSize: 11, color: '#475569' }}>
                            Budget: {fmt(p.spent)} / {fmt(p.budget)} ({budgetPct}% utilised)
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                        {p.progress}%
                      </p>
                      <p style={{ fontSize: 10, color: '#475569', margin: '2px 0 0' }}>complete</p>
                    </div>
                  </div>

                  <Bar pct={p.progress} color={p.health !== 'on-track' ? AMBER : BLUE} />

                  {milestoneLabel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                      <Calendar style={{ width: 10, height: 10, color: '#475569' }} />
                      <span style={{ fontSize: 11, color: '#64748b' }}>
                        Next: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{milestoneLabel}</span>
                        {milestoneDate && ` · ${milestoneDate}`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* ── Financial summary ────────────────────────────────────────────────── */}
      <Section title="Financial Summary" icon={TrendingUp} iconColor={AMBER} delay={400}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Total Invoiced',  value: fmt(totalInvoiced),  color: BLUE,  icon: FileText      },
            { label: 'Collected',       value: fmt(totalCollected), color: GREEN, icon: CheckCircle2  },
            { label: 'Outstanding',     value: fmt(outstanding),    color: outstanding > 0 ? AMBER : GREEN, icon: AlertTriangle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} style={{
              borderRadius: 14, padding: 18,
              background: CARD, border: `1px solid ${color}18`,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `${color}12`, border: `1px solid ${color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: 14, height: 14, color }} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {value}
                </p>
                <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SLA Scorecard ────────────────────────────────────────────────────── */}
      <Section title="SLA Scorecard" icon={Shield} iconColor={PURPLE} delay={460}>
        <div style={{ borderRadius: 14, background: CARD, border: `1px solid ${EDGE}`, overflow: 'hidden' }}>
          {SLA_ITEMS.map((s, i) => (
            <div key={s.metric} style={{
              padding: '14px 18px',
              borderTop: i > 0 ? `1px solid ${EDGE}` : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{s.metric}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.met ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
                      {s.current}
                    </span>
                    <span style={{ fontSize: 10, color: '#334155' }}>/ {s.target}</span>
                    {s.met
                      ? <CheckCircle2 style={{ width: 12, height: 12, color: GREEN }} />
                      : <AlertTriangle style={{ width: 12, height: 12, color: AMBER }} />
                    }
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: EDGE }}>
                  <div style={{
                    height: '100%', borderRadius: 999, width: `${s.pct}%`,
                    background: s.met ? GREEN : AMBER,
                    boxShadow: `0 0 5px ${s.met ? GREEN : AMBER}50`,
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Open risks ───────────────────────────────────────────────────────── */}
      {risks.length > 0 && (
        <Section title="Open Risks" icon={AlertTriangle} iconColor={RED} delay={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {risks.map(r => {
              const sc = SEV_COLOR[r.severity] ?? AMBER
              return (
                <div key={r.id} style={{
                  borderRadius: 12, padding: '12px 16px',
                  background: `${sc}06`, border: `1px solid ${sc}20`,
                  borderLeft: `3px solid ${sc}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                    color: sc, background: `${sc}12`, border: `1px solid ${sc}25`,
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {r.severity}
                  </span>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', margin: 0, flex: 1 }}>{r.title}</p>
                  {r.owner && (
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{r.owner}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Recent activity ──────────────────────────────────────────────────── */}
      <Section title="Activity Log" icon={ArrowRight} iconColor={BLUE} delay={580}>
        <div style={{
          borderRadius: 14, background: CARD, border: `1px solid ${EDGE}`,
          overflow: 'hidden',
        }}>
          {RECENT_ACTIVITY.map((a, i) => {
            const c = ACTIVITY_COLOR[a.type] ?? BLUE
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
                borderTop: i > 0 ? `1px solid ${EDGE}` : 'none',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: c, boxShadow: `0 0 6px ${c}60`,
                }} />
                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, flex: 1 }}>{a.label}</p>
                <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{a.date}</span>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div style={{
        ...anim(640),
        borderRadius: 12, padding: '14px 18px',
        background: 'rgba(127, 83, 249, 0.04)', border: '1px solid rgba(127,83,249,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>
          Report generated by WAANDA · Kangqore Intelligence Engine · {today}
        </p>
        <p style={{ fontSize: 11, color: '#334155', margin: 0 }}>Confidential</p>
      </div>

    </div>
  )
}
