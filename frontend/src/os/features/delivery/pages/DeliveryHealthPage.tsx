import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { Activity, TrendingDown, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { StaggerList, StaggerItem } from '@components/animations/Stagger'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { StatCard } from '@design-system/components/StatCard'
import { Badge } from '@design-system/components/Badge'
import { cn } from '@design-system/cn'
import { useProjectsStore } from '@features/projects/store'
import { useDeliveryStore } from '../store'
import type { Project } from '@features/projects/types'
import type { HealthDimensions } from '../types'

// ─── health computation ──────────────────────────────────────────────────────

function computeHealth(p: Project): HealthDimensions {
  const budgetRatio   = p.budget > 0 ? p.spent / p.budget : 0
  const progressRatio = p.progress / 100

  // Budget: spending ahead of progress is bad
  const budgetScore = Math.round(Math.max(20, Math.min(100,
    100 - Math.max(0, budgetRatio - progressRatio) * 180
  )))

  const scheduleScore =
    p.health === 'on-track'  ? 88
    : p.health === 'at-risk' ? 60
    : p.health === 'behind'  ? 35
    : 95 // completed

  const qualityScore = p.taskCount > 0
    ? Math.round(Math.max(35, 100 - (p.openIssues / p.taskCount) * 280))
    : 90

  // Deterministic from project id so it's stable
  const seed        = p.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const teamScore   = 68 + (seed % 26)
  const clientScore = 62 + ((seed * 7) % 32)

  const techScore =
    p.health === 'behind'   ? 48
    : p.health === 'at-risk'? 65
    : 82

  return {
    schedule: scheduleScore,
    budget:   budgetScore,
    quality:  qualityScore,
    team:     teamScore,
    client:   clientScore,
    tech:     techScore,
  }
}

function overallScore(h: HealthDimensions) {
  return Math.round(
    (h.schedule + h.budget + h.quality + h.team + h.client + h.tech) / 6
  )
}

function scoreToBadge(score: number): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (score >= 78) return { label: 'Healthy',    variant: 'success' }
  if (score >= 55) return { label: 'At Risk',    variant: 'warning' }
  return              { label: 'Critical',    variant: 'danger'  }
}

function scoreColor(score: number) {
  if (score >= 78) return '#22c55e'
  if (score >= 55) return '#f59e0b'
  return '#ef4444'
}

const DIMENSION_LABELS: Record<keyof HealthDimensions, string> = {
  schedule: 'Schedule',
  budget:   'Budget',
  quality:  'Quality',
  team:     'Team',
  client:   'Client',
  tech:     'Tech',
}

// ─── radar card ──────────────────────────────────────────────────────────────

function ProjectRadarCard({ project }: { project: Project }) {
  const health  = computeHealth(project)
  const overall = overallScore(health)
  const badge   = scoreToBadge(overall)
  const color   = scoreColor(overall)

  const radarData = (Object.keys(health) as (keyof HealthDimensions)[]).map(k => ({
    subject: DIMENSION_LABELS[k],
    score:   health[k],
    fullMark: 100,
  }))

  const cardHealth = overall >= 78 ? 'on-track' : overall >= 55 ? 'at-risk' : 'behind'

  return (
    <Card health={cardHealth} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: project.pillarColor }} />
            <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
          </div>
          <p className="text-xs text-slate-500 truncate">{project.client}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-2xl font-bold tracking-tight" style={{ color }}>{overall}</span>
          <Badge variant={badge.variant} dot size="sm">{badge.label}</Badge>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
          />
          <Radar
            name="Health"
            dataKey="score"
            stroke={color}
            fill={color}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(v: unknown) => [`${v ?? 0}/100`, 'Score'] as [string, string]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Dimension scores */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(health) as (keyof HealthDimensions)[]).map(k => (
          <div key={k} className="text-center">
            <div className="text-[11px] text-slate-500 mb-0.5 capitalize">{DIMENSION_LABELS[k]}</div>
            <div
              className="text-xs font-bold"
              style={{ color: scoreColor(health[k]) }}
            >
              {health[k]}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── main page ───────────────────────────────────────────────────────────────

export function DeliveryHealthPage() {
  const { projects } = useProjectsStore()
  const { risks }    = useDeliveryStore()
  const [showAll, setShowAll] = useState(false)

  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planned')
  const displayed      = showAll ? activeProjects : activeProjects.slice(0, 4)

  const healthScores   = activeProjects.map(p => ({ p, score: overallScore(computeHealth(p)) }))
  const avgHealth      = activeProjects.length
    ? Math.round(healthScores.reduce((s, h) => s + h.score, 0) / activeProjects.length)
    : 0
  const atRisk         = healthScores.filter(h => h.score < 78 && h.score >= 55).length
  const critical       = healthScores.filter(h => h.score < 55).length
  const openRisks      = risks.filter(r => r.status === 'OPEN' || r.status === 'ESCALATED').length
  const escalated      = risks.filter(r => r.status === 'ESCALATED').length

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Delivery" />

      <div>
        <h2 className="text-xl font-bold text-white">Delivery Health</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {activeProjects.length} active projects · 6-dimension health across schedule, budget, quality, team, client & tech
        </p>
      </div>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg Portfolio Health"
          value={`${avgHealth}/100`}
          icon={<Activity className="w-5 h-5" />}
          iconColor={avgHealth >= 78 ? 'bg-green-100 text-green-600' : avgHealth >= 55 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}
        />
        <StatCard
          label="At Risk"
          value={atRisk}
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColor={atRisk > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'}
        />
        <StatCard
          label="Critical"
          value={critical}
          icon={<TrendingDown className="w-5 h-5" />}
          iconColor={critical > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-300'}
        />
        <StatCard
          label="Open Risks"
          value={openRisks}
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconColor={escalated > 0 ? 'bg-red-100 text-red-600' : openRisks > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}
        />
      </div>

      {/* Health bar summary */}
      <Card>
        <CardHeader><CardTitle>Portfolio at a glance</CardTitle></CardHeader>
        <div className="space-y-3 mt-1">
          {healthScores
            .sort((a, b) => a.score - b.score)
            .map(({ p, score }) => (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p.pillarColor }}
                />
                <span className="text-xs text-slate-500 w-40 truncate">{p.name}</span>
                <div className="flex-1 h-2 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, background: scoreColor(score) }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-8 text-right"
                  style={{ color: scoreColor(score) }}
                >
                  {score}
                </span>
              </div>
            ))}
        </div>
      </Card>

      {/* Radar grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-300">Project deep-dive</p>
          <p className="text-xs text-slate-500">Click dimensions for detail</p>
        </div>
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {displayed.map(p => <StaggerItem key={p.id}><ProjectRadarCard project={p} /></StaggerItem>)}
        </StaggerList>
        {activeProjects.length > 4 && (
          <button
            onClick={() => setShowAll(v => !v)}
            className={cn(
              'mt-3 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors mx-auto',
            )}
          >
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showAll && 'rotate-180')} />
            {showAll ? 'Show less' : `Show ${activeProjects.length - 4} more projects`}
          </button>
        )}
      </div>
    </div>
  )
}
