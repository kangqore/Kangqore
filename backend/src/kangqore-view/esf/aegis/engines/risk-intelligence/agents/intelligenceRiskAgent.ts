import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess risk levels and threat intelligence. Write 2 sentences: current risk posture and urgency of ADMIN escalation.'

export async function runIntelligenceRiskAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const [restrictedAssets, unclassified, restrictedEgress, totalAssets, egressTotal] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', classification: 'RESTRICTED',    createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', classification: null,           createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'EGRESS',          classification: 'RESTRICTED',    createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET',                                  createdAt: { gte: last7d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'EGRESS',                                           createdAt: { gte: last7d } } }).catch(() => 0),
  ])

  // Intelligence risk score
  const riskScore = Math.min(100,
    restrictedEgress  * 20 +  // RESTRICTED assets leaving = highest risk
    unclassified      * 5  +  // unclassified assets = moderate risk
    (totalAssets > 0 && unclassified / totalAssets > 0.3 ? 15 : 0) // >30% unclassified = elevated
  )

  const verdict = restrictedEgress > 0 ? 'CRITICAL' : riskScore > 30 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.intelligence-risk',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  restrictedEgress > 0
      ? `CRITICAL intelligence risk: ${restrictedEgress} RESTRICTED assets egressed in 7d. Intelligence exposure risk: ${riskScore}/100.`
      : `Intelligence risk (7d): score ${riskScore}/100. Total assets: ${totalAssets}, RESTRICTED: ${restrictedAssets}, unclassified: ${unclassified}.`,
    findings: [
      `Intelligence risk score: ${riskScore}/100`,
      `Total knowledge assets (7d): ${totalAssets}`,
      `RESTRICTED assets: ${restrictedAssets}`,
      `Unclassified assets: ${unclassified} (${totalAssets > 0 ? (unclassified/totalAssets*100).toFixed(1) : 0}%)`,
      `Total egress events (7d): ${egressTotal}`,
      `RESTRICTED asset egress (7d): ${restrictedEgress}`,
    ],
    actions:  restrictedEgress > 0
      ? ['CRITICAL: RESTRICTED intelligence leaving the system — identify recipients and revoke if unauthorized']
      : unclassified > 10 ? ['Significant unclassified assets — apply classification to reduce intelligence exposure risk'] : [],
    metadata: { riskScore, restrictedAssets, unclassified, restrictedEgress, totalAssets, egressTotal },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
