import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { Cpu, ChevronDown, ChevronRight, RotateCcw, Save, BookOpen, X, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

// ── Clamp helper ──────────────────────────────────────────────────────────────

function clamp(n: number, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, n)) }

// ── Types mirroring gate8.service.ts metric shapes ────────────────────────────

interface Gate8Live {
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
  pillars: Record<string, { score: number; metrics: Record<string, unknown> }>
}

// ── Per-pillar simulation formulas (mirror gate8.service.ts exactly) ──────────

function simDecision(m: Record<string, unknown>, ov: Record<string, number>): number {
  const conf    = ('avgConfidencePct'  in ov ? ov.avgConfidencePct  : (m.avgConfidencePct  as number ?? 75)) / 100
  const adopt   = ('adoptionRatePct'   in ov ? ov.adoptionRatePct   : (m.adoptionRatePct   as number ?? 50)) / 100
  const outcome = ('outcomeRatePct'    in ov ? ov.outcomeRatePct    : (m.outcomeRatePct    as number ?? 50)) / 100
  const evidence = Math.min(((m.avgEvidenceItems as number ?? 0) / 5), 1)
  return clamp(conf * 100 * 0.35 + adopt * 100 * 0.15 + outcome * 100 * 0.25 + evidence * 100 * 0.25)
}

function simEnterprise(m: Record<string, unknown>, ov: Record<string, number>): number {
  const p1    = 'p1Active'              in ov ? ov.p1Active              : (m.p1Active              as number ?? 0)
  const p2    = 'p2Active'              in ov ? ov.p2Active              : (m.p2Active              as number ?? 0)
  const p3    = m.p3Active              as number ?? 0
  const sla   = m.slaBreached           as number ?? 0
  const crit  = 'criticalRisks'         in ov ? ov.criticalRisks         : (m.criticalRisks         as number ?? 0)
  const high  = m.highRisks             as number ?? 0
  const det   = m.deterioratingRisks    as number ?? 0
  const ph    = 'portfolioProjectHealth' in ov ? ov.portfolioProjectHealth : (m.portfolioProjectHealth as number ?? 0)
  const incRisk = clamp(100 - p1*20 - p2*10 - p3*3 - sla*5 - crit*4 - high*2 - det*2)
  return ph > 0 ? clamp(incRisk * 0.70 + ph * 0.30) : incRisk
}

function simWorkflow(m: Record<string, unknown>, ov: Record<string, number>): number {
  const comp  = ('overallCompletionPct' in ov ? ov.overallCompletionPct : (m.overallCompletionPct as number ?? 80)) / 100
  const retry = ('kimmpRetryRatePct'    in ov ? ov.kimmpRetryRatePct    : (m.kimmpRetryRatePct    as number ?? 0)) / 100
  const step  = ((m.stepCompletionPct  as number ?? 90)) / 100
  return clamp(comp * 70 + (1 - retry) * 15 + step * 15)
}

function simGoal(m: Record<string, unknown>, ov: Record<string, number>): number {
  const prog  = ('avgProgressPct'    in ov ? ov.avgProgressPct    : (m.avgProgressPct    as number ?? 50)) / 100
  const comp  = ('completionRatePct' in ov ? ov.completionRatePct : (m.completionRatePct as number ?? 0)) / 100
  const atRisk = 'atRisk' in ov ? ov.atRisk : (m.atRisk as number ?? 0)
  const total  = (m.total as number ?? 1) || 1
  const atRiskFactor = 1 - atRisk / Math.max(total, 1)
  return clamp(prog * 100 * 0.55 + comp * 100 * 0.30 + atRiskFactor * 15)
}

function simBusiness(m: Record<string, unknown>, ov: Record<string, number>): number {
  const total  = 'totalWorkflowsCompleted' in ov ? ov.totalWorkflowsCompleted : (m.totalWorkflowsCompleted as number ?? 0)
  const autoCov = ('automationCoveragePct'  in ov ? ov.automationCoveragePct  : (m.automationCoveragePct  as number ?? 0)) / 100
  const hours  = total * 0.5
  return clamp(Math.min(total * 2, 50) + autoCov * 30 + Math.min(hours / 100, 20))
}

