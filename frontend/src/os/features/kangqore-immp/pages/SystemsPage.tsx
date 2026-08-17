import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MessageSquare, Zap, Globe,
  CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Brain, Activity, Database, Wifi, WifiOff,
  TrendingUp, Play, ChevronDown, ChevronRight,
} from 'lucide-react'
import { api } from '@lib/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'ok' | 'degraded' | 'offline' | 'unknown' }) {
  const MAP = {
    ok:       { icon: CheckCircle2, label: 'Healthy',  color: '#059669', bg: '#059669' },
    degraded: { icon: AlertTriangle, label: 'Degraded', color: '#d97706', bg: '#d97706' },
    offline:  { icon: XCircle,       label: 'Offline',  color: '#ef4444', bg: '#ef4444' },
    unknown:  { icon: Activity,      label: 'Unknown',  color: '#64748b', bg: '#64748b' },
  }
  const cfg = MAP[status] ?? MAP.unknown
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ color: cfg.color, background: `${cfg.bg}18`, border: `1px solid ${cfg.bg}30` }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

// ─── Metric tile ──────────────────────────────────────────────────────────────

function Metric({ label, value, sub, color = '#2564ea' }: {
  label: string; value: string | number | null; sub?: string; color?: string
}) {
  return (
    <div className="rounded-2xl px-3 py-2.5" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: `${color}80` }}>{label}</p>
      {value == null
        ? <p className="text-base font-bold" style={{ color: '#64748b' }}>—</p>
        : <p className="text-base font-bold text-white">{value}</p>
      }
      {sub && <p className="text-[9px] mt-0.5" style={{ color: '#64748b' }}>{sub}</p>}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(43,189,255,0.4)' }}>
      {label}
    </p>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 1. eQORE AI CONCIERGE ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const EQORE_AGENTS = [
  { name: 'ConciergeAgent',      role: 'Main conversation handler',         model: 'haiku-4-5' },
  { name: 'ShadowLeadAgent',     role: 'Silently profiles leads',           model: 'haiku-3' },
  { name: 'AssuranceAgent',      role: 'Quality & confidence check',        model: 'sonnet-4-6' },
  { name: 'ServiceMatcherAgent', role: 'Maps intent → Kangqore service',    model: 'haiku-4-5' },
  { name: 'SchedulingAgent',     role: 'Detects & handles booking intent',  model: 'haiku-4-5' },
  { name: 'NurtureAgent',        role: 'Async follow-up sequences (queue)', model: 'haiku-4-5' },
]

