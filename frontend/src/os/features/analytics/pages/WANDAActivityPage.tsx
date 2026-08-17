import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Brain, Zap, Radio, DollarSign, Activity, Wifi } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'
import { connectSocket, getSocket } from '@lib/socket'

interface Signal {
  id: string
  type?: string
  category?: string
  priority?: string
  title?: string
  summary?: string
  confidence?: number
  createdAt: string
  module?: string
}

interface Decision {
  id: string
  title?: string
  status?: string
  priority?: string
  createdAt: string
}

interface Action {
  id: string
  type?: string
  status?: string
  description?: string
  createdAt?: string
  executedAt?: string
}

interface GovCost {
  totalTokens?: number
  totalCost?: number
  callCount?: number
  avgCostPerCall?: number
  period?: string
}

interface SignalKPI {
  total?: number
  byCategory?: Record<string, number>
  byPriority?: Record<string, number>
  avgConfidence?: number
}

const DEMO_SIGNALS: Signal[] = [
  { id: 's1', type: 'proactive', category: 'revenue',      priority: 'high',   title: 'Proposal M3 approaching deadline',           confidence: 89, createdAt: new Date(Date.now() - 2e6).toISOString(),  module: 'Leads' },
  { id: 's2', type: 'reactive',  category: 'ops',          priority: 'medium', title: 'Sprint delivery at 73% with 3 days remaining', confidence: 92, createdAt: new Date(Date.now() - 5e6).toISOString(),  module: 'Projects' },
  { id: 's3', type: 'proactive', category: 'intelligence', priority: 'high',   title: '4 decisions pending > 7 days, risk of staleness', confidence: 95, createdAt: new Date(Date.now() - 9e6).toISOString(), module: 'Decisions' },
  { id: 's4', type: 'reactive',  category: 'finance',      priority: 'low',    title: 'Invoice INV-047 scheduled for auto-chase',    confidence: 99, createdAt: new Date(Date.now() - 14e6).toISOString(), module: 'Finance' },
  { id: 's5', type: 'proactive', category: 'hr',           priority: 'medium', title: 'Onboarding task overdue for new consultant',   confidence: 87, createdAt: new Date(Date.now() - 18e6).toISOString(), module: 'HR' },
]

const DEMO_DECISIONS: Decision[] = [
  { id: 'd1', title: 'Expand Q3 capacity by 2 FTEs',        status: 'PENDING', priority: 'HIGH',   createdAt: new Date(Date.now() - 5e8).toISOString() },
  { id: 'd2', title: 'Accept Birla DL expansion proposal',  status: 'RESOLVED', priority: 'HIGH',  createdAt: new Date(Date.now() - 2e8).toISOString() },
  { id: 'd3', title: 'Suspend BFSI industry pack until Q4', status: 'PENDING', priority: 'MEDIUM', createdAt: new Date(Date.now() - 1e8).toISOString() },
]

const DEMO_COST: GovCost = { totalTokens: 843200, totalCost: 1.84, callCount: 142, avgCostPerCall: 0.013, period: 'This month' }

const DEMO_KPI: SignalKPI = {
  total: 47,
  byCategory: { revenue: 12, ops: 14, finance: 8, intelligence: 9, hr: 4 },
  byPriority: { high: 18, medium: 21, low: 8 },
  avgConfidence: 91.4,
}

const PRIORITY_COLOR: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#10b981', critical: '#7c3aed',
}

const CATEGORY_COLOR: Record<string, string> = {
  revenue: '#3b82f6', ops: '#8b5cf6', finance: '#10b981',
  intelligence: '#f59e0b', hr: '#ec4899', risk: '#ef4444',
}

