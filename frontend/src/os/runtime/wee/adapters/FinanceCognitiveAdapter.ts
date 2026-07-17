// Finance Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Finance workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

function fmt(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n.toFixed(0)}`
}

export const FinanceCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'FINANCE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const kpis = state.financialKpis

    // Budget burn across all active projects
    const projects = state.projects ?? []
    const totalBudget = projects.reduce((s, p) => s + (p.budget ?? 0), 0)
    const totalSpend  = projects.reduce((s, p) => s + (p.spend  ?? 0), 0)
    const burnPct     = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0

    // At-risk: projects where spend > 80% of budget
    const atRiskProjects = projects.filter(p => p.budget > 0 && (p.spend / p.budget) > 0.8)

    // Cash position inference
    const revenueCollected = kpis?.revenueMTD ?? 0
    const overdueExposure  = kpis?.overdueInvoices ?? 0
    const pendingReceivable = kpis?.pendingInvoices ?? 0

    const cashHealthScore = (() => {
      let score = 100
      if (overdueExposure > 0)    score -= 20
      if (burnPct > 85)           score -= 15
      if (burnPct > 95)           score -= 20
      return Math.max(0, score)
    })()

    const cashSignal = overdueExposure > 0
      ? `${overdueExposure} overdue invoice${overdueExposure > 1 ? 's' : ''} — collections attention required`
      : burnPct > 85
        ? `Budget burn at ${burnPct}% — ${atRiskProjects.length} project${atRiskProjects.length !== 1 ? 's' : ''} approaching ceiling`
        : null

    // Finance-specific predictions
    const revenuePredictions = state.enterprisePredictions.filter(
      p => p.target === 'REVENUE' || p.target === 'CASHFLOW' || p.target === 'MARGIN'
    )

    // Decisions relevant to finance
    const financeDecisions = state.kimmpDecisions.filter(d =>
      /budget|invoice|payment|cost|revenue|contract|finance/i.test(d.question)
    )

    // Goals with financial KPIs
    const financeGoals = state.enterpriseGoals.filter(g =>
      /REVENUE|MARGIN|COST|BUDGET|FINANCE/i.test(g.kpi ?? '') || /finance/i.test(g.domainName ?? '')
    )

    return {
      waandaPhase:       state.phase,
      confidence:        state.confidence,
      kimmSynthesis:     state.kimmSynthesis,

      // Cash health signal
      cashHealthScore,
      cashSignal,

      // KPIs from WAANDA financial state
      revenueMTD:         kpis ? fmt(kpis.revenueMTD)         : '—',
      revenueLastMonth:   kpis ? fmt(kpis.revenueLastMonth)   : '—',
      arr:                kpis ? fmt(kpis.arr)                 : '—',
      pendingInvoices:    kpis?.pendingInvoices  ?? 0,
      overdueInvoices:    kpis?.overdueInvoices  ?? 0,
      draftInvoices:      kpis?.draftInvoices    ?? 0,
      activeContracts:    kpis?.activeContracts  ?? 0,
      mrrDeltaPct:        kpis?.mrrDeltaPct      ?? 0,

      // Budget burn across projects
      totalBudget:      fmt(totalBudget),
      totalSpend:       fmt(totalSpend),
      burnPct,
      atRiskProjects:   atRiskProjects.map(p => ({ id: p.id, name: p.name, burnPct: Math.round((p.spend / p.budget) * 100) })),
      atRiskCount:      atRiskProjects.length,

      // Cash position
      cashPosition:     kpis ? fmt(revenueCollected - totalSpend) : '—',
      pendingReceivable: fmt(pendingReceivable),
      overdueExposure:  fmt(overdueExposure),

      // Revenue predictions and finance goals
      revenuePredictions,
      financeDecisions,
      financeGoals,
    }
  },
}
