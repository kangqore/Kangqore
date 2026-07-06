import { Search, Brain } from 'lucide-react'

const STUDIES = [
  { id: 'RS-012', title: 'KIMMP Onboarding UX',          type: 'Usability',        participants: '8 participants',   status: 'Completed',  date: '2026-06-05' },
  { id: 'RS-013', title: 'Enterprise Search Patterns',    type: 'Generative',       participants: '12 participants',  status: 'In Analysis',date: '2026-06-18' },
  { id: 'RS-014', title: 'Mobile App Needs',              type: 'Survey',           participants: '142 responses',    status: 'Planned',    date: '2026-07-10' },
  { id: 'RS-015', title: 'Agent Workspace v2',            type: 'Concept Testing',  participants: '6 participants',   status: 'Recruiting', date: '—'          },
  { id: 'RS-011', title: 'Offline Mode Discovery',        type: 'Generative',       participants: '10 participants',  status: 'Completed',  date: '2026-05-14' },
]

const INSIGHTS = [
  { title: 'Onboarding drop-off at step 3',  body: 'Users consistently abandon the KIMMP setup flow at the "connect integrations" step (8/8 sessions). Simplify OAuth flow or make it skippable with a later prompt.', impact: 'High' },
  { title: 'Offline mode is a table-stakes expectation', body: '10 of 12 enterprise participants expected offline capability as standard. 4 cited it as a blocker to their current contract renewal.', impact: 'High' },
  { title: 'Search mental model mismatch',   body: 'Enterprise users expect global search to surface records across all modules simultaneously. Current scoped search creates a significant UX debt.', impact: 'Medium' },
]

const STATUS_COLOR: Record<string, string> = {
  'Completed':   '#10B981',
  'In Analysis': '#F59E0B',
  'Planned':     '#6366F1',
  'Recruiting':  '#A855F7',
}

const STATUS_BG: Record<string, string> = {
  'Completed':   '#10B98122',
  'In Analysis': '#F59E0B22',
  'Planned':     '#6366F122',
  'Recruiting':  '#A855F722',
}

const TYPE_COLOR: Record<string, string> = {
  'Usability':       '#06B6D4',
  'Generative':      '#8B5CF6',
  'Survey':          '#F97316',
  'Concept Testing': '#EC4899',
}

export function ProductResearch() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Search className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">User Research</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Studies, interviews, surveys, and KIMMP-synthesised insights.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Studies YTD',         value: '12',  color: '#A855F7' },
          { label: 'Interviews',          value: '48',  color: '#6366F1' },
          { label: 'Insights Generated',  value: '184', color: '#10B981' },
          { label: 'Decisions Influenced',value: '34',  color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* KIMMP Insight */}
      <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 flex items-start gap-3">
        <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-purple-200">
          <span className="font-semibold text-purple-300">KIMMP:</span>{' '}
          Offline mode has surfaced in 4 separate research studies across 2026. Cross-referencing with sales data: 12 accounts (£1.4M ARR) have cited this as a requirement. Escalate to roadmap planning.
        </p>
      </div>

      {/* Studies table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Active & Recent Studies</h2>
        {/* Header */}
        <div className="flex items-center gap-4 pb-2 border-b border-white/10 text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wider">
          <span className="w-16 flex-shrink-0">ID</span>
          <span className="flex-1">Study</span>
          <span className="w-28 flex-shrink-0">Type</span>
          <span className="w-28 flex-shrink-0">Participants</span>
          <span className="w-24 text-right flex-shrink-0">Status</span>
          <span className="w-24 text-right flex-shrink-0">Date</span>
        </div>
        {STUDIES.map(s => (
          <div key={s.id} className="flex items-center gap-4 py-2.5 border-b border-white/[0.05] last:border-0">
            <span className="text-xs text-[var(--os-text-2)] font-mono w-16 flex-shrink-0">{s.id}</span>
            <span className="flex-1 text-sm text-[var(--os-text-1)]">{s.title}</span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded w-28 flex-shrink-0"
              style={{ color: TYPE_COLOR[s.type] ?? '#A855F7', background: `${TYPE_COLOR[s.type] ?? '#A855F7'}22` }}>
              {s.type}
            </span>
            <span className="text-xs text-[var(--os-text-2)] w-28 flex-shrink-0">{s.participants}</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full w-24 text-center flex-shrink-0"
              style={{ color: STATUS_COLOR[s.status], background: STATUS_BG[s.status] }}>
              {s.status}
            </span>
            <span className="text-xs text-[var(--os-text-2)] w-24 text-right flex-shrink-0">{s.date}</span>
          </div>
        ))}
      </div>

      {/* Key insights */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Key Insights</h2>
        <div className="space-y-3">
          {INSIGHTS.map(i => (
            <div key={i.title} className="p-4 rounded-xl border border-white/[0.07] bg-slate-800/40 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{i.title}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ color: i.impact === 'High' ? '#EF4444' : '#F59E0B', background: i.impact === 'High' ? '#EF444422' : '#F59E0B22' }}>
                  {i.impact} Impact
                </span>
              </div>
              <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
