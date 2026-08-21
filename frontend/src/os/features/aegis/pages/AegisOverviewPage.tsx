import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Shield, Eye, BookOpen, ArrowUpRight, Lock, FileText,
  Bot, AlertTriangle, CheckCircle, Info, Activity, PowerOff, Power,
} from 'lucide-react'
import { api } from '@lib/api'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string
}) {
  return (
    <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--os-text-1)]">{value}</p>
        <p className="text-xs text-[var(--os-text-2)] mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const VERDICT_STYLE = {
  CRITICAL: { chip: 'bg-rose-500/15 border-rose-500/30 text-rose-300',   dot: 'bg-rose-400' },
  WARN:     { chip: 'bg-amber-500/15 border-amber-500/30 text-amber-300', dot: 'bg-amber-400' },
  PASS:     { chip: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-400' },
  INFO:     { chip: 'bg-blue-500/15 border-blue-500/30 text-blue-300',    dot: 'bg-blue-400' },
  UNKNOWN:  { chip: 'bg-[var(--os-surface-0)] border-[var(--os-border)] text-[var(--os-text-2)]', dot: 'bg-[var(--os-text-2)]' },
}

const ENGINE_LABEL: Record<string, string> = {
  GOVERNANCE_OPS:        'GovernanceOps',
  SOVEREIGNTY:           'Sovereignty',
  AUDIT_LEDGER:          'Audit Ledger',
  AUTONOMY_BOUNDARY:     'Autonomy Bound.',
  ACCESS_SENTINEL:       'Access Sentinel',
  INTELLIGENCE_REGISTRY: 'Intel Registry',
  EGRESS_CONTROL:        'Egress Control',
  POLICY:                'Policy',
  TRUST_COMPLIANCE:      'Trust & Compliance',
  RISK_INTELLIGENCE:     'Risk Intelligence',
}

const COMPONENT_COLORS: Record<string, string> = {
  'Sovereignty Engine':            'bg-violet-500/10 border-violet-500/20 text-violet-300',
  'Executive Audit Ledger':        'bg-blue-500/10 border-blue-500/20 text-blue-300',
  'Autonomy Boundary Monitor':     'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
  'Access Sentinel':               'bg-rose-500/10 border-rose-500/20 text-rose-300',
  'Intelligence Registry':         'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  'Intelligence Egress Control':   'bg-amber-500/10 border-amber-500/20 text-amber-300',
  'Policy Engine':                 'bg-cyan-500/10 border-cyan-500/20 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent',
}

function VerdictChip({ verdict }: { verdict: string }) {
  const s = VERDICT_STYLE[verdict as keyof typeof VERDICT_STYLE] ?? VERDICT_STYLE.UNKNOWN
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${s.chip}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {verdict}
    </span>
  )
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === 'CRITICAL') return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
  if (verdict === 'WARN')     return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
  if (verdict === 'PASS')     return <CheckCircle   className="w-3.5 h-3.5 text-emerald-400" />
  return <Info className="w-3.5 h-3.5 text-blue-400" />
}

