import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@lib/api'
import {
  Building2, Target, RefreshCw, Plus, Trash2, Save,
  CheckCircle2, AlertTriangle, Brain, Zap, TrendingUp,
} from 'lucide-react'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'
const GREEN   = '#22c55e'
const AMBER   = '#f59e0b'
const BLUE    = '#3b82f6'
const INDIGO  = '#6366f1'
const RED     = '#ef4444'
const TEAL    = '#14b8a6'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface EnterpriseGoal {
  id:     string
  pillar: string
  label:  string
  target: number
  unit:   string
  weight: number
}

interface EnterpriseDefinition {
  id:          string
  name:        string
  isActive:    boolean
  activatedAt: string
  goals:       EnterpriseGoal[]
}

interface EnterpriseDNA {
  approvalSpeed:       string
  riskTolerance:       string
  decisionStyle:       string
  escalationThreshold: string
  meetingDensity:      string
  growthPhase:         string
  dominantPillar:      string
  weakestPillar:       string
  computedAt:          string
}

const PILLAR_OPTIONS = [
  { value: 'REVENUE',      label: 'Revenue' },
  { value: 'MARGIN',       label: 'Project Margin' },
  { value: 'NPS',          label: 'Client NPS' },
  { value: 'DELIVERY_SLA', label: 'Delivery SLA' },
  { value: 'UTILIZATION',  label: 'Employee Utilization' },
  { value: 'GROWTH',       label: 'Revenue Growth' },
  { value: 'RETENTION',    label: 'Client Retention' },
  { value: 'CUSTOM',       label: 'Custom' },
]

const DNA_COLORS: Record<string, string> = {
  FAST: GREEN, MODERATE: AMBER, DELIBERATE: RED,
  AGGRESSIVE: RED, BALANCED: AMBER, CONSERVATIVE: GREEN,
  DATA_DRIVEN: BLUE, CONSENSUS: INDIGO, EXECUTIVE: AMBER,
  QUICK: RED, NORMAL: AMBER, PATIENT: GREEN,
  HIGH: RED, ASYNC_FIRST: GREEN,
  BUILDING: INDIGO, SCALING: AMBER, OPTIMIZING: GREEN,
}

function dnaLabel(val: string): string {
  const map: Record<string, string> = {
    FAST: 'Fast', MODERATE: 'Moderate', DELIBERATE: 'Deliberate',
    AGGRESSIVE: 'Aggressive', BALANCED: 'Balanced', CONSERVATIVE: 'Conservative',
    DATA_DRIVEN: 'Data-Driven', CONSENSUS: 'Consensus', EXECUTIVE: 'Executive-led',
    QUICK: 'Quick escalation', NORMAL: 'Normal threshold', PATIENT: 'Patient',
    HIGH: 'High density', ASYNC_FIRST: 'Async-first',
    BUILDING: 'Building', SCALING: 'Scaling', OPTIMIZING: 'Optimizing',
  }
  return map[val] ?? val
}

// ─── Goal row editor ───────────────────────────────────────────────────────────
function GoalRow({
  goal, onChange, onRemove,
}: {
  goal: Omit<EnterpriseGoal, 'id'>
  onChange: (g: Omit<EnterpriseGoal, 'id'>) => void
  onRemove: () => void
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr 100px 80px 70px 32px',
      gap: 8, alignItems: 'center',
      padding: '8px 0', borderBottom: `1px solid ${BORDER}`,
    }}>
      <select
        value={goal.pillar}
        onChange={e => onChange({ ...goal, pillar: e.target.value })}
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '5px 8px', fontSize: 11, color: TEXT1,
        }}
      >
        {PILLAR_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <input
        value={goal.label}
        onChange={e => onChange({ ...goal, label: e.target.value })}
        placeholder="Display label"
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '5px 8px', fontSize: 11, color: TEXT1, width: '100%',
        }}
      />

      <input
        type="number"
        value={goal.target}
        onChange={e => onChange({ ...goal, target: parseFloat(e.target.value) || 0 })}
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '5px 8px', fontSize: 11, color: TEXT1, width: '100%',
        }}
      />

      <input
        value={goal.unit}
        onChange={e => onChange({ ...goal, unit: e.target.value })}
        placeholder="₹ Cr / % / score"
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '5px 8px', fontSize: 11, color: TEXT1, width: '100%',
        }}
      />

      <input
        type="number"
        step="0.1"
        min="0.1"
        max="3"
        value={goal.weight}
        onChange={e => onChange({ ...goal, weight: parseFloat(e.target.value) || 1 })}
        style={{
          background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
          padding: '5px 8px', fontSize: 11, color: TEXT1, width: '100%',
        }}
      />

      <button
        onClick={onRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: RED, padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center',
        }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Enterprise DNA card ────────────────────────────────────────────────────────
