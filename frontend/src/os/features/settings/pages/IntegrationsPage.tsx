import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { apiFetch } from '@lib/api'
import {
  CheckCircle2, XCircle, Loader2, Plug, Wifi, WifiOff,
  Clock, AlertTriangle, Trash2, ChevronDown, ChevronUp, Zap,
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthField { key: string; label: string; secret: boolean; placeholder?: string }
interface EntityTypeHint { externalType: string; suggestedOntologyType: string; description: string }
interface Manifest  {
  platform:     string
  displayName:  string
  icon:         string
  category?:    string
  description?: string
  version?:     string
  authFields:   AuthField[]
  capabilities: string[]
  entityTypes?: EntityTypeHint[]
}
interface HealthStatus {
  connected:    boolean
  lastSuccess:  string | null
  lastFailure:  string | null
  latencyMs:    number | null
  rateLimitHit: boolean
  errorCount:   number
  successCount: number
}
interface Integration {
  platform:   string
  enabled:    boolean
  lastUsedAt: string | null
  health:     HealthStatus
  manifest:   Manifest
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(dt: string | null): string {
  if (!dt) return 'Never'
  const d = new Date(dt)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function HealthPill({ health, connected }: { health: HealthStatus; connected: boolean }) {
  if (!connected) return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--os-text-2)]">
      <WifiOff className="w-3 h-3" /> Not connected
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400">
      <Wifi className="w-3 h-3" /> Connected
      {health.latencyMs !== null && <span className="text-[var(--os-text-2)] font-normal">· {health.latencyMs}ms</span>}
    </span>
  )
}

