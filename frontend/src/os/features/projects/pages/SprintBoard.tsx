import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { MultiProgress } from '@design-system/components/Progress'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { Priority } from '../types'

const PRIORITY_DOT: Record<Priority, string> = {
  critical: '#e2445c',
  high:     '#fdab3d',
  medium:   '#579bfc',
  low:      '#00c875',
}

const PRIORITY_BADGE = {
  critical: 'danger',
  high:     'warning',
  medium:   'neutral',
  low:      'neutral',
} as const

export function SprintBoard() {
  const { projects, tasks, sprints, selectedProjectId, setSelectedProject, isLoading } = useProjectsStore()

  const activeSprints = sprints.filter(s => s.status === 'active')
  const sprint = sprints.find(s => s.projectId === selectedProjectId && s.status === 'active')
    ?? sprints.find(s => s.projectId === selectedProjectId)

  const sprintTasks = tasks.filter(t => sprint && t.sprintId === sprint.id)
  const backlogTasks = tasks.filter(t => t.projectId === selectedProjectId && !t.sprintId)

  const donePts      = sprintTasks.filter(t => t.status === 'done').reduce((s, t) => s + t.storyPoints, 0)
  const inProgPts    = sprintTasks.filter(t => t.status === 'in-progress').reduce((s, t) => s + t.storyPoints, 0)
  const todoPts      = sprintTasks.filter(t => t.status !== 'done' && t.status !== 'in-progress').reduce((s, t) => s + t.storyPoints, 0)
  const totalPts     = sprintTasks.reduce((s, t) => s + t.storyPoints, 0)

  const daysLeft = sprint
    ? Math.max(0, Math.ceil((new Date(sprint.endDate).getTime() - Date.now()) / 86400000))
    : 0

  const STATUS_DOT: Record<string, string> = {
    done: '#00c875', 'in-progress': '#fdab3d', review: '#7c3aed', todo: '#579bfc', backlog: 'var(--os-text-2)',
  }

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-40 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="h-40 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-56 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
          <div className="h-56 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>Sprint Board</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>{activeSprints.length} active sprints across projects</p>
        </div>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProject(e.target.value)}
          className="ml-auto h-9 rounded-2xl text-sm pl-3 pr-8 outline-none"
          style={{ border: '1px solid var(--os-border)', background: 'var(--os-card)', color: 'var(--os-text-1)' }}
        >
          {projects.filter(p => p.status !== 'planned').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12 }}>
          <p style={{ color: 'var(--os-text-2)' }}>No projects found. Create a project to start sprints.</p>
        </div>
      ) : sprint ? (
        <>
          {/* Sprint header card */}
          <div className="p-5" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold" style={{ color: 'var(--os-text-1)' }}>{sprint.name}</h3>
                  <span
                    className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white"
                    style={{ background: sprint.status === 'active' ? '#00c875' : sprint.status === 'completed' ? '#579bfc' : '#fdab3d' }}
                  >
                    {sprint.status}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--os-text-2)' }}>{sprint.goal}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--os-text-2)' }}>
                  <span>{new Date(sprint.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → {new Date(sprint.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span className="font-bold" style={{ color: 'var(--os-text-1)' }}>{daysLeft} days left</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: '#00c875' }}>{donePts}<span className="text-base font-normal" style={{ color: 'var(--os-text-2)' }}>/{totalPts}</span></p>
                <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>story points done</p>
              </div>
            </div>

            {/* Velocity breakdown progress bar */}
            <div className="mt-4 space-y-2">
              <MultiProgress
                segments={[
                  { value: donePts,   color: 'success', label: `Done: ${donePts} pts`        },
                  { value: inProgPts, color: 'warning', label: `In Progress: ${inProgPts} pts`},
                  { value: todoPts,   color: 'brand',   label: `Todo: ${todoPts} pts`         },
                ]}
                size="lg"
              />
              <div className="flex items-center gap-4 text-xs">
                {[
                  { color: '#00c875', label: 'Done',        val: donePts   },
                  { color: '#fdab3d', label: 'In Progress', val: inProgPts },
                  { color: '#579bfc', label: 'Todo',        val: todoPts   },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1.5" style={{ color: 'var(--os-text-2)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    {s.label} <strong style={{ color: 'var(--os-text-1)' }}>{s.val} pts</strong>
                  </span>
                ))}
                <span className="ml-auto" style={{ color: 'var(--os-text-2)' }}>Capacity: {sprint.capacity} pts</span>
              </div>
            </div>
          </div>

          {/* Two columns: sprint tasks + backlog */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sprint tasks */}
            <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--os-border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Sprint Tasks</span>
                <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5 text-white" style={{ background: '#579bfc' }}>{sprintTasks.length}</span>
              </div>
              <div className="px-5 pb-3">
                {sprintTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--os-border)' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_DOT[task.priority] }} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium leading-tight', task.status === 'done' ? 'line-through' : '')} style={{ color: task.status === 'done' ? 'var(--os-text-2)' : 'var(--os-text-1)' }}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {/* status dot badge */}
                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_DOT[task.status] ?? 'var(--os-text-2)' }} />
                          <span style={{ color: 'var(--os-text-2)' }}>{task.status}</span>
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>{task.storyPoints} pts</span>
                      </div>
                    </div>
                    <Avatar name={task.assignee} size="xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Backlog */}
            <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--os-border)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>Backlog</span>
                <span className="rounded-full text-[11px] font-bold px-2.5 py-0.5" style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-2)', border: '1px solid var(--os-border)' }}>{backlogTasks.length}</span>
              </div>
              <div className="px-5 pb-3">
                {backlogTasks.length === 0
                  ? <p className="py-6 text-sm text-center" style={{ color: 'var(--os-text-2)' }}>Backlog is empty</p>
                  : backlogTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--os-border)' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_DOT[task.priority] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight" style={{ color: 'var(--os-text-1)' }}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={PRIORITY_BADGE[task.priority]} size="sm">{task.priority}</Badge>
                        <span className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>{task.storyPoints} pts</span>
                      </div>
                    </div>
                    <Avatar name={task.assignee} size="xs" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12 }}>
          <p style={{ color: 'var(--os-text-2)' }}>No active sprint for this project.</p>
        </div>
      )}

      {/* All active sprints summary */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--os-text-1)' }}>All Active Sprints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeSprints.map(s => {
            const proj = projects.find(p => p.id === s.projectId)
            const pct  = Math.round((s.completedPoints / s.capacity) * 100)
            return (
              <div
                key={s.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all"
                style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-card)' }}
                onClick={() => setSelectedProject(s.projectId)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: proj?.pillarColor }} />
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--os-text-2)' }}>{proj?.name}</p>
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--os-text-1)' }}>{s.name}</p>
                <p className="text-xs mb-3 line-clamp-1" style={{ color: 'var(--os-text-2)' }}>{s.goal}</p>
                {/* progress bar */}
                <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: 'var(--os-surface-0)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#579bfc' }} />
                </div>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--os-text-2)' }}>{s.completedPoints}/{s.capacity} pts · {pct}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
