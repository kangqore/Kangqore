import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Circle, Target, TrendingUp,
  Building2, Brain, FileJson, Users, Calendar, ChevronRight,
  Award, Sparkles, Lock, ArrowRight, Package,
} from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'

const C2_NAME         = 'Customer Two'
const C2_INDUSTRY     = 'Enterprise · Professional Services'
const C2_PACK         = 'PS Pack v1.1'
const C2_BLUEPRINT    = 'v1.1'
const ACTIVATION_DATE = '2026-07-23'

const OIS_DAY0       = 58.4
const OIS_TARGET_90D = 72.0
const COIG_TARGET    = 13.0

const LEARNINGS_FROM_C1 = [
  { label: 'Day 0 onboarding time reduced',     c0: '—', c1: '3 days',   c2Target: '1.5 days', improvement: '50% faster' },
  { label: 'Workflows activated in first week',  c0: '—', c1: '3 / 17',  c2Target: '8 / 17',   improvement: '2.7× faster adoption' },
  { label: 'Decisions routed in first 7 days',   c0: '—', c1: '0',       c2Target: '5+',        improvement: 'Pipeline pre-seeded' },
  { label: 'WAANDA session frequency (w1)',       c0: '—', c1: '1.2/u/w', c2Target: '3+/u/w',   improvement: 'Pre-briefed team' },
]

const PACK_IMPROVEMENTS = [
  { from: 'Blueprint wizard required 5-step manual config', to: 'One-click deploy with C1 defaults applied' },
  { from: 'DNS / domain setup done manually post-deploy',   to: 'Custom Domains pre-verified in blueprint.json' },
  { from: 'No IP allowlist or SSO in v1.0',                 to: 'Security policy block pre-loaded in v1.1' },
  { from: '80 agents active on Day 0 (noise)',              to: 'KIMMP agent warm-up: 20 → 80 over 14 days' },
]

const CHECKLIST = [
  { id: 'prospect',     label: 'Prospect Qualified',         done: true,  when: '2026-07-20', desc: 'Second enterprise customer identified and qualified by KIMMP revenue intelligence.' },
  { id: 'proposal',     label: 'Proposal Sent (PS Pack)',    done: true,  when: '2026-07-21', desc: 'Proposal built from PS Pack v1.1 template. Estimated COIG value shown in proposal body.' },
  { id: 'sow-signed',   label: 'SOW Signed',                 done: true,  when: '2026-07-22', desc: 'Formal engagement agreement covering 90-day COIG commitment and QBR schedule.' },
  { id: 'blueprint',    label: 'Blueprint Generated (v1.1)', done: true,  when: '2026-07-23', desc: `PS Pack v1.1 distilled with C1 improvements applied. Blueprint Wizard completed via WAANDA.` },
  { id: 'ois-baseline', label: 'OIS Day 0 Baseline Set',     done: true,  when: '2026-07-23', desc: `Day 0 snapshot: OIS ${OIS_DAY0}. COIG target: +${COIG_TARGET} pts in 90 days.` },
  { id: 'team-onboard', label: 'Team Onboarding (target: 1.5 days)', done: false, when: 'Day 2',  desc: 'Faster onboarding based on C1 learnings — pre-briefed playbooks, role templates pre-assigned.' },
  { id: 'waanda-live',  label: 'WAANDA Live — All Depts',    done: false, when: 'Day 5',     desc: 'Target: 2 days earlier than Customer One activation (Day 7 → Day 5).' },
  { id: 'coig-snap1',   label: 'First COIG Snapshot (Day 30)', done: false, when: 'Day 30',  desc: 'OIS delta measured. Target: +6.0 COIG by Day 30 (C1 achieved +3.7 in same period).' },
  { id: 'qbr1',         label: 'QBR #1 — 90-Day COIG Review', done: false, when: 'Day 90',  desc: `Target: OIS ${OIS_TARGET_90D} (+${COIG_TARGET} COIG) reviewed with stakeholders. Case study generated.` },
]

const DEPT_SEQUENCE = [
  { dept: 'Projects & Delivery', order: 1, oisContrib: '+2.8', eta: 'Active',  done: true  },
  { dept: 'Finance',             order: 2, oisContrib: '+2.2', eta: 'Week 2',  done: false },
  { dept: 'Sales & Revenue',     order: 3, oisContrib: '+2.0', eta: 'Week 3',  done: false },
  { dept: 'People & HR',         order: 4, oisContrib: '+1.8', eta: 'Week 5',  done: false },
  { dept: 'Leadership',          order: 5, oisContrib: '+4.2', eta: 'Week 8',  done: false },
]

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

