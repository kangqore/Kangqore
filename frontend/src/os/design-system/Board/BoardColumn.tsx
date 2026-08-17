import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface BoardColumnProps {
  id: string
  title: string
  items: string[] // Array of item IDs for sorting context
  children: React.ReactNode
}

export function BoardColumn({ id, title, items, children }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div 
      className="flex flex-col flex-shrink-0 w-80 max-h-full rounded-xl bg-surface-secondary border border-border overflow-hidden"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b border-border-subtle bg-surface-secondary">
        <h3 className="font-semibold text-sm text-text-primary tracking-wide">
          {title}
        </h3>
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-elevated border border-border text-[10px] font-medium text-text-muted">
          {items.length}
        </span>
      </div>

      {/* Column Body / Droppable Area */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors ${
          isOver ? 'bg-surface-elevated/50' : 'bg-transparent'
        }`}
      >
        <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </div>
    </div>
  )
}
