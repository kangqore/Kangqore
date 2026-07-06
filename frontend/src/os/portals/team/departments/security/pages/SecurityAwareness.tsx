import { Bell } from 'lucide-react'

const ACCENT = '#EF4444'

interface Campaign {
  name: string
  type: string
  completion: number
  deadline: string
  total: number
  color: string
}

const CAMPAIGNS: Campaign[] = [
  {
    name:       'Security Awareness Training 2026',
    type:       'eLearning',
    completion: 67,
    deadline:   '30 Jun 2026',
    total:      143,
    color:      '#EF4444',
  },
  {
    name:       'Phishing Simulation Q2 2026',
    type:       'Phishing Sim',
    completion: 100,
    deadline:   '15 Jun 2026',
    total:      94,
    color:      '#F97316',
  },
  {
    name:       'GDPR Awareness Refresh',
    type:       'eLearning',
    completion: 81,
    deadline:   '31 Jul 2026',
    total:      143,
    color:      '#8B5CF6',
  },
]

interface DeptCompletion {
  dept: string
  pct: number
  completed: number
  total: number
}

const DEPT_COMPLETION: DeptCompletion[] = [
  { dept: 'Engineering',   pct: 71, completed: 34,  total: 48  },
  { dept: 'HR',            pct: 100, completed: 8,   total: 8   },
  { dept: 'Finance',       pct: 100, completed: 11,  total: 11  },
  { dept: 'Legal',         pct: 100, completed: 4,   total: 4   },
  { dept: 'Support',       pct: 88,  completed: 14,  total: 16  },
  { dept: 'Facilities',    pct: 60,  completed: 6,   total: 10  },
  { dept: 'Supply Chain',  pct: 55,  completed: 6,   total: 11  },
]

function deptColor(pct: number) {
  if (pct === 100) return '#10B981'
  if (pct >= 75)   return '#F59E0B'
  return '#EF4444'
}

export function SecurityAwareness() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Bell size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Awareness</h1>
          <p className="text-sm text-[var(--os-text-2)]">Training campaigns, phishing simulations, and completion tracking</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate',     value: '67%',   sub: 'awareness training 2026'  },
          { label: 'Phishing Click Rate', value: '4.2%',  sub: 'down from 8.1% in Q1'     },
          { label: 'Reported Phishing',   value: '71%',   sub: '67 of 94 users reported'  },
          { label: 'Goal',                value: '90%',   sub: 'completion target 30 Jun'  },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-3">Active Campaigns</h2>
        <div className="space-y-3">
          {CAMPAIGNS.map(c => (
            <div
              key={c.name}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${c.color}22`, color: c.color }}
                    >
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">Deadline: {c.deadline} &middot; {c.total} participants</p>
                </div>
                <p
                  className="text-xl font-bold"
                  style={{ color: c.completion === 100 ? '#10B981' : c.completion >= 70 ? '#F59E0B' : '#EF4444' }}
                >
                  {c.completion}%
                </p>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${c.completion}%`,
                    background: c.completion === 100 ? '#10B981' : c.completion >= 70 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phishing Simulation Results */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-4">Phishing Simulation Q2 2026 — Results</h2>
        <div className="grid grid-cols-3 gap-6 mb-4">
          {[
            { label: 'Emails Sent',  value: '94',   color: '#60A5FA' },
            { label: 'Link Clicked', value: '4',    color: '#EF4444' },
            { label: 'Reported',     value: '67',   color: '#10B981' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-[var(--os-text-2)] mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#10B98111' }}>
          <span className="text-xs font-semibold" style={{ color: '#10B981' }}>
            Click rate dropped from 8.1% (Q1) to 4.2% (Q2) — a 48% improvement. Awareness training is working.
          </span>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] mb-3">Department Completion — Security Awareness 2026</h2>
        <div className="space-y-2">
          {DEPT_COMPLETION.map(d => {
            const color = deptColor(d.pct)
            return (
              <div
                key={d.dept}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
              >
                <div className="w-32 shrink-0">
                  <p className="text-sm font-semibold text-white">{d.dept}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.pct}%`, background: color }}
                    />
                  </div>
                </div>
                <div className="text-right w-28 shrink-0">
                  <p className="text-xs text-[var(--os-text-2)]">{d.completed}/{d.total} complete</p>
                </div>
                <div className="w-12 text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color }}>{d.pct}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
