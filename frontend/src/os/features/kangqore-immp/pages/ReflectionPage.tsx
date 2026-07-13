import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import {
  Activity, BookOpen, Brain, Building2, ChevronDown, ChevronUp,
  Clock, FileText, Flame, Loader2, RefreshCw, Scroll,
  Star, Target, TrendingDown, TrendingUp, Zap,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

interface OIIDimension {
  name:   string
  score:  number
  weight: number
  raw:    string
}

interface OIIResult {
  score:      number
  grade:      'A' | 'B' | 'C' | 'D' | 'F'
  dimensions: OIIDimension[]
  computedAt: string
}

interface CoigTrend {
  baseline:  { date: string; ois: number } | null
  current:   number | null
  coig:      number | null
  snapshots: { date: string; ois: number; coig: number; label: string }[]
  velocity:  number | null
  projected: { ois90d: number | null; coig90d: number | null }
}

interface ExecutiveReview {
  id:           string
  reviewType:   string
  weekOf:       string
  oisStart:     number | null
  oisEnd:       number | null
  etiStart:     number | null
  etiEnd:       number | null
  coigDelta:    number | null
  decisionCount: number
  outcomeCount:  number
  lessonCount:   number
  patternCount:  number
  content:       string
  createdAt:     string
}

interface Retrospective {
  id:                string
  scope:             string
  dateFrom:          string
  dateTo:            string
  reflection:        string
  lessonsRaised:     string[]
  patternsConfirmed: string[]
  createdAt:         string
}

interface EnterpriseLetter {
  id:        string
  type:      string
  period:    string
  content:   string
  metrics:   Record<string, any>
  createdAt: string
}

interface Scorecard {
  period:              string
  periodStart:         string
  periodEnd:           string
  decisionsMade:       number
  decisionsWithOutcome: number
  completionRate:      number
  lessonsCreated:      number
  insightsSynthesised: number
  patternsConfirmed:   number
  principlesRaised:    number
  automationRate:      number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(grade: string) {
  if (grade === 'A') return 'text-green-400'
  if (grade === 'B') return 'text-emerald-400'
  if (grade === 'C') return 'text-yellow-400'
  if (grade === 'D') return 'text-orange-400'
  return 'text-red-400'
}

function deltaLabel(v: number | null) {
  if (v == null) return '—'
  return `${v >= 0 ? '+' : ''}${v}`
}

function ScoreBar({ score, color = 'bg-violet-500' }: { score: number; color?: string }) {
  return (
    <div className="relative h-1.5 w-full rounded-full bg-os-surface-3">
      <div
        className={`absolute left-0 top-0 h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${Math.min(100, score)}%` }}
      />
    </div>
  )
}

// ── OII Overview tab ─────────────────────────────────────────────────────────

function OIITab() {
  const { data: oii, isLoading } = useQuery<OIIResult>({
    queryKey: ['oii'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/oii'),
    staleTime: 5 * 60_000,
  })

  const { data: oiiHistory } = useQuery<{ history: { score: number; grade: string; computedAt: string }[] }>({
    queryKey: ['oii-history'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/oii/history?limit=30'),
    staleTime: 10 * 60_000,
  })

  const { data: coig, isLoading: coigLoading } = useQuery<CoigTrend>({
    queryKey: ['coig-trend'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/coig/trend'),
    staleTime: 5 * 60_000,
  })

  if (isLoading || coigLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-os-4">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* OII Hero */}
      <div className="rounded-xl border border-os bg-os-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-os-4">
              Organizational Intelligence Index
            </p>
            <div className="mt-1 flex items-end gap-3">
              <span className="text-6xl font-black text-os-1">{oii?.score ?? '—'}</span>
              <span className={`mb-2 text-3xl font-bold ${gradeColor(oii?.grade ?? 'F')}`}>
                {oii?.grade ?? '—'}
              </span>
            </div>
            <p className="mt-1 text-xs text-os-4">
              Computed {oii ? new Date(oii.computedAt).toLocaleString() : '—'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-os-4">COIG</p>
            <p className="text-3xl font-bold text-os-1">{deltaLabel(coig?.coig ?? null)}</p>
            <p className="text-xs text-os-4">vs baseline OIS {coig?.baseline?.ois ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* OII History sparkline */}
      {oiiHistory && oiiHistory.history.length > 1 && (() => {
        const pts = [...oiiHistory.history].reverse()
        const min = Math.min(...pts.map(p => p.score))
        const max = Math.max(...pts.map(p => p.score))
        const range = max - min || 1
        const W = 100, H = 32
        const x = (i: number) => (i / (pts.length - 1)) * W
        const y = (s: number) => H - ((s - min) / range) * H
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ')
        const first = pts[0], last = pts[pts.length - 1]
        const delta = last.score - first.score
        return (
          <div className="rounded-xl border border-os bg-os-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-os-4">OII History</p>
              <span className={`text-xs font-bold tabular-nums ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {delta >= 0 ? '+' : ''}{delta} last {pts.length} snapshots
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 48 }}>
              <path d={`${d} L${W},${H} L0,${H} Z`} fill="rgba(255,255,255,0.05)" />
              <path d={d} fill="none" stroke={delta >= 0 ? '#10b981' : '#ef4444'} strokeWidth="0.8" />
            </svg>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-os-4">{new Date(first.computedAt).toLocaleDateString()}</span>
              <span className="text-[10px] text-os-4">{new Date(last.computedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )
      })()}

      {/* 9 Dimensions */}
      <div className="rounded-xl border border-os bg-os-card p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-os-4">
          9 Intelligence Dimensions
        </p>
        <div className="space-y-3">
          {(oii?.dimensions ?? []).map(d => (
            <div key={d.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-os-2">{d.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-os-4">{Math.round(d.weight * 100)}% weight</span>
                  <span className="w-8 text-right text-xs font-semibold text-os-1">{d.score}</span>
                </div>
              </div>
              <ScoreBar
                score={d.score}
                color={d.score >= 75 ? 'bg-emerald-500' : d.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
              />
              <p className="mt-0.5 text-[10px] text-os-4">{d.raw}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COIG Trend */}
      {coig && (
        <div className="rounded-xl border border-os bg-os-card p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-os-4">
            COIG Velocity
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-os-1">{coig.current ?? '—'}</p>
              <p className="text-[10px] text-os-4">Current OIS</p>
            </div>
            <div>
              <p className={`text-lg font-bold ${(coig.velocity ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {coig.velocity != null ? `${coig.velocity >= 0 ? '+' : ''}${coig.velocity}/wk` : '—'}
              </p>
              <p className="text-[10px] text-os-4">Velocity</p>
            </div>
            <div>
              <p className="text-lg font-bold text-violet-400">{coig.projected.ois90d ?? '—'}</p>
              <p className="text-[10px] text-os-4">OIS 90d projection</p>
            </div>
          </div>
          {coig.snapshots.length > 0 && (
            <div className="mt-4 space-y-1">
              {coig.snapshots.slice(-5).map(s => (
                <div key={s.date} className="flex items-center justify-between text-xs">
                  <span className="text-os-4">{new Date(s.date).toLocaleDateString()}</span>
                  <span className="text-os-2">{s.label}</span>
                  <span className="font-medium text-os-1">{s.ois}</span>
                  <span className={s.coig >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {deltaLabel(s.coig)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Reviews tab ───────────────────────────────────────────────────────────────

function ReviewsTab() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ reviews: ExecutiveReview[] }>({
    queryKey: ['executive-reviews'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/reviews?limit=12'),
    staleTime: 5 * 60_000,
  })

  const generate = useMutation({
    mutationFn: () => apiFetch('/admin/kangqore-immp/cognition/reviews/generate', { method: 'POST' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['executive-reviews'] }),
  })

  const reviews = data?.reviews ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-os-4">Weekly executive reviews — WAANDA qualitative assessment</p>
        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-os-1 hover:bg-violet-500 disabled:opacity-50"
        >
          {generate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Generate Now
        </button>
      </div>

      {isLoading && (
        <div className="flex h-32 items-center justify-center text-os-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {reviews.length === 0 && !isLoading && (
        <div className="rounded-xl border border-os bg-os-card p-8 text-center text-sm text-os-4">
          No reviews yet — click "Generate Now" to produce the first weekly review
        </div>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="rounded-xl border border-os bg-os-card">
            <button
              className="flex w-full items-center justify-between p-4"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-violet-900/50 p-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-os-1">
                    Week of {new Date(r.weekOf).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-os-4">
                    <span>{r.decisionCount} decisions</span>
                    <span>{r.lessonCount} lessons</span>
                    {r.coigDelta != null && (
                      <span className={r.coigDelta >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        OIS {deltaLabel(r.coigDelta)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {expanded === r.id ? <ChevronUp className="h-4 w-4 text-os-4" /> : <ChevronDown className="h-4 w-4 text-os-4" />}
            </button>

            {expanded === r.id && (
              <div className="border-t border-os-subtle px-4 pb-4 pt-3">
                <div className="grid grid-cols-4 gap-3 text-center mb-4">
                  {[
                    { label: 'Decisions', v: r.decisionCount },
                    { label: 'Outcomes', v: r.outcomeCount },
                    { label: 'Lessons', v: r.lessonCount },
                    { label: 'Patterns', v: r.patternCount },
                  ].map(m => (
                    <div key={m.label} className="rounded-lg bg-os-card p-2">
                      <p className="text-lg font-bold text-os-1">{m.v}</p>
                      <p className="text-[10px] text-os-4">{m.label}</p>
                    </div>
                  ))}
                </div>
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-os-2">{r.content}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Retrospectives tab ────────────────────────────────────────────────────────

function RetrospectivesTab() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ retrospectives: Retrospective[] }>({
    queryKey: ['retrospectives'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/retrospectives?limit=12'),
    staleTime: 5 * 60_000,
  })

  const generate = useMutation({
    mutationFn: () => apiFetch('/admin/kangqore-immp/cognition/retrospectives/weekly', { method: 'POST' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['retrospectives'] }),
  })

  const retros = data?.retrospectives ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-os-4">Weekly + goal retrospectives — what happened vs what was planned</p>
        <button
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-os-1 hover:bg-violet-500 disabled:opacity-50"
        >
          {generate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Generate This Week
        </button>
      </div>

      {isLoading && (
        <div className="flex h-32 items-center justify-center text-os-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {retros.length === 0 && !isLoading && (
        <div className="rounded-xl border border-os bg-os-card p-8 text-center text-sm text-os-4">
          No retrospectives yet — click "Generate This Week" to create the first
        </div>
      )}

      <div className="space-y-3">
        {retros.map(r => (
          <div key={r.id} className="rounded-xl border border-os bg-os-card">
            <button
              className="flex w-full items-center justify-between p-4"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-blue-900/50 p-1.5">
                  <Activity className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-os-1">
                    {r.scope} · {new Date(r.dateFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    {' '}→{' '}
                    {new Date(r.dateTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-os-4">
                    <span>{r.lessonsRaised.length} lessons</span>
                    <span>{r.patternsConfirmed.length} patterns</span>
                  </div>
                </div>
              </div>
              {expanded === r.id ? <ChevronUp className="h-4 w-4 text-os-4" /> : <ChevronDown className="h-4 w-4 text-os-4" />}
            </button>

            {expanded === r.id && (
              <div className="border-t border-os-subtle px-4 pb-4 pt-3 space-y-3">
                <p className="text-xs leading-relaxed text-os-2">{r.reflection}</p>
                {r.lessonsRaised.length > 0 && (
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-os-4">Lessons Raised</p>
                    <ul className="space-y-1">
                      {r.lessonsRaised.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-os-3">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Letters tab ───────────────────────────────────────────────────────────────

const LETTER_TYPES = ['QUARTERLY', 'ANNUAL', 'BOARD', 'INVESTOR'] as const
type LetterType = typeof LETTER_TYPES[number]

function LettersTab() {
  const qc = useQueryClient()
  const [genType, setGenType] = useState<LetterType>('QUARTERLY')
  const [period, setPeriod] = useState(`Q${Math.ceil((new Date().getMonth() + 1) / 3)}-${new Date().getFullYear()}`)
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ letters: EnterpriseLetter[] }>({
    queryKey: ['enterprise-letters'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/letters?limit=10'),
    staleTime: 5 * 60_000,
  })

  const generate = useMutation({
    mutationFn: () => apiFetch('/admin/kangqore-immp/cognition/letters/generate', {
      method: 'POST',
      body:   JSON.stringify({ type: genType, period }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enterprise-letters'] }),
  })

  const letters = data?.letters ?? []

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-os bg-os-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-os-4">
          Generate Enterprise Letter
        </p>
        <div className="flex items-center gap-3">
          <select
            value={genType}
            onChange={e => setGenType(e.target.value as LetterType)}
            className="rounded-lg border border-os bg-os-card px-3 py-1.5 text-xs text-os-1 focus:outline-none"
          >
            {LETTER_TYPES.map(t => (
              <option key={t} value={t} className="bg-gray-900">{t}</option>
            ))}
          </select>
          <input
            value={period}
            onChange={e => setPeriod(e.target.value)}
            placeholder="Q3-2026"
            className="rounded-lg border border-os bg-os-card px-3 py-1.5 text-xs text-os-1 placeholder:text-os-4 focus:outline-none"
          />
          <button
            onClick={() => generate.mutate()}
            disabled={generate.isPending || !period}
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {generate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Scroll className="h-3 w-3" />}
            Generate
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-32 items-center justify-center text-os-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {letters.length === 0 && !isLoading && (
        <div className="rounded-xl border border-os bg-os-card p-8 text-center text-sm text-os-4">
          No letters yet — generate the first one above
        </div>
      )}

      <div className="space-y-3">
        {letters.map(l => (
          <div key={l.id} className="rounded-xl border border-os bg-os-card">
            <button
              className="flex w-full items-center justify-between p-4"
              onClick={() => setExpanded(expanded === l.id ? null : l.id)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-amber-900/50 p-1.5">
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-os-1">{l.type} · {l.period}</p>
                  <p className="text-[10px] text-os-4">
                    {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {l.metrics?.ois != null && ` · OIS ${l.metrics.ois}`}
                    {l.metrics?.coig != null && ` · COIG ${deltaLabel(l.metrics.coig)}`}
                  </p>
                </div>
              </div>
              {expanded === l.id ? <ChevronUp className="h-4 w-4 text-os-4" /> : <ChevronDown className="h-4 w-4 text-os-4" />}
            </button>

            {expanded === l.id && (
              <div className="border-t border-os-subtle px-4 pb-4 pt-3">
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-os-2">{l.content}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Scorecards tab ────────────────────────────────────────────────────────────

function ScorecardsTab() {
  const [window, setWindow] = useState<'week' | 'month' | 'quarter'>('week')

  const { data: sc, isLoading } = useQuery<Scorecard>({
    queryKey: ['scorecard', window],
    queryFn:  () => apiFetch(`/admin/kangqore-immp/cognition/scorecard?window=${window}`),
    staleTime: 2 * 60_000,
  })

  const metrics = sc
    ? [
        { label: 'Decisions Made',       value: sc.decisionsMade,        icon: Target,       color: 'text-blue-400' },
        { label: 'With Outcome',         value: sc.decisionsWithOutcome,  icon: Star,         color: 'text-emerald-400' },
        { label: 'Completion Rate',      value: `${sc.completionRate}%`,  icon: Activity,     color: 'text-violet-400' },
        { label: 'Lessons Created',      value: sc.lessonsCreated,        icon: Brain,        color: 'text-indigo-400' },
        { label: 'Insights Synthesised', value: sc.insightsSynthesised,   icon: Zap,          color: 'text-yellow-400' },
        { label: 'Patterns Confirmed',   value: sc.patternsConfirmed,     icon: TrendingUp,   color: 'text-emerald-400' },
        { label: 'Principles Raised',    value: sc.principlesRaised,      icon: Flame,        color: 'text-orange-400' },
        { label: 'Automation Rate',      value: `${sc.automationRate}%`,  icon: Building2,    color: 'text-cyan-400' },
      ]
    : []

  return (
    <div className="space-y-4">
      {/* Window selector */}
      <div className="flex items-center gap-2">
        {(['week', 'month', 'quarter'] as const).map(w => (
          <button
            key={w}
            onClick={() => setWindow(w)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              window === w ? 'bg-violet-600 text-white' : 'text-os-4 hover:text-os-2'
            }`}
          >
            {w.charAt(0).toUpperCase() + w.slice(1)}
          </button>
        ))}
        {sc && (
          <span className="ml-auto text-[10px] text-os-4">
            {new Date(sc.periodStart).toLocaleDateString('en-IN')} →{' '}
            {new Date(sc.periodEnd).toLocaleDateString('en-IN')}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex h-40 items-center justify-center text-os-4">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map(m => {
            const Icon = m.icon
            return (
              <div key={m.label} className="rounded-xl border border-os bg-os-card p-4">
                <Icon className={`mb-2 h-4 w-4 ${m.color}`} />
                <p className="text-2xl font-bold text-os-1">{m.value}</p>
                <p className="mt-0.5 text-[10px] text-os-4">{m.label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Decision quality breakdown */}
      {sc && (
        <div className="rounded-xl border border-os bg-os-card p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-os-4">
            Execution Quality
          </p>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-os-3">Decision Completion Rate</span>
                <span className="font-medium text-os-1">{sc.completionRate}%</span>
              </div>
              <ScoreBar
                score={sc.completionRate}
                color={sc.completionRate >= 70 ? 'bg-emerald-500' : sc.completionRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-os-3">Automation Rate</span>
                <span className="font-medium text-os-1">{sc.automationRate}%</span>
              </div>
              <ScoreBar
                score={sc.automationRate}
                color={sc.automationRate >= 50 ? 'bg-cyan-500' : 'bg-os-surface-2'}
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-os-3">Learning Rate (lessons / insights)</span>
                <span className="font-medium text-os-1">
                  {sc.lessonsCreated} / {sc.insightsSynthesised}
                </span>
              </div>
              <ScoreBar
                score={sc.insightsSynthesised > 0
                  ? Math.min(100, Math.round((sc.insightsSynthesised / Math.max(1, sc.lessonsCreated)) * 100))
                  : 0}
                color="bg-violet-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',       label: 'Overview',       icon: Brain },
  { id: 'reviews',        label: 'Reviews',        icon: BookOpen },
  { id: 'retrospectives', label: 'Retrospectives', icon: Activity },
  { id: 'letters',        label: 'Letters',        icon: FileText },
  { id: 'scorecards',     label: 'Scorecards',     icon: Target },
] as const

type TabId = typeof TABS[number]['id']

export default function ReflectionPage() {
  const [tab, setTab] = useState<TabId>('overview')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-900/50 p-2.5">
          <Brain className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-os-1">Enterprise Reflection</h1>
          <p className="text-xs text-os-4">Phase 6.9 — OII, COIG evolution, executive reviews, narrative letters</p>
        </div>
      </div>

      {/* Tab strip */}
      <div className="flex items-center gap-1 border-b border-os">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-1.5 text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'border-violet-500 text-os-1'
                  : 'border-transparent text-os-4 hover:text-os-2'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div>
        {tab === 'overview'       && <OIITab />}
        {tab === 'reviews'        && <ReviewsTab />}
        {tab === 'retrospectives' && <RetrospectivesTab />}
        {tab === 'letters'        && <LettersTab />}
        {tab === 'scorecards'     && <ScorecardsTab />}
      </div>
    </div>
  )
}
