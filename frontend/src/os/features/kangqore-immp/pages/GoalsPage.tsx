import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Target, Plus, Check, X, ChevronDown, ChevronUp,
  Clock, TrendingUp, RefreshCw, Zap, AlertTriangle,
} from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface GoalTask {
  id: string
  description: string
  status: string
  result?: string
}

interface Goal {
  id: string
  objective: string
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
  progressPct: number
  deadline?: string
  tasks: GoalTask[]
  createdAt: string
  approvedAt?: string
}

interface LeverageScore {
  score: number
  label: string
  activeGoals: number
  completedThisMonth: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { badge: 'info' | 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
  PENDING:   { badge: 'info',    label: 'Pending Approval' },
  ACTIVE:    { badge: 'success', label: 'Active'           },
  COMPLETED: { badge: 'neutral', label: 'Completed'        },
  CANCELLED: { badge: 'neutral', label: 'Cancelled'        },
  FAILED:    { badge: 'danger',  label: 'Failed'           },
}

function daysLeft(deadline?: string) {
  if (!deadline) return null
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
  return diff
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Goal card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  onApprove,
  onCancel,
  onCompleteTask,
}: {
  goal: Goal
  onApprove: (id: string) => void
  onCancel: (id: string) => void
  onCompleteTask: (goalId: string, taskId: string) => void
}) {
  const [expanded, setExpanded]   = useState(false)
  const status = STATUS_CONFIG[goal.status] ?? STATUS_CONFIG.PENDING
  const dl     = daysLeft(goal.deadline)
  const atRisk = goal.status === 'ACTIVE' && dl !== null && dl <= 7 && goal.progressPct < 70

  return (
    <div className="p-6 transition-transform hover:-translate-y-1" style={{ background: atRisk ? 'rgba(251,191,36,0.1)' : 'var(--os-card)', borderRadius: 'var(--os-radius-xl)', boxShadow: atRisk ? '0 16px 32px rgba(251,191,36,0.15)' : '0 16px 32px rgba(0,0,0,0.04)' }}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            goal.status === 'ACTIVE' ? 'bg-green-100/50' :
            goal.status === 'COMPLETED' ? 'bg-slate-100' :
            goal.status === 'FAILED' ? 'bg-red-100/50' : 'bg-blue-50/50'
          }`}>
            <Target className={`w-5 h-5 ${
              goal.status === 'ACTIVE' ? 'text-green-600' :
              goal.status === 'COMPLETED' ? 'text-slate-500' :
              goal.status === 'FAILED' ? 'text-red-500' : 'text-blue-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--os-text-1)] leading-snug">{goal.objective}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant={status.badge} size="sm">{status.label}</Badge>
              {goal.deadline && (
                <span className={`text-[11px] font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                  atRisk ? 'text-amber-600 bg-amber-50' : 'text-[var(--os-text-2)] bg-[var(--os-surface-0)]'
                }`}>
                  <Clock className="w-3 h-3" />
                  {dl !== null ? (dl > 0 ? `${dl}d left` : `${Math.abs(dl)}d overdue`) : formatDate(goal.deadline)}
                </span>
              )}
              <span className="text-[11px] text-[var(--os-text-2)]">{formatDate(goal.createdAt)}</span>
            </div>
          </div>

          {goal.status === 'PENDING' && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onApprove(goal.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm shadow-green-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
              <button
                onClick={() => onCancel(goal.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--os-text-2)] hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {goal.status === 'ACTIVE' && (
            <button
              onClick={() => onCancel(goal.id)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--os-text-2)] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              title="Cancel goal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {goal.status === 'ACTIVE' && (
          <div className="ml-14 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">Progress</span>
              <span className="text-xs font-bold text-[var(--os-text-1)]">{goal.progressPct}%</span>
            </div>
            <div className="h-2 bg-[var(--os-surface-0)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  goal.progressPct >= 70 ? 'bg-green-500' : atRisk ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${goal.progressPct}%` }}
              />
            </div>
            {atRisk && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1.5 font-bold mt-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                At risk — {dl}d left, {goal.progressPct}% done
              </p>
            )}
          </div>
        )}

        {goal.tasks?.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="ml-14 flex items-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Hide tasks' : `${goal.tasks.length} tasks (${goal.tasks.filter(t => t.status === 'COMPLETED').length} done)`}
          </button>
        )}

        {expanded && goal.tasks?.length > 0 && (
          <div className="ml-14 space-y-2">
            {goal.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)]/50">
                <button
                  onClick={() => task.status !== 'COMPLETED' && onCompleteTask(goal.id, task.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-500 text-white shadow-sm shadow-green-500/20'
                      : 'border-2 border-[var(--os-border)] bg-white hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {task.status === 'COMPLETED' && <Check className="w-3.5 h-3.5" />}
                </button>
                <p className={`text-sm flex-1 font-semibold ${task.status === 'COMPLETED' ? 'line-through text-[var(--os-text-2)]' : 'text-[var(--os-text-1)]'}`}>
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Create form ──────────────────────────────────────────────────────────────

function CreateGoalForm({ onCreate }: { onCreate: () => void }) {
  const [open,      setOpen]      = useState(false)
  const [objective, setObjective] = useState('')
  const [deadline,  setDeadline]  = useState('')
  const [creating,  setCreating]  = useState(false)
  const qc = useQueryClient()

  async function submit() {
    if (!objective.trim() || creating) return
    setCreating(true)
    try {
      await api.post('/admin/kangqore-immp/goals', {
        objective: objective.trim(),
        deadline: deadline || undefined,
      })
      setObjective('')
      setDeadline('')
      setOpen(false)
      qc.invalidateQueries({ queryKey: ['goals'] })
      onCreate()
    } finally {
      setCreating(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-[var(--os-border)] text-sm font-bold text-[var(--os-text-2)] hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all w-full"
        style={{ borderRadius: 'var(--os-radius-xl)' }}
      >
        <div className="w-8 h-8 rounded-xl bg-[var(--os-surface-0)] flex items-center justify-center text-[var(--os-text-2)] group-hover:bg-blue-100 group-hover:text-blue-600">
          <Plus className="w-5 h-5" />
        </div>
        Set a new goal for KIMMP
      </button>
    )
  }

  return (
    <div className="bg-[var(--os-card)] p-6 space-y-4 shadow-[0_32px_64px_rgba(0,0,0,0.04)]" style={{ borderRadius: 'var(--os-radius-xl)' }}>
      <p className="text-base font-bold text-[var(--os-text-1)] flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        New Strategic Goal
      </p>
      <textarea
        value={objective}
        onChange={e => setObjective(e.target.value)}
        placeholder="Describe the goal — e.g. 'Win 3 government education tech contracts by Q3 2026'"
        rows={3}
        className="w-full text-sm border border-[var(--os-border)] rounded-lg px-3 py-2.5 bg-[var(--os-surface-0)] outline-none resize-none focus:border-[#579bfc] text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)]"
      />
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="text-sm border border-[var(--os-border)] rounded-lg px-3 py-2 bg-[var(--os-surface-0)] outline-none focus:border-[#579bfc] text-[var(--os-text-1)]"
        />
        <span className="text-xs text-[var(--os-text-2)]">Deadline (optional)</span>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 text-xs font-medium text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!objective.trim() || creating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold hover:-translate-y-1 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2564ea 100%)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
          >
            {creating ? <Spinner size="sm" /> : <Plus className="w-4 h-4" />}
            Create Goal
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function GoalsPage() {
  const qc = useQueryClient()

  const { data: goalsData, isLoading: loadingGoals, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get('/admin/kangqore-immp/goals', { params: { limit: 30 } }).then(r => r.data),
    staleTime: 30_000,
  })

  const { data: leverageData } = useQuery({
    queryKey: ['leverage'],
    queryFn: () => api.get('/admin/kangqore-immp/leverage').then(r => r.data),
    staleTime: 60_000,
  })

  const goals: Goal[] = goalsData?.goals ?? []
  const leverage: LeverageScore | null = leverageData ?? null

  const activeGoals    = goals.filter(g => g.status === 'ACTIVE')
  const pendingGoals   = goals.filter(g => g.status === 'PENDING')
  const completedGoals = goals.filter(g => g.status === 'COMPLETED')

  async function approve(id: string) {
    await api.post(`/admin/kangqore-immp/goals/${id}/approve`)
    qc.invalidateQueries({ queryKey: ['goals'] })
  }

  async function cancel(id: string) {
    await api.post(`/admin/kangqore-immp/goals/${id}/cancel`)
    qc.invalidateQueries({ queryKey: ['goals'] })
  }

  async function completeTask(goalId: string, taskId: string) {
    await api.post(`/admin/kangqore-immp/goals/${goalId}/tasks/${taskId}/complete`)
    qc.invalidateQueries({ queryKey: ['goals'] })
  }

  const statTiles = [
    { label: 'Leverage Score', value: leverage?.score ?? '—', accent: '#00c875', icon: TrendingUp },
    { label: 'Active Goals',   value: activeGoals.length,     accent: '#579bfc', icon: Target     },
    { label: 'Pending Review', value: pendingGoals.length,    accent: '#fdab3d', icon: Clock      },
    { label: 'Completed',      value: completedGoals.length,  accent: '#94a3b8', icon: Check      },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 pb-5 mb-1 border-b border-[var(--os-border)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Target className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Goal Engine</h2>
          <p className="text-xs text-[var(--os-text-2)]">
            KIMMP breaks strategic goals into tasks and tracks execution autonomously.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)] border border-[var(--os-border)] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingGoals ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Leverage + stats */}
      <div className="grid grid-cols-4 gap-4">
        {statTiles.map(s => (
          <div key={s.label} className="relative overflow-hidden flex flex-col p-5 transition-all duration-300"
            style={{
              background: s.accent,
              color: '#ffffff',
              borderRadius: 'var(--os-radius-xl)',
              boxShadow: `0 12px 32px ${s.accent}60`,
              border: 'none',
            }}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))', pointerEvents: 'none' }} />
            
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
              <s.icon style={{ width: 18, height: 18, color: '#ffffff' }} />
            </div>
            <p className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {s.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Create form */}
      <CreateGoalForm onCreate={() => {}} />

      {/* Pending approval */}
      {pendingGoals.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Approval ({pendingGoals.length})
          </h3>
          <div className="space-y-3">
            {pendingGoals.map(g => (
              <GoalCard key={g.id} goal={g} onApprove={approve} onCancel={cancel} onCompleteTask={completeTask} />
            ))}
          </div>
        </div>
      )}

      {/* Active */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            Active Goals ({activeGoals.length})
          </h3>
          <div className="space-y-3">
            {activeGoals.map(g => (
              <GoalCard key={g.id} goal={g} onApprove={approve} onCancel={cancel} onCompleteTask={completeTask} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-2)] mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Completed ({completedGoals.length})
          </h3>
          <div className="space-y-3">
            {completedGoals.map(g => (
              <GoalCard key={g.id} goal={g} onApprove={approve} onCancel={cancel} onCompleteTask={completeTask} />
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loadingGoals && goals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--os-card)] shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center" style={{ borderRadius: 'var(--os-radius-xl)' }}>
          <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center mb-6">
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-lg font-bold text-[var(--os-text-1)]">No active goals</p>
          <p className="text-sm text-[var(--os-text-2)] mt-2">Set a strategic goal above — KIMMP will break it into tasks and track progress autonomously.</p>
        </div>
      )}
    </div>
  )
}