function CheckItem({ item }: { item: typeof CHECKLIST[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer', padding: '12px 16px', borderBottom: `1px solid ${BDR}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {item.done
          ? <CheckCircle2 size={14} style={{ color: TEAL, flexShrink: 0 }} />
          : <Circle size={14} style={{ color: T3, flexShrink: 0 }} />}
        <span style={{ fontSize: 12, fontWeight: 700, color: item.done ? TEAL : T1, flex: 1 }}>{item.label}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: T3, background: 'var(--os-surface-0)', padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>
          {item.when}
        </span>
        <ChevronRight size={12} style={{ color: T3, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </div>
      {open && <div style={{ marginTop: 8, marginLeft: 24, fontSize: 11, color: T2, lineHeight: 1.6 }}>{item.desc}</div>}
    </div>
  )
}

export function CustomerTwoPage() {
  const doneTasks = CHECKLIST.filter(c => c.done).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE + '15', border: `1px solid ${BLUE}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Building2 size={20} style={{ color: BLUE }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>{C2_NAME}</h1>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: BLUE, background: BLUE + '12', padding: '3px 8px', borderRadius: 4 }}>Customer Two</span>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>Active · Day 0</span>
          </div>
          <p style={{ fontSize: 11, color: T2 }}>{C2_INDUSTRY} · Blueprint {C2_BLUEPRINT} · {C2_PACK} · Activated {ACTIVATION_DATE}</p>
        </div>
        <Link
          to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: BLUE, padding: '8px 14px', borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}
        >
          <Sparkles size={12} /> Begin Deployment
        </Link>
      </div>

      {/* ── Hero stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <StatCard label="OIS Day 0"    value={OIS_DAY0}             sub={`Baseline · activated ${ACTIVATION_DATE}`} color={BLUE} Icon={Target} />
        <StatCard label="OIS Target"   value={OIS_TARGET_90D}       sub="90-day COIG benchmark"         color={TEAL} Icon={TrendingUp}  />
        <StatCard label="COIG™ Target" value={`+${COIG_TARGET}`}    sub="vs Customer One +11.0 in 90d"  color={PURP} Icon={Award}       />
        <StatCard label="Pack"         value={C2_BLUEPRINT}         sub={`${C2_PACK} · 5 improvements`} color={BLUE} Icon={Package}     />
      </div>

      {/* ── C1 learnings applied ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Brain size={13} style={{ color: PURP }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Learnings Applied from Customer One</span>
          <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>target: 50% faster time-to-baseline</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0 }}>
          {[{ label: 'Metric', c0: 'C0', c1: 'C1 Actual', c2: 'C2 Target' }].map(h => (
            <div key="header" style={{ display: 'contents' }}>
              {Object.values(h).map((v, i) => (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '.08em', padding: '6px 10px', borderBottom: `1px solid ${BDR}` }}>{v}</div>
              ))}
            </div>
          ))}
          {LEARNINGS_FROM_C1.map((l, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div style={{ fontSize: 11, color: T1, padding: '10px 10px', borderBottom: `1px solid ${BDR}` }}>{l.label}</div>
              <div style={{ fontSize: 10, color: T3, padding: '10px', borderBottom: `1px solid ${BDR}`, fontVariantNumeric: 'tabular-nums' }}>{l.c0}</div>
              <div style={{ fontSize: 10, color: T2, padding: '10px', borderBottom: `1px solid ${BDR}`, fontVariantNumeric: 'tabular-nums' }}>{l.c1}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: TEAL, padding: '10px', borderBottom: `1px solid ${BDR}`, fontVariantNumeric: 'tabular-nums' }}>{l.c2Target} <span style={{ fontSize: 8, color: T3 }}>({l.improvement})</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Blueprint v1.1 improvements ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <FileJson size={13} style={{ color: PURP }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Blueprint v1.1 — What Changed from v1.0</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: TEAL + '12', padding: '2px 7px', borderRadius: 20, marginLeft: 'auto' }}>4 improvements</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PACK_IMPROVEMENTS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: TEAL + '04', borderRadius: 10, border: `1px solid ${TEAL}14` }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <div style={{ fontSize: 9, color: T3, lineHeight: 1.4 }}>Before</div>
                <div style={{ fontSize: 11, color: T2, lineHeight: 1.5 }}>{p.from}</div>
              </div>
              <ArrowRight size={12} style={{ color: T3, flexShrink: 0, marginTop: 10 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, color: TEAL, lineHeight: 1.4 }}>After (v1.1)</div>
                <div style={{ fontSize: 11, color: T1, fontWeight: 600, lineHeight: 1.5 }}>{p.to}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>

        {/* ── Pre-deployment checklist ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${BDR}` }}>
            <CheckCircle2 size={13} style={{ color: BLUE }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Deployment Checklist</span>
            <span style={{ fontSize: 10, color: T3, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{doneTasks}/{CHECKLIST.length}</span>
          </div>
          {CHECKLIST.map(item => <CheckItem key={item.id} item={item} />)}
          <div style={{ padding: '10px 16px' }}>
            <div style={{ height: 4, background: 'var(--os-surface-0)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(doneTasks / CHECKLIST.length) * 100}%`, background: BLUE, borderRadius: 2 }} />
            </div>
            <p style={{ fontSize: 9, color: T3, marginTop: 4 }}>Pre-deployment phase · {Math.round((doneTasks / CHECKLIST.length) * 100)}% of deployment gates complete</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* ── Dept activation ── */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Users size={13} style={{ color: AMB }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Department Sequence (C2 Plan)</span>
              <span style={{ fontSize: 9, color: TEAL, marginLeft: 'auto' }}>2d faster than C1</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DEPT_SEQUENCE.map(d => (
                <div key={d.order} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: d.done ? TEAL : T3, minWidth: 12 }}>{d.order}</span>
                  <span style={{ fontSize: 11, color: d.done ? T1 : T2, flex: 1, fontWeight: d.done ? 700 : 400 }}>{d.dept}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: d.done ? TEAL : T3, background: d.done ? TEAL + '12' : 'var(--os-surface-0)', padding: '2px 7px', borderRadius: 20 }}>{d.eta}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, background: TEAL + '10', padding: '1px 6px', borderRadius: 4 }}>{d.oisContrib}</span>
                  {d.done
                    ? <CheckCircle2 size={10} style={{ color: TEAL, flexShrink: 0 }} />
                    : <Lock size={9} style={{ color: T3, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* ── 90-day milestones ── */}
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Calendar size={13} style={{ color: BLUE }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>90-Day Target Plan</span>
            </div>
            {[
              { day: 'Day 0',  event: `Blueprint ${C2_BLUEPRINT} activated · OIS baseline measured`, color: BLUE },
              { day: 'Day 5',  event: 'WAANDA live on all 5 departments (−2d vs C1)',                color: TEAL },
              { day: 'Day 14', event: '8+ workflows activated (target vs C1: 3 activated)',           color: PURP },
              { day: 'Day 30', event: 'First COIG snapshot · target +6.0 pts',                      color: AMB  },
              { day: 'Day 60', event: 'Finance + Sales + HR on WAANDA at full cadence',             color: BLUE },
              { day: 'Day 90', event: `Target OIS ${OIS_TARGET_90D} · COIG +${COIG_TARGET} · Case study published`, color: TEAL },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: m.color, background: m.color + '12', padding: '2px 7px', borderRadius: 4, flexShrink: 0, minWidth: 44, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                  {m.day}
                </div>
                <div style={{ fontSize: 11, color: T2, lineHeight: 1.4, paddingTop: 1 }}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom callout ── */}
      <div style={{ background: BLUE + '06', border: `1.5px solid ${BLUE}25`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Sparkles size={18} style={{ color: BLUE, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>
            Customer Two is <span style={{ color: TEAL }}>LIVE</span> — OIS Day 0 baseline captured at <span style={{ color: TEAL }}>{OIS_DAY0}</span>
          </p>
          <p style={{ fontSize: 11, color: T2 }}>
            Blueprint v1.1 activated {ACTIVATION_DATE} via Blueprint Wizard. COIG tracking started. Target: +{COIG_TARGET} pts in 90 days. First COIG snapshot due Day 30 (2026-08-22).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <Link
            to="/kangqore-view/admin/kangqore-immp/customer-success-platform"
            style={{ fontSize: 10, fontWeight: 700, color: BLUE, background: BLUE + '12', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            CS Platform →
          </Link>
          <Link
            to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
            style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: BLUE, padding: '6px 12px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Begin Deployment
          </Link>
        </div>
      </div>

    </div>
  )
}
