import { useState } from 'react'
import { Flag, CheckCircle2, Clock, Circle, Filter, ChevronDown } from 'lucide-react'
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

const PRIORITY_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  critical: { color: '#e2445c', glow: '#e2445c30', label: 'Critical' },
  high:     { color: '#fdab3d', glow: '#fdab3d25', label: 'High'     },
  medium:   { color: '#2564ea', glow: '#2564ea25', label: 'Medium'   },
  low:      { color: '#64748b', glow: '#64748b20', label: 'Low'      },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Decision':  '#e2445c',
  'Sign-off':  '#fdab3d',
  'Review':    '#2564ea',
  'Input':     '#7f53f9',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const isOverdue = (s: string, status: string) => status !== 'done' && new Date(s) < new Date()

type Task = typeof MOCK_TASKS[0]

// ── Kanban card ───────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task.dueDate, task.status)
  const prio = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.low
  const catColor = CATEGORY_COLORS[task.category] ?? '#64748b'

  return (
    <div className="rounded-2xl p-4 group transition-all duration-150 cursor-default"
      style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${prio.color}35` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1f2a4a' }}>

      {/* Priority + category */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Flag className="w-3 h-3 flex-shrink-0" style={{ color: prio.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: prio.color }}>
            {prio.label}
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: catColor, background: `${catColor}14`, border: `1px solid ${catColor}25` }}>
          {task.category}
        </span>
      </div>

      {/* Title */}
      <p className={`text-sm font-semibold leading-snug mb-3 ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] pt-3"
        style={{ borderTop: '1px solid #1a2340' }}>
        <span className="text-slate-500 truncate mr-2">{task.projectName.split(' ').slice(0, 2).join(' ')}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-slate-600 font-medium">{task.assignee}</span>
          <span className={`font-semibold ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
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
      <div className="flex items-center gap-2.5 px-1 mb-3">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accentColor } as React.CSSProperties} />
        </div>
        <span className="text-xs font-bold text-white">{title}</span>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ color: accentColor, background: `${accentColor}15` }}>
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3 flex-1">
        {tasks.map(t => <TaskCard key={t.id} task={t} />)}
        {tasks.length === 0 && (
          <div className="rounded-2xl p-5 text-center"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px dashed #1f2a4a' }}>
            <p className="text-xs text-slate-600">{emptyText}</p>
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

  const pending    = filtered.filter(t => t.status === 'pending')
  const inProgress = filtered.filter(t => t.status === 'in-progress')
  const done       = filtered.filter(t => t.status === 'done')

  const overdueCount = tasks.filter(t => isOverdue(t.dueDate, t.status)).length
  const criticalCount = tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Tasks & Actions</h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-slate-500">{pending.length + inProgress.length} active</p>
            {overdueCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: '#e2445c', background: 'rgba(226,68,92,0.1)', border: '1px solid rgba(226,68,92,0.2)' }}>
                {overdueCount} overdue
              </span>
            )}
            {criticalCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color: '#fdab3d', background: 'rgba(253,171,61,0.1)', border: '1px solid rgba(253,171,61,0.2)' }}>
                {criticalCount} critical
              </span>
            )}
          </div>
        </div>

        {/* Project filter */}
        <div className="relative">
          <button
            onClick={() => setShowFilter(f => !f)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 transition-all"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            {projectFilter === 'All' ? 'All Projects' : projectFilter.split(' ').slice(0, 2).join(' ')}
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          {showFilter && (
            <div className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-2xl z-20 min-w-[200px]"
              style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              {projects.map(p => (
                <button key={p}
                  onClick={() => { setProjectFilter(p); setShowFilter(false) }}
                  className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                  style={{ color: projectFilter === p ? '#2564ea' : '#94a3b8',
                           background: projectFilter === p ? 'rgba(37,100,234,0.08)' : 'transparent' }}
                  onMouseEnter={e => { if (projectFilter !== p) (e.currentTarget as HTMLElement).style.background = '#151C2F' }}
                  onMouseLeave={e => { if (projectFilter !== p) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Column
          title="Pending"
          tasks={pending}
          icon={Circle}
          accentColor="#fdab3d"
          emptyText="Nothing pending — all caught up!"
        />
        <Column
          title="In Progress"
          tasks={inProgress}
          icon={Clock}
          accentColor="#2564ea"
          emptyText="No items in progress"
        />
        <Column
          title="Completed"
          tasks={done}
          icon={CheckCircle2}
          accentColor="#00c875"
          emptyText="No completed tasks yet"
        />
      </div>
    </div>
  )
}
