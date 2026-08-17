import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { apiFetch } from '@lib/api'
import { Shield, Plus, Trash2, Loader2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, XCircle, Info, Network, Key, Clock } from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Policy {
  id:          string
  name:        string
  description: string | null
  trigger:     string
  condition:   any
  effect:      string
  priority:    number
  enabled:     boolean
  createdAt:   string
}

const EFFECT_STYLE: Record<string, { color: string; label: string; icon: any }> = {
  ALLOW:            { color: '#00c875', label: 'Allow',            icon: CheckCircle2 },
  DENY:             { color: '#e2445c', label: 'Deny',             icon: XCircle },
  REQUIRE_APPROVAL: { color: '#fdab3d', label: 'Require Approval', icon: AlertTriangle },
  NOTIFY:           { color: '#579bfc', label: 'Notify',           icon: Info },
}

const TRIGGER_OPTIONS = [
  '*', 'EXTERNAL_API_CALL', 'CREATE_LEAD', 'UPDATE_PROJECT_STATUS',
  'DRAFT_EMAIL', 'EMIT_SIGNAL', 'ADD_MEMORY',
]

const EFFECT_OPTIONS = ['ALLOW', 'DENY', 'REQUIRE_APPROVAL', 'NOTIFY']

// ── Policy form modal ─────────────────────────────────────────────────────────
function PolicyFormModal({ onClose, onSave, saving }: {
  onClose: () => void
  onSave:  (data: any) => void
  saving:  boolean
}) {
  const [name,        setName]        = useState('')
  const [description, setDescription] = useState('')
  const [trigger,     setTrigger]     = useState('EXTERNAL_API_CALL')
  const [effect,      setEffect]      = useState('REQUIRE_APPROVAL')
  const [priority,    setPriority]    = useState(0)
  const [condField,   setCondField]   = useState('params.platform')
  const [condOp,      setCondOp]      = useState('eq')
  const [condValue,   setCondValue]   = useState('')

  const condition = condField && condOp && condValue
    ? { field: condField, operator: condOp, value: condValue }
    : {}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--os-text-1)]">New Policy</p>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)] text-xl leading-none">×</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Policy Name *</label>
            <input
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
              placeholder="e.g. Block high-value Salesforce writes"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Description</label>
            <input
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              placeholder="What does this policy do?"
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Trigger</label>
            <select
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={trigger} onChange={e => setTrigger(e.target.value)}
            >
              {TRIGGER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Effect</label>
            <select
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={effect} onChange={e => setEffect(e.target.value)}
            >
              {EFFECT_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Condition builder */}
        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-1.5 block">Condition (optional)</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
              placeholder="Field (e.g. params.platform)"
              value={condField} onChange={e => setCondField(e.target.value)}
            />
            <select
              className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
              value={condOp} onChange={e => setCondOp(e.target.value)}
            >
              {['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'contains', 'in', 'notIn', 'exists'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <input
              className="px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] text-[var(--os-text-1)] outline-none"
              placeholder="Value"
              value={condValue} onChange={e => setCondValue(e.target.value)}
            />
          </div>
          {condField && condOp && condValue && (
            <p className="text-[10px] text-[var(--os-text-2)] mt-1">
              When <code className="text-[#579bfc]">{condField}</code> {condOp} <code className="text-[#579bfc]">{condValue}</code>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Priority (higher = evaluated first)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none"
              value={priority} onChange={e => setPriority(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onSave({ name, description: description || undefined, trigger, condition, effect, priority })}
            disabled={!name.trim() || saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50"
          >
            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : 'Create Policy'}
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-2xl border border-[var(--os-border)] text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── Policy row ────────────────────────────────────────────────────────────────
function PolicyRow({ policy }: { policy: Policy }) {
  const qc = useQueryClient()
  const eff = EFFECT_STYLE[policy.effect] ?? EFFECT_STYLE.NOTIFY

  const toggle = useMutation({
    mutationFn: () => apiFetch(`/admin/kangqore-immp/policies/${policy.id}`, {
      method: 'PATCH', body: JSON.stringify({ enabled: !policy.enabled }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-policies'] }),
  })

  const remove = useMutation({
    mutationFn: () => apiFetch(`/admin/kangqore-immp/policies/${policy.id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-policies'] }),
  })

  const cond = policy.condition as any
  const condSummary = cond?.field
    ? `${cond.field} ${cond.operator} ${cond.value}`
    : cond?.AND ? 'AND condition'
    : 'Any'

  return (
    <tr className={cn('border-b border-[var(--os-border)] transition-colors', !policy.enabled && 'opacity-50')}>
      <td className="px-4 py-3">
        <p className="text-[12px] font-semibold text-[var(--os-text-1)]">{policy.name}</p>
        {policy.description && <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{policy.description}</p>}
      </td>
      <td className="px-4 py-3">
        <span className="text-[11px] font-mono text-[var(--os-text-2)] bg-[var(--os-surface-0)] px-1.5 py-0.5 rounded border border-[var(--os-border)]">
          {policy.trigger}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-[10px] text-[var(--os-text-2)]">{condSummary}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <eff.icon className="w-3.5 h-3.5" style={{ color: eff.color }} />
          <span className="text-[11px] font-semibold" style={{ color: eff.color }}>{eff.label}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-[11px] text-[var(--os-text-2)]">{policy.priority}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => toggle.mutate()} disabled={toggle.isPending} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            {policy.enabled ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => { if (confirm(`Delete policy "${policy.name}"?`)) remove.mutate() }}
            disabled={remove.isPending}
            className="text-[var(--os-text-2)] hover:text-red-400"
          >
            {remove.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function PoliciesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery<{ items: Policy[] }>({
    queryKey: ['kimmp-policies'],
    queryFn:  () => api.get('/admin/kangqore-immp/policies').then(r => r.data),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: (body: any) => apiFetch('/admin/kangqore-immp/policies', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kimmp-policies'] }); setShowForm(false) },
  })

  const policies = data?.items ?? []
  const enabled  = policies.filter(p => p.enabled).length
  const denyCount = policies.filter(p => p.effect === 'DENY').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--os-text-1)]">Policy Engine</h2>
          <p className="text-[12px] text-[var(--os-text-2)] mt-0.5">
            Rules that control what KIMMP can do — evaluated before every action.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5]"
        >
          <Plus className="w-3.5 h-3.5" /> New Policy
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Policies', value: enabled,         bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'DENY Rules',      value: denyCount,       bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
          { label: 'Total',           value: policies.length, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
        ].map(t => (
          <div key={t.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: t.bg, boxShadow: `0 4px 20px ${t.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.label}</p>
            <p className="relative text-3xl font-black tabular-nums" style={{ color: '#ffffff' }}>{t.value}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-[#579bfc]/20 bg-[#579bfc]/[0.03] px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-3.5 h-3.5 text-[#579bfc]" />
          <p className="text-[11px] font-semibold text-[#579bfc]">How policies work</p>
        </div>
        <p className="text-[11px] text-[var(--os-text-2)]">
          Every KIMMP action is evaluated against these policies before execution. Higher priority policies run first.
          <strong className="text-[var(--os-text-1)]"> DENY</strong> blocks immediately.
          <strong className="text-[var(--os-text-1)]"> REQUIRE_APPROVAL</strong> escalates to L3 regardless of agent level.
          <strong className="text-[var(--os-text-1)]"> NOTIFY</strong> logs without blocking.
        </p>
      </div>

      {/* Policy table */}
      <div className="os-card overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 rounded bg-[var(--os-surface-0)] animate-pulse" />)}</div>
        ) : policies.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Shield className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
            <p className="text-sm text-[var(--os-text-2)]">No policies yet. Default is ALLOW for all actions.</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--os-border)]">
                {['Policy', 'Trigger', 'Condition', 'Effect', 'Priority', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[var(--os-text-2)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map(p => <PolicyRow key={p.id} policy={p} />)}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <PolicyFormModal
          onClose={() => setShowForm(false)}
          onSave={d => create.mutate(d)}
          saving={create.isPending}
        />
      )}

      <hr className="border-[var(--os-border)]" />

      {/* Access Control */}
      <IPAllowlistSection />
      <SSOConfigSection />
      <SessionTimeoutSection />
    </div>
  )
}

// ── IP Allowlist ──────────────────────────────────────────────────────────────
function IPAllowlistSection() {
  const qc = useQueryClient()
  const [newCidr, setNewCidr] = useState('')

  const { data: list = [], isLoading } = useQuery<string[]>({
    queryKey: ['ip-allowlist'],
    queryFn:  () => api.get('/admin/settings/ip-allowlist').then(r => r.data?.cidrs ?? r.data ?? []),
    staleTime: 30_000,
  })

  const add = useMutation({
    mutationFn: () => api.post('/admin/settings/ip-allowlist', { cidr: newCidr.trim() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ip-allowlist'] }); setNewCidr('') },
  })

  const remove = useMutation({
    mutationFn: (cidr: string) => api.delete('/admin/settings/ip-allowlist', { data: { cidr } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ip-allowlist'] }),
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-[var(--os-text-1)]">IP Allowlist</h3>
        <span className="text-[11px] text-[var(--os-text-3)]">Restrict admin access to these CIDRs. Empty = unrestricted.</span>
      </div>

      <div className="flex gap-2">
        <input
          value={newCidr}
          onChange={e => setNewCidr(e.target.value)}
          placeholder="e.g. 203.0.113.0/24 or 10.0.0.1"
          className="flex-1 px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm font-mono text-[var(--os-text-1)] outline-none focus:border-blue-500/50"
        />
        <button
          onClick={() => add.mutate()}
          disabled={!newCidr.trim() || add.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 disabled:opacity-40"
        >
          {add.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add
        </button>
      </div>

      {isLoading ? (
        <div className="h-8 rounded-2xl animate-pulse bg-[var(--os-surface-0)]" />
      ) : list.length === 0 ? (
        <p className="text-[11px] text-[var(--os-text-3)] italic px-1">No IP restrictions — all IPs allowed.</p>
      ) : (
        <div className="rounded-2xl border border-[var(--os-border)] divide-y divide-[var(--os-border)] overflow-hidden">
          {list.map(cidr => (
            <div key={cidr} className="flex items-center gap-3 px-4 py-2.5 bg-[var(--os-card)] hover:bg-[var(--os-surface-0)] group">
              <span className="text-sm font-mono text-[var(--os-text-1)] flex-1">{cidr}</span>
              <button onClick={() => remove.mutate(cidr)} disabled={remove.isPending}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── SSO Config ────────────────────────────────────────────────────────────────
function SSOConfigSection() {
  const [idpUrl,     setIdpUrl]     = useState('')
  const [entityId,   setEntityId]   = useState('')
  const [metadata,   setMetadata]   = useState('')
  const [saved, setSaved] = useState(false)

  const save = useMutation({
    mutationFn: () => api.post('/admin/settings/sso', { idpUrl, entityId, metadata }),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500) },
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Key className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-bold text-[var(--os-text-1)]">SSO / SAML Configuration</h3>
        <span className="text-[11px] text-[var(--os-text-3)]">Configure your Identity Provider for single sign-on.</span>
      </div>

      <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">IdP SSO URL</label>
            <input value={idpUrl} onChange={e => setIdpUrl(e.target.value)}
              placeholder="https://idp.example.com/sso/saml"
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-violet-500/50" />
          </div>
          <div>
            <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">Entity ID (Issuer)</label>
            <input value={entityId} onChange={e => setEntityId(e.target.value)}
              placeholder="https://idp.example.com/metadata"
              className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-violet-500/50" />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-[var(--os-text-2)] mb-1 block">SAML Metadata XML</label>
          <textarea rows={5} value={metadata} onChange={e => setMetadata(e.target.value)}
            placeholder="Paste your IdP metadata XML here…"
            className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[11px] font-mono text-[var(--os-text-1)] outline-none focus:border-violet-500/50 resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => save.mutate()} disabled={save.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-40">
            {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : 'Save SSO Config'}
          </button>
          {saved && <span className="flex items-center gap-1 text-xs font-bold text-green-500"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </div>
    </div>
  )
}

// ── Session Timeout ───────────────────────────────────────────────────────────
function SessionTimeoutSection() {
  const [idle,     setIdle]     = useState(30)
  const [absolute, setAbsolute] = useState(480)
  const [saved, setSaved] = useState(false)

  const save = useMutation({
    mutationFn: () => api.post('/admin/settings/session', { idleTimeoutMinutes: idle, absoluteTimeoutMinutes: absolute }),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500) },
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-[var(--os-text-1)]">Session Timeout</h3>
      </div>

      <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-4">
        {[
          { label: 'Idle Timeout',     sub: 'Log out after N minutes of inactivity',  value: idle,     set: setIdle,     min: 5,   max: 480,  step: 5  },
          { label: 'Absolute Timeout', sub: 'Force re-login after N minutes total',   value: absolute, set: setAbsolute, min: 60,  max: 10080, step: 60 },
        ].map(row => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <p className="text-sm font-semibold text-[var(--os-text-1)]">{row.label}</p>
                <p className="text-[11px] text-[var(--os-text-3)]">{row.sub}</p>
              </div>
              <span className="text-sm font-bold text-amber-400 tabular-nums min-w-[72px] text-right">
                {row.value >= 60 ? `${Math.round(row.value / 60)}h` : `${row.value}m`}
              </span>
            </div>
            <input type="range" min={row.min} max={row.max} step={row.step} value={row.value}
              onChange={e => row.set(parseInt(e.target.value))}
              className="w-full accent-amber-500" />
            <div className="flex justify-between text-[10px] text-[var(--os-text-3)] mt-0.5">
              <span>{row.min >= 60 ? `${row.min / 60}h` : `${row.min}m`}</span>
              <span>{row.max >= 60 ? `${row.max / 60}h` : `${row.max}m`}</span>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 pt-1">
          <button onClick={() => save.mutate()} disabled={save.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 disabled:opacity-40">
            {save.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : 'Save Timeout Rules'}
          </button>
          {saved && <span className="flex items-center gap-1 text-xs font-bold text-green-500"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
        </div>
      </div>
    </div>
  )
}
