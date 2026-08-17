import { useMemo } from 'react'
import { Badge } from '@design-system/components/Badge'
import { Avatar } from '@design-system/components/Avatar'
import { useProjectsStore } from '../store'
import type { Project } from '../types'

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
  const { projects, isLoading } = useProjectsStore()

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

  const HEALTH_BAR_COLOR = (project: Project) => {
    if (project.status === 'completed') return '#00c875'
    const isLate = new Date(project.endDate) < new Date() && project.status !== 'completed'
    if (isLate || project.health === 'behind') return '#e2445c'
    if (project.health === 'at-risk') return '#fdab3d'
    return '#00c875'
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-40 rounded-2xl" style={{ background: 'var(--os-surface-0)' }} />
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
          <div className="h-10" style={{ borderBottom: '1px solid var(--os-border)' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 flex items-center px-4" style={{ borderBottom: '1px solid var(--os-border)' }}>
              <div className="w-40 h-4 rounded mr-4 flex-shrink-0" style={{ background: 'var(--os-surface-0)' }} />
              <div className="flex-1 h-6 rounded-2xl" style={{ marginLeft: `${i * 8}%`, width: `${30 + i * 5}%`, background: 'var(--os-surface-0)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>Gantt Chart</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--os-text-2)' }}>Project timelines — 2026</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-card)' }}>
        {/* Month header */}
        <div className="flex" style={{ borderBottom: '1px solid var(--os-border)' }}>
          <div className="w-64 flex-shrink-0 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ borderRight: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
            Project
          </div>
          <div className="flex-1 relative h-10 overflow-hidden">
            {months.map(m => (
              <div
                key={m.label}
                className="absolute top-0 h-full flex items-center last:border-0"
                style={{ left: `${m.left}%`, width: `${m.width}%`, borderRight: '1px solid var(--os-border)' }}
              >
                <span className="text-xs font-medium px-2" style={{ color: 'var(--os-text-2)' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="relative">
          {projects.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm" style={{ color: 'var(--os-text-2)' }}>No projects to display on the timeline.</p>
            </div>
          )}
          {projects.map((project, i) => {
            const offset   = toPercent(dayOffset(project.startDate))
            const width    = toPercent(dayWidth(project.startDate, project.endDate))
            const barColor = HEALTH_BAR_COLOR(project)

            return (
              <div
                key={project.id}
                className="flex items-center last:border-0"
                style={{
                  background: i % 2 === 0 ? 'var(--os-card)' : 'var(--os-surface-0)',
                  borderBottom: '1px solid var(--os-border)',
                }}
              >
                {/* Project info */}
                <div className="w-64 flex-shrink-0 px-4 py-3" style={{ borderRight: '1px solid var(--os-border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: barColor }} />
                    <span className="text-xs font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{project.name}</span>
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
                      className="absolute top-0 bottom-0"
                      style={{ left: `${m.left + m.width}%`, borderRight: '1px solid var(--os-border)' }}
                    />
                  ))}

                  {/* Today line: dashed red */}
                  <div
                    className="absolute top-0 bottom-0 z-10"
                    style={{ left: `${TODAY_OFFSET}%`, width: 1, borderLeft: '2px dashed #e2445c' }}
                  />

                  {/* Project bar */}
                  <div
                    className="absolute top-3 h-8 rounded-2xl flex items-center px-2 overflow-hidden"
                    style={{
                      left: `${offset}%`,
                      width: `${Math.max(width, 2)}%`,
                      background: barColor,
                      opacity: project.status === 'on-hold' ? 0.5 : 1,
                    }}
                  >
                    {/* Progress fill overlay */}
                    <div
                      className="absolute top-0 bottom-0 rounded-2xl bg-black/30"
                      style={{ width: `${100 - project.progress}%`, right: 0, left: 'auto' }}
                    />
                    {width > 8 && (
                      <span className="text-white text-[10px] font-bold truncate relative z-10">
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
            <div className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#e2445c' }}>TODAY</div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 flex items-center gap-6 text-xs" style={{ borderTop: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#00c875' }} />On Track</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#fdab3d' }} />At Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#e2445c' }} />Behind</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-0 h-3" style={{ borderLeft: '2px dashed #e2445c' }} />Today</span>
          <span className="ml-auto">Darker = remaining work</span>
        </div>
      </div>
    </div>
  )
}
