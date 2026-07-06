import { GraduationCap, CheckCircle2, Circle } from 'lucide-react'

const JOINERS = [
  {
    name: 'Mihir Patel', role: 'Finance Analyst', startDate: '1 Jul 2026', buddy: 'Priya Nair',
    tasks: [
      { label: 'Offer letter signed',            done: true  },
      { label: 'Background check completed',     done: true  },
      { label: 'Laptop ordered (MacBook Pro M3)',done: true  },
      { label: 'Okta / Google Workspace account',done: false },
      { label: 'Day 1 schedule sent',            done: false },
      { label: '30-day onboarding plan shared',  done: false },
    ]
  },
  {
    name: 'Divya Kapoor', role: 'Legal Counsel', startDate: '15 Jul 2026', buddy: 'Rohan Mehta',
    tasks: [
      { label: 'Offer letter signed',             done: true  },
      { label: 'Background check completed',      done: false },
      { label: 'Laptop ordered',                  done: false },
      { label: 'Okta / Google Workspace account', done: false },
      { label: 'Day 1 schedule sent',             done: false },
      { label: '30-day onboarding plan shared',   done: false },
    ]
  },
]

export function HROnboarding() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Onboarding</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">New joiner task lists, equipment, and buddy assignment.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Starting This Month', value: '2',  color: '#8B5CF6' },
          { label: 'Tasks Complete',      value: '4/12', color: '#10B981' },
          { label: 'Avg Onboarding Score',value: '8.7/10', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Joiners */}
      {JOINERS.map(j => {
        const done = j.tasks.filter(t => t.done).length
        const pct  = Math.round((done / j.tasks.length) * 100)
        return (
          <div key={j.name} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-base font-bold text-white">{j.name}</p>
                <p className="text-xs text-[var(--os-text-2)]">{j.role} · Starting {j.startDate} · Buddy: {j.buddy}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{done}/{j.tasks.length} tasks</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-[var(--os-text-2)]">{pct}%</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {j.tasks.map((t, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  {t.done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    : <Circle       className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0" />}
                  <span className={`text-sm ${t.done ? 'text-[var(--os-text-2)] line-through' : 'text-[var(--os-text-1)]'}`}>{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