function simAdoption(m: Record<string, unknown>, ov: Record<string, number>): number {
  const users   = 'uniqueActiveUsers'          in ov ? ov.uniqueActiveUsers          : (m.uniqueActiveUsers          as number ?? 0)
  const accept  = ('decisionAcceptanceRatePct' in ov ? ov.decisionAcceptanceRatePct : (m.decisionAcceptanceRatePct as number ?? 50)) / 100
  const recRate = ((m.recActedRatePct as number ?? 50)) / 100
  const wfRuns  = (m.workflowRunsLast30Days as number ?? 0)
  const ovpen   = Math.min((m.emergencyOverrides as number ?? 0) * 10, 30)
  return clamp(Math.min(users * 10, 30) + accept * 30 + Math.min(wfRuns * 2, 20) + recRate * 20 - ovpen)
}

function computeSimOIS(scores: Record<string, number>): number {
  return Math.round(clamp(
    (scores.decision   ?? 75) * 0.20 +
    (scores.enterprise ?? 75) * 0.18 +
    (scores.workflow   ?? 80) * 0.15 +
    (scores.goal       ?? 75) * 0.14 +
    (scores.ai         ?? 80) * 0.10 +
    (scores.business   ?? 60) * 0.10 +
    (scores.trust      ?? 85) * 0.08 +
    (scores.adoption   ?? 60) * 0.05
  ) * 10) / 10
}

// ── Demo fallback ─────────────────────────────────────────────────────────────

const DEMO_LIVE: Gate8Live = {
  oisScore: 78.9, decisionScore: 85.2, workflowScore: 79.4,
  aiScore: 88.1, enterpriseScore: 74.3, goalScore: 81.0,
  learningScore: 72.5, businessScore: 69.8, trustScore: 91.2, adoptionScore: 65.0,
  pillars: {
    decision:   { score: 85.2, metrics: { avgConfidencePct: 82, adoptionRatePct: 60, outcomeRatePct: 54, avgEvidenceItems: 2.8 } },
    enterprise: { score: 74.3, metrics: { p1Active: 1, p2Active: 2, p3Active: 3, slaBreached: 1, criticalRisks: 2, highRisks: 3, deterioratingRisks: 1, portfolioProjectHealth: 78 } },
    workflow:   { score: 79.4, metrics: { overallCompletionPct: 81, kimmpRetryRatePct: 12, stepCompletionPct: 88 } },
    goal:       { score: 81.0, metrics: { avgProgressPct: 68, completionRatePct: 32, atRisk: 2, total: 8 } },
    ai:         { score: 88.1, metrics: { aiSuccessRatePct: 94, avgEvalScore: 0.82, avgLatencyMs: 1800 } },
    business:   { score: 69.8, metrics: { totalWorkflowsCompleted: 24, automationCoveragePct: 62 } },
    trust:      { score: 91.2, metrics: {} },
    adoption:   { score: 65.0, metrics: { uniqueActiveUsers: 4, decisionAcceptanceRatePct: 72, recActedRatePct: 48, workflowRunsLast30Days: 18, emergencyOverrides: 1 } },
    learning:   { score: 72.5, metrics: {} },
  },
}

// ── Lever definitions ─────────────────────────────────────────────────────────

interface Lever {
  key:       string
  label:     string
  unit:      string
  min:       number
  max:       number
  step:      number
  metricKey: string   // key in pillars[pillar].metrics
  inverse?:  boolean  // lower = better
}

