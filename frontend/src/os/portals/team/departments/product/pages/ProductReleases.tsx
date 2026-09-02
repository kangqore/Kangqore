import { Rocket } from 'lucide-react'

const RELEASES = [
  { version: 'v2.4.1', date: '2026-06-12', type: 'Patch', notes: 'KIMMP context fixes + performance improvements', highlights: ['KIMMP context window caching', 'API response time −18%', 'Memory leak in Ops Centre fixed'] },
  { version: 'v2.4.0', date: '2026-06-01', type: 'Minor', notes: 'Ops Centre Live Boards, Approval Workflows',     highlights: ['Ops Centre real-time boards', 'Approval workflow engine', 'Bulk action support'] },
  { version: 'v2.3.2', date: '2026-05-20', type: 'Patch', notes: 'Security patches',                               highlights: ['CVE-2026-1182 patched', 'Session token rotation', 'Rate limiting on auth endpoints'] },
  { version: 'v2.3.0', date: '2026-05-01', type: 'Minor', notes: 'HANUMANAS Phase 1, Client Portal v2',               highlights: ['HANUMANAS audit trail live', '80-agent corp deployed', 'Client Portal redesign', 'NPS widget added'] },
]

const UPCOMING = {
  version: 'v2.5.0',
  date:    '2026-07-01',
  type:    'Minor',
  items: [
    'KIMMP v3 Context Engine (GA)',
    'Feature backlog portal (client-facing)',
    'Release notes auto-generation',
    'Sprint velocity charts',
    'SSO Enterprise (beta)',
  ],
}

const TYPE_COLOR: Record<string, string> = {
  Patch: '#64748B',
  Minor: '#6366F1',
  Major: '#A855F7',
}

const TYPE_BG: Record<string, string> = {
  Patch: '#64748B22',
  Minor: '#6366F122',
  Major: '#A855F722',
}

export function ProductReleases() {
  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Rocket className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Releases</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Release changelog, hotfix tracker, and upcoming milestones.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Releases YTD',  value: '8',          color: '#A855F7' },
          { label: 'Last Release',  value: '2026-06-12', color: '#10B981' },
          { label: 'Next Release',  value: '2026-07-01', color: '#F59E0B' },
          { label: 'Hotfixes YTD', value: '3',          color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming release */}
      <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">{UPCOMING.version}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded"
            style={{ color: TYPE_COLOR[UPCOMING.type], background: TYPE_BG[UPCOMING.type] }}>
            {UPCOMING.type}
          </span>
          <span className="text-xs text-[var(--os-text-2)] ml-auto">Target: {UPCOMING.date}</span>
        </div>
        <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Planned Features</p>
        <ul className="space-y-1">
          {UPCOMING.items.map(item => (
            <li key={item} className="flex items-center gap-2 text-sm text-[var(--os-text-1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Release history */}
      <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold text-[var(--os-text-1)] uppercase tracking-wider">Release History</h2>
        <div className="space-y-4">
          {RELEASES.map(r => (
            <div key={r.version} className="border-b border-white/[0.06] last:border-0 pb-4 last:pb-0 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-white">{r.version}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded"
                  style={{ color: TYPE_COLOR[r.type], background: TYPE_BG[r.type] }}>
                  {r.type}
                </span>
                <span className="text-xs text-[var(--os-text-2)] ml-auto">{r.date}</span>
              </div>
              <p className="text-xs text-[var(--os-text-2)]">{r.notes}</p>
              <div className="flex flex-wrap gap-2">
                {r.highlights.map(h => (
                  <span key={h} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-[var(--os-text-2)]">{h}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
