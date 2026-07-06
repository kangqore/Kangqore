import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  Play, Pause, RefreshCw, Filter, Loader2,
  Zap, Shield, CheckCircle2, AlertTriangle, Server,
  GitBranch, Brain, Activity,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type FlightSource = 'KIMMP' | 'AEGIS' | 'QEF' | 'RGS' | 'WORKFLOW' | 'INCIDENT'

interface FlightEvent {
  id:        string
  timestamp: string
  type:      string
  source:    FlightSource
  title:     string
  detail?:   string
  actor?:    string
  severity?: string
  metadata?: Record<string, unknown>
}

interface FlightResponse {
  events: FlightEvent[]
  total:  number
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'
const GREEN   = '#22c55e'
const RED     = '#ef4444'
const AMBER   = '#f59e0b'
const BLUE    = '#3b82f6'
const SLATE   = '#64748b'
const PURPLE  = '#a855f7'
const CYAN    = '#06b6d4'
const ORANGE  = '#f97316'

// ─── Source metadata ──────────────────────────────────────────────────────────

const SOURCE_META: Record<FlightSource, { label: string; color: string; icon: any; description: string }> = {
  KIMMP:    { label: 'WAANDA',    color: PURPLE, icon: Brain,        description: 'Goals · Decisions · Memory' },
  AEGIS:    { label: 'AEGIS',     color: BLUE,   icon: Shield,       description: 'Governance · Audit · Access' },
  QEF:      { label: 'QEF',       color: GREEN,  icon: CheckCircle2, description: 'Quality · Certificates' },
  RGS:      { label: 'RGS',       color: AMBER,  icon: Zap,          description: 'Release · Deployment · Rollback' },
  WORKFLOW: { label: 'Workflows', color: CYAN,   icon: Activity,     description: 'Automated workflows' },
  INCIDENT: { label: 'Incidents', color: RED,    icon: AlertTriangle,description: 'Incidents · SLA' },
}

// ─── Event type → human label ─────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  GOAL_CREATED:                  'Goal Created',
  DECISION_GENERATED:            'Decision Generated',
  MEMORY_RECORDED:               'Memory Recorded',
  ACTIVATION:                    'KIMMP Activated',
  AUTONOMOUS:                    'Autonomous Action',
  ACCESS_DENIED:                 'Access Denied',
  KNOWLEDGE_ASSET:               'Knowledge Asset',
  POLICY_VIOLATION:              'Policy Violation',
  EGRESS:                        'Data Egress',
  CERT_ISSUED:                   'Certificate Issued',
  WORKFLOW_EXECUTED:             'Workflow Executed',
  INCIDENT_DECLARED:             'Incident Declared',
  INCIDENT_RESOLVED:             'Incident Resolved',
  DEPLOYMENT_AUTHORIZED:         'Deployment Authorized',
  DEPLOYMENT_BLOCKED:            'Deployment Blocked',
  DEPLOYMENT_EMERGENCY_OVERRIDE: 'Emergency Override',
  DEPLOYMENT_ROLLBACK_INITIATED: 'Rollback Initiated',
  DEPLOYMENT_COMPLETED:          'Deployment Completed',
  DEPLOYMENT_EXECUTED:           'Deployment Executed',
}

function typeLabel(type: string): string {
  return TYPE_LABEL[type] ?? type.replace(/_/g, ' ')
}

function severityColor(s?: string): string {
  if (!s) return SLATE
  if (s.includes('CRITICAL') || s === 'HIGH') return RED
  if (s === 'P2-HIGH' || s === 'P3-MEDIUM') return AMBER
  return SLATE
}

// ─── Timeline dot ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: FlightSource }) {
  const m = SOURCE_META[source] ?? { label: source, color: SLATE, icon: Activity }
  const Icon = m.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 9, fontWeight: 700, color: m.color,
      background: `${m.color}15`, borderRadius: 4, padding: '2px 6px',
      letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
    }}>
      <Icon style={{ width: 9, height: 9 }} />
      {m.label}
    </span>
  )
}

// ─── Flight event row ─────────────────────────────────────────────────────────

