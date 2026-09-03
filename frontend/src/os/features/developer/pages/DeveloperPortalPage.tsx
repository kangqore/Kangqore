import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Code2, Plus, ShieldCheck, ShieldAlert, Rocket, FlaskConical, Activity,
  Package, Copy, Check, ChevronRight, AlertTriangle, Terminal, Download,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const PURP = '#7c3aed'
const BLUE = '#579bfc'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'

interface DeveloperApp {
  appId: string
  name: string
  version: string
  category: string
  description: string
  status: string
  clientId: string
  governanceScore: number
  certifiedBadge: boolean
  installCount: number
  publisherName: string
  iconEmoji: string | null
  createdAt: string
}

interface Telemetry {
  totalCalls: number
  allowed: number
  denied: number
  pendingApproval: number
  errors: number
  creditsCharged: number
  avgDurationMs: number
  p95DurationMs: number
}

interface TestRun {
  id: string
  status: string
  totalTests: number
  passedTests: number
  failedTests: number
  durationMs: number | null
  createdAt: string
}

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  DRAFT:     { color: T2,   bg: 'var(--os-surface-1)' },
  IN_REVIEW: { color: AMB,  bg: 'rgba(245,158,11,0.1)' },
  PUBLISHED: { color: GRN,  bg: 'rgba(16,185,129,0.1)' },
  SUSPENDED: { color: RED,  bg: 'rgba(239,68,68,0.1)' },
  REJECTED:  { color: RED,  bg: 'rgba(239,68,68,0.1)' },
}

/** The six layers an installed app inherits automatically. */
const INHERITED_LAYERS = [
  { key: 'identity',      label: 'Identity',      note: 'OAuth client + installation record' },
  { key: 'permissions',   label: 'Permissions',   note: 'Action & object allowlist from manifest' },
  { key: 'governance',    label: 'Governance',    note: 'HANUMANAS policy evaluated per call' },
  { key: 'billing',       label: 'Billing',       note: 'Credit envelope debited per call' },
  { key: 'audit',         label: 'Audit',         note: 'AppAuditEvent row per decision' },
  { key: 'observability', label: 'Observability', note: 'Latency + denial telemetry' },
]

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide"
      style={{ color, background: bg }}
    >
      {children}
    </span>
  )
}

