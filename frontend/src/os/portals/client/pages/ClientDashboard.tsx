import { useEffect, useRef, useMemo } from 'react'
import {
  CheckCircle2, AlertTriangle, TrendingUp,
  Calendar, Zap, ArrowRight, Users,
  Phone, GitPullRequest, MessageSquare, Sparkles,
  FileText, Package, ChevronRight,
} from 'lucide-react'
import { Spinner } from '@design-system/components/Spinner'
import { useClientProjects, useClientActions, useClientInvoices, type ClientProject } from '../useClientData'
import { useAuthStore } from '@store/auth'
import { useNavigate } from 'react-router-dom'

// ── Brand tokens ───────────────────────────────────────────────────────────────

const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ── Static data ────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/client'

interface ActionItem {
  type: string; id: string; title: string; subtitle: string
  dueDate: string | null; urgency: 'high' | 'medium'; link: string
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
  { name: 'Ravi Nair',   role: 'Delivery Lead', project: 'Patient Portal',   initials: 'RN', color: BLUE   },
  { name: 'Omar Khalid', role: 'Tech Lead',      project: 'HIPAA Compliance', initials: 'OK', color: PURPLE },
  { name: 'Anika Roy',   role: 'Design Lead',    project: 'Analytics',        initials: 'AR', color: GREEN  },
]

const THIS_WEEK = [
  { type: 'milestone', title: 'Beta release to UAT',       date: '20 Jun', project: 'Patient Portal v2',  urgent: false, color: BLUE   },
  { type: 'task',      title: 'Sign off on BAA agreement', date: '12 Jun', project: 'HIPAA Compliance',   urgent: true,  color: RED    },
  { type: 'meeting',   title: 'Sprint 13 Review',          date: '19 Jun', project: 'All Projects',       urgent: false, color: PURPLE },
]

const ACTIVITY = [
  { title: 'Sprint 12 deployed to staging',          date: '17 Jun', color: BLUE   },
  { title: 'HIPAA audit report shared in Documents', date: '14 Jun', color: PURPLE },
  { title: 'Monthly sync meeting notes uploaded',    date: '12 Jun', color: GREEN  },
  { title: 'Invoice INV-2026-041 issued — ₹42,000', date: '10 Jun', color: AMBER  },
  { title: 'Change request CR-014 approved',         date: '7 Jun',  color: BLUE   },
]

// ── CSS injection ──────────────────────────────────────────────────────────────

let _injected = false
function ensureKeyframes() {
  if (_injected) return
  _injected = true
  const s = document.createElement('style')
  s.textContent = `
    @keyframes _fadeUp {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes _pulse2 {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.6; transform: scale(0.9); }
    }
    @keyframes _shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    /* Light-mode surface tokens used by this dashboard */
    :root {
      --cd-bg:      #f6f8fd;
      --cd-card:    #ffffff;
      --cd-raise:   #f0f4ff;
      --cd-edge:    rgba(37,100,234,0.12);
      --cd-border:  1px solid rgba(37,100,234,0.1);
      --cd-shadow:  0 1px 2px rgba(37,100,234,0.04), 0 6px 20px rgba(37,100,234,0.07);
      --cd-shadow-md: 0 4px 24px rgba(37,100,234,0.1), 0 1px 3px rgba(0,0,0,0.04);
      --cd-hover-shadow: 0 12px 40px rgba(37,100,234,0.13), 0 2px 6px rgba(0,0,0,0.06);
    }
    html.dark {
      --cd-bg:      rgba(8,10,18,1);
      --cd-card:    rgba(15,23,42,0.55);
      --cd-raise:   rgba(30,41,59,0.7);
      --cd-edge:    rgba(99,120,180,0.18);
      --cd-border:  1px solid rgba(30,41,59,0.8);
      --cd-shadow:  inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.35);
      --cd-shadow-md: 0 4px 24px rgba(0,0,0,0.4);
      --cd-hover-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
  `
  document.head.appendChild(s)
}

