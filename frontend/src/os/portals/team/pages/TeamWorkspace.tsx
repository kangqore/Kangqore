import { useState } from 'react'
import { Users, Clock, CheckSquare, AlertCircle, Brain, Zap, Circle, Wifi } from 'lucide-react'

const stats = [
  { label: 'Active Projects',  value: '4',    icon: Users,        color: '#F97316' },
  { label: 'Tasks Due Today',  value: '7',    icon: AlertCircle,  color: '#EF4444' },
  { label: 'Completed (MTD)',  value: '31',   icon: CheckSquare,  color: '#10B981' },
  { label: 'Hours Logged',     value: '142h', icon: Clock,        color: '#6366F1' },
]

const myProjects = [
  { name: 'BIDS™ Intelligence Suite',  role: 'Lead Developer',     progress: 72, health: '#10B981', sprint: 'Sprint 12',  deadline: '4 Jul' },
  { name: 'Client Portal Revamp',      role: 'Frontend Engineer',  progress: 58, health: '#F59E0B', sprint: 'Sprint 6',   deadline: '28 Jun' },
  { name: 'AEGIS Compliance Module',   role: 'Contributor',        progress: 40, health: '#10B981', sprint: 'Sprint 2',   deadline: '15 Jul' },
  { name: 'Ops Centre Sprint 0',       role: 'Product Engineer',   progress: 85, health: '#10B981', sprint: 'Sprint 0',   deadline: '25 Jun' },
]

const teamMembers = [
  { name: 'Arjun Sharma',   role: 'Lead Engineer',    status: 'online',  workingOn: 'Ops Centre — Entity Graph',        avatar: 'AS' },
  { name: 'Priya Nair',     role: 'Backend Engineer', status: 'online',  workingOn: 'AEGIS agent stubs Phase 2',        avatar: 'PN' },
  { name: 'Kavya Reddy',    role: 'Product Designer', status: 'away',    workingOn: 'BIDS™ Rail edition wireframes',    avatar: 'KR' },
  { name: 'Rohan Mehta',    role: 'DevOps',           status: 'online',  workingOn: 'SOC 2 control mapping',            avatar: 'RM' },
  { name: 'Sneha Gupta',    role: 'Frontend',         status: 'offline', workingOn: 'Last seen 2h ago',                 avatar: 'SG' },
]

const STATUS_DOT: Record<string, string> = { online: '#10B981', away: '#F59E0B', offline: 'var(--os-text-2)' }

const kimmpInsight = {
  signal: 'Sprint 6 delivery velocity is 18% above baseline this week. Risk: Ops Centre Sprint 0 has 1 unresolved blocker (entity graph design freeze not confirmed). Recommend: Confirm design freeze today to keep Sprint 0 on track.',
  confidence: 91,
}

const recentActivity = [
  { action: 'Reviewed PR #218 — ClientChangeRequests messaging thread', time: '2h ago',    actor: 'Arjun' },
  { action: 'Completed deliverable: Sprint 6 backend routes',           time: '5h ago',    actor: 'Priya' },
  { action: 'Merged: TEAM/EXECUTIVE roles + 8-card login',             time: 'Yesterday', actor: 'System' },
  { action: 'Joined standup — AEGIS Phase 2 planning',                 time: 'Yesterday', actor: 'Team' },
  { action: 'SOC 2 Type I readiness assessment kick-off',              time: '2 days ago', actor: 'Rohan' },
]

export function TeamWorkspace() {
  const [expandKIMMP, setExpandKIMMP] = useState(false)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">My Workspace</h1>
            <p className="text-[var(--os-text-2)] mt-1 text-sm">Your daily hub — projects, tasks, and team activity at a glance.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">3 online</span>
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
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* KIMMP Team Insight */}
      <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 backdrop-blur-xl cursor-pointer" onClick={() => setExpandKIMMP(e => !e)}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-black tracking-widest text-orange-400 uppercase">KIMMP Team Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-orange-400/70">{kimmpInsight.confidence}% confidence</span>
            <Zap className="w-3.5 h-3.5 text-orange-400/50" />
          </div>
        </div>
        <p className={`text-sm text-[var(--os-text-1)] mt-3 leading-relaxed ${expandKIMMP ? '' : 'line-clamp-2'}`}>{kimmpInsight.signal}</p>
        {!expandKIMMP && <p className="text-xs text-orange-400/60 mt-1">Tap to expand</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <section>
          <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">My Projects</h2>
          <div className="space-y-3">
            {myProjects.map(({ name, role, progress, health, sprint, deadline }) => (
              <div key={name} className="p-4 rounded-2xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{role} · {sprint}</p>
                  </div>
                  <span className="text-xs text-[var(--os-text-2)] flex-shrink-0 ml-2">Due {deadline}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: health }} />
                  </div>
                  <span className="text-xs font-bold text-[var(--os-text-2)] w-8 text-right">{progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Presence */}
        <section>
          <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Team Now</h2>
          <div className="space-y-2">
            {teamMembers.map(({ name, role, status, workingOn, avatar }) => (
              <div key={name} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/30 hover:border-white/20 transition-colors">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-300">{avatar}</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900" style={{ background: STATUS_DOT[status] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-[var(--os-text-2)] truncate">{workingOn}</p>
                </div>
                <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0">{role}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section>
        <h2 className="text-base font-bold text-[var(--os-text-1)] mb-4">Recent Activity</h2>
        <div className="space-y-1">
          {recentActivity.map(({ action, time, actor }) => (
            <div key={action} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900/30 transition-colors">
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Circle className="w-2 h-2 fill-slate-600 text-[var(--os-text-2)]" />
              </div>
              <p className="text-sm text-[var(--os-text-2)] flex-1">{action}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-semibold text-[var(--os-text-2)]">{actor}</span>
                <span className="text-xs text-[var(--os-text-2)]">{time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
