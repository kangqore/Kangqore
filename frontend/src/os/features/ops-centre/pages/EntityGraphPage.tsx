import { useState } from 'react'
import { Brain, Database, GitBranch, RefreshCw, Loader2, AlertTriangle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import { GraphCanvas } from '../../ontology/components/GraphCanvas'
import { cn } from '@design-system/cn'

// ── Type colours ──────────────────────────────────────────────────────────────
const TYPE_COLOURS: Record<string, string> = {
  Client:   '#579bfc',
  Project:  '#00c875',
  Invoice:  '#fdab3d',
  Lead:     '#7c3aed',
  Risk:     '#e2445c',
  User:     '#66ccff',
  Task:     '#ff69b4',
  Incident: '#e2445c',
}
function typeColor(name: string) { return TYPE_COLOURS[name] ?? '#9ca3af' }

interface OntologyObjectType { id: string; name: string }

export function EntityGraphPage() {
  const qc = useQueryClient()
  const [activeTypeId, setActiveTypeId] = useState<string | undefined>(undefined)

  // ── Live graph stats ──────────────────────────────────────────────────────
  const { data: graphData, isLoading: graphLoading } = useQuery<{ nodes: any[]; edges: any[] }>({
    queryKey: ['ontology-graph-full', activeTypeId],
    queryFn: () => apiFetch(`/admin/ontology/graph/full?limit=300${activeTypeId ? `&typeId=${activeTypeId}` : ''}`),
    staleTime: 30_000,
  })

  const { data: typesData } = useQuery<{ items: OntologyObjectType[] }>({
    queryKey: ['ontology-types'],
    queryFn: () => apiFetch('/admin/ontology/types?limit=50'),
    staleTime: 60_000,
  })

  const autoLink = useMutation({
    mutationFn: () => apiFetch('/admin/ontology/graph/auto-link', { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-graph-full'] }),
  })

  const nodes   = graphData?.nodes ?? []
  const edges   = graphData?.edges ?? []
  const types   = typesData?.items ?? []

  // Group nodes by typeName for left panel
  const byType = nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.typeName] = (acc[n.typeName] ?? 0) + 1
    return acc
  }, {})

  const criticalNodes = nodes.filter((n: any) =>
    n.properties?.riskLevel === 'critical' || n.properties?.health === 'critical'
  )

  return (
    <div className="space-y-4">

      {/* Stats bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.15)' }}>
        <Database className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <p className="text-[11px] text-[var(--os-text-2)]">
          {graphLoading ? (
            <span>Loading entity graph…</span>
          ) : (
            <>
              <span className="font-semibold text-[var(--os-text-1)]">{nodes.length}</span> entities ·{' '}
              <span className="font-semibold text-[var(--os-text-1)]">{edges.length}</span> relationships
              {criticalNodes.length > 0 && (
                <> · <span className="text-red-400 font-semibold">{criticalNodes.length}</span> critical</>
              )}
            </>
          )}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => autoLink.mutate()}
            disabled={autoLink.isPending}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] bg-[var(--os-card)] transition-colors disabled:opacity-50"
          >
            {autoLink.isPending
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <RefreshCw className="w-3 h-3" />}
            Auto-link
          </button>
        </div>
      </div>

      {autoLink.isSuccess && (autoLink.data as any) && (
        <div className="px-3 py-2 rounded-2xl text-[11px] text-green-400 border border-green-500/20 bg-green-500/5">
          Auto-link complete: {(autoLink.data as any).created} created · {(autoLink.data as any).skipped} skipped
        </div>
      )}

      {/* KIMMP banner */}
      <div className="rounded-2xl p-3.5 flex items-start gap-3"
        style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-[11px] font-bold text-purple-300">Live Semantic Entity Graph</span>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 leading-relaxed">
            Real-time knowledge graph of all business entities and their relationships.
            Click any node to inspect properties, event timeline, and outbound connections.
            Double-click to expand from a node. Run <strong>Auto-link</strong> to infer relationships from database foreign keys.
          </p>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTypeId(undefined)}
          className={cn(
            'text-[10px] font-bold px-2.5 py-1 rounded-2xl border transition-colors',
            !activeTypeId
              ? 'bg-[#579bfc]/15 border-[#579bfc]/30 text-[#579bfc]'
              : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
          )}
        >All ({nodes.length})</button>

        {Object.entries(byType).sort(([,a],[,b]) => b - a).map(([typeName, count]) => {
          const matchType = types.find(t => t.name === typeName)
          const color = typeColor(typeName)
          const isActive = activeTypeId === matchType?.id
          return (
            <button
              key={typeName}
              onClick={() => setActiveTypeId(isActive ? undefined : matchType?.id)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-2xl border transition-colors"
              style={isActive
                ? { color, background: `${color}20`, borderColor: `${color}50` }
                : { color: typeColor(typeName), background: `${typeColor(typeName)}0c`, borderColor: `${typeColor(typeName)}20` }
              }
            >
              {typeName}: {count}
            </button>
          )
        })}
      </div>

      {/* Canvas */}
      {nodes.length === 0 && !graphLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-2xl"
          style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)' }}>
          <GitBranch className="w-8 h-8 text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-2)]">No entities in the ontology graph yet.</p>
          <p className="text-xs text-[var(--os-text-2)]">
            Go to <strong>Ontology</strong> module to create object types and objects, then run <strong>Auto-link</strong>.
          </p>
        </div>
      ) : (
        <GraphCanvas
          typeId={activeTypeId}
          limit={300}
          height={560}
          className="w-full"
        />
      )}
    </div>
  )
}
