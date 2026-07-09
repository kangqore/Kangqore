// Executive Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Executive workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const ExecutiveCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'EXECUTIVE',

  async adapt(state: WaandaCognitiveState, _contract: ExperienceContract, policy: ProjectionPolicy) {
    const briefing = state.systemBriefings[0] ?? null
    const showDetail = policy.levelOfDetail !== 'SUMMARY'

    return {
      waandaPhase: state.phase,
      kimmSynthesis: state.kimmSynthesis,
      latestBriefing: briefing
        ? {
            id: briefing.id,
            summary: briefing.summary,
            priority: briefing.priority,
            confidence: briefing.confidence,
            keyFindings: showDetail ? (briefing.keyFindings ?? []) : [],
            recommendations: showDetail ? (briefing.recommendations ?? []) : [],
            hasAlerts: (briefing.alerts?.length ?? 0) > 0,
            alertCount: briefing.alerts?.length ?? 0,
          }
        : null,
      pendingDecisions: state.pendingDecisions,
      decisionCount: state.pendingDecisions.length,
      domains: state.domains.map(d => ({
        id: d.id,
        name: d.name,
        ready: d.ready,
        capabilities: d.capabilities ?? 0,
        goals: d.goals ?? 0,
      })),
      domainCount: state.domains.length,
      confidence: state.confidence,
    }
  },
}
