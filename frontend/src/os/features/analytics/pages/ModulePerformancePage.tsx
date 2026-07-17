import { useQuery } from '@tanstack/react-query'
import { BarChart3, Target, Zap, Brain, Briefcase, Scale, Users, GitBranch, BookOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PillarDetail {
  score: number
  metrics: Record<string, unknown>
  velocityModifier?: number
}

interface Gate8Result {
  oisScore:        number
  decisionScore:   number
  workflowScore:   number
  aiScore:         number
  enterpriseScore: number
  goalScore:       number
  learningScore:   number
  businessScore:   number
  trustScore:      number
  adoptionScore:   number
  pillars: {
    decision:   PillarDetail
    workflow:   PillarDetail
    ai:         PillarDetail
    enterprise: PillarDetail
    goal:       PillarDetail
    learning:   PillarDetail & { velocityModifier: number }
    business:   PillarDetail
    trust:      PillarDetail
    adoption:   PillarDetail
  }
}

// ── Pillar metadata (maps gate8 keys → UI + platform module context) ──────────

const PILLAR_META: Array<{
  key: keyof Gate8Result['pillars']
  label: string
  weight: number
  icon: React.FC<{ className?: string }>
  modules: string[]
  scoreKey: keyof Gate8Result
  description: string
}> = [
  {
    key: 'decision',   label: 'Decision Intelligence', weight: 0.20, icon: Brain,
    modules: ['Decisions Engine', 'KIMMP Strategic', 'Workflow Canvas'],
    scoreKey: 'decisionScore',
    description: 'Quality + velocity of operational decisions. Pending decisions, avg confidence, resolution time.',
  },
  {
    key: 'enterprise', label: 'Enterprise Execution',  weight: 0.18, icon: Briefcase,
    modules: ['Projects', 'Strategy', 'Delivery'],
    scoreKey: 'enterpriseScore',
    description: 'Portfolio project health, on-time delivery rate, resource utilisation.',
  },
  {
    key: 'workflow',   label: 'Workflow Automation',   weight: 0.15, icon: GitBranch,
    modules: ['Workflows', 'WVIS Canvas', 'WAOE Runtime'],
    scoreKey: 'workflowScore',
    description: 'Workflow success rate, automation coverage, execution latency.',
  },
  {
    key: 'goal',       label: 'Goal Attainment',       weight: 0.14, icon: Target,
    modules: ['Goals', 'KPIs', 'OKRs'],
    scoreKey: 'goalScore',
    description: 'KIMMP + enterprise goal completion rate, deadline adherence, target coverage.',
  },
  {
    key: 'ai',         label: 'AI Intelligence',       weight: 0.10, icon: Zap,
    modules: ['WAANDA Cycle', 'KIMMP Brain', 'Signal Ledger'],
    scoreKey: 'aiScore',
    description: 'AI layer quality: signal confidence, briefing accuracy, inference velocity.',
  },
  {
    key: 'business',   label: 'Business Performance',  weight: 0.10, icon: BarChart3,
    modules: ['Finance', 'Revenue Pipeline', 'Leads'],
    scoreKey: 'businessScore',
    description: 'Revenue health, invoice collection rate, pipeline conversion, cash flow.',
  },
  {
    key: 'trust',      label: 'Trust & Governance',    weight: 0.08, icon: Scale,
    modules: ['AEGIS', 'Ontology', 'Compliance'],
    scoreKey: 'trustScore',
    description: 'Compliance posture, policy adherence, egress hygiene, audit trail density.',
  },
  {
    key: 'learning',   label: 'Learning Velocity',     weight: undefined as unknown as number, icon: BookOpen,
    modules: ['Memory', 'Training', 'Reflection'],
    scoreKey: 'learningScore',
    description: 'Knowledge accumulation rate, KIMMP memory growth, training throughput.',
  },
  {
    key: 'adoption',   label: 'Platform Adoption',     weight: 0.05, icon: Users,
    modules: ['KEOS Workspaces', 'Active Clients', 'Portals'],
    scoreKey: 'adoptionScore',
    description: 'Active user engagement, workspace utilisation, client portal activity.',
  },
]

// ── Demo fallback ─────────────────────────────────────────────────────────────

const DEMO_GATE8: Gate8Result = {
  oisScore: 78.9,
  decisionScore: 85.2, workflowScore: 79.4, aiScore: 88.1,
  enterpriseScore: 74.3, goalScore: 81.0, learningScore: 72.5,
  businessScore: 69.8, trustScore: 91.2, adoptionScore: 65.0,
  pillars: {
    decision:   { score: 85.2, metrics: { total: 15, pending: 3, avgConfidencePct: 87, avgResolutionHours: 14.2 } },
    workflow:   { score: 79.4, metrics: { total: 48, successRate: 0.91, avgStepsCompleted: 6.2 } },
    ai:         { score: 88.1, metrics: { callCount: 142, avgConfidence: 91.4, signalCount: 47 } },
    enterprise: { score: 74.3, metrics: { activeProjects: 4, portfolioHealth: 0.74, onTimeRate: 0.68 } },
    goal:       { score: 81.0, metrics: { totalGoals: 12, completedPct: 58, nearDeadline: 2 } },
    learning:   { score: 72.5, metrics: { memoryEntries: 231, trainingSessions: 8 }, velocityModifier: 0.02 },
    business:   { score: 69.8, metrics: { pipelineValue: 4800000, collectionRate: 0.82, overdueInvoices: 3 } },
    trust:      { score: 91.2, metrics: { complianceScore: 94, openFindings: 1, auditEvents: 1840 } },
    adoption:   { score: 65.0, metrics: { activeUsers: 12, clientPortalLogins: 23, workspaceSessions: 47 } },
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 85) return '#10b981'
  if (score >= 72) return '#f59e0b'
  return '#ef4444'
}

function healthLabel(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 85) return 'success'
  if (score >= 72) return 'warning'
  return 'danger'
}

