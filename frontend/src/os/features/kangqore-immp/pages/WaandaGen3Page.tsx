import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Cpu, Plus, ChevronDown, ChevronRight, RefreshCw, CheckCircle2, XCircle, Loader2, Clock, Zap, ArrowRight, Copy, BarChart2, TrendingUp } from 'lucide-react'
import { api } from '@lib/api'
import { getSocket } from '@lib/socket'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'
const PURP = '#7c3aed'

// S116: priorResultCount added to Subtask for context-chain display
interface Subtask { id: string; label: string; status: string; agentRole: string; steps: string[]; result?: string; priorResultCount?: number }

interface Plan {
  id: string; goal: string; subtasks: Subtask[]; status: string
  gen2ModelId: string | null; failureCount: number
  replannedAt: string | null; completedAt: string | null; createdAt: string
}

interface Gen3Status {
  total: number; active: number; done: number; failed: number
  gen3Active: boolean; deployedModel: { providerModelId: string; benchmarkAccuracy: number } | null
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: AMB, ACTIVE: BLUE, DONE: GRN, FAILED: RED
}

const ROLE_COLOR: Record<string, string> = {
  RESEARCH: PURP, DIAGNOSTICS: BLUE, EXECUTION: GRN, COACH: AMB
}

interface RoleMetric {
  role: string; total: number; successRate: number; avgLatencyMs: number; avgResultLen: number
}

interface Gen3Performance {
  summary: { totalPlans: number; donePlans: number; failedPlans: number; planSuccessRate: number; avgPlanDurationMs: number }
  roleMetrics: RoleMetric[]
  recentPlans: Array<{ id: string; goal: string; status: string; durationMs: number | null; subtaskCount: number }>
}

export function WaandaGen3Page() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [showPerf, setShowPerf] = useState(false)

  const { data: status } = useQuery<Gen3Status>({
    queryKey: ['gen3-status'],
    queryFn: () => api.get('/admin/kangqore-immp/gen3/status').then(r => r.data),
    staleTime: 30_000,
  })

  const { data: plans = [], isLoading, refetch } = useQuery<Plan[]>({
    queryKey: ['gen3-plans'],
    queryFn: () => api.get('/admin/kangqore-immp/gen3/plans').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: false, // live updates via socket — no polling
  })

  // ── PLAN_PROGRESS socket listener ──
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handler = (data: any) => {
      if (data.type === 'PLAN_REPLANNED') {
        // New plan created — refetch to get it + update stats
        qc.invalidateQueries({ queryKey: ['gen3-plans'] })
        qc.invalidateQueries({ queryKey: ['gen3-status'] })
        return
      }
      if (data.type === 'PLAN_COMPLETE') {
        qc.invalidateQueries({ queryKey: ['gen3-status'] })
      }
      // Patch the specific plan in-place (no round-trip)
      // S116: inject priorResultCount into the active subtask for context-chain display
      const priorCount: number = data.priorResultCount ?? 0
      const patchedSubtasks = Array.isArray(data.subtasks)
        ? data.subtasks.map((st: Subtask) =>
            st.status === 'ACTIVE' ? { ...st, priorResultCount: priorCount } : st
          )
        : undefined
      qc.setQueryData<Plan[]>(['gen3-plans'], (old = []) =>
        old.map(p => p.id === data.planId
          ? {
              ...p,
              subtasks: patchedSubtasks ?? p.subtasks,
              status: data.planStatus ?? p.status,
              completedAt: data.planStatus === 'DONE' || data.planStatus === 'FAILED' ? new Date().toISOString() : p.completedAt,
            }
          : p
        )
      )
    }

    socket.on('PLAN_PROGRESS', handler)
    return () => { socket.off('PLAN_PROGRESS', handler) }
  }, [qc])

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Cpu className="w-6 h-6" style={{ color: PURP }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold" style={{ color: T1 }}>WAANDA Gen 3 Kernel</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(124,58,237,0.1)', color: PURP }}>S80 · P2</span>
                {status?.gen3Active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${GRN}15`, color: GRN }}>Gen2 Active</span>}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${BLUE}15`, color: BLUE }}>
                  <Zap className="w-2.5 h-2.5" /> Auto-Execute
                </span>
              </div>
              <p className="text-xs" style={{ color: T2 }}>Goal → PlanDecompositionTree → sequential auto-execution via MissionDispatcher. Live updates via WebSocket. Re-plans on 3 consecutive failures.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => refetch()} className="flex items-center gap-1 text-xs px-3 py-2 rounded-2xl border" style={{ color: T2, borderColor: BDR }}><RefreshCw className="w-3 h-3" /></button>
            <button onClick={() => setShowPerf(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border"
              style={showPerf ? { background: PURP, color: '#fff', borderColor: PURP } : { color: T2, borderColor: BDR }}>
              <BarChart2 className="w-3 h-3" /> Performance
            </button>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold" style={{ background: PURP, color: '#fff' }}><Plus className="w-3.5 h-3.5" /> New Plan</button>
          </div>
        </div>
      </div>

      {/* Gen2 guard banner */}
      {!status?.gen3Active && (
        <div className="rounded-2xl border p-4 flex items-center gap-4" style={{ background: `${AMB}08`, borderColor: `${AMB}30` }}>
          <Cpu className="w-5 h-5 flex-shrink-0" style={{ color: AMB }} />
          <div>
            <p className="text-sm font-bold" style={{ color: AMB }}>Gen2 model not deployed</p>
            <p className="text-xs mt-0.5" style={{ color: T2 }}>Gen3 plans can be created but will use Gen1 (Claude) as the reasoning engine. Deploy a Gen2 model from the Autonomy tab to enable native Gen3 execution.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {status && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Plans',  value: status.total,  color: BLUE },
            { label: 'Active',       value: status.active, color: AMB  },
            { label: 'Completed',    value: status.done,   color: GRN  },
            { label: 'Failed',       value: status.failed, color: RED  },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BDR }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {showPerf && <Gen3PerformancePanel />}

      {showCreate && <CreatePlanForm qc={qc} onClose={() => setShowCreate(false)} />}

      {/* Plan list */}
      {isLoading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: SURF }} />)}</div>
      ) : plans.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border" style={{ borderColor: BDR }}>
          <Cpu className="w-8 h-8 mx-auto mb-3 opacity-30" style={{ color: T2 }} />
          <p className="text-sm font-medium mb-3" style={{ color: T2 }}>No decomposition plans yet</p>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 rounded-2xl text-xs font-bold" style={{ background: PURP, color: '#fff' }}>Create First Plan</button>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(p => <PlanCard key={p.id} plan={p} />)}
        </div>
      )}
    </div>
  )
}

