import { useState, useCallback, useEffect, useRef, useMemo, createContext, useContext } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  NodeToolbar,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Handle,
  Position,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from '@dagrejs/dagre'
import {
  Sparkles, Save, Loader2, Brain, ChevronRight, X,
  Bell, Clock, Play, Zap, Plus, Link as LinkIcon, GitBranch,
  CheckCircle2, Copy, Trash2, HelpCircle, ChevronRight as ChevronR,
  Undo2, Redo2, LayoutGrid, MessageSquare,
  Target, Database, BarChart2, Scale, Shuffle, Shield, BookOpen, TrendingUp,
  FlaskConical, Star, ArrowRight, AlertTriangle, Gauge, Lightbulb, Microscope,
  Activity, Code2, CheckCircle, XCircle, Clock3,
  Building2, Users, Crosshair, Wallet, Flag,
  Wrench, Archive, Layers, Eye, UserCheck,
  Share2, Download, Keyboard,
} from 'lucide-react'
import { api } from '@lib/api'
import { connectSocket, getSocket } from '@lib/socket'
import type { LiveSignal } from '@lib/useSignalStream'
import { useWorkflowsStore } from '../store'
import { useSearchParams } from 'react-router-dom'
import type { WorkflowStep, StepType, WvisStepType, IntelStepType, Workflow } from '../types'
import { validateWorkflow, scoreWorkflow, type ValidationIssue, type ValidationResult, type ValidationScore } from '../workflowValidation'

type CanvasMode = 'workflow' | 'intelligence' | 'enterprise' | 'agents' | 'all'

// ── Live Intelligence — signal-to-node-type affinity ──────────────────────────
// Maps KIMMP signal types to the intelligence nodes that should pulse when active.
const SIGNAL_AFFINITY: Record<string, string[]> = {
  FINANCIAL:     ['analyze', 'kpi', 'insight'],
  MARKET:        ['context', 'analyze', 'insight'],
  OPERATIONAL:   ['context', 'execute', 'kpi'],
  RISK:          ['policy', 'decision', 'simulate'],
  COMPLIANCE:    ['policy', 'decision'],
  STRATEGIC:     ['goal', 'decision', 'kpi'],
  ANOMALY:       ['analyze', 'insight', 'hypothesis'],
  PERFORMANCE:   ['kpi', 'execute', 'learn'],
  PATTERN:       ['analyze', 'insight', 'hypothesis'],
  HIGH_PRIORITY: ['decision', 'goal'],
  PREDICTION:    ['hypothesis', 'simulate'],
  FORECAST:      ['hypothesis', 'simulate', 'kpi'],
  OPPORTUNITY:   ['goal', 'insight', 'decision'],
  THREAT:        ['policy', 'simulate', 'decision'],
  OUTCOME:       ['learn', 'kpi'],
}

interface KpiMetric { label: string; current: number; target: number; unit: string; trend: 'up' | 'stable' | 'down' }
interface KpiData { health: number; signalCount: number; criticalCount: number; metrics: KpiMetric[] }

// ── useLiveIntelligence hook ──────────────────────────────────────────────────
// Phase 3: replaced 30s polling with socket.io listener (kimmp:signal) +
// one initial HTTP fetch to load existing signals on activation.
function useLiveIntelligence(enabled: boolean, canvasMode: CanvasMode) {
  const [signals,    setSignals]    = useState<LiveSignal[]>([])
  const [liveActive, setLiveActive] = useState(false)
  const [kpiData,    setKpiData]    = useState<KpiData | null>(null)

  const refreshKpi = () =>
    api.get('/admin/kangqore-immp/signals/kpi').then(r => setKpiData(r.data)).catch(() => {})

  useEffect(() => {
    if (!enabled || (canvasMode !== 'intelligence' && canvasMode !== 'all')) {
      setSignals([]); setLiveActive(false); setKpiData(null)
      return
    }

    // Initial fetch — populate from existing signals immediately
    api.get('/admin/kangqore-immp/signals?limit=100')
      .then(({ data }) => {
        const sigs: LiveSignal[] = data.signals ?? data ?? []
        setSignals(sigs); setLiveActive(true); refreshKpi()
      })
      .catch(() => setLiveActive(false))

    // Real-time: socket.io pushes kimmp:signal on every new ingest
    try { connectSocket() } catch {}
    const socket = getSocket()
    const onSignal = (s: LiveSignal) => {
      setSignals(prev => [s, ...prev].slice(0, 150))
      setLiveActive(true)
      refreshKpi()
    }
    socket.on('kimmp:signal', onSignal)
    return () => { socket.off('kimmp:signal', onSignal) }
  }, [enabled, canvasMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Derive liveNodeTypes + nodeConfidence from accumulated signals
  const { liveNodeTypes, nodeConfidence, liveSignalCount } = useMemo(() => {
    const types  = new Set<string>()
    const counts = new Map<string, number>()
    signals.forEach(s => {
      const key      = (s.signalType ?? '').toUpperCase()
      const affected = SIGNAL_AFFINITY[key] ?? []
      if (!affected.length && (s.severity === 'HIGH' || s.severity === 'CRITICAL')) {
        ;['analyze', 'context'].forEach(t => { types.add(t); counts.set(t, (counts.get(t) ?? 0) + 1) })
      } else {
        affected.forEach(t => { types.add(t); counts.set(t, (counts.get(t) ?? 0) + 1) })
      }
    })
    const confidence = new Map<string, number>()
    counts.forEach((count, type) => {
      confidence.set(type, Math.min(97, Math.round(45 + Math.log(1 + count) * 18)))
    })
    return { liveNodeTypes: types, nodeConfidence: confidence, liveSignalCount: signals.length }
  }, [signals])

  return { liveNodeTypes, liveSignalCount, liveActive, nodeConfidence, kpiData, signals }
}

// ── Tokens ────────────────────────────────────────────────────────────────────

const BG    = 'var(--os-bg)'
const CARD  = 'var(--os-card)'
const RAISE = 'var(--os-surface-0)'
const EDGE_C = 'var(--os-border)'
const BLUE   = '#2564ea'
const PURPLE = '#7f53f9'
const GREEN  = '#00c875'
const AMBER  = '#fdab3d'
const RED    = '#e2445c'
const SLATE  = '#8b949e'
const TEAL   = '#00b4d8'
const EASE   = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ── 7 WVIS canonical node types (+ legacy aliases) ────────────────────────────

// Intelligence-canvas colour palette (intentionally distinct from workflow palette)
const ROSE    = '#f72585'
const INDIGO  = '#4361ee'
const VIOLET  = '#7209b7'
const ORANGE  = '#f77f00'
const LIME    = '#2dc653'
const GOLD    = '#f4c542'
const CYAN    = '#06d6a0'
const HONEY   = '#f9c74f'  // Insight — warmth of understanding
const SAGE    = '#43aa8b'  // Hypothesis — scientific, provisional

const NODE_CFG: Record<string, { label: string; color: string; Icon: React.ElementType; emoji: string; description?: string }> = {
  // ── Workflow canvas (Phase 1) ──────────────────────────────────────────────
  notify:       { label: 'Notify',     color: GREEN,  Icon: Bell,       emoji: '📢' },
  wait:         { label: 'Wait',       color: AMBER,  Icon: Clock,      emoji: '⏳' },
  agent:        { label: 'Agent',      color: BLUE,   Icon: Play,       emoji: '🤖' },
  event:        { label: 'Event',      color: PURPLE, Icon: Zap,        emoji: '⚡' },
  create:       { label: 'Create',     color: TEAL,   Icon: Plus,       emoji: '➕' },
  integrate:    { label: 'Integrate',  color: RED,    Icon: LinkIcon,   emoji: '🔌' },
  condition:    { label: 'Condition',  color: AMBER,  Icon: GitBranch,  emoji: '◇'  },
  // ── Intelligence canvas (Phase 2) — 9+1 thinking nodes ────────────────────
  goal:         { label: 'Goal',       color: ROSE,   Icon: Target,      emoji: '🎯', description: 'What are we trying to achieve?' },
  context:      { label: 'Context',    color: CYAN,   Icon: Database,    emoji: '🧠', description: 'What does the system know right now?' },
  analyze:      { label: 'Analyze',    color: INDIGO, Icon: BarChart2,   emoji: '🔍', description: 'What happened? (facts + patterns)' },
  insight:      { label: 'Insight',    color: HONEY,  Icon: Lightbulb,   emoji: '💡', description: 'Why does it matter? (causal interpretation)' },
  hypothesis:   { label: 'Hypothesis', color: SAGE,   Icon: Microscope,  emoji: '🧪', description: 'What do we think is true? (testable claim)' },
  simulate:     { label: 'Simulate',   color: ORANGE, Icon: FlaskConical, emoji: '🎲', description: 'What happens if we do X?' },
  decision:     { label: 'Decision',   color: VIOLET, Icon: Scale,       emoji: '⚖️', description: 'What should we do?' },
  policy:       { label: 'Policy',     color: RED,    Icon: Shield,      emoji: '🛡️', description: 'What rules constrain us?' },
  execute:      { label: 'Execute',    color: LIME,   Icon: Zap,         emoji: '⚡', description: 'Take the action.' },
  learn:        { label: 'Learn',      color: TEAL,   Icon: BookOpen,    emoji: '💾', description: 'Record outcome → Enterprise Memory' },
  kpi:          { label: 'KPI',        color: GOLD,   Icon: TrendingUp,  emoji: '📊', description: 'Strategic anchor — outcome measure' },
  // ── Enterprise canvas (Phase 3) — business architecture nodes ────────────
  department:   { label: 'Department', color: BLUE,   Icon: Building2,  emoji: '🏢', description: 'Organizational unit or division' },
  team:         { label: 'Team',       color: TEAL,   Icon: Users,      emoji: '👥', description: 'Squad, team, or working group' },
  objective:    { label: 'Objective',  color: INDIGO, Icon: Crosshair,  emoji: '🎯', description: 'Measurable OKR or strategic objective' },
  budget:       { label: 'Budget',     color: GOLD,   Icon: Wallet,     emoji: '💰', description: 'Cost center or budget allocation' },
  risk:         { label: 'Risk',       color: RED,    Icon: AlertTriangle, emoji: '⚠️', description: 'Business risk or exposure item' },
  milestone:    { label: 'Milestone',  color: ORANGE, Icon: Flag,       emoji: '🏁', description: 'Key delivery checkpoint or deadline' },
  // ── Agent Composition canvas (Phase 3) — agent pipeline nodes ─────────────
  trigger:      { label: 'Trigger',    color: PURPLE, Icon: Zap,        emoji: '⚡', description: 'Event or condition that starts the pipeline' },
  tool:         { label: 'Tool',       color: BLUE,   Icon: Wrench,     emoji: '🔧', description: 'External capability or function call' },
  store:        { label: 'Store',      color: TEAL,   Icon: Archive,    emoji: '💾', description: 'Memory store, vector DB, or RAG context' },
  pipeline:     { label: 'Pipeline',   color: LIME,   Icon: Layers,     emoji: '🔄', description: 'Sequential or parallel processing stage' },
  monitor:      { label: 'Monitor',    color: AMBER,  Icon: Eye,        emoji: '👁️', description: 'Observes a live metric or output stream' },
  handoff:      { label: 'Handoff',    color: RED,    Icon: UserCheck,  emoji: '🤝', description: 'Escalation to human judgment' },
  // ── Legacy aliases ─────────────────────────────────────────────────────────
  action:       { label: 'Agent',      color: BLUE,   Icon: Play,       emoji: '🤖' },
  notification: { label: 'Notify',     color: GREEN,  Icon: Bell,       emoji: '📢' },
  delay:        { label: 'Wait',       color: SLATE,  Icon: Clock,      emoji: '⏳' },
  approval:     { label: 'Approval',   color: PURPLE, Icon: GitBranch,  emoji: '✅' },
  integration:  { label: 'Integrate',  color: RED,    Icon: LinkIcon,   emoji: '🔌' },
}

// NODE_REGISTRY — single source of truth for node type → category mapping.
// All new node types are added here; PALETTE derives from this automatically.
const NODE_REGISTRY: Array<{ type: string; category: 'intelligence' | 'operational' | 'enterprise' | 'agents' }> = [
  // Intelligence canvas — thinking nodes
  { type: 'goal',       category: 'intelligence' },
  { type: 'context',    category: 'intelligence' },
  { type: 'analyze',    category: 'intelligence' },
  { type: 'insight',    category: 'intelligence' },
  { type: 'hypothesis', category: 'intelligence' },
  { type: 'simulate',   category: 'intelligence' },
  { type: 'decision',   category: 'intelligence' },
  { type: 'policy',     category: 'intelligence' },
  { type: 'execute',    category: 'intelligence' },
  { type: 'learn',      category: 'intelligence' },
  { type: 'kpi',        category: 'intelligence' },
  // Operational canvas — workflow nodes
  { type: 'notify',     category: 'operational'  },
  { type: 'wait',       category: 'operational'  },
  { type: 'agent',      category: 'operational'  },
  { type: 'event',      category: 'operational'  },
  { type: 'create',     category: 'operational'  },
  { type: 'integrate',  category: 'operational'  },
  { type: 'condition',  category: 'operational'  },
  // Enterprise canvas — business architecture nodes
  { type: 'department', category: 'enterprise'   },
  { type: 'team',       category: 'enterprise'   },
  { type: 'objective',  category: 'enterprise'   },
  { type: 'budget',     category: 'enterprise'   },
  { type: 'risk',       category: 'enterprise'   },
  { type: 'milestone',  category: 'enterprise'   },
  // Agent Composition canvas — agent pipeline nodes
  { type: 'trigger',    category: 'agents'        },
  { type: 'tool',       category: 'agents'        },
  { type: 'store',      category: 'agents'        },
  { type: 'pipeline',   category: 'agents'        },
  { type: 'monitor',    category: 'agents'        },
  { type: 'handoff',    category: 'agents'        },
]

// Palette derives from NODE_REGISTRY — adding a node type = add one entry above.
const PALETTE: Record<CanvasMode, string[]> = {
  workflow:     NODE_REGISTRY.filter(n => n.category === 'operational').map(n => n.type),
  intelligence: NODE_REGISTRY.filter(n => n.category === 'intelligence').map(n => n.type),
  enterprise:   NODE_REGISTRY.filter(n => n.category === 'enterprise').map(n => n.type),
  agents:       NODE_REGISTRY.filter(n => n.category === 'agents').map(n => n.type),
  all:          NODE_REGISTRY.map(n => n.type),
}

// WVIS 3.0 — what node logically follows each intelligence thinking node type
const INTEL_NEXT: Record<string, string[]> = {
  goal:       ['context', 'kpi', 'policy'],
  context:    ['analyze', 'hypothesis'],
  analyze:    ['insight', 'hypothesis', 'simulate'],
  insight:    ['decision', 'simulate'],
  hypothesis: ['simulate', 'analyze'],
  simulate:   ['decision', 'policy'],
  decision:   ['execute', 'policy'],
  policy:     ['execute'],
  execute:    ['learn'],
  learn:      ['kpi', 'goal'],
  kpi:        ['insight', 'goal'],
}

// WVIS 3.0 — copilot placeholder text per canvas mode
const COPILOT_PLACEHOLDER: Record<CanvasMode, string> = {
  intelligence: 'Describe a strategic challenge → WAANDA builds the thinking chain…',
  workflow:     'Describe a workflow → WAANDA generates it on canvas…',
  enterprise:   'Describe your business architecture → WAANDA maps it…',
  agents:       'Describe an agent pipeline → WAANDA scaffolds it…',
  all:          'Describe anything → WAANDA generates the graph…',
}

// All node types that open the AI Explain drawer on click (intelligence + enterprise + agents)
const INTEL_EXPLAIN = new Set<string>([
  'goal', 'context', 'analyze', 'insight', 'hypothesis', 'simulate', 'decision', 'policy', 'execute', 'learn', 'kpi',
  'department', 'team', 'objective', 'budget', 'risk', 'milestone',
  'trigger', 'tool', 'store', 'pipeline', 'monitor', 'handoff',
])
const NODE_W = 234
const NODE_H = 96

// ── Canvas context (shared with WfNode without prop-drilling) ─────────────────

interface CanvasActions {
  hoveredId:      string | null
  nodeIssues:     Map<string, ValidationIssue[]>
  liveNodeTypes:  Set<string>
  liveMode:       boolean
  nodeConfidence: Map<string, number>
  kpiData:        KpiData | null
  goalStatus:     Map<string, 'on-track' | 'at-risk'>
  runNodeState:   Map<string, string>  // nodeId → 'pending'|'running'|'completed'|'failed'
  onDuplicate:    (id: string) => void
  onDelete:       (id: string) => void
  onUpdate:       (id: string, patch: Partial<WorkflowStep>) => void
  onExplain:      (issue: ValidationIssue) => void
}
const CanvasCtx = createContext<CanvasActions>({
  hoveredId: null, nodeIssues: new Map(), liveNodeTypes: new Set(), liveMode: false,
  nodeConfidence: new Map(), kpiData: null, goalStatus: new Map(), runNodeState: new Map(),
  onDuplicate: () => {}, onDelete: () => {}, onUpdate: () => {}, onExplain: () => {},
})

// ── Layout ────────────────────────────────────────────────────────────────────

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 })
  g.setDefaultEdgeLabel(() => ({}))
  nodes.forEach(n => g.setNode(n.id, { width: NODE_W, height: NODE_H }))
  edges.forEach(e => g.setEdge(e.source, e.target))
  dagre.layout(g)
  return nodes.map(n => {
    const { x, y } = g.node(n.id)
    return { ...n, position: { x: x - NODE_W / 2, y: y - NODE_H / 2 } }
  })
}

