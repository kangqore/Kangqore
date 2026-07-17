import { useState, useMemo } from 'react'
import { Star, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Plus, Check, X, Target, MessageSquare } from 'lucide-react'

const GREEN  = '#10b981'
const BLUE   = '#2564ea'
const AMBER  = '#f59e0b'
const PURPLE = '#7c3aed'
const RED    = '#ef4444'
const TEAL   = '#0d9488'
const SLATE  = '#6b7280'
const GOLD   = '#fbbf24'

type Rating = 1 | 2 | 3 | 4 | 5
type ReviewCycle = 'Q1-2026' | 'Q2-2026' | 'Q3-2026' | 'ANNUAL-2025'
type Trend = 'UP' | 'STABLE' | 'DOWN'

interface Goal { id: string; title: string; progress: number; status: 'ON_TRACK' | 'AT_RISK' | 'DONE' }
interface ReviewRecord {
  id:          string
  employeeId:  string
  employeeName: string
  role:        string
  department:  string
  cycle:       ReviewCycle
  managerRating: Rating
  selfRating:  Rating
  trend:       Trend
  strengths:   string[]
  development: string[]
  goals:       Goal[]
  status:      'DRAFT' | 'IN_REVIEW' | 'COMPLETE'
  completedAt?: string
}

const CYCLE_CFG: Record<ReviewCycle, { label: string; period: string }> = {
  'Q1-2026':    { label: 'Q1 2026', period: 'Jan–Mar 2026' },
  'Q2-2026':    { label: 'Q2 2026', period: 'Apr–Jun 2026' },
  'Q3-2026':    { label: 'Q3 2026', period: 'Jul–Sep 2026' },
  'ANNUAL-2025':{ label: 'Annual 2025', period: 'Jan–Dec 2025' },
}

const RATING_LABEL: Record<Rating, string> = { 1: 'Needs Improvement', 2: 'Below Expectations', 3: 'Meets Expectations', 4: 'Exceeds Expectations', 5: 'Outstanding' }
const ratingColor = (r: Rating) => r >= 4 ? GREEN : r === 3 ? AMBER : RED

const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: 'r1', employeeId: 'e1', employeeName: 'Deepak Menon', role: 'DevOps Engineer', department: 'Engineering',
    cycle: 'Q3-2026', managerRating: 5, selfRating: 4, trend: 'UP',
    strengths: ['Exceptional infrastructure automation', 'Proactive incident response', 'Cross-team collaboration'],
    development: ['Improve documentation habits', 'Strengthen cloud cost optimization'],
    goals: [
      { id: 'g1', title: 'Reduce deployment time by 40%', progress: 85, status: 'ON_TRACK' },
      { id: 'g2', title: 'Certify AWS Solutions Architect', progress: 60, status: 'ON_TRACK' },
      { id: 'g3', title: 'Zero P0 incidents for 90 days', progress: 100, status: 'DONE' },
    ],
    status: 'IN_REVIEW',
  },
  {
    id: 'r2', employeeId: 'e2', employeeName: 'Sneha Pillai', role: 'HR Business Partner', department: 'HR',
    cycle: 'Q3-2026', managerRating: 4, selfRating: 4, trend: 'STABLE',
    strengths: ['Strong relationship building', 'Policy design expertise', 'Empathetic conflict resolution'],
    development: ['Analytics and HR metrics proficiency', 'Improve hiring velocity'],
    goals: [
      { id: 'g4', title: 'Complete onboarding framework', progress: 70, status: 'ON_TRACK' },
      { id: 'g5', title: 'Reduce time-to-hire to 28 days', progress: 40, status: 'AT_RISK' },
      { id: 'g6', title: 'Launch L&D programme', progress: 20, status: 'AT_RISK' },
    ],
    status: 'DRAFT',
  },
  {
    id: 'r3', employeeId: 'e3', employeeName: 'Arun Krishnan', role: 'Product Manager', department: 'Delivery',
    cycle: 'Q2-2026', managerRating: 4, selfRating: 3, trend: 'UP',
    strengths: ['Excellent stakeholder management', 'Data-driven prioritization', 'Clear product vision'],
    development: ['Technical depth in APIs', 'Improve sprint planning cadence'],
    goals: [
      { id: 'g7', title: 'Launch 3 product features on time', progress: 100, status: 'DONE' },
      { id: 'g8', title: 'Raise NPS from 42 to 55',          progress: 75, status: 'ON_TRACK' },
    ],
    status: 'COMPLETE', completedAt: '2026-07-01',
  },
]

function StarRating({ value, onChange, readonly = false }: { value: Rating; onChange?: (v: Rating) => void; readonly?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {([1,2,3,4,5] as Rating[]).map(n => (
        <button
          key={n}
          onClick={() => !readonly && onChange?.(n)}
          style={{
            background: 'none', border: 'none', cursor: readonly ? 'default' : 'pointer',
            padding: 1, color: n <= value ? GOLD : 'var(--os-border)',
          }}
        >
          <Star style={{ width: 14, height: 14, fill: n <= value ? GOLD : 'none', stroke: n <= value ? GOLD : 'var(--os-text-4)' }} />
        </button>
      ))}
    </div>
  )
}

