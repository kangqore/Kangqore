// Revenue Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Revenue workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const RevenueCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'REVENUE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions, evidenceLedger } = state.relationshipIntelligence
    const avgTrust =
      liveSessions.length > 0
        ? liveSessions.reduce((sum, s) => sum + s.trustScore, 0) / liveSessions.length
        : 0

    const salesDomain = state.domains.find(
      d => d.id === 'sales' || d.name?.toLowerCase().includes('sales')
    ) ?? null

    // Revenue KPI metrics — built from enterprise goals with revenue-related KPIs
    const revenueGoals = state.enterpriseGoals.filter(g =>
      (g.kpi ?? '').toLowerCase().includes('revenue') ||
      (g.kpi ?? '').toLowerCase().includes('arr') ||
      (g.kpi ?? '').toLowerCase().includes('mrr')
    )
    const revenueMetrics = revenueGoals.map(g => {
      let trendDirection = 'DOWN'
      if (g.progress >= 80) trendDirection = 'UP'
      else if (g.progress >= 50) trendDirection = 'FLAT'
      let trendIndicator = '↓'
      if (g.progress >= 80) trendIndicator = '↑'
      else if (g.progress >= 50) trendIndicator = '→'
      return {
        id:             g.goalId,
        label:          g.kpi,
        formattedValue: `${g.progress}%`,
        trendDirection,
        trendIndicator,
        trendValue:     `${g.progress}%`,
        drilldownAvailable: false,
      }
    })

    // Revenue attainment from the best-matching goal
    const topRevenueGoal = revenueGoals[0]
    const revenueTarget = {
      label:       topRevenueGoal?.kpi ?? 'Annual Revenue Target',
      value:       `${topRevenueGoal?.progress ?? 0}%`,
      attainment:  topRevenueGoal?.progress ?? 0,
    }

    // Pipeline stages — built from operational domains as revenue funnel proxies
    const pipelineStages = state.domains.slice(0, 5).map((d, i) => ({
      id:          d.id,
      name:        d.name,
      dealCount:   liveSessions.filter(s => s.company?.toLowerCase().includes(d.name.toLowerCase().slice(0, 4))).length,
      fillPercent: d.ready ? 80 - (i * 10) : 20,
      health:      d.ready ? 'HEALTHY' : 'AT_RISK',
    }))
    const pipelineDealCount = liveSessions.length
    const pipelineTotalValue = `${liveSessions.length} active`

    // Domain risk exposure for Revenue workspace
    const domainRiskExposure = state.domains.map(d => ({
      id:          d.id,
      name:        d.name,
      ready:       d.ready,
      breachedKpis: (d.kpis ?? []).filter(k => k.current < k.target),
    }))

    return {
      waandaPhase: state.phase,
      liveSessions,
      activeRelationships: liveSessions.length,
      avgTrustScore: Math.round(avgTrust * 10) / 10,
      evidenceLedger,
      evidenceCount: evidenceLedger.length,
      salesDomain,
      revenueMetrics,
      revenueTarget,
      pipelineStages,
      pipelineDealCount,
      pipelineTotalValue,
      predictions: state.enterprisePredictions,
      systemBriefings: state.systemBriefings,
      pendingDecisions: state.pendingDecisions,
      domainRiskExposure,
      totalAccounts: liveSessions.length,
      prioritizedLeads: liveSessions.map(s => {
        let scoreCategory = 'LOW'
        if (s.trustScore >= 0.8) scoreCategory = 'HIGH'
        else if (s.trustScore >= 0.5) scoreCategory = 'MEDIUM'
        return {
          id:             s.id,
          companyName:    s.company ?? 'Unknown',
          contactName:    s.name ?? '',
          score:          Math.round(s.trustScore * 100),
          scoreCategory,
          source:         'EXTERNAL',
          estimatedValue: '—',
          ageLabel:       'Active',
        }
      }),
      operationalDomains: state.domains.map(d => ({
        id: d.id, name: d.name, ready: d.ready,
        capabilities: d.capabilities ?? 0, kpis: d.kpis ?? [],
      })),
      kimmSynthesis: state.kimmSynthesis,
      confidence: state.confidence,
    }
  },
}
