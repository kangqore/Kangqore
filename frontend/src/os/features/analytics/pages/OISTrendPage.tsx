import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Target, Zap, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

// ── Types matching actual gate8 backend responses ─────────────────────────────

interface OISSnapshot {
  id:            string
  oisScore:      number
  decisionScore?: number
  workflowScore?: number
  triggeredBy?:  string
  label?:        string
  createdAt:     string
}

interface PillarDetail {
  score:   number
  metrics: Record<string, unknown>
}

interface LiveGate8 {
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
    decision:   PillarDetail
    workflow:   PillarDetail
    ai:         PillarDetail
    enterprise: PillarDetail
    goal:       PillarDetail
    learning:   PillarDetail
    business:   PillarDetail
    trust:      PillarDetail
    adoption:   PillarDetail
  }
}

interface Forecast {
  currentOis:    number
  forecastOis:   number
  forecastDelta: number
  confidencePct: number
  horizon:       number
  method:        string
}

interface Recommendation {
  id:           string
  pillar:       string
  metric:       string
  action:       string
  currentValue: string
  targetValue:  string
  oisImpact:    number
  effort:       'LOW' | 'MEDIUM' | 'HIGH'
  priority:     number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeGrade(score: number): string {
  if (score >= 93) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 87) return 'A-'
  if (score >= 83) return 'B+'
  if (score >= 80) return 'B'
  if (score >= 77) return 'B-'
  if (score >= 73) return 'C+'
  if (score >= 70) return 'C'
  if (score >= 67) return 'C-'
  if (score >= 60) return 'D'
  return 'F'
}

const GRADE_COLOR: Record<string, string> = {
  'A+': '#10b981', 'A': '#10b981', 'A-': '#10b981',
  'B+': '#14b8a6', 'B': '#14b8a6', 'B-': '#14b8a6',
  'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#f59e0b',
  'D':  '#f97316', 'F': '#ef4444',
}

const EFFORT_COLOR = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' } as const

// ── Demo fallback ─────────────────────────────────────────────────────────────

const DEMO_HISTORY: OISSnapshot[] = Array.from({ length: 12 }, (_, i) => ({
  id: `snap-${i}`,
  oisScore:    72 + Math.round((i / 11) * 7 + (Math.random() * 2 - 1)),
  triggeredBy: i % 3 === 0 ? 'MANUAL' : 'AUTO',
  createdAt:   new Date(Date.now() - (11 - i) * 7 * 24 * 3600000).toISOString(),
}))

const DEMO_LIVE: LiveGate8 = {
  oisScore: 78.9, decisionScore: 85.2, workflowScore: 79.4,
  aiScore: 88.1, enterpriseScore: 74.3, goalScore: 81.0,
  learningScore: 72.5, businessScore: 69.8, trustScore: 91.2, adoptionScore: 65.0,
  pillars: {
    decision:   { score: 85.2, metrics: {} },
    workflow:   { score: 79.4, metrics: {} },
    ai:         { score: 88.1, metrics: {} },
    enterprise: { score: 74.3, metrics: {} },
    goal:       { score: 81.0, metrics: {} },
    learning:   { score: 72.5, metrics: {} },
    business:   { score: 69.8, metrics: {} },
    trust:      { score: 91.2, metrics: {} },
    adoption:   { score: 65.0, metrics: {} },
  },
}

const DEMO_FORECAST: Forecast = {
  currentOis: 78.9, forecastOis: 81.4, forecastDelta: 2.5,
  confidencePct: 74, horizon: 30, method: 'REGRESSION',
}

const DEMO_RECS: Recommendation[] = [
  { id: '1', pillar: 'Enterprise', metric: 'project close rate', action: 'Close 2 projects in Q3', currentValue: '68%', targetValue: '85%', oisImpact: 3.5, effort: 'MEDIUM', priority: 1 },
  { id: '2', pillar: 'Decision',   metric: 'pending decisions',  action: 'Resolve 4 pending KIMMP decisions', currentValue: '4 open', targetValue: '0', oisImpact: 2.1, effort: 'LOW', priority: 2 },
  { id: '3', pillar: 'Business',   metric: 'pipeline depth',     action: 'Advance 3 proposals to final stage', currentValue: '1 final', targetValue: '4', oisImpact: 1.8, effort: 'HIGH', priority: 3 },
]

// ── Sparkline ─────────────────────────────────────────────────────────────────

function SparkLine({ data }: { data: OISSnapshot[] }) {
  if (data.length < 2) return null
  const vals = data.map(d => d.oisScore)
  const min  = Math.min(...vals) - 2
  const max  = Math.max(...vals) + 2
  const range = max - min || 1
  const W = 900, H = 100

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d.oisScore - min) / range) * H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  const last = data[data.length - 1]
  const lastX = W
  const lastY = H - ((last.oisScore - min) / range) * H
  const areaClose = `${W},${H} 0,${H}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 80 }}>
      <defs>
        <linearGradient id="oisGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#14b8a6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${areaClose}`} fill="url(#oisGrad)" />
      <polyline points={pts} fill="none" stroke="#14b8a6" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={5} fill="#14b8a6" stroke="#14b8a628" strokeWidth={8} />
    </svg>
  )
}

