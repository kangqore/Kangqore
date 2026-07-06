import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { apiFetch } from '@lib/api'
import {
  Zap, Play, RefreshCw, Loader2, CheckCircle2, XCircle,
  PauseCircle, Clock, AlertTriangle, MessageSquare, ThumbsUp, ThumbsDown,
  ChevronDown, ChevronRight, Target, Brain
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface WAOEStatus {
  engine:               string
  version:              string
  activeRuns:           number
  totalWorkflows:       number
  totalRuns:            number
  recentActionableEvals: number
}

interface WorkflowRun {
  id:          string
  workflowId:  string
  status:      string
  triggeredBy: string
  currentStep: string | null
  startedAt:   string
  completedAt: string | null
  failedAt:    string | null
  outcome:     string | null
  retryCount:  number
  workflow?:   { name: string }
  traceSummary?: { stepCount: number; agentCalls: number; apiCalls: number; totalMs: number; errors: string[] }
  comments?:   any[]
}

const RUN_STATUS: Record<string, { color: string; icon: any; label: string }> = {
  PENDING:      { color: '#8b8b8b',  icon: Clock,        label: 'Pending'      },
  RUNNING:      { color: '#579bfc',  icon: RefreshCw,    label: 'Running'      },
  PAUSED:       { color: '#fdab3d',  icon: PauseCircle,  label: 'Paused'       },
  COMPLETED:    { color: '#00c875',  icon: CheckCircle2, label: 'Completed'    },
  FAILED:       { color: '#e2445c',  icon: XCircle,      label: 'Failed'       },
  COMPENSATING: { color: '#7c3aed',  icon: AlertTriangle,label: 'Compensating' },
}

// ── Run card ──────────────────────────────────────────────────────────────────
function RunCard({ run }: { run: WorkflowRun }) {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [comment, setComment]   = useState('')

  const st = RUN_STATUS[run.status] ?? RUN_STATUS.PENDING

  const approve = useMutation({
    mutationFn: () => apiFetch(`/admin/kangqore-immp/waoe/runs/${run.id}/approve`, {
      method: 'POST', body: JSON.stringify({ note: 'Approved from Operations page' }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waoe-runs'] }),
  })

  const reject = useMutation({
    mutationFn: (reason: string) => apiFetch(`/admin/kangqore-immp/waoe/runs/${run.id}/reject`, {
      method: 'POST', body: JSON.stringify({ reason }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waoe-runs'] }),
  })

  const addComment = useMutation({
    mutationFn: () => apiFetch(`/admin/kangqore-immp/waoe/runs/${run.id}/comments`, {
      method: 'POST', body: JSON.stringify({ content: comment }),
    }),
    onSuccess: () => { setComment(''); qc.invalidateQueries({ queryKey: ['waoe-runs'] }) },
  })

  const durationS = run.completedAt || run.failedAt
    ? Math.round((new Date(run.completedAt ?? run.failedAt!).getTime() - new Date(run.startedAt).getTime()) / 1000)
    : null

  return (
    <div className={cn('rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden', run.status === 'RUNNING' && 'border-[#579bfc]/30')}>
      <div className="px-4 py-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <st.icon
          className={cn('w-4 h-4 flex-shrink-0', run.status === 'RUNNING' && 'animate-spin')}
          style={{ color: st.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[var(--os-text-1)] truncate">
            {run.workflow?.name ?? run.workflowId.slice(0, 16)}
          </p>
          <p className="text-[10px] text-[var(--os-text-2)]">
            {new Date(run.startedAt).toLocaleString()} · by {run.triggeredBy}
            {durationS !== null && ` · ${durationS}s`}
            {run.retryCount > 0 && ` · ${run.retryCount} retries`}
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: st.color, background: `${st.color}20` }}>
          {st.label}
        </span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-2)]" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[var(--os-border)] space-y-3 pt-3">
          {/* Trace summary */}
          {run.traceSummary && (
            <div className="grid grid-cols-4 gap-2">
              {[
                ['Steps', run.traceSummary.stepCount],
                ['Agents', run.traceSummary.agentCalls],
                ['APIs', run.traceSummary.apiCalls],
                ['Duration', `${Math.round(run.traceSummary.totalMs / 1000)}s`],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] px-2 py-1.5 text-center">
                  <p className="text-sm font-bold text-[var(--os-text-1)]">{val}</p>
                  <p className="text-[10px] text-[var(--os-text-2)]">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Errors */}
          {run.traceSummary?.errors?.length > 0 && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              {run.traceSummary.errors.map((e, i) => (
                <p key={i} className="text-[11px] text-red-400">{e}</p>
              ))}
            </div>
          )}

          {/* Outcome */}
          {run.outcome && (
            <p className="text-[11px] text-[var(--os-text-2)]">Outcome: <span className="text-[var(--os-text-1)]">{run.outcome}</span></p>
          )}

          {/* Approval actions (paused runs) */}
          {run.status === 'PAUSED' && (
            <div className="flex gap-2">
              <button
                onClick={() => approve.mutate()}
                disabled={approve.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-[11px] font-semibold hover:bg-green-400 disabled:opacity-50"
              >
                {approve.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3 h-3" />} Approve & Resume
              </button>
              <button
                onClick={() => reject.mutate('Rejected by operator')}
                disabled={reject.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-semibold hover:bg-red-500/30 disabled:opacity-50"
              >
                <ThumbsDown className="w-3 h-3" /> Reject
              </button>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-2">
            {(run.comments ?? []).map((c: any) => (
              <div key={c.id} className="flex gap-2">
                <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0 text-[var(--os-text-2)]" />
                <div>
                  <p className="text-[10px] text-[var(--os-text-2)]">{c.userId} · {c.type}</p>
                  <p className="text-[11px] text-[var(--os-text-1)]">{c.content}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-1">
              <input
                className="flex-1 px-2 py-1.5 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
                placeholder="Add a comment…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && comment.trim() && addComment.mutate()}
              />
              <button
                onClick={() => addComment.mutate()}
                disabled={!comment.trim() || addComment.isPending}
                className="px-2.5 py-1.5 rounded-lg bg-[#579bfc] text-white text-[11px] disabled:opacity-40"
              >
                {addComment.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function OperationsPage() {
  const qc = useQueryClient()
  const [goal, setGoal] = useState('')
  const [runResult, setRunResult] = useState<any>(null)

  const { data: status } = useQuery<WAOEStatus>({
    queryKey: ['waoe-status'],
    queryFn:  () => api.get('/admin/kangqore-immp/waoe/status').then(r => r.data),
    staleTime: 10_000,
    refetchInterval: 15_000,
  })

  const { data: runsData, isLoading: runsLoading } = useQuery<{ items: WorkflowRun[] }>({
    queryKey: ['waoe-runs'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/waoe/runs?limit=20'),
    staleTime: 8_000,
    refetchInterval: 12_000,
  })

  const runWAOE = useMutation({
    mutationFn: (g: string) => apiFetch('/admin/kangqore-immp/waoe/run', {
      method: 'POST', body: JSON.stringify({ goal: g }),
    }),
    onSuccess: (data) => {
      setRunResult(data)
      setGoal('')
      qc.invalidateQueries({ queryKey: ['waoe-runs'] })
    },
  })

  const goalCycle = useMutation({
    mutationFn: () => apiFetch('/admin/kangqore-immp/waoe/goals/cycle', { method: 'POST', body: '{}' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waoe-runs'] }),
  })

  const runs = runsData?.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[#fdab3d]" />
            <h2 className="text-base font-bold text-[var(--os-text-1)]">WAOE</h2>
            <span className="text-[10px] text-[var(--os-text-2)] font-mono">WAANDA Autonomous Operations Engine</span>
          </div>
          <p className="text-[12px] text-[var(--os-text-2)]">
            Goal-driven autonomous execution — plan, compile, run, monitor, learn.
          </p>
        </div>
        <button
          onClick={() => goalCycle.mutate()}
          disabled={goalCycle.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--os-border)] text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-[#579bfc]"
        >
          {goalCycle.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
          Evaluate All Goals
        </button>
      </div>

      {/* Engine stats */}
      {status && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Active runs',      value: status.activeRuns,             color: status.activeRuns > 0 ? '#579bfc' : undefined },
            { label: 'Workflows',        value: status.totalWorkflows,         color: undefined },
            { label: 'Total runs',       value: status.totalRuns,              color: undefined },
            { label: 'Actionable evals', value: status.recentActionableEvals,  color: status.recentActionableEvals > 0 ? '#fdab3d' : undefined },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3">
              <p className="text-xl font-bold tabular-nums" style={{ color: color ?? 'var(--os-text-1)' }}>{value}</p>
              <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Goal composer */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-3.5 h-3.5 text-[#579bfc]" />
          <p className="text-[12px] font-semibold text-[var(--os-text-1)]">Launch Autonomous Goal</p>
        </div>
        <textarea
          className="w-full px-3 py-2.5 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] resize-none outline-none focus:border-[#579bfc] placeholder:text-[var(--os-text-2)]"
          rows={3}
          placeholder="e.g. Increase revenue 20% this quarter · Review all at-risk clients · Identify capacity risks across projects"
          value={goal}
          onChange={e => setGoal(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[var(--os-text-2)]">WAOE will plan, compile a DAG, execute steps, and write memory.</p>
          <button
            onClick={() => runWAOE.mutate(goal)}
            disabled={!goal.trim() || runWAOE.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50"
          >
            {runWAOE.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Planning…</> : <><Play className="w-3.5 h-3.5" />Execute</>}
          </button>
        </div>
      </div>

      {/* Latest run result */}
      {runResult && (
        <div className={cn('rounded-xl border p-4 space-y-2', runResult.ok ? 'border-green-500/30 bg-green-500/[0.03]' : 'border-red-500/30 bg-red-500/[0.03]')}>
          <div className="flex items-center gap-2">
            {runResult.ok ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            <p className="text-[12px] font-semibold text-[var(--os-text-1)]">{runResult.summary}</p>
            <span className="text-[10px] text-[var(--os-text-2)]">{runResult.durationMs}ms</span>
          </div>
          {runResult.plan && (
            <p className="text-[11px] text-[var(--os-text-2)]">
              Plan: {runResult.plan.intent} · {runResult.plan.steps?.length} steps · confidence {runResult.plan.confidence}%
            </p>
          )}
          {runResult.paused && (
            <p className="text-[11px] text-[#fdab3d]">Run paused — awaiting human approval. Find it in the runs list below.</p>
          )}
        </div>
      )}

      {/* Runs list */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Execution History</p>
        {runsLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-[var(--os-surface-0)] animate-pulse" />)}</div>
        ) : runs.length === 0 ? (
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] py-10 text-center">
            <Zap className="w-7 h-7 text-[var(--os-text-2)] mx-auto mb-2" />
            <p className="text-sm text-[var(--os-text-2)]">No workflow runs yet. Launch a goal above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {runs.map(r => <RunCard key={r.id} run={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
