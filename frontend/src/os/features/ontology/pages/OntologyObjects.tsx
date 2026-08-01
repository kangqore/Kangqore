import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { Cube, ArrowLeft, CaretLeft, CaretRight, ShieldCheck, CaretDown, CaretUp, Lightning, Play, Sparkle } from '@phosphor-icons/react'
import { api } from '@lib/api'
import { apiFetch } from '@lib/api'
import { GitBranch, Plus, Clock, X, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '@design-system/cn'
import { actionEngineService, type OntologyAction } from '../actionEngineService'
import { ActionRunModal } from '../components/ActionRunModal'

const CLASS_BADGE: Record<string, string> = {
  PUBLIC:       'bg-green-500/10 text-green-400 border-green-500/20',
  INTERNAL:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CONFIDENTIAL: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SECRET:       'bg-red-500/10 text-red-400 border-red-500/20',
}

function timeAgo(date: string) {
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Add Relationship Modal ────────────────────────────────────────────────────
function AddRelModal({ objectId, typeName, onClose }: { objectId: string; typeName: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [targetSearch, setTargetSearch] = useState('')
  const [targetId, setTargetId]         = useState('')
  const [relType, setRelType]           = useState('RELATED_TO')
  const [label, setLabel]               = useState('')
  const [strength, setStrength]         = useState(1.0)
  const [reason, setReason]             = useState('')

  const { data: searchData, isFetching } = useQuery<{ objects: any[] }>({
    queryKey: ['ontology-search', targetSearch],
    queryFn: () => api.get(`/admin/ontology/objects?search=${encodeURIComponent(targetSearch)}&limit=10`).then(r => r.data),
    enabled: targetSearch.length > 1,
    staleTime: 10_000,
  })

  const create = useMutation({
    mutationFn: () => apiFetch('/admin/ontology/relationships', {
      method: 'POST',
      body: JSON.stringify({
        sourceId: objectId, targetId, relationshipType: relType,
        label: label || undefined, strength, reason: reason || undefined,
        inferredBy: 'USER',
      }),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ontology-node-rels'] })
      onClose()
    },
  })

  const REL_TYPES = ['RELATED_TO', 'DEPENDS_ON', 'HAS_PROJECT', 'OWNS_INVOICE', 'CREATES_RISK',
    'RESOLVES_INCIDENT', 'MANAGES', 'SAME_ORG', 'SUCCESSOR_OF', 'BLOCKS']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--os-text-1)]">Add Relationship</p>
            <p className="text-[11px] text-[var(--os-text-2)]">from <strong>{typeName}</strong></p>
          </div>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>

        {/* Target search */}
        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Target Object</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
            placeholder="Search objects…"
            value={targetSearch}
            onChange={e => setTargetSearch(e.target.value)}
          />
          {isFetching && <p className="text-[10px] text-[var(--os-text-2)] mt-1">Searching…</p>}
          {searchData?.objects && searchData.objects.length > 0 && !targetId && (
            <div className="mt-1 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] max-h-40 overflow-y-auto">
              {searchData.objects.map((o: any) => (
                <button
                  key={o.id}
                  onClick={() => { setTargetId(o.id); setTargetSearch(o.externalId ?? o.id.slice(0, 8)) }}
                  className="w-full text-left px-3 py-2 hover:bg-[var(--os-card)] text-xs border-b border-[var(--os-border)] last:border-0"
                >
                  <span className="font-medium text-[var(--os-text-1)]">{o.type?.displayName}</span>
                  <span className="text-[var(--os-text-2)] ml-2">{o.externalId ?? o.id.slice(0, 12)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Relationship type */}
        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Relationship Type</label>
          <select
            className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
            value={relType} onChange={e => setRelType(e.target.value)}
          >
            {REL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Label + strength */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Label (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              placeholder="e.g. Primary contact"
              value={label} onChange={e => setLabel(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Strength ({strength.toFixed(1)})</label>
            <input type="range" min="0.1" max="1" step="0.1"
              className="w-full mt-2"
              value={strength} onChange={e => setStrength(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Reason (optional)</label>
          <input
            className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
            placeholder="Why does this relationship exist?"
            value={reason} onChange={e => setReason(e.target.value)}
          />
        </div>

        <button
          onClick={() => create.mutate()}
          disabled={!targetId || create.isPending}
          className="w-full py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {create.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : 'Create Relationship'}
        </button>

        {create.isError && (
          <p className="text-[11px] text-red-400">Failed to create: {(create.error as Error).message}</p>
        )}
      </div>
    </div>
  )
}

// ── Expanded row ──────────────────────────────────────────────────────────────
function ExpandedRow({ obj }: { obj: any }) {
  const [showRelModal, setShowRelModal] = useState(false)
  const [runningAction, setRunningAction] = useState<OntologyAction | null>(null)

  const { data: relsData, isLoading: relsLoading } = useQuery<{ items: any[] }>({
    queryKey: ['ontology-node-rels', obj.id],
    queryFn: () => apiFetch(`/admin/ontology/relationships?sourceId=${obj.id}&limit=20`),
    staleTime: 30_000,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery<{ items: any[] }>({
    queryKey: ['ontology-events', obj.id],
    queryFn: () => apiFetch(`/admin/ontology/events?objectId=${obj.id}&limit=10`),
    staleTime: 30_000,
  })

  const { data: actions = [] } = useQuery({
    queryKey: ['ontology-actions', obj.typeId],
    queryFn: () => actionEngineService.list(obj.typeId),
    staleTime: 30_000,
  })

  // S299 — object-level activity feed: chronological ActionExecution history
  const { data: activityData } = useQuery({
    queryKey: ['action-executions', 'object', obj.id],
    queryFn: () => actionEngineService.listExecutions({ objectId: obj.id, limit: 10 }),
    staleTime: 15_000,
  })

  const rels   = relsData?.items ?? []
  const events = eventsData?.items ?? []
  const activity = activityData?.executions ?? []

  return (
    <tr>
      <td colSpan={6} className="bg-[var(--os-surface-0)] border-b border-[var(--os-border)]">
        <div className="px-8 py-4 grid grid-cols-2 gap-6">

          {/* Relationships panel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">
                  Relationships ({rels.length})
                </p>
              </div>
              <button
                onClick={() => setShowRelModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border border-[#579bfc]/30 text-[#579bfc] hover:bg-[#579bfc]/10 transition-colors"
              >
                <Plus className="w-3 h-3" />Add
              </button>
            </div>

            {relsLoading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-8 rounded bg-[var(--os-card)] animate-pulse" />)}
              </div>
            ) : rels.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] italic">No relationships yet.</p>
            ) : (
              <div className="space-y-1.5">
                {rels.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[10px] text-[var(--os-text-2)] font-medium whitespace-nowrap">
                      {r.relationshipType}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[var(--os-text-2)]" />
                    <span className="text-[var(--os-text-1)] truncate">{r.targetType}</span>
                    {r.inferredBy && (
                      <span className="ml-auto text-[9px] text-[var(--os-text-2)] whitespace-nowrap">{r.inferredBy}</span>
                    )}
                    {r.confidence < 1 && (
                      <span className="text-[9px] text-amber-400">{Math.round(r.confidence * 100)}%</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">
                Event Timeline
              </p>
            </div>

            {eventsLoading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-10 rounded bg-[var(--os-card)] animate-pulse" />)}
              </div>
            ) : events.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] italic">No events recorded.</p>
            ) : (
              <div className="relative pl-4 space-y-3">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-[var(--os-border)]" />
                {events.map((ev: any) => (
                  <div key={ev.id} className="relative">
                    <div className="absolute -left-2.5 top-1.5 w-2 h-2 rounded-full bg-[#579bfc]" />
                    <p className="text-[11px] font-medium text-[var(--os-text-1)]">{ev.eventType}</p>
                    <p className="text-[10px] text-[var(--os-text-2)]">
                      {new Date(ev.occurredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {ev.actorId && <span className="ml-2">by {ev.actorId.slice(0, 8)}…</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions panel — S297: one-click execution scoped to this object */}
        {actions.length > 0 && (
          <div className="px-8 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightning className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">Actions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {actions.map((a: OntologyAction) => (
                <button
                  key={a.id}
                  onClick={() => setRunningAction(a)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[#579bfc] hover:border-[#579bfc]/40 transition-colors"
                >
                  <Play className="w-3 h-3" weight="fill" />
                  {a.displayName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activity feed — S299: chronological ActionExecution history for this object */}
        {activity.length > 0 && (
          <div className="px-8 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">Activity</p>
            </div>
            <div className="space-y-1.5">
              {activity.map((e: any) => (
                <div key={e.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap"
                    style={{
                      background: e.status === 'SUCCESS' ? 'rgba(16,185,129,0.12)' : e.status === 'FAILED' ? 'rgba(239,68,68,0.10)' : e.status === 'PENDING_APPROVAL' ? 'rgba(168,85,247,0.12)' : 'rgba(245,158,11,0.12)',
                      color: e.status === 'SUCCESS' ? '#10b981' : e.status === 'FAILED' ? '#ef4444' : e.status === 'PENDING_APPROVAL' ? '#a855f7' : '#f59e0b',
                    }}
                  >
                    {e.status}
                  </span>
                  <span className="text-[var(--os-text-1)] truncate flex-1">{e.action?.displayName ?? e.actionId}</span>
                  <span className="text-[9px] text-[var(--os-text-2)] whitespace-nowrap">{e.actorType}</span>
                  {e.confidence != null && <span className="text-[9px] text-amber-400">{Math.round(e.confidence * 100)}%</span>}
                  <span className="text-[9px] text-[var(--os-text-2)] whitespace-nowrap">{new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRelModal && (
          <AddRelModal
            objectId={obj.id}
            typeName={obj.type?.displayName ?? 'Object'}
            onClose={() => setShowRelModal(false)}
          />
        )}
        {runningAction && (
          <ActionRunModal
            action={runningAction}
            objectId={obj.id}
            onClose={() => setRunningAction(null)}
          />
        )}
      </td>
    </tr>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function OntologyObjects() {
  const [params, setParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const typeId = params.get('typeId') ?? undefined

  const { data: typesData } = useQuery({
    queryKey: ['ontology-types'],
    queryFn: () => api.get('/admin/ontology/types').then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['ontology-objects', typeId, page],
    queryFn: () => api.get(`/admin/ontology/objects?page=${page}&limit=25${typeId ? `&typeId=${typeId}` : ''}`).then(r => r.data),
  })

  const types: any[] = typesData?.types ?? []
  const objects: any[] = data?.objects ?? []
  const total: number  = data?.total ?? 0
  const pages: number  = data?.pages ?? 1
  const selectedType   = types.find((t: any) => t.id === typeId)

  function toggleExpand(id: string) {
    setExpanded(e => e === id ? null : id)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to="/kangqore-view/admin/ontology"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
        >
          <ArrowLeft size={12} /> Ontology
        </Link>
        <span className="text-[var(--os-border)]">/</span>
        <span className="text-[11px] font-semibold text-[var(--os-text-1)]">
          {selectedType ? selectedType.displayName + ' Objects' : 'All Objects'}
        </span>
        <span className="ml-auto text-xs text-[var(--os-text-2)]">{total} total</span>
      </div>

      {/* Type filter tabs */}
      {types.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => { setParams({}); setPage(1) }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
              !typeId
                ? 'bg-[var(--os-card)] text-[var(--os-text-1)] border-[var(--os-border)]'
                : 'text-[var(--os-text-2)] border-transparent hover:text-[var(--os-text-1)]'
            )}
          >All</button>
          {types.map((t: any) => (
            <button
              key={t.id}
              onClick={() => { setParams({ typeId: t.id }); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
                typeId === t.id
                  ? 'bg-[var(--os-card)] text-[var(--os-text-1)] border-[var(--os-border)]'
                  : 'text-[var(--os-text-2)] border-transparent hover:text-[var(--os-text-1)]'
              )}
            >
              {t.displayName}
              <span className="ml-1.5 text-[9px] opacity-60">{t._count?.instances ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Objects table */}
      <div className="os-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              <th className="w-8 px-3 py-3" />
              {['Type', 'External ID', 'Properties', 'Markings', 'Updated'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--os-border)]">
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-3 rounded bg-[var(--os-surface-0)] animate-pulse w-24" />
                  </td>
                ))}
              </tr>
            ))}
            {!isLoading && objects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--os-text-2)] text-sm">
                  No objects found. Objects are created when you link real records to the Ontology.
                </td>
              </tr>
            )}
            {!isLoading && objects.map((obj: any) => {
              const props = obj.properties as Record<string, unknown>
              const propKeys = Object.keys(props).slice(0, 3)
              const isExpanded = expanded === obj.id

              return (
                <>
                  <tr
                    key={obj.id}
                    className={cn('border-b border-[var(--os-border)] transition-colors cursor-pointer', isExpanded ? 'bg-[var(--os-surface-0)]' : 'hover:bg-[var(--os-surface-0)]')}
                    onClick={() => toggleExpand(obj.id)}
                  >
                    <td className="px-3 py-3 text-[var(--os-text-2)]">
                      {isExpanded ? <CaretUp size={12} /> : <CaretDown size={12} />}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${obj.type?.color ?? '#6366f1'}20`,
                          color: obj.type?.color ?? '#6366f1',
                        }}
                      >
                        {obj.type?.displayName ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-[var(--os-text-2)]">
                      {obj.externalId ? String(obj.externalId).slice(0, 16) + '…' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {propKeys.map(k => (
                          <span key={k} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded text-[var(--os-text-2)]">
                            {k}: {String(props[k]).slice(0, 20)}
                          </span>
                        ))}
                        {Object.keys(props).length > 3 && (
                          <span className="text-[9px] text-[var(--os-text-2)]">+{Object.keys(props).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {(obj.markings ?? []).length === 0 ? (
                        <span className="text-[var(--os-text-2)]">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(obj.markings as string[]).map(m => (
                            <span key={m} className={cn('text-[9px] border px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1', CLASS_BADGE[m] ?? CLASS_BADGE.INTERNAL)}>
                              <ShieldCheck size={9} weight="fill" /> {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">{timeAgo(obj.updatedAt)}</td>
                  </tr>
                  {isExpanded && <ExpandedRow obj={obj} key={`exp-${obj.id}`} />}
                </>
              )
            })}
          </tbody>
        </table>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--os-border)]">
            <span className="text-[11px] text-[var(--os-text-2)]">Page {page} of {pages} · {total} objects</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)]"
              >
                <CaretLeft size={13} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 rounded-lg border border-[var(--os-border)] disabled:opacity-30 hover:bg-[var(--os-surface-0)]"
              >
                <CaretRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
