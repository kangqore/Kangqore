import { useRef, useState, useCallback, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import { X, ZoomIn, ZoomOut, Maximize2, GitBranch, Navigation, Star } from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Type colours (Monday.com palette) ────────────────────────────────────────
const TYPE_COLOURS: Record<string, string> = {
  Client:   '#579bfc',
  Project:  '#00c875',
  Invoice:  '#fdab3d',
  Lead:     '#7c3aed',
  Risk:     '#e2445c',
  User:     '#66ccff',
  Task:     '#ff69b4',
  Incident: '#e2445c',
  Default:  '#9ca3af',
}
function typeColor(name: string) { return TYPE_COLOURS[name] ?? TYPE_COLOURS.Default }

// ── Interfaces ────────────────────────────────────────────────────────────────
interface GraphNode {
  id: string; typeId: string; typeName: string
  externalId: string | null; properties: Record<string, unknown>
  markings: string[]; createdAt: string
  // force-graph runtime fields
  x?: number; y?: number; vx?: number; vy?: number; fx?: number; fy?: number
  color?: string
}

interface GraphEdge {
  id: string; source: string | GraphNode; target: string | GraphNode
  relationshipType: string; label: string | null
  strength: number; confidence: number; inferredBy: string | null
  validFrom: string; validTo: string | null; reason: string | null
}

interface GraphData { nodes: GraphNode[]; edges: GraphEdge[] }

interface Props {
  /** When set, BFS from this node. Otherwise loads /graph/full */
  rootId?:   string
  depth?:    number
  typeId?:   string
  limit?:    number
  height?:   number
  className?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function nodeLabel(n: GraphNode): string {
  const p = n.properties as any
  return p.name ?? p.title ?? p.label ?? n.externalId ?? n.id.slice(0, 8)
}

// ── Component ─────────────────────────────────────────────────────────────────
export function GraphCanvas({ rootId, depth = 2, typeId, limit = 200, height = 520, className }: Props) {
  const graphRef = useRef<any>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredEdge, setHoveredEdge]   = useState<string | null>(null)
  const [algo, setAlgo] = useState<'bfs' | 'centrality' | null>(null)

  // ── Fetch graph data ────────────────────────────────────────────────────────
  const endpoint = rootId
    ? `/admin/ontology/graph?rootId=${rootId}&depth=${depth}`
    : `/admin/ontology/graph/full?limit=${limit}${typeId ? `&typeId=${typeId}` : ''}`

  const { data: raw, isLoading } = useQuery<GraphData>({
    queryKey: ['ontology-graph', rootId, depth, typeId, limit],
    queryFn: () => apiFetch(endpoint),
    staleTime: 30_000,
  })

  const { data: centrality } = useQuery<Array<{ node: GraphNode; degree: number }>>({
    queryKey: ['ontology-centrality'],
    queryFn: () => apiFetch('/admin/ontology/graph/centrality?top=20'),
    enabled: algo === 'centrality',
    staleTime: 60_000,
  })

  // ── Node events ─────────────────────────────────────────────────────────────
  const handleNodeClick = useCallback((n: GraphNode) => setSelectedNode(n), [])
  const handleBgClick   = useCallback(() => setSelectedNode(null), [])

  // ── Node paint ───────────────────────────────────────────────────────────────
  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label  = nodeLabel(node)
    const r      = 6
    const color  = typeColor(node.typeName)
    const isHub  = algo === 'centrality' && centrality?.some(c => c.node.id === node.id)
    const isSel  = selectedNode?.id === node.id

    ctx.beginPath()
    ctx.arc(node.x!, node.y!, isSel ? r + 3 : isHub ? r + 2 : r, 0, 2 * Math.PI)
    ctx.fillStyle = isSel ? '#fff' : color
    ctx.fill()
    if (isSel || isHub) {
      ctx.strokeStyle = color
      ctx.lineWidth   = isSel ? 2.5 : 1.5
      ctx.stroke()
    }

    if (globalScale > 1.5) {
      const fontSize = 10 / globalScale
      ctx.font = `${fontSize}px Inter,sans-serif`
      ctx.fillStyle = 'var(--os-text-1, #e2e8f0)'
      ctx.textAlign = 'center'
      ctx.fillText(label.slice(0, 20), node.x!, node.y! + r + fontSize)
    }
  }, [selectedNode, algo, centrality])

  // ── Link paint ────────────────────────────────────────────────────────────────
  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const s = link.source as GraphNode; const t = link.target as GraphNode
    if (!s?.x || !t?.x) return
    const isHov = hoveredEdge === link.id
    ctx.beginPath()
    ctx.moveTo(s.x, s.y)
    ctx.lineTo(t.x, t.y)
    ctx.strokeStyle = isHov ? '#579bfc' : `rgba(148,163,184,${link.confidence ?? 0.6})`
    ctx.lineWidth   = isHov ? 2 : Math.max(0.5, (link.strength ?? 1) * 1.5) / globalScale
    ctx.stroke()

    if (globalScale > 2 && link.relationshipType) {
      const mx = (s.x + t.x) / 2; const my = (s.y + t.y) / 2
      ctx.font = `${8 / globalScale}px Inter,sans-serif`
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.fillText(link.relationshipType, mx, my)
    }
  }, [hoveredEdge])

  // Normalize edges for force-graph (source/target as IDs)
  const graphData = raw ? {
    nodes: raw.nodes.map(n => ({ ...n, color: typeColor(n.typeName) })),
    links: raw.edges.map(e => ({
      ...e,
      source: typeof e.source === 'string' ? e.source : (e.source as GraphNode).id,
      target: typeof e.target === 'string' ? e.target : (e.target as GraphNode).id,
    })),
  } : { nodes: [], links: [] }

  useEffect(() => {
    if (graphRef.current) graphRef.current.d3Force('charge')?.strength(-120)
  }, [raw])

  // ── Events side panel ────────────────────────────────────────────────────────
  const { data: eventsData } = useQuery<{ items: any[] }>({
    queryKey: ['ontology-events', selectedNode?.id],
    queryFn: () => apiFetch(`/admin/ontology/events?objectId=${selectedNode!.id}&limit=10`),
    enabled: !!selectedNode,
    staleTime: 30_000,
  })

  const { data: relsData } = useQuery<{ items: any[] }>({
    queryKey: ['ontology-node-rels', selectedNode?.id],
    queryFn: () => apiFetch(`/admin/ontology/relationships?sourceId=${selectedNode!.id}&limit=20`),
    enabled: !!selectedNode,
    staleTime: 30_000,
  })

  return (
    <div className={cn('relative rounded-lg border border-[var(--os-border)] overflow-hidden bg-[var(--os-surface-0)]', className)}>

      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          onClick={() => graphRef.current?.zoomIn()}
          className="p-1.5 rounded bg-[var(--os-card)] border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        ><ZoomIn className="w-3.5 h-3.5" /></button>
        <button
          onClick={() => graphRef.current?.zoomOut()}
          className="p-1.5 rounded bg-[var(--os-card)] border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        ><ZoomOut className="w-3.5 h-3.5" /></button>
        <button
          onClick={() => graphRef.current?.zoomToFit(400)}
          className="p-1.5 rounded bg-[var(--os-card)] border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          title="Fit to view"
        ><Maximize2 className="w-3.5 h-3.5" /></button>

        <div className="w-px h-5 bg-[var(--os-border)]" />

        <button
          onClick={() => setAlgo(a => a === 'centrality' ? null : 'centrality')}
          className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors',
            algo === 'centrality'
              ? 'bg-[#7c3aed]/20 border-[#7c3aed]/40 text-[#7c3aed]'
              : 'bg-[var(--os-card)] border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
          )}
        ><Star className="w-3 h-3" />Centrality</button>

        {selectedNode && (
          <button
            onClick={() => window.open(`/kangqore-view/admin/ontology/graph?rootId=${selectedNode.id}`, '_self')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border bg-[var(--os-card)] border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          ><Navigation className="w-3 h-3" />Expand</button>
        )}
      </div>

      {/* Stats badge */}
      {raw && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 text-xs text-[var(--os-text-2)]">
          <span className="px-2 py-1 rounded bg-[var(--os-card)] border border-[var(--os-border)]">
            {raw.nodes.length} nodes · {raw.edges.length} edges
          </span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[var(--os-surface-0)]/60">
          <div className="text-sm text-[var(--os-text-2)]">Loading graph…</div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && raw?.nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2">
          <GitBranch className="w-8 h-8 text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-2)]">No graph data yet. Run auto-link to seed relationships.</p>
        </div>
      )}

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={undefined}
        height={height}
        backgroundColor="transparent"
        nodeCanvasObject={paintNode as any}
        nodeCanvasObjectMode={() => 'replace'}
        linkCanvasObject={paintLink as any}
        linkCanvasObjectMode={() => 'replace'}
        onNodeClick={handleNodeClick as any}
        onBackgroundClick={handleBgClick}
        onLinkHover={(link: any) => setHoveredEdge(link?.id ?? null)}
        d3VelocityDecay={0.4}
        cooldownTime={3000}
        enableNodeDrag
        enablePanInteraction
        enableZoomInteraction
      />

      {/* Node side drawer */}
      {selectedNode && (
        <div className="absolute top-0 right-0 h-full w-72 bg-[var(--os-card)] border-l border-[var(--os-border)] flex flex-col overflow-hidden z-20">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--os-border)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: typeColor(selectedNode.typeName) }} />
                <span className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wide">{selectedNode.typeName}</span>
              </div>
              <p className="text-sm font-medium text-[var(--os-text-1)] mt-0.5">{nodeLabel(selectedNode)}</p>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {/* Properties */}
            <div>
              <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase mb-2">Properties</p>
              <div className="space-y-1">
                {Object.entries(selectedNode.properties ?? {}).slice(0, 8).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-[var(--os-text-2)] w-24 flex-shrink-0 truncate">{k}</span>
                    <span className="text-[var(--os-text-1)] truncate">{String(v ?? '—')}</span>
                  </div>
                ))}
                {selectedNode.markings?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-1">
                    {selectedNode.markings.map(m => (
                      <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Relationships */}
            {relsData?.items && relsData.items.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase mb-2">Relationships ({relsData.items.length})</p>
                <div className="space-y-1.5">
                  {relsData.items.slice(0, 8).map((r: any) => (
                    <div key={r.id} className="flex items-center gap-2 text-xs">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)] whitespace-nowrap">{r.relationshipType}</span>
                      <span className="text-[var(--os-text-1)] truncate">{r.targetType}</span>
                      {r.confidence < 1 && <span className="text-[var(--os-text-2)] text-[10px] ml-auto">{Math.round(r.confidence * 100)}%</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Timeline */}
            {eventsData?.items && eventsData.items.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--os-text-2)] uppercase mb-2">Recent Events</p>
                <div className="relative space-y-3 pl-4">
                  <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[var(--os-border)]" />
                  {eventsData.items.map((ev: any) => (
                    <div key={ev.id} className="relative">
                      <div className="absolute -left-2.5 top-1.5 w-2 h-2 rounded-full bg-[#579bfc]" />
                      <p className="text-xs font-medium text-[var(--os-text-1)]">{ev.eventType}</p>
                      <p className="text-[10px] text-[var(--os-text-2)]">
                        {new Date(ev.occurredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