const PILLAR_LEVERS: Record<string, { label: string; weight: number; simFn: typeof simDecision; levers: Lever[] }> = {
  decision: {
    label: 'Decision', weight: 0.20, simFn: simDecision,
    levers: [
      { key: 'avgConfidencePct',  label: 'Avg KIMMP Confidence', unit: '%',   min: 0,  max: 100, step: 1,  metricKey: 'avgConfidencePct' },
      { key: 'outcomeRatePct',    label: 'Outcome Recording',    unit: '%',   min: 0,  max: 100, step: 1,  metricKey: 'outcomeRatePct' },
      { key: 'adoptionRatePct',   label: 'Auto-Adoption Rate',   unit: '%',   min: 0,  max: 100, step: 1,  metricKey: 'adoptionRatePct' },
    ],
  },
  enterprise: {
    label: 'Enterprise', weight: 0.18, simFn: simEnterprise,
    levers: [
      { key: 'p1Active',              label: 'P1 Active Incidents',   unit: '',    min: 0,  max: 15, step: 1, metricKey: 'p1Active',              inverse: true },
      { key: 'p2Active',              label: 'P2 Active Incidents',   unit: '',    min: 0,  max: 30, step: 1, metricKey: 'p2Active',              inverse: true },
      { key: 'criticalRisks',         label: 'Critical Risks Open',   unit: '',    min: 0,  max: 20, step: 1, metricKey: 'criticalRisks',         inverse: true },
      { key: 'portfolioProjectHealth', label: 'Portfolio Health',      unit: '%',  min: 0,  max: 100, step: 1, metricKey: 'portfolioProjectHealth' },
    ],
  },
  workflow: {
    label: 'Workflow', weight: 0.15, simFn: simWorkflow,
    levers: [
      { key: 'overallCompletionPct', label: 'Workflow Completion', unit: '%',  min: 0, max: 100, step: 1, metricKey: 'overallCompletionPct' },
      { key: 'kimmpRetryRatePct',    label: 'KIMMP Retry Rate',   unit: '%',  min: 0, max: 100, step: 1, metricKey: 'kimmpRetryRatePct', inverse: true },
    ],
  },
  goal: {
    label: 'Goal', weight: 0.14, simFn: simGoal,
    levers: [
      { key: 'avgProgressPct',    label: 'Avg Goal Progress',   unit: '%',  min: 0, max: 100, step: 1, metricKey: 'avgProgressPct' },
      { key: 'completionRatePct', label: 'Goal Completion Rate', unit: '%', min: 0, max: 100, step: 1, metricKey: 'completionRatePct' },
      { key: 'atRisk',            label: 'At-Risk Goals',        unit: '',  min: 0, max: 20,  step: 1, metricKey: 'atRisk', inverse: true },
    ],
  },
  business: {
    label: 'Business', weight: 0.10, simFn: simBusiness,
    levers: [
      { key: 'totalWorkflowsCompleted', label: 'Workflows Completed',  unit: '',   min: 0, max: 150, step: 1,  metricKey: 'totalWorkflowsCompleted' },
      { key: 'automationCoveragePct',   label: 'Automation Coverage',  unit: '%',  min: 0, max: 100, step: 1,  metricKey: 'automationCoveragePct' },
    ],
  },
  adoption: {
    label: 'Adoption', weight: 0.05, simFn: simAdoption,
    levers: [
      { key: 'uniqueActiveUsers',          label: 'Active Users (30d)',          unit: '', min: 0, max: 50,  step: 1, metricKey: 'uniqueActiveUsers' },
      { key: 'decisionAcceptanceRatePct',  label: 'Decision Acceptance Rate',   unit: '%', min: 0, max: 100, step: 1, metricKey: 'decisionAcceptanceRatePct' },
    ],
  },
}

// ── Slider component ──────────────────────────────────────────────────────────

