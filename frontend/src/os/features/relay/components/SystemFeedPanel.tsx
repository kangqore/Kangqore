import { useEffect, useState } from 'react'
import { connectSocket, getSocket } from '@lib/socket'
import { X, Bot, CheckCircle, AlertCircle, Activity, Zap } from 'lucide-react'

interface FeedEvent {
  id:   string
  kind: 'log' | 'agent_working' | 'agent_done' | 'agent_error' | 'topology' | 'signal'
  text: string
  ts:   string
  meta?: string
}

const KIND_COLOR: Record<FeedEvent['kind'], string> = {
  log:           'var(--os-text-3)',
  agent_working: '#22c55e',
  agent_done:    '#3b82f6',
  agent_error:   '#ef4444',
  topology:      '#8b5cf6',
  signal:        '#f59e0b',
}

function EventIcon({ kind }: { kind: FeedEvent['kind'] }) {
  const cls = 'w-3.5 h-3.5 shrink-0'
  if (kind === 'agent_error')   return <AlertCircle className={cls} style={{ color: KIND_COLOR[kind] }} />
  if (kind === 'agent_working') return <Activity    className={cls} style={{ color: KIND_COLOR[kind] }} />
  if (kind === 'agent_done')    return <CheckCircle className={cls} style={{ color: KIND_COLOR[kind] }} />
  if (kind === 'topology')      return <Bot         className={cls} style={{ color: KIND_COLOR[kind] }} />
  if (kind === 'signal')        return <Zap         className={cls} style={{ color: KIND_COLOR[kind] }} />
  return <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: KIND_COLOR[kind] }} />
}

interface Props {
  onClose: () => void
}

export function SystemFeedPanel({ onClose }: Props) {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [live, setLive]     = useState(false)

  useEffect(() => {
    connectSocket()
    const socket = getSocket()
    const ts = () => new Date().toISOString().split('T')[1].substring(0, 8)

    const push = (ev: Omit<FeedEvent, 'id'>) => {
      const entry: FeedEvent = { ...ev, id: `${Date.now()}-${Math.random()}` }
      setEvents(prev => {
        const next = [entry, ...prev]
        return next.length > 60 ? next.slice(0, 60) : next
      })
    }

    const onLog = (msg: string) => {
      const kind: FeedEvent['kind'] =
        msg.startsWith('!!') ? 'agent_error' :
        msg.includes('WORKING') || msg.includes('▶') ? 'agent_working' :
        msg.includes('✓') || msg.includes('done') || msg.includes('complet') ? 'agent_done' :
        'log'
      push({ kind, text: msg, ts: ts() })
    }

    const onTopology = (agents: Array<{ name: string; status: string; role: string }>) => {
      const working = agents.filter(a => a.status === 'WORKING').map(a => a.name).join(', ')
      push({ kind: 'topology', text: `Swarm synced — ${agents.length} agents`, meta: working || undefined, ts: ts() })
      setLive(true)
    }

    const onAgentUpdated = (agent: { name: string; status: string; currentTask?: string }) => {
      const kind: FeedEvent['kind'] =
        agent.status === 'WORKING' ? 'agent_working' :
        agent.status === 'ERROR'   ? 'agent_error'   :
        'agent_done'
      push({
        kind,
        text: `${agent.name} → ${agent.status}`,
        meta: agent.currentTask,
        ts:   ts(),
      })
    }

    const onAgentSpawned = (a: { name: string }) => push({ kind: 'topology', text: `Agent spawned: ${a.name}`, ts: ts() })
    const onDisconnect = () => setLive(false)

    socket.on('SWARM_LOG',      onLog)
    socket.on('SWARM_TOPOLOGY', onTopology)
    socket.on('AGENT_UPDATED',  onAgentUpdated)
    socket.on('AGENT_SPAWNED',  onAgentSpawned)
    socket.on('disconnect',     onDisconnect)

    if (socket.connected) setLive(true)

    return () => {
      socket.off('SWARM_LOG',      onLog)
      socket.off('SWARM_TOPOLOGY', onTopology)
      socket.off('AGENT_UPDATED',  onAgentUpdated)
      socket.off('AGENT_SPAWNED',  onAgentSpawned)
      socket.off('disconnect',     onDisconnect)
    }
  }, [])

  return (
    <div className="w-72 shrink-0 flex flex-col border-l border-[var(--os-border)] bg-[var(--os-card)]">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--os-border)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--os-text-2)]" />
          <span className="text-sm font-semibold text-[var(--os-text-1)]">KIMMP Feed</span>
          {live && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-1.5 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--os-border)] text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* event stream */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 text-[var(--os-text-3)]">
            <Activity className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">{live ? 'Waiting for KIMMP events…' : 'Connecting…'}</p>
          </div>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="flex items-start gap-2 group">
              <div className="mt-0.5">
                <EventIcon kind={ev.kind} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-snug text-[var(--os-text-1)] truncate">{ev.text}</p>
                {ev.meta && (
                  <p className="text-[10px] text-[var(--os-text-3)] mt-0.5 truncate">{ev.meta}</p>
                )}
                <p className="text-[9px] font-mono text-[var(--os-text-4,var(--os-text-3))] mt-0.5">{ev.ts}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* footer clear */}
      {events.length > 0 && (
        <div className="px-3 py-2 border-t border-[var(--os-border)]">
          <button
            type="button"
            onClick={() => setEvents([])}
            className="text-[10px] text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors"
          >
            Clear feed
          </button>
        </div>
      )}
    </div>
  )
}
