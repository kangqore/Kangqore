// Timeline / Gantt View
// Horizontal date bars showing WorkItem date ranges.
// Groups by type, colors by priority, overlays progress fill.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { type WorkItem, PRIORITY_COLOR } from '../types'
import { cn } from '@design-system/cn'

const WEEK_MS = 7 * 86_400_000

function addWeeks(d: Date, n: number): Date { return new Date(d.getTime() + n * WEEK_MS) }

function getMonthHeaders(from: Date, to: Date): Array<{ label: string; weeks: number }> {
  const headers: Array<{ label: string; weeks: number }> = []
  let cur = new Date(from)
  while (cur < to) {
    const month = cur.toLocaleString('default', { month: 'short', year: '2-digit' })
    let weeks = 0
    const m = cur.getMonth()
    while (cur < to && cur.getMonth() === m) { cur = addWeeks(cur, 1); weeks++ }
    headers.push({ label: month, weeks })
  }
  return headers
}

const PRIORITY_BAR: Record<string, string> = {
  CRITICAL: 'bg-red-500', HIGH: 'bg-orange-500', MEDIUM: 'bg-violet-500', LOW: 'bg-slate-400',
}

interface Props { projectId?: string; portfolioId?: string }

export function TimelineView({ projectId, portfolioId }: Props) {
  const [offsetWeeks, setOffsetWeeks] = useState(-2)
  const VISIBLE_WEEKS = 16

  const viewFrom = addWeeks(new Date(Math.floor(Date.now() / 86_400_000) * 86_400_000), offsetWeeks)
  const viewTo   = addWeeks(viewFrom, VISIBLE_WEEKS)

  const { data: items = [], isLoading, isFetching, refetch } = useQuery<WorkItem[]>({
    queryKey: ['work', 'timeline', projectId, portfolioId, offsetWeeks],
    queryFn: () => api.get('/admin/work-os/work/timeline', {
      params: { projectId, portfolioId, dateFrom: viewFrom.toISOString(), dateTo: viewTo.toISOString() }
    }).then(r => r.data.items ?? []),
    staleTime: 60_000,
  })

  const CELL_W = 48  // px per week

  function itemPos(item: WorkItem): { left: number; width: number } | null {
    const start = item.startDate ? new Date(item.startDate) : new Date(item.dueDate!)
    const end   = item.dueDate   ? new Date(item.dueDate)   : start
    const fromMs = viewFrom.getTime()
    const totalMs = VISIBLE_WEEKS * WEEK_MS
    const left  = ((start.getTime() - fromMs) / totalMs) * (VISIBLE_WEEKS * CELL_W)
    const width = Math.max(CELL_W / 2, ((end.getTime() - start.getTime()) / totalMs) * (VISIBLE_WEEKS * CELL_W))
    if (left > VISIBLE_WEEKS * CELL_W || left + width < 0) return null
    return { left: Math.max(0, left), width: Math.min(width, VISIBLE_WEEKS * CELL_W - Math.max(0, left)) }
  }

  const months = getMonthHeaders(viewFrom, viewTo)
  const today  = (Date.now() - viewFrom.getTime()) / WEEK_MS * CELL_W

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Loading timeline…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setOffsetWeeks(o => o - 4)} className="p-1 rounded hover:bg-[var(--os-bg-2)] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[var(--os-text-2)]" />
          </button>
          <button onClick={() => setOffsetWeeks(-2)} className="text-xs px-2 py-1 rounded border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
            Today
          </button>
          <button onClick={() => setOffsetWeeks(o => o + 4)} className="p-1 rounded hover:bg-[var(--os-bg-2)] transition-colors">
            <ChevronRight className="w-4 h-4 text-[var(--os-text-2)]" />
          </button>
          <span className="text-sm text-[var(--os-text-2)]">{items.length} items</span>
        </div>
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)]">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
      </div>

      <div className="border border-[var(--os-border)] rounded-2xl overflow-hidden">
        {/* Month headers */}
        <div className="flex border-b border-[var(--os-border)] bg-[var(--os-bg-2)]">
          <div className="w-52 shrink-0 border-r border-[var(--os-border)] px-3 py-2 text-xs font-medium text-[var(--os-text-2)]">
            Work Item
          </div>
          <div className="flex flex-1 overflow-hidden">
            {months.map((m, i) => (
              <div key={i} className="border-r border-[var(--os-border)] text-xs font-medium text-[var(--os-text-2)] px-2 py-2 text-center"
                   style={{ width: m.weeks * CELL_W }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* Week labels */}
        <div className="flex border-b border-[var(--os-border)] bg-[var(--os-bg-2)]">
          <div className="w-52 shrink-0 border-r border-[var(--os-border)] h-6" />
          <div className="flex relative" style={{ width: VISIBLE_WEEKS * CELL_W }}>
            {Array.from({ length: VISIBLE_WEEKS }, (_, w) => {
              const d = addWeeks(viewFrom, w)
              return (
                <div key={w} className="border-r border-[var(--os-border)] text-[0.6rem] text-[var(--os-text-3)] text-center py-1"
                     style={{ width: CELL_W }}>
                  {d.getDate()}/{d.getMonth() + 1}
                </div>
              )
            })}
            {/* Today line */}
            {today >= 0 && today <= VISIBLE_WEEKS * CELL_W && (
              <div className="absolute top-0 bottom-0 w-px bg-violet-500 z-10" style={{ left: today }} />
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[var(--os-border)]">
          {items.map((item: WorkItem) => {
            const pos = itemPos(item)
            return (
              <div key={item.id} className="flex items-center hover:bg-[var(--os-bg-hover)] transition-colors">
                {/* Label */}
                <div className="w-52 shrink-0 border-r border-[var(--os-border)] px-3 py-2 flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full shrink-0', item.priority === 'CRITICAL' ? 'bg-red-500' : item.priority === 'HIGH' ? 'bg-orange-500' : item.priority === 'MEDIUM' ? 'bg-violet-500' : 'bg-slate-400')} />
                  <span className="text-xs text-[var(--os-text-1)] truncate font-medium">{item.title}</span>
                </div>

                {/* Timeline bar */}
                <div className="flex-1 relative h-9 overflow-hidden" style={{ minWidth: VISIBLE_WEEKS * CELL_W }}>
                  {/* Week grid lines */}
                  {Array.from({ length: VISIBLE_WEEKS }, (_, w) => (
                    <div key={w} className="absolute top-0 bottom-0 w-px bg-[var(--os-border)] opacity-40"
                         style={{ left: w * CELL_W }} />
                  ))}
                  {/* Today line */}
                  {today >= 0 && today <= VISIBLE_WEEKS * CELL_W && (
                    <div className="absolute top-0 bottom-0 w-px bg-violet-500 z-10" style={{ left: today }} />
                  )}
                  {/* Bar */}
                  {pos && (
                    <div
                      className={cn('absolute top-2 bottom-2 rounded flex items-center overflow-hidden', PRIORITY_BAR[item.priority])}
                      style={{ left: pos.left, width: Math.max(8, pos.width) }}
                      title={`${item.title} (${item.progress}%)`}
                    >
                      {/* Progress fill */}
                      <div className="absolute inset-0 bg-black/20" style={{ left: `${item.progress}%` }} />
                      {pos.width > 40 && (
                        <span className="relative z-10 text-white text-[0.6rem] font-medium px-1.5 truncate">
                          {item.title}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {items.length === 0 && (
            <div className="text-center py-12 text-sm text-[var(--os-text-2)]">
              No items with due dates in this window.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
