import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  CheckCircle2, Circle, Target, TrendingUp,
  Building2, Brain, FileJson, Users, Calendar, ChevronRight,
  Award, Sparkles, Lock, ArrowRight, Package, Copy,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#10b981'
const PURP = '#7c3aed'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'

const C3_NAME         = 'Customer Three'
const C3_INDUSTRY     = 'Enterprise · Technology'
const C3_PACK         = 'PS Pack v1.2'
const C3_BLUEPRINT    = 'v1.2'

const OIS_TARGET_90D = 78.0
const COIG_TARGET    = 15.0

const LEARNINGS = [
  { label: 'Day 0 onboarding time',              c0: '—',      c1: '3 days',   c2: '1.5 days',  c3Target: '1 day',    note: 'Agent warm-up + role template pre-seeded' },
  { label: 'Workflows activated (first week)',    c0: '—',      c1: '3 / 17',   c2: '8 / 17',    c3Target: '12 / 17',  note: 'Pre-built industry pack with C1/C2 defaults' },
  { label: 'Decisions routed (first 7 days)',     c0: '—',      c1: '0',        c2: '5+',         c3Target: '10+',      note: 'Decision canvas pre-seeded from C2 pattern' },
  { label: 'WAANDA session frequency (week 1)',   c0: '—',      c1: '1.2/u/w',  c2: '3+/u/w',    c3Target: '5+/u/w',   note: 'Executive pre-briefed, playbook pre-assigned' },
  { label: 'OIS at Day 30',                       c0: '78.9',   c1: '82.4',     c2: 'Est ~84',   c3Target: '87+',      note: 'Accelerated by 14-day warm-up + pre-seeded corpus' },
]

const PACK_IMPROVEMENTS = [
  { from: 'Agent warm-up ran 14 days (C2)',             to: 'Warm-up reduced to 7 days via pre-scored corpus at deploy' },
  { from: 'Security policy manually configured',        to: 'Security policy defaults taken from C2 blueprint.json template' },
  { from: 'Onboarding checklist sent as email',         to: 'Onboarding checklist embedded in WAANDA Day 0 session' },
  { from: 'COIG tracking started at Day 7 (C2)',        to: 'COIG baseline set on Day 0 → 90-day benchmark auto-scheduled' },
]

const CHECKLIST = [
  { id: 'prospect',     label: 'Prospect Qualified',                   done: false, when: 'TBD',      desc: 'Third enterprise customer identified via KIMMP revenue intelligence.' },
  { id: 'proposal',     label: 'Proposal Sent (PS Pack v1.2)',         done: false, when: 'TBD',      desc: 'Proposal built with C1 + C2 learnings applied. COIG benchmark from C0/C1 shown.' },
  { id: 'sow-signed',   label: 'SOW Signed',                           done: false, when: 'TBD',      desc: 'Formal SOW covering 90-day COIG commitment.' },
  { id: 'blueprint',    label: 'Blueprint Cloned (v1.2)',               done: false, when: 'On SOW',   desc: 'PS Pack v1.2 auto-cloned via Blueprint Clone Engine. C1 + C2 improvements distilled.' },
  { id: 'ois-baseline', label: 'OIS Day 0 Baseline',                   done: false, when: 'Day 0',    desc: `Day 0 snapshot taken immediately on activation. COIG target: +${COIG_TARGET} in 90 days.` },
  { id: 'team-onboard', label: 'Team Onboarding (target: 1 day)',      done: false, when: 'Day 1',    desc: 'Target 1 day onboarding using pre-seeded role templates and embedded WAANDA briefing.' },
  { id: 'waanda-live',  label: 'WAANDA Live — All Depts',              done: false, when: 'Day 3',    desc: 'Target Day 3 (C1=Day 7, C2=Day 5, C3=Day 3). Automated department sequences from blueprint.' },
  { id: 'coig-snap1',   label: 'COIG Snapshot Day 30',                 done: false, when: 'Day 30',   desc: 'Target: +7.5 COIG by Day 30 (C1 = +3.7, C2 = +6.0 target).' },
  { id: 'qbr1',         label: 'QBR #1 — 90-Day Review',               done: false, when: 'Day 90',   desc: `Target: OIS ${OIS_TARGET_90D} (+${COIG_TARGET} COIG). Case study + C4 referral ask.` },
]

const DEPT_SEQUENCE = [
  { dept: 'Projects & Delivery', order: 1, oisContrib: '+3.0', eta: 'Week 1' },
  { dept: 'Finance',             order: 2, oisContrib: '+2.5', eta: 'Week 1' },
  { dept: 'Sales & Revenue',     order: 3, oisContrib: '+2.3', eta: 'Week 2' },
  { dept: 'People & HR',         order: 4, oisContrib: '+2.0', eta: 'Week 3' },
  { dept: 'Leadership',          order: 5, oisContrib: '+5.2', eta: 'Week 6' },
]