function ResultDrawer({ result, role }: { result: string; role: string }) {
  const [copied, setCopied] = useState(false)
  const roleColor = ROLE_COLOR[role] ?? T2

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-3 rounded-2xl border overflow-hidden" style={{ borderColor: `${PURP}30`, background: `${PURP}05` }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: `${PURP}20` }}>
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3" style={{ color: PURP }} />
          <span className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: PURP }}>KIMMP Output</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${roleColor}15`, color: roleColor }}>{role}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-2xl transition-all"
          style={{ background: copied ? `${GRN}15` : `${PURP}10`, color: copied ? GRN : PURP }}
        >
          {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: T1 }}>{result}</p>
      </div>
    </div>
  )
}

function PlanCard({ plan }: { plan: Plan }) {
  const [expanded, setExpanded] = useState(plan.status === 'ACTIVE')
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  // Auto-expand when plan becomes active
  useEffect(() => {
    if (plan.status === 'ACTIVE') setExpanded(true)
  }, [plan.status])

  const statusColor = STATUS_COLOR[plan.status] ?? T2
  const tasks = plan.subtasks as Subtask[]
  const done  = tasks.filter(t => t.status === 'DONE').length
  const active = tasks.filter(t => t.status === 'ACTIVE').length
  const pct   = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--os-surface-0)]" onClick={() => setExpanded(e => !e)}>
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${statusColor}15` }}>
          {plan.status === 'DONE'   ? <CheckCircle2 className="w-4 h-4" style={{ color: GRN }} />
          : plan.status === 'FAILED' ? <XCircle className="w-4 h-4" style={{ color: RED }} />
          : plan.status === 'ACTIVE' ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: BLUE }} />
          : <Clock className="w-4 h-4" style={{ color: AMB }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: T1 }}>{plan.goal}</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 max-w-32 h-1 rounded-full overflow-hidden" style={{ background: SURF }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: statusColor }} />
            </div>
            <span className="text-[10px] font-mono" style={{ color: T2 }}>{done}/{tasks.length} subtasks</span>
            {active > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: BLUE }}>
                <Loader2 className="w-2.5 h-2.5 animate-spin" /> executing
              </span>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${statusColor}15`, color: statusColor }}>{plan.status}</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} /> : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T2 }} />}
      </div>

      {expanded && (
        <div className="border-t px-5 pb-5 pt-4 space-y-2" style={{ borderColor: BDR }}>
          {/* Execution pipeline */}
          <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
            {tasks.map((t, idx) => {
              const tc = STATUS_COLOR[t.status] ?? T2
              return (
                <div key={t.id} className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl text-[10px] font-bold border"
                    style={{ background: `${tc}12`, borderColor: `${tc}30`, color: tc }}>
                    {t.status === 'ACTIVE' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                    {t.status === 'DONE' && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {t.status === 'FAILED' && <XCircle className="w-2.5 h-2.5" />}
                    {t.status === 'PENDING' && <Clock className="w-2.5 h-2.5" />}
                    {idx + 1}
                  </div>
                  {idx < tasks.length - 1 && <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: T2, opacity: 0.3 }} />}
                </div>
              )
            })}
          </div>

          {/* Subtask detail rows */}
          {tasks.map((t, idx) => {
            const tColor = STATUS_COLOR[t.status] ?? T2
            const roleColor = ROLE_COLOR[t.agentRole] ?? T2
            const isOpen = expandedTask === t.id
            return (
              <div key={t.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: BDR }}>
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpandedTask(isOpen ? null : t.id)} style={{ background: SURF }}>
                  <span className="text-[10px] font-black w-5 text-center" style={{ color: T2 }}>{idx + 1}</span>
                  {t.status === 'ACTIVE' && <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" style={{ color: BLUE }} />}
                  <span className="flex-1 text-xs font-bold" style={{ color: T1 }}>{t.label}</span>
                  {/* S116: context-chain tag */}
                  {t.status === 'ACTIVE' && t.priorResultCount != null && t.priorResultCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${PURP}12`, color: PURP }}>
                      ctx:{t.priorResultCount}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${roleColor}15`, color: roleColor }}>{t.agentRole}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${tColor}15`, color: tColor }}>{t.status}</span>
                  {isOpen ? <ChevronDown className="w-3 h-3" style={{ color: T2 }} /> : <ChevronRight className="w-3 h-3" style={{ color: T2 }} />}
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 pt-2">
                    {t.steps.map((s, si) => (
                      <div key={si} className="flex items-center gap-2 py-1">
                        <span className="text-[9px] font-black w-4 text-center rounded" style={{ background: `${PURP}15`, color: PURP }}>{si + 1}</span>
                        <span className="text-[11px]" style={{ color: T2 }}>{s}</span>
                      </div>
                    ))}
                    {t.result && t.status === 'DONE' && <ResultDrawer result={t.result} role={t.agentRole} />}
                  </div>
                )}
              </div>
            )
          })}
          <p className="text-[10px] pt-1" style={{ color: T2 }}>
            Created {new Date(plan.createdAt).toLocaleString()}
            {plan.replannedAt && ` · Replanned ${new Date(plan.replannedAt).toLocaleString()}`}
            {plan.completedAt && ` · Completed ${new Date(plan.completedAt).toLocaleString()}`}
            {plan.failureCount > 0 && ` · ${plan.failureCount} failure(s)`}
          </p>
        </div>
      )}
    </div>
  )
}

