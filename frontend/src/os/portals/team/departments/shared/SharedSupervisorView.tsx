import { Brain, AlertTriangle } from 'lucide-react'
import type { DeptConfig } from '../../deptConfigs'

export interface SupervisedAgent {
  id:             string
  name:           string
  initials:       string
  color:          string
  status:         'ONLINE' | 'ON_ITEM' | 'IDLE' | 'OFFLINE'
  currentItemId:  string | null
  currentTitle:   string | null
  queueDepth:     number
  capacity:       number
  kimmCapacity:   string
}

export interface SLAAlert {
  id:        string
  title:     string
  breachIn:  string
  priority:  string
  assignee:  string
}

interface Props {
  config:   DeptConfig
  agents:   SupervisedAgent[]
  alerts:   SLAAlert[]
  onViewItem?: (itemId: string) => void
}

const A_DOT:  Record<string, string> = { ONLINE: '#10B981', ON_ITEM: '#2564ea', IDLE: '#F59E0B', OFFLINE: 'var(--os-text-2)' }
const A_LABEL: Record<string, string>= { ONLINE: 'Online', ON_ITEM: 'On Item', IDLE: 'Idle', OFFLINE: 'Offline' }
const P_COLOR: Record<string, string> = { P1: '#EF4444', P2: '#F97316', P3: '#F59E0B', P4: '#6B7280' }

export function SharedSupervisorView({ config, agents, alerts, onViewItem }: Props) {
  const accent = config.accentColor

  const online  = agents.filter(a => a.status !== 'OFFLINE').length
  const onItem  = agents.filter(a => a.status === 'ON_ITEM').length
  const idle    = agents.filter(a => a.status === 'IDLE').length

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Team status KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Online',   value: online.toString(),            color: '#10B981' },
          { label: 'On Item',  value: onItem.toString(),            color: accent },
          { label: 'Idle',     value: idle.toString(),              color: '#F59E0B' },
          { label: 'SLA Risk', value: alerts.length.toString(),     color: alerts.length > 0 ? '#EF4444' : '#10B981' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-xs text-[var(--os-text-2)] font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* SLA alert strip */}
      {alerts.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">SLA at risk:</p>
          </div>
          {alerts.map(a => (
            <button
              key={a.id}
              onClick={() => onViewItem?.(a.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 flex-shrink-0 hover:bg-red-500/20 transition-colors"
            >
              <span className="text-xs font-bold" style={{ color: P_COLOR[a.priority] ?? '#EF4444' }}>{a.priority}</span>
              <span className="text-xs font-mono text-red-300">{a.id}</span>
              <span className="text-xs text-red-400">breaches in {a.breachIn}</span>
            </button>
          ))}
        </div>
      )}

      {/* Agent cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map(agent => {
          const queuePct = agent.capacity > 0 ? Math.round((agent.queueDepth / agent.capacity) * 100) : 0
          const queueOk  = queuePct < 80
          return (
            <div
              key={agent.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl"
              style={agent.status === 'OFFLINE' ? { opacity: 0.45 } : undefined}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: `${agent.color}25`, color: agent.color }}>
                    {agent.initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D1628]"
                    style={{ background: A_DOT[agent.status] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{agent.name}</p>
                  <p className="text-xs" style={{ color: A_DOT[agent.status] }}>{A_LABEL[agent.status]}</p>
                </div>
              </div>

              {/* Current item */}
              {agent.currentItemId ? (
                <div className="mb-3 p-2.5 rounded-lg bg-slate-800/40 border border-white/[0.06]">
                  <p className="text-xs font-mono text-[var(--os-text-2)] mb-0.5">{agent.currentItemId}</p>
                  <p className="text-xs text-[var(--os-text-1)] leading-snug line-clamp-2">{agent.currentTitle}</p>
                </div>
              ) : (
                <div className="mb-3 p-2.5 rounded-lg bg-slate-800/20 border border-white/[0.04]">
                  <p className="text-xs text-[var(--os-text-2)] italic">No active item</p>
                </div>
              )}

              {/* Queue depth bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-[var(--os-text-2)]">Queue</p>
                  <span className="text-xs font-semibold" style={{ color: queueOk ? '#10B981' : '#EF4444' }}>
                    {agent.queueDepth}/{agent.capacity}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${queuePct}%`, background: queueOk ? accent : '#EF4444' }} />
                </div>
              </div>

              {/* KIMMP capacity line */}
              <div className="flex items-start gap-1.5 p-2 rounded-lg" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
                <Brain className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <p className="text-xs text-[var(--os-text-2)] leading-relaxed">{agent.kimmCapacity}</p>
              </div>

              {agent.currentItemId && (
                <button
                  onClick={() => onViewItem?.(agent.currentItemId!)}
                  className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-all border border-white/10 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-white/5"
                >
                  View Item
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
