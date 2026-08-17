import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Scroll, X, CheckCircle, XCircle, ShieldWarning, Robot, User, ShieldCheck, HourglassMedium, Sparkle } from '@phosphor-icons/react'
import { connectSocket, getSocket } from '@lib/socket'
import { actionEngineService, type ActionExecution } from '../actionEngineService'

const STATUS_CFG = {
  SUCCESS:           { label: 'Success',          color: '#10b981', Icon: CheckCircle },
  FAILED:            { label: 'Failed',           color: '#ef4444', Icon: XCircle },
  BLOCKED:           { label: 'Blocked',           color: '#f59e0b', Icon: ShieldWarning },
  PENDING_APPROVAL:  { label: 'Pending Approval',  color: '#a855f7', Icon: HourglassMedium },
} as const

const ACTOR_CFG = {
  HUMAN: { label: 'Human', color: '#579bfc', Icon: User },
  KIMMP: { label: 'KIMMP', color: '#a855f7', Icon: Robot },
  AEGIS: { label: 'AEGIS', color: '#ef4444', Icon: ShieldCheck },
} as const

function timeAgo(date: string) {
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Actor breakdown as a real donut, not a stacked bar — pure CSS conic-gradient,
// no chart library needed for 3 segments.
function ActorDonut({ byActor }: { byActor: Array<{ actorType: string; count: number }> }) {
  const total = byActor.reduce((s, a) => s + a.count, 0)
  if (total === 0) return <p className="text-xs text-[var(--os-text-2)]">No executions yet</p>

  let acc = 0
  const stops = byActor.map(a => {
    const color = ACTOR_CFG[a.actorType as keyof typeof ACTOR_CFG]?.color ?? '#94a3b8'
    const start = (acc / total) * 360
    acc += a.count
    const end = (acc / total) * 360
    return `${color} ${start}deg ${end}deg`
  })

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-full flex-shrink-0 relative"
        style={{ background: `conic-gradient(${stops.join(', ')})` }}
      >
        <div className="absolute inset-[5px] rounded-full flex items-center justify-center" style={{ background: 'var(--os-card)' }}>
          <span className="text-[11px] font-black text-[var(--os-text-1)]">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {byActor.map(a => {
          const cfg = ACTOR_CFG[a.actorType as keyof typeof ACTOR_CFG]
          return (
            <span key={a.actorType} className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: cfg?.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: cfg?.color }} />
              {cfg?.label ?? a.actorType} — {total > 0 ? ((a.count / total) * 100).toFixed(0) : 0}% ({a.count})
            </span>
          )
        })}
      </div>
    </div>
  )
}

