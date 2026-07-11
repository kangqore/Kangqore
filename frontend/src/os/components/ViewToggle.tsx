import { LayoutList, LayoutGrid, Columns3, GanttChartSquare } from 'lucide-react'
import { cn } from '@design-system/cn'
import { useUIStore, type ViewMode } from '@store/ui'

const VIEWS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'list',   icon: LayoutList,       label: 'List view'   },
  { mode: 'board',  icon: LayoutGrid,       label: 'Board view'  },
  { mode: 'kanban', icon: Columns3,         label: 'Kanban view' },
  { mode: 'gantt',  icon: GanttChartSquare, label: 'Gantt view'  },
]

export function ViewToggle() {
  const { viewMode, setViewMode, supportedViews } = useUIStore()

  // Only render if page supports more than one view
  const available = VIEWS.filter(v => supportedViews.includes(v.mode))
  if (available.length <= 1) return null

  return (
    <div
      className="flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
    >
      {VIEWS.map(({ mode, icon: Icon, label }) => {
        const supported = supportedViews.includes(mode)
        const active    = viewMode === mode
        return (
          <button
            key={mode}
            onClick={() => supported && setViewMode(mode)}
            title={label}
            aria-label={label}
            disabled={!supported}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              active && supported
                ? 'bg-[#579bfc] text-white'
                : supported
                  ? 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
                  : 'text-[var(--os-border)] cursor-not-allowed'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        )
      })}
    </div>
  )
}
