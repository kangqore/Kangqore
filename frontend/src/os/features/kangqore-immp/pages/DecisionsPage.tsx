import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { apiFetch } from '@lib/api'
import {
  Brain, ChevronDown, ChevronUp, CheckCircle2, Clock, Loader2,
  AlertTriangle, TrendingUp, Zap, BarChart2, Target, ChevronRight,
} from 'lucide-react'
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

interface StrategicDecision {
  id:             string
  question:       string
  situation:      string
  options:        DecisionOption[]
  recommendation: string
  evidence:       Array<{ source: string; type: string; snippet: string }>
  confidence:     number
  agentsMixed:    string[]
  simulation?:    any
  selected?:      string
  selectedBy?:    string
  outcome?:       string
  createdAt:      string
  resolvedAt?:    string
}

// ── Confidence bar ────────────────────────────────────────────────────────────
function ConfBar({ value, className }: { value: number; className?: string }) {
  const color = value >= 75 ? '#00c875' : value >= 50 ? '#fdab3d' : '#e2445c'
  return (
    <div className={cn('h-1.5 rounded-full bg-[var(--os-surface-0)] overflow-hidden', className)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

// ── Simulation result panel ───────────────────────────────────────────────────
function SimulationCard({ sim }: { sim: any }) {
  if (!sim) return null
  const severityColor: Record<string, string> = {
    CRITICAL: '#e2445c', HIGH: '#fdab3d', MEDIUM: '#579bfc', LOW: '#00c875',
  }
  const color = severityColor[sim.impact?.severity] ?? '#9ca3af'

  return (
    <div className="mt-4 rounded-2xl border p-4 space-y-2" style={{ borderColor: `${color}30`, background: `${color}06` }}>
      <div className="flex items-center gap-2">
        <BarChart2 className="w-3.5 h-3.5" style={{ color }} />
        <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>
          Simulation: {sim.type?.replace(/_/g, ' ')}
        </p>
        <span className="ml-auto text-xs font-bold" style={{ color }}>{sim.impact?.headline}</span>
      </div>
      <ul className="space-y-1">
        {(sim.findings ?? []).map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-[var(--os-text-2)]">
            <span className="text-[var(--os-text-2)]">·</span> {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Decision card (live result or history item) ───────────────────────────────
function DecisionCard({
  decision,
  expanded: defaultExpanded = false,
  onSelect,
  onOutcome,
}: {
  decision:  StrategicDecision
  expanded?: boolean
  onSelect:  (label: string) => void
  onOutcome: (outcome: string) => void
}) {
  const [open,        setOpen]        = useState(defaultExpanded)
  const [outcomeText, setOutcomeText] = useState('')

  const isResolved = !!decision.selected

  return (
    <div className={cn(
      'rounded-2xl border transition-all',
      isResolved ? 'border-green-500/20 bg-green-500/[0.02]' : 'border-[var(--os-border)] bg-[var(--os-card)]',
    )}>
      {/* Header */}
      <div
        className="flex items-start gap-3 px-5 py-4 cursor-pointer"
        onClick={() => setOpen(s => !s)}
      >
        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--os-text-1)] leading-snug">{decision.question}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-[var(--os-text-2)]">
              {new Date(decision.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-[11px] text-[var(--os-text-2)]">{decision.confidence}% confidence</span>
            {isResolved && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400">
                <CheckCircle2 className="w-3 h-3" /> Selected: {decision.selected}
              </span>
            )}
            {!isResolved && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                <Clock className="w-3 h-3" /> Pending decision
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConfBar value={decision.confidence} className="w-20" />
          {open ? <ChevronUp className="w-3.5 h-3.5 text-[var(--os-text-2)]" /> : <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--os-border)] px-5 py-4 space-y-5">

          {/* Situation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-1.5">Current Situation</p>
            <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{decision.situation}</p>
          </div>

          {/* Simulation */}
          {decision.simulation && <SimulationCard sim={decision.simulation} />}

          {/* Options */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3">Options</p>
            <div className="space-y-3">
              {(decision.options ?? []).map((opt, i) => {
                const isSelected = decision.selected === opt.label
                const isRecommended = decision.recommendation?.includes(opt.label)
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-2xl border p-4 transition-all',
                      isSelected
                        ? 'border-green-500/40 bg-green-500/[0.05]'
                        : isRecommended && !isResolved
                          ? 'border-[#579bfc]/30 bg-[#579bfc]/[0.04]'
                          : 'border-[var(--os-border)] bg-[var(--os-surface-0)]',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[var(--os-text-1)]">{opt.label}</p>
                          {isRecommended && !isResolved && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#579bfc]/15 text-[#579bfc] border border-[#579bfc]/30">
                              KIMMP RECOMMENDS
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30">
                              SELECTED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{opt.recommendation}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] font-semibold text-[var(--os-text-1)]">{opt.confidence}%</p>
                        <p className="text-[10px] text-[var(--os-text-2)]">confidence</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-semibold text-green-400 mb-1">PROS</p>
                        <ul className="space-y-0.5">
                          {(opt.pros ?? []).map((p, j) => (
                            <li key={j} className="text-[11px] text-[var(--os-text-2)] flex items-start gap-1">
                              <span className="text-green-400 mt-0.5">+</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-red-400 mb-1">CONS</p>
                        <ul className="space-y-0.5">
                          {(opt.cons ?? []).map((c, j) => (
                            <li key={j} className="text-[11px] text-[var(--os-text-2)] flex items-start gap-1">
                              <span className="text-red-400 mt-0.5">−</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {opt.roi && (
                      <div className="flex items-center gap-2 mb-3 text-[11px]">
                        <TrendingUp className="w-3 h-3 text-[#fdab3d]" />
                        <span className="text-[#fdab3d] font-medium">{opt.roi}</span>
                      </div>
                    )}

                    {!isResolved && (
                      <button
                        onClick={() => onSelect(opt.label)}
                        className={cn(
                          'w-full py-1.5 rounded-2xl text-[11px] font-semibold border transition-colors',
                          isRecommended
                            ? 'bg-[#579bfc] border-[#579bfc] text-white hover:bg-[#4a8ef5]'
                            : 'bg-[var(--os-card)] border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]',
                        )}
                      >
                        Select "{opt.label}"
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* KIMMP Recommendation */}
          <div className="rounded-2xl border border-[#7c3aed]/20 bg-[#7c3aed]/[0.04] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">KIMMP Recommendation</p>
            </div>
            <p className="text-sm text-[var(--os-text-1)] leading-relaxed">{decision.recommendation}</p>
          </div>

          {/* Evidence */}
          {decision.evidence?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-2">Evidence Used</p>
              <div className="space-y-1.5">
                {decision.evidence.slice(0, 5).map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--os-text-2)]">
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)]">{ev.source}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="truncate">{ev.snippet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcome recording */}
          {isResolved && !decision.outcome && (
            <div className="border-t border-[var(--os-border)] pt-4">
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] mb-2">Record what happened (closes the learning loop)</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
                  placeholder="e.g. Chose Option A — revenue increased 12% in Q3"
                  value={outcomeText}
                  onChange={e => setOutcomeText(e.target.value)}
                />
                <button
                  onClick={() => { if (outcomeText.trim()) { onOutcome(outcomeText); setOutcomeText('') } }}
                  className="px-3 py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5]"
                >
                  Save
                </button>
              </div>
            </div>
          )}
          {decision.outcome && (
            <div className="border-t border-[var(--os-border)] pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-1">Outcome Recorded</p>
              <p className="text-[11px] text-[var(--os-text-1)]">{decision.outcome}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Decision composer ─────────────────────────────────────────────────────────
function DecisionComposer({ onResult }: { onResult: (d: StrategicDecision) => void }) {
  const [question, setQuestion] = useState('')
  const [simType,  setSimType]  = useState('')
  const [clientId, setClientId] = useState('')
  const [projectId, setProjectId] = useState('')

  const ask = useMutation({
    mutationFn: async () => {
      const body: any = { question }
      if (simType) {
        body.simulationType = simType
        body.simulationParams = {}
        if (clientId)  body.simulationParams.clientId  = clientId
        if (projectId) body.simulationParams.projectId = projectId
        if (question)  body.simulationParams.scenario  = question
      }
      return apiFetch<StrategicDecision>('/admin/kangqore-immp/decisions', { method: 'POST', body: JSON.stringify(body) })
    },
    onSuccess: (data) => {
      onResult(data)
      setQuestion('')
    },
  })

  return (
    <div className="rounded-2xl border border-[#7c3aed]/20 bg-[#7c3aed]/[0.04] p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        <p className="text-sm font-bold text-purple-300">Ask KIMMP for a Strategic Decision</p>
      </div>
      <p className="text-[11px] text-[var(--os-text-2)]">
        Unlike chat, Decision Mode returns a structured document: situation + 2–4 options + KIMMP's recommendation + evidence.
      </p>

      <textarea
        className="w-full px-4 py-3 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#7c3aed] resize-none"
        rows={3}
        placeholder='e.g. "Should we expand to the UAE market or double down on UK enterprise clients?"'
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      {/* Optional simulation */}
      <div className="grid grid-cols-3 gap-2">
        <select
          className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-2)] outline-none"
          value={simType} onChange={e => setSimType(e.target.value)}
        >
          <option value="">No simulation</option>
          <option value="REVENUE_IMPACT">Revenue Impact</option>
          <option value="CAPACITY_IMPACT">Capacity Impact</option>
          <option value="RISK_PROPAGATION">Risk Propagation</option>
          <option value="DEPENDENCY_CHAIN">Dependency Chain</option>
        </select>
        {simType === 'REVENUE_IMPACT' && (
          <input
            className="col-span-2 px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
            placeholder="Client ID (optional)"
            value={clientId} onChange={e => setClientId(e.target.value)}
          />
        )}
        {simType === 'DEPENDENCY_CHAIN' && (
          <input
            className="col-span-2 px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
            placeholder="Project ID (optional)"
            value={projectId} onChange={e => setProjectId(e.target.value)}
          />
        )}
      </div>

      <button
        onClick={() => ask.mutate()}
        disabled={!question.trim() || ask.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d31d4] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ask.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</> : <><Brain className="w-4 h-4" /> Run Decision Analysis</>}
      </button>
      {ask.isError && <p className="text-[11px] text-red-400">{(ask.error as Error).message}</p>}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function DecisionsPage() {
  const qc = useQueryClient()
  const [liveDecision, setLiveDecision] = useState<StrategicDecision | null>(null)

  const { data, isLoading } = useQuery<{ items: any[] }>({
    queryKey: ['kimmp-decisions'],
    queryFn:  () => api.get('/admin/kangqore-immp/decisions?limit=20').then(r => r.data),
    staleTime: 30_000,
  })

  const select = useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) =>
      apiFetch(`/admin/kangqore-immp/decisions/${id}/select`, { method: 'POST', body: JSON.stringify({ label }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kimmp-decisions'] }); setLiveDecision(null) },
  })

  const outcome = useMutation({
    mutationFn: ({ id, outcome: o }: { id: string; outcome: string }) =>
      apiFetch(`/admin/kangqore-immp/decisions/${id}/outcome`, { method: 'POST', body: JSON.stringify({ outcome: o }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-decisions'] }),
  })

  const history = data?.items ?? []
  const pending = history.filter(d => !d.selected).length

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Decisions', value: history.length, icon: Brain,       color: 'text-purple-400' },
          { label: 'Pending',         value: pending,         icon: Clock,        color: 'text-amber-400' },
          { label: 'Resolved',        value: history.length - pending, icon: CheckCircle2, color: 'text-green-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3 flex items-center gap-3">
            <Icon className={cn('w-5 h-5 flex-shrink-0', color)} />
            <div>
              <p className={cn('text-xl font-bold tabular-nums', color)}>{value}</p>
              <p className="text-[11px] text-[var(--os-text-2)]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <DecisionComposer onResult={d => setLiveDecision(d as StrategicDecision)} />

      {/* Live result */}
      {liveDecision && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-[#579bfc]" />
            <p className="text-xs font-semibold text-[#579bfc] uppercase tracking-wide">Decision just generated</p>
          </div>
          <DecisionCard
            decision={liveDecision}
            expanded
            onSelect={(label) => { select.mutate({ id: liveDecision.id, label }) }}
            onOutcome={(o) => outcome.mutate({ id: liveDecision.id, outcome: o })}
          />
        </div>
      )}

      {/* History */}
      <div>
        <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-3">Decision History</p>
        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] animate-pulse" />)}</div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-5 py-10 text-center">
            <Brain className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
            <p className="text-sm text-[var(--os-text-2)]">No strategic decisions yet. Ask KIMMP a strategic question above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(d => (
              <DecisionCard
                key={d.id}
                decision={d}
                onSelect={(label) => select.mutate({ id: d.id, label })}
                onOutcome={(o) => outcome.mutate({ id: d.id, outcome: o })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
