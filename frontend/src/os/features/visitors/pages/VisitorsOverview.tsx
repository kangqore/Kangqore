import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { Globe, ChatCircle, ArrowUpRight, Users, Eye, Target, CaretLeft, CaretRight, Funnel, MagnifyingGlass } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { useUIStore } from '@store/ui'
import { usePageViews } from '@hooks/usePageViews'
import { VisitorFunnel } from './VisitorFunnel'

const EVENT_COUNT_COLOR = (n: number) => n > 20 ? 'text-green-400' : n > 5 ? 'text-blue-400' : 'text-[var(--os-text-2)]'

function countryFlag(code: string | null | undefined) {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function HeatDot({ sessions }: { sessions: number }) {
  const cls = sessions >= 10 ? 'bg-red-400' : sessions >= 5 ? 'bg-amber-400' : sessions >= 2 ? 'bg-blue-400' : 'bg-slate-600'
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} title={`${sessions} sessions`} />
}

export function VisitorsOverview() {
  const navigate = useNavigate()
  usePageViews(['list', 'board'])
  const viewMode = useUIStore(s => s.viewMode)
  const [page, setPage]     = useState(1)
  const [filter, setFilter] = useState<'all' | 'hot' | 'stitched' | 'fresh'>('all')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-visitors', page],
    queryFn: () => api.get(`/admin/visitor?page=${page}&limit=25`).then(r => r.data),
    staleTime: 1000 * 30,
  })

  const visitors: any[] = data?.visitors ?? []
  const total: number   = data?.total ?? 0
  const pages           = Math.ceil(total / 25)

  const filtered = visitors.filter(v => {
    if (filter === 'hot')      return v.sessionCount >= 3 || v.eqoreQueries.length >= 1
    if (filter === 'stitched') return !!v.stitchedToId
    if (filter === 'fresh')    return !v.stitchedToId && v.sessionCount === 1
    return true
  }).filter(v => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      v.topPages?.some((p: string) => p.toLowerCase().includes(s)) ||
      v.eqoreQueries?.some((q: string) => q.toLowerCase().includes(s)) ||
      v.intentTags?.some((t: string) => t.toLowerCase().includes(s)) ||
      v.utmSource?.toLowerCase().includes(s) ||
      v.country?.toLowerCase().includes(s) ||
      v.city?.toLowerCase().includes(s)
    )
  })

  // Summary stats
  const totalAll     = visitors.length
  const hotCount     = visitors.filter(v => v.sessionCount >= 3 || (v.eqoreQueries?.length ?? 0) >= 1).length
  const stitchedCount = visitors.filter(v => v.stitchedToId).length
  const freshCount   = visitors.filter(v => !v.stitchedToId && v.sessionCount === 1).length

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--os-text-3, var(--os-text-2))' }}>Intelligence</p>
        <h1 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Visitors</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>Anonymous visitor tracking, funnel, and eQORE intelligence</p>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-[var(--os-text-1)] px-3 py-1.5 bg-[var(--os-surface-0)] rounded-lg border border-[var(--os-border)]">Visitors</span>
        <Link
          to="/kangqore-view/admin/visitors/transcripts"
          className="text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] px-3 py-1.5 rounded-lg hover:bg-[var(--os-surface-0)] border border-transparent hover:border-[var(--os-border)] transition-all flex items-center gap-1.5"
        >
          <ChatCircle size={12} /> Transcripts
        </Link>
        <Link
          to="/kangqore-view/admin/visitors/analytics"
          className="text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] px-3 py-1.5 rounded-lg hover:bg-[var(--os-surface-0)] border border-transparent hover:border-[var(--os-border)] transition-all flex items-center gap-1.5"
        >
          <Target size={12} /> eQORE Analytics
        </Link>
      </div>

      {/* Funnel */}
      <VisitorFunnel />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Visitors',    value: total,         sub: 'tracked sessions',        bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Hot Leads',         value: hotCount,      sub: '3+ sessions or eQORE',    bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
          { label: 'Identified',        value: stitchedCount, sub: 'stitched to profiles',    bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'First-Time',        value: freshCount,    sub: 'unknown first visit',     bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
            <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value}</p>
            <p className="relative text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[var(--os-surface-0)] rounded-lg p-1 border border-[var(--os-border)]">
          {(['all', 'hot', 'stitched', 'fresh'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-md capitalize transition-all ${
                filter === f
                  ? 'bg-[var(--os-surface-0)] text-[var(--os-text-1)]'
                  : 'text-[var(--os-text-2)] hover:text-[var(--os-text-2)]'
              }`}
            >
              {f === 'hot' ? '🔥 Hot' : f === 'stitched' ? '✓ Identified' : f === 'fresh' ? 'New' : 'All'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg px-3 py-2 flex-1 max-w-xs">
          <MagnifyingGlass size={13} className="text-[var(--os-text-2)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages, queries, intent…"
            className="bg-transparent text-xs text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none flex-1"
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-2)]">
            Clear
          </button>
        )}
      </div>

      {/* Board view — card grid */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="os-card p-4 animate-pulse space-y-3">
              <div className="h-4 w-2/3 rounded bg-[var(--os-surface-0)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--os-surface-0)]" />
              <div className="h-3 w-full rounded bg-[var(--os-surface-0)]" />
            </div>
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="col-span-3 text-center py-12 text-[var(--os-text-2)] text-sm">No visitors match this filter.</p>
          )}
          {!isLoading && filtered.map((v: any) => (
            <div
              key={v.id}
              onClick={() => navigate(`/kangqore-view/admin/visitors/${v.id}`)}
              className="os-card p-4 hover:shadow-[var(--os-shadow-card)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HeatDot sessions={v.sessionCount} />
                  <span className="font-bold text-[var(--os-text-1)] text-sm">{v.sessionCount} sessions</span>
                </div>
                {v.stitchedToId
                  ? <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-semibold">Identified</span>
                  : <span className="text-[10px] bg-slate-500/10 text-[var(--os-text-2)] px-2 py-0.5 rounded-full">Anonymous</span>
                }
              </div>
              {v.country && (
                <p className="text-xs text-[var(--os-text-2)] mb-2">
                  {countryFlag(v.country)} {v.city ? `${v.city}, ` : ''}{v.country}
                </p>
              )}
              {v.topPages?.[0] && (
                <p className="text-xs text-[var(--os-text-1)] truncate mb-2 font-medium">{v.topPages[0]}</p>
              )}
              {(v.eqoreQueries?.length ?? 0) > 0 && (
                <p className="text-[11px] text-purple-400 truncate mb-2">"{v.eqoreQueries[0]}"</p>
              )}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--os-border)]">
                <div className="flex flex-wrap gap-1">
                  {(v.intentTags ?? []).slice(0, 2).map((t: string) => (
                    <span key={t} className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <span className="text-[11px] text-[var(--os-text-2)]">{timeAgo(v.lastSeen)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view — table */}
      {viewMode === 'list' && (
      <div className="os-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--os-border)]">
                {['Heat', 'Sessions', 'Top pages', 'eQORE queries', 'Intent', 'Location', 'Source', 'Last seen', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--os-border)]">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 rounded bg-[var(--os-surface-0)] animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[var(--os-text-2)] text-sm">
                    No visitors match this filter.
                  </td>
                </tr>
              )}
              {!isLoading && filtered.map((v: any) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/kangqore-view/admin/visitors/${v.id}`)}
                  className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3"><HeatDot sessions={v.sessionCount} /></td>
                  <td className="px-4 py-3 font-bold text-[var(--os-text-1)]">{v.sessionCount}</td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <div className="truncate text-[var(--os-text-2)]">
                      {v.topPages?.[0] ?? '—'}
                    </div>
                    {v.topPages?.length > 1 && (
                      <span className="text-[10px] text-[var(--os-text-2)]">+{v.topPages.length - 1} more</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${EVENT_COUNT_COLOR(v.eqoreQueries?.length ?? 0)}`}>
                      {v.eqoreQueries?.length ?? 0}
                    </span>
                    {v.eqoreQueries?.[0] && (
                      <p className="text-[10px] text-[var(--os-text-2)] truncate max-w-[160px]">"{v.eqoreQueries[0]}"</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(v.intentTags ?? []).slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">
                    {v.country
                      ? <span title={`${v.city ?? ''}, ${v.country}`}>{countryFlag(v.country)} {v.city ?? v.country}</span>
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-[var(--os-text-2)]">{v.utmSource ?? '—'}</td>
                  <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{timeAgo(v.lastSeen)}</td>
                  <td className="px-4 py-3">
                    {v.stitchedToId
                      ? <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-semibold">Identified</span>
                      : <span className="text-[10px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded-full">Anonymous</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <ArrowUpRight size={13} className="text-[var(--os-text-2)]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--os-border)]">
            <span className="text-[11px] text-[var(--os-text-2)]">
              Page {page} of {pages} · {total} total
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)] transition-colors"
              >
                <CaretLeft size={13} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 rounded-lg border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)] transition-colors"
              >
                <CaretRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
