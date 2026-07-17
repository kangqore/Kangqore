import { useState, useMemo } from 'react'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, CalendarDays, Zap } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { Task, TaskStatus, Priority } from '../types'

// ── Design tokens ──────────────────────────────────────────────────────────────

const COL_CONFIG: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',     color: '#64748b' },
  { id: 'todo',        label: 'To Do',       color: '#579bfc' },
  { id: 'in-progress', label: 'In Progress', color: '#fdab3d' },
  { id: 'review',      label: 'Review',      color: '#7c3aed' },
  { id: 'done',        label: 'Done',        color: '#00c875' },
]

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: 'Critical', color: '#e2445c', bg: '#e2445c18' },
  high:     { label: 'High',     color: '#fdab3d', bg: '#fdab3d18' },
  medium:   { label: 'Medium',   color: '#579bfc', bg: '#579bfc18' },
  low:      { label: 'Low',      color: '#00c875', bg: '#00c87518' },
}

const LABEL_COLORS: Record<string, string> = {
  frontend: '#579bfc', backend: '#7c3aed', ai: '#00c875', perf: '#fdab3d',
  testing: '#64748b', design: '#e2445c', api: '#0d9488', ml: '#10b981',
  integration: '#d97706', infra: '#94a3b8', analytics: '#6366f1',
}

function labelColor(l: string) { return LABEL_COLORS[l] ?? '#64748b' }

function relDue(iso: string): { label: string; color: string; warn: boolean } {
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
  if (d < 0)   return { label: `${Math.abs(d)}d overdue`, color: '#e2445c', warn: true }
  if (d === 0) return { label: 'Due today',                color: '#fdab3d', warn: true }
  if (d <= 3)  return { label: `${d}d left`,               color: '#fdab3d', warn: true }
  if (d <= 14) return { label: `${d}d left`,               color: '#00c875', warn: false }
  return {
    label: new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    color: 'var(--os-text-4)', warn: false,
  }
}

// ── Task card ──────────────────────────────────────────────────────────────────

