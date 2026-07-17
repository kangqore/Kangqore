import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow,
  Background,
  Controls,
  Node,
  NodeProps,
  useNodesState,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useNavigate } from 'react-router-dom'
import { api, isDemo } from '@lib/api'
import { connectSocket, getSocket } from '@lib/socket'
import {
  Activity, AlertTriangle, Bot, CheckCircle2, Clock, Cpu, ExternalLink, Layers, Radio, WifiOff, X,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type AgentRole    = 'RESEARCH' | 'SCRAPER' | 'DIAGNOSTICS' | 'EXECUTION' | 'COACH'
type AgentStatus  = 'IDLE' | 'WORKING' | 'ERROR' | 'OFFLINE'

interface AgentNode {
  id:             string
  name:           string
  role:           AgentRole
  status:         AgentStatus
  currentTask?:   string
  taskProgress?:  number
  spawnedAt:      string
  completedTasks?: number
}

interface SwarmLog { text: string; ts: number }

// ── Role / Status constants ───────────────────────────────────────────────────

const ROLE_COLOR: Record<AgentRole, string> = {
  RESEARCH:    '#3b82f6',
  SCRAPER:     '#8b5cf6',
  DIAGNOSTICS: '#f59e0b',
  EXECUTION:   '#22c55e',
  COACH:       '#14b8a6',
}

const ROLE_LABEL: Record<AgentRole, string> = {
  RESEARCH:    'Research',
  SCRAPER:     'Scraper',
  DIAGNOSTICS: 'Diagnostics',
  EXECUTION:   'Execution',
  COACH:       'Coach',
}

const ROLE_ORDER: AgentRole[] = ['RESEARCH', 'SCRAPER', 'DIAGNOSTICS', 'EXECUTION', 'COACH']

const STATUS_ICON: Record<AgentStatus, React.ReactNode> = {
  IDLE:    <Clock    className="w-3 h-3" />,
  WORKING: <Activity className="w-3 h-3" />,
  ERROR:   <AlertTriangle className="w-3 h-3" />,
  OFFLINE: <WifiOff  className="w-3 h-3" />,
}

const STATUS_COLOR: Record<AgentStatus, string> = {
  IDLE:    '#64748b',
  WORKING: '#3b82f6',
  ERROR:   '#ef4444',
  OFFLINE: '#374151',
}

// ── Custom Agent ReactFlow Node ───────────────────────────────────────────────

interface AgentNodeData {
  agent:     AgentNode
  selected:  boolean
  onSelect:  (id: string) => void
}

function AgentFlowNode({ data }: NodeProps) {
  const { agent, onSelect } = data as AgentNodeData
  const roleColor   = ROLE_COLOR[agent.role]
  const statusColor = STATUS_COLOR[agent.status]
  const isWorking   = agent.status === 'WORKING'
  const progress    = agent.taskProgress ?? 0

  return (
    <div
      onClick={() => onSelect(agent.id)}
      style={{
        width: 200,
        background: 'var(--os-surface-2, #1e293b)',
        border: `1.5px solid ${roleColor}55`,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: isWorking ? `0 0 16px ${roleColor}44` : undefined,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* Role stripe */}
      <div style={{ height: 3, background: roleColor, width: '100%' }} />

      <div style={{ padding: '10px 12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `${roleColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Bot style={{ width: 14, height: 14, color: roleColor }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 10, color: roleColor, fontWeight: 500, marginTop: 1 }}>
              {ROLE_LABEL[agent.role]}
            </div>
          </div>
          {/* Status indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            color: statusColor, fontSize: 10, fontWeight: 600,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: statusColor,
              animation: isWorking ? 'agent-pulse 1.5s ease-in-out infinite' : undefined,
            }} />
          </div>
        </div>

        {/* Status + task */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <span style={{ color: statusColor }}>
            {STATUS_ICON[agent.status]}
          </span>
          <span style={{ fontSize: 10, color: 'var(--os-text-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {agent.status === 'WORKING' && agent.currentTask
              ? agent.currentTask
              : agent.status.charAt(0) + agent.status.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Progress bar (only when working) */}
        {isWorking && (
          <div style={{ marginBottom: 6 }}>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--os-border, #334155)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: roleColor,
                width: `${progress}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, textAlign: 'right' }}>
              {progress}%
            </div>
          </div>
        )}

        {/* Footer stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--os-border-subtle, #1e293b)', paddingTop: 6 }}>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
            <span style={{ fontWeight: 600, color: 'var(--os-text-2)', marginRight: 3 }}>{agent.completedTasks ?? 0}</span>
            tasks done
          </div>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
            {new Date(agent.spawnedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

const nodeTypes = { agentNode: AgentFlowNode }

// ── Layout helper — role columns ──────────────────────────────────────────────

function layoutAgents(agents: AgentNode[]): Node[] {
  const COLUMN_W = 240
  const ROW_H    = 160
  const cols: Record<AgentRole, AgentNode[]> = {
    RESEARCH: [], SCRAPER: [], DIAGNOSTICS: [], EXECUTION: [], COACH: [],
  }
  for (const a of agents) cols[a.role]?.push(a)

  const nodes: Node[] = []
  ROLE_ORDER.forEach((role, colIdx) => {
    cols[role].forEach((agent, rowIdx) => {
      nodes.push({
        id:       agent.id,
        type:     'agentNode',
        position: { x: colIdx * COLUMN_W, y: rowIdx * ROW_H },
        data:     { agent, selected: false, onSelect: () => {} },
        draggable: true,
      })
    })
  })
  return nodes
}

// ── Inspector Panel ───────────────────────────────────────────────────────────

interface InspectorProps {
  agent:   AgentNode
  logs:    SwarmLog[]
  onClose: () => void
}

function AgentInspector({ agent, logs, onClose }: InspectorProps) {
  const navigate  = useNavigate()
  const roleColor = ROLE_COLOR[agent.role]
  const agentLogs = logs.filter(l => l.text.includes(agent.name) || l.text.includes(agent.id)).slice(-20)

  const viewMissions = () => {
    navigate(`/kangqore-view/admin/workflows/missions?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name)}&agentRole=${agent.role}`)
  }

  return (
    <div style={{
      width: 320, flexShrink: 0,
      background: 'var(--os-surface-2, #1e293b)',
      border: '1px solid var(--os-border, #334155)',
      borderRadius: 12,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--os-border, #334155)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${roleColor}22`,
          border: `1px solid ${roleColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Bot style={{ width: 18, height: 18, color: roleColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)' }}>{agent.name}</div>
          <div style={{ fontSize: 11, color: roleColor }}>{ROLE_LABEL[agent.role]}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)', padding: 4 }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Status card */}
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: 'var(--os-surface-3, #0f172a)',
          border: '1px solid var(--os-border-subtle, #1e293b)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--os-text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: STATUS_COLOR[agent.status],
              padding: '2px 8px', borderRadius: 4,
              background: `${STATUS_COLOR[agent.status]}18`,
            }}>
              {agent.status}
            </span>
          </div>

          {agent.currentTask && (
            <div>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginBottom: 3 }}>Current Task</div>
              <div style={{ fontSize: 12, color: 'var(--os-text-1)' }}>{agent.currentTask}</div>
            </div>
          )}

          {agent.status === 'WORKING' && typeof agent.taskProgress === 'number' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--os-text-4)', marginBottom: 4 }}>
                <span>Progress</span>
                <span style={{ color: roleColor }}>{agent.taskProgress}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--os-border, #334155)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: roleColor,
                  width: `${agent.taskProgress}%`, transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Completed',  value: agent.completedTasks ?? 0,  icon: <CheckCircle2 style={{ width: 13, height: 13, color: '#22c55e' }} /> },
            { label: 'Spawned At', value: new Date(agent.spawnedAt).toLocaleTimeString(), icon: <Clock style={{ width: 13, height: 13, color: 'var(--os-text-4)' }} /> },
          ].map(m => (
            <div key={m.label} style={{
              padding: '8px 10px', borderRadius: 7,
              background: 'var(--os-surface-3, #0f172a)',
              border: '1px solid var(--os-border-subtle, #1e293b)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                {m.icon}
                <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{m.label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Swarm log for this agent */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Swarm Log
          </div>
          <div style={{
            background: 'var(--os-surface-3, #0f172a)', borderRadius: 8,
            border: '1px solid var(--os-border-subtle, #1e293b)',
            padding: '10px 12px', maxHeight: 200, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 4,
            fontFamily: 'monospace',
          }}>
            {agentLogs.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--os-text-4)', fontStyle: 'italic' }}>No recent log entries</div>
            ) : agentLogs.map((log, i) => (
              <div key={i} style={{ fontSize: 11, color: '#22c55e', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--os-text-4)', marginRight: 6 }}>
                  {new Date(log.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                {log.text}
              </div>
            ))}
          </div>
        </div>

        {/* Cross-link to Mission Graph */}
        <button
          onClick={viewMissions}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            background: `${roleColor}18`, color: roleColor,
            border: `1px solid ${roleColor}44`,
          }}
        >
          <ExternalLink style={{ width: 13, height: 13 }} />
          View Mission Graph for this Agent
        </button>
      </div>
    </div>
  )
}

// ── Main AgentTopologyPage ────────────────────────────────────────────────────

export function AgentTopologyPage() {
  const [agents,      setAgents]      = useState<AgentNode[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [logs,        setLogs]        = useState<SwarmLog[]>([])
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [liveConnected, setLive]      = useState(false)
  const [nodes,       setNodes,       onNodesChange] = useNodesState<Node>([])

  const agentsRef = useRef<AgentNode[]>([])

  // ── Fetch initial topology ──────────────────────────────────────────────────

  useEffect(() => {
    if (isDemo()) {
      const demoAgents: AgentNode[] = [
        { id: 'ag-402', name: 'Agent 402', role: 'RESEARCH',    status: 'WORKING',  currentTask: 'Scanning market intelligence signals', taskProgress: 68, spawnedAt: new Date(Date.now() - 3600000).toISOString(), completedTasks: 12 },
        { id: 'ag-719', name: 'Agent 719', role: 'SCRAPER',     status: 'IDLE',     spawnedAt: new Date(Date.now() - 7200000).toISOString(), completedTasks: 31 },
        { id: 'ag-991', name: 'Agent 991', role: 'DIAGNOSTICS', status: 'WORKING',  currentTask: 'Running anomaly detection on KPIs', taskProgress: 42, spawnedAt: new Date(Date.now() - 1800000).toISOString(), completedTasks: 8 },
        { id: 'ag-104', name: 'Agent 104', role: 'EXECUTION',   status: 'IDLE',     spawnedAt: new Date(Date.now() - 5400000).toISOString(), completedTasks: 5 },
        { id: 'ag-007', name: 'Agent 007', role: 'COACH',       status: 'WORKING',  currentTask: 'Generating strategic recommendations', taskProgress: 91, spawnedAt: new Date(Date.now() - 900000).toISOString(), completedTasks: 3 },
      ]
      applyTopology(demoAgents)
      setLoading(false)
      return
    }

    api.get('/admin/kangqore-immp/swarm/enriched')
      .then(r => {
        const raw: AgentNode[] = r.data?.agents ?? []
        applyTopology(raw)
      })
      .catch(e => setError(e?.response?.data?.error ?? 'Failed to load swarm topology'))
      .finally(() => setLoading(false))
  }, [])

  // ── WebSocket — live updates ────────────────────────────────────────────────

  useEffect(() => {
    if (isDemo()) return
    try { connectSocket() } catch {}
    const socket = getSocket()
    if (!socket) return

    const onTopology = (data: { agents: AgentNode[] }) => {
      applyTopology(data.agents ?? [])
      setLive(true)
    }
    const onProgress = (data: { agentId: string; progress: number; task?: string }) => {
      setAgents(prev => prev.map(a =>
        a.id === data.agentId
          ? { ...a, status: 'WORKING', taskProgress: data.progress, currentTask: data.task ?? a.currentTask }
          : a
      ))
      setLive(true)
    }
    const onLog = (text: string) => {
      setLogs(prev => [...prev.slice(-199), { text, ts: Date.now() }])
    }

    socket.on('SWARM_TOPOLOGY', onTopology)
    socket.on('AGENT_PROGRESS', onProgress)
    socket.on('SWARM_LOG',      onLog)
    setLive(socket.connected)

    return () => {
      socket.off('SWARM_TOPOLOGY', onTopology)
      socket.off('AGENT_PROGRESS', onProgress)
      socket.off('SWARM_LOG',      onLog)
    }
  }, [])

  // ── Keep nodes in sync with agents ─────────────────────────────────────────

  const applyTopology = useCallback((incoming: AgentNode[]) => {
    agentsRef.current = incoming
    setAgents(incoming)
  }, [])

  useEffect(() => {
    setNodes(prev => {
      const laid = layoutAgents(agents)
      return laid.map(newNode => {
        const existing = prev.find(p => p.id === newNode.id)
        return {
          ...newNode,
          position: existing?.position ?? newNode.position,
          data: {
            ...newNode.data,
            agent:    agents.find(a => a.id === newNode.id) ?? (newNode.data as AgentNodeData).agent,
            selected: selectedId === newNode.id,
            onSelect: setSelectedId,
          },
        }
      })
    })
  }, [agents, selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedAgent = useMemo(() =>
    agents.find(a => a.id === selectedId) ?? null
  , [agents, selectedId])

  // ── Summary stats ───────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:   agents.length,
    working: agents.filter(a => a.status === 'WORKING').length,
    idle:    agents.filter(a => a.status === 'IDLE').length,
    error:   agents.filter(a => a.status === 'ERROR').length,
    tasks:   agents.reduce((s, a) => s + (a.completedTasks ?? 0), 0),
  }), [agents])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--os-text-4)' }}>
      <Cpu className="w-5 h-5 animate-spin" style={{ marginRight: 8 }} />
      Loading swarm topology…
    </div>
  )

  if (error) return (
    <div style={{ padding: 32, textAlign: 'center', color: '#ef4444' }}>
      <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
      {error}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', gap: 0 }}>
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes agent-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.4); }
        }
      `}</style>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 0', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Agents',   value: stats.total,   color: 'var(--os-text-1)' },
            { label: 'Working',  value: stats.working,  color: '#3b82f6' },
            { label: 'Idle',     value: stats.idle,     color: '#64748b' },
            { label: 'Errors',   value: stats.error,    color: '#ef4444' },
            { label: 'Tasks Done', value: stats.tasks,  color: '#22c55e' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '6px 12px', borderRadius: 7,
              background: 'var(--os-surface-2, #1e293b)',
              border: '1px solid var(--os-border, #334155)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {liveConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e' }}>
              <Radio className="w-3.5 h-3.5" />
              Live
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--os-text-4)' }}>
              <Layers className="w-3.5 h-3.5" />
              Snapshot
            </div>
          )}
        </div>
      </div>

      {/* Role column headers */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 8 }}>
        {ROLE_ORDER.map((role, i) => (
          <div key={role} style={{
            width: 240, flexShrink: 0,
            textAlign: 'center', paddingBottom: 6,
            paddingLeft: i === 0 ? 20 : 0,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: ROLE_COLOR[role],
              padding: '2px 10px', borderRadius: 4,
              background: `${ROLE_COLOR[role]}18`,
            }}>
              {ROLE_LABEL[role]}
            </span>
          </div>
        ))}
      </div>

      {/* Canvas + Inspector */}
      <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
        {/* ReactFlow canvas */}
        <div style={{
          flex: 1, minWidth: 0,
          border: '1px solid var(--os-border, #334155)',
          borderRadius: 12, overflow: 'hidden',
          background: 'var(--os-surface-1, #0f172a)',
        }}>
          <ReactFlow
            nodes={nodes}
            edges={[]}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.4}
            maxZoom={1.5}
            nodesDraggable
            nodesConnectable={false}
            zoomOnScroll
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Inspector panel */}
        {selectedAgent && (
          <AgentInspector
            agent={selectedAgent}
            logs={logs}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  )
}
