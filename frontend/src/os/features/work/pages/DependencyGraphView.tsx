// Dependency Graph View — SVG layered DAG
// Nodes = WorkItems, edges = blocks/dependsOn relationships.
// Implements topological layered layout (no external library).

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { RefreshCw, AlertTriangle, GitMerge } from 'lucide-react'
import { type WorkItemStatus, STATUS_COLOR } from '../types'
import { cn } from '@design-system/cn'

interface DNode {
  id: string; objectId: string; title: string
  type: string; status: WorkItemStatus; priority: string
  layer: number; criticalPath: boolean; isCycleNode: boolean
  estimatedHours?: number | null
}
interface DEdge { from: string; to: string; type: string }

const NODE_W = 160; const NODE_H = 48
const LAYER_GAP = 200; const NODE_GAP = 64

const PRIORITY_STROKE: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#8b5cf6', LOW: '#64748b',
}

function layoutNodes(nodes: DNode[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  const byLayer = new Map<number, DNode[]>()
  for (const n of nodes) {
    if (!byLayer.has(n.layer)) byLayer.set(n.layer, [])
    byLayer.get(n.layer)!.push(n)
  }
  for (const [layer, layerNodes] of Array.from(byLayer.entries())) {
    const totalH = layerNodes.length * (NODE_H + NODE_GAP)
    layerNodes.forEach((n, i) => {
      positions.set(n.id, {
        x: layer * LAYER_GAP + 40,
        y: i * (NODE_H + NODE_GAP) + 40 - totalH / 2 + (byLayer.size * (NODE_H + NODE_GAP)) / 2,
      })
    })
  }
  return positions
}

function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

interface Props { projectId?: string; portfolioId?: string }

export function DependencyGraphView({ projectId, portfolioId }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['work', 'dependency-graph', projectId, portfolioId],
    queryFn: () => api.get('/admin/work-os/work/dependency-graph', { params: { projectId, portfolioId } }).then(r => r.data),
    staleTime: 60_000,
  })

  const nodes: DNode[]  = data?.nodes  ?? []
  const edges: DEdge[]  = data?.edges  ?? []
  const stats           = data?.stats  ?? { total: 0, blocked: 0, criticalCount: 0, hasCycles: false }

  const positions = useMemo(() => layoutNodes(nodes), [nodes])

  const maxX = Math.max(...Array.from(positions.values()).map(p => p.x + NODE_W), 600)
  const maxY = Math.max(...Array.from(positions.values()).map(p => p.y + NODE_H), 400)
  const minY = Math.min(...Array.from(positions.values()).map(p => p.y), 0)
  const svgH = maxY - minY + 80
  const svgW = maxX + 40

  const idMap = new Map(nodes.map(n => [n.id, n]))

  if (isLoading) return <div className="text-sm text-[var(--os-text-2)] py-8 text-center">Computing dependency graph…</div>

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <GitMerge className="w-4 h-4" />
          <span>{stats.total} items · {edges.length} relationships</span>
        </div>
        {stats.criticalCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-violet-400">
            <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
            {stats.criticalCount} on critical path
          </div>
        )}
        {stats.blocked > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {stats.blocked} blocked
          </div>
        )}
        {stats.hasCycles && (
          <div className="flex items-center gap-1.5 text-xs text-amber-500">
            <AlertTriangle className="w-3 h-3" />
            Cycles detected
          </div>
        )}
        <button onClick={() => refetch()} className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)] ml-auto">
          <RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-[var(--os-text-2)]">
        <div className="flex items-center gap-1.5"><div className="w-4 h-px bg-red-500 border-dashed" style={{ borderTop: '1.5px dashed #ef4444' }} /> blocks</div>
        <div className="flex items-center gap-1.5"><div className="w-4 h-px" style={{ borderTop: '1.5px solid #8b5cf6' }} /> dependsOn</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-violet-500 bg-violet-500/10" /> critical path</div>
      </div>

      {nodes.length === 0 ? (
        <div className="border border-[var(--os-border)] rounded-2xl flex items-center justify-center h-64 text-sm text-[var(--os-text-2)]">
          No ontology-linked work items with relationships yet.<br />
          Add &ldquo;blocks&rdquo; or &ldquo;dependsOn&rdquo; relationships between items to see the graph.
        </div>
      ) : (
        <div className="border border-[var(--os-border)] rounded-2xl overflow-auto bg-[var(--os-bg-2)]">
          <svg width={svgW} height={svgH} style={{ minHeight: 300 }}>
            <g transform={`translate(0, ${-minY + 40})`}>
              {/* Edges */}
              {edges.map((edge, i) => {
                const sp = positions.get(edge.from); const tp = positions.get(edge.to)
                if (!sp || !tp) return null
                const x1 = sp.x + NODE_W; const y1 = sp.y + NODE_H / 2
                const x2 = tp.x;           const y2 = tp.y + NODE_H / 2
                const isBlock = edge.type === 'blocks'
                const isHovered = hovered === edge.from || hovered === edge.to
                return (
                  <path
                    key={i}
                    d={bezier(x1, y1, x2, y2)}
                    fill="none"
                    stroke={isBlock ? '#ef4444' : '#8b5cf6'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={isBlock ? '6,3' : undefined}
                    strokeOpacity={isHovered ? 1 : 0.5}
                    markerEnd="url(#arrow)"
                  />
                )
              })}

              {/* Arrow marker */}
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 Z" fill="#8b5cf6" />
                </marker>
              </defs>

              {/* Nodes */}
              {nodes.map(node => {
                const pos = positions.get(node.id)
                if (!pos) return null
                const isH = hovered === node.id
                const stroke = node.criticalPath ? '#8b5cf6' : node.isCycleNode ? '#f59e0b' : PRIORITY_STROKE[node.priority] ?? '#64748b'
                const textColor = node.status === 'COMPLETED' ? '#64748b' : '#e2e8f0'
                return (
                  <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}
                     onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}
                     style={{ cursor: 'pointer' }}>
                    <rect
                      width={NODE_W} height={NODE_H} rx={8}
                      fill={node.status === 'BLOCKED' ? '#ef444415' : node.criticalPath ? '#8b5cf615' : '#1e293b'}
                      stroke={isH ? '#c4b5fd' : stroke}
                      strokeWidth={isH ? 2.5 : node.criticalPath ? 2 : 1.5}
                    />
                    {/* Progress fill */}
                    {node.status !== 'COMPLETED' && (
                      <rect width={NODE_W * 0.01} height={4} rx={2} y={NODE_H - 6} x={2}
                            fill="#8b5cf6" style={{ width: `${(idMap.get(node.id) as any)?.progress ?? 0}%` }}
                            className="transition-all" />
                    )}
                    <text x={10} y={18} fontSize={10} fill="#94a3b8">{node.type}</text>
                    <text x={10} y={33} fontSize={11} fontWeight={600} fill={textColor} style={{ textDecoration: node.status === 'COMPLETED' ? 'line-through' : undefined }}>
                      {node.title.length > 18 ? node.title.slice(0, 17) + '…' : node.title}
                    </text>
                    {node.criticalPath && (
                      <circle cx={NODE_W - 10} cy={10} r={4} fill="#8b5cf6" />
                    )}
                    {node.isCycleNode && (
                      <circle cx={NODE_W - 20} cy={10} r={4} fill="#f59e0b" />
                    )}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      )}
    </div>
  )
}