function healthText(score: number) {
  if (score >= 85) return 'Healthy'
  if (score >= 72) return 'Monitor'
  return 'At Risk'
}

function ScoreBar({ score, weight }: { score: number; weight?: number }) {
  const color = scoreColor(score)
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[var(--os-text-3)]">Score</span>
        <div className="flex items-center gap-2">
          {weight != null && (
            <span className="text-xs text-[var(--os-text-3)]">×{(weight * 100).toFixed(0)}% weight</span>
          )}
          <span className="text-sm font-bold font-mono" style={{ color }}>{score.toFixed(1)}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-[var(--os-border)] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-[var(--os-border)] last:border-0">
      <span className="text-xs text-[var(--os-text-2)]">{label}</span>
      <span className="text-xs font-semibold font-mono text-[var(--os-text-1)]">{value}</span>
    </div>
  )
}

function formatMetricLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

function formatMetricValue(key: string, val: unknown): string {
  if (typeof val === 'number') {
    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('pct') || key.toLowerCase().includes('percent')) {
      return val > 1 ? `${val.toFixed(0)}%` : `${(val * 100).toFixed(0)}%`
    }
    if (key.toLowerCase().includes('value') || key.toLowerCase().includes('pipeline')) {
      return `₹${(val as number / 1e5).toFixed(1)}L`
    }
    if (key.toLowerCase().includes('hours')) return `${(val as number).toFixed(1)}h`
    return typeof val === 'number' ? val.toFixed(val % 1 !== 0 ? 1 : 0) : String(val)
  }
  return String(val)
}

