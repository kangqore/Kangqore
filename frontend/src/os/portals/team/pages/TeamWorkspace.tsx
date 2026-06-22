import { Users, Clock, CheckSquare, AlertCircle } from 'lucide-react'

const stats = [
  { label: 'Active Projects',  value: '4',    icon: Users,        color: '#F97316' },
  { label: 'Tasks Due Today',  value: '7',    icon: AlertCircle,  color: '#EF4444' },
  { label: 'Completed (MTD)',  value: '31',   icon: CheckSquare,  color: '#10B981' },
  { label: 'Hours Logged',     value: '142h', icon: Clock,        color: '#6366F1' },
]

const myProjects = [
  { name: 'BIDS™ Intelligence Suite', role: 'Lead Developer',      progress: 72, health: '#10B981' },
  { name: 'Client Portal Revamp',     role: 'Frontend Engineer',   progress: 58, health: '#F59E0B' },
  { name: 'AEGIS Compliance Module',  role: 'Contributor',         progress: 40, health: '#10B981' },
  { name: 'Ops Centre Sprint 0',      role: 'Product Engineer',    progress: 15, health: '#EF4444' },
]

const recentActivity = [
  { action: 'Reviewed PR #218 — ClientChangeRequests messaging', time: '2h ago' },
  { action: 'Completed deliverable: Sprint 6 backend routes',    time: '5h ago' },
  { action: 'Updated task: Wire MessageThread into CRDetail',    time: 'Yesterday' },
  { action: 'Joined standup — AEGIS Phase 2 planning',           time: 'Yesterday' },
]

export function TeamWorkspace() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Workspace</h1>
          <p className="text-slate-500 mt-1 text-sm">Your daily hub — projects, tasks, and team activity at a glance.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 flex flex-col gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Projects */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">My Projects</h2>
        <div className="space-y-3">
          {myProjects.map(({ name, role, progress, health }) => (
            <div key={name} className="p-5 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{role}</p>
                </div>
                <span className="text-xs font-bold text-slate-400">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: health }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-base font-bold text-slate-200 mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.map(({ action, time }) => (
            <div key={action} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/30">
              <p className="text-sm text-slate-300">{action}</p>
              <span className="text-xs text-slate-600 ml-4 flex-shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