function EqorePanel() {
  const [agentsOpen, setAgentsOpen] = useState(false)
  const qc = useQueryClient()

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['eqore-health'],
    queryFn: () => api.get('/eqore/health').then(r => r.data).catch(() => null),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
  const { data: graphStats, isLoading: graphLoading } = useQuery({
    queryKey: ['eqore-graph-stats'],
    queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: leads } = useQuery({
    queryKey: ['eqore-leads-summary'],
    queryFn: () => api.get('/admin/eqore/leads?limit=1').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })

  const syncMutation = useMutation({
    mutationFn: () => api.post('/admin/eqore/graph/sync'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }),
  })

  const status: 'ok' | 'degraded' | 'offline' | 'unknown' =
    healthLoading ? 'unknown'
    : health?.status === 'OK' ? 'ok'
    : health?.status === 'DEGRADED' ? 'degraded'
    : health ? 'offline'
    : 'unknown'

  return (
    <SystemCard
      icon={MessageSquare}
      title="eQORE"
      subtitle="AI Concierge · Inbound lead engine"
      accent="#7c3aed"
      status={status}
      onRefresh={() => { refetchHealth(); qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }) }}
    >
      {/* Health details */}
      {health && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Metric label="Database"  value={health.db ?? '—'}    color="#059669" />
          <Metric label="Redis"     value={health.redis ?? '—'} color="#0ea5e9" />
          <Metric label="Provider"  value={health.modelProvider ?? '—'} color="#7c3aed" />
        </div>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Metric label="Graph Nodes"  value={graphLoading ? null : (graphStats?.totalNodes ?? '—')}    color="#7c3aed" sub="entities tracked" />
        <Metric label="Graph Edges"  value={graphLoading ? null : (graphStats?.totalEdges ?? '—')}    color="#7c3aed" sub="relationships" />
        <Metric label="Leads in DB"  value={leads?.total ?? leads?.count ?? '—'}                      color="#2564ea" sub="captured via eQORE" />
        <Metric label="Model"        value={health?.modelName ?? process.env.EQORE_ROUTER_MODEL ?? 'haiku-4-5'} color="#64748b" sub="router model" />
      </div>

      {/* Agent list toggle */}
      <button
        onClick={() => setAgentsOpen(o => !o)}
        className="flex items-center gap-2 w-full mb-2"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <SectionLabel label={`Agents (${EQORE_AGENTS.length})`} />
        {agentsOpen ? <ChevronDown className="w-3 h-3 mb-1" style={{ color: 'rgba(43,189,255,0.4)' }} /> : <ChevronRight className="w-3 h-3 mb-1" style={{ color: 'rgba(43,189,255,0.4)' }} />}
      </button>
      {agentsOpen && (
        <div className="space-y-1.5 mb-4">
          {EQORE_AGENTS.map(a => (
            <div key={a.name} className="flex items-start gap-2 px-3 py-2 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <Brain className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#7c3aed' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">{a.name}</p>
                <p className="text-[10px]" style={{ color: '#94a3b8' }}>{a.role}</p>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.12)' }}>{a.model}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <ActionButton icon={RefreshCw} label="Sync Graph" loading={syncMutation.isPending} onClick={() => syncMutation.mutate()} color="#7c3aed" />
        <ActionButton icon={Activity}  label="Health Check" loading={healthLoading} onClick={() => refetchHealth()} color="#059669" />
      </div>
    </SystemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 2. eQORE LEAD INTELLIGENCE ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function LeadIntelPanel() {
  const qc = useQueryClient()

  const { data: graphStats, isLoading, refetch } = useQuery({
    queryKey: ['eqore-graph-stats'],
    queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: opps } = useQuery({
    queryKey: ['eqore-opps'],
    queryFn: () => api.get('/admin/eqore/sales/opportunities').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: tasks } = useQuery({
    queryKey: ['eqore-tasks'],
    queryFn: () => api.get('/admin/eqore/sales/tasks').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })

  const enrichMutation = useMutation({
    mutationFn: () => api.post('/admin/eqore/graph/sync'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }),
  })

  const status: 'ok' | 'degraded' | 'offline' | 'unknown' =
    isLoading ? 'unknown' : graphStats ? 'ok' : 'degraded'

  const oppList: any[] = opps?.opportunities ?? []
  const taskList: any[] = tasks?.tasks ?? []

  return (
    <SystemCard
      icon={Zap}
      title="Lead Intelligence"
      subtitle="Scoring · Graph · Pipeline · Taxonomy"
      accent="#2564ea"
      status={status}
      onRefresh={() => { refetch(); qc.invalidateQueries({ queryKey: ['eqore-opps', 'eqore-tasks'] }) }}
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Metric label="Graph Nodes"   value={isLoading ? null : (graphStats?.totalNodes ?? '—')}    color="#2564ea" sub="entities" />
        <Metric label="Graph Edges"   value={isLoading ? null : (graphStats?.totalEdges ?? '—')}    color="#2564ea" sub="relationships" />
        <Metric label="Opportunities" value={oppList.length || '—'}                                 color="#0ea5e9" sub="in pipeline" />
        <Metric label="Open Tasks"    value={taskList.filter((t: any) => t.status !== 'DONE').length || '—'} color="#d97706" sub="pending" />
      </div>

      {/* Scoring engines */}
      <SectionLabel label="Scoring Engines" />
      <div className="space-y-1.5 mb-4">
        {[
          { name: 'Lead Scoring',      desc: 'Multi-factor score (0-100)', status: 'active' },
          { name: 'Classification',    desc: 'ICP match + segment tagging', status: 'active' },
          { name: 'Value Projection',  desc: 'LTV + deal size estimate',   status: 'active' },
          { name: 'Next Best Question', desc: 'Taxonomy-driven follow-up', status: 'active' },
          { name: 'Service Matcher',   desc: 'Intent → Kangqore service',  status: 'active' },
        ].map(e => (
          <div key={e.name} className="flex items-center gap-2 px-3 py-1.5 rounded-2xl" style={{ background: 'rgba(37,100,234,0.06)', border: '1px solid rgba(37,100,234,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#059669' }} />
            <p className="text-xs font-semibold text-white flex-1">{e.name}</p>
            <p className="text-[10px]" style={{ color: '#94a3b8' }}>{e.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <ActionButton icon={RefreshCw} label="Sync Graph" loading={enrichMutation.isPending} onClick={() => enrichMutation.mutate()} color="#2564ea" />
      </div>
    </SystemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 3. ALIS ──────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function AlisPanel() {
  const qc = useQueryClient()

  const { data: overview, isLoading, refetch } = useQuery({
    queryKey: ['alis-overview'],
    queryFn: () => api.get('/admin/alis/overview').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: alerts } = useQuery({
    queryKey: ['alis-alerts'],
    queryFn: () => api.get('/admin/alis/alerts').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: gaps } = useQuery({
    queryKey: ['alis-gaps'],
    queryFn: () => api.get('/admin/alis/content-gaps').then(r => r.data).catch(() => null),
    staleTime: 120_000,
  })
  const { data: recs } = useQuery({
    queryKey: ['alis-recs'],
    queryFn: () => api.get('/admin/alis/growth-recs').then(r => r.data).catch(() => null),
    staleTime: 120_000,
  })

  const emitMutation = useMutation({
    mutationFn: () => api.post('/admin/alis/signals/emit'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alis-overview', 'alis-alerts'] }),
  })

  const alertList: any[] = alerts?.alerts ?? []
  const gapList: any[]   = gaps?.gaps    ?? []
  const recList: any[]   = recs?.recommendations ?? recs?.recs ?? []

  const status: 'ok' | 'degraded' | 'offline' | 'unknown' =
    isLoading ? 'unknown' : overview ? 'ok' : 'degraded'

  return (
    <SystemCard
      icon={TrendingUp}
      title="ALIS"
      subtitle="Market Intelligence · Demand · Content"
      accent="#059669"
      status={status}
      onRefresh={() => { refetch(); qc.invalidateQueries({ queryKey: ['alis-alerts', 'alis-gaps', 'alis-recs'] }) }}
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Metric label="Alerts"      value={alertList.length || 0}   color="#d97706" sub="active signals" />
        <Metric label="Content Gaps" value={gapList.length || 0}    color="#ef4444" sub="identified" />
        <Metric label="Growth Recs" value={recList.length || 0}     color="#059669" sub="actionable" />
        <Metric label="Services"    value={overview?.serviceCount ?? overview?.services?.length ?? '—'} color="#0ea5e9" sub="tracked" />
      </div>

      {/* ALIS engines */}
      <SectionLabel label="Intelligence Engines" />
      <div className="space-y-1.5 mb-4">
        {[
          { name: 'Demand Trend Analyser',  desc: 'Market demand patterns' },
          { name: 'Content Gap Detector',   desc: 'Missing content opportunities' },
          { name: 'Demand Responder',       desc: 'Automated demand responses' },
          { name: 'Executive Alert',        desc: 'Escalation + CXO briefings' },
          { name: 'Revenue Forecaster',     desc: 'Pipeline revenue projection' },
          { name: 'VIS Sync',               desc: 'Feeds signals to kangqore-vis' },
        ].map(e => (
          <div key={e.name} className="flex items-center gap-2 px-3 py-1.5 rounded-2xl" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#059669' }} />
            <p className="text-xs font-semibold text-white flex-1">{e.name}</p>
            <p className="text-[10px]" style={{ color: '#94a3b8' }}>{e.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent alerts */}
      {alertList.length > 0 && (
        <>
          <SectionLabel label="Recent Alerts" />
          <div className="space-y-1 mb-4">
            {alertList.slice(0, 3).map((a: any, i: number) => (
              <div key={i} className="flex gap-2 items-start py-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-400" />
                <p className="text-[11px] text-slate-300 line-clamp-1">{a.message ?? a.title ?? JSON.stringify(a)}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex gap-2">
        <ActionButton icon={Play}       label="Emit Signals" loading={emitMutation.isPending} onClick={() => emitMutation.mutate()} color="#059669" />
        <ActionButton icon={RefreshCw}  label="Refresh"     loading={isLoading}              onClick={() => refetch()}             color="#64748b" />
      </div>
    </SystemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 4. KANGQORE VIS ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function VisPanel() {
  const qc = useQueryClient()

  const { data: kpiData, isLoading, refetch } = useQuery({
    queryKey: ['vis-kpi-overview'],
    queryFn: () => api.get('/admin/kangqore-vis/kpi/overview').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: govMode } = useQuery({
    queryKey: ['vis-gov-mode'],
    queryFn: () => api.get('/admin/kangqore-vis/governance/mode').then(r => r.data).catch(() => null),
    staleTime: 120_000,
  })

  const snapshotMutation = useMutation({
    mutationFn: () => api.post('/admin/kangqore-vis/kpi/snapshot'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vis-kpi-overview'] }),
  })

  const kpis: any[]        = kpiData?.kpis       ?? []
  const connected: any[]   = kpiData?.connected  ?? []
  const unconnected: any[] = kpiData?.unconnected ?? []

  const status: 'ok' | 'degraded' | 'offline' | 'unknown' =
    isLoading ? 'unknown' : kpiData ? 'ok' : 'degraded'

  const liveKpis = kpis.filter((k: any) => k.status === 'live')

  return (
    <SystemCard
      icon={Globe}
      title="Kangqore VIS"
      subtitle="Visibility · SEO · AI-Answerability"
      accent="#0ea5e9"
      status={status}
      onRefresh={() => { refetch(); qc.invalidateQueries({ queryKey: ['vis-gov-mode'] }) }}
    >
      {/* Live KPI grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {liveKpis.slice(0, 6).map((k: any) => (
          <Metric key={k.metric} label={k.label} value={k.value ?? '—'} color="#0ea5e9" />
        ))}
        {liveKpis.length === 0 && !isLoading && (
          <>
            <Metric label="Status" value="Loading…" color="#64748b" />
            <Metric label="Mode"   value={govMode?.mode ?? '—'} color="#0ea5e9" />
          </>
        )}
      </div>

      {/* Data sources */}
      <SectionLabel label={`Data Sources (${connected.length} connected · ${unconnected.length} not)`} />
      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {connected.map((s: string) => (
          <div key={s} className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)' }}>
            <Wifi className="w-3 h-3" style={{ color: '#059669' }} />
            <span className="text-[10px] text-slate-300 truncate">{s}</span>
          </div>
        ))}
        {unconnected.map((s: string) => (
          <div key={s} className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(100,116,139,0.06)', border: '1px solid rgba(100,116,139,0.12)' }}>
            <WifiOff className="w-3 h-3" style={{ color: '#475569' }} />
            <span className="text-[10px] truncate" style={{ color: '#475569' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* VIS modules */}
      <SectionLabel label="Active Modules" />
      <div className="flex flex-wrap gap-1.5 mb-4">
        {['Technical SEO', 'Content Mapping', 'Info Architecture', 'On-Page SEO',
          'Internal Linking', 'Structured Data', 'Entity Architecture', 'E-E-A-T',
          'Authority', 'AI Answerability', 'SXO', 'Governance', 'Performance', 'KPI'].map(m => (
          <span key={m} className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.15)' }}>
            {m}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <ActionButton icon={Database}   label="Snapshot KPIs"  loading={snapshotMutation.isPending} onClick={() => snapshotMutation.mutate()}  color="#0ea5e9" />
        <ActionButton icon={RefreshCw}  label="Refresh"        loading={isLoading}                  onClick={() => refetch()}                   color="#64748b" />
      </div>
    </SystemCard>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Shared card shell ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function ActionButton({ icon: Icon, label, loading, onClick, color }: {
  icon: any; label: string; loading?: boolean; onClick: () => void; color: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-semibold transition-opacity disabled:opacity-50"
      style={{ color, background: `${color}14`, border: `1px solid ${color}30` }}
    >
      <Icon className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
      {label}
    </button>
  )
}

function SystemCard({
  icon: Icon, title, subtitle, accent, status, onRefresh, children,
}: {
  icon: any; title: string; subtitle: string; accent: string;
  status: 'ok' | 'degraded' | 'offline' | 'unknown';
  onRefresh: () => void; children: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{
        background: 'linear-gradient(160deg, #0d1117 0%, #0a0f1e 100%)',
        border: `1px solid ${accent}25`,
        boxShadow: `0 4px 24px ${accent}0a`,
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: accent }}
          >
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={status} />
          <button
            onClick={onRefresh}
            className="w-6 h-6 flex items-center justify-center rounded-2xl transition-colors"
            style={{ color: '#475569' }}
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-4" style={{ background: `${accent}15` }} />

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Page ─────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export function SystemsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5" style={{ color: '#2bbdff' }} />
          Systems Monitor
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
          Live health, metrics, and controls for all Kangqore sub-systems
        </p>
      </div>

      {/* System grid — 2 columns on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <EqorePanel />
        <LeadIntelPanel />
        <AlisPanel />
        <VisPanel />
      </div>
    </div>
  )
}
