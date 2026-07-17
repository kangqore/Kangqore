import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Brain, Workflow, Cpu, Globe2, Target, BookOpen,
  TrendingUp, Shield, ChevronUp, ChevronDown, Minus,
  Clock, CheckCircle2, AlertTriangle, Camera, RefreshCw,
  Zap, DollarSign, BarChart3, Activity,
  Sparkles, Lightbulb, FlaskConical, ArrowRight, Info,
  Users, Layers, Award, Lock,
} from 'lucide-react'
import { adminApi } from '@lib/api'

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'

const GREEN  = '#22c55e'
const AMBER  = '#f59e0b'
const RED    = '#ef4444'
const BLUE   = '#3b82f6'
const PURPLE = '#a855f7'
const INDIGO = '#6366f1'
const CYAN   = '#06b6d4'
const ROSE   = '#f43f5e'
const TEAL   = '#14b8a6'
const GOLD   = '#eab308'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface PillarData {
  score: number
  metrics: Record<string, unknown>
  velocityModifier?: number
}

interface Gate8Result {
  oisScore:        number
  decisionScore:   number
  workflowScore:   number
  aiScore:         number
  enterpriseScore: number
  goalScore:       number
  learningScore:   number
  businessScore:   number
  trustScore:      number
  adoptionScore:   number
  pillars: {
    decision:   PillarData
    workflow:   PillarData
    ai:         PillarData
    enterprise: PillarData
    goal:       PillarData
    learning:   PillarData
    business:   PillarData
    trust:      PillarData
    adoption:   PillarData
  }
}

interface SnapshotRecord {
  id:              string
  oisScore:        number
  decisionScore:   number
  workflowScore:   number
  aiScore:         number
  enterpriseScore: number
  goalScore:       number
  learningScore:   number
  businessScore:   number
  trustScore:      number
  adoptionScore:   number
  label:           string
  triggeredBy:     string
  createdAt:       string
}

interface COIGReport {
  current:           number
  expected:          number
  potential:         number
  baselineOis:       number
  currentOis:        number
  baselineId:        string | null
  baselineDate:      string | null
  daysSinceBaseline: number
}

interface EMIBlocker {
  dimension:  string
  label:      string
  current:    number
  required:   number
  gap:        number
  howToClose: string
}