export function AegisOverviewPage() {
  const qc = useQueryClient()
  const [toggling, setToggling] = useState(false)

  const { data: config } = useQuery({
    queryKey: ['aegis-config'],
    queryFn:  () => api.get('/admin/aegis/config').then(r => r.data),
    staleTime: 10_000,
  })

  const toggleMutation = useMutation({
    mutationFn: () => api.post('/admin/aegis/config/toggle').then(r => r.data),
    onMutate:   () => setToggling(true),
    onSettled:  () => { setToggling(false); qc.invalidateQueries({ queryKey: ['aegis-config'] }) },
  })

  const aegisOn: boolean = config?.enabled ?? true

  const { data: stats, isLoading } = useQuery({
    queryKey: ['aegis-stats'],
    queryFn:  () => api.get('/admin/aegis/stats').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const { data: health } = useQuery({
    queryKey: ['aegis-health'],
    queryFn:  () => api.get('/admin/aegis/health').then(r => r.data),
    staleTime: 120_000,
  })

  const { data: agentSummary } = useQuery({
    queryKey: ['aegis-agents-summary'],
    queryFn:  () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const ledger      = stats?.ledger
  const sovereignty = stats?.sovereignty

  const overallVerdict: string  = agentSummary?.overallVerdict ?? 'UNKNOWN'
  const healthScore: number | null = agentSummary?.healthScore ?? null
  const critical24h: number     = agentSummary?.critical24h ?? 0
  const warn24h: number         = agentSummary?.warn24h     ?? 0
  const engines: Array<{ engine: string; latest: { verdict: string; raisedAt: string; summary: string } | null }> =
    agentSummary?.engines ?? []

  const shieldStyle = VERDICT_STYLE[overallVerdict as keyof typeof VERDICT_STYLE] ?? VERDICT_STYLE.UNKNOWN

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-1">Sovereignty Overview</h2>
        <p className="text-[var(--os-text-2)] text-sm">Every KIMMP action — admin-triggered or autonomous — is permanently recorded here.</p>
      </div>

      {/* ── AEGIS on/off switch ─────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all duration-300 ${
        aegisOn
          ? 'bg-emerald-500/5 border-emerald-500/20'
          : 'bg-amber-500/8 border-amber-400/30'
      }`}>
        <div className="flex items-center gap-3">
          {aegisOn
            ? <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            : <PowerOff className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          <div>
            <p className={`text-sm font-semibold ${aegisOn ? 'text-emerald-300' : 'text-amber-300'}`}>
              AEGIS is {aegisOn ? 'ACTIVE' : 'BYPASSED'}
            </p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5">
              {aegisOn
                ? 'Access shield and audit logging are fully enforced. All KIMMP routes are protected.'
                : 'Build mode — shield and logging are off. All routes pass through without auth checks or audit entries.'}
              {config?.toggledAt && (
                <span className="ml-2 opacity-60">
                  Last toggled {new Date(config.toggledAt).toLocaleTimeString()} by {config.toggledBy ?? 'system'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Toggle pill */}
        <button
          onClick={() => toggleMutation.mutate()}
          disabled={toggling}
          title={aegisOn ? 'Turn off AEGIS (build mode)' : 'Activate AEGIS'}
          style={{ flexShrink: 0 }}
          className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200 focus:outline-none ${
            toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer'
          } ${aegisOn ? 'bg-emerald-500 border-emerald-400' : 'bg-[var(--os-surface-0)] border-amber-400/40'}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full shadow transition-transform duration-200 ${
            aegisOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-amber-400'
          }`} />
        </button>
      </div>

      {/* Ledger stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Activations',  value: ledger?.totalActivations ?? 0, bg: 'linear-gradient(135deg,#2564ea 0%,#4ab6d4 100%)', glow: '#2564ea' },
            { label: 'Autonomous Actions', value: ledger?.totalAutonomous  ?? 0, bg: 'linear-gradient(135deg,#7c3aed 0%,#9d4edd 100%)', glow: '#7c3aed' },
            { label: 'Access Blocked',     value: ledger?.totalDenied      ?? 0, bg: 'linear-gradient(135deg,#e2445c 0%,#c0392b 100%)', glow: '#e2445c' },
            { label: 'Knowledge Assets',   value: ledger?.totalAssets      ?? 0, bg: 'linear-gradient(135deg,#00c875 0%,#00a86b 100%)', glow: '#00c875' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden" style={{ background: s.bg, boxShadow: `0 4px 20px ${s.glow}40` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.30) 0%, transparent 60%)' }} />
              <p className="relative text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.label}</p>
              <p className="relative text-3xl font-black tracking-tight" style={{ color: '#ffffff' }}>{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Agent Corps Health Summary */}
      {agentSummary && (
        <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-5 space-y-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-violet-600/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--os-text-1)]">Agent Corps — 80 Agents</h3>
                <p className="text-xs text-[var(--os-text-2)]">Live health status across 10 AEGIS engines</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {healthScore !== null && (
                <div className="text-right">
                  <p className="text-xl font-bold text-[var(--os-text-1)] leading-none">{healthScore}</p>
                  <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">health score</p>
                </div>
              )}
              <VerdictChip verdict={overallVerdict} />
            </div>
          </div>

          {/* Critical / warn counts */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs text-[var(--os-text-2)]">{critical24h} critical (24h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-[var(--os-text-2)]">{warn24h} warn (24h)</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[var(--os-text-2)]">
              <Activity className="w-3 h-3" />
              <span className="text-[10px]">Refreshes every 60s</span>
            </div>
          </div>

          {/* Engine status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {engines.map(({ engine, latest }) => {
              const verdict = latest?.verdict ?? 'UNKNOWN'
              const s       = VERDICT_STYLE[verdict as keyof typeof VERDICT_STYLE] ?? VERDICT_STYLE.UNKNOWN
              return (
                <div
                  key={engine}
                  title={latest?.summary ?? 'No run yet'}
                  className={`flex items-center gap-1.5 border rounded-2xl px-2.5 py-2 ${s.chip} cursor-default`}
                >
                  <VerdictIcon verdict={verdict} />
                  <span className="text-[11px] font-medium truncate">{ENGINE_LABEL[engine] ?? engine}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sovereignty breakdown */}
      {sovereignty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <h3 className="text-xs font-semibold text-[var(--os-text-1)] uppercase tracking-widest">Sovereignty Engine</h3>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--os-text-2)]">Total owned assets</span>
              <span className="text-[var(--os-text-1)] font-bold">{sovereignty.totalAssets}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--os-text-2)]">Restricted assets</span>
              <span className="text-rose-400 font-bold">{sovereignty.restrictedAssets}</span>
            </div>
            {sovereignty.byClassification && Object.entries(sovereignty.byClassification as Record<string, number>).map(([cls, cnt]) => (
              <div key={cls} className="flex items-center justify-between text-xs">
                <span className="text-[var(--os-text-2)] font-mono">{cls}</span>
                <span className="text-[var(--os-text-1)]">{cnt}</span>
              </div>
            ))}
          </div>

          <div className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-[#2564ea]" />
              <h3 className="text-xs font-semibold text-[var(--os-text-1)] uppercase tracking-widest">Policy Engine</h3>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--os-text-2)]">Active policies</span>
              <span className="text-[var(--os-text-1)] font-bold">{stats?.policies ?? 6}</span>
            </div>
            <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
              All governance rules are enforced at runtime. ADMIN-only access, scheduler authority, RESTRICTED asset protection, and authenticated egress are active.
            </p>
          </div>
        </div>
      )}

      {/* System breakdown */}
      {ledger?.systemBreakdown && Object.keys(ledger.systemBreakdown).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-3">Activations by System</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ledger.systemBreakdown as Record<string, number>).map(([sys, count]) => (
              <div key={sys} className="flex items-center gap-2 bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl px-3 py-1.5">
                <span className="text-xs font-mono text-[var(--os-text-1)]">{sys}</span>
                <span className="text-xs font-bold text-[var(--os-text-1)]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7 Components */}
      {health?.components && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-3">7 Active Components</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(health.components as string[]).map((name: string) => (
              <div key={name} className={`flex items-center gap-2 border rounded-2xl px-3 py-2.5 ${COMPONENT_COLORS[name] ?? 'bg-[var(--os-surface-0)] border-[var(--os-border)] text-[var(--os-text-2)]'}`}>
                <ArrowUpRight className="w-3 h-3 flex-shrink-0 opacity-60" />
                <span className="text-xs font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status banner */}
      <div className={`border rounded-2xl p-5 ${overallVerdict === 'CRITICAL' ? 'bg-rose-900/15 border-rose-500/25' : overallVerdict === 'WARN' ? 'bg-amber-900/15 border-amber-500/25' : 'bg-violet-900/20 border-violet-500/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className={`w-4 h-4 ${overallVerdict === 'CRITICAL' ? 'text-rose-400' : overallVerdict === 'WARN' ? 'text-amber-400' : 'text-violet-400'}`} />
          <span className={`text-sm font-semibold ${overallVerdict === 'CRITICAL' ? 'text-rose-300' : overallVerdict === 'WARN' ? 'text-amber-300' : 'text-violet-300'}`}>
            AEGIS Active — Shield: {overallVerdict} — Master: ADMIN
          </span>
        </div>
        <p className="text-xs text-[var(--os-text-2)] leading-relaxed">
          Kangqore Autonomous Executive Governance & Intelligence Shield is enforcing ADMIN sovereignty over KIMMP/WAANDA.
          All endpoints shielded. All autonomous actions logged. All intelligence assets stamped with ADMIN ownership and classification.
          All egress monitored. 80-agent corps monitoring 10 governance engines in real time.
        </p>
      </div>
    </div>
  )
}
