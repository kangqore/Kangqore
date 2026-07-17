// HR Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the HR workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

const HR_KEYWORDS = /hire|hiring|recruit|talent|offer|onboard|interview|performance|review|headcount|team|staff|employee/i

export const HRCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'HR',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    // HR-relevant goals (talent / headcount / utilization)
    const talentGoals = state.enterpriseGoals.filter(g =>
      HR_KEYWORDS.test(g.kpi ?? '') || HR_KEYWORDS.test(g.domainName ?? '') || /TALENT|HR|PEOPLE/i.test(g.kpi ?? '')
    )

    // HR-relevant decisions
    const hrDecisions = state.kimmpDecisions.filter(d => HR_KEYWORDS.test(d.question))

    // HR-relevant predictions (capacity, headcount)
    const capacityPredictions = state.enterprisePredictions.filter(p =>
      p.target === 'CAPACITY' || p.target === 'HEADCOUNT' || p.target === 'TALENT'
    )

    // HR domain (if configured in enterprise ontology)
    const hrDomain = state.domains.find(d => /HR|PEOPLE|TALENT/i.test(d.name))

    // HR-relevant briefings
    const hrBriefings = state.systemBriefings.filter(b => HR_KEYWORDS.test(b.summary))

    // Team utilization inferred from projects
    const projects = state.projects ?? []
    const leadSet  = new Set<string>()
    projects.forEach(p => { if (p.lead) leadSet.add(p.lead) })
    const activeTeamSize = leadSet.size

    const utilization = (() => {
      const kpis = state.financialKpis
      return kpis?.onTimeProjectPct ?? null
    })()

    // Hiring urgency: if we have at-risk projects and few team members, flag it
    const atRiskProjects = projects.filter(p => p.status === 'At Risk').length
    const hiringSignal   = atRiskProjects > 0 && activeTeamSize < 5
      ? `${atRiskProjects} at-risk projects with ${activeTeamSize} team members — capacity gap detected`
      : null

    const synthesis = state.kimmSynthesis

    return {
      waandaPhase:      state.phase,
      confidence:       state.confidence,
      kimmSynthesis:    synthesis,

      // Talent signals
      hiringSignal,
      activeTeamSize,
      utilization,

      // Goals, decisions, predictions
      talentGoals,
      hrDecisions,
      capacityPredictions,
      hrBriefings,
      hrDomain,

      // Project-derived capacity view
      teamLeads: Array.from(leadSet),
      atRiskProjectCount: atRiskProjects,
    }
  },
}