function GradePin({ grade }: { grade: string }) {
  const color = GRADE_COLOR[grade] ?? '#8896c0'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 36, height: 36, borderRadius: 8,
      background: color + '22', border: `1.5px solid ${color}`,
      color, fontWeight: 800, fontSize: 15,
    }}>
      {grade}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function OISTrendPage() {
  const { data: history, isLoading: loadH } = useQuery<OISSnapshot[]>({
    queryKey: ['gate8-history'],
    queryFn:  () => api.get('/admin/gate8/history?limit=30').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: live, isLoading: loadL } = useQuery<LiveGate8>({
    queryKey: ['gate8-live'],
    queryFn:  () => api.get('/admin/gate8/score').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const { data: forecast } = useQuery<Forecast>({
    queryKey: ['gate8-forecast'],
    queryFn:  () => api.get('/admin/gate8/forecast').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 10,
  })

  const { data: recs } = useQuery<Recommendation[]>({
    queryKey: ['gate8-recommendations'],
    queryFn:  () => api.get('/admin/gate8/recommendations').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 10,
  })

  const snapshots  = (history  ?? (isDemo() ? DEMO_HISTORY  : [])).slice().reverse()
  const liveOIS    = live      ?? (isDemo() ? DEMO_LIVE     : null)
  const fcast      = forecast  ?? (isDemo() ? DEMO_FORECAST : null)
  const rList      = recs      ?? (isDemo() ? DEMO_RECS     : [])
  const isLoading  = !isDemo() && (loadH || loadL)

  const currentScore = liveOIS?.oisScore ?? snapshots[snapshots.length - 1]?.oisScore ?? 0
  const grade        = computeGrade(currentScore)
  const firstScore   = snapshots[0]?.oisScore ?? currentScore
  const netChange    = +(currentScore - firstScore).toFixed(1)

  // Pillar breakdown from live gate8 result
  const pillarBreakdown = liveOIS?.pillars
    ? Object.entries(liveOIS.pillars).map(([key, p]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        score: p.score,
      })).sort((a, b) => b.score - a.score)
    : []

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading OIS history…
        </div>
      )}

      {/* Top KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Live OIS Score</p>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold" style={{ color: '#14b8a6' }}>
              {currentScore.toFixed(1)}
            </span>
            <GradePin grade={grade} />
          </div>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Operational Intelligence Score™</p>
        </div>

        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Net Change</p>
          <span className={`text-2xl font-extrabold ${netChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netChange >= 0 ? '+' : ''}{netChange}
          </span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">pts over {snapshots.length} snapshots</p>
        </div>

        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">{fcast?.horizon ?? 30}-Day Forecast</p>
          {fcast ? (
            <>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-extrabold text-blue-400">{fcast.forecastOis.toFixed(1)}</span>
                <span className={`text-sm font-semibold pb-0.5 ${fcast.forecastDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {fcast.forecastDelta >= 0 ? '+' : ''}{fcast.forecastDelta.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-[var(--os-text-3)] mt-1">
                {fcast.confidencePct}% confidence · {fcast.method}
              </p>
            </>
          ) : (
            <span className="text-[var(--os-text-3)] text-sm">Computing…</span>
          )}
        </div>

        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Snapshots</p>
          <span className="text-2xl font-extrabold text-[var(--os-text-1)]">{snapshots.length}</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Manual · post-deploy · auto</p>
        </div>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            OIS Trajectory
          </CardTitle>
        </CardHeader>
        <CardBody>
          {snapshots.length >= 2 ? (
            <>
              <SparkLine data={snapshots} />
              <div className="flex justify-between text-xs text-[var(--os-text-3)] mt-1 px-0.5 font-mono">
                {[snapshots[0], snapshots[Math.floor(snapshots.length / 2)], snapshots[snapshots.length - 1]]
                  .filter(Boolean)
                  .map((s, i) => (
                    <span key={i}>
                      {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--os-text-3)] py-4 text-center">
              No snapshots yet — trigger a Gate 8 evaluation to start the trend.
            </p>
          )}
        </CardBody>
      </Card>

      {/* Snapshot history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            Snapshot History
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 px-5 py-2 text-xs font-semibold text-[var(--os-text-3)] uppercase tracking-wider min-w-[480px]">
              <span>Date</span><span>OIS Score</span><span>Grade</span><span>Trigger</span>
            </div>
            {snapshots.slice(-10).reverse().map(snap => {
              const g = computeGrade(snap.oisScore)
              return (
                <div key={snap.id} className="grid grid-cols-4 px-5 py-3.5 hover:bg-[var(--os-bg2)] transition-colors border-t border-[var(--os-border)] min-w-[480px]">
                  <span className="text-sm text-[var(--os-text-2)]">
                    {new Date(snap.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </span>
                  <span className="text-sm font-bold font-mono" style={{ color: '#14b8a6' }}>
                    {snap.oisScore.toFixed(1)}
                  </span>
                  <GradePin grade={g} />
                  <Badge variant="ghost" size="sm">{snap.triggeredBy ?? 'MANUAL'}</Badge>
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {/* KIMMP Recommendations */}
      {rList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              KIMMP Recommendations
              <span className="text-xs font-normal text-[var(--os-text-3)]">— Gate 8.2</span>
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[var(--os-border)]">
              {[...rList].sort((a, b) => a.priority - b.priority).slice(0, 6).map(rec => (
                <div key={rec.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{rec.pillar}</span>
                      <Badge size="sm" variant={EFFORT_COLOR[rec.effort] ?? 'ghost'}>{rec.effort}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-[var(--os-text-1)]">{rec.action}</p>
                    <p className="text-xs text-[var(--os-text-3)] mt-0.5">
                      {rec.metric} · {rec.currentValue} → {rec.targetValue}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-green-500">+{rec.oisImpact.toFixed(1)}</span>
                    <p className="text-xs text-[var(--os-text-3)]">OIS pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pillar breakdown (live) */}
      {pillarBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" />
              Pillar Breakdown — Live
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {pillarBreakdown.map(({ label, score }) => {
              const color = score >= 85 ? '#10b981' : score >= 72 ? '#f59e0b' : '#ef4444'
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[var(--os-text-1)]">{label}</span>
                    <span className="font-bold font-mono text-[var(--os-text-1)]">{score.toFixed(1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
