import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronRight, ChevronDown, ShieldAlert, Zap, Lock, Database, ArrowUpRight,
  AlertTriangle, Activity, Clock, User, Globe, Tag, Cpu, Hash, FileText,
} from 'lucide-react'
import { api } from '@lib/api'

// ─── Colours & labels per event type ─────────────────────────────────────────

const EVENT_CFG: Record<string, {
  label: string; color: string; bg: string; border: string; Icon: React.ElementType
  headline: (row: AuditRow) => string
  fields:   (row: AuditRow) => { label: string; value: string | number | undefined | null }[]
  explainer: (row: AuditRow) => string
}> = {
  ACTIVATION: {
    label: 'Activation', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)',
    Icon: Zap,
    headline: r => `KIMMP activated via ${r.trigger ?? 'unknown trigger'} on ${r.system ?? 'unknown system'}`,
    fields: r => [
      { label: 'System',     value: r.system },
      { label: 'Trigger',    value: r.trigger },
      { label: 'Actor',      value: r.actor },
      { label: 'Dispatch ID',value: r.dispatchId },
      { label: 'Agents run', value: r.agentsRun?.join(', ') || '—' },
      { label: 'Confidence', value: r.confidence != null ? `${r.confidence}%` : null },
      { label: 'Duration',   value: r.durationMs != null ? `${r.durationMs}ms` : null },
      { label: 'Priority',   value: r.priority },
    ],
    explainer: r =>
      `KIMMP was activated by ${r.actor === 'AEGIS_SCHEDULER' ? 'the AEGIS background scheduler' : `actor "${r.actor}"`} ` +
      `via the "${r.trigger ?? 'unknown'}" trigger on the ${r.system ?? 'KIMMP'} system. ` +
      (r.agentsRun?.length ? `${r.agentsRun.length} agent(s) ran in this activation cycle. ` : '') +
      (r.confidence != null ? `WAANDA confidence: ${r.confidence}%. ` : '') +
      (r.durationMs != null ? `Completed in ${r.durationMs}ms.` : ''),
  },

  AUTONOMOUS: {
    label: 'Autonomous', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.25)',
    Icon: Activity,
    headline: r => `Autonomous action — ${r.trigger ?? 'untracked trigger'} · ${r.system ?? '?'}`,
    fields: r => [
      { label: 'System',     value: r.system },
      { label: 'Trigger',    value: r.trigger },
      { label: 'Actor',      value: r.actor },
      { label: 'Agents run', value: r.agentsRun?.join(', ') || '—' },
      { label: 'Dispatch ID',value: r.dispatchId },
      { label: 'Priority',   value: r.priority },
    ],
    explainer: r =>
      `WAANDA executed an autonomous action without requiring human approval. ` +
      `System: ${r.system ?? 'KIMMP'}. Trigger: "${r.trigger ?? 'unknown'}". ` +
      `Actor: ${r.actor}. This is permitted under the current autonomy budget. ` +
      `All autonomous actions are recorded here so the ADMIN can audit and override.`,
  },

  ACCESS_DENIED: {
    label: 'Access Denied', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',
    Icon: Lock,
    headline: r => `Blocked: ${r.method ?? 'REQUEST'} ${r.endpoint ?? '?'} from ${(r.metadata as any)?.ip ?? 'unknown IP'}`,
    fields: r => [
      { label: 'Endpoint',   value: r.endpoint },
      { label: 'Method',     value: r.method },
      { label: 'Actor',      value: r.actor },
      { label: 'User role',  value: r.userRole },
      { label: 'User ID',    value: r.userId },
      { label: 'IP address', value: (r.metadata as any)?.ip },
      { label: 'Reason',     value: (r.metadata as any)?.reason },
    ],
    explainer: r => {
      const meta = (r.metadata ?? {}) as Record<string, string>
      const reason = meta.reason ?? (r.actor === 'anonymous' ? 'no-token' : 'non-admin')
      const explanations: Record<string, string> = {
        'no-token':   'No bearer token was present in the request. The caller hit a protected AEGIS or KIMMP endpoint without logging in first. This is normal for background refetch calls made before the auth token is set in the browser.',
        'invalid-token': 'A bearer token was sent but could not be verified — it may be expired, malformed, or revoked. The session likely needs to be refreshed.',
        'non-admin':  `A valid token was sent but the user's role (${r.userRole ?? 'CLIENT'}) is not ADMIN. Only ADMIN users may access KIMMP and AEGIS routes.`,
      }
      return (
        `A request to ${r.method ?? ''} ${r.endpoint ?? 'a protected endpoint'} was blocked by the AEGIS Access Shield. ` +
        (explanations[reason] ?? `Reason: ${reason}.`) +
        (r.userId ? ` User ID: ${r.userId}.` : '') +
        ((r.metadata as any)?.ip ? ` Originating IP: ${(r.metadata as any).ip}.` : '')
      )
    },
  },

  KNOWLEDGE_ASSET: {
    label: 'Asset Registered', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)',
    Icon: Database,
    headline: r => `Knowledge asset registered: ${r.assetType ?? 'unknown type'} · ${r.assetId ?? '?'}`,
    fields: r => [
      { label: 'Asset ID',   value: r.assetId },
      { label: 'Asset type', value: r.assetType },
      { label: 'Source',     value: r.assetSource },
      { label: 'System',     value: r.system },
      { label: 'Actor',      value: r.actor },
    ],
    explainer: r =>
      `A new knowledge asset of type "${r.assetType ?? 'unknown'}" was registered in the AEGIS Intelligence Registry. ` +
      `Asset ID: ${r.assetId ?? '—'}. ` +
      `Source: ${r.assetSource ?? 'unspecified'}. ` +
      `Registered by: ${r.actor}. ` +
      `This asset is now tracked for provenance, egress control, and sovereignty auditing.`,
  },

  EGRESS: {
    label: 'Egress', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)',
    Icon: ArrowUpRight,
    headline: r => `Data egress: ${r.method ?? ''} ${r.endpoint ?? '?'} · ${(r.metadata as any)?.payloadSize ?? 0} bytes`,
    fields: r => [
      { label: 'Endpoint',      value: r.endpoint },
      { label: 'Method',        value: r.method },
      { label: 'Actor',         value: r.actor },
      { label: 'User role',     value: r.userRole },
      { label: 'Payload size',  value: (r.metadata as any)?.payloadSize != null ? `${(r.metadata as any).payloadSize} bytes` : null },
      { label: 'Response code', value: (r.metadata as any)?.responseStatus },
      { label: 'IP',            value: (r.metadata as any)?.ip },
    ],
    explainer: r =>
      `Intelligence data left the KIMMP system boundary. ` +
      `Endpoint: ${r.method ?? ''} ${r.endpoint ?? '?'}. ` +
      `Actor: ${r.actor} (role: ${r.userRole ?? 'unknown'}). ` +
      (((r.metadata as any)?.payloadSize) ? `Payload size: ${(r.metadata as any).payloadSize} bytes. ` : '') +
      `Response status: ${(r.metadata as any)?.responseStatus ?? '?'}. ` +
      `All egress events are logged to enable retroactive auditing of intelligence data flows.`,
  },

  POLICY_VIOLATION: {
    label: 'Policy Violation', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)',
    Icon: ShieldAlert,
    headline: r => `Policy triggered: ${r.trigger ?? 'unknown policy'} · ${r.priority ?? '?'} severity`,
    fields: r => [
      { label: 'Policy name',value: r.trigger },
      { label: 'Severity',   value: r.priority },
      { label: 'System',     value: r.system },
      { label: 'Actor',      value: r.actor },
      { label: 'Detail',     value: (r.metadata as any)?.detail },
    ],
    explainer: r =>
      `An AEGIS Policy Engine rule was triggered. ` +
      `Policy: "${r.trigger ?? 'unknown'}". ` +
      `Severity: ${r.priority ?? 'UNKNOWN'}. ` +
      ((r.metadata as any)?.detail ? `Detail: ${(r.metadata as any).detail}. ` : '') +
      `Actor: ${r.actor}. System: ${r.system ?? 'KIMMP'}. ` +
      `Policy violations are raised when WAANDA or an actor attempts an action that breaks a governance rule.`,
  },
}

