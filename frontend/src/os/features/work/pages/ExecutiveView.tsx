// Executive Command Center — rolled-up health view across all work
// KPI tiles + status breakdown + velocity trend + blocked items

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, CheckCircle2, AlertCircle, Clock, TrendingUp, BarChart3, Layers } from 'lucide-react'
import { cn } from '@design-system/cn'

interface ExecutiveData {
  summary: {
    total: number; done: number; inProgress: number
    blocked: number; overdue: number; completionRate: number
  }
  byType: Record<string, number>
  byPriority: Record<string, number>
  byStatus: Record<string, number>
  recentlyCompleted: Array<{ id: string; title: string; type: string; completedAt: string }>
  blockedItems: Array<{ id: string; title: string; priority: string; assigneeName?: string | null; dueDate?: string | null }>
  portfolioHealth: Array<{ id: string; name: string; progress: number; status: string; itemCount: number }>
}

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-400', HIGH: 'text-orange-400', MEDIUM: 'text-violet-400', LOW: 'text-slate-400',
}
const PRIORITY_BAR: Record<string, string> = {
  CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MEDIUM: 'bg-violet-500', LOW: 'bg-slate-500',
}

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: number | string; sub?: string; color?: string
}) {
  return (
    <div className="border border-[var(--os-border)] rounded-2xl p-4 bg-[var(--os-bg-1)] flex items-start gap-3">
      <div className={cn('w-8 h-8 rounded-2xl flex items-center justify-center shrink-0', color ?? 'bg-violet-500/10')}>
        <Icon className={cn('w-4 h-4', color ? 'text-white' : 'text-violet-400')} />
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--os-text-1)] leading-none mb-0.5">{value}</div>
        <div className="text-xs font-medium text-[var(--os-text-1)]">{label}</div>
        {sub && <div className="text-xs text-[var(--os-text-3)] mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export function ExecutiveView() {
  const { data, isLoading, isFetching, refetch } = useQuery<ExecutiveData>({
    queryKey: ['work', 'executive'],
    queryFn: () => api.get('/admin/work/executive').then(r => r.data),
    staleTime: 60_000,
  })

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading command center…</div>

  const s = data?.summary ?? { total: 0, done: 0, inProgress: 0, blocked: 0, overdue: 0, completionRate: 0 }
  const byStatus = data?.byStatus ?? {}
  const byPriority = data?.byPriority ?? {}
  const byType = data?.byType ?? {}
  const portfolios = data?.portfolioHealth ?? []
  const blocked = data?.blockedItems ?? []
  const completed = data?.recentlyCompleted ?? []

  const statusEntries = Object.entries(byStatus).sort((a, b) => b[1] - a[1])
  const maxStatus = Math.max(...statusEntries.map(([, v]) => v), 1)
  const priorityEntries = Object.entries(byPriority).sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return (order[a[0] as keyof typeof order] ?? 4) - (order[b[0] as keyof typeof order] ?? 4)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)]">Executive Command Center</h2>
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard icon={Layers}        label="Total Items"     value={s.total}                    />
        <KpiCard icon={CheckCircle2}  label="Completed"       value={s.done}                     sub={`${s.completionRate}% rate`} />
        <KpiCard icon={TrendingUp}    label="In Progress"     value={s.inProgress}               />
        <KpiCard icon={AlertCircle}   label="Blocked"         value={s.blocked}                  color={s.blocked > 0 ? 'bg-red-500' : undefined} />
        <KpiCard icon={Clock}         label="Overdue"         value={s.overdue}                  color={s.overdue > 0 ? 'bg-amber-500' : undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <div className="border border-[var(--os-border)] rounded-2xl p-4 bg-[var(--os-bg-1)]">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-[var(--os-text-1)]">By Status</span>
          </div>
          <div className="space-y-2">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-24 text-xs text-[var(--os-text-2)] truncate">{status.replace('_',' ')}</div>
                <div className="flex-1 h-2 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(count / maxStatus) * 100}%` }} />
                </div>
                <div className="w-6 text-xs text-[var(--os-text-2)] text-right">{count}</div>
              </div>
            ))}
            {statusEntries.length === 0 && <p className="text-xs text-[var(--os-text-3)]">No items yet</p>}
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="border border-[var(--os-border)] rounded-2xl p-4 bg-[var(--os-bg-1)]">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-[var(--os-text-1)]">By Priority</span>
          </div>
          <div className="space-y-2">
            {priorityEntries.map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-2">
                <div className={cn('w-24 text-xs truncate', PRIORITY_COLOR[priority] ?? 'text-[var(--os-text-2)]')}>{priority}</div>
                <div className="flex-1 h-2 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', PRIORITY_BAR[priority] ?? 'bg-slate-500')}
                       style={{ width: `${(count / Math.max(...priorityEntries.map(([,v]) => v), 1)) * 100}%` }} />
                </div>
                <div className="w-6 text-xs text-[var(--os-text-2)] text-right">{count}</div>
              </div>
            ))}
            {priorityEntries.length === 0 && <p className="text-xs text-[var(--os-text-3)]">No items yet</p>}
          </div>
        </div>
      </div>

      {/* Portfolio health */}
      {portfolios.length > 0 && (
        <div className="border border-[var(--os-border)] rounded-2xl p-4 bg-[var(--os-bg-1)]">
          <div className="text-sm font-medium text-[var(--os-text-1)] mb-4">Portfolio Health</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map(p => (
              <div key={p.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--os-text-1)] truncate">{p.name}</span>
                  <span className="text-xs text-[var(--os-text-3)] ml-1">{p.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all',
                    p.progress >= 75 ? 'bg-emerald-500' : p.progress >= 40 ? 'bg-violet-500' : 'bg-amber-500')}
                    style={{ width: `${p.progress}%` }} />
                </div>
                <div className="text-xs text-[var(--os-text-3)]">{p.itemCount} items · {p.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Blocked items */}
        {blocked.length > 0 && (
          <div className="border border-red-500/20 rounded-2xl p-4 bg-red-500/5">
            <div className="text-sm font-medium text-red-400 mb-3">Blocked Items ({blocked.length})</div>
            <div className="space-y-2">
              {blocked.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--os-text-1)] truncate">{item.title}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.assigneeName && <span className="text-xs text-[var(--os-text-3)]">{item.assigneeName}</span>}
                    <span className={cn('text-xs font-medium', PRIORITY_COLOR[item.priority] ?? 'text-[var(--os-text-2)]')}>{item.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently completed */}
        {completed.length > 0 && (
          <div className="border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/5">
            <div className="text-sm font-medium text-emerald-400 mb-3">Recently Completed</div>
            <div className="space-y-2">
              {completed.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--os-text-1)] line-through truncate">{item.title}</span>
                  <span className="text-xs text-[var(--os-text-3)] shrink-0">
                    {new Date(item.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
