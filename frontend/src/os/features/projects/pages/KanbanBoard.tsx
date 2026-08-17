import { useState, useMemo } from 'react'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { GripVertical, CalendarDays, Zap } from 'lucide-react'
import { Avatar } from '@design-system/components/Avatar'
import { Board, BoardColumn, BoardCard } from '@design-system/Board'
import { StatusBadge, StatusVariant } from '@design-system/StatusBadge'
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
  const pri   = PRIORITY_CONFIG[task.priority]
  const due   = task.dueDate ? relDue(task.dueDate) : null
  const desc  = task.description?.trim()
  
  const priorityStatusMap: Record<string, StatusVariant> = {
    critical: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'success',
  }

  return (
    <BoardCard id={task.id} isOverlay={dragging}>
      {/* Drag handle row */}
      <div className="flex items-center pb-2 gap-1.5">
        <button
          className="bg-transparent border-none cursor-grab text-text-muted flex items-center shrink-0 hover:text-text-primary"
          style={{ padding: '2px 3px' }}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        {/* Priority badge */}
        <StatusBadge status={priorityStatusMap[task.priority] ?? 'default'} label={pri.label} />
        
        <span className="text-[9px] font-mono text-text-muted ml-auto">
          {task.id.slice(0, 6).toUpperCase()}
        </span>
      </div>

      {/* Body */}
      <div className="px-1 pb-1 flex flex-col gap-1.5">
        {/* Title */}
        <p className="text-xs font-bold text-text-primary m-0 leading-snug">
          {task.title}
        </p>

        {/* Description snippet */}
        {desc && (
          <p className="text-[10px] text-text-secondary m-0 leading-relaxed line-clamp-2">
            {desc}
          </p>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
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
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border-subtle">
          {due && (
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3 shrink-0" style={{ color: due.color }} />
              <span style={{ fontSize: 9, color: due.color, fontWeight: due.warn ? 700 : 400 }}>{due.label}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-surface-base rounded px-1.5 py-0.5">
              <Zap className="w-2 h-2 text-warning" />
              <span className="text-[9px] font-bold text-text-secondary">{task.storyPoints}</span>
            </div>
            <Avatar name={task.assignee} size="xs" />
          </div>
        </div>
      </div>
    </BoardCard>
  )
}

// ── Column ─────────────────────────────────────────────────────────────────────

function Column({
  col, tasks,
}: {
  col: typeof COL_CONFIG[0]
  tasks: Task[]
}) {
  const totalPts = tasks.reduce((s, t) => s + t.storyPoints, 0)

  return (
    <BoardColumn id={col.id} title={col.label} items={tasks.map(t => t.id)}>
      {tasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80px] opacity-40">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Drop here
          </span>
        </div>
      )}
      {tasks.map(t => <TaskCard key={t.id} task={t} />)}
    </BoardColumn>
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
        <div className="flex items-center justify-center h-[240px] bg-surface-elevated border border-border rounded-2xl">
          <p className="text-sm text-text-muted">No active projects</p>
        </div>
      ) : (
        <Board
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          activeCard={activeTask ? <TaskCard task={activeTask} dragging /> : null}
        >
          {COL_CONFIG.map(col => (
            <Column
              key={col.id}
              col={col}
              tasks={boardTasks.filter(t => t.status === col.id)}
            />
          ))}
        </Board>
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
