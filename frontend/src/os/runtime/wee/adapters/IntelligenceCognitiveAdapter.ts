// Enterprise Intelligence Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Enterprise Intelligence workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const IntelligenceCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'INTELLIGENCE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const activeDrifts = state.enterprisePredictions.filter(p => p.driftDetected)
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const avgExternalTrust = liveSessions.length > 0
      ? liveSessions.reduce((s, e) => s + e.trustScore, 0) / liveSessions.length
      : 0

    // Top 5 predictions sorted by confidence descending
    const topPredictions = [...state.enterprisePredictions]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)

    // Briefings split by priority for the insights explorer
    const allBriefings   = state.systemBriefings
    const criticalBriefs = allBriefings.filter(b => b.priority === 'CRITICAL')
    const highBriefs     = allBriefings.filter(b => b.priority === 'HIGH')
    const mediumBriefs   = allBriefings.filter(b => b.priority === 'MEDIUM')

    // Gate 8 pillar breakdown
    const gate8Pillars = state.gate8 ? {
      decision:   state.gate8.decisionScore,
      workflow:   state.gate8.workflowScore,
      ai:         state.gate8.aiScore,
      enterprise: state.gate8.enterpriseScore,
      goal:       state.gate8.goalScore,
      business:   state.gate8.businessScore,
      trust:      state.gate8.trustScore,
      adoption:   state.gate8.adoptionScore,
    } : null
    const oisScore     = state.gate8?.oisScore ?? null
    const oisHistory   = state.gate8History

    // Domain ontology with capability / goal / object counts
    const domainOntology = state.domains.map(d => ({
      id:           d.id,
      name:         d.name,
      version:      d.version ?? null,
      purpose:      d.purpose ?? null,
      ready:        d.ready,
      capabilities: d.capabilities ?? 0,
      goals:        d.goals ?? 0,
      objects:      d.objects ?? 0,
      kpiCount:     (d.kpis ?? []).length,
      breachedKpis: (d.kpis ?? []).filter(k => k.current < k.target).length,
    }))

    // KimmpMemory stats
    const memories        = state.kimmpMemories ?? []
    const kimmpMemoryCount = memories.length
    const memoryByType    = memories.reduce<Record<string, number>>((acc, m) => {
      acc[m.type] = (acc[m.type] ?? 0) + 1
      return acc
    }, {})

    // Digital Twin scenarios (G8.3)
    const twinScenarios = state.twinScenarios ?? []
    const bestScenario  = twinScenarios.length > 0
      ? twinScenarios.reduce((best, s) => s.delta > best.delta ? s : best, twinScenarios[0])
      : null

    return {
      waandaPhase:          state.phase,
      confidence:           state.confidence,
      // Predictions
      predictions:          state.enterprisePredictions,
      topPredictions,
      totalPredictions:     state.enterprisePredictions.length,
      activeDrifts:         activeDrifts.length,
      highConfidencePredictions: state.enterprisePredictions.filter(p => p.confidence >= 0.8).length,
      // Briefings (all + by priority)
      analyticsBriefings:   allBriefings.slice(0, 8),
      criticalBriefings:    criticalBriefs,
      highBriefings:        highBriefs,
      mediumBriefings:      mediumBriefs,
      // Domain intelligence
      domainIntelligence:   domainOntology,
      domainOntology,
      domainRiskExposure:   domainOntology.map(d => ({
        id:          d.id,
        name:        d.name,
        ready:       d.ready,
        breachedKpis: (state.domains.find(sd => sd.id === d.id)?.kpis ?? []).filter(k => k.current < k.target),
      })),
      // Gate 8 pillars
      gate8Pillars,
      oisScore,
      oisHistory,
      // Memory
      kimmpMemoryCount,
      memoryByType,
      // Digital Twin
      twinScenarios,
      bestScenario,
      // Relationship intelligence
      evidenceLedger,
      externalSessions:     liveSessions,
      avgExternalTrust:     Math.round(avgExternalTrust * 100) / 100,
    }
  },
}
