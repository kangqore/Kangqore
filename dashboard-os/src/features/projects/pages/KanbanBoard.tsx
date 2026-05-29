import { useState } from 'react'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Flag } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { Task, TaskStatus, Priority } from '../types'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: '#94a3b8' },
  { id: 'todo',        label: 'To Do',       color: '#3b82f6' },
  { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review',      label: 'Review',      color: '#8b5cf6' },
  { id: 'done',        label: 'Done',        color: '#22c55e' },
]

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-500',
  high:     'text-orange-500',
  medium:   'text-amber-400',
  low:      'text-slate-300',
}

const LABEL_VARIANT: Record<string, 'brand' | 'info' | 'success' | 'warning' | 'neutral'> = {
  frontend: 'brand', backend: 'info', ai: 'success', perf: 'warning', testing: 'neutral',
  design: 'brand', api: 'info', ml: 'success', integration: 'neutral', infra: 'neutral',
}

function TaskCard({ task, dragging = false }: { task: Task; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'bg-white border border-slate-200 rounded-xl p-3 shadow-sm select-none',
        isDragging && !dragging && 'opacity-30',
        dragging && 'shadow-xl rotate-1 scale-105',
        'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="text-slate-300 hover:text-slate-500 mt-0.5 flex-shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flag className={cn('w-3 h-3 flex-shrink-0', PRIORITY_COLOR[task.priority])} />
            <span className="text-[10px] text-slate-400 font-mono">{task.id.toUpperCase()}</span>
          </div>
          <p className="text-xs font-medium text-slate-800 leading-relaxed mb-2">{task.title}</p>
          <div className="flex items-center gap-1 flex-wrap mb-2">
            {task.labels.slice(0, 2).map(l => (
              <Badge key={l} variant={LABEL_VARIANT[l] ?? 'neutral'} size="sm">{l}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Avatar name={task.assignee} size="xs" />
            <span className="text-[10px] text-slate-400">{task.storyPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Column({ status, tasks }: { status: typeof COLUMNS[0]; tasks: Task[] }) {
  return (
    <div className="flex flex-col gap-2 min-w-[220px] w-[220px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: status.color }} />
        <span className="text-xs font-semibold text-slate-700">{status.label}</span>
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>
      {/* Drop zone */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className={cn(
          'flex flex-col gap-2 min-h-[80px] p-2 rounded-xl bg-slate-50 border border-slate-100',
          tasks.length === 0 && 'items-center justify-center'
        )}>
          {tasks.length === 0 && <p className="text-xs text-slate-300 py-4">Drop here</p>}
          {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </SortableContext>
    </div>
  )
}

export function KanbanBoard() {
  const { projects, tasks, selectedProjectId, setSelectedProject, moveTask } = useProjectsStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId)

  function onDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    if (!over) return
    const overId = over.id as string
    const col = COLUMNS.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)
    const newStatus = col?.id ?? overTask?.status
    if (newStatus && newStatus !== active.id) moveTask(active.id as string, newStatus)
  }

  return (
    <div className="space-y-4">
      {/* Project selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-slate-900">Kanban Board</h2>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProject(e.target.value)}
          className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 ml-auto"
        >
          {projects.filter(p => p.status !== 'planned').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">{projectTasks.length} tasks — drag to move between columns</p>

      {/* Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              status={col}
              tasks={projectTasks.filter(t => t.status === col.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} dragging />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
