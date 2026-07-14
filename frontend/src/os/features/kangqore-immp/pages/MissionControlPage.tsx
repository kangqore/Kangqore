import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@lib/api'
import { adminApi } from '@lib/api'
import { useNavigate } from 'react-router-dom'
import {
  Target, GitBranch, AlertTriangle, Clock, Plug, Brain,
  Zap, TrendingUp, CheckCircle2, XCircle, PauseCircle,
  RefreshCw, ChevronRight, ThumbsUp, Loader2, Activity,
  Sparkles, FolderKanban, Gauge, Timer, AlertOctagon, Network,
} from 'lucide-react'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────
interface HealthScore {
  score:     number
  label:     string
  color:     string
  breakdown: Array<{ factor: string; impact: number; description: string }>
}

interface MissionData {
  score:           HealthScore
  goals:           { active: number; avgProgress: number; needingAction: number }
  workflows:       { running: number; paused: number; completed24h: number; failed24h: number; total: number }
  risks:           { criticalSignals: number; highSignals: number; atRiskClients: number; unhealthyProjects: number; overdueInvoices: number }
  blockedApprovals: Array<{ id: string; name: string; triggeredBy: string; startedAt: string; currentStep: string | null }>
  integrations:    Array<{ platform: string; connected: boolean; lastUsedAt: string | null }>
  recommendations: Array<{ id: string; summary: string; recommendation: string; confidence: number; createdAt: string }>
  opportunities:   Array<{ goalId: string; objective: string; reasoning: string; evaluatedAt: string }>
  recentSignals:   Array<{ id: string; signalType: string; signalValue: string; severity: string; createdAt: string }>
  recentActivity:  Array<{ type: string; label: string; detail: string; timestamp: string; severity?: string }>
  generatedAt:     string
}

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#e2445c', HIGH: '#fdab3d', MEDIUM: '#579bfc', LOW: '#00c875',
}

interface ProjectOpsRow {
  projectId:           string
  health:              number
  confidence:          number
  predictedCompletion: string | null
  risks:               Array<{ label: string; severity: string; probability: number }>
  blockers:            Array<{ label: string; since: string }>
  activeRecommendations: Array<{ action: string; impact: string; priority: string }>
  lastAssessment:      string
  project?:            { title: string; dueDate: string | null }
}

const PLATFORM_ICON: Record<string, string> = {
  slack: 'SL', jira: 'JR', github: 'GH', salesforce: 'SF',
}

// ── Vital stat card ───────────────────────────────────────────────────────────
function VitalCard({ label, value, sub, color, icon: Icon, pulse }: {
  label: string; value: number | string; sub?: string
  color?: string; icon: any; pulse?: boolean
}) {
  return (
    <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] px-5 py-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg transition-transform duration-500 group-hover:scale-110" style={{ background: color ? `${color}15` : 'rgba(255, 255, 255, 0.05)' }}>
          <Icon className={cn('w-4 h-4', pulse && 'animate-pulse')} style={{ color: color ?? 'var(--os-text-2)' }} />
        </div>
        <span className="text-[10px] text-[var(--os-text-3)] font-bold uppercase tracking-widest mt-1">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-[var(--os-text-1)] tracking-tight tabular-nums mt-3">{value}</p>
      {sub && <p className="text-[11px] text-[var(--os-text-2)] mt-1 font-medium">{sub}</p>}
    </div>
  )
}

