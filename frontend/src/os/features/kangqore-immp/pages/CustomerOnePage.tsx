import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2, Circle, Clock, Target, Zap, TrendingUp,
  Building2, Brain, FileJson, Users, Calendar, ChevronRight,
  Award, AlertTriangle, Sparkles, Lock, BarChart2, ArrowUpRight,
  GitBranch, Activity, Lightbulb, RefreshCw,
} from 'lucide-react'
import { api } from '@lib/api'

// ── Design tokens ──────────────────────────────────────────────────────────────
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

// ── Customer One constants ─────────────────────────────────────────────────────
const C1_NAME          = 'Birla Digital Labs'
const C1_INDUSTRY      = 'Digital Transformation · Enterprise Technology'
const ACTIVATION_DATE  = '2026-07-17'
const OIS_DAY0         = 62.0
const OIS_TARGET_90D   = 75.0
const COIG_TARGET      = +(OIS_TARGET_90D - OIS_DAY0).toFixed(1)
const BLUEPRINT_V      = 'v1.1'

const GAP_LEVERS = [
  { label: 'Decision Pipeline',    current: 58, target: 78, weight: 0.22, pillar: 'Decision Intelligence' },
  { label: 'Workflow Adoption',    current: 51, target: 75, weight: 0.20, pillar: 'Workflow Automation'   },
  { label: 'AI Utilisation',       current: 44, target: 70, weight: 0.18, pillar: 'AI Integration'         },
  { label: 'Knowledge Governance', current: 65, target: 80, weight: 0.15, pillar: 'Knowledge Management'  },
  { label: 'Operational Rhythm',   current: 70, target: 82, weight: 0.15, pillar: 'Operational Efficiency' },
  { label: 'Business Alignment',   current: 72, target: 85, weight: 0.10, pillar: 'Strategic Alignment'   },
]

const KIMMP_RECS = [
  {
    rank: 1, priority: 'critical',
    title: 'Activate Decision Pipeline',
    description: 'Projects & Finance departments have 14 pending decisions sitting in draft state. Routing them through KIMMP decision engine would contribute an estimated +3.2 OIS points.',
    oisImpact: '+3.2', effort: 'Low', eta: '1 week',
    action: 'decisions',
  },
  {
    rank: 2, priority: 'high',
    title: 'Drive Workflow Adoption',
    description: 'Only 3 of 17 deployed workflows have been executed. KIMMP recommends assigning a workflow champion per department and scheduling first WAANDA mission walkthroughs this week.',
    oisImpact: '+4.1', effort: 'Medium', eta: '2–3 weeks',
    action: 'operational-intel',
  },
  {
    rank: 3, priority: 'high',
    title: 'Increase AI Utilisation',
    description: 'WAANDA is active but underutilised — average 1.2 WAANDA sessions per user per week. Target is 5+. Push AI-assisted briefings to each dept lead daily via Mission Control.',
    oisImpact: '+5.8', effort: 'Medium', eta: '3–4 weeks',
    action: 'mission-control',
  },
]

const WEEKLY_COIG: { week: string; ois: number; delta: number }[] = [
  { week: 'W1',  ois: 62.0, delta: 0    },
  { week: 'W2',  ois: 63.2, delta: +1.2 },
  { week: 'W3',  ois: 64.1, delta: +0.9 },
  { week: 'W4',  ois: 65.7, delta: +1.6 },
]

const DEPT_SEQUENCE = [
  { dept: 'Projects & Delivery', order: 1, status: 'active',   oisContrib: '+2.5', eta: 'Week 1–2' },
  { dept: 'Finance',             order: 2, status: 'pending',  oisContrib: '+2.0', eta: 'Week 3–4' },
  { dept: 'Sales & Revenue',     order: 3, status: 'pending',  oisContrib: '+1.8', eta: 'Week 5–6' },
  { dept: 'People & HR',         order: 4, status: 'pending',  oisContrib: '+1.5', eta: 'Week 7–8' },
  { dept: 'Leadership',          order: 5, status: 'pending',  oisContrib: '+3.2', eta: 'Week 10–12' },
]

const PACK_CONTENTS = [
  { label: 'Workflows',  count: 17, icon: Zap     },
  { label: 'Agents',     count: 80, icon: Brain    },
  { label: 'Goals',      count: 5,  icon: Target   },
  { label: 'KPI Templates', count: 12, icon: TrendingUp },
]

