import { Palette, Brain } from 'lucide-react'

const DESIGN_CATEGORIES = [
  { name: 'Colours & Tokens',     desc: 'Design tokens: primary, secondary, semantic, surface, border, text palettes.',   status: 'Stable',     coverage: 100 },
  { name: 'Typography',           desc: 'Type scale, font weights, line heights. Inter (web) + SF Pro (iOS).',           status: 'Stable',     coverage: 100 },
  { name: 'Icons',                desc: 'Phosphor Icons library — 9,000+ icons at 6 weights. All OS icons standardised.',status: 'Stable',     coverage: 98  },
  { name: 'Spacing & Grid',       desc: '4pt base unit system. 12-column grid with 24px gutters.',                       status: 'Stable',     coverage: 100 },
  { name: 'Component Library',    desc: '284 components: atoms, molecules, organisms. Tailwind + Radix primitives.',     status: 'In Progress',coverage: 94  },
  { name: 'Motion & Animation',   desc: 'Framer Motion tokens: enter, exit, micro-interaction, page-transition.',        status: 'In Progress',coverage: 71  },
  { name: 'Accessibility',        desc: 'WCAG 2.2 AA compliance. Keyboard nav, ARIA labels, colour contrast audited.',   status: 'In Review',  coverage: 87  },
  { name: 'Dark Mode Specs',      desc: 'Full dark mode with slate-900 surface system. Light mode in backlog.',          status: 'Stable',     coverage: 96  },
]

const RECENT_CHANGES = [
  { date: '2026-06-20', component: 'DataTable',       change: 'Added sticky header + bulk select row state. Fixes long-list UX.' },
  { date: '2026-06-15', component: 'KPI Card',        change: 'Unified stat card variant with trend indicator and icon slot.'    },
  { date: '2026-06-08', component: 'Modal / Drawer',  change: 'Replaced custom scroll trap with Radix Dialog primitive.'         },
]

const STATUS_COLOR: Record<string, string> = {
  'Stable':      '#10B981',
  'In Progress': '#F59E0B',
  'In Review':   '#6366F1',
}

export function ProductDesign() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Palette className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Design System</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Component library, tokens, accessibility standards, and recent design changes.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Components',       value: '284',    color: '#A855F7' },
          { label: 'Last Updated',     value: '23 Jun', color: '#10B981' },
          { label: 'Storybook',        value: '94%',    color: '#F59E0B' },
          { label: 'Figma Files',      value: '18',     color: '#6366F1' },
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
          Component coverage at 94% — 17 components flagged as inconsistent across web/mobile. Recommend design audit sprint before v3.0.
        </p>
      </div>

      {/* Design system grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DESIGN_CATEGORIES.map(cat => (
          <div key={cat.name} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ color: STATUS_COLOR[cat.status], background: `${STATUS_COLOR[cat.status]}22` }}>
                {cat.status}
              </span>
            </div>
            <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{cat.desc}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[var(--os-text-2)]">
                <span>Coverage</span><span className="text-[var(--os-text-1)]">{cat.coverage}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full rounded-full"
                  style={{ width: `${cat.coverage}%`, background: STATUS_COLOR[cat.status] }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent changes */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Recent Changes</h2>
        <div className="space-y-3">
          {RECENT_CHANGES.map(c => (
            <div key={c.component} className="flex items-start gap-4 py-2 border-b border-white/[0.05] last:border-0">
              <span className="text-xs text-[var(--os-text-2)] w-24 flex-shrink-0 mt-0.5">{c.date}</span>
              <span className="text-sm font-semibold text-purple-300 w-36 flex-shrink-0">{c.component}</span>
              <span className="text-xs text-[var(--os-text-2)] flex-1 leading-relaxed">{c.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
