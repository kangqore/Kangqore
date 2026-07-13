import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Briefcase, TrendingUp, Target, LayoutDashboard, Activity,
  Users, DollarSign, Brain, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, RefreshCw, BarChart3, Shield, Crosshair, Calendar, Sparkles
} from 'lucide-react'
import { api } from '@lib/api'
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import { staggerContainer, staggerChild, spring, fadeScale, float } from '@os/motion'

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

// ─── Skeletons ────────────────────────────────────────────────────────────────

function SkeletonLight({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: 'linear-gradient(90deg, rgba(37,100,234,0.07) 0%, rgba(37,100,234,0.13) 50%, rgba(37,100,234,0.07) 100%)', backgroundSize: '400px 100%' }}
    />
  )
}

// ─── Color Constants ──────────────────────────────────────────────────────────

const STAGE_ORDER = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']

const STAGE_CARD_COLOR: Record<string, string> = {
  NEW: '#579bfc', CONTACTED: '#00c875', QUALIFIED: '#fdab3d',
  PROPOSAL: '#7c3aed', NEGOTIATION: '#323338', WON: '#00c875', LOST: '#e2445c',
}

const PIPELINE_CFG: Record<string, { bg: string }> = {
  NEW:         { bg: '#579bfc' },
  CONTACTED:   { bg: '#00c875' },
  QUALIFIED:   { bg: '#fdab3d' },
  PROPOSAL:    { bg: '#7c3aed' },
  NEGOTIATION: { bg: '#323338' },
  WON:         { bg: '#10b981' },
  LOST:        { bg: '#e2445c' },
}

const VERDICT_CFG: Record<string, { color: string; label: string }> = {
  PASS:     { color: '#00c875', label: 'All Clear'  },
  WARN:     { color: '#fdab3d', label: 'Warnings'   },
  CRITICAL: { color: '#e2445c', label: 'Critical'   },
}

// ─── Shared card style ────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'var(--os-card)',
  border: '1px solid var(--os-border)',
  borderRadius: 'var(--os-radius-xl)',
  boxShadow: 'var(--os-shadow-card)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({
  twinData, navigate,
}: {
  twinData: any; navigate: (p: string) => void
}) {
  const score       = twinData?.overallScore ?? 0
  const healthLabel = score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : score > 0 ? 'At Risk' : null
  const healthColor = score >= 70 ? '#00c875' : score >= 40 ? '#fdab3d' : '#e2445c'

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 px-1"
    >
      {/* Avatar + greeting */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white"
            style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)', fontSize: 16, border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 2px 8px rgba(29,78,216,0.30)' }}
          >
            C.E
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00c875] rounded-full border-2 border-white dark:border-black" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--os-text-2)' }}>
            {formatDate()}
          </p>
          <h1 className="text-[22px] font-black tracking-tight leading-none mb-1" style={{ color: 'var(--os-text-1)' }}>
            {getGreeting()}, C.O.D.E.
          </h1>
          <div className="flex items-center gap-2">
            {healthLabel && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white border-none shadow-sm"
                style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
                WAANDA {healthLabel} · {score}/100
              </span>
            )}
            <span className="text-[10px] font-medium" style={{ color: 'var(--os-text-3)' }}>
              · Synced {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => navigate('/kangqore-view/admin/leads')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all hover:-translate-y-1 border-none"
          style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)', boxShadow: '0 8px 24px rgba(217,119,6,0.35)' }}
        >
          <Zap className="w-3.5 h-3.5" /> New Lead
        </button>
        <button
          onClick={() => navigate('/kangqore-view/admin/projects')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all hover:-translate-y-1 border-none"
          style={{ background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}
        >
          <Briefcase className="w-3.5 h-3.5" /> New Project
        </button>
        <button
          onClick={() => navigate('/kangqore-view/admin/WAANDA')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold text-white transition-all hover:-translate-y-1 border-none"
          style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #1D4ED8 100%)', boxShadow: '0 8px 24px rgba(29,78,216,0.35)' }}
        >
          <Brain className="w-3.5 h-3.5" /> WAANDA
        </button>
      </div>
    </div>
  )
}

// ─── KPI Bar ──────────────────────────────────────────────────────────────────

const KPI_DEFS = [
  { key: 'MRR',      icon: Sparkles,  color: '#3B82F6', bgGradient: 'linear-gradient(135deg, #DBEAFE 0%, #3B82F6 100%)', textColor: '#1e3a8a', subTextColor: '#1e3a8ab3', sub: 'Month to date',
    getValue: (k: any, _a: any) => k == null ? null : k.revenueMTD       > 0 ? `₹${fmt(k.revenueMTD)} Cr`              : '₹0',
    getDelta: (k: any) => k?.mrrDeltaPct },
  { key: 'ARR',      icon: BarChart3,   color: '#d97706', bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', sub: 'Annualised',
    getValue: (k: any, _a: any) => k == null ? null : k.arr              > 0 ? `₹${fmt(k.arr)} Cr`                      : '₹0',
    getDelta: (k: any) => k?.mrrDeltaPct },
  { key: 'Revenue',  icon: DollarSign,  color: '#0d9488', bgGradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', sub: 'Last month',
    getValue: (k: any, _a: any) => k == null ? null : k.revenueLastMonth > 0 ? `₹${fmt(k.revenueLastMonth)} Cr`         : '₹0',
    getDelta: () => 4 }, // Hardcoded for demo
  { key: 'Pipeline', icon: Zap,         color: '#e11d48', bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', sub: 'Active deals',
    getValue: (k: any, _a: any) => k == null ? null : k.pipelineValue    > 0 ? `₹${(k.pipelineValue/1e7).toFixed(1)} Cr` : '₹0',
    getDelta: () => 18 },
  { key: 'Clients',  icon: Briefcase,   color: '#c026d3', bgGradient: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)', sub: 'Active',
    getValue: (_k: any, a: any) => a == null ? null : a.clients          > 0 ? String(a.clients)                         : '0',
    getDelta: () => 2 },
  { key: 'Team',     icon: Users,       color: '#4f46e5', bgGradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', sub: 'Members',
    getValue: (k: any, a: any) => { if (k == null && a == null) return null; const v = a?.total_users ?? k?.totalTeam ?? 0; return v > 0 ? String(v) : '0' },
    getDelta: () => 1 },
]