// Decide which metrics to surface for each pillar (top 3 most informative)
const METRIC_KEYS: Record<string, string[]> = {
  decision:   ['total', 'pending', 'avgConfidencePct'],
  workflow:   ['total', 'successRate', 'avgStepsCompleted'],
  ai:         ['callCount', 'avgConfidence', 'signalCount'],
  enterprise: ['activeProjects', 'portfolioHealth', 'onTimeRate'],
  goal:       ['totalGoals', 'completedPct', 'nearDeadline'],
  learning:   ['memoryEntries', 'trainingSessions'],
  business:   ['collectionRate', 'overdueInvoices'],
  trust:      ['complianceScore', 'openFindings', 'auditEvents'],
  adoption:   ['activeUsers', 'clientPortalLogins', 'workspaceSessions'],
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ModulePerformancePage() {
  const { data, isLoading } = useQuery<Gate8Result>({
    queryKey: ['gate8-full'],
    queryFn:  () => api.get('/admin/gate8/score').then(r => r.data),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 3,
  })

  const g8 = data ?? (isDemo() ? DEMO_GATE8 : null)

  // Sort pillars by score descending for the ranking section
  const ranked = g8
    ? PILLAR_META
        .map(m => ({ ...m, score: g8[m.scoreKey] as number }))
        .sort((a, b) => b.score - a.score)
    : []

  // OIS composition: how much each pillar contributes to the final score
  const contributions = g8
    ? PILLAR_META
        .filter(m => m.weight != null)
        .map(m => ({
          label:        m.label,
          score:        g8[m.scoreKey] as number,
          weight:       m.weight!,
          contribution: (g8[m.scoreKey] as number) * m.weight!,
        }))
        .sort((a, b) => b.contribution - a.contribution)
    : []

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]">
          <Spinner size="sm" /> Loading module performance…
        </div>
      )}

      {/* OIS Composition strip */}
      {g8 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              OIS Composition — Weighted Contribution per Pillar
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {contributions.map(c => {
              const maxContrib = 0.20 * 100 // theoretical max per pillar (20% × 100 score)
              const pct = (c.contribution / maxContrib) * 100
              return (
                <div key={c.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[var(--os-text-1)]">{c.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--os-text-3)]">{c.score.toFixed(1)} × {(c.weight * 100).toFixed(0)}%</span>
                      <span className="text-sm font-bold font-mono" style={{ color: scoreColor(c.score), minWidth: 36, textAlign: 'right' }}>
                        +{c.contribution.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--os-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%`, background: scoreColor(c.score) }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="flex justify-between items-center pt-2 border-t border-[var(--os-border)]">
              <span className="text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider">Total OIS Score</span>
              <span className="text-lg font-extrabold" style={{ color: scoreColor(g8.oisScore) }}>
                {g8.oisScore.toFixed(1)}
              </span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Ranked summary table */}
      {ranked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pillar Rankings</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[var(--os-border)]">
              {ranked.map((p, idx) => {
                const Icon = p.icon
                const color = scoreColor(p.score)
                return (
                  <div key={p.key} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--os-bg2)] transition-colors">
                    <span className="text-xs font-bold text-[var(--os-text-3)] w-5 text-right">#{idx + 1}</span>
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--os-text-1)]">{p.label}</p>
                      <p className="text-xs text-[var(--os-text-3)] truncate">{p.modules.join(' · ')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.weight != null && (
                        <span className="text-xs text-[var(--os-text-3)]">×{(p.weight * 100).toFixed(0)}%</span>
                      )}
                      <span className="text-sm font-bold font-mono w-12 text-right" style={{ color }}>
                        {p.score.toFixed(1)}
                      </span>
                      <Badge size="sm" variant={healthLabel(p.score)}>{healthText(p.score)}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Pillar detail cards — 3-col grid */}
      {g8 && (
        <>
          <p className="text-xs font-semibold text-[var(--os-text-3)] uppercase tracking-wider">Pillar Detail</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PILLAR_META.map(meta => {
              const pillar  = g8.pillars[meta.key]
              const score   = g8[meta.scoreKey] as number
              const color   = scoreColor(score)
              const Icon    = meta.icon
              const metricKeys = METRIC_KEYS[meta.key] ?? []

              return (
                <div
                  key={meta.key}
                  className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-xl p-5 space-y-4"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                      <span className="text-sm font-bold text-[var(--os-text-1)]">{meta.label}</span>
                    </div>
                    <Badge size="sm" variant={healthLabel(score)} dot>{healthText(score)}</Badge>
                  </div>

                  {/* Score bar */}
                  <ScoreBar score={score} weight={meta.weight} />

                  {/* Description */}
                  <p className="text-xs text-[var(--os-text-3)] leading-relaxed">{meta.description}</p>

                  {/* Live metrics */}
                  {pillar?.metrics && metricKeys.length > 0 && (
                    <div className="space-y-0.5">
                      {metricKeys
                        .filter(k => pillar.metrics[k] != null)
                        .map(k => (
                          <MetricRow
                            key={k}
                            label={formatMetricLabel(k)}
                            value={formatMetricValue(k, pillar.metrics[k])}
                          />
                        ))}
                    </div>
                  )}

                  {/* Module chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meta.modules.map(m => (
                      <span
                        key={m}
                        className="text-xs px-2 py-0.5 rounded-md"
                        style={{ background: color + '12', color, border: `1px solid ${color}22` }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
