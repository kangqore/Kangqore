import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '@lib/api'
import { getSocket } from '@lib/socket'
import { cn } from '@design-system/cn'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, AlertTriangle, Brain, CheckCircle2, ChevronRight, ChevronDown, ChevronUp,
  Clock, DollarSign, Gauge, Globe, Loader2, RefreshCw, TrendingUp, Plus,
  TrendingDown, Users, UserCheck, XCircle, Zap, BookOpen, Shield,
  LayoutGrid, Settings2, Sparkles, ArrowRight, Calendar, Target,
  Crosshair, Flame, Lightbulb, BarChart2, Timer, CheckSquare,
  Newspaper, Bot, Send, Play, Power, FlaskConical, CheckSquare2,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface BusinessDomain {
  id:      string
  label:   string
  status:  'HEALTHY' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN'
  summary: string
  count:   number
  unit:    string
  detail:  unknown[]
  trend:   'UP' | 'DOWN' | 'STABLE' | null
}

interface CCSignal {
  id: string; signalType: string; signalValue: string; severity: string
  sourceModule: string; confidence: number; createdAt: string
}

interface CCDecision {
  id: string; decisionType: string; summary: string
  recommendedAction: string; priority: string; tier?: string
  status: string; createdAt: string; leadId?: string | null
}

interface CCPrediction {
  id: string; leadId: string; conversionProbability: number
  acvEstimate: number; deliveryRisk: string; createdAt: string
}

interface CommandCenterData {
  business: BusinessDomain[]
  signals:  { criticalCount: number; highCount: number; newCount: number; totalCount: number; avgConfidence: number; recent: CCSignal[] }
  decisions: { proposedCount: number; top: CCDecision[] }
  predictions: { atRisk: CCPrediction[]; highRiskCount: number; avgConversionProbability: number }
  training: { total: number; exportReady: number; estimatedReadyForFinetune: boolean } | null
  cost:     { totalCalls: number; totalEstimatedUsd: number; byOperation: Record<string, any> } | null
  ois:      { score: number } | null
  generatedAt: string
}

interface DecisionBrief {
  decision: CCDecision; narrative: string
  precedent: { date: string; outcome: string; impactSummary: string } | null
  expectedImpact: { low: string; high: string; currency: string } | null
  intentAlignment: { intentLabel: string; objectiveTitle: string | null; score: number } | null
  confidence: number
}

interface PlanAction {
  id: string; title: string; tier: string; type: string
  targetId: string | null; targetPath: string; done: boolean; source: string
  impact: number; urgency: number; confidence: number
  intentAlign: number; objectiveAlign: number; dependencies: number
  estimatedMins: number; focusScore: number; leverageOutcome: string
}

interface PlanBlocker { title: string; source: string; since: string; impactScore: number }

interface PlanQuickWin {
  title: string; targetPath: string; estimatedMins: number
  leverageOutcome: string; oisImpact: number
}

interface DailyPlan {
  id: string; date: string; mission: string
  actions: PlanAction[]; blockers: PlanBlocker[]; quickWins: PlanQuickWin[]
  oisAtGen: number | null; generatedAt: string; dismissed: boolean
}

interface ExecutiveObjective {
  id: string; title: string; description?: string; category: string
  vision?: string; measuredBy?: string; targetDate?: string
  rank: number; status: string; intents?: ExecutiveIntent[]
}

interface ExecutiveIntent {
  id: string; label: string; category: string; timeframe: string
  rank: number; status: string; objectiveId?: string | null; objective?: ExecutiveObjective | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/admin/kangqore-immp'

const DOMAIN_ICONS: Record<string, any> = {
  revenue: TrendingUp, customers: Users, people: UserCheck,
  operations: Zap, risk: Shield, ai: Brain, finance: DollarSign, market: Globe,
}

const STATUS_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c', ATTENTION: '#fdab3d', HEALTHY: '#00c875', UNKNOWN: '#888',
}

const TIER_COLOR: Record<string, string> = {
  STRATEGIC: '#b89eff', CRITICAL: '#e2445c', OPERATIONAL: '#579bfc', INFORMATIONAL: '#888',
}

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c', HIGH: '#fdab3d', MODERATE: '#579bfc', LOW: '#00c875',
}

const CATEGORY_COLORS: Record<string, string> = {
  growth: '#00c875', efficiency: '#579bfc', risk: '#e2445c',
  market: '#fdab3d', people: '#c4b5fd', product: '#60a5fa',
  financial: '#34d399', operational: '#f97316',
}

const OBJECTIVE_CATEGORY_COLORS: Record<string, string> = {
  growth: '#00c875', product: '#60a5fa', financial: '#34d399',
  operational: '#f97316', market: '#fdab3d',
}

function oisBand(score: number) {
  if (score >= 80) return { label: 'Excellent', color: '#00c875' }
  if (score >= 65) return { label: 'Good', color: '#579bfc' }
  if (score >= 50) return { label: 'Fair', color: '#fdab3d' }
  return { label: 'Critical', color: '#e2445c' }
}

function fmtUsd(n: number) { return n < 0.01 ? '<$0.01' : `$${n.toFixed(2)}` }

function timeAgo(iso: string) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return `${sec}s ago`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  return `${Math.floor(sec / 3600)}h ago`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ label, value, color, icon: Icon }: { label: string; value: any; color?: string; icon: any }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-2xl border border-white/80 bg-gradient-to-br from-white to-slate-50/80 px-5 py-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/[0.02] to-[#EC4899]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity z-0" />
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className="p-1.5 rounded-md shadow-sm bg-white border border-slate-100" style={{ color: color ?? '#64748b' }}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-black tabular-nums tracking-tight text-slate-800 relative z-10">{value}</p>
    </div>
  )
}

function SectionHeader({ label, path, navigate }: { label: string; path: string; navigate: any }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-[var(--os-text-1)]">{label}</h3>
      <button onClick={() => navigate(path)} className="flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
        View all <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}

// ── Today View ────────────────────────────────────────────────────────────────

function TierPill({ tier }: { tier: string }) {
  const color = TIER_COLOR[tier] ?? '#888'
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider" style={{ background: color + '20', color }}>
      {tier}
    </span>
  )
}

function FocusBar({ score }: { score: number }) {
  const color = score >= 80 ? '#e2445c' : score >= 60 ? '#fdab3d' : '#579bfc'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1 rounded-full bg-[var(--os-border)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[9px] font-bold tabular-nums" style={{ color }}>{score}</span>
    </div>
  )
}

// ── ETI Mini-Panel ────────────────────────────────────────────────────────────

function ETIMiniPanel() {
  const { data, isLoading } = useQuery({
    queryKey:  ['cognition-eti-mini'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/eti'),
    staleTime: 120_000,
  })
  const eti = (data as any)?.eti
  if (isLoading || !eti) return null

  const color = eti.overall >= 80 ? '#00c875' : eti.overall >= 60 ? '#fdab3d' : '#e2445c'
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black" style={{ background: color + '20', color }}>
        {eti.grade}
      </div>
      <div>
        <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-widest">Executive Trust Index</p>
        <p className="text-sm font-bold" style={{ color }}>{eti.overall}/100</p>
      </div>
      <div className="ml-auto flex-1 max-w-32">
        <div className="h-1.5 rounded-full bg-[var(--os-border)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${eti.overall}%`, background: color }} />
        </div>
        <p className="text-[9px] text-[var(--os-text-2)] mt-0.5 text-right">
          {eti.overall >= 80 ? 'AUTONOMOUS eligible' : eti.overall >= 60 ? 'Supervised mode' : 'Building trust'}
        </p>
      </div>
    </div>
  )
}

// ── Today View ─────────────────────────────────────────────────────────────────