interface EMIResult {
  level:           string
  levelLabel:      string
  description:     string
  isProvisional:   boolean
  emiScore:        number
  confidence:      number
  dimensions: {
    intelligence: number
    autonomy:     number
    adoption:     number
    governance:   number
  }
  blockers:        EMIBlocker[]
  nextLevel:       string | null
  nextLevelLabel:  string | null
  timeToNextLevel: { days: number; bottleneckDimension: string; acceleratorDays: number } | null
  computedAt:      string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(s: number): string {
  return s >= 85 ? GREEN : s >= 70 ? AMBER : RED
}

function scoreLabel(s: number): string {
  return s >= 90 ? 'EXCELLENT' : s >= 80 ? 'GOOD' : s >= 70 ? 'FAIR' : 'NEEDS ATTENTION'
}

function fmt(n: unknown, suffix = ''): string {
  if (n == null) return '—'
  return `${n}${suffix}`
}

function fmtMs(ms: unknown): string {
  if (ms == null) return '—'
  const v = Number(ms)
  return v < 1000 ? `${v}ms` : `${(v / 1000).toFixed(1)}s`
}

function trend(current: number, prev: number | null): 'up' | 'down' | 'flat' {
  if (prev == null) return 'flat'
  const diff = current - prev
  return diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'flat'
}

function TrendIcon({ dir }: { dir: 'up' | 'down' | 'flat' }) {
  if (dir === 'up')   return <ChevronUp   className="w-3 h-3" style={{ color: GREEN }} />
  if (dir === 'down') return <ChevronDown className="w-3 h-3" style={{ color: RED   }} />
  return <Minus className="w-3 h-3" style={{ color: TEXT2 }} />
}

// ─── OIS Arc Gauge ─────────────────────────────────────────────────────────────
function OisGauge({ score }: { score: number }) {
  const r = 72
  const cx = 90
  const cy = 90
  const circ = Math.PI * r        // half-circle arc
  const dashOffset = circ * (1 - score / 100)
  const color = scoreColor(score)

  return (
    <svg width={180} height={110} style={{ overflow: 'visible' }}>
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={BORDER}
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
      />
      {/* Score label */}
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize={38} fontWeight={700} fill={color}>
        {Math.round(score)}
      </text>
      <text x={cx} y={cy + 6}  textAnchor="middle" fontSize={11} fill={TEXT2}>
        / 100
      </text>
    </svg>
  )
}

// ─── Pillar Card ───────────────────────────────────────────────────────────────
interface PillarCardProps {
  title:    string
  weight:   string
  score:    number
  icon:     React.ElementType
  color:    string
  metrics:  { label: string; value: string }[]
  trendDir: 'up' | 'down' | 'flat'
}

function PillarCard({ title, weight, score, icon: Icon, color, metrics, trendDir }: PillarCardProps) {
  const [expanded, setExpanded] = useState(false)
  const sc = scoreColor(score)

  return (
    <div
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
        padding: '16px', display: 'flex', flexDirection: 'column', gap: 12,
        cursor: 'pointer', transition: 'border-color 0.15s',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: `${color}22`, borderRadius: 8, padding: 7, flexShrink: 0 }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1, letterSpacing: 0.2 }}>{title}</div>
          <div style={{ fontSize: 10, color: TEXT2 }}>{weight} of OIS</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: sc, lineHeight: 1 }}>
            {Math.round(score)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <TrendIcon dir={trendDir} />
            <span style={{ fontSize: 9, color: TEXT2 }}>{scoreLabel(score)}</span>
          </div>
        </div>
      </div>

      {/* Mini score bar */}
      <div style={{ background: SURFACE, borderRadius: 4, height: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, background: sc, height: '100%', borderRadius: 4, transition: 'width 1s ease' }} />
      </div>

      {/* Expanded metrics */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          {metrics.map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: TEXT2 }}>{m.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: TEXT1, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Business Value Panel ──────────────────────────────────────────────────────
function BusinessValuePanel({ pillars }: { pillars: Gate8Result['pillars'] }) {
  const bm = pillars.business.metrics
  const dm = pillars.decision.metrics
  const wm = pillars.workflow.metrics

  const hoursSaved    = Number(bm.estimatedHoursSaved ?? 0)
  const inrCr         = Number(bm.estimatedInrSavedCr ?? 0)
  const automatedApps = Number(bm.automatedApprovals  ?? 0)
  const workflows     = Number(bm.totalWorkflowsCompleted ?? 0)
  const decisions     = Number(dm.total ?? 0)
  const incidentsFree = Number((wm as any).allCompleted ?? 0)

  const items = [
    { icon: Clock,      color: GREEN,  label: 'Employee hours saved',       value: hoursSaved > 0 ? `${hoursSaved.toLocaleString()} hrs` : 'Accumulating' },
    { icon: DollarSign, color: AMBER,  label: 'Operational savings (est.)', value: inrCr > 0 ? `₹${inrCr.toFixed(1)} Cr` : 'Accumulating' },
    { icon: Zap,        color: BLUE,   label: 'Workflows automated',        value: workflows > 0 ? workflows.toLocaleString() : '0' },
    { icon: CheckCircle2,color: PURPLE,label: 'Manual approvals eliminated',value: automatedApps > 0 ? automatedApps.toLocaleString() : '0' },
    { icon: Brain,      color: INDIGO, label: 'Strategic decisions made',   value: decisions > 0 ? decisions.toLocaleString() : '0' },
    { icon: Activity,   color: CYAN,   label: 'Operations executed cleanly',value: incidentsFree > 0 ? incidentsFree.toLocaleString() : '—' },
  ]

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <BarChart3 className="w-4 h-4" style={{ color: AMBER }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>WAANDA Has Delivered</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2, background: `${AMBER}22`, padding: '2px 8px', borderRadius: 20 }}>
          Business Value
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {items.map(item => (
          <div key={item.label} style={{
            background: SURFACE, borderRadius: 8, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <item.icon className="w-4 h-4" style={{ color: item.color }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT1 }}>{item.value}</div>
            <div style={{ fontSize: 10, color: TEXT2, lineHeight: 1.3 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Enterprise Risk Grid ──────────────────────────────────────────────────────
function EnterpriseRiskGrid({ metrics }: { metrics: Record<string, unknown> }) {
  const p1 = Number(metrics.p1Active ?? 0)
  const p2 = Number(metrics.p2Active ?? 0)
  const p3 = Number(metrics.p3Active ?? 0)
  const cr  = Number(metrics.criticalRisks ?? 0)
  const hr  = Number(metrics.highRisks     ?? 0)
  const sla = Number(metrics.slaBreached   ?? 0)

  const risks = [
    {
      label: 'Operational Risk',
      color: p1 > 0 ? RED : p2 > 0 ? AMBER : GREEN,
      value: p1 > 0 ? `${p1} P1 Active` : p2 > 0 ? `${p2} P2 Active` : 'Clear',
      sub:   p3 > 0 ? `${p3} medium` : '',
    },
    {
      label: 'Compliance Risk',
      color: sla > 0 ? RED : GREEN,
      value: sla > 0 ? `${sla} SLA Breached` : 'Compliant',
      sub:   '',
    },
    {
      label: 'Platform Risk',
      color: cr > 0 ? RED : hr > 0 ? AMBER : GREEN,
      value: cr > 0 ? `${cr} Critical` : hr > 0 ? `${hr} High` : 'Low',
      sub:   cr > 0 || hr > 0 ? `${cr + hr} open risks` : 'All stable',
    },
    {
      label: 'Revenue Risk',
      color: p1 > 0 || cr > 0 ? AMBER : GREEN,
      value: p1 + cr > 0 ? 'Elevated' : 'Low',
      sub:   'Based on active incidents + risks',
    },
    {
      label: 'Customer Risk',
      color: p1 > 0 ? RED : p2 > 0 ? AMBER : GREEN,
      value: p1 > 0 ? 'High' : p2 > 0 ? 'Moderate' : 'Low',
      sub:   'Derived from incident impact',
    },
    {
      label: 'Cyber Risk',
      color: GREEN,
      value: 'Monitored',
      sub:   'AEGIS active',
    },
  ]

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Globe2 className="w-4 h-4" style={{ color: ROSE }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Enterprise Risk Map</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2, background: `${ROSE}22`, padding: '2px 8px', borderRadius: 20 }}>
          Live
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {risks.map(r => (
          <div key={r.label} style={{
            background: `${r.color}11`, border: `1px solid ${r.color}44`,
            borderRadius: 8, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: TEXT2, fontWeight: 600, letterSpacing: 0.3 }}>{r.label.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</div>
            {r.sub && <div style={{ fontSize: 10, color: TEXT2, marginTop: 2 }}>{r.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Goal Intelligence Panel ───────────────────────────────────────────────────
function GoalIntelligencePanel({ metrics }: { metrics: Record<string, unknown> }) {
  const total     = Number(metrics.total      ?? 0)
  const active    = Number(metrics.active     ?? 0)
  const completed = Number(metrics.completed  ?? 0)
  const atRisk    = Number(metrics.atRisk     ?? 0)
  const avgProg   = Number(metrics.avgProgressPct ?? 0)
  const compRate  = Number(metrics.completionRatePct ?? 0)

  const likelihood = avgProg >= 80 ? 92 : avgProg >= 60 ? 78 : avgProg >= 40 ? 61 : 44

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Target className="w-4 h-4" style={{ color: INDIGO }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Goal Intelligence</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
          {total} goals total
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {[
          { label: 'Average Progress',      value: `${avgProg}%`,    color: scoreColor(avgProg)    },
          { label: 'Goal Completion Rate',  value: `${compRate}%`,   color: scoreColor(compRate)   },
          { label: 'Probability of Success',value: `${likelihood}%`, color: scoreColor(likelihood) },
          { label: 'Goals at Risk',         value: atRisk.toString(),color: atRisk > 0 ? AMBER : GREEN },
        ].map(item => (
          <div key={item.label} style={{ background: SURFACE, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 10, color: TEXT2, marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TEXT2, marginBottom: 4 }}>
          <span>Active Goal Progress</span>
          <span style={{ color: scoreColor(avgProg), fontWeight: 600 }}>{avgProg}%</span>
        </div>
        <div style={{ background: SURFACE, borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${avgProg}%`, background: scoreColor(avgProg), height: '100%', borderRadius: 4, transition: 'width 1s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {[
          { label: 'Active',    count: active,    color: BLUE   },
          { label: 'Completed', count: completed, color: GREEN  },
          { label: 'At Risk',   count: atRisk,    color: AMBER  },
        ].map(item => (
          <div key={item.label} style={{
            flex: 1, textAlign: 'center', background: `${item.color}15`,
            border: `1px solid ${item.color}33`, borderRadius: 6, padding: '6px 4px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.count}</div>
            <div style={{ fontSize: 9, color: TEXT2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {atRisk > 0 && (
        <div style={{
          marginTop: 12, background: `${AMBER}15`, border: `1px solid ${AMBER}33`,
          borderRadius: 6, padding: '8px 10px', fontSize: 11, color: AMBER,
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          <AlertTriangle className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
          {atRisk} goal{atRisk > 1 ? 's' : ''} at risk — deadline approaching with &lt;60% progress
        </div>
      )}
    </div>
  )
}

// ─── Learning Velocity Panel ───────────────────────────────────────────────────
function LearningVelocityPanel({ metrics, velocityModifier }: { metrics: Record<string, unknown>; velocityModifier: number }) {
  const total    = Number(metrics.totalMemories  ?? 0)
  const recent   = Number(metrics.recentLast7Days ?? 0)
  const growth   = Number(metrics.growthRatePct  ?? 0)
  const patterns = Number(metrics.patterns  ?? 0)
  const lessons  = Number(metrics.lessons   ?? 0)
  const outcomes = Number(metrics.outcomes  ?? 0)

  const velocityColor = velocityModifier > 0.03 ? GREEN : velocityModifier < -0.03 ? RED : AMBER

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <BookOpen className="w-4 h-4" style={{ color: PURPLE }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Learning Velocity</span>
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
          background: `${velocityColor}20`, border: `1px solid ${velocityColor}44`,
          borderRadius: 20, padding: '2px 8px',
        }}>
          {velocityModifier > 0 ? <ChevronUp className="w-3 h-3" style={{ color: velocityColor }} />
           : velocityModifier < 0 ? <ChevronDown className="w-3 h-3" style={{ color: velocityColor }} />
           : <Minus className="w-3 h-3" style={{ color: velocityColor }} />}
          <span style={{ fontSize: 10, color: velocityColor, fontWeight: 600 }}>
            {growth > 0 ? '+' : ''}{growth}% this week
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Total Memories', value: total,    color: PURPLE },
          { label: 'Added This Week', value: recent,   color: BLUE   },
          { label: 'Patterns Found', value: patterns, color: GREEN  },
          { label: 'Lessons Learned',value: lessons,  color: AMBER  },
        ].map(item => (
          <div key={item.label} style={{ background: SURFACE, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 9, color: TEXT2, marginTop: 2, lineHeight: 1.3 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: SURFACE, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: TEXT2 }}>OIS Velocity Modifier</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: velocityColor }}>
            {velocityModifier > 0 ? '+' : ''}{(velocityModifier * 100).toFixed(1)}%
          </span>
        </div>
        <div style={{ fontSize: 10, color: TEXT2, marginTop: 4 }}>
          Learning trajectory {velocityModifier > 0.03 ? 'accelerating — OIS boosted' : velocityModifier < -0.03 ? 'declining — OIS penalised' : 'stable — neutral OIS effect'}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'DECISION', count: outcomes },
            { label: 'PATTERN',  count: patterns },
            { label: 'LESSON',   count: lessons  },
          ].map(t => (
            <span key={t.label} style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 10,
              background: `${PURPLE}20`, color: PURPLE, fontWeight: 600,
            }}>
              {t.label} ({t.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── OIS Trend Chart ───────────────────────────────────────────────────────────
function OisTrendChart({ history }: { history: SnapshotRecord[] }) {
  if (history.length < 2) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TrendingUp className="w-4 h-4" style={{ color: BLUE }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>OIS Trend</span>
        </div>
        <div style={{ textAlign: 'center', padding: '24px 0', color: TEXT2, fontSize: 12 }}>
          Create a snapshot to begin tracking the OIS trend over time.
        </div>
      </div>
    )
  }

  const sorted  = [...history].reverse() // oldest → newest
  const max     = Math.max(...sorted.map(s => s.oisScore), 100)
  const min     = Math.max(0, Math.min(...sorted.map(s => s.oisScore)) - 10)
  const W = 440, H = 80, pad = 6

  const points = sorted.map((s, i) => {
    const x = pad + (i / (sorted.length - 1)) * (W - pad * 2)
    const y = H - pad - ((s.oisScore - min) / (max - min)) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')

  const latest = sorted[sorted.length - 1]
  const prior  = sorted.length > 1 ? sorted[sorted.length - 2] : null
  const diff   = prior ? latest.oisScore - prior.oisScore : 0
  const lineColor = diff >= 0 ? GREEN : RED

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <TrendingUp className="w-4 h-4" style={{ color: BLUE }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>OIS Trend</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: diff >= 0 ? GREEN : RED, fontWeight: 600 }}>
          {diff >= 0 ? '+' : ''}{(diff ?? 0).toFixed(1)} from last snapshot
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(v => {
          const y = H - pad - ((v - min) / (max - min)) * (H - pad * 2)
          return y >= 0 && y <= H ? (
            <line key={v} x1={pad} y1={y} x2={W - pad} y2={y} stroke={BORDER} strokeDasharray="3,3" strokeWidth={0.5} />
          ) : null
        })}
        {/* Line */}
        <polyline points={points} fill="none" stroke={lineColor} strokeWidth={2} strokeLinejoin="round" />
        {/* Dots */}
        {points.split(' ').map((pt, i) => {
          const [x, y] = pt.split(',').map(Number)
          return (
            <circle key={i} cx={x} cy={y} r={3} fill={lineColor} />
          )
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TEXT2, marginTop: 6 }}>
        <span>{new Date(sorted[0].createdAt).toLocaleDateString()}</span>
        <span>{history.length} snapshots</span>
        <span>{new Date(sorted[sorted.length - 1].createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

// ─── Trust Panel ───────────────────────────────────────────────────────────────
function TrustPanel({ metrics }: { metrics: Record<string, unknown> }) {
  const aegis    = Number(metrics.aegisEventsLast30Days ?? 0)
  const overrides= Number(metrics.emergencyOverrides    ?? 0)
  const evals    = Number(metrics.evaluations           ?? 0)
  const safeAvg  = metrics.avgSafeScore != null ? Number(metrics.avgSafeScore) : null
  const coverage = String(metrics.auditCoverage ?? 'LOW')

  const coverageColor = coverage === 'EXCELLENT' ? GREEN : coverage === 'GOOD' ? BLUE : coverage === 'FAIR' ? AMBER : RED

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Shield className="w-4 h-4" style={{ color: GREEN }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Trust Intelligence</span>
        <div style={{
          marginLeft: 'auto', background: `${coverageColor}20`, border: `1px solid ${coverageColor}44`,
          borderRadius: 20, padding: '2px 8px', fontSize: 10, color: coverageColor, fontWeight: 600,
        }}>
          {coverage}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          { label: 'Audit Events (30d)', value: aegis.toLocaleString(),   color: aegis > 100 ? GREEN : AMBER },
          { label: 'Emergency Overrides',value: overrides.toString(),      color: overrides > 0 ? AMBER : GREEN },
          { label: 'AI Evaluations',     value: evals.toLocaleString(),   color: evals > 0 ? GREEN : TEXT2 },
          { label: 'Safety Score',        value: safeAvg != null ? `${safeAvg}/5` : '—', color: safeAvg != null && safeAvg >= 4 ? GREEN : AMBER },
        ].map(item => (
          <div key={item.label} style={{ background: SURFACE, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 10, color: TEXT2, marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {overrides > 0 && (
        <div style={{
          marginTop: 10, background: `${AMBER}15`, border: `1px solid ${AMBER}33`,
          borderRadius: 6, padding: '8px 10px', fontSize: 11, color: AMBER,
          display: 'flex', gap: 6, alignItems: 'flex-start',
        }}>
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ flexShrink: 0, marginTop: 1 }} />
          {overrides} emergency override{overrides > 1 ? 's' : ''} in the last 30 days. Post-release reviews required.
        </div>
      )}
    </div>
  )
}

// ─── Gate 8.1 — Enterprise Forecast™ ──────────────────────────────────────────
interface ForecastDriver {
  pillar:        string
  slope:         number
  projectedGain?: number
  projectedLoss?: number
}

interface ForecastResult {
  currentOis:    number
  forecastOis:   number
  forecastDelta: number
  confidencePct: number
  horizon:       number
  snapshotsUsed: number
  drivers: {
    improving: ForecastDriver[]
    declining: ForecastDriver[]
  }
  pillarForecasts: Record<string, { current: number; forecast: number; delta: number }>
  method:        'REGRESSION' | 'HEURISTIC'
}

function ForecastPanel() {
  const { data, isFetching } = useQuery<ForecastResult>({
    queryKey: ['gate8-forecast'],
    queryFn:  () => adminApi('/admin/gate8/forecast?horizon=30'),
    refetchInterval: 120_000,
  })

  if (!data) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, fontSize: 12 }}>
          <Sparkles className="w-4 h-4 animate-pulse" />
          Computing 30-day forecast…
        </div>
      </div>
    )
  }

  const deltaColor = data.forecastDelta >= 0 ? GREEN : RED
  const confColor  = data.confidencePct >= 80 ? GREEN : data.confidencePct >= 65 ? AMBER : RED

  return (
    <div style={{ background: CARD, border: `1px solid ${INDIGO}44`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sparkles className="w-4 h-4" style={{ color: INDIGO }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Enterprise Forecast™</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
          Gate 8.1 · {data.method === 'REGRESSION' ? `${data.snapshotsUsed} snapshots` : 'Heuristic (build history for regression)'}
          {isFetching && ' · refreshing…'}
        </span>
      </div>

      {/* Hero numbers */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4 }}>CURRENT OIS</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: scoreColor(data.currentOis ?? 0) }}>{(data.currentOis ?? 0).toFixed(1)}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6 }}>
          <div style={{ width: 40, height: 1, background: BORDER }} />
          <ArrowRight className="w-4 h-4" style={{ color: TEXT2 }} />
          <div style={{ fontSize: 9, color: TEXT2 }}>30 days</div>
          <ArrowRight className="w-4 h-4" style={{ color: TEXT2 }} />
          <div style={{ width: 40, height: 1, background: BORDER }} />
        </div>

        <div>
          <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4 }}>30-DAY FORECAST</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: scoreColor(data.forecastOis ?? 0) }}>{(data.forecastOis ?? 0).toFixed(1)}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: deltaColor }}>
              {(data.forecastDelta ?? 0) >= 0 ? '+' : ''}{(data.forecastDelta ?? 0).toFixed(1)}
            </div>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: TEXT2, marginBottom: 4 }}>CONFIDENCE</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: confColor }}>{data.confidencePct}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Improving drivers */}
        <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: GREEN, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>
            ▲ IMPROVING DRIVERS
          </div>
          {data.drivers.improving.length === 0 ? (
            <div style={{ fontSize: 11, color: TEXT2 }}>No strong upward drivers detected yet</div>
          ) : (
            data.drivers.improving.map(d => (
              <div key={d.pillar} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: TEXT1 }}>{d.pillar}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: GREEN }}>+{d.projectedGain?.toFixed(1)} pts</span>
              </div>
            ))
          )}
        </div>

        {/* Declining drivers */}
        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, color: AMBER, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>
            ▼ RISK FACTORS
          </div>
          {data.drivers.declining.length === 0 ? (
            <div style={{ fontSize: 11, color: TEXT2 }}>No deteriorating factors detected</div>
          ) : (
            data.drivers.declining.map(d => (
              <div key={d.pillar} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: TEXT1 }}>{d.pillar}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: AMBER }}>−{d.projectedLoss?.toFixed(1)} pts</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Per-pillar forecast bar */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, color: TEXT2, fontWeight: 600, marginBottom: 2 }}>PILLAR TRAJECTORY</div>
        {Object.entries(data.pillarForecasts).map(([key, pf]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: TEXT2, width: 110, flexShrink: 0 }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <div style={{ flex: 1, background: SURFACE, borderRadius: 3, height: 4, overflow: 'visible', position: 'relative' }}>
              {/* Current */}
              <div style={{ width: `${pf.current}%`, height: '100%', borderRadius: 3, background: `${scoreColor(pf.current)}66` }} />
              {/* Forecast delta overlay */}
              {pf.delta > 0 && (
                <div style={{
                  position: 'absolute', top: 0, left: `${pf.current}%`, height: '100%',
                  width: `${Math.min(pf.delta, 100 - pf.current)}%`,
                  background: `${GREEN}99`, borderRadius: '0 3px 3px 0',
                }} />
              )}
              {pf.delta < 0 && (
                <div style={{
                  position: 'absolute', top: 0, left: `${Math.max(0, pf.current + pf.delta)}%`, height: '100%',
                  width: `${Math.min(Math.abs(pf.delta), pf.current)}%`,
                  background: `${RED}99`, borderRadius: '3px',
                }} />
              )}
            </div>
            <span style={{ fontSize: 10, color: TEXT2, width: 28, textAlign: 'right' }}>{(pf.current ?? 0).toFixed(0)}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: (pf.delta ?? 0) >= 0 ? GREEN : RED, width: 32, textAlign: 'right' }}>
              →{(pf.forecast ?? 0).toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      {data.method === 'HEURISTIC' && (
        <div style={{
          marginTop: 12, background: `${AMBER}10`, border: `1px solid ${AMBER}30`,
          borderRadius: 6, padding: '7px 10px', fontSize: 10, color: AMBER,
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          <Info className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
          Forecast is heuristic — save more OIS snapshots to enable regression-based prediction with higher confidence.
        </div>
      )}
    </div>
  )
}

// ─── Adoption event helper ────────────────────────────────────────────────────
function logAdoption(eventType: string, entityId?: string, metadata?: Record<string, unknown>) {
  adminApi('/admin/adoption/event', {
    method: 'POST',
    body: JSON.stringify({ eventType, entityType: 'G8_PAGE', entityId, metadata }),
  }).catch(() => {})  // fire-and-forget, never block UI
}

// ─── Gate 8.2 — Recommendation Engine™ ────────────────────────────────────────
interface Recommendation {
  id:           string
  pillar:       string
  metric:       string
  action:       string
  currentValue: string
  targetValue:  string
  oisImpact:    number
  pillarImpact: number
  effort:       'LOW' | 'MEDIUM' | 'HIGH'
  priority:     number
}

const EFFORT_COLOR: Record<string, string> = { LOW: GREEN, MEDIUM: AMBER, HIGH: RED }
const EFFORT_LABEL: Record<string, string> = { LOW: 'Quick Win', MEDIUM: 'Moderate', HIGH: 'Significant' }

function RecommendationPanel() {
  const [acted,   setActed]   = useState<Set<string>>(new Set())
  const [ignored, setIgnored] = useState<Set<string>>(new Set())

  const { data: recs = [], isFetching } = useQuery<Recommendation[]>({
    queryKey: ['gate8-recommendations'],
    queryFn:  () => adminApi('/admin/gate8/recommendations'),
    refetchInterval: 120_000,
  })

  function markActed(rec: Recommendation) {
    setActed(prev => new Set([...prev, rec.id]))
    logAdoption('REC_ACTED', rec.id, { pillar: rec.pillar, oisImpact: rec.oisImpact })
  }

  function markIgnored(rec: Recommendation) {
    setIgnored(prev => new Set([...prev, rec.id]))
    logAdoption('REC_IGNORED', rec.id, { pillar: rec.pillar, oisImpact: rec.oisImpact })
  }

  if (isFetching && recs.length === 0) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, fontSize: 12 }}>
          <Lightbulb className="w-4 h-4 animate-pulse" />
          Computing recommendations…
        </div>
      </div>
    )
  }

  if (recs.length === 0) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Lightbulb className="w-4 h-4" style={{ color: AMBER }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Recommendation Engine™</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: GREEN, fontSize: 12, padding: '12px 0' }}>
          <CheckCircle2 className="w-4 h-4" />
          All pillars are operating at high efficiency. No recommendations at this time.
        </div>
      </div>
    )
  }

  const totalImpact = recs.reduce((s, r) => s + r.oisImpact, 0)

  return (
    <div style={{ background: CARD, border: `1px solid ${AMBER}33`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Lightbulb className="w-4 h-4" style={{ color: AMBER }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Recommendation Engine™</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>Gate 8.2</span>
      </div>

      {/* Total potential impact banner */}
      <div style={{
        background: `${GREEN}12`, border: `1px solid ${GREEN}33`,
        borderRadius: 8, padding: '10px 14px', marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, color: TEXT2, marginBottom: 2 }}>TOTAL ADDRESSABLE OIS GAIN</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: GREEN }}>+{totalImpact.toFixed(1)} points</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: TEXT2, marginBottom: 2 }}>RECOMMENDATIONS</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: TEXT1 }}>{recs.length}</div>
        </div>
      </div>

      {/* Recommendation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recs.map(rec => {
          const isActed   = acted.has(rec.id)
          const isIgnored = ignored.has(rec.id)
          return (
            <div key={rec.id} style={{
              background: isActed ? `${GREEN}10` : isIgnored ? `${BORDER}` : SURFACE,
              borderRadius: 8, padding: '12px 14px',
              borderLeft: `3px solid ${isActed ? GREEN : isIgnored ? TEXT2 : EFFORT_COLOR[rec.effort]}`,
              opacity: isIgnored ? 0.5 : 1,
              transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#fff',
                  background: isActed ? GREEN : EFFORT_COLOR[rec.effort], borderRadius: 4,
                  padding: '2px 6px', flexShrink: 0, lineHeight: 1.4,
                }}>
                  {isActed ? '✓' : `#${rec.priority}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: TEXT1 }}>{rec.pillar}</span>
                    <span style={{ fontSize: 10, color: TEXT2 }}>→ {rec.metric}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: EFFORT_COLOR[rec.effort], fontWeight: 600 }}>
                      {EFFORT_LABEL[rec.effort]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{rec.action}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: TEXT2 }}>
                  {rec.currentValue}
                  <span style={{ color: TEXT2, margin: '0 4px' }}>→</span>
                  <span style={{ color: GREEN, fontWeight: 600 }}>{rec.targetValue}</span>
                </span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, background: `${GREEN}20`, color: GREEN, padding: '2px 7px', borderRadius: 10, fontWeight: 600 }}>
                    +{(rec.oisImpact ?? 0).toFixed(1)} OIS
                  </span>
                  {!isActed && !isIgnored && (
                    <>
                      <button
                        onClick={() => markActed(rec)}
                        style={{
                          fontSize: 10, background: `${GREEN}22`, color: GREEN,
                          border: `1px solid ${GREEN}44`, padding: '2px 8px', borderRadius: 10,
                          cursor: 'pointer', fontWeight: 600,
                        }}
                      >
                        Mark Acted
                      </button>
                      <button
                        onClick={() => markIgnored(rec)}
                        style={{
                          fontSize: 10, background: 'none', color: TEXT2,
                          border: `1px solid ${BORDER}`, padding: '2px 8px', borderRadius: 10,
                          cursor: 'pointer',
                        }}
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {isActed && (
                    <span style={{ fontSize: 10, color: GREEN, fontWeight: 600 }}>Logged ✓</span>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Gate 8.2.5 — Enterprise Coach Insights (inline panel) ───────────────────
interface CoachInsight {
  id:             string
  category:       string
  insight:        string
  recommendation: string
  priority:       string
  oisImpact:      number
  confidence:     number
  isActed:        boolean
}

const COACH_PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: RED, HIGH: AMBER, MEDIUM: BLUE, LOW: GREEN,
}

function CoachInsightsPanel() {
  const qc = useQueryClient()

  const { data: insights = [], isLoading } = useQuery<CoachInsight[]>({
    queryKey: ['g8-coach-insights'],
    queryFn:  () => adminApi('/admin/enterprise/coach?limit=3'),
    refetchInterval: 120_000,
  })

  const actMut = useMutation({
    mutationFn: (id: string) => adminApi(`/admin/enterprise/coach/${id}/act`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['g8-coach-insights'] }),
  })

  return (
    <div style={{ background: CARD, border: `1px solid ${TEAL}44`, borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Brain className="w-4 h-4" style={{ color: TEAL }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>WAANDA Coach Insights</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, background: `${TEAL}20`, color: TEAL, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
          Gate 8.2 · Live
        </span>
      </div>

      {isLoading && (
        <div style={{ fontSize: 11, color: TEXT2, padding: '8px 0' }}>Analysing enterprise patterns…</div>
      )}

      {!isLoading && insights.length === 0 && (
        <div style={{ fontSize: 11, color: TEXT2, padding: '8px 0' }}>
          No coaching insights yet — run more operations to generate patterns.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.slice(0, 3).map(ins => (
          <div
            key={ins.id}
            style={{
              background: ins.isActed ? `${GREEN}08` : SURFACE,
              border: `1px solid ${ins.isActed ? GREEN + '33' : BORDER}`,
              borderRadius: 8, padding: '12px 14px',
              opacity: ins.isActed ? 0.7 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                background: `${COACH_PRIORITY_COLOR[ins.priority] ?? BLUE}20`,
                color: COACH_PRIORITY_COLOR[ins.priority] ?? BLUE,
                padding: '2px 7px', borderRadius: 20, flexShrink: 0, marginTop: 1,
              }}>
                {ins.priority}
              </span>
              <span style={{ fontSize: 10, color: TEXT2, fontStyle: 'italic', flexShrink: 0, marginTop: 2 }}>
                {ins.category}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: TEAL, fontWeight: 600 }}>
                +{(ins.oisImpact ?? 0).toFixed(1)} OIS
              </span>
            </div>

            <p style={{ fontSize: 12, color: TEXT1, margin: '4px 0 2px', fontWeight: 500, lineHeight: 1.5 }}>
              {ins.insight}
            </p>
            <p style={{ fontSize: 11, color: TEXT2, margin: 0, lineHeight: 1.5 }}>
              {ins.recommendation}
            </p>

            {!ins.isActed && (
              <button
                onClick={() => actMut.mutate(ins.id)}
                disabled={actMut.isPending}
                style={{
                  marginTop: 8, fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
                  background: `${TEAL}15`, color: TEAL,
                  border: `1px solid ${TEAL}44`, borderRadius: 6,
                  padding: '4px 12px', cursor: 'pointer',
                }}
              >
                Mark Acted
              </button>
            )}
            {ins.isActed && (
              <span style={{ marginTop: 6, display: 'block', fontSize: 10, color: GREEN, fontWeight: 600 }}>
                ✓ Acted
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Gate 8.3 — Enterprise Digital Twin™ ──────────────────────────────────────

interface TwinScenario {
  id:             string
  scenario:       string
  horizon:        number
  currentOis:     number
  simulatedOis:   number
  delta:          number
  pillarDeltas:   Record<string, number>
  confidence:     number
  reasoning:      string
  recommendation: string
  createdAt:      string
}

const TWIN_SCENARIOS = [
  'What if we reduced approval delays by 1 day?',
  'What if we ran 20 more workflows this month?',
  'What if we hired 2 more engineers?',
  'What if the P1 incident resolves today?',
  'What if we automated client onboarding?',
]

const PILLARS: { key: string; label: string; color: string }[] = [
  { key: 'decision',   label: 'Decision',   color: BLUE   },
  { key: 'enterprise', label: 'Enterprise',  color: INDIGO },
  { key: 'workflow',   label: 'Workflow',    color: PURPLE },
  { key: 'goal',       label: 'Goal',        color: GREEN  },
  { key: 'ai',         label: 'AI',          color: CYAN   },
  { key: 'business',   label: 'Business',    color: TEAL   },
  { key: 'trust',      label: 'Trust',       color: AMBER  },
  { key: 'adoption',   label: 'Adoption',    color: ROSE   },
]

function TwinGauge({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: TEXT2, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto' }}>
        <svg width={72} height={72} viewBox="0 0 72 72">
          <circle cx={36} cy={36} r={28} fill="none" stroke={`${color}20`} strokeWidth={6} />
          <circle cx={36} cy={36} r={28} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${2 * Math.PI * 28 * pct / 100} ${2 * Math.PI * 28 * (1 - pct / 100)}`}
            strokeDashoffset={2 * Math.PI * 28 * 0.25}
            strokeLinecap="round" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1 }}>{(value ?? 0).toFixed(1)}</span>
          <span style={{ fontSize: 8, color: TEXT2 }}>/100</span>
        </div>
      </div>
    </div>
  )
}

function EnterpriseTwin() {
  const queryClient = useQueryClient()

  const [scenario,   setScenario]   = useState('')
  const [horizon,    setHorizon]    = useState<30 | 60 | 90>(30)
  const [result,     setResult]     = useState<TwinScenario | null>(null)
  const [simulating, setSimulating] = useState(false)
  const [simErr,     setSimErr]     = useState('')

  const { data: history = [] } = useQuery<TwinScenario[]>({
    queryKey: ['twin-scenarios'],
    queryFn:  () => adminApi('/admin/gate8/twin/scenarios?limit=5'),
    staleTime: 60_000,
  })

  const simulate = async () => {
    if (!scenario.trim() || simulating) return
    setSimulating(true); setSimErr(''); setResult(null)
    try {
      const r = await adminApi('/admin/gate8/twin/simulate', {
        method: 'POST',
        body:   JSON.stringify({ scenario: scenario.trim(), horizon }),
        headers: { 'Content-Type': 'application/json' },
      })
      setResult(r)
      queryClient.invalidateQueries({ queryKey: ['twin-scenarios'] })
    } catch (e: unknown) {
      setSimErr(e instanceof Error ? e.message : 'Simulation failed')
    } finally {
      setSimulating(false)
    }
  }

  const deltaColor = (d: number) => d > 0 ? GREEN : d < 0 ? RED : TEXT2
  const deltaSign  = (d: number) => d > 0 ? '+' : ''

  return (
    <div style={{ background: CARD, border: `1px solid ${PURPLE}44`, borderRadius: 12, padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FlaskConical className="w-4 h-4" style={{ color: PURPLE }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Enterprise Digital Twin™</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, background: `${PURPLE}20`, color: PURPLE, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
          Gate 8.3 · Live
        </span>
      </div>

      {/* Quick scenario chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {TWIN_SCENARIOS.map(s => (
          <button key={s} onClick={() => setScenario(s)} style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500,
            border: `1px solid ${scenario === s ? PURPLE : BORDER}`,
            background: scenario === s ? `${PURPLE}15` : SURFACE,
            color: scenario === s ? PURPLE : TEXT2,
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Scenario input + horizon + simulate */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') simulate() }}
          placeholder="Describe a change scenario…"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 12,
            border: `1px solid ${BORDER}`, background: SURFACE,
            color: TEXT1, outline: 'none',
          }}
        />
        {([30, 60, 90] as (30 | 60 | 90)[]).map(h => (
          <button key={h} onClick={() => setHorizon(h)} style={{
            padding: '7px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            border: `1px solid ${horizon === h ? BLUE : BORDER}`,
            background: horizon === h ? `${BLUE}15` : SURFACE,
            color: horizon === h ? BLUE : TEXT2, cursor: 'pointer',
          }}>
            {h}d
          </button>
        ))}
        <button onClick={simulate} disabled={!scenario.trim() || simulating} style={{
          padding: '7px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700,
          border: 'none', background: simulating ? `${PURPLE}25` : `${PURPLE}20`,
          color: PURPLE, cursor: scenario.trim() && !simulating ? 'pointer' : 'not-allowed',
          opacity: scenario.trim() && !simulating ? 1 : 0.5,
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.15s',
        }}>
          {simulating
            ? <><RefreshCw className="w-3 h-3" style={{ animation: 'spin 1s linear infinite' }} /> Simulating…</>
            : <><Sparkles className="w-3 h-3" /> Simulate</>
          }
        </button>
      </div>

      {simErr && (
        <div style={{ fontSize: 11, color: RED, marginBottom: 12 }}>{simErr}</div>
      )}

      {/* Result */}
      {result && (
        <div style={{ border: `1px solid ${PURPLE}30`, borderRadius: 10, padding: 16, marginBottom: 16, background: `${PURPLE}06` }}>
          {/* OIS comparison gauges */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
            <TwinGauge label="Current OIS" value={result.currentOis} color={BLUE} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <ArrowRight className="w-5 h-5" style={{ color: TEXT2 }} />
              <span style={{
                fontSize: 14, fontWeight: 800,
                color: deltaColor(result.delta),
              }}>
                {deltaSign(result.delta ?? 0)}{(result.delta ?? 0).toFixed(1)}
              </span>
              <span style={{ fontSize: 9, color: TEXT2 }}>OIS delta</span>
              <span style={{ fontSize: 9, color: TEXT2, marginTop: 2 }}>
                {Math.round(result.confidence * 100)}% confidence
              </span>
            </div>
            <TwinGauge label={`Simulated OIS (${result.horizon}d)`} value={result.simulatedOis} color={result.delta >= 0 ? GREEN : RED} />
          </div>

          {/* Per-pillar impact bars */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: TEXT2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pillar Impact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {PILLARS.map(p => {
                const d = result.pillarDeltas[p.key] ?? 0
                return (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: TEXT2, width: 72, flexShrink: 0 }}>{p.label}</span>
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: SURFACE, position: 'relative', overflow: 'hidden' }}>
                      {d !== 0 && (
                        <div style={{
                          position: 'absolute',
                          left: d >= 0 ? '50%' : `calc(50% - ${Math.min(50, Math.abs(d) * 2.5)}%)`,
                          width: `${Math.min(50, Math.abs(d) * 2.5)}%`,
                          height: '100%',
                          background: d > 0 ? GREEN : RED,
                          borderRadius: 3,
                        }} />
                      )}
                      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: BORDER }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: deltaColor(d), width: 32, textAlign: 'right', flexShrink: 0 }}>
                      {deltaSign(d)}{d.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* WAANDA reasoning + recommendation */}
          <div style={{ background: SURFACE, borderRadius: 8, padding: '10px 14px' }}>
            <div style={{ fontSize: 10, color: PURPLE, fontWeight: 700, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Brain className="w-3 h-3" /> WAANDA Reasoning
            </div>
            <p style={{ fontSize: 11, color: TEXT2, margin: '0 0 8px 0', lineHeight: 1.6 }}>{result.reasoning}</p>
            <div style={{ fontSize: 11, color: TEXT1, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <Lightbulb className="w-3 h-3 mt-0.5" style={{ color: AMBER, flexShrink: 0 }} />
              {result.recommendation}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: TEXT2, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Recent Scenarios
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.slice(0, 4).map(h => (
              <div key={h.id} onClick={() => { setScenario(h.scenario); setResult(h) }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                background: SURFACE, borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${BORDER}`, transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${PURPLE}44`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
              >
                <span style={{ fontSize: 11, color: TEXT1, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.scenario}
                </span>
                <span style={{ fontSize: 10, color: TEXT2, flexShrink: 0 }}>{h.horizon}d</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: deltaColor(h.delta), flexShrink: 0 }}>
                  {deltaSign(h.delta ?? 0)}{(h.delta ?? 0).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── COIG Triple Panel ─────────────────────────────────────────────────────────
function COIGTriplePanel() {
  const queryClient = useQueryClient()

  const { data: coig } = useQuery<COIGReport>({
    queryKey: ['enterprise-coig'],
    queryFn:  () => adminApi('/admin/enterprise/coig?horizon=30'),
    refetchInterval: 120_000,
  })

  const baselineMut = useMutation({
    mutationFn: () => adminApi('/admin/gate8/baseline', { method: 'POST', body: '{}' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['enterprise-coig'] }),
  })

  const hasBaseline = coig?.baselineId != null
  const daysSince   = coig?.daysSinceBaseline ?? 0

  const coigColor = (n: number) => n > 0 ? GREEN : n < 0 ? RED : TEXT2

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <TrendingUp className="w-4 h-4" style={{ color: GREEN }} />
        <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>COIG™ — Customer Operational Intelligence Gain</span>
        {hasBaseline && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
            Since baseline · {daysSince} day{daysSince !== 1 ? 's' : ''} ago
          </span>
        )}
      </div>
      <div style={{ fontSize: 11, color: TEXT2, marginBottom: 16 }}>
        How much has this enterprise improved since we started? OIS is the instrument. COIG is the proof.
      </div>

      {!hasBaseline ? (
        <div style={{
          background: `${AMBER}11`, border: `1px dashed ${AMBER}55`, borderRadius: 10,
          padding: 16, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertTriangle className="w-4 h-4" style={{ color: AMBER, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: TEXT1, fontWeight: 600, marginBottom: 2 }}>No baseline established</div>
            <div style={{ fontSize: 11, color: TEXT2 }}>Save a COIG baseline to start measuring improvement. This is the "before" state all future COIG numbers are measured against.</div>
          </div>
          <button
            onClick={() => baselineMut.mutate()}
            disabled={baselineMut.isPending}
            style={{
              padding: '8px 16px', background: AMBER, color: '#000', border: 'none',
              borderRadius: 8, cursor: baselineMut.isPending ? 'not-allowed' : 'pointer',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
              opacity: baselineMut.isPending ? 0.7 : 1,
            }}
          >
            {baselineMut.isPending ? 'Saving…' : 'Set Baseline Now'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            {
              label: 'Current', sublabel: 'Actual improvement',
              value: coig?.current ?? 0, prefix: coig != null && coig.current > 0 ? '+' : '',
              description: `OIS moved from ${coig?.baselineOis?.toFixed(1)} → ${coig?.currentOis?.toFixed(1)}`,
            },
            {
              label: 'Expected', sublabel: 'Forecast trajectory (30d)',
              value: coig?.expected ?? 0, prefix: coig != null && coig.expected > 0 ? '+' : '',
              description: 'Based on Gate 8.1 regression model',
            },
            {
              label: 'Potential', sublabel: 'If all recommendations executed',
              value: coig?.potential ?? 0, prefix: coig != null && coig.potential > 0 ? '+' : '',
              description: 'Gap between Potential and Expected = unrealised value',
            },
          ].map(item => (
            <div key={item.label} style={{
              background: SURFACE, borderRadius: 12, padding: 16,
              border: `1px solid ${BORDER}`,
            }}>
              <div style={{ fontSize: 10, color: TEXT2, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: coigColor(item.value), lineHeight: 1, marginBottom: 4 }}>
                {item.prefix}{item.value?.toFixed(1) ?? '—'}
              </div>
              <div style={{ fontSize: 10, color: TEXT2, marginBottom: 8 }}>{item.sublabel}</div>
              <div style={{ fontSize: 10, color: TEXT2, borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── EMI™ Panel ───────────────────────────────────────────────────────────────
const EMI_COLORS: Record<string, string> = {
  L1: RED, L2: AMBER, L3: BLUE, L4: PURPLE, L5: GREEN,
}

function EMIPanel() {
  const { data: emi } = useQuery<EMIResult>({
    queryKey: ['enterprise-maturity'],
    queryFn:  () => adminApi('/admin/enterprise/maturity'),
    refetchInterval: 300_000,
  })

  if (!emi) return null

  const levelColor = EMI_COLORS[emi.level] ?? BLUE
  const dimLabels: Record<string, string> = {
    intelligence: 'Intelligence', autonomy: 'Autonomy', adoption: 'Adoption', governance: 'Governance',
  }

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Award className="w-4 h-4" style={{ color: GOLD }} />
        <span style={{ fontWeight: 700, fontSize: 13, color: TEXT1 }}>EMI™ — WAANDA Enterprise Maturity Index</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: TEXT2 }}>
          Confidence: {emi.confidence}%{emi.isProvisional ? ' · Provisional' : ''}
        </span>
      </div>
      <div style={{ fontSize: 11, color: TEXT2, marginBottom: 16 }}>
        What kind of enterprise has Kangqore become? OIS measures health. EMI™ measures evolution.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: 16 }}>
        {/* Level badge */}
        <div style={{
          background: `${levelColor}15`, border: `2px solid ${levelColor}44`,
          borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: levelColor }}>
            {emi.level}{emi.isProvisional ? '*' : ''}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: levelColor, textAlign: 'center' }}>
            {emi.levelLabel.replace(emi.level + ' — ', '')}
          </div>
          <div style={{ fontSize: 10, color: TEXT2, textAlign: 'center', lineHeight: 1.4 }}>
            {emi.description}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT1, marginTop: 4 }}>
            {(emi.emiScore ?? 0).toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: TEXT2 }}>EMI Score (0–100)</div>
        </div>

        {/* Four dimensions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {(Object.entries(emi.dimensions) as Array<[keyof typeof emi.dimensions, number]>).map(([key, val]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: TEXT1 }}>{dimLabels[key]}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(val ?? 0) }}>{(val ?? 0).toFixed(1)}</span>
              </div>
              <div style={{ background: SURFACE, borderRadius: 3, height: 5, overflow: 'hidden' }}>
                <div style={{
                  width: `${val}%`, height: '100%', borderRadius: 3,
                  background: scoreColor(val), transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Next level + time estimate or blockers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {emi.nextLevelLabel && (
            <div style={{
              background: SURFACE, borderRadius: 10, padding: 12,
              border: `1px solid ${BORDER}`, flexShrink: 0,
            }}>
              <div style={{ fontSize: 10, color: TEXT2, fontWeight: 600, marginBottom: 6 }}>NEXT LEVEL</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT1, marginBottom: 4 }}>{emi.nextLevelLabel}</div>
              {emi.timeToNextLevel && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: BLUE }}>{emi.timeToNextLevel.days}</span>
                  <span style={{ fontSize: 11, color: TEXT2 }}>days at current trajectory</span>
                </div>
              )}
              {emi.timeToNextLevel?.acceleratorDays > 0 && (
                <div style={{ fontSize: 10, color: GREEN, marginTop: 4 }}>
                  ↑ Act on recommendations → reach {emi.timeToNextLevel.acceleratorDays} days sooner
                </div>
              )}
            </div>
          )}
          {emi.blockers.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: TEXT2, fontWeight: 600, marginBottom: 6 }}>BLOCKERS TO NEXT LEVEL</div>
              {emi.blockers.slice(0, 3).map(b => (
                <div key={b.dimension} style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5,
                  fontSize: 10, color: TEXT2,
                }}>
                  <Lock className="w-3 h-3" style={{ color: AMBER, flexShrink: 0 }} />
                  <span>{b.label}: <span style={{ color: RED }}>{(b.current ?? 0).toFixed(0)}</span> → <span style={{ color: GREEN }}>{b.required}</span> needed (+{(b.gap ?? 0).toFixed(0)})</span>
                </div>
              ))}
            </div>
          )}
          {emi.level === 'L5' && (
            <div style={{ fontSize: 11, color: GREEN, fontWeight: 600, textAlign: 'center', marginTop: 8 }}>
              ✦ Maximum maturity achieved
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function G8Page() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const key = 'g8-session-logged'
    if (!sessionStorage.getItem(key)) {
      logAdoption('SESSION', undefined, { page: 'gate8' })
      sessionStorage.setItem(key, '1')
    }
  }, [])

  const { data: scoreData, isFetching } = useQuery<Gate8Result>({
    queryKey: ['gate8-score'],
    queryFn:  () => adminApi('/admin/gate8/score'),
    refetchInterval: 60_000,
  })

  const { data: history = [] } = useQuery<SnapshotRecord[]>({
    queryKey: ['gate8-history'],
    queryFn:  () => adminApi('/admin/gate8/history?limit=30'),
    refetchInterval: 120_000,
  })

  const [snapMsg, setSnapMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const snapshotMut = useMutation({
    mutationFn: () => adminApi('/admin/gate8/snapshot', { method: 'POST', body: JSON.stringify({ triggeredBy: 'MANUAL' }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gate8-history'] })
      queryClient.invalidateQueries({ queryKey: ['gate8-score']   })
      setSnapMsg({ ok: true, text: 'Snapshot saved' })
      setTimeout(() => setSnapMsg(null), 4000)
    },
    onError: (e: any) => {
      const msg = e?.message ?? 'Snapshot failed'
      setSnapMsg({ ok: false, text: msg })
    },
  })

  if (!scoreData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: TEXT2, gap: 8 }}>
        <Activity className="w-4 h-4 animate-pulse" />
        Computing Operational Intelligence Score…
      </div>
    )
  }

  const { pillars } = scoreData

  const prevOis = history.length > 0 ? history[0].oisScore : null
  const oisTrend = trend(scoreData.oisScore, prevOis)

  const PILLARS: PillarCardProps[] = [
    {
      title:    'Decision Intelligence',
      weight:   '20%',
      score:    scoreData.decisionScore,
      icon:     Brain,
      color:    INDIGO,
      trendDir: trend(scoreData.decisionScore, history[0]?.decisionScore ?? null),
      metrics: [
        { label: 'Total Decisions (30d)',   value: fmt(pillars.decision.metrics.total) },
        { label: 'Avg Confidence',          value: fmt(pillars.decision.metrics.avgConfidencePct, '%') },
        { label: 'AI Adoption Rate',        value: fmt(pillars.decision.metrics.adoptionRatePct, '%') },
        { label: 'Human Override Rate',     value: fmt(pillars.decision.metrics.overrideRatePct, '%') },
        { label: 'Outcome Recorded Rate',   value: fmt(pillars.decision.metrics.outcomeRatePct, '%') },
        { label: 'Avg Evidence Items',      value: fmt(pillars.decision.metrics.avgEvidenceItems) },
        { label: 'Avg Cycle Time',          value: pillars.decision.metrics.avgCycleHours != null ? `${pillars.decision.metrics.avgCycleHours}h` : '—' },
      ],
    },
    {
      title:    'Workflow Intelligence',
      weight:   '15%',
      score:    scoreData.workflowScore,
      icon:     Workflow,
      color:    BLUE,
      trendDir: trend(scoreData.workflowScore, history[0]?.workflowScore ?? null),
      metrics: [
        { label: 'Total Runs (30d)',         value: fmt(pillars.workflow.metrics.allTotal) },
        { label: 'Completion Rate',          value: fmt(pillars.workflow.metrics.overallCompletionPct, '%') },
        { label: 'Failed Runs',              value: fmt(pillars.workflow.metrics.allFailed) },
        { label: 'KIMMP Retry Rate',         value: fmt(pillars.workflow.metrics.kimmpRetryRatePct, '%') },
        { label: 'Step Completion Rate',     value: fmt(pillars.workflow.metrics.stepCompletionPct, '%') },
        { label: 'Avg Duration',             value: pillars.workflow.metrics.osAvgDurationSec != null ? `${pillars.workflow.metrics.osAvgDurationSec}s` : '—' },
      ],
    },
    {
      title:    'AI Intelligence',
      weight:   '10%',
      score:    scoreData.aiScore,
      icon:     Cpu,
      color:    CYAN,
      trendDir: trend(scoreData.aiScore, history[0]?.aiScore ?? null),
      metrics: [
        { label: 'Total AI Calls (30d)',     value: fmt(pillars.ai.metrics.totalCalls) },
        { label: 'Success Rate',             value: fmt(pillars.ai.metrics.successRatePct, '%') },
        { label: 'Avg Latency',              value: fmtMs(pillars.ai.metrics.avgLatencyMs) },
        { label: 'Total Cost (30d)',         value: pillars.ai.metrics.totalCostUsd != null ? `$${pillars.ai.metrics.totalCostUsd}` : '—' },
        { label: 'Cost Per Call',            value: pillars.ai.metrics.costPerCallUsd != null ? `$${pillars.ai.metrics.costPerCallUsd}` : '—' },
        { label: 'AI Evaluations',           value: fmt(pillars.ai.metrics.evaluations) },
        { label: 'Avg Eval Score',           value: pillars.ai.metrics.avgEvalScore != null ? `${pillars.ai.metrics.avgEvalScore}/5` : '—' },
        { label: 'QEF Cert Score',           value: fmt(pillars.ai.metrics.qefCertScore) },
      ],
    },
    {
      title:    'Enterprise Health',
      weight:   '20%',
      score:    scoreData.enterpriseScore,
      icon:     Globe2,
      color:    ROSE,
      trendDir: trend(scoreData.enterpriseScore, history[0]?.enterpriseScore ?? null),
      metrics: [
        { label: 'Active Incidents',         value: fmt(pillars.enterprise.metrics.activeIncidents) },
        { label: 'P1-Critical Active',       value: fmt(pillars.enterprise.metrics.p1Active) },
        { label: 'P2-High Active',           value: fmt(pillars.enterprise.metrics.p2Active) },
        { label: 'SLA Breaches',             value: fmt(pillars.enterprise.metrics.slaBreached) },
        { label: 'Open Risks',               value: fmt(pillars.enterprise.metrics.openRisks) },
        { label: 'Critical Risks',           value: fmt(pillars.enterprise.metrics.criticalRisks) },
        { label: 'Deteriorating Risks',      value: fmt(pillars.enterprise.metrics.deterioratingRisks) },
      ],
    },
    {
      title:    'Goal Intelligence',
      weight:   '15%',
      score:    scoreData.goalScore,
      icon:     Target,
      color:    INDIGO,
      trendDir: trend(scoreData.goalScore, history[0]?.goalScore ?? null),
      metrics: [
        { label: 'Total Goals',              value: fmt(pillars.goal.metrics.total) },
        { label: 'Active',                   value: fmt(pillars.goal.metrics.active) },
        { label: 'Completed',                value: fmt(pillars.goal.metrics.completed) },
        { label: 'At Risk',                  value: fmt(pillars.goal.metrics.atRisk) },
        { label: 'Avg Progress',             value: fmt(pillars.goal.metrics.avgProgressPct, '%') },
        { label: 'Completion Rate',          value: fmt(pillars.goal.metrics.completionRatePct, '%') },
      ],
    },
    {
      title:    'Learning Velocity',
      weight:   'Modifier',
      score:    scoreData.learningScore,
      icon:     BookOpen,
      color:    PURPLE,
      trendDir: (pillars.learning.velocityModifier ?? 0) > 0.03 ? 'up' : (pillars.learning.velocityModifier ?? 0) < -0.03 ? 'down' : 'flat',
      metrics: [
        { label: 'Total Memories',           value: fmt(pillars.learning.metrics.totalMemories) },
        { label: 'Added This Week',          value: fmt(pillars.learning.metrics.recentLast7Days) },
        { label: 'Growth Rate',              value: fmt(pillars.learning.metrics.growthRatePct, '%') },
        { label: 'Patterns Detected',        value: fmt(pillars.learning.metrics.patterns) },
        { label: 'Lessons Learned',          value: fmt(pillars.learning.metrics.lessons) },
        { label: 'Outcomes Recorded',        value: fmt(pillars.learning.metrics.outcomes) },
        { label: 'OIS Velocity Modifier',    value: `${((pillars.learning.velocityModifier ?? 0) * 100).toFixed(1)}%` },
      ],
    },
    {
      title:    'Business Value',
      weight:   '10%',
      score:    scoreData.businessScore,
      icon:     TrendingUp,
      color:    AMBER,
      trendDir: trend(scoreData.businessScore, history[0]?.businessScore ?? null),
      metrics: [
        { label: 'Workflows Completed',      value: fmt(pillars.business.metrics.totalWorkflowsCompleted) },
        { label: 'Hours Saved (est.)',       value: pillars.business.metrics.estimatedHoursSaved != null ? `${Number(pillars.business.metrics.estimatedHoursSaved).toLocaleString()} hrs` : '—' },
        { label: 'INR Saved (est.)',         value: pillars.business.metrics.estimatedInrSavedCr != null ? `₹${pillars.business.metrics.estimatedInrSavedCr} Cr` : '—' },
        { label: 'Automated Approvals',      value: fmt(pillars.business.metrics.automatedApprovals) },
        { label: 'Automation Coverage',      value: fmt(pillars.business.metrics.automationCoveragePct, '%') },
      ],
    },
    {
      title:    'Trust Intelligence',
      weight:   '8%',
      score:    scoreData.trustScore,
      icon:     Shield,
      color:    GREEN,
      trendDir: trend(scoreData.trustScore, history[0]?.trustScore ?? null),
      metrics: [
        { label: 'Audit Events (30d)',       value: fmt(pillars.trust.metrics.aegisEventsLast30Days) },
        { label: 'Emergency Overrides',      value: fmt(pillars.trust.metrics.emergencyOverrides) },
        { label: 'AI Evaluations',           value: fmt(pillars.trust.metrics.evaluations) },
        { label: 'Avg Safety Score',         value: pillars.trust.metrics.avgSafeScore != null ? `${pillars.trust.metrics.avgSafeScore}/5` : '—' },
        { label: 'Avg Grounded Score',       value: pillars.trust.metrics.avgGroundedScore != null ? `${pillars.trust.metrics.avgGroundedScore}/5` : '—' },
        { label: 'Audit Coverage',           value: String(pillars.trust.metrics.auditCoverage ?? '—') },
      ],
    },
    {
      title:    'Adoption Intelligence',
      weight:   '5%',
      score:    scoreData.adoptionScore ?? 0,
      icon:     Users,
      color:    TEAL,
      trendDir: trend(scoreData.adoptionScore ?? 0, history[0]?.adoptionScore ?? null),
      metrics: [
        { label: 'Active Users (30d)',        value: fmt(pillars.adoption.metrics.uniqueActiveUsers) },
        { label: 'Decision Acceptance Rate',  value: fmt(pillars.adoption.metrics.decisionAcceptanceRatePct, '%') },
        { label: 'Total Approvals',           value: fmt(pillars.adoption.metrics.totalApprovals) },
        { label: 'Emergency Overrides',       value: fmt(pillars.adoption.metrics.emergencyOverrides) },
        { label: 'Workflow Runs (30d)',        value: fmt(pillars.adoption.metrics.workflowRunsLast30Days) },
        { label: 'Recs Acted On',             value: fmt(pillars.adoption.metrics.recommendationsActed) },
        { label: 'Recs Ignored',              value: fmt(pillars.adoption.metrics.recommendationsIgnored) },
        { label: 'Rec Follow-through Rate',   value: fmt(pillars.adoption.metrics.recActedRatePct, '%') },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── EMI + COIG ── */}
      <EMIPanel />
      <COIGTriplePanel />

      {/* ── Hero: OIS ── */}
      <div style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
        padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 32,
      }}>
        {/* Arc gauge */}
        <div style={{ flexShrink: 0 }}>
          <OisGauge score={scoreData.oisScore} />
        </div>

        {/* Labels */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Activity className="w-4 h-4" style={{ color: BLUE }} />
            <span style={{ fontSize: 11, color: TEXT2, letterSpacing: 1, fontWeight: 600 }}>
              OPERATIONAL INTELLIGENCE SCORE
            </span>
            {isFetching && <RefreshCw className="w-3 h-3 animate-spin" style={{ color: TEXT2 }} />}
          </div>
          <div style={{ fontSize: 13, color: TEXT1, marginBottom: 10, maxWidth: 400 }}>
            The north-star KPI for the Kangqore platform. Measures the quality of intelligence,
            automation, and enterprise outcomes — not just code.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              background: `${scoreColor(scoreData.oisScore)}22`,
              border: `1px solid ${scoreColor(scoreData.oisScore)}55`,
              borderRadius: 20, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, color: scoreColor(scoreData.oisScore),
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <TrendIcon dir={oisTrend} />
              {scoreLabel(scoreData.oisScore)}
            </div>
            {prevOis != null && (
              <span style={{ fontSize: 11, color: TEXT2 }}>
                vs {prevOis.toFixed(1)} last snapshot
              </span>
            )}
            <span style={{ fontSize: 10, color: TEXT2 }}>
              · Continuous Enterprise Optimization · Gate 8
            </span>
          </div>
        </div>

        {/* Mini pillar bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 200 }}>
          {[
            { label: 'Decision',   score: scoreData.decisionScore,          weight: '20%' },
            { label: 'Enterprise', score: scoreData.enterpriseScore,        weight: '18%' },
            { label: 'Workflow',   score: scoreData.workflowScore,          weight: '15%' },
            { label: 'Goals',      score: scoreData.goalScore,              weight: '14%' },
            { label: 'AI',         score: scoreData.aiScore,                weight: '10%' },
            { label: 'Business',   score: scoreData.businessScore,          weight: '10%' },
            { label: 'Trust',      score: scoreData.trustScore,             weight: '8%'  },
            { label: 'Adoption',   score: scoreData.adoptionScore ?? 0,     weight: '5%'  },
          ].map(p => (
            <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: TEXT2, width: 70, flexShrink: 0 }}>{p.label}</span>
              <div style={{ flex: 1, background: SURFACE, borderRadius: 3, height: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${p.score}%`, height: '100%', borderRadius: 3,
                  background: scoreColor(p.score), transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontSize: 10, color: scoreColor(p.score), fontWeight: 600, width: 26, textAlign: 'right' }}>
                {Math.round(p.score)}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => { setSnapMsg(null); snapshotMut.mutate() }}
            disabled={snapshotMut.isPending}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              background: BLUE, color: '#fff', border: 'none', borderRadius: 8,
              cursor: snapshotMut.isPending ? 'not-allowed' : 'pointer',
              fontSize: 12, fontWeight: 600, opacity: snapshotMut.isPending ? 0.7 : 1,
            }}
          >
            <Camera className="w-3.5 h-3.5" />
            {snapshotMut.isPending ? 'Saving…' : 'Save Snapshot'}
          </button>
          {snapMsg && (
            <div style={{
              fontSize: 11, padding: '5px 10px', borderRadius: 6, fontWeight: 500,
              background: snapMsg.ok ? `${GREEN}18` : `${RED}18`,
              color: snapMsg.ok ? GREEN : RED,
              border: `1px solid ${snapMsg.ok ? GREEN : RED}44`,
            }}>
              {snapMsg.ok ? '✓ ' : '✕ '}{snapMsg.text}
            </div>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['gate8-score'] })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              background: SURFACE, color: TEXT2, border: `1px solid ${BORDER}`,
              borderRadius: 8, cursor: 'pointer', fontSize: 12,
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* ── The Feedback Loop ── */}
      <div style={{
        background: `${INDIGO}12`, border: `1px solid ${INDIGO}33`,
        borderRadius: 10, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 11, color: INDIGO, flexWrap: 'wrap',
      }}>
        {['Observe', 'Measure', 'Evaluate', 'Learn', 'Improve', 'Operate Better'].map((step, i, arr) => (
          <span key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{step}</span>
            {i < arr.length - 1 && <span style={{ opacity: 0.5 }}>→</span>}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontWeight: 600, opacity: 0.7 }}>
          Continuous Enterprise Optimization
        </span>
      </div>

      {/* ── 9 Pillar Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {PILLARS.map(p => <PillarCard key={p.title} {...p} />)}
      </div>

      {/* ── Business Value + Enterprise Risk ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <BusinessValuePanel pillars={pillars} />
        <EnterpriseRiskGrid metrics={pillars.enterprise.metrics} />
      </div>

      {/* ── Goal Intelligence + Learning Velocity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GoalIntelligencePanel metrics={pillars.goal.metrics} />
        <LearningVelocityPanel
          metrics={pillars.learning.metrics}
          velocityModifier={pillars.learning.velocityModifier ?? 0}
        />
      </div>

      {/* ── OIS Trend + Trust ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <OisTrendChart history={history} />
        <TrustPanel metrics={pillars.trust.metrics} />
      </div>

      {/* ── OIS Weights Breakdown ── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BarChart3 className="w-4 h-4" style={{ color: PURPLE }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>OIS Composition</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: TEXT2 }}>Gate 8 · RGS/1.0 Permanent Layer</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
          {[
            { label: 'Decision',          pct: 20, score: scoreData.decisionScore,          color: INDIGO },
            { label: 'Enterprise',        pct: 18, score: scoreData.enterpriseScore,        color: ROSE   },
            { label: 'Workflow',          pct: 15, score: scoreData.workflowScore,          color: BLUE   },
            { label: 'Goals',             pct: 14, score: scoreData.goalScore,              color: INDIGO },
            { label: 'AI',                pct: 10, score: scoreData.aiScore,                color: CYAN   },
            { label: 'Business',          pct: 10, score: scoreData.businessScore,          color: AMBER  },
            { label: 'Trust',             pct:  8, score: scoreData.trustScore,             color: GREEN  },
            { label: 'Adoption',          pct:  5, score: scoreData.adoptionScore ?? 0,     color: TEAL   },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{
                height: 60, background: SURFACE, borderRadius: 6, position: 'relative', overflow: 'hidden',
                marginBottom: 6,
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${item.score}%`, background: `${item.color}55`,
                  transition: 'height 1s ease',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: item.color,
                }}>
                  {Math.round(item.score)}
                </div>
              </div>
              <div style={{ fontSize: 9, color: TEXT2, lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ fontSize: 9, color: item.color, fontWeight: 700 }}>{item.pct}%</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: TEXT2, borderTop: `1px solid ${BORDER}`, paddingTop: 10, lineHeight: 1.7 }}>
          <span style={{ fontWeight: 600, color: TEXT1 }}>Learning Velocity</span> applies a ±5% modifier on top of the weighted score.
          Current modifier: <span style={{ color: scoreColor(60 + (pillars.learning.velocityModifier ?? 0) * 100), fontWeight: 600 }}>
            {(pillars.learning.velocityModifier ?? 0) > 0 ? '+' : ''}{((pillars.learning.velocityModifier ?? 0) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* ── Snapshot History ── */}
      {history.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Clock className="w-4 h-4" style={{ color: TEXT2 }} />
            <span style={{ fontWeight: 600, fontSize: 13, color: TEXT1 }}>Snapshot History</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: TEXT2 }}>{history.length} records</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Date', 'Label', 'OIS', 'Decision', 'Workflow', 'AI', 'Enterprise', 'Goals', 'Business', 'Trust', 'Adoption', 'By'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: TEXT2, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map(snap => (
                  <tr key={snap.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '6px 10px', color: TEXT2, whiteSpace: 'nowrap' }}>
                      {new Date(snap.createdAt).toLocaleDateString()}{' '}
                      <span style={{ fontSize: 10 }}>{new Date(snap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td style={{ padding: '6px 10px' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: snap.label === 'BASELINE' ? `${AMBER}22` : snap.label === 'CHECKPOINT' ? `${BLUE}22` : SURFACE,
                        color: snap.label === 'BASELINE' ? AMBER : snap.label === 'CHECKPOINT' ? BLUE : TEXT2,
                      }}>{snap.label ?? 'AUTO'}</span>
                    </td>
                    {[
                      snap.oisScore        ?? 0,
                      snap.decisionScore   ?? 0,
                      snap.workflowScore   ?? 0,
                      snap.aiScore         ?? 0,
                      snap.enterpriseScore ?? 0,
                      snap.goalScore       ?? 0,
                      snap.businessScore   ?? 0,
                      snap.trustScore      ?? 0,
                      snap.adoptionScore   ?? 0,
                    ].map((v, i) => (
                      <td key={i} style={{ padding: '6px 10px', color: scoreColor(v), fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {v.toFixed(1)}
                      </td>
                    ))}
                    <td style={{ padding: '6px 10px', color: TEXT2 }}>{snap.triggeredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Gate 8.1 Forecast + Gate 8.2 Recommendations ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ForecastPanel />
        <RecommendationPanel />
      </div>

      {/* ── Gate 8.2.5 Coach Insights ── */}
      <CoachInsightsPanel />

      {/* ── Gate 8.3 Digital Twin ── */}
      <EnterpriseTwin />

      {/* ── G8 Permanent Notice ── */}
      <div style={{
        background: `${GREEN}10`, border: `1px solid ${GREEN}33`,
        borderRadius: 8, padding: '10px 16px', fontSize: 11, color: TEXT2,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: GREEN, flexShrink: 0 }} />
        <span>
          <span style={{ color: TEXT1, fontWeight: 600 }}>Gate 8 is permanent</span>
          {' '}— it does not have a pass/fail threshold. It runs continuously, feeds back into every future deployment decision,
          and measures whether the platform is improving the enterprise over time.
          OIS is the north-star KPI.{' '}
          <span style={{ color: GREEN, fontWeight: 600 }}>Gate 8.1</span> Forecast ·{' '}
          <span style={{ color: AMBER, fontWeight: 600 }}>Gate 8.2</span> Recommendations ·{' '}
          <span style={{ color: PURPLE, fontWeight: 600 }}>Gate 8.3</span> Digital Twin ·{' '}
          <span style={{ color: GOLD, fontWeight: 600 }}>EMI™</span> Enterprise Maturity ·{' '}
          <span style={{ color: GREEN, fontWeight: 600 }}>COIG™</span> Commercial Proof
        </span>
      </div>

    </div>
  )
}
