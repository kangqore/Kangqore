import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, isDemo } from '@lib/api'
import { connectSocket, getSocket } from '@lib/socket'
import { Bot, CheckCircle, Clock, AlertCircle, WifiOff } from 'lucide-react'

interface AgentNode {
  id: string
  name: string
  role: 'RESEARCH' | 'SCRAPER' | 'DIAGNOSTICS' | 'EXECUTION' | 'COACH'
  status: 'IDLE' | 'WORKING' | 'ERROR' | 'OFFLINE'
  currentTask?: string
  taskProgress?: number
  completedTasks?: number
  spawnedAt?: string
}

const ROLE_COLOR: Record<string, string> = {
  RESEARCH:    '#3b82f6',
  SCRAPER:     '#8b5cf6',
  DIAGNOSTICS: '#f59e0b',
  EXECUTION:   '#22c55e',
  COACH:       '#14b8a6',
}

const STATUS_COLOR: Record<string, string> = {
  WORKING: '#22c55e',
  IDLE:    '#64748b',
  ERROR:   '#ef4444',
  OFFLINE: '#374151',
}

const DEMO_AGENTS: AgentNode[] = [
  { id: 'a1', name: 'Scout-Alpha',  role: 'RESEARCH',    status: 'WORKING',  currentTask: 'Market intelligence sweep', taskProgress: 67, completedTasks: 34, spawnedAt: new Date(Date.now() - 8.6e6).toISOString() },
  { id: 'a2', name: 'Crawler-01',   role: 'SCRAPER',     status: 'WORKING',  currentTask: 'LinkedIn data extraction', taskProgress: 41, completedTasks: 18, spawnedAt: new Date(Date.now() - 4.3e6).toISOString() },
  { id: 'a3', name: 'Diag-Prime',   role: 'DIAGNOSTICS', status: 'IDLE',     completedTasks: 52, spawnedAt: new Date(Date.now() - 1.7e7).toISOString() },
  { id: 'a4', name: 'Executor-X',   role: 'EXECUTION',   status: 'WORKING',  currentTask: 'Generating client proposal', taskProgress: 88, completedTasks: 7, spawnedAt: new Date(Date.now() - 2.1e6).toISOString() },
  { id: 'a5', name: 'Coach-Omega',  role: 'COACH',       status: 'IDLE',     completedTasks: 23, spawnedAt: new Date(Date.now() - 9.8e6).toISOString() },
]

function StatusIcon({ status }: { status: string }) {
  if (status === 'WORKING') return <CheckCircle className="w-3.5 h-3.5 text-green-400 animate-pulse" />
  if (status === 'ERROR')   return <AlertCircle className="w-3.5 h-3.5 text-red-400" />
  if (status === 'OFFLINE') return <WifiOff className="w-3.5 h-3.5 text-slate-500" />
  return <Clock className="w-3.5 h-3.5 text-slate-400" />
}

