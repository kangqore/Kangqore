import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Radio, Shield, Zap, Lock, BookOpen, ArrowUpRight, AlertTriangle, Eye } from 'lucide-react'
import { api } from '@lib/api'
import { getSocket } from '@lib/socket'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface HanumanasEvent {
  id:         string
  eventType:  string
  system?:    string
  trigger?:   string
  endpoint?:  string
  actor:      string
  autonomous: boolean
  priority?:  string
  confidence?: number
  durationMs?: number
  assetType?: string
  assetId?:   string
  createdAt:  string
  _live?:     boolean
}

// ── Config ────────────────────────────────────────────────────────────────────
const MAX_EVENTS = 300

const EVENT_META: Record<string, { label: string; color: string; bg: string; icon: React.ElementType; dot: string }> = {
  ACTIVATION:       { label: 'ACTIVATION',      color: '#579bfc', bg: '#579bfc14', icon: Zap,           dot: 'bg-[#579bfc]' },
  AUTONOMOUS:       { label: 'AUTONOMOUS',       color: '#7c3aed', bg: '#7c3aed14', icon: Zap,           dot: 'bg-[#7c3aed]' },
  ACCESS_DENIED:    { label: 'ACCESS DENIED',    color: '#e2445c', bg: '#e2445c14', icon: Lock,          dot: 'bg-[#e2445c]' },
  KNOWLEDGE_ASSET:  { label: 'ASSET REGISTERED', color: '#00c875', bg: '#00c87514', icon: BookOpen,      dot: 'bg-[#00c875]' },
  EGRESS:           { label: 'EGRESS',           color: '#fdab3d', bg: '#fdab3d14', icon: ArrowUpRight,  dot: 'bg-[#fdab3d]' },
  POLICY_VIOLATION: { label: 'POLICY VIOLATION', color: '#f59e0b', bg: '#f59e0b14', icon: AlertTriangle, dot: 'bg-[#f59e0b]' },
}

const DEFAULT_META = { label: 'EVENT', color: '#8b8b8b', bg: '#8b8b8b14', icon: Eye, dot: 'bg-[#8b8b8b]' }

