import { Award } from 'lucide-react'

const COURSES = [
  { id: 'TRN-001', title: 'Security Awareness Training 2026',     category: 'Security',    mandatory: true,  deadline: '30 Jun 2026', completion: 67,  total: 94 },
  { id: 'TRN-002', title: 'GDPR & Data Protection Fundamentals', category: 'Compliance',   mandatory: true,  deadline: '31 Jul 2026', completion: 81,  total: 94 },
  { id: 'TRN-003', title: 'Inclusive Hiring Practices',           category: 'HR',           mandatory: false, deadline: 'No deadline', completion: 42,  total: 94 },
  { id: 'TRN-004', title: 'Leadership Essentials — L4 Managers', category: 'Leadership',   mandatory: false, deadline: 'No deadline', completion: 12,  total: 15 },
  { id: 'TRN-005', title: 'SOC 2 Controls Overview',             category: 'Compliance',   mandatory: true,  deadline: '15 Aug 2026', completion: 58,  total: 94 },
  { id: 'TRN-006', title: 'Effective Communication at Work',      category: 'Soft Skills',  mandatory: false, deadline: 'No deadline', completion: 34,  total: 94 },
]

const CAT_COLOR: Record<string, string> = {
  Security: '#EF4444', Compliance: '#F59E0B', HR: '#8B5CF6',
  Leadership: '#06B6D4', 'Soft Skills': '#10B981',
}

export function HRTraining() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Training & Development</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Learning plans, mandatory completions, and certification tracking.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses',    value: COURSES.length.toString(), color: '#8B5CF6' },
          { label: 'Mandatory Overdue', value: COURSES.filter(c => c.mandatory && c.completion < c.total && c.deadline !== 'No deadline').length.toString(), color: '#EF4444' },
          { label: 'Avg Completion',    value: Math.round(COURSES.reduce((s, c) => s + (c.completion / c.total) * 100, 0) / COURSES.length) + '%', color: '#F59E0B' },
          { label: 'Fully Complete',    value: COURSES.filter(c => c.completion === c.total).length.toString(), color: '#10B981' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Courses */}
      <div className="space-y-3">
        {COURSES.map(c => {
          const pct = Math.round((c.completion / c.total) * 100)
          const overdue = c.mandatory && pct < 100 && c.deadline !== 'No deadline'
          return (
            <div key={c.id} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
              <div className="flex items-start gap-3 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5" style={{ background: `${CAT_COLOR[c.category] ?? '#6B7280'}22`, color: CAT_COLOR[c.category] ?? '#6B7280' }}>
                  {c.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{c.title}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{c.id} · {c.mandatory ? 'Mandatory' : 'Optional'} · Deadline: {c.deadline}</p>
                </div>
                {overdue && <span className="text-xs font-bold text-red-400 px-2 py-0.5 rounded-full bg-red-500/20 flex-shrink-0">Action Required</span>}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#10B981' : overdue ? '#EF4444' : '#8B5CF6' }} />
                </div>
                <span className="text-xs text-[var(--os-text-2)] font-medium w-28 text-right flex-shrink-0">{c.completion}/{c.total} completed ({pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
