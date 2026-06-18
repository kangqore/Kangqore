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
    <div className={`bg-[#151C2F] border border-[#2E2854] rounded-xl shadow-sm overflow-hidden ${atRisk ? 'border-l-4 border-l-amber-400' : ''}`}>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            goal.status === 'ACTIVE' ? 'bg-green-100' :
            goal.status === 'COMPLETED' ? 'bg-[#151C2F]' :
            goal.status === 'FAILED' ? 'bg-red-100' : 'bg-blue-50'
          }`}>
            <Target className={`w-3.5 h-3.5 ${
              goal.status === 'ACTIVE' ? 'text-green-600' :
              goal.status === 'COMPLETED' ? 'text-slate-500' :
              goal.status === 'FAILED' ? 'text-red-500' : 'text-blue-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">{goal.objective}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={status.badge} size="sm">{status.label}</Badge>
              {goal.deadline && (
                <span className={`text-[10px] flex items-center gap-1 ${
                  atRisk ? 'text-amber-600 font-bold' : 'text-slate-500'
                }`}>
                  <Clock className="w-2.5 h-2.5" />
                  {dl !== null ? (dl > 0 ? `${dl}d left` : `${Math.abs(dl)}d overdue`) : formatDate(goal.deadline)}
                </span>
              )}
              <span className="text-[10px] text-slate-500">{formatDate(goal.createdAt)}</span>
            </div>
          </div>

          {goal.status === 'PENDING' && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => onApprove(goal.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <Check className="w-3 h-3" />
                Approve
              </button>
              <button
                onClick={() => onCancel(goal.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {goal.status === 'ACTIVE' && (
            <button
              onClick={() => onCancel(goal.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
              title="Cancel goal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {goal.status === 'ACTIVE' && (
          <div className="ml-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Progress</span>
              <span className="text-[10px] font-bold text-slate-300">{goal.progressPct}%</span>
            </div>
            <div className="h-1.5 bg-[#151C2F] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  goal.progressPct >= 70 ? 'bg-green-400' : atRisk ? 'bg-amber-400' : 'bg-blue-400'
                }`}
                style={{ width: `${goal.progressPct}%` }}
              />
            </div>
            {atRisk && (
              <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3 h-3" />
                At risk — {dl}d left, {goal.progressPct}% done
              </p>
            )}
          </div>
        )}

        {goal.tasks?.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="ml-10 flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Hide tasks' : `${goal.tasks.length} tasks (${goal.tasks.filter(t => t.status === 'COMPLETED').length} done)`}
          </button>
        )}

        {expanded && goal.tasks?.length > 0 && (
          <div className="ml-10 space-y-1.5">
            {goal.tasks.map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#0F172A] border border-[#2E2854]">
                <button
                  onClick={() => task.status !== 'COMPLETED' && onCompleteTask(goal.id, task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-all ${
                    task.status === 'COMPLETED'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-[#2E2854] hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {task.status === 'COMPLETED' && <Check className="w-3 h-3" />}
                </button>
                <p className={`text-xs flex-1 ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-300'}`}>
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
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-[#2E2854] text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-300 transition-all w-full"
      >
        <Plus className="w-4 h-4" />
        Set a new goal for KIMMP
      </button>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
      <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        New Strategic Goal
      </p>
      <textarea
        value={objective}
        onChange={e => setObjective(e.target.value)}
        placeholder="Describe the goal — e.g. 'Win 3 government education tech contracts by Q3 2026'"
        rows={3}
        className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2.5 bg-[#151C2F] outline-none resize-none focus:border-blue-400 text-slate-200 placeholder:text-slate-300"
      />
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="text-sm border border-blue-200 rounded-lg px-3 py-2 bg-[#151C2F] outline-none focus:border-blue-400 text-slate-300"
        />
        <span className="text-xs text-slate-500">Deadline (optional)</span>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!objective.trim() || creating}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {creating ? <Spinner size="sm" /> : <Plus className="w-3 h-3" />}
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

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">Goal Engine</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            KIMMP breaks strategic goals into tasks and tracks execution autonomously.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-[#151C2F] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingGoals ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Leverage + stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Leverage Score', value: leverage?.score ?? '—',    color: 'text-green-600 bg-green-50',   icon: TrendingUp },
          { label: 'Active Goals',   value: activeGoals.length,        color: 'text-blue-600 bg-blue-50',    icon: Target     },
          { label: 'Pending Review', value: pendingGoals.length,       color: 'text-amber-600 bg-amber-50',  icon: Clock      },
          { label: 'Completed',      value: completedGoals.length,     color: 'text-slate-300 bg-[#0F172A]',  icon: Check      },
        ].map(s => (
          <div key={s.label} className="bg-[#151C2F] border border-[#2E2854] rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create form */}
      <CreateGoalForm onCreate={() => {}} />

      {/* Pending approval */}
      {pendingGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
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
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
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
          <h3 className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-2">
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
        <div className="flex flex-col items-center justify-center py-20 bg-[#151C2F] border border-[#2E2854] rounded-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm font-semibold text-slate-300">No goals yet</p>
          <p className="text-xs text-slate-500 mt-1">Set a strategic goal above — KIMMP will break it into tasks and track progress.</p>
        </div>
      )}
    </div>
  )
}
