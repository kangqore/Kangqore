import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import {
  Search, Zap, Briefcase, CalendarClock, LayoutDashboard,
  Handshake, Loader2, ArrowRight, ArrowUpRight, Plus,
} from 'lucide-react'
import { LightningIcon, SquaresFourIcon, TargetIcon, CpuIcon } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { spring } from '@os/motion'
import { navGroups, HOME_NAV_ITEM } from '@lib/nav'

// ── Store ──────────────────────────────────────────────────────────────────────

interface CPStore { open: boolean; setOpen: (v: boolean) => void }
export const useCommandPalette = create<CPStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

// ── Types / config ─────────────────────────────────────────────────────────────

const RESULT_CFG = {
  lead:         { label: 'Lead',         Icon: Zap,             color: '#2564ea' },
  client:       { label: 'Client',       Icon: Briefcase,       color: '#059669' },
  consultation: { label: 'Consultation', Icon: CalendarClock,   color: '#7c3aed' },
  project:      { label: 'Project',      Icon: LayoutDashboard, color: '#0ea5e9' },
  partner:      { label: 'Partner',      Icon: Handshake,       color: '#db2777' },
} as const

type ResultType = keyof typeof RESULT_CFG

interface SearchResult {
  type: ResultType
  id: string
  title: string
  subtitle: string
  path: string
  meta?: string
}

const QUICK_ACTIONS = [
  { label: 'Ask WAANDA',  Icon: CpuIcon,         path: '/kangqore-view/admin/WAANDA',              hint: 'Open AI intelligence'  },
  { label: 'New Lead',    Icon: LightningIcon,   path: '/kangqore-view/admin/leads',               hint: 'Add to pipeline'       },
  { label: 'New Project', Icon: SquaresFourIcon, path: '/kangqore-view/admin/projects',            hint: 'Start a project'       },
  { label: 'New Goal',    Icon: TargetIcon,      path: '/kangqore-view/admin/kangqore-immp/goals', hint: 'Set a KIMMP goal'      },
]

// ── Debounce ───────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

// ── Shared panel style ─────────────────────────────────────────────────────────

const PANEL: React.CSSProperties = {
  background:     'rgba(8,12,22,0.98)',
  backdropFilter: 'blur(32px)',
  border:         '1px solid rgba(255,255,255,0.08)',
  boxShadow:      '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
}

const SECTION_LABEL = 'px-3 pt-3 pb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600'

