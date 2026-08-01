import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Scroll, X, CheckCircle, XCircle, ShieldWarning, Robot, User, ShieldCheck } from '@phosphor-icons/react'
import { actionEngineService, type ActionExecution } from '../actionEngineService'

const STATUS_CFG = {
  SUCCESS: { label: 'Success', color: '#10b981', Icon: CheckCircle },
  FAILED:  { label: 'Failed',  color: '#ef4444', Icon: XCircle },
  BLOCKED: { label: 'Blocked', color: '#f59e0b', Icon: ShieldWarning },
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

function MetricsRow() {
  const { data } = useQuery({ queryKey: ['action-execution-metrics'], queryFn: () => actionEngineService.metrics() })
  if (!data) return null
  const total = data.byActor.reduce((s, a) => s + a.count, 0) || 1
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
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-2">Actor Split</p>
        <div className="flex h-2 rounded-full overflow-hidden bg-[var(--os-surface-0)]">
          {data.byActor.map(a => (
            <div key={a.actorType} style={{ width: `${(a.count / total) * 100}%`, background: ACTOR_CFG[a.actorType as keyof typeof ACTOR_CFG]?.color ?? '#94a3b8' }} title={`${a.actorType}: ${a.count}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {data.byActor.map(a => (
            <span key={a.actorType} className="text-[9px] font-semibold flex items-center gap-1" style={{ color: ACTOR_CFG[a.actorType as keyof typeof ACTOR_CFG]?.color }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: ACTOR_CFG[a.actorType as keyof typeof ACTOR_CFG]?.color }} />
              {a.actorType} {a.count}
            </span>
          ))}
        </div>
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
          <pre className="text-[11px] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-2.5 overflow-x-auto">{JSON.stringify(execution.params, null, 2)}</pre>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Effects applied</p>
          <pre className="text-[11px] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-2.5 overflow-x-auto">{JSON.stringify(execution.effectsApplied, null, 2)}</pre>
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
  const [actorType, setActorType] = useState('')
  const [status, setStatus]       = useState('')
  const [page, setPage]           = useState(1)
  const [detailId, setDetailId]   = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['action-executions', actorType, status, page],
    queryFn: () => actionEngineService.listExecutions({
      actorType: actorType || undefined, status: status || undefined, page, limit: 20,
    }),
  })

  const executions = data?.executions ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><Scroll size={18} /> Action Execution Log</h2>
        <p className="text-xs text-[var(--os-text-2)] mt-0.5">One audit trail for every write — human, KIMMP, or AEGIS.</p>
      </div>

      <MetricsRow />

      <div className="flex items-center gap-2">
        <select className="px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" value={actorType} onChange={e => { setActorType(e.target.value); setPage(1) }}>
          <option value="">All actors</option>
          <option value="HUMAN">Human</option>
          <option value="KIMMP">KIMMP</option>
          <option value="AEGIS">AEGIS</option>
        </select>
        <select className="px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
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
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-xs text-[var(--os-text-2)] disabled:opacity-40">Prev</button>
          <span className="text-xs text-[var(--os-text-2)]">{page} / {data.pages}</span>
          <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page >= data.pages} className="px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-xs text-[var(--os-text-2)] disabled:opacity-40">Next</button>
        </div>
      )}

      {detailId && <ExecutionDetailDrawer id={detailId} onClose={() => setDetailId(null)} />}
    </div>
  )
}
