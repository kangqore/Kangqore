import { Palette, CheckCircle } from 'lucide-react'

const BRAND_HEALTH = [
  { label: 'Brand Consistency Score', value: '94%',        color: '#10B981' },
  { label: 'Guideline Version',        value: 'v2.4',       color: '#EC4899' },
  { label: 'Last Audit',               value: '2026-05-10', color: '#6366F1' },
]

const ASSET_CATEGORIES = [
  { name: 'Primary Logo Suite',       count: 12, updated: '2026-05-10' },
  { name: 'Color Palette',            count: 8,  updated: '2026-05-10' },
  { name: 'Typography',               count: 6,  updated: '2026-04-22' },
  { name: 'Icon Library',             count: 84, updated: '2026-06-01' },
  { name: 'Presentation Templates',   count: 14, updated: '2026-06-05' },
  { name: 'Social Templates',         count: 22, updated: '2026-06-12' },
  { name: 'Email Templates',          count: 11, updated: '2026-05-28' },
  { name: 'Video Assets',             count: 8,  updated: '2026-06-08' },
]

const STATS = [
  { label: 'Logos',      value: '12', color: '#EC4899' },
  { label: 'Templates',  value: '34', color: '#6366F1' },
  { label: 'Guidelines', value: '3',  color: '#F59E0B' },
  { label: 'Videos',     value: '8',  color: '#10B981' },
]

export function MarketingBrand() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Palette className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Brand</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Brand asset library, guidelines, and consistency scoring.</p>
        </div>
      </div>

      {/* Brand health strip */}
      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-pink-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Brand Health</span>
        </div>
        {BRAND_HEALTH.map(h => (
          <div key={h.label} className="flex items-center gap-2">
            <span className="text-xs text-[var(--os-text-2)]">{h.label}</span>
            <span className="text-xs font-bold" style={{ color: h.color }}>{h.value}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Asset grid */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Asset Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSET_CATEGORIES.map(a => (
            <div key={a.name} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-slate-800/40">
              <div>
                <p className="text-sm font-medium text-white">{a.name}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">Updated {a.updated}</p>
              </div>
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: '#EC4899' }}
              >
                {a.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
