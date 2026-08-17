import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap, Clock, Timer, Search } from 'lucide-react'
import { api } from '@lib/api'

type TimeRange = '24h' | '7d' | '30d' | 'all'

const TRIGGER_COLOR: Record<string, string> = {
  'schedule.': '#2564ea',
  'event.':    '#0d9488',
  'scout.':    '#7c3aed',
  'wakeup.':   '#f59e0b',
  'cron.':     '#2564ea',
}

function triggerColor(trigger: string): string {
  for (const [prefix, col] of Object.entries(TRIGGER_COLOR)) {
    if ((trigger ?? '').startsWith(prefix)) return col
  }
  return '#6b7280'
}

function relTime(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60)    return `${secs}s ago`
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function durLabel(ms: number | null) {
  if (ms == null) return null
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function durColor(ms: number | null) {
  if (ms == null) return '#6b7280'
  if (ms < 2000)  return '#10b981'
  if (ms < 8000)  return '#f59e0b'
  return '#ef4444'
}

function timeRangeCutoff(range: TimeRange): Date | null {
  if (range === 'all') return null
  const ms = range === '24h' ? 86_400_000 : range === '7d' ? 7 * 86_400_000 : 30 * 86_400_000
  return new Date(Date.now() - ms)
}

export function AegisAutonomyPage() {
  const [page, setPage]           = useState(0)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [search, setSearch]       = useState('')
  const [systemFilter, setSystem] = useState('')
  const PAGE_SIZE = 50

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-autonomy', page, timeRange],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      const cutoff = timeRangeCutoff(timeRange)
      if (cutoff) params.set('from', cutoff.toISOString())
      if (systemFilter) params.set('system', systemFilter)
      return api.get(`/admin/aegis/autonomy?${params}`).then(r => r.data)
    },
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const allRows: any[] = data?.rows ?? []
  const total: number  = data?.total ?? 0

  const rows = allRows.filter(r => {
    if (search) {
      const q = search.toLowerCase()
      return (r.trigger ?? '').toLowerCase().includes(q) ||
             (r.system  ?? '').toLowerCase().includes(q) ||
             (r.agentsRun ?? []).some((a: string) => a.toLowerCase().includes(q))
    }
    return true
  })

  const systems      = [...new Set(allRows.map(r => r.system).filter(Boolean))]
  const avgDur       = allRows.filter(r => r.durationMs != null).reduce((s, r, _, a) => s + r.durationMs / a.length, 0)
  const totalAgents  = allRows.reduce((s, r) => s + (r.agentsRun?.length ?? 0), 0)
  const uniqueTriggers = [...new Set(allRows.map(r => r.trigger).filter(Boolean))].length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="bg-violet-900/20 border border-violet-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Zap className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-violet-300 mb-0.5">Autonomy Boundary Monitor</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Every action KIMMP/WAANDA took <strong className="text-[var(--os-text-1)]">without being directly asked</strong> — scheduled loops, auto-synthesises, Scout-triggered wakeups.
            The ADMIN sees the full autonomous footprint in real time.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Autonomous Actions', value: total,                                    color: '#7c3aed', bg: '#7c3aed0e' },
          { label: 'Unique Triggers',    value: uniqueTriggers,                           color: '#2564ea', bg: '#2564ea0e' },
          { label: 'Avg Duration',       value: avgDur > 0 ? `${(avgDur / 1000).toFixed(1)}s` : '—', color: '#0d9488', bg: '#0d94880e' },
          { label: 'Agent Invocations',  value: totalAgents,                              color: '#f59e0b', bg: '#f59e0b0e' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}22`, borderLeft: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {(['24h', '7d', '30d', 'all'] as TimeRange[]).map(t => (
          <button key={t} onClick={() => { setTimeRange(t); setPage(0) }} style={{
            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
            background: timeRange === t ? '#7c3aed18' : 'var(--os-surface-3)',
            color: timeRange === t ? '#7c3aed' : '#6b7280',
            border: `1px solid ${timeRange === t ? '#7c3aed30' : 'var(--os-border)'}`,
            cursor: 'pointer',
          }}>
            <Clock style={{ width: 9, height: 9, display: 'inline', marginRight: 3 }} />{t}
          </button>
        ))}
        {systems.length > 0 && (
          <select value={systemFilter} onChange={e => { setSystem(e.target.value); setPage(0) }} style={{
            background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '4px 10px', fontSize: 11, color: 'var(--os-text-1)', outline: 'none',
          }}>
            <option value="">All systems</option>
            {systems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#6b7280' }} />
          <input type="text" placeholder="Filter by trigger, system, agent…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, fontSize: 11, color: 'var(--os-text-1)', outline: 'none' }}
          />
        </div>
        <span style={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>{total} total</span>
      </div>

      {/* Event cards */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ height: 80, background: 'var(--os-surface-0)', borderRadius: 12 }} className="animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
          <Zap style={{ width: 28, height: 28, margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
          <p style={{ fontSize: 12 }}>No autonomous actions in this period. AEGIS will record them the moment KIMMP acts without being asked.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row: any) => {
            const tCol = triggerColor(row.trigger ?? '')
            const dur  = row.durationMs
            const dCol = durColor(dur)
            return (
              <div key={row.id} style={{ background: 'var(--os-card)', border: `1px solid var(--os-border)`, borderLeft: `4px solid ${tCol}`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: tCol + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap style={{ width: 14, height: 14, color: tCol }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: tCol, background: tCol + '12', border: `1px solid ${tCol}28`, padding: '2px 7px', borderRadius: 6 }}>
                        {row.trigger ?? 'unknown'}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-2)' }}>{row.system ?? 'KIMMP'}</span>
                      {dur != null && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, color: dCol }}>
                          <Timer style={{ width: 9, height: 9 }} />{durLabel(dur)}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: 9, color: '#6b7280' }}>{relTime(row.createdAt)}</span>
                    </div>
                    {/* Agent tags */}
                    {row.agentsRun?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                        <span style={{ fontSize: 9, color: '#6b7280', alignSelf: 'center' }}>agents:</span>
                        {row.agentsRun.map((a: string) => (
                          <span key={a} style={{ fontSize: 9, fontFamily: 'monospace', padding: '1px 5px', borderRadius: 4, background: 'var(--os-surface-3)', color: '#7c3aed', border: '1px solid #7c3aed18' }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ fontSize: 11, color: page === 0 ? '#6b728060' : 'var(--os-text-2)', background: 'none', border: 'none', cursor: page === 0 ? 'default' : 'pointer' }}>
            ← Prev
          </button>
          <span style={{ fontSize: 10, color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
            style={{ fontSize: 11, color: (page + 1) * PAGE_SIZE >= total ? '#6b728060' : 'var(--os-text-2)', background: 'none', border: 'none', cursor: (page + 1) * PAGE_SIZE >= total ? 'default' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
