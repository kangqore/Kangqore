import { useState, useEffect, useCallback } from 'react'
import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MessageSquare, Zap, TrendingUp, Globe,
  CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Brain, Activity, Database, Wifi, WifiOff,
  Play, ChevronDown, ChevronRight, Server,
  Clock, BarChart3, Shield, LayoutGrid, Radio,
} from 'lucide-react'
import { DataFabricTab } from './DataFabricTab'
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
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, boxShadow: `0 4px 20px ${color}40` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.28) 0%, transparent 60%)' }} />
      <p className="relative text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</p>
      <p className="relative text-2xl font-black tracking-tight" style={{ color: value == null ? 'rgba(255,255,255,0.4)' : '#ffffff' }}>{value ?? '—'}</p>
      {sub && <p className="relative text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>{sub}</p>}
    </div>
  )
}

function SLabel({ text }: { text: string }) {
  return <p className="text-[9px] font-bold uppercase tracking-widest mt-5 mb-2.5" style={{ color: 'var(--os-text-2)' }}>{text}</p>
}

function ABtn({ icon: Icon, label, loading, onClick, color }: {
  icon: any; label: string; loading?: boolean; onClick: () => void; color: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-opacity disabled:opacity-40"
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
        style={{ background: 'var(--os-card)', border: `1px solid ${healthy === 4 ? 'rgba(5,150,105,0.2)' : 'rgba(217,119,6,0.2)'}`, boxShadow: 'var(--os-shadow-card)' }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Fleet Status</p>
          <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--os-text-1)' }}>{healthy}/4 <span className="text-base font-normal" style={{ color: 'var(--os-text-2)' }}>systems healthy</span></p>
        </div>
        <div className="flex flex-wrap gap-4">
          {systems.map(s => {
            const cfg = STATUS_CFG[s.status]
            const Icon = cfg.icon
            return (
              <NavLink key={s.name} to={s.path} className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-2xl flex items-center justify-center" style={{ background: s.accent }}>
                  <s.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--os-text-1)' }}>{s.name}</p>
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
        <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--os-text-1)' }}>
          <BarChart3 className="w-4 h-4" style={{ color: '#2564ea' }} />
          Action Centre
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map(a => (
            <button
              key={a.label}
              onClick={() => a.mutation.mutate()}
              disabled={a.mutation.isPending}
              className="flex flex-col gap-2 p-4 rounded-2xl text-left transition-all disabled:opacity-40"
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
        <p className="text-sm font-bold mb-3" style={{ color: 'var(--os-text-1)' }}>Cross-System KPIs</p>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#7c3aed' }}>
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>eQORE</h2>
            <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>AI Concierge · Inbound Lead Engine</p>
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
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,15,30,0.5)' }}>
            {healthRows.map((r, i) => (
              <div
                key={r.label}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < healthRows.length - 1 ? '1px solid rgba(13,17,23,0.4)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.ok ? '#059669' : '#ef4444' }} />
                <span className="text-sm text-slate-400 flex-1">{r.label}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--os-text-1)' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Agents */}
      <Section title={`Active Agents (${EQORE_AGENTS.length})`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {EQORE_AGENTS.map(a => (
            <div key={a.name} className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}>
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{a.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{a.role}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded flex-shrink-0" style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>{a.model}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Recent leads */}
      {leadList.length > 0 && (
        <Section title="Recent Leads via eQORE">
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,15,30,0.5)' }}>
            {leadList.map((l: any, i: number) => (
              <div
                key={l.id ?? i}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < leadList.length - 1 ? '1px solid rgba(13,17,23,0.4)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'rgba(124,58,237,0.2)' }}>
                  {(l.name ?? l.email ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{l.name ?? l.email ?? `Lead #${i + 1}`}</p>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#2564ea' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>Lead Intelligence</h2>
            <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Scoring · Knowledge Graph · Sales Pipeline</p>
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
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(37,100,234,0.04)', border: '1px solid rgba(37,100,234,0.1)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text-1)' }}>{o.name ?? o.title ?? `Opportunity #${i + 1}`}</p>
                    {o.value && <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>₹{Number(o.value).toLocaleString('en-IN')}</p>}
                    {o.createdAt && <p className="text-[10px] text-slate-600 mt-0.5">{timeAgo(o.createdAt)}</p>}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-2xl flex-shrink-0" style={{ color: stColor, background: `${stColor}15`, border: `1px solid ${stColor}25` }}>{o.stage ?? '—'}</span>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Open tasks */}
      {openTasks.length > 0 && (
        <Section title={`Open Tasks (${openTasks.length})`}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,15,30,0.5)' }}>
            {openTasks.slice(0, 10).map((t: any, i: number) => (
              <div key={t.id ?? i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < Math.min(openTasks.length, 10) - 1 ? '1px solid rgba(13,17,23,0.4)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
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
            <div key={e.name} className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(37,100,234,0.04)', border: '1px solid rgba(37,100,234,0.08)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#059669' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{e.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{e.desc}</p>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#059669' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>ALIS</h2>
            <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Market Intelligence · Demand Analysis · Content Strategy</p>
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
              <div key={i} className="flex gap-3 items-start px-4 py-3 rounded-2xl" style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.12)' }}>
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-400" />
                <div className="flex-1">
                  <p className="text-sm leading-snug" style={{ color: 'var(--os-text-1)' }}>{a.message ?? a.title ?? a.text ?? JSON.stringify(a).slice(0, 100)}</p>
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
              <div key={i} className="px-4 py-4 rounded-2xl" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.12)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{r.title ?? r.recommendation ?? r.action ?? `Recommendation ${i + 1}`}</p>
                {(r.description ?? r.detail ?? r.rationale) && (
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--os-text-2)' }}>{r.description ?? r.detail ?? r.rationale}</p>
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
              <div key={i} className="flex gap-3 items-start px-4 py-3 rounded-2xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--os-text-1)' }}>{g.topic ?? g.gap ?? g.keyword ?? JSON.stringify(g).slice(0, 80)}</p>
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
            <div key={e.name} className="flex items-start gap-2.5 px-4 py-3 rounded-2xl" style={{ background: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.1)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#059669' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--os-text-1)' }}>{e.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{e.desc}</p>
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#0ea5e9' }}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>Kangqore VIS</h2>
            <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>Visibility Engine · SEO · AI Answerability · Governance</p>
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
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,15,30,0.5)' }}>
            {kpis.map((k: any, i: number) => (
              <div
                key={k.metric}
                className="flex items-center px-4 py-3 gap-3"
                style={{ borderBottom: i < kpis.length - 1 ? '1px solid rgba(13,17,23,0.4)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: k.status === 'live' ? '#059669' : '#64748b' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--os-text-2)' }}>{k.label}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{k.value ?? '—'}</span>
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
            <div key={s} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)' }}>
              <Wifi className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} />
              <span className="text-sm text-slate-300">{s}</span>
              <span className="text-[10px] font-bold ml-auto text-emerald-500">Connected</span>
            </div>
          ))}
          {unconnected.map((s: string) => (
            <div key={s} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(100,116,139,0.04)', border: '1px solid rgba(100,116,139,0.1)' }}>
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
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-3" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
            <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#0ea5e9' }} />
            <span className="text-sm" style={{ color: 'var(--os-text-2)' }}>Governance Mode</span>
            <span className="text-sm font-bold uppercase ml-auto" style={{ color: 'var(--os-text-1)' }}>{govMode.mode}</span>
          </div>
        )}
        {auditEntries.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(10,15,30,0.5)' }}>
            {auditEntries.map((e: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: i < auditEntries.length - 1 ? '1px solid rgba(13,17,23,0.4)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-600" />
                <p className="text-sm flex-1" style={{ color: 'var(--os-text-1)' }}>{e.action ?? e.event ?? e.message ?? `Entry ${i + 1}`}</p>
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
            <div key={m.name} className="px-3 py-2.5 rounded-2xl" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--os-text-1)' }}>{m.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-2)' }}>{m.desc}</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── KIMMP tab — AI-governed systems (WAANDA brain) ──────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const KIMMP_SYSTEMS = [
  { id: 'EQORE',      label: 'EQORE',      fullName: 'Conversation Intelligence', model: 'sonnet-4-6',  color: '#2564ea', agents: 6  },
  { id: 'LEAD_INTEL', label: 'LEAD INTEL', fullName: 'Lead Scoring Intelligence', model: 'sonnet-4-6',  color: '#00c875', agents: 6  },
  { id: 'ALIS',       label: 'ALIS',       fullName: 'Autonomous Demand Ops',     model: 'haiku-4-5',   color: '#fdab3d', agents: 6  },
  { id: 'VIS',        label: 'VIS',        fullName: 'Visibility Intelligence',   model: 'sonnet-4-6',  color: '#7f53f9', agents: 5  },
  { id: 'SENTINEL',   label: 'SENTINEL',   fullName: 'Security & Resilience',     model: 'opus-4-8',    color: '#e2445c', agents: 12 },
]

type FeedbackType = 'ACCEPTED' | 'DISMISSED' | 'CORRECTED'

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c', HIGH: '#fdab3d', NORMAL: '#059669',
}

const SCOLOR: Record<string, string> = {
  EQORE: '#2564ea', LEAD_INTEL: '#00c875', ALIS: '#fdab3d',
  VIS: '#7f53f9', SENTINEL: '#e2445c', KIMMP: '#7f53f9',
}

function ConfBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums" style={{ color }}>{value}%</span>
    </div>
  )
}

// ─── Systems sub-panel ────────────────────────────────────────────────────────

function KimmpSystemsPanel() {
  const qc = useQueryClient()
  const [runningSystem, setRunningSystem] = useState<string | null>(null)
  const [loopRunning, setLoopRunning]     = useState(false)
  const [triggerInput, setTriggerInput]   = useState('')
  const [lastBriefing, setLastBriefing]   = useState<Record<string, any>>({})

  const { data: history } = useQuery({
    queryKey: ['kimmp-history-brief'],
    queryFn:  () => api.get('/admin/kangqore-immp/systems/history?limit=10').then(r => r.data).catch(() => null),
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!history?.history) return
    const bySystem: Record<string, any> = {}
    for (const b of (history.history as any[])) {
      if (!bySystem[b.system]) bySystem[b.system] = b
    }
    setLastBriefing(bySystem)
  }, [history])

  async function runSystem(system: string) {
    setRunningSystem(system)
    try {
      await api.post(`/admin/kangqore-immp/systems/${system}/run`, {
        trigger: triggerInput || 'manual',
        input:   triggerInput || undefined,
      })
      qc.invalidateQueries({ queryKey: ['kimmp-history-brief'] })
      qc.invalidateQueries({ queryKey: ['kimmp-briefings'] })
    } finally { setRunningSystem(null) }
  }

  async function runLoop() {
    setLoopRunning(true)
    try {
      await api.post('/admin/kangqore-immp/loops/trigger', {
        trigger: triggerInput || 'loops.manual',
        input:   triggerInput || undefined,
      })
      qc.invalidateQueries({ queryKey: ['kimmp-history-brief'] })
      qc.invalidateQueries({ queryKey: ['kimmp-briefings'] })
    } finally { setLoopRunning(false) }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl px-6 py-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(37,100,234,0.15)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">WAANDA — Governed by KIMMP</p>
            <p className="text-xl font-bold" style={{ color: 'var(--os-text-1)' }}>5 Systems · 35 Agents · claude-opus-4-8</p>
            <p className="text-xs mt-1" style={{ color: 'var(--os-text-2)' }}>LEAD INTEL → ALIS → EQORE → VIS · SENTINEL always-on</p>
          </div>
          <button
            onClick={runLoop}
            disabled={loopRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold disabled:opacity-40"
            style={{ background: 'rgba(37,100,234,0.15)', border: '1px solid rgba(37,100,234,0.3)', color: '#2564ea' }}
          >
            <Play className={`w-4 h-4 ${loopRunning ? 'animate-spin' : ''}`} />
            {loopRunning ? 'Running LOOPS…' : 'Trigger LOOPS Cascade'}
          </button>
        </div>
        <input
          value={triggerInput}
          onChange={e => setTriggerInput(e.target.value)}
          placeholder="Optional context / input for this run…"
          className="w-full px-4 py-2.5 rounded-2xl text-sm outline-none"
          style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {KIMMP_SYSTEMS.map(sys => {
          const last  = lastBriefing[sys.id]
          const color = sys.color
          return (
            <div key={sys.id} className="rounded-2xl p-4 space-y-3" style={{ background: `${color}07`, border: `1px solid ${color}20` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{sys.label}</p>
                  <p className="text-[10px] truncate" style={{ color: 'var(--os-text-2)' }}>{sys.fullName}</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0" style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}>{sys.agents} agents</span>
              </div>
              <div className="text-[10px] text-slate-600 font-mono">{sys.model}</div>
              {last ? (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${color}90` }}>Last run · {timeAgo(last.createdAt)}</p>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">{last.summary}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: PRIORITY_COLOR[last.priority] ?? '#64748b', background: `${PRIORITY_COLOR[last.priority] ?? '#64748b'}15` }}>{last.priority}</span>
                    <ConfBar value={last.confidence ?? 0} color={color} />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600">No runs yet</p>
              )}
              <button
                onClick={() => runSystem(sys.id)}
                disabled={runningSystem === sys.id}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl text-xs font-bold disabled:opacity-40"
                style={{ color, background: `${color}12`, border: `1px solid ${color}28` }}
              >
                <Play className={`w-3 h-3 ${runningSystem === sys.id ? 'animate-spin' : ''}`} />
                {runningSystem === sys.id ? 'Running…' : `Run ${sys.label}`}
              </button>
            </div>
          )
        })}
        <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2564ea,#7f53f9)' }}>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>KIMMP / WAANDA</p>
              <p className="text-[10px]" style={{ color: 'var(--os-text-2)' }}>Governing Brain</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Governs all 5 systems. Synthesises every LOOPS cascade. Runs on claude-opus-4-8. Activates automatically at end of each cascade.</p>
          <div className="text-[10px] font-mono text-slate-600">claude-opus-4-8 · auto</div>
        </div>
      </div>
    </div>
  )
}

// ─── Briefings sub-panel ──────────────────────────────────────────────────────

function KimmpBriefingsPanel() {
  const qc = useQueryClient()
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [correcting, setCorrecting]     = useState<string | null>(null)
  const [correctionText, setCorrText]   = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['kimmp-briefings'],
    queryFn:  () => api.get('/admin/kangqore-immp/systems/history?limit=30').then(r => r.data).catch(() => null),
    staleTime: 30_000,
  })

  const feedbackMutation = useMutation({
    mutationFn: ({ id, feedback, correction }: { id: string; feedback: FeedbackType; correction?: string }) =>
      api.post(`/admin/kangqore-immp/systems/dispatch/${id}/feedback`, { feedback, correction }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kimmp-briefings'] })
      setCorrecting(null); setCorrText('')
    },
  })

  const briefings: any[] = data?.history ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{briefings.length} recent briefings — rate each to train the learning system</p>
        <ABtn icon={RefreshCw} label="Refresh" loading={isLoading} onClick={() => refetch()} color="#64748b" />
      </div>

      {briefings.length === 0 && !isLoading && (
        <div className="text-center py-16 text-slate-600 text-sm">No briefings yet — trigger a system run from the Systems tab</div>
      )}

      {briefings.map((b: any) => {
        const color    = SCOLOR[b.system] ?? '#64748b'
        const isOpen   = expanded === b.id
        const fbDone   = b.feedback
        const findings: string[] = b.keyFindings ?? []
        const alerts: string[]   = b.alerts ?? []
        return (
          <div key={b.id} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}20`, background: `${color}05` }}>
            <button className="w-full flex items-start gap-3 p-4 text-left" onClick={() => setExpanded(isOpen ? null : b.id)}>
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold" style={{ color: 'var(--os-text-1)' }}>{b.system}</span>
                  <span className="text-[10px] font-mono text-slate-600">{b.trigger}</span>
                  {b.priority && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: PRIORITY_COLOR[b.priority] ?? '#64748b', background: `${PRIORITY_COLOR[b.priority] ?? '#64748b'}15` }}>{b.priority}</span>}
                  {alerts.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-red-400 bg-red-400/10">{alerts.length} alert{alerts.length > 1 ? 's' : ''}</span>}
                  {fbDone && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: fbDone === 'ACCEPTED' ? '#059669' : fbDone === 'DISMISSED' ? '#e2445c' : '#fdab3d', background: fbDone === 'ACCEPTED' ? 'rgba(5,150,105,0.1)' : fbDone === 'DISMISSED' ? 'rgba(226,68,92,0.1)' : 'rgba(253,171,61,0.1)' }}>{fbDone}</span>}
                </div>
                <p className="text-xs leading-snug line-clamp-2" style={{ color: 'var(--os-text-2)' }}>{b.summary}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <ConfBar value={b.confidence ?? 0} color={color} />
                  <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(b.createdAt)}</span>
                </div>
              </div>
              {isOpen ? <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" /> : <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" />}
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: `${color}15` }}>
                {alerts.length > 0 && (
                  <div className="space-y-1.5 pt-3">
                    {alerts.map((a: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-2xl text-xs text-red-300" style={{ background: 'rgba(226,68,92,0.08)', border: '1px solid rgba(226,68,92,0.15)' }}>
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />{a}
                      </div>
                    ))}
                  </div>
                )}
                {findings.length > 0 && (
                  <div className="pt-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">Key Findings</p>
                    <div className="space-y-1.5">
                      {findings.map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {b.agentsRun?.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">Agents Run</p>
                    <div className="flex flex-wrap gap-1.5">
                      {b.agentsRun.map((a: string) => (
                        <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ color, background: `${color}12`, border: `1px solid ${color}20` }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {!fbDone && (
                  <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">Rate this briefing</p>
                    {correcting === b.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={correctionText}
                          onChange={e => setCorrText(e.target.value)}
                          placeholder="What should the system have done differently?"
                          rows={2}
                          className="w-full px-3 py-2 rounded-2xl text-xs outline-none resize-none"
                          style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => feedbackMutation.mutate({ id: b.id, feedback: 'CORRECTED', correction: correctionText })} disabled={!correctionText.trim() || feedbackMutation.isPending} className="px-3 py-1.5 rounded-2xl text-xs font-bold disabled:opacity-40" style={{ color: '#fdab3d', background: 'rgba(253,171,61,0.12)', border: '1px solid rgba(253,171,61,0.25)' }}>Submit Correction</button>
                          <button onClick={() => { setCorrecting(null); setCorrText('') }} className="px-3 py-1.5 rounded-2xl text-xs text-slate-500">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => feedbackMutation.mutate({ id: b.id, feedback: 'ACCEPTED' })} disabled={feedbackMutation.isPending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold disabled:opacity-40" style={{ color: '#059669', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}><CheckCircle2 className="w-3.5 h-3.5" /> Accept</button>
                        <button onClick={() => feedbackMutation.mutate({ id: b.id, feedback: 'DISMISSED' })} disabled={feedbackMutation.isPending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold disabled:opacity-40" style={{ color: '#e2445c', background: 'rgba(226,68,92,0.1)', border: '1px solid rgba(226,68,92,0.2)' }}><XCircle className="w-3.5 h-3.5" /> Dismiss</button>
                        <button onClick={() => setCorrecting(b.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold" style={{ color: '#fdab3d', background: 'rgba(253,171,61,0.1)', border: '1px solid rgba(253,171,61,0.2)' }}><AlertTriangle className="w-3.5 h-3.5" /> Correct</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Learning sub-panel ───────────────────────────────────────────────────────

function KimmpLearningPanel() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['kimmp-learning-summary'],
    queryFn:  () => api.get('/admin/kangqore-immp/systems/learning/summary').then(r => r.data).catch(() => null),
    staleTime: 60_000,
  })

  const summary: Record<string, any> = data?.summary ?? {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">How much each system has learned from operator feedback</p>
        <ABtn icon={RefreshCw} label="Refresh" loading={isLoading} onClick={() => refetch()} color="#64748b" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {KIMMP_SYSTEMS.map(sys => {
          const s     = summary[sys.id] ?? {}
          const color = SCOLOR[sys.id] ?? '#64748b'
          return (
            <div key={sys.id} className="rounded-2xl p-4 space-y-3" style={{ background: `${color}07`, border: `1px solid ${color}18` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-2xl flex items-center justify-center" style={{ background: color }}>
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{sys.label}</p>
                <span className="ml-auto text-[10px] font-bold" style={{ color: 'var(--os-text-2)' }}>{s.totalRecords ?? 0} runs</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl px-3 py-2 text-center" style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.12)' }}>
                  <p className="text-base font-bold text-emerald-400">{s.acceptanceRate ?? 0}%</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Accepted</p>
                </div>
                <div className="rounded-2xl px-3 py-2 text-center" style={{ background: 'rgba(226,68,92,0.08)', border: '1px solid rgba(226,68,92,0.12)' }}>
                  <p className="text-base font-bold text-red-400">{s.dismissalRate ?? 0}%</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Dismissed</p>
                </div>
                <div className="rounded-2xl px-3 py-2 text-center" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                  <p className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>{s.withFeedback ?? 0}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Rated</p>
                </div>
              </div>
              {(s.topAgents ?? []).length > 0 && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">Top Agents</p>
                  {(s.topAgents as any[]).slice(0, 3).map((a: any) => (
                    <div key={a.agentType} className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-slate-400 flex-1 truncate">{a.agentType}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: a.strength === 'STRONG' ? '#059669' : a.strength === 'MODERATE' ? '#fdab3d' : '#e2445c', background: a.strength === 'STRONG' ? 'rgba(5,150,105,0.1)' : 'rgba(253,171,61,0.1)' }}>{a.strength}</span>
                    </div>
                  ))}
                </div>
              )}
              {(s.triggerPatterns ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(s.triggerPatterns as string[]).slice(0, 4).map(p => (
                    <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-500" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>{p}</span>
                  ))}
                </div>
              )}
              {!s.totalRecords && <p className="text-xs text-slate-600">No runs yet</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Knowledge (RAG) sub-panel ────────────────────────────────────────────────

const RAG_DOC_TYPES: Record<string, string[]> = {
  EQORE:      ['meeting', 'client_note', 'action_item', 'conversation', 'org_knowledge'],
  LEAD_INTEL: ['scoring_rationale', 'deal_history', 'win_loss', 'tender', 'prospect_note'],
  ALIS:       ['playbook', 'sop', 'campaign_brief', 'workflow_template', 'performance_report'],
  VIS:        ['report', 'exec_summary', 'competitor_intel', 'market_research', 'strategy_doc'],
  SENTINEL:   ['cve', 'incident_report', 'compliance_doc', 'security_policy', 'audit_log'],
  KIMMP:      ['loop_synthesis', 'strategic_decision', 'cross_system_pattern', 'board_doc'],
}

function KimmpKnowledgePanel() {
  const qc = useQueryClient()
  const [selectedSys, setSelectedSys] = useState('EQORE')
  const [ingestForm, setIngestForm]   = useState({ docType: '', title: '', body: '', source: '' })
  const [showIngest, setShowIngest]   = useState(false)
  const [testQuery, setTestQuery]     = useState('')
  const [testResult, setTestResult]   = useState<any>(null)
  const [testLoading, setTestLoading] = useState(false)

  const color = SCOLOR[selectedSys] ?? '#64748b'

  const { data: ragStatus } = useQuery({
    queryKey: ['rag-status'],
    queryFn:  () => api.get('/admin/kangqore-immp/rag/status').then(r => r.data).catch(() => null),
    staleTime: 30_000,
  })

  const { data: docs, refetch: refetchDocs } = useQuery({
    queryKey: ['rag-docs', selectedSys],
    queryFn:  () => api.get(`/admin/kangqore-immp/rag/${selectedSys}?limit=20`).then(r => r.data).catch(() => null),
    staleTime: 30_000,
  })

  const ingestMutation = useMutation({
    mutationFn: (form: typeof ingestForm) =>
      api.post(`/admin/kangqore-immp/rag/${selectedSys}/ingest`, form),
    onSuccess: () => {
      setIngestForm({ docType: '', title: '', body: '', source: '' })
      setShowIngest(false)
      refetchDocs()
      qc.invalidateQueries({ queryKey: ['rag-status'] })
    },
  })

  async function testRetrieval() {
    if (!testQuery.trim()) return
    setTestLoading(true)
    try {
      const res = await api.post(`/admin/kangqore-immp/rag/${selectedSys}/retrieve`, { query: testQuery, topK: 3 })
      setTestResult(res.data)
    } finally { setTestLoading(false) }
  }

  const indexState = ragStatus?.indexState ?? {}
  const docList: any[] = docs?.docs ?? []
  const docTypes = RAG_DOC_TYPES[selectedSys] ?? []
  const ALL_RAG = ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL', 'KIMMP']

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {ALL_RAG.map(s => {
          const c  = SCOLOR[s] ?? '#64748b'
          const st = indexState[s] ?? {}
          return (
            <button key={s} onClick={() => setSelectedSys(s)} className="rounded-2xl px-3 py-2.5 text-center transition-all" style={{ background: s === selectedSys ? `${c}15` : 'rgba(255,255,255,0.02)', border: `1px solid ${s === selectedSys ? c : 'rgba(255,255,255,0.06)'}` }}>
              <p className="text-[10px] font-bold truncate" style={{ color: s === selectedSys ? c : '#64748b' }}>{s.replace('_', '_')}</p>
              <p className="text-base font-bold mt-0.5" style={{ color: 'var(--os-text-1)' }}>{st.chunks ?? 0}</p>
              <p className="text-[9px] text-slate-600">docs</p>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl p-4 space-y-4" style={{ background: `${color}07`, border: `1px solid ${color}18` }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: 'var(--os-text-1)' }}>{selectedSys} Knowledge Base</p>
          <button onClick={() => setShowIngest(v => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold" style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>+ Ingest Document</button>
        </div>

        {showIngest && (
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: `${color}15` }}>
            <div className="grid grid-cols-2 gap-3">
              <select value={ingestForm.docType} onChange={e => setIngestForm(f => ({ ...f, docType: e.target.value }))} className="px-3 py-2 rounded-2xl text-xs outline-none" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }}>
                <option value="">Doc Type *</option>
                {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={ingestForm.source} onChange={e => setIngestForm(f => ({ ...f, source: e.target.value }))} placeholder="Source (optional)" className="px-3 py-2 rounded-2xl text-xs outline-none" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }} />
            </div>
            <input value={ingestForm.title} onChange={e => setIngestForm(f => ({ ...f, title: e.target.value }))} placeholder="Title *" className="w-full px-3 py-2 rounded-2xl text-xs outline-none" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }} />
            <textarea value={ingestForm.body} onChange={e => setIngestForm(f => ({ ...f, body: e.target.value }))} placeholder="Document content *" rows={4} className="w-full px-3 py-2 rounded-2xl text-xs outline-none resize-none" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }} />
            <button onClick={() => ingestMutation.mutate(ingestForm)} disabled={!ingestForm.title || !ingestForm.body || !ingestForm.docType || ingestMutation.isPending} className="px-4 py-2 rounded-2xl text-xs font-bold disabled:opacity-40" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
              {ingestMutation.isPending ? 'Embedding…' : 'Ingest & Embed'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Test Retrieval</p>
          <div className="flex gap-2">
            <input value={testQuery} onChange={e => setTestQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && testRetrieval()} placeholder="Query the knowledge base…" className="flex-1 px-3 py-2 rounded-2xl text-xs outline-none" style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-1)' }} />
            <button onClick={testRetrieval} disabled={testLoading || !testQuery.trim()} className="px-3 py-2 rounded-2xl text-xs font-bold disabled:opacity-40" style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>
              {testLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </div>
          {testResult && (
            <div className="rounded-2xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold text-slate-500">{testResult.chunkCount} chunk{testResult.chunkCount !== 1 ? 's' : ''} retrieved</p>
              {(testResult.chunks ?? []).map((c: any, i: number) => (
                <div key={i} className="px-3 py-2 rounded-2xl" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                  <p className="text-[10px] font-bold text-white mb-0.5">[{c.docType}] {c.title}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{c.body}</p>
                  <p className="text-[9px] text-slate-600 mt-1">Score: {(c.score * 100).toFixed(1)}%{c.source ? ` · ${c.source}` : ''}</p>
                </div>
              ))}
              {testResult.chunkCount === 0 && <p className="text-xs text-slate-600">No matches — add documents or trigger system runs first</p>}
            </div>
          )}
        </div>

        {docList.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600 mb-2">{docList.length} documents indexed</p>
            <div className="space-y-1.5">
              {docList.map((d: any) => (
                <div key={d.id} className="flex items-center gap-3 px-3 py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0" style={{ color, background: `${color}12` }}>{d.docType}</span>
                  <p className="text-xs text-slate-300 flex-1 truncate">{d.title}</p>
                  <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(d.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {docList.length === 0 && <p className="text-xs text-slate-600 text-center py-4">No documents yet — ingest content above or trigger system runs (briefings auto-index)</p>}
      </div>
    </div>
  )
}

// ─── KIMMP root tab ───────────────────────────────────────────────────────────

type KimmpSubTab = 'systems' | 'briefings' | 'learning' | 'knowledge'

function KimmpTab() {
  const [sub, setSub] = useState<KimmpSubTab>('systems')

  const SUB_TABS: { id: KimmpSubTab; label: string; icon: any }[] = [
    { id: 'systems',   label: 'Systems',   icon: Server    },
    { id: 'briefings', label: 'Briefings', icon: Activity  },
    { id: 'learning',  label: 'Learning',  icon: BarChart3 },
    { id: 'knowledge', label: 'Knowledge', icon: Database  },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'rgba(37,100,234,0.15)' }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#2564ea,#7f53f9)' }}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold" style={{ color: 'var(--os-text-1)' }}>KIMMP / WAANDA</h2>
          <p className="text-xs" style={{ color: 'var(--os-text-2)' }}>AI-Governed Intelligence Systems · 5 LLMs · 35 Agents</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {SUB_TABS.map(t => (
            <button key={t.id} onClick={() => setSub(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all" style={{ color: sub === t.id ? '#2564ea' : '#64748b', background: sub === t.id ? 'rgba(37,100,234,0.12)' : 'transparent', border: `1px solid ${sub === t.id ? 'rgba(37,100,234,0.3)' : 'transparent'}` }}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>
      </div>
      {sub === 'systems'   && <KimmpSystemsPanel />}
      {sub === 'briefings' && <KimmpBriefingsPanel />}
      {sub === 'learning'  && <KimmpLearningPanel />}
      {sub === 'knowledge' && <KimmpKnowledgePanel />}
    </div>
  )
}

// ─── Infrastructure Tab ───────────────────────────────────────────────────────

interface InfraService {
  name:       string
  status:     SysStatus
  latencyMs:  number | null
  uptime:     number | null
  detail:     string
  sparkline?: number[]
}

function MiniSparkline({ values }: { values: number[] }) {
  if (!values.length) return null
  const max  = Math.max(...values, 1)
  const w    = 80
  const h    = 24
  const pts  = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`).join(' ')
  const last = values[values.length - 1]
  const col  = last < 200 ? '#10b981' : last < 800 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity={0.7} />
      <circle cx={(w)} cy={h - (last / max) * h} r="2.5" fill={col} />
    </svg>
  )
}

function InfraServiceCard({ svc }: { svc: InfraService }) {
  const cfg = STATUS_CFG[svc.status]
  const Icon = cfg.icon
  const latCol = svc.latencyMs == null ? '#64748b'
    : svc.latencyMs < 200 ? '#10b981'
    : svc.latencyMs < 800 ? '#f59e0b'
    : '#ef4444'

  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--os-text-1)]">{svc.name}</p>
          <p className="text-[11px] text-[var(--os-text-3)] mt-0.5">{svc.detail}</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
          style={{ color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30` }}>
          <Icon className="w-3 h-3" />{cfg.label}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--os-text-3)] mb-0.5">Latency</p>
              <p className="text-sm font-bold tabular-nums" style={{ color: latCol }}>
                {svc.latencyMs != null ? `${svc.latencyMs}ms` : '—'}
              </p>
            </div>
            {svc.uptime != null && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--os-text-3)] mb-0.5">Uptime</p>
                <p className="text-sm font-bold tabular-nums text-[var(--os-text-1)]">{svc.uptime.toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>
        {svc.sparkline && <MiniSparkline values={svc.sparkline} />}
      </div>
    </div>
  )
}

function InfraTab() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['infra-health'],
    queryFn:  () => api.get('/admin/systems/infra/health').then(r => r.data).catch(() => null),
    staleTime: 15_000,
    refetchInterval: 30_000,
  })

  const services: InfraService[] = data?.services ?? [
    { name: 'PostgreSQL',     status: data?.db?.status      ?? 'unknown', latencyMs: data?.db?.latencyMs      ?? null, uptime: data?.db?.uptime      ?? 99.98, detail: 'Primary database · connection pool',   sparkline: data?.db?.sparkline      ?? [] },
    { name: 'API Server',     status: data?.api?.status     ?? 'unknown', latencyMs: data?.api?.latencyMs     ?? null, uptime: data?.api?.uptime     ?? 99.91, detail: 'Express REST + auth layer',              sparkline: data?.api?.sparkline     ?? [] },
    { name: 'Socket.io',      status: data?.socket?.status  ?? 'unknown', latencyMs: data?.socket?.latencyMs  ?? null, uptime: data?.socket?.uptime  ?? null,  detail: 'WebSocket · real-time event bus',        sparkline: data?.socket?.sparkline  ?? [] },
    { name: 'KIMMP Runtime',  status: data?.kimmp?.status   ?? 'unknown', latencyMs: data?.kimmp?.latencyMs   ?? null, uptime: data?.kimmp?.uptime   ?? null,  detail: '80-agent swarm · MissionDispatcher',    sparkline: data?.kimmp?.sparkline   ?? [] },
  ]

  const healthy    = services.filter(s => s.status === 'ok').length
  const degraded   = services.filter(s => s.status === 'degraded').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-bold text-[var(--os-text-1)]">Infrastructure Health</h2>
            <p className="text-[11px] text-[var(--os-text-3)] mt-0.5">
              {healthy}/{services.length} services healthy
              {degraded > 0 && <span className="text-amber-400 ml-2">· {degraded} degraded</span>}
            </p>
          </div>
        </div>
        <button onClick={() => refetch()} disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] disabled:opacity-40">
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl animate-pulse bg-[var(--os-surface-0)]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {services.map(svc => <InfraServiceCard key={svc.name} svc={svc} />)}
        </div>
      )}

      {data?.connectedClients != null && (
        <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-5 py-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Socket Clients', value: data.connectedClients, color: '#14b8a6' },
              { label: 'Events / min',   value: data.eventsPerMin     ?? '—', color: '#a78bfa' },
              { label: 'Queue Depth',    value: data.queueDepth       ?? '—', color: '#f59e0b' },
              { label: 'Active Agents',  value: data.activeAgents     ?? '—', color: '#22c55e' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--os-text-3)] mb-1">{m.label}</p>
                <p className="text-xl font-black tabular-nums" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { path: '',           end: true,  label: 'Overview',          icon: LayoutGrid    },
  { path: 'eqore',     end: false, label: 'eQORE',              icon: MessageSquare },
  { path: 'lead-intel', end: false, label: 'Lead Intelligence', icon: Zap           },
  { path: 'alis',      end: false, label: 'ALIS',               icon: TrendingUp    },
  { path: 'vis',       end: false, label: 'VIS',                icon: Globe         },
  { path: 'kimmp',       end: false, label: 'KIMMP',        icon: Brain  },
  { path: 'data-fabric', end: false, label: 'Data Fabric',   icon: Radio  },
  { path: 'infra',       end: false, label: 'Infrastructure', icon: Server },
]

const ACCENT: Record<string, string> = {
  '':           '#64748b',
  'eqore':      '#7c3aed',
  'lead-intel': '#2564ea',
  'alis':       '#059669',
  'vis':        '#0ea5e9',
  'kimmp':      '#2564ea',
  'data-fabric': '#00c875',
  'infra':      '#14b8a6',
}

export function SystemsModule() {
  const { pathname } = useLocation()
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
          <h1 className="text-[22px] font-black tracking-tight flex items-center gap-2.5" style={{ color: 'var(--os-text-1)' }}>
            <Server className="w-5 h-5" style={{ color: '#2564ea' }} />
            Systems Monitor
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>Live health, metrics and controls for all Kangqore sub-systems</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Clock className="w-3 h-3" />
            Last refreshed {timeAgo(lastRefreshed.toISOString())}
          </div>
          <Ticker interval={60} onTick={refreshAll} />
          <button
            onClick={refreshAll}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-2xl"
            style={{ background: 'rgba(37,100,234,0.10)', border: '1px solid rgba(37,100,234,0.25)', color: '#2564ea' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 -mb-1 overflow-x-auto scrollbar-none" style={{ borderBottom: '1px solid var(--os-border)' }}>
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
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
          <Route path="kimmp"         element={<KimmpTab />} />
          <Route path="data-fabric"   element={<DataFabricTab />} />
          <Route path="infra"         element={<InfraTab />} />
          <Route path="*"             element={<Navigate to={BASE} replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
