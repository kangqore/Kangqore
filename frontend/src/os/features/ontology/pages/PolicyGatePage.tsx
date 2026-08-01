import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Plus, Trash, X, PencilSimple, TestTube } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { policyGateService, type KimmpPolicy } from '../policyGateService'

// S299 — Policy Gate Builder. Every OntologyAction now runs through
// policyEngine.service.ts's checkPolicy() (wired in S298) — this is the first
// UI to create/edit those rules instead of a raw curl to /policies.

const EFFECT_CFG: Record<string, { color: string; label: string }> = {
  ALLOW:            { color: '#10b981', label: 'Allow' },
  DENY:             { color: '#ef4444', label: 'Deny' },
  REQUIRE_APPROVAL: { color: '#f59e0b', label: 'Require Approval' },
  NOTIFY:           { color: '#579bfc', label: 'Notify' },
}

const OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'in', 'notIn', 'exists']
const ROW = 'flex items-center gap-1.5'
const INPUT = 'px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none'

interface Leaf { field: string; operator: string; value?: any }

function toRows(condition: KimmpPolicy['condition'] | undefined): Leaf[] {
  if (!condition) return []
  if (condition.AND) return condition.AND as Leaf[]
  if ('field' in condition && condition.field) return [condition as Leaf]
  return []
}
function fromRows(rows: Leaf[]): object {
  if (rows.length === 0) return {}
  if (rows.length === 1) return rows[0]
  return { AND: rows }
}
function coerce(raw: string): any {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw.trim() !== '' && !isNaN(Number(raw))) return Number(raw)
  return raw
}