function TaskCard({ task, dragging = false }: { task: Task; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const pri   = PRIORITY_CONFIG[task.priority]
  const due   = task.dueDate ? relDue(task.dueDate) : null
  const desc  = task.description?.trim()

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: 'var(--os-card)',
        border: '1px solid var(--os-border)',
        borderLeft: `3px solid ${pri.color}`,
        borderRadius: 10,
        boxShadow: dragging
          ? `0 16px 48px rgba(0,0,0,0.22), 0 0 0 1px ${pri.color}44`
          : 'var(--os-shadow-card)',
        transform: dragging
          ? `${CSS.Transform.toString(transform) ?? ''} rotate(1.5deg) scale(1.02)`
          : CSS.Transform.toString(transform) ?? undefined,
        opacity: isDragging && !dragging ? 0.2 : 1,
        userSelect: 'none',
        cursor: 'grab',
      }}
    >
      {/* Drag handle row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 10px 0', gap: 6 }}>
        <button
          {...attributes}
          {...listeners}
          style={{
            background: 'none', border: 'none', cursor: 'grab', padding: '2px 3px',
            color: 'var(--os-text-4)', display: 'flex', alignItems: 'center', flexShrink: 0,
          }}
        >
          <GripVertical style={{ width: 12, height: 12 }} />
        </button>
        {/* Priority badge */}
        <span style={{
          fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
          background: pri.bg, color: pri.color,
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>
          {pri.label}
        </span>
        <span style={{
          fontSize: 9, fontFamily: 'monospace', color: 'var(--os-text-4)', marginLeft: 'auto',
        }}>
          {task.id.slice(0, 6).toUpperCase()}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '6px 12px 10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Title */}
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.4 }}>
          {task.title}
        </p>

        {/* Description snippet */}
        {desc && (
          <p style={{
            fontSize: 10, color: 'var(--os-text-4)', margin: 0, lineHeight: 1.5,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {desc}
          </p>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {task.labels.map(l => (
              <span key={l} style={{
                fontSize: 9, padding: '1px 6px', borderRadius: 3,
                background: labelColor(l) + '14', color: labelColor(l),
                border: `1px solid ${labelColor(l)}28`, fontWeight: 600,
              }}>{l}</span>
            ))}
          </div>
        )}

        {/* Footer: due date + points + avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginTop: 2,
          paddingTop: 8, borderTop: '1px solid var(--os-border-subtle)',
        }}>
          {due && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <CalendarDays style={{ width: 10, height: 10, color: due.color, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: due.color, fontWeight: due.warn ? 700 : 400 }}>{due.label}</span>
            </div>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              background: 'var(--os-surface-0)', borderRadius: 4, padding: '2px 6px',
            }}>
              <Zap style={{ width: 8, height: 8, color: '#fdab3d' }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-2)' }}>{task.storyPoints}</span>
            </div>
            <Avatar name={task.assignee} size="xs" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Column ─────────────────────────────────────────────────────────────────────

function Column({
  col, tasks, isDragOver,
}: {
  col: typeof COL_CONFIG[0]
  tasks: Task[]
  isDragOver?: boolean
}) {
  const totalPts = tasks.reduce((s, t) => s + t.storyPoints, 0)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minWidth: 272, width: 272, gap: 0,
    }}>
      {/* Column header */}
      <div style={{
        background: col.color + '10',
        borderRadius: '10px 10px 0 0',
        borderTop: `3px solid ${col.color}`,
        borderLeft: `1px solid ${col.color}30`,
        borderRight: `1px solid ${col.color}30`,
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--os-text-1)', flex: 1 }}>{col.label}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10,
          background: col.color + '20', color: col.color,
        }}>{tasks.length}</span>
        {totalPts > 0 && (
          <span style={{
            fontSize: 9, fontWeight: 600, color: 'var(--os-text-4)',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <Zap style={{ width: 8, height: 8 }} />{totalPts}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{
          flex: 1, minHeight: 140,
          display: 'flex', flexDirection: 'column', gap: 8,
          padding: 10,
          background: isDragOver ? col.color + '07' : 'var(--os-surface-0)',
          border: tasks.length === 0 && isDragOver
            ? `2px dashed ${col.color}80`
            : `1px solid ${col.color}20`,
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          transition: 'background 0.15s, border-color 0.15s',
        }}>
          {tasks.length === 0 && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 4, minHeight: 80,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 600, color: col.color + 'aa',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>Drop here</span>
            </div>
          )}
          {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      </SortableContext>
    </div>
  )
}

// ── Main board ─────────────────────────────────────────────────────────────────

const PRIORITIES: Array<{ value: Priority | 'all'; label: string; color: string }> = [
  { value: 'all',      label: 'All',      color: 'var(--os-text-2)' },
  { value: 'critical', label: 'Critical', color: '#e2445c' },
  { value: 'high',     label: 'High',     color: '#fdab3d' },
  { value: 'medium',   label: 'Medium',   color: '#579bfc' },
  { value: 'low',      label: 'Low',      color: '#00c875' },
]

export function KanbanBoard() {
  const { projects, tasks, selectedProjectId, setSelectedProject, moveTask, isLoading } = useProjectsStore()
  const [activeTask,     setActiveTask]     = useState<Task | null>(null)
  const [priFilter,      setPriFilter]      = useState<Priority | 'all'>('all')
  const [dragOverColId,  setDragOverColId]  = useState<TaskStatus | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const selectedProject = projects.find(p => p.id === selectedProjectId) ?? projects[0]
  const activeProjects  = projects.filter(p => p.status !== 'completed')

  const boardTasks = useMemo(() => {
    let t = tasks.filter(t => t.projectId === selectedProjectId)
    if (priFilter !== 'all') t = t.filter(t => t.priority === priFilter)
    return t
  }, [tasks, selectedProjectId, priFilter])

  function onDragStart({ active }: DragStartEvent) {
    setActiveTask(tasks.find(t => t.id === active.id) ?? null)
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null)
    setDragOverColId(null)
    if (!over) return
    const overId = over.id as string
    const col      = COL_CONFIG.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)
    const newStatus = col?.id ?? overTask?.status
    if (newStatus && newStatus !== (tasks.find(t => t.id === active.id)?.status)) {
      moveTask(active.id as string, newStatus)
    }
  }

  // Story points summary per column
  const colStats = useMemo(() => {
    const all = tasks.filter(t => t.projectId === selectedProjectId)
    return COL_CONFIG.reduce((acc, col) => {
      const ct = all.filter(t => t.status === col.id)
      acc[col.id] = { count: ct.length, pts: ct.reduce((s, t) => s + t.storyPoints, 0) }
      return acc
    }, {} as Record<string, { count: number; pts: number }>)
  }, [tasks, selectedProjectId])

  const totalPts  = Object.values(colStats).reduce((s, c) => s + c.pts,   0)
  const donePts   = colStats['done']?.pts ?? 0
  const velocity  = totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-pulse">
        <div style={{ height: 32, width: 200, borderRadius: 8, background: 'var(--os-surface-0)' }} />
        <div style={{ display: 'flex', gap: 14 }}>
          {COL_CONFIG.map(c => (
            <div key={c.id} style={{ minWidth: 272, height: 320, borderRadius: 10, background: 'var(--os-surface-0)' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Project tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {activeProjects.map(p => {
          const sel = p.id === selectedProjectId
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px',
                borderRadius: 8, border: sel ? `1px solid ${p.pillarColor}55` : '1px solid var(--os-border)',
                background: sel ? p.pillarColor + '12' : 'var(--os-surface-3)',
                cursor: 'pointer', flexShrink: 0,
                boxShadow: sel ? `0 0 0 1px ${p.pillarColor}33` : 'none',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.pillarColor, flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: sel ? 700 : 500, whiteSpace: 'nowrap',
                color: sel ? 'var(--os-text-1)' : 'var(--os-text-3)',
              }}>{p.name}</span>
              {sel && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8,
                  background: p.pillarColor + '22', color: p.pillarColor,
                }}>{boardTasks.length}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Board header: project context + filters */}
      {selectedProject && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          background: 'var(--os-card)', border: '1px solid var(--os-border)',
          borderRadius: 10, padding: '10px 14px',
        }}>
          {/* Project name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedProject.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 1 }}>
              {selectedProject.client} · {selectedProject.progress}% complete
            </div>
          </div>

          {/* Velocity stat */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{velocity}%</div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Velocity</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--os-border)' }} />

          {/* Total tasks */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)' }}>{tasks.filter(t => t.projectId === selectedProjectId).length}</div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tasks</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--os-border)' }} />

          {/* Total points */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{totalPts}</div>
            <div style={{ fontSize: 9, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Points</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--os-border)' }} />

          {/* Priority filter chips */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--os-surface-3)', borderRadius: 7, padding: 3 }}>
            {PRIORITIES.map(p => {
              const active = priFilter === p.value
              return (
                <button key={p.value} onClick={() => setPriFilter(p.value)} style={{
                  padding: '4px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  background: active ? (p.value === 'all' ? 'var(--os-card)' : p.color + '18') : 'transparent',
                  color: active ? (p.value === 'all' ? 'var(--os-text-1)' : p.color) : 'var(--os-text-4)',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                }}>
                  {p.value !== 'all' && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
                  )}
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Board columns */}
      {activeProjects.length === 0 ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240,
          background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--os-text-4)' }}>No active projects</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={({ over }) => {
            if (!over) { setDragOverColId(null); return }
            const col = COL_CONFIG.find(c => c.id === over.id)
            setDragOverColId(col?.id ?? null)
          }}
          onDragEnd={onDragEnd}
        >
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
            {COL_CONFIG.map(col => (
              <Column
                key={col.id}
                col={col}
                tasks={boardTasks.filter(t => t.status === col.id)}
                isDragOver={dragOverColId === col.id}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} dragging />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Column summary footer */}
      {activeProjects.length > 0 && (
        <div style={{ display: 'flex', gap: 12 }}>
          {COL_CONFIG.map(col => {
            const s = colStats[col.id] ?? { count: 0, pts: 0 }
            return (
              <div key={col.id} style={{ minWidth: 272, width: 272 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 10px', borderRadius: 6,
                  background: col.color + '08',
                  border: `1px solid ${col.color}20`,
                }}>
                  <span style={{ fontSize: 9, color: col.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {col.label}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>
                    {s.count} task{s.count !== 1 ? 's' : ''} · {s.pts} pts
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
