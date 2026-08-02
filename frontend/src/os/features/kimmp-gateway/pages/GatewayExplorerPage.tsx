import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import {
  Radio, Scroll, ChartBar, ChartPie, ShieldWarning, Wallet, Wrench,
  Plus, Trash, X, Database, MagnifyingGlass,
} from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { gatewayService, type LlmCallLog } from '../gatewayService'

// S308-S310 — KIMMP Intelligence Gateway dashboard. Every LLM call — Claude,
// WAANDAx, Gen2, OpenAI, Gemini fallback — is logged in one table via
// passive instrumentation of the existing kimmpLLMRouter / withWaandax /
// AEGIS callLLM chokepoints (see backend commit for the full breakdown).
// S315 adds the Tool Calls tab — OntologyActions Claude invoked via S313/S314's
// tool-calling bridge, cross-linked to their ActionExecution rows.
// S318 adds the Index Health tab — pgvector coverage/size + index-vs-legacy
// latency benchmark + a live unified semantic search box.

type Tab = 'live' | 'calls' | 'cost' | 'models' | 'pii' | 'budgets' | 'tools' | 'index'

const TAB_DEFS: Array<{ id: Tab; label: string; icon: any }> = [
  { id: 'live',    label: 'Live Feed',      icon: Radio },
  { id: 'calls',   label: 'Call Log',       icon: Scroll },
  { id: 'cost',    label: 'Cost Analytics', icon: ChartBar },
  { id: 'models',  label: 'Models',         icon: ChartPie },
  { id: 'pii',     label: 'PII Incidents',  icon: ShieldWarning },
  { id: 'budgets', label: 'Token Budgets',  icon: Wallet },
  { id: 'tools',   label: 'Tool Calls',     icon: Wrench },
  { id: 'index',   label: 'Index Health',   icon: Database },
]

function fmtCost(c: number) { return c < 0.01 && c > 0 ? '<$0.01' : `$${c.toFixed(2)}` }
function fmtTokens(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }
function statusColor(status: string) {
  return status === 'SUCCESS' ? '#10b981' : status === 'BLOCKED' ? '#f59e0b' : '#ef4444'
}

