import { useMemo } from 'react'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useProjectsStore } from '../store'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const VIEW_START = new Date('2026-01-01')
const VIEW_END   = new Date('2026-12-31')
const TOTAL_DAYS = Math.ceil((VIEW_END.getTime() - VIEW_START.getTime()) / 86400000)

function dayOffset(date: string) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - VIEW_START.getTime()) / 86400000))
}
function dayWidth(start: string, end: string) {
  return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000))
}
function toPercent(days: number) {
  return (days / TOTAL_DAYS) * 100
}

const TODAY_OFFSET = toPercent(dayOffset(new Date().toISOString().split('T')[0]))

export function GanttPage() {
  const { projects } = useProjectsStore()

  const months = useMemo(() => {
    const result: { label: string; left: number; width: number }[] = []
    let d = new Date(VIEW_START)
    while (d <= VIEW_END) {
      const start = new Date(d.getFullYear(), d.getMonth(), 1)
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      const s = dayOffset(start.toISOString().split('T')[0])
      const w = dayWidth(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
      result.push({ label: MONTH_LABELS[d.getMonth()], left: toPercent(s), width: toPercent(w) })
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    }
    return result
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Gantt Chart</h2>
        <p className="text-sm text-slate-500 mt-0.5">Project timelines — 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Month header */}
        <div className="flex border-b border-slate-100">
          <div className="w-64 flex-shrink-0 px-4 py-3 border-r border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Project
          </div>
          <div className="flex-1 relative h-10 overflow-hidden">
            {months.map(m => (
              <div
                key={m.label}
                className="absolute top-0 h-full flex items-center border-r border-slate-100 last:border-0"
                style={{ left: `${m.left}%`, width: `${m.width}%` }}
              >
                <span className="text-xs text-slate-400 font-medium px-2">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today line overlay */}
        <div className="relative">
          {projects.map((project, i) => {
            const offset = toPercent(dayOffset(project.startDate))
            const width  = toPercent(dayWidth(project.startDate, project.endDate))
            const isLate = new Date(project.endDate) < new Date() && project.status !== 'completed'

            return (
              <div key={project.id} className={`flex items-center ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-b border-slate-100 last:border-0`}>
                {/* Project info */}
                <div className="w-64 flex-shrink-0 px-4 py-3 border-r border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: project.pillarColor }} />
                    <span className="text-xs font-medium text-slate-800 truncate">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-4">
                    <Avatar name={project.owner} size="xs" />
                    <Badge
                      variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : project.status === 'on-hold' ? 'warning' : 'brand'}
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Gantt row */}
                <div className="flex-1 relative h-14 overflow-hidden">
                  {/* Grid lines */}
                  {months.map(m => (
                    <div
                      key={m.label}
                      className="absolute top-0 bottom-0 border-r border-slate-100"
                      style={{ left: `${m.left + m.width}%` }}
                    />
                  ))}

                  {/* Today line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-400 z-10"
                    style={{ left: `${TODAY_OFFSET}%` }}
                  />

                  {/* Project bar */}
                  <div
                    className="absolute top-3 h-8 rounded-xl flex items-center px-2 z-5 overflow-hidden"
                    style={{
                      left: `${offset}%`,
                      width: `${Math.max(width, 2)}%`,
                      background: project.status === 'completed'
                        ? '#22c55e'
                        : isLate ? '#ef4444' : project.pillarColor,
                      opacity: project.status === 'on-hold' ? 0.5 : 1,
                    }}
                  >
                    {/* Progress fill */}
                    <div
                      className="absolute left-0 top-0 bottom-0 rounded-xl opacity-40 bg-black"
                      style={{ width: `${100 - project.progress}%`, right: 0, left: 'auto' }}
                    />
                    {width > 8 && (
                      <span className="text-white text-[10px] font-semibold truncate z-10 relative">
                        {project.progress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Today marker label */}
          <div
            className="absolute top-0 flex flex-col items-center pointer-events-none"
            style={{ left: `calc(${TODAY_OFFSET}% + 256px + 2px)` }}
          >
            <div className="bg-red-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">TODAY</div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-purple-600" />Active</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-500" />Completed</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500" />Planned</span>
          <span className="flex items-center gap-1.5"><span className="w-px h-3 bg-red-400" />Today</span>
          <span className="flex items-center gap-1.5 ml-auto text-slate-400">Darker shade = remaining work</span>
        </div>
      </div>
    </div>
  )
}
