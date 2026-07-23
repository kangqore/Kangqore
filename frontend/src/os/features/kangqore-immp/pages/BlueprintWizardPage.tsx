import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Check, ChevronRight, Package, Layers, TrendingUp,
  Target, Zap, Cpu, Globe2, Plus, X, Download,
  Building2, Sparkles, CheckCircle2, Loader2,
} from 'lucide-react'

// ── Palette ───────────────────────────────────────────────────────────────────
const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const T3   = 'var(--os-text-3)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN  = '#10b981'
const BLUE   = '#3b82f6'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const TEAL   = '#0d9488'
const SLATE  = '#6b7280'

// ── Types ─────────────────────────────────────────────────────────────────────
type WizardStep = 'industry' | 'modules' | 'ois' | 'goals' | 'waanda' | 'done'

const STEPS: { key: WizardStep; label: string; icon: React.ElementType }[] = [
  { key: 'industry', label: 'Industry',   icon: Building2   },
  { key: 'modules',  label: 'Modules',    icon: Layers      },
  { key: 'ois',      label: 'OIS Profile',icon: TrendingUp  },
  { key: 'goals',    label: 'Goals',      icon: Target      },
  { key: 'waanda',   label: 'WAANDA',     icon: Cpu         },
  { key: 'done',     label: 'Blueprint',  icon: Globe2      },
]

const INDUSTRIES = [
  { id: 'professional-services', label: 'Professional Services', emoji: '🏢', pack: 'professional-services' },
  { id: 'technology',             label: 'Technology',             emoji: '💻', pack: 'technology'             },
  { id: 'consulting',             label: 'Consulting',             emoji: '📊', pack: 'consulting'             },
  { id: 'healthcare',             label: 'Healthcare',             emoji: '🏥', pack: 'healthcare'             },
  { id: 'financial-services',     label: 'Financial Services',     emoji: '🏦', pack: 'financial-services'     },
  { id: 'legal',                   label: 'Legal',                   emoji: '⚖️', pack: 'legal'                  },
  { id: 'manufacturing',          label: 'Manufacturing',          emoji: '🏭', pack: 'manufacturing'          },
  { id: 'construction',           label: 'Construction',           emoji: '🏗️', pack: 'construction'           },
  { id: 'education',              label: 'Education',              emoji: '🎓', pack: 'education'              },
]

const DEFAULT_MODULES = [
  { id: 'projects',    label: 'Projects & Delivery',   oisContrib: '+2.8',  color: BLUE   },
  { id: 'finance',     label: 'Finance & Revenue',     oisContrib: '+2.2',  color: GREEN  },
  { id: 'sales',       label: 'Sales & Pipeline',      oisContrib: '+2.0',  color: AMBER  },
  { id: 'people',      label: 'People & HR',           oisContrib: '+1.8',  color: PURPLE },
  { id: 'leadership',  label: 'Leadership & Strategy', oisContrib: '+4.2',  color: TEAL   },
  { id: 'operations',  label: 'Operations',            oisContrib: '+1.5',  color: SLATE  },
]

