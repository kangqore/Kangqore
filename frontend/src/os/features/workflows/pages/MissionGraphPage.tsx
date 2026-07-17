import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ReactFlow,
  Background,
  Controls,
  Node,
  NodeProps,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, isDemo } from '@lib/api'
import {
  AlertTriangle, Bot, CheckCircle2, ChevronRight, Clock,
  Crosshair, Flag, Layers, Pause, Play, X, Zap,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

type MissionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABORTED'
type MissionMode   = 'SUPERVISED' | 'AUTONOMOUS'

interface AutopilotAction {
  id:           string
  action:       string
  rationale:    string
  targetModule: string
  targetId?:    string
  proposedAt:   string
  approvedAt?:  string
  rejectedAt?:  string
  outcome?:     string
}

interface Mission {
  id:         string
  title:      string
  status:     MissionStatus
  mode:       MissionMode
  actions:    AutopilotAction[]
  createdAt:  string
  updatedAt?: string
}

interface LogEntry {
  id:        string
  missionId: string
  action:    string
  rationale: string
  outcome?:  string
  createdAt: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<MissionStatus, string> = {
  ACTIVE:    '#3b82f6',
  PAUSED:    '#f59e0b',
  COMPLETED: '#22c55e',
  ABORTED:   '#ef4444',
}

const STATUS_ICON: Record<MissionStatus, React.ReactNode> = {
  ACTIVE:    <Play    className="w-3 h-3" />,
  PAUSED:    <Pause   className="w-3 h-3" />,
  COMPLETED: <CheckCircle2 className="w-3 h-3" />,
  ABORTED:   <AlertTriangle className="w-3 h-3" />,
}

const MODE_COLOR: Record<MissionMode, string> = {
  SUPERVISED: '#8b5cf6',
  AUTONOMOUS: '#14b8a6',
}

// ── Mission Node ──────────────────────────────────────────────────────────────

interface MissionNodeData {
  mission:   Mission
  onSelect:  (id: string) => void
}

function MissionFlowNode({ data }: NodeProps) {
  const { mission, onSelect } = data as MissionNodeData
  const statusColor = STATUS_COLOR[mission.status]
  const isActive    = mission.status === 'ACTIVE'
  const actionCount = Array.isArray(mission.actions) ? mission.actions.length : 0

  return (
    <button
      type="button"
      onClick={() => onSelect(mission.id)}
      style={{
        width: 220,
        background: 'var(--os-surface-2, #1e293b)',
        border: `1.5px solid ${statusColor}55`,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isActive ? `0 0 14px ${statusColor}33` : undefined,
        transition: 'box-shadow 0.3s ease',
        padding: 0,
        textAlign: 'left',
        display: 'block',
      }}
    >
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div style={{ height: 3, background: statusColor, width: '100%' }} />

      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: `${statusColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Crosshair style={{ width: 14, height: 14, color: statusColor }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mission.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <span style={{
                fontSize: 10, fontWeight: 600, color: statusColor,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                {STATUS_ICON[mission.status]}
                {mission.status}
              </span>
              <span style={{ color: 'var(--os-text-4)', fontSize: 10 }}>·</span>
              <span style={{ fontSize: 10, color: MODE_COLOR[mission.mode], fontWeight: 500 }}>
                {mission.mode === 'AUTONOMOUS' ? 'AUTO' : 'SUP'}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          borderTop: '1px solid var(--os-border-subtle, #1e293b)', paddingTop: 7,
        }}>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
            <span style={{ fontWeight: 600, color: 'var(--os-text-2)' }}>{actionCount}</span> actions
          </div>
          <div style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
            {new Date(mission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </button>
  )
}

// ── Action Log Node ───────────────────────────────────────────────────────────

interface LogNodeData { log: AutopilotAction }

function ActionLogNode({ data }: NodeProps) {
  const { log } = data as LogNodeData
  const isApproved = !!log.approvedAt
  const isRejected = !!log.rejectedAt

  let color = '#64748b'
  if (isApproved) color = '#22c55e'
  if (isRejected) color = '#ef4444'

  return (
    <div style={{
      width: 180,
      background: 'var(--os-surface-2, #1e293b)',
      border: `1px solid ${color}44`,
      borderRadius: 8,
      padding: '8px 10px',
      cursor: 'default',
    }}>
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
        <Zap style={{ width: 11, height: 11, color, flexShrink: 0 }} />
        <span style={{ fontSize: 10, color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {log.targetModule}
        </span>
      </div>

      <div style={{ fontSize: 11, color: 'var(--os-text-1)', marginBottom: 4, lineHeight: 1.3 }}>
        {log.action.length > 70 ? log.action.slice(0, 67) + '…' : log.action}
      </div>

      {log.outcome && (
        <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontStyle: 'italic', marginTop: 2 }}>
          → {log.outcome.slice(0, 50)}{log.outcome.length > 50 ? '…' : ''}
        </div>
      )}

      <div style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 4 }}>
        {new Date(log.proposedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

const nodeTypes = { missionNode: MissionFlowNode, actionNode: ActionLogNode }

// ── Layout ────────────────────────────────────────────────────────────────────

function buildGraph(missions: Mission[], selectedId: string | null): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  missions.forEach((mission, mIdx) => {
    const mX = mIdx * 280
    const mY = 0

    nodes.push({
      id:       mission.id,
      type:     'missionNode',
      position: { x: mX, y: mY },
      data:     { mission, onSelect: () => {} },
    })

    if (mission.id === selectedId && Array.isArray(mission.actions)) {
      mission.actions.slice(-5).forEach((action, aIdx) => {
        const aId = `action-${mission.id}-${aIdx}`
        nodes.push({
          id:       aId,
          type:     'actionNode',
          position: { x: mX - 10, y: mY + 140 + aIdx * 110 },
          data:     { log: action },
        })
        edges.push({
          id:            `e-${mission.id}-${aId}`,
          source:        mission.id,
          target:        aId,
          style:         { stroke: STATUS_COLOR[mission.status] + '66', strokeWidth: 1.5 },
          markerEnd:     { type: MarkerType.ArrowClosed, color: STATUS_COLOR[mission.status] + '66' },
          animated:      mission.status === 'ACTIVE',
        })
      })
    }
  })

  return { nodes, edges }
}

// ── Inspector Panel ───────────────────────────────────────────────────────────

interface MissionInspectorProps {
  readonly mission:  Mission
  readonly logs:     LogEntry[]
  readonly onClose:  () => void
}

function MissionInspector({ mission, logs, onClose }: MissionInspectorProps) {
  const statusColor = STATUS_COLOR[mission.status]
  const missionLogs = logs.filter(l => l.missionId === mission.id).slice(-15)

  return (
    <div style={{
      width: 340, flexShrink: 0,
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
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${statusColor}22`, border: `1px solid ${statusColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Crosshair style={{ width: 18, height: 18, color: statusColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)', lineHeight: 1.3 }}>{mission.title}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, color: statusColor,
              padding: '1px 7px', borderRadius: 4, background: `${statusColor}18`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {STATUS_ICON[mission.status]} {mission.status}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: MODE_COLOR[mission.mode],
              padding: '1px 7px', borderRadius: 4, background: `${MODE_COLOR[mission.mode]}18`,
            }}>
              {mission.mode}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--os-text-4)', padding: 4 }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Actions', value: Array.isArray(mission.actions) ? mission.actions.length : 0, icon: <Zap style={{ width: 12, height: 12, color: '#f59e0b' }} /> },
            { label: 'Log Entries', value: missionLogs.length, icon: <Layers style={{ width: 12, height: 12, color: 'var(--os-text-4)' }} /> },
            { label: 'Created', value: new Date(mission.createdAt).toLocaleDateString(), icon: <Clock style={{ width: 12, height: 12, color: 'var(--os-text-4)' }} /> },
            { label: 'Mode', value: mission.mode === 'AUTONOMOUS' ? 'Auto' : 'Supervised', icon: <Bot style={{ width: 12, height: 12, color: MODE_COLOR[mission.mode] }} /> },
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

        {/* Recent actions */}
        {Array.isArray(mission.actions) && mission.actions.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Recent Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {mission.actions.slice(-4).reverse().map((a, i) => (
                <div key={a.id ?? i} style={{
                  padding: '8px 10px', borderRadius: 8,
                  background: 'var(--os-surface-3, #0f172a)',
                  border: '1px solid var(--os-border-subtle, #1e293b)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b' }}>{a.targetModule}</span>
                    <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>
                      {new Date(a.proposedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--os-text-1)', lineHeight: 1.3 }}>{a.action}</div>
                  {a.rationale && (
                    <div style={{ fontSize: 11, color: 'var(--os-text-3)', marginTop: 3, fontStyle: 'italic' }}>
                      {a.rationale}
                    </div>
                  )}
                  {(a.approvedAt || a.rejectedAt || a.outcome) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      {a.approvedAt && <span style={{ fontSize: 10, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle2 className="w-3 h-3" /> Approved</span>}
                      {a.rejectedAt && <span style={{ fontSize: 10, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 3 }}><AlertTriangle className="w-3 h-3" /> Rejected</span>}
                      {a.outcome && <span style={{ fontSize: 10, color: 'var(--os-text-4)', display: 'flex', alignItems: 'center', gap: 3 }}><ChevronRight className="w-3 h-3" />{a.outcome.slice(0, 40)}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log trail */}
        {missionLogs.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Autopilot Log
            </div>
            <div style={{
              background: 'var(--os-surface-3, #0f172a)', borderRadius: 8,
              border: '1px solid var(--os-border-subtle, #1e293b)',
              padding: '10px 12px', maxHeight: 200, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 4,
              fontFamily: 'monospace',
            }}>
              {missionLogs.map((log, i) => (
                <div key={log.id ?? i} style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--os-text-4)', marginRight: 6 }}>
                    {new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  {log.action}
                  {log.outcome && <span style={{ color: '#22c55e', marginLeft: 5 }}>→ {log.outcome.slice(0, 30)}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_MISSIONS: Mission[] = [
  {
    id: 'm-001', title: 'Q3 Revenue Acceleration', status: 'ACTIVE', mode: 'SUPERVISED',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    actions: [
      { id: 'a-1', action: 'Send pipeline summary to CRM leads', rationale: 'CRM momentum detected', targetModule: 'CRM', proposedAt: new Date(Date.now() - 3600000).toISOString(), approvedAt: new Date(Date.now() - 3540000).toISOString() },
      { id: 'a-2', action: 'Flag low-probability deals for review', rationale: 'Confidence below threshold', targetModule: 'Decisions', proposedAt: new Date(Date.now() - 1800000).toISOString() },
    ],
  },
  {
    id: 'm-002', title: 'Operational Cost Reduction', status: 'ACTIVE', mode: 'SUPERVISED',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    actions: [
      { id: 'a-3', action: 'Identify redundant vendor contracts', rationale: 'Finance analysis shows 12% overhead', targetModule: 'Finance', proposedAt: new Date(Date.now() - 7200000).toISOString(), approvedAt: new Date(Date.now() - 7100000).toISOString(), outcome: 'Identified 3 contracts' },
    ],
  },
  {
    id: 'm-003', title: 'Product Launch Coordination', status: 'PAUSED', mode: 'SUPERVISED',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    actions: [],
  },
  {
    id: 'm-004', title: 'Market Intelligence Scan', status: 'COMPLETED', mode: 'SUPERVISED',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    actions: [
      { id: 'a-4', action: 'Compile competitor pricing report', rationale: 'Signal detected from external scan', targetModule: 'Intelligence', proposedAt: new Date(Date.now() - 14 * 86400000).toISOString(), approvedAt: new Date(Date.now() - 13 * 86400000).toISOString(), outcome: 'Report delivered to dashboard' },
    ],
  },
]

// ── Main MissionGraphPage ─────────────────────────────────────────────────────

export function MissionGraphPage() {
  const navigate        = useNavigate()
  const [searchParams]  = useSearchParams()
  const agentName       = searchParams.get('agentName') ?? null
  const agentRole       = searchParams.get('agentRole') ?? null

  const [missions,    setMissions]    = useState<Mission[]>([])
  const [logs,        setLogs]        = useState<LogEntry[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'ALL'>('ALL')

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // ── Fetch missions + logs ───────────────────────────────────────────────────

  useEffect(() => {
    if (isDemo()) {
      setMissions(DEMO_MISSIONS)
      setLoading(false)
      return
    }

    Promise.all([
      api.get('/admin/kangqore-immp/cognition/autopilot/missions'),
      api.get('/admin/kangqore-immp/cognition/autopilot/log?limit=100'),
    ])
      .then(([mRes, lRes]) => {
        setMissions(mRes.data?.missions ?? [])
        setLogs(lRes.data?.logs ?? [])
      })
      .catch(e => setError(e?.response?.data?.error ?? 'Failed to load missions'))
      .finally(() => setLoading(false))
  }, [])

  // ── Rebuild graph on data/selection/filter change ───────────────────────────

  const filteredMissions = useMemo(() =>
    statusFilter === 'ALL' ? missions : missions.filter(m => m.status === statusFilter)
  , [missions, statusFilter])

  const onSelectNode = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id)
  }, [])

  useEffect(() => {
    const { nodes: gNodes, edges: gEdges } = buildGraph(filteredMissions, selectedId)

    setNodes(gNodes.map(n => ({
      ...n,
      data: n.type === 'missionNode'
        ? { ...(n.data as MissionNodeData), onSelect: onSelectNode }
        : n.data,
    })))
    setEdges(gEdges)
  }, [filteredMissions, selectedId, onSelectNode]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedMission = useMemo(() =>
    missions.find(m => m.id === selectedId) ?? null
  , [missions, selectedId])

  // ── Stats ───────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:     missions.length,
    active:    missions.filter(m => m.status === 'ACTIVE').length,
    paused:    missions.filter(m => m.status === 'PAUSED').length,
    completed: missions.filter(m => m.status === 'COMPLETED').length,
    actions:   missions.reduce((s, m) => s + (Array.isArray(m.actions) ? m.actions.length : 0), 0),
  }), [missions])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--os-text-4)' }}>
      <Flag className="w-5 h-5 animate-pulse" style={{ marginRight: 8 }} />
      Loading missions…
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
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 0', marginBottom: 12,
      }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Total',     value: stats.total,     color: 'var(--os-text-1)' },
            { label: 'Active',    value: stats.active,    color: STATUS_COLOR.ACTIVE },
            { label: 'Paused',    value: stats.paused,    color: STATUS_COLOR.PAUSED },
            { label: 'Completed', value: stats.completed, color: STATUS_COLOR.COMPLETED },
            { label: 'Actions',   value: stats.actions,   color: '#f59e0b' },
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

        {/* Filter chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {agentName && (
            <button
              type="button"
              onClick={() => navigate('/kangqore-view/admin/workflows/agents')}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
                background: '#14b8a618', color: '#14b8a6',
                border: '1px solid #14b8a644',
              }}
            >
              <Bot style={{ width: 11, height: 11 }} />
              {agentRole ?? 'Agent'}: {agentName}
              <X style={{ width: 10, height: 10 }} />
            </button>
          )}
          {(['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ABORTED'] as const).map(s => {
            const isSelected  = statusFilter === s
            const accentColor = s === 'ALL' ? '#3b82f6' : STATUS_COLOR[s as MissionStatus]
            const bg    = isSelected ? `${accentColor}18`  : 'transparent'
            const color = isSelected ? accentColor          : 'var(--os-text-4)'
            const bdr   = isSelected ? `${accentColor}44`  : 'var(--os-border-subtle, #1e293b)'
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', background: bg, color, border: `1px solid ${bdr}`,
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
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
          {filteredMissions.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--os-text-4)', gap: 10 }}>
              <Flag className="w-8 h-8" />
              <div style={{ fontSize: 13 }}>No missions match the current filter</div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              minZoom={0.3}
              maxZoom={1.5}
              nodesDraggable
              nodesConnectable={false}
              zoomOnScroll
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
              <Controls showInteractive={false} />
            </ReactFlow>
          )}
        </div>

        {/* Inspector panel */}
        {selectedMission && (
          <MissionInspector
            mission={selectedMission}
            logs={logs}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  )
}
