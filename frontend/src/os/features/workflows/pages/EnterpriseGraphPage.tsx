import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ForceGraph2D from 'react-force-graph-2d'
import { ShareNetwork, ChartLineUp, Clock, Palette, MagicWand, ArrowSquareOut, X } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import { useWorkflowsStore } from '../store'

// S302 — "The view Palantir cannot ship": every bridged OntologyObject across
// every workflow, in one live, AI-analyzable graph. Not a mockup — the same
// objects and relationships the canvas itself writes (S300/S301).

interface RawObject {
  id: string
  properties: Record<string, any>
  type?: { name: string; displayName: string; icon: string | null; color: string | null }
  workflowId: string | null
  workflowName: string | null
  degree: number
  validTo: string | null
  createdAt: string
}
interface RawRelationship {
  sourceId: string; targetId: string; relationshipType: string
  confidence: number; validFrom: string; validTo: string | null
}
interface RawWorkflow { id: string; name: string; category: string; status: string }

function hashHue(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return h
}

export function EnterpriseGraphPage() {
  const navigate = useNavigate()
  const setSelected = useWorkflowsStore(s => s.setSelected)

  const [raw, setRaw] = useState<{ workflows: RawWorkflow[]; objects: RawObject[]; relationships: RawRelationship[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [colorMode, setColorMode] = useState<'type' | 'workflow'>('type')
  const [clusterByWorkflow, setClusterByWorkflow] = useState(false)
  const [timeCursor, setTimeCursor] = useState<number | null>(null) // null = live/now
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/os-workflows/enterprise-graph').then(r => setRaw(r.data)).finally(() => setLoading(false))
  }, [])

  const timeBounds = useMemo(() => {
    if (!raw?.objects.length) return null
    const times = raw.objects.map(o => new Date(o.createdAt).getTime())
    return { min: Math.min(...times), max: Date.now() }
  }, [raw])

  const graph = useMemo(() => {
    if (!raw) return { nodes: [] as any[], links: [] as any[] }
    const cursor = timeCursor ?? Date.now()
    const liveObjects = raw.objects.filter(o => {
      const created = new Date(o.createdAt).getTime()
      const removedAt = o.validTo ? new Date(o.validTo).getTime() : null
      return created <= cursor && (removedAt === null || removedAt > cursor)
    })
    const liveIds = new Set(liveObjects.map(o => o.id))
    const nodes = liveObjects.map(o => ({
      id: o.id,
      name: (o.properties?.name as string) ?? o.id.slice(0, 8),
      typeName: o.type?.displayName ?? 'Object',
      workflowId: o.workflowId,
      workflowName: o.workflowName,
      degree: o.degree,
      color: colorMode === 'type' ? (o.type?.color ?? '#579bfc') : `hsl(${hashHue(o.workflowId ?? 'none')}, 65%, 55%)`,
      val: 3 + Math.min(o.degree, 8),
    }))
    const links = raw.relationships.filter(r => {
      const created = new Date(r.validFrom).getTime()
      const removedAt = r.validTo ? new Date(r.validTo).getTime() : null
      return liveIds.has(r.sourceId) && liveIds.has(r.targetId) && created <= cursor && (removedAt === null || removedAt > cursor)
    }).map(r => ({ source: r.sourceId, target: r.targetId, label: r.relationshipType.replace(/_/g, ' '), confidence: r.confidence }))
    return { nodes, links }
  }, [raw, colorMode, timeCursor])

  const topCentral = useMemo(() => [...graph.nodes].sort((a, b) => b.degree - a.degree).slice(0, 5), [graph])
  const centralIds = useMemo(() => new Set(topCentral.filter(n => n.degree > 0).map(n => n.id)), [topCentral])

  function goToWorkflow(workflowId: string | null) {
    if (!workflowId) return
    setSelected(workflowId)
    navigate('/kangqore-view/admin/workflows/canvas')
  }

  async function analyzeGraph() {
    setAnalyzing(true)
    setAnalysis(null)
    const summary = `Analyze the enterprise knowledge graph: ${graph.nodes.length} objects across ${raw?.workflows.length ?? 0} workflows, ${graph.links.length} relationships. Most-connected nodes: ${topCentral.map(n => `"${n.name}" (${n.typeName}, ${n.degree} links, from workflow "${n.workflowName}")`).join('; ') || 'none yet'}. What structural patterns, bottlenecks, or risks stand out?`
    try {
      const res = await api.post('/admin/kangqore-immp/command', { query: summary, history: [] })
      setAnalysis(res.data?.response ?? 'No response returned.')
    } catch {
      setAnalysis('KIMMP analysis failed — try again in a moment.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><ShareNetwork size={18} weight="fill" /> Enterprise Graph</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Every canvas, one live graph — the view Palantir cannot ship.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setColorMode(m => m === 'type' ? 'workflow' : 'type')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            <Palette size={13} /> Color by {colorMode === 'type' ? 'Type' : 'Workflow'}
          </button>
          <button onClick={analyzeGraph} disabled={analyzing || graph.nodes.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50">
            {analyzing ? <Loader2 size={13} className="animate-spin" /> : <MagicWand size={13} weight="fill" />}
            {analyzing ? 'Analyzing…' : 'Analyze this graph'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="os-card p-16 text-center text-xs text-[var(--os-text-2)]">Loading enterprise graph…</div>
      ) : graph.nodes.length === 0 ? (
        <div className="os-card p-16 flex flex-col items-center gap-3 text-center">
          <ShareNetwork size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No bridged objects yet</p>
          <p className="text-xs text-[var(--os-text-2)]">Add thinking or enterprise nodes to a canvas and save — they become part of this graph.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3 os-card overflow-hidden" style={{ height: 560, position: 'relative' }}>
            <ForceGraph2D
              graphData={graph}
              backgroundColor="transparent"
              nodeLabel={(n: any) => `${n.name} · ${n.typeName} · ${n.workflowName ?? 'unknown workflow'}`}
              nodeColor={(n: any) => n.color}
              nodeVal={(n: any) => n.val}
              nodeCanvasObjectMode={(n: any) => centralIds.has(n.id) ? 'before' : undefined}
              nodeCanvasObject={(n: any, ctx: CanvasRenderingContext2D) => {
                if (!centralIds.has(n.id)) return
                ctx.beginPath()
                ctx.arc(n.x, n.y, (3 + Math.min(n.degree, 8)) + 3, 0, 2 * Math.PI)
                ctx.strokeStyle = '#f59e0b'
                ctx.lineWidth = 1.5
                ctx.stroke()
              }}
              linkLabel={(l: any) => l.label}
              linkColor={(l: any) => `rgba(87,155,252,${0.2 + (l.confidence ?? 1) * 0.5})`}
              linkDirectionalArrowLength={3}
              onNodeClick={(n: any) => goToWorkflow(n.workflowId)}
              cooldownTime={3000}
              enableNodeDrag
              enablePanInteraction
              enableZoomInteraction
            />
            {timeBounds && timeBounds.min < timeBounds.max && (
              <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={13} style={{ color: 'var(--os-text-2)' }} />
                <input
                  type="range" min={timeBounds.min} max={timeBounds.max}
                  value={timeCursor ?? timeBounds.max}
                  onChange={e => setTimeCursor(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 10, color: 'var(--os-text-2)', whiteSpace: 'nowrap', minWidth: 90, textAlign: 'right' }}>
                  {timeCursor && timeCursor < timeBounds.max
                    ? new Date(timeCursor).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                    : 'Now (live)'}
                </span>
                {timeCursor != null && (
                  <button onClick={() => setTimeCursor(null)} className="text-[10px] font-semibold text-[#579bfc]">Reset</button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="os-card p-4">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-2 flex items-center gap-1.5">
                <ChartLineUp size={12} /> Most Connected
              </p>
              <div className="space-y-2">
                {topCentral.filter(n => n.degree > 0).map(n => (
                  <button key={n.id} onClick={() => goToWorkflow(n.workflowId)}
                    className="w-full flex items-center justify-between gap-2 text-left group">
                    <span className="text-[11px] text-[var(--os-text-1)] truncate group-hover:text-[#579bfc]">{n.name}</span>
                    <span className="text-[9px] font-bold text-amber-400 flex-shrink-0">{n.degree}</span>
                  </button>
                ))}
                {topCentral.every(n => n.degree === 0) && <p className="text-[10px] text-[var(--os-text-2)]">No connected nodes yet.</p>}
              </div>
            </div>

            <div className="os-card p-4">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] mb-2">Workflows in view</p>
              <div className="space-y-1.5">
                {(raw?.workflows ?? []).filter(w => graph.nodes.some(n => n.workflowId === w.id)).map(w => (
                  <button key={w.id} onClick={() => goToWorkflow(w.id)}
                    className="w-full flex items-center justify-between gap-2 text-left group px-2 py-1 rounded-lg hover:bg-[var(--os-surface-0)]">
                    <span className="text-[11px] text-[var(--os-text-2)] group-hover:text-[var(--os-text-1)] truncate">{w.name}</span>
                    <ArrowSquareOut size={11} className="text-[var(--os-text-2)] flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {(analysis || analyzing) && (
              <div className="os-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)] flex items-center gap-1.5">
                    <MagicWand size={12} /> KIMMP Analysis
                  </p>
                  {analysis && <button onClick={() => setAnalysis(null)}><X size={12} className="text-[var(--os-text-2)]" /></button>}
                </div>
                {analyzing ? (
                  <p className="text-[11px] text-[var(--os-text-2)]">Reading the graph…</p>
                ) : (
                  <p className="text-[11px] text-[var(--os-text-1)] leading-relaxed whitespace-pre-wrap">{analysis}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
