import { useState } from 'react'
import { Flag, CheckCircle2, Clock, Circle, Filter, ChevronDown } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { useClientTasks } from '../useClientData'

const MOCK_TASKS = [
  { id: 't1', projectName: 'Patient Portal v2',      title: 'Review and approve wireframes for v3 intake form',   status: 'pending',     priority: 'high',    assignee: 'You',      dueDate: '2026-06-08', category: 'Review'   },
  { id: 't2', projectName: 'Patient Portal v2',      title: 'Sign off on accessibility audit report',             status: 'pending',     priority: 'medium',  assignee: 'You',      dueDate: '2026-06-15', category: 'Sign-off' },
  { id: 't3', projectName: 'Patient Portal v2',      title: 'Provide sample patient data for UAT seeding',        status: 'in-progress', priority: 'high',    assignee: 'IT Team',  dueDate: '2026-06-10', category: 'Input'    },
  { id: 't4', projectName: 'Patient Portal v2',      title: 'HIPAA audit vendor selection — final decision',       status: 'done',        priority: 'critical',assignee: 'You',      dueDate: '2026-05-30', category: 'Decision' },
  { id: 't5', projectName: 'HIPAA Compliance Layer', title: 'Review compliance gap report and confirm scope',     status: 'done',        priority: 'high',    assignee: 'You',      dueDate: '2026-05-25', category: 'Review'   },
  { id: 't6', projectName: 'HIPAA Compliance Layer', title: 'Sign off on BAA agreement with Kangqore',           status: 'pending',     priority: 'critical',assignee: 'Legal',    dueDate: '2026-06-12', category: 'Sign-off' },
  { id: 't7', projectName: 'Analytics Dashboard',    title: 'Provide branding assets (logo, colours, fonts)',     status: 'pending',     priority: 'medium',  assignee: 'Marketing',dueDate: '2026-06-09', category: 'Input'    },
  { id: 't8', projectName: 'Analytics Dashboard',    title: 'Review Phase 1 design prototype',                   status: 'in-progress', priority: 'high',    assignee: 'You',      dueDate: '2026-06-11', category: 'Review'   },
]

const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  critical: { color: '#e2445c', label: 'Critical' },
  high:     { color: '#fdab3d', label: 'High'     },
  medium:   { color: '#579bfc', label: 'Medium'   },
  low:      { color: '#c5c7d0', label: 'Low'      },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Decision':  '#e2445c',
  'Sign-off':  '#fdab3d',
  'Review':    '#579bfc',
  'Input':     '#7f53f9',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const isOverdue = (s: string, status: string) => status !== 'done' && new Date(s) < new Date()

type Task = typeof MOCK_TASKS[0]

// ── Kanban card ───────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const overdue  = isOverdue(task.dueDate, task.status)
  const prio     = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.low
  const catColor = CATEGORY_COLORS[task.category] ?? '#579bfc'

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-150 cursor-default hover:-translate-y-px"
      style={{
        background: 'var(--os-card)',
        border: '1px solid var(--os-border)',
        borderLeft: `3px solid ${prio.color}`,
        boxShadow: 'var(--os-shadow-card)',
      }}
    >
      {/* Priority + category */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Flag className="w-3 h-3 flex-shrink-0" style={{ color: prio.color }} />
          <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: prio.color }}>
            {prio.label}
          </span>
        </div>
        <span
          className="text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: catColor, color: '#fff' }}
        >
          {task.category}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-sm font-semibold leading-snug mb-3"
        style={{
          color: task.status === 'done' ? 'var(--os-text-3)' : 'var(--os-text-1)',
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] pt-3" style={{ borderTop: '1px solid var(--os-border)' }}>
        <span className="truncate mr-2" style={{ color: 'var(--os-text-3)' }}>
          {task.projectName.split(' ').slice(0, 2).join(' ')}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-medium" style={{ color: 'var(--os-text-2)' }}>{task.assignee}</span>
          <span
            className="font-semibold"
            style={{ color: overdue ? '#e2445c' : 'var(--os-text-3)' }}
          >
            {overdue ? '⚠ ' : ''}{fmtDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Column ────────────────────────────────────────────────────────────────────

function Column({
  title, tasks, icon: Icon, accentColor, emptyText,
}: {
  title: string
  tasks: Task[]
  icon: React.ElementType
  accentColor: string
  emptyText: string
}) {
  return (
    <div className="flex flex-col min-h-0" style={{ minWidth: 0 }}>
      {/* Column header */}
      <div className="flex items-center gap-2.5 px-1 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18` }}>
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{title}</span>
        <span
          className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full"
          style={{ background: accentColor, color: '#fff', boxShadow: `0 2px 8px ${accentColor}40` }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3 flex-1">
        {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'var(--os-card)', border: `1px dashed ${accentColor}30`, boxShadow: 'var(--os-shadow-sm)' }}
          >
            <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `${accentColor}12` }}>
              <Icon className="w-4 h-4" style={{ color: accentColor, opacity: 0.6 }} />
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--os-text-3)' }}>{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientTasks() {
  const [projectFilter, setProjectFilter] = useState('All')
  const [showFilter, setShowFilter] = useState(false)

  const { data: liveTasks } = useClientTasks()
  const tasks: Task[] = ((liveTasks as Task[] | undefined)?.length ? liveTasks : MOCK_TASKS) as Task[]

  const projects = ['All', ...new Set(tasks.map(t => t.projectName))]
  const filtered = projectFilter === 'All' ? tasks : tasks.filter(t => t.projectName === projectFilter)

  const pending     = filtered.filter(t => t.status === 'pending')
  const inProgress  = filtered.filter(t => t.status === 'in-progress')
  const done        = filtered.filter(t => t.status === 'done')
  const overdueCount  = tasks.filter(t => isOverdue(t.dueDate, t.status)).length
  const criticalCount = tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length

  return (
    <div className="space-y-5">
      <KIMMPSignalBar module="Tasks" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Tasks & Actions</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm" style={{ color: 'var(--os-text-2)' }}>{pending.length + inProgress.length} active</p>
            {overdueCount > 0 && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: '#e2445c', color: '#fff' }}>
                {overdueCount} overdue
              </span>
            )}
            {criticalCount > 0 && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: '#fdab3d', color: '#fff' }}>
                {criticalCount} critical
              </span>
            )}
          </div>
        </div>

        {/* Project filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilter(f => !f)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}
          >
            <Filter className="w-3.5 h-3.5" style={{ color: 'var(--os-text-3)' }} />
            {projectFilter === 'All' ? 'All Projects' : projectFilter.split(' ').slice(0, 2).join(' ')}
            <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--os-text-3)' }} />
          </button>
          {showFilter && (
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-2xl z-20 min-w-[200px]"
              style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              {projects.map(p => (
                <button
                  key={p}
                  onClick={() => { setProjectFilter(p); setShowFilter(false) }}
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                  style={{
                    color: projectFilter === p ? '#579bfc' : 'var(--os-text-2)',
                    background: projectFilter === p ? 'rgba(87,155,252,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (projectFilter !== p) (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)' }}
                  onMouseLeave={e => { if (projectFilter !== p) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Column title="Pending"     tasks={pending}    icon={Circle}       accentColor="#fdab3d" emptyText="Nothing pending — all caught up!" />
        <Column title="In Progress" tasks={inProgress} icon={Clock}        accentColor="#579bfc" emptyText="No items in progress" />
        <Column title="Completed"   tasks={done}       icon={CheckCircle2} accentColor="#00c875" emptyText="No completed tasks yet" />
      </div>
    </div>
  )
}