function AgentCard({ agent, liveProgress }: { agent: AgentNode; liveProgress: number | undefined }) {
  const roleColor  = ROLE_COLOR[agent.role]  ?? '#64748b'
  const statusColor = STATUS_COLOR[agent.status] ?? '#64748b'
  const progress = liveProgress ?? agent.taskProgress ?? 0
  const isWorking = agent.status === 'WORKING'

  const uptime = agent.spawnedAt
    ? (() => {
        const diff = Date.now() - new Date(agent.spawnedAt).getTime()
        const h = Math.floor(diff / 3.6e6)
        const m = Math.floor((diff % 3.6e6) / 60000)
        return h > 0 ? `${h}h ${m}m` : `${m}m`
      })()
    : '—'

  return (
    <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden">
      {/* role color stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: roleColor }} />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${roleColor}18` }}>
            <Bot className="w-4 h-4" style={{ color: roleColor }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--os-text-1)]">{agent.name}</p>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: roleColor, backgroundColor: `${roleColor}14` }}>
              {agent.role}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusIcon status={agent.status} />
          <span className="text-[11px] font-semibold" style={{ color: statusColor }}>{agent.status}</span>
        </div>
      </div>

      {/* task + progress */}
      {isWorking && (
        <div className="pl-2">
          {agent.currentTask && (
            <p className="text-xs text-[var(--os-text-2)] mb-2 truncate">{agent.currentTask}</p>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[var(--os-border)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: roleColor }}
              />
            </div>
            <span className="text-[10px] font-mono text-[var(--os-text-3)]">{progress}%</span>
          </div>
        </div>
      )}

      {/* footer stats */}
      <div className="flex items-center gap-4 pl-2 text-[11px] text-[var(--os-text-3)]">
        <span><span className="font-bold text-[var(--os-text-1)]">{agent.completedTasks ?? 0}</span> tasks done</span>
        <span>Up {uptime}</span>
      </div>
    </div>
  )
}

export function AgentPerformancePage() {
  const [liveAgents, setLiveAgents] = useState<AgentNode[]>([])
  const [liveProgress, setLiveProgress] = useState<Record<string, number>>({})
  const [wsLive, setWsLive] = useState(false)

  const { data: fetchedAgents } = useQuery<AgentNode[]>({
    queryKey: ['swarm-enriched-analytics'],
    queryFn: () => api.get('/admin/kangqore-immp/swarm/enriched').then(r => {
      const d = r.data
      return Array.isArray(d) ? d : (d?.agents ?? [])
    }),
    enabled: !isDemo(),
    staleTime: 1000 * 30,
  })

  useEffect(() => {
    if (isDemo()) return
    if (!fetchedAgents?.length) return
    setLiveAgents(fetchedAgents)
  }, [fetchedAgents])

  useEffect(() => {
    connectSocket()
    const socket = getSocket()

    const onTopology = (agents: AgentNode[]) => {
      setLiveAgents(agents)
      setWsLive(true)
    }
    const onProgress = ({ id, progress }: { id: string; progress: number }) => {
      setLiveProgress(prev => ({ ...prev, [id]: progress }))
    }
    const onDisconnect = () => setWsLive(false)

    socket.on('SWARM_TOPOLOGY', onTopology)
    socket.on('AGENT_PROGRESS', onProgress)
    socket.on('disconnect', onDisconnect)

    if (socket.connected) {
      setWsLive(true)
      socket.emit('request:swarm_topology')
    }

    return () => {
      socket.off('SWARM_TOPOLOGY', onTopology)
      socket.off('AGENT_PROGRESS', onProgress)
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  const agents = isDemo() ? DEMO_AGENTS : (liveAgents.length ? liveAgents : (fetchedAgents ?? []))

  const totalTasks   = agents.reduce((s, a) => s + (a.completedTasks ?? 0), 0)
  const activeCount  = agents.filter(a => a.status === 'WORKING').length
  const errorCount   = agents.filter(a => a.status === 'ERROR').length
  const avgProgress  = useMemo(() => {
    const working = agents.filter(a => a.status === 'WORKING')
    if (!working.length) return 0
    const sum = working.reduce((s, a) => s + (liveProgress[a.id] ?? a.taskProgress ?? 0), 0)
    return Math.round(sum / working.length)
  }, [agents, liveProgress])

  const byRole = agents.reduce<Record<string, number>>((acc, a) => {
    acc[a.role] = (acc[a.role] ?? 0) + (a.completedTasks ?? 0)
    return acc
  }, {})

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Agent Performance</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Live KIMMP swarm metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {wsLive && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
          <span className="text-xs text-[var(--os-text-3)]">{agents.length} agent{agents.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Total Tasks Done</p>
          <span className="text-3xl font-extrabold text-blue-400">{totalTasks}</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Across all agents</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Active Now</p>
          <span className={`text-3xl font-extrabold ${activeCount > 0 ? 'text-green-400' : 'text-slate-400'}`}>{activeCount}</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">of {agents.length} agents</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Avg Progress</p>
          <span className="text-3xl font-extrabold text-violet-400">{avgProgress}%</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">Active tasks</p>
        </div>
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs text-[var(--os-text-2)] mb-2">Errors</p>
          <span className={`text-3xl font-extrabold ${errorCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{errorCount}</span>
          <p className="text-xs text-[var(--os-text-3)] mt-1">{errorCount === 0 ? 'All healthy' : 'Need attention'}</p>
        </div>
      </div>

      {/* by-role breakdown */}
      {Object.keys(byRole).length > 0 && (
        <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[var(--os-text-2)] mb-4 uppercase tracking-wider">Tasks by Role</p>
          <div className="space-y-3">
            {Object.entries(byRole).map(([role, count]) => {
              const color = ROLE_COLOR[role] ?? '#64748b'
              const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
              return (
                <div key={role} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold w-24 shrink-0" style={{ color }}>{role}</span>
                  <div className="flex-1 h-1.5 bg-[var(--os-border)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--os-text-3)] w-10 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* agent cards */}
      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--os-text-3)]">
          <Bot className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No agents online. KIMMP swarm is idle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...agents]
            .sort((a, b) => (b.completedTasks ?? 0) - (a.completedTasks ?? 0))
            .map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                liveProgress={liveProgress[agent.id]}
              />
            ))}
        </div>
      )}

    </div>
  )
}
