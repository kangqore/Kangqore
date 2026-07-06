import { GitBranch, GitPullRequest, Clock, Brain } from 'lucide-react'

const ACCENT = '#84CC16'

interface Repo {
  name:       string
  tag?:       string
  openPRs:    number
  lastPush:   string
  coverage:   number
}

interface PR {
  id:      string
  title:   string
  author:  string
  size:    'S' | 'M' | 'L'
  days:    number
  repo:    string
}

const REPOS: Repo[] = [
  { name: 'kangqore-os',     tag: 'main', openPRs: 4, lastPush: '2h ago',  coverage: 94 },
  { name: 'kimmp-core',      openPRs: 2,  lastPush: '4h ago',  coverage: 89 },
  { name: 'aegis-service',   openPRs: 1,  lastPush: '1d ago',  coverage: 91 },
  { name: 'kangqore-api',    openPRs: 3,  lastPush: '30m ago', coverage: 87 },
  { name: 'kangqore-mobile', tag: 'WIP',  openPRs: 2, lastPush: '3d ago',  coverage: 71 },
]

const OPEN_PRS: PR[] = [
  { id: '#142', title: 'feat: KIMMP streaming context window',  author: 'Siddharth R', size: 'L', days: 1, repo: 'kimmp-core' },
  { id: '#291', title: 'fix: drag-drop flickering on Live Board',author: 'Aryan M',     size: 'S', days: 0, repo: 'kangqore-os' },
  { id: '#290', title: 'feat: AEGIS audit log pagination',       author: 'Kavya N',     size: 'M', days: 2, repo: 'aegis-service' },
  { id: '#189', title: 'chore: upgrade Prisma to v6',            author: 'Siddharth R', size: 'M', days: 3, repo: 'kangqore-api' },
  { id: '#047', title: 'feat: mobile auth endpoints v1',         author: 'Aryan M',     size: 'M', days: 2, repo: 'kangqore-mobile' },
]

const SIZE_COLOR: Record<'S' | 'M' | 'L', string> = { S: '#10B981', M: '#F59E0B', L: '#EF4444' }

function coverageColor(pct: number) {
  if (pct >= 90) return '#10B981'
  if (pct >= 80) return '#F59E0B'
  return '#EF4444'
}

export function EngineeringRepos() {
  const totalPRs = REPOS.reduce((s, r) => s + r.openPRs, 0)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <GitBranch className="w-6 h-6" style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Repositories</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">Active repos, open PRs, test coverage, and cycle time overview.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Repos',     value: '18',      color: ACCENT },
          { label: 'Open PRs',         value: `${totalPRs}`, color: '#F59E0B' },
          { label: 'Merged PRs YTD',   value: '847',     color: '#10B981' },
          { label: 'Avg PR Cycle Time',value: '1.8 days',color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Repo table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Active Repositories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider">Repository</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-24">Open PRs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-32">Last Push</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--os-text-2)] uppercase tracking-wider w-36">Test Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--os-border)]">
              {REPOS.map(repo => (
                <tr key={repo.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-medium">{repo.name}</span>
                      {repo.tag && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: repo.tag === 'WIP' ? '#F59E0B18' : `${ACCENT}18`,
                            color: repo.tag === 'WIP' ? '#F59E0B' : ACCENT,
                          }}
                        >
                          {repo.tag}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <GitPullRequest className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                      <span className="text-[var(--os-text-1)]">{repo.openPRs}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[var(--os-text-2)]">
                      <Clock className="w-3.5 h-3.5" />
                      {repo.lastPush}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${repo.coverage}%`, background: coverageColor(repo.coverage) }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium w-9 text-right" style={{ color: coverageColor(repo.coverage) }}>
                        {repo.coverage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open PRs */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">PRs Awaiting Review</h2>
          <span className="text-xs text-[var(--os-text-2)]">{OPEN_PRS.length} open</span>
        </div>
        <div className="divide-y divide-[var(--os-border)]">
          {OPEN_PRS.map(pr => (
            <div key={pr.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <span className="text-xs font-mono text-[var(--os-text-2)] w-12 flex-shrink-0">{pr.id}</span>
              <GitPullRequest className="w-4 h-4 text-[var(--os-text-2)] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{pr.title}</p>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5 font-mono">{pr.repo}</p>
              </div>
              <span className="text-xs text-[var(--os-text-2)] flex-shrink-0">{pr.author}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                style={{ background: `${SIZE_COLOR[pr.size]}18`, color: SIZE_COLOR[pr.size] }}
              >
                {pr.size}
              </span>
              <span className="text-xs text-[var(--os-text-2)] flex-shrink-0 w-16 text-right">
                {pr.days === 0 ? 'Today' : `${pr.days}d open`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
