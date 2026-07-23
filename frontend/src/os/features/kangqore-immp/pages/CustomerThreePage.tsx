import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2, Circle, Target, TrendingUp, Building2, Calendar,
  ChevronRight, ArrowRight, Loader2, Zap, Clock, Activity,
  AlertCircle, Rocket, BarChart3,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN = '#10b981'
const PURP  = '#7c3aed'
const BLUE  = '#3b82f6'
const AMB   = '#f59e0b'
const TEAL  = '#0d9488'

const C3_OIS_TARGET_90D = 78.0
const C3_COIG_TARGET    = 15.0

const LEARNINGS = [
  { label: 'Day 0 onboarding time',            c0: '—',     c1: '3 days',  c2: '1.5 days', c3: '1 day',   note: 'Role templates + embedded WAANDA briefing pre-seeded' },
  { label: 'Workflows activated (first week)', c0: '—',     c1: '3/17',    c2: '8/17',     c3: '12/17',   note: 'Pre-built industry pack with C1/C2 defaults' },
  { label: 'Decisions routed (first 7 days)',  c0: '—',     c1: '0',       c2: '5+',       c3: '10+',     note: 'Decision canvas pre-seeded from C2 pattern' },
  { label: 'WAANDA sessions (week 1)',         c0: '—',     c1: '1.2/u/w', c2: '3+/u/w',  c3: '5+/u/w',  note: 'Executive pre-briefed, playbook pre-assigned' },
  { label: 'OIS at Day 30',                   c0: '78.9',  c1: '82.4',    c2: 'Est ~84',  c3: '87+',     note: 'Accelerated by 7-day warm-up + pre-seeded corpus' },
]

const PACK_IMPROVEMENTS = [
  { from: 'Agent warm-up ran 14 days (C1) → 7 days (C2)',  to: 'Reduced to 3 days via pre-scored corpus at deploy'              },
  { from: 'Security policy manually configured',            to: 'Security policy defaults from C2 blueprint.json template'       },
  { from: 'Onboarding checklist sent as email',             to: 'Onboarding checklist embedded in WAANDA Day 0 session'         },
  { from: 'COIG baseline set at Day 7 (C1) → Day 3 (C2)',  to: 'COIG baseline captured on Day 0 — benchmark auto-scheduled'    },
]

const DEPT_SEQUENCE = [
  { dept: 'Projects & Delivery', order: 1, oisContrib: '+3.0', eta: 'Week 1' },
  { dept: 'Finance',             order: 2, oisContrib: '+2.5', eta: 'Week 1' },
  { dept: 'Sales & Revenue',     order: 3, oisContrib: '+2.3', eta: 'Week 2' },
  { dept: 'People & HR',         order: 4, oisContrib: '+2.0', eta: 'Week 3' },
  { dept: 'Leadership',          order: 5, oisContrib: '+5.2', eta: 'Week 6' },
]

