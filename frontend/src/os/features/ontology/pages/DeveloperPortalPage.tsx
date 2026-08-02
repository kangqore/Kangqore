import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Code, Terminal, Play, WebhooksLogo, Key, Copy, Download,
  ClockCounterClockwise, Trash, Plus, X, CheckCircle, Gauge,
} from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import {
  sdkService, subscriptionService, operationalSubscriptionService, developerKeyService,
  type SdkTypeShape, type KimmpOperationalSubscription,
} from '../sdkService'
import { ObjectTable } from '../components/ObjectTable'

// S306/S307 — Developer Portal: live SDK playground (pick a type, see the
// generated interface + real results side by side), the SDK changelog, and
// partner webhook subscriptions + scoped API keys. This is the "partners
// build against our ontology the same way they build against Salesforce"
// surface — everything here reads real, live ontology state, nothing mocked.
// S326 adds the KIMMP Operations half: the same downloaded SDK file now also
// exports KimmpOperationsClient (read APIs over Gateway/Registry/Eval/Agent
// Studio), and a second webhook tab for operational events.

type Tab = 'playground' | 'changelog' | 'webhooks' | 'opsWebhooks' | 'keys'

const TAB_DEFS: Array<{ id: Tab; label: string; icon: any }> = [
  { id: 'playground',   label: 'SDK Playground',      icon: Terminal },
  { id: 'changelog',    label: 'Changelog',           icon: ClockCounterClockwise },
  { id: 'webhooks',     label: 'Ontology Webhooks',   icon: WebhooksLogo },
  { id: 'opsWebhooks',  label: 'Operational Webhooks', icon: Gauge },
  { id: 'keys',         label: 'API Keys',            icon: Key },
]

function InterfacePreview({ type }: { type: SdkTypeShape }) {
  const lines = [
    `interface ${type.name} {`,
    '  id: string',
    ...type.fields.map(f => `  ${f.name}${f.required ? '' : '?'}: ${f.enumValues?.length ? f.enumValues.map(v => `'${v}'`).join(' | ') : f.type}`),
    '}',
  ]
  return (
    <pre className="text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-lg p-3 overflow-x-auto leading-relaxed text-[var(--os-text-1)]">
      {lines.join('\n')}
    </pre>
  )
}

function PlaygroundTab() {
  const { data: schema, isLoading } = useQuery({ queryKey: ['sdk-schema'], queryFn: () => sdkService.schema() })
  const [selected, setSelected] = useState<string | null>(null)

  const types = schema?.types ?? []
  const activeType = types.find(t => t.id === selected) ?? types[0]

  if (isLoading) return <div className="os-card h-64 animate-pulse bg-[var(--os-surface-0)]" />

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${activeType?.id === t.id ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'}`}
          >
            {t.displayName}
          </button>
        ))}
      </div>

      {activeType && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Generated interface</p>
            <InterfacePreview type={activeType} />
            <p className="text-[10px] text-[var(--os-text-2)]">
              {activeType.fields.filter(f => f.inferred).length} of {activeType.fields.length} fields inferred from live object data
              {activeType.fields.some(f => !f.inferred) ? ' (rest declared on the type schema)' : ''}.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--os-text-2)]">Live results — ontology.objects.{activeType.name}.where({'{}'}).execute()</p>
            <ObjectTable typeId={activeType.id} limit={8} />
          </div>
        </div>
      )}
    </div>
  )
}

function DownloadRow() {
  return (
    <div className="os-card p-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Code size={16} className="text-[var(--os-text-2)]" />
        <div>
          <p className="text-xs text-[var(--os-text-1)] font-semibold">Download the generated SDK</p>
          <p className="text-[10px] text-[var(--os-text-2)]">One file — OntologyClient (business objects) + KimmpOperationsClient (Gateway/Registry/Eval/Agent Studio, read-only)</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a href="/api/admin/ontology/sdk/typescript" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
          <Download size={12} /> TypeScript
        </a>
        <a href="/api/admin/ontology/sdk/python" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
          <Download size={12} /> Python
        </a>
      </div>
    </div>
  )
}

