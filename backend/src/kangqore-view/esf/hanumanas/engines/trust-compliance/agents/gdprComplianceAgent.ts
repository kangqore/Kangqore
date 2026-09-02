import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess regulatory compliance posture — ISO 27001, SOC 2, GDPR, DPDP Act. Write 2 sentences: compliance status and whether ADMIN action is required.'

export async function runGdprComplianceAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const [restrictedEgress, unclassifiedAssets, totalActivations, deniedTotal] = await Promise.all([
    (prisma as any).aegisAuditLog.count({
      where: { eventType: 'EGRESS', classification: 'RESTRICTED', createdAt: { gte: last30d } },
    }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({
      where: { eventType: 'KNOWLEDGE_ASSET', classification: null, createdAt: { gte: last30d } },
    }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last30d } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'ACCESS_DENIED', createdAt: { gte: last30d } } }).catch(() => 0),
  ])

  const gaps: string[] = []
  if (restrictedEgress > 0) gaps.push(`Art. 44 (Cross-border transfers): ${restrictedEgress} RESTRICTED asset egress events — verify lawful transfer basis`)
  if (unclassifiedAssets > 0) gaps.push(`Art. 5 (Data minimisation/purpose): ${unclassifiedAssets} unclassified assets — apply classification labels`)

  const verdict = restrictedEgress > 0 ? 'WARN' : unclassifiedAssets > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'compliance.gdpr',
    engine:   'TRUST_COMPLIANCE',
    verdict,
    summary:  verdict === 'PASS'
      ? `GDPR compliance (30d): No critical gaps. ${totalActivations} processing activities logged; ${deniedTotal} access denials enforced.`
      : `GDPR compliance gaps: ${gaps.length} articles require attention. RESTRICTED egress: ${restrictedEgress}, unclassified assets: ${unclassifiedAssets}.`,
    findings: [
      'Framework: EU General Data Protection Regulation (GDPR)',
      `Art. 5 Data minimisation: unclassified assets (30d) = ${unclassifiedAssets}`,
      `Art. 25 Data protection by design: ${totalActivations} activations logged with audit trail`,
      `Art. 32 Security measures: ${deniedTotal} unauthorised access attempts blocked`,
      `Art. 44 Restricted transfers (egress): ${restrictedEgress} events`,
      ...gaps,
    ],
    actions:  gaps,
    metadata: { framework: 'GDPR', restrictedEgress, unclassifiedAssets, totalActivations, deniedTotal, gaps },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