function Gen3PerformancePanel() {
  const { data: perf, isLoading, refetch } = useQuery<Gen3Performance>({
    queryKey: ['gen3-performance'],
    queryFn:  () => api.get('/admin/kangqore-immp/gen3/performance').then(r => r.data),
    staleTime: 60_000,
  })

  const ROLE_COLOR_MAP: Record<string, string> = {
    RESEARCH: PURP, DIAGNOSTICS: BLUE, EXECUTION: GRN, COACH: AMB
  }

  const maxLatency = Math.max(...(perf?.roleMetrics.map(r => r.avgLatencyMs) ?? [1]), 1)

  return (
    <div className="rounded-2xl border space-y-4 p-5" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: PURP }} />
          <p className="text-sm font-bold" style={{ color: T1 }}>Gen 3 Performance Dashboard</p>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${PURP}15`, color: PURP }}>S111</span>
        </div>
        <button onClick={() => refetch()} className="p-1.5 rounded-2xl" style={{ color: T2 }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading && <div className="h-32 rounded-2xl animate-pulse" style={{ background: SURF }} />}

      {perf && (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: 'Total plans', value: perf.summary.totalPlans, color: BLUE },
              { label: 'Completed',   value: perf.summary.donePlans, color: GRN },
              { label: 'Failed',      value: perf.summary.failedPlans, color: RED },
              { label: 'Success rate', value: `${perf.summary.planSuccessRate}%`, color: GRN },
              { label: 'Avg duration', value: perf.summary.avgPlanDurationMs > 0 ? `${(perf.summary.avgPlanDurationMs / 1000).toFixed(1)}s` : '—', color: AMB },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 border text-center" style={{ background: SURF, borderColor: BDR }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: T2 }}>{s.label}</p>
                <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Role latency breakdown */}
          {perf.roleMetrics.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Latency by Agent Role</p>
              <div className="space-y-2">
                {perf.roleMetrics.map(r => {
                  const color = ROLE_COLOR_MAP[r.role] ?? T2
                  const barPct = (r.avgLatencyMs / maxLatency) * 100
                  return (
                    <div key={r.role} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold w-24 flex-shrink-0" style={{ color }}>{r.role}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: SURF }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barPct}%`, background: color }} />
                      </div>
                      <span className="text-[10px] font-mono w-16 text-right" style={{ color: T2 }}>
                        {r.avgLatencyMs > 0 ? `${r.avgLatencyMs}ms` : '—'}
                      </span>
                      <span className="text-[10px] w-12 text-right" style={{ color: GRN }}>{r.successRate}%</span>
                      <span className="text-[9px] w-8 text-right" style={{ color: T2 }}>{r.total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent plan latency table */}
          {perf.recentPlans.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: T2 }}>Recent Plans</p>
              <div className="space-y-1">
                {perf.recentPlans.slice(0, 6).map(p => {
                  const sc = STATUS_COLOR[p.status] ?? T2
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-2xl" style={{ background: SURF }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc }} />
                      <span className="flex-1 text-[11px] truncate" style={{ color: T1 }}>{p.goal}</span>
                      <span className="text-[10px] font-mono flex-shrink-0" style={{ color: T2 }}>{p.subtaskCount} tasks</span>
                      <span className="text-[10px] font-mono flex-shrink-0 w-16 text-right" style={{ color: sc }}>
                        {p.durationMs != null ? `${(p.durationMs / 1000).toFixed(1)}s` : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CreatePlanForm({ qc, onClose }: { qc: ReturnType<typeof useQueryClient>; onClose: () => void }) {
  const [goal, setGoal] = useState('')
  const [concurrencyError, setConcurrencyError] = useState('')

  const create = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/gen3/plans', { goal }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gen3-plans'] })
      qc.invalidateQueries({ queryKey: ['gen3-status'] })
      onClose()
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.error ?? e?.message ?? 'Failed to create plan'
      setConcurrencyError(msg)
    },
  })

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ background: CARD, borderColor: BDR }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold" style={{ color: T1 }}>Decompose New Goal</p>
        <button onClick={onClose} className="text-xs" style={{ color: T2 }}>Cancel</button>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: `${BLUE}10`, border: `1px solid ${BLUE}25` }}>
        <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BLUE }} />
        <p className="text-xs" style={{ color: T2 }}>Gen 3 will decompose your goal into 6 sequential subtasks and <strong style={{ color: BLUE }}>execute them automatically</strong> — no manual advancement required.</p>
      </div>
      {concurrencyError && (
        <div className="px-3 py-2 rounded-2xl text-xs" style={{ background: `${RED}10`, border: `1px solid ${RED}25`, color: RED }}>
          {concurrencyError}
        </div>
      )}
      <div>
        <p className="text-[10px] font-semibold mb-1" style={{ color: T2 }}>Strategic Goal</p>
        <textarea value={goal} onChange={e => { setGoal(e.target.value); setConcurrencyError('') }} rows={3}
          placeholder="e.g. Identify the top 3 reasons Customer Zero's COIG velocity dropped in Q3 and propose corrective actions"
          className="w-full px-3 py-2 text-xs rounded-2xl border focus:outline-none resize-none"
          style={{ borderColor: BDR, background: SURF, color: T1 }} />
      </div>
      <button disabled={!goal.trim() || create.isPending} onClick={() => create.mutate()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40"
        style={{ background: PURP, color: '#fff' }}>
        <Cpu className="w-4 h-4" />
        {create.isPending ? 'Decomposing & Executing…' : 'Create & Auto-Execute'}
      </button>
    </div>
  )
}