function ScoreRing({ score, certified }: { score: number; certified: boolean }) {
  const color = certified ? GRN : score >= 60 ? AMB : RED
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 shrink-0">
        <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke={BDR} strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 94.2} 94.2`} strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 grid place-items-center text-[10px] font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <div className="leading-tight">
        <div className="text-xs font-medium" style={{ color: T1 }}>Governance</div>
        <div className="text-[10px]" style={{ color: T2 }}>
          {certified ? 'Certified' : `${80 - score > 0 ? 80 - score : 0} to certify`}
        </div>
      </div>
    </div>
  )
}

function CreateAppForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [secret, setSecret] = useState<{ clientId: string; clientSecret: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const create = useMutation({
    mutationFn: () =>
      api.post('/developer/apps', { name, publisherEmail: email, description }).then(r => r.data),
    onSuccess: d => setSecret({ clientId: d.app.clientId, clientSecret: d.app.clientSecret }),
  })

  if (secret) {
    return (
      <div className="rounded-lg p-4 space-y-3" style={{ background: CARD, border: `1px solid ${AMB}` }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} style={{ color: AMB }} />
          <span className="text-sm font-semibold" style={{ color: T1 }}>
            Copy your client secret now
          </span>
        </div>
        <p className="text-xs" style={{ color: T2 }}>
          It is hashed at rest and cannot be shown again. Losing it means rotating credentials.
        </p>
        <div className="space-y-2">
          {(['clientId', 'clientSecret'] as const).map(k => (
            <div key={k}>
              <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: T2 }}>{k}</div>
              <div
                className="flex items-center gap-2 rounded px-2 py-1.5 font-mono text-xs overflow-x-auto"
                style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
              >
                <span className="flex-1 whitespace-nowrap">{secret[k]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(secret.clientSecret)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: PURP, color: '#fff' }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy secret'}
          </button>
          <button
            onClick={onDone}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ border: `1px solid ${BDR}`, color: T1 }}
          >
            I've stored it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
      <div className="text-sm font-semibold" style={{ color: T1 }}>New app</div>
      {[
        { label: 'Name', value: name, set: setName, ph: 'Acme Sync' },
        { label: 'Publisher email', value: email, set: setEmail, ph: 'you@acme.com' },
        { label: 'Description', value: description, set: setDescription, ph: 'What the app does' },
      ].map(f => (
        <div key={f.label}>
          <label className="block text-[10px] uppercase tracking-wide mb-1" style={{ color: T2 }}>
            {f.label}
          </label>
          <input
            value={f.value}
            onChange={e => f.set(e.target.value)}
            placeholder={f.ph}
            className="w-full rounded px-2.5 py-1.5 text-sm outline-none"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
          />
        </div>
      ))}
      {create.isError && (
        <div className="text-xs" style={{ color: RED }}>
          {(create.error as any)?.response?.data?.error ?? 'Could not create app'}
        </div>
      )}
      <button
        disabled={!name || !email || create.isPending}
        onClick={() => create.mutate()}
        className="w-full px-3 py-2 rounded text-xs font-semibold disabled:opacity-40"
        style={{ background: PURP, color: '#fff' }}
      >
        {create.isPending ? 'Creating…' : 'Create app'}
      </button>
    </div>
  )
}

function AppDetail({ app }: { app: DeveloperApp }) {
  const qc = useQueryClient()

  const { data: telemetry } = useQuery<Telemetry>({
    queryKey: ['dev-telemetry', app.appId],
    queryFn: () => api.get(`/developer/apps/${app.appId}/telemetry`).then(r => r.data),
  })

  const { data: runs } = useQuery<{ runs: TestRun[] }>({
    queryKey: ['dev-runs', app.appId],
    queryFn: () => api.get(`/developer/apps/${app.appId}/test-runs`).then(r => r.data),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['dev-apps'] })
    qc.invalidateQueries({ queryKey: ['dev-runs', app.appId] })
  }

  const runTests = useMutation({
    mutationFn: () => api.post(`/developer/apps/${app.appId}/test`, {}).then(r => r.data),
    onSuccess: invalidate,
  })
  const publish = useMutation({
    mutationFn: () => api.post(`/developer/apps/${app.appId}/publish`, {}).then(r => r.data),
    onSuccess: invalidate,
  })
  const deploy = useMutation({
    mutationFn: (environment: string) =>
      api.post(`/developer/apps/${app.appId}/deploy`, { environment }).then(r => r.data),
    onSuccess: invalidate,
  })

  const lastRun = runs?.runs?.[0]
  const deployErr = (deploy.error as any)?.response?.data?.error
  const publishErr = (publish.error as any)?.response?.data?.error

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{app.iconEmoji ?? '🧩'}</span>
              <h2 className="text-base font-semibold truncate" style={{ color: T1 }}>{app.name}</h2>
              <Badge {...(STATUS_CFG[app.status] ?? STATUS_CFG.DRAFT)}>{app.status}</Badge>
              {app.certifiedBadge && (
                <Badge color={GRN} bg="rgba(16,185,129,0.1)">Certified</Badge>
              )}
            </div>
            <div className="text-xs mt-1 font-mono" style={{ color: T2 }}>{app.appId} · v{app.version}</div>
          </div>
          <ScoreRing score={app.governanceScore} certified={app.certifiedBadge} />
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => runTests.mutate()}
            disabled={runTests.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
            style={{ border: `1px solid ${BDR}`, color: T1 }}
          >
            <FlaskConical size={13} /> {runTests.isPending ? 'Running…' : 'Run tests'}
          </button>
          <button
            onClick={() => deploy.mutate('PRODUCTION')}
            disabled={deploy.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-40"
            style={{ border: `1px solid ${BDR}`, color: T1 }}
          >
            <Rocket size={13} /> Deploy to production
          </button>
          {app.status !== 'PUBLISHED' && (
            <button
              onClick={() => publish.mutate()}
              disabled={publish.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-40"
              style={{ background: PURP, color: '#fff' }}
            >
              <Package size={13} /> Publish
            </button>
          )}
        </div>

        {(deployErr || publishErr) && (
          <div
            className="mt-3 rounded px-3 py-2 text-xs flex items-start gap-2"
            style={{ background: 'rgba(239,68,68,0.08)', color: RED }}
          >
            <ShieldAlert size={13} className="mt-0.5 shrink-0" />
            <span>{deployErr ?? publishErr}</span>
          </div>
        )}
      </div>

      {/* Inherited governance — what the app gets without writing security code */}
      <div className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={14} style={{ color: GRN }} />
          <span className="text-sm font-semibold" style={{ color: T1 }}>Inherited automatically</span>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
          {INHERITED_LAYERS.map(l => (
            <div key={l.key} className="rounded px-2.5 py-2" style={{ background: SURF, border: `1px solid ${BDR}` }}>
              <div className="flex items-center gap-1.5">
                <Check size={11} style={{ color: GRN }} />
                <span className="text-xs font-medium" style={{ color: T1 }}>{l.label}</span>
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: T2 }}>{l.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {/* Telemetry */}
        <div className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} style={{ color: BLUE }} />
            <span className="text-sm font-semibold" style={{ color: T1 }}>Last 24 hours</span>
          </div>
          {telemetry ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Calls',   value: telemetry.totalCalls, color: T1 },
                { label: 'Allowed', value: telemetry.allowed,    color: GRN },
                { label: 'Denied',  value: telemetry.denied,     color: RED },
                { label: 'Errors',  value: telemetry.errors,     color: AMB },
                { label: 'Avg',     value: `${telemetry.avgDurationMs}ms`, color: T1 },
                { label: 'p95',     value: `${telemetry.p95DurationMs}ms`, color: T1 },
              ].map(m => (
                <div key={m.label}>
                  <div className="text-lg font-semibold tabular-nums" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-[10px] uppercase tracking-wide" style={{ color: T2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs" style={{ color: T2 }}>No calls recorded yet.</div>
          )}
        </div>

        {/* Test runs */}
        <div className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={14} style={{ color: PURP }} />
            <span className="text-sm font-semibold" style={{ color: T1 }}>Test runs</span>
          </div>
          {lastRun ? (
            <div className="space-y-2">
              {runs!.runs.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: T2 }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: r.status === 'PASSED' ? GRN : RED }}
                    />
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                  <span className="tabular-nums" style={{ color: r.status === 'PASSED' ? GRN : RED }}>
                    {r.passedTests}/{r.totalTests}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs" style={{ color: T2 }}>
              No runs yet. Production deploys are blocked until a suite passes.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuickStart() {
  return (
    <div className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
      <div className="flex items-center gap-2 mb-3">
        <Terminal size={14} style={{ color: PURP }} />
        <span className="text-sm font-semibold" style={{ color: T1 }}>Build an app in a day</span>
      </div>
      <pre
        className="rounded p-3 text-[11px] leading-relaxed overflow-x-auto font-mono"
        style={{ background: SURF, border: `1px solid ${BDR}`, color: T1 }}
      >{`npm install -g @kangqore/cli

