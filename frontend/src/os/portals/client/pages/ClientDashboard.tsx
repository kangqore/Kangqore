/**
 * ClientDashboard — Apple-grade rebuild
 *
 * Design system
 *   Surfaces (4 levels): BG → CARD → RAISE → EDGE
 *   Type scale: 10 / 12 / 14 / 16 / 24 / 48 px
 *   Spacing:    8 / 16 / 24 / 32 px (4pt grid, prefer multiples of 8)
 *   Motion:     cubic-bezier(0.16, 1, 0.3, 1), 500 ms, stagger 60 ms
 */
import { useEffect, useRef, useMemo } from 'react'
import {
  CheckCircle2, AlertTriangle, TrendingUp,
  Calendar, Zap, ArrowRight, Users,
  Phone, GitPullRequest, MessageSquare, Sparkles,
  FileText, Package,
} from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { useClientProjects, useClientActions, useClientInvoices, type ClientProject } from '../useClientData'
import { useAuthStore } from '@store/auth'
import { useNavigate } from 'react-router-dom'

// ── Design tokens ──────────────────────────────────────────────────────────────

const BG    = '#080c18'   // S0 — page floor
const CARD  = 'rgba(15, 23, 42, 0.4)'   // S1 — card surface
const RAISE = 'rgba(30, 41, 59, 0.6)'   // S2 — raised element / hover
const EDGE  = 'rgba(30, 41, 59, 0.6)'   // S3 — border / divider

const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ── One-time keyframe injection ────────────────────────────────────────────────

let _injected = false
function ensureKeyframes() {
  if (_injected) return
  _injected = true
  const s = document.createElement('style')
  s.textContent = `
    @keyframes _fadeUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes _shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
  `
  document.head.appendChild(s)
}

// Returns inline style for a staggered entrance
function anim(delayMs: number): React.CSSProperties {
  return {
    animation: `_fadeUp 0.55s ${EASE} ${delayMs}ms both`,
  }
}

// ── Engagement ring (RAF-driven, zero re-renders) ─────────────────────────────

function EngagementRing({ score, color }: { score: number; color: string }) {
  const arcRef  = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const numRef  = useRef<HTMLSpanElement>(null)
  const R = 52
  const C = +(2 * Math.PI * R).toFixed(4)

  useEffect(() => {
    const arc  = arcRef.current
    const glow = glowRef.current
    const num  = numRef.current
    if (!arc || !num) return

    arc.style.strokeDashoffset  = String(C)
    if (glow) glow.style.strokeDashoffset = String(C)
    num.textContent = '0'

    let raf: number
    const id = window.setTimeout(() => {
      const t0 = performance.now()
      const dur = 1600
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1)
        const e = 1 - (1 - t) ** 3            // ease-out cubic
        const v = Math.round(e * score)
        const off = C * (1 - v / 100)
        arc.style.strokeDashoffset  = String(off)
        if (glow) glow.style.strokeDashoffset = String(off)
        num.textContent = String(v)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 480)

    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [score, C])

  return (
    <div style={{ position: 'relative', width: 152, height: 152, flexShrink: 0 }}>
      <svg viewBox="0 0 128 128" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="64" cy="64" r={R} fill="none" stroke={EDGE} strokeWidth="9" strokeLinecap="round" />
        {/* Glow */}
        <circle ref={glowRef} cx="64" cy="64" r={R} fill="none" stroke={color}
          strokeWidth="18" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ opacity: 0.12, filter: 'blur(6px)' }} />
        {/* Arc */}
        <circle ref={arcRef} cx="64" cy="64" r={R} fill="none" stroke={color}
          strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ filter: `drop-shadow(0 0 5px ${color}90)` }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span ref={numRef}
          style={{ fontSize: 46, fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          0
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginTop: 4 }}>
          / 100
        </span>
      </div>
    </div>
  )
}

// ── Animated dimension bar (RAF-driven) ───────────────────────────────────────

function DimBar({ label, pct, color, delay = 0 }: {
  label: string; pct: number; color: string; delay?: number
}) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    bar.style.width = '0%'
    const id = window.setTimeout(() => { bar.style.width = `${pct}%` }, delay + 700)
    return () => clearTimeout(id)
  }, [pct, delay])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      </div>
      <div style={{ height: 3, borderRadius: 999, background: EDGE }}>
        <div ref={barRef} style={{
          height: '100%', borderRadius: 999,
          background: color, boxShadow: `0 0 8px ${color}55`,
          width: '0%', transition: `width 0.9s ${EASE}`,
        }} />
      </div>
    </div>
  )
}

