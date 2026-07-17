import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Code2, Key, Plus, Trash2, ExternalLink, Copy, CheckCircle, AlertTriangle, Bot, Activity, RefreshCw, Pause, Play } from 'lucide-react'
import { api } from '@lib/api'

const T1  = 'var(--os-text-1)'
const T2  = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const PURP = '#7c3aed'
const BLUE = '#579bfc'
const TEAL = '#14b8a6'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const GRN  = '#10b981'

interface ApiKey {
  id:         string
  name:       string
  prefix:     string
  lastUsedAt: string | null
  expiresAt:  string | null
  createdAt:  string
}

interface ExternalAgent {
  id:             string
  name:           string
  role:           string
  capabilities:   string[]
  webhookUrl:     string
  status:         string
  lastPingAt:     string | null
  lastPingStatus: string | null
  lastPingMs:     number | null
  createdAt:      string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1 rounded" style={{ color: T2 }}>
      {copied ? <CheckCircle className="w-3.5 h-3.5" style={{ color: GRN }} /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

const STATUS_CLR: Record<string, string> = {
  ACTIVE: GRN, PAUSED: AMB, ERROR: RED, REVOKED: T2, OK: GRN, TIMEOUT: RED,
}
const STATUS_BG: Record<string, string> = {
  ACTIVE: 'rgba(16,185,129,0.1)', PAUSED: 'rgba(245,158,11,0.1)', ERROR: 'rgba(239,68,68,0.1)', REVOKED: 'rgba(136,150,192,0.1)',
}

// ── Tab navigation ──────────────────────────────────────────────────────────

type Tab = 'keys' | 'agents' | 'endpoints'

export function DeveloperPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('keys')

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl border" style={{ background: SURF, borderColor: BDR, width: 'fit-content' }}>
        {([['keys', 'API Keys'], ['agents', 'Registered Agents'], ['endpoints', 'REST API v1']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            style={tab === id
              ? { background: PURP, color: '#fff' }
              : { color: T2 }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'keys'    && <KeysTab qc={qc} />}
      {tab === 'agents'  && <AgentsTab qc={qc} />}
      {tab === 'endpoints' && <EndpointsTab />}
    </div>
  )
}

// ── API Keys tab ─────────────────────────────────────────────────────────────

function KeysTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [createName, setCreateName] = useState('')
  const [newToken, setNewToken]     = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useQuery<{ keys: ApiKey[] }>({
    queryKey: ['dev-api-keys'],
    queryFn:  () => api.get('/admin/developer/keys').then(r => r.data),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/developer/keys', { name: createName, expiresInDays: 365 }),
    onSuccess: (res) => {
      setNewToken(res.data.token)
      setCreateName('')
      setShowCreate(false)
      qc.invalidateQueries({ queryKey: ['dev-api-keys'] })
    },
  })

  const revoke = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/developer/keys/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['dev-api-keys'] }),
  })

  const keys = data?.keys ?? []

  return (
    <div className="space-y-4">
      {/* Docs link */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <Code2 className="w-5 h-5" style={{ color: PURP }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-1" style={{ color: T1 }}>API Documentation</p>
            <p className="text-xs font-medium mb-3" style={{ color: T2 }}>Interactive OpenAPI docs for all Kangqore OS endpoints.</p>
            <a href="/api/docs" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.12)', color: PURP, border: `1px solid rgba(124,58,237,0.2)` }}>
              <ExternalLink className="w-3.5 h-3.5" /> Open Swagger UI
            </a>
          </div>
        </div>
      </div>

      {newToken && (
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(0,200,117,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GRN }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold mb-2" style={{ color: GRN }}>Store this token now — it won't be shown again.</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: SURF, borderColor: BDR }}>
                <code className="text-xs font-mono truncate flex-1" style={{ color: T1 }}>{newToken}</code>
                <CopyButton text={newToken} />
              </div>
              <button onClick={() => setNewToken(null)} className="mt-2 text-[10px] font-bold" style={{ color: T2 }}>
                I've saved it — dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BDR }}>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4" style={{ color: T2 }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>API Keys</p>
            <span className="text-xs" style={{ color: T2 }}>{keys.length} / 10</span>
          </div>
          <button onClick={() => setShowCreate(s => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(87,155,252,0.1)', color: BLUE, border: `1px solid rgba(87,155,252,0.2)` }}>
            <Plus className="w-3.5 h-3.5" /> New Key
          </button>
        </div>

        {showCreate && (
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: BDR }}>
            <input autoFocus value={createName} onChange={e => setCreateName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createName.trim() && create.mutate()}
              placeholder="Key name (e.g. CI Pipeline, Zapier)"
              className="flex-1 px-3 py-2 text-xs rounded-lg border focus:outline-none"
              style={{ borderColor: BDR, background: SURF, color: T1 }} />
            <button disabled={!createName.trim() || create.isPending}
              onClick={() => create.mutate()}
              className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
              style={{ background: BLUE, color: '#fff' }}>
              {create.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-5 space-y-2">
            {[1,2].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: SURF }} />)}
          </div>
        )}
        {!isLoading && keys.length === 0 && !showCreate && (
          <div className="py-10 text-center text-sm font-medium" style={{ color: T2 }}>No API keys yet.</div>
        )}
        {!isLoading && keys.length > 0 && (
          <div className="divide-y" style={{ '--tw-divide-color': BDR } as any}>
            {keys.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: T1 }}>{k.name}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: T2 }}>{k.prefix}…</p>
                </div>
                <div className="text-right flex-shrink-0 mr-3">
                  <p className="text-[10px]" style={{ color: T2 }}>
                    {k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : 'Never used'}
                  </p>
                  {k.expiresAt && <p className="text-[10px]" style={{ color: T2 }}>Expires {new Date(k.expiresAt).toLocaleDateString()}</p>}
                </div>
                <button onClick={() => revoke.mutate(k.id)} disabled={revoke.isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ color: RED }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Registered Agents tab (S52) ──────────────────────────────────────────────

function AgentsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [showRegister, setShowRegister] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', capabilities: '', webhookUrl: '' })
  const [newSecret, setNewSecret] = useState<{ agentId: string; secret: string } | null>(null)

  const { data, isLoading } = useQuery<{ agents: ExternalAgent[] }>({
    queryKey: ['external-agents'],
    queryFn:  () => api.get('/admin/kangqore-immp/agents').then(r => r.data),
    staleTime: 20_000,
  })

  const register = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/agents/register', {
      name:         form.name.trim(),
      role:         form.role.trim(),
      capabilities: form.capabilities.split(',').map(s => s.trim()).filter(Boolean),
      webhookUrl:   form.webhookUrl.trim(),
    }),
    onSuccess: (res) => {
      setNewSecret({ agentId: res.data.agent.id, secret: res.data.agent.secret })
      setForm({ name: '', role: '', capabilities: '', webhookUrl: '' })
      setShowRegister(false)
      qc.invalidateQueries({ queryKey: ['external-agents'] })
    },
  })

  const ping = useMutation({
    mutationFn: (id: string) => api.post(`/admin/kangqore-immp/agents/${id}/ping`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['external-agents'] }),
  })

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/kangqore-immp/agents/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['external-agents'] }),
  })

  const deregister = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/kangqore-immp/agents/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['external-agents'] }),
  })

  const agents = data?.agents ?? []

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(20,184,166,0.1)' }}>
            <Bot className="w-5 h-5" style={{ color: TEAL }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold mb-1" style={{ color: T1 }}>External KIMMP Agents</p>
            <p className="text-xs font-medium" style={{ color: T2 }}>
              Register your own agents to receive SWARM_LOG tasks from KIMMP via signed webhook. Agents can contribute to signal analysis, decision support, and workflow execution.
            </p>
          </div>
        </div>
      </div>

      {/* Secret banner */}
      {newSecret && (
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(0,200,117,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GRN }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold mb-2" style={{ color: GRN }}>Signing secret — store now, never shown again</p>
              <p className="text-[10px] mb-2" style={{ color: T2 }}>Verify incoming KIMMP events: <code className="font-mono">HMAC-SHA256(payload, secret)</code> vs <code className="font-mono">X-KIMMP-Signature</code> header.</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: SURF, borderColor: BDR }}>
                <code className="text-xs font-mono truncate flex-1" style={{ color: T1 }}>{newSecret.secret}</code>
                <CopyButton text={newSecret.secret} />
              </div>
              <button onClick={() => setNewSecret(null)} className="mt-2 text-[10px] font-bold" style={{ color: T2 }}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Agent list */}
      <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: BDR }}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: T2 }} />
            <p className="text-sm font-bold" style={{ color: T1 }}>Registered Agents</p>
            <span className="text-xs" style={{ color: T2 }}>{agents.length}</span>
          </div>
          <button onClick={() => setShowRegister(s => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(20,184,166,0.1)', color: TEAL, border: `1px solid rgba(20,184,166,0.2)` }}>
            <Plus className="w-3.5 h-3.5" /> Register Agent
          </button>
        </div>

        {showRegister && (
          <div className="px-5 py-4 border-b space-y-3" style={{ borderColor: BDR }}>
            {[
              ['name',         'Agent name (e.g. Revenue Intelligence Bot)'],
              ['role',         'Role (e.g. SIGNAL_ANALYST, DECISION_SUPPORT)'],
              ['capabilities', 'Capabilities — comma-separated (e.g. SWARM_LOG, SIGNAL_ANALYSIS)'],
              ['webhookUrl',   'Webhook URL (e.g. https://my-agent.example.com/kimmp)'],
            ].map(([field, ph]) => (
              <input key={field} value={(form as any)[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={ph}
                className="w-full px-3 py-2 text-xs rounded-lg border focus:outline-none"
                style={{ borderColor: BDR, background: SURF, color: T1 }} />
            ))}
            <div className="flex gap-2">
              <button disabled={!form.name.trim() || !form.webhookUrl.trim() || register.isPending}
                onClick={() => register.mutate()}
                className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
                style={{ background: TEAL, color: '#fff' }}>
                {register.isPending ? 'Registering…' : 'Register'}
              </button>
              <button onClick={() => setShowRegister(false)} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ color: T2 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-5 space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg animate-pulse" style={{ background: SURF }} />)}</div>
        )}

        {!isLoading && agents.length === 0 && !showRegister && (
          <div className="py-10 text-center text-sm font-medium" style={{ color: T2 }}>
            No external agents registered yet.
          </div>
        )}

        {!isLoading && agents.map(a => (
          <div key={a.id} className="px-5 py-4 border-b" style={{ borderColor: BDR }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: STATUS_BG[a.status] ?? SURF }}>
                <Bot className="w-4 h-4" style={{ color: STATUS_CLR[a.status] ?? T2 }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold" style={{ color: T1 }}>{a.name}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ background: STATUS_BG[a.status] ?? SURF, color: STATUS_CLR[a.status] ?? T2 }}>
                    {a.status}
                  </span>
                  {a.lastPingStatus && (
                    <span className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{ color: STATUS_CLR[a.lastPingStatus] ?? T2 }}>
                      {a.lastPingStatus} {a.lastPingMs != null ? `${a.lastPingMs}ms` : ''}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono mb-1.5" style={{ color: T2 }}>{a.role} · {a.webhookUrl}</p>
                <div className="flex flex-wrap gap-1">
                  {a.capabilities.map(c => (
                    <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                      style={{ background: 'rgba(87,155,252,0.1)', color: BLUE }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => ping.mutate(a.id)} disabled={ping.isPending}
                  title="Ping agent" className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                  style={{ color: T2 }}>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleStatus.mutate({ id: a.id, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}
                  disabled={toggleStatus.isPending}
                  title={a.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                  className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                  style={{ color: a.status === 'ACTIVE' ? AMB : GRN }}>
                  {a.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deregister.mutate(a.id)} disabled={deregister.isPending}
                  title="Deregister" className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
                  style={{ color: RED }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manifest spec */}
      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-sm font-bold mb-3" style={{ color: T1 }}>Plugin Manifest Format</p>
        <pre className="text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed" style={{ background: SURF, borderColor: BDR, color: T2, border: `1px solid ${BDR}` }}>{`{
  "name": "Revenue Intelligence Bot",
  "version": "1.0.0",
  "role": "SIGNAL_ANALYST",
  "capabilities": ["SWARM_LOG", "SIGNAL_ANALYSIS"],
  "webhookUrl": "https://my-agent.example.com/kimmp",
  "schema": {
    "input":  { "type": "object", "properties": { "task": { "type": "string" } } },
    "output": { "type": "object", "properties": { "result": { "type": "string" } } }
  }
}

// KIMMP will POST tasks signed with HMAC-SHA256:
// X-KIMMP-Signature: sha256=<hmac>
// X-KIMMP-Agent-ID:  <your-agent-id>
// Body: { event, agentId, task, payload, timestamp }`}</pre>
      </div>
    </div>
  )
}

// ── REST API v1 Endpoints tab ────────────────────────────────────────────────

function EndpointsTab() {
  return (
    <div className="space-y-4">
      {/* v1 Endpoints */}
      <div className="rounded-2xl border" style={{ background: CARD, borderColor: BDR }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: BDR }}>
          <p className="text-sm font-bold" style={{ color: T1 }}>REST API v1</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: T2 }}>
            Base: <code className="font-mono">/api/v1</code> — requires <code className="font-mono">Authorization: Bearer kq_live_…</code>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b text-[10px] uppercase tracking-wider" style={{ borderColor: BDR, color: T2 }}>
                <th className="px-5 py-2.5 text-left font-semibold">Method</th>
                <th className="px-5 py-2.5 text-left font-semibold">Path</th>
                <th className="px-5 py-2.5 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['GET',   '/ois',                  'Latest OIS snapshot'],
                ['POST',  '/ois/snapshot',          'Record a new OIS snapshot'],
                ['GET',   '/signals',               'List KIMMP signals (paginated)'],
                ['POST',  '/signals',               'Ingest a new signal'],
                ['GET',   '/decisions',             'List strategic decisions'],
                ['POST',  '/decisions',             'Create a decision record'],
                ['PATCH', '/decisions/:id/select',  'Mark the chosen option'],
                ['GET',   '/blueprints',            'List enterprise blueprints'],
                ['POST',  '/blueprints',            'Create / import a blueprint'],
              ] as const).map(([method, path, desc]) => (
                <tr key={path} className="border-b" style={{ borderColor: BDR }}>
                  <td className="px-5 py-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: method === 'GET'   ? 'rgba(87,155,252,0.1)'  :
                                    method === 'POST'  ? 'rgba(16,185,129,0.1)'  :
                                    method === 'PATCH' ? 'rgba(245,158,11,0.1)'  : 'rgba(239,68,68,0.1)',
                        color:      method === 'GET'   ? BLUE : method === 'POST' ? GRN : method === 'PATCH' ? AMB : RED,
                      }}>
                      {method}
                    </span>
                  </td>
                  <td className="px-5 py-2.5" style={{ color: T1 }}>/v1{path}</td>
                  <td className="px-5 py-2.5 font-sans" style={{ color: T2 }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl p-5 border" style={{ background: CARD, borderColor: BDR }}>
        <p className="text-sm font-bold mb-3" style={{ color: T1 }}>Quick Start</p>
        <pre className="text-xs font-mono rounded-xl p-4 overflow-x-auto leading-relaxed" style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}>{`# Get latest OIS score
curl -H "Authorization: Bearer kq_live_<YOUR_KEY>" \\
  https://yourdomain.com/api/v1/ois

# Ingest a signal from your CRM
curl -X POST \\
  -H "Authorization: Bearer kq_live_<YOUR_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceModule":"crm","signalType":"deal_won","signalCategory":"INTENT","signalValue":"Q3 enterprise deal closed"}' \\
  https://yourdomain.com/api/v1/signals

# Deploy a blueprint
curl -X POST \\
  -H "Authorization: Bearer kq_live_<YOUR_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Acme Corp","pack":"professional-services","spec":{"departments":[]}}' \\
  https://yourdomain.com/api/v1/blueprints`}</pre>
      </div>
    </div>
  )
}