// ── Config form ───────────────────────────────────────────────────────────────
function ConfigForm({ manifest, onSave, onCancel, saving }: {
  manifest:  Manifest
  onSave:    (config: Record<string, string>) => void
  onCancel:  () => void
  saving:    boolean
}) {
  const [fields, setFields] = useState<Record<string, string>>(() =>
    Object.fromEntries(manifest.authFields.map(f => [f.key, '']))
  )

  return (
    <div className="space-y-3 mt-3">
      {manifest.authFields.map(f => (
        <div key={f.key}>
          <label className="block text-[11px] text-[var(--os-text-2)] mb-1">{f.label}</label>
          <input
            type={f.secret ? 'password' : 'text'}
            placeholder={f.placeholder}
            value={fields[f.key] ?? ''}
            onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
            className="w-full px-3 py-2 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] text-sm text-[var(--os-text-1)] outline-none focus:border-[#579bfc]"
          />
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(fields)}
          disabled={saving || manifest.authFields.some(f => !fields[f.key]?.trim())}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#579bfc] text-white text-sm font-semibold hover:bg-[#4a8ef5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</> : 'Save & Test'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-2xl border border-[var(--os-border)] text-sm text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Integration card ──────────────────────────────────────────────────────────
function IntegrationCard({ integration, manifest }: { integration?: Integration; manifest: Manifest }) {
  const qc = useQueryClient()
  const [expanded,   setExpanded]   = useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  const health     = integration?.health
  const configured = !!integration

  const save = useMutation({
    mutationFn: async (config: Record<string, string>) => {
      await apiFetch(`/admin/integrations/${manifest.platform}`, {
        method: 'PUT',
        body: JSON.stringify({ config }),
      })
      const test = await apiFetch<{ ok: boolean; message: string }>(
        `/admin/integrations/${manifest.platform}/test`, { method: 'POST' }
      )
      return test
    },
    onSuccess: (data) => {
      setTestResult(data)
      setShowForm(false)
      qc.invalidateQueries({ queryKey: ['integrations'] })
    },
  })

  const testNow = useMutation({
    mutationFn: () => apiFetch<{ ok: boolean; message: string }>(
      `/admin/integrations/${manifest.platform}/test`, { method: 'POST' }
    ),
    onSuccess: (data) => {
      setTestResult(data)
      qc.invalidateQueries({ queryKey: ['integrations'] })
    },
  })

  const remove = useMutation({
    mutationFn: () => apiFetch(`/admin/integrations/${manifest.platform}`, { method: 'DELETE' }),
    onSuccess: () => {
      setTestResult(null)
      setShowForm(false)
      qc.invalidateQueries({ queryKey: ['integrations'] })
    },
  })

  const isConnected = health?.connected ?? false

  return (
    <div className={cn(
      'rounded-2xl border transition-all',
      isConnected
        ? 'border-green-500/20 bg-green-500/[0.03]'
        : configured
          ? 'border-amber-500/20 bg-amber-500/[0.02]'
          : 'border-[var(--os-border)] bg-[var(--os-card)]'
    )}>
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] flex-shrink-0">
          {manifest.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[var(--os-text-1)]">{manifest.displayName}</p>
            {manifest.category && (
              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">
                {manifest.category.replace(/_/g, ' ')}
              </span>
            )}
            {isConnected ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : configured ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : null}
          </div>
          {configured
            ? <HealthPill health={health!} connected={isConnected} />
            : <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 line-clamp-1">{manifest.description ?? 'Not configured'}</p>}
        </div>

        {/* Health stats */}
        {configured && health && (
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--os-text-2)]">
            <div className="text-center">
              <p className="font-semibold text-green-400">{health.successCount}</p>
              <p>Calls</p>
            </div>
            <div className="text-center">
              <p className={cn('font-semibold', health.errorCount > 0 ? 'text-red-400' : 'text-[var(--os-text-2)]')}>{health.errorCount}</p>
              <p>Errors</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--os-text-1)]">{fmt(integration?.lastUsedAt ?? null)}</p>
              <p>Last used</p>
            </div>
            {health.rateLimitHit && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">RATE LIMITED</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {configured && (
            <button
              onClick={() => testNow.mutate()}
              disabled={testNow.isPending}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl border border-[var(--os-border)] text-[11px] font-medium text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-50"
            >
              {testNow.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              Test
            </button>
          )}
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl border border-[var(--os-border)] text-[11px] font-medium text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
          >
            <Plug className="w-3 h-3" />
            {configured ? 'Reconfigure' : 'Connect'}
          </button>
          <button
            onClick={() => setExpanded(s => !s)}
            className="p-1.5 rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Test result */}
      {testResult && (
        <div className={cn(
          'mx-5 mb-3 px-3 py-2 rounded-2xl text-[11px] flex items-center gap-2',
          testResult.ok ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        )}>
          {testResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
          {testResult.message}
        </div>
      )}

      {/* Config form */}
      {showForm && (
        <div className="px-5 pb-4">
          <ConfigForm
            manifest={manifest}
            onSave={(cfg) => save.mutate(cfg)}
            onCancel={() => setShowForm(false)}
            saving={save.isPending}
          />
          {save.isError && (
            <p className="text-[11px] text-red-400 mt-2">{(save.error as Error).message}</p>
          )}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[var(--os-border)] px-5 py-4 space-y-4">
          {/* Capabilities */}
          <div>
            <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">Capabilities ({manifest.capabilities.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {manifest.capabilities.map(c => (
                <span key={c} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--os-surface-0)] border border-[var(--os-border)] text-[var(--os-text-2)]">
                  {c}
                </span>
              ))}
            </div>
          </div>
          {/* Entity types for semantic mapping */}
          {manifest.entityTypes && manifest.entityTypes.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">Semantic Entity Types</p>
              <div className="space-y-1.5">
                {manifest.entityTypes.map(e => (
                  <div key={e.externalType} className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-[#579bfc] w-24 flex-shrink-0">{e.externalType}</span>
                    <span className="text-[var(--os-text-2)]">→</span>
                    <span className="font-semibold text-[var(--os-text-1)]">{e.suggestedOntologyType}</span>
                    <span className="text-[var(--os-text-2)]">— {e.description}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--os-text-2)] mt-2">Configure in Settings → Semantic Mapping to activate WAANDA entity resolution.</p>
            </div>
          )}

          {/* Health detail */}
          {health && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--os-text-2)] uppercase tracking-wide mb-2">Health</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Last Success', value: fmt(health.lastSuccess), color: 'text-green-400' },
                  { label: 'Last Failure', value: fmt(health.lastFailure), color: 'text-red-400' },
                  { label: 'Latency',      value: health.latencyMs !== null ? `${health.latencyMs}ms` : '—', color: 'text-[var(--os-text-1)]' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)] px-3 py-2">
                    <p className={cn('text-sm font-semibold tabular-nums', color)}>{value}</p>
                    <p className="text-[10px] text-[var(--os-text-2)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger zone */}
          {configured && (
            <div className="pt-2 border-t border-[var(--os-border)]">
              <button
                onClick={() => { if (confirm(`Remove ${manifest.displayName} integration?`)) remove.mutate() }}
                disabled={remove.isPending}
                className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                {remove.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                Remove integration
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'COMMUNICATION', 'PROJECT_MANAGEMENT', 'CRM', 'VERSION_CONTROL', 'HELPDESK']
const CAT_LABEL: Record<string, string> = {
  All: 'All', COMMUNICATION: 'Comms', PROJECT_MANAGEMENT: 'Projects',
  CRM: 'CRM', VERSION_CONTROL: 'Git', HELPDESK: 'Helpdesk',
}

export function IntegrationsPage() {
  const [categoryFilter, setCategoryFilter] = useState('All')
  const { data: manifestsData } = useQuery<{ manifests: Manifest[]; total: number }>({
    queryKey: ['integration-manifests'],
    queryFn:  () => api.get('/admin/integrations/manifests').then(r => r.data),
    staleTime: Infinity,
  })

  const { data: intData, isLoading } = useQuery<{ integrations: Integration[] }>({
    queryKey: ['integrations'],
    queryFn:  () => api.get('/admin/integrations').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const { data: capsData } = useQuery<{ capabilities: Array<{ capability: string; platforms: string[] }> }>({
    queryKey: ['integration-capabilities'],
    queryFn:  () => api.get('/admin/integrations/capabilities').then(r => r.data),
    staleTime: Infinity,
  })

  const allManifests = manifestsData?.manifests ?? []
  const manifests    = categoryFilter === 'All' ? allManifests : allManifests.filter(m => m.category === categoryFilter)
  const integrations = intData?.integrations ?? []
  const capabilities = capsData?.capabilities ?? []

  const connectedCount = integrations.filter(i => i.health.connected).length
  const totalCaps      = capabilities.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-[var(--os-text-1)]">Integrations</h2>
        <p className="text-[12px] text-[var(--os-text-2)] mt-0.5">
          Connect external platforms. KIMMP will use these to take actions across your stack.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected',    value: connectedCount,      bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          { label: 'Connectors',   value: allManifests.length, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
          { label: 'Capabilities', value: totalCaps,           bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
        ].map(t => (
          <div key={t.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: t.bg, boxShadow: `0 4px 20px ${t.glow}40` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
            <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.label}</p>
            <p className="relative text-3xl font-black tabular-nums" style={{ color: '#ffffff' }}>{t.value}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              'text-[11px] font-medium px-3 py-1.5 rounded-2xl border transition-all',
              categoryFilter === cat
                ? 'bg-[#579bfc] border-[#579bfc] text-white'
                : 'border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            {CAT_LABEL[cat] ?? cat}
            <span className="ml-1 opacity-60">
              {cat === 'All' ? allManifests.length : allManifests.filter(m => m.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Integration cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {manifests.map(m => (
            <IntegrationCard
              key={m.platform}
              manifest={m}
              integration={integrations.find(i => i.platform === m.platform)}
            />
          ))}
        </div>
      )}

      {/* Capability registry */}
      {capabilities.length > 0 && (
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#579bfc]" />
            <p className="text-sm font-semibold text-[var(--os-text-1)]">Capability Registry</p>
            <span className="text-[11px] text-[var(--os-text-2)] ml-auto">KIMMP uses this to route actions</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {capabilities.map(({ capability, platforms }) => (
              <div key={capability} className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <span className="text-[11px] font-medium text-[var(--os-text-1)] flex-1">{capability}</span>
                <div className="flex gap-1">
                  {platforms.map(p => {
                    const m = manifests.find(m => m.platform === p)
                    return (
                      <span key={p} className="text-[11px]" title={m?.displayName ?? p}>{m?.icon ?? p}</span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
