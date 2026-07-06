import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import {
  GitMerge, Plus, Trash2, Zap, CheckCircle2, AlertCircle,
  ChevronDown, ChevronRight, ExternalLink,
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface TypeMapping {
  id:             string
  platform:       string
  externalType:   string
  ontologyTypeId: string
  ontologyType:   { id: string; name: string; displayName: string }
  fieldMapping:   Record<string, string>
  priority:       number
  createdAt:      string
}

interface ExternalRef {
  id:           string
  platform:     string
  externalType: string
  externalId:   string
  objectId:     string
  confidence:   number
  inferredBy:   string
  createdAt:    string
  object: {
    properties: any
    type: { name: string; displayName: string }
  }
}

interface OntologyType { id: string; name: string; displayName: string }

interface ConnectorEntity {
  platform:     string
  displayName:  string
  icon:         string
  entityTypes:  Array<{ externalType: string; suggestedOntologyType: string; description: string }>
}

interface Stats {
  typeMappings:    number
  totalRefs:       number
  confirmedRefs:   number
  autoRefs:        number
  byPlatform:      Record<string, number>
  connectorCoverage: ConnectorEntity[]
}

const CONFIDENCE_COLOR = (c: number) =>
  c >= 0.9 ? '#00c875' : c >= 0.6 ? '#fdab3d' : '#e2445c'

const INFERRED_BY_LABEL: Record<string, string> = {
  USER:      'Admin confirmed',
  AUTO_LINK: 'Auto-linked',
  KIMMP:     'WAANDA inferred',
}

// ── Add Mapping Modal ─────────────────────────────────────────────────────────
function AddMappingModal({
  ontologyTypes,
  connectorCoverage,
  onClose,
  onSave,
}: {
  ontologyTypes:     OntologyType[]
  connectorCoverage: ConnectorEntity[]
  onClose: () => void
  onSave:  (data: any) => void
}) {
  const [platform,       setPlatform]       = useState('')
  const [externalType,   setExternalType]   = useState('')
  const [ontologyTypeId, setOntologyTypeId] = useState('')
  const [priority,       setPriority]       = useState(0)

  const selectedConnector = connectorCoverage.find(c => c.platform === platform)
  const suggestedType     = selectedConnector?.entityTypes.find(e => e.externalType === externalType)?.suggestedOntologyType

  // Auto-fill ontology type from connector suggestion
  const handleExternalTypeChange = (et: string) => {
    setExternalType(et)
    if (suggestedType || et) {
      const hint = selectedConnector?.entityTypes.find(e => e.externalType === et)?.suggestedOntologyType
      if (hint) {
        const match = ontologyTypes.find(o => o.name === hint)
        if (match) setOntologyTypeId(match.id)
      }
    }
  }

  const valid = platform && externalType && ontologyTypeId

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl p-6 w-[480px] shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-[var(--os-text-1)]">Add Type Mapping</h3>
        <p className="text-[11px] text-[var(--os-text-2)]">
          Tell WAANDA that a given external entity type corresponds to a canonical ontology type.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Platform</label>
            <select
              value={platform}
              onChange={e => { setPlatform(e.target.value); setExternalType('') }}
              className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
            >
              <option value="">Select platform…</option>
              {connectorCoverage.map(c => (
                <option key={c.platform} value={c.platform}>{c.icon} {c.displayName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">External entity type</label>
            {selectedConnector ? (
              <select
                value={externalType}
                onChange={e => handleExternalTypeChange(e.target.value)}
                className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
              >
                <option value="">Select type…</option>
                {selectedConnector.entityTypes.map(e => (
                  <option key={e.externalType} value={e.externalType}>{e.externalType} — {e.description}</option>
                ))}
              </select>
            ) : (
              <input
                value={externalType}
                onChange={e => setExternalType(e.target.value)}
                placeholder="e.g. Account, Contact, Issue…"
                className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
              />
            )}
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Maps to ontology type</label>
            <select
              value={ontologyTypeId}
              onChange={e => setOntologyTypeId(e.target.value)}
              className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
            >
              <option value="">Select ontology type…</option>
              {ontologyTypes.map(o => (
                <option key={o.id} value={o.id}>{o.displayName} ({o.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest">Priority (higher = preferred source)</label>
            <input
              type="number"
              value={priority}
              onChange={e => setPriority(Number(e.target.value))}
              className="mt-1 w-full text-sm px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)]">
            Cancel
          </button>
          <button
            onClick={() => valid && onSave({ platform, externalType, ontologyTypeId, priority })}
            disabled={!valid}
            className="text-sm px-4 py-2 rounded-lg bg-[#579bfc] text-white font-medium disabled:opacity-40"
          >
            Create mapping
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function SemanticMappingPage() {
  const qc          = useQueryClient()
  const [showAdd,   setShowAdd]   = useState(false)
  const [refsPage,  setRefsPage]  = useState(0)
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const PAGE        = 40

  const { data: stats }         = useQuery<Stats>({ queryKey: ['semantic-stats'],    queryFn: () => apiFetch('/admin/semantic/stats'),    staleTime: 60_000 })
  const { data: typeMaps }      = useQuery<{ rows: TypeMapping[] }>({ queryKey: ['semantic-type-mappings'], queryFn: () => apiFetch('/admin/semantic/type-mappings'), staleTime: 30_000 })
  const { data: refsData }      = useQuery<{ rows: ExternalRef[]; total: number }>({ queryKey: ['semantic-refs', refsPage], queryFn: () => apiFetch(`/admin/semantic/refs?limit=${PAGE}&offset=${refsPage * PAGE}`), staleTime: 30_000 })
  const { data: ontologyTypes } = useQuery<{ types: OntologyType[] }>({ queryKey: ['ontology-types-list'], queryFn: () => apiFetch('/admin/ontology/types'), staleTime: 300_000 })

  const createMapping = useMutation({
    mutationFn: (data: any) => apiFetch('/admin/semantic/type-mappings', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['semantic-type-mappings'] }); qc.invalidateQueries({ queryKey: ['semantic-stats'] }); setShowAdd(false) },
  })

  const deleteMapping = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/semantic/type-mappings/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['semantic-type-mappings'] }); qc.invalidateQueries({ queryKey: ['semantic-stats'] }) },
  })

  const deleteRef = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/semantic/refs/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['semantic-refs'] }),
  })

  const typeMappings  = typeMaps?.rows ?? []
  const refs          = refsData?.rows ?? []
  const refsTotal     = refsData?.total ?? 0
  const coverage      = stats?.connectorCoverage ?? []
  const types         = ontologyTypes?.types ?? []

  return (
    <div className="space-y-6">
      {showAdd && (
        <AddMappingModal
          ontologyTypes={types}
          connectorCoverage={coverage}
          onClose={() => setShowAdd(false)}
          onSave={data => createMapping.mutate(data)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[#7c3aed]" />
            <h2 className="text-sm font-bold text-[var(--os-text-1)]">Semantic Mapping</h2>
          </div>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">
            Map external entity types to canonical OntologyObjects. WAANDA resolves all external IDs to one business entity.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[#579bfc] text-white font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add mapping
        </button>
      </div>

      {/* Example flow */}
      <div className="rounded-xl border border-[#7c3aed]/20 bg-[#7c3aed]/[0.03] px-5 py-4">
        <p className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-widest mb-2">How it works</p>
        <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
          {['Salesforce Account:A67890', '→', 'HubSpot Company:12345', '→', 'Internal Client:client-abc', '→', 'OntologyObject: "Acme Corp"'].map((t, i) => (
            <span key={i} className={cn(
              'px-2 py-0.5 rounded',
              t === '→' ? 'text-[var(--os-text-2)]' : 'bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20'
            )}>{t}</span>
          ))}
        </div>
        <p className="text-[10px] text-[var(--os-text-2)] mt-2">WAANDA sees one unified entity — not three separate records.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Type mappings',   value: stats?.typeMappings ?? 0,    color: '#579bfc' },
          { label: 'Entity refs',     value: stats?.totalRefs ?? 0,       color: '#00c875' },
          { label: 'Admin confirmed', value: stats?.confirmedRefs ?? 0,   color: '#00c875' },
          { label: 'Auto-linked',     value: stats?.autoRefs ?? 0,        color: '#fdab3d' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3">
            <p className="text-xl font-bold tabular-nums" style={{ color }}>{value}</p>
            <p className="text-[10px] text-[var(--os-text-2)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Type mappings table */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--os-border)] flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Type Mappings ({typeMappings.length})</p>
        </div>
        {typeMappings.length === 0 ? (
          <p className="text-center py-8 text-[11px] text-[var(--os-text-2)]">
            No type mappings yet. Add one to teach WAANDA your entity model.
          </p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--os-border)]">
                {['Platform', 'External type', '→', 'Ontology type', 'Priority', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {typeMappings.map(m => (
                <tr key={m.id} className="border-b border-[var(--os-border)] hover:bg-[var(--os-surface-0)]">
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] font-mono text-[var(--os-text-1)]">{m.platform}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] font-mono text-[#579bfc]">{m.externalType}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--os-text-2)]">→</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] font-semibold text-[var(--os-text-1)]">{m.ontologyType.displayName}</span>
                    <span className="text-[10px] text-[var(--os-text-2)] ml-1">({m.ontologyType.name})</span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-[var(--os-text-2)]">{m.priority}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => deleteMapping.mutate(m.id)}
                      className="text-[var(--os-text-2)] hover:text-[#e2445c] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Instance refs */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--os-border)] flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--os-text-2)]">Entity References ({refsTotal})</p>
          {Object.keys(stats?.byPlatform ?? {}).length > 0 && (
            <div className="flex gap-2">
              {Object.entries(stats!.byPlatform).map(([p, count]) => (
                <span key={p} className="text-[10px] font-mono text-[var(--os-text-2)]">{p}: {count}</span>
              ))}
            </div>
          )}
        </div>
        {refs.length === 0 ? (
          <p className="text-center py-8 text-[11px] text-[var(--os-text-2)]">No entity references yet. Use auto-link or add them manually.</p>
        ) : (
          <div>
            {refs.map(ref => {
              const isExpanded = expanded === ref.id
              const confColor  = CONFIDENCE_COLOR(ref.confidence)
              const objName    = ref.object?.properties?.name ?? ref.objectId
              return (
                <div key={ref.id} className="border-b border-[var(--os-border)]">
                  <div
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[var(--os-surface-0)]"
                    onClick={() => setExpanded(isExpanded ? null : ref.id)}
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3 text-[var(--os-text-2)]" /> : <ChevronRight className="w-3 h-3 text-[var(--os-text-2)]" />}
                    <span className="text-[10px] font-mono text-[var(--os-text-2)] w-24 flex-shrink-0">{ref.platform}</span>
                    <span className="text-[11px] font-mono text-[#579bfc]">{ref.externalType}:{ref.externalId}</span>
                    <span className="text-[var(--os-text-2)] mx-1">→</span>
                    <span className="text-[11px] font-semibold text-[var(--os-text-1)] flex-1 truncate">{objName}</span>
                    <span className="text-[10px] font-mono flex-shrink-0" style={{ color: confColor }}>{Math.round(ref.confidence * 100)}%</span>
                    <span className="text-[10px] text-[var(--os-text-2)] flex-shrink-0 ml-2">
                      {ref.confidence >= 0.9
                        ? <CheckCircle2 className="w-3 h-3 text-[#00c875]" />
                        : <AlertCircle className="w-3 h-3 text-[#fdab3d]" />
                      }
                    </span>
                    <button onClick={e => { e.stopPropagation(); deleteRef.mutate(ref.id) }} className="ml-2 text-[var(--os-text-2)] hover:text-[#e2445c]">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="px-10 pb-3 space-y-1 text-[10px] text-[var(--os-text-2)]">
                      <p>Ontology type: <span className="text-[var(--os-text-1)]">{ref.object?.type?.displayName}</span></p>
                      <p>Inferred by: <span className="text-[var(--os-text-1)]">{INFERRED_BY_LABEL[ref.inferredBy] ?? ref.inferredBy}</span></p>
                      <p>Confidence: <span style={{ color: confColor }}>{Math.round(ref.confidence * 100)}%</span></p>
                      <p>Created: {new Date(ref.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              )
            })}
            {refsTotal > PAGE && (
              <div className="flex items-center justify-between px-4 py-2.5">
                <button onClick={() => setRefsPage(p => Math.max(0, p - 1))} disabled={refsPage === 0} className="text-[11px] text-[var(--os-text-2)] disabled:opacity-30">← Prev</button>
                <span className="text-[10px] text-[var(--os-text-2)]">Page {refsPage + 1} of {Math.ceil(refsTotal / PAGE)}</span>
                <button onClick={() => setRefsPage(p => p + 1)} disabled={(refsPage + 1) * PAGE >= refsTotal} className="text-[11px] text-[var(--os-text-2)] disabled:opacity-30">Next →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auto-link tip */}
      <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] px-4 py-3 flex items-start gap-3">
        <Zap className="w-3.5 h-3.5 text-[#fdab3d] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Auto-link</p>
          <p className="text-[10px] text-[var(--os-text-2)]">
            Call <code className="font-mono bg-[var(--os-card)] px-1 rounded">POST /admin/semantic/auto-link</code> with an array of external entities and WAANDA will fuzzy-match them to existing OntologyObjects by name/email. Confidence &lt; 1.0 = requires review.
          </p>
        </div>
      </div>
    </div>
  )
}
