import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ChevronDown, ChevronRight, Loader2, X, Tag, Zap, Link2, Trash2 } from 'lucide-react'
import { cn } from '@design-system/cn'
import { koreService, type KoreObject, type KoreRelationship } from '../koreService'

const CARDINALITY_LABEL: Record<KoreRelationship['cardinality'], string> = {
  ONE_TO_ONE:  '1 : 1',
  ONE_TO_MANY: '1 : N',
  MANY_TO_MANY:'N : N',
}

const PROP_TYPES = ['STRING', 'NUMBER', 'BOOLEAN', 'DATE']

// ── Create Type drawer ────────────────────────────────────────────────────────
function CreateTypeDrawer({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const create = useMutation({
    mutationFn: () => koreService.createObject({ name: name.trim(), description: desc.trim() || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kore-types'] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">New KORE Type</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Name</label>
            <input
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="e.g. Contract, Proposal, Asset"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="What does this type represent?"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => create.mutate()}
          disabled={!name.trim() || create.isPending}
          className="w-full py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {create.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : 'Create Type'}
        </button>
        {create.isError && <p className="text-[11px] text-red-400">Failed: {(create.error as Error).message}</p>}
      </div>
    </div>
  )
}

// ── Add Property drawer ───────────────────────────────────────────────────────
function AddPropertyDrawer({ objectName, onClose }: { objectName: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [propName, setPropName] = useState('')
  const [propType, setPropType] = useState('STRING')
  const [required, setRequired] = useState(false)

  const add = useMutation({
    mutationFn: () => koreService.addProperty(objectName, { name: propName.trim(), type: propType, isRequired: required, isUnique: false }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kore-type', objectName] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">Add Property — <span className="text-[var(--os-text-2)]">{objectName}</span></p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Property Name</label>
            <input
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="e.g. status, dueDate, amount"
              value={propName}
              onChange={e => setPropName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Type</label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={propType} onChange={e => setPropType(e.target.value)}
            >
              {PROP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)} className="rounded" />
            <span className="text-sm text-[var(--os-text-1)]">Required</span>
          </label>
        </div>
        <button
          onClick={() => add.mutate()}
          disabled={!propName.trim() || add.isPending}
          className="w-full py-2 rounded-lg bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {add.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Adding…</> : 'Add Property'}
        </button>
      </div>
    </div>
  )
}

// ── Add Action drawer ─────────────────────────────────────────────────────────
function AddActionDrawer({ objectName, onClose }: { objectName: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [actionName, setActionName] = useState('')
  const [actionDesc, setActionDesc] = useState('')

  const add = useMutation({
    mutationFn: () => koreService.addAction(objectName, { name: actionName.trim(), description: actionDesc.trim() || undefined, permissions: ['ADMIN'] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kore-type', objectName] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">Add Action — <span className="text-[var(--os-text-2)]">{objectName}</span></p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Action Name</label>
            <input
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="e.g. approve, escalate, archive"
              value={actionName}
              onChange={e => setActionName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description (optional)</label>
            <input
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="What does this action do?"
              value={actionDesc}
              onChange={e => setActionDesc(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => add.mutate()}
          disabled={!actionName.trim() || add.isPending}
          className="w-full py-2 rounded-lg bg-[#d97706] text-white text-sm font-semibold hover:bg-[#b45309] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {add.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Adding…</> : 'Add Action'}
        </button>
      </div>
    </div>
  )
}

// ── Add Relationship drawer ───────────────────────────────────────────────────
function AddRelationshipDrawer({ objectName, allTypes, onClose }: { objectName: string; allTypes: string[]; onClose: () => void }) {
  const qc = useQueryClient()
  const [relName, setRelName] = useState('')
  const [target, setTarget] = useState(allTypes.filter(t => t !== objectName)[0] ?? '')
  const [cardinality, setCardinality] = useState<KoreRelationship['cardinality']>('ONE_TO_MANY')
  const [required, setRequired] = useState(false)

  const add = useMutation({
    mutationFn: () => koreService.addRelationship(objectName, { relationName: relName.trim(), targetObjectName: target, cardinality, isRequired: required }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kore-relationships', objectName] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">Add Relationship — <span className="text-[var(--os-text-2)]">{objectName}</span></p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Relation Name</label>
            <input autoFocus placeholder="e.g. hasMany, belongsTo, references"
              className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              value={relName} onChange={e => setRelName(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Target Type</label>
            <select className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={target} onChange={e => setTarget(e.target.value)}>
              {allTypes.filter(t => t !== objectName).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Cardinality</label>
            <select className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={cardinality} onChange={e => setCardinality(e.target.value as KoreRelationship['cardinality'])}>
              <option value="ONE_TO_ONE">1 : 1 (One to One)</option>
              <option value="ONE_TO_MANY">1 : N (One to Many)</option>
              <option value="MANY_TO_MANY">N : N (Many to Many)</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)} className="rounded" />
            <span className="text-sm text-[var(--os-text-1)]">Required</span>
          </label>
        </div>
        <button onClick={() => add.mutate()} disabled={!relName.trim() || !target || add.isPending}
          className="w-full py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {add.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Adding…</> : 'Add Relationship'}
        </button>
        {add.isError && <p className="text-[11px] text-red-400">Failed: {(add.error as Error).message}</p>}
      </div>
    </div>
  )
}

// ── Expanded type row ─────────────────────────────────────────────────────────
function TypeDetail({ obj, allTypeNames }: { obj: KoreObject; allTypeNames: string[] }) {
  const [activeTab, setActiveTab] = useState<'properties' | 'actions' | 'relationships'>('properties')
  const [propDrawer, setPropDrawer] = useState(false)
  const [actionDrawer, setActionDrawer] = useState(false)
  const [relDrawer, setRelDrawer] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<KoreObject>({
    queryKey: ['kore-type', obj.name],
    queryFn: () => koreService.getObject(obj.name),
    staleTime: 30_000,
  })

  const { data: relationships = [], isLoading: relsLoading } = useQuery<KoreRelationship[]>({
    queryKey: ['kore-relationships', obj.name],
    queryFn: () => koreService.getRelationships(obj.name),
    staleTime: 30_000,
  })

  const deleteRel = useMutation({
    mutationFn: (relId: string) => koreService.deleteRelationship(obj.name, relId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kore-relationships', obj.name] }),
  })

  const loaded = data ?? obj
  const tabs = [
    { key: 'properties' as const,    label: `Properties (${loaded.properties?.length ?? 0})`,   color: 'text-emerald-500', border: 'border-emerald-500' },
    { key: 'actions' as const,       label: `Actions (${loaded.actions?.length ?? 0})`,           color: 'text-amber-500',   border: 'border-amber-500'   },
    { key: 'relationships' as const, label: `Relationships (${relationships.length})`,             color: 'text-violet-500',  border: 'border-violet-500'  },
  ]

  return (
    <div className="border-t border-[var(--os-border)] bg-[var(--os-surface-0)]">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-[var(--os-border)] px-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('px-4 py-2.5 text-[11px] font-semibold border-b-2 -mb-px transition-all',
              activeTab === t.key ? `${t.color} ${t.border}` : 'text-[var(--os-text-2)] border-transparent hover:text-[var(--os-text-1)]'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        {/* Properties tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">Properties</p>
              </div>
              <button onClick={() => setPropDrawer(true)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                <Plus className="w-3 h-3" />Add
              </button>
            </div>
            {isLoading ? (
              <div className="space-y-1.5">{[1,2,3].map(i => <div key={i} className="h-8 rounded bg-[var(--os-card)] animate-pulse" />)}</div>
            ) : !loaded.properties?.length ? (
              <p className="text-[11px] text-[var(--os-text-2)] italic">No properties defined.</p>
            ) : (
              <div className="space-y-1.5">
                {loaded.properties.map(p => (
                  <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs">
                    <span className="font-medium text-[var(--os-text-1)] truncate flex-1">{p.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{p.type}</span>
                    {p.isRequired && <span className="text-[9px] text-amber-400">required</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions tab */}
        {activeTab === 'actions' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">Actions</p>
              </div>
              <button onClick={() => setActionDrawer(true)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors">
                <Plus className="w-3 h-3" />Add
              </button>
            </div>
            {isLoading ? (
              <div className="space-y-1.5">{[1,2,3].map(i => <div key={i} className="h-8 rounded bg-[var(--os-card)] animate-pulse" />)}</div>
            ) : !loaded.actions?.length ? (
              <p className="text-[11px] text-[var(--os-text-2)] italic">No actions defined.</p>
            ) : (
              <div className="space-y-1.5">
                {loaded.actions.map(a => (
                  <div key={a.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs">
                    <span className="font-medium text-[var(--os-text-1)] truncate flex-1">{a.name}</span>
                    {a.description && <span className="text-[10px] text-[var(--os-text-2)] truncate">{a.description}</span>}
                    <div className="flex gap-1 flex-shrink-0">
                      {a.permissions.map(p => (
                        <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Relationships tab */}
        {activeTab === 'relationships' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-violet-500" />
                <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide">Relationship Constraints</p>
              </div>
              <button onClick={() => setRelDrawer(true)} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border border-violet-500/30 text-violet-500 hover:bg-violet-500/10 transition-colors">
                <Plus className="w-3 h-3" />Add
              </button>
            </div>
            {relsLoading ? (
              <div className="space-y-1.5">{[1,2].map(i => <div key={i} className="h-8 rounded bg-[var(--os-card)] animate-pulse" />)}</div>
            ) : !relationships.length ? (
              <p className="text-[11px] text-[var(--os-text-2)] italic">No relationship constraints. Define how this type links to other types.</p>
            ) : (
              <div className="space-y-1.5">
                {relationships.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] text-xs group">
                    <span className="font-mono font-semibold text-violet-400 truncate">{obj.name}</span>
                    <span className="text-[var(--os-text-3)] shrink-0">·{r.relationName}·</span>
                    <span className="font-mono font-semibold text-[#579bfc] truncate flex-1">{r.targetObjectName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-3)] shrink-0">{CARDINALITY_LABEL[r.cardinality]}</span>
                    {r.isRequired && <span className="text-[9px] text-amber-400 shrink-0">required</span>}
                    <button onClick={() => deleteRel.mutate(r.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all ml-1 shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {propDrawer && <AddPropertyDrawer objectName={obj.name} onClose={() => setPropDrawer(false)} />}
      {actionDrawer && <AddActionDrawer objectName={obj.name} onClose={() => setActionDrawer(false)} />}
      {relDrawer && <AddRelationshipDrawer objectName={obj.name} allTypes={allTypeNames} onClose={() => setRelDrawer(false)} />}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function KoreTypesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [createDrawer, setCreateDrawer] = useState(false)

  const { data, isLoading } = useQuery<KoreObject[]>({
    queryKey: ['kore-types'],
    queryFn: () => koreService.getObjects(),
    staleTime: 60_000,
  })

  const types = data ?? []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--os-text-1)]">KORE Type Registry</h2>
          <p className="text-[12px] text-[var(--os-text-2)] mt-0.5">Object type schemas — define properties and actions for each KORE domain object.</p>
        </div>
        <button
          onClick={() => setCreateDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#579bfc] text-white text-xs font-semibold hover:bg-[#4a8ef5] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />New Type
        </button>
      </div>

      <div className="os-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--os-border)]">
              <th className="w-8 px-3 py-3" />
              {['Name', 'Properties', 'Actions', 'System', 'Created'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--os-border)]">
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-3 rounded bg-[var(--os-surface-0)] animate-pulse w-24" /></td>
                ))}
              </tr>
            ))}
            {!isLoading && types.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--os-text-2)] text-sm">
                  No KORE types defined. Create one to start building your domain model.
                </td>
              </tr>
            )}
            {!isLoading && types.map(obj => {
              const isOpen = expanded === obj.name
              return (
                <>
                  <tr
                    key={obj.name}
                    className={cn('border-b border-[var(--os-border)] cursor-pointer transition-colors', isOpen ? 'bg-[var(--os-surface-0)]' : 'hover:bg-[var(--os-surface-0)]')}
                    onClick={() => setExpanded(e => e === obj.name ? null : obj.name)}
                  >
                    <td className="px-3 py-3 text-[var(--os-text-2)]">
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--os-text-1)]">{obj.name}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)]">{obj.properties?.length ?? 0}</td>
                    <td className="px-4 py-3 text-[var(--os-text-2)]">{obj.actions?.length ?? 0}</td>
                    <td className="px-4 py-3">
                      {obj.isSystem
                        ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">system</span>
                        : <span className="text-[var(--os-text-2)]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--os-text-2)] whitespace-nowrap">
                      {new Date(obj.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`detail-${obj.name}`}>
                      <td colSpan={6} className="p-0">
                        <TypeDetail obj={obj} allTypeNames={types.map(t => t.name)} />
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {createDrawer && <CreateTypeDrawer onClose={() => setCreateDrawer(false)} />}
    </div>
  )
}