function DNACard({ dna, onRecompute, isComputing }: {
  dna: EnterpriseDNA | null
  onRecompute: () => void
  isComputing: boolean
}) {
  const rows = dna ? [
    { label: 'Approval Speed',       value: dna.approvalSpeed },
    { label: 'Risk Tolerance',       value: dna.riskTolerance },
    { label: 'Decision Style',       value: dna.decisionStyle },
    { label: 'Escalation Threshold', value: dna.escalationThreshold },
    { label: 'Meeting Culture',      value: dna.meetingDensity },
    { label: 'Growth Phase',         value: dna.growthPhase },
    { label: 'Strongest Pillar',     value: dna.dominantPillar },
    { label: 'Needs Most Work',      value: dna.weakestPillar },
  ] : []

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Brain className="w-4 h-4" style={{ color: INDIGO }} />
        <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>Enterprise DNA™</span>
        {dna && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
            Computed {new Date(dna.computedAt).toLocaleDateString()}
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: TEXT2, marginBottom: 14 }}>
        WAANDA infers how this enterprise actually behaves — not how enterprise software generically expects it to.
        Recompute whenever you want DNA to reflect the latest operational patterns.
      </div>

      {!dna ? (
        <div style={{
          background: `${AMBER}11`, border: `1px dashed ${AMBER}55`,
          borderRadius: 8, padding: 16, textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: TEXT1, fontWeight: 600, marginBottom: 6 }}>No DNA computed yet</div>
          <div style={{ fontSize: 11, color: TEXT2, marginBottom: 12 }}>
            DNA is inferred from approval patterns, override rates, workflow activity, and OIS data.
          </div>
          <button
            onClick={onRecompute}
            disabled={isComputing}
            style={{
              padding: '8px 20px', background: INDIGO, color: '#fff', border: 'none',
              borderRadius: 8, cursor: isComputing ? 'not-allowed' : 'pointer',
              fontSize: 12, fontWeight: 600, opacity: isComputing ? 0.7 : 1,
            }}
          >
            {isComputing ? 'Computing…' : 'Compute DNA Now'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {rows.map(r => (
              <div key={r.label} style={{
                background: SURFACE, borderRadius: 8, padding: '8px 12px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, color: TEXT2 }}>{r.label}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: DNA_COLORS[r.value] ?? TEXT1,
                }}>
                  {dnaLabel(r.value)}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={onRecompute}
            disabled={isComputing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', background: SURFACE, color: TEXT2,
              border: `1px solid ${BORDER}`, borderRadius: 8,
              cursor: isComputing ? 'not-allowed' : 'pointer',
              fontSize: 11, opacity: isComputing ? 0.7 : 1,
            }}
          >
            <RefreshCw className={`w-3 h-3 ${isComputing ? 'animate-spin' : ''}`} />
            {isComputing ? 'Recomputing…' : 'Recompute DNA'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────────
export function EnterpriseDefinitionPage() {
  const queryClient = useQueryClient()
  const [editName, setEditName]   = useState('')
  const [editGoals, setEditGoals] = useState<Omit<EnterpriseGoal, 'id'>[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved]         = useState(false)

  const { data: def } = useQuery<EnterpriseDefinition | null>({
    queryKey: ['enterprise-definition'],
    queryFn:  () => adminApi('/admin/enterprise/definition'),
  })

  const { data: dna } = useQuery<EnterpriseDNA | null>({
    queryKey: ['enterprise-dna'],
    queryFn:  () => adminApi('/admin/enterprise/dna'),
  })

  const saveMut = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/definition', {
      method: 'POST',
      body:   JSON.stringify({ name: editName, goals: editGoals }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterprise-definition'] })
      queryClient.invalidateQueries({ queryKey: ['enterprise-pulse']     })
      queryClient.invalidateQueries({ queryKey: ['enterprise-coig']      })
      setIsEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const dnaMut = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/dna/compute', { method: 'POST', body: '{}' }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['enterprise-dna'] }),
  })

  function startEditing() {
    setEditName(def?.name ?? 'Kangqore Global FY2027')
    setEditGoals(def?.goals?.map(g => ({
      pillar: g.pillar, label: g.label,
      target: g.target, unit: g.unit, weight: g.weight,
    })) ?? [])
    setIsEditing(true)
  }

  function addGoal() {
    setEditGoals(gs => [...gs, { pillar: 'REVENUE', label: 'Revenue', target: 10, unit: '₹ Cr', weight: 1.0 }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Building2 className="w-5 h-5" style={{ color: TEAL }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT1 }}>Enterprise Definition</div>
          <div style={{ fontSize: 11, color: TEXT2 }}>
            Declare what success means. WAANDA reads this before every analysis, recommendation, and coaching insight.
          </div>
        </div>
        {saved && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: GREEN, fontSize: 12 }}>
            <CheckCircle2 className="w-4 h-4" />
            Saved
          </div>
        )}
      </div>

      {/* ── Active definition (read view) ── */}
      {!isEditing && def && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Target className="w-4 h-4" style={{ color: GREEN }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>{def.name}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, background: `${GREEN}22`, color: GREEN,
              padding: '2px 8px', borderRadius: 10, marginLeft: 4,
            }}>ACTIVE</span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
              Since {new Date(def.activatedAt).toLocaleDateString()}
            </span>
            <button
              onClick={startEditing}
              style={{
                padding: '5px 12px', background: SURFACE, color: TEXT2,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                cursor: 'pointer', fontSize: 11,
              }}
            >
              Edit
            </button>
          </div>

          {/* Goals table */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 100px 80px 70px',
              gap: 8, padding: '6px 0',
              borderBottom: `1px solid ${BORDER}`,
              fontSize: 10, fontWeight: 600, color: TEXT2, letterSpacing: 0.5,
            }}>
              <span>PILLAR</span>
              <span>GOAL</span>
              <span>TARGET</span>
              <span>UNIT</span>
              <span>WEIGHT</span>
            </div>
            {def.goals.map(g => (
              <div key={g.id} style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 100px 80px 70px',
                gap: 8, padding: '10px 0',
                borderBottom: `1px solid ${BORDER}`,
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, background: `${BLUE}18`, color: BLUE,
                  padding: '2px 8px', borderRadius: 6, display: 'inline-block',
                }}>{g.pillar}</span>
                <span style={{ fontSize: 12, color: TEXT1, fontWeight: 600 }}>{g.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: TEXT1 }}>{g.target}</span>
                <span style={{ fontSize: 11, color: TEXT2 }}>{g.unit}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Array.from({ length: Math.round(g.weight * 2) }).map((_, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: INDIGO }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: TEXT2, display: 'flex', gap: 4, alignItems: 'center' }}>
            <Zap className="w-3 h-3" style={{ color: AMBER }} />
            WAANDA evaluates every recommendation against these goals.
            Enterprise Coach compares improvements across departments in this context.
          </div>
        </div>
      )}

      {/* ── No definition state ── */}
      {!isEditing && !def && (
        <div style={{
          background: `${AMBER}11`, border: `1px dashed ${AMBER}55`,
          borderRadius: 12, padding: 24, textAlign: 'center',
        }}>
          <AlertTriangle className="w-6 h-6 mx-auto mb-3" style={{ color: AMBER }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1, marginBottom: 6 }}>
            No Enterprise Definition set
          </div>
          <div style={{ fontSize: 11, color: TEXT2, marginBottom: 16 }}>
            Without a definition, WAANDA cannot ground its recommendations in your business objectives.
            COIG measurement requires a baseline that reflects what you're trying to achieve.
          </div>
          <button
            onClick={startEditing}
            style={{
              padding: '8px 20px', background: TEAL, color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
            }}
          >
            Define Enterprise Goals
          </button>
        </div>
      )}

      {/* ── Edit form ── */}
      {isEditing && (
        <div style={{ background: CARD, border: `1px solid ${TEAL}44`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target className="w-4 h-4" style={{ color: TEAL }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>
              {def ? 'Edit Enterprise Definition' : 'New Enterprise Definition'}
            </span>
            <span style={{ fontSize: 10, color: TEXT2, marginLeft: 4 }}>
              Saving creates a new active definition — the previous one is archived.
            </span>
          </div>

          {/* Definition name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: TEXT2, display: 'block', marginBottom: 6 }}>
              DEFINITION NAME
            </label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="e.g. Kangqore Global FY2027"
              style={{
                width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                borderRadius: 8, padding: '8px 12px', fontSize: 12, color: TEXT1,
              }}
            />
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 100px 80px 70px 32px',
            gap: 8, padding: '4px 0 8px',
            fontSize: 10, fontWeight: 600, color: TEXT2, letterSpacing: 0.5,
          }}>
            <span>PILLAR</span>
            <span>DISPLAY LABEL</span>
            <span>TARGET</span>
            <span>UNIT</span>
            <span>WEIGHT</span>
            <span />
          </div>

          {/* Goal rows */}
          {editGoals.map((g, i) => (
            <GoalRow
              key={i}
              goal={g}
              onChange={ng => setEditGoals(gs => gs.map((x, j) => j === i ? ng : x))}
              onRemove={() => setEditGoals(gs => gs.filter((_, j) => j !== i))}
            />
          ))}

          {/* Add + actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
            <button
              onClick={addGoal}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', background: SURFACE, color: TEXT2,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                cursor: 'pointer', fontSize: 11,
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Goal
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '7px 16px', background: SURFACE, color: TEXT2,
                  border: `1px solid ${BORDER}`, borderRadius: 8,
                  cursor: 'pointer', fontSize: 12,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => saveMut.mutate()}
                disabled={saveMut.isPending || !editName.trim() || editGoals.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', background: TEAL, color: '#fff',
                  border: 'none', borderRadius: 8,
                  cursor: saveMut.isPending ? 'not-allowed' : 'pointer',
                  fontSize: 12, fontWeight: 600,
                  opacity: saveMut.isPending || editGoals.length === 0 ? 0.7 : 1,
                }}
              >
                <Save className="w-3.5 h-3.5" />
                {saveMut.isPending ? 'Saving…' : 'Save Definition'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Enterprise DNA ── */}
      <DNACard
        dna={dna ?? null}
        onRecompute={() => dnaMut.mutate()}
        isComputing={dnaMut.isPending}
      />

      {/* ── How WAANDA uses this ── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <TrendingUp className="w-4 h-4" style={{ color: GREEN }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>How WAANDA uses Enterprise Definition</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            {
              icon: Target, color: BLUE,
              title: 'Goal Alignment',
              body: 'Every KIMMP recommendation is evaluated against these goals. Recommendations that directly advance a goal are prioritised higher.',
            },
            {
              icon: TrendingUp, color: GREEN,
              title: 'COIG Attribution',
              body: 'COIG improvement is attributed to enterprise goals. The Customer Zero Report shows progress against each target, not just OIS delta.',
            },
            {
              icon: Brain, color: INDIGO,
              title: 'Enterprise Coach',
              body: 'The Coach frames insights in terms of your goals: "This improvement in Delivery directly advances your 98% SLA target."',
            },
          ].map(item => (
            <div key={item.title} style={{
              background: SURFACE, borderRadius: 10, padding: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{item.title}</span>
              </div>
              <div style={{ fontSize: 11, color: TEXT2, lineHeight: 1.6 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