// ── Event row ─────────────────────────────────────────────────────────────────
function EventRow({ event, isNew }: { event: HanumanasEvent; isNew: boolean }) {
  const meta   = EVENT_META[event.eventType] ?? DEFAULT_META
  const Icon   = meta.icon
  const label  = event.trigger ?? event.endpoint ?? event.assetType ?? event.system ?? '—'
  const ts     = new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div
      className={cn(
        'group flex items-start gap-3 px-4 py-2.5 border-b border-[var(--os-border)] transition-all duration-500',
        isNew ? 'bg-white/5' : 'hover:bg-[var(--os-surface-0)]'
      )}
    >
      {/* Live pulse dot */}
      <div className="flex-shrink-0 mt-1.5 relative">
        <div className={cn('w-2 h-2 rounded-full', meta.dot)} />
        {isNew && (
          <div className={cn('absolute inset-0 rounded-full animate-ping', meta.dot, 'opacity-50')} />
        )}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] font-mono text-[var(--os-text-2)] flex-shrink-0 mt-0.5 w-20">{ts}</span>

      {/* Event badge */}
      <span
        className="text-[10px] font-bold font-mono flex-shrink-0 px-1.5 py-0.5 rounded"
        style={{ color: meta.color, background: meta.bg }}
      >
        <Icon className="inline w-2.5 h-2.5 mr-1 -mt-0.5" />
        {meta.label}
        {event.autonomous && ' ⚡'}
      </span>

      {/* System */}
      {event.system && (
        <span className="text-[10px] font-mono text-[var(--os-text-2)] flex-shrink-0">{event.system}</span>
      )}

      {/* Trigger / label */}
      <span className="text-[11px] text-[var(--os-text-1)] flex-1 min-w-0 truncate">{label}</span>

      {/* Actor */}
      <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0">{event.actor}</span>

      {/* Confidence */}
      {event.confidence != null && (
        <span className="text-[10px] font-mono text-[var(--os-text-2)] flex-shrink-0">{event.confidence}%</span>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function HanumanasLiveFeedPage() {
  const [events, setEvents]   = useState<HanumanasEvent[]>([])
  const [newIds, setNewIds]   = useState<Set<string>>(new Set())
  const [filter, setFilter]   = useState<string>('')
  const [paused, setPaused]   = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const pausedRef             = useRef(false)

  pausedRef.current = paused

  // Load initial events from ledger
  const { data: seed } = useQuery({
    queryKey: ['hanumanas-live-seed'],
    queryFn: () => api.get('/admin/hanumanas/audit?limit=100').then(r => r.data),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (seed?.rows) {
      setEvents((seed.rows as HanumanasEvent[]).slice().reverse())
    }
  }, [seed])

  // Subscribe to WebSocket live stream
  useEffect(() => {
    const socket = getSocket()

    const onEvent = (data: HanumanasEvent) => {
      if (pausedRef.current) return
      setEvents(prev => {
        const next = [...prev, { ...data, _live: true }]
        return next.slice(-MAX_EVENTS)
      })
      setNewIds(prev => {
        const n = new Set(prev)
        n.add(data.id)
        // Remove "new" highlight after 4s
        setTimeout(() => setNewIds(s => { const c = new Set(s); c.delete(data.id); return c }), 4000)
        return n
      })
    }

    socket.on('hanumanas:event', onEvent)
    return () => { socket.off('hanumanas:event', onEvent) }
  }, [])

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (!paused) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events.length, paused])

  const filtered = filter
    ? events.filter(e => e.eventType === filter)
    : events

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] ?? 0) + 1
    return acc
  }, {})

  const autonomousCount = events.filter(e => e.autonomous).length

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '70vh' }}>

      {/* Sovereignty doctrine header */}
      <div className="rounded-2xl border border-[#7c3aed]/30 bg-[#7c3aed]/[0.04] px-5 py-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative flex-shrink-0">
            <Shield className="w-5 h-5 text-[#7c3aed]" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00c875] animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest">
              Sovereignty Live Feed — WAANDA is Under Observation
            </p>
            <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
              Every KIMMP activation, autonomous action, access denial, and knowledge asset — streamed in real time. The ADMIN sees all.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#00c875] animate-pulse" />
            <span className="text-[10px] font-mono text-[#00c875]">LIVE</span>
          </div>
        </div>
        {/* Domain counters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(EVENT_META).map(([type, meta]) => (
            <button
              key={type}
              onClick={() => setFilter(f => f === type ? '' : type)}
              className={cn(
                'flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-2xl border transition-all',
                filter === type
                  ? 'border-current'
                  : 'border-[var(--os-border)] hover:border-current'
              )}
              style={{ color: meta.color }}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
              {meta.label} · {counts[type] ?? 0}
            </button>
          ))}
          {autonomousCount > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-2xl border border-[var(--os-border)] text-[#7c3aed]">
              ⚡ {autonomousCount} autonomous
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] text-[var(--os-text-2)] font-mono">{filtered.length} events{filter ? ` (${filter})` : ''}</span>
        <button
          onClick={() => setPaused(p => !p)}
          className={cn(
            'text-[10px] font-mono px-2.5 py-1 rounded-2xl border transition-all',
            paused
              ? 'border-[#fdab3d]/50 text-[#fdab3d] bg-[#fdab3d]/10'
              : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
          )}
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)]" style={{ maxHeight: '65vh' }}>
        {/* Column headers */}
        <div className="sticky top-0 flex items-center gap-3 px-4 py-2 bg-[var(--os-card)] border-b border-[var(--os-border)] z-10">
          <span className="w-2 flex-shrink-0" />
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--os-text-2)] w-20">Time</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--os-text-2)] w-36">Event</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--os-text-2)] w-20">System</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--os-text-2)] flex-1">Trigger / Label</span>
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Actor</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Shield className="w-8 h-8 text-[var(--os-text-2)]" />
            <p className="text-[11px] text-[var(--os-text-2)] text-center">
              {filter ? `No ${filter} events yet.` : 'Waiting for KIMMP activity. HANUMANAS is watching.'}
            </p>
          </div>
        ) : (
          filtered.map((event, i) => (
            <EventRow
              key={event.id ?? `${event.createdAt}-${i}`}
              event={event}
              isNew={newIds.has(event.id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
