// Track C — Decision Engine UI
// Strategic question → KIMMP structured decision → admin selects option → outcome recorded

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Scale, ChevronDown, ChevronUp, CheckCircle2, Clock,
  ThumbsUp, AlertTriangle, TrendingUp, Zap, BookOpen,
  ChevronRight, RefreshCw, Send, Loader2, History,
  Target, Lightbulb, BarChart3,
} from 'lucide-react'
import { apiFetch } from '../../../lib/api'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DecisionOption {
  label:          string
  recommendation: string
  pros:           string[]
  cons:           string[]
  roi?:           string
  confidence:     number
}

interface Evidence {
  source:  string
  type:    string
  snippet: string
}

interface StrategicDecision {
  id:             string
  question:       string
  situation:      string
  options:        DecisionOption[]
  recommendation: string
  evidence:       Evidence[]
  confidence:     number
  agentsMixed:    string[]
  simulation?:    any
  selected?:      string
  selectedBy?:    string
  outcome?:       string
  createdAt:      string
  resolvedAt?:    string
}

const SIM_TYPES = [
  { value: '',                  label: 'No simulation'       },
  { value: 'REVENUE_IMPACT',    label: 'Revenue Impact'      },
  { value: 'CAPACITY_IMPACT',   label: 'Capacity Impact'     },
  { value: 'RISK_PROPAGATION',  label: 'Risk Propagation'    },
  { value: 'DEPENDENCY_CHAIN',  label: 'Dependency Chain'    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function ConfidenceRing({ value, size = 40 }: { value: number; size?: number }) {
  const r = size / 2 - 4
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  const color = pct >= 70 ? '#00c875' : pct >= 45 ? '#fdab3d' : '#e2445c'

  return (
    <svg width={size} height={size} className="rotate-[-90deg] shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--os-border)" strokeWidth={3} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="rotate-90" style={{ transformOrigin: 'center', fontSize: 10, fontWeight: 700, fill: color, transform: 'rotate(90deg)' }}>
        {pct}
      </text>
    </svg>
  )
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function effectColor(effect: string) {
  if (effect === 'DENY')             return '#e2445c'
  if (effect === 'REQUIRE_APPROVAL') return '#fdab3d'
  if (effect === 'NOTIFY')           return '#579bfc'
  return '#00c875'
}

// ── Option Card ───────────────────────────────────────────────────────────────

function OptionCard({
  opt, isSelected, isRecommended, onSelect, canSelect,
}: {
  opt: DecisionOption
  isSelected: boolean
  isRecommended: boolean
  onSelect: () => void
  canSelect: boolean
}) {
  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all relative',
      isSelected   ? 'border-[#00c875] bg-[#00c875]/5'
      : isRecommended ? 'border-[#579bfc]/50 bg-[#579bfc]/5'
      : 'border-[var(--os-border)] bg-[var(--os-surface-0)]'
    )}>
      {isRecommended && !isSelected && (
        <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#579bfc] text-white">
          KIMMP recommends
        </span>
      )}
      {isSelected && (
        <span className="absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00c875] text-white flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" />Selected
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        <ConfidenceRing value={opt.confidence} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--os-text-1)]">{opt.label}</p>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5 leading-relaxed">{opt.recommendation}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] font-bold text-[#00c875] mb-1 flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />PROS
          </p>
          <ul className="space-y-1">
            {opt.pros.map((p, i) => (
              <li key={i} className="text-[11px] text-[var(--os-text-2)] flex items-start gap-1">
                <span className="text-[#00c875] mt-0.5 shrink-0">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#e2445c] mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />CONS
          </p>
          <ul className="space-y-1">
            {opt.cons.map((c, i) => (
              <li key={i} className="text-[11px] text-[var(--os-text-2)] flex items-start gap-1">
                <span className="text-[#e2445c] mt-0.5 shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {opt.roi && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-[var(--os-text-2)]">
          <TrendingUp className="w-3.5 h-3.5 text-[#fdab3d]" />
          <span className="font-medium text-[var(--os-text-1)]">ROI:</span>
          {opt.roi}
        </div>
      )}

      {canSelect && !isSelected && (
        <button
          onClick={onSelect}
          className={cn(
            'w-full mt-1 py-1.5 text-xs font-medium rounded-lg transition-all',
            isRecommended
              ? 'bg-[#579bfc] text-white hover:bg-[#579bfc]/90'
              : 'bg-[var(--os-card)] border border-[var(--os-border)] text-[var(--os-text-1)] hover:border-[#579bfc]/50'
          )}
        >
          Select this option
        </button>
      )}
    </div>
  )
}

// ── Result View ───────────────────────────────────────────────────────────────

function DecisionResult({ d, onRefresh }: { d: StrategicDecision; onRefresh: () => void }) {
  const qc = useQueryClient()
  const [showEvidence, setShowEvidence]   = useState(false)
  const [showSim,      setShowSim]        = useState(false)
  const [outcome,      setOutcome]        = useState(d.outcome ?? '')
  const [recordingOut, setRecordingOut]   = useState(false)

  const selectMut = useMutation({
    mutationFn: (label: string) =>
      apiFetch(`/admin/kangqore-immp/decisions/${d.id}/select`, { method: 'POST', body: JSON.stringify({ label }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['decisions'] }); onRefresh() },
  })

  const outcomeMut = useMutation({
    mutationFn: () =>
      apiFetch(`/admin/kangqore-immp/decisions/${d.id}/outcome`, { method: 'POST', body: JSON.stringify({ outcome }) }),
    onSuccess: () => { setRecordingOut(false); qc.invalidateQueries({ queryKey: ['decisions'] }); onRefresh() },
  })

  const recommendedLabel = d.recommendation?.split(/[.,:]/)[0]?.trim() ?? ''

  return (
    <div className="space-y-4">
      {/* Situation */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#579bfc]" />
          <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider">Current Situation</p>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: d.confidence >= 70 ? '#00c87520' : d.confidence >= 45 ? '#fdab3d20' : '#e2445c20',
                     color: d.confidence >= 70 ? '#00c875' : d.confidence >= 45 ? '#fdab3d' : '#e2445c' }}>
            {d.confidence}% confidence
          </span>
        </div>
        <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{d.situation}</p>
        {d.agentsMixed?.length > 0 && (
          <p className="text-[10px] text-[var(--os-text-2)] mt-2">
            Agents: {d.agentsMixed.join(' · ')}
          </p>
        )}
      </div>

      {/* KIMMP Recommendation banner */}
      <div className="rounded-xl border border-[#579bfc]/30 bg-[#579bfc]/5 p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#579bfc] flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#579bfc] uppercase tracking-wider mb-1">KIMMP Recommends</p>
          <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{d.recommendation}</p>
        </div>
      </div>

      {/* Options grid */}
      <div>
        <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5" />Options ({d.options.length})
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {d.options.map(opt => (
            <OptionCard
              key={opt.label}
              opt={opt}
              isSelected={d.selected === opt.label}
              isRecommended={recommendedLabel.toLowerCase().includes(opt.label.toLowerCase())}
              canSelect={!d.selected}
              onSelect={() => selectMut.mutate(opt.label)}
            />
          ))}
        </div>
        {selectMut.isPending && (
          <p className="text-xs text-[var(--os-text-2)] mt-2 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />Recording selection…
          </p>
        )}
      </div>

      {/* Outcome recorder */}
      {d.selected && (
        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] p-4">
          <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#fdab3d]" />Outcome
          </p>
          {d.outcome ? (
            <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{d.outcome}</p>
          ) : recordingOut ? (
            <div className="space-y-2">
              <textarea
                value={outcome}
                onChange={e => setOutcome(e.target.value)}
                rows={2}
                placeholder="What actually happened after selecting this option?"
                className="w-full px-3 py-2 text-sm bg-[var(--os-card)] border border-[var(--os-border)] rounded-lg text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] resize-none outline-none focus:border-[#579bfc]/50"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => outcomeMut.mutate()}
                  disabled={!outcome.trim() || outcomeMut.isPending}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[#579bfc] text-white font-medium disabled:opacity-50"
                >
                  {outcomeMut.isPending ? 'Saving…' : 'Record outcome'}
                </button>
                <button onClick={() => setRecordingOut(false)} className="px-3 py-1.5 text-xs rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)]">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setRecordingOut(true)}
              className="text-xs text-[#579bfc] hover:text-[var(--os-text-1)] transition-colors"
            >
              + Record what happened
            </button>
          )}
        </div>
      )}

      {/* Simulation preview */}
      {d.simulation && (
        <div>
          <button
            onClick={() => setShowSim(!showSim)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            {showSim ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Simulation Preview
          </button>
          {showSim && (
            <div className="mt-2 rounded-xl border border-[#fdab3d]/30 bg-[#fdab3d]/5 p-4">
              <pre className="text-xs text-[var(--os-text-1)] whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-48">
                {JSON.stringify(d.simulation, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Evidence */}
      {d.evidence?.length > 0 && (
        <div>
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            Evidence ({d.evidence.length} sources)
          </button>
          {showEvidence && (
            <div className="mt-2 space-y-1.5">
              {d.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <BookOpen className="w-3 h-3 text-[var(--os-text-2)] shrink-0 mt-0.5" />
                  <span className="text-[var(--os-text-2)] shrink-0 font-medium">{ev.source}</span>
                  <span className="text-[var(--os-text-2)]">·</span>
                  <span className="text-[var(--os-text-1)]">{ev.snippet}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── History Item ──────────────────────────────────────────────────────────────

function HistoryItem({ d, isActive, onClick }: { d: StrategicDecision; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-all border text-xs',
        isActive
          ? 'border-[#579bfc]/40 bg-[#579bfc]/5'
          : 'border-[var(--os-border)] hover:border-[var(--os-border)] hover:bg-[var(--os-surface-0)]'
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          'w-1.5 h-1.5 rounded-full mt-1 shrink-0',
          d.selected ? 'bg-[#00c875]' : 'bg-[#579bfc]'
        )} />
        <div className="flex-1 min-w-0">
          <p className="text-[var(--os-text-1)] font-medium line-clamp-2 leading-relaxed">{d.question}</p>
          <p className="text-[var(--os-text-2)] mt-1">{fmt(d.createdAt)}</p>
          {d.selected && (
            <p className="text-[#00c875] mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />Selected: {d.selected}
            </p>
          )}
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)] shrink-0 mt-0.5" />
      </div>
    </button>
  )
}

// ── Main Panel ────────────────────────────────────────────────────────────────

export function DecisionPanel() {
  const [question,    setQuestion]    = useState('')
  const [options,     setOptions]     = useState('')
  const [simType,     setSimType]     = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [activeId,    setActiveId]    = useState<string | null>(null)

  const historyQuery = useQuery<{ items: StrategicDecision[] }>({
    queryKey: ['decisions'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/decisions?limit=20'),
    refetchInterval: 60_000,
  })

  const items = historyQuery.data?.items ?? []
  const activeDecision = activeId
    ? items.find(d => d.id === activeId) ?? null
    : null

  const askMut = useMutation({
    mutationFn: () =>
      apiFetch<StrategicDecision>('/admin/kangqore-immp/decisions', {
        method: 'POST',
        body:   JSON.stringify({
          question: question.trim(),
          options:  options.trim() ? options.split(',').map(s => s.trim()).filter(Boolean) : undefined,
          simulationType: simType || undefined,
        }),
      }),
    onSuccess: (result) => {
      historyQuery.refetch()
      setActiveId(result.id)
      setQuestion('')
      setOptions('')
      setSimType('')
    },
  })

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden"
      style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>

      {/* Panel header */}
      <div className="px-6 py-4 border-b border-[var(--os-border)] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2564ea)' }}>
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--os-text-1)]">Decision Engine</h3>
          <p className="text-[11px] text-[var(--os-text-2)]">Ask a strategic question — KIMMP analyses context and presents structured options</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={cn(
            'ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all',
            showHistory
              ? 'border-[#579bfc]/40 bg-[#579bfc]/10 text-[#579bfc]'
              : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
          )}
        >
          <History className="w-3.5 h-3.5" />
          History {items.length > 0 && `(${items.length})`}
        </button>
      </div>

      <div className="flex min-h-0">

        {/* Left — history sidebar */}
        {showHistory && (
          <div className="w-64 shrink-0 border-r border-[var(--os-border)] p-3 space-y-1.5 overflow-y-auto max-h-[600px]">
            <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider px-1 mb-2">Past Decisions</p>
            {items.length === 0 && (
              <p className="text-xs text-[var(--os-text-2)] px-1 py-4 text-center">No decisions yet</p>
            )}
            {items.map(d => (
              <HistoryItem
                key={d.id}
                d={d}
                isActive={d.id === activeId}
                onClick={() => setActiveId(d.id === activeId ? null : d.id)}
              />
            ))}
          </div>
        )}

        {/* Right — main area */}
        <div className="flex-1 min-w-0 p-6 space-y-5">

          {/* Question form */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={3}
                placeholder="Ask a strategic question… e.g. 'Should we expand into the UK market this quarter?' or 'Which of these two clients should we prioritise for renewal?'"
                className="w-full px-4 py-3 text-sm bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-xl text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] resize-none outline-none focus:border-[#579bfc]/50 transition-colors pr-12"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && question.trim() && !askMut.isPending) askMut.mutate() }}
              />
              {question.trim() && (
                <button
                  onClick={() => askMut.mutate()}
                  disabled={askMut.isPending}
                  className="absolute right-3 bottom-3 w-7 h-7 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center hover:bg-[#7c3aed]/90 disabled:opacity-50 transition-colors"
                >
                  {askMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Advanced options row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider block mb-1">Options (comma-separated)</label>
                <input
                  value={options}
                  onChange={e => setOptions(e.target.value)}
                  placeholder="e.g. Expand now, Wait 6 months, Partner first"
                  className="w-full px-3 py-2 text-xs bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none focus:border-[#579bfc]/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider block mb-1">Run Simulation</label>
                <select
                  value={simType}
                  onChange={e => setSimType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg text-[var(--os-text-1)] outline-none focus:border-[#579bfc]/50"
                >
                  {SIM_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-[var(--os-text-2)]">⌘ + Enter to submit</p>
              <button
                onClick={() => askMut.mutate()}
                disabled={!question.trim() || askMut.isPending}
                className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl font-medium bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90 disabled:opacity-50 transition-all"
              >
                {askMut.isPending
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Thinking…</>
                  : <><Zap className="w-3.5 h-3.5" />Think it through</>
                }
              </button>
            </div>

            {askMut.isError && (
              <p className="text-xs text-[#e2445c]">{String((askMut.error as any)?.message)}</p>
            )}
          </div>

          {/* Loading skeleton */}
          {askMut.isPending && (
            <div className="space-y-3 animate-pulse">
              <div className="h-20 rounded-xl bg-[var(--os-surface-0)]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-36 rounded-xl bg-[var(--os-surface-0)]" />
                <div className="h-36 rounded-xl bg-[var(--os-surface-0)]" />
              </div>
            </div>
          )}

          {/* Active decision result */}
          {activeDecision && !askMut.isPending && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-bold text-[var(--os-text-2)] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#7c3aed]" />Decision Analysis
                </p>
                <span className="text-[10px] text-[var(--os-text-2)] ml-auto">{fmt(activeDecision.createdAt)}</span>
                <button
                  onClick={() => historyQuery.refetch()}
                  className="w-5 h-5 flex items-center justify-center text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-semibold text-[var(--os-text-1)] mb-4 leading-relaxed">
                "{activeDecision.question}"
              </p>
              <DecisionResult d={activeDecision} onRefresh={() => historyQuery.refetch()} />
            </div>
          )}

          {/* Empty state */}
          {!activeDecision && !askMut.isPending && (
            <div className="rounded-xl border border-dashed border-[var(--os-border)] p-10 text-center">
              <Scale className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--os-text-1)] mb-1">No active analysis</p>
              <p className="text-xs text-[var(--os-text-2)]">
                Ask a strategic question to get a structured decision with options, pros, cons, and ROI estimates.
              </p>
              {items.length > 0 && (
                <button
                  onClick={() => { setActiveId(items[0].id); setShowHistory(true) }}
                  className="mt-4 text-xs text-[#579bfc] hover:text-[var(--os-text-1)] transition-colors"
                >
                  View last decision →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
