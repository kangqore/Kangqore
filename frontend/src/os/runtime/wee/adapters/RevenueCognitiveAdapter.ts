// Revenue Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Revenue workspace experience.
// Never fetches. Adapts only what WAANDA already knows.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

function fmt(n: number): string {
  if (n >= 1_000_000) return `₹${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n.toFixed(0)}`
}

export const RevenueCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'REVENUE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    const { liveSessions } = state.relationshipIntelligence
    const kpis = state.financialKpis
    const leads = state.recentLeads ?? []

    // Lead queue — from real contacts, scored by recency + status
    const STATUS_SCORE: Record<string, number> = { NEW: 90, IN_PROGRESS: 60, REPLIED: 30 }
    const prioritizedLeads = leads.map(l => ({
      id:             l.id,
      companyName:    l.company ?? l.name ?? 'Unknown',
      contactName:    l.name ?? '',
      email:          l.email,
      score:          STATUS_SCORE[l.status] ?? 40,
      scoreCategory:  l.status === 'NEW' ? 'HIGH' : l.status === 'IN_PROGRESS' ? 'MEDIUM' : 'LOW',
      source:         l.inquiryType ?? 'INBOUND',
      status:         l.status,
      createdAt:      l.createdAt,
      estimatedValue: kpis ? fmt(kpis.pipelineValue / Math.max(1, leads.length)) : '—',
    }))

    const newLeadsCount        = leads.filter(l => l.status === 'NEW').length
    const inProgressLeadsCount = leads.filter(l => l.status === 'IN_PROGRESS').length

    // Pipeline — derived from financial KPIs
    const pipelineStages = [
      { id: 'leads',     name: 'Leads',     value: kpis?.pipelineValue ?? 0,   dealCount: newLeadsCount,            fillPercent: 100, health: 'HEALTHY' },
      { id: 'active',    name: 'Active',    value: kpis?.totalBudget   ?? 0,   dealCount: kpis?.activeProjects ?? 0, fillPercent: 70,  health: 'HEALTHY' },
      { id: 'contracts', name: 'Contracts', value: kpis?.arr           ?? 0,   dealCount: kpis?.activeContracts ?? 0, fillPercent: 45, health: kpis?.overdueInvoices ? 'AT_RISK' : 'HEALTHY' },
    ]

    // Revenue attainment
    const mrrDelta = kpis?.mrrDeltaPct ?? 0
    const revenueTarget = {
      label:      'Revenue MTD',
      value:      kpis ? fmt(kpis.revenueMTD) : '—',
      lastMonth:  kpis ? fmt(kpis.revenueLastMonth) : '—',
      arr:        kpis ? fmt(kpis.arr) : '—',
      attainment: mrrDelta,
      mrrDelta,
    }

    // Account health from URGI sessions (trust-scored visitors)
    const avgTrust = liveSessions.length > 0
      ? liveSessions.reduce((s, x) => s + x.trustScore, 0) / liveSessions.length
      : 0
    const atRiskSessions = liveSessions.filter(s => s.trustScore < 0.5).length

    return {
      waandaPhase:        state.phase,
      confidence:         state.confidence,
      kimmSynthesis:      state.kimmSynthesis,
      systemBriefings:    state.systemBriefings,
      predictions:        state.enterprisePredictions,

      // Accounts
      liveSessions,
      totalAccounts:      liveSessions.length,
      avgTrustScore:      Math.round(avgTrust * 100) / 100,
      atRiskSessions,

      // Pipeline
      pipelineStages,
      pipelineDealCount:  (kpis?.activeContracts ?? 0) + newLeadsCount,
      pipelineTotalValue: kpis ? fmt(kpis.pipelineValue) : '—',

      // Leads
      prioritizedLeads,
      newLeadsCount,
      inProgressLeadsCount,
      totalLeadsCount:    leads.length,

      // Financials
      revenueTarget,
      financialKpis:      kpis,
      pendingInvoices:    kpis?.pendingInvoices  ?? 0,
      overdueInvoices:    kpis?.overdueInvoices  ?? 0,
      activeContracts:    kpis?.activeContracts  ?? 0,
      onTimeProjectPct:   kpis?.onTimeProjectPct ?? 0,
    }
  },
}
