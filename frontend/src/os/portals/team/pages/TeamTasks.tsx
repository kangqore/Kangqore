import { CheckSquare, Circle, AlertCircle } from 'lucide-react'

const tasks = [
  { id: 1, title: 'Wire MessageThread into CRDetail drawer',          project: 'Client Portal',      priority: 'HIGH',   status: 'IN_PROGRESS', due: 'Today'     },
  { id: 2, title: 'Sync kangqore-view with portal changes',           project: 'Client Portal',      priority: 'HIGH',   status: 'TODO',        due: 'Tomorrow'  },
  { id: 3, title: 'Build Ops Centre — Issues Feed page',              project: 'Ops Centre',         priority: 'HIGH',   status: 'TODO',        due: 'This week' },
  { id: 4, title: 'Review AEGIS Phase 2 agent stubs',                 project: 'AEGIS',              priority: 'MEDIUM', status: 'TODO',        due: 'This week' },
  { id: 5, title: 'Write SOC 2 Type I control mapping doc',           project: 'Compliance',         priority: 'MEDIUM', status: 'TODO',        due: 'Next week' },
  { id: 6, title: 'Sprint 3 — Live notification bell unit tests',     project: 'Client Portal',      priority: 'LOW',    status: 'TODO',        due: 'Next week' },
  { id: 7, title: 'Add BRAVE_SEARCH_API_KEY to production env',       project: 'Infrastructure',     priority: 'MEDIUM', status: 'TODO',        due: 'Next week' },
  { id: 8, title: 'Complete BIDS™ Rail & Logistics edition spec',     project: 'BIDS™ Suite',        priority: 'LOW',    status: 'TODO',        due: 'Later'     },
]

const PRIORITY_COLOR: Record<string, string> = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#6B7280' }
const STATUS_ICON: Record<string, React.ReactNode> = {
  IN_PROGRESS: <AlertCircle className="w-4 h-4 text-orange-400" />,
  TODO:        <Circle className="w-4 h-4 text-slate-600" />,
  DONE:        <CheckSquare className="w-4 h-4 text-emerald-400" />,
}

export function TeamTasks() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <CheckSquare className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Tasks</h1>
          <p className="text-slate-500 mt-1 text-sm">All tasks assigned to you across every project.</p>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 hover:border-white/20 transition-colors">
            <div className="flex-shrink-0">{STATUS_ICON[t.status]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.project}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: PRIORITY_COLOR[t.priority], background: `${PRIORITY_COLOR[t.priority]}18`, border: `1px solid ${PRIORITY_COLOR[t.priority]}30` }}>{t.priority}</span>
              <span className="text-xs text-slate-500 w-20 text-right">{t.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
