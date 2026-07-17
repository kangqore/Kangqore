import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  Calendar, Brain, ArrowUpRight, Activity, Shield,
  Zap, Target, RefreshCw, Star,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

// ── Seed data (will be replaced by API once /admin/cs/* endpoints exist) ──────
interface Customer {
  id: string
  name: string
  tier: 'Zero' | 'One' | 'Two'
  oisBaseline: number
  oisCurrent: number
  coigTarget: number
  health: 'GREEN' | 'AMBER' | 'RED'
  activationDate: string
  renewalDate: string
  nps: number | null
  openTasks: number
  lastTouch: string
  csm: string
  onboardingStage: string
  onboardingPct: number
}

const CUSTOMERS: Customer[] = [
  {
    id: 'c0', name: 'Kangqore (Internal)', tier: 'Zero',
    oisBaseline: 78.9, oisCurrent: 88.6, coigTarget: 10,
    health: 'GREEN', activationDate: '2026-06-15', renewalDate: '2027-06-15',
    nps: 9, openTasks: 2, lastTouch: '2026-07-18', csm: 'Internal',
    onboardingStage: 'Operational', onboardingPct: 100,
  },
  {
    id: 'c1', name: 'Birla Digital Labs', tier: 'One',
    oisBaseline: 62.0, oisCurrent: 65.7, coigTarget: 13,
    health: 'AMBER', activationDate: '2026-07-17', renewalDate: '2027-07-17',
    nps: null, openTasks: 6, lastTouch: '2026-07-18', csm: 'Mahesh K.',
    onboardingStage: 'Go-Live', onboardingPct: 45,
  },
]

const HEALTH_CFG = {
  GREEN: { color: TEAL, label: 'Healthy',  bg: TEAL + '12' },
  AMBER: { color: AMB,  label: 'At Risk',  bg: AMB  + '12' },
  RED:   { color: RED,  label: 'Critical', bg: RED  + '12' },
}

const ONBOARDING_STAGES = ['Kickoff', 'Platform Setup', 'Training', 'Go-Live', 'Handover', 'Operational']

const KIMMP_TASKS = [
  { customerId: 'c1', task: 'Run first WAANDA decision mission in Projects dept', priority: 'high',     due: 'Day 7',  agent: 'EXECUTION' },
  { customerId: 'c1', task: 'Complete 4-user team onboarding (Admin + 2 Ops + Finance)', priority: 'high', due: 'Week 1', agent: 'COACH'     },
  { customerId: 'c1', task: 'Activate workflow: Proposal Builder template', priority: 'medium', due: 'Week 2', agent: 'EXECUTION' },
  { customerId: 'c1', task: 'Schedule QBR #1 (Day 30 COIG snapshot)', priority: 'medium', due: 'Day 30', agent: 'COACH' },
  { customerId: 'c0', task: 'PMO seed data → replace with organic project records', priority: 'low', due: 'Ongoing', agent: 'DIAGNOSTICS' },
]

const EARLY_WARNINGS = [
  {
    customerId: 'c1', level: 'warn',
    title: 'Decision Pipeline stalled — 14 draft decisions',
    detail: 'OIS pillar "Decision Intelligence" at 58/78 target. No KIMMP decisions routed in 7 days.',
    action: '/kangqore-view/admin/kangqore-immp/decisions',
  },
  {
    customerId: 'c1', level: 'info',
    title: 'Workflow adoption below threshold (3/17 activated)',
    detail: 'Target: 8 workflows active by Day 14. Current trajectory: 4 by Day 14. Recommend workflow walkthrough this week.',
    action: '/kangqore-view/admin/kangqore-immp/customer-one',
  },
]

// ── OIS mini sparkline ─────────────────────────────────────────────────────────
function OISSpark({ baseline, current }: { baseline: number; current: number }) {
  const pts = [baseline, baseline + (current - baseline) * 0.3, baseline + (current - baseline) * 0.6, current]
  const min = Math.min(...pts) - 2
  const max = Math.max(...pts) + 2
  const w = 80, h = 28
  const toX = (i: number) => (i / (pts.length - 1)) * w
  const toY = (v: number) => h - ((v - min) / (max - min)) * h
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ')
  const gain = current - baseline
  const color = gain >= 5 ? TEAL : gain >= 0 ? BLUE : RED
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={toX(pts.length - 1)} cy={toY(pts[pts.length - 1])} r={3} fill={color} />
    </svg>
  )
}