// ── Steps ↔ Flow ──────────────────────────────────────────────────────────────

function stepsToFlow(steps: WorkflowStep[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = steps.map(s => ({
    id: s.id, type: 'wfNode', position: { x: 0, y: 0 }, data: { step: s },
  }))
  const edges: Edge[] = []
  steps.forEach(s => {
    const color = NODE_CFG[s.type]?.color ?? BLUE
    if (s.onSuccess) edges.push({
      id: `${s.id}→${s.onSuccess}`, source: s.id, target: s.onSuccess,
      sourceHandle: s.type === 'condition' ? 'yes' : 'out',
      label: s.type === 'condition' ? 'YES' : undefined,
      markerEnd: { type: MarkerType.ArrowClosed, color: `${color}80` },
      style: { stroke: `${color}60`, strokeWidth: 2 },
    })
    if (s.onFailure) edges.push({
      id: `${s.id}→fail→${s.onFailure}`, source: s.id, target: s.onFailure,
      sourceHandle: 'no', label: 'NO',
      markerEnd: { type: MarkerType.ArrowClosed, color: `${RED}80` },
      style: { stroke: `${RED}60`, strokeWidth: 2 },
    })
  })
  if (edges.length === 0 && steps.length > 1) {
    for (let i = 0; i < steps.length - 1; i++) {
      const color = NODE_CFG[steps[i].type]?.color ?? BLUE
      edges.push({
        id: `auto-${steps[i].id}→${steps[i + 1].id}`,
        source: steps[i].id, target: steps[i + 1].id, sourceHandle: 'out',
        markerEnd: { type: MarkerType.ArrowClosed, color: `${color}80` },
        style: { stroke: `${color}60`, strokeWidth: 2 },
      })
    }
  }
  return { nodes: applyDagreLayout(nodes, edges), edges }
}

function flowToSteps(nodes: Node[], edges: Edge[]): WorkflowStep[] {
  return nodes.map((n, i) => {
    const step = n.data.step as WorkflowStep
    const successEdge = edges.find(e => e.source === n.id && e.sourceHandle !== 'no')
    const failureEdge = edges.find(e => e.source === n.id && e.sourceHandle === 'no')
    return { ...step, order: i, onSuccess: successEdge?.target, onFailure: failureEdge?.target }
  })
}

// ── Hover toolbar button ───────────────────────────────────────────────────────

function ToolbarBtn({ icon: Icon, label, color, onClick }: {
  icon: React.ElementType; label: string; color: string; onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick(e) }} title={label} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 6, border: 'none',
      background: `${color}18`, cursor: 'pointer', transition: `background 0.12s`,
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${color}32`}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${color}18`}
    >
      <Icon style={{ width: 12, height: 12, color }} />
    </button>
  )
}

// ── Custom workflow node ───────────────────────────────────────────────────────

function WfNode({ id, data, selected }: NodeProps) {
  const ctx  = useContext(CanvasCtx)
  const step = data.step as WorkflowStep
  const cfg  = NODE_CFG[step.type] ?? NODE_CFG.agent
  const isCondition = step.type === 'condition'
  const hovered   = ctx.hoveredId === id
  const issues    = ctx.nodeIssues.get(id) ?? []
  const hasError  = issues.some(i => i.severity === 'error')
  const hasIssue  = issues.length > 0
  const issueColor = hasError ? RED : AMBER
  const isLive      = ctx.liveMode && ctx.liveNodeTypes.has(step.type)
  const confidence  = isLive ? (ctx.nodeConfidence.get(step.type) ?? 62) : 0
  const runState    = ctx.runNodeState.get(id) as 'pending' | 'running' | 'completed' | 'failed' | undefined

  // ① Double-click inline edit
  const [editing,  setEditing]  = useState(false)
  const [editName, setEditName] = useState(step.name)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { if (!editing) setEditName(step.name) }, [step.name, editing])

  const startEdit  = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setEditing(true); setEditName(step.name) }
  const commitEdit = () => {
    const name = editName.trim()
    if (name && name !== step.name) ctx.onUpdate(id, { name })
    setEditing(false)
  }

  return (
    <>
      {/* ② Hover mini-toolbar */}
      <NodeToolbar isVisible={hovered && !editing} position={Position.Top} style={{ padding: 0 }}>
        <div style={{
          display: 'flex', gap: 3, padding: '3px 4px',
          background: CARD, border: `1px solid ${EDGE_C}`, borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        }}>
          <ToolbarBtn icon={Copy}    label="Duplicate" color={BLUE} onClick={() => ctx.onDuplicate(id)} />
          <ToolbarBtn icon={Trash2}  label="Delete"    color={RED}  onClick={() => ctx.onDelete(id)}    />
          {issues.length > 0 && (
            <ToolbarBtn icon={HelpCircle} label={`Explain ${issues[0].code}`} color={PURPLE}
              onClick={() => ctx.onExplain(issues[0])} />
          )}
        </div>
      </NodeToolbar>

      <div style={{
        position: 'relative',
        width: NODE_W, padding: '12px 14px', borderRadius: 14,
        background: selected ? `${cfg.color}0d` : runState === 'running' ? `${AMBER}0c` : runState === 'completed' ? `${GREEN}0c` : runState === 'failed' ? `${RED}0c` : CARD,
        border: `1px solid ${runState === 'running' ? AMBER : runState === 'completed' ? GREEN : runState === 'failed' ? RED : selected ? cfg.color : isLive ? `${cfg.color}70` : hasIssue ? issueColor : EDGE_C}`,
        borderLeft: `3px solid ${runState === 'running' ? AMBER : runState === 'completed' ? GREEN : runState === 'failed' ? RED : hasIssue && !selected ? issueColor : cfg.color}`,
        outline: hasIssue && !selected && !runState ? `1px solid ${issueColor}30` : 'none',
        outlineOffset: 2,
        opacity: runState === 'pending' ? 0.45 : 1,
        animation: runState === 'running' ? 'livePulse 0.9s ease-in-out infinite' : isLive ? 'livePulse 2.4s ease-in-out infinite' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: runState === 'running'
          ? `0 0 20px ${AMBER}44, 0 2px 12px rgba(0,0,0,0.28)`
          : runState === 'completed'
          ? `0 0 16px ${GREEN}33, 0 2px 12px rgba(0,0,0,0.28)`
          : runState === 'failed'
          ? `0 0 16px ${RED}33, 0 2px 12px rgba(0,0,0,0.28)`
          : selected
          ? `0 0 24px ${cfg.color}22, inset 0 1px 0 rgba(255,255,255,0.02)`
          : isLive
          ? `0 0 20px ${cfg.color}30, 0 2px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.02)`
          : hasIssue
          ? `0 0 16px ${issueColor}20, 0 2px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.02)`
          : '0 2px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.02)',
      }}>
        {/* Issue badge */}
        {hasIssue && (
          <div title={issues.map(i => i.message).join('\n')} style={{
            position: 'absolute', top: -7, right: -7,
            width: 16, height: 16, borderRadius: '50%',
            background: issueColor, border: `2px solid ${CARD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 800, color: '#fff', lineHeight: 1,
            zIndex: 10, cursor: 'default',
          }}>
            {issues.length}
          </div>
        )}
        {/* Live signal indicator */}
        {isLive && !hasIssue && !runState && (
          <div title="Live signal active" style={{
            position: 'absolute', top: -5, right: -5,
            width: 10, height: 10, borderRadius: '50%',
            background: cfg.color, border: `2px solid ${CARD}`,
            animation: 'liveDot 1.6s ease-in-out infinite',
            zIndex: 10,
          }} />
        )}
        {/* Run state badge */}
        {runState === 'running' && (
          <div title="Executing…" style={{
            position: 'absolute', top: -7, right: -7, zIndex: 10,
            width: 16, height: 16, borderRadius: '50%',
            background: AMBER, border: `2px solid ${CARD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock3 style={{ width: 9, height: 9, color: '#fff' }} />
          </div>
        )}
        {runState === 'completed' && (
          <div title="Completed" style={{
            position: 'absolute', top: -7, right: -7, zIndex: 10,
            width: 16, height: 16, borderRadius: '50%',
            background: GREEN, border: `2px solid ${CARD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle style={{ width: 9, height: 9, color: '#fff' }} />
          </div>
        )}
        {runState === 'failed' && (
          <div title="Failed" style={{
            position: 'absolute', top: -7, right: -7, zIndex: 10,
            width: 16, height: 16, borderRadius: '50%',
            background: RED, border: `2px solid ${CARD}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <XCircle style={{ width: 9, height: 9, color: '#fff' }} />
          </div>
        )}
        <Handle type="target" id="in" position={Position.Top}
          style={{ background: cfg.color, border: 'none', width: 8, height: 8, top: -4 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <span style={{ fontSize: 14, lineHeight: 1 }}>{cfg.emoji}</span>
          <span style={{
            fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: cfg.color, background: `${cfg.color}12`, border: `1px solid ${cfg.color}22`,
            padding: '2px 5px', borderRadius: 4,
          }}>
            {cfg.label}
          </span>
        </div>

        {/* ③ Inline edit on double-click */}
        {editing ? (
          <input
            ref={inputRef}
            className="nodrag"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              e.stopPropagation()
              if (e.key === 'Enter')  commitEdit()
              if (e.key === 'Escape') setEditing(false)
            }}
            style={{
              width: '100%', padding: '3px 6px', borderRadius: 6, boxSizing: 'border-box',
              background: RAISE, border: `1px solid ${cfg.color}60`,
              color: 'var(--os-text-1)', fontSize: 11, fontWeight: 600,
              outline: 'none', marginBottom: 3,
            }}
          />
        ) : (
          <p
            onDoubleClick={startEdit}
            title="Double-click to rename"
            style={{
              fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)',
              margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              cursor: 'text',
            }}
          >
            {step.name}
          </p>
        )}

        <p style={{
          fontSize: 10, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.4,
          overflow: 'hidden',
          display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' as const,
        }}>
          {step.description || '—'}
        </p>

        {isLive && (
          <div style={{
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: cfg.color,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
            LIVE · {confidence}%
          </div>
        )}

        {step.type === 'goal' && ctx.goalStatus.has(id) && (
          <div style={{
            marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px',
            borderRadius: 4, fontSize: 8, fontWeight: 800, letterSpacing: '0.08em',
            background: ctx.goalStatus.get(id) === 'on-track' ? `${GREEN}18` : `${RED}18`,
            color: ctx.goalStatus.get(id) === 'on-track' ? GREEN : RED,
            border: `1px solid ${ctx.goalStatus.get(id) === 'on-track' ? `${GREEN}30` : `${RED}30`}`,
          }}>
            {ctx.goalStatus.get(id) === 'on-track' ? '✓ ON TRACK' : '⚠ AT RISK'}
          </div>
        )}

        {step.type === 'kpi' && isLive && ctx.kpiData && (
          <div style={{
            marginTop: 6, padding: '5px 6px', borderRadius: 6,
            background: `${cfg.color}10`, border: `1px solid ${cfg.color}22`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: cfg.color, letterSpacing: '0.08em' }}>SIGNAL HEALTH</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: cfg.color }}>{ctx.kpiData.health}%</span>
            </div>
            {ctx.kpiData.metrics.slice(0, 3).map(m => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                <span style={{ fontSize: 8, color: SLATE }}>{m.label}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: m.trend === 'up' ? GREEN : m.trend === 'down' ? RED : AMBER }}>
                  {m.current}/{m.target}
                </span>
              </div>
            ))}
            {ctx.kpiData.criticalCount > 0 && (
              <div style={{ marginTop: 3, fontSize: 8, fontWeight: 700, color: RED }}>
                ⚠ {ctx.kpiData.criticalCount} critical
              </div>
            )}
          </div>
        )}

        {isCondition ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px 0', marginTop: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: GREEN }}>YES</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: RED }}>NO</span>
            </div>
            <Handle type="source" id="yes" position={Position.Bottom}
              style={{ background: GREEN, border: 'none', width: 8, height: 8, left: '28%', bottom: -4 }} />
            <Handle type="source" id="no" position={Position.Bottom}
              style={{ background: RED, border: 'none', width: 8, height: 8, left: '72%', bottom: -4 }} />
          </>
        ) : (
          <Handle type="source" id="out" position={Position.Bottom}
            style={{ background: cfg.color, border: 'none', width: 8, height: 8, bottom: -4 }} />
        )}
      </div>
    </>
  )
}

