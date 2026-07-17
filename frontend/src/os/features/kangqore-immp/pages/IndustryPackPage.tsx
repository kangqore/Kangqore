import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, CheckCircle2, Zap, Brain, Target, FileText, Users,
  TrendingUp, Shield, Globe2, ChevronDown, ChevronRight,
  ArrowRight, Sparkles, BookOpen, Layers,
} from 'lucide-react'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'
const TEAL = '#10b981'
const BLUE = '#3b82f6'
const AMB  = '#f59e0b'

// ── PS Pack definition ────────────────────────────────────────────────────────
const PS_PILLARS = [
  {
    id: 'engagement', label: 'Engagement Intelligence', bids: 'P3',
    desc: 'Track deal progress from first contact through SOW sign-off with KIMMP-guided engagement scoring.',
    coverage: 92,
  },
  {
    id: 'delivery', label: 'Delivery Excellence', bids: 'P5',
    desc: 'Milestone-driven project delivery with automated escalation, capacity tracking, and quality gates.',
    coverage: 88,
  },
  {
    id: 'knowledge', label: 'Knowledge Fabric', bids: 'P8',
    desc: 'Capture and reuse engagement learnings across proposals, delivery playbooks, and team wikis.',
    coverage: 76,
  },
  {
    id: 'revenue', label: 'Revenue Operations', bids: 'P11',
    desc: 'End-to-end revenue tracking: proposal→SOW→invoice→renewal with WAANDA revenue signal detection.',
    coverage: 85,
  },
  {
    id: 'governance', label: 'Delivery Governance', bids: 'P14',
    desc: 'Risk scoring, escalation protocols, and QBR automation baked into every active engagement.',
    coverage: 80,
  },
]

const WORKFLOW_TEMPLATES = [
  {
    id: 'proposal',
    name: 'Proposal Builder',
    icon: FileText,
    color: BLUE,
    steps: ['Qualification → KIMMP scoring', 'Scope definition + AI draft', 'Pricing model + approval gate', 'Client review → finalise', 'Sent → track open + respond'],
    eta: '5–7 days',
    agents: ['RESEARCH', 'EXECUTION'],
  },
  {
    id: 'sow',
    name: 'SOW Execution',
    icon: BookOpen,
    color: PURP,
    steps: ['SOW signed → project created', 'Team assignment + capacity check', 'Kickoff checklist (KIMMP-guided)', 'Sprint 0 planning + tooling setup', 'WAANDA missions activated'],
    eta: '2–3 days',
    agents: ['EXECUTION', 'DIAGNOSTICS'],
  },
  {
    id: 'milestone',
    name: 'Milestone Management',
    icon: Target,
    color: TEAL,
    steps: ['Milestone due date tracking', 'Risk flag if slipping (−3d warning)', 'Auto-escalation to engagement lead', 'Stakeholder status briefing', 'Completion gate + sign-off capture'],
    eta: 'Ongoing',
    agents: ['DIAGNOSTICS', 'COACH'],
  },
  {
    id: 'invoice',
    name: 'Invoice Lifecycle',
    icon: TrendingUp,
    color: AMB,
    steps: ['Milestone completion → invoice trigger', 'Finance approval gate', 'Invoice sent + delivery confirmation', 'OVERDUE detection (+7d auto-flag)', 'Payment confirmed → COIG credit'],
    eta: '1–2 days per cycle',
    agents: ['EXECUTION', 'DIAGNOSTICS'],
  },
  {
    id: 'closeout',
    name: 'Engagement Closeout',
    icon: CheckCircle2,
    color: TEAL,
    steps: ['Final delivery sign-off', 'Retrospective capture → knowledge base', 'BIDS™ PS pillar score update', 'Renewal signal to CRM pipeline', 'Case study trigger + COIG snapshot'],
    eta: '3–5 days',
    agents: ['COACH', 'RESEARCH', 'EXECUTION'],
  },
]

const PACK_STATS = [
  { label: 'Workflows',      count: 17, icon: Zap,       color: BLUE },
  { label: 'Agents',         count: 80, icon: Brain,     color: PURP },
  { label: 'Goals',          count: 5,  icon: Target,    color: TEAL },
  { label: 'KPI Templates',  count: 12, icon: TrendingUp, color: AMB },
  { label: 'Ontology Types', count: 24, icon: Layers,    color: BLUE },
  { label: 'Policies',       count: 9,  icon: Shield,    color: PURP },
]

const INDUSTRY_EDITIONS = [
  { name: 'Professional Services', status: 'live',    color: TEAL, desc: 'Consulting · Systems Integrators · Advisory' },
  { name: 'Manufacturing',         status: 'planned', color: T3,   desc: 'Ops intelligence · Supply chain · Quality gates' },
  { name: 'Healthcare',            status: 'planned', color: T3,   desc: 'Care pathways · Compliance · Clinical ops' },
  { name: 'BFSI',                  status: 'planned', color: T3,   desc: 'Risk · Compliance · Financial intelligence' },
  { name: 'Logistics',             status: 'planned', color: T3,   desc: 'Fleet · Routing · Fulfilment intelligence' },
  { name: 'Education',             status: 'planned', color: T3,   desc: 'Curriculum · Enrolment · Outcome tracking' },
]

