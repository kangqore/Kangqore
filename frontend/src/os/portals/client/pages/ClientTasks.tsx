import { useState } from 'react'
import { Flag, CheckCircle2, Clock, Circle } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { cn } from '@design-system/cn'
import { useClientTasks } from '../useClientData'

// Tasks are read-only from the client's perspective — they show tasks
// assigned to their projects that need client action (decisions, reviews, sign-offs)

const MOCK_TASKS = [
  { id: 't1', projectName: 'Patient Portal v2',      title: 'Review and approve wireframes for v3 intake form',   status: 'pending',     priority: 'high',   assignee: 'Client',      dueDate: '2026-06-08', category: 'Review' },
  { id: 't2', projectName: 'Patient Portal v2',      title: 'Sign off on accessibility audit report',             status: 'pending',     priority: 'medium', assignee: 'Client',      dueDate: '2026-06-15', category: 'Sign-off' },
  { id: 't3', projectName: 'Patient Portal v2',      title: 'Provide sample patient data for UAT seeding',        status: 'in-progress', priority: 'high',   assignee: 'IT Team',     dueDate: '2026-06-10', category: 'Input' },
  { id: 't4', projectName: 'Patient Portal v2',      title: 'Decision: HIPAA audit vendor selection',             status: 'completed',   priority: 'critical',assignee: 'Client',     dueDate: '2026-05-30', category: 'Decision' },
  { id: 't5', projectName: 'HIPAA Compliance Layer', title: 'Review compliance gap report and confirm scope',     status: 'completed',   priority: 'high',   assignee: 'Client',      dueDate: '2026-05-25', category: 'Review' },
  { id: 't6', projectName: 'HIPAA Compliance Layer', title: 'Sign off on BAA agreement with Kangqore',           status: 'pending',     priority: 'critical',assignee: 'Legal',      dueDate: '2026-06-12', category: 'Sign-off' },
  { id: 't7', projectName: 'Analytics Dashboard',    title: 'Provide branding assets (logo, colours, fonts)',     status: 'pending',     priority: 'medium', assignee: 'Marketing',   dueDate: '2026-06-09', category: 'Input' },
  { id: 't8', projectName: 'Analytics Dashboard',    title: 'Review Phase 1 design prototype',                   status: 'in-progress', priority: 'high',   assignee: 'Client',      dueDate: '2026-06-11', category: 'Review' },
]

const STATUS_ICON: Record<string, React.ReactNode> = {
  'pending':     <Circle      className="w-4 h-4 text-slate-300" />,
  'in-progress': <Clock       className="w-4 h-4 text-amber-500" />,
  'completed':   <CheckCircle2 className="w-4 h-4 text-green-500" />,
}

const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-500', high: 'text-orange-500', medium: 'text-amber-400', low: 'text-slate-300',
}

const CATEGORY_VARIANT: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  Decision: 'danger', 'Sign-off': 'warning', Review: 'info', Input: 'neutral',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const isOverdue = (s: string, status: string) => status !== 'completed' && new Date(s) < new Date()

type Filter = 'all' | 'pending' | 'in-progress' | 'completed'
type Task = typeof MOCK_TASKS[0]

export function ClientTasks() {
  const [filter, setFilter] = useState<Filter>('all')
  const { data: liveTasks } = useClientTasks()
  const tasks: Task[] = (liveTasks?.length ? liveTasks : MOCK_TASKS) as Task[]

  const visible  = tasks.filter(t => filter === 'all' || t.status === filter)
  const projects = [...new Set(visible.map(t => t.projectName))]

  const pending = tasks.filter(t => t.status === 'pending').length
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.status)).length

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Tasks & Actions</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {pending} pending your action{overdue > 0 && <span className="ml-2 text-red-600 font-medium">· {overdue} overdue</span>}
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'in-progress', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f ? 'bg-[#2564ea] text-white' : 'bg-[#151C2F] border border-[#2E2854] text-slate-500 hover:border-blue-300'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Grouped by project */}
      {projects.map(proj => {
        const tasks = visible.filter(t => t.projectName === proj)
        return (
          <div key={proj}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{proj}</p>
            <Card padding="none">
              <ul className="divide-y divide-[#2E2854]">
                {tasks.map(t => {
                  const overdue = isOverdue(t.dueDate, t.status)
                  return (
                    <li
                      key={t.id}
                      className={cn(
                        'flex items-start gap-3 px-5 py-3.5 transition-colors',
                        t.status === 'completed' && 'opacity-60',
                      )}
                    >
                      {STATUS_ICON[t.status]}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm text-slate-200',
                          t.status === 'completed' && 'line-through text-slate-500',
                        )}>
                          {t.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <Badge variant={CATEGORY_VARIANT[t.category] ?? 'neutral'} size="sm">{t.category}</Badge>
                          <span className="text-[11px] text-slate-500">{t.assignee}</span>
                          <span className={cn(
                            'text-[11px] font-medium',
                            overdue ? 'text-red-500' : 'text-slate-500'
                          )}>
                            {overdue ? 'Overdue · ' : ''}{fmtDate(t.dueDate)}
                          </span>
                        </div>
                      </div>
                      <Flag className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', PRIORITY_COLOR[t.priority])} />
                    </li>
                  )
                })}
              </ul>
            </Card>
          </div>
        )
      })}

      {visible.length === 0 && (
        <div className="py-14 text-center text-sm text-slate-500">No tasks match this filter.</div>
      )}
    </div>
  )
}