const CHECKLIST = [
  { id: 'blueprint-gen',   label: 'Blueprint Generated',             done: true,  when: '2026-07-15',  desc: 'PS Pack v1.0 distilled and packaged as blueprint.json' },
  { id: 'blueprint-act',   label: 'Blueprint Activated',             done: true,  when: '2026-07-17',  desc: 'Birla Digital Labs blueprint deployed to Kangqore View' },
  { id: 'ois-baseline',    label: 'OIS Day 0 Baseline Set',          done: true,  when: '2026-07-17',  desc: `Baseline measured: ${OIS_DAY0} — COIG tracking starts now` },
  { id: 'team-onboard',    label: 'Team Onboarding (4 users)',        done: false, when: 'Week 1',      desc: 'Admin, 2 Ops Leads, 1 Finance Lead to complete onboarding' },
  { id: 'first-mission',   label: 'First WAANDA Mission Completed',   done: false, when: 'Week 1',      desc: 'WAANDA executes first Projects workflow autonomously' },
  { id: 'waanda-live',     label: 'WAANDA Live — All Departments',    done: false, when: 'Day 7',       desc: '5-department WAANDA activation complete, intelligence active' },
  { id: 'coig-snap1',      label: 'First COIG Snapshot (Day 30)',     done: false, when: 'Day 30',      desc: 'OIS measured and delta calculated. First COIG report.' },
  { id: 'qbr1',            label: 'QBR #1 — 90-Day COIG Review',     done: false, when: 'Day 90',      desc: `Target: OIS ${OIS_TARGET_90D} (+${COIG_TARGET} COIG™) reviewed with stakeholders` },
]

const MILESTONES_90D = [
  { day: 0,   label: 'Day 0',   event: 'Blueprint activated · OIS baseline 62.0',     color: TEAL },
  { day: 7,   label: 'Day 7',   event: 'WAANDA live on 5 departments',                color: PURP },
  { day: 14,  label: 'Day 14',  event: 'Projects dept fully operational on WAANDA',   color: BLUE },
  { day: 30,  label: 'Day 30',  event: 'First COIG snapshot · Mid-point review',      color: AMB  },
  { day: 60,  label: 'Day 60',  event: 'Finance + Sales + HR on WAANDA',              color: BLUE },
  { day: 90,  label: 'Day 90',  event: `Target OIS ${OIS_TARGET_90D} · COIG +${COIG_TARGET}`,    color: TEAL },
]

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, Icon }: { label: string; value: string | number; sub: string; color: string; Icon: any }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T3 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: T2, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

// ── Gap lever bar ────────────────────────────────────────────────────────────
function GapBar({ lever }: { lever: typeof GAP_LEVERS[0] }) {
  const gap = lever.target - lever.current
  const pctCurrent = lever.current
  const pctTarget  = lever.target
  const color = gap >= 20 ? RED : gap >= 10 ? AMB : TEAL
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 10, color: T2, flex: 1, minWidth: 140 }}>{lever.label}</span>
      <div style={{ flex: 2, position: 'relative', height: 6, background: 'var(--os-surface-0)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pctCurrent}%`, background: color + '60', borderRadius: 3 }} />
        <div style={{ position: 'absolute', left: `${pctCurrent}%`, top: 0, height: '100%', width: `${pctTarget - pctCurrent}%`, background: color + '30', borderRadius: 3, borderLeft: `2px solid ${color}` }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 800, color, minWidth: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{lever.current}→{lever.target}</span>
      <span style={{ fontSize: 9, color: T3, minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>−{gap}</span>
    </div>
  )
}

// ── Recommendation card ───────────────────────────────────────────────────────
function RecCard({ rec }: { rec: typeof KIMMP_RECS[0] }) {
  const prioColor = rec.priority === 'critical' ? RED : AMB
  return (
    <div style={{ background: prioColor + '06', border: `1px solid ${prioColor}20`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: prioColor + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Lightbulb size={13} style={{ color: prioColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: prioColor, background: prioColor + '12', padding: '2px 6px', borderRadius: 4 }}>#{rec.rank} {rec.priority}</span>
          <span style={{ fontSize: 9, color: T3 }}>· {rec.effort} effort · {rec.eta}</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: TEAL, background: TEAL + '12', padding: '2px 6px', borderRadius: 4, marginLeft: 'auto' }}>{rec.oisImpact} OIS est.</span>
        </div>
        <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 4 }}>{rec.title}</p>
        <p style={{ fontSize: 11, color: T2, lineHeight: 1.6 }}>{rec.description}</p>
      </div>
      <Link
        to={`/kangqore-view/admin/kangqore-immp/${rec.action}`}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, color: prioColor, textDecoration: 'none', flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }}
      >
        Open <ArrowUpRight size={10} />
      </Link>
    </div>
  )
}

