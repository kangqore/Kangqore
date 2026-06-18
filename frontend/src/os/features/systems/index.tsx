import { useState, useEffect, useCallback } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MessageSquare, Zap, TrendingUp, Globe,
  CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Brain, Activity, Database, Wifi, WifiOff,
  Play, ChevronDown, ChevronRight, Server,
  Clock, BarChart3, Shield, LayoutGrid,
} from 'lucide-react'
import { cn } from '@design-system/cn'
import { api } from '@lib/api'
import { AnimatePresence, motion } from 'framer-motion'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/admin/systems'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SysStatus = 'ok' | 'degraded' | 'offline' | 'unknown'

const STATUS_CFG: Record<SysStatus, { icon: any; label: string; color: string }> = {
  ok:       { icon: CheckCircle2,  label: 'Healthy',  color: '#059669' },
  degraded: { icon: AlertTriangle, label: 'Degraded', color: '#d97706' },
  offline:  { icon: XCircle,       label: 'Offline',  color: '#ef4444' },
  unknown:  { icon: Activity,      label: 'Unknown',  color: '#64748b' },
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SysStatus }) {
  const c = STATUS_CFG[status]
  const Icon = c.icon
  const { pathname } = useLocation()

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}30` }}
    >
      <Icon className="w-3 h-3" />{c.label}
    </span>
  )
}

function Kpi({ label, value, sub, color = '#2564ea' }: {
  label: string; value: string | number | null; sub?: string; color?: string
}) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: `${color}70` }}>{label}</p>
      {value == null
        ? <p className="text-xl font-bold text-slate-600">—</p>
        : <p className="text-xl font-bold text-white">{value}</p>
      }
      {sub && <p className="text-[10px] mt-0.5 text-slate-600">{sub}</p>}
    </div>
  )
}

function SLabel({ text }: { text: string }) {
  return <p className="text-[9px] font-bold uppercase tracking-widest mt-5 mb-2.5" style={{ color: 'rgba(43,189,255,0.4)' }}>{text}</p>
}

function ABtn({ icon: Icon, label, loading, onClick, color }: {
  icon: any; label: string; loading?: boolean; onClick: () => void; color: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40"
      style={{ color, background: `${color}12`, border: `1px solid ${color}28` }}
    >
      <Icon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
      {label}
    </button>
  )
}

// Page-level section container
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SLabel text={title} />
      {children}
    </div>
  )
}

// Auto-refresh ticker
function Ticker({ interval, onTick }: { interval: number; onTick: () => void }) {
  const [remaining, setRemaining] = useState(interval)
  const [on, setOn] = useState(true)

  useEffect(() => {
    if (!on) return
    const t = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { onTick(); return interval }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [on, interval, onTick])

  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: on ? '#059669' : '#475569', boxShadow: on ? '0 0 4px #059669' : 'none' }} />
      <span className="text-[10px] text-slate-500">{on ? `Auto-refresh in ${remaining}s` : 'Paused'}</span>
      <button
        onClick={() => setOn(v => !v)}
        className="text-[10px] font-semibold px-2 py-0.5 rounded"
        style={{ color: on ? '#ef4444' : '#059669', background: on ? 'rgba(239,68,68,0.08)' : 'rgba(5,150,105,0.08)', border: `1px solid ${on ? 'rgba(239,68,68,0.2)' : 'rgba(5,150,105,0.2)'}` }}
      >
        {on ? 'Pause' : 'Resume'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── TAB PAGES ────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ onRefreshAll }: { onRefreshAll: () => void }) {
  const { data: health }       = useQuery({ queryKey: ['eqore-health'],    queryFn: () => api.get('/eqore/health').then(r => r.data).catch(() => null),                           staleTime: 30_000, refetchInterval: 60_000 })
  const { data: graphStats }   = useQuery({ queryKey: ['eqore-graph-stats'], queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data).catch(() => null),               staleTime: 60_000 })
  const { data: alisOverview } = useQuery({ queryKey: ['alis-overview'],   queryFn: () => api.get('/admin/alis/overview').then(r => r.data).catch(() => null),                     staleTime: 60_000 })
  const { data: visKpi }       = useQuery({ queryKey: ['vis-kpi-overview'], queryFn: () => api.get('/admin/kangqore-vis/kpi/overview').then(r => r.data).catch(() => null),        staleTime: 60_000 })
  const qc = useQueryClient()

  const emitMutation     = useMutation({ mutationFn: () => api.post('/admin/alis/signals/emit'),         onSuccess: () => qc.invalidateQueries({ queryKey: ['alis-alerts', 'alis-overview'] }) })
  const snapshotMutation = useMutation({ mutationFn: () => api.post('/admin/kangqore-vis/kpi/snapshot'), onSuccess: () => qc.invalidateQueries({ queryKey: ['vis-kpi-overview'] }) })
  const syncMutation     = useMutation({ mutationFn: () => api.post('/admin/eqore/graph/sync'),          onSuccess: () => qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }) })

  const systems = [
    { name: 'eQORE',             path: `${BASE}/eqore`,         icon: MessageSquare, accent: '#7c3aed', status: (health?.status === 'OK' ? 'ok' : health ? 'degraded' : 'unknown') as SysStatus, desc: 'AI Concierge · Lead Engine' },
    { name: 'Lead Intelligence', path: `${BASE}/lead-intel`,    icon: Zap,           accent: '#2564ea', status: (graphStats ? 'ok' : 'unknown') as SysStatus,   desc: 'Scoring · Graph · Pipeline' },
    { name: 'ALIS',              path: `${BASE}/alis`,          icon: TrendingUp,    accent: '#059669', status: (alisOverview ? 'ok' : 'unknown') as SysStatus, desc: 'Market Intelligence · Demand' },
    { name: 'VIS',               path: `${BASE}/vis`,           icon: Globe,         accent: '#0ea5e9', status: (visKpi ? 'ok' : 'unknown') as SysStatus,       desc: 'Visibility · SEO · Governance' },
  ]

  const healthy = systems.filter(s => s.status === 'ok').length

  const actions = [
    { icon: Play,      label: 'Emit ALIS Signals',  desc: 'Market signal scan → KIMMP', mutation: emitMutation,     color: '#059669' },
    { icon: Database,  label: 'Snapshot VIS KPIs',  desc: 'Point-in-time KPI capture',  mutation: snapshotMutation, color: '#0ea5e9' },
    { icon: RefreshCw, label: 'Sync eQORE Graph',   desc: 'Rebuild knowledge graph',     mutation: syncMutation,     color: '#7c3aed' },
  ]

  return (
    <div className="space-y-6">

      {/* Global health banner */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4"
        style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${healthy === 4 ? 'rgba(5,150,105,0.2)' : 'rgba(217,119,6,0.2)'}` }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Fleet Status</p>
          <p className="text-2xl font-bold text-white">{healthy}/4 <span className="text-base font-normal text-slate-400">systems healthy</span></p>
        </div>
        <div className="flex flex-wrap gap-4">
          {systems.map(s => {
            const cfg = STATUS_CFG[s.status]
            const Icon = cfg.icon
            return (
              <NavLink key={s.name} to={s.path} className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.accent }}>
                  <s.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-slate-200">{s.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                    <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* Action centre */}
      <div>
        <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Action Centre
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map(a => (
            <button
              key={a.label}
              onClick={() => a.mutation.mutate()}
              disabled={a.mutation.isPending}
              className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all disabled:opacity-40"
              style={{ background: `${a.color}08`, border: `1px solid ${a.color}20` }}
            >
              <div className="flex items-center gap-2">
                <a.icon className={`w-4 h-4 ${a.mutation.isPending ? 'animate-spin' : ''}`} style={{ color: a.color }} />
                <span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span>
                {a.mutation.isSuccess && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-500">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick KPI snapshot across systems */}
      <div>
        <p className="text-sm font-bold text-white mb-3">Cross-System KPIs</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Graph Nodes"   value={graphStats?.totalNodes ?? null} color="#2564ea" sub="eQORE entities" />
          <Kpi label="Graph Edges"   value={graphStats?.totalEdges ?? null} color="#2564ea" sub="relationships" />
          <Kpi label="ALIS Services" value={alisOverview?.serviceCount ?? null} color="#059669" sub="tracked services" />
          <Kpi label="VIS Pages"     value={visKpi?.kpis?.find((k: any) => k.metric === 'pages_total')?.value ?? null} color="#0ea5e9" sub="page blueprints" />
        </div>
      </div>
    </div>
  )
}

// ─── eQORE tab ────────────────────────────────────────────────────────────────

const EQORE_AGENTS = [
  { name: 'ConciergeAgent',      role: 'Main conversation handler',         model: 'haiku-4-5' },
  { name: 'ShadowLeadAgent',     role: 'Silent lead profiling',             model: 'haiku-3' },
  { name: 'AssuranceAgent',      role: 'Quality & confidence check',        model: 'sonnet-4-6' },
  { name: 'ServiceMatcherAgent', role: 'Intent → Kangqore service mapping', model: 'haiku-4-5' },
  { name: 'SchedulingAgent',     role: 'Booking intent detection',          model: 'haiku-4-5' },
  { name: 'NurtureAgent',        role: 'Async follow-up sequences',         model: 'haiku-4-5' },
]

function EqoreTab() {
  const qc = useQueryClient()

  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ['eqore-health'],
    queryFn: () => api.get('/eqore/health').then(r => r.data).catch(() => null),
    staleTime: 30_000, refetchInterval: 60_000,
  })
  const { data: graphStats } = useQuery({
    queryKey: ['eqore-graph-stats'],
    queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })
  const { data: leads } = useQuery({
    queryKey: ['eqore-leads-count'],
    queryFn: () => api.get('/admin/eqore/leads?limit=1').then(r => r.data).catch(() => null),
    staleTime: 120_000,
  })
  const { data: conversations } = useQuery({
    queryKey: ['eqore-conversations'],
    queryFn: () => api.get('/admin/eqore/conversations?limit=1').then(r => r.data).catch(() => null),
    staleTime: 120_000,
  })
  const { data: recentLeads } = useQuery({
    queryKey: ['eqore-leads-list'],
    queryFn: () => api.get('/admin/eqore/leads?limit=10').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })

  const syncMutation = useMutation({
    mutationFn: () => api.post('/admin/eqore/graph/sync'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }),
  })

  const status: SysStatus =
    isLoading ? 'unknown'
    : health?.status === 'OK' ? 'ok'
    : health?.status === 'DEGRADED' ? 'degraded'
    : health ? 'offline' : 'unknown'

  const healthRows = health ? [
    { label: 'Database',       value: health.db           ?? '—', ok: health.db === 'OK' || health.db === 'connected' },
    { label: 'Redis',          value: health.redis        ?? '—', ok: health.redis === 'OK' || health.redis === 'connected' },
    { label: 'Model Provider', value: health.modelProvider ?? '—', ok: !!health.modelProvider },
    { label: 'Queue Worker',   value: health.queueWorker  ?? '—', ok: health.queueWorker === 'OK' || health.queueWorker === 'running' },
    { label: 'Model Name',     value: health.modelName    ?? '—', ok: true },
  ] : []

  const leadList: any[] = recentLeads?.leads ?? recentLeads?.data ?? []

  return (
    <div className="space-y-1">

      {/* System header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#7c3aed' }}>
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">eQORE</h2>
            <p className="text-xs text-slate-500">AI Concierge · Inbound Lead Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <ABtn icon={Activity}  label="Health Check" loading={isLoading}              onClick={() => refetch()}             color="#059669" />
          <ABtn icon={RefreshCw} label="Sync Graph"   loading={syncMutation.isPending} onClick={() => syncMutation.mutate()} color="#7c3aed" />
        </div>
      </div>

      {/* Metrics */}
      <Section title="Key Metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Graph Nodes"     value={graphStats?.totalNodes ?? null}                       color="#7c3aed" sub="entities in graph" />
          <Kpi label="Graph Edges"     value={graphStats?.totalEdges ?? null}                       color="#7c3aed" sub="relationships" />
          <Kpi label="Leads Captured"  value={leads?.total ?? leads?.count ?? null}                  color="#2564ea" sub="via eQORE widget" />
          <Kpi label="Conversations"   value={conversations?.total ?? conversations?.count ?? null}  color="#0ea5e9" sub="total AI sessions" />
        </div>
      </Section>

      {/* Service health */}
      {healthRows.length > 0 && (
        <Section title="Service Health">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {healthRows.map((r, i) => (
              <div
                key={r.label}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < healthRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.ok ? '#059669' : '#ef4444' }} />
                <span className="text-sm text-slate-400 flex-1">{r.label}</span>
                <span className="text-sm font-mono font-semibold text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Agents */}
      <Section title={`Active Agents (${EQORE_AGENTS.length})`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {EQORE_AGENTS.map(a => (
            <div key={a.name} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{a.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.role}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded flex-shrink-0" style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>{a.model}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Recent leads */}
      {leadList.length > 0 && (
        <Section title="Recent Leads via eQORE">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {leadList.map((l: any, i: number) => (
              <div
                key={l.id ?? i}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < leadList.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'rgba(124,58,237,0.2)' }}>
                  {(l.name ?? l.email ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{l.name ?? l.email ?? `Lead #${i + 1}`}</p>
                  {l.email && l.name && <p className="text-xs text-slate-500 truncate">{l.email}</p>}
                </div>
                {l.score != null && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: l.score >= 70 ? '#059669' : l.score >= 40 ? '#d97706' : '#64748b', background: l.score >= 70 ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)' }}>
                    {l.score}
                  </span>
                )}
                {l.createdAt && <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(l.createdAt)}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

// ─── Lead Intelligence tab ────────────────────────────────────────────────────

function LeadIntelTab() {
  const qc = useQueryClient()

  const { data: graphStats, isLoading, refetch } = useQuery({ queryKey: ['eqore-graph-stats'], queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data).catch(() => null), staleTime: 60_000 })
  const { data: opps }  = useQuery({ queryKey: ['eqore-opps'],  queryFn: () => api.get('/admin/eqore/sales/opportunities').then(r => r.data).catch(() => null), staleTime: 60_000 })
  const { data: tasks } = useQuery({ queryKey: ['eqore-tasks'], queryFn: () => api.get('/admin/eqore/sales/tasks').then(r => r.data).catch(() => null),          staleTime: 60_000 })
  const { data: allLeads } = useQuery({ queryKey: ['eqore-leads-full'], queryFn: () => api.get('/admin/eqore/leads?limit=20').then(r => r.data).catch(() => null), staleTime: 60_000 })

  const syncMutation = useMutation({ mutationFn: () => api.post('/admin/eqore/graph/sync'), onSuccess: () => qc.invalidateQueries({ queryKey: ['eqore-graph-stats'] }) })

  const oppList: any[]  = opps?.opportunities ?? []
  const taskList: any[] = tasks?.tasks ?? []
  const leadList: any[] = allLeads?.leads ?? allLeads?.data ?? []
  const openTasks = taskList.filter((t: any) => !['DONE', 'COMPLETED'].includes(t.status))
  const status: SysStatus = isLoading ? 'unknown' : graphStats ? 'ok' : 'degraded'

  const STAGE_COLOR: Record<string, string> = {
    DISCOVERY: '#2564ea', QUALIFIED: '#0ea5e9', PROPOSAL: '#d97706',
    NEGOTIATION: '#f97316', WON: '#059669', LOST: '#ef4444',
  }

  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(37,100,234,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#2564ea' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Lead Intelligence</h2>
            <p className="text-xs text-slate-500">Scoring · Knowledge Graph · Sales Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <ABtn icon={RefreshCw} label="Sync Graph" loading={syncMutation.isPending} onClick={() => syncMutation.mutate()} color="#2564ea" />
        </div>
      </div>

      <Section title="Pipeline Metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Graph Nodes"   value={isLoading ? null : (graphStats?.totalNodes ?? null)} color="#2564ea" sub="entities" />
          <Kpi label="Graph Edges"   value={isLoading ? null : (graphStats?.totalEdges ?? null)} color="#2564ea" sub="relationships" />
          <Kpi label="Opportunities" value={oppList.length || null}                              color="#0ea5e9" sub="in pipeline" />
          <Kpi label="Open Tasks"    value={openTasks.length || null}                            color="#d97706" sub="pending" />
        </div>
      </Section>

      {/* Opportunities */}
      {oppList.length > 0 && (
        <Section title={`Sales Opportunities (${oppList.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {oppList.map((o: any, i: number) => {
              const stColor = STAGE_COLOR[o.stage] ?? '#64748b'
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(37,100,234,0.04)', border: '1px solid rgba(37,100,234,0.1)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{o.name ?? o.title ?? `Opportunity #${i + 1}`}</p>
                    {o.value && <p className="text-xs text-slate-500 mt-0.5">₹{Number(o.value).toLocaleString('en-IN')}</p>}
                    {o.createdAt && <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(o.createdAt)}</p>}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0" style={{ color: stColor, background: `${stColor}15`, border: `1px solid ${stColor}25` }}>{o.stage ?? '—'}</span>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Open tasks */}
      {openTasks.length > 0 && (
        <Section title={`Open Tasks (${openTasks.length})`}>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {openTasks.slice(0, 10).map((t: any, i: number) => (
              <div key={t.id ?? i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < Math.min(openTasks.length, 10) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#d97706' }} />
                <p className="text-sm text-slate-300 flex-1">{t.title ?? t.description ?? `Task ${i + 1}`}</p>
                {t.dueDate && <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(t.dueDate)}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Scoring engines */}
      <Section title="Scoring Engines">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {[
            { name: 'Lead Scoring (0–100)',  desc: 'Multi-factor score combining intent, fit, engagement' },
            { name: 'ICP Classification',    desc: 'Ideal customer profile match + segment tagging' },
            { name: 'LTV Projection',        desc: 'Lifetime value estimate based on service fit' },
            { name: 'Next Best Question',    desc: 'Taxonomy-driven follow-up question selection' },
            { name: 'Service Matcher',       desc: 'Maps expressed intent → best-fit Kangqore service' },
            { name: 'Nurture Sequencer',     desc: 'Async follow-up trigger based on score delta' },
          ].map(e => (
            <div key={e.name} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(37,100,234,0.04)', border: '1px solid rgba(37,100,234,0.08)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#059669' }} />
              <div>
                <p className="text-sm font-semibold text-white">{e.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── ALIS tab ─────────────────────────────────────────────────────────────────

function AlisTab() {
  const qc = useQueryClient()

  const { data: overview, isLoading, refetch } = useQuery({ queryKey: ['alis-overview'],  queryFn: () => api.get('/admin/alis/overview').then(r => r.data).catch(() => null),        staleTime: 60_000 })
  const { data: alerts }   = useQuery({ queryKey: ['alis-alerts'],  queryFn: () => api.get('/admin/alis/alerts').then(r => r.data).catch(() => null),          staleTime: 60_000 })
  const { data: gaps }     = useQuery({ queryKey: ['alis-gaps'],    queryFn: () => api.get('/admin/alis/content-gaps').then(r => r.data).catch(() => null),    staleTime: 120_000 })
  const { data: recs }     = useQuery({ queryKey: ['alis-recs'],    queryFn: () => api.get('/admin/alis/growth-recs').then(r => r.data).catch(() => null),     staleTime: 120_000 })
  const { data: revenue }  = useQuery({ queryKey: ['alis-revenue'], queryFn: () => api.get('/admin/alis/revenue').then(r => r.data).catch(() => null),         staleTime: 120_000 })
  const { data: services } = useQuery({ queryKey: ['alis-services'],queryFn: () => api.get('/admin/alis/services').then(r => r.data).catch(() => null),        staleTime: 120_000 })
  const { data: intent }   = useQuery({ queryKey: ['alis-intent'],  queryFn: () => api.get('/admin/alis/buyer-intent').then(r => r.data).catch(() => null),    staleTime: 120_000 })

  const emitMutation = useMutation({
    mutationFn: () => api.post('/admin/alis/signals/emit'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alis-overview', 'alis-alerts'] }),
  })

  const alertList: any[] = alerts?.alerts ?? []
  const gapList: any[]   = gaps?.gaps     ?? []
  const recList: any[]   = recs?.recommendations ?? recs?.recs ?? []
  const intentList: any[] = intent?.intents ?? intent?.signals ?? []
  const serviceList: any[] = services?.services ?? []
  const status: SysStatus = isLoading ? 'unknown' : overview ? 'ok' : 'degraded'

  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(5,150,105,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#059669' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">ALIS</h2>
            <p className="text-xs text-slate-500">Market Intelligence · Demand Analysis · Content Strategy</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <ABtn icon={Play}      label="Emit Signals" loading={emitMutation.isPending} onClick={() => emitMutation.mutate()} color="#059669" />
          <ABtn icon={RefreshCw} label="Refresh"      loading={isLoading}              onClick={() => refetch()}             color="#64748b" />
        </div>
      </div>

      <Section title="Summary Metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi label="Active Alerts"  value={alertList.length || 0} color="#d97706" sub="market signals" />
          <Kpi label="Content Gaps"   value={gapList.length || 0}   color="#ef4444" sub="identified" />
          <Kpi label="Growth Recs"    value={recList.length || 0}   color="#059669" sub="actionable" />
          <Kpi label="Services"       value={overview?.serviceCount ?? (serviceList.length || null)} color="#0ea5e9" sub="tracked" />
        </div>
      </Section>

      {/* Alerts */}
      {alertList.length > 0 && (
        <Section title={`Active Alerts (${alertList.length})`}>
          <div className="space-y-2">
            {alertList.map((a: any, i: number) => (
              <div key={i} className="flex gap-3 items-start px-4 py-3 rounded-xl" style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.12)' }}>
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-200 leading-snug">{a.message ?? a.title ?? a.text ?? JSON.stringify(a).slice(0, 100)}</p>
                  {a.createdAt && <p className="text-[10px] text-slate-600 mt-1">{timeAgo(a.createdAt)}</p>}
                </div>
                {a.severity && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ color: a.severity === 'HIGH' ? '#ef4444' : '#d97706', background: 'rgba(217,119,6,0.1)' }}>{a.severity}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Growth recommendations */}
      {recList.length > 0 && (
        <Section title={`Growth Recommendations (${recList.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {recList.map((r: any, i: number) => (
              <div key={i} className="px-4 py-4 rounded-xl" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.12)' }}>
                <p className="text-sm font-semibold text-white">{r.title ?? r.recommendation ?? r.action ?? `Recommendation ${i + 1}`}</p>
                {(r.description ?? r.detail ?? r.rationale) && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{r.description ?? r.detail ?? r.rationale}</p>
                )}
                {r.impact && <p className="text-[10px] font-bold mt-2 text-emerald-400">Impact: {r.impact}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Content gaps */}
      {gapList.length > 0 && (
        <Section title={`Content Gaps (${gapList.length})`}>
          <div className="space-y-2">
            {gapList.map((g: any, i: number) => (
              <div key={i} className="flex gap-3 items-start px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">{g.topic ?? g.gap ?? g.keyword ?? JSON.stringify(g).slice(0, 80)}</p>
                  {g.volume && <p className="text-[10px] text-slate-600 mt-0.5">Search volume: {g.volume}</p>}
                </div>
                {g.priority && <span className="text-[10px] font-bold text-red-400 flex-shrink-0">{g.priority}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Intelligence engines */}
      <Section title="Intelligence Engines">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {[
            { name: 'Demand Trend Analyser',  desc: 'Tracks market demand patterns in real-time' },
            { name: 'Content Gap Detector',   desc: 'Identifies missing content opportunities' },
            { name: 'Demand Responder',       desc: 'Automated response to detected demand signals' },
            { name: 'Executive Alert',        desc: 'Escalation engine for CXO-level briefings' },
            { name: 'Revenue Forecaster',     desc: 'Pipeline revenue projection model' },
            { name: 'VIS Sync',               desc: 'Pushes ALIS signals into Kangqore VIS' },
          ].map(e => (
            <div key={e.name} className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.1)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#059669' }} />
              <div>
                <p className="text-sm font-semibold text-white">{e.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── VIS tab ──────────────────────────────────────────────────────────────────

function VisTab() {
  const qc = useQueryClient()

  const { data: kpiData, isLoading, refetch } = useQuery({ queryKey: ['vis-kpi-overview'], queryFn: () => api.get('/admin/kangqore-vis/kpi/overview').then(r => r.data).catch(() => null), staleTime: 60_000 })
  const { data: govMode }  = useQuery({ queryKey: ['vis-gov-mode'],  queryFn: () => api.get('/admin/kangqore-vis/governance/mode').then(r => r.data).catch(() => null),          staleTime: 120_000 })
  const { data: auditLog } = useQuery({ queryKey: ['vis-audit-log'], queryFn: () => api.get('/admin/kangqore-vis/governance/audit-log?limit=20').then(r => r.data).catch(() => null), staleTime: 120_000 })
  const { data: snapshots } = useQuery({ queryKey: ['vis-snapshots'], queryFn: () => api.get('/admin/kangqore-vis/kpi/snapshots?limit=5').then(r => r.data).catch(() => null), staleTime: 120_000 })

  const snapshotMutation = useMutation({
    mutationFn: () => api.post('/admin/kangqore-vis/kpi/snapshot'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vis-kpi-overview', 'vis-snapshots'] }),
  })

  const kpis: any[]         = kpiData?.kpis       ?? []
  const connected: any[]    = kpiData?.connected  ?? []
  const unconnected: any[]  = kpiData?.unconnected ?? []
  const auditEntries: any[] = auditLog?.entries    ?? []
  const snapshotList: any[] = snapshots?.snapshots ?? []
  const status: SysStatus   = isLoading ? 'unknown' : kpiData ? 'ok' : 'degraded'

  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(14,165,233,0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#0ea5e9' }}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Kangqore VIS</h2>
            <p className="text-xs text-slate-500">Visibility Engine · SEO · AI Answerability · Governance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <ABtn icon={Database}   label="Snapshot KPIs" loading={snapshotMutation.isPending} onClick={() => snapshotMutation.mutate()} color="#0ea5e9" />
          <ABtn icon={RefreshCw}  label="Refresh"       loading={isLoading}                  onClick={() => refetch()}                  color="#64748b" />
        </div>
      </div>

      {/* Full KPI table */}
      {kpis.length > 0 && (
        <Section title="Live KPIs">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {kpis.map((k: any, i: number) => (
              <div
                key={k.metric}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < kpis.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: k.status === 'live' ? '#059669' : '#64748b' }} />
                <span className="text-sm text-slate-400 flex-1">{k.label}</span>
                <span className="text-sm font-bold text-white">{k.value ?? '—'}</span>
                <span className="text-[10px] text-slate-600 w-16 text-right font-mono">{k.source}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Data sources */}
      <Section title={`Data Sources — ${connected.length} connected · ${unconnected.length} unconnected`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {connected.map((s: string) => (
            <div key={s} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <Wifi className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} />
              <span className="text-sm text-slate-300">{s}</span>
              <span className="text-[10px] font-bold ml-auto text-emerald-500">Connected</span>
            </div>
          ))}
          {unconnected.map((s: string) => (
            <div key={s} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'rgba(100,116,139,0.04)', border: '1px solid rgba(100,116,139,0.1)' }}>
              <WifiOff className="w-4 h-4 flex-shrink-0 text-slate-600" />
              <span className="text-sm text-slate-500">{s}</span>
              <span className="text-[10px] font-bold ml-auto text-slate-600">Not connected</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Governance */}
      <Section title="Governance">
        {govMode?.mode && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-3" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
            <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#0ea5e9' }} />
            <span className="text-sm text-slate-300">Governance Mode</span>
            <span className="text-sm font-bold text-white uppercase ml-auto">{govMode.mode}</span>
          </div>
        )}
        {auditEntries.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {auditEntries.map((e: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < auditEntries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-600" />
                <p className="text-sm text-slate-300 flex-1">{e.action ?? e.event ?? e.message ?? `Entry ${i + 1}`}</p>
                {e.createdAt && <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(e.createdAt)}</span>}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Active modules */}
      <Section title="Active Modules (14)">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { name: 'Technical SEO',    desc: 'Sitemap, robots, crawlability' },
            { name: 'Content Mapping',  desc: 'Blueprint-driven content plan' },
            { name: 'Info Architecture', desc: 'Site structure & hierarchy' },
            { name: 'On-Page SEO',      desc: 'Title, meta, heading optimisation' },
            { name: 'Internal Links',   desc: 'Link graph & anchor text' },
            { name: 'Structured Data',  desc: 'Schema.org markup generation' },
            { name: 'Entity Arch',      desc: 'NLP entity relationship map' },
            { name: 'E-E-A-T',          desc: 'Expertise, authority, trust signals' },
            { name: 'Authority',        desc: 'Domain authority tracking' },
            { name: 'AI Answerability', desc: 'LLM citation & FAQ coverage' },
            { name: 'SXO',              desc: 'Search experience optimisation' },
            { name: 'Governance',       desc: 'Publish rules & audit log' },
            { name: 'Performance',      desc: 'Core Web Vitals tracking' },
            { name: 'KPI',              desc: 'Metric snapshots & aggregation' },
          ].map(m => (
            <div key={m.name} className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}>
              <p className="text-xs font-bold text-white">{m.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Root module ──────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { path: '',          end: true,  label: 'Overview',          icon: LayoutGrid   },
  { path: 'eqore',    end: false, label: 'eQORE',              icon: MessageSquare },
  { path: 'lead-intel', end: false, label: 'Lead Intelligence', icon: Zap          },
  { path: 'alis',     end: false, label: 'ALIS',               icon: TrendingUp   },
  { path: 'vis',      end: false, label: 'VIS',                icon: Globe        },
]

const ACCENT: Record<string, string> = {
  '':           '#64748b',
  'eqore':      '#7c3aed',
  'lead-intel': '#2564ea',
  'alis':       '#059669',
  'vis':        '#0ea5e9',
}

export function SystemsModule() {
  const qc = useQueryClient()
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const refreshAll = useCallback(() => {
    const keys = [
      ['eqore-health'], ['eqore-graph-stats'], ['eqore-leads-count'], ['eqore-conversations'],
      ['eqore-leads-list'], ['eqore-leads-full'], ['eqore-opps'], ['eqore-tasks'],
      ['alis-overview'], ['alis-alerts'], ['alis-gaps'], ['alis-recs'], ['alis-revenue'], ['alis-services'], ['alis-intent'],
      ['vis-kpi-overview'], ['vis-gov-mode'], ['vis-audit-log'], ['vis-snapshots'],
    ]
    keys.forEach(k => qc.invalidateQueries({ queryKey: k }))
    setLastRefreshed(new Date())
  }, [qc])

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Server className="w-5 h-5 text-blue-400" />
            Systems Monitor
          </h1>
          <p className="text-sm text-slate-500 mt-1">Live health, metrics and controls for all Kangqore sub-systems</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Clock className="w-3 h-3" />
            Last refreshed {timeAgo(lastRefreshed.toISOString())}
          </div>
          <Ticker interval={60} onTick={refreshAll} />
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white"
            style={{ background: 'rgba(37,100,234,0.15)', border: '1px solid rgba(37,100,234,0.3)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-[#2E2854] -mb-1 overflow-x-auto scrollbar-none">
        {TABS.map(tab => {
          const accent = ACCENT[tab.path]
          return (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
              end={tab.end}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'border-[--tab-accent] text-[--tab-accent]'
                  : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-[#2E2854]'
              )}
              style={{ '--tab-accent': accent } as React.CSSProperties}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index                element={<OverviewTab onRefreshAll={refreshAll} />} />
          <Route path="eqore"         element={<EqoreTab />} />
          <Route path="lead-intel"    element={<LeadIntelTab />} />
          <Route path="alis"          element={<AlisTab />} />
          <Route path="vis"           element={<VisTab />} />
          <Route path="*"             element={<Navigate to={BASE} replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