const nodeTypes = { wfNode: WfNode }

// ── WAANDA Explain Drawer ─────────────────────────────────────────────────────

function ExplainDrawer({ issue, workflowName, stepCount, nodes, onClose }: {
  issue:        ValidationIssue
  workflowName: string
  stepCount:    number
  nodes:        Node[]
  onClose:      () => void
}) {
  const [loading,     setLoading]     = useState(true)
  const [explanation, setExplanation] = useState('')
  const [fetchErr,    setFetchErr]    = useState('')

  const node = issue.nodeId ? nodes.find(n => n.id === issue.nodeId) : undefined
  const step = node?.data?.step as WorkflowStep | undefined
  const color = issue.severity === 'error' ? RED : AMBER

  useEffect(() => {
    setLoading(true); setExplanation(''); setFetchErr('')
    api.post('/admin/kangqore-immp/validation/explain', {
      code:         issue.code,
      message:      issue.message,
      nodeType:     step?.type   ?? null,
      nodeName:     step?.name   ?? null,
      workflowName,
      stepCount,
    })
      .then(r  => setExplanation(r.data.explanation ?? ''))
      .catch(e => setFetchErr(e?.response?.data?.error || e?.message || 'Failed to get explanation'))
      .finally(() => setLoading(false))
  }, [issue.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: CARD, border: `1px solid ${color}30`,
          borderRadius: 20, padding: '24px 26px', maxWidth: 540, width: '90vw',
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${color}15`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `${color}14`, border: `1px solid ${color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare style={{ width: 16, height: 16, color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                fontFamily: 'monospace', color,
                background: `${color}14`, border: `1px solid ${color}28`,
                padding: '2px 7px', borderRadius: 5,
              }}>
                {issue.code}
              </span>
              <span style={{
                fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
                color: SLATE, letterSpacing: '0.1em',
              }}>
                {issue.severity}
              </span>
              {step && (
                <span style={{
                  fontSize: 9, color: SLATE,
                  background: RAISE, border: `1px solid ${EDGE_C}`,
                  padding: '1px 6px', borderRadius: 4,
                }}>
                  {step.name}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.5 }}>
              {issue.message}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
            <X style={{ width: 14, height: 14, color: SLATE }} />
          </button>
        </div>

        {/* WAANDA label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Brain style={{ width: 11, height: 11, color: PURPLE }} />
          <span style={{
            fontSize: 9, fontWeight: 700, color: PURPLE,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            WAANDA Explanation
          </span>
        </div>

        {/* Explanation body */}
        <div style={{
          background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12,
          padding: '16px 18px', minHeight: 80,
          display: 'flex', alignItems: loading ? 'center' : 'flex-start',
          justifyContent: loading ? 'center' : 'flex-start',
        }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: SLATE }}>
              <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12 }}>WAANDA is analysing the issue…</span>
            </div>
          )}
          {!loading && fetchErr && (
            <span style={{ fontSize: 12, color: RED }}>{fetchErr}</span>
          )}
          {!loading && !fetchErr && explanation && (
            <p style={{ fontSize: 13, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.7 }}>
              {explanation}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button onClick={onClose} style={{
            padding: '7px 18px', borderRadius: 10, border: 'none',
            background: `${BLUE}16`, color: BLUE, fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── WAANDA Intelligence Validator™ — Score Panel ──────────────────────────────

function ScorePanel({ result, score, workflowName, stepCount, nodes, onExplain }: {
  result:       ValidationResult
  score:        ValidationScore
  workflowName: string
  stepCount:    number
  nodes:        Node[]
  onExplain:    (issue: ValidationIssue) => void
}) {
  const [open, setOpen] = useState(false)
  const { issues } = result
  const errors   = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')

  const scoreColor = score.overall >= 90 ? GREEN : score.overall >= 70 ? AMBER : RED

  type DomainKey = keyof typeof score.domains
  const DOMAINS: { key: DomainKey; label: string; pending?: boolean }[] = [
    { key: 'structure',     label: 'Structure'   },
    { key: 'execution',     label: 'Execution'   },
    { key: 'businessLogic', label: 'Business'    },
    { key: 'security',      label: 'Security',   pending: true },
    { key: 'governance',    label: 'Governance', pending: true },
  ]

  const domainColor = (v: number, pending?: boolean) =>
    pending ? SLATE : v >= 90 ? GREEN : v >= 70 ? AMBER : RED

  return (
    <div style={{
      borderRadius: 14, background: CARD, border: `1px solid ${EDGE_C}`,
      overflow: 'hidden', transition: `all 0.2s ${EASE}`,
    }}>
      {/* Compact header row */}
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '10px 14px', border: 'none', background: 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
      }}>
        {/* Score ring */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
          background: `${scoreColor}12`, border: `2px solid ${scoreColor}35`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
            {score.overall}
          </span>
          <span style={{ fontSize: 7, color: scoreColor, opacity: 0.65, letterSpacing: '0.04em' }}>/100</span>
        </div>

        {/* 3 live domain mini-bars */}
        <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          {DOMAINS.slice(0, 3).map(d => (
            <div key={d.key} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 8, fontWeight: 600, color: SLATE, whiteSpace: 'nowrap' }}>{d.label}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: domainColor(score.domains[d.key]) }}>
                  {score.domains[d.key]}
                </span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: `${SLATE}20`, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${score.domains[d.key]}%`,
                  background: domainColor(score.domains[d.key]),
                  transition: `width 0.4s ${EASE}`,
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Issue badges */}
        <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center' }}>
          {errors.length > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
              color: RED, background: `${RED}16`, border: `1px solid ${RED}28`,
            }}>
              {errors.length}E
            </span>
          )}
          {warnings.length > 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 5,
              color: AMBER, background: `${AMBER}16`, border: `1px solid ${AMBER}28`,
            }}>
              {warnings.length}W
            </span>
          )}
          {issues.length === 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: GREEN }}>✓</span>
          )}
          <span style={{ fontSize: 9, color: SLATE, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ borderTop: `1px solid ${EDGE_C}`, padding: '12px 14px' }}>
          {/* All 5 domain bars in 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 14 }}>
            {DOMAINS.map(d => (
              <div key={d.key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: SLATE }}>
                    {d.label}
                    {d.pending && <span style={{ fontSize: 7, color: `${SLATE}80`, marginLeft: 3 }}>(pending)</span>}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: domainColor(score.domains[d.key], d.pending) }}>
                    {score.domains[d.key]}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: `${SLATE}20`, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${score.domains[d.key]}%`,
                    background: domainColor(score.domains[d.key], d.pending),
                    opacity: d.pending ? 0.3 : 1,
                    transition: `width 0.4s ${EASE}`,
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Issue list with Explain buttons */}
          {issues.length > 0 ? (
            <div style={{ borderTop: `1px solid ${EDGE_C}40`, paddingTop: 10 }}>
              {issues.map(issue => {
                const c = issue.severity === 'error' ? RED : AMBER
                return (
                  <div key={issue.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 0', borderBottom: `1px solid ${EDGE_C}25`,
                  }}>
                    <span style={{ fontSize: 8, color: c, flexShrink: 0 }}>
                      {issue.severity === 'error' ? '●' : '▲'}
                    </span>
                    <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4, minWidth: 0 }}>
                      {issue.message}
                    </span>
                    <button
                      onClick={() => onExplain(issue)}
                      title="WAANDA explains this issue"
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
                        padding: '2px 7px', borderRadius: 5,
                        border: `1px solid ${PURPLE}30`, background: `${PURPLE}10`,
                        color: PURPLE, fontSize: 9, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'monospace', letterSpacing: '0.04em',
                        transition: `all 0.12s ${EASE}`,
                      }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${PURPLE}22`; el.style.borderColor = `${PURPLE}55` }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${PURPLE}10`; el.style.borderColor = `${PURPLE}30` }}
                    >
                      <HelpCircle style={{ width: 8, height: 8 }} />
                      {issue.code}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ fontSize: 11, color: GREEN, margin: 0, textAlign: 'center', paddingTop: 4 }}>
              ✓ All checks passed
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Decision Node — AI Explain Drawer ────────────────────────────────────────
// Opens when clicking a Decision node in Intelligence mode.
// Calls /workflows/explain-decision to get structured strategic analysis.

interface DecisionAnalysis {
  purpose:      string
  reasoning:    string
  confidence:   number
  evidence:     string[]
  alternatives: string[]
  policies:     string[]
  dependencies: number
}

interface LiveRecord {
  id:          string
  question:    string
  reasoning:   string
  evidence:    Array<{ source: string; type: string; snippet: string }>
  options:     Array<{ label: string; recommendation: string; pros: string[]; cons: string[]; roi?: string; confidence: number }>
  confidence:  number
  selected?:   string
  outcome?:    string
  agentsMixed: string[]
  createdAt:   string
}

function DecisionExplainDrawer({ step, workflowName, nodes, edges, onClose }: {
  step:         WorkflowStep
  workflowName: string
  nodes:        Node[]
  edges:        Edge[]
  onClose:      () => void
}) {
  const [loading,      setLoading]      = useState(true)
  const [analysis,     setAnalysis]     = useState<DecisionAnalysis | null>(null)
  const [liveRecord,   setLiveRecord]   = useState<LiveRecord | null>(null)
  const [fetchErr,     setFetchErr]     = useState('')
  const [runningKimmp, setRunningKimmp] = useState(false)
  const [kimmpErr,     setKimmpErr]     = useState('')

  const cfg = NODE_CFG[step.type] ?? NODE_CFG.decision

  async function runKimmpDecision() {
    setRunningKimmp(true); setKimmpErr('')
    try {
      const question = step.description?.trim()
        || `Analyze the strategic decision: ${step.name}`
      const res = await api.post('/admin/kangqore-immp/strategic-decisions', {
        question, workflowName, stepName: step.name,
      })
      if (res.data) setLiveRecord(res.data)
    } catch (e: any) {
      setKimmpErr(e?.response?.data?.error || e?.message || 'KIMMP analysis failed')
    } finally {
      setRunningKimmp(false)
    }
  }

  // Derive ancestor + descendant names from graph
  const ancestors: string[]   = []
  const descendants: string[] = []
  const nodeMap = new Map(nodes.map(n => [n.id, (n.data?.step as WorkflowStep)?.name ?? n.id]))
  // BFS upstream
  const visited = new Set<string>()
  const queue   = [step.id]
  while (queue.length) {
    const id = queue.shift()!
    edges.filter(e => e.target === id && !visited.has(e.source)).forEach(e => {
      visited.add(e.source); ancestors.push(nodeMap.get(e.source) ?? e.source); queue.push(e.source)
    })
  }
  // BFS downstream
  const visited2 = new Set<string>()
  const queue2   = [step.id]
  while (queue2.length) {
    const id = queue2.shift()!
    edges.filter(e => e.source === id && !visited2.has(e.target)).forEach(e => {
      visited2.add(e.target); descendants.push(nodeMap.get(e.target) ?? e.target); queue2.push(e.target)
    })
  }

  useEffect(() => {
    setLoading(true); setAnalysis(null); setLiveRecord(null); setFetchErr('')
    Promise.all([
      api.post('/admin/kangqore-immp/workflows/explain-decision', {
        nodeName: step.name, nodeType: step.type, workflowName,
        ancestors, descendants, stepCount: nodes.length,
      }),
      api.get('/admin/kangqore-immp/strategic-decisions/by-step', {
        params: { workflowName, stepName: step.name },
      }).catch(() => null),
    ])
      .then(([aiRes, liveRes]) => {
        setAnalysis(aiRes.data)
        if (liveRes?.data) setLiveRecord(liveRes.data)
      })
      .catch(e => setFetchErr(e?.response?.data?.error || e?.message || 'WAANDA analysis failed'))
      .finally(() => setLoading(false))
  }, [step.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const confidenceColor = (v: number) => v >= 80 ? GREEN : v >= 60 ? AMBER : RED

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 6px' }}>
        {label}
      </p>
      {children}
    </div>
  )

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: CARD, border: `1px solid ${cfg.color}35`,
          borderRadius: 22, padding: '26px 28px', maxWidth: 580, width: '92vw',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${cfg.color}18`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: `${cfg.color}16`, border: `1.5px solid ${cfg.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            {cfg.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}28`,
                padding: '2px 7px', borderRadius: 5,
              }}>{cfg.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: SLATE, letterSpacing: '0.08em' }}>
                Intelligence Canvas
              </span>
              {liveRecord && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}28` }}>
                  KIMMP Live
                </span>
              )}
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 3px' }}>
              {step.name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0 }}>
              {step.description || 'No description'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
            <X style={{ width: 15, height: 15, color: SLATE }} />
          </button>
        </div>

        {/* WAANDA label + KIMMP trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Brain style={{ width: 11, height: 11, color: PURPLE }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            WAANDA Strategic Analysis
          </span>
          {!loading && !liveRecord && (
            <button
              onClick={runKimmpDecision}
              disabled={runningKimmp}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
                background: runningKimmp ? `${GREEN}08` : `${GREEN}12`,
                border: `1px solid ${GREEN}30`, color: GREEN,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                opacity: runningKimmp ? 0.7 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {runningKimmp
                ? <><Loader2 style={{ width: 9, height: 9, animation: 'spin 1s linear infinite' }} /> Running…</>
                : <><Zap style={{ width: 9, height: 9 }} /> Run KIMMP</>
              }
            </button>
          )}
          {!loading && liveRecord && (
            <button
              onClick={runKimmpDecision}
              disabled={runningKimmp}
              style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
                background: 'none', border: `1px solid ${SLATE}25`,
                color: SLATE, fontSize: 9, fontWeight: 600,
                opacity: runningKimmp ? 0.5 : 0.7,
              }}
            >
              {runningKimmp ? <Loader2 style={{ width: 9, height: 9, animation: 'spin 1s linear infinite' }} /> : '↺'} Refresh
            </button>
          )}
        </div>

        {kimmpErr && (
          <div style={{ padding: '8px 12px', borderRadius: 8, background: `${RED}0c`, border: `1px solid ${RED}22`, marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: RED, margin: 0 }}>{kimmpErr}</p>
          </div>
        )}

        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
            padding: '40px 0', color: SLATE,
          }}>
            <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite', color: PURPLE }} />
            <span style={{ fontSize: 13 }}>WAANDA is analysing the decision node…</span>
          </div>
        )}

        {!loading && fetchErr && (
          <div style={{ padding: '16px', borderRadius: 12, background: `${RED}10`, border: `1px solid ${RED}25` }}>
            <p style={{ fontSize: 12, color: RED, margin: 0 }}>{fetchErr}</p>
          </div>
        )}

        {!loading && analysis && (
          <>
            {/* Purpose */}
            <Section label="Purpose">
              <p style={{ fontSize: 13, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.65,
                background: RAISE, padding: '10px 14px', borderRadius: 10, border: `1px solid ${EDGE_C}` }}>
                {analysis.purpose}
              </p>
            </Section>

            {/* Confidence + Dependencies */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 6px' }}>
                  {liveRecord ? 'KIMMP Confidence' : 'Confidence'}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: confidenceColor(liveRecord ? liveRecord.confidence : analysis.confidence), lineHeight: 1 }}>
                    {liveRecord ? liveRecord.confidence : analysis.confidence}
                  </span>
                  <span style={{ fontSize: 12, color: SLATE }}>/100</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: `${SLATE}20`, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${liveRecord ? liveRecord.confidence : analysis.confidence}%`,
                    background: confidenceColor(liveRecord ? liveRecord.confidence : analysis.confidence),
                    transition: `width 0.5s ${EASE}`,
                  }} />
                </div>
              </div>
              <div style={{ background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 6px' }}>
                  Dependencies
                </p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--os-text-1)', margin: '0 0 4px', lineHeight: 1 }}>
                  {analysis.dependencies}
                </p>
                <p style={{ fontSize: 10, color: SLATE, margin: 0 }}>upstream nodes</p>
              </div>
            </div>

            {/* Reasoning */}
            <Section label="Reasoning">
              <p style={{ fontSize: 12, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.65,
                background: `${VIOLET}08`, padding: '10px 14px', borderRadius: 10, border: `1px solid ${VIOLET}20` }}>
                {analysis.reasoning}
              </p>
            </Section>

            {/* Evidence */}
            {analysis.evidence?.length > 0 && (
              <Section label="Evidence to consider">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {analysis.evidence.map((e, i) => (
                    <span key={i} style={{
                      fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 6,
                      background: `${INDIGO}10`, border: `1px solid ${INDIGO}25`, color: INDIGO,
                    }}>{e}</span>
                  ))}
                </div>
              </Section>
            )}

            {/* Alternatives */}
            {analysis.alternatives?.length > 0 && (
              <Section label="Alternative approaches">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {analysis.alternatives.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '6px 10px', borderRadius: 8,
                      background: `${ORANGE}08`, border: `1px solid ${ORANGE}20` }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: ORANGE, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                      <span style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Policies */}
            {analysis.policies?.length > 0 && (
              <Section label="Policy considerations">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {analysis.policies.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8,
                      padding: '6px 10px', borderRadius: 8,
                      background: `${RED}08`, border: `1px solid ${RED}18` }}>
                      <Shield style={{ width: 10, height: 10, color: RED, flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* KIMMP Live Record panel */}
            {liveRecord && (
              <>
                <div style={{ height: 1, background: EDGE_C, margin: '16px 0 14px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    KIMMP Live Record
                  </span>
                  <span style={{ fontSize: 9, color: SLATE, marginLeft: 'auto' }}>
                    {new Date(liveRecord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <p style={{ fontSize: 11, color: 'var(--os-text-2)', fontStyle: 'italic', margin: '0 0 12px',
                  background: `${GREEN}06`, padding: '8px 12px', borderRadius: 8, border: `1px solid ${GREEN}16`, lineHeight: 1.55 }}>
                  {liveRecord.question}
                </p>

                {liveRecord.evidence?.length > 0 && (
                  <Section label="Real Evidence">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {liveRecord.evidence.map((ev, i) => (
                        <span key={i} style={{
                          fontSize: 9, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                          background: `${GREEN}0e`, border: `1px solid ${GREEN}28`, color: GREEN,
                        }}>{ev.source} · {ev.snippet}</span>
                      ))}
                    </div>
                  </Section>
                )}

                {liveRecord.options?.length > 0 && (
                  <Section label="Structured Options">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {liveRecord.options.map((opt, i) => (
                        <div key={i} style={{
                          padding: '10px 12px', borderRadius: 10,
                          background: liveRecord.selected === opt.label ? `${AMBER}0c` : `${ORANGE}06`,
                          border: `1px solid ${liveRecord.selected === opt.label ? AMBER : ORANGE}22`,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: liveRecord.selected === opt.label ? AMBER : ORANGE }}>
                              {opt.label}
                            </span>
                            {liveRecord.selected === opt.label && (
                              <span style={{ fontSize: 9, fontWeight: 700, color: AMBER, background: `${AMBER}18`, border: `1px solid ${AMBER}35`, padding: '1px 6px', borderRadius: 4 }}>
                                Selected
                              </span>
                            )}
                            <span style={{ fontSize: 9, color: SLATE, marginLeft: 'auto' }}>
                              {opt.confidence}% confidence
                            </span>
                          </div>
                          <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: '0 0 5px', lineHeight: 1.5 }}>{opt.recommendation}</p>
                          <div style={{ height: 3, borderRadius: 2, background: `${SLATE}18`, overflow: 'hidden', marginBottom: 6 }}>
                            <div style={{ height: '100%', borderRadius: 2, width: `${opt.confidence}%`, background: confidenceColor(opt.confidence) }} />
                          </div>
                          {(opt.pros?.length > 0 || opt.cons?.length > 0) && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                              {opt.pros?.length > 0 && (
                                <div>
                                  {opt.pros.map((p, j) => (
                                    <p key={j} style={{ fontSize: 9, color: GREEN, margin: '0 0 2px', lineHeight: 1.4 }}>+ {p}</p>
                                  ))}
                                </div>
                              )}
                              {opt.cons?.length > 0 && (
                                <div>
                                  {opt.cons.map((c, j) => (
                                    <p key={j} style={{ fontSize: 9, color: RED, margin: '0 0 2px', lineHeight: 1.4 }}>− {c}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          {opt.roi && (
                            <p style={{ fontSize: 9, color: TEAL, margin: '4px 0 0', fontWeight: 600 }}>ROI: {opt.roi}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {liveRecord.outcome && (
                  <Section label="Recorded Outcome">
                    <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.55,
                      background: `${TEAL}08`, padding: '8px 12px', borderRadius: 8, border: `1px solid ${TEAL}22` }}>
                      {liveRecord.outcome}
                    </p>
                  </Section>
                )}

                {liveRecord.agentsMixed?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                    {liveRecord.agentsMixed.map(a => (
                      <span key={a} style={{
                        fontSize: 9, color: SLATE, background: `${SLATE}0a`, border: `1px solid ${SLATE}18`,
                        padding: '2px 6px', borderRadius: 4,
                      }}>{a}</span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Footer tag */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: liveRecord ? 12 : 4 }}>
              {liveRecord ? (
                <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                  color: GREEN, background: `${GREEN}0a`, border: `1px solid ${GREEN}20`, opacity: 0.7 }}>
                  KIMMP Live · {new Date(liveRecord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              ) : (
                <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 5,
                  color: SLATE, background: `${SLATE}0a`, border: `1px solid ${SLATE}20`, opacity: 0.65 }}>
                  WIR · Phase 3
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── AI Review Modal ───────────────────────────────────────────────────────────

interface ReviewResult {
  summary:              string
  riskBefore:           string
  riskAfter:            string
  estimatedTimeSaving:  string
  suggestions: Array<{ type: string; text: string }>
}

function ReviewModal({ wf, nodes, edges, validation, onClose }: {
  wf:         Workflow
  nodes:      Node[]
  edges:      Edge[]
  validation: ValidationResult
  onClose:    () => void
}) {
  const [loading, setLoading] = useState(true)
  const [result,  setResult]  = useState<ReviewResult | null>(null)
  const [fetchErr, setFetchErr] = useState('')

  useEffect(() => {
    setLoading(true)
    const steps = nodes.map(n => {
      const s = n.data?.step as WorkflowStep
      return { name: s.name, type: s.type }
    })
    const validationIssues = validation.issues.map(i => ({ code: i.code, message: i.message }))
    api.post('/admin/kangqore-immp/workflows/review', {
      workflowName: wf.name, steps, validationIssues,
    })
      .then(r  => setResult(r.data))
      .catch(e => setFetchErr(e?.response?.data?.error || e?.message || 'Review failed'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const riskColor = (r: string) => r === 'Low' ? GREEN : r === 'Medium' ? AMBER : RED

  const typeColor = (t: string) => ({
    optimization: BLUE, risk: RED, architecture: PURPLE, compliance: ORANGE,
  }[t] ?? SLATE)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: CARD, border: `1px solid ${PURPLE}30`,
          borderRadius: 22, padding: '26px 28px', maxWidth: 560, width: '92vw',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${PURPLE}15`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 13, flexShrink: 0,
            background: `${PURPLE}16`, border: `1.5px solid ${PURPLE}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Star style={{ width: 18, height: 18, color: PURPLE }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <Brain style={{ width: 11, height: 11, color: PURPLE }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                WAANDA AI Review
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>{wf.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X style={{ width: 14, height: 14, color: SLATE }} />
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: '40px 0', color: SLATE }}>
            <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite', color: PURPLE }} />
            <span style={{ fontSize: 13 }}>WAANDA is reviewing the workflow…</span>
          </div>
        )}

        {!loading && fetchErr && (
          <div style={{ padding: '16px', borderRadius: 12, background: `${RED}10`, border: `1px solid ${RED}25` }}>
            <p style={{ fontSize: 12, color: RED, margin: 0 }}>{fetchErr}</p>
          </div>
        )}

        {!loading && result && (
          <>
            {/* Summary */}
            <p style={{
              fontSize: 13, color: 'var(--os-text-1)', lineHeight: 1.65, margin: '0 0 18px',
              background: RAISE, padding: '12px 14px', borderRadius: 12, border: `1px solid ${EDGE_C}`,
            }}>
              {result.summary}
            </p>

            {/* Risk + Time saving */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              <div style={{ background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 5px' }}>
                  Risk Before
                </p>
                <span style={{ fontSize: 15, fontWeight: 800, color: riskColor(result.riskBefore) }}>{result.riskBefore}</span>
              </div>
              <div style={{ background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 5px' }}>
                  Risk After
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ArrowRight style={{ width: 10, height: 10, color: GREEN }} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: riskColor(result.riskAfter) }}>{result.riskAfter}</span>
                </div>
              </div>
              <div style={{ background: RAISE, border: `1px solid ${EDGE_C}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 5px' }}>
                  Time Saving
                </p>
                <span style={{ fontSize: 15, fontWeight: 800, color: GREEN }}>{result.estimatedTimeSaving}</span>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
              <>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: SLATE, margin: '0 0 10px' }}>
                  Suggestions
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {result.suggestions.map((s, i) => {
                    const c = typeColor(s.type)
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: `${c}08`, border: `1px solid ${c}20`,
                      }}>
                        <span style={{
                          fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                          background: `${c}18`, color: c, flexShrink: 0, textTransform: 'uppercase',
                          letterSpacing: '0.06em', marginTop: 1,
                        }}>
                          {s.type}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--os-text-1)', lineHeight: 1.55 }}>{s.text}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: `${BLUE}16`, color: BLUE, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Compile Pipeline Modal ────────────────────────────────────────────────────
