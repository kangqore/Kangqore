import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Briefcase, TrendingUp,
  Target, LayoutDashboard, Activity, Users, DollarSign,
  Brain, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, RefreshCw, BarChart3, Shield, Crosshair,
  Calendar,
} from 'lucide-react'
import { api } from '@lib/api'
import { staggerContainer, staggerChild, spring, tween, fadeScale, float } from '@os/motion'

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
  return <div className={`animate-pulse rounded-lg bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 ${className}`} />
}

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
        background: 'linear-gradient(135deg, rgba(13,17,23,0.4) 0%, rgba(10,15,30,0.5) 50%, rgba(6,11,24,0.6) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 40px rgba(37,100,234,0.15)',
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#2564ea 1px, transparent 1px), linear-gradient(90deg, #2564ea 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: '#2bbdff', transform: 'translate(30%, -30%)' }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-3">
          <div>
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase mb-1">{formatDate()}</p>
            <h1 className="text-3xl font-bold tracking-tight text-os-cyan" style={{ fontFamily: 'var(--font-display, inherit)' }}>
              {getGreeting()}, Mahesh
            </h1>
          </div>

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

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/kangqore-view/admin/leads')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-os-cyan transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-95"
            style={{ background: '#2564ea', boxShadow: '0 2px 12px rgba(37,100,234,0.4)' }}
          >
            <Zap className="w-3.5 h-3.5" /> New Lead
          </button>
          <button
            onClick={() => navigate('/kangqore-view/admin/projects')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 border border-slate-700 bg-os-cyan/10 hover:bg-os-cyan/20 hover:border-slate-600 transition-all duration-150 active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> New Project
          </button>
          <button
            onClick={() => navigate('/kangqore-view/admin/WAANDA')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 hover:opacity-90 hover:scale-[1.02] active:scale-95"
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
  { key: 'MRR',      icon: TrendingUp,   color: '#2564ea', getValue: (k: any)        => k == null ? null : k.revenueMTD       > 0 ? `₹${fmt(k.revenueMTD)} Cr`              : '₹0', sub: 'Month to date' },
  { key: 'ARR',      icon: BarChart3,    color: '#7c3aed', getValue: (k: any)        => k == null ? null : k.arr              > 0 ? `₹${fmt(k.arr)} Cr`                      : '₹0', sub: 'Annualised'    },
  { key: 'Revenue',  icon: DollarSign,   color: '#059669', getValue: (k: any)        => k == null ? null : k.revenueLastMonth > 0 ? `₹${fmt(k.revenueLastMonth)} Cr`         : '₹0', sub: 'Last month'    },
  { key: 'Pipeline', icon: Zap,          color: '#d97706', getValue: (k: any)        => k == null ? null : k.pipelineValue    > 0 ? `₹${(k.pipelineValue/1e7).toFixed(1)} Cr` : '₹0', sub: 'Active deals' },
  { key: 'Clients',  icon: Briefcase,    color: '#0ea5e9', getValue: (_: any, a: any) => a == null ? null : a.clients         > 0 ? String(a.clients)                         : '0',  sub: 'Active'        },
  { key: 'Team',     icon: Users,        color: '#6366f1', getValue: (k: any, a: any) => {
    if (k == null && a == null) return null
    const v = a?.total_users ?? k?.totalTeam ?? 0
    return v > 0 ? String(v) : '0'
  }, sub: 'Members' },
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
            className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded-xl border border-white/10 border-t-white/20 px-4 py-4 hover:shadow-lg hover:shadow-[#4ab6d4]/10 cursor-pointer group"
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
            ) : val != null ? (
              <AnimatePresence mode="wait">
                <motion.p
                  key={val}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring.snappy, opacity: { ...tween.fast } }}
                  className="text-xl font-bold leading-none tracking-tight"
                  style={{ color: val === '₹0' || val === '0' ? '#475569' : '#ffffff' }}
                >
                  {val}
                </motion.p>
              </AnimatePresence>
            ) : (
              <p className="text-xl font-bold leading-none" style={{ color: '#1e293b' }}>—</p>
            )}
            <p className="text-[10px] mt-1.5" style={{ color: val === '₹0' ? '#334155' : '#64748b' }}>
              {val === '₹0' ? 'No activity yet' : def.sub}
            </p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Status Bar ───────────────────────────────────────────────────────────────