export function CustomerThreePage() {
  const [checklist, setChecklist] = useState(CHECKLIST)
  const [cloning, setCloning]     = useState(false)
  const [cloneResult, setCloneResult] = useState<any>(null)

  const cloneMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/blueprint-clone', {
      sourceBlueprintVersion: '1.1',
      targetCustomerName:     C3_NAME,
      packId:                 'ps-pack-v1',
    }),
    onSuccess: (r) => setCloneResult(r.data?.blueprint),
  })

  function toggleItem(id: string) {
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const doneCount = checklist.filter(i => i.done).length

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Hero */}
      <div className="rounded-2xl p-6 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Building2 className="w-7 h-7" style={{ color: BLUE }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-lg font-black" style={{ color: T1 }}>{C3_NAME}</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(59,130,246,0.1)', color: BLUE }}>PRE-DEPLOYMENT</span>
            </div>
            <p className="text-xs mb-2" style={{ color: T2 }}>{C3_INDUSTRY} · {C3_PACK} · Blueprint {C3_BLUEPRINT}</p>
            <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: T2 }}>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> COIG target +{COIG_TARGET}</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> OIS target {OIS_TARGET_90D}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Activation TBD</span>
            </div>
          </div>
        </div>
      </div>

      {/* C0/C1/C2/C3 learnings */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BDR }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: BDR, background: CARD }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>Cumulative Learnings — C0 → C1 → C2 → C3 Targets</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: 'var(--os-surface-0)' }}>
                {['Metric', 'C0 (Live)', 'C1 Target', 'C2 Target', 'C3 Target', 'Improvement'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-bold" style={{ color: T2 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEARNINGS.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? CARD : 'var(--os-surface-0)' }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: T1 }}>{r.label}</td>
                  <td className="px-4 py-2.5" style={{ color: TEAL }}>{r.c0}</td>
                  <td className="px-4 py-2.5" style={{ color: T2 }}>{r.c1}</td>
                  <td className="px-4 py-2.5" style={{ color: AMB }}>{r.c2}</td>
                  <td className="px-4 py-2.5 font-semibold" style={{ color: BLUE }}>{r.c3Target}</td>
                  <td className="px-4 py-2.5 text-[11px]" style={{ color: T2 }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blueprint clone */}
      <div className="rounded-xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold" style={{ color: T1 }}>Blueprint Clone Engine</p>
            <p className="text-[11px]" style={{ color: T2 }}>Clone PS Pack v1.1 → v1.2 with C3 improvements applied</p>
          </div>
          <button
            onClick={() => cloneMut.mutate()}
            disabled={cloneMut.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: cloneMut.isPending ? 'rgba(59,130,246,0.3)' : '#3b82f6',
              color: '#fff',
              opacity: cloneMut.isPending ? 0.7 : 1,
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            {cloneMut.isPending ? 'Cloning…' : 'Clone Blueprint'}
          </button>
        </div>
        {cloneResult && (
          <div className="mt-3 p-3 rounded-lg border" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: TEAL }}>Blueprint v{cloneResult.version} generated for {cloneResult.customerName}</p>
            <pre className="text-[10px] overflow-x-auto" style={{ color: T2 }}>{JSON.stringify(cloneResult.kimmpConfig, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Pack improvements */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BDR }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: BDR, background: CARD }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>PS Pack Improvements — v1.1 → v1.2</p>
        </div>
        <div className="divide-y" style={{ borderColor: BDR }}>
          {PACK_IMPROVEMENTS.map((p, i) => (
            <div key={i} className="px-5 py-3 grid grid-cols-[1fr_auto_1fr] gap-3 items-center text-xs" style={{ background: CARD }}>
              <span style={{ color: T2 }}>{p.from}</span>
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEAL }} />
              <span style={{ color: T1 }}>{p.to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BDR }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: BDR, background: CARD }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>Deployment Checklist</p>
          <span className="text-xs font-bold" style={{ color: BLUE }}>{doneCount} / {checklist.length}</span>
        </div>
        <div className="divide-y" style={{ borderColor: BDR }}>
          {checklist.map((item) => (
            <div
              key={item.id}
              className="px-5 py-3.5 flex items-start gap-3 cursor-pointer hover:bg-opacity-50 transition-colors"
              style={{ background: CARD }}
              onClick={() => toggleItem(item.id)}
            >
              {item.done
                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: TEAL }} />
                : <Circle       className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: T2   }} />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-medium ${item.done ? 'line-through opacity-60' : ''}`} style={{ color: T1 }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                    style={{ background: 'rgba(59,130,246,0.1)', color: BLUE }}>{item.when}</span>
                </div>
                <p className="text-[11px]" style={{ color: T2 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dept sequence */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BDR }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: BDR, background: CARD }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: T2 }}>Department Activation Sequence</p>
        </div>
        <div className="divide-y" style={{ borderColor: BDR }}>
          {DEPT_SEQUENCE.map((d) => (
            <div key={d.dept} className="px-5 py-3 flex items-center gap-4 text-xs" style={{ background: CARD }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', color: BLUE }}>{d.order}</span>
              <span className="flex-1 font-medium" style={{ color: T1 }}>{d.dept}</span>
              <span className="font-bold" style={{ color: TEAL }}>{d.oisContrib} OIS</span>
              <span style={{ color: T2 }}>{d.eta}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav links */}
      <div className="flex gap-3">
        <Link to="/kangqore-view/admin/kangqore-immp/customers/two"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{ background: 'var(--os-surface-0)', color: T2 }}>
          ← Customer Two
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/customers/pipeline"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#3b82f6', color: '#fff' }}>
          C4–C5 Pipeline <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
