// Governance Cognitive Adapter — Generation III Runtime
// Projects WAANDA's cognitive state into the Governance workspace experience.
// Includes HANUMANAS agent corps summary, audit ledger, and autonomy boundary data.

import { CognitiveStateAdapter, ExperienceContract, ProjectionPolicy, WaandaCognitiveState } from '../types'

export const GovernanceCognitiveAdapter: CognitiveStateAdapter = {
  projectionScope: 'GOVERNANCE',

  async adapt(state: Readonly<WaandaCognitiveState>, _contract: ExperienceContract, _policy: ProjectionPolicy) {
    type KPI = { id: string; name: string; target: number; current: number }

    const domainRiskExposure = state.domains.map(d => {
      const kpis = (d.kpis ?? []) as KPI[]
      return { id: d.id, name: d.name, ready: d.ready, breachedKpis: kpis.filter(k => k.current < k.target), totalKpis: kpis.length }
    })
    const totalBreachedKpis  = domainRiskExposure.reduce((s, d) => s + d.breachedKpis.length, 0)
    const compliantDomains   = domainRiskExposure.filter(d => d.breachedKpis.length === 0).length
    const totalDomains       = domainRiskExposure.length
    const complianceScore    = totalDomains > 0 ? Math.round((compliantDomains / totalDomains) * 100) : 100

    const domainIntelligence = state.domains.map(d => ({ id: d.id, name: d.name, ready: d.ready, kpis: d.kpis ?? [] }))

    const hanumanas             = state.hanumanasAgentSummary
    const shieldVerdict     = hanumanas?.overallVerdict ?? 'UNKNOWN'
    const shieldHealthScore = hanumanas?.healthScore    ?? null
    const critical24h       = hanumanas?.critical24h    ?? 0
    const warn24h           = hanumanas?.warn24h         ?? 0
    const engines           = (hanumanas?.engines ?? []).map(e => ({
      engine:  e.engine,
      verdict: e.latest?.verdict ?? 'NO_DATA',
      agentId: e.latest?.agentId ?? null,
      summary: e.latest?.summary ?? null,
      raisedAt: e.latest?.raisedAt ?? null,
    }))

    const autonomyEvents   = state.hanumanasAutonomy.slice(0, 6)
    const autonomyCritical = autonomyEvents.filter(e => e.verdict === 'CRITICAL' || e.verdict === 'BLOCK').length
    const auditTrail       = state.hanumanasAudit.slice(0, 10)

    const pendingDecisions = state.pendingDecisions
    const l3PlusDecisions  = pendingDecisions.filter(d => d.level >= 3)

    const riskScore = Math.min(100, totalBreachedKpis * 8 + critical24h * 15 + autonomyCritical * 20)
    let riskLevel = 'HIGH'
    if (riskScore === 0)   riskLevel = 'LOW'
    else if (riskScore < 30) riskLevel = 'MEDIUM'

    // Engine-specific projections
    const trustEngine      = engines.find(e => e.engine === 'TRUST_COMPLIANCE')
    const tcVerdict        = trustEngine?.verdict  ?? 'NO_DATA'
    const tcSummary        = trustEngine?.summary  ?? null
    const tcLastRun        = trustEngine?.raisedAt ?? null

    const riskEngine       = engines.find(e => e.engine === 'RISK_INTELLIGENCE')
    const riVerdict        = riskEngine?.verdict   ?? 'NO_DATA'
    const riSummary        = riskEngine?.summary   ?? null
    const riLastRun        = riskEngine?.raisedAt  ?? null

    const policyEngineRow  = engines.find(e => e.engine === 'POLICY')
    const peVerdict        = policyEngineRow?.verdict  ?? 'NO_DATA'
    const peSummary        = policyEngineRow?.summary  ?? null

    // Compliance trust score: TC engine verdict lifts or caps the base KPI compliance score
    let complianceTrustScore = complianceScore
    if (tcVerdict === 'PASS')     complianceTrustScore = Math.max(complianceScore, 80)
    else if (tcVerdict === 'CRITICAL') complianceTrustScore = Math.min(complianceScore, 50)

    // Anomaly signals from EPF
    const anomalyCount     = state.enterprisePredictions.filter(p => p.outcome?.isAnomaly).length

    // KIMMP decision ledger
    const kimmpDecisions   = state.kimmpDecisions ?? []
    const openKimmpDecisions     = kimmpDecisions.filter(d => !d.selected && !d.outcome)
    const resolvedKimmpDecisions = kimmpDecisions.filter(d => d.selected || d.outcome)

    // HANUMANAS policy registry
    const kimmpPolicies    = state.hanumanasPolicies ?? []

    return {
      waandaPhase:        state.phase,
      confidence:         state.confidence,
      complianceScore,
      complianceTrustScore,
      complianceBriefings: state.systemBriefings.slice(0, 4),
      compliantDomains,
      totalDomains,
      domainRiskExposure,
      domainIntelligence,
      totalBreachedKpis,
      pendingDecisions,
      openDecisionCount:  pendingDecisions.length,
      l3PlusDecisions,
      l3PlusCount:        l3PlusDecisions.length,
      shieldVerdict,
      shieldHealthScore,
      hanumanasHealth:        shieldHealthScore,
      critical24h,
      warn24h,
      totalCritical:      critical24h,
      totalWarns:         warn24h,
      engines,
      engineSummaries:    engines,
      // Engine-specific
      tcVerdict, tcSummary, tcLastRun,
      riVerdict, riSummary, riLastRun,
      peVerdict, peSummary,
      // Anomalies
      anomalyCount,
      // Decision ledger
      kimmpDecisions,
      openKimmpCount:     openKimmpDecisions.length,
      resolvedKimmpCount: resolvedKimmpDecisions.length,
      // Policy registry
      kimmpPolicies,
      kimmpPolicyCount:   kimmpPolicies.length,
      peViolations:       peVerdict === 'CRITICAL' || peVerdict === 'WARN',
      // Audit + autonomy
      auditTrail,
      auditCount:         auditTrail.length,
      autonomyEvents,
      autonomyCritical,
      riskScore,
      riskLevel,
      evidenceLedger:     state.relationshipIntelligence.evidenceLedger,
      platformConfidence: Math.round(state.confidence * 100),
    }
  },
}
