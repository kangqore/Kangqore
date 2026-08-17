import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface BoardCardProps {
  id: string
  children: React.ReactNode
  isOverlay?: boolean
}

export function BoardCard({ id, children, isOverlay = false }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add z-index when dragging so it stays above other elements
    zIndex: isDragging ? 50 : undefined,
    // Slightly fade the original item while it is being dragged (the DragOverlay renders on top)
    opacity: isDragging ? 0.3 : 1,
  }

  // If this card is rendered inside a DragOverlay, we apply an elevated scale & shadow
  const overlayClasses = isOverlay
    ? 'scale-105 shadow-xl rotate-2 ring-1 ring-brand-primary cursor-grabbing'
    : 'shadow-sm hover:shadow-md hover:border-border-strong cursor-grab'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative w-full rounded-lg bg-surface-primary border border-border p-3 transition-shadow ${overlayClasses}`}
    >
      {children}
    </div>
  )
}