const INDUSTRY_GOALS: Record<string, string[]> = {
  'professional-services': [
    'Achieve >75% resource utilisation across delivery teams',
    'Maintain client retention rate above 90%',
    'Grow proposal win rate to 40%+',
    'Reduce time-to-proposal to under 48 hours',
    'Deliver 95%+ projects on-time and on-budget',
  ],
  technology: [
    'Ship features with <2% post-release defect rate',
    'Achieve >99.5% service uptime across production',
    'Reduce mean time to resolution (MTTR) to under 30 min',
    'Grow monthly active users by 20% QoQ',
    'Maintain engineering cycle time under 5 days',
  ],
  consulting: [
    'Achieve partner utilisation above 70%',
    'Win rate on competitive bids >35%',
    'Client NPS above 70 across all engagements',
    'Proposal-to-SOW conversion in under 7 days',
    'Knowledge asset reuse rate above 60%',
  ],
  healthcare: [
    'Reduce patient wait time by 30% within 90 days',
    'Achieve 98%+ clinical documentation accuracy',
    'Maintain HIPAA compliance score >95%',
    'Staff utilisation across care teams above 85%',
    'Patient readmission rate below industry average',
  ],
  'financial-services': [
    'NPA ratio below 2.5% across loan book',
    'AML alert false-positive rate under 15%',
    'KYC onboarding completed within 24 hours',
    'Loan processing end-to-end under 5 days',
    'Regulatory audit score above 92%',
  ],
  legal: [
    'Matter billing realisation above 85%',
    'Contract review turnaround under 48 hours',
    'Client communication SLA met >95% of time',
    'Risk assessment coverage 100% of active matters',
    'Knowledge management reuse rate above 60%',
  ],
  manufacturing: [
    'OEE (Overall Equipment Effectiveness) above 80%',
    'Defect rate below 0.5% of total output',
    'Unplanned downtime under 2% of production hours',
    'Supply chain on-time delivery rate >95%',
    'Carbon footprint reduced 15% in 12 months',
  ],
  construction: [
    'Project on-time completion rate above 90%',
    'Safety incident rate below 0.8 per 100 workers',
    'Cost variance within 5% of original estimate',
    'Subcontractor compliance score above 95%',
    'Daily site report completion rate 100%',
  ],
  education: [
    'Student completion rate above 85%',
    'Faculty resource utilisation above 80%',
    'Assessment delivery on schedule 100%',
    'Student satisfaction NPS above 65',
    'Operational cost per student reduced 10%',
  ],
}

const DEFAULT_ENTITY_TYPES = [
  'Client', 'Project', 'Invoice', 'Lead', 'Proposal',
  'Resource', 'Risk', 'Supplier', 'Contract', 'Task',
]

