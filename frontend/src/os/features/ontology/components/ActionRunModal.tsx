import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Play, Warning, CheckCircle } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { api } from '@lib/api'
import { actionEngineService, type OntologyAction, type PreflightResult } from '../actionEngineService'

// Shared "run an Action" form, rendered from a typed parameter schema. Used by
// the Actions library, the per-object action panel, the ⌘K "/" shortcut, and
// the ActionFormBuilder's live preview — one execution surface for the whole
// ontology, matching the audit path both humans and KIMMP write through.

function ObjectRefField({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const { data, isFetching } = useQuery<{ objects: any[] }>({
    queryKey: ['ontology-search', search],
    queryFn: () => api.get(`/admin/ontology/objects?search=${encodeURIComponent(search)}&limit=8`).then(r => r.data),
    enabled: search.length > 1,
    staleTime: 10_000,
  })
  return (
    <div>
      <input
        className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
        placeholder="Search objects…"
        value={value ? search || value : search}
        onChange={e => { setSearch(e.target.value); onChange('') }}
      />
      {isFetching && <p className="text-[10px] text-[var(--os-text-2)] mt-1">Searching…</p>}
      {data?.objects && data.objects.length > 0 && !value && (
        <div className="mt-1 rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] max-h-32 overflow-y-auto">
          {data.objects.map((o: any) => (
            <button key={o.id} type="button"
              onClick={() => { onChange(o.id); setSearch(o.externalId ?? o.id.slice(0, 12)) }}
              className="w-full text-left px-3 py-1.5 hover:bg-[var(--os-card)] text-xs border-b border-[var(--os-border)] last:border-0"
            >
              <span className="font-medium text-[var(--os-text-1)]">{o.type?.displayName}</span>
              <span className="text-[var(--os-text-2)] ml-2">{o.externalId ?? o.id.slice(0, 12)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ObjectSetField({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { data } = useQuery<{ sets: any[] }>({
    queryKey: ['object-sets-picker'],
    queryFn: () => api.get('/admin/ontology/object-sets').then(r => r.data),
    staleTime: 30_000,
  })
  return (
    <select
      className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
      value={value} onChange={e => onChange(e.target.value)}
    >
      <option value="">Select an Object Set…</option>
      {(data?.sets ?? []).map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.lastCount})</option>)}
    </select>
  )
}

// ── Bare form — no modal chrome. Used both standalone (builder preview) and
// wrapped by ActionRunModal below. `disabled` mutes the run button for
// preview-only contexts (e.g. an unsaved action has no id to execute against).
export function ActionParamForm({ action, objectId, disabled, onExecuted }: {
  action: OntologyAction
  objectId?: string
  disabled?: boolean
  onExecuted?: (executionId: string) => void
}) {
  const qc = useQueryClient()
  const [values, setValues] = useState<Record<string, any>>({})
  const [preflight, setPreflight] = useState<PreflightResult | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (disabled) return
    const t = setTimeout(() => {
      setChecking(true)
      actionEngineService.validate(action.id, values, objectId).then(setPreflight).finally(() => setChecking(false))
    }, 350)
    return () => clearTimeout(t)
  }, [JSON.stringify(values), action.id, objectId, disabled])

  const run = useMutation({
    mutationFn: () => actionEngineService.execute(action.id, values, objectId, 'HUMAN'),
    onSuccess: (execution) => {
      qc.invalidateQueries({ queryKey: ['action-executions'] })
      qc.invalidateQueries({ queryKey: ['ontology-actions'] })
      onExecuted?.(execution.id)
    },
  })

  const blockers = (preflight?.errors ?? []).filter(e => e.severity === 'BLOCK')
  const warnings = (preflight?.errors ?? []).filter(e => e.severity === 'WARN')
  const canRun = !disabled && !checking && blockers.length === 0 && !run.isPending

  const setField = (name: string, v: any) => setValues(prev => ({ ...prev, [name]: v }))

  return (
    <div className="space-y-4">
      {action.parameters.length === 0 ? (
        <p className="text-xs text-[var(--os-text-2)]">This action takes no parameters.</p>
      ) : (
        <div className="space-y-3">
          {action.parameters.map(p => (
            <div key={p.name}>
              <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">
                {p.name}{p.required && <span className="text-red-400"> *</span>}
                {p.description && <span className="text-[var(--os-text-2)] font-normal"> — {p.description}</span>}
              </label>
              {p.type === 'boolean' ? (
                <button type="button" onClick={() => setField(p.name, !values[p.name])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${values[p.name] ? 'bg-[#579bfc] text-white border-[#579bfc]' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}
                >
                  {values[p.name] ? 'True' : 'False'}
                </button>
              ) : p.type === 'enum' ? (
                <select
                  className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
                  value={values[p.name] ?? ''} onChange={e => setField(p.name, e.target.value)}
                >
                  <option value="">Select…</option>
                  {(p.enum ?? []).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : p.type === 'object-ref' ? (
                <ObjectRefField value={values[p.name] ?? ''} onChange={v => setField(p.name, v)} />
              ) : p.type === 'object-set' ? (
                <ObjectSetField value={values[p.name] ?? ''} onChange={v => setField(p.name, v)} />
              ) : (
                <input
                  type={p.type === 'number' ? 'number' : p.type === 'date' ? 'date' : 'text'}
                  min={p.min} max={p.max}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
                  value={values[p.name] ?? ''}
                  onChange={e => setField(p.name, p.type === 'number' ? Number(e.target.value) : e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!disabled && (blockers.length > 0 || warnings.length > 0) && (
        <div className="space-y-1.5">
          {blockers.map((e, i) => (
            <div key={`b${i}`} className="flex items-start gap-1.5 text-[11px] text-red-400">
              <Warning size={13} weight="fill" className="flex-shrink-0 mt-0.5" /> {e.message}
            </div>
          ))}
          {warnings.map((e, i) => (
            <div key={`w${i}`} className="flex items-start gap-1.5 text-[11px] text-amber-400">
              <Warning size={13} className="flex-shrink-0 mt-0.5" /> {e.message}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => run.mutate()}
        disabled={!canRun}
        title={disabled ? 'Save the action before running it' : undefined}
        className="w-full py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {run.isPending
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Running…</>
          : checking
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Checking…</>
            : <><Play size={14} weight="fill" />Run {action.displayName}</>}
      </button>
      {run.isSuccess && (
        <p className="text-[11px] text-emerald-400 flex items-center gap-1.5"><CheckCircle size={13} weight="fill" /> Executed successfully.</p>
      )}
      {run.isError && <p className="text-[11px] text-red-400">Failed: {(run.error as Error).message}</p>}
    </div>
  )
}

// ── Modal chrome around ActionParamForm — the surface actually opened from
// the Actions library, the object action panel, and the ⌘K shortcut.
export function ActionRunModal({ action, objectId, onClose, onExecuted }: {
  action: OntologyAction
  objectId?: string
  onClose: () => void
  onExecuted?: (executionId: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--os-text-1)]">{action.displayName}</p>
            {action.description && <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{action.description}</p>}
          </div>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <ActionParamForm action={action} objectId={objectId} onExecuted={id => { onExecuted?.(id); onClose() }} />
      </div>
    </div>
  )
}
