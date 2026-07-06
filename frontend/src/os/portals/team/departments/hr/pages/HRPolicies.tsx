import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'

const POLICIES = [
  { id: 'POL-001', title: 'Remote Work & Flexible Hours Policy',    version: 'v3.1', updated: '15 Jun 2026', category: 'Work Arrangement',  acknowledged: 89, total: 94 },
  { id: 'POL-002', title: 'Annual Leave & Holiday Policy',          version: 'v2.4', updated: '1 Jan 2026',  category: 'Leave',              acknowledged: 93, total: 94 },
  { id: 'POL-003', title: 'Code of Conduct & Ethics Policy',        version: 'v4.0', updated: '15 Mar 2026', category: 'Conduct',            acknowledged: 94, total: 94 },
  { id: 'POL-004', title: 'Data Protection & Privacy Policy (GDPR)',version: 'v2.1', updated: '1 Apr 2026',  category: 'Compliance',         acknowledged: 87, total: 94 },
  { id: 'POL-005', title: 'Expense Reimbursement Policy',           version: 'v1.8', updated: '1 Feb 2026',  category: 'Finance',            acknowledged: 91, total: 94 },
  { id: 'POL-006', title: 'Anti-Harassment & Discrimination Policy',version: 'v3.0', updated: '1 Jan 2026',  category: 'Conduct',            acknowledged: 94, total: 94 },
  { id: 'POL-007', title: 'Security Awareness Training Policy',     version: 'v2.2', updated: '1 May 2026',  category: 'Security',           acknowledged: 63, total: 94 },
  { id: 'POL-008', title: 'Disciplinary & Grievance Procedure',     version: 'v1.5', updated: '15 Jan 2026', category: 'HR Process',         acknowledged: 92, total: 94 },
]

const CAT_COLOR: Record<string, string> = {
  'Work Arrangement': '#06B6D4', Leave: '#8B5CF6', Conduct: '#F97316',
  Compliance: '#EF4444', Finance: '#10B981', Security: '#EF4444', 'HR Process': '#6B7280',
}

export function HRPolicies() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const cats = [...new Set(POLICIES.map(p => p.category))]
  const [cat, setCat] = useState('All')

  const visible = cat === 'All' ? POLICIES : POLICIES.filter(p => p.category === cat)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Policies</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Versioned policy library — accessible, tracked, and acknowledged.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Policies',          value: POLICIES.length.toString(), color: '#8B5CF6' },
          { label: 'Fully Acknowledged',value: POLICIES.filter(p => p.acknowledged === p.total).length.toString(), color: '#10B981' },
          { label: 'Action Required',   value: POLICIES.filter(p => p.acknowledged < p.total).length.toString(), color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...cats].map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${cat === c ? 'bg-purple-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Policy list */}
      <div className="space-y-2">
        {visible.map(p => {
          const pct = Math.round((p.acknowledged / p.total) * 100)
          return (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              >
                <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: `${CAT_COLOR[p.category] ?? '#6B7280'}22`, color: CAT_COLOR[p.category] ?? '#6B7280' }}>
                  {p.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">{p.id} · {p.version} · Updated {p.updated}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#10B981' : '#F59E0B' }} />
                    </div>
                    <span className="text-xs text-[var(--os-text-2)]">{pct}%</span>
                  </div>
                  {expanded === p.id ? <ChevronUp className="w-4 h-4 text-[var(--os-text-2)]" /> : <ChevronDown className="w-4 h-4 text-[var(--os-text-2)]" />}
                </div>
              </button>
              {expanded === p.id && (
                <div className="px-4 pb-4 pt-0 border-t border-white/10">
                  <p className="text-sm text-[var(--os-text-1)] mt-3">{p.acknowledged}/{p.total} employees have acknowledged this policy.</p>
                  {pct < 100 && <p className="text-xs text-amber-400 mt-1">{p.total - p.acknowledged} employees yet to acknowledge.</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
