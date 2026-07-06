import { Search, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'

const STATS = [
  { label: 'Organic Sessions',    value: '14,280', color: '#10B981' },
  { label: 'Ranking Keywords',    value: '342',    color: '#EC4899' },
  { label: 'Avg Position',        value: '18.4',   color: '#6366F1' },
  { label: 'Domain Rating',       value: '52',     color: '#F59E0B' },
]

const KEYWORDS = [
  { keyword: 'AI governance platform',        position: 4,  volume: 1900, trend: 'up'   },
  { keyword: 'enterprise agentic AI',          position: 7,  volume: 2400, trend: 'up'   },
  { keyword: 'BIDS framework',                 position: 2,  volume: 480,  trend: 'up'   },
  { keyword: 'client portal software UK',      position: 11, volume: 3200, trend: 'flat' },
  { keyword: 'project management platform',    position: 24, volume: 18000,trend: 'down' },
  { keyword: 'AI ops software',                position: 8,  volume: 1200, trend: 'up'   },
  { keyword: 'kangqore OS review',             position: 1,  volume: 290,  trend: 'up'   },
  { keyword: 'business intelligence dashboard',position: 19, volume: 5400, trend: 'flat' },
  { keyword: 'enterprise workflow automation', position: 13, volume: 2800, trend: 'up'   },
  { keyword: 'AI strategy consulting UK',      position: 31, volume: 720,  trend: 'down' },
]

const TOP_PAGES = [
  { page: '/bids',             sessions: 3840, convRate: '4.2%' },
  { page: '/kangqore-os',      sessions: 2910, convRate: '3.8%' },
  { page: '/blog/ai-governance', sessions: 1740, convRate: '2.1%' },
  { page: '/pricing',          sessions: 1380, convRate: '5.6%' },
  { page: '/features',         sessions: 980,  convRate: '2.4%' },
]

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up')   return <TrendingUp   className="w-4 h-4 text-emerald-400" />
  if (trend === 'down') return <TrendingDown  className="w-4 h-4 text-red-400" />
  return <span className="text-[var(--os-text-2)] text-xs">—</span>
}

export function MarketingSEO() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
          <Search className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SEO</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Organic performance, keyword rankings, and top landing page analysis.</p>
        </div>
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

      {/* Keyword table */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Top 10 Keywords</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--os-text-2)] uppercase tracking-wider border-b border-white/[0.05]">
                <th className="text-left pb-3 font-medium">Keyword</th>
                <th className="text-left pb-3 font-medium">Position</th>
                <th className="text-left pb-3 font-medium">Volume</th>
                <th className="text-left pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {KEYWORDS.map(k => (
                <tr key={k.keyword} className="border-b border-white/[0.05] last:border-0">
                  <td className="py-2.5 pr-4 text-[var(--os-text-1)]">{k.keyword}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className="text-sm font-bold"
                      style={{ color: k.position <= 10 ? '#10B981' : k.position <= 20 ? '#F59E0B' : '#EF4444' }}
                    >
                      #{k.position}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--os-text-2)]">{k.volume.toLocaleString()}</td>
                  <td className="py-2.5"><TrendIcon trend={k.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top pages */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-3">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Top Landing Pages</h2>
        <div className="space-y-2">
          {TOP_PAGES.map(p => (
            <div key={p.page} className="flex items-center gap-4 py-2 border-b border-white/[0.05] last:border-0">
              <span className="flex-1 text-sm text-[var(--os-text-1)] font-mono">{p.page}</span>
              <span className="text-sm text-[var(--os-text-2)]">{p.sessions.toLocaleString()} sessions</span>
              <span className="text-sm font-semibold text-emerald-400">{p.convRate} CVR</span>
            </div>
          ))}
        </div>
      </div>

      {/* KIMMP insight */}
      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">KIMMP Insight</span>
        </div>
        <p className="text-sm text-[var(--os-text-1)] leading-relaxed">
          BIDS™ product pages have 3x higher dwell time than service pages — recommend expanding BIDS content cluster with 2-3 supporting pillar articles to capture adjacent intent.
        </p>
      </div>
    </div>
  )
}