kangqore init my-app     # scaffold manifest + entrypoint
kangqore validate        # schema check + governance score
kangqore test            # run against the governance kernel
kangqore deploy SANDBOX
kangqore publish         # list on the marketplace`}</pre>
      <div className="flex gap-2 mt-3 flex-wrap">
        {[
          { label: 'TypeScript SDK', pkg: 'npm i @kangqore/view-sdk' },
          { label: 'Python SDK', pkg: 'pip install kangqore-view-sdk' },
        ].map(s => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-mono"
            style={{ background: SURF, border: `1px solid ${BDR}`, color: T2 }}
          >
            <Download size={10} /> {s.pkg}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DeveloperPortalPage() {
  const [creating, setCreating] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const { data, isLoading } = useQuery<{ apps: DeveloperApp[] }>({
    queryKey: ['dev-apps'],
    queryFn: () => api.get('/developer/apps').then(r => r.data),
  })

  const apps = data?.apps ?? []
  const current = apps.find(a => a.appId === selected) ?? null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: T1 }}>
            <Code2 size={18} style={{ color: PURP }} />
            Developer Platform
          </h1>
          <p className="text-xs mt-0.5" style={{ color: T2 }}>
            Apps inherit identity, permissions, governance, billing, audit, and observability — you write none of it.
          </p>
        </div>
        <button
          onClick={() => { setCreating(v => !v); setSelected(null) }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold"
          style={{ background: PURP, color: '#fff' }}
        >
          <Plus size={13} /> New app
        </button>
      </div>

      {creating && <CreateAppForm onDone={() => setCreating(false)} />}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(220px, 300px) 1fr' }}>
        <div className="space-y-2">
          {isLoading && <div className="text-xs" style={{ color: T2 }}>Loading…</div>}
          {!isLoading && apps.length === 0 && (
            <div
              className="rounded-lg p-4 text-xs"
              style={{ background: CARD, border: `1px dashed ${BDR}`, color: T2 }}
            >
              No apps yet. Create one, or scaffold with <span className="font-mono">kangqore init</span>.
            </div>
          )}
          {apps.map(a => {
            const cfg = STATUS_CFG[a.status] ?? STATUS_CFG.DRAFT
            return (
              <button
                key={a.appId}
                onClick={() => { setSelected(a.appId); setCreating(false) }}
                className="w-full text-left rounded-lg p-3 transition-colors"
                style={{
                  background: CARD,
                  border: `1px solid ${a.appId === selected ? PURP : BDR}`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: T1 }}>
                    {a.iconEmoji ?? '🧩'} {a.name}
                  </span>
                  <ChevronRight size={13} style={{ color: T2 }} />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Badge {...cfg}>{a.status}</Badge>
                  {a.certifiedBadge && <Badge color={GRN} bg="rgba(16,185,129,0.1)">Certified</Badge>}
                </div>
              </button>
            )
          })}
        </div>

        <div>{current ? <AppDetail app={current} /> : <QuickStart />}</div>
      </div>
    </div>
  )
}