function PolicyBuilder({ existing, onClose }: { existing: KimmpPolicy | null; onClose: () => void }) {
  const qc = useQueryClient()
  const [name, setName]               = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [trigger, setTrigger]         = useState(existing?.trigger ?? '')
  const [effect, setEffect]           = useState(existing?.effect ?? 'NOTIFY')
  const [priority, setPriority]       = useState(existing?.priority ?? 50)
  const [rows, setRows]               = useState<Leaf[]>(() => toRows(existing?.condition))

  const [testParams, setTestParams] = useState('{}')
  const [testResult, setTestResult] = useState<string | null>(null)
  const test = useMutation({
    mutationFn: () => policyGateService.check({ trigger, params: JSON.parse(testParams || '{}') }),
    onSuccess: r => setTestResult(`${r.effect}${r.policyName ? ` — matched "${r.policyName}"` : ' — no policy matched'}`),
    onError: (e: Error) => setTestResult(`Error: ${e.message}`),
  })

  const save = useMutation({
    mutationFn: () => {
      const payload = { name, description: description || undefined, trigger, condition: fromRows(rows), effect, priority }
      return existing ? policyGateService.update(existing.id, payload) : policyGateService.create(payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kimmp-policies'] }); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--os-text-1)]">{existing ? 'Edit Policy' : 'New Policy'}</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Name</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Trigger (Action name, or *)</label>
            <input className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none font-mono" placeholder="STRATEGIC_DECISION" value={trigger} onChange={e => setTrigger(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Priority (higher checked first)</label>
            <input type="number" className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none" value={priority} onChange={e => setPriority(Number(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Effect</label>
            <div className="flex gap-1.5">
              {Object.entries(EFFECT_CFG).map(([k, cfg]) => (
                <button key={k} type="button" onClick={() => setEffect(k)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                  style={effect === k ? { background: `${cfg.color}18`, borderColor: `${cfg.color}50`, color: cfg.color } : { borderColor: 'var(--os-border)', color: 'var(--os-text-2)' }}
                >{cfg.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-2 block">Conditions (all must match — no rows means "always matches")</label>
          <div className="space-y-1.5">
            {rows.map((r, i) => (
              <div key={i} className={ROW}>
                <input className={`${INPUT} flex-1`} placeholder="params.confidence" value={r.field} onChange={e => setRows(rows.map((x, idx) => idx === i ? { ...x, field: e.target.value } : x))} />
                <select className={INPUT} value={r.operator} onChange={e => setRows(rows.map((x, idx) => idx === i ? { ...x, operator: e.target.value } : x))}>
                  {OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                {r.operator !== 'exists' && (
                  <input className={`${INPUT} flex-1`} placeholder="value" value={r.value ?? ''} onChange={e => setRows(rows.map((x, idx) => idx === i ? { ...x, value: coerce(e.target.value) } : x))} />
                )}
                <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="text-[var(--os-text-2)] hover:text-red-400 p-1"><Trash className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setRows([...rows, { field: 'params.', operator: 'eq', value: '' }])} className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#579bfc]">
            <Plus className="w-3 h-3" /> Add condition
          </button>
        </div>

        <div className="rounded-lg border border-dashed border-[var(--os-border)] p-3 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)] flex items-center gap-1.5"><TestTube size={12} /> Test against sample params</p>
          <textarea className="w-full px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs font-mono text-[var(--os-text-1)] outline-none" rows={2} value={testParams} onChange={e => setTestParams(e.target.value)} />
          <button onClick={() => test.mutate()} disabled={!trigger || test.isPending} className="px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-50">
            {test.isPending ? 'Checking…' : 'Run test'}
          </button>
          {testResult && <p className="text-[11px] text-[var(--os-text-1)]">{testResult}</p>}
        </div>

        <button onClick={() => save.mutate()} disabled={!name || !trigger || save.isPending}
          className="w-full py-2 rounded-lg bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : existing ? 'Save Changes' : 'Create Policy'}
        </button>
        {save.isError && <p className="text-[11px] text-red-400">Failed to save: {(save.error as Error).message}</p>}
      </div>
    </div>
  )
}

function PolicyRow({ policy, onEdit }: { policy: KimmpPolicy; onEdit: () => void }) {
  const qc = useQueryClient()
  const cfg = EFFECT_CFG[policy.effect] ?? EFFECT_CFG.NOTIFY
  const toggle = useMutation({
    mutationFn: () => policyGateService.update(policy.id, { enabled: !policy.enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-policies'] }),
  })
  const remove = useMutation({
    mutationFn: () => policyGateService.remove(policy.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-policies'] }),
  })
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--os-surface-0)] transition-colors">
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${cfg.color}15`, color: cfg.color }}>{cfg.label}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">{policy.name}</p>
        <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">trigger <code className="font-mono">{policy.trigger}</code> · priority {policy.priority}</p>
      </div>
      <button onClick={() => toggle.mutate()} className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${policy.enabled ? 'border-emerald-500/30 text-emerald-400' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
        {policy.enabled ? 'Enabled' : 'Disabled'}
      </button>
      <button onClick={onEdit} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:bg-[var(--os-card)]"><PencilSimple size={13} /></button>
      <button onClick={() => confirm(`Delete "${policy.name}"?`) && remove.mutate()} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-red-400 hover:bg-[var(--os-card)]"><Trash size={13} /></button>
    </div>
  )
}

export function PolicyGatePage() {
  const [showBuilder, setShowBuilder] = useState(false)
  const [editing, setEditing]         = useState<KimmpPolicy | null>(null)
  const { data, isLoading } = useQuery({ queryKey: ['kimmp-policies'], queryFn: () => policyGateService.list() })
  const policies = useMemo(() => (data ?? []).slice().sort((a, b) => b.priority - a.priority), [data])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><ShieldCheck size={18} /> Policy Gate</h2>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5">Same gate for human and AI — every Action checks these before it runs.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowBuilder(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
          <Plus size={13} weight="bold" /> New Policy
        </button>
      </div>

      <div className="os-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[var(--os-text-2)]">Loading…</div>
        ) : policies.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--os-text-2)]">No policies yet.</div>
        ) : (
          <div className="divide-y divide-[var(--os-border)]">
            {policies.map(p => <PolicyRow key={p.id} policy={p} onEdit={() => { setEditing(p); setShowBuilder(true) }} />)}
          </div>
        )}
      </div>

      {showBuilder && <PolicyBuilder existing={editing} onClose={() => setShowBuilder(false)} />}
    </div>
  )
}
