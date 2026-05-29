import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { Avatar } from '@design-system/components/Avatar'
import { MultiProgress } from '@design-system/components/Progress'
import { Flag } from 'lucide-react'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '../store'
import type { Priority } from '../types'

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-500',
  high:     'text-orange-500',
  medium:   'text-amber-400',
  low:      'text-slate-300',
}

const PRIORITY_BADGE = {
  critical: 'danger',
  high:     'warning',
  medium:   'neutral',
  low:      'neutral',
} as const

export function SprintBoard() {
  const { projects, tasks, sprints, selectedProjectId, setSelectedProject } = useProjectsStore()

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sprint Board</h2>
          <p className="text-sm text-slate-500 mt-0.5">{activeSprints.length} active sprints across projects</p>
        </div>
        <select
          value={selectedProjectId}
          onChange={e => setSelectedProject(e.target.value)}
          className="ml-auto h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pl-3 pr-8 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        >
          {projects.filter(p => p.status !== 'planned').map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {sprint ? (
        <>
          {/* Sprint header card */}
          <Card>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{sprint.name}</h3>
                  <Badge variant={sprint.status === 'active' ? 'success' : sprint.status === 'completed' ? 'info' : 'brand'} dot size="sm">
                    {sprint.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-3">{sprint.goal}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{new Date(sprint.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} → {new Date(sprint.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span className="font-semibold text-slate-700">{daysLeft} days left</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{donePts}<span className="text-slate-400 text-base font-normal">/{totalPts}</span></p>
                <p className="text-xs text-slate-400">story points done</p>
              </div>
            </div>

            {/* Velocity breakdown */}
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
                  { color: 'bg-green-500', label: 'Done',        val: donePts   },
                  { color: 'bg-amber-500', label: 'In Progress',  val: inProgPts },
                  { color: 'bg-purple-600',label: 'Todo',         val: todoPts   },
                ].map(s => (
                  <span key={s.label} className="flex items-center gap-1.5 text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${s.color}`} />
                    {s.label} <strong className="text-slate-700">{s.val} pts</strong>
                  </span>
                ))}
                <span className="ml-auto text-slate-400">Capacity: {sprint.capacity} pts</span>
              </div>
            </div>
          </Card>

          {/* Two columns: sprint tasks + backlog */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sprint tasks */}
            <Card padding="none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle>Sprint Tasks</CardTitle>
                <Badge variant="brand" size="sm">{sprintTasks.length}</Badge>
              </CardHeader>
              <div className="divide-y divide-slate-50 px-5 pb-3">
                {sprintTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center gap-3">
                    <Flag className={cn('w-3.5 h-3.5 flex-shrink-0', PRIORITY_COLOR[task.priority])} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium leading-tight', task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800')}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={task.status === 'done' ? 'success' : task.status === 'in-progress' ? 'warning' : task.status === 'review' ? 'brand' : 'neutral'} size="sm">
                          {task.status}
                        </Badge>
                        <span className="text-[10px] text-slate-400">{task.storyPoints} pts</span>
                      </div>
                    </div>
                    <Avatar name={task.assignee} size="xs" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Backlog */}
            <Card padding="none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle>Backlog</CardTitle>
                <Badge variant="neutral" size="sm">{backlogTasks.length}</Badge>
              </CardHeader>
              <div className="divide-y divide-slate-50 px-5 pb-3">
                {backlogTasks.length === 0
                  ? <p className="py-6 text-sm text-slate-400 text-center">Backlog is empty</p>
                  : backlogTasks.map(task => (
                  <div key={task.id} className="py-3 flex items-center gap-3">
                    <Flag className={cn('w-3.5 h-3.5 flex-shrink-0', PRIORITY_COLOR[task.priority])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 leading-tight">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={PRIORITY_BADGE[task.priority]} size="sm">{task.priority}</Badge>
                        <span className="text-[10px] text-slate-400">{task.storyPoints} pts</span>
                      </div>
                    </div>
                    <Avatar name={task.assignee} size="xs" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="text-center py-12">
          <p className="text-slate-400">No active sprint for this project.</p>
        </Card>
      )}

      {/* All active sprints summary */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">All Active Sprints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeSprints.map(s => {
            const proj = projects.find(p => p.id === s.projectId)
            const pct  = Math.round((s.completedPoints / s.capacity) * 100)
            return (
              <Card key={s.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedProject(s.projectId)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: proj?.pillarColor }} />
                  <p className="text-xs font-semibold text-slate-600 truncate">{proj?.name}</p>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">{s.name}</p>
                <p className="text-xs text-slate-500 mb-3 line-clamp-1">{s.goal}</p>
                <Progress value={pct} color="brand" size="sm" label={`${s.completedPoints}/${s.capacity} pts`} showValue />
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
