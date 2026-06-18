import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Zap, Briefcase, CalendarClock, Inbox, Handshake, TrendingUp,
  Target, LayoutDashboard, Activity, Scale, Users, DollarSign,
  Brain, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, RefreshCw, BarChart3, Radar,
} from 'lucide-react'
import { api } from '@lib/api'
import { staggerContainer, staggerChild, spring } from '@os/motion'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function fmt(n: number) {
  return (n / 1e7).toFixed(2)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-os-cyan/20 ${className}`} />
}

function SkeletonLight({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-os-s1 ${className}`} />
}

// ─── Module board config ──────────────────────────────────────────────────────

const MODULES = [
  { id: 'leads',         label: 'Leads',         icon: Zap,             path: '/kangqore-view/admin/leads',         accent: '#2564ea' },
  { id: 'clients',       label: 'Clients',        icon: Briefcase,       path: '/kangqore-view/admin/clients',       accent: '#059669' },
  { id: 'consultations', label: 'Consultations',  icon: CalendarClock,   path: '/kangqore-view/admin/consultations', accent: '#7c3aed' },
  { id: 'comms',         label: 'Comms',          icon: Inbox,           path: '/kangqore-view/admin/comms',         accent: '#d97706' },
  { id: 'partners',      label: 'Partners',       icon: Handshake,       path: '/kangqore-view/admin/partners',      accent: '#db2777' },
  { id: 'projects',      label: 'Projects',       icon: LayoutDashboard, path: '/kangqore-view/admin/projects',      accent: '#0ea5e9' },
  { id: 'finance',       label: 'Finance',        icon: DollarSign,      path: '/kangqore-view/admin/finance',       accent: '#059669' },
  { id: 'strategy',      label: 'Strategy',       icon: Target,          path: '/kangqore-view/admin/strategy',      accent: '#f59e0b' },
  { id: 'delivery',      label: 'Delivery',       icon: Activity,        path: '/kangqore-view/admin/delivery',      accent: '#6366f1' },
  { id: 'governance',    label: 'Governance',     icon: Scale,           path: '/kangqore-view/admin/governance',    accent: '#64748b' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({
  kpis, analytics, twinData, kpisLoading, navigate,
}: {
  kpis: any; analytics: any; twinData: any; kpisLoading: boolean; navigate: (p: string) => void
}) {
  const score = twinData?.overallScore ?? 0
  const healthLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : score > 0 ? 'At Risk' : null
  const healthColor = score >= 70 ? '#00c875' : score >= 40 ? '#fdab3d' : '#e2445c'

  const mrrCr   = kpis?.revenueMTD    > 0 ? `₹${fmt(kpis.revenueMTD)} Cr`             : null
  const clients  = analytics?.clients  > 0 ? analytics.clients                          : null
  const pipeline = kpis?.pipelineValue > 0 ? `₹${(kpis.pipelineValue / 1e7).toFixed(1)} Cr` : null

  return (
    <div
      className="rounded-2xl mb-6 px-8 py-7 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #0a0f1e 50%, #060b18 100%)',
        boxShadow: '0 4px 40px rgba(37,100,234,0.15)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#2564ea 1px, transparent 1px), linear-gradient(90deg, #2564ea 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow accent */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: '#2bbdff', transform: 'translate(30%, -30%)' }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-1">{formatDate()}</p>
            <h1 className="text-3xl font-bold text-os-cyan tracking-tight" style={{ fontFamily: 'var(--font-display, inherit)' }}>
              {getGreeting()}, Mahesh
            </h1>
          </div>

          {/* Live status pills */}
          <div className="flex flex-wrap items-center gap-2">
            {healthLabel && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
                style={{ color: healthColor, borderColor: `${healthColor}40`, background: `${healthColor}12` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthColor }} />
                WAANDA {healthLabel} · {score}/100
              </span>
            )}
            {kpisLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : mrrCr ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-[#2bbdff] border border-[#2bbdff]/20 bg-[#2bbdff]/8">
                <TrendingUp className="w-3 h-3" /> MRR {mrrCr}
              </span>
            ) : null}
            {clients ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700 bg-os-cyan/10">
                <Briefcase className="w-3 h-3" /> {clients} Clients
              </span>
            ) : null}
            {pipeline ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700 bg-os-cyan/10">
                <Zap className="w-3 h-3" /> Pipeline {pipeline}
              </span>
            ) : null}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/kangqore-view/admin/leads')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-os-cyan transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#2564ea', boxShadow: '0 2px 12px rgba(37,100,234,0.4)' }}
          >
            <Zap className="w-3.5 h-3.5" /> New Lead
          </button>
          <button
            onClick={() => navigate('/kangqore-view/admin/projects')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 border border-slate-700 bg-os-cyan/10 hover:bg-os-cyan/20 transition-all active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> New Project
          </button>
          <button
            onClick={() => navigate('/kangqore-view/admin/WAANDA')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ color: '#2bbdff', border: '1px solid rgba(43,189,255,0.3)', background: 'rgba(43,189,255,0.08)', boxShadow: '0 2px 12px rgba(43,189,255,0.15)' }}
          >
            <Brain className="w-3.5 h-3.5" /> Waanda.AI
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── KPI strip ────────────────────────────────────────────────────────────────

