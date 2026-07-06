import { Users } from 'lucide-react'

const DEPTS = [
  { name: 'Engineering',      headcount: 24, open: 3, attrition: '8.3%', attritionRisk: true  },
  { name: 'Product & Design', headcount: 8,  open: 1, attrition: '0%',   attritionRisk: false },
  { name: 'Sales',            headcount: 12, open: 2, attrition: '4.1%', attritionRisk: false },
  { name: 'Finance',          headcount: 6,  open: 0, attrition: '0%',   attritionRisk: false },
  { name: 'Legal',            headcount: 4,  open: 0, attrition: '0%',   attritionRisk: false },
  { name: 'Customer Support', headcount: 14, open: 1, attrition: '2.8%', attritionRisk: false },
  { name: 'HR',               headcount: 5,  open: 0, attrition: '0%',   attritionRisk: false },
  { name: 'Security',         headcount: 4,  open: 1, attrition: '0%',   attritionRisk: false },
  { name: 'Facilities',       headcount: 5,  open: 0, attrition: '0%',   attritionRisk: false },
  { name: 'Supply Chain',     headcount: 12, open: 0, attrition: '1.5%', attritionRisk: false },
]

const HIRES = [
  { name: 'Kavya Reddy',    role: 'Senior Backend Engineer', dept: 'Engineering',      date: 'Started 3 Jun',  avatar: 'KR' },
  { name: 'Mihir Patel',   role: 'Finance Analyst',         dept: 'Finance',          date: 'Starting 1 Jul', avatar: 'MP' },
  { name: 'Divya Kapoor',  role: 'Legal Counsel',           dept: 'Legal',            date: 'Starting 15 Jul',avatar: 'DK' },
]

export function HRHeadcount() {
  const total   = DEPTS.reduce((s, d) => s + d.headcount, 0)
  const open    = DEPTS.reduce((s, d) => s + d.open, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Headcount</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Current org headcount by department with attrition and open role tracking.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Headcount', value: total.toString(),  color: '#8B5CF6' },
          { label: 'Open Roles',      value: open.toString(),   color: '#F59E0B' },
          { label: 'YTD Attrition',   value: '4.2%',           color: '#EF4444' },
          { label: 'New Hires (MTD)', value: '3',              color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Dept table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">By Department</h2>
        <div className="space-y-2">
          {DEPTS.map(d => (
            <div key={d.name} className="flex items-center gap-4 py-2 border-b border-white/[0.05] last:border-0">
              <span className="flex-1 text-sm text-[var(--os-text-1)]">{d.name}</span>
              <div className="w-32 text-right">
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${(d.headcount / 24) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-white w-8 text-right">{d.headcount}</span>
              <span className="text-xs text-[var(--os-text-2)] w-16 text-right">{d.open > 0 ? `${d.open} open` : '—'}</span>
              <span className="text-xs font-semibold w-14 text-right" style={{ color: d.attritionRisk ? '#EF4444' : '#10B981' }}>
                {d.attrition}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent hires */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Recent & Upcoming Hires</h2>
        <div className="space-y-3">
          {HIRES.map(h => (
            <div key={h.name} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
                {h.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{h.name}</p>
                <p className="text-xs text-[var(--os-text-2)]">{h.role} · {h.dept}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