function anim(delayMs: number): React.CSSProperties {
  return { animation: `_fadeUp 0.5s ${EASE} ${delayMs}ms both` }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function greeting(name?: string) {
  const h = new Date().getHours()
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${g}${name ? `, ${name.split(' ')[0]}` : ''}.`
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0] ?? '').join('').slice(0, 2).toUpperCase()
}

// ── Engagement Ring ────────────────────────────────────────────────────────────

function EngagementRing({ score, color }: { score: number; color: string }) {
  const arcRef  = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)
  const numRef  = useRef<HTMLSpanElement>(null)
  const R = 52
  const C = +(2 * Math.PI * R).toFixed(4)

  useEffect(() => {
    const arc = arcRef.current
    const glow = glowRef.current
    const num = numRef.current
    if (!arc || !num) return
    arc.style.strokeDashoffset = String(C)
    if (glow) glow.style.strokeDashoffset = String(C)
    num.textContent = '0'
    let raf: number
    const id = window.setTimeout(() => {
      const t0 = performance.now()
      const dur = 1600
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1)
        const e = 1 - (1 - t) ** 3
        const v = Math.round(e * score)
        const off = C * (1 - v / 100)
        arc.style.strokeDashoffset = String(off)
        if (glow) glow.style.strokeDashoffset = String(off)
        num.textContent = String(v)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, 480)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [score, C])

  return (
    <div style={{ position: 'relative', width: 156, height: 156, flexShrink: 0 }}>
      <svg viewBox="0 0 128 128" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={R} fill="none" stroke="var(--cd-edge)" strokeWidth="9" strokeLinecap="round" />
        <circle ref={glowRef} cx="64" cy="64" r={R} fill="none" stroke={color}
          strokeWidth="20" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ opacity: 0.15, filter: 'blur(8px)' }} />
        <circle ref={arcRef} cx="64" cy="64" r={R} fill="none" stroke={color}
          strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span ref={numRef} style={{ fontSize: 44, fontWeight: 900, color: 'var(--os-text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          0
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginTop: 3 }}>
          / 100
        </span>
      </div>
    </div>
  )
}

// ── Animated progress bar ──────────────────────────────────────────────────────

function DimBar({ label, pct, color, delay = 0 }: { label: string; pct: number; color: string; delay?: number }) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--os-text-3)', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--cd-edge)' }}>
        <div ref={barRef} style={{
          height: '100%', borderRadius: 999, background: color,
          boxShadow: `0 0 8px ${color}60`, width: '0%',
          transition: `width 1s ${EASE}`,
        }} />
      </div>
    </div>
  )
}

// ── Action Required ────────────────────────────────────────────────────────────

function ActionRequiredWidget({ actions, onNavigate }: { actions: ActionItem[]; onNavigate: (p: string) => void }) {
  const highCount = actions.filter(a => a.urgency === 'high').length
  const sorted = [...actions].sort((a, b) => a.urgency === 'high' && b.urgency !== 'high' ? -1 : 1)

  return (
    <div style={{
      ...anim(0),
      borderRadius: 16,
      background: 'rgba(226,68,92,0.04)',
      border: '1px solid rgba(226,68,92,0.18)',
      borderLeft: `4px solid ${RED}`,
      padding: '16px 20px',
      boxShadow: `0 4px 20px rgba(226,68,92,0.08)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, animation: '_pulse2 2s infinite', flexShrink: 0 }} />
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>Action Required</p>
        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, color: RED, background: `${RED}15`, border: `1px solid ${RED}28` }}>
          {actions.length}
        </span>
        {highCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, color: '#fff', background: RED }}>
            {highCount} urgent
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {sorted.slice(0, 5).map(a => {
          const color = ACTION_COLOR[a.type] ?? BLUE
          const isHigh = a.urgency === 'high'
          const IconEl = a.type === 'INVOICE' ? FileText : a.type === 'DELIVERABLE' ? Package
            : a.type === 'CHANGE_REQUEST' ? GitPullRequest : a.type === 'TICKET' ? MessageSquare
            : a.type === 'RISK' ? AlertTriangle : CheckCircle2
          return (
            <button key={a.id} onClick={() => onNavigate(a.link ?? BASE)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                background: isHigh ? `${RED}06` : 'var(--cd-raise)',
                border: `1px solid ${isHigh ? `${RED}20` : 'var(--cd-edge)'}`,
                transition: `all 0.18s ${EASE}`,
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}0c`; el.style.borderColor = `${color}30` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = isHigh ? `${RED}06` : 'var(--cd-raise)'; el.style.borderColor = isHigh ? `${RED}20` : 'var(--cd-edge)' }}
            >
              <span style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconEl style={{ width: 12, height: 12, color }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                <p style={{ fontSize: 11, color: isHigh ? RED : 'var(--os-text-3)', margin: '2px 0 0' }}>{a.subtitle}</p>
              </div>
              <ChevronRight style={{ width: 14, height: 14, color: 'var(--os-text-3)', flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export function ClientDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { data: apiProjects, isLoading } = useClientProjects()
  const { data: actionsData } = useClientActions()
  const { data: apiInvoices } = useClientInvoices()

  useEffect(() => { ensureKeyframes() }, [])

  const projects: ClientProject[] = useMemo(() => apiProjects ?? [], [apiProjects])
  const actions: ActionItem[] = useMemo(() => (actionsData as { actions?: ActionItem[] } | undefined)?.actions ?? [], [actionsData])
  const pendingActions = actions.length
  const invoices = (apiInvoices as Record<string, unknown>[] | undefined) ?? []
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
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'On Track' : 'Needs Attention'

  const brief = useMemo(() => {
    if (projects.length === 0) return 'No active projects found. Contact your account manager to get started.'
    if (atRisk === 0)
      return `All ${projects.length} engagement${projects.length > 1 ? 's are' : ' is'} on track. ${projects[0]?.name} is at ${projects[0]?.progress}% and progressing well. No risks flagged this sprint.`
    const rp = projects.find(p => p.health === 'at-risk' || p.health === 'behind')
    return `${onTrack} of your ${projects.length} projects are on track. ${rp?.name} needs attention — please review and confirm any pending actions to keep the timeline intact.`
  }, [projects, atRisk, onTrack])

  const kpis = [
    { label: 'Active Projects', value: String(projects.length),   icon: TrendingUp,  color: BLUE,
      grad: `linear-gradient(135deg, ${BLUE} 0%, #4f8ef7 100%)`,  glow: `${BLUE}35`  },
    { label: 'Pending Actions', value: String(pendingActions),     icon: Zap,         color: AMBER,
      grad: `linear-gradient(135deg, ${AMBER} 0%, #fbbf24 100%)`, glow: `${AMBER}35` },
    { label: 'SLA Score',       value: '96%',                      icon: CheckCircle2,color: GREEN,
      grad: `linear-gradient(135deg, ${GREEN} 0%, #34d399 100%)`, glow: `${GREEN}35` },
    { label: 'Outstanding',
      value: outstanding > 0 ? `₹${(outstanding / 1000).toFixed(0)}k` : '₹0',
      icon: AlertTriangle,
      color: outstanding > 0 ? RED : GREEN,
      grad: outstanding > 0 ? `linear-gradient(135deg, ${RED} 0%, #f87171 100%)` : `linear-gradient(135deg, ${GREEN} 0%, #34d399 100%)`,
      glow: outstanding > 0 ? `${RED}35` : `${GREEN}35`,
    },
  ]

  const displayName = user?.name ?? 'there'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── 0. Action Required ──────────────────────────────────────────────── */}
      {actions.length > 0 && (
        <ActionRequiredWidget actions={actions} onNavigate={navigate} />
      )}

      {/* ── 1. Hero greeting ────────────────────────────────────────────────── */}
      <div style={{
        ...anim(0),
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--cd-card)',
        border: '1px solid var(--cd-edge)',
        boxShadow: 'var(--cd-shadow-md)',
        padding: '28px 28px 24px',
      }}>
        {/* Ambient background gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(37,100,234,0.05) 0%, rgba(127,83,249,0.03) 50%, transparent 100%)',
        }} />
        {/* Decorative top-right circle */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: `radial-gradient(circle, ${BLUE}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Top row: avatar + greeting + status */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${BLUE} 0%, #0ea5e9 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, color: '#fff',
                  boxShadow: `0 4px 16px ${BLUE}40`,
                  border: '2px solid rgba(255,255,255,0.9)',
                }}>
                  {getInitials(displayName)}
                </div>
                {/* Online dot */}
                <span style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 12, height: 12, borderRadius: '50%',
                  background: GREEN, border: '2px solid #fff',
                  boxShadow: `0 0 6px ${GREEN}80`,
                }} />
              </div>
              {/* Text */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--os-text-3)', marginBottom: 4 }}>
                  {formatDate()}
                </p>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {greeting(user?.name)}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--os-text-3)', margin: '5px 0 0', fontWeight: 400 }}>
                  Live status of your Kangqore engagement.
                </p>
              </div>
            </div>

            {/* Status pill + loading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {isLoading && <Spinner size="sm" />}
              <span style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 700,
                padding: '8px 16px', borderRadius: 999,
                color: scoreColor,
                background: `${scoreColor}12`,
                border: `1px solid ${scoreColor}30`,
                boxShadow: `0 0 16px ${scoreColor}20`,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: scoreColor, animation: '_pulse2 2s infinite' }} />
                {scoreLabel}
              </span>
            </div>
          </div>

          {/* WAANDA briefing */}
          <div style={{
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(127,83,249,0.07) 0%, rgba(37,100,234,0.04) 100%)',
            border: '1px solid rgba(127,83,249,0.15)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'flex-start', gap: 14,
            marginBottom: 18,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(127,83,249,0.25), rgba(127,83,249,0.08))',
              border: '1px solid rgba(127,83,249,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: 15, height: 15, color: '#a78bfa' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bfa', margin: '0 0 5px' }}>
                WAANDA Briefing
              </p>
              <p style={{ fontSize: 13, color: 'var(--os-text-2)', lineHeight: 1.65, margin: 0 }}>{brief}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Schedule a Call',  icon: Phone,          path: `${BASE}/meetings`, color: BLUE   },
              { label: 'Submit Request',   icon: GitPullRequest, path: `${BASE}/support`,  color: PURPLE },
              { label: 'Leave Feedback',   icon: MessageSquare,  path: `${BASE}/feedback`, color: GREEN  },
            ].map(({ label, icon: Icon, path, color }) => (
              <button key={label} onClick={() => navigate(path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 10,
                  background: 'var(--cd-card)',
                  border: `1px solid ${color}25`,
                  color: color, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: `all 0.2s ${EASE}`,
                  boxShadow: `0 2px 8px ${color}12`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = `${color}10`
                  el.style.borderColor = `${color}40`
                  el.style.boxShadow = `0 4px 16px ${color}25`
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'var(--cd-card)'
                  el.style.borderColor = `${color}25`
                  el.style.boxShadow = `0 2px 8px ${color}12`
                  el.style.transform = 'none'
                }}>
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. KPI cards ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, ...anim(60) }}>
        {kpis.map(({ label, value, icon: Icon, color, grad, glow }, i) => (
          <div key={label} style={{
            ...anim(80 + i * 50),
            borderRadius: 18,
            background: grad,
            color: '#fff',
            boxShadow: `0 8px 28px ${glow}, 0 2px 6px rgba(0,0,0,0.08)`,
            padding: '20px 22px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
            height: 130, cursor: 'default',
            transition: `transform 0.2s ${EASE}, box-shadow 0.2s ${EASE}`,
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 16px 40px ${glow}, 0 4px 10px rgba(0,0,0,0.1)` }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 8px 28px ${glow}, 0 2px 6px rgba(0,0,0,0.08)` }}>
            {/* Diagonal shine overlay */}
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, left: '40%',
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Top: icon */}
            <div style={{
              width: 36, height: 36, borderRadius: 11, flexShrink: 0,
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <Icon style={{ width: 17, height: 17, color: '#fff' }} />
            </div>
            {/* Bottom: value + label */}
            <div>
              <p style={{ fontSize: 34, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                {value}
              </p>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', margin: '5px 0 0' }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Engagement ring + This Week ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20 }}>

        {/* Ring card */}
        <div style={{
          ...anim(200),
          borderRadius: 20, background: 'var(--cd-card)',
          border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          padding: '24px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          minWidth: 220,
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--os-text-3)', margin: '0 0 4px' }}>
              Engagement Score
            </p>
          </div>
          <EngagementRing score={score} color={scoreColor} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <DimBar label="Delivery pace"   pct={93}  color={BLUE}   delay={0}   />
            <DimBar label="SLA compliance"  pct={96}  color={GREEN}  delay={80}  />
            <DimBar label="Communication"   pct={100} color={PURPLE} delay={160} />
            <DimBar label="Budget health"   pct={88}  color={AMBER}  delay={240} />
            <DimBar label="Sprint velocity" pct={87}  color={BLUE}   delay={320} />
          </div>
        </div>

        {/* This Week card */}
        <div style={{
          ...anim(240),
          borderRadius: 20, background: 'var(--cd-card)',
          border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          padding: 24, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>This Week</p>
            <span style={{ fontSize: 11, color: 'var(--os-text-3)', fontWeight: 500 }}>{new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {THIS_WEEK.map((item, i) => {
              const Icon = item.type === 'meeting' ? Users : item.type === 'task' ? CheckCircle2 : Calendar
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 14,
                  background: item.urgent ? 'rgba(226,68,92,0.05)' : 'var(--cd-raise)',
                  border: `1px solid ${item.urgent ? 'rgba(226,68,92,0.2)' : 'var(--cd-edge)'}`,
                  transition: `all 0.2s ${EASE}`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                    background: `${item.color}14`,
                    border: `1px solid ${item.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 15, height: 15, color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>{item.project}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {item.urgent && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, color: RED, background: `${RED}12`, border: `1px solid ${RED}25` }}>
                        Urgent
                      </span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-3)' }}>{item.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Active projects ───────────────────────────────────────────────── */}
      <div style={anim(320)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>Active Projects</p>
          <button onClick={() => navigate(`${BASE}/projects`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 600, color: BLUE,
              background: `${BLUE}10`, border: `1px solid ${BLUE}20`,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              transition: `all 0.15s`,
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${BLUE}18` }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${BLUE}10` }}>
            View all <ArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{
            borderRadius: 16, padding: 40, textAlign: 'center',
            background: 'var(--cd-card)', border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          }}>
            <TrendingUp style={{ width: 32, height: 32, color: 'var(--os-text-3)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--os-text-3)', margin: 0 }}>No active projects — contact your account manager to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {projects.map((p, i) => {
              const isRisk = p.health === 'at-risk' || p.health === 'behind'
              const c = isRisk ? AMBER : BLUE
              const milestoneDate = p.milestoneDate
                ? new Date(p.milestoneDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : ''
              return (
                <div key={p.id} style={{
                  ...anim(340 + i * 50),
                  borderRadius: 18, cursor: 'pointer',
                  background: 'var(--cd-card)',
                  border: `1px solid ${c}20`,
                  borderTop: `3px solid ${c}`,
                  padding: '18px 20px',
                  boxShadow: `var(--cd-shadow)`,
                  transition: `all 0.2s ${EASE}`,
                }}
                onClick={() => navigate(`${BASE}/projects`)}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = 'var(--cd-hover-shadow)'
                  el.style.borderColor = `${c}35`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = 'none'
                  el.style.boxShadow = 'var(--cd-shadow)'
                  el.style.borderColor = `${c}20`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0', fontWeight: 500 }}>Kangqore</p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                      padding: '4px 10px', borderRadius: 999,
                      color: c, background: `${c}12`, border: `1px solid ${c}25`,
                    }}>
                      {isRisk ? 'At Risk' : 'On Track'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--os-text-3)' }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c, fontVariantNumeric: 'tabular-nums' }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: 'var(--cd-edge)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      width: `${p.progress}%`,
                      background: isRisk ? `linear-gradient(90deg, ${AMBER}, #f59e0b)` : `linear-gradient(90deg, ${BLUE}, #60a5fa)`,
                      boxShadow: `0 0 10px ${c}50`,
                    }} />
                  </div>
                  {p.nextMilestone && p.nextMilestone !== '—' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginTop: 14, paddingTop: 12, borderTop: `1px solid var(--cd-edge)`,
                    }}>
                      <Calendar style={{ width: 11, height: 11, color: 'var(--os-text-3)', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'var(--os-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {p.nextMilestone}
                      </span>
                      {milestoneDate && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-3)', flexShrink: 0 }}>{milestoneDate}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── 5. Team · SLA · Activity ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, ...anim(440) }}>

        {/* Team */}
        <div style={{
          borderRadius: 18, background: 'var(--cd-card)',
          border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          padding: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${BLUE}12`, border: `1px solid ${BLUE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 14, height: 14, color: BLUE }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>Your Kangqore Team</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${t.color}20, ${t.color}10)`,
                  border: `1px solid ${t.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: t.color,
                }}>
                  {t.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text-1)', margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '2px 0 0' }}>{t.role}</p>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                  color: t.color, background: `${t.color}12`, border: `1px solid ${t.color}20`,
                  maxWidth: 76, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {t.project}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA */}
        <div style={{
          borderRadius: 18, background: 'var(--cd-card)',
          border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          padding: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${GREEN}12`, border: `1px solid ${GREEN}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: GREEN }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>SLA Performance</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SLA_ITEMS.map(s => (
              <div key={s.metric}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--os-text-2)' }}>{s.metric}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.met ? GREEN : AMBER, fontVariantNumeric: 'tabular-nums' }}>{s.current}</span>
                    <span style={{ fontSize: 10, color: 'var(--os-text-3)' }}>/ {s.target}</span>
                    {s.met
                      ? <CheckCircle2 style={{ width: 12, height: 12, color: GREEN }} />
                      : <AlertTriangle style={{ width: 12, height: 12, color: AMBER }} />
                    }
                  </div>
                </div>
                <div style={{ height: 4, borderRadius: 999, background: 'var(--cd-edge)' }}>
                  <div style={{
                    height: '100%', borderRadius: 999, width: `${s.pct}%`,
                    background: s.met ? GREEN : AMBER,
                    boxShadow: `0 0 6px ${s.met ? GREEN : AMBER}55`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div style={{
          borderRadius: 18, background: 'var(--cd-card)',
          border: '1px solid var(--cd-edge)', boxShadow: 'var(--cd-shadow)',
          padding: 22,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${PURPLE}12`, border: `1px solid ${PURPLE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 14, height: 14, color: PURPLE }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>Recent Activity</p>
          </div>
          <div style={{ position: 'relative', paddingLeft: 18 }}>
            <div style={{ position: 'absolute', left: 6, top: 6, bottom: 6, width: 1.5, background: 'var(--cd-edge)', borderRadius: 999 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -18, top: 4,
                    width: 11, height: 11, borderRadius: '50%',
                    background: `${a.color}15`, border: `2px solid ${a.color}`,
                    boxShadow: `0 0 6px ${a.color}40`,
                  }} />
                  <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{a.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--os-text-3)', margin: '3px 0 0' }}>{a.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
