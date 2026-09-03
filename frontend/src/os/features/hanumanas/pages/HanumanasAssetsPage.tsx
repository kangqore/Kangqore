import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Search, Database, FileText, Cpu, Eye, Archive } from 'lucide-react'
import { api } from '@lib/api'

const SYSTEM_CFG: Record<string, { color: string; icon: React.ElementType }> = {
  KIMMP:       { color: '#7c3aed', icon: Cpu      },
  EQORE:       { color: '#2564ea', icon: Database  },
  LEAD_INTEL:  { color: '#0d9488', icon: Eye       },
  ALIS:        { color: '#f59e0b', icon: FileText  },
  VIS:         { color: '#10b981', icon: Archive   },
  SENTINEL:    { color: '#ef4444', icon: BookOpen  },
}

const TYPE_COLOR: Record<string, string> = {
  document:     '#2564ea',
  signal:       '#ef4444',
  briefing:     '#7c3aed',
  model:        '#0d9488',
  schema:       '#f59e0b',
  policy:       '#10b981',
  knowledge:    '#f59e0b',
}

const SYSTEMS = ['KIMMP', 'EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL']

function relTime(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (secs < 60)    return `${secs}s ago`
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function HanumanasAssetsPage() {
  const [system, setSystem] = useState('')
  const [page, setPage]     = useState(0)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const PAGE_SIZE = 50

  const { data, isLoading } = useQuery({
    queryKey: ['hanumanas-assets', system, page],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      if (system) params.set('system', system)
      return api.get(`/admin/hanumanas/assets?${params}`).then(r => r.data)
    },
    staleTime: 30_000,
  })

  const allRows: any[] = data?.rows ?? []
  const total: number  = data?.total ?? 0

  // Client-side filter
  const rows = allRows.filter(r => {
    if (typeFilter && r.assetType !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (r.assetSource ?? '').toLowerCase().includes(q) ||
             (r.assetType  ?? '').toLowerCase().includes(q) ||
             (r.system     ?? '').toLowerCase().includes(q)
    }
    return true
  })

  // Stats
  const systemCounts: Record<string, number> = {}
  allRows.forEach(r => { if (r.system) systemCounts[r.system] = (systemCounts[r.system] ?? 0) + 1 })
  const typeCounts: Record<string, number> = {}
  allRows.forEach(r => { if (r.assetType) typeCounts[r.assetType] = (typeCounts[r.assetType] ?? 0) + 1 })
  const types = [...new Set(allRows.map(r => r.assetType).filter(Boolean))]
  const topSystem = Object.entries(systemCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-300 mb-0.5">Intelligence Registry</p>
          <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
            Every document, signal, and knowledge asset KIMMP ingested into its context.
            These form the <strong className="text-[var(--os-text-1)]">grounded evidence base</strong> KIMMP reasons from — the ADMIN owns all of it.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Assets',     value: total,                          color: '#10b981', bg: '#10b9810e' },
          { label: 'This View',        value: allRows.length,                 color: '#0d9488', bg: '#0d94880e' },
          { label: 'Top System',       value: topSystem?.[0] ?? '—',         color: '#7c3aed', bg: '#7c3aed0e' },
          { label: 'Asset Types',      value: types.length,                   color: '#2564ea', bg: '#2564ea0e' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, border: `1px solid ${k.color}22`, borderLeft: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6b7280', marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* System breakdown mini-chart */}
      {Object.keys(systemCounts).length > 0 && (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#6b7280', marginBottom: 12 }}>Assets by System</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(systemCounts).sort((a, b) => b[1] - a[1]).map(([sys, count]) => {
              const cfg = SYSTEM_CFG[sys]
              const col = cfg?.color ?? '#6b7280'
              const Icon = cfg?.icon ?? Database
              const max = Math.max(...Object.values(systemCounts))
              return (
                <div key={sys} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 120 }}>
                    <Icon style={{ width: 12, height: 12, color: col }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: col }}>{sys}</span>
                  </div>
                  <div style={{ flex: 1, height: 16, background: 'var(--os-border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: col, borderRadius: 4, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ minWidth: 28, fontSize: 11, fontWeight: 900, color: col, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* System filter chips */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button onClick={() => { setSystem(''); setPage(0) }} style={{
            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
            background: system === '' ? '#10b98118' : 'var(--os-surface-3)',
            color: system === '' ? '#10b981' : '#6b7280',
            border: `1px solid ${system === '' ? '#10b98130' : 'var(--os-border)'}`,
            cursor: 'pointer',
          }}>All</button>
          {SYSTEMS.filter(s => systemCounts[s]).map(s => {
            const col = SYSTEM_CFG[s]?.color ?? '#6b7280'
            const active = system === s
            return (
              <button key={s} onClick={() => { setSystem(s); setPage(0) }} style={{
                fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8,
                background: active ? col + '18' : 'var(--os-surface-3)',
                color: active ? col : '#6b7280',
                border: `1px solid ${active ? col + '30' : 'var(--os-border)'}`,
                cursor: 'pointer',
              }}>{s} ({systemCounts[s] ?? 0})</button>
            )
          })}
        </div>

        {/* Type filter */}
        {types.length > 0 && (
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{
            background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, padding: '4px 10px', fontSize: 11, color: 'var(--os-text-1)', outline: 'none',
          }}>
            <option value="">All types</option>
            {types.map(t => <option key={t} value={t}>{t} ({typeCounts[t]})</option>)}
          </select>
        )}

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#6b7280' }} />
          <input type="text" placeholder="Search source, type, system…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 28, paddingRight: 10, paddingTop: 6, paddingBottom: 6, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 7, fontSize: 11, color: 'var(--os-text-1)', outline: 'none' }}
          />
        </div>
        <span style={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>{total} assets</span>
      </div>

      {/* Asset table */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: 44, background: 'var(--os-surface-0)', borderRadius: 8 }} className="animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
          <BookOpen style={{ width: 28, height: 28, margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
          <p style={{ fontSize: 12 }}>No knowledge assets registered yet.</p>
        </div>
      ) : (
        <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 100px 100px 1fr 110px', background: 'var(--os-surface-0)', borderBottom: '1px solid var(--os-border)', padding: '10px 0' }}>
            {['When', 'System', 'Type', 'Source', ''].map((h, i) => (
              <div key={i} style={{ paddingLeft: i === 0 ? 14 : 0, paddingRight: 14, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--os-text-3)' }}>{h}</div>
            ))}
          </div>
          {rows.map((row: any) => {
            const sys  = SYSTEM_CFG[row.system]
            const sCol = sys?.color ?? '#6b7280'
            const SysIcon = sys?.icon ?? Database
            const tCol = TYPE_COLOR[row.assetType?.toLowerCase()] ?? '#6b7280'
            return (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '110px 100px 100px 1fr 110px', alignItems: 'center', borderBottom: '1px solid var(--os-border)', minHeight: 44 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--os-surface-0)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ paddingLeft: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--os-text-3)', fontVariantNumeric: 'tabular-nums' }}>{relTime(row.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <SysIcon style={{ width: 11, height: 11, color: sCol, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: sCol }}>{row.system ?? '—'}</span>
                </div>
                <div>
                  {row.assetType && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: tCol + '12', color: tCol, border: `1px solid ${tCol}22` }}>
                      {row.assetType}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>
                  {row.assetSource ?? '—'}
                </div>
                <div style={{ paddingRight: 14, fontSize: 9, color: '#6b7280', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.id?.slice(0, 8)}…
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
