import { useState } from 'react'
import { BarChart2 } from 'lucide-react'

const ACCENT = '#10B981'

const departments = [
  { name: 'Engineering',   budget: 800000,  spent: 620000,  status: 'ON_TRACK' },
  { name: 'Marketing',     budget: 200000,  spent: 224000,  status: 'OVER'     },
  { name: 'Product',       budget: 300000,  spent: 190000,  status: 'UNDER'    },
  { name: 'Sales',         budget: 400000,  spent: 310000,  status: 'ON_TRACK' },
  { name: 'Finance',       budget: 150000,  spent: 98000,   status: 'ON_TRACK' },
  { name: 'Legal',         budget: 120000,  spent: 87000,   status: 'ON_TRACK' },
  { name: 'Security',      budget: 200000,  spent: 142000,  status: 'ON_TRACK' },
  { name: 'Facilities',    budget: 230000,  spent: 140000,  status: 'ON_TRACK' },
]

const STATUS_COLOR: Record<string, string> = {
  ON_TRACK: '#10B981',
  OVER:     '#EF4444',
  UNDER:    '#F59E0B',
}

const STATUS_LABEL: Record<string, string> = {
  ON_TRACK: 'On Track',
  OVER:     'Over Budget',
  UNDER:    'Under Budget',
}

function fmt(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `£${(n / 1_000).toFixed(0)}K`
  return `£${n}`
}

export function FinanceBudget() {
  const [filter, setFilter] = useState<'ALL' | 'ON_TRACK' | 'OVER' | 'UNDER'>('ALL')

  const totalBudget = departments.reduce((a, d) => a + d.budget, 0)
  const totalSpent  = departments.reduce((a, d) => a + d.spent,  0)
  const remaining   = totalBudget - totalSpent
  const overCount   = departments.filter(d => d.status === 'OVER').length

  const visible = filter === 'ALL' ? departments : departments.filter(d => d.status === filter)

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',      label: 'All' },
    { key: 'ON_TRACK', label: 'On Track' },
    { key: 'OVER',     label: 'Over Budget' },
    { key: 'UNDER',    label: 'Under Budget' },
  ]

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${ACCENT}22` }}>
          <BarChart2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Overview</h1>
          <p className="text-sm text-[var(--os-text-2)]">Annual departmental budget allocation and utilisation — FY 2026</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget',    value: fmt(totalBudget), sub: 'FY 2026' },
          { label: 'Utilised',        value: fmt(totalSpent),  sub: `${Math.round((totalSpent / totalBudget) * 100)}% of total` },
          { label: 'Remaining',       value: fmt(remaining),   sub: 'available' },
          { label: 'Over Budget',     value: String(overCount), sub: 'departments' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] mb-1">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === t.key
                ? 'text-white'
                : 'text-[var(--os-text-2)] bg-slate-800/60 hover:bg-slate-700/60'
            }`}
            style={filter === t.key ? { background: ACCENT } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {visible.map(dept => {
          const pct     = Math.round((dept.spent / dept.budget) * 100)
          const variance = dept.spent - dept.budget
          const color   = STATUS_COLOR[dept.status]
          return (
            <div
              key={dept.name}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{dept.name}</p>
                <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden w-full max-w-xs">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                  />
                </div>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Budget</p>
                <p className="text-sm font-semibold text-white">{fmt(dept.budget)}</p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Spent</p>
                <p className="text-sm font-semibold text-white">{fmt(dept.spent)}</p>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">Variance</p>
                <p className="text-sm font-semibold" style={{ color }}>
                  {variance >= 0 ? '+' : ''}{fmt(Math.abs(variance))}
                </p>
              </div>
              <div className="w-28 text-right shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {STATUS_LABEL[dept.status]}
                </span>
              </div>
              <div className="w-12 text-right shrink-0">
                <p className="text-sm font-bold text-white">{pct}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
