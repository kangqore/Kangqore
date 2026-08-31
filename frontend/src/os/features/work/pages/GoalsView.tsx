// Goals View — OKR-style dashboard
// WorkGoal → objectId links to OntologyObject for full graph traversal

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Plus, RefreshCw, Target, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@design-system/cn'

interface WorkGoal {
  id: string; title: string; description?: string | null
  type: string; status: string; progress: number
  startDate?: string | null; dueDate?: string | null
  ownerId?: string | null; ownerName?: string | null
  parentId?: string | null
  objectId?: string | null
  keyResults: any[]; children: WorkGoal[]
  createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
  ON_TRACK:  'text-emerald-400 bg-emerald-400/10',
  AT_RISK:   'text-amber-400 bg-amber-400/10',
  BEHIND:    'text-red-400 bg-red-400/10',
  COMPLETED: 'text-violet-400 bg-violet-400/10',
  CANCELLED: 'text-[var(--os-text-3)] bg-[var(--os-bg-2)]',
}

const PROGRESS_COLOR = (p: number) => p >= 80 ? 'bg-emerald-500' : p >= 40 ? 'bg-amber-500' : 'bg-red-500'

function GoalRow({ goal, depth = 0 }: { goal: WorkGoal; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = goal.children?.length > 0

  return (
    <div>
      <div className={cn(
        'border border-[var(--os-border)] rounded-2xl p-4 mb-2 bg-[var(--os-bg-1)] hover:bg-[var(--os-bg-hover)] transition-colors',
        depth > 0 && 'ml-6 border-l-2 border-l-violet-500/30'
      )}>
        <div className="flex items-start gap-3">
          {/* Expand toggle */}
          {hasChildren ? (
            <button onClick={() => setExpanded(e => !e)} className="mt-0.5 text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-4 h-4 mt-0.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--os-text-3)]" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-semibold text-[var(--os-text-1)]">{goal.title}</span>
              <span className="text-xs text-[var(--os-text-3)] bg-[var(--os-bg-2)] px-1.5 py-0.5 rounded">{goal.type}</span>
              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', STATUS_STYLE[goal.status] ?? STATUS_STYLE['CANCELLED'])}>
                {goal.status?.replace('_', ' ')}
              </span>
            </div>

            {goal.description && (
              <p className="text-xs text-[var(--os-text-2)] mb-2">{goal.description}</p>
            )}

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', PROGRESS_COLOR(goal.progress))}
                     style={{ width: `${goal.progress}%` }} />
              </div>
              <span className="text-xs text-[var(--os-text-2)] w-8 text-right">{goal.progress}%</span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-xs text-[var(--os-text-3)]">
              {goal.ownerName && <span>{goal.ownerName}</span>}
              {goal.dueDate && <span>Due {new Date(goal.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
              {goal.objectId && <span className="text-violet-400 font-mono">OBJ</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && goal.children.map(child => (
        <GoalRow key={child.id} goal={child} depth={depth + 1} />
      ))}
    </div>
  )
}

function CreateGoalModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ title: '', description: '', type: 'OBJECTIVE', dueDate: '' })

  const create = useMutation({
    mutationFn: (data: any) => api.post('/admin/work-os/work/goals', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['work', 'goals'] }); onClose() },
  })

  const inp = 'text-sm bg-[var(--os-bg-2)] border border-[var(--os-border)] rounded px-3 py-2 text-[var(--os-text-1)] w-full focus:outline-none focus:border-violet-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--os-bg-1)] border border-[var(--os-border)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
           onClick={e => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-[var(--os-text-1)] mb-4">New Goal</h2>
        <div className="space-y-3">
          <input className={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                 placeholder="Goal title…" autoFocus />
          <textarea className={`${inp} resize-none`} rows={2} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description…" />
          <div className="grid grid-cols-2 gap-3">
            <select className={inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {['OBJECTIVE', 'KEY_RESULT', 'INITIATIVE', 'MILESTONE'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
            </select>
            <input type="date" className={inp} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => create.mutate(form)} disabled={!form.title.trim() || create.isPending}
              className="flex-1 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded transition-colors disabled:opacity-50">
              {create.isPending ? 'Creating…' : 'Create Goal'}
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GoalsView() {
  const [showCreate, setShowCreate] = useState(false)

  const { data = [], isLoading, isFetching, refetch } = useQuery<WorkGoal[]>({
    queryKey: ['work', 'goals'],
    queryFn: () => api.get('/admin/work-os/work/goals').then(r => r.data.goals ?? []),
    staleTime: 60_000,
  })

  const roots = data.filter(g => !g.parentId)
  // ON_TRACK is not one of the twelve states; on track means moving and not in trouble.
  const totalOnTrack = data.filter(g => g.status === 'IN_PROGRESS' || g.status === 'COMPLETED').length
  const avgProgress = data.length ? Math.round(data.reduce((s, g) => s + (g.progress ?? 0), 0) / data.length) : 0

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading goals…</div>

  return (
    <div>
      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Target className="w-4 h-4" />
          <span>{data.length} goals</span>
        </div>
        {data.length > 0 && (
          <>
            <span className="text-xs text-emerald-400">{totalOnTrack} on track</span>
            <span className="text-xs text-[var(--os-text-2)]">{avgProgress}% avg progress</span>
          </>
        )}
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded transition-colors ml-auto">
          <Plus className="w-3.5 h-3.5" />New Goal
        </button>
      </div>

      {roots.length === 0 ? (
        <div className="border border-[var(--os-border)] rounded-2xl h-64 flex items-center justify-center text-sm text-[var(--os-text-2)]">
          No goals yet. Create one to track OKRs and milestones.
        </div>
      ) : (
        <div>{roots.map(g => <GoalRow key={g.id} goal={g} />)}</div>
      )}

      {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
