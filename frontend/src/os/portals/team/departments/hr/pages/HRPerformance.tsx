import { useState } from 'react'
import { Star } from 'lucide-react'

type PerfStatus = 'ON_TRACK' | 'AT_RISK' | 'EXCEEDING' | 'NEEDS_IMPROVEMENT'

const REVIEWS = [
  { name: 'Arjun Sharma',  role: 'Lead Engineer',      status: 'EXCEEDING'          as PerfStatus, manager: 'C.O.D.E. K.', okrs: 3, okrPct: 94, lastReview: 'Q1 2026', nextReview: 'Q3 2026' },
  { name: 'Priya Nair',    role: 'Backend Engineer',   status: 'ON_TRACK'            as PerfStatus, manager: 'Arjun S.',  okrs: 3, okrPct: 78, lastReview: 'Q1 2026', nextReview: 'Q3 2026' },
  { name: 'Kavya Reddy',   role: 'Product Designer',   status: 'ON_TRACK'            as PerfStatus, manager: 'C.O.D.E. K.', okrs: 2, okrPct: 71, lastReview: 'Q1 2026', nextReview: 'Q3 2026' },
  { name: 'Rohan Mehta',   role: 'DevOps Engineer',    status: 'AT_RISK'             as PerfStatus, manager: 'Arjun S.',  okrs: 3, okrPct: 48, lastReview: 'Q1 2026', nextReview: 'Q3 2026' },
  { name: 'Sneha Gupta',   role: 'Frontend Engineer',  status: 'NEEDS_IMPROVEMENT'   as PerfStatus, manager: 'Arjun S.',  okrs: 3, okrPct: 30, lastReview: 'Q1 2026', nextReview: 'Q3 2026' },
]

const S_COLOR: Record<PerfStatus, string> = {
  EXCEEDING:        '#10B981',
  ON_TRACK:         '#2564ea',
  AT_RISK:          '#F59E0B',
  NEEDS_IMPROVEMENT:'#EF4444',
}

const S_LABEL: Record<PerfStatus, string> = {
  EXCEEDING:        'Exceeding',
  ON_TRACK:         'On Track',
  AT_RISK:          'At Risk',
  NEEDS_IMPROVEMENT:'Needs Improvement',
}

export function HRPerformance() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Star className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Performance</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Q2 2026 review cycle — OKR progress and performance status per team member.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Under Review', value: REVIEWS.length.toString(), color: '#8B5CF6' },
          { label: 'Exceeding',    value: REVIEWS.filter(r => r.status === 'EXCEEDING').length.toString(), color: '#10B981' },
          { label: 'At Risk',      value: REVIEWS.filter(r => r.status === 'AT_RISK' || r.status === 'NEEDS_IMPROVEMENT').length.toString(), color: '#EF4444' },
          { label: 'Avg OKR %',    value: Math.round(REVIEWS.reduce((s, r) => s + r.okrPct, 0) / REVIEWS.length) + '%', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-2">
        {REVIEWS.map(r => (
          <div key={r.name} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
            <button
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setSelected(selected === r.name ? null : r.name)}
            >
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300 flex-shrink-0">
                {r.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{r.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{r.role} · Manager: {r.manager}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.okrPct}%`, background: S_COLOR[r.status] }} />
                  </div>
                  <span className="text-xs text-[var(--os-text-2)]">{r.okrPct}%</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${S_COLOR[r.status]}22`, color: S_COLOR[r.status] }}>
                  {S_LABEL[r.status]}
                </span>
              </div>
            </button>
            {selected === r.name && (
              <div className="px-4 pb-4 pt-0 border-t border-white/10">
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'OKRs',       value: r.okrs.toString() },
                    { label: 'Last Review',value: r.lastReview },
                    { label: 'Next Review',value: r.nextReview },
                  ].map(d => (
                    <div key={d.label} className="p-3 rounded-xl bg-slate-800/60 border border-white/10">
                      <p className="text-xs text-[var(--os-text-2)]">{d.label}</p>
                      <p className="text-sm font-bold text-white mt-0.5">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
