// Executive Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Executive workspace experience.
// Never fetches. Adapts only what WAANDA already knows (Constitutional Law 2).

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const ExecutiveCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'EXECUTIVE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, policy: ProjectionPolicy) {
    const briefing    = state.systemBriefings[0] ?? null
    const showDetail  = policy.levelOfDetail !== 'SUMMARY'

    // Platform health from domain readiness
    const readyDomains = state.domains.filter(d => d.ready).length
    const totalDomains = state.domains.length
    const domainHealthPct = totalDomains > 0
      ? Math.round((readyDomains / totalDomains) * 100)
      : Math.round(state.confidence * 100)

    // Subsystem health
    const totalSubsystems   = Object.keys(state.subsystems).length
    const operationalCount  = Object.values(state.subsystems).filter(s => s === 'OPERATIONAL').length
    const subsystemHealthPct = totalSubsystems > 0
      ? Math.round((operationalCount / totalSubsystems) * 100)
      : 0

    // Blended health score
    const healthPercent = totalDomains > 0
      ? Math.round((domainHealthPct * 0.6) + (subsystemHealthPct * 0.4))
      : subsystemHealthPct

    // KPI breach analysis — domains whose current KPI value is below target
    const domainRiskExposure = state.domains
      .map(d => {
        const kpis = (d.kpis ?? []) as Array<{ id: string; name: string; target: number; current: number }>
        const breachedKpis = kpis.filter(k => k.current < k.target)
        return { id: d.id, name: d.name, ready: d.ready, breachedKpis, totalKpis: kpis.length }
      })
      .filter(d => d.breachedKpis.length > 0)

    const totalBreachedKpis = domainRiskExposure.reduce((sum, d) => sum + d.breachedKpis.length, 0)

    // Active missions from high-priority briefings
    const activeMissions = state.systemBriefings
      .filter(b => b.priority === 'HIGH' || b.priority === 'CRITICAL')
      .map(b => ({
        goal:       b.summary,
        status:     'ACTIVE',
        priority:   b.priority,
        confidence: b.confidence,
        findings:   showDetail ? (b.keyFindings ?? []) : [],
      }))

    return {
      waandaPhase:  state.phase,
      kimmSynthesis: state.kimmSynthesis,
      latestSynthesis: state.kimmSynthesis,       // primary key for StrategyCenterWidget
      latestBriefing: briefing
        ? {
            id:              briefing.id,
            summary:         briefing.summary,
            priority:        briefing.priority,
            confidence:      briefing.confidence,
            keyFindings:     showDetail ? (briefing.keyFindings ?? []) : [],
            recommendations: showDetail ? (briefing.recommendations ?? []) : [],
            hasAlerts:       (briefing.alerts?.length ?? 0) > 0,
            alertCount:      briefing.alerts?.length ?? 0,
          }
        : null,
      // Health
      platformHealth: { healthPercent, readyDomains, totalDomains },
      operationalDomains: state.domains.filter(d => d.ready),
      // Decisions
      pendingDecisions: state.pendingDecisions,
      openDecisions:    state.pendingDecisions,
      decisionCount:    state.pendingDecisions.length,
      // Domains (full data including KPIs for optimization)
      domains: state.domains,
      domainCount: state.domains.length,
      // Goals
      goals: state.enterpriseGoals,
      goalCount: state.enterpriseGoals.length,
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
    }
  },
}