function ChangelogTab() {
  const { data, isLoading } = useQuery({ queryKey: ['sdk-changelog'], queryFn: () => sdkService.changelog() })
  const versions = data ?? []

  if (isLoading) return <div className="os-card h-40 animate-pulse bg-[var(--os-surface-0)]" />
  if (versions.length === 0) return <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No SDK versions recorded yet — download the SDK once to generate the first version.</div>

  return (
    <div className="space-y-3">
      {versions.map((v, i) => (
        <div key={v.id} className="os-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--os-text-1)]">
              v{versions.length - i} · {v.typesCount} types · {v.actionsCount} actions · {v.objectSetsCount} object sets
            </p>
            <p className="text-[10px] text-[var(--os-text-2)]">{new Date(v.createdAt).toLocaleString()}</p>
          </div>
          {v.diffFromPrevious && (v.diffFromPrevious.typesAdded.length > 0 || v.diffFromPrevious.actionsAdded.length > 0) && (
            <div className="mt-2 pt-2 border-t border-[var(--os-border)] flex flex-wrap gap-1.5">
              {v.diffFromPrevious.typesAdded.map(t => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400">+ {t}</span>
              ))}
              {v.diffFromPrevious.actionsAdded.map(a => (
                <span key={a} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#579bfc]/10 text-[#579bfc]">+ action {a}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function WebhooksTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['ontology-subscriptions'], queryFn: () => subscriptionService.list() })
  const subs = data ?? []

  const create = useMutation({
    mutationFn: () => subscriptionService.create({ name, url }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ontology-subscriptions'] }); setShowForm(false); setName(''); setUrl('') },
  })
  const test = useMutation({
    mutationFn: (id: string) => subscriptionService.test(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-subscriptions'] }),
  })
  const toggle = useMutation({
    mutationFn: (s: { id: string; enabled: boolean }) => subscriptionService.update(s.id, { enabled: !s.enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-subscriptions'] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => subscriptionService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ontology-subscriptions'] }),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--os-text-2)]">Partners register a URL to receive HMAC-signed POSTs on object.created / object.updated.</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold">
          <Plus size={12} /> New subscription
        </button>
      </div>

      {showForm && (
        <div className="os-card p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Subscription name" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://partner.example.com/webhook" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <div className="flex items-center gap-2">
            <button onClick={() => create.mutate()} disabled={create.isPending || !name.trim() || !url.trim()} className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
              {create.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="os-card h-32 animate-pulse bg-[var(--os-surface-0)]" />
      ) : subs.length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No webhook subscriptions yet</div>
      ) : (
        <div className="space-y-2">
          {subs.map(s => (
            <div key={s.id} className="os-card p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{s.name}</p>
                <p className="text-[10px] text-[var(--os-text-2)] truncate font-mono">{s.url}</p>
                <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">
                  {s.objectType?.displayName ?? 'All types'} · {s.lastTriggeredAt ? `last: ${s.lastStatus} @ ${new Date(s.lastTriggeredAt).toLocaleTimeString()}` : 'never triggered'}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggle.mutate(s)} className={`text-[9px] font-semibold px-2 py-1 rounded-md border ${s.enabled ? 'border-emerald-500/30 text-emerald-400' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                  {s.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button onClick={() => test.mutate(s.id)} title="Send test event" className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[#579bfc]">
                  {test.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} weight="fill" />}
                </button>
                <button onClick={() => remove.mutate(s.id)} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-red-400"><Trash size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// S326 — operational-surface counterpart to WebhooksTab above: same shape,
// scoped to eval.drift_alert / budget.exceeded (Gate 3 drift + hard-stop
// budget breaches) instead of ontology object mutations.
function OperationalWebhooksTab() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['kimmp-ops-subscriptions'], queryFn: () => operationalSubscriptionService.list() })
  const subs = data ?? []

  const create = useMutation({
    mutationFn: () => operationalSubscriptionService.create({ name, url }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kimmp-ops-subscriptions'] }); setShowForm(false); setName(''); setUrl('') },
  })
  const test = useMutation({
    mutationFn: (id: string) => operationalSubscriptionService.test(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-ops-subscriptions'] }),
  })
  const toggle = useMutation({
    mutationFn: (s: KimmpOperationalSubscription) => operationalSubscriptionService.update(s.id, { enabled: !s.enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-ops-subscriptions'] }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => operationalSubscriptionService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kimmp-ops-subscriptions'] }),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--os-text-2)]">Partners register a URL to receive HMAC-signed POSTs on eval.drift_alert (Gate 3) / budget.exceeded (hard-stop budgets).</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold">
          <Plus size={12} /> New subscription
        </button>
      </div>

      {showForm && (
        <div className="os-card p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Subscription name" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://partner.example.com/webhook" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <div className="flex items-center gap-2">
            <button onClick={() => create.mutate()} disabled={create.isPending || !name.trim() || !url.trim()} className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
              {create.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="os-card h-32 animate-pulse bg-[var(--os-surface-0)]" />
      ) : subs.length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No operational webhook subscriptions yet</div>
      ) : (
        <div className="space-y-2">
          {subs.map(s => (
            <div key={s.id} className="os-card p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--os-text-1)] truncate">{s.name}</p>
                <p className="text-[10px] text-[var(--os-text-2)] truncate font-mono">{s.url}</p>
                <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">
                  {s.eventTypes.join(', ')} · {s.lastTriggeredAt ? `last: ${s.lastStatus} @ ${new Date(s.lastTriggeredAt).toLocaleTimeString()}` : 'never triggered'}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggle.mutate(s)} className={`text-[9px] font-semibold px-2 py-1 rounded-md border ${s.enabled ? 'border-emerald-500/30 text-emerald-400' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                  {s.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button onClick={() => test.mutate(s.id)} title="Send test event" className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[#579bfc]">
                  {test.isPending ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} weight="fill" />}
                </button>
                <button onClick={() => remove.mutate(s.id)} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-red-400"><Trash size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function KeysTab() {
  const qc = useQueryClient()
  const { data: schema } = useQuery({ queryKey: ['sdk-schema'], queryFn: () => sdkService.schema() })
  const { data, isLoading } = useQuery({ queryKey: ['developer-keys'], queryFn: () => developerKeyService.list() })
  const keys = data ?? []

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [scopedTypes, setScopedTypes] = useState<string[]>([])
  const [newToken, setNewToken] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: () => developerKeyService.create({ name, scopedObjectTypes: scopedTypes }),
    onSuccess: (res) => { qc.invalidateQueries({ queryKey: ['developer-keys'] }); setNewToken(res.token); setShowForm(false); setName(''); setScopedTypes([]) },
  })
  const revoke = useMutation({
    mutationFn: (id: string) => developerKeyService.revoke(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['developer-keys'] }),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--os-text-2)]">Scope a key to specific object types — leave empty for unrestricted platform access.</p>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold">
          <Plus size={12} /> New key
        </button>
      </div>

      {newToken && (
        <div className="os-card p-4 border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400"><CheckCircle size={14} weight="fill" /><p className="text-xs font-bold">Store this token now — it will not be shown again</p></div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] font-mono bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-md px-2 py-1.5 text-[var(--os-text-1)] truncate">{newToken}</code>
            <button onClick={() => navigator.clipboard.writeText(newToken)} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><Copy size={13} /></button>
            <button onClick={() => setNewToken(null)} className="p-1.5 rounded-md text-[var(--os-text-2)]"><X size={13} /></button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="os-card p-4 space-y-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Key name (e.g. Nexus Intelligence Partner)" className="w-full px-2.5 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none" />
          <div className="flex flex-wrap gap-1.5">
            {(schema?.types ?? []).map(t => (
              <button
                key={t.id}
                onClick={() => setScopedTypes(s => s.includes(t.name) ? s.filter(x => x !== t.name) : [...s, t.name])}
                className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${scopedTypes.includes(t.name) ? 'bg-[var(--os-accent)] text-white border-transparent' : 'border-[var(--os-border)] text-[var(--os-text-2)]'}`}
              >
                {t.displayName}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => create.mutate()} disabled={create.isPending || !name.trim()} className="px-3 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-[11px] font-semibold disabled:opacity-50">
              {create.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--os-text-2)]">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="os-card h-32 animate-pulse bg-[var(--os-surface-0)]" />
      ) : keys.length === 0 ? (
        <div className="os-card p-8 text-center text-xs text-[var(--os-text-2)]">No API keys yet</div>
      ) : (
        <div className="space-y-2">
          {keys.map(k => (
            <div key={k.id} className="os-card p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--os-text-1)]">{k.name}</p>
                <p className="text-[10px] text-[var(--os-text-2)] font-mono">{k.prefix}••••••••</p>
                <p className="text-[9px] text-[var(--os-text-2)] mt-0.5">
                  {k.scopedObjectTypes.length === 0 ? 'Unrestricted' : `Scoped: ${k.scopedObjectTypes.join(', ')}`}
                </p>
              </div>
              <button onClick={() => revoke.mutate(k.id)} className="p-1.5 rounded-md text-[var(--os-text-2)] hover:text-red-400 flex-shrink-0"><Trash size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DeveloperPortalPage() {
  const [tab, setTab] = useState<Tab>('playground')

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><Terminal size={18} weight="fill" /> Developer Portal</h2>
        <p className="text-xs text-[var(--os-text-2)] mt-0.5">Live SDK playground, changelog, partner webhooks, and scoped API keys — the ecosystem surface for the ontology.</p>
      </div>

      <DownloadRow />

      <div className="flex items-center gap-1 border-b border-[var(--os-border)]">
        {TAB_DEFS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px ${tab === t.id ? 'border-[#579bfc] text-[#579bfc]' : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'}`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'playground' && <PlaygroundTab />}
      {tab === 'changelog' && <ChangelogTab />}
      {tab === 'webhooks' && <WebhooksTab />}
      {tab === 'opsWebhooks' && <OperationalWebhooksTab />}
      {tab === 'keys' && <KeysTab />}
    </div>
  )
}
