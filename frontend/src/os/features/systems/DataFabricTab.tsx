import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import {
  Radio, Database, Zap, ArrowRight, CheckCircle2,
  Activity, BarChart3, Info, AlertTriangle, AlertCircle,
  ChevronDown, ChevronRight, Package, Server,
} from 'lucide-react'
import { apiFetch } from '../../lib/api'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type CDCOp = 'INSERT' | 'UPDATE' | 'DELETE' | 'UPSERT'

interface CDCEvent {
  id: string
  table: string
  op: CDCOp
  before: Record<string, any> | null
  after: Record<string, any> | null
  timestamp: string
  source: string
  meta?: Record<string, any>
}

interface CdcStats {
  totalEvents: number
  tablesTracked: number
  ringSize: number
  ringCapacity: number
  startedAt: string
  topTables: Array<{ table: string; inserts: number; updates: number; deletes: number; upserts: number; total: number }>
}

interface BrokerRow {
  dimension: string
  nats: string
  redpanda: string
  winner: 'NATS' | 'Redpanda' | 'Tied'
  notes: string
}

interface BrokerComparison {
  comparison: BrokerRow[]
  verdict: { recommendation: string; rationale: string; nextStep: string }
  activeBus: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const OP_CFG: Record<CDCOp, { color: string; bg: string }> = {
  INSERT: { color: '#00c875', bg: '#00c87515' },
  UPDATE: { color: '#579bfc', bg: '#579bfc15' },
  DELETE: { color: '#e2445c', bg: '#e2445c15' },
  UPSERT: { color: '#fdab3d', bg: '#fdab3d15' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })
}

function WinnerBadge({ winner }: { winner: 'NATS' | 'Redpanda' | 'Tied' }) {
  const cfg = {
    NATS:     { cls: 'bg-[#00c875]/10 text-[#00c875]' },
    Redpanda: { cls: 'bg-[#fdab3d]/10 text-[#fdab3d]' },
    Tied:     { cls: 'bg-[var(--os-border)] text-[var(--os-text-2)]' },
  }[winner]
  return <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold', cfg.cls)}>{winner}</span>
}

// ── Live Event Row ────────────────────────────────────────────────────────────