function daysSince(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function CoigClock({ deployedAt }: { deployedAt: string }) {
  const days = daysSince(deployedAt) ?? 0
  const pct  = Math.min(100, (days / 90) * 100)
  return (
    <div style={{ background: CARD, border: `1px solid ${PURP}25`, borderRadius: 14, padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: PURP }}>COIG Clock</span>
        <span style={{ fontSize: 11, color: T2 }}>Day <strong style={{ color: PURP, fontSize: 15 }}>{days}</strong> / 90</span>
      </div>
      <div style={{ height: 6, background: 'var(--os-surface-0)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${PURP}, #a855f7)`, borderRadius: 99, transition: 'width 0.5s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: T2 }}>
        <span>{new Date(deployedAt).toLocaleDateString()}</span>
        <span>Target: +{C3_COIG_TARGET} COIG by Day 90</span>
      </div>
    </div>
  )
}

// ── Checklist auto-derives from blueprint status ──────────────────────────────
function buildChecklist(bp: any | null) {
  const isActive = bp?.status === 'ACTIVE'
  const hasBlueprint = !!bp
  return [
    { id: 'prospect',     label: 'Prospect Qualified',           done: hasBlueprint, when: 'TBD',     desc: 'Customer identified via KIMMP revenue intelligence and pipeline.' },
    { id: 'proposal',     label: 'Proposal Sent (Blueprint v1)', done: hasBlueprint, when: 'On SOW',  desc: 'Proposal built with C0/C1/C2 learnings applied. COIG benchmark shown.' },
    { id: 'blueprint',    label: 'Blueprint Generated via Wizard', done: hasBlueprint, when: 'On SOW', desc: 'Blueprint Wizard ran organically — no manual seeding.' },
    { id: 'sow-signed',   label: 'SOW Signed',                   done: isActive,     when: 'On SOW',  desc: 'Formal SOW covering 90-day COIG commitment.' },
    { id: 'ois-baseline', label: 'OIS Day 0 Baseline Captured',  done: isActive,     when: 'Day 0',   desc: `Baseline: ${bp?.oisBaseline ?? '—'} · Target: ${bp?.oisTarget ?? C3_OIS_TARGET_90D}. COIG clock started.` },
    { id: 'team-onboard', label: 'Team Onboarding (target: 1 day)', done: false,     when: 'Day 1',   desc: 'Pre-seeded role templates + embedded WAANDA Day 0 briefing.' },
    { id: 'waanda-live',  label: 'WAANDA Live — All Departments', done: false,       when: 'Day 3',   desc: 'Target: Day 3 activation. C1=Day 7, C2=Day 5, C3=Day 3.' },
    { id: 'coig-snap1',   label: 'COIG Snapshot Day 30',         done: false,        when: 'Day 30',  desc: 'Target: +7.5 COIG by Day 30.' },
    { id: 'qbr1',         label: 'QBR #1 — 90-Day Review',       done: false,        when: 'Day 90',  desc: `Target: OIS ${C3_OIS_TARGET_90D} (+${C3_COIG_TARGET} COIG). C4 referral ask.` },
  ]
}

// ── Pre-deployment: prompt to run wizard ──────────────────────────────────────
function PreDeployment({ onProvision, provisioning }: { onProvision: () => void; provisioning: boolean }) {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: CARD, border: `2px dashed ${AMB}40`, borderRadius: 16,
        padding: '36px 32px', textAlign: 'center', marginBottom: 20,
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: AMB + '12', border: `2px solid ${AMB}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Rocket style={{ width: 24, height: 24, color: AMB }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: T1, marginBottom: 6, letterSpacing: '-.02em' }}>
          Customer Three — Not Yet Provisioned
        </div>
        <p style={{ fontSize: 12, color: T2, lineHeight: 1.65, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
          S100 requires organic provisioning — no manual seeding. Run the Blueprint Wizard to set the customer name, industry, OIS baseline, modules, and goals. WAANDA provisions everything from there.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-wizard')}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: BLUE, color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Zap style={{ width: 13, height: 13 }} /> Run Blueprint Wizard
          </button>
          <button
            onClick={onProvision}
            disabled={provisioning}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: GREEN + '15', color: GREEN, border: `1px solid ${GREEN}30`, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: provisioning ? 0.6 : 1 }}>
            {provisioning ? <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 style={{ width: 13, height: 13 }} />}
            {provisioning ? 'Provisioning…' : 'Quick Provision (defaults)'}
          </button>
        </div>
        <p style={{ fontSize: 10, color: T2, marginTop: 12 }}>
          "Quick Provision" uses Technology industry · SME · OIS 64→79. Use the Wizard for full configuration.
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function CustomerThreePage() {
  const qc = useQueryClient()
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})

  const { data: bpData, isLoading } = useQuery({
    queryKey: ['customer-blueprints'],
    queryFn:  () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => r.data),
    staleTime: 15_000,
  })

  // Find Customer Three's blueprint (most recent, any status)
  const blueprint = (bpData?.blueprints ?? []).find(
    (b: any) => b.customerName?.toLowerCase().includes('three') || b.customerName?.toLowerCase().includes('customer 3')
  ) ?? null

  const isActive  = blueprint?.status === 'ACTIVE'
  const isLoaded  = !isLoading
  const days      = daysSince(blueprint?.deployedAt)

  const checklist = buildChecklist(blueprint)
  const effectiveChecklist = checklist.map(item => ({
    ...item,
    done: item.done || !!checklistState[item.id],
  }))
  const doneCount = effectiveChecklist.filter(i => i.done).length

  const quickProvisionMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/customers/provision-one', {
      customerName:   'Customer Three',
      subdomain:      'customer-three',
      industry:       'Enterprise Technology',
      planTier:       'PRO',
      size:           '51–200 employees',
      oisBaseline:    64.0,
      oisTarget:      79.0,
      enabledModules: ['projects', 'finance', 'sales', 'people', 'leadership'],
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customer-blueprints'] }),
  })

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 40, color: T2, fontSize: 12 }}>
      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', color: BLUE }} />
      Loading Customer Three…
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (isLoaded && !blueprint) return (
    <PreDeployment
      onProvision={() => quickProvisionMut.mutate()}
      provisioning={quickProvisionMut.isPending}
    />
  )

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Hero ── */}
      <div style={{ background: CARD, border: `1px solid ${isActive ? GREEN + '30' : BDR}`, borderRadius: 18, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: BLUE + '12', border: `1px solid ${BLUE}25` }}>
            <Building2 style={{ width: 24, height: 24, color: BLUE }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 900, color: T1 }}>Customer Three</span>
              <span style={{
                padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800,
                background: isActive ? GREEN + '15' : AMB + '15',
                color: isActive ? GREEN : AMB,
              }}>
                {isActive ? 'ACTIVE' : 'DRAFT'}
              </span>
              {blueprint?.industry && (
                <span style={{ fontSize: 10, color: T2 }}>{blueprint.industry}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: T2, marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target style={{ width: 11, height: 11 }} /> COIG target +{C3_COIG_TARGET}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp style={{ width: 11, height: 11 }} />
                OIS {blueprint?.oisBaseline ?? '—'} → target {blueprint?.oisTarget ?? C3_OIS_TARGET_90D}
              </span>
              {blueprint?.planTier && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BarChart3 style={{ width: 11, height: 11 }} /> {blueprint.planTier}
                </span>
              )}
              {blueprint?.deployedAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar style={{ width: 11, height: 11 }} />
                  Provisioned {new Date(blueprint.deployedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── OIS + COIG strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'OIS Day 0',    value: blueprint?.oisBaseline ?? '—', color: AMB,  sub: 'Baseline on activation'      },
          { label: 'OIS Target',   value: blueprint?.oisTarget   ?? C3_OIS_TARGET_90D, color: GREEN, sub: '90-day commitment' },
          { label: 'COIG Target',  value: `+${C3_COIG_TARGET}`,  color: PURP, sub: 'Points in 90 days'              },
        ].map(s => (
          <div key={s.label} style={{ background: s.color + '08', border: `1px solid ${s.color}20`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: 3 }}>{String(s.value)}</div>
            <div style={{ fontSize: 10, color: T2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── COIG clock (only if active) ── */}
      {isActive && blueprint?.deployedAt && <CoigClock deployedAt={blueprint.deployedAt} />}

      {/* ── Not yet active callout ── */}
      {!isActive && (
        <div style={{ display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 10, background: AMB + '08', border: `1px solid ${AMB}25` }}>
          <AlertCircle style={{ width: 14, height: 14, color: AMB, flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 11, color: T2 }}>
            Blueprint is in <strong style={{ color: AMB }}>DRAFT</strong> state. Run the Blueprint Wizard and click Activate to start the COIG clock and capture OIS Day 0.{' '}
            <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard" style={{ color: BLUE, fontWeight: 700 }}>Open Wizard →</Link>
          </div>
        </div>
      )}

      {/* ── C0→C1→C2→C3 learnings table ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: `1px solid ${BDR}`, background: CARD }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: T2 }}>
            Cumulative Learnings — C0 → C1 → C2 → C3 Targets
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: SURF }}>
                {['Metric', 'C0 (Live)', 'C1', 'C2', 'C3 Target', 'How'].map(h => (
                  <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontWeight: 700, color: T2, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEARNINGS.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? CARD : SURF }}>
                  <td style={{ padding: '8px 14px', fontWeight: 600, color: T1 }}>{r.label}</td>
                  <td style={{ padding: '8px 14px', color: TEAL,  fontWeight: 700 }}>{r.c0}</td>
                  <td style={{ padding: '8px 14px', color: T2  }}>{r.c1}</td>
                  <td style={{ padding: '8px 14px', color: AMB  }}>{r.c2}</td>
                  <td style={{ padding: '8px 14px', color: BLUE, fontWeight: 700 }}>{r.c3}</td>
                  <td style={{ padding: '8px 14px', color: T2,  fontSize: 10 }}>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pack improvements ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: `1px solid ${BDR}`, background: CARD }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: T2 }}>Blueprint Improvements Applied to C3</span>
        </div>
        {PACK_IMPROVEMENTS.map((p, i) => (
          <div key={i} style={{ padding: '10px 18px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center', fontSize: 11, background: i % 2 === 0 ? CARD : SURF, borderBottom: i < PACK_IMPROVEMENTS.length - 1 ? `1px solid ${BDR}` : undefined }}>
            <span style={{ color: T2 }}>{p.from}</span>
            <ArrowRight style={{ width: 13, height: 13, color: TEAL, flexShrink: 0 }} />
            <span style={{ color: T1 }}>{p.to}</span>
          </div>
        ))}
      </div>

      {/* ── Deployment checklist ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: `1px solid ${BDR}`, background: CARD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: T2 }}>Deployment Checklist</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: BLUE }}>{doneCount} / {effectiveChecklist.length}</span>
        </div>
        {effectiveChecklist.map(item => (
          <div key={item.id} onClick={() => setChecklistState(s => ({ ...s, [item.id]: !item.done }))}
            style={{ padding: '12px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: CARD, borderBottom: `1px solid ${BDR}` }}>
            {item.done
              ? <CheckCircle2 style={{ width: 15, height: 15, color: GREEN, flexShrink: 0, marginTop: 1 }} />
              : <Circle       style={{ width: 15, height: 15, color: T2,    flexShrink: 0, marginTop: 1 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.done ? T2 : T1, textDecoration: item.done ? 'line-through' : undefined, opacity: item.done ? 0.6 : 1 }}>{item.label}</span>
                <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 4, background: BLUE + '12', color: BLUE, fontWeight: 700, flexShrink: 0 }}>{item.when}</span>
              </div>
              <p style={{ fontSize: 10, color: T2, margin: 0 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Department activation sequence ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: `1px solid ${BDR}`, background: CARD }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: T2 }}>Department Activation Sequence</span>
        </div>
        {DEPT_SEQUENCE.map((d, i) => (
          <div key={d.dept} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, background: i % 2 === 0 ? CARD : SURF, borderBottom: i < DEPT_SEQUENCE.length - 1 ? `1px solid ${BDR}` : undefined }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: BLUE + '12', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, flexShrink: 0 }}>{d.order}</span>
            <span style={{ flex: 1, fontWeight: 600, color: T1 }}>{d.dept}</span>
            <span style={{ fontWeight: 800, color: GREEN }}>{d.oisContrib} OIS</span>
            <span style={{ color: T2 }}>{d.eta}</span>
          </div>
        ))}
      </div>

      {/* ── PMO organic data reminder ── */}
      <div style={{ padding: '14px 18px', borderRadius: 12, background: AMB + '06', border: `1px solid ${AMB}20`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Activity style={{ width: 14, height: 14, color: AMB, flexShrink: 0, marginTop: 1 }} />
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: AMB }}>PMO Organic Data</span>
          <p style={{ fontSize: 10, color: T2, margin: '3px 0 6px' }}>
            Replace seed milestones on C0, C1, and C2 with organic project activity. Use the PMO admin panel to add real project records.
          </p>
          <Link to="/kangqore-view/admin/kangqore-immp/pmo"
            style={{ fontSize: 10, fontWeight: 700, color: BLUE, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Open PMO Admin <ChevronRight style={{ width: 11, height: 11 }} />
          </Link>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/customers/two"
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 16px', borderRadius: 10, background: SURF, color: T2, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          ← Customer Two
        </Link>
        <Link to="/kangqore-view/admin/kangqore-immp/customers/pipeline"
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 16px', borderRadius: 10, background: BLUE, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
          C4–C5 Pipeline <ChevronRight style={{ width: 13, height: 13 }} />
        </Link>
        {!isActive && (
          <Link to="/kangqore-view/admin/kangqore-immp/blueprint-wizard"
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 16px', borderRadius: 10, background: GREEN, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            <Zap style={{ width: 13, height: 13 }} /> Provision via Wizard
          </Link>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