// ── Step bar ──────────────────────────────────────────────────────────────────
function StepBar({ current }: { current: WizardStep }) {
  const ci = STEPS.findIndex(s => s.key === current)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
      {STEPS.map((s, i) => {
        const done   = i < ci
        const active = i === ci
        const Icon   = s.icon
        const col    = done ? GREEN : active ? BLUE : SLATE
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: done ? GREEN : active ? BLUE : SURF,
                border: `2px solid ${col}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done
                  ? <Check style={{ width: 13, height: 13, color: '#fff' }} />
                  : <Icon style={{ width: 13, height: 13, color: active ? '#fff' : SLATE }} />}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < ci ? GREEN : BDR, margin: '0 6px', marginBottom: 20 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0, letterSpacing: '-.02em' }}>{title}</h2>
      <p style={{ fontSize: 11, color: SLATE, margin: '5px 0 0' }}>{sub}</p>
    </div>
  )
}

function NavRow({ onBack, onNext, nextLabel = 'Continue', disabled = false }: {
  onBack?: () => void; onNext: () => void; nextLabel?: string; disabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
      <button onClick={onNext} disabled={disabled} style={{
        background: disabled ? SLATE : BLUE, color: '#fff', border: 'none',
        borderRadius: 8, padding: '10px 24px', fontSize: 12, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {nextLabel} <ChevronRight style={{ width: 13, height: 13 }} />
      </button>
      {onBack && (
        <button onClick={onBack} style={{
          background: SURF, border: `1px solid ${BDR}`, borderRadius: 8,
          padding: '10px 16px', fontSize: 12, cursor: 'pointer', color: T2,
        }}>
          Back
        </button>
      )}
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────────────────────────
export function BlueprintWizardPage() {
  const navigate = useNavigate()

  const [step,         setStep]         = useState<WizardStep>('industry')
  const [industry,     setIndustry]     = useState<typeof INDUSTRIES[0] | null>(null)
  const [modules,      setModules]      = useState<string[]>(DEFAULT_MODULES.map(m => m.id))
  const [oisDay0,      setOisDay0]      = useState(58)
  const [oisDay90,     setOisDay90]     = useState(75)
  const [coigTarget,   setCoigTarget]   = useState(13)
  const [customerName, setCustomerName] = useState('Customer Two')
  const [orgSize,      setOrgSize]      = useState<'STARTUP' | 'SME' | 'ENTERPRISE'>('SME')
  const [goals,        setGoals]        = useState<string[]>([])
  const [newGoal,      setNewGoal]      = useState('')
  const [entityTypes,  setEntityTypes]  = useState<string[]>(DEFAULT_ENTITY_TYPES.slice(0, 7))
  const [newEntity,    setNewEntity]    = useState('')
  const [waandaState,  setWaandaState]  = useState<'idle' | 'analyzing' | 'done'>('idle')
  const [generatedId,  setGeneratedId]  = useState<string | null>(null)
  const waandaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pre-populate goals when industry changes
  useEffect(() => {
    if (industry) {
      setGoals(INDUSTRY_GOALS[industry.id] ?? INDUSTRY_GOALS['professional-services'])
    }
  }, [industry])

  // WAANDA analysis animation on entering step
  useEffect(() => {
    if (step === 'waanda' && waandaState === 'idle') {
      setWaandaState('analyzing')
      waandaTimerRef.current = setTimeout(() => setWaandaState('done'), 1600)
    }
    return () => { if (waandaTimerRef.current) clearTimeout(waandaTimerRef.current) }
  }, [step, waandaState])

  const generateMut = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/blueprints/generate', {
      method: 'POST',
      body: JSON.stringify({
        name:     `${customerName} Blueprint`,
        orgName:  customerName,
        pack:     industry?.pack ?? 'professional-services',
        industry: industry?.id  ?? 'professional-services',
        orgSize,
      }),
    }),
    onSuccess: (data: { id: string }) => {
      setGeneratedId(data.id)
      setStep('done')
    },
  })

  const activateMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/blueprints/${id}/activate`, { method: 'PATCH' }),
    onSuccess: () => navigate('/kangqore-view/admin/kangqore-immp/customers/two'),
  })

  // ── Step: Industry ─────────────────────────────────────────────────────────
  if (step === 'industry') return (
    <div style={{ maxWidth: 720 }}>
      <StepBar current="industry" />
      <PageHeader
        title="Select Industry"
        sub="WAANDA will configure ontology, KPIs, and agent profiles optimised for your industry."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {INDUSTRIES.map(ind => (
          <button key={ind.id} onClick={() => setIndustry(ind)} style={{
            background: industry?.id === ind.id ? BLUE + '10' : CARD,
            border: `2px solid ${industry?.id === ind.id ? BLUE : BDR}`,
            borderRadius: 12, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
            transition: 'border-color .15s, background .15s',
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{ind.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: industry?.id === ind.id ? BLUE : T1 }}>{ind.label}</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: SLATE, marginBottom: 6 }}>Customer / Organisation Name</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. Acme Corp"
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, padding: '9px 12px', fontSize: 12, color: T1, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: SLATE, marginBottom: 6 }}>Organisation Size</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['STARTUP', 'SME', 'ENTERPRISE'] as const).map(s => (
              <button key={s} onClick={() => setOrgSize(s)} style={{
                padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${orgSize === s ? BLUE : BDR}`,
                background: orgSize === s ? BLUE + '10' : CARD, color: orgSize === s ? BLUE : T2,
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <NavRow onNext={() => setStep('modules')} disabled={!industry || !customerName.trim()} />
    </div>
  )

  // ── Step: Modules ──────────────────────────────────────────────────────────
  if (step === 'modules') return (
    <div style={{ maxWidth: 600 }}>
      <StepBar current="modules" />
      <PageHeader
        title="Enable Modules"
        sub={`Select which departments and capability modules to activate for ${customerName}. Each adds measurable OIS uplift.`}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DEFAULT_MODULES.map(m => {
          const on = modules.includes(m.id)
          return (
            <button key={m.id} onClick={() => setModules(ms => on ? ms.filter(x => x !== m.id) : [...ms, m.id])} style={{
              background: on ? m.color + '08' : CARD,
              border: `2px solid ${on ? m.color + '40' : BDR}`,
              borderRadius: 12, padding: '14px 18px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14, transition: 'all .15s',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: on ? m.color : SURF, border: `2px solid ${on ? m.color : BDR}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <Check style={{ width: 11, height: 11, color: '#fff' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: on ? m.color : T1 }}>{m.label}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: on ? m.color : SLATE, background: on ? m.color + '12' : SURF, padding: '2px 8px', borderRadius: 6 }}>
                OIS {m.oisContrib}
              </span>
            </button>
          )
        })}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: GREEN + '08', border: `1px solid ${GREEN}20`, fontSize: 11, color: T2 }}>
        Total OIS potential from selected modules:{' '}
        <strong style={{ color: GREEN }}>
          +{DEFAULT_MODULES.filter(m => modules.includes(m.id)).reduce((s, m) => s + parseFloat(m.oisContrib), 0).toFixed(1)}
        </strong>
      </div>
      <NavRow onBack={() => setStep('industry')} onNext={() => setStep('ois')} disabled={modules.length === 0} />
    </div>
  )

  // ── Step: OIS Profile ─────────────────────────────────────────────────────
  if (step === 'ois') return (
    <div style={{ maxWidth: 560 }}>
      <StepBar current="ois" />
      <PageHeader
        title="OIS™ Profile"
        sub="Set the Operational Intelligence Score baseline and 90-day target. WAANDA will track this as the north-star metric."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { label: 'Day 0 Baseline OIS', value: oisDay0, set: setOisDay0, min: 0, max: 85, color: AMBER,  hint: 'Current operational maturity before WAANDA activates.' },
          { label: '90-Day Target OIS',  value: oisDay90, set: setOisDay90, min: 40, max: 100, color: GREEN, hint: 'Target score after 90 days. Sets the COIG north-star.' },
        ].map(row => (
          <div key={row.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: SLATE }}>{row.label}</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: row.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{row.value}</span>
            </div>
            <input type="range" min={row.min} max={row.max} value={row.value}
              onChange={e => row.set(Number(e.target.value))}
              style={{ width: '100%', accentColor: row.color, cursor: 'pointer' }}
            />
            <div style={{ fontSize: 10, color: SLATE, marginTop: 8 }}>{row.hint}</div>
          </div>
        ))}

        <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: SLATE, marginBottom: 12 }}>COIG™ Target</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input type="range" min={5} max={25} value={coigTarget}
              onChange={e => setCoigTarget(Number(e.target.value))}
              style={{ flex: 1, accentColor: PURPLE, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 26, fontWeight: 900, color: PURPLE, minWidth: 40, fontVariantNumeric: 'tabular-nums' }}>+{coigTarget}</span>
          </div>
          <div style={{ fontSize: 10, color: SLATE, marginTop: 6 }}>Points of OIS gain in 90 days. Customer Zero achieved +9.7.</div>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 10, background: BLUE + '06', border: `1px solid ${BLUE}15`, fontSize: 11, color: T2 }}>
          COIG of{' '}<strong style={{ color: PURPLE }}>+{coigTarget}</strong>{' '}
          puts {customerName} from{' '}<strong style={{ color: AMBER }}>{oisDay0}</strong>{' '}
          to{' '}<strong style={{ color: GREEN }}>{Math.min(100, oisDay0 + coigTarget)}</strong>{' '}
          — target is {oisDay90} ({oisDay0 + coigTarget >= oisDay90 ? '✓ achievable' : '⚠ stretch'})
        </div>
      </div>
      <NavRow onBack={() => setStep('modules')} onNext={() => setStep('goals')} />
    </div>
  )

  // ── Step: Goals ───────────────────────────────────────────────────────────
  if (step === 'goals') return (
    <div style={{ maxWidth: 640 }}>
      <StepBar current="goals" />
      <PageHeader
        title="Seed Strategic Goals"
        sub={`WAANDA pre-suggests goals for ${industry?.label ?? 'your industry'}. Remove any that don't apply or add your own.`}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {goals.map((g, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
            background: CARD, border: `1px solid ${BDR}`, borderRadius: 10,
          }}>
            <Zap style={{ width: 13, height: 13, color: BLUE, flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 12, color: T1, flex: 1, lineHeight: 1.5 }}>{g}</span>
            <button onClick={() => setGoals(gs => gs.filter((_, j) => j !== i))} style={{
              border: 'none', background: 'none', cursor: 'pointer', color: SLATE, padding: 2, flexShrink: 0,
            }}>
              <X style={{ width: 13, height: 13 }} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && newGoal.trim()) {
              setGoals(gs => [...gs, newGoal.trim()])
              setNewGoal('')
            }
          }}
          placeholder="Add a custom goal…"
          style={{ flex: 1, background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, padding: '9px 12px', fontSize: 12, color: T1, outline: 'none' }}
        />
        <button onClick={() => { if (newGoal.trim()) { setGoals(gs => [...gs, newGoal.trim()]); setNewGoal('') } }}
          disabled={!newGoal.trim()}
          style={{ padding: '9px 16px', background: BLUE + '10', color: BLUE, border: `1px solid ${BLUE}30`, borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
          <Plus style={{ width: 13, height: 13 }} />
        </button>
      </div>
      <NavRow onBack={() => setStep('ois')} onNext={() => { setWaandaState('idle'); setStep('waanda') }} disabled={goals.length === 0} />
    </div>
  )

  // ── Step: WAANDA Analysis ─────────────────────────────────────────────────
  if (step === 'waanda') return (
    <div style={{ maxWidth: 640 }}>
      <StepBar current="waanda" />
      <PageHeader
        title="WAANDA Intelligence Analysis"
        sub="WAANDA is profiling your configuration and suggesting entity types for the Knowledge Graph."
      />

      {waandaState !== 'done' ? (
        <div style={{ background: CARD, border: `1px solid ${PURPLE}25`, borderRadius: 16, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: PURPLE + '12', border: `2px solid ${PURPLE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Loader2 style={{ width: 24, height: 24, color: PURPLE, animation: 'spin 1s linear infinite' }} />
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T1, marginBottom: 4 }}>WAANDA is analysing your profile…</p>
          <p style={{ fontSize: 11, color: SLATE }}>Mapping {industry?.label} ontology · {goals.length} goals · {modules.length} modules</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 14px', background: PURPLE + '08', borderRadius: 8, border: `1px solid ${PURPLE}20` }}>
            <Sparkles style={{ width: 13, height: 13, color: PURPLE }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE }}>WAANDA suggests these entity types for your Knowledge Graph</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, color: SLATE }}>based on {industry?.label} · {modules.length} modules</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {DEFAULT_ENTITY_TYPES.map(e => {
              const on = entityTypes.includes(e)
              return (
                <button key={e} onClick={() => setEntityTypes(es => on ? es.filter(x => x !== e) : [...es, e])} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${on ? PURPLE : BDR}`,
                  background: on ? PURPLE + '12' : CARD,
                  color: on ? PURPLE : T2, cursor: 'pointer', transition: 'all .12s',
                }}>
                  {on ? <CheckCircle2 style={{ width: 11, height: 11, display: 'inline', marginRight: 4 }} /> : null}
                  {e}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={newEntity} onChange={e => setNewEntity(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newEntity.trim() && !entityTypes.includes(newEntity.trim())) {
                  setEntityTypes(es => [...es, newEntity.trim()]); setNewEntity('')
                }
              }}
              placeholder="Add custom entity type…"
              style={{ flex: 1, background: CARD, border: `1px solid ${BDR}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: T1, outline: 'none' }}
            />
            <button onClick={() => {
              if (newEntity.trim() && !entityTypes.includes(newEntity.trim())) {
                setEntityTypes(es => [...es, newEntity.trim()]); setNewEntity('')
              }
            }} style={{ padding: '8px 14px', background: PURPLE + '10', color: PURPLE, border: `1px solid ${PURPLE}30`, borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
              <Plus style={{ width: 13, height: 13 }} />
            </button>
          </div>

          <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: SLATE, marginBottom: 10 }}>Blueprint Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Customer',       value: customerName },
                { label: 'Industry',       value: industry?.label ?? '—' },
                { label: 'Org Size',       value: orgSize },
                { label: 'Modules',        value: `${modules.length} active` },
                { label: 'Goals',          value: `${goals.length} seeded` },
                { label: 'Entity Types',   value: `${entityTypes.length} tracked` },
                { label: 'Day 0 OIS',      value: String(oisDay0) },
                { label: '90d OIS Target', value: String(oisDay90) },
                { label: 'COIG Target',    value: `+${coigTarget}` },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ fontSize: 9, color: SLATE, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T1 }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {generateMut.isError && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#ef444410', border: '1px solid #ef444430', color: '#ef4444', fontSize: 11, fontWeight: 600 }}>
          {(generateMut.error as Error).message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        <button
          onClick={() => generateMut.mutate()}
          disabled={waandaState !== 'done' || generateMut.isPending}
          style={{
            background: waandaState !== 'done' || generateMut.isPending ? SLATE : PURPLE,
            color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px',
            fontSize: 12, fontWeight: 700, cursor: waandaState !== 'done' || generateMut.isPending ? 'not-allowed' : 'pointer',
            opacity: waandaState !== 'done' ? 0.5 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {generateMut.isPending
            ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Generating…</>
            : <><Globe2 style={{ width: 13, height: 13 }} /> Generate Blueprint</>}
        </button>
        <button onClick={() => setStep('goals')} style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 8, padding: '10px 16px', fontSize: 12, cursor: 'pointer', color: T2 }}>Back</button>
      </div>
    </div>
  )

  // ── Step: Done ────────────────────────────────────────────────────────────
  if (step === 'done') return (
    <div style={{ maxWidth: 540 }}>
      <StepBar current="done" />

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: GREEN + '14', border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle2 style={{ width: 28, height: 28, color: GREEN }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, marginBottom: 6, letterSpacing: '-.02em' }}>Blueprint Generated</div>
        <p style={{ fontSize: 12, color: SLATE, lineHeight: 1.7, marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
          <strong>{customerName}</strong> Blueprint is ready — {entityTypes.length} entity types · {goals.length} goals · {modules.length} modules · Day 0 OIS {oisDay0} → target {oisDay90}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 400, margin: '0 auto 24px', textAlign: 'left' }}>
          {[
            { label: 'Industry',      value: industry?.label ?? '—',    color: BLUE   },
            { label: 'COIG Target',   value: `+${coigTarget} pts`,       color: PURPLE },
            { label: 'Modules',       value: `${modules.length} active`, color: GREEN  },
            { label: 'Entity Types',  value: `${entityTypes.length}`,    color: TEAL   },
          ].map(s => (
            <div key={s.label} style={{ background: s.color + '08', border: `1px solid ${s.color}20`, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: SLATE, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={`/kangqore-view/admin/kangqore-immp/blueprint?id=${generatedId}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: SLATE, background: SURF, padding: '10px 18px', borderRadius: 8, textDecoration: 'none', border: `1px solid ${BDR}` }}>
            <Download style={{ width: 13, height: 13 }} /> View Blueprint
          </a>
          <button
            onClick={() => generatedId && activateMut.mutate(generatedId)}
            disabled={activateMut.isPending || !generatedId}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
              color: '#fff', background: GREEN, padding: '10px 22px', borderRadius: 8, border: 'none',
              cursor: 'pointer', opacity: activateMut.isPending ? 0.7 : 1,
            }}
          >
            {activateMut.isPending
              ? <><Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> Activating…</>
              : <><Globe2 style={{ width: 13, height: 13 }} /> Activate {customerName}</>}
          </button>
        </div>

        {activateMut.isError && (
          <p style={{ marginTop: 12, fontSize: 11, color: '#ef4444' }}>
            {(activateMut.error as Error).message}
          </p>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return null
}