const KPI_DEFS = [
  { key: 'MRR',      icon: TrendingUp,   color: '#2564ea', getValue: (k: any) => k?.revenueMTD       > 0 ? `₹${fmt(k.revenueMTD)} Cr`              : null, sub: 'Month to date'   },
  { key: 'ARR',      icon: BarChart3,    color: '#7c3aed', getValue: (k: any) => k?.arr              > 0 ? `₹${fmt(k.arr)} Cr`                      : null, sub: 'Annualised'      },
  { key: 'Revenue',  icon: DollarSign,   color: '#059669', getValue: (k: any) => k?.revenueLastMonth > 0 ? `₹${fmt(k.revenueLastMonth)} Cr`         : null, sub: 'Last month'      },
  { key: 'Pipeline', icon: Zap,          color: '#d97706', getValue: (k: any) => k?.pipelineValue    > 0 ? `₹${(k.pipelineValue/1e7).toFixed(1)} Cr` : null, sub: 'Active deals'   },
  { key: 'Clients',  icon: Briefcase,    color: '#0ea5e9', getValue: (_: any, a: any) => a?.clients  > 0 ? String(a.clients)                         : null, sub: 'Active'         },
  { key: 'Team',     icon: Users,        color: '#6366f1', getValue: (k: any, a: any) => (a?.total_users ?? k?.totalTeam ?? 0) > 0 ? String(a?.total_users ?? k?.totalTeam) : null, sub: 'Members' },
]

