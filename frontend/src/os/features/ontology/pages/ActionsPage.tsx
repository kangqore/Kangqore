import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lightning, Plus, Trash, X, PencilSimple, Play, DotsSixVertical, Wrench } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import {
  actionEngineService, type OntologyAction, type ActionParameterDef, type ParamType,
  type ActionValidationRule, type ActionEffect, type EffectType, type ConditionLeaf,
} from '../actionEngineService'
import { ActionRunModal, ActionParamForm } from '../components/ActionRunModal'

const PARAM_TYPES: ParamType[] = ['string', 'number', 'boolean', 'date', 'enum', 'object-ref', 'object-set']
const EFFECT_TYPES: EffectType[] = ['UPDATE_OBJECT', 'CREATE_OBJECT', 'CREATE_RELATIONSHIP', 'WEBHOOK', 'EMIT_EVENT']
const CONDITION_OPS = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'in', 'exists'] as const
const ROLES = ['ADMIN', 'TEAM', 'EXECUTIVE', 'CLIENT', 'PARTNER', 'INVESTOR', 'ANALYST', 'JOB_SEEKER', 'JOURNALIST', 'VISITOR']

const ROW = 'flex items-center gap-1.5'
const INPUT = 'px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none'

// ── Key/value editor — shared by effect configuration forms ──────────────────
function KeyValueEditor({ value, onChange, placeholder }: {
  value: Record<string, string>; onChange: (v: Record<string, string>) => void; placeholder?: string
}) {
  const rows = Object.entries(value)
  const setRow = (i: number, k: string, v: string) => {
    const next = [...rows]; next[i] = [k, v]
    onChange(Object.fromEntries(next))
  }
  return (
    <div className="space-y-1.5">
      {rows.map(([k, v], i) => (
        <div key={i} className={ROW}>
          <input className={`${INPUT} flex-1`} placeholder="property" value={k} onChange={e => setRow(i, e.target.value, v)} />
          <input className={`${INPUT} flex-1`} placeholder={placeholder ?? '{{paramName}} or literal'} value={v} onChange={e => setRow(i, k, e.target.value)} />
          <button onClick={() => onChange(Object.fromEntries(rows.filter((_, idx) => idx !== i)))} className="text-[var(--os-text-2)] hover:text-red-400 p-1">
            <Trash className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange({ ...value, ['']: '' })} className="flex items-center gap-1 text-[10px] font-semibold text-[#579bfc]">
        <Plus className="w-3 h-3" /> Add field
      </button>
    </div>
  )
}

// ── Parameters editor — S295: drag-drop rows, reorder, typed schema ──────────
function SortableParamRow({ p, onChange, onRemove }: { p: ActionParameterDef; onChange: (p: ActionParameterDef) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.name || Math.random().toString() })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] p-2.5 space-y-1.5">
      <div className={ROW}>
        <button {...attributes} {...listeners} className="cursor-grab text-[var(--os-text-2)] flex-shrink-0"><DotsSixVertical className="w-3.5 h-3.5" /></button>
        <input className={`${INPUT} flex-1`} placeholder="paramName" value={p.name} onChange={e => onChange({ ...p, name: e.target.value })} />
        <select className={INPUT} value={p.type} onChange={e => onChange({ ...p, type: e.target.value as ParamType })}>
          {PARAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-1 text-[10px] text-[var(--os-text-2)] flex-shrink-0">
          <input type="checkbox" checked={!!p.required} onChange={e => onChange({ ...p, required: e.target.checked })} /> required
        </label>
        <button onClick={onRemove} className="text-[var(--os-text-2)] hover:text-red-400 p-1 flex-shrink-0"><Trash className="w-3 h-3" /></button>
      </div>
      <div className={ROW}>
        <input className={`${INPUT} flex-1`} placeholder="description" value={p.description ?? ''} onChange={e => onChange({ ...p, description: e.target.value })} />
        {p.type === 'enum' && (
          <input className={`${INPUT} flex-1`} placeholder="enum values, comma separated"
            value={(p.enum ?? []).join(', ')}
            onChange={e => onChange({ ...p, enum: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
        )}
        {p.type === 'number' && (<>
          <input className={`${INPUT} w-16`} type="number" placeholder="min" value={p.min ?? ''} onChange={e => onChange({ ...p, min: e.target.value === '' ? undefined : Number(e.target.value) })} />
          <input className={`${INPUT} w-16`} type="number" placeholder="max" value={p.max ?? ''} onChange={e => onChange({ ...p, max: e.target.value === '' ? undefined : Number(e.target.value) })} />
        </>)}
        {p.type === 'string' && (
          <input className={`${INPUT} flex-1`} placeholder="regex (optional)" value={p.regex ?? ''} onChange={e => onChange({ ...p, regex: e.target.value })} />
        )}
      </div>
    </div>
  )
}

function ParametersEditor({ params, onChange }: { params: ActionParameterDef[]; onChange: (p: ActionParameterDef[]) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = params.findIndex(p => p.name === active.id)
    const newIdx = params.findIndex(p => p.name === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    onChange(arrayMove(params, oldIdx, newIdx))
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={params.map(p => p.name)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {params.map((p, i) => (
            <SortableParamRow key={p.name || i} p={p}
              onChange={next => onChange(params.map((x, idx) => idx === i ? next : x))}
              onRemove={() => onChange(params.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      </SortableContext>
      <button onClick={() => onChange([...params, { name: `param${params.length + 1}`, type: 'string', required: false }])}
        className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc]">
        <Plus className="w-3 h-3" /> Add parameter
      </button>
    </DndContext>
  )
}

// ── Validation rule builder — S295 ────────────────────────────────────────────
function ValidationRuleRow({ rule, params, onChange, onRemove }: {
  rule: { condition: ConditionLeaf; errorMessage: string; severity: 'BLOCK' | 'WARN' }
  params: ActionParameterDef[]
  onChange: (r: typeof rule) => void
  onRemove: () => void
}) {
  const cond = rule.condition
  return (
    <div className="rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] p-2.5 space-y-1.5">
      <div className={ROW}>
        <select className={INPUT} value={cond.source} onChange={e => onChange({ ...rule, condition: { ...cond, source: e.target.value as 'param' | 'object' } })}>
          <option value="param">param</option>
          <option value="object">object</option>
        </select>
        <input className={`${INPUT} flex-1`} placeholder={cond.source === 'param' ? 'paramName' : 'properties.status'}
          value={cond.field} onChange={e => onChange({ ...rule, condition: { ...cond, field: e.target.value } })} />
        <select className={INPUT} value={cond.op} onChange={e => onChange({ ...rule, condition: { ...cond, op: e.target.value as ConditionLeaf['op'] } })}>
          {CONDITION_OPS.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
        {cond.op !== 'exists' && (
          <input className={`${INPUT} flex-1`} placeholder="value" value={cond.value ?? ''} onChange={e => onChange({ ...rule, condition: { ...cond, value: coerce(e.target.value) } })} />
        )}
        <button onClick={onRemove} className="text-[var(--os-text-2)] hover:text-red-400 p-1"><Trash className="w-3 h-3" /></button>
      </div>
      <div className={ROW}>
        <input className={`${INPUT} flex-1`} placeholder="Error message shown when the condition fails" value={rule.errorMessage} onChange={e => onChange({ ...rule, errorMessage: e.target.value })} />
        <select className={INPUT} value={rule.severity} onChange={e => onChange({ ...rule, severity: e.target.value as 'BLOCK' | 'WARN' })}>
          <option value="BLOCK">BLOCK</option>
          <option value="WARN">WARN</option>
        </select>
      </div>
    </div>
  )
}
function coerce(raw: string): any {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw.trim() !== '' && !isNaN(Number(raw))) return Number(raw)
  return raw
}

// ── Effects builder — S296 ────────────────────────────────────────────────────
function EffectRow({ effect, params, onChange, onRemove }: {
  effect: { effectType: EffectType; configuration: any }
  params: ActionParameterDef[]
  onChange: (e: typeof effect) => void
  onRemove: () => void
}) {
  const cfg = effect.configuration ?? {}
  const setCfg = (patch: any) => onChange({ ...effect, configuration: { ...cfg, ...patch } })
  const objectRefParams = params.filter(p => p.type === 'object-ref')

  return (
    <div className="rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] p-2.5 space-y-2">
      <div className={ROW}>
        <select className={`${INPUT} flex-1`} value={effect.effectType} onChange={e => onChange({ effectType: e.target.value as EffectType, configuration: {} })}>
          {EFFECT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>
        <button onClick={onRemove} className="text-[var(--os-text-2)] hover:text-red-400 p-1"><Trash className="w-3 h-3" /></button>
      </div>

      {effect.effectType === 'UPDATE_OBJECT' && (
        <div>
          <p className="text-[10px] text-[var(--os-text-2)] mb-1">Properties to set on the target object</p>
          <KeyValueEditor value={cfg.properties ?? {}} onChange={v => setCfg({ properties: v })} />
        </div>
      )}
      {effect.effectType === 'CREATE_OBJECT' && (
        <div className="space-y-1.5">
          <input className={`${INPUT} w-full`} placeholder="target OntologyObjectType id" value={cfg.typeId ?? ''} onChange={e => setCfg({ typeId: e.target.value })} />
          <KeyValueEditor value={cfg.properties ?? {}} onChange={v => setCfg({ properties: v })} />
        </div>
      )}
      {effect.effectType === 'CREATE_RELATIONSHIP' && (
        <div className="space-y-1.5">
          <select className={`${INPUT} w-full`} value={cfg.targetObjectParam ?? ''} onChange={e => setCfg({ targetObjectParam: e.target.value })}>
            <option value="">Target object comes from param…</option>
            {objectRefParams.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <input className={`${INPUT} w-full`} placeholder="relationshipType (e.g. RELATED_TO)" value={cfg.relationshipType ?? ''} onChange={e => setCfg({ relationshipType: e.target.value })} />
          <input className={`${INPUT} w-full`} placeholder="label (optional)" value={cfg.label ?? ''} onChange={e => setCfg({ label: e.target.value })} />
          {objectRefParams.length === 0 && <p className="text-[10px] text-amber-400">Add an object-ref parameter above to use as the relationship target.</p>}
        </div>
      )}
      {effect.effectType === 'WEBHOOK' && (
        <div className="space-y-1.5">
          <div className={ROW}>
            <select className={INPUT} value={cfg.method ?? 'POST'} onChange={e => setCfg({ method: e.target.value })}>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
            </select>
            <input className={`${INPUT} flex-1`} placeholder="https://…" value={cfg.url ?? ''} onChange={e => setCfg({ url: e.target.value })} />
          </div>
          <p className="text-[10px] text-[var(--os-text-2)]">Fields posted to the webhook (fires after DB effects commit)</p>
          <KeyValueEditor value={cfg.fieldMapping ?? {}} onChange={v => setCfg({ fieldMapping: v })} />
        </div>
      )}
      {effect.effectType === 'EMIT_EVENT' && (
        <div className="space-y-1.5">
          <input className={`${INPUT} w-full`} placeholder="eventType (e.g. ACTION_TAKEN)" value={cfg.eventType ?? ''} onChange={e => setCfg({ eventType: e.target.value })} />
          <KeyValueEditor value={cfg.properties ?? {}} onChange={v => setCfg({ properties: v })} />
        </div>
      )}
    </div>
  )
}

// ── Form builder modal ────────────────────────────────────────────────────────
function ActionFormBuilder({ existing, onClose }: { existing: OntologyAction | null; onClose: () => void }) {
  const qc = useQueryClient()
  const { data: typesData } = useQuery({ queryKey: ['ontology-types'], queryFn: () => api.get('/admin/ontology/types').then(r => r.data) })
  const types: any[] = typesData?.types ?? []

  const [typeId, setTypeId]           = useState(existing?.typeId ?? '')
  const [name, setName]               = useState(existing?.name ?? '')
  const [displayName, setDisplayName] = useState(existing?.displayName ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [allowedRoles, setAllowedRoles] = useState<string[]>(existing?.allowedRoles ?? ['ADMIN'])
  const [params, setParams]           = useState<ActionParameterDef[]>(existing?.parameters ?? [])
  const [rules, setRules]             = useState<Array<{ id?: string; condition: ConditionLeaf; errorMessage: string; severity: 'BLOCK' | 'WARN' }>>(
    (existing?.validationRules ?? []).map(r => ({ id: r.id, condition: r.condition as ConditionLeaf, errorMessage: r.errorMessage, severity: r.severity }))
  )
  const [effects, setEffects]         = useState<Array<{ id?: string; effectType: EffectType; configuration: any }>>(
    (existing?.effects ?? []).map(e => ({ id: e.id, effectType: e.effectType, configuration: e.configuration }))
  )
  const [showPreview, setShowPreview] = useState(false)

  const toggleRole = (r: string) => setAllowedRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const save = useMutation({
    mutationFn: async () => {
      let action: OntologyAction
      if (existing) {
        action = await actionEngineService.update(existing.id, { displayName, description, parameters: params, allowedRoles })
      } else {
        action = await actionEngineService.create({ typeId, name, displayName, description, parameters: params, allowedRoles })
      }
      // Rules: delete removed, upsert rest (create-only for simplicity; existing rules are edited in place by id)
      const existingRuleIds = new Set((existing?.validationRules ?? []).map(r => r.id))
      const keptRuleIds = new Set(rules.filter(r => r.id).map(r => r.id))
      await Promise.all([
        ...[...existingRuleIds].filter(id => !keptRuleIds.has(id)).map(id => actionEngineService.removeRule(id!)),
        ...rules.map((r, i) => r.id
          ? actionEngineService.updateRule(r.id, { condition: r.condition, errorMessage: r.errorMessage, severity: r.severity, order: i })
          : actionEngineService.addRule(action.id, { condition: r.condition, errorMessage: r.errorMessage, severity: r.severity, order: i })),
      ])
      const existingEffectIds = new Set((existing?.effects ?? []).map(e => e.id))
      const keptEffectIds = new Set(effects.filter(e => e.id).map(e => e.id))
      await Promise.all([
        ...[...existingEffectIds].filter(id => !keptEffectIds.has(id)).map(id => actionEngineService.removeEffect(id!)),
        ...effects.map((e, i) => e.id
          ? actionEngineService.updateEffect(e.id, { effectType: e.effectType, configuration: e.configuration, order: i })
          : actionEngineService.addEffect(action.id, { effectType: e.effectType, configuration: e.configuration, order: i })),
      ])
      return action
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ontology-actions'] })
      onClose()
    },
  })

  const previewAction: OntologyAction | null = useMemo(() => {
    if (!showPreview) return null
    return { id: 'preview', typeId, name, displayName: displayName || 'Preview', description, parameters: params, allowedRoles, executions: 0, createdAt: '', updatedAt: '' }
  }, [showPreview, typeId, name, displayName, description, params, allowedRoles])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-5 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{existing ? 'Edit Action' : 'New Action'}</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>

        {/* Basics */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Object Type</label>
            <select className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" value={typeId} onChange={e => setTypeId(e.target.value)} disabled={!!existing}>
              <option value="">Select…</option>
              {types.map((t: any) => <option key={t.id} value={t.id}>{t.displayName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Name (code identifier)</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" placeholder="ApproveInvoice" value={name} onChange={e => setName(e.target.value)} disabled={!!existing} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Display Name</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" placeholder="Approve Invoice" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Allowed Roles</label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map(r => (
                <button key={r} type="button" onClick={() => toggleRole(r)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${allowedRoles.includes(r) ? 'bg-[#579bfc] text-white border-[#579bfc]' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}
                >{r}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Parameters</p>
            <button onClick={() => setShowPreview(s => !s)} className="text-[10px] font-semibold text-[#579bfc]">{showPreview ? 'Hide' : 'Show'} form preview</button>
          </div>
          <ParametersEditor params={params} onChange={setParams} />
        </div>

        {previewAction && (
          <div className="rounded-lg border border-dashed border-[var(--os-border)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-2">Form preview</p>
            <ActionParamForm action={previewAction} disabled />
          </div>
        )}

        {/* Validation rules */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-2">Validation Rules</p>
          <div className="space-y-2">
            {rules.map((r, i) => (
              <ValidationRuleRow key={i} rule={r} params={params}
                onChange={next => setRules(rules.map((x, idx) => idx === i ? next : x))}
                onRemove={() => setRules(rules.filter((_, idx) => idx !== i))} />
            ))}
          </div>
          <button onClick={() => setRules([...rules, { condition: { source: 'param', field: '', op: 'exists' }, errorMessage: '', severity: 'BLOCK' }])}
            className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc]">
            <Plus className="w-3 h-3" /> Add validation rule
          </button>
        </div>

        {/* Effects */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] mb-2">Effects (write-back, run in order)</p>
          <div className="space-y-2">
            {effects.map((e, i) => (
              <EffectRow key={i} effect={e} params={params}
                onChange={next => setEffects(effects.map((x, idx) => idx === i ? next : x))}
                onRemove={() => setEffects(effects.filter((_, idx) => idx !== i))} />
            ))}
          </div>
          <button onClick={() => setEffects([...effects, { effectType: 'UPDATE_OBJECT', configuration: {} }])}
            className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc]">
            <Plus className="w-3 h-3" /> Add effect
          </button>
        </div>

        <button
          onClick={() => save.mutate()}
          disabled={!displayName || (!existing && (!typeId || !name)) || save.isPending}
          className="w-full py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : existing ? 'Save Changes' : 'Create Action'}
        </button>
        {save.isError && <p className="text-[11px] text-red-400">Failed to save: {(save.error as Error).message}</p>}
      </div>
    </div>
  )
}

// ── Library ────────────────────────────────────────────────────────────────────
function ActionCard({ action, onEdit, onRun }: { action: OntologyAction; onEdit: () => void; onRun: () => void }) {
  const qc = useQueryClient()
  const remove = useMutation({
    mutationFn: () => actionEngineService.remove(action.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-actions'] }),
  })
  const toggleTool = useMutation({
    mutationFn: () => actionEngineService.update(action.id, { toolCallable: !action.toolCallable }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-actions'] }),
  })
  return (
    <div className="os-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--os-text-1)] truncate">{action.displayName}</p>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{action.type?.displayName} · <code className="font-mono">{action.name}</code></p>
        </div>
        <p className="text-2xl font-black text-[var(--os-text-1)] leading-none flex-shrink-0">{action.executions}</p>
      </div>
      {action.description && <p className="text-[11px] text-[var(--os-text-2)] line-clamp-2">{action.description}</p>}
      <div className="flex items-center gap-2 text-[10px] text-[var(--os-text-2)]">
        <span>{action._count?.validationRules ?? 0} rules</span>
        <span className="text-[var(--os-border)]">·</span>
        <span>{action._count?.effects ?? 0} effects</span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[var(--os-border)]">
        <div className="flex items-center gap-1 flex-wrap">
          {action.allowedRoles.slice(0, 3).map(r => (
            <span key={r} className="text-[9px] bg-[var(--os-surface-0)] border border-[var(--os-border)] px-1.5 py-0.5 rounded font-mono text-[var(--os-text-2)]">{r}</span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => toggleTool.mutate()} title={action.toolCallable ? 'Tool-callable — Claude may invoke this action' : 'Not tool-callable — click to expose to Claude via tool-use'}
            className={`p-1.5 rounded-md ${action.toolCallable ? 'text-[#22d3ee] bg-[#22d3ee]/10' : 'text-[var(--os-text-2)] hover:bg-[var(--os-surface-0)]'}`}>
            <Wrench size={13} weight={action.toolCallable ? 'fill' : 'regular'} />
          </button>
          <button onClick={onEdit} title="Edit" className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)]"><PencilSimple size={13} /></button>
          <button onClick={onRun} title="Run" className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[#579bfc] hover:bg-[var(--os-surface-0)]"><Play size={13} weight="fill" /></button>
          <button onClick={() => confirm(`Delete "${action.displayName}"?`) && remove.mutate()} title="Delete" className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-red-400 hover:bg-[var(--os-surface-0)]"><Trash size={13} /></button>
        </div>
      </div>
    </div>
  )
}

export function ActionsPage() {
  const [showBuilder, setShowBuilder] = useState(false)
  const [editing, setEditing]         = useState<OntologyAction | null>(null)
  const [running, setRunning]         = useState<OntologyAction | null>(null)

  const { data, isLoading } = useQuery({ queryKey: ['ontology-actions'], queryFn: () => actionEngineService.list() })
  const actions = data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><Lightning size={18} /> Actions</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Typed, validated, write-back actions — the same execution path humans and KIMMP both run through.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowBuilder(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
          <Plus size={13} weight="bold" /> New Action
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="os-card p-4 h-32 animate-pulse bg-[var(--os-surface-0)]" />)}
        </div>
      ) : actions.length === 0 ? (
        <div className="os-card p-12 flex flex-col items-center gap-3 text-center">
          <Lightning size={32} className="text-[var(--os-text-2)]" />
          <p className="text-sm text-[var(--os-text-1)] font-semibold">No Actions yet</p>
          <p className="text-xs text-[var(--os-text-2)]">Create your first typed, validated Action.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map(a => (
            <ActionCard key={a.id} action={a}
              onEdit={async () => { setEditing(await actionEngineService.get(a.id)); setShowBuilder(true) }}
              onRun={() => setRunning(a)} />
          ))}
        </div>
      )}

      {showBuilder && <ActionFormBuilder existing={editing} onClose={() => setShowBuilder(false)} />}
      {running && <ActionRunModal action={running} onClose={() => setRunning(null)} />}
    </div>
  )
}
