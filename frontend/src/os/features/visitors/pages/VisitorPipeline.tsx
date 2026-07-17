import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Globe, ArrowUpRight, Clock, Eye, Target } from 'lucide-react'
import { api, isDemo } from '@lib/api'

interface Visitor {
  id: string
  sessionCount: number
  stitchedToId: string | null
  eqoreQueries: string[]
  intentTags: string[]
  utmSource: string | null
  utmMedium: string | null
  topPages: string[]
  lastSeen: string
  country: string | null
  city: string | null
}

const COLUMNS = [
  { id: 'anonymous', label: 'Anonymous',  color: '#64748b', bg: '#64748b12', desc: 'First-time, no identity signal'  },
  { id: 'engaged',   label: 'Engaged',    color: '#3b82f6', bg: '#3b82f612', desc: '3+ sessions or ran eQORE query' },
  { id: 'identified',label: 'Identified', color: '#8b5cf6', bg: '#8b5cf612', desc: 'Identity stitched to a profile'  },
  { id: 'qualified', label: 'Qualified',  color: '#10b981', bg: '#10b98112', desc: 'Identified + high engagement'    },
] as const

type ColId = typeof COLUMNS[number]['id']

function classify(v: Visitor): ColId {
  const hot = v.sessionCount >= 3 || v.eqoreQueries.length >= 1
  if (v.stitchedToId && hot) return 'qualified'
  if (v.stitchedToId)        return 'identified'
  if (hot)                   return 'engaged'
  return 'anonymous'
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const UTM_COLOR: Record<string, string> = {
  google:    '#4285F4', linkedin: '#0077B5', twitter: '#1DA1F2',
  email:     '#10b981', direct:   '#64748b', referral: '#8b5cf6',
  organic:   '#f59e0b',
}

export function VisitorPipeline() {
  const navigate  = useNavigate()
  const [search,  setSearch]  = useState('')
  const [country, setCountry] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['visitor-pipeline'],
    queryFn:  () => api.get('/admin/visitor?limit=200').then(r => r.data),
    staleTime: 30_000,
    enabled: !isDemo(),
  })

  const visitors: Visitor[] = data?.visitors ?? []

  const filtered = visitors.filter(v => {
    if (country && v.country !== country)          return false
    if (search) {
      const s = search.toLowerCase()
      return (
        v.topPages?.some(p => p.toLowerCase().includes(s)) ||
        v.eqoreQueries?.some(q => q.toLowerCase().includes(s)) ||
        v.utmSource?.toLowerCase().includes(s) ||
        v.country?.toLowerCase().includes(s)
      )
    }
    return true
  })

  const bucketed = COLUMNS.reduce((acc, col) => {
    acc[col.id] = filtered.filter(v => classify(v) === col.id)
    return acc
  }, {} as Record<ColId, Visitor[]>)

  const countries = [...new Set(visitors.map(v => v.country).filter(Boolean))] as string[]

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>Visitor Pipeline</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>
            Stage view — {visitors.length} visitors across {COLUMNS.length} stages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages, UTM, eQORE…"
            className="h-8 rounded-lg border px-3 text-xs bg-transparent outline-none"
            style={{ borderColor: 'var(--os-border)', color: 'var(--os-text-1)' }}
          />
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="h-8 rounded-lg border px-2 text-xs bg-transparent outline-none"
            style={{ borderColor: 'var(--os-border)', color: 'var(--os-text-1)' }}
          >
            <option value="">All countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="flex gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-1 min-w-[200px] rounded-xl p-3 animate-pulse"
              style={{ background: col.bg, border: `1px solid ${col.color}22` }}>
              <div className="h-4 w-24 rounded mb-3" style={{ background: `${col.color}20` }} />
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-lg p-3 mb-2" style={{ background: 'var(--os-surface-0)' }}>
                  <div className="h-3 w-3/4 rounded mb-2" style={{ background: 'var(--os-border)' }} />
                  <div className="h-2 w-1/2 rounded" style={{ background: 'var(--os-border)' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 min-w-[860px]">
            {COLUMNS.map(col => {
              const items = bucketed[col.id]
              return (
                <div key={col.id} className="flex-1 min-w-[200px] rounded-xl p-3"
                  style={{ background: col.bg, border: `1px solid ${col.color}22` }}>

                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: col.color }}>
                      {col.label}
                    </span>
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${col.color}20`, color: col.color }}>
                      {items.length}
                    </span>
                  </div>
                  <p className="text-[10px] mb-3" style={{ color: 'var(--os-text-3)' }}>{col.desc}</p>

                  {/* Cards */}
                  <div className="flex flex-col gap-2" style={{ maxHeight: 480, overflowY: 'auto' }}>
                    {items.map(v => (
                      <button
                        key={v.id}
                        onClick={() => navigate(`/kangqore-view/admin/visitors/${v.id}`)}
                        className="text-left rounded-lg p-3 transition-all hover:shadow-sm w-full"
                        style={{
                          background:   'var(--os-card, var(--os-surface-0))',
                          border:       '1px solid var(--os-border)',
                        }}
                      >
                        {/* UTM source chip */}
                        {v.utmSource && (
                          <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mb-1.5 mr-1"
                            style={{
                              background: `${UTM_COLOR[v.utmSource] ?? '#64748b'}18`,
                              color:      UTM_COLOR[v.utmSource] ?? '#64748b',
                              border:     `1px solid ${UTM_COLOR[v.utmSource] ?? '#64748b'}30`,
                            }}>
                            {v.utmSource}
                            {v.utmMedium ? ` / ${v.utmMedium}` : ''}
                          </span>
                        )}

                        {/* Top page */}
                        {v.topPages?.[0] && (
                          <p className="text-[11px] font-medium truncate mb-1" style={{ color: 'var(--os-text-1)' }}>
                            {v.topPages[0]}
                          </p>
                        )}

                        {/* Meta row */}
                        <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--os-text-2)' }}>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {v.sessionCount} session{v.sessionCount !== 1 ? 's' : ''}
                          </span>
                          {v.eqoreQueries.length > 0 && (
                            <span className="flex items-center gap-1" style={{ color: '#3b82f6' }}>
                              <Target className="w-3 h-3" />
                              {v.eqoreQueries.length} eQORE
                            </span>
                          )}
                          {v.country && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {v.city ?? v.country}
                            </span>
                          )}
                        </div>

                        {/* Intent tags */}
                        {v.intentTags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {v.intentTags.slice(0, 2).map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded"
                                style={{ background: 'var(--os-surface-0)', color: 'var(--os-text-3)', border: '1px solid var(--os-border)' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Last seen */}
                        {v.lastSeen && (
                          <p className="text-[9px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--os-text-3)' }}>
                            <Clock className="w-2.5 h-2.5" />
                            {timeAgo(v.lastSeen)}
                          </p>
                        )}
                      </button>
                    ))}

                    {items.length === 0 && (
                      <div className="rounded-lg p-4 text-center"
                        style={{ border: `2px dashed ${col.color}30` }}>
                        <p className="text-[11px]" style={{ color: 'var(--os-text-3)' }}>No visitors</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