const FALLBACK_CFG = {
  label: 'Event', color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)',
  Icon: AlertTriangle,
  headline: (r: AuditRow) => `${r.eventType} · ${r.system ?? '?'}`,
  fields: (r: AuditRow) => [
    { label: 'System', value: r.system },
    { label: 'Actor',  value: r.actor },
    { label: 'Trigger',value: r.trigger },
  ],
  explainer: (r: AuditRow) => `Unclassified AEGIS event of type "${r.eventType}". Check the raw metadata for details.`,
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuditRow {
  id:          string
  eventType:   string
  system:      string | null
  trigger:     string | null
  actor:       string
  autonomous:  boolean
  endpoint:    string | null
  method:      string | null
  userRole:    string | null
  userId:      string | null
  dispatchId:  string | null
  agentsRun:   string[]
  priority:    string | null
  confidence:  number | null
  durationMs:  number | null
  assetId:     string | null
  assetType:   string | null
  assetSource: string | null
  metadata:    unknown
  createdAt:   string
}

type FilterType = '' | 'ACTIVATION' | 'AUTONOMOUS' | 'ACCESS_DENIED' | 'KNOWLEDGE_ASSET' | 'EGRESS' | 'POLICY_VIOLATION'

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ row }: { row: AuditRow }) {
  const cfg   = EVENT_CFG[row.eventType] ?? FALLBACK_CFG
  const fields = cfg.fields(row).filter(f => f.value != null && f.value !== '' && f.value !== '—')
  const meta   = row.metadata as Record<string, unknown> | null

  // Extra metadata keys not already shown in structured fields
  const metaKeys = meta ? Object.keys(meta).filter(k => !['ip','reason','detail','payloadSize','responseStatus'].includes(k)) : []

  return (
    <div style={{ background: cfg.bg, borderTop: `1px solid ${cfg.border}`, padding: '14px 16px' }}>

      {/* Explainer */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, marginBottom: 12,
        background: 'var(--os-surface-0)', border: `1px solid ${cfg.border}`,
      }}>
        <FileText style={{ width: 13, height: 13, color: cfg.color, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: 'var(--os-text-1)', lineHeight: 1.55, margin: 0 }}>
          {cfg.explainer(row)}
        </p>
      </div>

      {/* Structured fields */}
      {fields.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px 16px', marginBottom: metaKeys.length ? 12 : 0 }}>
          {fields.map(f => (
            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--os-text-2)' }}>{f.label}</span>
              <span style={{ fontSize: 11, color: 'var(--os-text-1)', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.4 }}>{String(f.value)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Agents run list */}
      {row.agentsRun?.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--os-text-2)', marginBottom: 5 }}>
            Agents activated ({row.agentsRun.length})
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {row.agentsRun.map((a, i) => (
              <span key={i} style={{
                fontSize: 10, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 4,
                background: 'rgba(124,58,237,0.1)', color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.2)',
              }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Extra metadata */}
      {metaKeys.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--os-text-2)', marginBottom: 5 }}>
            Additional metadata
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {metaKeys.map(k => (
              <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: cfg.color, flexShrink: 0, minWidth: 120 }}>{k}</span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                  {JSON.stringify(meta![k])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Correlation / timestamps */}
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 10, color: 'var(--os-text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Hash style={{ width: 10, height: 10 }} />{row.id}
        </span>
        <span style={{ fontSize: 10, color: 'var(--os-text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock style={{ width: 10, height: 10 }} />{new Date(row.createdAt).toISOString()}
        </span>
        {row.autonomous && (
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed' }}>⚡ AUTONOMOUS</span>
        )}
      </div>
    </div>
  )
}

// ─── Single row ─────────────────────────────────────────────────────────────

function AuditRow({ row }: { row: AuditRow }) {
  const [open, setOpen] = useState(false)
  const cfg = EVENT_CFG[row.eventType] ?? FALLBACK_CFG
  const { Icon } = cfg

  const PRIORITY_COLOR: Record<string, string> = {
    CRITICAL: '#ef4444', HIGH: '#f59e0b', NORMAL: 'var(--os-text-2)',
  }

  return (
    <div style={{
      border: `1px solid ${open ? cfg.border : 'var(--os-border)'}`,
      borderRadius: 10, overflow: 'hidden',
      background: open ? cfg.bg : 'var(--os-card)',
      transition: 'border-color 0.15s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'grid',
          gridTemplateColumns: '28px 130px 110px 1fr 90px 60px 50px',
          alignItems: 'center', gap: 10,
          padding: '9px 12px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Chevron */}
        <span style={{ color: 'var(--os-text-2)', display: 'flex', alignItems: 'center' }}>
          {open
            ? <ChevronDown style={{ width: 13, height: 13 }} />
            : <ChevronRight style={{ width: 13, height: 13 }} />}
        </span>

        {/* Timestamp */}
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', whiteSpace: 'nowrap' }}>
          {new Date(row.createdAt).toLocaleTimeString()} · {new Date(row.createdAt).toLocaleDateString()}
        </span>

        {/* Event badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
        }}>
          <Icon style={{ width: 10, height: 10, flexShrink: 0 }} />
          {cfg.label}
        </span>

        {/* Headline */}
        <span style={{ fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
          {cfg.headline(row)}
        </span>

        {/* Actor */}
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <User style={{ width: 9, height: 9, display: 'inline', marginRight: 4 }} />
          {row.actor}
        </span>

        {/* Priority */}
        <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[row.priority ?? ''] ?? 'var(--os-text-2)' }}>
          {row.priority ?? '—'}
        </span>

        {/* Conf */}
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--os-text-2)', textAlign: 'right' }}>
          {row.confidence != null ? `${row.confidence}%` : '—'}
        </span>
      </button>

      {open && <DetailPanel row={row} />}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: FilterType; label: string; color: string }[] = [
  { value: '',                label: 'All events',       color: 'var(--os-text-2)' },
  { value: 'ACTIVATION',     label: 'Activations',      color: '#3b82f6' },
  { value: 'AUTONOMOUS',     label: 'Autonomous',       color: '#7c3aed' },
  { value: 'ACCESS_DENIED',  label: 'Access Denied',    color: '#ef4444' },
  { value: 'KNOWLEDGE_ASSET',label: 'Asset Registered', color: '#10b981' },
  { value: 'EGRESS',         label: 'Egress',           color: '#f59e0b' },
  { value: 'POLICY_VIOLATION',label:'Policy Violation', color: '#ec4899' },
]

export function AegisAuditPage() {
  const [eventType, setEventType] = useState<FilterType>('')
  const [system,    setSystem]    = useState('')
  const [page,      setPage]      = useState(0)
  const PAGE_SIZE = 40

  const { data, isLoading } = useQuery({
    queryKey: ['aegis-audit', eventType, system, page],
    queryFn: () => {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) })
      if (eventType) params.set('eventType', eventType)
      if (system)    params.set('system', system)
      return api.get(`/admin/aegis/audit?${params}`).then(r => r.data)
    },
    staleTime: 15_000,
  })

  const rows: AuditRow[] = data?.rows ?? []
  const total: number    = data?.total ?? 0

  // Per-type counts from the current page (approximate — full counts need backend groupBy)
  const typeCounts = rows.reduce((acc, r) => {
    acc[r.eventType] = (acc[r.eventType] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setEventType(opt.value); setPage(0) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
              fontSize: 11, fontWeight: 600,
              background: eventType === opt.value ? `${opt.color}15` : 'var(--os-surface-0)',
              color:      eventType === opt.value ? opt.color : 'var(--os-text-2)',
              border:     `1px solid ${eventType === opt.value ? opt.color + '40' : 'var(--os-border)'}`,
              transition: 'all 0.12s',
            }}
          >
            {opt.label}
            {typeCounts[opt.value] != null && (
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '0 4px', borderRadius: 4,
                background: opt.color + '20', color: opt.color,
              }}>{typeCounts[opt.value]}</span>
            )}
          </button>
        ))}

        <select
          value={system}
          onChange={e => { setSystem(e.target.value); setPage(0) }}
          style={{
            background: 'var(--os-surface-0)', border: '1px solid var(--os-border)',
            borderRadius: 8, padding: '4px 10px', fontSize: 11, color: 'var(--os-text-1)',
            outline: 'none', marginLeft: 4,
          }}
        >
          <option value="">All systems</option>
          {['KIMMP','EQORE','LEAD_INTEL','ALIS','VIS','SENTINEL'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span style={{ fontSize: 11, color: 'var(--os-text-2)', marginLeft: 'auto' }}>
          {total.toLocaleString()} records
        </span>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 12px',
        background: 'var(--os-surface-0)', borderRadius: 8, border: '1px solid var(--os-border)',
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--os-text-2)', alignSelf: 'center', marginRight: 4 }}>What each event means:</span>
        {Object.entries(EVENT_CFG).map(([key, c]) => (
          <span key={key} style={{ fontSize: 10, color: c.color, display: 'flex', alignItems: 'center', gap: 4 }}>
            <c.Icon style={{ width: 10, height: 10 }} />
            <strong style={{ marginRight: 2 }}>{c.label}</strong>
            <span style={{ color: 'var(--os-text-2)' }}>— {
              key === 'ACTIVATION'      ? 'KIMMP was triggered' :
              key === 'AUTONOMOUS'      ? 'WAANDA acted without approval' :
              key === 'ACCESS_DENIED'   ? 'request blocked (no/wrong auth)' :
              key === 'KNOWLEDGE_ASSET' ? 'new intel asset stored' :
              key === 'EGRESS'          ? 'data left the system' :
              key === 'POLICY_VIOLATION'? 'governance rule fired' : '?'
            }</span>
          </span>
        ))}
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '28px 130px 110px 1fr 90px 60px 50px',
        gap: 10, padding: '0 12px',
      }}>
        {['', 'Timestamp', 'Event', 'What happened', 'Actor', 'Priority', 'Conf'].map((h, i) => (
          <span key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--os-text-2)' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 44, background: 'var(--os-surface-0)', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--os-text-2)', fontSize: 13 }}>
          No audit records match this filter. AEGIS is watching.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {rows.map(row => <AuditRow key={row.id} row={row} />)}
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ fontSize: 12, color: 'var(--os-text-2)', background: 'none', border: 'none', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}
          >← Prev</button>
          <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>
            Page {page + 1} of {Math.ceil(total / PAGE_SIZE)} · {total.toLocaleString()} total
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * PAGE_SIZE >= total}
            style={{ fontSize: 12, color: 'var(--os-text-2)', background: 'none', border: 'none', cursor: (page + 1) * PAGE_SIZE >= total ? 'not-allowed' : 'pointer', opacity: (page + 1) * PAGE_SIZE >= total ? 0.4 : 1 }}
          >Next →</button>
        </div>
      )}
    </div>
  )
}
