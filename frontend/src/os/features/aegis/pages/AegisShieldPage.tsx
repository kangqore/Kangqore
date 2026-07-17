import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShieldOff, Clock, Search } from 'lucide-react'
import { api } from '@lib/api'

type TimeRange = '24h' | '7d' | '30d' | 'all'

const METHOD_COLOR: Record<string, string> = {
  GET:    '#2564ea',
  POST:   '#7c3aed',
  PUT:    '#0d9488',
  PATCH:  '#f59e0b',
  DELETE: '#ef4444',
}

function relTime(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60)    return `${secs}s ago`
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function timeRangeCutoff(range: TimeRange): Date | null {
  if (range === 'all') return null
  const ms = range === '24h' ? 86_400_000 : range === '7d' ? 7 * 86_400_000 : 30 * 86_400_000
  return new Date(Date.now() - ms)
}

export function AegisShieldPage() {
  const [page, setPage]         = useState(0)
  const [search, setSearch]     = useState('')
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [methodFilter, setMethodFilter] = useState('')
  const PAGE_SIZE = 50

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-shield', page, timeRange],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      const cutoff = timeRangeCutoff(timeRange)
      if (cutoff) params.set('from', cutoff.toISOString())
      return api.get(`/admin/aegis/shield?${params}`).then(r => r.data)
    },
    staleTime: 15_000,
    refetchInterval: 60_000,
  })

  const allRows: any[] = data?.rows ?? []
  const total: number  = data?.total ?? 0

  // Client-side filter by search + method
  const rows = allRows.filter(r => {
    if (methodFilter && r.method !== methodFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (r.endpoint ?? '').toLowerCase().includes(q) ||
             (r.userId   ?? '').toLowerCase().includes(q) ||
             (r.userRole ?? '').toLowerCase().includes(q)
    }
    return true
  })

  // Stats from current page
  const methods    = [...new Set(allRows.map(r => r.method).filter(Boolean))]
  const roles      = [...new Set(allRows.map(r => r.userRole).filter(Boolean))]
  const methodCounts: Record<string, number> = {}
  allRows.forEach(r => { if (r.method) methodCounts[r.method] = (methodCounts[r.method] ?? 0) + 1 })
  const topMethod  = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]
  const anonCount  = allRows.filter(r => !r.userId || r.userId === '—').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="bg-rose-900/20 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
        <ShieldOff className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-rose-300 mb-0.5">Access Shield Log</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Every attempt by a <strong className="text-[var(--os-text-1)]">non-ADMIN or unauthenticated</strong> caller to reach KIMMP/WAANDA endpoints.
            AEGIS blocked and logged all of these. None got through.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Blocked',    value: total,               color: '#ef4444', bg: '#ef44440e' },
          { label: 'This Page',        value: allRows.length,      color: '#f59e0b', bg: '#f59e0b0e' },
          { label: 'Anonymous Callers',value: anonCount,           color: '#7c3aed', bg: '#7c3aed0e' },
          { label: 'Top Method',       value: topMethod?.[0] ?? '—', color: '#2564ea', bg: '#2564ea0e' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}22`, borderLeft: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Time range */}
        <div style={{ display: 'flex', gap: 5 }}>
          {(['24h', '7d', '30d', 'all'] as TimeRange[]).map(t => (
            <button key={t} onClick={() => { setTimeRange(t); setPage(0) }} style={{
              fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
              background: timeRange === t ? '#ef444418' : 'var(--os-surface-3)',
              color: timeRange === t ? '#ef4444' : '#6b7280',
              border: `1px solid ${timeRange === t ? '#ef444430' : 'var(--os-border)'}`,
              cursor: 'pointer',
            }}>
              <Clock style={{ width: 9, height: 9, display: 'inline', marginRight: 3 }} />{t}
            </button>
          ))}
        </div>

        {/* Method filter */}
        {methods.length > 0 && (
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{
            background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
            borderRadius: 7, padding: '4px 10px', fontSize: 11, color: 'var(--os-text-1)', outline: 'none',
          }}>
            <option value="">All methods</option>
            {methods.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#6b7280' }} />
          <input
            type="text" placeholder="Search endpoint, user, role…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, fontSize: 11, color: 'var(--os-text-1)', outline: 'none' }}
          />
        </div>

        <span style={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>{total} total blocked</span>
      </div>

      {/* Method breakdown mini-bar */}
      {Object.keys(methodCounts).length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', alignSelf: 'center' }}>By Method</span>
          {Object.entries(methodCounts).sort((a, b) => b[1] - a[1]).map(([method, count]) => {
            const col = METHOD_COLOR[method] ?? '#6b7280'
            return (
              <div key={method} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 5, background: col + '14', color: col, border: `1px solid ${col}28` }}>{method}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: col, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: 44, background: 'var(--os-surface-0)', borderRadius: 8 }} className="animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
          <ShieldOff style={{ width: 28, height: 28, margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
          <p style={{ fontSize: 12 }}>No access violations in this time range.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px 100px 160px', background: 'var(--os-surface-0)', borderBottom: '1px solid var(--os-border)', padding: '10px 0' }}>
            {['When', 'Endpoint', 'Method', 'Role', 'User / ID'].map((h, i) => (
              <div key={i} style={{ paddingLeft: i === 0 ? 14 : 0, paddingRight: 14, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-3)' }}>{h}</div>
            ))}
          </div>

          {rows.map((row: any) => {
            const mCol = METHOD_COLOR[row.method] ?? '#6b7280'
            return (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px 100px 160px', alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 44 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ paddingLeft: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>{relTime(row.createdAt)}</div>
                  <div style={{ fontSize: 8, color: '#6b7280', fontFamily: 'monospace', marginTop: 1 }}>{new Date(row.createdAt).toLocaleTimeString()}</div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>
                  {row.endpoint ?? '—'}
                </div>
                <div>
                  <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 5, background: mCol + '14', color: mCol, border: `1px solid ${mCol}28` }}>
                    {row.method ?? '—'}
                  </span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>{row.userRole ?? 'anonymous'}</div>
                <div style={{ paddingRight: 14, fontFamily: 'monospace', fontSize: 9, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.userId ?? '(unauthenticated)'}
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
          <span style={{ fontSize: 10, color: '#6b7280', fontVariantNumeric: 'tabular-nums' }}>
            Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
          </span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
            style={{ fontSize: 11, color: (page + 1) * PAGE_SIZE >= total ? '#6b728060' : 'var(--os-text-2)', background: 'none', border: 'none', cursor: (page + 1) * PAGE_SIZE >= total ? 'default' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
