import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, CheckCircle2, XCircle, Clock, Zap, Brain,
  BarChart3, RefreshCw, Search, Download, ScrollText, Activity,
  TrendingUp, ArrowRight, Radio, ChevronDown, Dna, Play, FileDown, CheckCheck,
} from 'lucide-react'
import { api } from '@lib/api'

// ─── WAANDA Events tab ────────────────────────────────────────────────────────

type WaandaEventType = 'signal' | 'agent' | 'alert' | 'kpi' | 'system'

interface WaandaEvent {
  id: string
  type: WaandaEventType
  title: string
  value?: string | null
  sub?: string | null
  color: string
  ts: number
  announced: boolean
  raw?: Record<string, any> | null
  createdAt: string
}

const EVT_ICON: Record<WaandaEventType, string> = {
  signal: '◈', agent: '⬡', alert: '▲', kpi: '⟳', system: '◉',
}

const EVT_COLOR: Record<WaandaEventType, { bg: string; border: string; text: string }> = {
  signal: { bg: 'rgba(37,100,234,0.08)',   border: 'rgba(37,100,234,0.2)',   text: '#60a5fa' },
  agent:  { bg: 'rgba(124,58,237,0.08)',   border: 'rgba(124,58,237,0.2)',   text: '#a78bfa' },
  alert:  { bg: 'rgba(226,68,92,0.08)',    border: 'rgba(226,68,92,0.2)',    text: '#f87171' },
  kpi:    { bg: 'rgba(0,200,117,0.07)',    border: 'rgba(0,200,117,0.18)',   text: '#34d399' },
  system: { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.18)', text: '#94a3b8' },
}

// ─── WAANDA Event Detail ──────────────────────────────────────────────────────

