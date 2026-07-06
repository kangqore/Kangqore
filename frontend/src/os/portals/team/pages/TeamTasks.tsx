import { useState } from 'react'
import { CheckSquare, Circle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
type TaskStatus = 'IN_PROGRESS' | 'TODO' | 'DONE'

interface Task {
  id: number
  title: string
  project: string
  priority: Priority
  status: TaskStatus
  due: string
  dueGroup: 'today' | 'week' | 'later'
}

const tasks: Task[] = [
  { id: 1,  title: 'Wire MessageThread into CRDetail drawer',         project: 'Client Portal',   priority: 'HIGH',   status: 'DONE',        due: 'Today',    dueGroup: 'today'  },
  { id: 2,  title: 'Confirm entity graph design freeze — Ops Centre', project: 'Ops Centre',      priority: 'HIGH',   status: 'IN_PROGRESS', due: 'Today',    dueGroup: 'today'  },
  { id: 3,  title: 'Review AEGIS Phase 2 agent stubs',               project: 'AEGIS',           priority: 'MEDIUM', status: 'IN_PROGRESS', due: 'Today',    dueGroup: 'today'  },
  { id: 4,  title: 'Deploy TEAM/EXECUTIVE roles to staging',         project: 'Auth',            priority: 'HIGH',   status: 'TODO',        due: 'Tomorrow', dueGroup: 'week'   },
  { id: 5,  title: 'Build Ops Centre — Change Log page',             project: 'Ops Centre',      priority: 'HIGH',   status: 'TODO',        due: 'This week', dueGroup: 'week'  },
  { id: 6,  title: 'Write SOC 2 Type I control mapping section',     project: 'Compliance',      priority: 'MEDIUM', status: 'TODO',        due: 'This week', dueGroup: 'week'  },
  { id: 7,  title: 'Sprint 6 — live notification bell unit tests',   project: 'Client Portal',   priority: 'LOW',    status: 'TODO',        due: 'This week', dueGroup: 'week'  },
  { id: 8,  title: 'Add BRAVE_SEARCH_API_KEY to production env',     project: 'Infrastructure',  priority: 'MEDIUM', status: 'TODO',        due: 'Next week', dueGroup: 'later' },
  { id: 9,  title: 'Complete BIDS™ Rail & Logistics edition spec',   project: 'BIDS™ Suite',     priority: 'LOW',    status: 'TODO',        due: 'Later',    dueGroup: 'later'  },
  { id: 10, title: 'Kangqore Connect — ServiceNow connector design', project: 'Integrations',    priority: 'HIGH',   status: 'TODO',        due: 'Later',    dueGroup: 'later'  },
]

const PRIORITY_COLOR: Record<Priority, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#6B7280' }

type Filter = 'all' | 'in_progress' | 'todo' | 'done'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',         label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'todo',        label: 'To Do' },
  { id: 'done',        label: 'Done' },
]

const GROUPS: { id: 'today' | 'week' | 'later'; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week',  label: 'This Week' },
  { id: 'later', label: 'Later' },
]

function StatusIcon({ status }: { status: TaskStatus }) {
  if (status === 'DONE')        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
  if (status === 'IN_PROGRESS') return <AlertCircle  className="w-4 h-4 text-orange-400  flex-shrink-0" />
  return                               <Circle       className="w-4 h-4 text-[var(--os-text-2)]   flex-shrink-0" />
}

export function TeamTasks() {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = tasks.filter(t => {
    if (filter === 'all')         return true
    if (filter === 'in_progress') return t.status === 'IN_PROGRESS'
    if (filter === 'todo')        return t.status === 'TODO'
    if (filter === 'done')        return t.status === 'DONE'
    return true
  })

  const today       = visible.filter(t => t.dueGroup === 'today')
  const thisWeek    = visible.filter(t => t.dueGroup === 'week')
  const later       = visible.filter(t => t.dueGroup === 'later')

  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const dueToday        = tasks.filter(t => t.dueGroup === 'today').length
  const doneCount       = tasks.filter(t => t.status === 'DONE').length

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <CheckSquare className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Tasks</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">All tasks assigned to you across every project.</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-sm text-[var(--os-text-2)]"><span className="font-bold text-white">{inProgressCount}</span> in progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span className="text-sm text-[var(--os-text-2)]"><span className="font-bold text-white">{dueToday}</span> due today</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-sm text-[var(--os-text-2)]"><span className="font-bold text-white">{doneCount}</span> done</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 -mt-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${
              filter === f.id
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-white/10'
            }`}
          >
            {f.label}
            <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-[var(--os-text-2)]">
              {f.id === 'all'         ? tasks.length
               : f.id === 'in_progress' ? inProgressCount
               : f.id === 'todo'        ? tasks.filter(t => t.status === 'TODO').length
               : doneCount}
            </span>
          </button>
        ))}
      </div>

      {/* Grouped task lists */}
      {[{ group: today, label: 'Today' }, { group: thisWeek, label: 'This Week' }, { group: later, label: 'Later' }]
        .filter(({ group }) => group.length > 0)
        .map(({ group, label }) => (
          <section key={label}>
            <h2 className="text-xs font-black tracking-widest uppercase text-[var(--os-text-2)] mb-3">{label}</h2>
            <div className="space-y-2">
              {group.map(t => (
                <div key={t.id} className={`flex items-center gap-4 p-4 rounded-2xl border bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-white/20 transition-colors ${t.status === 'DONE' ? 'border-white/5 opacity-60' : 'border-white/10'}`}>
                  <StatusIcon status={t.status} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${t.status === 'DONE' ? 'text-[var(--os-text-2)] line-through' : 'text-white'}`}>{t.title}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{t.project}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: PRIORITY_COLOR[t.priority], background: `${PRIORITY_COLOR[t.priority]}18`, border: `1px solid ${PRIORITY_COLOR[t.priority]}30` }}>{t.priority}</span>
                    <span className="text-xs text-[var(--os-text-2)] w-20 text-right">{t.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      }

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
          <p className="text-white font-semibold">All clear</p>
          <p className="text-[var(--os-text-2)] text-sm mt-1">No tasks in this filter.</p>
        </div>
      )}
    </div>
  )
}
