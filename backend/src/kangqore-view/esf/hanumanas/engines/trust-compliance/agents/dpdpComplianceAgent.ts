import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess regulatory compliance posture — ISO 27001, SOC 2, GDPR, DPDP Act. Write 2 sentences: compliance status and whether ADMIN action is required.'

// India Digital Personal Data Protection Act 2023 — mapped to AEGIS capabilities
export async function runDpdpComplianceAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const [egressTotal, egressWithDest, egressWithActor, restrictedAssets] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'EGRESS', createdAt: { gte: last30d } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({
      where: { eventType: 'EGRESS', createdAt: { gte: last30d } },
    }).catch(() => 0), // placeholder; metadata query not easily filterable without raw SQL
    (prisma as any).hanumanasAuditLog.count({
      where: { eventType: 'EGRESS', actor: { not: null }, createdAt: { gte: last30d } },
    }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({
      where: { eventType: 'KNOWLEDGE_ASSET', classification: 'RESTRICTED', createdAt: { gte: last30d } },
    }).catch(() => 0),
  ])

  const actorCoverage = egressTotal > 0 ? (egressWithActor / egressTotal * 100).toFixed(1) : '100'
  const gaps: string[] = []
  if (egressTotal === 0) gaps.push('No EGRESS events — data transfer monitoring not active')
  if (Number(actorCoverage) < 100) gaps.push(`${(100 - Number(actorCoverage)).toFixed(1)}% of EGRESS events missing actor (purpose limitation gap)`)

  // DPDP: data fiduciaries must track all personal data processing
  const processingLogged = await (prisma as any).hanumanasAuditLog
    .count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last30d } } }).catch(() => 0)

  const verdict = gaps.length > 1 ? 'WARN' : 'PASS'

  return {
    agentId:  'compliance.dpdp',
    engine:   'TRUST_COMPLIANCE',
    verdict,
    summary:  `India DPDP Act (30d): ${egressTotal} egress events monitored, actor coverage ${actorCoverage}%. ${restrictedAssets} RESTRICTED assets. ${processingLogged} processing activities logged.`,
    findings: [
      'Framework: India Digital Personal Data Protection Act 2023',
      `S.4 Lawfulness of processing: ${processingLogged} activations logged`,
      `S.6 Purpose limitation: ${actorCoverage}% egress events have actor recorded`,
      `S.8 Data security: RESTRICTED assets: ${restrictedAssets}`,
      `S.9 Data transfer controls: ${egressTotal} egress events monitored`,
      ...gaps,
    ],
    actions:  gaps,
    metadata: { framework: 'DPDP Act 2023', egressTotal, actorCoverage: Number(actorCoverage), restrictedAssets, processingLogged, gaps },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