// ── Customer health card ──────────────────────────────────────────────────────
function CustomerCard({ c }: { c: Customer }) {
  const cfg    = HEALTH_CFG[c.health]
  const gain   = +(c.oisCurrent - c.oisBaseline).toFixed(1)
  const coigPct = Math.min(100, Math.round((gain / c.coigTarget) * 100))
  const stageIdx = ONBOARDING_STAGES.indexOf(c.onboardingStage)
  const renewalDate = new Date(c.renewalDate)
  const daysToRenew = Math.ceil((renewalDate.getTime() - Date.now()) / 86400_000)

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: cfg.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={14} style={{ color: cfg.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{c.name}</span>
            <span style={{ fontSize: 8, fontWeight: 800, color: PURP, background: PURP + '12', padding: '1px 5px', borderRadius: 3 }}>Customer {c.tier}</span>
          </div>
          <span style={{ fontSize: 9, color: T3 }}>CSM: {c.csm} · Last touch: {c.lastTouch}</span>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, color: cfg.color, background: cfg.bg, padding: '3px 8px', borderRadius: 20 }}>{cfg.label}</span>
      </div>

      {/* OIS row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 9, color: T3, marginBottom: 1 }}>OIS Current</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: TEAL, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{c.oisCurrent.toFixed(1)}</p>
          <p style={{ fontSize: 9, color: T2 }}>baseline {c.oisBaseline}</p>
        </div>
        <div>
          <p style={{ fontSize: 9, color: T3, marginBottom: 1 }}>COIG™</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: gain >= 0 ? TEAL : RED, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>+{gain}</p>
          <p style={{ fontSize: 9, color: T2 }}>{coigPct}% of +{c.coigTarget} target</p>
        </div>
        <div>
          <p style={{ fontSize: 9, color: T3, marginBottom: 1 }}>NPS</p>
          {c.nps !== null
            ? <p style={{ fontSize: 18, fontWeight: 900, color: c.nps >= 8 ? TEAL : c.nps >= 6 ? AMB : RED, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{c.nps}/10</p>
            : <p style={{ fontSize: 11, color: T3 }}>Pending</p>}
          <p style={{ fontSize: 9, color: T2 }}>renewal in {daysToRenew}d</p>
        </div>
        <OISSpark baseline={c.oisBaseline} current={c.oisCurrent} />
      </div>

      {/* COIG progress */}
      <div>
        <div style={{ height: 4, background: 'var(--os-surface-0)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${coigPct}%`, background: gain >= 5 ? TEAL : BLUE, borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 9, color: T3 }}>COIG™ progress · {c.onboardingStage} stage</p>
      </div>

      {/* Onboarding stage pills */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {ONBOARDING_STAGES.map((s, i) => (
          <span key={s} style={{
            fontSize: 8, fontWeight: 700,
            color: i < stageIdx ? TEAL : i === stageIdx ? T1 : T3,
            background: i < stageIdx ? TEAL + '12' : i === stageIdx ? 'var(--os-surface-0)' : 'transparent',
            border: i === stageIdx ? `1px solid ${BDR}` : '1px solid transparent',
            padding: '2px 6px', borderRadius: 4,
          }}>
            {i < stageIdx ? '✓ ' : ''}{s}
          </span>
        ))}
      </div>

      <Link
        to={`/kangqore-view/admin/kangqore-immp/customer-${c.tier.toLowerCase()}`}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: PURP, textDecoration: 'none', alignSelf: 'flex-start' }}
      >
        View Full Dashboard <ArrowUpRight size={11} />
      </Link>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function CustomerSuccessPlatformPage() {

  const { data: oisData } = useQuery({
    queryKey: ['cs-ois-scores'],
    queryFn: () => api.get('/admin/gate8/score').then(r => r.data).catch(() => null),
    staleTime: 1000 * 60 * 5,
  })

  const atRisk     = CUSTOMERS.filter(c => c.health !== 'GREEN')
  const openTasks  = KIMMP_TASKS.reduce((s, t) => s + 1, 0)
  const totalCoig  = CUSTOMERS.reduce((s, c) => s + (c.oisCurrent - c.oisBaseline), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: TEAL + '15', border: `1px solid ${TEAL}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={20} style={{ color: TEAL }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>Customer Success Platform</h1>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>MVP · Live</span>
          </div>
          <p style={{ fontSize: 11, color: T2 }}>OIS health, COIG momentum, onboarding pipeline, and early warning across all active customer deployments</p>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Customers',  value: CUSTOMERS.length, sub: 'Customer Zero + One', color: PURP, Icon: Users       },
          { label: 'Avg COIG™ Gained',  value: `+${(totalCoig / CUSTOMERS.length).toFixed(1)}`, sub: 'across deployments', color: TEAL, Icon: TrendingUp },
          { label: 'At-Risk Accounts',  value: atRisk.length, sub: `${atRisk.map(c => c.name).join(', ')}`, color: atRisk.length > 0 ? AMB : TEAL, Icon: AlertTriangle },
          { label: 'Open KIMMP Tasks',  value: openTasks, sub: 'assigned + in-progress', color: BLUE, Icon: CheckCircle2   },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.Icon size={12} style={{ color: s.color }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T3 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T2, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Customer health grid ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Activity size={12} style={{ color: TEAL }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: T1 }}>Customer Health — OIS + COIG™ Dashboard</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {CUSTOMERS.map(c => <CustomerCard key={c.id} c={c} />)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── KIMMP Task Queue ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
            <Brain size={13} style={{ color: PURP }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>KIMMP Task Queue</span>
            <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>{KIMMP_TASKS.length} open tasks</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {KIMMP_TASKS.map((t, i) => {
              const prioColor = t.priority === 'high' ? RED : t.priority === 'medium' ? AMB : TEAL
              const cust = CUSTOMERS.find(c => c.id === t.customerId)
              return (
                <div key={i} style={{ padding: '11px 18px', borderBottom: i < KIMMP_TASKS.length - 1 ? `1px solid ${BDR}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: prioColor, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: T1, lineHeight: 1.4 }}>{t.task}</p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: PURP, background: PURP + '12', padding: '1px 5px', borderRadius: 3 }}>{t.agent}</span>
                      <span style={{ fontSize: 8, color: T3 }}>{cust?.name}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 9, color: T3, flexShrink: 0 }}>{t.due}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Early warnings + Renewal timeline ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Early warnings */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
              <AlertTriangle size={13} style={{ color: AMB }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>KIMMP Early Warnings</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: AMB, background: AMB + '12', padding: '2px 6px', borderRadius: 4, marginLeft: 'auto' }}>{EARLY_WARNINGS.length} active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {EARLY_WARNINGS.map((w, i) => {
                const color = w.level === 'warn' ? AMB : BLUE
                const cust  = CUSTOMERS.find(c => c.id === w.customerId)
                return (
                  <div key={i} style={{ padding: '12px 18px', borderBottom: i < EARLY_WARNINGS.length - 1 ? `1px solid ${BDR}` : 'none', background: color + '04' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color, background: color + '12', padding: '1px 6px', borderRadius: 3 }}>{w.level.toUpperCase()}</span>
                      <span style={{ fontSize: 9, color: T3 }}>{cust?.name}</span>
                      <Link to={w.action} style={{ fontSize: 8, color, marginLeft: 'auto', textDecoration: 'none' }}>Action →</Link>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: T1, marginBottom: 3 }}>{w.title}</p>
                    <p style={{ fontSize: 10, color: T2, lineHeight: 1.5 }}>{w.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Renewal timeline */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Calendar size={13} style={{ color: BLUE }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Renewal Timeline</span>
            </div>
            {CUSTOMERS.map(c => {
              const cfg = HEALTH_CFG[c.health]
              const daysToRenew = Math.ceil((new Date(c.renewalDate).getTime() - Date.now()) / 86400_000)
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${BDR}` }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{c.name}</p>
                    <p style={{ fontSize: 9, color: T3 }}>Renewal: {c.renewalDate} · {daysToRenew}d away</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: cfg.color }}>{cfg.label}</p>
                    <p style={{ fontSize: 9, color: T3 }}>OIS {c.oisCurrent.toFixed(1)} → target {(c.oisBaseline + c.coigTarget).toFixed(1)}</p>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                </div>
              )
            })}
            <p style={{ fontSize: 9, color: T3 }}>WAANDA renewal signal fires 90d before contract end when OIS is below target.</p>
          </div>
        </div>
      </div>

      {/* ── NPS + next milestones callout ── */}
      <div style={{ background: PURP + '06', border: `1.5px solid ${PURP}25`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Star size={16} style={{ color: PURP, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>Next milestone: <span style={{ color: PURP }}>Customer One — Day 30 COIG Snapshot</span></p>
          <p style={{ fontSize: 11, color: T2 }}>Birla Digital Labs Day 30 review due. Target OIS 67.5 (+5.5 from baseline). NPS survey to be sent. First commercial COIG report will be generated by KIMMP.</p>
        </div>
        <Link
          to="/kangqore-view/admin/kangqore-immp/customer-one"
          style={{ fontSize: 10, fontWeight: 700, color: PURP, background: PURP + '12', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Open Dashboard →
        </Link>
      </div>

    </div>
  )
}
