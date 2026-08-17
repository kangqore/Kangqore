import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Stack, Plus, Play, Trash, X, Sparkle, CheckCircle, Globe, Lock, PencilSimple } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { objectSetService, type ObjectSet, type FilterOp, type QueryNode, type FilterNode } from '../objectSetService'

const OP_LABELS: Record<FilterOp, string> = {
  eq: '=', neq: '≠', gt: '>', gte: '≥', lt: '<', lte: '≤', contains: 'contains', in: 'in',
  within_km: 'within km of {lat,lng,radiusKm}', // S304 — built via Map View, not this generic row editor
}

const FIELD_PRESETS = [
  'typeName', 'externalId', 'kimmpLinkedRecently',
  'properties.status', 'properties.health', 'properties.ois', 'properties.severity', 'properties.amount',
]

function timeAgo(date: string | null) {
  if (!date) return 'never run'
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Flatten a top-level union/intersection query tree into rows + combinator for the builder UI.
// Anything more exotic (nested trees built elsewhere, e.g. seeded system sets) is treated as
// read-only / advanced and shown as raw JSON instead of row editors.
function toRows(query: QueryNode | undefined): { rows: FilterNode[]; combinator: 'union' | 'intersection' } {
  if (!query) return { rows: [{ type: 'filter', field: 'typeName', op: 'eq', value: '' }], combinator: 'intersection' }
  if (query.type === 'filter') return { rows: [query], combinator: 'intersection' }
  if (query.type === 'union' || query.type === 'intersection') {
    if (query.sets.every(s => s.type === 'filter')) {
      return { rows: query.sets as FilterNode[], combinator: query.type }
    }
  }
  return { rows: [{ type: 'filter', field: 'typeName', op: 'eq', value: '' }], combinator: 'intersection' }
}

function fromRows(rows: FilterNode[], combinator: 'union' | 'intersection'): QueryNode {
  if (rows.length === 1) return rows[0]
  return { type: combinator, sets: rows }
}

// ── Builder modal ──────────────────────────────────────────────────────────────
function ObjectSetBuilder({ existing, onClose }: { existing: ObjectSet | null; onClose: () => void }) {
  const qc = useQueryClient()
  const [name, setName]               = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [tags, setTags]               = useState((existing?.tags ?? []).join(', '))
  const [isPublic, setIsPublic]       = useState(existing?.isPublic ?? false)
  const initial = useMemo(() => toRows(existing?.query), [existing])
  const [rows, setRows]               = useState<FilterNode[]>(initial.rows)
  const [combinator, setCombinator]   = useState<'union' | 'intersection'>(initial.combinator)
  const [preview, setPreview]         = useState<{ count: number; objects: any[] } | null>(null)
  const [previewing, setPreviewing]   = useState(false)

  const query = useMemo(() => fromRows(rows, combinator), [rows, combinator])

  useEffect(() => {
    const t = setTimeout(() => {
      setPreviewing(true)
      objectSetService.preview(query).then(setPreview).finally(() => setPreviewing(false))
    }, 400)
    return () => clearTimeout(t)
  }, [JSON.stringify(query)])

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        name, description: description || undefined,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        isPublic, query,
      }
      return existing ? objectSetService.update(existing.id, payload) : objectSetService.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['object-sets'] })
      onClose()
    },
  })

  const updateRow = (i: number, patch: Partial<FilterNode>) =>
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, ...patch } : r))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{existing ? 'Edit Object Set' : 'New Object Set'}</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Name</label>
            <input
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder='e.g. "Enterprise accounts with OIS below 70"'
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Tags (comma-separated)</label>
            <input
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              value={tags} onChange={e => setTags(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setIsPublic(p => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
            >
              {isPublic ? <Globe size={13} weight="fill" className="text-[#579bfc]" /> : <Lock size={13} />}
              {isPublic ? 'Public' : 'Private'}
            </button>
          </div>
        </div>

        {/* Filter rows */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] text-[var(--os-text-2)]">Conditions</label>
            {rows.length > 1 && (
              <div className="flex items-center gap-0.5 rounded-2xl border border-[var(--os-border)] overflow-hidden">
                {(['intersection', 'union'] as const).map(c => (
                  <button key={c} onClick={() => setCombinator(c)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase ${combinator === c ? 'bg-[#579bfc] text-white' : 'text-[var(--os-text-2)]'}`}
                  >
                    {c === 'intersection' ? 'Match ALL' : 'Match ANY'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input
                  list="objectset-field-presets"
                  className="flex-[1.4] px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                  placeholder="field"
                  value={r.field} onChange={e => updateRow(i, { field: e.target.value })}
                />
                <select
                  className="px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                  value={r.op} onChange={e => updateRow(i, { op: e.target.value as FilterOp })}
                >
                  {Object.entries(OP_LABELS).map(([op, label]) => <option key={op} value={op}>{label}</option>)}
                </select>
                <input
                  className="flex-1 px-2 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                  placeholder="value"
                  value={typeof r.value === 'string' || typeof r.value === 'number' ? r.value : JSON.stringify(r.value ?? '')}
                  onChange={e => updateRow(i, { value: coerceValue(e.target.value) })}
                />
                <button
                  onClick={() => setRows(rs => rs.filter((_, idx) => idx !== i))}
                  disabled={rows.length === 1}
                  className="text-[var(--os-text-2)] hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed p-1"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
            ))}
            <datalist id="objectset-field-presets">
              {FIELD_PRESETS.map(f => <option key={f} value={f} />)}
            </datalist>
          </div>
          <button
            onClick={() => setRows(rs => [...rs, { type: 'filter', field: 'typeName', op: 'eq', value: '' }])}
            className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc] hover:opacity-80"
          >
            <Plus className="w-3 h-3" /> Add condition
          </button>
        </div>

        {/* Live preview */}
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] px-3 py-2.5 flex items-center gap-2">
          {previewing
            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--os-text-2)]" />
            : <Stack size={14} className="text-[#579bfc]" />}
          <span className="text-xs text-[var(--os-text-1)]">
            {previewing ? 'Evaluating…' : <><strong>{preview?.count ?? 0}</strong> objects match right now</>}
          </span>
        </div>

        <button
          onClick={() => save.mutate()}
          disabled={!name || save.isPending}
          className="w-full py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : existing ? 'Save Changes' : 'Create Object Set'}
        </button>
        {save.isError && <p className="text-[11px] text-red-400">Failed to save: {(save.error as Error).message}</p>}
      </div>
    </div>
  )
}

function coerceValue(raw: string): any {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw.trim() !== '' && !isNaN(Number(raw))) return Number(raw)
  return raw
}

// ── Library ──────────────────────────────────────────────────────────────────
function ObjectSetCard({ set, onEdit }: { set: ObjectSet; onEdit: () => void }) {
  const qc = useQueryClient()
  const run = useMutation({
    mutationFn: () => objectSetService.execute(set.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['object-sets'] }),
  })
  const togglePublic = useMutation({
    mutationFn: () => objectSetService.update(set.id, { isPublic: !set.isPublic }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['object-sets'] }),
  })
  const remove = useMutation({
    mutationFn: () => objectSetService.remove(set.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['object-sets'] }),
  })

  return (
    <div className="os-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{set.name}</p>
            {set.isSystem && <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#579bfc]/10 text-[#579bfc]">System</span>}
          </div>
          {set.description && <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 line-clamp-2">{set.description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-2xl font-black text-[var(--os-text-1)] leading-none">{set.lastCount}</p>
        </div>
      </div>

      {set.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {set.tags.map(t => (
            <span key={t} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded font-mono text-[var(--os-text-2)]">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[var(--os-border)]">
        <span className="text-[10px] text-[var(--os-text-2)]">{timeAgo(set.lastRunAt)}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => togglePublic.mutate()} title={set.isPublic ? 'Public — click to make private' : 'Private — click to make public'}
            className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)]">
            {set.isPublic ? <Globe size={13} weight="fill" className="text-[#579bfc]" /> : <Lock size={13} />}
          </button>
          <button onClick={onEdit} title="Edit" className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)]">
            <PencilSimple size={13} />
          </button>
          <button onClick={() => run.mutate()} disabled={run.isPending} title="Run"
            className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-[#579bfc] hover:bg-[var(--os-surface-0)]">
            {run.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} weight="fill" />}
          </button>
          {!set.isSystem && (
            <button onClick={() => confirm(`Delete "${set.name}"?`) && remove.mutate()} title="Delete"
              className="p-1.5 rounded-2xl text-[var(--os-text-2)] hover:text-red-400 hover:bg-[var(--os-surface-0)]">
              <Trash size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ObjectSetsPage() {
  const qc = useQueryClient()
  const [showBuilder, setShowBuilder] = useState(false)
  const [editing, setEditing]         = useState<ObjectSet | null>(null)
  const [seeded, setSeeded]           = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['object-sets'],
    queryFn: () => objectSetService.list(),
  })

  const seed = useMutation({
    mutationFn: () => objectSetService.seed(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['object-sets'] }); setSeeded(true) },
  })

  const sets = data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2">
            <Stack size={18} /> Object Sets
          </h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">
            Saved, named, composable queries over the ontology — referenced from KIMMP context, canvas seeding, and dashboards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {sets.length === 0 && !isLoading && (
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending || seeded}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[var(--os-border)] text-xs font-semibold text-[var(--os-text-2)] disabled:opacity-50 hover:text-[var(--os-text-1)] transition-colors"
            >
              {seeded ? <CheckCircle size={13} weight="bold" /> : <Sparkle size={13} />}
              {seeded ? 'Seeded' : 'Seed system sets'}
            </button>
          )}
          <button
            onClick={() => { setEditing(null); setShowBuilder(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={13} weight="bold" /> New Object Set
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="os-card p-4 h-32 animate-pulse bg-[var(--os-surface-0)]" />
          ))}
        </div>
      ) : sets.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <Stack size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No Object Sets yet</p>
          <p className="text-xs text-[var(--os-text-2)]">Seed the system defaults or create your first saved query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map(s => (
            <ObjectSetCard key={s.id} set={s} onEdit={() => { setEditing(s); setShowBuilder(true) }} />
          ))}
        </div>
      )}

      {showBuilder && (
        <ObjectSetBuilder existing={editing} onClose={() => setShowBuilder(false)} />
      )}
    </div>
  )
}