// ── Component ──────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const navigate  = useNavigate()
  const inputRef  = useRef<HTMLInputElement>(null)
  const [query, setQuery]      = useState('')
  const [activeIdx, setActive] = useState(0)
  const dq = useDebounce(query, 220)

  const allNavItems = useMemo(() => [HOME_NAV_ITEM, ...navGroups.flatMap(g => g.items)], [])

  // Nav items matching the current query
  const navMatches = useMemo(() => {
    if (!dq) return []
    const q = dq.toLowerCase()
    return allNavItems.filter(n => n.label.toLowerCase().includes(q)).slice(0, 5)
  }, [dq, allNavItems])

  const { data, isFetching } = useQuery({
    queryKey: ['cmd-search', dq],
    queryFn: () => api.get('/admin/search', { params: { q: dq } }).then(r => r.data),
    enabled: dq.length >= 2,
    staleTime: 30_000,
  })

  const results: SearchResult[] = data?.results ?? []

  // Flat ordered list for keyboard navigation (only in search mode)
  const flatItems = useMemo(() => {
    if (dq.length < 2) return []
    return [
      ...navMatches.map(n => ({ kind: 'nav' as const, path: n.path })),
      ...results.map(r => ({ kind: 'result' as const, path: r.path, id: r.id, type: r.type })),
    ]
  }, [dq, navMatches, results])

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 40) }
  }, [open])

  useEffect(() => { setActive(0) }, [dq])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [setOpen])

  // ── Keyboard nav ──────────────────────────────────────────────────────────

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, flatItems.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && flatItems[activeIdx]) { navigate(flatItems[activeIdx].path); setOpen(false) }
  }

  function go(path: string) { navigate(path); setOpen(false) }

  // Group search results by type for display
  const groups = Object.entries(
    results.reduce<Partial<Record<ResultType, SearchResult[]>>>((acc, r) => {
      if (!acc[r.type]) acc[r.type] = []
      acc[r.type]!.push(r)
      return acc
    }, {})
  ) as [ResultType, SearchResult[]][]

  const isSearching = dq.length >= 2
  const noResults   = isSearching && !isFetching && navMatches.length === 0 && results.length === 0

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[150]"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: spring.snappy }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
            className="fixed top-[13vh] left-1/2 -translate-x-1/2 z-[160] w-full max-w-[600px] px-4"
          >
            <div className="rounded-2xl overflow-hidden" style={PANEL}>

              {/* Input row */}
              <div
                className="flex items-center gap-3 px-4 py-3.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                {isFetching
                  ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
                  : <Search className="w-4 h-4 text-slate-600 flex-shrink-0" />
                }
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search or jump to…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                />
                <kbd
                  className="hidden sm:flex items-center text-[10px] text-slate-700 font-mono px-1.5 py-1 rounded flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  Esc
                </kbd>
              </div>

              {/* Body */}
              <div
                className="max-h-[62vh] overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}
              >
                {!isSearching ? (
                  /* ── Empty state: full nav launcher ── */
                  <div className="p-2">

                    {/* Quick actions */}
                    <p className={SECTION_LABEL}>Quick actions</p>
                    <div className="space-y-0.5 mb-1">
                      {QUICK_ACTIONS.map(a => {
                        const Icon = a.Icon
                        return (
                          <button
                            key={a.label}
                            onClick={() => go(a.path)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors hover:bg-white/5 group"
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(37,100,234,0.1)', border: '1px solid rgba(37,100,234,0.16)' }}
                            >
                              <Icon weight="fill" className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors">{a.label}</p>
                              <p className="text-[11px] text-slate-700">{a.hint}</p>
                            </div>
                            <Plus className="w-3 h-3 text-slate-700 flex-shrink-0" />
                          </button>
                        )
                      })}
                    </div>

                    {/* Nav groups */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 4, marginTop: 4 }}>
                      <p className={SECTION_LABEL}>Navigate</p>
                      {navGroups.map(group => (
                        <div key={group.label} className="mb-2">
                          <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-700">{group.label}</p>
                          <div className="grid grid-cols-2">
                            {group.items.map(item => {
                              const Icon = item.icon
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => go(item.path)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-white/5 group"
                                >
                                  <Icon weight="fill" className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                                  <span className="text-[12px] text-slate-500 group-hover:text-slate-200 transition-colors truncate">{item.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                ) : noResults ? (
                  /* ── No results ── */
                  <div className="py-12 text-center">
                    <p className="text-sm text-slate-500">
                      No results for <span className="text-white font-medium">"{dq}"</span>
                    </p>
                    <p className="text-xs text-slate-700 mt-1">Try a lead name, client, project or page</p>
                  </div>

                ) : (
                  /* ── Search results ── */
                  <div className="p-2 space-y-0.5">

                    {/* Page matches */}
                    {navMatches.length > 0 && (
                      <div className="mb-1">
                        <p className={SECTION_LABEL}>Go to page</p>
                        {navMatches.map(item => {
                          const Icon = item.icon
                          const idx = flatItems.findIndex(f => f.kind === 'nav' && f.path === item.path)
                          return (
                            <button
                              key={item.id}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => go(item.path)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                              style={{ background: idx === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                            >
                              <Icon weight="fill" className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <span className="text-[13px] font-medium text-slate-200 flex-1">{item.label}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Data results grouped by type */}
                    {groups.map(([type, items]) => {
                      const { label, Icon, color } = RESULT_CFG[type]
                      return (
                        <div key={type}>
                          <p className={`${SECTION_LABEL} flex items-center gap-1.5`} style={{ color: color + 'bb' }}>
                            <span className="w-1 h-1 rounded-full inline-block" style={{ background: color }} />
                            {label}s
                          </p>
                          {items.map(result => {
                            const idx = flatItems.findIndex(
                              f => f.kind === 'result' && f.id === result.id && f.type === result.type
                            )
                            return (
                              <button
                                key={result.id}
                                onMouseEnter={() => setActive(idx)}
                                onClick={() => go(result.path)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                                style={{ background: idx === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                              >
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                                >
                                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-white truncate">{result.title}</p>
                                  {result.subtitle && (
                                    <p className="text-[11px] text-slate-500 truncate">{result.subtitle}</p>
                                  )}
                                </div>
                                {result.meta && (
                                  <span className="text-[10px] text-slate-600 font-mono capitalize flex-shrink-0">
                                    {result.meta.replace(/_/g, ' ')}
                                  </span>
                                )}
                                {idx === activeIdx && (
                                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0ea5e9' }} />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center gap-4 px-4 py-2.5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, lbl]) => (
                  <span key={key} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                    <kbd
                      className="font-mono text-slate-500 px-1.5 py-0.5 rounded text-[9px]"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {key}
                    </kbd>
                    {lbl}
                  </span>
                ))}
                <span className="ml-auto text-[10px] text-slate-700">
                  {isSearching && results.length > 0
                    ? `${results.length} result${results.length !== 1 ? 's' : ''}`
                    : 'type to search'
                  }
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