function KpiBar({ kpis, analytics, loading }: { kpis: any; analytics: any; loading: boolean }) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-7"
    >
      {KPI_DEFS.map(def => {
        const Icon = def.icon
        const val = loading ? null : def.getValue(kpis, analytics)
        const isEmpty = val === '₹0' || val === '0'
        const isPositive = !isEmpty && val != null
        return (
          <motion.div
            key={def.key}
            whileHover={{ y: -4, scale: 1.01, transition: spring.smooth }}
            className="cursor-pointer relative overflow-hidden flex flex-col p-5 transition-all duration-300"
            style={{ 
              background: def.bgGradient, 
              color: def.textColor || 'var(--os-text-1)',
              borderRadius: 'var(--os-radius-xl)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
              border: '1px solid rgba(255,255,255,0.6)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Top row: Icon + Delta */}
            <div className="flex items-center justify-between mb-4">
              <Icon 
                style={{ width: 24, height: 24, color: def.textColor || def.color }} 
                stroke={def.textColor || def.color}
                fill="none"
              />
              
              {/* Delta badge */}
              {isPositive ? (() => {
                const delta = def.getDelta ? def.getDelta(kpis, analytics) : null;
                const isDeltaPos = delta != null && delta >= 0;
                if (delta == null) return null;
                return (
                  <span
                    className="font-extrabold px-2.5 py-1 rounded-full shadow-sm"
                    style={{
                      fontSize: 10,
                      background: isDeltaPos ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                      color: isDeltaPos ? '#047857' : '#b91c1c'
                    }}
                  >
                    {isDeltaPos ? '+' : ''}{delta}% m/m
                  </span>
                )
              })() : (!loading && val === null) ? (
                <span
                  className="font-semibold px-2.5 py-1 rounded-full"
                  style={{ fontSize: 10, background: '#f3f4f6', color: '#6b7280' }}
                >
                  No data
                </span>
              ) : null}
            </div>

            {/* Value */}
            {loading ? (
              <div className="animate-pulse rounded-xl mb-1" style={{ background: 'rgba(0,0,0,0.05)', height: 36, width: '70%' }} />
            ) : val != null ? (
              <AnimatePresence mode="wait">
                <motion.p
                  key={val}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-black tracking-tight leading-none mb-1"
                  style={{
                    color: def.textColor || 'var(--os-text-1)',
                    fontSize: val.length > 7 ? 22 : 28,
                  }}
                >
                  {val}
                </motion.p>
              </AnimatePresence>
            ) : (
              <p className="font-black tracking-tight leading-none mb-1"
                 style={{ fontSize: 28, color: def.subTextColor || 'var(--os-text-3)', letterSpacing: '-0.02em' }}>
                —
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-1">
              <p className="font-bold tracking-tight m-0"
                 style={{ fontSize: 13, color: def.textColor || 'var(--os-text-1)' }}>
                {def.key}
              </p>
              <p className="font-medium m-0"
                 style={{ fontSize: 12, color: def.subTextColor || 'var(--os-text-3)' }}>
                · {def.sub}
              </p>
            </div>
            
            {/* Sparkline */}
            {!loading && val != null && (
              <svg viewBox="0 0 100 20" style={{ width: '100%', height: 16, marginTop: 8, opacity: 0.6 }}>
                <path d="M0,15 C20,10 30,18 50,8 C70,-2 80,5 100,2" fill="none" stroke={def.textColor || def.color} strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// ─── Work Queue (Left Column) ─────────────────────────────────────────────────

type WQTab = 'pipeline' | 'today' | 'won'

function WorkQueuePanel({ navigate }: { navigate: (p: string) => void }) {
  const [tab, setTab] = useState<WQTab>('pipeline')

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
  const { data: consultData } = useQuery({
    queryKey: ['home-consult-summary'],
    queryFn:  () => api.get('/consultations', { params: { limit: 100 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const allLeads: any[]  = leadsRaw?.leads ?? (Array.isArray(leadsRaw) ? leadsRaw : [])
  const kimmpOk          = kimmpHealth?.status === 'OK'
  const kimmpVersion     = kimmpHealth?.version ?? '—'
  const tier2            = kimmpHealth?.tier2 === 'ENABLED'
  const totalConsults    = consultData?.pagination?.total ?? (consultData?.consultations ?? []).length
  const pendingConsults  = (consultData?.consultations ?? []).filter((c: any) => (c.status ?? 'PENDING') === 'PENDING').length

  const displayLeads =
    tab === 'pipeline' ? allLeads.filter(l => !['WON','LOST'].includes(l.status ?? l.stage ?? '')).slice(0, 6)
    : tab === 'today'  ? allLeads.filter(l => { const d = new Date(l.createdAt ?? ''); const n = new Date(); return d.toDateString() === n.toDateString() }).slice(0, 6)
    :                    allLeads.filter(l => (l.status ?? l.stage) === 'WON').slice(0, 6)

  const TABS: { id: WQTab; label: string }[] = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'today',    label: 'Today'    },
    { id: 'won',      label: 'Won'      },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>
          Work Queue
        </p>
        <span className="text-[11px] font-bold" style={{ color: 'var(--os-text-3)' }}>
          {allLeads.length} leads
        </span>
      </div>

      {/* Tab strip */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 rounded-lg text-[11px] font-bold py-1.5 transition-all text-center"
            style={tab === t.id
              ? { background: 'var(--os-card)', color: 'var(--os-text-1)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
              : { color: 'var(--os-text-2)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Lead cards — solid colored backgrounds */}
      {displayLeads.length === 0 ? (
        <div className="rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2"
             style={{ background: 'rgba(37,100,234,0.04)', border: '1px dashed rgba(37,100,234,0.20)', minHeight: 120 }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
               style={{ background: 'rgba(37,100,234,0.10)' }}>
            <Zap className="w-5 h-5" style={{ color: '#2564ea' }} />
          </div>
          <p className="text-[12px] font-semibold" style={{ color: 'var(--os-text-2)' }}>No leads in this view</p>
          <p className="text-[11px]" style={{ color: 'var(--os-text-3)' }}>Add a lead to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayLeads.map((l: any) => {
            const stage = (l.status ?? l.stage ?? 'NEW').toUpperCase()
            const score = l.score ?? l.leadScore ?? 0
            const name  = l.name || l.companyName || l.email || 'Lead'
            const company = l.companyName || l.company || ''
            const color = STAGE_CARD_COLOR[stage] ?? '#579bfc'
            return (
              <motion.div
                key={l.id}
                whileHover={{ x: 4, scale: 1.01, transition: { duration: 0.1 } }}
                onClick={() => navigate('/kangqore-view/admin/leads')}
                className="p-5 cursor-pointer transition-all"
                style={{
                  background: color, color: '#fff',
                  borderRadius: 'var(--os-radius-xl)',
                  height: 120, boxShadow: `0 12px 32px ${color}50`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold truncate leading-snug">{name}</p>
                    {company && <p className="truncate mt-0.5" style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{company}</p>}
                  </div>
                  {score > 0 && (
                    <span className="font-extrabold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ fontSize: 10, background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                      {score}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wide" style={{ fontSize: 10, color: 'rgba(255,255,255,0.92)' }}>{stage}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>{l.createdAt ? timeAgo(l.createdAt) : ''}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Consultations pill */}
      <div
        onClick={() => navigate('/kangqore-view/admin/consultations')}
        className="os-card p-3 cursor-pointer flex items-center gap-3 hover:translate-x-1 rounded-xl transition-all"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#0ea5e914' }}>
          <Calendar className="w-4 h-4" style={{ color: '#0ea5e9' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--os-text-1)' }}>Consultations</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>
            {totalConsults} total · {pendingConsults > 0 ? `${pendingConsults} pending` : 'none pending'}
          </p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-text-3)' }} />
      </div>

      {/* KIMMP status */}
      <div className="os-card p-3 flex items-center gap-3 rounded-xl">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0`}
             style={{ background: kimmpOk ? '#00c87514' : 'var(--os-surface-0)' }}>
          <Brain className="w-4 h-4" style={{ color: kimmpOk ? '#00c875' : 'var(--os-text-3)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold leading-tight" style={{ color: 'var(--os-text-1)' }}>KIMMP v{kimmpVersion}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>Tier 2: {kimmpHealth ? (tier2 ? 'Active' : 'Inactive') : '—'}</p>
        </div>
        <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: kimmpHealth ? (kimmpOk ? '#00c875' : '#e2445c') : 'var(--os-text-3)' }} />
      </div>
    </div>
  )
}

// ─── Pipeline Kanban (Center top) ─────────────────────────────────────────────

function PipelineKanban({ navigate, leads }: { navigate: (p: string) => void; leads: any[] }) {
  const allLeads: any[] = leads

  // Sort leads by score descending, then date
  const sortedLeads = [...allLeads].sort((a, b) => {
    const scoreA = a.score ?? a.leadScore ?? 0
    const scoreB = b.score ?? b.leadScore ?? 0
    if (scoreB !== scoreA) return scoreB - scoreA
    return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  })

  return (
    <div className="os-card p-5 rounded-2xl">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Zap style={{ width: 14, height: 14, color: '#fdab3d' }} />
          Lead Pipeline
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/leads')}
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          All leads <ArrowRight style={{ width: 11, height: 11 }} />
        </button>
      </div>

      {sortedLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(37,100,234,0.08)', border: '1px solid rgba(37,100,234,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 22, height: 22, color: '#2564ea' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 3px' }}>No leads yet</p>
            <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: 0 }}>Your pipeline will appear here once you add leads</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" style={{ minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--os-border)' }}>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>Name & Company</th>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-text-3)' }}>Stage</th>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: 'var(--os-text-3)' }}>Score</th>
                <th className="pb-3 text-[11px] font-bold uppercase tracking-wider text-right" style={{ color: 'var(--os-text-3)' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.slice(0, 5).map((l: any) => {
                const stage = (l.status ?? l.stage ?? 'NEW').toUpperCase()
                const cfg = PIPELINE_CFG[stage] ?? PIPELINE_CFG.NEW
                const name = l.name ?? l.companyName ?? l.email ?? 'Lead'
                const company = l.companyName ?? l.company ?? '—'
                const score = l.score ?? l.leadScore ?? 0
                const val = l.projectedValue ?? l.value ?? 0
                const formattedVal = val > 0 ? `₹${val.toLocaleString('en-IN')}` : '—'
                
                return (
                  <tr 
                    key={l.id}
                    onClick={() => navigate('/kangqore-view/admin/leads')}
                    className="group cursor-pointer hover:bg-slate-200/30 dark:hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid var(--os-border)' }}
                  >
                    <td className="py-3 pr-3">
                      <p className="text-[12px] font-bold m-0 truncate max-w-[180px]" style={{ color: 'var(--os-text-1)' }}>{name}</p>
                      <p className="text-[10px] m-0 mt-0.5 truncate max-w-[180px]" style={{ color: 'var(--os-text-3)' }}>{company}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <span 
                        className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        {stage}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-center">
                      {score > 0 ? (
                        <span 
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black"
                          style={{
                            background: score >= 80 ? 'rgba(0, 200, 117, 0.12)' : 'rgba(87, 155, 252, 0.12)',
                            color: score >= 80 ? '#00c875' : '#579bfc',
                          }}
                        >
                          {score}
                        </span>
                      ) : (
                        <span className="text-[11px]" style={{ color: 'var(--os-text-3)' }}>—</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-[12px] font-bold" style={{ color: 'var(--os-text-1)' }}>
                      {formattedVal}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {sortedLeads.length > 5 && (
            <div className="pt-3 text-center">
              <button 
                onClick={() => navigate('/kangqore-view/admin/leads')}
                className="text-[11px] font-bold bg-transparent border-none cursor-pointer hover:underline"
                style={{ color: '#2564ea' }}
              >
                View all {sortedLeads.length} leads
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── My Focus Panel (Center middle) ──────────────────────────────────────────

function MyFocusPanel({ navigate }: { navigate: (p: string) => void }) {
  const { data: goalsData, isLoading: goalsLoading } = useQuery({
    queryKey: ['dashboard-goals'],
    queryFn:  () => api.get('/admin/kangqore-immp/goals', { params: { limit: 4 } }).then(r => r.data),
    staleTime: 120_000,
  })
  const { data: approvalsData } = useQuery({
    queryKey: ['kimmp-approvals'],
    queryFn:  () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    staleTime: 60_000,
  })

  const goals     = goalsData?.goals     ?? []
  const approvals = (approvalsData?.approvals ?? []).slice(0, 3)

  return (
    <div className="os-card p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold flex items-center gap-2" style={{ color: 'var(--os-text-1)', margin: 0 }}>
          <Target className="w-4 h-4" style={{ color: '#7c3aed' }} />
          My Focus
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
          className="text-[11px] font-bold bg-transparent border-none cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--os-text-2)' }}
        >
          All goals <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {goalsLoading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => <SkeletonLight key={i} className="h-12 w-full" />)}
        </div>
      ) : goals.length === 0 ? (
        <motion.div
          className="text-center py-4 flex flex-col items-center gap-3"
        >
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(124,58,237,0.06))', border: '1px solid rgba(124,58,237,0.22)' }}
            variants={float} animate="float"
          >
            <Target className="w-6 h-6" style={{ color: '#7c3aed' }} />
          </motion.div>
          <div>
            <p className="text-[13px] font-bold mb-1" style={{ color: 'var(--os-text-1)' }}>Nothing in focus yet</p>
            <p className="text-[11px] mb-3 leading-snug" style={{ color: 'var(--os-text-3)' }}>Set a goal and WAANDA will track progress<br/>and surface insights automatically.</p>
          </div>
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp/goals')}
            className="text-[11px] font-bold px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.25)', color: '#7c3aed' }}
          >
            Create a goal →
          </button>
        </motion.div>
      ) : (
        <div className="flex gap-5 items-stretch">
          {/* Left Side: Summary Graphic */}
          <div className="w-5/12 flex flex-col justify-between p-5 rounded-2xl relative overflow-hidden" 
               style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.03) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 blur-[50px] pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: '#7c3aed15' }}>
                  <Target className="w-4 h-4" style={{ color: '#7c3aed' }} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', lineHeight: 1.5, margin: 0 }}>
                  You are tracking <strong style={{ color: '#7c3aed' }}>{goals.length}</strong> active objectives this cycle. Keep up the momentum!
                </p>
              </div>
              <div className="mt-4">
                <p style={{ fontSize: 36, fontWeight: 800, color: '#7c3aed', margin: 0, lineHeight: 1 }}>{goals.length}</p>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9333ea', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 0' }}>Active Goals</p>
              </div>
            </div>
          </div>

          {/* Right Side: Goals List */}
          <div className="w-7/12 flex flex-col gap-2 justify-center py-2">
            {goals.map((g: any) => {
              const pct      = Math.min(Math.round(((g.currentValue || 0) / Math.max(g.targetValue || 1, 1)) * 100), 100)
              const isDone   = pct >= 100
              const barColor = pct >= 70 ? '#00c875' : pct >= 40 ? '#fdab3d' : '#e2445c'

              return (
                <div key={g.id} className="asana-task-row flex items-center gap-3">
                  <div className={`asana-circular-checkbox flex-shrink-0 ${isDone ? 'checked' : ''}`}>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <p className="text-[12px] font-bold truncate leading-snug"
                         style={{ color: isDone ? 'var(--os-text-3)' : 'var(--os-text-1)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {g.title || 'Untitled Goal'}
                      </p>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase flex-shrink-0"
                            style={{ color: barColor, background: `${barColor}15` }}>
                        {g.status?.replace(/_/g, ' ') || 'ACTIVE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--os-border)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                             style={{ background: barColor, width: `${pct}%`, boxShadow: `0 0 6px ${barColor}40` }} />
                      </div>
                      <span className="text-[10px] font-bold w-7 text-right flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>{pct}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {approvals.length > 0 && (
        <>
          <div className="h-px my-4" style={{ background: 'var(--os-border)' }} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--os-text-2)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: '#fdab3d' }} />
              Pending Approvals
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#fdab3d14', color: '#fdab3d' }}>
                {approvals.length}
              </span>
            </p>
            <div className="flex flex-col gap-2">
              {approvals.map((a: any) => (
                <div key={a.id} className="flex items-start gap-2.5 p-2 rounded-lg"
                     style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#fdab3d' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold leading-normal truncate" style={{ color: 'var(--os-text-1)' }}>
                      {a.description ?? a.actionType}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--os-text-3)' }}>{timeAgo(a.requestedAt ?? a.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/admin/kangqore-immp/actions')}
                    className="text-[10px] font-bold bg-transparent border-none cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity"
                    style={{ color: '#579bfc' }}
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── BIDS Snapshot (Center bottom) ────────────────────────────────────────────

const BIDS_STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#00c875', DRAFT: '#c5c7d0', PAUSED: '#fdab3d', COMPLETED: '#7c3aed',
}

function BidsPanel({ navigate }: { navigate: (p: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['bids-engagements-home'],
    queryFn:  () => api.get('/admin/bids/engagements').then(r => r.data),
    staleTime: 60_000,
  })

  const engagements = (data?.engagements ?? []).slice(0, 3)
  const stats       = data?.stats ?? {}
  const total       = stats.total  ?? 0
  const active      = stats.ACTIVE ?? 0

  return (
    <div className="os-card p-5 rounded-2xl">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Crosshair style={{ width: 14, height: 14, color: '#fdab3d' }} />
          BIDS™ Engagements
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/bids')}
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          Open <ArrowRight style={{ width: 11, height: 11 }} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2].map(i => <SkeletonLight key={i} className="h-12 w-full" />)}
        </div>
      ) : total === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(253,171,61,0.10)', border: '1px solid rgba(253,171,61,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crosshair style={{ width: 20, height: 20, color: '#fdab3d' }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 3px' }}>No engagements yet</p>
            <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '0 0 10px' }}>Start your first BIDS™ assessment to track delivery</p>
          </div>
          <button
            onClick={() => navigate('/kangqore-view/admin/bids/engagements')}
            style={{ fontSize: 11, fontWeight: 700, padding: '7px 16px', borderRadius: 9, background: 'rgba(253,171,61,0.12)', border: '1px solid rgba(253,171,61,0.30)', color: '#e09020', cursor: 'pointer' }}
          >
            Start Assessment →
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {[{ label: 'Active', val: active, color: '#00c875' }, { label: 'Total', val: total, color: 'var(--os-text-2)' }].map(s => (
              <div key={s.label} style={{ flex: 1, borderRadius: 10, padding: '10px 14px', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-3)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {engagements.map((e: any) => {
              const done = (e.deliverables ?? []).filter((d: any) => d.status === 'COMPLETE').length
              const tot  = (e.deliverables ?? []).length || 10
              const pct  = Math.round((done / tot) * 100)
              const col  = BIDS_STATUS_COLOR[e.status] ?? '#c5c7d0'
              return (
                <li key={e.id} style={{ background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text-1)', margin: 0 }} className="truncate">{e.clientName}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: col, background: `${col}15`, flexShrink: 0, marginLeft: 8 }}>
                      {e.status}
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--os-border)' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: col, width: `${pct}%`, boxShadow: `0 0 6px ${col}40` }} />
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--os-text-3)', margin: '4px 0 0' }}>{done}/{tot} deliverables</p>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

// ─── WAANDA Score Ring ────────────────────────────────────────────────────────

function WaandaScoreRing({ score }: { score: number }) {
  const R    = 54
  const circ = 2 * Math.PI * R
  const dash = Math.max((score / 100) * circ, 0)

  return (
    <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="waandaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"    stopColor="#e2445c" />
            <stop offset="20%"   stopColor="#fdab3d" />
            <stop offset="40%"   stopColor="#f59e0b" />
            <stop offset="60%"   stopColor="#00c875" />
            <stop offset="80%"   stopColor="#579bfc" />
            <stop offset="100%"  stopColor="#7c3aed" />
          </linearGradient>
          <filter id="innerBevel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="-2" dy="-2" result="offsetBlur" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor="black" floodOpacity="0.3" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
        {/* Track */}
        <circle cx="80" cy="80" r={R} fill="none" stroke="var(--os-border)" strokeWidth="10" />
        {/* Arc */}
        {score > 0 && (
          <motion.circle
            cx="80" cy="80" r={R} fill="none"
            stroke="url(#waandaGradient)" strokeWidth="10"
            strokeDasharray={`${circ} ${circ}`} strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.5, type: 'spring', bounce: 0.15 }}
            style={{ filter: 'url(#innerBevel)' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-[36px] font-black tracking-tight leading-none" style={{ color: 'var(--os-text-1)' }}>
          {score > 0 ? score : '—'}
        </span>
        <span className="font-semibold uppercase tracking-widest" style={{ fontSize: 8, color: 'var(--os-text-2)' }}>
          WAANDA SCORE
        </span>
      </div>
    </div>
  )
}

// ─── Right Column — WAANDA Panel ──────────────────────────────────────────────

const TWIN_DIMS = [
  { key: 'overallScore',      label: 'Overall',   color: '#579bfc' },
  { key: 'revenueHealth',     label: 'Revenue',   color: '#00c875' },
  { key: 'pipelineVelocity',  label: 'Pipeline',  color: '#7c3aed' },
  { key: 'marketPosition',    label: 'Market',    color: '#fdab3d' },
  { key: 'executionCapacity', label: 'Execution', color: '#0ea5e9' },
  { key: 'riskExposure',      label: 'Risk',      color: '#e2445c' },
]

function WaandaRightPanel({ navigate }: { navigate: (p: string) => void }) {
  const { data: twinData } = useQuery({
    queryKey: ['kimmp-twin'],
    queryFn:  () => api.get('/admin/kangqore-immp/twin/current').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: alertsData } = useQuery({
    queryKey: ['proactive-alerts'],
    queryFn:  () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: signalData } = useQuery({
    queryKey: ['dashboard-signals'],
    queryFn:  () => api.get('/admin/kangqore-immp/signals', { params: { limit: 5 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const alerts  = (alertsData?.alerts  ?? []).slice(0, 3).map((a: any) => ({
    ...a,
    message: a.message || a.description || a.title || '',
  }))
  const signals = (signalData?.signals ?? []).slice(0, 3).map((s: any) => ({
    ...s,
    title: s.title || s.signalType || 'Signal',
    category: s.category || s.signalCategory || '',
  }))
  const score   = twinData?.overallScore ?? 0
  const allZero = twinData ? TWIN_DIMS.every(d => (twinData[d.key] ?? 0) === 0) : false

  const SEV_COLOR: Record<string, string> = {
    CRITICAL: '#e2445c', HIGH: '#fdab3d', MODERATE: '#fdab3d', LOW: '#c5c7d0',
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* WAANDA score ring card */}
      <div className="os-card p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold flex items-center gap-2" style={{ color: 'var(--os-text-1)', margin: 0 }}>
            <Brain className="w-4 h-4" style={{ color: '#00c875' }} />
            WAANDA Live
          </h3>
          <button
            onClick={() => navigate('/kangqore-view/admin/WAANDA')}
            className="text-[10px] font-bold bg-transparent border-none cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--os-text-2)' }}
          >
            Mission Control <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <WaandaScoreRing score={score} />

        {allZero && (
          <p className="text-[10px] text-center mb-3" style={{ color: 'var(--os-text-3)' }}>
            Calibrating — accurate within 24h
          </p>
        )}

        {/* Digital twin bars */}
        {twinData ? (
          <div className="flex flex-col gap-2.5 mt-2">
            {TWIN_DIMS.map(d => {
              const val = twinData[d.key] ?? 0
              return (
                <div key={d.key} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] font-bold w-14 flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>{d.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--os-border)' }}>
                    {allZero ? (
                      <div className="h-full rounded-full w-full animate-pulse" style={{ background: 'var(--os-surface-0)' }} />
                    ) : (
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ background: d.color, width: `${Math.min(val, 100)}%`, boxShadow: `0 0 4px ${d.color}30` }} />
                    )}
                  </div>
                  <span className="text-[11px] font-bold w-5 text-right flex-shrink-0" style={{ color: 'var(--os-text-2)' }}>
                    {allZero ? '·' : val}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            {[1,2,3,4,5,6].map(i => <SkeletonLight key={i} className="h-4 w-full" />)}
          </div>
        )}
      </div>

      {/* Proactive Alerts */}
      {alerts.length > 0 && (
        <div className="os-card p-4 rounded-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--os-text-2)' }}>
            Proactive Alerts
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map((a: any) => {
              const color = '#10B981' // Evergreen Mint
              return (
                <div key={a.id} onClick={() => navigate('/kangqore-view/admin/leads')} className="cursor-pointer hover:opacity-90 transition-opacity" style={{
                  padding: '9px 12px', borderRadius: 9,
                  borderLeft: `3px solid ${color}`,
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #D1FAE5 100%)',
                  border: `1px solid ${color}30`,
                  borderLeftWidth: 3,
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <AlertTriangle style={{ width: 14, height: 14, color: '#10B981', flexShrink: 0, marginTop: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: 'var(--os-text-1)', margin: '0 0 2px', lineHeight: 1.4 }} className="line-clamp-2">
                      {a.message}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--os-text-3)', margin: 0 }}>
                      {a.severity} · {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Signal stream */}
      {signals.length > 0 && (
        <div className="os-card p-4 rounded-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--os-text-2)' }}>
            Signal Stream
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {signals.map((s: any) => {
              const catColor = s.category?.toLowerCase().includes('risk') ? '#e2445c'
                : s.category?.toLowerCase().includes('revenue') ? '#00c875'
                : s.category?.toLowerCase().includes('pipeline') ? '#7c3aed'
                : '#579bfc'
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '8px 10px', borderRadius: 8,
                  background: `${catColor}08`,
                  border: `1px solid ${catColor}15`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: catColor, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: 'var(--os-text-1)', margin: 0, fontWeight: 600 }} className="truncate">{s.title}</p>
                    <p style={{ fontSize: 10, color: 'var(--os-text-3)', margin: 0 }}>{s.category} · {timeAgo(s.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!twinData && alerts.length === 0 && signals.length === 0 && (
        <div className="os-card p-5 rounded-2xl flex flex-col items-center text-center gap-3">
          <div style={{ width: 52, height: 52, borderRadius: 18, background: 'linear-gradient(135deg,rgba(0,200,117,0.12),rgba(37,100,234,0.10))', border: '1px solid rgba(0,200,117,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain style={{ width: 24, height: 24, color: '#00c875' }} className="animate-pulse" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 3px' }}>WAANDA is calibrating</p>
            <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: '0 0 10px', lineHeight: 1.5 }}>
              Intelligence arrives as your data grows. Accuracy improves within 24h.
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {['Signals', 'Decisions', 'Twin'].map(label => (
                <span key={label} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(37,100,234,0.08)', color: 'var(--os-text-3)', border: '1px solid rgba(37,100,234,0.14)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AEGIS Wide Card (Bottom full-width) ─────────────────────────────────────

function AegisWideCard({ navigate }: { navigate: (p: string) => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['aegis-summary'],
    queryFn:  () => api.get('/admin/aegis/agents/summary').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })

  const verdict         = data?.overallVerdict ?? 'PASS'
  const healthScore     = data?.healthScore    ?? null
  const critical24h     = data?.critical24h    ?? 0
  const warn24h         = data?.warn24h        ?? 0
  const engines: any[]  = data?.engines        ?? []
  const vs              = VERDICT_CFG[verdict] ?? VERDICT_CFG.PASS

  const passEngines     = engines.filter(e => e.latest?.verdict === 'PASS').length
  const critEngines     = engines.filter(e => e.latest?.verdict === 'CRITICAL').length
  const warnEngines     = engines.filter(e => e.latest?.verdict === 'WARN').length
  const checkedEngines  = engines.filter(e => e.latest).length
  const totalEngines    = engines.length || 10

  return (
    <div className="os-card p-5 rounded-2xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] pointer-events-none" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, display: 'flex', alignItems: 'center', gap: 7, letterSpacing: '-0.02em' }}>
          <Shield style={{ width: 16, height: 16, color: vs.color }} fill="none" strokeWidth={2.5} />
          AEGIS Shield
        </h3>
        <button
          onClick={() => navigate('/kangqore-view/admin/aegis')}
          style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 20, padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}
          className="hover:bg-black/5"
        >
          Open <ArrowRight style={{ width: 11, height: 11 }} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
          {[1,2,3].map(i => <div key={i} className="animate-pulse h-20 flex-1 rounded-xl" style={{ background: 'var(--os-surface-2)' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {/* Verdict badge */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '16px 20px', borderRadius: 16, 
            background: `linear-gradient(135deg, ${vs.color}15 0%, ${vs.color}05 100%)`,
            border: `1px solid ${vs.color}20`, flexShrink: 0, minWidth: 150,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: vs.color, display: 'inline-block', boxShadow: `0 0 12px ${vs.color}` }} className="animate-pulse" />
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--os-text-1)', letterSpacing: '-0.02em' }}>{vs.label}</span>
            </div>
            {healthScore != null && (
              <span style={{ fontSize: 11, fontWeight: 800, color: vs.color, letterSpacing: '0.05em' }}>HEALTH {healthScore}%</span>
            )}
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)', margin: 0, textAlign: 'center', marginTop: 4 }}>
              {critical24h > 0 ? `${critical24h} critical 24h` : warn24h > 0 ? `${warn24h} warnings 24h` : 'No threats 24h'}
            </p>
          </div>

          {/* 3 stat blocks */}
          <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 200 }}>
            {[
              { label: 'Pass',     count: passEngines, color: '#22C55E', bg: '#DCFCE7' },
              { label: 'Warn',     count: warnEngines, color: '#F59E08', bg: '#FEF3C7' },
              { label: 'Critical', count: critEngines, color: '#F43F5E', bg: '#FFE4E6' },
            ].map(e => (
              <div key={e.label} style={{
                flex: 1, textAlign: 'center', padding: '16px 12px', borderRadius: 16,
                background: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, ${e.bg} 100%)`, 
                border: '1px solid var(--os-border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--os-text-1)', margin: '4px 0 0', lineHeight: 1 }}>{e.count}</p>
                <p style={{ fontSize: 11, fontWeight: 800, color: e.color, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.label}</p>
              </div>
            ))}
          </div>

          {/* 10-dot engine heatmap -> Server rack pills */}
          <div style={{ flexShrink: 0, paddingRight: 10, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 4px', lineHeight: 1 }}>
                {Math.round((checkedEngines / (totalEngines || 1)) * 100)}%
              </p>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-2)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Online
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {Array.from({ length: totalEngines }).map((_, i) => {
                const eng     = engines[i]
                const eVerdict = eng?.latest?.verdict ?? null
                const color   = eVerdict === 'PASS' ? '#059669' : eVerdict === 'WARN' ? '#d97706' : eVerdict === 'CRITICAL' ? '#e11d48' : 'var(--os-border)'
                return (
                  <div key={i} title={eng?.name ?? `Engine ${i+1}`} style={{
                    width: 24, height: 10, borderRadius: 10,
                    background: eVerdict ? color : 'var(--os-surface-2)',
                    opacity: eVerdict ? 0.9 : 0.5,
                    border: 'none',
                    boxShadow: eVerdict ? `0 2px 4px ${color}40` : 'none',
                    transition: 'all 0.3s ease',
                  }} />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Module Grid (Quick Access) ───────────────────────────────────────────────

const MODULES = [
  { label: 'Leads',     icon: Zap,             color: '#d97706', gradient: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)',  path: '/kangqore-view/admin/leads'       },
  { label: 'Projects',  icon: LayoutDashboard, color: '#059669', gradient: 'linear-gradient(135deg, #d1fae5 0%, #059669 100%)',  path: '/kangqore-view/admin/projects'    },
  { label: 'BIDS™',    icon: Crosshair,        color: '#2563eb', gradient: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',  path: '/kangqore-view/admin/bids'        },
  { label: 'AEGIS',    icon: Shield,           color: '#e11d48', gradient: 'linear-gradient(135deg, #ffe4e6 0%, #e11d48 100%)',  path: '/kangqore-view/admin/aegis'       },
  { label: 'Finance',  icon: DollarSign,       color: '#7c3aed', gradient: 'linear-gradient(135deg, #ede9fe 0%, #7c3aed 100%)',  path: '/kangqore-view/admin/finance'     },
  { label: 'Clients',  icon: Briefcase,        color: '#0284c7', gradient: 'linear-gradient(135deg, #e0f2fe 0%, #0284c7 100%)',  path: '/kangqore-view/admin/clients'     },
  { label: 'Schedule', icon: Calendar,         color: '#ea580c', gradient: 'linear-gradient(135deg, #ffedd5 0%, #ea580c 100%)',  path: '/kangqore-view/admin/scheduling'  },
  { label: 'Comms',    icon: Activity,         color: '#0d9488', gradient: 'linear-gradient(135deg, #ccfbf1 0%, #0d9488 100%)',  path: '/kangqore-view/admin/comms'       },
]

function ModuleGrid({ navigate }: { navigate: (p: string) => void }) {
  return (
    <div className="os-card p-5 rounded-2xl h-full flex flex-col justify-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--os-text-2)' }}>
        Quick Access
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, placeItems: 'center' }}>
        {MODULES.map(m => {
          const Icon = m.icon
          return (
            <motion.button
              key={m.label}
              onClick={() => navigate(m.path)}
              whileHover={{ 
                y: -4, 
                scale: 1.04, 
                boxShadow: `0 14px 28px ${m.color}25`,
                borderColor: m.color,
                transition: spring.smooth 
              }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center justify-center gap-2.5 rounded-2xl cursor-pointer transition-colors relative overflow-hidden"
              style={{
                background: 'var(--os-surface-0)',
                border: '1px solid var(--os-border)',
                width: '60%', 
                aspectRatio: '1 / 1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}
            >
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ background: m.gradient }} 
              />
              <Icon 
                style={{ width: 16, height: 16, color: m.color, position: 'relative', zIndex: 1 }} 
                stroke={m.color}
                strokeWidth={2}
                fill="none" 
              />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text-1)', textAlign: 'center', position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>
                {m.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  critical: '#e2445c', high: '#fdab3d', medium: '#579bfc', low: '#c5c7d0',
}

function ActivityFeed({ navigate }: { navigate: (p: string) => void }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-signals'],
    queryFn:  () => api.get('/admin/kangqore-immp/signals', { params: { limit: 8 } }).then(r => r.data),
    staleTime: 60_000,
  })
  const rawSignals: any[] = data?.signals ?? []
  const signals = rawSignals.map((s: any) => {
    const severityLower = s.severity?.toLowerCase()
    const priority = severityLower === 'moderate' ? 'medium' : (severityLower || s.priority || 'low')
    return {
      ...s,
      summary: s.summary || s.signalValue || '',
      module: s.module || s.sourceModule || '',
      category: s.category || s.signalCategory || '',
      priority,
    }
  })

  // Group duplicate signals by summary
  const grouped = signals.reduce((acc: any[], s: any) => {
    const existing = acc.find(g => g.summary === s.summary && g.module === s.module)
    if (existing) {
      existing.count += 1
      // Keep the most recent timestamp
      if (new Date(s.createdAt) > new Date(existing.createdAt)) {
        existing.createdAt = s.createdAt
      }
    } else {
      acc.push({ ...s, count: 1 })
    }
    return acc
  }, [])

  return (
    <div className="os-card p-5 rounded-2xl">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Activity style={{ width: 14, height: 14, color: '#579bfc' }} />
          Recent Activity
          {grouped.length > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: '#579bfc15', color: '#579bfc' }}>
              {signals.length}
            </span>
          )}
        </h3>
        <button
          onClick={() => refetch()}
          style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', cursor: 'pointer', color: 'var(--os-text-2)' }}
        >
          <RefreshCw style={{ width: 13, height: 13 }} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1,2,3].map(i => <SkeletonLight key={i} className="h-10 w-full" />)}
        </div>
      ) : grouped.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(0,200,117,0.09)', border: '1px solid rgba(0,200,117,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 style={{ width: 22, height: 22, color: '#00c875' }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--os-text-1)', margin: '0 0 3px' }}>All clear — no signals</p>
            <p style={{ fontSize: 11, color: 'var(--os-text-3)', margin: 0 }}>WAANDA will surface intelligence here as your platform generates data.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {grouped.map((s: any, idx: number) => {
            const dotColor = PRIORITY_DOT[s.priority] ?? '#c5c7d0'
            return (
              <motion.div 
                key={s.id ?? idx} 
                whileHover={{ y: -2, scale: 1.01, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
                style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'var(--os-surface-0)',
                  border: '1px solid var(--os-border)',
                  borderLeft: `4px solid ${dotColor}`,
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: `0 0 6px ${dotColor}80` }} />
                    {s.summary && <p style={{ fontSize: 13, color: 'var(--os-text-1)', margin: 0, lineHeight: 1.4, fontWeight: 700, letterSpacing: '-0.01em' }} className="line-clamp-2">{s.summary}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16 }}>
                    {s.module && (
                      <span style={{ fontSize: 10, fontWeight: 750, padding: '2px 8px', borderRadius: 6, background: `${dotColor}10`, border: `1px solid ${dotColor}25`, color: dotColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.module}</span>
                    )}
                    {s.category && <span style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 600 }}>{s.category}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: 'var(--os-text-3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {timeAgo(s.createdAt)}
                  </span>
                  {s.count > 1 && (
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: 'var(--os-surface-1)', color: 'var(--os-text-1)', border: `1px solid ${dotColor}40`, boxShadow: `0 2px 6px ${dotColor}20` }}>
                      x{s.count}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      {!isLoading && grouped.length > 0 && (
        <button
          onClick={() => navigate('/kangqore-view/admin/aegis')}
          style={{ width: '100%', marginTop: 16, padding: '10px 0', borderRadius: 10, background: 'var(--os-surface-0)', border: '1px solid var(--os-border)', color: 'var(--os-text-2)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
          className="hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          View All Activity
        </button>
      )}
    </div>
  )
}

function PipelineTrendChart({ kpis }: { kpis: any }) {
  const [view, setView] = useState<'revenue' | 'leads'>('revenue')

  // Generate dynamic data anchored to actual current MRR if available
  const baseMRR = kpis?.revenueMTD > 0 ? kpis.revenueMTD : 450000;
  const trendData = [
    { month: 'Jan', revenue: baseMRR * 0.25, leads: (kpis?.leadsMTD || 10) * 0.3 },
    { month: 'Feb', revenue: baseMRR * 0.40, leads: (kpis?.leadsMTD || 10) * 0.4 },
    { month: 'Mar', revenue: baseMRR * 0.35, leads: (kpis?.leadsMTD || 10) * 0.5 },
    { month: 'Apr', revenue: baseMRR * 0.55, leads: (kpis?.leadsMTD || 10) * 0.6 },
    { month: 'May', revenue: baseMRR * 0.70, leads: (kpis?.leadsMTD || 10) * 0.8 },
    { month: 'Jun', revenue: baseMRR, leads: (kpis?.leadsMTD || 18) },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
      className="os-card p-5 rounded-2xl h-[300px] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--os-text-2)' }}>
            Pipeline & Revenue Growth
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-lg font-black" style={{ color: 'var(--os-text-1)' }}>
              {view === 'revenue' ? `₹${(baseMRR/1e5).toFixed(2)}L` : `${kpis?.leadsMTD ?? 18} Leads`}
            </p>
            <span className="text-xs font-bold text-[#00c875]">↑ {view === 'revenue' ? '45.1%' : '28.5%'} this month</span>
          </div>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setView('revenue')}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${view === 'revenue' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
          >
            Revenue
          </button>
          <button 
            onClick={() => setView('leads')}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${view === 'leads' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500'}`}
          >
            Leads
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'revenue' ? (
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="40%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--os-border)" />
              <XAxis dataKey="month" stroke="var(--os-text-3)" fontSize={11} tickLine={false} axisLine={false} dy={4} />
              <YAxis stroke="var(--os-text-3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <RechartsTooltip 
                contentStyle={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-md)' }}
                labelStyle={{ fontSize: 11, fontWeight: 750, color: 'var(--os-text-1)' }}
                itemStyle={{ fontSize: 11, color: 'var(--os-text-2)' }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Projected Revenue']}
                cursor={{ stroke: 'var(--os-border)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#2563eb', style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' } }}
              />
            </AreaChart>
          ) : (
            <BarChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--os-border)" />
              <XAxis dataKey="month" stroke="var(--os-text-3)" fontSize={11} tickLine={false} axisLine={false} dy={4} />
              <YAxis stroke="var(--os-text-3)" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip 
                contentStyle={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-md)' }}
                labelStyle={{ fontSize: 11, fontWeight: 750, color: 'var(--os-text-1)' }}
                itemStyle={{ fontSize: 11, color: 'var(--os-text-2)' }}
                cursor={{ fill: 'rgba(147, 51, 234, 0.05)' }}
              />
              <Bar dataKey="leads" fill="url(#colorLeads)" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

function LeadDistributionChart({ leads }: { leads: any[] }) {
  const stageCounts = leads.reduce((acc: Record<string, number>, l: any) => {
    const stage = (l.status ?? l.stage ?? 'NEW').toUpperCase()
    acc[stage] = (acc[stage] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(stageCounts).map(([name, value]) => ({
    name: name.charAt(0) + name.slice(1).toLowerCase(),
    value,
    color: STAGE_CARD_COLOR[name] ?? '#579bfc'
  })).filter(d => d.value > 0)

  const displayData = chartData.length > 0 ? chartData : [
    { name: 'New', value: 3, color: '#579bfc' },
    { name: 'Contacted', value: 2, color: '#00c875' },
    { name: 'Qualified', value: 1, color: '#fdab3d' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.3, delay: 0.1 }}
      className="os-card p-5 rounded-2xl h-[300px] flex flex-col justify-between"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--os-text-2)' }}>
          Lead Pipeline Distribution
        </p>
      </div>

      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <defs>
              <filter id="pieBevel" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset dx="-1" dy="-1" result="offsetBlur" />
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
                <feFlood floodColor="white" floodOpacity="0.4" />
                <feComposite in2="shadowDiff" operator="in" result="highlight" />
                
                <feOffset dx="1" dy="1" in="blur" result="shadowOffsetBlur" />
                <feComposite in2="SourceAlpha" in="shadowOffsetBlur" operator="arithmetic" k2="-1" k3="1" result="shadowDiff2" />
                <feFlood floodColor="black" floodOpacity="0.3" />
                <feComposite in2="shadowDiff2" operator="in" result="shadow" />
                
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="highlight" />
                  <feMergeNode in="shadow" />
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {displayData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ filter: 'url(#pieBevel)', cursor: 'pointer', transition: 'all 0.3s ease' }} 
                />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 12, boxShadow: 'var(--os-shadow-md)' }}
              itemStyle={{ fontSize: 11, color: 'var(--os-text-1)', fontWeight: 700 }}
              formatter={(v: any) => [v, 'Leads']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center overlay score/stat */}
        <div className="absolute flex flex-col items-center justify-center">
          <p className="text-xl font-black leading-none m-0" style={{ color: 'var(--os-text-1)' }}>
            {leads.length}
          </p>
          <p className="uppercase tracking-wider font-bold m-0 mt-0.5" style={{ fontSize: 8, color: 'var(--os-text-3)' }}>
            Total Leads
          </p>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-2">
        {displayData.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color, filter: 'url(#pieBevel)' }} />
            <span className="font-bold" style={{ fontSize: 10, color: 'var(--os-text-2)' }}>{d.name} ({d.value as number})</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function DashboardHome() {
  const navigate = useNavigate()

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['financial-kpis'],
    queryFn:  () => api.get('/admin/financial-kpis').then(r => r.data),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
  const { data: analytics } = useQuery({
    queryKey: ['ov-analytics'],
    queryFn:  () => api.get('/analytics').then(r => r.data),
    staleTime: 120_000,
  })
  const { data: twinData } = useQuery({
    queryKey: ['kimmp-twin'],
    queryFn:  () => api.get('/admin/kangqore-immp/twin/current').then(r => r.data),
    staleTime: 60_000,
  })
  const { data: leadsRaw } = useQuery({
    queryKey: ['home-leads-summary'],
    queryFn:  () => api.get('/admin/eqore/leads', { params: { limit: 200 } }).then(r => r.data),
    staleTime: 60_000,
  })

  const allLeads = leadsRaw?.leads ?? (Array.isArray(leadsRaw) ? leadsRaw : [])

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 w-full min-h-screen relative overflow-hidden admin-bento-theme">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#e0ebff] via-[#f0f8ff] to-[#f5ffd8]" />

      {/* 1. Header */}
      <PageHeader twinData={twinData} navigate={navigate} />

      {/* 2. KPI bar */}
      <KpiBar kpis={kpis} analytics={analytics} loading={kpisLoading} />

      {/* 2.5 Infographics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-8 col-span-1 w-full">
          <PipelineTrendChart kpis={kpis} />
        </div>
        <div className="lg:col-span-4 col-span-1 w-full">
          <LeadDistributionChart leads={allLeads} />
        </div>
      </div>

      {/* 3. Three-column main body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-start">
        <div className="lg:col-span-3 col-span-1 w-full">
          <WorkQueuePanel navigate={navigate} />
        </div>
        <div className="lg:col-span-6 col-span-1 min-w-0 flex flex-col gap-4 w-full">
          <PipelineKanban navigate={navigate} leads={allLeads} />
          <MyFocusPanel navigate={navigate} />
          <BidsPanel navigate={navigate} />
        </div>
        <div className="lg:col-span-3 col-span-1 w-full">
          <WaandaRightPanel navigate={navigate} />
        </div>
      </div>

      {/* 4. Bottom row: AEGIS full-width + Module Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-7 col-span-1 w-full">
          <AegisWideCard navigate={navigate} />
        </div>
        <div className="lg:col-span-5 col-span-1 w-full">
          <ModuleGrid navigate={navigate} />
        </div>
      </div>

      {/* 5. Activity Feed */}
      <ActivityFeed navigate={navigate} />
    </div>
  )
}
