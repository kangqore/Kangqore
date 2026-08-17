import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import {
  Search, Zap, Briefcase, CalendarClock, LayoutDashboard,
  Handshake, Loader2, ArrowRight, ArrowUpRight, Plus, Play,
} from 'lucide-react'
import { LightningIcon, SquaresFourIcon, TargetIcon, CpuIcon } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { spring } from '@os/motion'
import { navGroups, HOME_NAV_ITEM } from '@lib/nav'
import { actionEngineService, type OntologyAction } from '../../features/ontology/actionEngineService'
import { ActionRunModal } from '../../features/ontology/components/ActionRunModal'

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
  background:     'rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(48px)',
  WebkitBackdropFilter: 'blur(48px)',
  border:         '1px solid rgba(255,255,255,0.12)',
  boxShadow:      '0 32px 80px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
}

const SECTION_LABEL = 'px-3 pt-2 pb-1 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500'

// ── Component ──────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const navigate  = useNavigate()
  const inputRef  = useRef<HTMLInputElement>(null)
  const [query, setQuery]      = useState('')
  const [activeIdx, setActive] = useState(0)
  const [runningAction, setRunningAction] = useState<OntologyAction | null>(null)
  const dq = useDebounce(query, 220)

  // S297 — "/" switches the palette into Action-runner mode: "/approve" or
  // "/run approve" both match against Action displayName/name.
  const isActionMode = query.trimStart().startsWith('/')
  const actionQuery = query.trimStart().slice(1).replace(/^run\s+/i, '').trim().toLowerCase()

  const allNavItems = useMemo(() => [HOME_NAV_ITEM, ...navGroups.flatMap(g => g.items)], [])

  // Nav items matching the current query
  const navMatches = useMemo(() => {
    if (!dq || isActionMode) return []
    const q = dq.toLowerCase()
    return allNavItems.filter(n => n.label.toLowerCase().includes(q)).slice(0, 5)
  }, [dq, allNavItems, isActionMode])

  const { data, isFetching } = useQuery({
    queryKey: ['cmd-search', dq],
    queryFn: () => api.get('/admin/search', { params: { q: dq } }).then(r => r.data),
    enabled: dq.length >= 2 && !isActionMode,
    staleTime: 30_000,
  })

  const { data: allActions } = useQuery({
    queryKey: ['cmd-actions'],
    queryFn: () => actionEngineService.list(),
    enabled: isActionMode,
    staleTime: 30_000,
  })
  const actionMatches = useMemo(() => {
    if (!isActionMode) return []
    const pool = allActions ?? []
    if (!actionQuery) return pool.slice(0, 8)
    return pool.filter(a => a.displayName.toLowerCase().includes(actionQuery) || a.name.toLowerCase().includes(actionQuery)).slice(0, 8)
  }, [isActionMode, allActions, actionQuery])

  const results: SearchResult[] = data?.results ?? []

  // Flat ordered list for keyboard navigation (only in search / action mode)
  const flatItems = useMemo(() => {
    if (isActionMode) return actionMatches.map(a => ({ kind: 'action' as const, action: a }))
    if (dq.length < 2) return []
    return [
      ...navMatches.map(n => ({ kind: 'nav' as const, path: n.path })),
      ...results.map(r => ({ kind: 'result' as const, path: r.path, id: r.id, type: r.type })),
    ]
  }, [dq, navMatches, results, isActionMode, actionMatches])

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) { setQuery(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 40) }
  }, [open])

  useEffect(() => { setActive(0) }, [dq])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) { 
        e.preventDefault(); 
        setOpen(true);
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [setOpen])

  // ── Keyboard nav ──────────────────────────────────────────────────────────

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, flatItems.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && flatItems[activeIdx]) {
      const item = flatItems[activeIdx]
      if (item.kind === 'action') { runAction(item.action); return }
      navigate(item.path); setOpen(false)
    }
  }

  function go(path: string) { navigate(path); setOpen(false) }
  function runAction(action: OntologyAction) { setRunningAction(action); setOpen(false) }

  // Group search results by type for display
  const groups = Object.entries(
    results.reduce<Partial<Record<ResultType, SearchResult[]>>>((acc, r) => {
      if (!acc[r.type]) acc[r.type] = []
      acc[r.type]!.push(r)
      return acc
    }, {})
  ) as [ResultType, SearchResult[]][]

  const isSearching = dq.length >= 2 && !isActionMode
  const noResults   = isSearching && !isFetching && navMatches.length === 0 && results.length === 0
  const noActions   = isActionMode && actionMatches.length === 0 && allActions !== undefined

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
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.96, x: '-50%', y: 'calc(-50% - 16px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: spring.snappy }}
            exit={{ opacity: 0, scale: 0.97, x: '-50%', y: '-50%', transition: { duration: 0.1 } }}
            className="fixed top-1/2 left-1/2 z-[160] w-full max-w-[650px] px-4"
          >
            <div className="rounded-2xl overflow-hidden" style={PANEL}>

              {/* Input row */}
              <div
                className="flex items-center gap-4 px-6 py-6"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
              >
                {isFetching
                  ? <Loader2 className="w-6 h-6 text-slate-400 animate-spin flex-shrink-0" />
                  : <Search className="w-6 h-6 text-slate-400 flex-shrink-0" />
                }
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search or jump to…"
                  className="flex-1 bg-transparent text-xl font-light text-white placeholder:text-slate-500 outline-none"
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
                {isActionMode ? (
                  /* ── S297: Run Action ── */
                  <div className="p-2">
                    <p className={SECTION_LABEL}>Run action</p>
                    {noActions ? (
                      <div className="py-6 text-center">
                        <p className="text-[11px] text-slate-500">No actions match <span className="text-white font-medium">"{actionQuery || query}"</span></p>
                        <p className="text-[10px] text-slate-700 mt-1">Try a shorter name, e.g. <span className="font-mono">/approve</span></p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {actionMatches.map((a, idx) => (
                          <button
                            key={a.id}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => runAction(a)}
                            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors"
                            style={{ background: idx === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                          >
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(87,155,252,0.1)', border: '1px solid rgba(87,155,252,0.2)' }}>
                              <Play weight="fill" className="w-2.5 h-2.5" style={{ color: '#579bfc' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-slate-200 truncate">{a.displayName}</p>
                              <p className="text-[9px] text-slate-600">{a.type?.displayName} · {a.parameters.length} param{a.parameters.length !== 1 ? 's' : ''}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                ) : !isSearching ? (
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
                            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-white/5 group"
                          >
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(37,100,234,0.1)', border: '1px solid rgba(37,100,234,0.16)' }}
                            >
                              <Icon weight="fill" className="w-2.5 h-2.5" style={{ color: '#60a5fa' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors">{a.label}</p>
                              <p className="text-[9px] text-slate-700">{a.hint}</p>
                            </div>
                            <Plus className="w-2.5 h-2.5 text-slate-700 flex-shrink-0" />
                          </button>
                        )
                      })}
                    </div>

                    {/* Nav groups */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 4, marginTop: 4 }}>
                      <p className={SECTION_LABEL}>Navigate</p>
                      {navGroups.map(group => (
                        <div key={group.label} className="mb-2">
                          <p className="px-3 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-slate-600">{group.label}</p>
                          <div className="grid grid-cols-2">
                            {group.items.map(item => {
                              const Icon = item.icon
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => go(item.path)}
                                  className="flex items-center gap-2 px-3 py-1 rounded text-left transition-colors hover:bg-white/5 group"
                                >
                                  <Icon weight="fill" className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                                  <span className="text-[10px] text-slate-500 group-hover:text-slate-200 transition-colors truncate">{item.label}</span>
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
                  <div className="py-10 text-center">
                    <p className="text-[11px] text-slate-500">
                      No results for <span className="text-white font-medium">"{dq}"</span>
                    </p>
                    <p className="text-[10px] text-slate-700 mt-1">Try a lead name, client, project or page</p>
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
                              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors"
                              style={{ background: idx === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                            >
                              <Icon weight="fill" className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                              <span className="text-[11px] font-medium text-slate-200 flex-1">{item.label}</span>
                              <ArrowUpRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
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
                                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors"
                                style={{ background: idx === activeIdx ? 'rgba(255,255,255,0.07)' : 'transparent' }}
                              >
                                <div
                                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                  style={{ background: `${color}10`, border: `1px solid ${color}20` }}
                                >
                                  <Icon className="w-2.5 h-2.5" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-medium text-white truncate">{result.title}</p>
                                  {result.subtitle && (
                                    <p className="text-[9px] text-slate-500 truncate">{result.subtitle}</p>
                                  )}
                                </div>
                                {result.meta && (
                                  <span className="text-[9px] text-slate-600 font-mono capitalize flex-shrink-0">
                                    {result.meta.replace(/_/g, ' ')}
                                  </span>
                                )}
                                {idx === activeIdx && (
                                  <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: '#0ea5e9' }} />
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
      {runningAction && (
        <ActionRunModal action={runningAction} onClose={() => setRunningAction(null)} />
      )}
    </AnimatePresence>
  )
}