function EventRow({ event, highlighted, isNew }: { event: FlightEvent; highlighted: boolean; isNew: boolean }) {
  const sm     = SOURCE_META[event.source] ?? { color: SLATE, icon: Activity }
  const ts     = new Date(event.timestamp)
  const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = ts.toLocaleDateString([], { month: 'short', day: 'numeric' })

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 0,
        borderBottom: `1px solid ${BORDER}`,
        background: highlighted ? `${sm.color}10` : isNew ? `${sm.color}06` : 'transparent',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Time column */}
      <div style={{
        width: 90, flexShrink: 0, padding: '12px 0 12px 20px',
        textAlign: 'right', paddingRight: 12,
        borderRight: `2px solid ${sm.color}30`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: TEXT1, fontFamily: 'monospace' }}>{timeStr}</div>
        <div style={{ fontSize: 9, color: TEXT2, marginTop: 1 }}>{dateStr}</div>
      </div>

      {/* Dot connector */}
      <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 14, position: 'relative' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: sm.color,
          boxShadow: highlighted ? `0 0 0 3px ${sm.color}30` : 'none',
          transition: 'box-shadow 0.3s ease',
          flexShrink: 0,
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '11px 16px 11px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <SourceBadge source={event.source} />
          <span style={{
            fontSize: 9, color: SLATE,
            background: `${SLATE}12`, borderRadius: 3, padding: '1px 5px',
          }}>
            {typeLabel(event.type)}
          </span>
          {event.severity && (
            <span style={{ fontSize: 9, color: severityColor(event.severity), fontWeight: 700 }}>
              {event.severity}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{event.title}</div>
        {event.detail && (
          <div style={{ fontSize: 11, color: TEXT2, marginTop: 2, fontFamily: event.source === 'QEF' || event.source === 'RGS' ? 'monospace' : 'inherit' }}>
            {event.detail}
          </div>
        )}
        {event.actor && (
          <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>by {event.actor}</div>
        )}
      </div>
    </div>
  )
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 6,
        border: `1px solid ${active ? color : BORDER}`,
        background: active ? `${color}15` : CARD,
        color: active ? color : TEXT2,
        fontSize: 10, fontWeight: active ? 700 : 400,
        cursor: 'pointer', letterSpacing: '0.04em',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function FlightRecorderPage() {
  const [activeSources, setActiveSources] = useState<Set<FlightSource>>(new Set())
  const [isReplaying,   setIsReplaying]   = useState(false)
  const [replayIdx,     setReplayIdx]     = useState(-1)
  const [newIds,        setNewIds]        = useState<Set<string>>(new Set())
  const replayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const listRef   = useRef<HTMLDivElement>(null)

  const sourcesParam = activeSources.size > 0 ? [...activeSources].join(',') : undefined

  const { data, isLoading, dataUpdatedAt } = useQuery<FlightResponse>({
    queryKey:       ['flight-recorder', sourcesParam],
    queryFn:        () => {
      const params = new URLSearchParams({ limit: '100' })
      if (sourcesParam) params.set('sources', sourcesParam)
      return api.get(`/admin/flight-recorder/events?${params}`).then(r => r.data)
    },
    refetchInterval: 15_000,
  })

  const events = data?.events ?? []

  // Track newly added events between refreshes
  const prevIdsRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!events.length) return
    const currentIds = new Set(events.map(e => e.id))
    const fresh = [...currentIds].filter(id => !prevIdsRef.current.has(id) && prevIdsRef.current.size > 0)
    if (fresh.length) setNewIds(new Set(fresh))
    prevIdsRef.current = currentIds
  }, [dataUpdatedAt])

  const toggleSource = (s: FlightSource) =>
    setActiveSources(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })

  const stopReplay = useCallback(() => {
    if (replayRef.current) clearInterval(replayRef.current)
    replayRef.current = null
    setIsReplaying(false)
    setReplayIdx(-1)
  }, [])

  const startReplay = useCallback(() => {
    if (!events.length) return
    stopReplay()
    const reversed = [...events].reverse()
    let idx = 0
    setReplayIdx(idx)
    setIsReplaying(true)

    replayRef.current = setInterval(() => {
      idx++
      if (idx >= reversed.length) {
        stopReplay()
        return
      }
      setReplayIdx(idx)
      // Scroll to highlighted event
      const el = document.getElementById(`fe-${reversed[idx]?.id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 700)
  }, [events, stopReplay])

  useEffect(() => () => { if (replayRef.current) clearInterval(replayRef.current) }, [])

  const reversedEvents = [...events].reverse()
  const replayingId = isReplaying && replayIdx >= 0 ? reversedEvents[replayIdx]?.id : null

  const allSources: FlightSource[] = ['KIMMP', 'AEGIS', 'QEF', 'RGS', 'WORKFLOW', 'INCIDENT']

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT1, margin: 0 }}>Platform Flight Recorder</h1>
          <p style={{ fontSize: 12, color: TEXT2, margin: '3px 0 0' }}>
            Every platform event — replayable · chronological · immutable
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isReplaying ? (
            <button
              onClick={stopReplay}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: AMBER, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <Pause style={{ width: 13, height: 13 }} /> Stop
            </button>
          ) : (
            <button
              onClick={startReplay}
              disabled={!events.length}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: PURPLE, color: '#fff', fontSize: 12, fontWeight: 700, cursor: events.length ? 'pointer' : 'not-allowed', opacity: events.length ? 1 : 0.5 }}
            >
              <Play style={{ width: 13, height: 13 }} /> Replay
            </button>
          )}
          <button
            onClick={() => {}}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, color: TEXT2, fontSize: 12, cursor: 'pointer' }}
          >
            <RefreshCw style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* Source filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <Filter style={{ width: 12, height: 12, color: TEXT2, flexShrink: 0 }} />
        {allSources.map(s => (
          <FilterChip
            key={s}
            label={SOURCE_META[s].label}
            color={SOURCE_META[s].color}
            active={activeSources.has(s)}
            onClick={() => toggleSource(s)}
          />
        ))}
        {activeSources.size > 0 && (
          <button
            onClick={() => setActiveSources(new Set())}
            style={{ fontSize: 10, color: TEXT2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats strip */}
      {data && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {allSources.map(s => {
            const count = events.filter(e => e.source === s).length
            const m = SOURCE_META[s]
            if (count === 0) return null
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: TEXT2 }}>{m.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{count}</span>
              </div>
            )
          })}
          <span style={{ fontSize: 11, color: SLATE, marginLeft: 'auto' }}>
            {events.length} of {data.total} events
          </span>
        </div>
      )}

      {/* Replay indicator */}
      {isReplaying && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, animation: 'pulse 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, color: PURPLE, fontWeight: 600 }}>
            Replaying — event {replayIdx + 1} of {reversedEvents.length}
          </span>
        </div>
      )}

      {/* Timeline */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: TEXT2, padding: '40px 0', justifyContent: 'center' }}>
          <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 13 }}>Loading platform events…</span>
        </div>
      ) : events.length === 0 ? (
        <div style={{ background: CARD, border: `1px dashed ${BORDER}`, borderRadius: 14, padding: '48px', textAlign: 'center' }}>
          <GitBranch style={{ width: 32, height: 32, color: SLATE, margin: '0 auto 12px' }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT1, marginBottom: 4 }}>No events recorded yet</div>
          <div style={{ fontSize: 12, color: TEXT2 }}>Platform events will appear here as WAANDA, AEGIS, QEF, and other systems operate.</div>
        </div>
      ) : (
        <div
          ref={listRef}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: `1px solid ${BORDER}`, background: SURFACE, padding: '8px 20px 8px 0' }}>
            <div style={{ width: 90, paddingLeft: 20, paddingRight: 12, textAlign: 'right', flexShrink: 0, fontSize: 9, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Time
            </div>
            <div style={{ width: 20, flexShrink: 0 }} />
            <div style={{ flex: 1, paddingLeft: 4, fontSize: 9, fontWeight: 600, color: TEXT2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Event
            </div>
          </div>

          {/* Events — newest at top by default; replay walks bottom-to-top */}
          {events.map(e => (
            <div key={e.id} id={`fe-${e.id}`}>
              <EventRow
                event={e}
                highlighted={isReplaying && e.id === replayingId}
                isNew={newIds.has(e.id)}
              />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
