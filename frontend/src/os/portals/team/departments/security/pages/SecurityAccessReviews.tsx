import { Key } from 'lucide-react'

const ACCENT = '#EF4444'

interface SystemReview {
  system: string
  owner: string
  totalUsers: number
  reviewed: number
  overdue: number
  lastReview: string
}

const SYSTEMS: SystemReview[] = [
  { system: 'Production Database', owner: 'Priya Nair',   totalUsers: 8,  reviewed: 6,  overdue: 2, lastReview: '1 Apr 2026' },
  { system: 'Admin Panel',         owner: 'Tom Walsh',    totalUsers: 12, reviewed: 10, overdue: 2, lastReview: '1 Apr 2026' },
  { system: 'GitHub (Enterprise)', owner: 'James Okafor', totalUsers: 95, reviewed: 95, overdue: 0, lastReview: '15 Apr 2026' },
  { system: 'AWS Console',         owner: 'Daniel Park',  totalUsers: 14, reviewed: 11, overdue: 3, lastReview: '1 Apr 2026' },
  { system: 'Okta (IdP)',          owner: 'Lucy Brennan', totalUsers: 143, reviewed: 143, overdue: 0, lastReview: '10 Apr 2026' },
  { system: 'Datadog',             owner: 'Raj Patel',    totalUsers: 22, reviewed: 18, overdue: 4, lastReview: '1 Apr 2026' },
  { system: 'Slack',               owner: 'Sarah Chen',   totalUsers: 141, reviewed: 141, overdue: 0, lastReview: '10 Apr 2026' },
  { system: 'Office 365',          owner: 'Aisha Malik',  totalUsers: 143, reviewed: 140, overdue: 3, lastReview: '1 Apr 2026' },
]

export function SecurityAccessReviews() {
  const totalPending  = SYSTEMS.reduce((a, s) => a + s.overdue, 0)
  const totalReviewed = SYSTEMS.reduce((a, s) => a + s.reviewed, 0)
  const totalUsers    = SYSTEMS.reduce((a, s) => a + s.totalUsers, 0)
  const pct           = Math.round((totalReviewed / totalUsers) * 100)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <Key size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Access Reviews</h1>
          <p className="text-sm text-[var(--os-text-2)]">Quarterly access certification — Q2 2026 cycle (due 30 Jun)</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Systems in Scope', value: String(SYSTEMS.length), sub: 'under review'             },
          { label: 'Users Pending',    value: String(totalPending),   sub: 'awaiting certification'   },
          { label: 'Days Overdue',     value: '6',                    sub: 'cycle started 1 Apr'      },
          { label: 'Next Review',      value: '30 Sep',               sub: 'Q3 2026 certification'    },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-white">Overall Certification Progress</p>
          <p className="text-sm font-bold" style={{ color: pct >= 90 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444' }}>
            {pct}%
          </p>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct >= 90 ? '#10B981' : pct >= 70 ? '#F59E0B' : ACCENT,
            }}
          />
        </div>
        <p className="text-xs text-[var(--os-text-2)] mt-2">
          {totalReviewed} of {totalUsers} accounts certified across all systems
        </p>
      </div>

      {/* Systems Table */}
      <div className="space-y-2">
        {SYSTEMS.map(s => {
          const sysPct   = Math.round((s.reviewed / s.totalUsers) * 100)
          const complete  = s.overdue === 0
          const color     = complete ? '#10B981' : s.overdue >= 3 ? '#EF4444' : '#F59E0B'
          return (
            <div
              key={s.system}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{s.system}</p>
                <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden w-full max-w-xs">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${sysPct}%`, background: color }}
                  />
                </div>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Owner</p>
                <p className="text-xs text-[var(--os-text-1)]">{s.owner}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Total Users</p>
                <p className="text-sm font-semibold text-white">{s.totalUsers}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Reviewed</p>
                <p className="text-sm font-semibold" style={{ color: '#10B981' }}>{s.reviewed}</p>
              </div>
              <div className="text-right w-20 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Overdue</p>
                <p className="text-sm font-semibold" style={{ color: s.overdue > 0 ? ACCENT : '#10B981' }}>
                  {s.overdue}
                </p>
              </div>
              <div className="text-right w-28 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Last Review</p>
                <p className="text-xs text-[var(--os-text-1)]">{s.lastReview}</p>
              </div>
              <div className="w-24 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {complete ? 'Complete' : 'Pending'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
