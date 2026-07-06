import { useState } from 'react'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { Task, TaskStatus, Priority } from '../types'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: 'var(--os-text-2)' },
  { id: 'todo',        label: 'To Do',       color: '#579bfc' },
  { id: 'in-progress', label: 'In Progress', color: '#fdab3d' },
  { id: 'review',      label: 'Review',      color: '#7c3aed' },
  { id: 'done',        label: 'Done',        color: '#00c875' },
]

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#579bfc',
  low:      '#00c875',
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
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: 'var(--os-card)',
        border: '1px solid var(--os-border)',
        borderRadius: 10,
        boxShadow: dragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'var(--os-shadow-card)',
      }}
      className={cn(
        'p-3.5 select-none transition-all duration-200 cursor-grab active:cursor-grabbing',
        isDragging && !dragging && 'opacity-30',
      )}
    >
      <div className="flex items-start gap-2.5">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded-lg mt-0.5 flex-shrink-0 transition-colors"
          style={{ color: 'var(--os-text-2)' }}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            {/* priority dot */}
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_COLOR[task.priority] }} />
            <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--os-text-2)' }}>{task.id.toUpperCase()}</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed mb-2.5" style={{ color: 'var(--os-text-1)' }}>{task.title}</p>
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {task.labels.slice(0, 2).map(l => (
              <Badge key={l} variant={LABEL_VARIANT[l] ?? 'neutral'} size="sm" className="font-medium tracking-wide">{l}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2.5 mt-1" style={{ borderTop: '1px solid var(--os-border)' }}>
            <div className="flex items-center gap-2">
              <Avatar name={task.assignee} size="xs" />
              <span className="text-[10px] font-medium" style={{ color: 'var(--os-text-2)' }}>{task.assignee.split(' ')[0]}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-1)' }}>{task.storyPoints} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Column({ status, tasks }: { status: typeof COLUMNS[0]; tasks: Task[] }) {
  return (
    <div className="flex flex-col gap-2.5 min-w-[230px] w-[230px]">
      {/* Column header: solid colored pill */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <span
          className="text-[11px] font-bold px-3 py-1 rounded-full text-white"
          style={{ background: status.color }}
        >
          {status.label}
        </span>
        <span
          className="ml-auto text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
          style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-1)', border: '1px solid var(--os-border)' }}
        >
          {tasks.length}
        </span>
      </div>
      {/* Drop zone */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          className={cn('flex flex-col gap-2 min-h-[120px] p-2 rounded-xl', tasks.length === 0 && 'items-center justify-center')}
          style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
        >
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>Drop here</p>
            </div>
          )}
          {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </SortableContext>
    </div>
  )
}

export function KanbanBoard() {
  const { projects, tasks, selectedProjectId, setSelectedProject, moveTask, isLoading } = useProjectsStore()
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

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-40 rounded-lg" style={{ background: 'var(--os-surface-0)' }} />
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="min-w-[230px] w-[230px] h-64 rounded-xl" style={{ background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Project selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>Kanban Board</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>{projectTasks.length} tasks — drag to move between columns</p>
        </div>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProject(e.target.value)}
          className="h-9 rounded-xl text-sm pl-3 pr-8 outline-none ml-auto"
          style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)' }}
        >
          {projects.filter(p => p.status !== 'planned').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex flex-col gap-2.5 min-w-[230px] w-[230px]">
              <div className="flex items-center gap-2 px-1 mb-1">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: col.color }}>{col.label}</span>
              </div>
              <div className="flex flex-col items-center justify-center min-h-[120px] p-2 rounded-xl" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--os-text-2)' }}>No projects</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  )
}