function KpiStrip({ kpis, analytics, loading }: { kpis: any; analytics: any; loading: boolean }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
      variants={staggerContainer(0.05)}
      initial="hidden"
      animate="visible"
    >
      {KPI_DEFS.map(def => {
        const Icon = def.icon
        const val = loading ? null : def.getValue(kpis, analytics)
        return (
          <motion.div
            key={def.key}
            variants={staggerChild}
            whileHover={{ y: -3, transition: spring.smooth }}
            className="bg-os-s1 rounded-xl border border-os-border px-4 py-4 hover:shadow-lg hover:shadow-[#4ab6d4]/10 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{def.key}</p>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ background: `${def.color}18` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: def.color }} />
              </div>
            </div>
            {loading ? (
              <SkeletonLight className="h-7 w-24 mb-1" />
            ) : val ? (
              <p className="text-xl font-bold text-white leading-none tracking-tight">{val}</p>
            ) : (
              <p className="text-xl font-bold text-slate-300 leading-none">—</p>
            )}
            <p className="text-[10px] text-slate-500 mt-1.5">{def.sub}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── My Focus panel ───────────────────────────────────────────────────────────

function MyFocusPanel({ navigate }: { navigate: (p: string) => void }) {
  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['dashboard-goals'],
    queryFn: () => api.get('/admin/kangqore-immp/goals', { params: { limit: 4 } }).then(r => r.data),
    staleTime: 120_000,
  })
  const { data: approvalsData } = useQuery({
    queryKey: ['kimmp-approvals'],
    queryFn: () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    staleTime: 60_000,
  })

  const goals     = goalsData?.goals     ?? []
  const approvals = (approvalsData?.approvals ?? []).slice(0, 3)

  return (
    <div className="bg-os-s1 border-os-border rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-os-blue/10 flex items-center justify-center">
            <Target className="w-3 h-3 text-os-blue" />
          </div>
          My Focus
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
          className="text-xs text-os-blue hover:underline flex items-center gap-0.5 font-medium"
        >
          All goals <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {goalsLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <SkeletonLight key={i} className="h-12 w-full" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">No active goals</p>
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
            className="mt-3 text-xs text-os-blue font-semibold hover:underline"
          >
            Set your first goal →
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {goals.map((g: any) => {
            const pct      = Math.round((g.currentValue / Math.max(g.targetValue, 1)) * 100)
            const barColor = pct >= 70 ? '#059669' : pct >= 40 ? '#d97706' : '#e2445c'
            return (
              <li key={g.id}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold text-slate-200 truncate flex-1">{g.title}</p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{ color: barColor, background: `${barColor}15` }}
                  >
                    {g.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="h-1.5 bg-os-s1 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{pct}% of target</p>
              </li>
            )
          })}
        </ul>
      )}

      {approvals.length > 0 && (
        <>
          <div className="h-px bg-os-s1" />
          <div>
            <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Pending Approvals
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600">{approvals.length}</span>
            </p>
            <ul className="space-y-2.5">
              {approvals.map((a: any) => (
                <li key={a.id} className="flex items-start gap-2 group">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 leading-snug truncate">{a.description ?? a.actionType}</p>
                    <p className="text-[10px] text-slate-500">{timeAgo(a.requestedAt ?? a.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/admin/kangqore-immp/actions')}
                    className="text-[10px] text-os-blue font-semibold hover:underline flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Review
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

// ─── WAANDA Live panel ────────────────────────────────────────────────────────

function WaandaLivePanel({ navigate }: { navigate: (p: string) => void }) {
  const { data: alertsData } = useQuery({
    queryKey: ['proactive-alerts'],
    queryFn: () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: twinData } = useQuery({
    queryKey: ['kimmp-twin'],
    queryFn: () => api.get('/admin/kangqore-immp/twin/current').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: signalData } = useQuery({
    queryKey: ['dashboard-signals'],
    queryFn: () => api.get('/admin/kangqore-immp/signals', { params: { limit: 5 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const alerts  = (alertsData?.alerts  ?? []).slice(0, 3)
  const signals = (signalData?.signals ?? []).slice(0, 4)

  const TWIN_DIMS = [
    { key: 'overallScore',      label: 'Overall',   color: '#2564ea' },
    { key: 'revenueHealth',     label: 'Revenue',   color: '#059669' },
    { key: 'pipelineVelocity',  label: 'Pipeline',  color: '#7c3aed' },
    { key: 'marketPosition',    label: 'Market',    color: '#d97706' },
    { key: 'executionCapacity', label: 'Execution', color: '#0ea5e9' },
    { key: 'riskExposure',      label: 'Risk',      color: '#ef4444' },
  ]

  const SEV_STYLE: Record<string, { color: string }> = {
    CRITICAL: { color: '#ef4444' },
    HIGH:     { color: '#f97316' },
    MODERATE: { color: '#f59e0b' },
    LOW:      { color: '#64748b' },
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{ background: 'linear-gradient(160deg, #0d1117 0%, #0a0f1e 100%)', border: '1px solid rgba(37,100,234,0.2)' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-os-cyan flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'rgba(43,189,255,0.15)' }}>
            <Brain className="w-3 h-3" style={{ color: '#2bbdff' }} />
          </div>
          WAANDA Live
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/WAANDA')}
          className="text-xs font-medium hover:opacity-80 transition-opacity flex items-center gap-0.5"
          style={{ color: '#2bbdff' }}
        >
          Mission Control <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Twin health bars */}
      {twinData ? (
        <div className="space-y-2.5">
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(43,189,255,0.5)' }}>Digital Twin · Health Matrix</p>
          {TWIN_DIMS.map(d => {
            const val = twinData[d.key] ?? 0
            return (
              <div key={d.key} className="flex items-center gap-2">
                <span className="text-[10px] w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.label}</span>
                <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(val, 100)}%`, background: d.color, boxShadow: `0 0 6px ${d.color}60` }}
                  />
                </div>
                <span className="text-[10px] font-mono w-6 text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{val}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-14 h-3" />
              <Skeleton className="flex-1 h-1" />
              <Skeleton className="w-5 h-3" />
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(43,189,255,0.5)' }}>Proactive Alerts</p>
            {alerts.map((a: any) => {
              const style = SEV_STYLE[a.severity] ?? SEV_STYLE.LOW
              return (
                <div key={a.id} className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: style.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.8)' }}>{a.message}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{a.severity} · {timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Signal stream */}
      {signals.length > 0 && (
        <>
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(43,189,255,0.5)' }}>Signal Stream</p>
            {signals.map((s: any) => (
              <div key={s.id} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#2bbdff' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.title}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.category} · {timeAgo(s.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!twinData && alerts.length === 0 && signals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Brain className="w-8 h-8 mb-3" style={{ color: 'rgba(43,189,255,0.2)' }} />
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>WAANDA is initialising…</p>
        </div>
      )}
    </div>
  )
}

// ─── Module board ─────────────────────────────────────────────────────────────

function ModuleBoard({ navigate }: { navigate: (p: string) => void }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-3.5 h-3.5 text-slate-500" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace</h3>
      </div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5"
        variants={staggerContainer(0.04)}
        initial="hidden"
        animate="visible"
      >
        {MODULES.map(m => {
          const Icon = m.icon
          return (
            <motion.button
              key={m.id}
              variants={staggerChild}
              whileHover={{ y: -3, transition: spring.smooth }}
              whileTap={{ scale: 0.97, transition: spring.snappy }}
              onClick={() => navigate(m.path)}
              className="group relative flex items-center gap-3 px-4 py-3 bg-os-s1 rounded-xl border border-os-border hover:border-os-cyan/50 hover:shadow-lg hover:shadow-[#4ab6d4]/10 text-left overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: `linear-gradient(135deg, ${m.accent}08 0%, ${m.accent}04 100%)` }}
              />
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 relative z-10"
                style={{ background: `${m.accent}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: m.accent }} />
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors relative z-10">{m.label}</span>
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-l-xl"
                style={{ background: m.accent }}
              />
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─── Activity feed ────────────────────────────────────────────────────────────

function ActivityFeed() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-signals'],
    queryFn: () => api.get('/admin/kangqore-immp/signals', { params: { limit: 8 } }).then(r => r.data),
    staleTime: 60_000,
  })
  const signals: any[] = data?.signals ?? []

  const PRIORITY_COLOR: Record<string, string> = {
    critical: '#ef4444', high: '#f97316', medium: '#2564ea', low: '#94a3b8',
  }

  return (
    <div className="bg-os-s1 border-os-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          Recent Activity
        </h3>
        <button
          onClick={() => refetch()}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-os-s1 hover:text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex gap-3">
              <SkeletonLight className="w-3 h-3 rounded-full mt-1 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <SkeletonLight className="h-4 w-3/4" />
                <SkeletonLight className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : signals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="w-8 h-8 text-slate-200 mb-3" />
          <p className="text-sm font-medium text-slate-500">No signals yet</p>
          <p className="text-xs text-slate-300 mt-1">WAANDA will surface intelligence here as it learns.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-os-s1" />
          <ul className="space-y-5 pl-5">
            {signals.map((s: any) => (
              <li key={s.id} className="relative group">
                <span
                  className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-os-s1 flex-shrink-0 transition-transform group-hover:scale-125"
                  style={{ background: PRIORITY_COLOR[s.priority] ?? '#94a3b8' }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 leading-snug">{s.title}</p>
                    {s.summary && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.summary}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      {s.module && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-os-s1 text-slate-300 font-semibold">{s.module}</span>
                      )}
                      {s.category && (
                        <span className="text-[10px] text-slate-500">{s.category}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 flex-shrink-0 pt-1 whitespace-nowrap">{timeAgo(s.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DashboardHome() {
  const navigate = useNavigate()

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
  const { data: analytics } = useQuery({
    queryKey: ['ov-analytics'],
    queryFn: () => api.get('/analytics').then(r => r.data),
    staleTime: 120_000,
  })
  const { data: twinData } = useQuery({
    queryKey: ['kimmp-twin'],
    queryFn: () => api.get('/admin/kangqore-immp/twin/current').then(r => r.data),
    staleTime: 60_000,
  })

  return (
    <div className="max-w-[1400px]">
      <Hero kpis={kpis} analytics={analytics} twinData={twinData} kpisLoading={kpisLoading} navigate={navigate} />
      <KpiStrip kpis={kpis} analytics={analytics} loading={kpisLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-4 mb-6">
        <MyFocusPanel navigate={navigate} />
        <WaandaLivePanel navigate={navigate} />
      </div>

      <ModuleBoard navigate={navigate} />
      <ActivityFeed />
    </div>
  )
}