// ── Frosted-glass WAANDA briefing ─────────────────────────────────────────────

function WaandaBriefing({ text }: { text: string }) {
  return (
    <div style={{
      background: 'rgba(127, 83, 249, 0.06)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(37,100,234,0.15)',
        border: '1px solid rgba(127, 83, 249, 0.16)',
      borderRadius: 16,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(127,83,249,0.08)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(127,83,249,0.3), rgba(127,83,249,0.1))',
        border: '1px solid rgba(127,83,249,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 1,
      }}>
        <Sparkles style={{ width: 14, height: 14, color: '#a78bfa' }} />
      </div>
      {/* Text */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 6 }}>
          WAANDA Briefing
        </p>
        <p style={{ fontSize: 13, fontWeight: 400, color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/client'

interface ActionItem {
  type: string
  id: string
  title: string
  subtitle: string
  dueDate: string | null
  urgency: 'high' | 'medium'
  link: string
  meta?: Record<string, unknown>
}

const ACTION_COLOR: Record<string, string> = {
  INVOICE: AMBER, DELIVERABLE: BLUE, DECISION: GREEN,
  CHANGE_REQUEST: PURPLE, RISK: RED, TICKET: '#06b6d4',
}

const SLA_ITEMS = [
  { metric: 'P1 Response',     target: '< 2h',  current: '1.4h',  met: true,  pct: 93 },
  { metric: 'P2 Response',     target: '< 8h',  current: '6.2h',  met: true,  pct: 78 },
  { metric: 'Staging Uptime',  target: '99.5%', current: '99.8%', met: true,  pct: 99 },
  { metric: 'Sprint Delivery', target: '90%',   current: '87%',   met: false, pct: 87 },
]

const TEAM = [
  { name: 'Ravi Nair',   role: 'Delivery Lead', project: 'Patient Portal',  initials: 'RN', color: BLUE   },
  { name: 'Omar Khalid', role: 'Tech Lead',      project: 'HIPAA Compliance',initials: 'OK', color: PURPLE },
  { name: 'Anika Roy',   role: 'Design Lead',    project: 'Analytics',       initials: 'AR', color: GREEN  },
]

const THIS_WEEK = [
  { type: 'milestone', title: 'Beta release to UAT',       date: '20 Jun', project: 'Patient Portal v2', urgent: false, color: BLUE   },
  { type: 'task',      title: 'Sign off on BAA agreement', date: '12 Jun', project: 'HIPAA Compliance',  urgent: true,  color: RED    },
  { type: 'meeting',   title: 'Sprint 13 Review',          date: '19 Jun', project: 'All Projects',      urgent: false, color: PURPLE },
]

const ACTIVITY = [
  { title: 'Sprint 12 deployed to staging',          date: '17 Jun', color: BLUE   },
  { title: 'HIPAA audit report shared in Documents', date: '14 Jun', color: PURPLE },
  { title: 'Monthly sync meeting notes uploaded',    date: '12 Jun', color: GREEN  },
  { title: 'Invoice INV-2026-041 issued — ₹42,000', date: '10 Jun', color: AMBER  },
  { title: 'Change request CR-014 approved',         date: '7 Jun',  color: BLUE   },
]

function greeting(name?: string) {
  const h = new Date().getHours()
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${g}${name ? `, ${name.split(' ')[0]}` : ''}.`
}

// ── Action Required widget ─────────────────────────────────────────────────────

function ActionRequiredWidget({ actions, onNavigate }: {
  actions: ActionItem[]
  onNavigate: (path: string) => void
}) {
  const highCount = actions.filter(a => a.urgency === 'high').length
  const sorted    = [...actions].sort((a, b) =>
    a.urgency === 'high' && b.urgency !== 'high' ? -1 : 1
  )

  return (
    <div style={{
      ...anim(0),
      borderRadius: 16,
      background: `rgba(226,68,92,0.05)`,
      border: `1px solid rgba(226,68,92,0.2)`,
      borderLeft: `3px solid ${RED}`,
      padding: '14px 18px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: RED, animation: 'pulse 2s infinite', flexShrink: 0 }} />
        <p style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Action Required</p>
        <span style={{
          fontSize: 10, fontWeight: 800,
          padding: '2px 7px', borderRadius: 999,
          color: RED, background: `${RED}18`, border: `1px solid ${RED}30`,
        }}>
          {actions.length}
        </span>
        {highCount > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            padding: '2px 7px', borderRadius: 999,
            color: '#f1f5f9', background: `${RED}30`, border: `1px solid ${RED}50`,
          }}>
            {highCount} urgent
          </span>
        )}
      </div>

      {/* Action list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.slice(0, 5).map(a => {
          const color = ACTION_COLOR[a.type] ?? BLUE
          const isHigh = a.urgency === 'high'
          return (
            <button
              key={a.id}
              onClick={() => onNavigate(a.link ?? BASE)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                background: isHigh ? `${RED}08` : RAISE,
                border: `1px solid ${isHigh ? `${RED}20` : EDGE}`,
                transition: `all 0.15s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}0d` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isHigh ? `${RED}08` : RAISE }}
            >
              <span style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                background: `${color}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {a.type === 'INVOICE'
                  ? <FileText style={{ width: 11, height: 11, color }} />
                  : a.type === 'DELIVERABLE'
                    ? <Package style={{ width: 11, height: 11, color }} />
                    : a.type === 'CHANGE_REQUEST'
                      ? <GitPullRequest style={{ width: 11, height: 11, color }} />
                      : a.type === 'TICKET'
                        ? <MessageSquare style={{ width: 11, height: 11, color }} />
                        : a.type === 'RISK'
                          ? <AlertTriangle style={{ width: 11, height: 11, color }} />
                          : <CheckCircle2 style={{ width: 11, height: 11, color }} />
                }
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.title}
                </p>
                <p style={{ fontSize: 10, color: isHigh ? '#f87171' : '#64748b', margin: '1px 0 0' }}>{a.subtitle}</p>
              </div>
              <ArrowRight style={{ width: 12, height: 12, color: '#475569', flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function ClientDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: apiProjects, isLoading } = useClientProjects()
  const { data: actionsData } = useClientActions()
  const { data: apiInvoices } = useClientInvoices()

  useEffect(() => { ensureKeyframes() }, [])

  const projects: ClientProject[] = useMemo(() => apiProjects ?? [], [apiProjects])

  const actions: ActionItem[] = useMemo(
    () => (actionsData as { actions?: ActionItem[] } | undefined)?.actions ?? [],
    [actionsData]
  )
  const pendingActions = actions.length

  const invoices  = (apiInvoices as Record<string, unknown>[] | undefined) ?? []
  const outstanding = invoices
    .filter(i => i.status === 'overdue' || i.status === 'pending' || i.status === 'OVERDUE' || i.status === 'PENDING')
    .reduce((s, i) => s + Number(i.amount ?? 0), 0)

  const atRisk  = projects.filter(p => p.health === 'at-risk' || p.health === 'behind').length
  const onTrack = projects.filter(p => p.health === 'on-track').length

  const score = useMemo(() => {
    const r = projects.length > 0 ? onTrack / projects.length : 1
    return Math.round(60 + r * 30 + (atRisk === 0 ? 10 : 0))
  }, [projects, onTrack, atRisk])

  const scoreColor = score >= 80 ? GREEN : score >= 60 ? AMBER : RED

  const brief = useMemo(() => {
    if (projects.length === 0) return 'No active projects found. Contact your account manager to get started.'
    if (atRisk === 0) {
      return `All ${projects.length} engagement${projects.length > 1 ? 's are' : ' is'} on track. ${projects[0]?.name} is at ${projects[0]?.progress}% and progressing well. No risks flagged this sprint.`
    }
    const rp = projects.find(p => p.health === 'at-risk' || p.health === 'behind')
    return `${onTrack} of your ${projects.length} projects are on track. ${rp?.name} needs attention — please review and confirm any pending actions to keep the timeline intact.`
  }, [projects, atRisk, onTrack])

  const kpis = [
    { label: 'Active Projects', value: String(projects.length), icon: TrendingUp, color: BLUE   },
    { label: 'Pending Actions', value: String(pendingActions),  icon: Zap,        color: AMBER  },
    { label: 'SLA Score',       value: '96%',                  icon: CheckCircle2,color: GREEN  },
    { label: 'Outstanding',
      value: outstanding > 0 ? `₹${(outstanding / 1000).toFixed(0)}k` : '₹0',
      icon: AlertTriangle, color: outstanding > 0 ? RED : GREEN },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── 0. Action Required ─────────────────────────────────────────────── */}
      {actions.length > 0 && (
        <ActionRequiredWidget actions={actions} onNavigate={navigate} />
      )}

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        ...anim(0),
        borderRadius: 20,
        overflow: 'hidden',
        background: `linear-gradient(150deg, ${RAISE} 0%, ${CARD} 80%)`, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)',
        border: `1px solid ${EDGE}`,
        boxShadow: `inset 0 1px 0 rgba(13,17,23,0.4)`,
        padding: 24,
        position: 'relative',
      }}>
        {/* Ambient light leak */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 80% 30%, rgba(37,100,234,0.09) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Greeting row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', marginBottom: 6 }}>
                Client Portal
              </p>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>
                {greeting(user?.name)}
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '6px 0 0' }}>
                Live status of your Kangqore engagement.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isLoading && <Spinner size="sm" />}
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                padding: '6px 12px', borderRadius: 999,
                color: scoreColor,
                background: `${scoreColor}14`,
                border: `1px solid ${scoreColor}30`,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                {score >= 80 ? 'Excellent' : score >= 60 ? 'On Track' : 'Needs Attention'}
              </span>
            </div>
          </div>

          {/* Frosted glass WAANDA briefing */}
          <WaandaBriefing text={brief} />

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Schedule a Call',  icon: Phone,          path: `${BASE}/meetings` },
              { label: 'Submit Request',   icon: GitPullRequest, path: `${BASE}/support`  },
              { label: 'Leave Feedback',   icon: MessageSquare,  path: `${BASE}/feedback` },
            ].map(({ label, icon: Icon, path }) => (
              <button key={label} onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10,
                  background: RAISE, border: `1px solid ${EDGE}`,
                  color: '#94a3b8', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: `all 0.2s ${EASE}`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${BLUE}50`
                  el.style.color = '#e2e8f0'
                  el.style.background = `${RAISE}cc`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = EDGE
                  el.style.color = '#94a3b8'
                  el.style.background = RAISE
                }}>
                <Icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Health ring + KPIs ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24 }}>

        {/* Ring card */}
        <div style={{
          ...anim(60),
          borderRadius: 20,
          background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)',
          border: `1px solid ${EDGE}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
          padding: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          minWidth: 220,
        }}>
          <EngagementRing score={score} color={scoreColor} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DimBar label="Delivery pace"   pct={93}  color={BLUE}   delay={0}   />
            <DimBar label="SLA compliance"  pct={96}  color={GREEN}  delay={80}  />
            <DimBar label="Communication"   pct={100} color={PURPLE} delay={160} />
            <DimBar label="Budget health"   pct={88}  color={AMBER}  delay={240} />
            <DimBar label="Sprint velocity" pct={87}  color={BLUE}   delay={320} />
          </div>
        </div>

        {/* Right: KPIs + This Week */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* KPI 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {kpis.map(({ label, value, icon: Icon, color }, i) => (
              <div key={label} style={{
                ...anim(80 + i * 60),
                borderRadius: 16,
                background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)',
                border: `1px solid ${EDGE}`,
                padding: 16,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 12px ${color}18`,
                }}>
                  <Icon style={{ width: 16, height: 16, color } as React.CSSProperties} />
                </div>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* This Week */}
          <div style={{
            ...anim(320),
            borderRadius: 16, background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)',
            border: `1px solid ${EDGE}`, padding: 16,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', marginBottom: 12 }}>
              This Week
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {THIS_WEEK.map((item, i) => {
                const Icon = item.type === 'meeting' ? Users : item.type === 'task' ? CheckCircle2 : Calendar
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    background: item.urgent ? `rgba(226,68,92,0.07)` : RAISE,
                    border: `1px solid ${item.urgent ? 'rgba(226,68,92,0.2)' : EDGE}`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${item.color}14`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 13, height: 13, color: item.color } as React.CSSProperties} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: 10, color: '#475569', margin: '2px 0 0' }}>{item.project}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {item.urgent && <AlertTriangle style={{ width: 11, height: 11, color: RED }} />}
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>{item.date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Active projects ──────────────────────────────────────────────── */}
      <div style={anim(380)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>Active Projects</p>
          <button onClick={() => navigate(`${BASE}/projects`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, fontWeight: 600, color: BLUE,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: `color 0.15s`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#3b82f6' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = BLUE }}>
            View all <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
        {projects.length === 0 ? (
          <div style={{
            borderRadius: 16, padding: 32, textAlign: 'center',
            background: CARD, border: `1px solid ${EDGE}`,
          }}>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>No active projects — contact your account manager to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {projects.map((p, i) => {
              const isRisk = p.health === 'at-risk' || p.health === 'behind'
              const c = isRisk ? AMBER : GREEN
              const milestoneDate = p.milestoneDate
                ? new Date(p.milestoneDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : ''
              return (
                <div key={p.id} style={{
                  ...anim(400 + i * 60),
                  borderRadius: 16, cursor: 'pointer',
                  background: `linear-gradient(180deg, ${c}07 0%, ${CARD} 50%)`,
                  border: `1px solid ${EDGE}`,
                  borderTop: `1.5px solid ${c}50`,
                  padding: 16,
                  transition: `transform 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
                }}
                onClick={() => navigate(`${BASE}/projects`)}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${c}20`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0' }}>Kangqore</p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
                      padding: '3px 8px', borderRadius: 999,
                      color: c, background: `${c}14`, border: `1px solid ${c}25`,
                    }}>
                      {isRisk ? 'At Risk' : 'On Track'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#475569' }}>Progress</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums' }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: EDGE, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      width: `${p.progress}%`,
                      background: isRisk
                        ? `linear-gradient(90deg, ${AMBER}, #f59e0b)`
                        : `linear-gradient(90deg, ${BLUE}, #3b82f6)`,
                      boxShadow: `0 0 8px ${c}40`,
                    }} />
                  </div>
                  {p.nextMilestone && p.nextMilestone !== '—' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginTop: 12, paddingTop: 12, borderTop: `1px solid ${EDGE}`,
                    }}>
                      <Calendar style={{ width: 10, height: 10, color: '#475569', flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {p.nextMilestone}
                      </span>
                      {milestoneDate && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', flexShrink: 0 }}>
                          {milestoneDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── 4. Team | SLA | Activity ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

        {/* Team */}
        <div style={{ ...anim(560), borderRadius: 16, background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: `1px solid ${EDGE}`, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Users style={{ width: 14, height: 14, color: '#475569' }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Your Kangqore Team</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: `${t.color}18`, border: `1px solid ${t.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: t.color,
                }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 10, color: '#475569', margin: '2px 0 0' }}>{t.role}</p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: '3px 7px', borderRadius: 6,
                  color: t.color, background: `${t.color}12`,
                  maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.project}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA */}
        <div style={{ ...anim(620), borderRadius: 16, background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: `1px solid ${EDGE}`, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: '0 0 16px' }}>SLA Performance</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SLA_ITEMS.map(s => (
              <div key={s.metric}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b' }}>{s.metric}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.met ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>
                      {s.current}
                    </span>
                    <span style={{ fontSize: 10, color: '#334155' }}>/ {s.target}</span>
                    {s.met
                      ? <CheckCircle2 style={{ width: 11, height: 11, color: GREEN }} />
                      : <AlertTriangle style={{ width: 11, height: 11, color: AMBER }} />
                    }
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: EDGE }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    width: `${s.pct}%`,
                    background: s.met ? GREEN : AMBER,
                    boxShadow: `0 0 6px ${s.met ? GREEN : AMBER}55`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{ ...anim(680), borderRadius: 16, background: CARD, backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: `1px solid ${EDGE}`, padding: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: '0 0 16px' }}>Recent Activity</p>
          <div style={{ position: 'relative', paddingLeft: 16 }}>
            <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 1, background: EDGE }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -16, top: 3,
                    width: 10, height: 10, borderRadius: '50%',
                    background: `${a.color}18`,
                    border: `2px solid ${a.color}`,
                    boxShadow: `0 0 5px ${a.color}40`,
                  }} />
                  <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{a.title}</p>
                  <p style={{ fontSize: 10, color: '#334155', margin: '3px 0 0' }}>{a.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
