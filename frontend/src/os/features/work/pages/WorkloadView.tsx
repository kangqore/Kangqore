// Workload View — capacity grid showing team members vs active items
// Heatmap: green (low) → amber (medium) → red (overloaded)

import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, Users } from 'lucide-react'
import { cn } from '@design-system/cn'

interface StaffWorkload {
  assigneeId: string; name: string; role: string
  activeItems: number; inProgressItems: number; blockedItems: number
  totalEstimatedHours: number; totalStoryPoints: number
  items: Array<{ id: string; title: string; status: string; priority: string; dueDate?: string | null }>
}

const CAPACITY_HOURS = 40

function loadColor(hours: number): string {
  const pct = hours / CAPACITY_HOURS
  if (pct < 0.5) return 'bg-emerald-500/80'
  if (pct < 0.8) return 'bg-amber-500/80'
  return 'bg-red-500/80'
}

function loadLabel(hours: number): string {
  const pct = hours / CAPACITY_HOURS
  if (pct < 0.5) return 'light'
  if (pct < 0.8) return 'balanced'
  return 'overloaded'
}

export function WorkloadView() {
  const { data = [], isLoading, isFetching, refetch } = useQuery<StaffWorkload[]>({
    queryKey: ['work', 'workload'],
    queryFn: () => api.get('/admin/work-os/work/workload').then(r => r.data.buckets ?? []),
    staleTime: 60_000,
  })

  const totalAssigned = data.reduce((s, m) => s + (m.activeItems ?? 0), 0)
  const overloaded = data.filter(m => (m as any).blockedItems > 0 || (m as any).overdue > 0).length

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading workload…</div>

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Users className="w-4 h-4" />
          <span>{data.length} team members · {totalAssigned} active items</span>
        </div>
        {overloaded > 0 && (
          <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full font-medium">
            {overloaded} with blocked or overdue work
          </span>
        )}
        <button onClick={() => refetch()} className="ml-auto text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
      </div>

      {data.length === 0 ? (
        <div className="border border-[var(--os-border)] rounded-2xl h-64 flex items-center justify-center text-sm text-[var(--os-text-2)]">
          No items with assignees yet. Assign work items to team members to see capacity.
        </div>
      ) : (
        <div className="grid gap-3">
          {data.map(member => {
            const pct = Math.min(100, (member.totalEstimatedHours / CAPACITY_HOURS) * 100)
            const barColor = loadColor(member.totalEstimatedHours)
            const label = loadLabel(member.totalEstimatedHours)

            return (
              <div key={member.assigneeId} className="border border-[var(--os-border)] rounded-2xl p-4 bg-[var(--os-bg-1)]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                        {(member.name || member.assigneeId).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--os-text-1)]">{member.name || member.assigneeId}</div>
                        {member.role && <div className="text-xs text-[var(--os-text-3)]">{member.role}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--os-text-2)]">
                      {member.totalEstimatedHours.toFixed(0)}h / {CAPACITY_HOURS}h
                    </div>
                    <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded',
                      label === 'overloaded' ? 'text-red-400 bg-red-400/10' :
                      label === 'balanced' ? 'text-amber-400 bg-amber-400/10' :
                      'text-emerald-400 bg-emerald-400/10')}>
                      {label}
                    </span>
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="h-2 bg-[var(--os-bg-3)] rounded-full mb-3 overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
                </div>

                {/* Item breakdown */}
                <div className="flex gap-4 mb-3 text-xs text-[var(--os-text-2)]">
                  <span>{member.activeItems} active</span>
                  <span className="text-violet-400">{member.inProgressItems} in progress</span>
                  {member.blockedItems > 0 && <span className="text-red-500">{member.blockedItems} blocked</span>}
                  {member.totalStoryPoints > 0 && <span>{member.totalStoryPoints} pts</span>}
                </div>

                {/* Item chips */}
                {member.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {member.items.slice(0, 8).map(item => (
                      <span key={item.id} className={cn(
                        'text-xs px-2 py-0.5 rounded-full border',
                        item.status === 'BLOCKED' ? 'border-red-500/30 text-red-400 bg-red-500/5' :
                        item.status === 'IN_PROGRESS' ? 'border-violet-500/30 text-violet-400 bg-violet-500/5' :
                        'border-[var(--os-border)] text-[var(--os-text-2)]'
                      )}>
                        {item.title.length > 24 ? item.title.slice(0, 23) + '…' : item.title}
                      </span>
                    ))}
                    {member.items.length > 8 && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-[var(--os-text-3)]">
                        +{member.items.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