function EvtStatGrid({ stats }: { stats: Array<{ label: string; value: string | number; color?: string; mono?: boolean }> }) {
  return (
    <div className="grid gap-x-5 gap-y-2 pb-3 mb-3"
      style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0,1fr))`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {stats.map(s => (
        <div key={s.label}>
          <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#334155' }}>{s.label}</p>
          <p className={`text-[11px] font-bold leading-tight${s.mono ? ' font-mono' : ''}`} style={{ color: s.color ?? '#94a3b8' }}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

function EvtBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: '#334155' }}>{title}</p>
      {children}
    </div>
  )
}

function EvtChip({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded mr-1 mb-1"
      style={{ background: `${color}14`, border: `1px solid ${color}28`, color }}>
      {label}
    </span>
  )
}

function RawPayload({ r }: { r: Record<string, any> }) {
  return (
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: '#1e293b' }}>Complete Payload</p>
      <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
        {Object.entries(r).map(([k, v], i) => (
          <div key={k} className="flex gap-0 text-[10px]"
            style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.15)', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.03)' : undefined }}>
            <span className="font-bold text-[9px] uppercase tracking-wide flex-shrink-0 px-2.5 py-1.5 select-none"
              style={{ color: '#334155', width: 130, borderRight: '1px solid rgba(255,255,255,0.04)' }}>{k}</span>
            <span className="text-slate-500 font-mono break-all px-2.5 py-1.5 leading-relaxed">
              {v === null ? <span style={{ color: '#1e293b' }}>null</span>
                : typeof v === 'boolean' ? <span style={{ color: v ? '#34d399' : '#f87171' }}>{String(v)}</span>
                : typeof v === 'number' ? <span style={{ color: '#60a5fa' }}>{String(v)}</span>
                : Array.isArray(v) ? <span style={{ color: '#a78bfa' }}>[{(v as any[]).join(', ')}]</span>
                : typeof v === 'object' ? <span style={{ color: '#fdab3d' }}>{JSON.stringify(v)}</span>
                : String(v)
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WaandaEventDetail({ ev }: { ev: WaandaEvent }) {
  const r: Record<string, any> = (ev.raw as Record<string, any>) ?? {}
  const panelStyle = {
    padding: '10px 16px 16px 16px',
    background: 'rgba(0,0,0,0.22)',
    borderBottom: '1px solid rgba(10,15,30,0.6)',
  }

  if (ev.type === 'signal') {
    const conf = Number(r.confidence ?? 0)
    const confCol = conf >= 80 ? '#34d399' : conf >= 50 ? '#fbbf24' : '#f87171'
    const trendCol = r.trend === 'declining' ? '#f87171' : r.trend === 'improving' ? '#34d399' : '#94a3b8'
    const urgCol = r.urgency === 'high' ? '#f87171' : r.urgency === 'medium' ? '#fbbf24' : '#34d399'
    const deltaCol = String(r.delta ?? '').startsWith('−') || String(r.delta ?? '').startsWith('-') ? '#f87171' : '#34d399'
    return (
      <div style={panelStyle} className="space-y-3">
        <EvtStatGrid stats={[
          { label: 'Confidence',   value: conf ? `${conf}%` : ev.value ?? '—', color: confCol },
          { label: 'Trend',        value: r.trend ? r.trend.charAt(0).toUpperCase() + r.trend.slice(1) : '—', color: trendCol },
          { label: 'Urgency',      value: r.urgency ? r.urgency.toUpperCase() : '—', color: urgCol },
          { label: 'Corr Strength', value: r.correlationStrength ? `${r.correlationStrength}%` : '—' },
        ]} />
        <div className="grid grid-cols-2 gap-4">
          <EvtBlock title="Module">
            <p className="text-[11px] text-slate-300 font-semibold">{r.module ?? '—'}</p>
          </EvtBlock>
          <EvtBlock title="Entity">
            <p className="text-[11px] text-slate-400">{r.entity ?? ev.sub ?? '—'}</p>
          </EvtBlock>
        </div>
        <EvtBlock title="Baseline → Current · Delta">
          <p className="text-[11px] font-mono mt-0.5">
            <span className="text-slate-600">{r.baseline ?? '—'}</span>
            <span className="text-slate-700 mx-2">→</span>
            <span className="text-slate-400">{r.current ?? '—'}</span>
            {r.delta && <span className="ml-3 font-bold" style={{ color: deltaCol }}>{r.delta}</span>}
          </p>
        </EvtBlock>
        {r.trigger && (
          <EvtBlock title="Trigger">
            <p className="text-[11px] text-slate-400 leading-relaxed">{r.trigger}</p>
          </EvtBlock>
        )}
        {Array.isArray(r.affectedEntities) && r.affectedEntities.length > 0 && (
          <EvtBlock title={`Affected Entities (${r.affectedEntities.length})`}>
            <div className="flex flex-wrap mt-0.5">
              {r.affectedEntities.map((e: string) => <EvtChip key={e} label={e} color={ev.color} />)}
            </div>
          </EvtBlock>
        )}
        {r.recommendation && (
          <EvtBlock title="KIMMP Recommendation">
            <p className="text-[11px] text-slate-300 leading-relaxed px-2.5 py-2 rounded"
              style={{ background: `${ev.color}09`, border: `1px solid ${ev.color}18` }}>
              {r.recommendation}
            </p>
          </EvtBlock>
        )}
        {r.kimmpCorrelation && (
          <EvtBlock title="KIMMP Correlation">
            <p className="text-[11px]">
              <span className="text-slate-500 font-semibold font-mono">{r.kimmpCorrelation}</span>
              {r.correlationStrength && <span className="text-slate-700 ml-2">· {r.correlationStrength}% confidence</span>}
            </p>
          </EvtBlock>
        )}
        {Object.keys(r).length > 0 && <RawPayload r={r} />}
      </div>
    )
  }

  if (ev.type === 'alert') {
    const sevCol = r.severity === 'P1' ? '#f87171' : r.severity === 'P2' ? '#fbbf24' : '#94a3b8'
    return (
      <div style={panelStyle} className="space-y-3">
        <EvtStatGrid stats={[
          { label: 'Severity',   value: r.severity  ?? '—', color: sevCol },
          { label: 'SLA Target', value: r.slaTarget ?? '—' },
          { label: 'Overdue By', value: r.overdueBy ?? (r.breachedAt ? 'Pending' : 'Not yet'), color: r.overdueBy ? '#f87171' : '#fbbf24' },
          { label: 'Owner',      value: r.owner     ?? '—' },
        ]} />
        <div className="grid grid-cols-2 gap-4">
          <EvtBlock title="Client">
            <p className="text-[11px] text-slate-300 font-semibold">{r.client ?? '—'}</p>
          </EvtBlock>
          <EvtBlock title="Contract / Reference">
            <p className="text-[11px] text-slate-400 font-mono">{r.contract ?? '—'}</p>
          </EvtBlock>
        </div>
        {r.breachedAt && (
          <EvtBlock title="Breach Timestamp">
            <p className="text-[11px] text-slate-400 font-mono">
              {new Date(r.breachedAt).toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} UTC
            </p>
          </EvtBlock>
        )}
        {(r.escalatedTo || r.relatedIssue || r.kimmpActive != null) && (
          <EvtBlock title="Escalation · Related Issue · KIMMP">
            <div className="flex flex-wrap mt-1">
              {r.relatedIssue && <EvtChip label={`Issue: ${r.relatedIssue}`} color="#f87171" />}
              {r.escalatedTo  && <EvtChip label={`Escalated → ${r.escalatedTo}`} color="#fbbf24" />}
              {r.kimmpActive  && <EvtChip label="⬡ KIMMP Active" color="#a78bfa" />}
              {r.kimmpActive === false && <EvtChip label="KIMMP Not Active" color="#334155" />}
            </div>
          </EvtBlock>
        )}
        {Array.isArray(r.resolutionSteps) && r.resolutionSteps.length > 0 && (
          <EvtBlock title={`Resolution Steps (${r.resolutionSteps.length})`}>
            <ol className="space-y-1.5 mt-1">
              {r.resolutionSteps.map((step: string, i: number) => (
                <li key={i} className="flex gap-2.5 text-[11px] text-slate-400 leading-relaxed">
                  <span className="font-bold flex-shrink-0 w-4 text-right" style={{ color: sevCol }}>{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </EvtBlock>
        )}
        {Object.keys(r).length > 0 && <RawPayload r={r} />}
      </div>
    )
  }

  if (ev.type === 'agent') {
    const resCol = r.result === 'success' ? '#34d399' : r.result === 'failed' ? '#f87171' : '#fbbf24'
    const fmtTime = (t: string) => t ? new Date(t).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '—'
    return (
      <div style={panelStyle} className="space-y-3">
        <EvtStatGrid stats={[
          { label: 'Agent',    value: r.agent    ?? ev.sub?.split('·')[0]?.trim() ?? '—', color: '#a78bfa' },
          { label: 'Engine',   value: r.engine   ?? '—' },
          { label: 'Duration', value: r.duration ?? '—', mono: true },
          { label: 'Result',   value: r.result ? r.result.toUpperCase() : '—', color: resCol },
        ]} />
        <div className="grid grid-cols-2 gap-4">
          <EvtBlock title="Started At">
            <p className="text-[11px] text-slate-400 font-mono">{fmtTime(r.startedAt)}</p>
          </EvtBlock>
          <EvtBlock title="Completed At">
            <p className="text-[11px] text-slate-400 font-mono">{fmtTime(r.completedAt)}</p>
          </EvtBlock>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <EvtBlock title="Trigger">
            <p className="text-[11px] text-slate-400 capitalize">{(r.trigger ?? '—').replace(/_/g, ' ')}</p>
          </EvtBlock>
          <EvtBlock title="Next Scheduled Run">
            <p className="text-[11px] text-slate-400 font-mono">{r.nextScheduledRun ?? '—'}</p>
          </EvtBlock>
        </div>
        <EvtBlock title="Actions Performed · Approval · Logs">
          <div className="flex flex-wrap mt-1">
            {r.actionsPerformed != null && <EvtChip label={`${r.actionsPerformed} actions performed`} color="#a78bfa" />}
            <EvtChip label={r.approvalRequired ? 'Approval Required' : 'No Approval Needed'} color={r.approvalRequired ? '#fbbf24' : '#34d399'} />
            <EvtChip label={r.logsAvailable ? 'Logs Available' : 'No Logs'} color={r.logsAvailable ? '#64748b' : '#1e293b'} />
          </div>
        </EvtBlock>
        {Array.isArray(r.entitiesAffected) && r.entitiesAffected.length > 0 && (
          <EvtBlock title={`Entities Affected (${r.entitiesAffected.length})`}>
            <div className="flex flex-wrap mt-0.5">
              {r.entitiesAffected.map((e: string) => <EvtChip key={e} label={e} color="#a78bfa" />)}
            </div>
          </EvtBlock>
        )}
        {r.findings && (
          <EvtBlock title="Findings">
            <p className="text-[11px] text-slate-300 leading-relaxed px-2.5 py-2 rounded mt-0.5"
              style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.14)' }}>
              {r.findings}
            </p>
          </EvtBlock>
        )}
        {Object.keys(r).length > 0 && <RawPayload r={r} />}
      </div>
    )
  }

  if (ev.type === 'kpi') {
    const varCol = typeof r.variance === 'string' && r.variance.startsWith('+') ? '#34d399' : typeof r.variance === 'string' && (r.variance.startsWith('-') || r.variance.startsWith('−')) ? '#f87171' : '#94a3b8'
    const trendCol = r.trend === 'improving' ? '#34d399' : r.trend === 'declining' ? '#f87171' : '#94a3b8'
    const u = r.unit ?? ''
    return (
      <div style={panelStyle} className="space-y-3">
        {r.metric && (
          <EvtBlock title="Metric">
            <p className="text-[12px] text-slate-200 font-semibold">{r.metric}</p>
          </EvtBlock>
        )}
        <EvtStatGrid stats={[
          { label: 'Current',  value: `${r.current  ?? ev.value ?? '—'}${u}`, color: '#34d399' },
          { label: 'Previous', value: `${r.previous ?? '—'}${u}` },
          { label: 'Target',   value: `${r.target   ?? '—'}${u}`, color: '#60a5fa' },
          { label: 'Variance', value: r.variance ?? '—', color: varCol },
        ]} />
        <div className="grid grid-cols-3 gap-4">
          <EvtBlock title="Period">
            <p className="text-[11px] text-slate-400">{r.period ?? '—'}</p>
          </EvtBlock>
          <EvtBlock title="Trend">
            <p className="text-[11px] font-bold capitalize" style={{ color: trendCol }}>
              {r.trend === 'improving' ? '▲ ' : r.trend === 'declining' ? '▼ ' : '— '}{r.trend ?? '—'}
            </p>
          </EvtBlock>
          <EvtBlock title="Sample Size">
            <p className="text-[11px] text-slate-400">{r.sampleSize ? `${r.sampleSize.toLocaleString()} records` : '—'}</p>
          </EvtBlock>
        </div>
        {r.dataSource && (
          <EvtBlock title="Data Source">
            <p className="text-[11px] text-slate-500">{r.dataSource}</p>
          </EvtBlock>
        )}
        {r.breakdown && typeof r.breakdown === 'object' && Object.keys(r.breakdown).length > 0 && (
          <EvtBlock title="Breakdown">
            <div className="space-y-1.5 mt-1">
              {Object.entries(r.breakdown).map(([key, val]: [string, any]) => {
                const numVal = parseInt(String(val)) || 0
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-600 flex-shrink-0" style={{ width: 150 }}>{key}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min(numVal || 50, 100)}%`, background: `${ev.color}70` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold" style={{ width: 50, textAlign: 'right' }}>{val}</span>
                  </div>
                )
              })}
            </div>
          </EvtBlock>
        )}
        {r.insight && (
          <EvtBlock title="KIMMP Insight">
            <p className="text-[11px] text-slate-300 leading-relaxed px-2.5 py-2 rounded italic mt-0.5"
              style={{ background: `${ev.color}08`, border: `1px solid ${ev.color}18` }}>
              {r.insight}
            </p>
          </EvtBlock>
        )}
        {Object.keys(r).length > 0 && <RawPayload r={r} />}
      </div>
    )
  }

  if (ev.type === 'system') {
    const stCol = r.status === 'complete' ? '#34d399' : r.status === 'failed' ? '#f87171' : '#fbbf24'
    return (
      <div style={panelStyle} className="space-y-3">
        <EvtStatGrid stats={[
          { label: 'Component', value: r.component ?? '—' },
          { label: 'Status',    value: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : '—', color: stCol },
          { label: 'Duration',  value: r.duration ?? '—', mono: true },
          { label: 'Schema Ver', value: r.schemaVersion ?? r.version ?? 'n/a' },
        ]} />
        {r.operation && (
          <EvtBlock title="Operation">
            <p className="text-[11px] text-slate-300">{r.operation}</p>
          </EvtBlock>
        )}
        <div className="grid grid-cols-2 gap-4">
          {r.trigger && (
            <EvtBlock title="Triggered By">
              <p className="text-[11px] text-slate-400">{r.trigger}</p>
            </EvtBlock>
          )}
          {r.impactScope && (
            <EvtBlock title="Impact Scope">
              <p className="text-[11px] text-slate-400 leading-relaxed">{r.impactScope}</p>
            </EvtBlock>
          )}
        </div>
        {r.details && (
          <EvtBlock title="Details">
            <p className="text-[11px] text-slate-400 leading-relaxed">{r.details}</p>
          </EvtBlock>
        )}
        {(Array.isArray(r.tablesAffected) || r.rollbackAvailable != null || r.indexesCreated != null) && (
          <EvtBlock title="Tables Affected · Rollback · Indexes">
            <div className="flex flex-wrap mt-1">
              {Array.isArray(r.tablesAffected) && r.tablesAffected.length > 0
                ? r.tablesAffected.map((t: string) => <EvtChip key={t} label={t} color="#579bfc" />)
                : <EvtChip label="No tables affected" color="#334155" />
              }
              {r.rollbackAvailable != null && (
                <EvtChip label={r.rollbackAvailable ? '↩ Rollback available' : 'No rollback'} color={r.rollbackAvailable ? '#34d399' : '#64748b'} />
              )}
              {r.indexesCreated != null && <EvtChip label={`${r.indexesCreated} index${r.indexesCreated !== 1 ? 'es' : ''} created`} color="#579bfc" />}
            </div>
          </EvtBlock>
        )}
        {Object.keys(r).length > 0 && <RawPayload r={r} />}
      </div>
    )
  }

  // Fallback — full raw dump
  return (
    <div style={panelStyle} className="space-y-3">
      {ev.sub && <p className="text-[11px] text-slate-400 leading-relaxed">{ev.sub}</p>}
      {ev.raw
        ? <RawPayload r={r} />
        : <p className="text-[11px] text-slate-700 italic">No payload data for this event.</p>
      }
    </div>
  )
}

