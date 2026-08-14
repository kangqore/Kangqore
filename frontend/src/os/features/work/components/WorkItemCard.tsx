import { type WorkItem, STATUS_COLOR, PRIORITY_DOT, TYPE_ICON } from '../types'
import { CalendarDays, User, Tag } from 'lucide-react'
import { cn } from '@design-system/cn'

interface Props {
  item: WorkItem
  compact?: boolean
  onClick?: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

function daysUntil(date: string): string {
  const d = (new Date(date).getTime() - Date.now()) / 86_400_000
  if (d < 0) return `${Math.abs(Math.round(d))}d overdue`
  if (d < 1) return 'Due today'
  return `${Math.round(d)}d left`
}

function isOverdue(date?: string): boolean {
  return !!date && new Date(date) < new Date()
}

export function WorkItemCard({ item, compact, onClick, draggable, onDragStart }: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        'border border-[var(--os-border)] rounded-lg bg-[var(--os-bg-1)] p-3 cursor-pointer',
        'hover:border-[var(--os-border-2)] hover:shadow-sm transition-all select-none',
        compact && 'p-2',
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-2">
        <span className="text-sm shrink-0 mt-0.5">{TYPE_ICON[item.type] ?? '☐'}</span>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium text-[var(--os-text-1)] leading-snug', item.status === 'DONE' && 'line-through text-[var(--os-text-3)]')}>
            {item.title}
          </p>
          {!compact && item.description && (
            <p className="text-xs text-[var(--os-text-3)] mt-0.5 line-clamp-2">{item.description}</p>
          )}
        </div>
        <div className={cn('w-2 h-2 rounded-full shrink-0 mt-1.5', PRIORITY_DOT[item.priority])} title={item.priority} />
      </div>

      {!compact && (
        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {/* Status */}
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', STATUS_COLOR[item.status])}>
            {item.status.replace('_', ' ')}
          </span>

          {/* Due date */}
          {item.dueDate && (
            <span className={cn('flex items-center gap-1 text-xs', isOverdue(item.dueDate) && item.status !== 'DONE' ? 'text-red-500' : 'text-[var(--os-text-3)]')}>
              <CalendarDays className="w-3 h-3" />
              {daysUntil(item.dueDate)}
            </span>
          )}

          {/* Story points */}
          {item.storyPoints && (
            <span className="text-xs text-[var(--os-text-3)] bg-[var(--os-bg-2)] px-1.5 py-0.5 rounded">
              {item.storyPoints}pt
            </span>
          )}

          {/* Tags */}
          {item.tags?.slice(0, 2).map(t => (
            <span key={t} className="flex items-center gap-0.5 text-xs text-[var(--os-text-3)]">
              <Tag className="w-2.5 h-2.5" />{t}
            </span>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {!compact && item.progress > 0 && item.status !== 'DONE' && (
        <div className="mt-2 h-1 bg-[var(--os-bg-3)] rounded-full overflow-hidden">
          <div className="h-full bg-violet-500 transition-all" style={{ width: `${item.progress}%` }} />
        </div>
      )}
    </div>
  )
}