function MetricsRow() {
  const { data } = useQuery({ queryKey: ['action-execution-metrics'], queryFn: () => actionEngineService.metrics() })
  if (!data) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="os-card p-4">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-1">Success Rate</p>
        <p className="text-2xl font-black text-[var(--os-text-1)]">{(data.successRate * 100).toFixed(0)}%</p>
      </div>
      <div className="os-card p-4">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-1">Avg Duration</p>
        <p className="text-2xl font-black text-[var(--os-text-1)]">{Math.round(data.avgDurationMs)}<span className="text-sm font-semibold text-[var(--os-text-2)]">ms</span></p>
      </div>
      <div className="os-card p-4">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-1">Total Executions</p>
        <p className="text-2xl font-black text-[var(--os-text-1)]">{data.total}</p>
      </div>
      <div className="os-card p-4">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-2">Actor Split — This Week</p>
        <ActorDonut byActor={data.byActor} />
      </div>
      {data.mostExecuted.length > 0 && (
        <div className="os-card p-4 col-span-2 lg:col-span-4">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-2">Most-Executed Actions</p>
          <div className="flex items-center gap-4 flex-wrap">
            {data.mostExecuted.map(a => (
              <div key={a.actionId} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--os-text-1)]">{a.displayName}</span>
                <span className="text-[10px] text-[var(--os-text-2)] bg-[var(--os-surface-0)] px-1.5 py-0.5 rounded font-mono">{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// S299 — AI Action Feed: live WebSocket stream of KIMMP/AEGIS ActionExecutions.
function AiActionFeed() {
  const [events, setEvents] = useState<ActionExecution[]>([])
  const [aiOnly, setAiOnly] = useState(true)

  useEffect(() => {
    connectSocket()
    const socket = getSocket()
    const onExecution = (execution: ActionExecution) => {
      setEvents(prev => [execution, ...prev].slice(0, 15))
    }
    socket.on('action:execution', onExecution)
    return () => { socket.off('action:execution', onExecution) }
  }, [])

  const visible = aiOnly ? events.filter(e => e.actorType !== 'HUMAN') : events

  return (
    <div className="os-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--os-border)]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] flex items-center gap-1.5">
          <Sparkle size={13} weight="fill" className="text-[#a855f7]" /> AI Action Feed
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" title="Live" />
        </p>
        <button onClick={() => setAiOnly(v => !v)} className="text-[10px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
          {aiOnly ? 'Showing KIMMP + AEGIS only' : 'Showing all actors'}
        </button>
      </div>
      {visible.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-[var(--os-text-2)]">Waiting for live executions…</div>
      ) : (
        <div className="divide-y divide-[var(--os-border)] max-h-64 overflow-y-auto">
          {visible.map(e => {
            const s = STATUS_CFG[e.status]
            const a = ACTOR_CFG[e.actorType]
            return (
              <div key={e.id} className="flex items-center gap-3 px-5 py-2.5">
                <a.Icon size={13} weight="fill" style={{ color: a.color }} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--os-text-1)] truncate">{e.action?.displayName ?? e.actionId}</p>
                  {e.reasoning && <p className="text-[10px] text-[var(--os-text-2)] truncate">{e.reasoning}</p>}
                </div>
                {e.confidence != null && <span className="text-[9px] text-[var(--os-text-2)] flex-shrink-0">{(e.confidence * 100).toFixed(0)}%</span>}
                <span className="text-[9px] font-bold flex-shrink-0" style={{ color: s.color }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ExecutionDetailDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { data: execution } = useQuery({ queryKey: ['action-execution', id], queryFn: () => actionEngineService.getExecution(id) })
  if (!execution) return null
  const status = STATUS_CFG[execution.status]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md h-full bg-[var(--os-card)] border-l border-[var(--os-border)] p-5 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">Execution Detail</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex items-center gap-2">
          <status.Icon size={16} weight="fill" style={{ color: status.color }} />
          <span className="text-sm font-bold" style={{ color: status.color }}>{status.label}</span>
          <span className="text-[10px] text-[var(--os-text-2)] ml-auto">{execution.durationMs}ms</span>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Action</p>
          <p className="text-sm text-[var(--os-text-1)] font-medium">{execution.action?.displayName ?? execution.actionId}</p>
        </div>
        {execution.object && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Object</p>
            <p className="text-sm text-[var(--os-text-1)]">{execution.object.type.displayName} · {execution.object.externalId ?? execution.object.id.slice(0, 12)}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Actor</p>
          <p className="text-sm text-[var(--os-text-1)]">{execution.actorType}{execution.confidence != null && ` · confidence ${(execution.confidence * 100).toFixed(0)}%`}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Params submitted</p>
          <pre className="text-[11px] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-2.5 overflow-x-auto">{JSON.stringify(execution.params, null, 2)}</pre>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Effects applied</p>
          <pre className="text-[11px] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-2.5 overflow-x-auto">{JSON.stringify(execution.effectsApplied, null, 2)}</pre>
        </div>
        {execution.errorMessage && (
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Error</p>
            <p className="text-xs text-red-400">{execution.errorMessage}</p>
          </div>
        )}
        <p className="text-[10px] text-[var(--os-text-2)]">{new Date(execution.createdAt).toLocaleString()}</p>
      </div>
    </div>
  )
}

export function ActionExecutionPage() {
  const qc = useQueryClient()
  const [actorType, setActorType] = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [detailId, setDetailId]   = useState<string | null>(null)
  const [seeded, setSeeded]       = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['action-executions', actorType, status, page],
    queryFn: () => actionEngineService.listExecutions({
      actorType: actorType || undefined, status: status || undefined, page, limit: 20,
    }),
  })

  const seedSystem = useMutation({
    mutationFn: () => actionEngineService.seedSystem(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-actions'] }); setSeeded(true) },
  })

  const executions = data?.executions ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><Scroll size={18} /> Action Execution Log</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">One audit trail for every write — human, KIMMP, or AEGIS.</p>
        </div>
        <button
          onClick={() => seedSystem.mutate()}
          disabled={seedSystem.isPending || seeded}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-50 transition-colors"
          title="Seed the system Actions (ANALYZE_CLIENT, RUN_AGENT, GENERATE_INSIGHT, STRATEGIC_DECISION, GOVERNANCE_BLOCK, BUDGET_DENY) that MissionDispatcher and AEGIS route through"
        >
          {seeded ? 'System Actions Seeded' : seedSystem.isPending ? 'Seeding…' : 'Seed System Actions'}
        </button>
      </div>

      <MetricsRow />
      <AiActionFeed />

      <div className="flex items-center gap-2">
        <select className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" value={actorType} onChange={e => { setActorType(e.target.value); setPage(1) }}>
          <option value="">All actors</option>
          <option value="HUMAN">Human</option>
          <option value="KIMMP">KIMMP</option>
          <option value="AEGIS">AEGIS</option>
        </select>
        <select className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div className="os-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[var(--os-text-2)]">Loading…</div>
        ) : executions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--os-text-2)]">No executions match these filters.</div>
        ) : (
          <div className="divide-y divide-[var(--os-border)]">
            {executions.map(e => {
              const s = STATUS_CFG[e.status]
              const a = ACTOR_CFG[e.actorType]
              return (
                <button key={e.id} onClick={() => setDetailId(e.id)} className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[var(--os-surface-0)] transition-colors">
                  <s.Icon size={15} weight="fill" style={{ color: s.color }} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">{e.action?.displayName ?? e.actionId}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
                      {e.object ? `${e.object.type.displayName} · ${e.object.externalId ?? e.object.id.slice(0, 8)}` : 'No object'}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 flex-shrink-0" style={{ background: `${a.color}15`, color: a.color }}>
                    <a.Icon size={10} weight="fill" /> {a.label}
                  </span>
                  <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 w-16 text-right">{e.durationMs}ms</span>
                  <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 w-16 text-right">{timeAgo(e.createdAt)}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-2xl border border-[var(--os-border)] text-xs text-[var(--os-text-2)] disabled:opacity-40">Prev</button>
          <span className="text-xs text-[var(--os-text-2)]">{page} / {data.pages}</span>
          <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page >= data.pages} className="px-3 py-1.5 rounded-2xl border border-[var(--os-border)] text-xs text-[var(--os-text-2)] disabled:opacity-40">Next</button>
        </div>
      )}

      {detailId && <ExecutionDetailDrawer id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  )
}
