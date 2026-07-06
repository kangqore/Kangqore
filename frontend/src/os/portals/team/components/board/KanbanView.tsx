import { useState, type ReactNode } from 'react'
import {
  DndContext, DragEndEvent, DragStartEvent, DragOverlay,
  PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
} from '@dnd-kit/core'

export interface KanbanGroup {
  id:    string
  label: string
  color: string
}

interface KanbanViewProps<T extends { id: string }> {
  items:       T[]
  groups:      KanbanGroup[]
  statusField: string
  renderCard:  (item: T, isDragging?: boolean) => ReactNode
  onMove:      (id: string, toGroup: string) => void
  onCardClick?: (item: T) => void
}

function DraggableCard({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined,
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'none',
      }}
    >
      {children}
    </div>
  )
}

function DroppableColumn({
  id, color, label, count, children,
}: { id: string; color: string; label: string; count: number; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div className="flex-shrink-0 flex flex-col" style={{ width: 260 }}>
      <div className="flex items-center gap-2 px-1 mb-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="text-xs font-bold text-[var(--os-text-1)] uppercase tracking-wider">{label}</p>
        <span className="ml-auto text-xs text-[var(--os-text-2)] font-medium">{count}</span>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 p-3 rounded-2xl border transition-all duration-150 min-h-[120px]"
        style={{
          borderColor: isOver ? `${color}88` : 'var(--os-surface-0)',
          background:  isOver ? `${color}0d` : 'rgba(11,17,33,0.5)',
          boxShadow:   isOver ? `inset 0 0 0 1px ${color}44` : 'none',
        }}
      >
        {children}
        {count === 0 && (
          <div className="flex-1 flex items-center justify-center py-8">
            <p className="text-xs text-[var(--os-text-2)]">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function KanbanView<T extends { id: string }>({
  items, groups, statusField, renderCard, onMove, onCardClick,
}: KanbanViewProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const byGroup = groups.reduce<Record<string, T[]>>((acc, g) => {
    acc[g.id] = items.filter(i => (i as any)[statusField] === g.id)
    return acc
  }, {})

  const activeItem = items.find(i => i.id === activeId)

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    if (!e.over) return
    const toGroup = String(e.over.id)
    if (groups.find(g => g.id === toGroup)) {
      onMove(String(e.active.id), toGroup)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1">
        {groups.map(g => (
          <DroppableColumn
            key={g.id}
            id={g.id}
            color={g.color}
            label={g.label}
            count={byGroup[g.id]?.length ?? 0}
          >
            {(byGroup[g.id] ?? []).map(item => (
              <DraggableCard key={item.id} id={item.id}>
                <div onClick={() => onCardClick?.(item)} className={onCardClick ? 'cursor-pointer' : ''}>
                  {renderCard(item, item.id === activeId)}
                </div>
              </DraggableCard>
            ))}
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
        {activeItem ? (
          <div className="opacity-90 rotate-1 scale-[1.04] pointer-events-none">
            {renderCard(activeItem, true)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
