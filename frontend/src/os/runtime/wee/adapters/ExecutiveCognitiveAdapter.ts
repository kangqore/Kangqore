// Executive Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Executive workspace experience.
// Never fetches. Adapts only what WAANDA already knows (Constitutional Law 2).

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

// ── Module-level helpers (keep adapt() within cognitive complexity budget) ────

function oisGrade(score: number | null): string | null {
  if (score == null)  return null
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 45) return 'D'
  return 'F'
}

function buildOisPillars(g8: NonNullable<WaandaCognitiveState['gate8']>) {
  return [
    { id: 'decision',   label: 'Decision',   score: g8.decisionScore   },
    { id: 'enterprise', label: 'Enterprise', score: g8.enterpriseScore },
    { id: 'workflow',   label: 'Workflow',   score: g8.workflowScore   },
    { id: 'goal',       label: 'Goals',      score: g8.goalScore       },
    { id: 'ai',         label: 'AI',         score: g8.aiScore         },
    { id: 'business',   label: 'Business',   score: g8.businessScore   },
    { id: 'trust',      label: 'Trust',      score: g8.trustScore      },
    { id: 'learning',   label: 'Learning',   score: g8.learningScore   },
    { id: 'adoption',   label: 'Adoption',   score: g8.adoptionScore   },
  ]
}

function buildPlatformHealth(state: Readonly<WaandaCognitiveState>) {
  const readyDomains    = state.domains.filter(d => d.ready).length
  const totalDomains    = state.domains.length
  const domainHealthPct = totalDomains > 0
    ? Math.round((readyDomains / totalDomains) * 100)
    : Math.round(state.confidence * 100)

  const totalSubsystems    = Object.keys(state.subsystems).length
  const operationalCount   = Object.values(state.subsystems).filter(s => s === 'OPERATIONAL').length
  const subsystemHealthPct = totalSubsystems > 0
    ? Math.round((operationalCount / totalSubsystems) * 100)
    : 0

  const healthPercent = totalDomains > 0
    ? Math.round((domainHealthPct * 0.6) + (subsystemHealthPct * 0.4))
    : subsystemHealthPct

  return { healthPercent, readyDomains, totalDomains }
}

function buildDomainRisk(state: Readonly<WaandaCognitiveState>) {
  type KPI = { id: string; name: string; target: number; current: number }
  const exposed = state.domains.map(d => {
    const kpis        = (d.kpis ?? []) as KPI[]
    const breachedKpis = kpis.filter(k => k.current < k.target)
    return { id: d.id, name: d.name, ready: d.ready, breachedKpis, totalKpis: kpis.length }
  }).filter(d => d.breachedKpis.length > 0)
  const totalBreached = exposed.reduce((sum, d) => sum + d.breachedKpis.length, 0)
  return { domainRiskExposure: exposed, totalBreachedKpis: totalBreached }
}

function buildActiveMissions(state: Readonly<WaandaCognitiveState>) {
  return state.systemBriefings
    .filter(b => b.priority === 'HIGH' || b.priority === 'CRITICAL')
    .map(b => ({
      goal:       b.summary,
      status:     'ACTIVE',
      priority:   b.priority,
      confidence: b.confidence,
      findings:   b.keyFindings ?? [],
      createdAt:  (b as any).createdAt,
    }))
}

function buildLatestBriefing(
  briefing: WaandaCognitiveState['systemBriefings'][number] | null,
  showDetail: boolean,
) {
  if (!briefing) return null
  return {
    id:              briefing.id,
    summary:         briefing.summary,
    priority:        briefing.priority,
    confidence:      briefing.confidence,
    keyFindings:     showDetail ? (briefing.keyFindings ?? []) : [],
    recommendations: showDetail ? (briefing.recommendations ?? []) : [],
    hasAlerts:       (briefing.alerts?.length ?? 0) > 0,
    alertCount:      briefing.alerts?.length ?? 0,
  }
}

// ── Adapter ───────────────────────────────────────────────────────────────────

export const ExecutiveCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'EXECUTIVE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, policy: ProjectionPolicy) {
    const showDetail = policy.levelOfDetail !== 'SUMMARY'
    const briefing   = state.systemBriefings[0] ?? null

    const g8         = state.gate8
    const oisScore   = g8?.oisScore ?? null
    const grade      = oisGrade(oisScore)
    const oisPillars = g8 ? buildOisPillars(g8) : []

    const platformHealth              = buildPlatformHealth(state)
    const { domainRiskExposure, totalBreachedKpis } = buildDomainRisk(state)
    const activeMissions              = buildActiveMissions(state)
    const latestBriefing              = buildLatestBriefing(briefing, showDetail)

    return {
      waandaPhase:      state.phase,
      kimmSynthesis:    state.kimmSynthesis,
      latestSynthesis:  state.kimmSynthesis,
      latestBriefing,
      // OIS / Gate 8
      oisScore,
      grade,
      oisPillars,
      // Health
      platformHealth,
      operationalDomains: state.domains,
      // Decisions
      pendingDecisions: state.pendingDecisions,
      openDecisions:    state.pendingDecisions,
      decisionCount:    state.pendingDecisions.length,
      // Domains
      domains:          state.domains,
      domainCount:      state.domains.length,
      // Goals
      goals:            state.enterpriseGoals,
      goalCount:        state.enterpriseGoals.length,
      // Missions
      activeMissions,
      // Optimization
      totalBreachedKpis,
      domainRiskExposure,
      platformConfidence: Math.round(state.confidence * 100),
      // Pass-through
      enterprisePredictions: state.enterprisePredictions,
      systemBriefings:       state.systemBriefings,
      confidence:            state.confidence,
      oisHistory:            state.gate8History,
    }
  },
}