function GoalRow({ g }: { g: Goal }) {
  const col = g.status === 'DONE' ? GREEN : g.status === 'ON_TRACK' ? BLUE : AMBER
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px dashed var(--os-border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--os-text-2)', fontWeight: 600 }}>{g.title}</div>
      </div>
      <div style={{ width: 80, height: 5, background: 'var(--os-surface-3)', borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${g.progress}%`, background: col, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: col, minWidth: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{g.progress}%</span>
      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: col + '14', color: col }}>
        {g.status === 'DONE' ? 'Done' : g.status === 'ON_TRACK' ? 'On Track' : 'At Risk'}
      </span>
    </div>
  )
}

function ReviewCard({ r }: { r: ReviewRecord }) {
  const [expanded, setExpanded] = useState(false)
  const cycleCfg = CYCLE_CFG[r.cycle]
  const statusColor = r.status === 'COMPLETE' ? GREEN : r.status === 'IN_REVIEW' ? AMBER : SLATE
  const TrendIcon = r.trend === 'UP' ? TrendingUp : r.trend === 'DOWN' ? TrendingDown : Minus
  const trendColor = r.trend === 'UP' ? GREEN : r.trend === 'DOWN' ? RED : SLATE

  return (
    <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderTop: `3px solid ${ratingColor(r.managerRating)}`, borderRadius: 12 }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: PURPLE + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: PURPLE, flexShrink: 0 }}>
          {r.employeeName.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--os-text-1)' }}>{r.employeeName}</span>
            <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: statusColor + '12', color: statusColor }}>
              {r.status === 'COMPLETE' ? 'Complete' : r.status === 'IN_REVIEW' ? 'In Review' : 'Draft'}
            </span>
            <TrendIcon style={{ width: 12, height: 12, color: trendColor }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--os-text-3)', marginTop: 2 }}>{r.role} · {r.department} · {cycleCfg.label}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 9, color: SLATE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Manager Rating</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <StarRating value={r.managerRating} readonly />
                <span style={{ fontSize: 9, color: ratingColor(r.managerRating), fontWeight: 700 }}>{RATING_LABEL[r.managerRating]}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: SLATE, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Self Rating</div>
              <StarRating value={r.selfRating} readonly />
            </div>
          </div>
        </div>
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: SLATE }}>
          {expanded ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />}
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--os-border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Goals */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SLATE, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Target style={{ width: 9, height: 9 }} /> Goals
            </div>
            {r.goals.map(g => <GoalRow key={g.id} g={g} />)}
          </div>

          {/* Strengths */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: GREEN, marginBottom: 6 }}>Strengths</div>
              {r.strengths.map((s, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--os-text-2)', padding: '3px 0', display: 'flex', gap: 6 }}>
                  <Check style={{ width: 10, height: 10, color: GREEN, flexShrink: 0, marginTop: 1 }} />
                  {s}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: AMBER, marginBottom: 6 }}>Development Areas</div>
              {r.development.map((d, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--os-text-2)', padding: '3px 0', display: 'flex', gap: 6 }}>
                  <TrendingUp style={{ width: 10, height: 10, color: AMBER, flexShrink: 0, marginTop: 1 }} />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PerformanceReviews() {
  const [reviews] = useState<ReviewRecord[]>(SEED_REVIEWS)
  const [cycle, setCycle]       = useState<ReviewCycle | 'ALL'>('Q3-2026')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const filtered = useMemo(() => reviews.filter(r => {
    const cycleOk  = cycle === 'ALL' || r.cycle === cycle
    const statusOk = statusFilter === 'ALL' || r.status === statusFilter
    return cycleOk && statusOk
  }), [reviews, cycle, statusFilter])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.managerRating, 0) / reviews.length).toFixed(1)
    : '—'
  const complete  = reviews.filter(r => r.status === 'COMPLETE').length
  const inReview  = reviews.filter(r => r.status === 'IN_REVIEW').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--os-text-1)', margin: 0 }}>Performance Reviews</h2>
        <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '3px 0 0' }}>Cycle-based reviews · goals · development</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Reviews',   value: String(reviews.length), col: BLUE   },
          { label: 'Complete',        value: String(complete),       col: GREEN  },
          { label: 'In Review',       value: String(inReview),       col: AMBER  },
          { label: 'Avg Rating',      value: `${avgRating}/5`,       col: GOLD   },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderLeft: `3px solid ${k.col}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.col, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: SLATE }}>Cycle:</span>
        {(['ALL', 'Q3-2026', 'Q2-2026', 'Q1-2026', 'ANNUAL-2025'] as const).map(c => (
          <button key={c} onClick={() => setCycle(c)} style={{
            padding: '5px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
            background: cycle === c ? PURPLE + '16' : 'var(--os-surface-3)',
            color: cycle === c ? PURPLE : 'var(--os-text-3)',
            border: `1px solid ${cycle === c ? PURPLE + '35' : 'var(--os-border)'}`,
          }}>{c === 'ALL' ? 'All Cycles' : CYCLE_CFG[c]?.label ?? c}</button>
        ))}
        <div style={{ flex: 1 }} />
        {['ALL', 'DRAFT', 'IN_REVIEW', 'COMPLETE'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: '5px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
            background: statusFilter === s ? BLUE + '14' : 'var(--os-surface-3)',
            color: statusFilter === s ? BLUE : 'var(--os-text-3)',
            border: `1px solid ${statusFilter === s ? BLUE + '30' : 'var(--os-border)'}`,
          }}>{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</button>
        ))}
      </div>

      {/* Review cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => <ReviewCard key={r.id} r={r} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 14 }}>
          <MessageSquare style={{ width: 32, height: 32, color: SLATE, margin: '0 auto 10px' }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-2)', margin: 0 }}>No reviews for this selection</p>
        </div>
      )}
    </div>
  )
}