const STAGE_ORDER = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']
const STAGE_COLOR: Record<string, string> = {
  NEW: '#2564ea', CONTACTED: '#0ea5e9', QUALIFIED: '#7c3aed',
  PROPOSAL: '#f59e0b', NEGOTIATION: '#f97316', WON: '#10b981', LOST: '#ef4444',
}

function StatusBar({ navigate }: { navigate: (p: string) => void }) {
  const { data: kimmpHealth } = useQuery({
    queryKey: ['kimmp-health'],
    queryFn:  () => api.get('/admin/kangqore-immp/health').then(r => r.data),
    staleTime: 120_000,
  })
  const { data: leadsRaw } = useQuery({
    queryKey: ['home-leads-summary'],
    queryFn:  () => api.get('/admin/eqore/leads', { params: { limit: 200 } }).then(r => r.data),
    staleTime: 60_000,
  })
  const { data: aegisData } = useQuery({
    queryKey: ['aegis-summary'],
    queryFn:  () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: consultData } = useQuery({
    queryKey: ['home-consult-summary'],
    queryFn:  () => api.get('/consultations', { params: { limit: 100 } }).then(r => r.data),
    staleTime: 60_000,
  })

  // Lead pipeline distribution
  const allLeads: any[] = leadsRaw?.leads ?? (Array.isArray(leadsRaw) ? leadsRaw : [])
  const stageCounts = STAGE_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = allLeads.filter(l => (l.status ?? l.stage ?? 'NEW') === s).length
    return acc
  }, {})
  const totalLeads = allLeads.length
  const activeLeads = allLeads.filter(l => !['WON','LOST'].includes(l.status ?? l.stage ?? '')).length

  // KIMMP status
  const kimmpOk      = kimmpHealth?.status === 'OK'
  const kimmpVersion = kimmpHealth?.version ?? '—'
  const tier2        = kimmpHealth?.tier2   === 'ENABLED'

  // AEGIS
  const aegisVerdict   = aegisData?.overallVerdict ?? null
  const aegisScore     = aegisData?.healthScore    ?? null
  const aegisCritical  = aegisData?.critical24h    ?? 0
  const aegisEngines   = aegisData?.engines        ?? []
  const aegisChecked   = aegisEngines.filter((e: any) => e.latest).length

  // Consultations
  const consults    = consultData?.consultations ?? []
  const totalC      = consultData?.pagination?.total ?? consults.length
  const pendingC    = consults.filter((c: any) => (c.status ?? 'PENDING') === 'PENDING').length
  const confirmedC  = consults.filter((c: any) => c.status === 'CONFIRMED').length

  const AEGIS_VS: Record<string, { color: string; label: string }> = {
    PASS:     { color: '#10b981', label: 'All Clear'  },
    WARN:     { color: '#f59e0b', label: 'Warnings'   },
    CRITICAL: { color: '#ef4444', label: 'Critical'   },
  }
  const avs = aegisVerdict ? (AEGIS_VS[aegisVerdict] ?? AEGIS_VS.PASS) : null

  const CARD = 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10'

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
    >
      {/* Card 1: KIMMP Health */}
      <motion.div
        variants={staggerChild}
        onClick={() => navigate('/kangqore-view/admin/kangqore-immp')}
        className={`${CARD} rounded-xl p-4 cursor-pointer hover:ring-white/20 transition-all`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">KIMMP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: kimmpOk ? '#10b981' : kimmpHealth ? '#ef4444' : '#334155' }}
            />
            <span className="text-[9px] font-semibold text-slate-500">
              {kimmpHealth ? (kimmpOk ? 'ONLINE' : 'OFFLINE') : '—'}
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Version</span>
            <span className="text-[10px] font-mono font-bold text-slate-300">{kimmpVersion}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Tier 2 AI</span>
            <span className="text-[10px] font-semibold text-slate-300">
              {kimmpHealth ? (tier2 ? 'Active' : 'Inactive') : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Intelligence</span>
            <span className="text-[10px] font-semibold text-slate-300">WAANDA</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Lead Pipeline */}
      <motion.div
        variants={staggerChild}
        onClick={() => navigate('/kangqore-view/admin/leads')}
        className={`${CARD} rounded-xl p-4 cursor-pointer hover:ring-white/20 transition-all`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pipeline</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white">{totalLeads}</span>
            <span className="text-[9px] text-slate-600 ml-1">leads</span>
          </div>
        </div>
        {totalLeads === 0 ? (
          <p className="text-[10px] text-slate-700 text-center py-2">No leads yet</p>
        ) : (
          <div className="space-y-1.5">
            <div className="flex h-1 rounded-full overflow-hidden gap-px">
              {STAGE_ORDER.filter(s => stageCounts[s] > 0).map(s => (
                <div
                  key={s}
                  className="h-full transition-all duration-700"
                  style={{ width: `${(stageCounts[s] / totalLeads) * 100}%`, background: STAGE_COLOR[s] }}
                  title={`${s}: ${stageCounts[s]}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {STAGE_ORDER.filter(s => stageCounts[s] > 0).slice(0, 4).map(s => (
                <div key={s} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STAGE_COLOR[s] }} />
                  <span className="text-[9px] text-slate-600">{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                  <span className="text-[9px] font-bold text-slate-300">{stageCounts[s]}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-600 mt-1">{activeLeads} active · {stageCounts.WON ?? 0} won</p>
          </div>
        )}
      </motion.div>

      {/* Card 3: AEGIS Corps */}
      <motion.div
        variants={staggerChild}
        onClick={() => navigate('/kangqore-view/admin/aegis')}
        className={`${CARD} rounded-xl p-4 cursor-pointer hover:ring-white/20 transition-all`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">AEGIS</span>
          </div>
          {avs ? (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: avs.color }} />
              <span className="text-[9px] font-semibold text-slate-400">{avs.label}</span>
            </div>
          ) : (
            <span className="text-[9px] text-slate-700">—</span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Agent Corps</span>
            <span className="text-[10px] font-bold text-slate-300">80 agents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Engines checked</span>
            <span className="text-[10px] font-bold text-slate-300">{aegisChecked}/10</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Health score</span>
            <span className="text-[10px] font-bold text-slate-300">
              {aegisScore != null ? `${aegisScore}/100` : '—'}
            </span>
          </div>
          {aegisCritical > 0 && (
            <div className="flex items-center gap-1 mt-1 rounded-md px-2 py-1 bg-white/5 border border-white/10">
              <AlertTriangle className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-[9px] font-semibold text-slate-400">{aegisCritical} critical in 24h</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card 4: Consultations Queue */}
      <motion.div
        variants={staggerChild}
        onClick={() => navigate('/kangqore-view/admin/consultations')}
        className={`${CARD} rounded-xl p-4 cursor-pointer hover:ring-white/20 transition-all`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Consultations</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white">{totalC}</span>
            <span className="text-[9px] text-slate-600 ml-1">total</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Pending review</span>
            <span className="text-[10px] font-semibold text-slate-300">{pendingC > 0 ? pendingC : '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Confirmed</span>
            <span className="text-[10px] font-semibold text-slate-300">{confirmedC > 0 ? confirmedC : '—'}</span>
          </div>
          {totalC === 0 && (
            <p className="text-[10px] text-slate-700 text-center pt-1">No consultations yet</p>
          )}
          {pendingC > 0 && (
            <div className="flex items-center gap-1 mt-1 rounded-md px-2 py-1 bg-white/5 border border-white/10">
              <Clock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="text-[9px] font-semibold text-slate-500">{pendingC} awaiting response</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── AEGIS Security Pulse ────────────────────────────────────────────────────

const VERDICT_STYLE: Record<string, { color: string; label: string; bg: string }> = {
  PASS:     { color: '#10b981', label: 'All Clear',   bg: '#10b98115' },
  WARN:     { color: '#f59e0b', label: 'Warnings',    bg: '#f59e0b15' },
  CRITICAL: { color: '#ef4444', label: 'Critical',    bg: '#ef444415' },
}

function AegisPulse({ navigate }: { navigate: (p: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['aegis-summary'],
    queryFn:  () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })

  const verdict     = data?.overallVerdict ?? 'PASS'
  const healthScore = data?.healthScore    ?? null
  const critical24h = data?.critical24h    ?? 0
  const warn24h     = data?.warn24h        ?? 0
  const engines     = data?.engines        ?? []
  const vs          = VERDICT_STYLE[verdict] ?? VERDICT_STYLE.PASS

  const passEngines     = engines.filter((e: any) => e.latest?.verdict === 'PASS').length
  const criticalEngines = engines.filter((e: any) => e.latest?.verdict === 'CRITICAL').length
  const warnEngines     = engines.filter((e: any) => e.latest?.verdict === 'WARN').length
  const totalEngines    = engines.length || 10

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 border border-white/10 border-t-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/5">
            <Shield className="w-3 h-3 text-slate-400" />
          </div>
          AEGIS Shield
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/aegis')}
          className="text-xs font-medium text-slate-500 hover:text-slate-300 flex items-center gap-0.5 transition-colors"
        >
          Open <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonLight className="h-10 w-full" />
          <SkeletonLight className="h-3 w-full" />
          <SkeletonLight className="h-16 w-full" />
        </div>
      ) : (
        <>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: vs.bg, border: `1px solid ${vs.color}25` }}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: vs.color, boxShadow: `0 0 8px ${vs.color}` }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: vs.color }}>{vs.label}</p>
              <p className="text-[10px] text-slate-500">
                {critical24h > 0 ? `${critical24h} critical` : warn24h > 0 ? `${warn24h} warnings` : 'No active threats'}
                {' '}· 24h window
              </p>
            </div>
            {healthScore != null && (
              <span className="text-lg font-bold flex-shrink-0" style={{ color: healthScore >= 70 ? '#10b981' : healthScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                {healthScore}
              </span>
            )}
          </div>

          {healthScore != null && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Health Score</span>
                <span className="text-[10px] font-bold text-slate-400">{healthScore}/100</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${healthScore}%`,
                    background: healthScore >= 70 ? '#10b981' : healthScore >= 40 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Pass', count: passEngines,     color: '#10b981' },
              { label: 'Warn', count: warnEngines,     color: '#f59e0b' },
              { label: 'Crit', count: criticalEngines, color: '#ef4444' },
            ].map(e => (
              <div key={e.label} className="rounded-lg py-2" style={{ background: `${e.color}08` }}>
                <p className="text-base font-bold" style={{ color: e.color }}>{e.count}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: `${e.color}80` }}>{e.label}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-600 text-center">
            {totalEngines} engines · {engines.filter((e: any) => e.latest).length} checked
          </p>
        </>
      )}
    </div>
  )
}

// ─── BIDS™ Snapshot ───────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#10b981', DRAFT: '#64748b', PAUSED: '#f59e0b', COMPLETED: '#7c3aed',
}

function BidsSnapshot({ navigate }: { navigate: (p: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['bids-engagements-home'],
    queryFn:  () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 60_000,
  })

  const engagements = (data?.engagements ?? []).slice(0, 4)
  const stats       = data?.stats ?? {}
  const total       = stats.total  ?? 0
  const active      = stats.ACTIVE ?? 0

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 border border-white/10 border-t-white/10 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/5">
            <Crosshair className="w-3 h-3 text-slate-400" />
          </div>
          BIDS™
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/bids')}
          className="text-xs font-medium text-slate-500 hover:text-slate-300 flex items-center gap-0.5 transition-colors"
        >
          Open <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <SkeletonLight className="h-10 w-full" />
          <SkeletonLight className="h-8 w-full" />
          <SkeletonLight className="h-8 w-full" />
        </div>
      ) : total === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-6 text-center" variants={fadeScale} initial="hidden" animate="visible">
          <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-white/5 border border-white/10">
            <Crosshair className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-1">No engagements yet</p>
          <p className="text-[10px] text-slate-600 mb-3 max-w-[140px] leading-relaxed">
            Launch your first Business Diagnostic Intelligence assessment
          </p>
          <button
            onClick={() => navigate('/kangqore-view/admin/bids/engagements')}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
          >
            Start Assessment
          </button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl px-3 py-2.5 bg-white/5 border border-white/10">
              <p className="text-lg font-bold text-slate-200">{active}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Active</p>
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-lg font-bold text-slate-300">{total}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Total</p>
            </div>
          </div>

          <ul className="space-y-2">
            {engagements.map((e: any) => {
              const done  = (e.deliverables ?? []).filter((d: any) => d.status === 'COMPLETE').length
              const tot   = (e.deliverables ?? []).length || 10
              const pct   = Math.round((done / tot) * 100)
              const col   = STATUS_COLOR[e.status] ?? '#64748b'
              return (
                <li key={e.id} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-[11px] font-semibold text-slate-200 truncate flex-1">{e.clientName}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ color: col, background: `${col}15` }}>
                      {e.status}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#f59e0b' }} />
                  </div>
                  <p className="text-[9px] text-slate-600 mt-1">{done}/{tot} deliverables</p>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
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
    <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-white/10 border-t-white/20 rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center">
            <Target className="w-3 h-3 text-slate-400" />
          </div>
          My Focus
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-0.5 font-medium"
        >
          All goals <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {goalsLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <SkeletonLight key={i} className="h-12 w-full" />)}
        </div>
      ) : goals.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-8 text-center"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center bg-white/5 border border-white/10"
            variants={float}
            animate="float"
          >
            <Target className="w-6 h-6 text-slate-500" />
          </motion.div>
          <p className="text-sm font-semibold text-white mb-1.5">Nothing in focus yet</p>
          <p className="text-xs text-slate-500 max-w-[190px] leading-relaxed">
            Set a goal to track what matters — progress shows here as you move.
          </p>
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/5 transition-all duration-150 active:scale-95"
          >
            <Target className="w-3 h-3" />
            Create a goal
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
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
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
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
          <div className="h-px bg-slate-800" />
          <div>
            <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Pending Approvals
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500">{approvals.length}</span>
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
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold hover:underline flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
  const allZero = twinData ? TWIN_DIMS.every(d => (twinData[d.key] ?? 0) === 0) : false

  const SEV_STYLE: Record<string, { color: string }> = {
    CRITICAL: { color: '#ef4444' },
    HIGH:     { color: '#f97316' },
    MODERATE: { color: '#f59e0b' },
    LOW:      { color: '#64748b' },
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl ring-1 ring-white/10 border border-white/10 border-t-white/10 rounded-2xl p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-white/5">
            <Brain className="w-3 h-3 text-slate-400" />
          </div>
          WAANDA Live
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/WAANDA')}
          className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-0.5"
        >
          Mission Control <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {twinData ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Digital Twin · Health Matrix</p>
            {allZero && (
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-700 animate-pulse">Calibrating</span>
            )}
          </div>
          {TWIN_DIMS.map(d => {
            const val = twinData[d.key] ?? 0
            return (
              <div key={d.key} className="flex items-center gap-2">
                <span className="text-[10px] w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.label}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(10,15,30,0.5)' }}>
                  {allZero ? (
                    <div className="h-full w-full rounded-full animate-pulse bg-white/5" />
                  ) : (
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(val, 100)}%`, background: d.color, boxShadow: `0 0 6px ${d.color}60` }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-mono w-6 text-right flex-shrink-0" style={{ color: allZero ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)' }}>
                  {allZero ? '·' : val}
                </span>
              </div>
            )
          })}
          {allZero && (
            <p className="text-[10px] leading-relaxed pt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Health model builds from your live signals. Accurate within 24h.
            </p>
          )}
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

      {alerts.length > 0 && (
        <>
          <div className="h-px" style={{ background: 'rgba(10,15,30,0.5)' }} />
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Proactive Alerts</p>
            {alerts.map((a: any) => {
              const style = SEV_STYLE[a.severity] ?? SEV_STYLE.LOW
              return (
                <div key={a.id} className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: 'rgba(13,17,23,0.4)', border: '1px solid rgba(10,15,30,0.5)' }}>
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

      {signals.length > 0 && (
        <>
          <div className="h-px" style={{ background: 'rgba(10,15,30,0.5)' }} />
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Signal Stream</p>
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
        <motion.div
          className="flex flex-col items-center justify-center py-6 text-center"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
        >
          <div className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center bg-white/5 border border-white/10">
            <Brain className="w-5 h-5 animate-pulse text-slate-600" />
          </div>
          <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>WAANDA is waking up</p>
          <p className="text-[10px] mt-1 max-w-[160px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>Intelligence arrives with your first signals</p>
        </motion.div>
      )}
    </div>
  )
}

// ─── CRM Summary Bar ──────────────────────────────────────────────────────────

const LEAD_STAGE_COLOR: Record<string, string> = {
  NEW: '#2564ea', CONTACTED: '#0ea5e9', QUALIFIED: '#7c3aed',
  PROPOSAL: '#f59e0b', NEGOTIATION: '#f97316', WON: '#10b981', LOST: '#ef4444',
}

function CrmSummaryBar({ navigate }: { navigate: (p: string) => void }) {
  const { data: leadsData } = useQuery({
    queryKey: ['home-leads-summary'],
    queryFn:  () => api.get('/admin/eqore/leads', { params: { limit: 3 } }).then(r => r.data),
    staleTime: 60_000,
  })
  const { data: consultData } = useQuery({
    queryKey: ['home-consult-summary'],
    queryFn:  () => api.get('/consultations', { params: { limit: 3 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const leads         = leadsData?.leads         ?? (Array.isArray(leadsData) ? leadsData : [])
  const consultations = consultData?.consultations ?? []
  const totalLeads    = leadsData?.total          ?? leads.length
  const totalConsults = consultData?.pagination?.total ?? consultData?.total ?? consultations.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-slate-500" />
            Recent Leads
            {totalLeads > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">{totalLeads}</span>
            )}
          </h3>
          <button
            onClick={() => navigate('/kangqore-view/admin/leads')}
            className="text-xs font-medium text-slate-500 hover:text-slate-300 flex items-center gap-0.5 transition-colors"
          >
            All leads <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {leads.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <Zap className="w-6 h-6 text-slate-800 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No leads yet</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {leads.slice(0, 3).map((l: any) => {
              const stage = l.stage ?? l.status ?? 'NEW'
              const col = LEAD_STAGE_COLOR[stage] ?? '#64748b'
              return (
                <li key={l.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs" style={{ background: `${col}18`, color: col }}>
                    {(l.name ?? l.companyName ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{l.name ?? l.companyName ?? l.email}</p>
                    <p className="text-[10px] text-slate-500 truncate">{l.email}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ color: col, background: `${col}15` }}>
                    {stage}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Consultations
            {totalConsults > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">{totalConsults}</span>
            )}
          </h3>
          <button
            onClick={() => navigate('/kangqore-view/admin/consultations')}
            className="text-xs font-medium text-slate-500 hover:text-slate-300 flex items-center gap-0.5 transition-colors"
          >
            All bookings <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {consultations.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <Calendar className="w-6 h-6 text-slate-800 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No consultations yet</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {consultations.slice(0, 3).map((c: any) => {
              const scheduled = c.scheduledAt ? new Date(c.scheduledAt) : null
              return (
                <li key={c.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/10">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{c.name ?? c.email}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {scheduled
                        ? scheduled.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : 'Unscheduled'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                    c.status === 'CONFIRMED' ? 'text-slate-300 bg-white/5' :
                    c.status === 'PENDING'   ? 'text-slate-400 bg-white/5' :
                    'text-slate-600 bg-white/5'
                  }`}>
                    {c.status ?? 'PENDING'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

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
    <div className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border-white/10 border-t-white/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          Recent Activity
        </h3>
        <button
          onClick={() => refetch()}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-300 transition-colors"
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
          <CheckCircle2 className="w-8 h-8 text-slate-700 mb-3" />
          <p className="text-sm font-medium text-slate-500">No signals yet</p>
          <p className="text-xs text-slate-600 mt-1">WAANDA will surface intelligence here as it learns.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-800" />
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
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-semibold">{s.module}</span>
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
      {/* 1. Hero banner */}
      <Hero kpis={kpis} analytics={analytics} twinData={twinData} kpisLoading={kpisLoading} navigate={navigate} />

      {/* 2. KPI strip */}
      <KpiStrip kpis={kpis} analytics={analytics} loading={kpisLoading} />

      {/* 3. Status bar — KIMMP, Pipeline, AEGIS, Consultations */}
      <StatusBar navigate={navigate} />

      {/* 4. Middle row — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[44fr_32fr_24fr] gap-4 mb-6">
        <MyFocusPanel navigate={navigate} />
        <WaandaLivePanel navigate={navigate} />
        <div className="flex flex-col gap-4">
          <AegisPulse navigate={navigate} />
          <BidsSnapshot navigate={navigate} />
        </div>
      </div>

      {/* 5. CRM snapshot — Leads + Consultations */}
      <CrmSummaryBar navigate={navigate} />

      {/* 6. Activity Feed */}
      <ActivityFeed />
    </div>
  )
}
