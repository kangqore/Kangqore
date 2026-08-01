import { useEffect, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { X, ShareNetwork } from '@phosphor-icons/react'
import { api } from '@lib/api'

// S301 — "Graph View": the same data as the canvas, rendered as a force-graph
// instead of ReactFlow. Only bridged nodes (S300) show up here — this is the
// literal proof that "the canvas IS the graph," not a separate visualization.

interface GraphNode {
  id: string
  name: string
  typeName: string
  color: string
  val: number
}
interface GraphLink {
  source: string
  target: string
  label: string
  confidence: number
}

export function WorkflowGraphView({ workflowId, onClose }: { workflowId: string; onClose: () => void }) {
  const [data, setData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.get(`/os-workflows/${workflowId}/graph`).then(r => {
      if (cancelled) return
      const { objects, relationships } = r.data
      setData({
        nodes: objects.map((o: any) => ({
          id: o.id,
          name: (o.properties?.name as string) ?? o.externalId ?? o.id.slice(0, 8),
          typeName: o.type?.displayName ?? 'Object',
          color: o.type?.color ?? '#579bfc',
          val: 4,
        })),
        links: relationships.map((r: any) => ({
          source: r.sourceId, target: r.targetId,
          label: r.relationshipType.replace(/_/g, ' '), confidence: r.confidence,
        })),
      })
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [workflowId])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'var(--os-bg)' }}>
      <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 31, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ShareNetwork size={15} weight="fill" style={{ color: '#579bfc' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>Graph View</span>
        <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>— same data, force-graph layout. Press G or Esc to return.</span>
      </div>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 10, right: 14, zIndex: 31,
          width: 28, height: 28, borderRadius: 8, border: '1px solid var(--os-border)',
          background: 'var(--os-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={13} style={{ color: 'var(--os-text-2)' }} />
      </button>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 12, color: 'var(--os-text-2)' }}>
          Loading graph…
        </div>
      ) : !data?.nodes.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
          <ShareNetwork size={28} style={{ color: 'var(--os-text-2)' }} />
          <p style={{ fontSize: 12, color: 'var(--os-text-1)', fontWeight: 600 }}>No bridged nodes yet</p>
          <p style={{ fontSize: 11, color: 'var(--os-text-2)' }}>Add a thinking or enterprise node and save — it becomes part of the graph.</p>
        </div>
      ) : (
        <ForceGraph2D
          graphData={data}
          backgroundColor="transparent"
          nodeLabel={(n: any) => `${n.name} · ${n.typeName}`}
          nodeColor={(n: any) => n.color}
          nodeVal={(n: any) => n.val}
          linkLabel={(l: any) => l.label}
          linkColor={(l: any) => `rgba(87,155,252,${0.25 + (l.confidence ?? 1) * 0.55})`}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          cooldownTime={2500}
          enableNodeDrag
          enablePanInteraction
          enableZoomInteraction
        />
      )}
    </div>
  )
}
