import { Kanban, LayoutList } from 'lucide-react'
import { cn } from '@design-system/cn'
import { useUIStore } from '@store/ui'

export function ViewToggle() {
  const { viewMode, setViewMode } = useUIStore()
  return (
    <div
      className="flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
    >
      <button
        onClick={() => setViewMode('board')}
        title="Board view"
        aria-label="Board view"
        className={cn(
          'p-1.5 rounded-md transition-colors',
          viewMode === 'board' ? 'bg-[#579bfc] text-white' : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
        )}
      >
        <Kanban className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        title="List view"
        aria-label="List view"
        className={cn(
          'p-1.5 rounded-md transition-colors',
          viewMode === 'list' ? 'bg-[#579bfc] text-white' : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
        )}
      >
        <LayoutList className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