// Runs 4 stages sequentially: Validate → Policy → Review → Deploy.
// Stages auto-advance on success. Failure halts the pipeline.

type PipeStage = 'validate' | 'policy' | 'review' | 'deploy'
type StageStatus = 'pending' | 'running' | 'pass' | 'warn' | 'fail'

interface StageState { status: StageStatus; detail: string }

function CompilerModal({ wf, nodes, edges, validation, score, onClose, onDeployed }: {
  wf:         Workflow
  nodes:      Node[]
  edges:      Edge[]
  validation: ValidationResult
  score:      ValidationScore
  onClose:    () => void
  onDeployed: (versionHash: string) => void
}) {
  const STAGES: { key: PipeStage; label: string }[] = [
    { key: 'validate', label: 'Validate'     },
    { key: 'policy',   label: 'Policy Check' },
    { key: 'review',   label: 'AI Review'    },
    { key: 'deploy',   label: 'Deploy'       },
  ]

  const [stages, setStages] = useState<Record<PipeStage, StageState>>({
    validate: { status: 'pending', detail: '' },
    policy:   { status: 'pending', detail: '' },
    review:   { status: 'pending', detail: '' },
    deploy:   { status: 'pending', detail: '' },
  })
  const [versionHash, setVersionHash] = useState('')
  const [done, setDone] = useState(false)

  const set = (key: PipeStage, s: Partial<StageState>) =>
    setStages(prev => ({ ...prev, [key]: { ...prev[key], ...s } }))

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      // ── Stage 1: Validate ────────────────────────────────────────────────
      set('validate', { status: 'running' })
      await new Promise(r => setTimeout(r, 400))
      const hasError = validation.issues.some(i => i.severity === 'error')
      if (hasError) {
        set('validate', {
          status: 'fail',
          detail: `${validation.issues.filter(i => i.severity === 'error').length} error(s) must be fixed before compiling`,
        })
        return
      }
      set('validate', {
        status: score.overall >= 80 ? 'pass' : 'warn',
        detail: `Score ${score.overall}/100 · ${validation.issues.filter(i => i.severity === 'error').length} errors · ${validation.issues.filter(i => i.severity === 'warning').length} warnings`,
      })
      if (cancelled) return

      // ── Stage 2: Policy check ────────────────────────────────────────────
      set('policy', { status: 'running' })
      let compileResult: { versionHash: string; policyViolations: Array<{ policyName: string; effect: string; reason: string }>; status: string; memoryId: string | null } | null = null
      try {
        const steps = nodes.map(n => {
          const s = n.data?.step as WorkflowStep
          return { id: s.id, type: s.type, name: s.name }
        })
        const { data } = await api.post('/admin/kangqore-immp/workflows/compile', {
          workflowId: wf.id, workflowName: wf.name, steps, canvasMode: 'workflow',
        })
        compileResult = data
      } catch (e: any) {
        set('policy', { status: 'fail', detail: e?.response?.data?.error ?? e?.message ?? 'Policy check failed' })
        return
      }
      if (cancelled) return

      const blocked = compileResult!.policyViolations.some(v => v.effect === 'DENY')
      set('policy', {
        status: blocked ? 'fail' : compileResult!.policyViolations.length > 0 ? 'warn' : 'pass',
        detail: compileResult!.policyViolations.length === 0
          ? 'No policy violations'
          : compileResult!.policyViolations.map(v => `${v.policyName} (${v.effect})`).join(' · '),
      })
      if (blocked) return
      setVersionHash(compileResult!.versionHash)

      // ── Stage 3: AI Review ───────────────────────────────────────────────
      set('review', { status: 'running' })
      try {
        const steps = nodes.map(n => {
          const s = n.data?.step as WorkflowStep
          return { name: s.name, type: s.type }
        })
        const { data } = await api.post('/admin/kangqore-immp/workflows/review', {
          workflowName: wf.name, steps,
          validationIssues: validation.issues.map(i => ({ code: i.code, message: i.message })),
        })
        const s = data as { riskBefore?: string; riskAfter?: string; suggestions?: unknown[] }
        const count = s.suggestions?.length ?? 0
        set('review', {
          status: s.riskAfter === 'High' ? 'warn' : 'pass',
          detail: `Risk ${s.riskBefore ?? '?'} → ${s.riskAfter ?? '?'} · ${count} suggestion${count !== 1 ? 's' : ''}`,
        })
      } catch {
        set('review', { status: 'warn', detail: 'Review skipped — ANTHROPIC_API_KEY not configured' })
      }
      if (cancelled) return

      // ── Stage 4: Deploy ──────────────────────────────────────────────────
      set('deploy', { status: 'running' })
      try {
        const steps = nodes.map((n, i) => {
          const s = n.data?.step as WorkflowStep
          const successEdge = edges.find(e => e.source === n.id && e.sourceHandle !== 'no')
          const failureEdge = edges.find(e => e.source === n.id && e.sourceHandle === 'no')
          return { ...s, order: i, onSuccess: successEdge?.target, onFailure: failureEdge?.target }
        })
        await api.patch(`/os-workflows/${wf.id}`, { steps })
        set('deploy', {
          status: 'pass',
          detail: `v.${compileResult!.versionHash} · ${nodes.length} steps deployed`,
        })
        setDone(true)
        onDeployed(compileResult!.versionHash)
      } catch (e: any) {
        set('deploy', { status: 'fail', detail: e?.response?.data?.error ?? e?.message ?? 'Deploy failed' })
      }
    }
    run()
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stageIcon = (s: StageStatus) => {
    if (s === 'running') return <Loader2 style={{ width: 14, height: 14, color: BLUE, animation: 'spin 1s linear infinite' }} />
    if (s === 'pass')    return <CheckCircle style={{ width: 14, height: 14, color: GREEN }} />
    if (s === 'warn')    return <AlertTriangle style={{ width: 14, height: 14, color: AMBER }} />
    if (s === 'fail')    return <XCircle style={{ width: 14, height: 14, color: RED }} />
    return <Clock3 style={{ width: 14, height: 14, color: `${SLATE}60` }} />
  }

  const stageColor = (s: StageStatus) =>
    ({ running: BLUE, pass: GREEN, warn: AMBER, fail: RED, pending: SLATE }[s])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={done ? onClose : undefined}
    >
      <div style={{
        background: CARD, border: `1px solid ${PURPLE}30`,
        borderRadius: 22, padding: '28px 30px', maxWidth: 500, width: '92vw',
        boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${PURPLE}15`,
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 13, flexShrink: 0,
            background: `${PURPLE}16`, border: `1.5px solid ${PURPLE}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 style={{ width: 18, height: 18, color: PURPLE }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>WAANDA Compile Pipeline</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0 }}>{wf.name}</p>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X style={{ width: 14, height: 14, color: SLATE }} />
          </button>
        </div>

        {/* Pipeline stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STAGES.map((stage, i) => {
            const st = stages[stage.key]
            const c  = stageColor(st.status)
            return (
              <div key={stage.key} style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
                {/* Vertical connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14, flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: `${c}22`, border: `1.5px solid ${c}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {stageIcon(st.status)}
                  </div>
                  {i < STAGES.length - 1 && (
                    <div style={{ width: 1.5, flex: 1, minHeight: 20, background: st.status === 'pass' || st.status === 'warn' ? `${GREEN}40` : `${SLATE}25`, margin: '4px 0' }} />
                  )}
                </div>

                {/* Stage content */}
                <div style={{ flex: 1, paddingBottom: i < STAGES.length - 1 ? 12 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: st.status === 'pending' ? SLATE : 'var(--os-text-1)' }}>{stage.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c }}>
                      {st.status === 'pending' ? '' : st.status}
                    </span>
                  </div>
                  {st.detail && (
                    <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.4 }}>{st.detail}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Done state */}
        {done && (
          <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <CheckCircle style={{ width: 14, height: 14, color: GREEN }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>Compiled successfully</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0, fontFamily: 'monospace' }}>
              v.{versionHash} · {nodes.length} steps · {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: done ? `${GREEN}16` : `${BLUE}16`,
            color: done ? GREEN : BLUE, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>
            {done ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Left panel row ────────────────────────────────────────────────────────────

function WfRow({ wf, isSelected, onClick }: { wf: Workflow; isSelected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '11px 15px',
      display: 'flex', alignItems: 'center', gap: 10,
      background: isSelected ? `${BLUE}08` : 'transparent',
      borderLeft: `3px solid ${isSelected ? BLUE : 'transparent'}`,
      borderBottom: `1px solid ${EDGE_C}`,
      cursor: 'pointer', transition: `background 0.15s ${EASE}`,
    }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = RAISE }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <GitBranch style={{ width: 13, height: 13, color: isSelected ? BLUE : SLATE, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 12, fontWeight: 600, margin: '0 0 2px',
          color: isSelected ? 'var(--os-text-1)' : 'var(--os-text-2)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {wf.name}
        </p>
        <span style={{ fontSize: 9, color: SLATE }}>{wf.steps.length} steps</span>
      </div>
      <ChevronRight style={{ width: 11, height: 11, color: SLATE, flexShrink: 0 }} />
    </button>
  )
}

// ── Node config drawer ────────────────────────────────────────────────────────

function NodeConfigDrawer({
  step, onUpdate, onDelete, onClose,
}: {
  step: WorkflowStep
  onUpdate: (patch: Partial<WorkflowStep>) => void
  onDelete: () => void
  onClose:  () => void
}) {
  const cfg = NODE_CFG[step.type] ?? NODE_CFG.agent
  const [name, setName] = useState(step.name)
  const [desc, setDesc] = useState(step.description)
  useEffect(() => { setName(step.name); setDesc(step.description) }, [step.id])

  return (
    <div style={{
      borderRadius: 18, background: CARD, border: `1px solid ${cfg.color}30`,
      padding: '14px 13px', alignSelf: 'start',
      boxShadow: `0 0 24px ${cfg.color}12, inset 0 1px 0 rgba(255,255,255,0.02)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{cfg.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            {cfg.label}
          </p>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)', margin: '1px 0 0' }}>Node Config</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
          <X style={{ width: 13, height: 13, color: SLATE }} />
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>Name</p>
        <input value={name} onChange={e => setName(e.target.value)} onBlur={() => onUpdate({ name })}
          style={{
            width: '100%', padding: '7px 9px', borderRadius: 8, boxSizing: 'border-box',
            background: RAISE, border: `1px solid ${EDGE_C}`, color: 'var(--os-text-1)',
            fontSize: 12, outline: 'none',
          }} />
      </div>

      <div style={{ marginBottom: 13 }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>Description</p>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} onBlur={() => onUpdate({ description: desc })}
          rows={3} style={{
            width: '100%', padding: '7px 9px', borderRadius: 8, boxSizing: 'border-box',
            background: RAISE, border: `1px solid ${EDGE_C}`, color: 'var(--os-text-1)',
            fontSize: 11, outline: 'none', resize: 'none', lineHeight: 1.5,
          }} />
      </div>

      <button onClick={() => onUpdate({ name, description: desc })} style={{
        width: '100%', padding: '8px', borderRadius: 10, border: 'none',
        background: `${BLUE}18`, color: BLUE, fontSize: 11, fontWeight: 700,
        cursor: 'pointer', marginBottom: 6,
      }}>
        Apply changes
      </button>
      <button onClick={onDelete} style={{
        width: '100%', padding: '8px', borderRadius: 10,
        border: `1px solid ${RED}25`, background: `${RED}08`,
        color: RED, fontSize: 11, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      }}>
        <Trash2 style={{ width: 11, height: 11 }} /> Delete step
      </button>
    </div>
  )
}

// ── Node palette chip ─────────────────────────────────────────────────────────

function PaletteChip({ type, cfg, onClick }: {
  type: string; cfg: typeof NODE_CFG[string]; onClick: () => void
}) {
  return (
    <button onClick={onClick} title={cfg.description} style={{
      display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', width: '100%',
      borderRadius: 10, cursor: 'pointer',
      background: `${cfg.color}08`, border: `1px solid ${cfg.color}1a`,
      transition: `all 0.14s ${EASE}`,
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cfg.color}16`; el.style.borderColor = `${cfg.color}38` }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cfg.color}08`; el.style.borderColor = `${cfg.color}1a` }}
    >
      <span style={{ fontSize: 13, lineHeight: 1 }}>{cfg.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: cfg.color, display: 'block' }}>{cfg.label}</span>
        {cfg.description && (
          <span style={{ fontSize: 9, color: SLATE, display: 'block', lineHeight: 1.3, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {cfg.description}
          </span>
        )}
      </div>
      <Plus style={{ width: 9, height: 9, color: cfg.color, opacity: 0.6, flexShrink: 0 }} />
    </button>
  )
}

// ── WVIS 3.0 — Node Suggestions (intelligence mode) ──────────────────────────
// Shown below the palette when in intelligence mode. Suggests what node logically
// follows the last-placed or last-selected node in the thinking chain.

function NodeSuggestions({ lastType, existingTypes, onAdd }: {
  lastType:      string | null
  existingTypes: string[]
  onAdd:         (type: string) => void
}) {
  if (!lastType || !INTEL_NEXT[lastType]) return null
  const suggestions = INTEL_NEXT[lastType]
    .filter(t => !existingTypes.includes(t))
    .slice(0, 3)
  if (!suggestions.length) return null

  return (
    <div style={{ marginTop: 10 }}>
      <p style={{
        fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: PURPLE, margin: '0 0 6px 2px',
        display: 'flex', alignItems: 'center', gap: 5,
      }}>
        <Sparkles style={{ width: 9, height: 9 }} />
        WAANDA suggests
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {suggestions.map(t => {
          const cfg = NODE_CFG[t]
          if (!cfg) return null
          return (
            <button key={t} onClick={() => onAdd(t)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
              borderRadius: 9, cursor: 'pointer', width: '100%',
              background: `${cfg.color}0c`,
              border: `1px dashed ${cfg.color}40`,
              transition: `all 0.14s ${EASE}`,
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cfg.color}18`; el.style.borderStyle = 'solid' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cfg.color}0c`; el.style.borderStyle = 'dashed' }}
            >
              <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, display: 'block' }}>{cfg.label}</span>
                <span style={{ fontSize: 8, color: SLATE, display: 'block', lineHeight: 1.3, marginTop: 1 }}>
                  Next in chain
                </span>
              </div>
              <ArrowRight style={{ width: 8, height: 8, color: cfg.color, opacity: 0.5, flexShrink: 0 }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Right-click context menu ──────────────────────────────────────────────────

interface CtxMenu { nodeId: string; x: number; y: number }

function ContextMenu({ menu, availableTypes, onExplain, onDuplicate, onDelete, onAddAfter, onClose }: {
  menu:           CtxMenu
  availableTypes: string[]
  onExplain:      () => void
  onDuplicate:    () => void
  onDelete:       () => void
  onAddAfter:     (t: string) => void
  onClose:        () => void
}) {
  const [subOpen, setSubOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) onClose()
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  const Btn = ({ icon: Icon, label, color, onClick, faded }: {
    icon: React.ElementType; label: string; color?: string; onClick: () => void; faded?: boolean
  }) => (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
      padding: '6px 10px', border: 'none', background: 'transparent',
      cursor: faded ? 'not-allowed' : 'pointer', borderRadius: 6,
      color: faded ? SLATE : (color ?? 'var(--os-text-1)'), opacity: faded ? 0.45 : 1,
      fontSize: 12, fontWeight: 500, transition: `background 0.1s`,
    }}
      onMouseEnter={e => { if (!faded) (e.currentTarget as HTMLElement).style.background = `${color ?? BLUE}10` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      <Icon style={{ width: 12, height: 12, flexShrink: 0 }} />{label}
    </button>
  )

  const sep = <div style={{ height: 1, background: EDGE_C, margin: '4px 0' }} />

  return (
    <div ref={ref} style={{
      position: 'fixed', left: menu.x, top: menu.y,
      background: CARD, border: `1px solid ${EDGE_C}`,
      borderRadius: 12, padding: 5,
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)', zIndex: 9999, minWidth: 180,
    }}>
      <Btn icon={HelpCircle} label="Explain issue…" color={PURPLE} onClick={onExplain} />
      {sep}
      <Btn icon={Copy}   label="Duplicate" onClick={onDuplicate} />
      <Btn icon={Trash2} label="Delete"    onClick={onDelete} color={RED} />
      {sep}
      <div style={{ position: 'relative' }}
        onMouseEnter={() => setSubOpen(true)}
        onMouseLeave={() => setSubOpen(false)}
      >
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', border: 'none',
          background: subOpen ? `${BLUE}10` : 'transparent',
          cursor: 'pointer', borderRadius: 6,
          color: 'var(--os-text-1)', fontSize: 12, fontWeight: 500,
        }}>
          <Plus style={{ width: 12, height: 12 }} />
          Add step after
          <ChevronR style={{ width: 11, height: 11, marginLeft: 'auto', color: SLATE }} />
        </button>
        {subOpen && (
          <div style={{
            position: 'absolute', left: '100%', top: -5,
            background: CARD, border: `1px solid ${EDGE_C}`,
            borderRadius: 12, padding: 5,
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)', minWidth: 140,
          }}>
            {availableTypes.map(t => {
              const c = NODE_CFG[t]
              return (
                <button key={t} onClick={() => onAddAfter(t)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 10px', border: 'none', background: 'transparent',
                  cursor: 'pointer', borderRadius: 6, fontSize: 12, color: c.color, fontWeight: 500,
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${c.color}10`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <span style={{ fontSize: 13 }}>{c.emoji}</span>{c.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── FitViewHook — must live inside ReactFlow context ─────────────────────────
function FitViewHook({ fitTrigger }: { fitTrigger: number }) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    if (fitTrigger > 0) fitView({ padding: 0.25, maxZoom: 1.2, duration: 350 })
  }, [fitTrigger, fitView])
  return null
}

// ── ShareModal ────────────────────────────────────────────────────────────────
const KB_SHORTCUTS = [
  { key: '⌘Z / ⌘⇧Z', desc: 'Undo / Redo' },
  { key: '⌘D',        desc: 'Duplicate selected node' },
  { key: '⌘A',        desc: 'Select all nodes' },
  { key: 'Delete / ⌫', desc: 'Delete selected node' },
  { key: '↑↓ / ↔',   desc: 'Navigate nodes' },
  { key: 'Enter',      desc: 'Open node config' },
  { key: 'Esc',        desc: 'Deselect / close' },
  { key: 'F',          desc: 'Fit canvas to view' },
  { key: '?',          desc: 'Toggle this cheatsheet' },
]

function ShareModal({ nodes, edges, wfName, onClose }: {
  nodes:  Node[]; edges: Edge[]; wfName: string; onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [tab,    setTab]    = useState<'share' | 'keys'>('share')

  const canvasPayload = JSON.stringify({ nodes, edges, name: wfName, v: 1 })
  const encoded       = btoa(unescape(encodeURIComponent(canvasPayload)))
  const shareUrl      = `${window.location.origin}${window.location.pathname}?canvas=${encoded}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges, name: wfName, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `${wfName.replace(/\s+/g, '-').toLowerCase()}.canvas.json`
    a.click(); URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: CARD, border: `1px solid ${EDGE_C}`, borderRadius: 18, width: 480, maxWidth: '92vw',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${EDGE_C}` }}>
          <div style={{ display: 'flex', gap: 0, borderRadius: 9, overflow: 'hidden', border: `1px solid ${EDGE_C}`, flexShrink: 0 }}>
            {(['share', 'keys'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 12px', fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none',
                background: tab === t ? `${BLUE}20` : 'transparent',
                color: tab === t ? BLUE : SLATE,
              }}>
                {t === 'share' ? '↗ Share' : '⌨ Shortcuts'}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {wfName}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 6, color: SLATE }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Body */}
        {tab === 'share' ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SLATE, marginBottom: 8 }}>
                Share Link — encodes full canvas state
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{
                  flex: 1, padding: '8px 10px', borderRadius: 8, border: `1px solid ${EDGE_C}`,
                  background: BG, fontSize: 10, fontFamily: 'monospace', color: SLATE,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {shareUrl.length > 60 ? shareUrl.slice(0, 60) + '…' : shareUrl}
                </div>
                <button onClick={copyLink} style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                  padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: copied ? `${GREEN}18` : `${BLUE}18`,
                  color: copied ? GREEN : BLUE, fontSize: 11, fontWeight: 700,
                  transition: 'all 0.2s',
                }}>
                  {copied ? <CheckCircle2 style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{ height: 1, background: EDGE_C }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SLATE, marginBottom: 8 }}>
                Export Canvas JSON
              </div>
              <button onClick={exportJson} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
                border: `1px solid ${PURPLE}30`, background: `${PURPLE}10`, color: PURPLE,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${PURPLE}1e` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${PURPLE}10` }}
              >
                <Download style={{ width: 14, height: 14 }} />
                Download {wfName.replace(/\s+/g, '-').toLowerCase()}.canvas.json
                <span style={{ marginLeft: 'auto', fontSize: 9, color: SLATE }}>
                  {nodes.length} nodes · {edges.length} edges
                </span>
              </button>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 10, background: `${BLUE}08`, border: `1px solid ${BLUE}20` }}>
              <p style={{ fontSize: 10, color: SLATE, lineHeight: 1.6, margin: 0 }}>
                The share link encodes the full canvas (nodes, edges, positions) in the URL. Anyone with the link can open it in their WAANDA Graph canvas. JSON export is ideal for version control or Blueprint archiving.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {KB_SHORTCUTS.map(({ key, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', borderBottom: `1px solid ${EDGE_C}20` }}>
                  <kbd style={{
                    fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 6, minWidth: 90, textAlign: 'center',
                    background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}28`,
                  }}>{key}</kbd>
                  <span style={{ fontSize: 11, color: 'var(--os-text-2)' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── WorkflowCanvas ────────────────────────────────────────────────────────────

interface Snapshot { nodes: Node[]; edges: Edge[] }

export function WorkflowCanvas() {
  const { workflows, selectedId, setSelected, updateWorkflow } = useWorkflowsStore()
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const [copilot,      setCopilot]      = useState('')
  const [generating,   setGenerating]   = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [saveErr,      setSaveErr]      = useState('')
  const [ctxMenu,      setCtxMenu]      = useState<CtxMenu | null>(null)
  const [configNodeId, setConfigNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [explainIssue, setExplainIssue] = useState<ValidationIssue | null>(null)
  const [canvasMode,   setCanvasMode]   = useState<CanvasMode>('workflow')
  const [intelStep,    setIntelStep]    = useState<WorkflowStep | null>(null)
  const [showReview,   setShowReview]   = useState(false)
  const [liveMode,     setLiveMode]     = useState(false)
  const [showCompile,  setShowCompile]  = useState(false)
  const [compiledHash, setCompiledHash] = useState('')
  const [showShare,    setShowShare]    = useState(false)
  const [fitTrigger,   setFitTrigger]  = useState(0)
  const [showFeed,     setShowFeed]    = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const { liveNodeTypes, liveSignalCount, liveActive, nodeConfidence, kpiData, signals } = useLiveIntelligence(liveMode, canvasMode)

  // A.3 — Live run status
  const [runNodeState, setRunNodeState] = useState<Map<string, string>>(new Map())
  const [runActive,    setRunActive]    = useState(false)
  const runTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // A.2 — Keyboard canvas navigation
  const kbFocusIdxRef = useRef(-1)

  // ① Undo/Redo — ref-based history (avoids stale closures)
  const historyRef    = useRef<Snapshot[]>([])
  const futureRef     = useRef<Snapshot[]>([])
  const nodesRef      = useRef(nodes)
  const edgesRef      = useRef(edges)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { nodesRef.current = nodes }, [nodes])
  useEffect(() => { edgesRef.current = edges }, [edges])

  // Canvas import — ?canvas=<base64> → load encoded nodes+edges
  useEffect(() => {
    const enc = searchParams.get('canvas')
    if (!enc) return
    try {
      const payload = JSON.parse(decodeURIComponent(escape(atob(enc))))
      if (payload?.nodes?.length) {
        historyRef.current = []; futureRef.current = []
        setNodes(payload.nodes); setEdges(payload.edges ?? [])
        setSaved(false)
        setSearchParams(prev => { const n = new URLSearchParams(prev); n.delete('canvas'); return n }, { replace: true })
      }
    } catch { /* malformed URL param — ignore */ }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // OIS seed — ?seed=ois&score=72 → auto-create KPI node in intelligence mode
  useEffect(() => {
    if (searchParams.get('seed') !== 'ois') return
    const oisScore = Number(searchParams.get('score') ?? 50)
    const kpiId    = `seed-kpi-${Date.now()}`
    const goalId   = `seed-goal-${Date.now()}`
    const seedNodes: Node[] = [
      {
        id: kpiId, type: 'wfNode', position: { x: 300, y: 60 },
        data: { step: { id: kpiId, type: 'kpi', name: `OIS Score — ${oisScore}/100`,
          description: `Current Operational Intelligence Score. Target: ${Math.min(oisScore + 15, 100)}/100`, order: 0 } as WorkflowStep },
      },
      {
        id: goalId, type: 'wfNode', position: { x: 300, y: 220 },
        data: { step: { id: goalId, type: 'goal', name: 'Improve Enterprise Intelligence',
          description: 'Drive OIS improvement across all pillars via WAANDA recommendations.', order: 1 } as WorkflowStep },
      },
    ]
    const seedEdge: Edge = {
      id: `${kpiId}->${goalId}`,
      source: kpiId, target: goalId, sourceHandle: 'out',
      markerEnd: { type: MarkerType.ArrowClosed, color: `${GOLD}80` },
      style: { stroke: `${GOLD}60`, strokeWidth: 2 },
    }
    setCanvasMode('intelligence')
    setNodes(seedNodes)
    setEdges([seedEdge])
    // Clear the seed param so refresh doesn't re-seed
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.delete('seed'); n.delete('score'); return n }, { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pushHistory = useCallback(() => {
    historyRef.current = [...historyRef.current.slice(-29), {
      nodes: nodesRef.current, edges: edgesRef.current,
    }]
    futureRef.current = []
    setCanUndo(true)
    setCanRedo(false)
  }, [])

  const undo = useCallback(() => {
    if (!historyRef.current.length) return
    const prev = historyRef.current[historyRef.current.length - 1]
    futureRef.current  = [{ nodes: nodesRef.current, edges: edgesRef.current }, ...futureRef.current.slice(0, 29)]
    historyRef.current = historyRef.current.slice(0, -1)
    setNodes(prev.nodes)
    setEdges(prev.edges)
    setCanUndo(historyRef.current.length > 0)
    setCanRedo(true)
  }, [setNodes, setEdges])

  const redo = useCallback(() => {
    if (!futureRef.current.length) return
    const next = futureRef.current[0]
    historyRef.current = [...historyRef.current, { nodes: nodesRef.current, edges: edgesRef.current }]
    futureRef.current  = futureRef.current.slice(1)
    setNodes(next.nodes)
    setEdges(next.edges)
    setCanUndo(true)
    setCanRedo(futureRef.current.length > 0)
  }, [setNodes, setEdges])

  // Duplicate + Delete — declared before the keyboard shortcut useEffect that references them
  const deleteNode = useCallback((nodeId: string) => {
    pushHistory()
    setNodes(nds => nds.filter(n => n.id !== nodeId))
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
    if (configNodeId === nodeId) setConfigNodeId(null)
    setCtxMenu(null); setSaved(false)
  }, [pushHistory, configNodeId, setNodes, setEdges])

  const duplicateNode = useCallback((nodeId: string) => {
    const orig = nodesRef.current.find(n => n.id === nodeId)
    if (!orig) return
    pushHistory()
    const newId = `step-${Date.now()}`
    setNodes(nds => [...nds, {
      ...orig, id: newId,
      position: { x: orig.position.x + 60, y: orig.position.y + 100 },
      data: { step: { ...(orig.data.step as WorkflowStep), id: newId, name: `${(orig.data.step as WorkflowStep).name} (copy)` } },
    }])
    setCtxMenu(null); setSaved(false)
  }, [pushHistory, setNodes])

  // Keyboard shortcuts — undo/redo + navigation + selection + share
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return }
        if (e.key === 'z' &&  e.shiftKey) { e.preventDefault(); redo(); return }
        if (e.key === 'y')                { e.preventDefault(); redo(); return }
        if (e.key === 'a') {
          e.preventDefault()
          setNodes(nodesRef.current.map(n => ({ ...n, selected: true })))
          return
        }
        if (e.key === 'd') {
          e.preventDefault()
          const sel = nodesRef.current.find(n => n.selected)
          if (sel) duplicateNode(sel.id)
          return
        }
        if (e.key === 'k') { e.preventDefault(); setShowShare(s => !s); return }
        return
      }
      // Don't steal from text inputs
      const tag = (e.target as HTMLElement)?.tagName?.toUpperCase()
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const nds = nodesRef.current
      if (e.key === '?') { setShowShare(s => !s); return }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setFitTrigger(t => t + 1); return }
      if (!nds.length) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault()
        const next = kbFocusIdxRef.current + 1 >= nds.length ? 0 : kbFocusIdxRef.current + 1
        kbFocusIdxRef.current = next
        setNodes(nds.map((n, i) => ({ ...n, selected: i === next })))
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = kbFocusIdxRef.current <= 0 ? nds.length - 1 : kbFocusIdxRef.current - 1
        kbFocusIdxRef.current = prev
        setNodes(nds.map((n, i) => ({ ...n, selected: i === prev })))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const idx = kbFocusIdxRef.current
        if (idx >= 0 && idx < nds.length) setConfigNodeId(nds[idx]?.id ?? null)
      } else if (e.key === 'Backspace') {
        const selNode = nds.find(n => n.selected)
        if (selNode && !configNodeId) { e.preventDefault(); deleteNode(selNode.id) }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setConfigNodeId(null)
        setShowShare(false)
        kbFocusIdxRef.current = -1
        setNodes(nds.map(n => ({ ...n, selected: false })))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [undo, redo, setNodes, duplicateNode, deleteNode, configNodeId])

  const wf = workflows.find(w => w.id === selectedId) ?? workflows[0]

  // A.3 — Start a visual run simulation through canvas nodes
  const startRun = useCallback(() => {
    if (runActive || !nodesRef.current.length || !wf) return
    if (runTimerRef.current) clearTimeout(runTimerRef.current)
    const orderedIds = nodesRef.current.map(n => n.id)
    setRunActive(true)
    setRunNodeState(new Map(orderedIds.map(id => [id, 'pending'])))
    let idx = 0
    const advance = () => {
      if (idx >= orderedIds.length) {
        setRunNodeState(new Map(orderedIds.map(id => [id, 'completed'])))
        api.post(`/os-workflows/${wf.id}/runs`, {
          status: 'completed', duration: orderedIds.length * 2,
          triggeredBy: 'Manual', stepsCompleted: orderedIds.length,
        }).catch(() => {})
        runTimerRef.current = setTimeout(() => {
          setRunNodeState(new Map()); setRunActive(false)
        }, 3000)
        return
      }
      setRunNodeState(prev => {
        const next = new Map(prev)
        if (idx > 0) next.set(orderedIds[idx - 1], 'completed')
        next.set(orderedIds[idx], 'running')
        return next
      })
      idx++
      runTimerRef.current = setTimeout(advance, 1500)
    }
    runTimerRef.current = setTimeout(advance, 300)
  }, [runActive, wf])

  const stopRun = useCallback(() => {
    if (runTimerRef.current) clearTimeout(runTimerRef.current)
    setRunNodeState(new Map()); setRunActive(false)
  }, [])

  useEffect(() => {
    if (!wf?.steps) return
    historyRef.current = []; futureRef.current = []
    setCanUndo(false); setCanRedo(false)
    const { nodes: n, edges: e } = stepsToFlow(wf.steps)
    setNodes(n); setEdges(e)
    setSaved(false); setConfigNodeId(null)
  }, [wf?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const onConnect = useCallback((connection: Connection) => {
    pushHistory()
    const srcNode = nodesRef.current.find(n => n.id === connection.source)
    const color   = NODE_CFG[(srcNode?.data?.step as WorkflowStep)?.type]?.color ?? BLUE
    setEdges(eds => addEdge({
      ...connection,
      markerEnd: { type: MarkerType.ArrowClosed, color: `${color}80` },
      style: { stroke: `${color}60`, strokeWidth: 2 },
    }, eds))
  }, [pushHistory, setEdges])

  // Hover with 120ms leave delay (so toolbar doesn't vanish while moving to it)
  const onNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    setHoveredNodeId(node.id)
  }, [])
  const onNodeMouseLeave = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => setHoveredNodeId(null), 120)
  }, [])

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setCtxMenu(null)
    const step = node.data?.step as WorkflowStep | undefined
    if (step?.type && INTEL_EXPLAIN.has(step.type)) {
      setIntelStep(step)
      return
    }
    setConfigNodeId(id => id === node.id ? null : node.id)
  }, [])

  const onNodeContextMenu = useCallback((evt: React.MouseEvent, node: Node) => {
    evt.preventDefault()
    setCtxMenu({ nodeId: node.id, x: evt.clientX + 4, y: evt.clientY + 4 })
    setConfigNodeId(node.id)
  }, [])

  const onPaneClick = useCallback(() => { setCtxMenu(null); setConfigNodeId(null) }, [])

  // Update node step data
  const updateNodeStep = useCallback((nodeId: string, patch: Partial<WorkflowStep>) => {
    pushHistory()
    setNodes(nds => nds.map(n =>
      n.id !== nodeId ? n : { ...n, data: { step: { ...(n.data.step as WorkflowStep), ...patch } } }
    ))
    setSaved(false)
  }, [pushHistory, setNodes])

  // Add step after
  const addAfterNode = useCallback((sourceId: string, type: string) => {
    const source = nodesRef.current.find(n => n.id === sourceId)
    if (!source) return
    pushHistory()
    const cfg = NODE_CFG[type]
    const newId = `step-${Date.now()}`
    setNodes(nds => [...nds, {
      id: newId, type: 'wfNode',
      position: { x: source.position.x, y: source.position.y + 140 },
      data: { step: { id: newId, type, name: `New ${cfg.label}`, description: 'Click to configure', order: nds.length } as WorkflowStep },
    }])
    setEdges(eds => [...eds, {
      id: `${sourceId}→${newId}`, source: sourceId, target: newId, sourceHandle: 'out',
      markerEnd: { type: MarkerType.ArrowClosed, color: `${cfg.color}80` },
      style: { stroke: `${cfg.color}60`, strokeWidth: 2 },
    }])
    setCtxMenu(null); setSaved(false)
  }, [pushHistory, setNodes, setEdges])

  // Palette add — WVIS 3.0: track last placed type for suggestion chain
  const addNode = useCallback((type: string) => {
    pushHistory()
    const cfg = NODE_CFG[type]
    const newId = `step-${Date.now()}`
    setNodes(nds => [...nds, {
      id: newId, type: 'wfNode',
      position: { x: 380, y: 80 + (nds.length % 5) * 130 },
      data: { step: { id: newId, type, name: `New ${cfg.label}`, description: 'Click to configure', order: nds.length } as WorkflowStep },
    }])
    setLastSuggestionType(type)
    setSaved(false)
  }, [pushHistory, setNodes])

  // ② Auto-arrange
  const reLayout = useCallback(() => {
    if (!nodesRef.current.length) return
    pushHistory()
    setNodes(applyDagreLayout([...nodesRef.current], [...edgesRef.current]))
  }, [pushHistory, setNodes])

  // WVIS 3.0 — track last placed/selected node type for suggestions
  const [lastSuggestionType, setLastSuggestionType] = useState<string | null>(null)

  // AI generation — passes canvas mode so backend picks the right system prompt
  const generate = async () => {
    if (!copilot.trim() || generating) return
    setGenerating(true)
    try {
      const { data } = await api.post('/admin/kangqore-immp/workflows/generate', {
        description: copilot,
        mode: canvasMode,
      })
      const gen = data.workflow
      if (gen?.steps?.length) {
        pushHistory()
        const steps: WorkflowStep[] = gen.steps.map((s: Record<string, unknown>, i: number) => ({
          id: String(s.id ?? `step-${Date.now()}-${i}`),
          type: (s.type as StepType) ?? (canvasMode === 'intelligence' ? 'goal' : 'agent'),
          name: String(s.label ?? s.name ?? `Step ${i + 1}`),
          description: String(s.description ?? ''),
          order: i, config: (s.config as Record<string, string>) ?? {},
        }))
        const { nodes: n, edges: e } = stepsToFlow(steps)
        setNodes(n); setEdges(e); setCopilot(''); setSaved(false)
        // seed suggestion type from last step of generated chain
        const last = steps[steps.length - 1]
        if (last?.type && canvasMode === 'intelligence') setLastSuggestionType(last.type)
      }
    } catch { /* silent */ } finally { setGenerating(false) }
  }

  // Save
  const save = async () => {
    if (!wf || saving) return
    setSaving(true); setSaveErr('')
    try {
      const steps = flowToSteps(nodesRef.current, edgesRef.current)
      await api.patch(`/os-workflows/${wf.id}`, { steps })
      updateWorkflow(wf.id, steps)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : 'Save failed')
      setTimeout(() => setSaveErr(''), 4000)
    } finally { setSaving(false) }
  }

  const configStep = configNodeId
    ? (nodes.find(n => n.id === configNodeId)?.data?.step as WorkflowStep | undefined)
    : undefined

  // Live validation — runs synchronously on every nodes/edges change
  const validation = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges])

  const score = useMemo(() => scoreWorkflow(validation), [validation])

  // Goals↔KPI linkage: BFS backwards from live KPI nodes → update connected goal status
  const goalStatus = useMemo<Map<string, 'on-track' | 'at-risk'>>(() => {
    const status = new Map<string, 'on-track' | 'at-risk'>()
    if (!liveMode || (canvasMode !== 'intelligence' && canvasMode !== 'all') || !kpiData || !liveNodeTypes.has('kpi')) return status
    const liveKpiIds = nodes
      .filter(n => (n.data?.step as WorkflowStep)?.type === 'kpi')
      .map(n => n.id)
    if (!liveKpiIds.length) return status
    // BFS backwards through edges to find all ancestors of KPI nodes
    const visited = new Set<string>()
    const queue = [...liveKpiIds]
    while (queue.length) {
      const id = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      edges.forEach(e => { if (e.target === id && !visited.has(e.source)) queue.push(e.source) })
    }
    const nodeStatus: 'on-track' | 'at-risk' = kpiData.health >= 65 ? 'on-track' : 'at-risk'
    nodes.forEach(n => {
      if ((n.data?.step as WorkflowStep)?.type === 'goal' && visited.has(n.id)) {
        status.set(n.id, nodeStatus)
      }
    })
    return status
  }, [nodes, edges, liveNodeTypes, canvasMode, liveMode, kpiData])

  const displayEdges = useMemo(() => {
    const isLive = liveMode && (canvasMode === 'intelligence' || canvasMode === 'all') && liveNodeTypes.size > 0
    if (!isLive) return edges
    return edges.map(e => {
      const srcNode  = nodes.find(n => n.id === e.source)
      const tgtNode  = nodes.find(n => n.id === e.target)
      const srcType  = (srcNode?.data?.step as WorkflowStep)?.type ?? ''
      const tgtType  = (tgtNode?.data?.step as WorkflowStep)?.type ?? ''
      const srcLive  = liveNodeTypes.has(srcType)
      const tgtLive  = liveNodeTypes.has(tgtType)
      if (!srcLive && !tgtLive) return e
      // Use source node color when it's live, otherwise target node color
      const edgeColor = srcLive
        ? (NODE_CFG[srcType]?.color ?? GREEN)
        : (NODE_CFG[tgtType]?.color ?? GREEN)
      return { ...e, animated: true, style: { ...e.style, stroke: `${edgeColor}b0`, strokeWidth: srcLive && tgtLive ? 3 : 2 } }
    })
  }, [edges, nodes, liveMode, canvasMode, liveNodeTypes])

  const canvasCtx: CanvasActions = {
    hoveredId:      hoveredNodeId,
    nodeIssues:     validation.nodeMap,
    liveNodeTypes,
    liveMode:       liveMode && (canvasMode === 'intelligence' || canvasMode === 'all'),
    nodeConfidence,
    kpiData,
    goalStatus,
    runNodeState,
    onDuplicate:    duplicateNode,
    onDelete:       deleteNode,
    onUpdate:       updateNodeStep,
    onExplain:      setExplainIssue,
  }

  if (!wf) return (
    <div style={{ padding: 48, textAlign: 'center', color: SLATE, fontSize: 13 }}>No workflows found.</div>
  )

  return (
    <CanvasCtx.Provider value={canvasCtx}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

        {/* Left: workflow list */}
        <div style={{
          borderRadius: 18, overflow: 'hidden', alignSelf: 'start',
          background: CARD, border: `1px solid ${EDGE_C}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}>
          <div style={{ padding: '13px 15px', borderBottom: `1px solid ${EDGE_C}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitBranch style={{ width: 13, height: 13, color: BLUE }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>Workflows</span>
            <span style={{
              marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
              color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}25`,
            }}>
              {workflows.length}
            </span>
          </div>
          {workflows.map(w => (
            <WfRow key={w.id} wf={w}
              isSelected={w.id === (selectedId || wf.id)}
              onClick={() => setSelected(w.id)}
            />
          ))}
        </div>

        {/* Right: canvas area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── WAANDA Graph — canvas mode toggle ───────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {([
              { mode: 'workflow'     as CanvasMode, emoji: '⚡', label: 'Operational',  color: BLUE   },
              { mode: 'intelligence' as CanvasMode, emoji: '🧠', label: 'Intelligence', color: PURPLE },
              { mode: 'enterprise'   as CanvasMode, emoji: '🏢', label: 'Enterprise',   color: INDIGO },
              { mode: 'agents'       as CanvasMode, emoji: '🤖', label: 'Agents',       color: LIME   },
              { mode: 'all'          as CanvasMode, emoji: '∞',  label: 'All Nodes',    color: TEAL   },
            ]).map(({ mode, emoji, label, color }) => {
              const active = canvasMode === mode
              return (
                <button key={mode} onClick={() => setCanvasMode(mode)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 9,
                  border: `1px solid ${active ? color : EDGE_C}`,
                  background: active ? `${color}14` : CARD,
                  color: active ? color : SLATE,
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  transition: `all 0.18s ${EASE}`,
                }}>
                  <span style={{ fontSize: 11 }}>{emoji}</span>
                  {label}
                  {active && <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.06em', color, opacity: 0.7 }}>ACTIVE</span>}
                </button>
              )
            })}
            <div style={{ flex: 1 }} />

            {/* Live Intelligence toggle — Intelligence and All modes */}
            {(canvasMode === 'intelligence' || canvasMode === 'all') && (
              <button
                onClick={() => { setLiveMode(m => { if (!m) setShowFeed(true); return !m }); if (liveMode) setShowFeed(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10,
                  border: `1px solid ${liveMode ? GREEN : EDGE_C}`,
                  background: liveMode ? `${GREEN}12` : CARD,
                  color: liveMode ? GREEN : SLATE,
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  transition: `all 0.18s ${EASE}`,
                }}>
                <Activity style={{ width: 12, height: 12 }} />
                {liveMode
                  ? liveActive
                    ? `Live · ${liveSignalCount} signal${liveSignalCount !== 1 ? 's' : ''}`
                    : 'Connecting…'
                  : 'Live'}
              </button>
            )}

            {/* AI Review button */}
            <button onClick={() => setShowReview(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10,
              border: `1px solid ${PURPLE}35`, background: `${PURPLE}10`,
              color: PURPLE, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              transition: `all 0.18s ${EASE}`,
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${PURPLE}1e` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${PURPLE}10` }}
            >
              <Star style={{ width: 12, height: 12 }} />
              AI Review
            </button>
          </div>

          {/* WAANDA AI Copilot bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 16,
            background: CARD, border: `1px solid ${EDGE_C}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02)`,
          }}>
            <Brain style={{ width: 15, height: 15, color: PURPLE, flexShrink: 0 }} />
            <input value={copilot} onChange={e => setCopilot(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') generate() }}
              placeholder={COPILOT_PLACEHOLDER[canvasMode]}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--os-text-1)' }} />
            {copilot && (
              <button onClick={() => setCopilot('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <X style={{ width: 13, height: 13, color: SLATE }} />
              </button>
            )}
            <button onClick={generate} disabled={!copilot.trim() || generating} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, border: 'none',
              background: `${PURPLE}18`, color: PURPLE, fontSize: 11, fontWeight: 700,
              cursor: copilot.trim() && !generating ? 'pointer' : 'not-allowed',
              opacity: copilot.trim() && !generating ? 1 : 0.5,
              transition: `all 0.2s ${EASE}`, flexShrink: 0,
            }}>
              {generating
                ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                : <Sparkles style={{ width: 12, height: 12 }} />}
              {generating ? 'Building…' : 'Generate'}
            </button>
            <div style={{ width: 1, height: 20, background: EDGE_C, flexShrink: 0 }} />
            {/* Compile button */}
            <button onClick={() => setShowCompile(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, border: 'none',
              background: compiledHash ? `${GREEN}16` : `${PURPLE}16`,
              color: compiledHash ? GREEN : PURPLE, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: `all 0.3s ${EASE}`, flexShrink: 0,
            }}>
              <Code2 style={{ width: 12, height: 12 }} />
              {compiledHash ? `v.${compiledHash}` : 'Compile'}
            </button>
            <div style={{ width: 1, height: 20, background: EDGE_C, flexShrink: 0 }} />
            <button onClick={save} disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, border: 'none',
              background: saved ? `${GREEN}16` : `${BLUE}16`,
              color: saved ? GREEN : BLUE, fontSize: 11, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: `all 0.3s ${EASE}`, flexShrink: 0,
            }}>
              {saving ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />
                : saved ? <CheckCircle2 style={{ width: 12, height: 12 }} />
                : <Save style={{ width: 12, height: 12 }} />}
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </button>
            <div style={{ width: 1, height: 20, background: EDGE_C, flexShrink: 0 }} />
            {/* A.3 — Run button */}
            <button onClick={runActive ? stopRun : startRun} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, border: 'none',
              background: runActive ? `${AMBER}18` : `${GREEN}14`,
              color: runActive ? AMBER : GREEN, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: `all 0.25s ${EASE}`, flexShrink: 0,
            }}>
              {runActive
                ? <><Loader2 style={{ width: 12, height: 12, animation: 'spin 0.8s linear infinite' }} /> Stop</>
                : <><Play style={{ width: 12, height: 12 }} /> Run</>
              }
            </button>
            <div style={{ width: 1, height: 20, background: EDGE_C, flexShrink: 0 }} />
            {/* Share / keyboard shortcuts button */}
            <button onClick={() => setShowShare(s => !s)} title="Share canvas · Keyboard shortcuts (?)" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, border: 'none',
              background: showShare ? `${TEAL}18` : `${TEAL}0c`,
              color: showShare ? TEAL : SLATE, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: `all 0.2s ${EASE}`, flexShrink: 0,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${TEAL}18`; (e.currentTarget as HTMLElement).style.color = TEAL }}
              onMouseLeave={e => { if (!showShare) { (e.currentTarget as HTMLElement).style.background = `${TEAL}0c`; (e.currentTarget as HTMLElement).style.color = SLATE } }}
            >
              <Share2 style={{ width: 12, height: 12 }} />
              Share
            </button>
          </div>

          {saveErr && (
            <div style={{ padding: '8px 14px', borderRadius: 10, fontSize: 11, background: `${RED}10`, border: `1px solid ${RED}25`, color: RED }}>
              {saveErr}
            </div>
          )}

          {/* WAANDA Intelligence Validator™ */}
          <ScorePanel
            result={validation}
            score={score}
            workflowName={wf.name}
            stepCount={nodes.length}
            nodes={nodes}
            onExplain={setExplainIssue}
          />

          {/* Canvas + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 152px', gap: 12 }}>

            {/* React Flow */}
            <div style={{ height: 580, borderRadius: 18, overflow: 'hidden', background: BG, border: `1px solid ${EDGE_C}` }}>
              <style>{`
                .react-flow__controls-button{background:var(--os-card)!important;border-color:var(--os-border)!important;fill:var(--os-text-2)!important}
                .react-flow__controls-button:hover{background:var(--os-surface-0)!important}
                @keyframes spin{to{transform:rotate(360deg)}}
                @keyframes livePulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 14px 4px transparent}}
                @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
              `}</style>
              <ReactFlow
                nodes={nodes} edges={displayEdges}
                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeContextMenu}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                onNodeDragStart={() => pushHistory()}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                fitView fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
                minZoom={0.3} maxZoom={2}
                deleteKeyCode="Delete"
              >
                <FitViewHook fitTrigger={fitTrigger} />
                <Background variant={BackgroundVariant.Dots} gap={24} size={1} color={`${SLATE}28`} />
                <Controls showInteractive={false} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${EDGE_C}` }} />
                <MiniMap
                  nodeColor={n => NODE_CFG[(n.data?.step as WorkflowStep)?.type]?.color ?? BLUE}
                  style={{ background: CARD, border: `1px solid ${EDGE_C}`, borderRadius: 10, overflow: 'hidden' }}
                  maskColor={`${BG}b0`}
                />

                {/* ① Undo/Redo + ② Auto-arrange — floating panel inside canvas */}
                <Panel position="top-left">
                  <div style={{
                    display: 'flex', gap: 4, padding: '4px 5px',
                    background: CARD, border: `1px solid ${EDGE_C}`, borderRadius: 10,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}>
                    {[
                      { icon: Undo2,      label: 'Undo (⌘Z)',        disabled: !canUndo, onClick: undo,      color: BLUE   },
                      { icon: Redo2,      label: 'Redo (⌘⇧Z)',       disabled: !canRedo, onClick: redo,      color: BLUE   },
                      { icon: LayoutGrid, label: 'Auto-arrange',     disabled: false,    onClick: reLayout,  color: PURPLE },
                    ].map(({ icon: Icon, label, disabled, onClick, color }) => (
                      <button key={label} onClick={onClick} disabled={disabled} title={label} style={{
                        width: 28, height: 28, borderRadius: 7, border: 'none',
                        background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: disabled ? 0.3 : 1, transition: `all 0.15s ${EASE}`,
                      }}
                        onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = `${color}16` }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <Icon style={{ width: 13, height: 13, color: disabled ? SLATE : color }} />
                      </button>
                    ))}
                  </div>
                </Panel>
              </ReactFlow>
            </div>

            {/* Right panel: config drawer or palette */}
            {configStep ? (
              <NodeConfigDrawer
                key={configNodeId}
                step={configStep}
                onUpdate={patch => updateNodeStep(configNodeId!, patch)}
                onDelete={() => deleteNode(configNodeId!)}
                onClose={() => setConfigNodeId(null)}
              />
            ) : (
              <div style={{
                borderRadius: 18, background: CARD, border: `1px solid ${EDGE_C}`,
                padding: '12px 10px', alignSelf: 'start',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.02)`,
              }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: SLATE, margin: '0 0 10px 2px' }}>
                  {canvasMode === 'intelligence' ? `Thinking Nodes · ${PALETTE.intelligence.length}`
                   : canvasMode === 'enterprise' ? `Enterprise · ${PALETTE.enterprise.length}`
                   : canvasMode === 'agents'     ? `Agent Nodes · ${PALETTE.agents.length}`
                   : canvasMode === 'all'        ? 'WAANDA Graph'
                   : 'Add Steps'}
                </p>
                {canvasMode === 'all' ? (
                  <>
                    {([
                      { key: 'intelligence' as CanvasMode, label: 'Intelligence' },
                      { key: 'workflow'     as CanvasMode, label: 'Operational'  },
                      { key: 'enterprise'   as CanvasMode, label: 'Enterprise'   },
                      { key: 'agents'       as CanvasMode, label: 'Agents'       },
                    ]).map(({ key, label }, i) => (
                      <div key={key}>
                        {i > 0 && <div style={{ height: 1, background: EDGE_C, margin: '8px 0' }} />}
                        <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: SLATE, margin: '0 0 6px 2px', opacity: 0.7 }}>
                          {label} · {PALETTE[key].length}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {PALETTE[key].map(t => (
                            <PaletteChip key={t} type={t} cfg={NODE_CFG[t]} onClick={() => addNode(t)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {PALETTE[canvasMode].map(t => (
                      <PaletteChip key={t} type={t} cfg={NODE_CFG[t]} onClick={() => addNode(t)} />
                    ))}
                  </div>
                )}
                {/* WVIS 3.0 — node suggestions in intelligence mode */}
                {canvasMode === 'intelligence' && (
                  <NodeSuggestions
                    lastType={lastSuggestionType}
                    existingTypes={nodes.map(n => (n.data?.step as WorkflowStep)?.type ?? '')}
                    onAdd={t => addNode(t)}
                  />
                )}

                <div style={{ height: 1, background: EDGE_C, margin: '12px 0' }} />
                {canvasMode === 'workflow' ? (
                  <p style={{ fontSize: 9, color: SLATE, lineHeight: 1.5, margin: 0 }}>
                    Click to edit · Double-click to rename · Right-click for more
                  </p>
                ) : (
                  <p style={{ fontSize: 9, color: SLATE, lineHeight: 1.5, margin: 0 }}>
                    Click any node → WAANDA analysis · Double-click to rename
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Phase 3 — Live Signal Feed Panel */}
          {liveMode && (canvasMode === 'intelligence' || canvasMode === 'all') && (
            <div style={{ borderRadius: 14, border: `1px solid ${GREEN}30`, background: `${GREEN}06`, overflow: 'hidden' }}>
              <button
                onClick={() => setShowFeed(f => !f)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: GREEN, flexShrink: 0,
                  animation: 'liveDot 1.6s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Intelligence Feed
                </span>
                <span style={{ fontSize: 10, color: SLATE, marginLeft: 2 }}>·</span>
                <span style={{ fontSize: 10, color: SLATE }}>{liveSignalCount} signal{liveSignalCount !== 1 ? 's' : ''} accumulated</span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: SLATE }}>{showFeed ? '▲ collapse' : '▼ expand'}</span>
              </button>

              {showFeed && (
                <div style={{ maxHeight: 200, overflowY: 'auto', borderTop: `1px solid ${GREEN}20` }}>
                  {signals.length === 0 ? (
                    <p style={{ fontSize: 11, color: SLATE, padding: '12px 16px' }}>Waiting for live signals…</p>
                  ) : (
                    signals.slice(0, 40).map(sig => {
                      const sevColor = sig.severity === 'CRITICAL' ? RED : sig.severity === 'HIGH' ? AMBER : sig.severity === 'MODERATE' ? BLUE : SLATE
                      const affectedNodes = (SIGNAL_AFFINITY[(sig.signalType ?? '').toUpperCase()] ?? []).join(', ')
                      return (
                        <div key={sig.id} style={{
                          display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 10, alignItems: 'center',
                          padding: '7px 14px', borderBottom: `1px solid ${GREEN}10`,
                          fontSize: 10,
                        }}>
                          <span style={{
                            padding: '1px 6px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                            background: `${sevColor}18`, color: sevColor, border: `1px solid ${sevColor}30`,
                            letterSpacing: '0.05em', whiteSpace: 'nowrap',
                          }}>
                            {sig.severity}
                          </span>
                          <span style={{ color: 'var(--os-text-1)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sig.signalType ?? sig.signalCategory}
                            {affectedNodes && (
                              <span style={{ color: SLATE, fontWeight: 400, marginLeft: 6 }}>→ {affectedNodes}</span>
                            )}
                          </span>
                          <span style={{ color: SLATE, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            {sig.sourceModule}
                          </span>
                          <span style={{ color: SLATE, fontFamily: 'monospace', fontSize: 9, whiteSpace: 'nowrap' }}>
                            {new Date(sig.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Meta bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            padding: '9px 16px', borderRadius: 14, background: CARD, border: `1px solid ${EDGE_C}`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-1)' }}>{wf.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: SLATE, letterSpacing: '0.06em' }}>{wf.category}</span>
            <span style={{ fontSize: 10, color: SLATE }}>·</span>
            <span style={{ fontSize: 10, color: SLATE }}>
              {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
            </span>
            <div style={{ flex: 1 }} />
            <button onClick={() => setShowShare(s => !s)} style={{
              display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
              cursor: 'pointer', padding: '2px 6px', borderRadius: 6,
              fontSize: 10, color: SLATE, fontFamily: 'inherit',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = TEAL }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = SLATE }}
              title="Open keyboard shortcuts and share panel"
            >
              <Keyboard style={{ width: 11, height: 11 }} />
              <span>⌘Z · ⌘D · ⌘A · F · ? → shortcuts</span>
            </button>
          </div>
        </div>

        {/* Context menu */}
        {ctxMenu && (() => {
          const ctxIssues = validation.nodeMap.get(ctxMenu.nodeId) ?? []
          return (
            <ContextMenu
              menu={ctxMenu}
              availableTypes={PALETTE[canvasMode]}
              onExplain={() => {
                if (ctxIssues.length > 0) setExplainIssue(ctxIssues[0])
                setCtxMenu(null)
              }}
              onDuplicate={() => duplicateNode(ctxMenu.nodeId)}
              onDelete={() => deleteNode(ctxMenu.nodeId)}
              onAddAfter={type => addAfterNode(ctxMenu.nodeId, type)}
              onClose={() => setCtxMenu(null)}
            />
          )
        })()}

        {/* WAANDA Explain Drawer (portal-level, rendered above everything) */}
        {explainIssue && (
          <ExplainDrawer
            issue={explainIssue}
            workflowName={wf.name}
            stepCount={nodes.length}
            nodes={nodes}
            onClose={() => setExplainIssue(null)}
          />
        )}

        {/* Intelligence node AI Explain Drawer (all 11 node types) */}
        {intelStep && (
          <DecisionExplainDrawer
            step={intelStep}
            workflowName={wf.name}
            nodes={nodes}
            edges={edges}
            onClose={() => setIntelStep(null)}
          />
        )}

        {/* AI Review Modal */}
        {showReview && (
          <ReviewModal
            wf={wf}
            nodes={nodes}
            edges={edges}
            validation={validation}
            onClose={() => setShowReview(false)}
          />
        )}

        {/* WAANDA Compile Pipeline */}
        {showCompile && (
          <CompilerModal
            wf={wf}
            nodes={nodes}
            edges={edges}
            validation={validation}
            score={score}
            onClose={() => setShowCompile(false)}
            onDeployed={hash => { setCompiledHash(hash); setSaved(true); setTimeout(() => setSaved(false), 3000) }}
          />
        )}

        {/* Share Canvas / Keyboard Shortcuts */}
        {showShare && (
          <ShareModal
            nodes={nodes}
            edges={edges}
            wfName={wf.name}
            onClose={() => setShowShare(false)}
          />
        )}
      </div>
    </CanvasCtx.Provider>
  )
}