function TimeSince({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return <>{mins}m ago</>
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return <>{hrs}h ago</>
  return <>{Math.floor(hrs / 24)}d ago</>
}

interface LiveEntry {
  id: string
  text: string
  ts: string
}

export function WANDAActivityPage() {
  const [liveFeed, setLiveFeed] = useState<LiveEntry[]>([])
  const [wsLive, setWsLive] = useState(false)

  useEffect(() => {
    connectSocket()
    const socket = getSocket()
    const ts = () => new Date().toISOString().split('T')[1].substring(0, 8)

    const onLog = (msg: string) => {
      setLiveFeed(prev => {
        const entry: LiveEntry = { id: `${Date.now()}-${Math.random()}`, text: msg, ts: ts() }
        const next = [entry, ...prev]
        return next.length > 30 ? next.slice(0, 30) : next
      })
    }
    const onTopology = (agents: Array<{ name: string; status: string }>) => {
      const working = agents.filter(a => a.status === 'WORKING').length
      onLog(`[SWARM] Topology synced — ${agents.length} agents, ${working} active`)
      setWsLive(true)
    }
    const onDisconnect = () => setWsLive(false)

    socket.on('SWARM_LOG',       onLog)
    socket.on('SWARM_TOPOLOGY',  onTopology)
    socket.on('disconnect',      onDisconnect)

    if (socket.connected) setWsLive(true)

    return () => {
      socket.off('SWARM_LOG',      onLog)
      socket.off('SWARM_TOPOLOGY', onTopology)
      socket.off('disconnect',     onDisconnect)
    }
  }, [])

  const { data: signals, isLoading: loadS } = useQuery<Signal[]>({
    queryKey: ['kimmp-signals'],
    queryFn: () => api.get('/admin/kangqore-immp/signals?limit=20').then(r => {
      const d = r.data
      return Array.isArray(d) ? d : (d?.signals ?? [])
    }),
    enabled: !isDemo(),
    staleTime: 1000 * 60,
    refetchInterval: isDemo() ? false : 1000 * 60,
  })

  const { data: sigKpi, isLoading: loadKpi } = useQuery<SignalKPI>({
    queryKey: ['kimmp-signal-kpi'],
    queryFn: () => api.get('/admin/kangqore-immp/signals/kpi').then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: decisions, isLoading: loadD } = useQuery<Decision[]>({
    queryKey: ['kimmp-decisions-list'],
    queryFn: () => api.get('/admin/kangqore-immp/decisions').then(r => {
      const d = r.data
      return Array.isArray(d) ? d : (d?.decisions ?? [])
    }),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: govCost } = useQuery<GovCost>({
    queryKey: ['kimmp-gov-cost'],
    queryFn: () => api.get('/admin/kangqore-immp/governance/cost').then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 10,
  })

  const signalList  = signals   ?? (isDemo() ? DEMO_SIGNALS   : [])
  const kpi         = sigKpi    ?? (isDemo() ? DEMO_KPI       : null)
  const decList     = decisions ?? (isDemo() ? DEMO_DECISIONS  : [])
  const cost        = govCost   ?? (isDemo() ? DEMO_COST       : null)
  const isLoading   = !isDemo() && (loadS || loadKpi || loadD)

  const pendingDec  = decList.filter(d => d.status === 'PENDING').length
  const resolvedDec = decList.filter(d => d.status === 'RESOLVED' || d.status === 'EXECUTED').length

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading WAANDA activity…
        </div>
      )}

      {/* Live KIMMP Event Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${wsLive ? 'text-green-400' : 'text-slate-500'}`} />
            Live KIMMP Feed
            {wsLive && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody>
          {liveFeed.length === 0 ? (
            <p className="text-xs text-[var(--os-text-3)] py-2">
              {wsLive ? 'Waiting for KIMMP events…' : 'Connecting to KIMMP runtime…'}
            </p>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {liveFeed.map(entry => (
                <div key={entry.id} className="flex items-start gap-2 text-xs font-mono">
                  <span className="text-[var(--os-text-3)] shrink-0">{entry.ts}</span>
                  <span className={`${entry.text.startsWith('!!') ? 'text-red-400' : entry.text.startsWith('>>') ? 'text-cyan-400' : 'text-[var(--os-text-2)]'}`}>
                    {entry.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Total Signals</p>
          <span className="text-3xl font-extrabold text-blue-400">{kpi?.total ?? signalList.length}</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Active in ledger</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Avg Confidence</p>
          <span className="text-3xl font-extrabold text-green-400">
            {kpi?.avgConfidence != null ? `${kpi.avgConfidence.toFixed(0)}%` : '—'}
          </span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Signal quality</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Pending Decisions</p>
          <span className={`text-3xl font-extrabold ${pendingDec > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {pendingDec}
          </span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">{resolvedDec} resolved total</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">AI Cost (MTD)</p>
          <span className="text-3xl font-extrabold text-violet-400">
            {cost?.totalCost != null ? `$${cost.totalCost.toFixed(2)}` : '—'}
          </span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">
            {cost?.callCount != null ? `${cost.callCount} calls` : 'Claude API spend'}
          </p>
        </div>
      </div>

      {/* Category + Priority distribution */}
      {kpi && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Signal Categories
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {Object.entries(kpi.byCategory ?? {}).sort(([, a], [, b]) => b - a).map(([cat, count]) => {
                const total = kpi.total || 1
                const pct = (count / total) * 100
                const color = CATEGORY_COLOR[cat] ?? '#8896c0'
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="capitalize font-medium text-[var(--os-text-1)]">{cat}</span>
                      <span className="font-bold font-mono text-[var(--os-text-1)]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Priority Breakdown
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {Object.entries(kpi.byPriority ?? {}).sort(([, a], [, b]) => b - a).map(([pri, count]) => {
                const total = kpi.total || 1
                const pct = (count / total) * 100
                const color = PRIORITY_COLOR[pri] ?? '#8896c0'
                return (
                  <div key={pri}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="capitalize font-medium text-[var(--os-text-1)]">{pri}</span>
                      <span className="font-bold font-mono text-[var(--os-text-1)]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Live signal feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-green-400" />
            Live Signal Feed
            <span className="text-xs font-normal text-[var(--os-text-3)]">— latest 20 KIMMP signals</span>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {signalList.length === 0 ? (
            <p className="text-sm text-[var(--os-text-3)] px-5 py-6 text-center">No signals in ledger yet.</p>
          ) : (
            <div className="divide-y divide-[var(--os-border)]">
              {signalList.slice(0, 10).map(sig => {
                const priColor = PRIORITY_COLOR[sig.priority ?? ''] ?? '#8896c0'
                const catColor = CATEGORY_COLOR[sig.category ?? ''] ?? '#8896c0'
                return (
                  <div key={sig.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--os-bg2)] transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: priColor }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: catColor }}>
                          {sig.category}
                        </span>
                        {sig.module && (
                          <Badge size="sm" variant="ghost">{sig.module}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[var(--os-text-1)] truncate">{sig.title}</p>
                      {sig.summary && (
                        <p className="text-xs text-[var(--os-text-2)] mt-0.5 line-clamp-1">{sig.summary}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {sig.confidence != null && (
                        <p className="text-xs font-bold text-[var(--os-text-1)]">{sig.confidence}%</p>
                      )}
                      <p className="text-xs text-[var(--os-text-3)]">
                        <TimeSince iso={sig.createdAt} />
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Decision Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-400" />
            Decision Engine Status
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {decList.length === 0 ? (
            <p className="text-sm text-[var(--os-text-3)] px-5 py-6 text-center">No decisions recorded yet.</p>
          ) : (
            <div className="divide-y divide-[var(--os-border)]">
              {decList.slice(0, 8).map(dec => (
                <div key={dec.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--os-text-1)] truncate">
                      {dec.title ?? 'Untitled decision'}
                    </p>
                    <p className="text-xs text-[var(--os-text-3)] mt-0.5">
                      {new Date(dec.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dec.priority && (
                      <Badge
                        size="sm"
                        variant={dec.priority === 'HIGH' ? 'danger' : dec.priority === 'MEDIUM' ? 'warning' : 'ghost'}
                      >
                        {dec.priority}
                      </Badge>
                    )}
                    <Badge
                      size="sm"
                      variant={
                        dec.status === 'RESOLVED' || dec.status === 'EXECUTED' ? 'success'
                        : dec.status === 'PENDING' ? 'warning'
                        : 'ghost'
                      }
                    >
                      {dec.status ?? 'UNKNOWN'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* AI Governance Cost */}
      {cost && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              AI Governance — Token & Cost
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Tokens', value: cost.totalTokens != null ? cost.totalTokens.toLocaleString() : '—' },
                { label: 'Total Cost',   value: cost.totalCost   != null ? `$${cost.totalCost.toFixed(4)}` : '—' },
                { label: 'API Calls',    value: cost.callCount   != null ? String(cost.callCount) : '—' },
                { label: 'Avg / Call',   value: cost.avgCostPerCall != null ? `$${cost.avgCostPerCall.toFixed(4)}` : '—' },
              ].map(item => (
                <div key={item.label} className="bg-[var(--os-bg2)] rounded-2xl p-3">
                  <p className="text-xs text-[var(--os-text-3)] mb-1">{item.label}</p>
                  <p className="text-lg font-bold font-mono text-[var(--os-text-1)]">{item.value}</p>
                </div>
              ))}
            </div>
            {cost.period && (
              <p className="text-xs text-[var(--os-text-3)] mt-3">{cost.period}</p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
