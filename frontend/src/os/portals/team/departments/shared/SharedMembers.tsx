import { useState } from 'react'
import { Users, Search } from 'lucide-react'

const members = [
  { name: 'Arjun Sharma',   role: 'Lead Engineer',     dept: 'IT',           status: 'online',  project: 'Ops Centre — Entity Graph',      avatar: 'AS', alloc: 90 },
  { name: 'Priya Nair',     role: 'Backend Engineer',  dept: 'IT',           status: 'online',  project: 'HANUMANAS Phase 2',                  avatar: 'PN', alloc: 85 },
  { name: 'Kavya Reddy',    role: 'Product Designer',  dept: 'HR',           status: 'away',    project: 'BIDS™ Rail edition wireframes',  avatar: 'KR', alloc: 70 },
  { name: 'Rohan Mehta',    role: 'DevOps Engineer',   dept: 'Security',     status: 'online',  project: 'SOC 2 control mapping',          avatar: 'RM', alloc: 80 },
  { name: 'Sneha Gupta',    role: 'Frontend Engineer', dept: 'IT',           status: 'offline', project: 'Last seen 2h ago',               avatar: 'SG', alloc: 60 },
  { name: 'Mihir Patel',    role: 'Finance Analyst',   dept: 'Finance',      status: 'online',  project: 'Q2 forecasting model',           avatar: 'MP', alloc: 75 },
  { name: 'Divya Kapoor',   role: 'Legal Counsel',     dept: 'Legal',        status: 'online',  project: 'MSA review — GlobalTech',        avatar: 'DK', alloc: 65 },
  { name: 'Rahul Verma',    role: 'Support Lead',      dept: 'Support',      status: 'online',  project: 'SLA remediation plan',           avatar: 'RV', alloc: 88 },
  { name: 'Ananya Bose',    role: 'Facilities Mgr',    dept: 'Facilities',   status: 'away',    project: 'London HQ lease renewal',        avatar: 'AB', alloc: 55 },
  { name: 'Kiran Rao',      role: 'Supply Chain Lead', dept: 'Supply Chain', status: 'online',  project: 'Component X emergency order',    avatar: 'KR2', alloc: 92 },
]

const STATUS_COLOR: Record<string, string> = { online: '#10B981', away: '#F59E0B', offline: 'var(--os-text-2)' }

export function SharedMembers() {
  const [search, setSearch] = useState('')

  const visible = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.dept.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Members</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Directory of active team members, status, and current focus.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: members.length.toString(), color: '#6366F1' },
          { label: 'Online Now',    value: members.filter(m => m.status === 'online').length.toString(), color: '#10B981' },
          { label: 'Avg Allocation',value: Math.round(members.reduce((s, m) => s + m.alloc, 0) / members.length) + '%', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--os-text-2)]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, role or department…"
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] focus:outline-none focus:ring-1 focus:ring-white/20"
        />
      </div>

      {/* Members list */}
      <div className="space-y-2">
        {visible.map(m => (
          <div key={m.name} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-[var(--os-text-1)]">
                {m.avatar.slice(0, 2)}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0B1121]"
                style={{ background: STATUS_COLOR[m.status] }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{m.name}</p>
              <p className="text-xs text-[var(--os-text-2)] truncate">{m.role} · {m.dept}</p>
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-xs text-[var(--os-text-2)] truncate">{m.project}</p>
            </div>
            <div className="flex-shrink-0 w-24 text-right">
              <p className="text-xs text-[var(--os-text-2)] mb-1">{m.alloc}% allocated</p>
              <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${m.alloc}%`,
                    background: m.alloc > 85 ? '#EF4444' : m.alloc > 70 ? '#F59E0B' : '#10B981',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-center text-[var(--os-text-2)] py-10 text-sm">No members match your search.</p>
        )}
      </div>
    </div>
  )
}