// ── Enterprise health score arc ───────────────────────────────────────────────
function HealthArc({ score, color, label }: { score: number; color: string; label: string }) {
  const r       = 54
  const circ    = 2 * Math.PI * r
  const fill    = (score / 100) * circ * 0.75  // 3/4 arc
  const offset  = circ * 0.125                  // start at 7 o'clock

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="110" viewBox="0 0 140 110">
        <circle cx="70" cy="80" r={r} fill="none" stroke="var(--os-border)" strokeWidth="10"
          strokeDasharray={`${circ * 0.75} ${circ}`} strokeDashoffset={-offset}
          strokeLinecap="round" transform="rotate(-90 70 80)" />
        <circle cx="70" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`} strokeDashoffset={-offset}
          strokeLinecap="round" transform="rotate(-90 70 80)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="70" y="76" textAnchor="middle" fill="var(--os-text-1)" fontSize="26" fontWeight="700">{score}</text>
        <text x="70" y="96" textAnchor="middle" fill="var(--os-text-2)" fontSize="9">{label}</text>
      </svg>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function MissionControlPage() {
  const qc       = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, dataUpdatedAt } = useQuery<MissionData>({
    queryKey:       ['waoe-mission-control'],
    queryFn:        () => apiFetch('/admin/kangqore-immp/waoe/mission-control'),
    staleTime:      20_000,
    refetchInterval: 30_000,
  })

  const approve = useMutation({
    mutationFn: (runId: string) => apiFetch(`/admin/kangqore-immp/waoe/runs/${runId}/approve`, {
      method: 'POST', body: JSON.stringify({ note: 'Approved from Mission Control' }),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waoe-mission-control'] }),
  })

  const runCycle = useMutation({
    mutationFn: () => apiFetch('/admin/kangqore-immp/waoe/goals/cycle', { method: 'POST', body: '{}' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['waoe-mission-control'] }),
  })

  // All hooks must be declared before any early return
  const { data: pulse } = useQuery<{ sentence: string; updatedAt: string }>({
    queryKey: ['enterprise-pulse'],
    queryFn:  () => adminApi('/admin/enterprise/pulse'),
    refetchInterval: 300_000,
  })

  const { data: portfolio } = useQuery<ProjectOpsRow[]>({
    queryKey: ['portfolio-ops'],
    queryFn:  () => adminApi('/admin/projects/ops/portfolio'),
    refetchInterval: 120_000,
    retry: false,
  })

  if (isLoading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-[var(--os-surface-0)]" />)}
      </div>
    )
  }

  const { score, goals, workflows, risks, blockedApprovals, integrations,
          recommendations, opportunities, recentSignals, recentActivity } = data

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—'

  return (
    <div className="space-y-5">

      {/* ── Enterprise Pulse ── */}
      {pulse?.sentence && (
        <div className="flex items-start gap-3 rounded-xl border border-[#eab30844] bg-[#eab30811] px-4 py-3">
          <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#eab308' }} />
          <p className="text-[12px] text-[var(--os-text-1)] leading-relaxed">{pulse.sentence}</p>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#fdab3d]" />
            <h2 className="text-base font-bold text-[var(--os-text-1)]">Mission Control</h2>
            <span className="text-[10px] text-[var(--os-text-2)] font-mono">WAANDA OS</span>
          </div>
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">Last updated {lastUpdated}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/kangqore-view/admin/workflows/canvas?seed=ois&score=${score.score}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#7f53f925] bg-[#7f53f910] text-[11px] text-[#7f53f9] hover:bg-[#7f53f920] transition-colors"
          >
            <Network className="w-3 h-3" />
            Graph View
          </button>
          <button
            onClick={() => runCycle.mutate()}
            disabled={runCycle.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[11px] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] hover:border-[#579bfc]"
          >
            {runCycle.isPending
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <RefreshCw className="w-3 h-3" />}
            Evaluate Goals
          </button>
        </div>
      </div>

      {/* ── Health score + vitals ── */}
      <div className="grid grid-cols-5 gap-3">

        {/* Arc */}
        <div className="col-span-1 rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] flex flex-col items-center justify-center py-3 px-2">
          <HealthArc score={score.score} color={score.color} label={score.label} />
          <p className="text-[10px] text-[var(--os-text-2)] mt-1 text-center">Enterprise Health</p>
        </div>

        {/* Vitals */}
        <VitalCard label="Goals"      value={goals.active}      sub={`${goals.avgProgress}% avg · ${goals.needingAction} need action`} icon={Target}    color={goals.needingAction > 0 ? '#fdab3d' : undefined} />
        <VitalCard label="Workflows"  value={workflows.running}  sub={`${workflows.paused} paused · ${workflows.completed24h} done 24h`}  icon={GitBranch} color={workflows.running > 0 ? '#579bfc' : undefined} pulse={workflows.running > 0} />
        <VitalCard label="Risks"      value={risks.criticalSignals + risks.highSignals} sub={`${risks.atRiskClients} clients · ${risks.overdueInvoices} invoices`} icon={AlertTriangle} color={risks.criticalSignals > 0 ? '#e2445c' : risks.highSignals > 0 ? '#fdab3d' : undefined} />
        <VitalCard label="Approvals"  value={blockedApprovals.length} sub="waiting for review" icon={Clock} color={blockedApprovals.length > 0 ? '#fdab3d' : undefined} />
      </div>

      {/* ── Health breakdown ── */}
      {score.breakdown.length > 0 && (
        <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] px-4 py-3">
          <p className="text-[10px] font-semibold text-[var(--os-text-2)] uppercase tracking-widest mb-2.5">Health Breakdown</p>
          <div className="space-y-1.5">
            {score.breakdown.map(f => (
              <div key={f.factor} className="flex items-center gap-3">
                <span className={cn('text-[11px] font-mono w-6 text-right', f.impact < 0 ? 'text-red-400' : 'text-green-400')}>
                  {f.impact < 0 ? f.impact : '+0'}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-[var(--os-surface-0)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.abs(f.impact)}%`, background: f.impact < 0 ? '#e2445c' : '#00c875' }}
                  />
                </div>
                <span className="text-[11px] text-[var(--os-text-2)]">{f.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Three-column body ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Col 1: Blocked approvals + opportunities */}
        <div className="space-y-4">

          {/* Blocked approvals */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#fdab3d]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Blocked Approvals</p>
              {blockedApprovals.length > 0 && (
                <span className="ml-auto text-[10px] font-bold text-[#fdab3d] bg-[#fdab3d]/10 px-1.5 py-0.5 rounded-full">{blockedApprovals.length}</span>
              )}
            </div>
            {blockedApprovals.length === 0 ? (
              <div className="px-4 py-5 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-[11px] text-[var(--os-text-2)]">No blocked workflows</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {blockedApprovals.map(r => (
                  <div key={r.id} className="px-4 py-3">
                    <p className="text-[11px] font-semibold text-[var(--os-text-1)] truncate">{r.name}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">by {r.triggeredBy} · {r.currentStep ?? 'awaiting gate'}</p>
                    <button
                      onClick={() => approve.mutate(r.id)}
                      disabled={approve.isPending}
                      className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-semibold hover:bg-green-500/30 disabled:opacity-50"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" /> Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Autonomous opportunities */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#579bfc]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Autonomous Opportunities</p>
              {opportunities.length > 0 && <span className="ml-auto text-[10px] font-bold text-[#579bfc] bg-[#579bfc]/10 px-1.5 py-0.5 rounded-full">{opportunities.length}</span>}
            </div>
            {opportunities.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] text-center py-5">No autonomous opportunities detected</p>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {opportunities.slice(0, 5).map(op => (
                  <div key={op.goalId} className="px-4 py-3">
                    <p className="text-[11px] font-semibold text-[var(--os-text-1)] line-clamp-1">{op.objective}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5 line-clamp-2">{op.reasoning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Recommendations + recent signals */}
        <div className="space-y-4">

          {/* KIMMP Recommendations */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <Brain className="w-3.5 h-3.5 text-[#7c3aed]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">WAANDA Recommendations</p>
            </div>
            {recommendations.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] text-center py-5">No recommendations in last 24h</p>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {recommendations.map(r => (
                  <div key={r.id} className="px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="h-1 flex-1 rounded-full bg-[var(--os-surface-0)]">
                        <div className="h-full rounded-full bg-[#7c3aed]" style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span className="text-[10px] text-[var(--os-text-2)]">{r.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-[var(--os-text-1)] line-clamp-2">{r.recommendation}</p>
                    <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">{new Date(r.createdAt).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active signals */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#fdab3d]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Active Signals</p>
            </div>
            {recentSignals.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] text-center py-5">No active signals</p>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {recentSignals.slice(0, 6).map(s => (
                  <div key={s.id} className="px-4 py-2.5 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: SEVERITY_COLOR[s.severity] ?? '#8b8b8b' }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[var(--os-text-1)]">{s.signalType}</p>
                      <p className="text-[10px] text-[var(--os-text-2)] truncate">{s.signalValue}</p>
                    </div>
                    <span className="text-[9px] font-bold ml-auto flex-shrink-0" style={{ color: SEVERITY_COLOR[s.severity] }}>{s.severity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Integrations + activity feed */}
        <div className="space-y-4">

          {/* Integration status */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <Plug className="w-3.5 h-3.5 text-[#00c875]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Integrations</p>
              <span className="ml-auto text-[10px] text-[var(--os-text-2)]">{integrations.filter(i => i.connected).length} connected</span>
            </div>
            {integrations.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] text-center py-5">No integrations configured</p>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {integrations.map(i => (
                  <div key={i.platform} className="px-4 py-2.5 flex items-center gap-3">
                    <span className="w-7 h-7 rounded bg-[var(--os-surface-0)] flex items-center justify-center text-[9px] font-bold text-[var(--os-text-2)]">
                      {PLATFORM_ICON[i.platform] ?? i.platform.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-[var(--os-text-1)] capitalize">{i.platform}</p>
                      <p className="text-[10px] text-[var(--os-text-2)]">
                        {i.lastUsedAt ? `Last used ${new Date(i.lastUsedAt).toLocaleDateString()}` : 'Never used'}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: i.connected ? '#00c875' : '#e2445c' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wave 1 — Project Intelligence */}
          {portfolio && portfolio.length > 0 && (
            <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Project Intelligence</p>
                <span className="ml-auto text-[9px] text-[var(--os-text-2)] font-mono uppercase tracking-wider">DELIVERY OPS · Wave 1</span>
              </div>
              {/* Portfolio summary bar */}
              {(() => {
                const avgHealth = Math.round(portfolio.reduce((s, p) => s + p.health, 0) / portfolio.length)
                const atRisk    = portfolio.filter(p => p.health < 60).length
                const critical  = portfolio.filter(p => p.health < 40).length
                const healthColor = avgHealth >= 80 ? '#00c875' : avgHealth >= 60 ? '#fdab3d' : '#e2445c'
                return (
                  <div className="px-4 py-3 flex items-center gap-6 border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3.5 h-3.5" style={{ color: healthColor }} />
                      <span className="text-[11px] text-[var(--os-text-2)]">Portfolio Health</span>
                      <span className="text-[13px] font-bold tabular-nums" style={{ color: healthColor }}>{avgHealth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#fdab3d]" />
                      <span className="text-[11px] text-[var(--os-text-2)]">At Risk</span>
                      <span className="text-[13px] font-bold tabular-nums text-[#fdab3d]">{atRisk}</span>
                    </div>
                    {critical > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="w-3.5 h-3.5 text-[#e2445c]" />
                        <span className="text-[11px] text-[var(--os-text-2)]">Critical</span>
                        <span className="text-[13px] font-bold tabular-nums text-[#e2445c]">{critical}</span>
                      </div>
                    )}
                    <span className="ml-auto text-[10px] text-[var(--os-text-2)]">{portfolio.length} projects assessed</span>
                  </div>
                )
              })()}
              <div className="divide-y divide-[var(--os-border)]">
                {portfolio.slice(0, 5).map(p => {
                  const hColor = p.health >= 80 ? '#00c875' : p.health >= 60 ? '#fdab3d' : '#e2445c'
                  return (
                    <div key={p.projectId} className="px-4 py-2.5 flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold"
                        style={{ background: `${hColor}22`, color: hColor }}>
                        {Math.round(p.health)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-[var(--os-text-1)] truncate">
                          {(p as any).project?.title ?? `Project ${p.projectId.slice(0, 6)}`}
                        </p>
                        {p.risks.length > 0 && (
                          <p className="text-[10px] text-[var(--os-text-2)] truncate">
                            {p.risks[0].label}
                          </p>
                        )}
                        {p.activeRecommendations.length > 0 && (
                          <p className="text-[10px] truncate mt-0.5" style={{ color: '#0ea5e9' }}>
                            → {p.activeRecommendations[0].action}
                          </p>
                        )}
                      </div>
                      {p.predictedCompletion && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Timer className="w-3 h-3 text-[var(--os-text-2)]" />
                          <span className="text-[10px] text-[var(--os-text-2)]">
                            {new Date(p.predictedCompletion).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent activity feed */}
          <div className="rounded-xl border border-[var(--os-border)] bg-[var(--os-card)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--os-border)] flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#579bfc]" />
              <p className="text-[11px] font-semibold text-[var(--os-text-1)]">Activity</p>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-[11px] text-[var(--os-text-2)] text-center py-5">No recent activity</p>
            ) : (
              <div className="divide-y divide-[var(--os-border)]">
                {recentActivity.map((a, idx) => {
                  const StatusIcon = a.detail.includes('COMPLETED') ? CheckCircle2
                    : a.detail.includes('FAILED') ? XCircle
                    : a.detail.includes('PAUSED') ? PauseCircle
                    : ChevronRight
                  return (
                    <div key={idx} className="px-4 py-2.5 flex items-start gap-2">
                      <StatusIcon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: SEVERITY_COLOR[a.severity ?? 'LOW'] ?? 'var(--os-text-2)' }} />
                      <div className="min-w-0">
                        <p className="text-[11px] text-[var(--os-text-1)] truncate">{a.label}</p>
                        <p className="text-[10px] text-[var(--os-text-2)]">{a.detail}</p>
                      </div>
                      <p className="text-[9px] text-[var(--os-text-2)] flex-shrink-0 ml-auto">{new Date(a.timestamp).toLocaleTimeString()}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