function CallDetailModal({ call, onClose }: { call: LlmCallLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--os-text-1)]">{call.model} · {call.provider}</p>
          <button onClick={onClose}><X size={14} className="text-[var(--os-text-2)]" /></button>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${statusColor(call.status)}22`, color: statusColor(call.status) }}>{call.status}</span>
          <span className="px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{call.actorType}</span>
          {call.taskType && <span className="px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{call.taskType}</span>}
          <span className="text-[var(--os-text-2)]">{call.latencyMs}ms · {fmtTokens(call.promptTokens)}→{fmtTokens(call.completionTokens)} tok · {fmtCost(call.totalCost)}</span>
        </div>
        {call.piiDetected && (
          <div className="text-[10px] text-amber-400">PII detected: {call.piiPatterns.join(', ')}</div>
        )}
        <div>
          <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Prompt</p>
          <pre className="text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-3 whitespace-pre-wrap text-[var(--os-text-1)]">{call.prompt}</pre>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wide text-[var(--os-text-2)] mb-1">Response</p>
          <pre className="text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-3 whitespace-pre-wrap text-[var(--os-text-1)]">{call.response || (call.errorMessage ?? '(empty)')}</pre>
        </div>
      </div>
    </div>
  )
}

function LiveFeedTab() {
  const [events, setEvents] = useState<LlmCallLog[]>([])
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<LlmCallLog | null>(null)
  const runningCost = useRef(0)
  const [tickerCost, setTickerCost] = useState(0)

  const { data: initial } = useQuery({ queryKey: ['gateway-calls-initial'], queryFn: () => gatewayService.listCalls({ limit: 50 }) })

  useEffect(() => {
    if (initial?.calls && events.length === 0) {
      setEvents(initial.calls)
      runningCost.current = initial.calls.reduce((s, c) => s + c.totalCost, 0)
      setTickerCost(runningCost.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  useEffect(() => {
    const socket = io({ path: '/socket.io', transports: ['websocket'] })
    socket.on('gateway:call', (row: LlmCallLog) => {
      setEvents(prev => [row, ...prev].slice(0, 50))
      runningCost.current += row.totalCost
      setTickerCost(runningCost.current)
      setNewIds(prev => { const n = new Set(prev); n.add(row.id); setTimeout(() => setNewIds(s => { const c = new Set(s); c.delete(row.id); return c }), 2500); return n })
    })
    return () => { socket.disconnect() }
  }, [])

  return (
    <div className="space-y-3">
      <div className="os-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          <p className="text-xs font-semibold text-[var(--os-text-1)]">Live — last {events.length} calls</p>
        </div>
        <p className="text-lg font-black text-[var(--os-text-1)] tabular-nums">{fmtCost(tickerCost)} <span className="text-[10px] font-normal text-[var(--os-text-2)]">rolling</span></p>
      </div>
      <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
        {events.map(e => (
          <div key={e.id} onClick={() => setSelected(e)}
            className="os-card p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors"
            style={newIds.has(e.id) ? { borderColor: '#579bfc' } : undefined}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColor(e.status) }} />
              <span className="text-[11px] font-semibold text-[var(--os-text-1)] truncate">{e.model}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)] flex-shrink-0">{e.actorType}</span>
            </div>
            <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 tabular-nums">{e.latencyMs}ms · {fmtCost(e.totalCost)}</span>
          </div>
        ))}
      </div>
      {selected && <CallDetailModal call={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function CallLogTab() {
  const [filters, setFilters] = useState<{ actorType?: string; status?: string }>({})
  const [selected, setSelected] = useState<LlmCallLog | null>(null)
  const { data, isLoading } = useQuery({ queryKey: ['gateway-calls', filters], queryFn: () => gatewayService.listCalls({ ...filters, limit: 40 }) })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {['KIMMP', 'AEGIS', 'HUMAN'].map(a => (
          <button key={a} onClick={() => setFilters(f => ({ ...f, actorType: f.actorType === a ? undefined : a }))}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${filters.actorType === a ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
            {a}
          </button>
        ))}
        {['SUCCESS', 'ERROR', 'BLOCKED'].map(s => (
          <button key={s} onClick={() => setFilters(f => ({ ...f, status: f.status === s ? undefined : s }))}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${filters.status === s ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
            {s}
          </button>
        ))}
      </div>
      {isLoading ? <div className="os-card h-64 animate-pulse bg-[var(--os-surface-0)]" /> : (
        <div className="os-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-[var(--os-border)]">
              {['Model', 'Actor', 'Task', 'Tokens', 'Cost', 'Latency', 'Status', 'When'].map(h => (
                <th key={h} className="text-left px-3 py-2 font-semibold text-[var(--os-text-2)] uppercase tracking-wide text-[9px]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(data?.calls ?? []).map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-[var(--os-surface-0)]">
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-1)] font-medium truncate max-w-[160px]">{c.model}</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-2)]">{c.actorType}</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-2)]">{c.taskType ?? '—'}</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-2)] tabular-nums">{fmtTokens(c.promptTokens)}→{fmtTokens(c.completionTokens)}</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-1)] font-semibold tabular-nums">{fmtCost(c.totalCost)}</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-2)] tabular-nums">{c.latencyMs}ms</td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)]"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${statusColor(c.status)}22`, color: statusColor(c.status) }}>{c.status}</span></td>
                  <td className="px-3 py-2 border-t border-[var(--os-border)] text-[var(--os-text-2)]">{new Date(c.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <CallDetailModal call={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function CostAnalyticsTab() {
  const { data, isLoading } = useQuery({ queryKey: ['gateway-cost'], queryFn: () => gatewayService.costAnalytics(30) })
  if (isLoading) return <div className="os-card h-64 animate-pulse bg-[var(--os-surface-0)]" />
  if (!data) return null
  const maxDay = Math.max(...data.byDay.map(d => d.cost), 0.01)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="os-card p-4"><p className="text-[10px] text-[var(--os-text-2)] uppercase">30-day spend</p><p className="text-2xl font-black text-[var(--os-text-1)]">{fmtCost(data.totalCost)}</p></div>
        <div className="os-card p-4"><p className="text-[10px] text-[var(--os-text-2)] uppercase">Total tokens</p><p className="text-2xl font-black text-[var(--os-text-1)]">{fmtTokens(data.totalTokens)}</p></div>
        <div className="os-card p-4"><p className="text-[10px] text-[var(--os-text-2)] uppercase">Calls</p><p className="text-2xl font-black text-[var(--os-text-1)]">{data.callCount}</p></div>
      </div>
      <div className="os-card p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-3">Daily spend</p>
        <div className="flex items-end gap-1 h-32">
          {data.byDay.map(d => (
            <div key={d.date} className="flex-1 bg-[#579bfc] rounded-t opacity-80 hover:opacity-100" style={{ height: `${Math.max(2, (d.cost / maxDay) * 100)}%` }} title={`${d.date}: ${fmtCost(d.cost)}`} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="os-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-3">By actor type</p>
          <div className="space-y-2">
            {data.byActorType.sort((a, b) => b.cost - a.cost).map(a => (
              <div key={a.actorType} className="flex items-center justify-between text-xs">
                <span className="text-[var(--os-text-2)]">{a.actorType}</span>
                <span className="font-semibold text-[var(--os-text-1)] tabular-nums">{fmtCost(a.cost)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="os-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-3">By task type</p>
          <div className="space-y-2">
            {data.byTaskType.sort((a, b) => b.cost - a.cost).slice(0, 8).map(t => (
              <div key={t.taskType} className="flex items-center justify-between text-xs">
                <span className="text-[var(--os-text-2)]">{t.taskType}</span>
                <span className="font-semibold text-[var(--os-text-1)] tabular-nums">{fmtCost(t.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelsTab() {
  const { data, isLoading } = useQuery({ queryKey: ['gateway-models'], queryFn: () => gatewayService.modelAnalytics(30) })
  if (isLoading) return <div className="os-card h-64 animate-pulse bg-[var(--os-surface-0)]" />
  const models = data?.models ?? []
  const maxCalls = Math.max(...models.map(m => m.callCount), 1)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map(m => (
        <div key={m.model} className="os-card p-4 space-y-2">
          <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{m.model}</p>
          <div className="h-1.5 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
            <div className="h-full bg-[#579bfc]" style={{ width: `${(m.callCount / maxCalls) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-[var(--os-text-2)]">
            <span>{m.callCount} calls</span>
            <span>{m.avgLatencyMs}ms avg</span>
            <span className="font-semibold text-[var(--os-text-1)]">{fmtCost(m.totalCost)}</span>
          </div>
        </div>
      ))}
      {models.length === 0 && <p className="text-xs text-[var(--os-text-2)] col-span-full text-center py-8">No calls logged yet</p>}
    </div>
  )
}

function PiiIncidentsTab() {
  const { data, isLoading } = useQuery({ queryKey: ['gateway-pii'], queryFn: () => gatewayService.piiIncidents() })
  const { data: configs } = useQuery({ queryKey: ['gateway-pii-config'], queryFn: () => gatewayService.piiConfigs() })
  const qc = useQueryClient()
  const activate = useMutation({
    mutationFn: (id: string) => gatewayService.updatePiiConfig(id, { active: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateway-pii-config'] }),
  })
  const seed = useMutation({
    mutationFn: () => gatewayService.createPiiConfig({ name: 'default', mode: 'AUDIT' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateway-pii-config'] }),
  })

  return (
    <div className="space-y-4">
      <div className="os-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">PII scan profiles</p>
          {(!configs || configs.length === 0) && (
            <button onClick={() => seed.mutate()} className="text-[10px] font-semibold text-[#579bfc]">+ Seed default profile</button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(configs ?? []).map(c => (
            <button key={c.id} onClick={() => activate.mutate(c.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border ${c.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
              {c.name} · {c.mode}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? <div className="os-card h-40 animate-pulse bg-[var(--os-surface-0)]" /> : (data ?? []).length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No PII incidents detected</div>
      ) : (
        <div className="space-y-1.5">
          {(data ?? []).map(i => (
            <div key={i.id} className="os-card p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--os-text-1)]">{i.actorType} · {i.sourceModule ?? 'unknown'}</p>
                <p className="text-[10px] text-[var(--os-text-2)]">{i.piiPatterns.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: `${statusColor(i.status)}22`, color: statusColor(i.status) }}>{i.status}</span>
                <span className="text-[9px] text-[var(--os-text-2)]">{new Date(i.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BudgetsTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [userId, setUserId] = useState('')
  const [limit, setLimit] = useState('1000000')
  const [hardStop, setHardStop] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['gateway-budgets'], queryFn: () => gatewayService.budgets() })
  const create = useMutation({
    mutationFn: () => gatewayService.createBudget({ userId, monthlyTokenLimit: parseInt(limit), hardStop }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gateway-budgets'] }); setShowForm(false); setUserId('') },
  })
  const remove = useMutation({
    mutationFn: (id: string) => gatewayService.removeBudget(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gateway-budgets'] }),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--os-text-2)]">Monthly token budgets, computed live from the call log — no separate counter to drift.</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold">
          <Plus size={12} /> New budget
        </button>
      </div>

      {showForm && (
        <div className="os-card p-4 space-y-2">
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <input value={limit} onChange={e => setLimit(e.target.value)} type="number" placeholder="Monthly token limit" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <label className="flex items-center gap-1.5 text-[11px] text-[var(--os-text-2)]">
            <input type="checkbox" checked={hardStop} onChange={e => setHardStop(e.target.checked)} /> Hard stop (429 over limit)
          </label>
          <div className="flex items-center gap-2">
            <button onClick={() => create.mutate()} disabled={create.isPending || !userId.trim()} className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
              {create.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="os-card h-32 animate-pulse bg-[var(--os-surface-0)]" /> : (data ?? []).length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No budgets configured — every call is logged for visibility regardless</div>
      ) : (
        <div className="space-y-2">
          {(data ?? []).map(b => {
            const pct = Math.min(100, (b.usedTokens / b.monthlyTokenLimit) * 100)
            const over = pct >= b.alertThreshold * 100
            return (
              <div key={b.id} className="os-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[var(--os-text-1)]">{b.userId ?? b.teamId}</p>
                  <div className="flex items-center gap-2">
                    {b.hardStop && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">HARD STOP</span>}
                    <button onClick={() => remove.mutate(b.id)}><Trash size={12} className="text-[var(--os-text-2)] hover:text-red-400" /></button>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
                  <div className="h-full" style={{ width: `${pct}%`, background: over ? '#ef4444' : '#579bfc' }} />
                </div>
                <p className="text-[10px] text-[var(--os-text-2)] tabular-nums">{fmtTokens(b.usedTokens)} / {fmtTokens(b.monthlyTokenLimit)} tokens this month</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ToolCallsTab() {
  const [selected, setSelected] = useState<LlmCallLog | null>(null)
  const { data, isLoading } = useQuery({ queryKey: ['gateway-tool-calls'], queryFn: () => gatewayService.toolCalls({ limit: 40 }) })
  const rows = data?.rows ?? []

  if (isLoading) return <div className="os-card h-64 animate-pulse bg-[var(--os-surface-0)]" />
  if (rows.length === 0) {
    return (
      <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">
        No tool-invoked OntologyActions yet. Mark an action <code className="font-mono">toolCallable</code> in the Ontology → Actions page and ask KIMMP to use it.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rows.map(({ call, executions }) => (
        <div key={call.id} className="os-card p-3 space-y-2 cursor-pointer hover:bg-[var(--os-surface-0)]" onClick={() => setSelected(call)}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--os-text-1)]">{call.model} · {call.actorType}</p>
            <span className="text-[9px] text-[var(--os-text-2)]">{new Date(call.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {executions.map(ex => (
              <span key={ex.id} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <Wrench size={10} className="text-[var(--os-text-2)]" />
                <span className="text-[var(--os-text-1)]">{ex.action?.displayName ?? ex.action?.name ?? 'Unknown action'}</span>
                {ex.object && <span className="text-[var(--os-text-2)]">on {ex.object.type.displayName}</span>}
                <span style={{ color: statusColor(ex.status) }}>{ex.status}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
      {selected && <CallDetailModal call={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

const TABLE_LABEL: Record<string, string> = {
  knowledge_chunks: 'Knowledge Chunks (public KB)',
  kimmp_system_knowledge: 'System Knowledge (8 RAG systems)',
}

function IndexHealthTab() {
  const qc = useQueryClient()
  const { data: health, isLoading } = useQuery({ queryKey: ['pgvector-health'], queryFn: () => gatewayService.pgvectorHealth() })
  const backfill = useMutation({
    mutationFn: () => gatewayService.pgvectorBackfill(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pgvector-health'] }),
  })
  const benchmark = useMutation({ mutationFn: () => gatewayService.pgvectorBenchmark() })

  const [query, setQuery] = useState('')
  const search = useMutation({ mutationFn: () => gatewayService.knowledgeSearch(query, 6) })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--os-text-2)]">pgvector HNSW index over the two embedding stores — semantic search that used to scan every row now queries a real index.</p>
        <button onClick={() => backfill.mutate()} disabled={backfill.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
          {backfill.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Run backfill'}
        </button>
      </div>

      {isLoading ? <div className="os-card h-32 animate-pulse bg-[var(--os-surface-0)]" /> : (
        <div className="grid grid-cols-2 gap-4">
          {(health ?? []).map(h => {
            const pct = h.totalRows > 0 ? (h.indexedRows / h.totalRows) * 100 : 0
            return (
              <div key={h.table} className="os-card p-4 space-y-2">
                <p className="text-xs font-bold text-[var(--os-text-1)]">{TABLE_LABEL[h.table] ?? h.table}</p>
                <div className="h-1.5 rounded-full bg-[var(--os-surface-0)] overflow-hidden">
                  <div className="h-full bg-[#579bfc]" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--os-text-2)]">
                  <span>{h.indexedRows} / {h.totalRows} rows indexed ({pct.toFixed(0)}%)</span>
                  <span className="font-semibold text-[var(--os-text-1)]">{fmtBytes(h.indexSizeBytes)} on disk</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="os-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Latency — index vs. legacy full scan</p>
          <button onClick={() => benchmark.mutate()} disabled={benchmark.isPending} className="text-[10px] font-semibold text-[#579bfc]">
            {benchmark.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Run benchmark'}
          </button>
        </div>
        {benchmark.data ? (
          <div className="grid grid-cols-2 gap-4">
            {benchmark.data.map(b => (
              <div key={b.table} className="space-y-1.5">
                <p className="text-[11px] font-bold text-[var(--os-text-1)]">{TABLE_LABEL[b.table] ?? b.table}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#10b981] font-semibold">Index: p50 {b.indexMs.p50.toFixed(1)}ms · p95 {b.indexMs.p95.toFixed(1)}ms</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[var(--os-text-2)]">Legacy scan ({b.rowsScanned} rows): p50 {b.legacyScanMs.p50.toFixed(1)}ms · p95 {b.legacyScanMs.p95.toFixed(1)}ms</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-[var(--os-text-2)]">Run the benchmark to compare — same query, {'>'}=7 samples each path.</p>
        )}
      </div>

      <div className="os-card p-4 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Try unified search</p>
        <div className="flex items-center gap-2">
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && query.trim() && search.mutate()}
            placeholder="Search both knowledge stores…" className="flex-1 px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <button onClick={() => search.mutate()} disabled={search.isPending || !query.trim()} className="p-2 rounded-md bg-[var(--os-accent)] text-white disabled:opacity-50">
            {search.isPending ? <Loader2 size={13} className="animate-spin" /> : <MagnifyingGlass size={13} />}
          </button>
        </div>
        {search.data && (
          <div className="space-y-1.5">
            {search.data.length === 0 ? <p className="text-[11px] text-[var(--os-text-2)]">No results</p> : search.data.map(r => (
              <div key={r.id} className="p-2.5 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-[var(--os-text-1)]">{r.title}</p>
                  <span className="text-[9px] text-[var(--os-text-2)] tabular-nums">{r.score.toFixed(3)}</span>
                </div>
                <p className="text-[9px] text-[var(--os-text-2)] mb-1">{r.source === 'knowledge_chunk' ? 'Public KB' : `${r.system} · ${r.docType}`}</p>
                <p className="text-[10px] text-[var(--os-text-2)] line-clamp-2">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function GatewayExplorerPage() {
  const [tab, setTab] = useState<Tab>('live')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-black tracking-tight mb-1" style={{ color: 'var(--os-text-1)' }}>Intelligence Gateway</h1>
        <p className="text-xs text-[var(--os-text-2)]">Every LLM call — Claude, WAANDAx, Gen2, fallback — logged, PII-scanned, and budget-checked in one place.</p>
      </div>

      <div className="flex items-center gap-1 border-b border-[var(--os-border)] overflow-x-auto">
        {TAB_DEFS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px whitespace-nowrap ${tab === t.id ? 'border-[#579bfc] text-[#579bfc]' : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'}`}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'live' && <LiveFeedTab />}
      {tab === 'calls' && <CallLogTab />}
      {tab === 'cost' && <CostAnalyticsTab />}
      {tab === 'models' && <ModelsTab />}
      {tab === 'pii' && <PiiIncidentsTab />}
      {tab === 'budgets' && <BudgetsTab />}
      {tab === 'tools' && <ToolCallsTab />}
      {tab === 'index' && <IndexHealthTab />}
    </div>
  )
}