function TodayView({ ois, navigate, queryClient }: { ois: number | null; navigate: any; queryClient: any }) {
  const [window_, setWindow] = useState<'today' | 'yesterday' | 'week' | 'quarter'>('today')
  const [lens, setLens] = useState<'decisions' | 'missions' | 'objectives' | 'enterprise'>('enterprise')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: plan, isLoading: planLoading } = useQuery<DailyPlan>({
    queryKey: ['daily-plan'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/command-center/plan'),
    staleTime: 5 * 60_000,
    enabled:  window_ === 'today',
  })

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['cc-timeline', window_, lens],
    queryFn:  () => apiFetch(`/admin/kangqore-immp/command-center/timeline?window=${window_}&lens=${lens}`),
    staleTime: 60_000,
    enabled:  window_ !== 'today',
  })

  const completeMutation = useMutation({
    mutationFn: (actionId: string) =>
      apiFetch(`/admin/kangqore-immp/command-center/plan/action/${actionId}/complete`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['daily-plan'] }),
  })

  const refreshPlan = async () => {
    setIsRefreshing(true)
    await apiFetch('/admin/kangqore-immp/command-center/plan', { method: 'DELETE' }).catch(() => null)
    await queryClient.invalidateQueries({ queryKey: ['daily-plan'] })
    setIsRefreshing(false)
  }

  const band = ois ? oisBand(ois) : null
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const windowTabs = [
    { key: 'today',     label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week',      label: 'This Week' },
    { key: 'quarter',   label: 'Quarter' },
  ] as const

  const lensTabs = [
    { key: 'enterprise',  label: 'Enterprise' },
    { key: 'decisions',   label: 'Decisions' },
    { key: 'missions',    label: 'Missions' },
    { key: 'objectives',  label: 'Objectives' },
  ] as const

  return (
    <div className="space-y-5">

      {/* Timeline window toggle */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 backdrop-blur-sm w-fit border border-slate-200/50 shadow-sm">
        {windowTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setWindow(t.key)}
            className={cn(
              'px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-300',
              window_ === t.key ? 'bg-white text-indigo-600 shadow-[0_2px_8px_rgb(0,0,0,0.08)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {window_ === 'today' ? (
        <>
          {planLoading ? (
            <div className="flex items-center gap-2 text-[var(--os-text-2)] text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              WAANDA is building your operating plan…
            </div>
          ) : !plan ? (
            <div className="text-sm text-[var(--os-text-2)] py-6 text-center">Plan unavailable</div>
          ) : (
            <>
              {/* Mission hero - Vibrant Bento Block */}
              <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-[#4F46E5]/15 via-[#9333EA]/15 to-[#EC4899]/15 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(236,72,153,0.1)] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#9333EA] to-[#EC4899] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-full bg-gradient-to-br from-[#9333EA] to-[#EC4899] shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#EC4899]">Today's Mission</span>
                      <span className="text-[11px] font-medium text-slate-500 ml-2 bg-white/60 px-2 py-0.5 rounded-full shadow-sm">{today}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 leading-relaxed max-w-3xl">{plan.mission}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {band && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] px-3 py-1.5">
                        <Gauge className="w-3.5 h-3.5" style={{ color: band.color }} />
                        <span className="text-sm font-bold tabular-nums" style={{ color: band.color }}>{ois}</span>
                        <span className="text-[10px] text-[var(--os-text-2)]">OIS</span>
                      </div>
                    )}
                    <button
                      onClick={refreshPlan}
                      disabled={isRefreshing}
                      className="p-1.5 rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
                      title="Refresh today's plan"
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ETI mini-panel */}
              <ETIMiniPanel />

              {/* Actions */}
              {plan.actions.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-black text-slate-800">Actions</h3>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {plan.actions.filter(a => a.done).length}/{plan.actions.length} complete
                    </span>
                  </div>
                  <div className="space-y-3">
                    {plan.actions.map(action => (
                      <div
                        key={action.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 group',
                          action.done
                            ? 'border-slate-100 bg-slate-50 opacity-60'
                            : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5'
                        )}
                      >
                        <button
                          onClick={() => !action.done && completeMutation.mutate(action.id)}
                          className="mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110"
                        >
                          {action.done
                            ? <CheckSquare className="w-5 h-5 text-emerald-500" />
                            : <div className="w-5 h-5 rounded-md border-2 border-slate-300 group-hover:border-indigo-400 transition-colors" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <TierPill tier={action.tier} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{action.type}</span>
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-500">
                              <Timer className="w-3 h-3 text-slate-400" />
                              <span>{action.estimatedMins}m</span>
                            </div>
                          </div>
                          <p className={cn('text-sm font-semibold text-slate-800', action.done && 'line-through text-slate-500')}>{action.title}</p>
                          {action.leverageOutcome && !action.done && (
                            <p className="text-[11px] font-medium text-indigo-500 mt-1.5">{action.leverageOutcome}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <FocusBar score={action.focusScore} />
                          {!action.done && (
                            <button
                              onClick={() => navigate(action.targetPath)}
                              className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                            >
                              Open <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Executive Leverage + Blockers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {plan.quickWins.length > 0 && (
                  <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-600 shadow-sm">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Executive Leverage</h3>
                    </div>
                    <div className="space-y-3 relative z-10">
                      {plan.quickWins.map((qw, i) => (
                        <div key={i} className="group/item bg-white/60 p-3 rounded-xl border border-white hover:bg-white hover:shadow-sm transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-[12px] font-bold text-slate-800 leading-tight">{qw.title}</p>
                              <p className="text-[11px] font-semibold text-emerald-600 mt-1">{qw.leverageOutcome}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 bg-white/80 px-2 py-1 rounded-md text-[10px] font-bold text-slate-500 shadow-sm">
                              <Timer className="w-3 h-3 text-slate-400" />
                              <span>{qw.estimatedMins}m</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(qw.targetPath)}
                            className="text-[11px] font-bold text-amber-600 hover:text-amber-700 mt-2 flex items-center gap-1 transition-colors"
                          >
                            Do it now <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.blockers.length > 0 && (
                  <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-red-50 p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-400 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shadow-sm">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Blockers</h3>
                    </div>
                    <div className="space-y-3 relative z-10">
                      {plan.blockers.map((bl, i) => (
                        <div key={i} className="bg-white/60 p-3 rounded-xl border border-white hover:bg-white hover:shadow-sm transition-all border-l-4 border-l-rose-400">
                          <p className="text-[12px] font-bold text-slate-800 leading-tight">{bl.title}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{bl.source}</span>
                            <span className="text-[10px] text-slate-400">· since {timeAgo(bl.since)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        /* Timeline view */
        <div className="space-y-4">
          {/* Lens selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {lensTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setLens(t.key)}
                className={cn(
                  'px-4 py-1.5 text-[11px] font-bold rounded-full transition-all duration-300 border',
                  lens === t.key
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {timelineLoading ? (
            <div className="flex items-center gap-2 text-[var(--os-text-2)] text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : !timeline ? null : (
            <TimelineView data={timeline as any} window_={window_} lens={lens} navigate={navigate} />
          )}
        </div>
      )}
    </div>
  )
}

// ── Timeline View ─────────────────────────────────────────────────────────────

function TimelineView({ data, window_, lens, navigate }: { data: any; window_: string; lens: string; navigate: any }) {
  const entries: any[] = data.entries ?? []

  return (
    <div className="space-y-4">
      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Decisions', value: data.decisions?.count ?? 0, sub: `${data.decisions?.approved ?? 0} approved`, color: 'from-[#38bdf8] to-[#0ea5e9]' },
          { label: 'Outcomes', value: data.decisions?.outcomes ?? 0, sub: 'recorded', color: 'from-[#a78bfa] to-[#8b5cf6]' },
          { label: 'Actions', value: data.goalsCompleted ?? 0, sub: 'from plans', color: 'from-[#fbbf24] to-[#f59e0b]' },
          { label: 'Lens', value: lens.charAt(0).toUpperCase() + lens.slice(1), sub: window_, color: 'from-[#f472b6] to-[#ec4899]' },
        ].map((s, idx) => (
          <div key={s.label} className="rounded-2xl border border-white/80 bg-white/60 px-5 py-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${s.color} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity`} />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5 relative z-10">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 tabular-nums tracking-tight relative z-10">{s.value}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-1 relative z-10">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Causal entries */}
      {entries.length === 0 ? (
        <p className="text-sm text-[var(--os-text-2)] text-center py-8">No entries in this window · Begin using WAANDA daily to populate the timeline</p>
      ) : (
        <div className="relative space-y-2 mt-4 ml-2">
          <div className="absolute left-[18px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent rounded-full" />
          {entries.map((e, i) => {
            const isDecision = e.type === 'DECISION'
            const isMission = e.type === 'MISSION'
            const dotColor = isDecision ? '#0ea5e9' : isMission ? '#a78bfa' : '#10b981'
            const dotBg = isDecision ? 'from-[#38bdf8] to-[#0ea5e9]' : isMission ? 'from-[#c084fc] to-[#a78bfa]' : 'from-[#34d399] to-[#10b981]'
            
            return (
            <div key={i} className="flex gap-5 pb-4 relative group">
              {/* Timeline dot */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dotBg} shadow-[0_4px_12px_rgb(0,0,0,0.1)] flex items-center justify-center flex-shrink-0 z-10 transition-transform group-hover:scale-110 group-hover:-rotate-3`}
              >
                {e.type === 'DECISION'  && <Zap className="w-4 h-4 text-white" />}
                {e.type === 'MISSION'   && <Target className="w-4 h-4 text-white" />}
                {e.type === 'OBJECTIVE' && <Crosshair className="w-4 h-4 text-white" />}
              </div>

              {/* Content Box */}
              <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">{e.event}</p>
                    {e.consequence && (
                      <div className="flex items-center gap-1.5 mt-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">
                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-slate-600">{e.consequence}</p>
                      </div>
                    )}
                    {e.intentLabel && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#a78bfa] mt-2 inline-flex px-2 py-0.5 bg-[#a78bfa]/10 rounded-md">Intent: {e.intentLabel}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{timeAgo(e.timestamp)}</span>
                    <span
                      className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm"
                      style={{
                        background: (e.status === 'APPROVED' || e.status === 'COMPLETE' || e.status === 'ACHIEVED' ? '#10b981' : e.status === 'DISMISSED' ? '#f43f5e' : '#0ea5e9'),
                        color: 'white',
                      }}
                    >
                      {e.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}

// ── Business View ─────────────────────────────────────────────────────────────

function DomainCard({ domain, isExpanded, onClick }: { domain: BusinessDomain; isExpanded: boolean; onClick: () => void }) {
  const Icon  = DOMAIN_ICONS[domain.id] ?? Activity
  const color = STATUS_COLOR[domain.status]
  const detail = domain.detail as any[]

  return (
    <div
      className={cn(
        'rounded-3xl border bg-gradient-to-br from-white to-slate-50/90 cursor-pointer transition-all duration-300 shadow-sm relative overflow-hidden group',
        isExpanded 
          ? 'border-indigo-400/40 shadow-[0_8px_30px_rgba(79,70,229,0.12)] ring-1 ring-indigo-500/10' 
          : 'border-white/80 hover:border-indigo-400/30 hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)]'
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-pink-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
      <div className="px-5 pt-5 pb-4 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: color + '15' }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <span className="text-sm font-extrabold text-slate-800">{domain.label}</span>
          </div>
          <span className="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm" style={{ background: color, color: '#fff' }}>{domain.status}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-3 font-medium">{domain.summary}</p>
        {domain.count > 0 && (
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-black tabular-nums tracking-tighter" style={{ color }}>{domain.count}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{domain.unit}</span>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {isExpanded && detail.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm relative z-10"
          >
            <div className="px-5 py-4 space-y-2.5 max-h-48 overflow-y-auto">
              {detail.slice(0, 5).map((row: any, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 font-medium truncate">{row.name ?? row.ref ?? row.id?.slice(-8) ?? `Item ${i + 1}`}</span>
                  <span className="text-slate-800 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                    {row.health ?? row.deliveryRisk ?? row.status ?? ''}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isExpanded && <div className="flex justify-center py-2 border-t border-slate-100 bg-slate-50/50"><ChevronDown className="w-4 h-4 text-slate-400" /></div>}
    </div>
  )
}

function BusinessView({ domains, navigate }: { domains: BusinessDomain[]; navigate: any }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!domains.length) {
    return <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)] py-10 justify-center"><Activity className="w-4 h-4" />Business domains aggregating…</div>
  }

  const criticalCount  = domains.filter(d => d.status === 'CRITICAL').length
  const attentionCount = domains.filter(d => d.status === 'ATTENTION').length

  return (
    <div className="space-y-5">
      {(criticalCount > 0 || attentionCount > 0) && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm relative overflow-hidden text-[12px]">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-400" />
          {criticalCount > 0 && <span className="text-rose-600 font-bold bg-rose-100 px-2.5 py-1 rounded-md">{criticalCount} CRITICAL</span>}
          {attentionCount > 0 && <span className="text-amber-700 font-bold bg-amber-200/50 px-2.5 py-1 rounded-md">{attentionCount} NEED ATTENTION</span>}
          <span className="ml-auto text-slate-500 font-medium italic">Tap a domain to drill down</span>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map(domain => (
          <DomainCard key={domain.id} domain={domain} isExpanded={expanded === domain.id} onClick={() => setExpanded(p => p === domain.id ? null : domain.id)} />
        ))}
      </div>
    </div>
  )
}

// ── Objectives View ───────────────────────────────────────────────────────────

function ObjectivesView() {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'growth', rank: '1', vision: '', measuredBy: '' })

  const { data, isLoading } = useQuery<{ objectives: ExecutiveObjective[] }>({
    queryKey: ['objectives'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/objectives'),
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: (body: any) => apiFetch('/admin/kangqore-immp/objectives', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['objectives'] }); setShowForm(false); setForm({ title: '', category: 'growth', rank: '1', vision: '', measuredBy: '' }) },
  })

  const achieveMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/kangqore-immp/objectives/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'ACHIEVED' }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['objectives'] }),
  })

  const objectives = data?.objectives ?? []
  const active     = objectives.filter(o => o.status === 'ACTIVE')
  const achieved   = objectives.filter(o => o.status === 'ACHIEVED')

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-4 h-4 animate-spin text-[var(--os-text-2)]" /></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[var(--os-text-1)]">Enterprise Objectives</h2>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">What the company is pursuing. Intents align to these.</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
          <Plus className="w-3 h-3" /> Add objective
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-[color:var(--os-blue)]/30 bg-[color:var(--os-blue)]/5 p-4 space-y-3">
          <input
            placeholder="Objective title (e.g. Acquire 10 lighthouse customers)"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="w-full text-sm bg-transparent border border-[var(--os-border)] rounded-lg px-3 py-2 text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none focus:border-[color:var(--os-blue)]"
          />
          <div className="flex gap-2">
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="flex-1 text-xs bg-[var(--os-card)] border border-[var(--os-border)] rounded-lg px-2 py-2 text-[var(--os-text-1)] outline-none">
              {['growth', 'product', 'financial', 'operational', 'market'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="Rank (1=highest)"
              type="number"
              value={form.rank}
              onChange={e => setForm(p => ({ ...p, rank: e.target.value }))}
              className="w-24 text-xs bg-transparent border border-[var(--os-border)] rounded-lg px-2 py-2 text-[var(--os-text-1)] outline-none"
            />
          </div>
          <input
            placeholder="Measured by (optional)"
            value={form.measuredBy}
            onChange={e => setForm(p => ({ ...p, measuredBy: e.target.value }))}
            className="w-full text-xs bg-transparent border border-[var(--os-border)] rounded-lg px-3 py-2 text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => createMutation.mutate({ ...form, rank: Number(form.rank) })}
              disabled={!form.title || createMutation.isPending}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[color:var(--os-blue)] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {createMutation.isPending ? 'Saving…' : 'Save Objective'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          </div>
        </div>
      )}

      {objectives.length === 0 ? (
        <div className="py-10 text-center">
          <Crosshair className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
          <p className="text-sm text-[var(--os-text-2)]">No objectives set yet</p>
          <p className="text-[11px] text-[var(--os-text-2)] mt-1">Add your company's enduring goals. Intents and decisions will align to these.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map(obj => {
            const catColor = OBJECTIVE_CATEGORY_COLORS[obj.category] ?? '#888'
            const isExp = expanded === obj.id
            return (
              <div key={obj.id} className={cn('rounded-2xl border transition-all duration-300 relative overflow-hidden group', isExp ? 'border-indigo-200 bg-white shadow-md' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm hover:border-slate-300')}>
                {isExp && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />}
                <div className="flex items-start gap-4 p-5 cursor-pointer" onClick={() => setExpanded(p => p === obj.id ? null : obj.id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-black shadow-sm" style={{ background: catColor + '15', color: catColor, border: `1px solid ${catColor}30` }}>
                    {String(obj.rank).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-sm font-black text-slate-800">{obj.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider" style={{ background: catColor + '15', color: catColor }}>{obj.category}</span>
                    </div>
                    {obj.measuredBy && <p className="text-[11px] font-medium text-slate-500 mb-1">Measured by: <span className="font-semibold text-slate-700">{obj.measuredBy}</span></p>}
                    {obj.vision && <p className="text-[12px] font-medium text-indigo-600 italic">"{obj.vision}"</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                    {obj.intents && obj.intents.length > 0 && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{obj.intents.length} intent{obj.intents.length > 1 ? 's' : ''}</span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); achieveMutation.mutate(obj.id) }}
                      className="text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
                    >
                      Mark achieved
                    </button>
                    {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>
                {isExp && obj.intents && obj.intents.length > 0 && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50 space-y-2">
                    {obj.intents.map(intent => (
                      <div key={intent.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm text-[12px]">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                        <span className="font-semibold text-slate-700 flex-1">{intent.label}</span>
                        <span className="font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{intent.timeframe}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {achieved.length > 0 && (
            <div className="pt-6">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Achieved</p>
              <div className="space-y-3">
                {achieved.map(obj => (
                  <div key={obj.id} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 opacity-80">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">{obj.title}</span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 ml-auto tracking-wider">ACHIEVED</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Intents Section (within System View) ─────────────────────────────────────

function IntentsSection() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', category: 'growth', timeframe: 'Q3-2026', rank: '1' })

  const { data } = useQuery<{ intents: ExecutiveIntent[] }>({
    queryKey: ['intents'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/intents'),
    staleTime: 60_000,
  })

  const createMutation = useMutation({
    mutationFn: (body: any) => apiFetch('/admin/kangqore-immp/intents', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess:  () => { queryClient.invalidateQueries({ queryKey: ['intents'] }); setShowForm(false); setForm({ label: '', category: 'growth', timeframe: 'Q3-2026', rank: '1' }) },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/admin/kangqore-immp/intents/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['intents'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/kangqore-immp/intents/${id}`, { method: 'DELETE' }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['intents'] }),
  })

  const intents = data?.intents ?? []
  const active  = intents.filter(i => i.status === 'ACTIVE')

  return (
    <div className="rounded-2xl border border-purple-100 bg-white shadow-sm mb-5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-purple-400" />
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r hover:from-purple-50 hover:to-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600 shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-base font-black text-slate-800">Strategic North Stars</span>
          {active.length > 0 && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">{active.length} active</span>
          )}
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-6 py-5 space-y-4">
          {intents.length === 0 && !showForm ? (
            <div className="text-center py-4">
              <p className="text-[11px] text-[var(--os-text-2)] mb-3">No executive intents set. Add the CEO's current priorities — WAANDA will align every decision and daily plan to these.</p>
              <button onClick={() => setShowForm(true)} className="text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] flex items-center gap-1 mx-auto">
                <Plus className="w-3 h-3" /> Add your first intent
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
              {intents.map((intent, idx) => {
                const catColor = CATEGORY_COLORS[intent.category] ?? '#888'
                const isActive = intent.status === 'ACTIVE'
                return (
                  <div key={intent.id} className={cn('flex items-start gap-4 p-4 rounded-xl border transition-all duration-300', isActive ? 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200' : 'bg-slate-50 border-slate-100 opacity-60')}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-black shadow-sm" style={{ background: catColor + '15', color: catColor, border: `1px solid ${catColor}30` }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[13px] font-black text-slate-800">{intent.label}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest" style={{ background: catColor + '15', color: catColor }}>{intent.category}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{intent.timeframe}</span>
                        {intent.objective?.title && (
                          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 truncate max-w-[200px]">→ {intent.objective.title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                      <button
                        onClick={() => statusMutation.mutate({ id: intent.id, status: isActive ? 'PAUSED' : 'ACTIVE' })}
                        className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        {isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button onClick={() => deleteMutation.mutate(intent.id)} className="text-[11px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">✕</button>
                    </div>
                  </div>
                )
              })}
            </div>

              {!showForm ? (
                <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                  <Plus className="w-3 h-3" /> Add intent
                </button>
              ) : (
                <div className="rounded-lg border border-[color:var(--os-blue)]/20 bg-[color:var(--os-blue)]/5 p-3 space-y-2">
                  <input
                    placeholder="Intent (e.g. Increase EBITDA margin to 32%)"
                    value={form.label}
                    onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                    className="w-full text-xs bg-transparent border border-[var(--os-border)] rounded-lg px-2.5 py-2 text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] outline-none focus:border-[color:var(--os-blue)]"
                  />
                  <div className="flex gap-2">
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="flex-1 text-[11px] bg-[var(--os-card)] border border-[var(--os-border)] rounded-lg px-2 py-1.5 text-[var(--os-text-1)] outline-none">
                      {['growth', 'efficiency', 'risk', 'market', 'people', 'product', 'financial', 'operational'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      placeholder="Timeframe"
                      value={form.timeframe}
                      onChange={e => setForm(p => ({ ...p, timeframe: e.target.value }))}
                      className="w-28 text-[11px] bg-transparent border border-[var(--os-border)] rounded-lg px-2 py-1.5 text-[var(--os-text-1)] outline-none"
                    />
                    <input
                      type="number"
                      placeholder="#"
                      value={form.rank}
                      onChange={e => setForm(p => ({ ...p, rank: e.target.value }))}
                      className="w-12 text-[11px] bg-transparent border border-[var(--os-border)] rounded-lg px-2 py-1.5 text-[var(--os-text-1)] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => createMutation.mutate({ ...form, rank: Number(form.rank) })}
                      disabled={!form.label || createMutation.isPending}
                      className="text-[11px] px-3 py-1 rounded-lg bg-[color:var(--os-blue)] text-white disabled:opacity-40"
                    >
                      {createMutation.isPending ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="text-[11px] text-[var(--os-text-2)]">Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Approval Pre-flight ───────────────────────────────────────────────────────

function PreflightPanel({ decisionId, onConfirm, onCancel, isPending }: { decisionId: string; onConfirm: () => void; onCancel: () => void; isPending: boolean }) {
  const { data: brief, isLoading, isError } = useQuery<DecisionBrief>({
    queryKey: ['decision-brief', decisionId],
    queryFn:  () => apiFetch(`/admin/kangqore-immp/decisions/${decisionId}/brief`),
    staleTime: Infinity, retry: false,
  })

  if (isLoading) return (
    <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--os-text-2)] py-3">
      <Loader2 className="w-3.5 h-3.5 animate-spin" /> WAANDA is reviewing…
    </div>
  )

  const Actions = () => (
    <div className="flex items-center gap-2 pt-1">
      <button onClick={onConfirm} disabled={isPending} className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-md bg-[#00c875]/10 text-[#00c875] hover:bg-[#00c875]/20 transition-colors">
        <CheckCircle2 className="w-3 h-3" /> Yes, approve
      </button>
      <button onClick={onCancel} className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-md text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
        <XCircle className="w-3 h-3" /> No
      </button>
    </div>
  )

  if (isError || !brief) return <div className="mt-2 space-y-2"><p className="text-[11px] text-[var(--os-text-2)]">Brief unavailable — proceed?</p><Actions /></div>

  return (
    <div className="mt-2 rounded-lg border border-[color:var(--os-blue)]/30 bg-[color:var(--os-blue)]/5 p-3 space-y-2">
      <div className="flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#b89eff] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--os-text-1)] leading-relaxed">{brief.narrative}</p>
      </div>
      {brief.intentAlignment && (
        <p className="text-[10px] text-[#b89eff]">Advances: <strong>{brief.intentAlignment.intentLabel}</strong>{brief.intentAlignment.objectiveTitle && <> → <span className="text-[var(--os-text-2)]">{brief.intentAlignment.objectiveTitle}</span></>}</p>
      )}
      {brief.precedent && (
        <p className="text-[10px] text-[var(--os-text-2)] border-l-2 border-[var(--os-border)] pl-2">Similar on {fmtDate(brief.precedent.date)} → {brief.precedent.outcome}</p>
      )}
      {brief.expectedImpact && (
        <p className="text-[10px] text-[var(--os-text-2)]">Expected: <strong className="text-[#00c875]">{brief.expectedImpact.currency}{brief.expectedImpact.low} – {brief.expectedImpact.currency}{brief.expectedImpact.high}</strong></p>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-[var(--os-border)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${brief.confidence}%`, background: '#00c875' }} />
        </div>
        <span className="text-[10px] text-[var(--os-text-2)] tabular-nums">{brief.confidence}%</span>
      </div>
      <Actions />
    </div>
  )
}

// ── System View ───────────────────────────────────────────────────────────────

function SystemView({ data, liveSignals, navigate, queryClient }: { data: CommandCenterData; liveSignals: CCSignal[]; navigate: any; queryClient: any }) {
  const [preflightId, setPreflightId] = useState<string | null>(null)

  const decisionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/admin/kangqore-immp/decisions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kimmp-command-center'] }); setPreflightId(null) },
  })

  const { signals, decisions, predictions, training, cost } = data

  const polledIds = new Set((signals.recent ?? []).map((s: any) => s.id))
  const mergedSignals: CCSignal[] = [
    ...liveSignals.filter(s => !polledIds.has(s.id)),
    ...(signals.recent ?? []) as CCSignal[],
  ].slice(0, 12)

  const topOp = cost?.byOperation
    ? Object.entries(cost.byOperation).sort((a, b) => b[1].estimatedUsd - a[1].estimatedUsd)[0]
    : null

  return (
    <div className="space-y-6">
      {/* Intents section */}
      <IntentsSection />

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        <StatPill label="Critical Signals" value={signals.criticalCount} color={signals.criticalCount > 0 ? '#e2445c' : undefined} icon={AlertTriangle} />
        <StatPill label="Proposed Decisions" value={decisions.proposedCount} color={decisions.proposedCount > 0 ? '#fdab3d' : undefined} icon={Zap} />
        <StatPill label="Training Examples" value={training?.total ?? '—'} color={training?.estimatedReadyForFinetune ? '#00c875' : undefined} icon={Brain} />
        <StatPill label="LLM Cost / 30d" value={cost ? fmtUsd(cost.totalEstimatedUsd) : '—'} icon={DollarSign} />
      </div>

      {/* Signals + Decision queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <SectionHeader label="Live Signals" path={`${BASE}/signals`} navigate={navigate} />
          {mergedSignals.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 py-6 text-center">No signals yet</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {mergedSignals.map((sig, i) => (
                <div key={sig.id ?? i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_8px_currentColor] opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: SEV_COLOR[sig.severity] ?? '#aaa', background: SEV_COLOR[sig.severity] ?? '#aaa' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-slate-800 truncate">{sig.signalType}</span>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-widest">{sig.sourceModule}</span>
                    </div>
                    {sig.signalValue && <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">{sig.signalValue}</p>}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex-shrink-0 tabular-nums">{timeAgo(sig.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <SectionHeader label="Decision Queue" path={`${BASE}/decision-engine`} navigate={navigate} />
          {decisions.top.length === 0 ? (
            <p className="text-sm font-bold text-slate-400 py-6 text-center">No pending decisions</p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {decisions.top.map(dec => {
                const isPreflighting = preflightId === dec.id
                const tier = dec.tier ?? 'OPERATIONAL'
                return (
                  <div key={dec.id} className={cn('rounded-xl border p-4 space-y-3 transition-all duration-300 relative overflow-hidden group', isPreflighting ? 'border-indigo-300 bg-indigo-50/30 shadow-md' : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md')}>
                    {isPreflighting && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400" />}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider" style={{ background: (TIER_COLOR[tier] ?? '#888') + '22', color: TIER_COLOR[tier] ?? '#888' }}>{tier}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{dec.decisionType}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-2">{dec.recommendedAction ?? dec.summary}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums flex-shrink-0 bg-slate-50 px-2 py-1 rounded-lg">{timeAgo(dec.createdAt)}</span>
                    </div>
                    {isPreflighting ? (
                      <PreflightPanel decisionId={dec.id} isPending={decisionMutation.isPending} onConfirm={() => decisionMutation.mutate({ id: dec.id, status: 'APPROVED' })} onCancel={() => setPreflightId(null)} />
                    ) : (
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-2">
                        <button onClick={() => setPreflightId(dec.id)} disabled={decisionMutation.isPending} className="mt-2 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => decisionMutation.mutate({ id: dec.id, status: 'DISMISSED' })} disabled={decisionMutation.isPending} className="mt-2 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100">
                          <XCircle className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* At-Risk Revenue */}
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-rose-400 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shadow-sm">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-800">At-Risk Revenue</h3>
            {predictions.highRiskCount > 0 && <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 shadow-sm">{predictions.highRiskCount} HIGH RISK</span>}
          </div>
          <button onClick={() => navigate(`${BASE}/decision-engine`)} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg">Decision Engine <ChevronRight className="w-3 h-3" /></button>
        </div>
        {predictions.atRisk.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 py-8 bg-slate-50 rounded-xl border border-slate-100"><TrendingUp className="w-5 h-5 text-emerald-500" />No at-risk leads detected.</div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-100">
                <th className="text-left py-2.5 pr-4 text-slate-400 font-bold uppercase tracking-widest">Lead ID</th>
                <th className="text-right py-2.5 pr-4 text-slate-400 font-bold uppercase tracking-widest tabular-nums">Conv. %</th>
                <th className="text-right py-2.5 pr-4 text-slate-400 font-bold uppercase tracking-widest tabular-nums">ACV Est.</th>
                <th className="text-left py-2.5 text-slate-400 font-bold uppercase tracking-widest">Delivery Risk</th>
              </tr></thead>
              <tbody>
                {predictions.atRisk.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-mono font-semibold text-slate-500 truncate max-w-[120px]">{p.leadId?.slice(-8) ?? '—'}</td>
                    <td className="py-3 pr-4 text-right font-semibold text-slate-700 tabular-nums">{p.conversionProbability != null ? `${Math.round(p.conversionProbability * 100)}%` : '—'}</td>
                    <td className="py-3 pr-4 text-right font-black text-slate-800 tabular-nums">{p.acvEstimate ? `₹${p.acvEstimate.toLocaleString()}` : '—'}</td>
                    <td className="py-3"><span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider" style={{ background: (SEV_COLOR[p.deliveryRisk] ?? '#aaa') + '22', color: SEV_COLOR[p.deliveryRisk] ?? '#888' }}>{p.deliveryRisk}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Training + Cost */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm"><BookOpen className="w-4 h-4" /></div>
            <h3 className="text-base font-black text-slate-800">WAANDA Training</h3>
          </div>
          {!training ? <p className="text-sm font-bold text-slate-500 relative z-10">Unavailable</p> : (
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-[12px] font-bold text-slate-500">Total examples</span><span className="text-sm font-black text-slate-800 tabular-nums">{training.total.toLocaleString()}</span></div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-[12px] font-bold text-slate-500">Export-ready</span><span className="text-sm font-black text-slate-800 tabular-nums">{training.exportReady.toLocaleString()}</span></div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-[12px] font-bold text-slate-500">Fine-tune ready</span><span className={cn('text-[12px] font-black px-2 py-0.5 rounded-md', training.estimatedReadyForFinetune ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600')}>{training.estimatedReadyForFinetune ? 'Yes' : `No (need ${1000 - training.exportReady} more)`}</span></div>
            </div>
          )}
          <button onClick={() => navigate(`${BASE}/training`)} className="mt-4 flex items-center justify-center w-full gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors bg-slate-50 hover:bg-emerald-50 py-2.5 rounded-xl border border-transparent hover:border-emerald-100 relative z-10">View Gen 2 training <ChevronRight className="w-3 h-3" /></button>
        </div>
        
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-400 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm"><DollarSign className="w-4 h-4" /></div>
            <h3 className="text-base font-black text-slate-800">LLM Spend (30d)</h3>
          </div>
          {!cost ? <p className="text-sm font-bold text-slate-500 relative z-10">Unavailable</p> : (
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50"><span className="text-[12px] font-bold text-slate-500">Total spend</span><span className="text-sm font-black text-indigo-700 tabular-nums">{fmtUsd(cost.totalEstimatedUsd)}</span></div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-[12px] font-bold text-slate-500">Total calls</span><span className="text-sm font-black text-slate-800 tabular-nums">{cost.totalCalls.toLocaleString()}</span></div>
              {topOp && <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"><span className="text-[12px] font-bold text-slate-500">Top operation</span><span className="text-[12px] font-black text-slate-700 truncate ml-2">{topOp[0]}</span></div>}
            </div>
          )}
          <button onClick={() => navigate(`${BASE}/ai-governance`)} className="mt-4 flex items-center justify-center w-full gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 py-2.5 rounded-xl border border-transparent hover:border-indigo-100 relative z-10">View AI Health <ChevronRight className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  )
}

// ── Brief View (Phase 6.6) ────────────────────────────────────────────────────

interface BriefingRow {
  id: string; briefType: string; date: string; oisScore: number | null
  para1Health: string; para2Focus: string; para3Trust: string
  para4Learning: string; para5Policy: string; para6Actions: string
}

function BriefView() {
  const queryClient = useQueryClient()
  const [generating, setGenerating] = useState(false)
  const [briefType, setBriefType] = useState<'MORNING' | 'MIDDAY' | 'EVENING'>('MORNING')

  const { data, isLoading } = useQuery<BriefingRow[]>({
    queryKey:  ['briefings'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/brief/history?limit=6').then((r: any) => r?.briefs ?? []),
    staleTime: 60_000,
  })

  const briefings = Array.isArray(data) ? data : []
  const latest    = briefings[0] ?? null

  const generate = async () => {
    setGenerating(true)
    try {
      await apiFetch('/admin/kangqore-immp/cognition/brief/generate', {
        method: 'POST',
        body: JSON.stringify({ briefType }),
      })
      queryClient.invalidateQueries({ queryKey: ['briefings'] })
    } finally {
      setGenerating(false)
    }
  }

  const BRIEF_TYPE_LABEL: Record<string, string> = {
    MORNING: '☀️ Morning Brief', MIDDAY: '🌤 Midday Drift', EVENING: '🌙 Evening Wrap',
  }
  const BRIEF_TYPE_COLOR: Record<string, string> = {
    MORNING: '#fdab3d', MIDDAY: '#579bfc', EVENING: '#b89eff',
  }

  const paras = latest ? [
    { key: 'Health',   text: latest.para1Health   },
    { key: 'Focus',    text: latest.para2Focus    },
    { key: 'Trust',    text: latest.para3Trust    },
    { key: 'Learning', text: latest.para4Learning },
    { key: 'Policy',   text: latest.para5Policy   },
    { key: 'Actions',  text: latest.para6Actions  },
  ] : []

  const PARA_COLORS = ['#00c875', '#579bfc', '#fdab3d', '#b89eff', '#f97316', '#e2445c']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-[var(--os-text-1)]">WAANDA Digital CEO Brief</h2>
          <p className="text-[11px] text-[var(--os-text-2)]">Phase 6.6 — Scheduled 08:00 · 13:00 · 18:00</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={briefType}
            onChange={e => setBriefType(e.target.value as any)}
            className="text-[12px] font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 outline-none hover:border-indigo-200 transition-colors cursor-pointer shadow-sm"
          >
            <option value="MORNING">Morning Brief</option>
            <option value="MIDDAY">Midday Drift</option>
            <option value="EVENING">Evening Wrap</option>
          </select>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 text-[12px] font-bold px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm shadow-indigo-600/20"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Generate Now
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-4 h-4 animate-spin text-[var(--os-text-2)]" /></div>
      ) : !latest ? (
        <div className="py-12 text-center space-y-2">
          <Newspaper className="w-10 h-10 text-[var(--os-text-2)] mx-auto" />
          <p className="text-sm text-[var(--os-text-2)]">No briefings generated yet.</p>
          <p className="text-[11px] text-[var(--os-text-2)]">The first brief will generate today at 08:00, or you can trigger one now.</p>
        </div>
      ) : (
        <>
          <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-2 relative z-10 flex-wrap">
              <span className="text-sm font-black px-3 py-1.5 rounded-lg" style={{ background: (BRIEF_TYPE_COLOR[latest.briefType] ?? '#888') + '20', color: BRIEF_TYPE_COLOR[latest.briefType] ?? '#888' }}>
                {BRIEF_TYPE_LABEL[latest.briefType] ?? latest.briefType}
              </span>
              <span className="text-[12px] font-bold text-slate-400 mx-1">·</span>
              <span className="text-[12px] font-bold text-slate-500">{new Date(latest.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              {latest.oisScore != null && (
                <>
                  <span className="text-[12px] font-bold text-slate-400 mx-1">·</span>
                  <span className="text-[12px] font-black px-2.5 py-1 rounded-md" style={{ background: oisBand(latest.oisScore).color + '20', color: oisBand(latest.oisScore).color }}>OIS {latest.oisScore}</span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {paras.map((p, i) => (
                <div key={p.key} className="flex gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[12px] font-black shadow-sm" style={{ background: PARA_COLORS[i] + '18', color: PARA_COLORS[i], border: `1px solid ${PARA_COLORS[i]}30` }}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: PARA_COLORS[i] }}>{p.key}</p>
                    <p className="text-[13px] font-semibold text-slate-700 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History list */}
          {briefings.length > 1 && (
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Earlier Briefings</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {briefings.slice(1, 6).map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-bold" style={{ color: BRIEF_TYPE_COLOR[b.briefType] ?? '#888' }}>{BRIEF_TYPE_LABEL[b.briefType] ?? b.briefType}</span>
                      <span className="text-[11px] font-semibold text-slate-400">{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    {b.oisScore != null && <span className="text-[11px] font-black px-2 py-1 rounded-md" style={{ background: oisBand(b.oisScore).color + '15', color: oisBand(b.oisScore).color }}>OIS {b.oisScore}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Autopilot View (Phase 6.8) ────────────────────────────────────────────────

interface AutopilotMission {
  id: string; mode: string; status: string
  intentId?: string | null; objectiveId?: string | null
  actions: any[]; createdAt: string
}

function AutopilotView() {
  const queryClient = useQueryClient()
  const [ticking, setTicking] = useState(false)

  const { data: etiData } = useQuery({
    queryKey:  ['cognition-eti-mini'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/eti'),
    staleTime: 120_000,
  })
  const etiScore: number = (etiData as any)?.eti?.overall ?? 0
  const etiGrade: string = (etiData as any)?.eti?.grade ?? 'N/A'
  const etiColor = etiScore >= 80 ? '#00c875' : etiScore >= 60 ? '#fdab3d' : '#e2445c'

  const { data, isLoading } = useQuery<{ missions: AutopilotMission[] }>({
    queryKey:  ['autopilot-missions'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/autopilot/missions'),
    staleTime: 30_000,
  })

  const missions = data?.missions ?? []
  const activeMissions = missions.filter(m => m.status === 'ACTIVE')

  const createMission = useMutation({
    mutationFn: (body: any) => apiFetch('/admin/kangqore-immp/cognition/autopilot/missions', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['autopilot-missions'] }),
  })

  const triggerTick = async () => {
    setTicking(true)
    try {
      await apiFetch('/admin/kangqore-immp/cognition/autopilot/tick', { method: 'POST' })
      queryClient.invalidateQueries({ queryKey: ['autopilot-missions'] })
    } finally {
      setTicking(false)
    }
  }

  const MODE_COLOR: Record<string, string> = { SUPERVISED: '#579bfc', AUTONOMOUS: '#00c875' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-black text-slate-800">WAANDA Autopilot</h2>
          <p className="text-[11px] font-bold text-slate-400">Phase 6.8 — AUTONOMOUS requires ETI &gt; 80 + flag enabled</p>
        </div>
        <button
          onClick={triggerTick}
          disabled={ticking || activeMissions.length === 0}
          className="flex items-center gap-2 text-[12px] font-bold px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          {ticking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Tick
        </button>
      </div>

      {/* ETI guard display */}
      <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ background: etiColor }} />
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2.5 rounded-xl shadow-sm" style={{ background: etiColor + '20', color: etiColor }}>
            <Power className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">ETI Guard</p>
            <p className="text-lg font-black" style={{ color: etiColor }}>{etiScore}/100 <span className="text-slate-400 text-sm font-bold ml-1">— Grade {etiGrade}</span></p>
          </div>
        </div>
        <div className="flex-1 text-right relative z-10">
          {etiScore >= 80 ? (
            <span className="text-[12px] font-black px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">✓ AUTONOMOUS eligible</span>
          ) : (
            <span className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100">
              Need {80 - etiScore} more points for AUTONOMOUS
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
      ) : missions.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-3xl border border-slate-100">
          <Bot className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-500">No autopilot missions running.</p>
          <button
            onClick={() => createMission.mutate({ mode: 'SUPERVISED' })}
            disabled={createMission.isPending}
            className="mt-2 text-[12px] font-bold px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50"
          >
            {createMission.isPending ? 'Creating…' : 'Start Supervised Mission'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {missions.map(m => {
            const modeColor = MODE_COLOR[m.mode] ?? '#888'
            const actionCount = Array.isArray(m.actions) ? m.actions.length : 0
            return (
              <div key={m.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: modeColor }} />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ background: modeColor + '15', color: modeColor }}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-black tracking-wide" style={{ color: modeColor }}>{m.mode}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md ml-1 tracking-widest" style={{ background: (m.status === 'ACTIVE' ? '#00c875' : '#888') + '15', color: m.status === 'ACTIVE' ? '#00c875' : '#888' }}>
                      {m.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg tabular-nums">{actionCount} action{actionCount !== 1 ? 's' : ''}</span>
                </div>
                {actionCount > 0 && (
                  <div className="space-y-2 relative z-10">
                    {(m.actions as any[]).slice(-3).map((a: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold">
                        <span className="text-slate-400 flex-shrink-0 font-bold">{i + 1}.</span>
                        <span className="text-slate-700">{typeof a === 'string' ? a : a?.action ?? JSON.stringify(a)}</span>
                        {m.mode === 'SUPERVISED' && <span className="ml-auto text-amber-500 font-bold flex-shrink-0 px-2 py-0.5 bg-amber-50 rounded-md">Proposed</span>}
                        {m.mode === 'AUTONOMOUS' && <span className="ml-auto text-emerald-600 font-bold flex-shrink-0 px-2 py-0.5 bg-emerald-50 rounded-md">Executed</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <button
            onClick={() => createMission.mutate({ mode: etiScore >= 80 ? 'SUPERVISED' : 'SUPERVISED' })}
            disabled={createMission.isPending}
            className="w-full mt-2 text-[12px] font-bold flex items-center justify-center gap-1.5 text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3 rounded-2xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add mission
          </button>
        </div>
      )}
    </div>
  )
}

// ── Simulator View ────────────────────────────────────────────────────────────

interface SimDimension { name: string; delta: number; projected: number; narrative: string }
interface SimResult { scenario: string; dimensions: SimDimension[]; confidence: number; summary: string; generatedAt: string }

function SimulatorView() {
  const [scenario, setScenario] = useState('')
  const [result,   setResult]   = useState<SimResult | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const run = async () => {
    if (!scenario.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const r = await apiFetch('/admin/kangqore-immp/cognition/simulate', {
        method: 'POST',
        body:   JSON.stringify({ scenario }),
      })
      setResult(r)
    } catch (e: any) { setError(e.message ?? 'Simulation failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-violet-400 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
        <p className="text-[12px] font-bold text-slate-500 mb-4 relative z-10">Describe a hypothetical scenario — WAANDA projects impact across enterprise dimensions.</p>
        <div className="flex gap-3 relative z-10">
          <input
            value={scenario}
            onChange={e => setScenario(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder='e.g. "Hire 5 senior engineers" or "Enter the MENA market"'
            className="flex-1 text-[13px] font-semibold bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-800 placeholder:text-slate-400 outline-none focus:border-violet-400 focus:shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all"
          />
          <button
            onClick={run}
            disabled={loading || !scenario.trim()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-violet-600 text-white text-[13px] font-bold hover:bg-violet-700 disabled:opacity-50 shadow-sm shadow-violet-600/20 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Simulate
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-[#e2445c]">{error}</p>}

      {result && (
        <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-200 to-fuchsia-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="flex items-center justify-between mb-4 relative z-10 flex-wrap gap-4">
              <p className="text-base font-black text-slate-800">{result.scenario}</p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                <div className="w-32 h-2.5 rounded-full bg-slate-100 shadow-inner overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 relative" style={{ width: `${result.confidence * 100}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <span className="text-sm font-black text-slate-700">{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>
            {result.summary && <p className="text-[13px] font-semibold text-slate-600 leading-relaxed relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">{result.summary}</p>}
          </div>

          {Array.isArray(result.dimensions) && result.dimensions.length > 0 && (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-2">Dimension Impact Analysis</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.dimensions.map((d: SimDimension) => (
                  <div key={d.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-bold text-slate-700">{d.name}</span>
                      <span className={`text-[13px] font-black tabular-nums px-2.5 py-1 rounded-lg ${d.delta >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                        {d.delta >= 0 ? '+' : ''}{d.delta}
                      </span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-200 shadow-inner mb-3 overflow-hidden">
                      <div
                        className={`absolute top-0 h-full rounded-full ${d.delta >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'}`}
                        style={{ width: `${Math.min(100, Math.abs(d.delta))}%`, left: d.delta < 0 ? 'auto' : '0', right: d.delta < 0 ? '0' : 'auto' }}
                      />
                    </div>
                    {d.narrative && <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">{d.narrative}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── GOVERNED Candidates View ──────────────────────────────────────────────────

interface Candidate { id: string; kind: 'PRINCIPLE' | 'PLAYBOOK'; domain: string; statement?: string; title?: string; confidence: number; createdAt: string }

function CandidatesView() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ candidates: Candidate[] }>({
    queryKey: ['cognition-candidates'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/cognition/candidates'),
    staleTime: 30_000,
  })

  const { data: govData } = useQuery<{ mode: string; setBy: string; reason: string | null; since: string | null; readiness: Record<string, { value: number; threshold: number; met: boolean }> }>({
    queryKey:  ['cognition-governance'],
    queryFn:   () => apiFetch('/admin/kangqore-immp/cognition/governance'),
    staleTime: 60_000,
  })

  const setMode = useMutation({
    mutationFn: (mode: 'BOOTSTRAP' | 'GOVERNED') =>
      apiFetch('/admin/kangqore-immp/cognition/governance', { method: 'POST', body: JSON.stringify({ mode, reason: 'CEO manual override' }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cognition-governance'] }),
  })

  const promote = useMutation({
    mutationFn: ({ kind, id }: { kind: string; id: string }) =>
      apiFetch(`/admin/kangqore-immp/cognition/candidates/${kind}/${id}/promote`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cognition-candidates'] }),
  })
  const reject = useMutation({
    mutationFn: ({ kind, id }: { kind: string; id: string }) =>
      apiFetch(`/admin/kangqore-immp/cognition/candidates/${kind}/${id}/reject`, { method: 'POST' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cognition-candidates'] }),
  })

  const candidates = data?.candidates ?? []

  if (isLoading) return <div className="flex h-32 items-center justify-center text-[var(--os-text-2)]"><Loader2 className="w-4 h-4 animate-spin" /></div>

  const govMode   = govData?.mode ?? 'BOOTSTRAP'
  const readiness = govData?.readiness ?? {}
  const allMet    = Object.values(readiness).length > 0 && Object.values(readiness).every((r: any) => r.met)

  const GovernancePanel = () => (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm mb-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-200 to-slate-50 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shadow-sm"><Shield className="w-5 h-5" /></div>
          <span className="text-base font-black text-slate-800">Promotion Mode</span>
          <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${govMode === 'GOVERNED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
            {govMode}
          </span>
          {govData?.setBy && <span className="text-[11px] font-bold text-slate-400">set by {govData.setBy}</span>}
        </div>
        <div className="flex gap-2">
          {govMode !== 'GOVERNED' && (
            <button
              onClick={() => setMode.mutate('GOVERNED')}
              disabled={setMode.isPending}
              className="text-[11px] font-bold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 disabled:opacity-50 shadow-sm transition-colors"
            >
              {setMode.isPending ? '…' : 'Force GOVERNED'}
            </button>
          )}
          {govMode === 'GOVERNED' && (
            <button
              onClick={() => setMode.mutate('BOOTSTRAP')}
              disabled={setMode.isPending}
              className="text-[11px] font-bold px-4 py-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 disabled:opacity-50 shadow-sm transition-colors"
            >
              {setMode.isPending ? '…' : 'Revert BOOTSTRAP'}
            </button>
          )}
        </div>
      </div>
      {Object.keys(readiness).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
          {Object.entries(readiness).map(([key, r]: [string, any]) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all">
              {r.met
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                : <XCircle     className="w-4 h-4 text-slate-300 shrink-0" />}
              <span className="text-[13px] font-bold text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className={`tabular-nums font-black ml-auto ${r.met ? 'text-emerald-600' : 'text-slate-800'}`}>{r.value}/{r.threshold}</span>
            </div>
          ))}
        </div>
      )}
      <div className="relative z-10">
        {govMode === 'BOOTSTRAP' && allMet && (
          <p className="text-[12px] font-bold text-emerald-600 mt-4 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">All thresholds met — WAANDA will auto-upgrade on the next cognition cycle.</p>
        )}
        {govMode === 'BOOTSTRAP' && !allMet && (
          <p className="text-[12px] font-bold text-slate-500 mt-4 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg">WAANDA is in BOOTSTRAP mode — knowledge artifacts are auto-promoted. WAANDA will self-upgrade to GOVERNED when all thresholds are cleared.</p>
        )}
        {govData?.reason && (
          <p className="text-[11px] font-bold text-slate-400 mt-3 italic">Reason: {govData.reason}</p>
        )}
      </div>
    </div>
  )

  if (candidates.length === 0) return (
    <div className="space-y-4">
      <GovernancePanel />
      <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center shadow-sm">
        <CheckSquare2 className="w-10 h-10 mx-auto mb-4 text-slate-300" />
        <p className="text-sm font-bold text-slate-500">No candidates awaiting review</p>
        <p className="text-[12px] font-semibold text-slate-400 mt-2 leading-relaxed">
          {govMode === 'GOVERNED'
            ? 'WAANDA is in GOVERNED mode. New principles and playbooks will appear here for your approval.'
            : 'WAANDA is still in BOOTSTRAP mode — auto-promoting knowledge. Thresholds above must be cleared before review mode activates.'}
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      <GovernancePanel />
      <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">{candidates.length} knowledge artifact{candidates.length !== 1 ? 's' : ''} awaiting CEO review before promotion to Active</p>
      <div className="space-y-4">
        {candidates.map(c => (
          <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: c.kind === 'PRINCIPLE' ? '#8b5cf6' : '#f59e0b' }} />
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${c.kind === 'PRINCIPLE' ? 'bg-violet-50 text-violet-600 border border-violet-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    {c.kind}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{c.domain}</span>
                  <span className="text-[11px] font-black tabular-nums text-slate-400">{Math.round(c.confidence * 100)}% confidence</span>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed mb-2">{c.statement ?? c.title}</p>
                <p className="text-[11px] font-bold text-slate-400">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => promote.mutate({ kind: c.kind, id: c.id })}
                  disabled={promote.isPending}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[12px] font-bold hover:bg-emerald-100 border border-emerald-100 disabled:opacity-50 whitespace-nowrap transition-colors shadow-sm"
                >
                  {promote.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve
                </button>
                <button
                  onClick={() => reject.mutate({ kind: c.kind, id: c.id })}
                  disabled={reject.isPending}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-500 text-[12px] font-bold hover:bg-rose-100 border border-rose-100 disabled:opacity-50 whitespace-nowrap transition-colors shadow-sm"
                >
                  {reject.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ViewTab = 'today' | 'business' | 'objectives' | 'system' | 'brief' | 'autopilot' | 'simulator' | 'candidates'

export function CommandCenterPage() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const [liveSignals, setLiveSignals] = useState<CCSignal[]>([])
  const [view, setView] = useState<ViewTab>('today')

  const { data, isLoading, isError, dataUpdatedAt } = useQuery<CommandCenterData>({
    queryKey: ['kimmp-command-center'],
    queryFn:  () => apiFetch('/admin/kangqore-immp/command-center'),
    staleTime: 20_000, refetchInterval: 30_000,
  })

  useEffect(() => {
    const socket = getSocket()
    const onSignal = (raw: any) => {
      setLiveSignals(prev => [{
        id: raw.id ?? `live-${Date.now()}`, signalType: raw.signalType ?? 'SIGNAL',
        signalValue: raw.signalValue ?? '', severity: raw.severity ?? 'MODERATE',
        sourceModule: raw.sourceModule ?? 'system', confidence: Number(raw.confidence ?? 0),
        createdAt: new Date().toISOString(),
      }, ...prev].slice(0, 20))
    }
    socket.on('kimmp:signal', onSignal)
    return () => { socket.off('kimmp:signal', onSignal) }
  }, [])

  if (isLoading) return (
    <div className="flex items-center justify-center h-48 gap-2 text-[var(--os-text-2)]">
      <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Aggregating intelligence…</span>
    </div>
  )

  if (isError || !data) return (
    <div className="flex items-center gap-2 text-sm text-[#e2445c] p-4 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)]">
      <XCircle className="w-4 h-4 flex-shrink-0" />Command Center could not load. Backend may be starting up.
    </div>
  )

  const { ois } = data
  const band = ois ? oisBand(ois.score) : null

  const tabs: { key: ViewTab; label: string; icon: any }[] = [
    { key: 'today',      label: 'Today',       icon: Calendar   },
    { key: 'business',   label: 'Business',    icon: LayoutGrid  },
    { key: 'objectives', label: 'Objectives',  icon: Target      },
    { key: 'system',     label: 'System',      icon: Settings2   },
    { key: 'brief',      label: 'Brief',       icon: Newspaper   },
    { key: 'autopilot',  label: 'Autopilot',   icon: Bot         },
    { key: 'simulator',  label: 'Simulator',   icon: FlaskConical },
    { key: 'candidates', label: 'Candidates',  icon: CheckSquare2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--os-text-1)]">Command Center</h1>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">KIMMP Phase 6 — Executive Operating System</p>
        </div>
        <div className="flex items-center gap-3">
          {ois && band && (
            <div className="flex items-center gap-2 rounded-lg border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-2">
              <Gauge className="w-4 h-4" style={{ color: band.color }} />
              <span className="text-sm font-bold tabular-nums" style={{ color: band.color }}>OIS {ois.score}</span>
              <span className="text-[11px] text-[var(--os-text-2)]">{band.label}</span>
            </div>
          )}
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['kimmp-command-center'] })} className="p-2 rounded-lg border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all',
              view === t.key ? 'border-os-blue text-os-blue' : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === 'today'      && <TodayView ois={ois?.score ?? null} navigate={navigate} queryClient={queryClient} />}
      {view === 'business'   && <BusinessView domains={data.business ?? []} navigate={navigate} />}
      {view === 'objectives' && <ObjectivesView />}
      {view === 'system'     && <SystemView data={data} liveSignals={liveSignals} navigate={navigate} queryClient={queryClient} />}
      {view === 'brief'      && <BriefView />}
      {view === 'autopilot'  && <AutopilotView />}
      {view === 'simulator'  && <SimulatorView />}
      {view === 'candidates' && <CandidatesView />}

      {/* Footer */}
      <div className="flex items-center gap-2 text-[10px] text-[var(--os-text-2)]">
        <Clock className="w-3 h-3" />
        Last aggregated {dataUpdatedAt ? timeAgo(new Date(dataUpdatedAt).toISOString()) : '—'}
        <span className="ml-2">· Auto-refreshes every 30s</span>
      </div>
    </div>
  )
}
