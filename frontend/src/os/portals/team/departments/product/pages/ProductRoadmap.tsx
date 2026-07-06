import { Compass, Brain } from 'lucide-react'

const NOW = [
  { title: 'KIMMP v3 Context Engine',   priority: 'High',   pct: 60 },
  { title: 'AEGIS Audit Dashboard',     priority: 'High',   pct: 40 },
  { title: 'Ops Centre Live Boards',    priority: 'Medium', pct: 80 },
  { title: 'Client Portal Refresh',     priority: 'Medium', pct: 25 },
]

const NEXT = [
  { title: 'BIDS™ Analytics Engine', priority: 'High'   },
  { title: 'Agent Workspace v2',      priority: 'Medium' },
  { title: 'Mobile App Beta',         priority: 'Low'    },
  { title: 'SSO Enterprise',          priority: 'High'   },
]

const LATER = [
  { title: 'Offline Mode',             priority: 'High'   },
  { title: 'Multi-Tenant Architecture',priority: 'High'   },
  { title: 'Custom Reporting Builder', priority: 'Medium' },
  { title: 'Marketplace Integrations', priority: 'Medium' },
  { title: 'White-Label Portal',       priority: 'Low'    },
  { title: 'Advanced Analytics v2',    priority: 'Medium' },
  { title: 'BIDS™ Mobile Edition',     priority: 'Low'    },
]

const SHIPPED = [
  { title: 'AEGIS Phase 1',           shipped: '2026-05-01' },
  { title: 'Client Portal v2',        shipped: '2026-05-01' },
  { title: 'Ops Centre Boards',       shipped: '2026-06-01' },
  { title: 'Approval Workflows',      shipped: '2026-06-01' },
  { title: 'KIMMP Context Fixes',     shipped: '2026-06-12' },
]

const PRIORITY_COLOR: Record<string, string> = {
  High:   '#EF4444',
  Medium: '#F59E0B',
  Low:    '#10B981',
}

export function ProductRoadmap() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Compass className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Roadmap</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Epic-level roadmap view across Now / Next / Later / Shipped horizons.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Now',         value: '4 epics',  color: '#A855F7' },
          { label: 'Next',        value: '7 epics',  color: '#6366F1' },
          { label: 'Later',       value: '12 epics', color: '#64748B' },
          { label: 'Shipped YTD', value: '18',       color: '#10B981' },
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
          KIMMP v3 is on track for Q3. Recommend prioritising SSO Enterprise — 4 enterprise deals blocked on this requirement, representing £480k ARR.
        </p>
      </div>

      {/* Four-column board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* NOW */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400 px-1">Now</h2>
          {NOW.map(e => (
            <div key={e.title} className="p-4 rounded-xl border border-purple-500/20 bg-slate-900/50 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white leading-snug">{e.title}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ color: PRIORITY_COLOR[e.priority], background: `${PRIORITY_COLOR[e.priority]}22` }}>
                  {e.priority}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[var(--os-text-2)]">
                  <span>Progress</span><span className="text-[var(--os-text-1)]">{e.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500" style={{ width: `${e.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* NEXT */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 px-1">Next</h2>
          {NEXT.map(e => (
            <div key={e.title} className="p-4 rounded-xl border border-indigo-500/20 bg-slate-900/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white leading-snug">{e.title}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ color: PRIORITY_COLOR[e.priority], background: `${PRIORITY_COLOR[e.priority]}22` }}>
                  {e.priority}
                </span>
              </div>
              <p className="text-xs text-[var(--os-text-2)]">Queued for next quarter</p>
            </div>
          ))}
        </div>

        {/* LATER */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--os-text-2)] px-1">Later</h2>
          {LATER.map(e => (
            <div key={e.title} className="p-4 rounded-xl border border-white/[0.06] bg-slate-900/30 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--os-text-1)] leading-snug">{e.title}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ color: PRIORITY_COLOR[e.priority], background: `${PRIORITY_COLOR[e.priority]}22` }}>
                  {e.priority}
                </span>
              </div>
              <p className="text-xs text-[var(--os-text-2)]">Backlog</p>
            </div>
          ))}
        </div>

        {/* SHIPPED */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 px-1">Shipped</h2>
          {SHIPPED.map(e => (
            <div key={e.title} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <p className="text-sm font-semibold text-white">{e.title}</p>
              <p className="text-xs text-emerald-400">{e.shipped}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
