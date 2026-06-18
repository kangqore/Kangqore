import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'
import {
  Search, Zap, Briefcase, CalendarClock, LayoutDashboard,
  Handshake, Loader2, ArrowRight, Command,
} from 'lucide-react'
import { api } from '@lib/api'
import { spring } from '@os/motion'
import { cn } from '@design-system/cn'

// ── Open/close store ──────────────────────────────────────────────────────────

interface CPStore { open: boolean; setOpen: (v: boolean) => void }
export const useCommandPalette = create<CPStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  lead:         { label: 'Leads',         Icon: Zap,             color: '#2564ea' },
  client:       { label: 'Clients',       Icon: Briefcase,       color: '#059669' },
  consultation: { label: 'Consultations', Icon: CalendarClock,   color: '#7c3aed' },
  project:      { label: 'Projects',      Icon: LayoutDashboard, color: '#0ea5e9' },
  partner:      { label: 'Partners',      Icon: Handshake,       color: '#db2777' },
} as const

type ResultType = keyof typeof TYPE_CONFIG

interface SearchResult {
  type: ResultType
  id: string
  title: string
  subtitle: string
  path: string
  meta?: string
}

// ── Debounce hook ─────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const navigate   = useNavigate()
  const inputRef   = useRef<HTMLInputElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const [query, setQuery]       = useState('')
  const [activeIdx, setActive]  = useState(0)
  const dq = useDebounce(query, 240)

  const { data, isFetching } = useQuery({
    queryKey: ['cmd-search', dq],
    queryFn: () => api.get('/admin/search', { params: { q: dq } }).then(r => r.data),
    enabled: dq.length >= 2,
    staleTime: 30_000,
  })

  const results: SearchResult[] = data?.results ?? []

  // Group results preserving insertion order
  const groups: [ResultType, SearchResult[]][] = Object.entries(
    results.reduce<Partial<Record<ResultType, SearchResult[]>>>((acc, r) => {
      if (!acc[r.type]) acc[r.type] = []
      acc[r.type]!.push(r)
      return acc
    }, {})
  ) as [ResultType, SearchResult[]][]

  // ── Side effects ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [open])

  useEffect(() => { setActive(0) }, [dq])

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setOpen])

  // ── Keyboard navigation ───────────────────────────────────────────────────

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(i + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && results[activeIdx]) {
      navigate(results[activeIdx].path)
      setOpen(false)
    }
  }

  function select(r: SearchResult) {
    navigate(r.path)
    setOpen(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 z-[150]"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            key="cp-panel"
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: spring.snappy }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            className="fixed top-[14vh] left-1/2 -translate-x-1/2 z-[160] w-full max-w-[580px] px-4"
          >
            <div
              className="bg-os-s1 border border-os-border rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.75)' }}
            >

              {/* Input row */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-os-border">
                {isFetching
                  ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
                  : <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                }
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search leads, clients, projects, partners…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 border border-os-border rounded flex-shrink-0">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[56vh] overflow-y-auto">
                {dq.length < 2 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-os-border flex items-center justify-center">
                      <Command className="w-5 h-5 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-500">
                      Type 2+ characters to search across all modules
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-600">
                      {Object.entries(TYPE_CONFIG).map(([, { label, Icon, color }]) => (
                        <span key={label} className="flex items-center gap-1">
                          <Icon className="w-3 h-3" style={{ color }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : results.length === 0 && !isFetching ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-slate-500">
                      No results for <span className="text-white font-medium">"{dq}"</span>
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {groups.map(([type, items]) => {
                      const { label, Icon, color } = TYPE_CONFIG[type]
                      return (
                        <div key={type}>
                          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full inline-block" style={{ background: color }} />
                            {label}
                          </p>
                          {items.map(result => {
                            const globalIdx = results.findIndex(r => r.id === result.id && r.type === result.type)
                            const isActive  = globalIdx === activeIdx
                            return (
                              <button
                                key={result.id}
                                onMouseEnter={() => setActive(globalIdx)}
                                onClick={() => select(result)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                  isActive ? 'bg-os-s2' : 'hover:bg-slate-900/60'
                                )}
                              >
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ background: `${color}18` }}
                                >
                                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{result.title}</p>
                                  {result.subtitle && (
                                    <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                                  )}
                                </div>
                                {result.meta && (
                                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 capitalize">
                                    {result.meta.replace(/_/g, ' ')}
                                  </span>
                                )}
                                {isActive && (
                                  <ArrowRight className="w-3.5 h-3.5 text-os-cyan flex-shrink-0" />
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
              {results.length > 0 && (
                <div className="border-t border-os-border px-4 py-2.5 flex items-center gap-4">
                  {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                    <span key={key} className="text-[10px] text-slate-500 flex items-center gap-1">
                      <kbd className="font-mono bg-slate-900 px-1 border border-os-border rounded">{key}</kbd>
                      {label}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] text-slate-600">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
