import { useQuery } from '@tanstack/react-query'
import {
  Shield, Eye, BookOpen, ArrowUpRight, Lock, FileText,
  Bot, AlertTriangle, CheckCircle, Info, Activity,
} from 'lucide-react'
import { api } from '@lib/api'

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

const VERDICT_STYLE = {
  CRITICAL: { chip: 'bg-rose-500/15 border-rose-500/30 text-rose-300',   dot: 'bg-rose-400' },
  WARN:     { chip: 'bg-amber-500/15 border-amber-500/30 text-amber-300', dot: 'bg-amber-400' },
  PASS:     { chip: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', dot: 'bg-emerald-400' },
  INFO:     { chip: 'bg-blue-500/15 border-blue-500/30 text-blue-300',    dot: 'bg-blue-400' },
  UNKNOWN:  { chip: 'bg-white/5 border-white/10 text-slate-400',          dot: 'bg-slate-600' },
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
  'Policy Engine':                 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
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
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Sovereignty Overview</h2>
        <p className="text-slate-500 text-sm">Every KIMMP action — admin-triggered or autonomous — is permanently recorded here.</p>
      </div>

      {/* Ledger stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Shield}   label="Total Activations"  value={ledger?.totalActivations ?? 0} color="bg-blue-600/60"   />
          <StatCard icon={Eye}      label="Autonomous Actions" value={ledger?.totalAutonomous  ?? 0} color="bg-violet-600/60" />
          <StatCard icon={Lock}     label="Access Blocked"     value={ledger?.totalDenied      ?? 0} color="bg-rose-600/60"   />
          <StatCard icon={BookOpen} label="Knowledge Assets"   value={ledger?.totalAssets      ?? 0} color="bg-emerald-600/60"/>
        </div>
      )}

      {/* Agent Corps Health Summary */}
      {agentSummary && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Agent Corps — 80 Agents</h3>
                <p className="text-xs text-slate-500">Live health status across 10 AEGIS engines</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {healthScore !== null && (
                <div className="text-right">
                  <p className="text-xl font-bold text-white leading-none">{healthScore}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">health score</p>
                </div>
              )}
              <VerdictChip verdict={overallVerdict} />
            </div>
          </div>

          {/* Critical / warn counts */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs text-slate-400">{critical24h} critical (24h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-400">{warn24h} warn (24h)</span>
            </div>
            <div className="ml-auto flex items-center gap-1 text-slate-500">
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
                  className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-2 ${s.chip} cursor-default`}
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
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Sovereignty Engine</h3>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total owned assets</span>
              <span className="text-white font-bold">{sovereignty.totalAssets}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Restricted assets</span>
              <span className="text-rose-400 font-bold">{sovereignty.restrictedAssets}</span>
            </div>
            {sovereignty.byClassification && Object.entries(sovereignty.byClassification as Record<string, number>).map(([cls, cnt]) => (
              <div key={cls} className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{cls}</span>
                <span className="text-slate-300">{cnt}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Policy Engine</h3>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Active policies</span>
              <span className="text-white font-bold">{stats?.policies ?? 6}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              All governance rules are enforced at runtime. ADMIN-only access, scheduler authority, RESTRICTED asset protection, and authenticated egress are active.
            </p>
          </div>
        </div>
      )}

      {/* System breakdown */}
      {ledger?.systemBreakdown && Object.keys(ledger.systemBreakdown).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Activations by System</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ledger.systemBreakdown as Record<string, number>).map(([sys, count]) => (
              <div key={sys} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <span className="text-xs font-mono text-slate-300">{sys}</span>
                <span className="text-xs font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7 Components */}
      {health?.components && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">7 Active Components</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(health.components as string[]).map((name: string) => (
              <div key={name} className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 ${COMPONENT_COLORS[name] ?? 'bg-white/5 border-white/10 text-slate-300'}`}>
                <ArrowUpRight className="w-3 h-3 flex-shrink-0 opacity-60" />
                <span className="text-xs font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status banner */}
      <div className={`border rounded-xl p-5 ${overallVerdict === 'CRITICAL' ? 'bg-rose-900/15 border-rose-500/25' : overallVerdict === 'WARN' ? 'bg-amber-900/15 border-amber-500/25' : 'bg-violet-900/20 border-violet-500/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className={`w-4 h-4 ${overallVerdict === 'CRITICAL' ? 'text-rose-400' : overallVerdict === 'WARN' ? 'text-amber-400' : 'text-violet-400'}`} />
          <span className={`text-sm font-semibold ${overallVerdict === 'CRITICAL' ? 'text-rose-300' : overallVerdict === 'WARN' ? 'text-amber-300' : 'text-violet-300'}`}>
            AEGIS Active — Shield: {overallVerdict} — Master: ADMIN
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Kangqore Autonomous Executive Governance & Intelligence Shield is enforcing ADMIN sovereignty over KIMMP/WAANDA.
          All endpoints shielded. All autonomous actions logged. All intelligence assets stamped with ADMIN ownership and classification.
          All egress monitored. 80-agent corps monitoring 10 governance engines in real time.
        </p>
      </div>
    </div>
  )
}