// ── Workflow template card ─────────────────────────────────────────────────────
function WorkflowCard({ wf }: { wf: typeof WORKFLOW_TEMPLATES[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 8, background: wf.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <wf.icon size={13} style={{ color: wf.color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: T1, flex: 1 }}>{wf.name}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {wf.agents.map(a => (
            <span key={a} style={{ fontSize: 8, fontWeight: 700, color: PURP, background: PURP + '12', padding: '1px 5px', borderRadius: 3 }}>{a}</span>
          ))}
        </div>
        <span style={{ fontSize: 9, color: T3, marginLeft: 4 }}>{wf.eta}</span>
        {open ? <ChevronDown size={12} style={{ color: T3 }} /> : <ChevronRight size={12} style={{ color: T3 }} />}
      </div>
      {open && (
        <div style={{ padding: '0 14px 14px 14px', borderTop: `1px solid ${BDR}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {wf.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: wf.color, background: wf.color + '12', width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 11, color: T2 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function IndustryPackPage() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: PURP + '15', border: `1px solid ${PURP}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package size={20} style={{ color: PURP }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: T1, letterSpacing: '-.02em' }}>Professional Services Pack</h1>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: TEAL, background: TEAL + '12', padding: '3px 8px', borderRadius: 4 }}>v1.0 · Live</span>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: PURP, background: PURP + '12', padding: '3px 8px', borderRadius: 4 }}>Industry Pack</span>
          </div>
          <p style={{ fontSize: 11, color: T2 }}>Pre-built Blueprint for Consulting · Systems Integration · Advisory firms — engagement → delivery → renewal lifecycle</p>
        </div>
        <button
          onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: PURP, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          <Sparkles size={12} /> Deploy as Blueprint
        </button>
      </div>

      {/* ── Pack stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {PACK_STATS.map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
            <s.icon size={14} style={{ color: s.color, margin: '0 auto 6px' }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.count}</div>
            <div style={{ fontSize: 8, fontWeight: 700, color: T3, marginTop: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── BIDS™ Pillars ── */}
        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
            <Globe2 size={13} style={{ color: PURP }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>BIDS™ Pillars Mapped</span>
            <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>5 of 16 PS-specific pillars</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PS_PILLARS.map(p => (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: PURP, background: PURP + '12', padding: '1px 6px', borderRadius: 4 }}>BIDS™ {p.bids}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{p.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: TEAL, marginLeft: 'auto' }}>{p.coverage}%</span>
                </div>
                <div style={{ height: 3, background: 'var(--os-surface-0)', borderRadius: 2, marginBottom: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.coverage}%`, background: TEAL, borderRadius: 2 }} />
                </div>
                <p style={{ fontSize: 10, color: T2 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Industry editions ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
              <Layers size={13} style={{ color: BLUE }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Industry Editions Roadmap</span>
            </div>
            <div style={{ padding: 0 }}>
              {INDUSTRY_EDITIONS.map((e, i) => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: i < INDUSTRY_EDITIONS.length - 1 ? `1px solid ${BDR}` : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: e.status === 'live' ? T1 : T2 }}>{e.name}</p>
                    <p style={{ fontSize: 9, color: T3 }}>{e.desc}</p>
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: e.status === 'live' ? TEAL : T3, background: e.status === 'live' ? TEAL + '12' : 'var(--os-surface-0)', padding: '2px 6px', borderRadius: 4 }}>
                    {e.status === 'live' ? '✓ Live' : 'Planned'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Activate CTA ── */}
          <div style={{ background: PURP + '06', border: `1.5px solid ${PURP}25`, borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={14} style={{ color: PURP }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>One-click Blueprint Deployment</span>
            </div>
            <p style={{ fontSize: 11, color: T2, marginBottom: 14, lineHeight: 1.6 }}>
              Select this pack in the Blueprint Wizard and Kangqore will pre-configure all 17 workflows, 80 agents, 5 goals, and 12 KPI templates for a new customer instance in seconds.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: PURP, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
              >
                New Deployment <ArrowRight size={12} />
              </button>
              <Link
                to="/kangqore-view/admin/kangqore-immp/blueprint"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: PURP, background: PURP + '12', padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}
              >
                View Blueprints
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Workflow templates ── */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', borderBottom: `1px solid ${BDR}` }}>
          <Zap size={13} style={{ color: BLUE }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: T1 }}>Consulting Workflow Templates</span>
          <span style={{ fontSize: 9, color: T3, marginLeft: 'auto' }}>5 core templates · click to expand steps</span>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WORKFLOW_TEMPLATES.map(wf => <WorkflowCard key={wf.id} wf={wf} />)}
        </div>
      </div>

      {/* ── Lifecycle callout ── */}
      <div style={{ background: TEAL + '06', border: `1.5px solid ${TEAL}25`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Users size={16} style={{ color: TEAL, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: T1, marginBottom: 2 }}>Full Lifecycle Coverage: <span style={{ color: TEAL }}>Engagement → Delivery → Renewal</span></p>
          <p style={{ fontSize: 11, color: T2 }}>PS Pack v1.0 covers the complete professional services revenue cycle — from first touch to closeout. KIMMP monitors every stage and flags risk automatically.</p>
        </div>
        <Link
          to="/kangqore-view/admin/kangqore-immp/customer-one"
          style={{ fontSize: 10, fontWeight: 700, color: TEAL, background: TEAL + '12', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          Customer One →
        </Link>
      </div>

    </div>
  )
}