function EventRow({ event, isNew }: { event: CDCEvent; isNew: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = OP_CFG[event.op]

  return (
    <div className={cn('border-b border-[var(--os-border)] last:border-0 transition-all', isNew && 'bg-[#00c875]/5')}>
      <div
        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--os-surface-0)]"
        onClick={() => setExpanded(!expanded)}
      >
        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#00c875] animate-pulse shrink-0" />}
        {!isNew && <span className="w-1.5 h-1.5 shrink-0" />}

        <span className="text-[10px] font-mono text-[var(--os-text-2)] w-20 shrink-0">{fmt(event.timestamp)}</span>

        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: cfg.color, background: cfg.bg }}>
          {event.op}
        </span>

        <span className="font-mono text-xs text-[#579bfc] shrink-0">{event.table}</span>

        {event.after?.id && (
          <span className="text-[10px] text-[var(--os-text-2)] font-mono truncate flex-1">
            id: {String(event.after.id).slice(0, 16)}…
          </span>
        )}

        <span className="text-[10px] text-[var(--os-text-2)] shrink-0 ml-auto">{event.source}</span>
        <button className="text-[var(--os-text-2)] shrink-0">
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </div>

      {expanded && (
        <div className="px-10 pb-3">
          <pre className="text-[10px] font-mono text-[var(--os-text-2)] bg-[var(--os-surface-0)] rounded-2xl p-3 overflow-x-auto max-h-48">
            {JSON.stringify({ before: event.before, after: event.after }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// ── Main Tab ──────────────────────────────────────────────────────────────────

export function DataFabricTab() {
  const [events, setEvents]   = useState<CDCEvent[]>([])
  const [newIds, setNewIds]   = useState<Set<string>>(new Set())
  const [paused, setPaused]   = useState(false)
  const [activeView, setActiveView] = useState<'stream' | 'stats' | 'broker'>('stream')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Live CDC event stream via Socket.io
  useEffect(() => {
    const socket = io({ path: '/socket.io', transports: ['websocket'] })

    socket.on('cdc:event', (event: CDCEvent) => {
      if (paused) return
      setEvents(prev => {
        const next = [event, ...prev].slice(0, 200)
        return next
      })
      setNewIds(prev => {
        const next = new Set(prev)
        next.add(event.id)
        setTimeout(() => setNewIds(s => { const c = new Set(s); c.delete(event.id); return c }), 3000)
        return next
      })
    })

    return () => { socket.disconnect() }
  }, [paused])

  // Initial load of recent events
  const eventsQ = useQuery({
    queryKey: ['cdc-events'],
    queryFn: () => apiFetch<{ events: CDCEvent[] }>('/admin/cdc/events?limit=100'),
    onSuccess: (data: any) => {
      if (events.length === 0) setEvents(data.events)
    },
  } as any)

  const statsQ = useQuery({
    queryKey: ['cdc-stats'],
    queryFn: () => apiFetch<{ stats: CdcStats; bus: string }>('/admin/cdc/stats'),
    refetchInterval: 10_000,
  })

  const brokerQ = useQuery({
    queryKey: ['cdc-broker'],
    queryFn: () => apiFetch<BrokerComparison>('/admin/cdc/broker-comparison'),
  })

  const stats  = statsQ.data?.stats
  const bus    = statsQ.data?.bus ?? brokerQ.data?.activeBus ?? 'memory'
  const broker = brokerQ.data

  const BUS_COLOR = bus === 'nats' ? '#00c875' : bus === 'redpanda' ? '#fdab3d' : '#579bfc'
  const BUS_LABEL = bus === 'nats' ? 'NATS JetStream' : bus === 'redpanda' ? 'Redpanda' : 'InMemory (dev)'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--os-text-1)] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#00c875]" />
            Data Fabric — Event Stream
          </h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">
            Real-time CDC (Change Data Capture) pipeline — every Postgres mutation as a live event.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-2xl border border-[var(--os-border)]" style={{ color: BUS_COLOR }}>
            <Server className="w-3 h-3" />
            {BUS_LABEL}
          </span>
          <button
            onClick={() => setPaused(!paused)}
            className={cn(
              'px-3 py-1.5 text-xs rounded-2xl font-medium transition-all',
              paused
                ? 'bg-[#00c875] text-white'
                : 'border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Events Captured', value: stats?.totalEvents     ?? 0, icon: Activity,  color: '#00c875' },
          { label: 'Tables Tracked',  value: stats?.tablesTracked   ?? 0, icon: Database,  color: '#579bfc' },
          { label: 'In Ring Buffer',  value: stats?.ringSize        ?? 0, icon: BarChart3, color: '#fdab3d' },
          { label: 'Live in View',    value: events.length,               icon: Radio,     color: '#7c3aed' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-[var(--os-text-2)]">{s.label}</p>
              <p className="text-xl font-bold text-[var(--os-text-1)]">{s.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
        {([
          { key: 'stream', label: 'Live Stream' },
          { key: 'stats',  label: 'Table Stats' },
          { key: 'broker', label: 'Broker Comparison' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveView(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all',
              activeView === t.key
                ? 'border-[#00c875] text-[#00c875]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Live stream */}
      {activeView === 'stream' && (
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
            <div className="flex items-center gap-2 text-xs text-[var(--os-text-2)]">
              {!paused && <span className="w-2 h-2 rounded-full bg-[#00c875] animate-pulse" />}
              {paused && <span className="w-2 h-2 rounded-full bg-[var(--os-border)]" />}
              {paused ? 'Stream paused' : 'Streaming live'}
            </div>
            <span className="text-[10px] font-mono text-[var(--os-text-2)]">
              time · op · table · id (truncated) · source
            </span>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {events.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-[var(--os-text-2)]">
                <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No events yet — create, update, or delete an ontology object to see CDC events appear here.
              </div>
            )}
            {events.map(e => (
              <EventRow key={e.id} event={e} isNew={newIds.has(e.id)} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* Table stats */}
      {activeView === 'stats' && (
        <div className="space-y-3">
          {statsQ.isLoading && <p className="text-sm text-[var(--os-text-2)]">Loading…</p>}
          {stats && stats.topTables.length === 0 && (
            <p className="text-sm text-[var(--os-text-2)]">No events captured yet.</p>
          )}
          {stats?.topTables.map(t => (
            <div key={t.table} className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm font-semibold text-[#579bfc]">{t.table}</span>
                <span className="text-xs text-[var(--os-text-2)]">{t.total.toLocaleString()} total</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'INSERT', value: t.inserts, color: '#00c875' },
                  { label: 'UPDATE', value: t.updates, color: '#579bfc' },
                  { label: 'DELETE', value: t.deletes, color: '#e2445c' },
                  { label: 'UPSERT', value: t.upserts, color: '#fdab3d' },
                ].map(op => (
                  <div key={op.label} className="rounded-2xl p-2 text-center" style={{ background: `${op.color}10` }}>
                    <p className="text-[10px] font-mono font-bold" style={{ color: op.color }}>{op.label}</p>
                    <p className="text-lg font-bold text-[var(--os-text-1)]">{op.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broker comparison */}
      {activeView === 'broker' && broker && (
        <div className="space-y-5">
          {/* Verdict banner */}
          <div className="rounded-2xl border border-[#00c875]/30 bg-[#00c875]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#00c875]" />
              <span className="font-semibold text-[var(--os-text-1)]">
                Spike Verdict: <span className="text-[#00c875]">{broker.verdict.recommendation}</span> recommended for Kangqore OS v1
              </span>
              <span className="ml-auto text-xs text-[var(--os-text-2)]">Active: <strong style={{ color: BUS_COLOR }}>{BUS_LABEL}</strong></span>
            </div>
            <p className="text-sm text-[var(--os-text-2)] leading-relaxed">{broker.verdict.rationale}</p>
            <p className="text-xs text-[#579bfc] mt-2 font-medium">{broker.verdict.nextStep}</p>
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_80px] text-xs font-semibold text-[var(--os-text-2)] px-4 py-2.5 bg-[var(--os-surface-0)] border-b border-[var(--os-border)]">
              <span>Dimension</span>
              <span className="text-center">NATS</span>
              <span className="text-center">Redpanda</span>
              <span className="text-center">Winner</span>
            </div>
            {broker.comparison.map((row, i) => (
              <div key={i} className={cn(
                'grid grid-cols-[1.5fr_1fr_1fr_80px] px-4 py-3 text-sm border-b border-[var(--os-border)] last:border-0',
                i % 2 === 0 ? 'bg-[var(--os-card)]' : 'bg-[var(--os-surface-0)]'
              )}>
                <div>
                  <p className="font-medium text-[var(--os-text-1)]">{row.dimension}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5 leading-relaxed">{row.notes}</p>
                </div>
                <p className="text-xs text-[var(--os-text-2)] self-start text-center px-2 pt-0.5">{row.nats}</p>
                <p className="text-xs text-[var(--os-text-2)] self-start text-center px-2 pt-0.5">{row.redpanda}</p>
                <div className="flex justify-center pt-0.5">
                  <WinnerBadge winner={row.winner} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