// ── Checklist item ────────────────────────────────────────────────────────────
function CheckItem({ item }: { item: typeof CHECKLIST[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ cursor: 'pointer', padding: '12px 16px', borderBottom: `1px solid ${BDR}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {item.done
          ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} />
          : <Circle size={14} style={{ color: T3, flexShrink: 0 }} />}
        <span style={{ fontSize: 12, fontWeight: 700, color: item.done ? TEAL : T1, flex: 1 }}>{item.label}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: item.done ? TEAL : T3, background: item.done ? TEAL + '12' : 'var(--os-surface-0)', padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>
          {item.done ? `✓ ${item.when}` : item.when}
        </span>
        <ChevronRight size={12} style={{ color: T3, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </div>
      {open && (
        <div style={{ marginTop: 8, marginLeft: 24, fontSize: 11, color: T2, lineHeight: 1.6 }}>
          {item.desc}
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function CustomerOnePage() {
  const activationDate = new Date(ACTIVATION_DATE)
  const today          = new Date()
  const daysSince      = Math.max(0, Math.floor((today.getTime() - activationDate.getTime()) / 86400_000))
  const daysToTarget   = Math.max(0, 90 - daysSince)
  const doneTasks      = CHECKLIST.filter(c => c.done).length

  const { data: liveOis } = useQuery<{ score: number }>({
    queryKey: ['c1-ois-live'],
    queryFn: () => api.get('/admin/gate8/score').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
  const currentOis = liveOis?.score ?? WEEKLY_COIG[WEEKLY_COIG.length - 1].ois
  const coigGained = +(currentOis - OIS_DAY0).toFixed(1)
  const coigPct    = Math.min(100, Math.round((coigGained / COIG_TARGET) * 100))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: TEAL + '15', border: `1px solid ${TEAL}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Building2 size={20} style={{ color: TEAL }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>{C1_NAME}</h1>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>Customer One</span>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: BLUE, background: BLUE + '12', padding: '3px 8px', borderRadius: 4 }}>Blueprint Active</span>
          </div>
          <p style={{ fontSize: 11, color: T2 }}>{C1_INDUSTRY}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>Day {daysSince}</div>
          <div style={{ fontSize: 10, color: T2, marginTop: 2 }}>of 90-day activation</div>
          <div style={{ fontSize: 10, color: T3, marginTop: 2 }}>{daysToTarget}d to COIG review</div>
        </div>
      </div>

      {/* ── OIS / COIG hero stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <StatCard label="OIS Day 0"    value={OIS_DAY0}              sub="Baseline · 2026-07-17"            color={T2}   Icon={Target}     />
        <StatCard label="OIS Current"  value={currentOis.toFixed(1)} sub={`Day ${daysSince} · live`}        color={TEAL} Icon={TrendingUp}  />
        <StatCard label="COIG™ Gained" value={coigGained >= 0 ? `+${coigGained}` : coigGained} sub={`${coigPct}% of ${COIG_TARGET}pt target`} color={PURP} Icon={Award} />
        <StatCard label="Activation"   value={`${doneTasks}/${CHECKLIST.length}`} sub="onboarding steps complete" color={BLUE} Icon={CheckCircle2} />
      </div>

      {/* ── PS Pack deployed ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <FileJson size={14} style={{ color: PURP }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Foundation Pack Deployed</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: TEAL + '12', padding: '2px 7px', borderRadius: 20, marginLeft: 'auto' }}>✓ blueprint.json {BLUEPRINT_V}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {PACK_CONTENTS.map(p => (
            <div key={p.label} style={{ textAlign: 'center', padding: '12px 8px', background: PURP + '08', borderRadius: 10, border: `1px solid ${PURP}18` }}>
              <p.icon size={16} style={{ color: PURP, margin: '0 auto 6px' }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: PURP, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{p.count}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T2, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>

        {/* ── Deployment checklist ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${BDR}` }}>
            <CheckCircle2 size={13} style={{ color: TEAL }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Deployment Checklist</span>
            <span style={{ fontSize: 10, color: T3, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{doneTasks}/{CHECKLIST.length}</span>
          </div>
          {CHECKLIST.map(item => <CheckItem key={item.id} item={item} />)}
          <div style={{ padding: '10px 16px' }}>
            <div style={{ height: 4, background: 'var(--os-surface-0)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(doneTasks / CHECKLIST.length) * 100}%`, background: TEAL, borderRadius: 2 }} />
            </div>
            <p style={{ fontSize: 9, color: T3, marginTop: 4 }}>{Math.round((doneTasks / CHECKLIST.length) * 100)}% complete</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── 90-day milestones ── */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Calendar size={13} style={{ color: BLUE }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>90-Day Roadmap</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MILESTONES_90D.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: m.color, background: m.color + '12', padding: '2px 7px', borderRadius: 4, flexShrink: 0, minWidth: 44, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 11, color: m.day <= daysSince ? T1 : T2, lineHeight: 1.4, paddingTop: 1 }}>
                    {m.event}
                    {m.day <= daysSince && <span style={{ color: TEAL, marginLeft: 4, fontSize: 9 }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Dept activation sequence ── */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Users size={13} style={{ color: AMB }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Department Activation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEPT_SEQUENCE.map(d => (
                <div key={d.order} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: T3, minWidth: 12 }}>{d.order}</span>
                  <span style={{ fontSize: 11, color: d.status === 'active' ? T1 : T2, flex: 1 }}>{d.dept}</span>
                  <span style={{ fontSize: 9, color: d.status === 'active' ? TEAL : T3 }}>{d.eta}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: TEAL + '10', padding: '1px 6px', borderRadius: 4 }}>{d.oisContrib}</span>
                  {d.status === 'active'
                    ? <Zap size={10} style={{ color: TEAL, flexShrink: 0 }} />
                    : <Lock size={9} style={{ color: T3, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── OIS Gap Analysis ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BarChart2 size={13} style={{ color: BLUE }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>OIS Gap Analysis — {currentOis.toFixed(1)} → {OIS_TARGET_90D} (need +{(OIS_TARGET_90D - currentOis).toFixed(1)})</span>
          <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>by pillar · current → target</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GAP_LEVERS.map(l => <GapBar key={l.label} lever={l} />)}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BDR}`, display: 'flex', gap: 24 }}>
          {[{ label: 'Largest gap', val: 'Decision Pipeline (−20)', color: RED }, { label: 'Best lever ROI', val: 'AI Utilisation (+5.8 OIS / medium effort)', color: AMB }, { label: 'Quick win', val: 'Decision Pipeline (+3.2 / low effort)', color: TEAL }].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 9, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontSize: 10, color: s.color, fontWeight: 700 }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KIMMP Top 3 Recommendations ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
          <Brain size={13} style={{ color: PURP }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>KIMMP Recommendations — Top 3 Priority Actions</span>
          <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>est. combined impact: +13.1 OIS</span>
        </div>
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {KIMMP_RECS.map(r => <RecCard key={r.rank} rec={r} />)}
        </div>
      </div>

      {/* ── COIG Weekly Tracker ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Activity size={13} style={{ color: TEAL }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>COIG™ Delta — Week-over-Week</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: TEAL + '12', padding: '2px 7px', borderRadius: 20, marginLeft: 'auto' }}>
            Cumulative: +{coigGained >= 0 ? coigGained : 0} / {COIG_TARGET} target
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WEEKLY_COIG.length}, 1fr)`, gap: 8, marginBottom: 14 }}>
          {WEEKLY_COIG.map((w, i) => {
            const isLatest = i === WEEKLY_COIG.length - 1
            const barH = Math.max(8, Math.round((w.ois - 58) * 6))
            return (
              <div key={w.week} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: w.delta > 0 ? TEAL : T3, fontVariantNumeric: 'tabular-nums' }}>
                  {w.delta > 0 ? `+${w.delta.toFixed(1)}` : '—'}
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 48 }}>
                  <div style={{ width: 28, height: barH, background: isLatest ? TEAL : TEAL + '40', borderRadius: 4, transition: 'height .3s' }} />
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: isLatest ? T1 : T2 }}>{w.week}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: isLatest ? TEAL : T3, fontVariantNumeric: 'tabular-nums' }}>{w.ois.toFixed(1)}</div>
              </div>
            )
          })}
          {/* projected weeks */}
          {Array.from({ length: Math.max(0, 8 - WEEKLY_COIG.length) }, (_, i) => (
            <div key={`proj-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 9, color: T3 }}>—</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 48 }}>
                <div style={{ width: 28, height: 8, background: TEAL + '15', borderRadius: 4, borderTop: `1.5px dashed ${TEAL}40` }} />
              </div>
              <div style={{ fontSize: 9, color: T3 }}>W{WEEKLY_COIG.length + i + 1}</div>
              <div style={{ fontSize: 9, color: T3 }}>proj.</div>
            </div>
          ))}
        </div>
        <div style={{ height: 2, background: 'var(--os-surface-0)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${coigPct}%`, background: `linear-gradient(90deg, ${TEAL}, ${PURP})`, borderRadius: 1 }} />
        </div>
        <p style={{ fontSize: 9, color: T3, marginTop: 4 }}>COIG progress: {coigPct}% of 90-day target · Blueprint v{BLUEPRINT_V} deployed</p>
      </div>

      {/* ── COIG target callout ── */}
      <div style={{ background: TEAL + '06', border: `1.5px solid ${TEAL}25`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Sparkles size={18} style={{ color: TEAL, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>90-Day COIG™ Target: <span style={{ color: TEAL }}>+{COIG_TARGET} points</span></p>
          <p style={{ fontSize: 11, color: T2 }}>
            OIS {OIS_DAY0} → OIS {OIS_TARGET_90D} · Measured by Kangqore View intelligence system · QBR review scheduled Day 90
          </p>
        </div>
        <Link
          to="/kangqore-view/admin/kangqore-immp/coig"
          style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: TEAL + '12', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          COIG Dashboard →
        </Link>
      </div>

    </div>
  )
}