function LeverSlider({
  lever,
  value,
  baseline,
  onChange,
}: {
  lever: Lever
  value: number
  baseline: number
  onChange: (v: number) => void
}) {
  const delta = value - baseline
  const improved = lever.inverse ? delta < 0 : delta > 0
  const changed = Math.abs(delta) >= lever.step

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-[var(--os-text-2)]">{lever.label}</span>
        <div className="flex items-center gap-2">
          {changed && (
            <span className={`font-semibold ${improved ? 'text-green-500' : 'text-red-400'}`}>
              {lever.inverse
                ? (delta < 0 ? `−${Math.abs(delta)}` : `+${delta}`)
                : (delta > 0 ? `+${delta}` : `${delta}`)
              }{lever.unit}
            </span>
          )}
          <span className="font-mono font-bold text-[var(--os-text-1)]">{value}{lever.unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={lever.min}
          max={lever.max}
          step={lever.step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${changed && improved ? '#10b981' : changed ? '#f97316' : '#14b8a6'} 0%, ${changed && improved ? '#10b981' : changed ? '#f97316' : '#14b8a6'} ${((value - lever.min) / (lever.max - lever.min)) * 100}%, var(--os-border) ${((value - lever.min) / (lever.max - lever.min)) * 100}%, var(--os-border) 100%)`,
          }}
        />
        <div
          className="absolute -top-0.5 w-0.5 h-2.5 rounded bg-white opacity-40"
          style={{ left: `${((baseline - lever.min) / (lever.max - lever.min)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[var(--os-text-3)]">
        <span>{lever.min}{lever.unit}</span>
        <span className="opacity-40">baseline: {baseline}{lever.unit}</span>
        <span>{lever.max}{lever.unit}</span>
      </div>
    </div>
  )
}

// ── Pillar panel ──────────────────────────────────────────────────────────────

function PillarPanel({
  pillarKey,
  def,
  metrics,
  overrides,
  baselineScore,
  simScore,
  onOverride,
}: {
  pillarKey:     string
  def:           typeof PILLAR_LEVERS[string]
  metrics:       Record<string, unknown>
  overrides:     Record<string, number>
  baselineScore: number
  simScore:      number
  onOverride:    (k: string, v: number) => void
}) {
  const [open, setOpen] = useState(false)
  const delta = simScore - baselineScore
  const changed = Math.abs(delta) >= 0.1
  const color = simScore >= 85 ? '#10b981' : simScore >= 72 ? '#f59e0b' : '#ef4444'

  return (
    <div className="border border-[var(--os-border)] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--os-bg2)] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)] flex-shrink-0" />
               : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-3)] flex-shrink-0" />}
        <span className="text-sm font-semibold text-[var(--os-text-1)] flex-1 text-left">{def.label}</span>
        <span className="text-xs text-[var(--os-text-3)] mr-2">{(def.weight * 100).toFixed(0)}% weight</span>

        {/* before → after */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--os-text-3)] line-through">{baselineScore.toFixed(1)}</span>
          <span className="text-sm font-bold" style={{ color }}>{simScore.toFixed(1)}</span>
          {changed && (
            <span className={`text-xs font-semibold ${delta > 0 ? 'text-green-500' : 'text-red-400'}`}>
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </span>
          )}
        </div>

        {/* mini progress bar */}
        <div className="w-16 h-1.5 rounded-full bg-[var(--os-border)] overflow-hidden ml-2 flex-shrink-0">
          <div className="h-full rounded-full" style={{ width: `${simScore}%`, background: color, transition: 'width 0.2s ease' }} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-5 border-t border-[var(--os-border)] bg-[var(--os-bg2)]">
          {def.levers.map(lever => {
            const baseline = lever.key in metrics
              ? (metrics[lever.key] as number) ?? lever.min
              : lever.min
            const current = lever.key in overrides ? overrides[lever.key] : baseline
            return (
              <LeverSlider
                key={lever.key}
                lever={lever}
                value={current}
                baseline={baseline}
                onChange={v => onOverride(lever.key, v)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Grade ─────────────────────────────────────────────────────────────────────

function grade(score: number) {
  if (score >= 93) return 'A+'; if (score >= 90) return 'A'; if (score >= 87) return 'A-'
  if (score >= 83) return 'B+'; if (score >= 80) return 'B'; if (score >= 77) return 'B-'
  if (score >= 73) return 'C+'; if (score >= 70) return 'C'; if (score >= 67) return 'C-'
  if (score >= 60) return 'D'; return 'F'
}

// ── Save Scenario Modal ───────────────────────────────────────────────────────

interface TwinScenario {
  id:           string
  scenario:     string
  horizon:      number
  predictedOIS: number
  oisDelta:     number
  createdAt:    string
}

function SaveScenarioModal({
  insightText,
  oisDelta,
  onClose,
}: {
  insightText: string
  oisDelta: number
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [scenario, setScenario] = useState(insightText)
  const [horizon, setHorizon] = useState<30 | 60 | 90>(30)

  const save = useMutation({
    mutationFn: () => api.post('/admin/gate8/twin/simulate', { scenario, horizon }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['twin-scenarios'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-teal-400" />
            <p className="text-sm font-semibold text-[var(--os-text-1)]">Save Scenario</p>
          </div>
          <button onClick={onClose} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Scenario Description (sent to KIMMP)</label>
            <textarea rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-teal-500 resize-none"
              value={scenario} onChange={e => setScenario(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Horizon</label>
            <div className="flex gap-2">
              {([30, 60, 90] as const).map(h => (
                <button key={h} onClick={() => setHorizon(h)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${horizon === h ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:border-teal-500/40'}`}>
                  {h}d
                </button>
              ))}
            </div>
          </div>
          {oisDelta !== 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)]">
              <span className="text-[11px] text-[var(--os-text-3)]">Current lever delta</span>
              <span className={`text-sm font-bold ml-auto ${oisDelta > 0 ? 'text-green-500' : 'text-red-400'}`}>
                {oisDelta > 0 ? '+' : ''}{oisDelta.toFixed(1)} pts
              </span>
            </div>
          )}
        </div>
        <button onClick={() => save.mutate()} disabled={!scenario.trim() || save.isPending}
          className="w-full py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : <><Save className="w-3.5 h-3.5" />Save & Run KIMMP Simulation</>}
        </button>
        {save.isError && <p className="text-[11px] text-red-400">Failed: {(save.error as any)?.response?.data?.error || 'Unknown error'}</p>}
      </div>
    </div>
  )
}

// ── Saved Scenarios Panel ─────────────────────────────────────────────────────

function SavedScenariosPanel() {
  const [open, setOpen] = useState(false)

  const { data: scenarios = [], isLoading } = useQuery<TwinScenario[]>({
    queryKey: ['twin-scenarios'],
    queryFn: () => api.get('/admin/gate8/twin/scenarios').then(r => r.data?.scenarios ?? r.data ?? []),
    staleTime: 60_000,
    enabled: open,
  })

  return (
    <div className="border border-[var(--os-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--os-bg2)] transition-colors bg-[var(--os-card)]"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)]" />
               : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-3)]" />}
        <BookOpen className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-sm font-semibold text-[var(--os-text-1)]">Saved Scenarios</span>
        <span className="text-[10px] text-[var(--os-text-3)] ml-auto">KIMMP simulation history</span>
      </button>
      {open && (
        <div className="border-t border-[var(--os-border)] bg-[var(--os-bg2)] p-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-[var(--os-text-3)]"><Spinner size="sm" />Loading…</div>
          ) : !scenarios.length ? (
            <p className="text-sm text-[var(--os-text-3)] italic">No saved scenarios yet. Adjust levers and save a scenario above.</p>
          ) : (
            <div className="space-y-2">
              {scenarios.map((s) => (
                <div key={s.id} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--os-text-1)] font-medium leading-snug truncate">{s.scenario}</p>
                    <p className="text-[var(--os-text-3)] mt-1">{s.horizon}d horizon · {new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {s.predictedOIS != null && (
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-teal-400">{s.predictedOIS?.toFixed(1) ?? '—'}</p>
                      {s.oisDelta != null && (
                        <p className={`text-[10px] font-semibold ${s.oisDelta > 0 ? 'text-green-500' : 'text-red-400'}`}>
                          {s.oisDelta > 0 ? '+' : ''}{s.oisDelta?.toFixed(1)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type PillarOverrides = Record<string, Record<string, number>>

export function DigitalTwinPage() {
  const { data: live, isLoading } = useQuery<Gate8Live>({
    queryKey: ['gate8-live'],
    queryFn:  () => api.get('/admin/gate8/score').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const baseline = live ?? (isDemo() ? DEMO_LIVE : null)
  const [overrides, setOverrides] = useState<PillarOverrides>({})
  const [saveModal, setSaveModal] = useState(false)

  function setLever(pillar: string, key: string, value: number) {
    setOverrides(prev => ({
      ...prev,
      [pillar]: { ...(prev[pillar] ?? {}), [key]: value },
    }))
  }

  function reset() { setOverrides({}) }

  // Compute simulated pillar scores
  const simScores = useMemo<Record<string, number>>(() => {
    if (!baseline) return {}
    const result: Record<string, number> = {}
    for (const [pk, def] of Object.entries(PILLAR_LEVERS)) {
      const m = baseline.pillars[pk]?.metrics ?? {}
      const ov = overrides[pk] ?? {}
      result[pk] = def.simFn(m, ov)
    }
    // pass-through for non-simulated pillars
    result.ai       = baseline.aiScore
    result.trust    = baseline.trustScore
    result.learning = baseline.learningScore
    return result
  }, [baseline, overrides])

  const baselineOIS = baseline?.oisScore ?? 0
  const simOIS      = baseline ? computeSimOIS(simScores) : 0
  const oisDelta    = Math.round((simOIS - baselineOIS) * 10) / 10

  const anyChanged = Object.values(overrides).some(ov => Object.keys(ov).length > 0)

  // Generate insight sentence
  const topChanges = Object.entries(simScores)
    .map(([k, v]) => ({ pillar: k, delta: v - (baseline?.pillars[k]?.score ?? baseline?.[`${k}Score` as keyof Gate8Live] as number ?? 0) }))
    .filter(x => Math.abs(x.delta) >= 1)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 2)

  const insightText = topChanges.length > 0
    ? `Simulation shows the largest gains from ${topChanges.map(c =>
        `${PILLAR_LEVERS[c.pillar]?.label ?? c.pillar} (${c.delta > 0 ? '+' : ''}${c.delta.toFixed(1)} pts)`
      ).join(' and ')}.`
    : 'Adjust levers to model what-if scenarios against the live OIS baseline.'

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading live OIS baseline…
        </div>
      )}

      {/* OIS comparison header */}
      <div className="grid grid-cols-3 gap-4">
        {/* Baseline */}
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5">
          <p className="text-xs text-[var(--os-text-3)] mb-1 uppercase tracking-wider font-semibold">Baseline OIS</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-[var(--os-text-2)]">{baselineOIS.toFixed(1)}</span>
            <span className="text-lg font-bold text-[var(--os-text-3)] pb-0.5">{grade(baselineOIS)}</span>
          </div>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Live · Gate 8</p>
        </div>

        {/* Simulated */}
        <div className={`rounded-xl p-5 border-2 transition-all ${anyChanged ? 'border-teal-500/40 bg-teal-500/5' : 'border-[var(--os-border)] bg-[var(--os-card)]'}`}>
          <p className="text-xs text-[var(--os-text-3)] mb-1 uppercase tracking-wider font-semibold">Simulated OIS</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-teal-400">{simOIS.toFixed(1)}</span>
            <span className="text-lg font-bold text-teal-500 pb-0.5">{grade(simOIS)}</span>
          </div>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Digital Twin™ · Gate 8.3</p>
        </div>

        {/* Delta */}
        <div className={`rounded-xl p-5 border transition-all ${oisDelta > 0 ? 'bg-green-500/5 border-green-500/30' : oisDelta < 0 ? 'bg-red-500/5 border-red-500/30' : 'bg-[var(--os-card)] border-[var(--os-border)]'}`}>
          <p className="text-xs text-[var(--os-text-3)] mb-1 uppercase tracking-wider font-semibold">OIS Delta</p>
          <span className={`text-3xl font-extrabold ${oisDelta > 0 ? 'text-green-500' : oisDelta < 0 ? 'text-red-400' : 'text-[var(--os-text-3)]'}`}>
            {oisDelta > 0 ? '+' : ''}{oisDelta.toFixed(1)}
          </span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">pts</p>
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="flex items-start gap-3 px-5 py-3.5 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)]">
        <Cpu className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-violet-400 mb-0.5">KIMMP · Digital Twin Analysis</p>
          <p className="text-sm text-[var(--os-text-2)]">{insightText}</p>
        </div>
        {anyChanged && (
          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setSaveModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-colors"
            >
              <Save className="w-3 h-3" /> Save Scenario
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Two-column: baseline bars | lever panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: pillar comparison bars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pillar Scores — Baseline vs Simulated</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {Object.entries(PILLAR_LEVERS).map(([pk, def]) => {
              const bScore = baseline?.pillars[pk]?.score ?? 0
              const sScore = simScores[pk] ?? bScore
              const d = sScore - bScore
              const color = sScore >= 85 ? '#10b981' : sScore >= 72 ? '#f59e0b' : '#ef4444'
              return (
                <div key={pk}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--os-text-2)] font-medium">{def.label} <span className="text-[var(--os-text-3)]">·{(def.weight*100).toFixed(0)}%</span></span>
                    <div className="flex items-center gap-2">
                      {Math.abs(d) >= 0.1 && (
                        <span className={`font-semibold ${d > 0 ? 'text-green-500' : 'text-red-400'}`}>
                          {d > 0 ? '+' : ''}{d.toFixed(1)}
                        </span>
                      )}
                      <span className="font-mono font-bold" style={{ color }}>{sScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
                    {/* baseline ghost */}
                    <div className="absolute h-full rounded-full bg-white/10" style={{ width: `${bScore}%` }} />
                    {/* sim bar */}
                    <div className="absolute h-full rounded-full transition-all duration-200" style={{ width: `${sScore}%`, background: color }} />
                  </div>
                </div>
              )
            })}
            {/* Fixed pillars */}
            {(['ai', 'trust'] as const).map(pk => {
              const score = baseline?.[`${pk}Score` as keyof Gate8Live] as number ?? 0
              const color = score >= 85 ? '#10b981' : score >= 72 ? '#f59e0b' : '#ef4444'
              const label = pk === 'ai' ? 'AI (10%)' : 'Trust (8%)'
              return (
                <div key={pk}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[var(--os-text-3)]">{label} <span className="opacity-50">· fixed</span></span>
                    <span className="font-mono font-bold text-[var(--os-text-3)]">{score.toFixed(1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
                    <div className="h-full rounded-full opacity-40" style={{ width: `${score}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        {/* Right: lever panels */}
        <div className="space-y-2">
          <p className="text-xs text-[var(--os-text-3)] font-semibold uppercase tracking-wider px-1 mb-3">
            What-If Studio — adjust levers to simulate
          </p>
          {Object.entries(PILLAR_LEVERS).map(([pk, def]) => (
            <PillarPanel
              key={pk}
              pillarKey={pk}
              def={def}
              metrics={baseline?.pillars[pk]?.metrics ?? {}}
              overrides={overrides[pk] ?? {}}
              baselineScore={baseline?.pillars[pk]?.score ?? 0}
              simScore={simScores[pk] ?? (baseline?.pillars[pk]?.score ?? 0)}
              onOverride={(k, v) => setLever(pk, k, v)}
            />
          ))}
          <p className="text-[10px] text-[var(--os-text-3)] px-1 pt-1">
            AI · Trust pillars are read-only in simulation — they reflect platform-level performance not directly adjustable by operators.
          </p>
        </div>
      </div>

      {/* Saved Scenarios */}
      <SavedScenariosPanel />

      {saveModal && (
        <SaveScenarioModal
          insightText={insightText}
          oisDelta={oisDelta}
          onClose={() => setSaveModal(false)}
        />
      )}
    </div>
  )
}