function WaandaEventRow({ ev }: { ev: WaandaEvent }) {
  const [open, setOpen] = useState(false)
  const c = EVT_COLOR[ev.type] ?? EVT_COLOR.system
  const date = new Date(ev.createdAt)
  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

  return (
    <div style={{ borderLeft: `3px solid ${ev.color}${open ? '' : '55'}`, transition: 'border-color 0.15s' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.02]"
        style={{ borderBottom: '1px solid rgba(10,15,30,0.5)' }}
      >
        <span className="text-[11px] font-bold flex-shrink-0 w-4 pt-px" style={{ color: ev.color }}>{EVT_ICON[ev.type] ?? '◉'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
              {ev.type}
            </span>
            <span className="text-xs font-semibold text-slate-200 truncate">{ev.title}</span>
            {ev.announced && (
              <span className="text-[8px] font-bold px-1 py-0.5 rounded flex-shrink-0"
                style={{ background: 'rgba(0,200,117,0.07)', border: '1px solid rgba(0,200,117,0.18)', color: '#34d399' }}>
                ANNOUNCED
              </span>
            )}
          </div>
          {(ev.value || ev.sub) && (
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{ev.value || ev.sub}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[9px] text-slate-700 font-mono whitespace-nowrap">{dateStr} {timeStr}</span>
          <ChevronDown className="w-3 h-3 text-slate-600 transition-transform flex-shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        </div>
      </button>
      {open && <WaandaEventDetail ev={ev} />}
    </div>
  )
}

function WaandaEventsTab() {
  const [typeFilter, setTypeFilter] = useState<WaandaEventType | 'all'>('all')
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['waanda-events-admin'],
    queryFn: () => api.get('/admin/kangqore-immp/events?limit=500').then(r => r.data.events ?? []) as Promise<WaandaEvent[]>,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const events: WaandaEvent[] = data ?? []

  const filtered = useMemo(() => events
    .filter(e => typeFilter === 'all' || e.type === typeFilter)
    .filter(e => !search || [e.title, e.value, e.sub].some(s => (s ?? '').toLowerCase().includes(search.toLowerCase())))
  , [events, typeFilter, search])

  const countByType = useMemo(() => {
    const m: Record<string, number> = {}
    events.forEach(e => { m[e.type] = (m[e.type] ?? 0) + 1 })
    return m
  }, [events])

  const types: WaandaEventType[] = ['signal', 'agent', 'alert', 'kpi', 'system']

  return (
    <div className="space-y-4">

      {/* Stats strip */}
      <div className="grid grid-cols-5 divide-x rounded-xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
        {types.map((t, i) => {
          const c = EVT_COLOR[t]
          return (
            <div key={t} className="px-4 py-3 text-center" style={{ borderLeft: i > 0 ? '1px solid rgba(10,15,30,0.5)' : 'none' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: c.text }}>{EVT_ICON[t]} {t}</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: c.text }}>{countByType[t] ?? 0}</p>
            </div>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" style={{ width: 13, height: 13 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-transparent text-white placeholder:text-slate-700 rounded-lg outline-none"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }} />
        </div>
        {(['all', ...types] as const).map(t => (
          <button key={t} onClick={() => setTypeFilter(t as WaandaEventType | 'all')}
            className="text-[11px] font-semibold px-3 py-2 rounded-lg transition-all flex-shrink-0"
            style={{
              background: typeFilter === t ? `${EVT_COLOR[t as WaandaEventType]?.bg ?? 'rgba(124,58,237,0.1)'}` : 'rgba(255,255,255,0.025)',
              border: `1px solid ${typeFilter === t ? (EVT_COLOR[t as WaandaEventType]?.border ?? 'rgba(124,58,237,0.3)') : 'rgba(255,255,255,0.08)'}`,
              color: typeFilter === t ? (EVT_COLOR[t as WaandaEventType]?.text ?? '#a78bfa') : '#64748b',
            }}>
            {t === 'all' ? 'All' : `${EVT_ICON[t as WaandaEventType]} ${t}`}
          </button>
        ))}
        <button onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors flex-shrink-0"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)', color: '#64748b' }}>
          <RefreshCw className={isFetching ? 'animate-spin' : ''} style={{ width: 13, height: 13 }} />
        </button>
        <span className="text-[11px] text-slate-700 tabular-nums ml-auto">{filtered.length} / {events.length}</span>
      </div>

      {/* Event list */}
      {isLoading ? (
        <div className="space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Radio style={{ width: 28, height: 28, color: '#334155' }} className="mb-3" />
          <p className="text-sm font-semibold text-slate-500">{events.length === 0 ? 'No events yet' : 'No events match filters'}</p>
          <p className="text-xs text-slate-600 mt-1">Events are written each time WAANDA emits a HUD signal.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
          {filtered.map(ev => <WaandaEventRow key={ev.id} ev={ev} />)}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

function dayLabel(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Agent colour map ─────────────────────────────────────────────────────────

const AGENT_COLOR: Record<string, string> = {
  SCOUT:                '#7c3aed', RESEARCH:             '#7c3aed',
  GOAL_CHECK:           '#059669', SIGNAL_READ:          '#2564ea',
  LEAD_ANALYSIS:        '#2564ea', FINANCIAL_SNAPSHOT:   '#059669',
  REPORT_GENERATE:      '#64748b', STRATEGIST:           '#d97706',
  ADVISOR:              '#d97706', FORECAST:             '#0ea5e9',
  RISK_ANALYSIS:        '#ef4444', OPPORTUNITY_SCAN:     '#10b981',
  COMPETITOR_INTEL:     '#f97316', WORKFLOW_ORCHESTRATOR:'#64748b',
  EXEC_SUMMARY:         '#64748b', DECISION_ENGINE:      '#d97706',
  MEMORY_RECALL:        '#8b5cf6', TASK_MANAGER:         '#64748b',
  MEETING_INTEL:        '#0ea5e9', ORGANIZATION_HEALTH:  '#059669',
  CLIENT_INTEL:         '#2564ea', KNOWLEDGE_ENGINE:     '#8b5cf6',
  SIMULATION_ENGINE:    '#f59e0b', THREAT_DETECTOR:      '#ef4444',
  VULNERABILITY_MANAGER:'#ef4444', SECURITY_POSTURE:     '#f97316',
  RISK_MANAGER:         '#ef4444', COMPLIANCE_GUARD:     '#64748b',
  ATTACK_ANALYZER:      '#ef4444', ACCESS_GOVERNOR:      '#f97316',
  ASSET_GUARDIAN:       '#f97316', THIRD_PARTY_RISK:     '#f59e0b',
  RESILIENCE_MONITOR:   '#0ea5e9', SHADOW_AI_DETECTOR:   '#8b5cf6',
  AGENT_GUARDIAN:       '#8b5cf6',
}

function agentColor(type: string) { return AGENT_COLOR[type] ?? '#64748b' }

const REC_COLOR: Record<string, string> = {
  YES: '#10b981', NO: '#ef4444', CONDITIONAL: '#f59e0b',
}

function recColor(rec: string) {
  return REC_COLOR[(rec ?? '').toUpperCase().split(' ')[0]] ?? '#64748b'
}

function confColor(v: number) {
  return v >= 80 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'
}

// ─── Agent Pipeline Diagram ───────────────────────────────────────────────────

function AgentPipeline({ agents, results }: { agents: string[]; results: any[] }) {
  if (!agents.length) return null
  return (
    <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent' }}>
      <div className="flex items-start w-max min-w-full gap-0 py-1">
        {agents.map((a, i) => {
          const color = agentColor(a)
          const res = results.find((r: any) => r.agentType === a)
          const failed = res?.success === false
          const done = !!res
          const statusColor = failed ? '#ef4444' : done ? '#10b981' : '#475569'
          const label = a.split('_').reduce((acc: string[], word: string) => {
            const last = acc[acc.length - 1] ?? ''
            return last.length + word.length <= 10
              ? [...acc.slice(0, -1), last ? `${last} ${word}` : word]
              : [...acc, word]
          }, []).join('\n')

          return (
            <div key={i} className="flex items-start flex-shrink-0">
              {/* Node */}
              <div className="flex flex-col items-center" style={{ width: 88 }}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 relative"
                  style={{
                    background: failed ? 'rgba(239,68,68,0.08)' : `${color}12`,
                    border: `1px solid ${failed ? 'rgba(239,68,68,0.25)' : color + '30'}`,
                  }}
                >
                  <Brain className="w-4.5 h-4.5" style={{ color: failed ? '#ef4444' : color, width: 18, height: 18 }} />
                  <div
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: statusColor, border: '2px solid #0B1121' }}
                  >
                    {failed
                      ? <XCircle className="w-2 h-2 text-white" style={{ width: 8, height: 8 }} />
                      : done
                        ? <CheckCircle2 className="w-2 h-2 text-white" style={{ width: 8, height: 8 }} />
                        : null
                    }
                  </div>
                </div>
                <p
                  className="text-[8px] font-bold font-mono text-center leading-tight whitespace-pre-wrap px-1"
                  style={{ color: failed ? '#ef4444' : color }}
                >
                  {label}
                </p>
                {res?.durationMs != null && (
                  <p className="text-[8px] text-slate-700 font-mono mt-1">{fmtMs(res.durationMs)}</p>
                )}
              </div>

              {/* Connector */}
              {i < agents.length - 1 && (
                <div className="flex items-center flex-shrink-0" style={{ marginTop: 22, width: 28 }}>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <ArrowRight className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Agent trace (expandable output) ─────────────────────────────────────────

function AgentTraceBlock({ result }: { result: any }) {
  const [open, setOpen] = useState(false)
  const color = agentColor(result.agentType)
  const failed = result.success === false
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${open ? color + '22' : 'rgba(10,15,30,0.5)'}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
        style={{ background: open ? `${color}06` : 'transparent' }}
      >
        <div className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center" style={{ background: color }}>
          <Brain className="text-white" style={{ width: 11, height: 11 }} />
        </div>
        <span className="text-[11px] font-bold font-mono flex-1" style={{ color }}>{result.agentType}</span>
        {result.durationMs != null && (
          <span className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
            <Clock style={{ width: 11, height: 11 }} />{fmtMs(result.durationMs)}
          </span>
        )}
        {failed
          ? <XCircle className="text-red-400 flex-shrink-0" style={{ width: 13, height: 13 }} />
          : <CheckCircle2 className="text-emerald-400 flex-shrink-0" style={{ width: 13, height: 13 }} />
        }
        <ChevronRight
          className="text-slate-600 flex-shrink-0 transition-transform"
          style={{ width: 12, height: 12, transform: open ? 'rotate(90deg)' : 'none' }}
        />
      </button>
      {open && (
        <div className="px-4 pb-3 pt-0" style={{ borderTop: `1px solid ${color}15` }}>
          {result.output
            ? <pre className="text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed mt-3 p-3 rounded-lg font-mono overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(10,15,30,0.5)' }}>{result.output}</pre>
            : <p className="text-[11px] text-slate-600 mt-3 italic">No output recorded.</p>
          }
        </div>
      )}
    </div>
  )
}

// ─── Run detail panel ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-3">{children}</p>
}

function RunDetail({ run }: { run: any }) {
  const [tracesOpen, setTracesOpen] = useState(false)
  const agentResults: any[] = Array.isArray(run.agentResults) ? run.agentResults : []
  const evidence: any[]     = Array.isArray(run.evidence)     ? run.evidence     : []
  const riskFactors: any[]  = Array.isArray(run.riskFactors)  ? run.riskFactors  : []
  const nextSteps: any[]    = Array.isArray(run.nextSteps)    ? run.nextSteps    : []
  const agentsUsed: string[]= Array.isArray(run.agentsUsed)   ? run.agentsUsed   : []

  const conf = run.confidence ?? 0
  const cCol = confColor(conf)
  const rCol = recColor(run.recommendation ?? '')

  return (
    <motion.div
      key={run.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-2">
          {run.intent ?? 'ORCHESTRATION'} · {timeAgo(run.createdAt)}
        </p>
        <h2 className="text-sm font-bold text-white leading-snug">{run.question}</h2>
      </div>

      {/* Stats strip */}
      <div className="flex items-stretch flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {[
          { label: 'Confidence',      value: `${conf}%`,                   color: cCol        },
          { label: 'Duration',         value: fmtMs(run.durationMs ?? 0),   color: '#94a3b8'   },
          { label: 'Agents',           value: String(agentsUsed.length),    color: '#94a3b8'   },
          { label: 'Recommendation',   value: run.recommendation ?? '—',    color: rCol        },
        ].map((s, i) => (
          <div key={s.label} className="flex-1 px-4 py-3" style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700 mb-1">{s.label}</p>
            <p className="text-sm font-bold truncate tabular-nums" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Scrollable detail body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-7" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>

        {/* Agent Pipeline */}
        {agentsUsed.length > 0 && (
          <section>
            <SectionLabel>Agent Pipeline · {agentsUsed.length} agents</SectionLabel>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
              <AgentPipeline agents={agentsUsed} results={agentResults} />
            </div>
          </section>
        )}

        {/* Summary */}
        {run.summary && (
          <section>
            <SectionLabel>Synthesis Summary</SectionLabel>
            <p className="text-sm text-slate-300 leading-relaxed">{run.summary}</p>
          </section>
        )}

        {/* Evidence Chain */}
        {evidence.length > 0 && (
          <section>
            <SectionLabel>Evidence Chain · {evidence.length} findings</SectionLabel>
            <div className="space-y-2.5">
              {evidence.map((e: any, i: number) => {
                const color = agentColor(e.agent)
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 flex flex-col items-center" style={{ paddingTop: 2 }}>
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <span className="text-[7px] font-black font-mono leading-none" style={{ color }}>{e.agent.slice(0, 2)}</span>
                      </div>
                      {i < evidence.length - 1 && (
                        <div className="w-px flex-1 mt-1.5" style={{ background: 'rgba(255,255,255,0.06)', minHeight: 12 }} />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pb-2">{e.finding}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Agent Outputs (collapsible) */}
        {agentResults.length > 0 && (
          <section>
            <button
              onClick={() => setTracesOpen(o => !o)}
              className="flex items-center gap-2 w-full text-left mb-3 group"
            >
              <SectionLabel>Agent Outputs · {agentResults.length} traces</SectionLabel>
              <ChevronRight
                className="text-slate-700 transition-transform"
                style={{ width: 12, height: 12, transform: tracesOpen ? 'rotate(90deg)' : 'none', marginTop: -8 }}
              />
            </button>
            <AnimatePresence>
              {tracesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="space-y-1.5">
                    {agentResults.map((r: any, i: number) => <AgentTraceBlock key={i} result={r} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Risk + Next Steps */}
        {(riskFactors.length > 0 || nextSteps.length > 0) && (
          <div className="grid grid-cols-2 gap-4">
            {riskFactors.length > 0 && (
              <section>
                <SectionLabel>Risk Factors</SectionLabel>
                <ul className="space-y-2">
                  {riskFactors.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {nextSteps.length > 0 && (
              <section>
                <SectionLabel>Next Steps</SectionLabel>
                <ol className="space-y-2">
                  {nextSteps.map((s: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                      <span className="text-emerald-500 font-bold flex-shrink-0">{i + 1}.</span>{s}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Empty detail state ───────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.1)' }}
      >
        <ScrollText style={{ width: 28, height: 28, color: 'rgba(37,100,234,0.25)' }} />
      </div>
      <p className="text-sm font-semibold text-slate-600">Select a run to inspect</p>
      <p className="text-xs text-slate-700 mt-1.5 max-w-48 leading-relaxed">
        Click any orchestration in the list to see the full agent trace and synthesis
      </p>
    </div>
  )
}

// ─── Run list item ────────────────────────────────────────────────────────────

function RunListItem({ item, isSelected, onClick }: { item: any; isSelected: boolean; onClick: () => void }) {
  const conf = item.confidence ?? 0
  const color = confColor(conf)
  return (
    <button
      onClick={onClick}
      className="w-full flex items-stretch text-left relative transition-colors group"
      style={{
        background: isSelected ? 'rgba(37,100,234,0.08)' : 'transparent',
        borderBottom: '1px solid rgba(10,15,30,0.4)',
      }}
    >
      {/* Left confidence bar */}
      <div className="w-[3px] flex-shrink-0 self-stretch" style={{ background: color, opacity: isSelected ? 1 : 0.4 }} />

      {/* Content */}
      <div className="flex-1 px-4 py-3 min-w-0">
        <p className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2 mb-1.5 group-hover:text-white transition-colors">
          {item.question}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {item.intent && (
            <span className="text-[9px] font-mono text-slate-600 truncate max-w-24">{item.intent}</span>
          )}
          <span className="text-[9px] text-slate-700 flex items-center gap-0.5">
            <Zap style={{ width: 9, height: 9 }} />
            {(item.agentsUsed ?? []).length}
          </span>
          <span className="text-[9px] text-slate-700 flex items-center gap-0.5">
            <Clock style={{ width: 9, height: 9 }} />
            {fmtMs(item.durationMs ?? 0)}
          </span>
        </div>
      </div>

      {/* Right: confidence + time */}
      <div className="flex flex-col items-end justify-center px-3 gap-1 flex-shrink-0">
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{conf}%</span>
        <span className="text-[9px] text-slate-700">{timeAgo(item.createdAt)}</span>
      </div>

      {/* Selected right indicator */}
      {isSelected && (
        <div className="absolute right-0 top-0 bottom-0 w-[2px]" style={{ background: '#2564ea' }} />
      )}
    </button>
  )
}

// ─── Analytics panel ──────────────────────────────────────────────────────────

function AnalyticsOverlay({ logs, onClose }: { logs: any[]; onClose: () => void }) {
  const agentStats = useMemo(() => {
    const counts: Record<string, { count: number; totalMs: number; failures: number }> = {}
    for (const log of logs) {
      for (const res of (log.agentResults ?? [])) {
        if (!counts[res.agentType]) counts[res.agentType] = { count: 0, totalMs: 0, failures: 0 }
        counts[res.agentType].count++
        counts[res.agentType].totalMs += res.durationMs ?? 0
        if (res.success === false) counts[res.agentType].failures++
      }
    }
    return Object.entries(counts)
      .map(([name, s]) => ({ name, count: s.count, avgMs: s.count ? Math.round(s.totalMs / s.count) : 0, failRate: s.count ? Math.round((s.failures / s.count) * 100) : 0 }))
      .sort((a, b) => b.count - a.count).slice(0, 10)
  }, [logs])

  const intents = useMemo(() => {
    const freq: Record<string, number> = {}
    logs.forEach(l => { freq[l.intent] = (freq[l.intent] ?? 0) + 1 })
    return Object.entries(freq).sort((a, b) => b[1] - a[1])
  }, [logs])

  const maxAgent = agentStats[0]?.count ?? 1
  const maxIntent = intents[0]?.[1] ?? 1
  const total = intents.reduce((s, [, c]) => s + c, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-5 grid grid-cols-1 xl:grid-cols-2 gap-6"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}
    >
      {/* Agent usage */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-4 flex items-center gap-2">
          <TrendingUp style={{ width: 12, height: 12 }} /> Agent Usage
        </p>
        <div className="space-y-2.5">
          {agentStats.map(s => {
            const color = agentColor(s.name)
            return (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <span className="text-[5px] font-black font-mono" style={{ color }}>{s.name.slice(0,2)}</span>
                </div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(13,17,23,0.5)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((s.count / maxAgent) * 100)}%`, background: color + '60' }} />
                </div>
                <span className="text-[10px] text-slate-500 w-5 text-right tabular-nums">{s.count}×</span>
                <span className="text-[10px] text-slate-700 w-12 text-right font-mono">{fmtMs(s.avgMs)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Intent distribution */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600 mb-4 flex items-center gap-2">
          <Activity style={{ width: 12, height: 12 }} /> Query Intents · {total} total
        </p>
        <div className="space-y-2.5">
          {intents.map(([intent, count]) => (
            <div key={intent} className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-600 w-36 flex-shrink-0 truncate">{intent}</span>
              <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(13,17,23,0.5)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round((count / maxIntent) * 100)}%`, background: 'rgba(124,58,237,0.55)' }} />
              </div>
              <span className="text-[10px] text-slate-500 w-4 text-right tabular-nums">{count}</span>
              <span className="text-[9px] text-slate-700 w-7 text-right tabular-nums">{Math.round((count / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── KIMMP Growth Tab ─────────────────────────────────────────────────────────

const STAGE_LABEL: Record<string, string> = {
  embryonic: 'Embryonic',
  learning:  'Learning',
  growing:   'Growing',
  ready:     'Fine-Tune Ready',
  graduated: 'Graduated',
}
const STAGE_COLOR: Record<string, string> = {
  embryonic: '#334155',
  learning:  '#2564ea',
  growing:   '#a78bfa',
  ready:     '#34d399',
  graduated: '#fbbf24',
}
const SOURCE_COLOR: Record<string, string> = {
  decision:     '#34d399',
  dispatch:     '#2564ea',
  memory:       '#a78bfa',
  synthetic:    '#fdab3d',
  distillation: '#60a5fa',
}

function KIMMLearningTab() {
  const qc = useQueryClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['kimmp-learning-stats'],
    queryFn: () => api.get('/admin/kangqore-immp/learning/stats').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const { data: examplesData } = useQuery({
    queryKey: ['kimmp-learning-examples'],
    queryFn: () => api.get('/admin/kangqore-immp/learning/examples?limit=30').then(r => r.data.examples ?? []),
    staleTime: 30_000,
  })

  const { data: runsData } = useQuery({
    queryKey: ['kimmp-learning-runs'],
    queryFn: () => api.get('/admin/kangqore-immp/learning/runs').then(r => r.data.runs ?? []),
    staleTime: 30_000,
  })

  const { data: routerStats } = useQuery({
    queryKey: ['kimmp-router-stats'],
    queryFn: () => api.get('/admin/kangqore-immp/learning/router/stats').then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 30_000,
  })

  const triggerRun = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/learning/run'),
    onSuccess: () => {
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ['kimmp-learning-stats'] })
        qc.invalidateQueries({ queryKey: ['kimmp-learning-examples'] })
        qc.invalidateQueries({ queryKey: ['kimmp-learning-runs'] })
      }, 3000)
    },
  })

  const approveExample = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/kangqore-immp/learning/examples/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-learning-examples'] }),
  })

  const downloadCorpus = () => {
    window.open('/api/admin/kangqore-immp/learning/export', '_blank')
  }

  const s = stats ?? {}
  const rs = routerStats ?? {}
  const examples: any[] = examplesData ?? []
  const runs: any[] = runsData ?? []
  const stage = s.stage ?? 'embryonic'
  const stageCol = STAGE_COLOR[stage] ?? '#334155'
  const progress = s.graduationProgress ?? 0
  const total = s.total ?? 0
  const approved = s.approved ?? 0
  const autonomy = Math.round((rs.autonomyRatio ?? 0) * 100)
  const claudeDepend = 100 - autonomy

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stageCol}18`, border: `1px solid ${stageCol}30` }}>
            <Dna style={{ width: 16, height: 16, color: stageCol }} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none mb-0.5">KIMMP Growth</h1>
            <p className="text-[11px] text-slate-600">Self-training corpus — KIMMP growing into its own LLM</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${stageCol}14`, border: `1px solid ${stageCol}28`, color: stageCol }}>
            {STAGE_LABEL[stage]}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadCorpus}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#64748b' }}>
            <FileDown style={{ width: 13, height: 13 }} />Export JSONL
          </button>
          <button onClick={() => triggerRun.mutate()} disabled={triggerRun.isPending}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors disabled:opacity-50"
            style={{ border: `1px solid ${stageCol}30`, background: `${stageCol}0d`, color: stageCol }}>
            <Play style={{ width: 13, height: 13 }} className={triggerRun.isPending ? 'animate-pulse' : ''} />
            {triggerRun.isPending ? 'Running…' : 'Run Learning Cycle'}
          </button>
        </div>
      </div>

      {/* Graduation progress */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-0.5">Graduation Progress — Fine-Tune Ready at 1,000 Approved</p>
            <p className="text-2xl font-bold" style={{ color: stageCol }}>{approved.toLocaleString()} <span className="text-slate-600 text-sm font-normal">/ 1,000 approved</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-700 mb-1">Total corpus</p>
            <p className="text-lg font-bold text-white">{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${stageCol}80, ${stageCol})` }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-slate-700">0</span>
          <span className="text-[9px] font-bold" style={{ color: stageCol }}>{progress}%</span>
          <span className="text-[9px] text-slate-700">1,000</span>
        </div>
        {s.readyForFineTune && (
          <p className="text-[11px] font-bold mt-3 text-center px-3 py-2 rounded-lg"
            style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
            KIMMP is ready for fine-tuning. Export the JSONL corpus and submit to your provider.
          </p>
        )}
      </div>

      {/* Distillation Pipeline — Claude→KIMMP knowledge transfer */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.12)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#a78bfa' }}>Distillation Pipeline — Claude Training KIMMP</p>
            <p className="text-[11px] text-slate-600">Every Claude inference is auto-captured as training data. Claude is the teacher; KIMMP's local model is the student.</p>
          </div>
          <div className="flex-shrink-0 ml-4 text-right">
            <p className="text-[9px] text-slate-700 mb-0.5">Local Model</p>
            <p className="text-[11px] font-bold" style={{ color: rs.localModel ? '#34d399' : '#334155' }}>
              {rs.localModel ?? 'Not Set'}
            </p>
          </div>
        </div>

        {/* Claude dependency → autonomy bars */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Claude Dependency</span>
              <span className="text-[11px] font-bold" style={{ color: claudeDepend > 80 ? '#f87171' : claudeDepend > 40 ? '#fdab3d' : '#34d399' }}>{claudeDepend}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${claudeDepend}%`, background: 'linear-gradient(90deg, #f87171, #fdab3d)' }} />
            </div>
            <p className="text-[9px] text-slate-700 mt-1">Target: 0% (full independence)</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Local Model Autonomy</span>
              <span className="text-[11px] font-bold" style={{ color: autonomy > 60 ? '#34d399' : autonomy > 20 ? '#a78bfa' : '#334155' }}>{autonomy}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${autonomy}%`, background: 'linear-gradient(90deg, #a78bfa, #34d399)' }} />
            </div>
            <p className="text-[9px] text-slate-700 mt-1">Target: 100% (no Claude needed)</p>
          </div>
        </div>

        {/* Distillation stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Claude Calls (session)', value: (rs.callsClaude ?? 0).toLocaleString(), color: '#60a5fa' },
            { label: 'Local Calls (session)',   value: (rs.callsLocal ?? 0).toLocaleString(),  color: '#34d399' },
            { label: 'Distilled Examples',      value: (rs.distillationCount ?? 0).toLocaleString(), color: '#a78bfa' },
            { label: 'Distillation Phase',      value: rs.phase ?? 'distilling',               color: '#fdab3d' },
          ].map(item => (
            <div key={item.label} className="rounded-lg px-3 py-2.5 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-700 mb-1">{item.label}</p>
              <p className="text-sm font-bold capitalize" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Graduation pathway */}
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(167,139,250,0.1)' }}>
          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-700 mb-2">Graduation Pathway — Claude Independence Roadmap</p>
          <div className="flex items-center gap-0">
            {[
              { phase: '1', label: 'Distilling', desc: 'Every Claude call → training data', done: true },
              { phase: '2', label: 'Export',     desc: 'Export JSONL, fine-tune base model', done: (rs.distillationCount ?? 0) > 500 },
              { phase: '3', label: 'Deploy',     desc: 'Set KIMMP_LOCAL_MODEL, Ollama routes', done: !!rs.localModel },
              { phase: '4', label: 'Graduate',   desc: 'Autonomy > 90%, no Claude API key needed', done: autonomy >= 90 },
            ].map((p, i) => (
              <div key={p.phase} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mb-1"
                    style={{ background: p.done ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${p.done ? '#34d399' : 'rgba(255,255,255,0.06)'}`, color: p.done ? '#34d399' : '#334155' }}>
                    {p.done ? '✓' : p.phase}
                  </div>
                  <p className="text-[8px] font-bold text-center" style={{ color: p.done ? '#34d399' : '#475569' }}>{p.label}</p>
                  <p className="text-[8px] text-slate-700 text-center leading-tight mt-0.5 px-1">{p.desc}</p>
                </div>
                {i < 3 && <div className="h-px flex-shrink-0 mb-5" style={{ width: 8, background: 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Quality Avg',    value: s.qualityAvg ? `${Math.round(s.qualityAvg * 100)}%` : '—', color: '#34d399' },
          { label: 'Distilled',      value: s.bySource?.distillation ?? 0, color: SOURCE_COLOR.distillation },
          { label: 'From Decisions', value: s.bySource?.decision ?? 0,     color: SOURCE_COLOR.decision  },
          { label: 'From Dispatches',value: s.bySource?.dispatch ?? 0,     color: SOURCE_COLOR.dispatch  },
          { label: 'Synthetic',      value: s.bySource?.synthetic ?? 0,    color: SOURCE_COLOR.synthetic },
        ].map(item => (
          <div key={item.label} className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">{item.label}</p>
            <p className="text-xl font-bold" style={{ color: item.color }}>{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
          </div>
        ))}
      </div>

      {/* By system */}
      {s.bySystem && Object.keys(s.bySystem).length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-3">Examples by System</p>
          <div className="space-y-2">
            {Object.entries(s.bySystem as Record<string, number>)
              .sort(([,a],[,b]) => b - a)
              .map(([sys, count]) => {
                const maxVal = Math.max(...Object.values(s.bySystem as Record<string, number>))
                return (
                  <div key={sys} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 w-24 flex-shrink-0">{sys}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round((count / maxVal) * 100)}%`, background: stageCol + '70' }} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono w-8 text-right">{count}</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Two-col: examples + run history */}
      <div className="grid grid-cols-2 gap-4">

        {/* Recent examples */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(10,15,30,0.5)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Training Examples</p>
            <span className="text-[9px] text-slate-700">{total.toLocaleString()} total</span>
          </div>
          <div className="divide-y" style={{ divideColor: 'rgba(10,15,30,0.5)', maxHeight: 420, overflowY: 'auto' }}>
            {examples.length === 0 ? (
              <p className="text-[11px] text-slate-700 italic text-center py-10">No examples yet — run a learning cycle</p>
            ) : examples.map((ex: any) => (
              <div key={ex.id} className="px-4 py-3 space-y-1.5">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${SOURCE_COLOR[ex.source] ?? '#334155'}14`, border: `1px solid ${SOURCE_COLOR[ex.source] ?? '#334155'}28`, color: SOURCE_COLOR[ex.source] ?? '#64748b' }}>
                      {ex.source}
                    </span>
                    {ex.agentSystem && (
                      <span className="text-[8px] text-slate-700 font-mono">{ex.agentSystem}</span>
                    )}
                    {ex.approved && (
                      <span className="text-[8px] font-bold" style={{ color: '#34d399' }}>✓ approved</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold" style={{ color: ex.quality >= 0.9 ? '#34d399' : ex.quality >= 0.7 ? '#fbbf24' : '#64748b' }}>
                      {Math.round(ex.quality * 100)}%
                    </span>
                    {!ex.approved && (
                      <button onClick={() => approveExample.mutate(ex.id)}
                        className="text-[8px] px-1.5 py-0.5 rounded transition-colors hover:opacity-80"
                        style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}>
                        <CheckCheck style={{ width: 9, height: 9, display: 'inline' }} /> Approve
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{ex.userMessage}</p>
                <p className="text-[10px] text-slate-700 leading-relaxed line-clamp-2 italic">{ex.idealResponse}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Run history */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(10,15,30,0.5)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Learning Cycle History</p>
          </div>
          <div className="divide-y" style={{ divideColor: 'rgba(10,15,30,0.5)', maxHeight: 420, overflowY: 'auto' }}>
            {runs.length === 0 ? (
              <p className="text-[11px] text-slate-700 italic text-center py-10">No cycles run yet</p>
            ) : runs.map((run: any) => {
              const complete = !!run.completedAt
              return (
                <div key={run.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded capitalize"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                        {run.trigger}
                      </span>
                      {run.readyForTune && (
                        <span className="text-[8px] font-bold" style={{ color: '#34d399' }}>GRADUATE READY</span>
                      )}
                    </div>
                    <span className={`text-[8px] font-bold ${complete ? 'text-green-400' : 'text-yellow-500'}`}>
                      {complete ? '✓ complete' : '⟳ running'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-600">
                    <span>+{run.examplesAdded ?? 0} examples</span>
                    <span>{run.syntheticAdded ?? 0} synthetic</span>
                    <span>{run.approvedCount ?? 0} approved</span>
                  </div>
                  {run.notes && <p className="text-[9px] text-slate-700 truncate">{run.notes}</p>}
                  <p className="text-[9px] text-slate-700">{new Date(run.startedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Stage roadmap */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(10,15,30,0.5)' }}>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-4">KIMMP Graduation Roadmap</p>
        <div className="flex items-start gap-0">
          {[
            { stage: 'embryonic', label: 'Embryonic',       target: '0 examples',     desc: 'Mining begins' },
            { stage: 'learning',  label: 'Learning',        target: '100 approved',    desc: 'Patterns forming' },
            { stage: 'growing',   label: 'Growing',         target: '500 approved',    desc: 'Self-generating' },
            { stage: 'ready',     label: 'Fine-Tune Ready', target: '1,000 approved',  desc: 'Export JSONL' },
            { stage: 'graduated', label: 'Graduated',       target: 'Fine-tune complete', desc: 'KIMMP owns its weights' },
          ].map((st, i) => {
            const isActive = st.stage === stage
            const isPast   = ['embryonic','learning','growing','ready','graduated'].indexOf(st.stage) < ['embryonic','learning','growing','ready','graduated'].indexOf(stage)
            const col = isPast || isActive ? (STAGE_COLOR[st.stage] ?? '#334155') : '#1e293b'
            return (
              <div key={st.stage} className="flex-1 relative">
                {i > 0 && <div className="absolute top-2.5 -left-px right-1/2 h-px" style={{ background: isPast ? col : '#1e293b' }} />}
                <div className="flex flex-col items-center text-center px-2">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 mb-2 flex items-center justify-center relative z-10"
                    style={{ background: isPast || isActive ? `${col}20` : '#0d1117', border: `2px solid ${col}` }}>
                    {isPast && <span className="text-[8px]" style={{ color: col }}>✓</span>}
                    {isActive && <span className="w-2 h-2 rounded-full block" style={{ background: col }} />}
                  </div>
                  <p className="text-[9px] font-bold" style={{ color: isActive ? col : isPast ? '#475569' : '#334155' }}>{st.label}</p>
                  <p className="text-[8px] font-mono mt-0.5" style={{ color: '#334155' }}>{st.target}</p>
                  {isActive && <p className="text-[8px] mt-0.5" style={{ color: col }}>{st.desc}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// ─── Main module ──────────────────────────────────────────────────────────────

export function AgentLogsModule() {
  const [activeTab, setActiveTab] = useState<'runs' | 'events' | 'growth'>('runs')
  const [search, setSearch]    = useState('')
  const [intentFilter, setIntent] = useState('ALL')
  const [agentFilter, setAgent]   = useState('ALL')
  const [minConf, setMinConf]     = useState(0)
  const [sortBy, setSort]         = useState<'date' | 'confidence' | 'duration'>('date')
  const [selectedId, setSelected] = useState<string | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['orchestration-history-full'],
    queryFn: () => api.get('/admin/kangqore-immp/orchestrate/history?limit=100').then(r => r.data.history ?? []),
    staleTime: 30_000,
    refetchInterval: 120_000,
  })

  const logs: any[] = data ?? []

  // Top-level stats
  const totalRuns   = logs.length
  const avgConf     = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.confidence ?? 0), 0) / logs.length) : 0
  const avgDuration = logs.length ? Math.round(logs.reduce((s: number, l: any) => s + (l.durationMs ?? 0), 0) / logs.length) : 0
  const highConfPct = logs.length ? Math.round(logs.filter((l: any) => (l.confidence ?? 0) >= 80).length / logs.length * 100) : 0
  const totalAgentRuns = logs.reduce((s: number, l: any) => s + (l.agentsUsed?.length ?? 0), 0)

  const allIntents = useMemo(() => ['ALL', ...Array.from(new Set(logs.map((l: any) => l.intent).filter(Boolean))).sort()], [logs])
  const allAgents  = useMemo(() => {
    const s = new Set<string>()
    logs.forEach((l: any) => (l.agentsUsed ?? []).forEach((a: string) => s.add(a)))
    return ['ALL', ...Array.from(s).sort()]
  }, [logs])

  const filtered = useMemo(() => {
    return logs.filter((l: any) => {
      if (search && !l.question?.toLowerCase().includes(search.toLowerCase())) return false
      if (intentFilter !== 'ALL' && l.intent !== intentFilter) return false
      if (agentFilter !== 'ALL' && !(l.agentsUsed ?? []).includes(agentFilter)) return false
      if ((l.confidence ?? 0) < minConf) return false
      return true
    }).sort((a: any, b: any) => {
      if (sortBy === 'confidence') return (b.confidence ?? 0) - (a.confidence ?? 0)
      if (sortBy === 'duration')   return (b.durationMs ?? 0) - (a.durationMs ?? 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [logs, search, intentFilter, agentFilter, minConf, sortBy])

  // Group filtered runs by day
  const grouped = useMemo(() => {
    const groups: Array<{ label: string; items: any[] }> = []
    const seen: Record<string, number> = {}
    filtered.forEach(l => {
      const label = dayLabel(l.createdAt)
      if (seen[label] == null) { seen[label] = groups.length; groups.push({ label, items: [] }) }
      groups[seen[label]].items.push(l)
    })
    return groups
  }, [filtered])

  const selectedRun = selectedId ? filtered.find((l: any) => l.id === selectedId) ?? null : null
  const hasFilters = !!(search || intentFilter !== 'ALL' || agentFilter !== 'ALL' || minConf > 0)

  function exportJSON() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `agent-logs-${new Date().toISOString().slice(0, 10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">

      {/* ── Tab switcher ── */}
      <div className="flex items-center gap-1 border-b border-[var(--os-border)] -mt-1 mb-2">
        {([
          { key: 'runs',   label: 'Orchestration Runs', icon: ScrollText, color: '#2564ea' },
          { key: 'events', label: 'WAANDA Event Log',   icon: Radio,      color: '#2564ea' },
          { key: 'growth', label: 'KIMMP Growth',       icon: Dna,        color: '#a78bfa' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all"
            style={{
              borderColor: activeTab === t.key ? t.color : 'transparent',
              color: activeTab === t.key ? t.color : 'var(--os-text-2)',
            }}>
            <t.icon style={{ width: 13, height: 13 }} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'events' && <WaandaEventsTab />}
      {activeTab === 'growth' && <KIMMLearningTab />}
      {activeTab === 'runs' && <>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,100,234,0.12)', border: '1px solid rgba(37,100,234,0.2)' }}>
            <ScrollText style={{ width: 16, height: 16, color: '#2564ea' }} />
          </div>
          <div>
            <h1 className="text-[22px] font-black tracking-tight leading-none mb-0.5" style={{ color: 'var(--os-text-1)' }}>Agent Logs</h1>
            <p className="text-[11px]" style={{ color: 'var(--os-text-2)' }}>Every WAANDA orchestration run</p>
          </div>
          {totalRuns > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)' }}>
              {totalRuns} total
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {logs.length > 0 && (
            <button
              onClick={() => setShowAnalytics(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors"
              style={{
                border: `1px solid ${showAnalytics ? 'rgba(124,58,237,0.4)' : 'var(--os-border)'}`,
                background: showAnalytics ? 'rgba(124,58,237,0.1)' : 'var(--os-surface-0)',
                color: showAnalytics ? '#a78bfa' : 'var(--os-text-2)',
              }}
            >
              <BarChart3 style={{ width: 13, height: 13 }} />Analytics
            </button>
          )}
          <button
            onClick={exportJSON} disabled={!filtered.length}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors disabled:opacity-30"
            style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}
          >
            <Download style={{ width: 13, height: 13 }} />Export
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg transition-colors"
            style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)', color: 'var(--os-text-2)' }}
          >
            <RefreshCw className={isFetching ? 'animate-spin' : ''} style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* ── Metric strip ── */}
      {totalRuns > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Runs',       value: totalRuns,          sub: 'in history',      bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
            { label: 'Avg Confidence',   value: `${avgConf}%`,      sub: 'synthesis score', bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
            { label: 'High Confidence',  value: `${highConfPct}%`,  sub: '≥80% runs',       bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
            { label: 'Avg Duration',     value: fmtMs(avgDuration), sub: 'end-to-end',      bg: 'linear-gradient(135deg,#fdab3d 0%,#f59e0b 100%)', glow: '#fdab3d' },
            { label: 'Agent Invocations',value: totalAgentRuns,     sub: 'across all runs', bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
          ].map(item => (
            <div key={item.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: item.bg, boxShadow: `0 4px 20px ${item.glow}40` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
              <p className="relative text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{item.label}</p>
              <p className="relative text-2xl font-black tabular-nums" style={{ color: '#ffffff' }}>{item.value}</p>
              <p className="relative text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Analytics panel ── */}
      <AnimatePresence>
        {showAnalytics && logs.length > 0 && (
          <AnalyticsOverlay logs={logs} onClose={() => setShowAnalytics(false)} />
        )}
      </AnimatePresence>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--os-text-2)]" style={{ width: 13, height: 13 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-transparent text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] rounded-lg outline-none"
            style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}
          />
        </div>
        <select value={intentFilter} onChange={e => setIntent(e.target.value)} className="px-3 py-2 text-xs font-medium rounded-lg outline-none text-[var(--os-text-1)]" style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
          {allIntents.map(i => <option key={i} value={i}>{i === 'ALL' ? 'All Intents' : i}</option>)}
        </select>
        <select value={agentFilter} onChange={e => setAgent(e.target.value)} className="px-3 py-2 text-xs font-medium rounded-lg outline-none text-[var(--os-text-1)]" style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
          {allAgents.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Agents' : a}</option>)}
        </select>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--os-text-2)]">Conf ≥</span>
          <input type="number" min={0} max={100} value={minConf} onChange={e => setMinConf(Number(e.target.value))} className="w-14 px-2 py-2 text-xs text-[var(--os-text-1)] rounded-lg outline-none text-center tabular-nums" style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }} />
          <span className="text-[10px] text-[var(--os-text-2)]">%</span>
        </div>
        <select value={sortBy} onChange={e => setSort(e.target.value as any)} className="px-3 py-2 text-xs font-medium rounded-lg outline-none text-[var(--os-text-1)]" style={{ border: '1px solid var(--os-border)', background: 'var(--os-surface-0)' }}>
          <option value="date">Newest first</option>
          <option value="confidence">By confidence</option>
          <option value="duration">By duration</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setIntent('ALL'); setAgent('ALL'); setMinConf(0) }}
            className="text-[11px] font-semibold px-2.5 py-2 rounded-lg"
            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            Clear
          </button>
        )}
        <span className="text-[11px] text-[var(--os-text-2)] ml-auto tabular-nums">{filtered.length} / {totalRuns}</span>
      </div>

      {/* ── Split pane ── */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl px-5 py-4 animate-pulse flex items-center gap-4" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
              <div className="w-9 h-9 rounded-full flex-shrink-0 bg-[var(--os-border)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded w-3/4 bg-[var(--os-border)]" />
                <div className="h-3 rounded w-1/2 bg-[var(--os-surface-0)]" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[var(--os-surface-0)]">
            <Brain style={{ width: 28, height: 28 }} className="text-[var(--os-text-2)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{totalRuns === 0 ? 'No orchestrations yet' : 'No runs match filters'}</p>
          <p className="text-xs text-[var(--os-text-2)] mt-1 max-w-64">{totalRuns === 0 ? 'Ask WAANDA a question to generate the first agent run.' : 'Try clearing or relaxing the active filters.'}</p>
        </div>
      ) : (
        <div className="flex gap-4" style={{ height: 'calc(100vh - 420px)', minHeight: 520 }}>

          {/* ── Left: Run list ── */}
          <div
            className="flex flex-col flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 340, background: 'var(--os-card)', border: '1px solid var(--os-border)' }}
          >
            {/* List header */}
            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--os-border)' }}>
              <span className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-wider">{filtered.length} runs</span>
              {hasFilters && (
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(37,100,234,0.1)', color: '#60a5fa', border: '1px solid rgba(37,100,234,0.2)' }}>
                  filtered
                </span>
              )}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
              {grouped.map(group => (
                <div key={group.label}>
                  {/* Day header */}
                  <div className="px-4 py-2 sticky top-0 z-10" style={{ background: 'var(--os-card)', backdropFilter: 'blur(8px)' }}>
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--os-text-2)]">{group.label}</span>
                  </div>
                  {group.items.map((item: any) => (
                    <RunListItem
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      onClick={() => setSelected(item.id === selectedId ? null : item.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Detail ── */}
          <div
            className="flex-1 flex flex-col rounded-xl overflow-hidden"
            style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}
          >
            <AnimatePresence mode="wait">
              {selectedRun
                ? <RunDetail key={selectedRun.id} run={selectedRun} />
                : <EmptyDetail key="empty" />
              }
            </AnimatePresence>
          </div>
        </div>
      )}
      </>}
    </div>
  )
}
