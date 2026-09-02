import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

export async function runAttributionAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const [total, missSystem, missAssetType, missActor, missSource] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', system:      null } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', assetType:   null } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', actor:       null } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', assetSource: null } }).catch(() => 0),
  ])

  const totalGaps   = missSystem + missAssetType + missActor + missSource
  const coverage    = total > 0 ? Math.round(((total * 4 - totalGaps) / (total * 4)) * 100) : 100
  const verdict     = totalGaps > total * 0.1 ? 'WARN' : totalGaps > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.attribution',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   `Attribution coverage: ${coverage}% across ${total} intelligence assets. ${totalGaps} missing fields detected.`,
    findings: [
      `Total assets: ${total}`,
      `Attribution coverage: ${coverage}%`,
      `Missing system: ${missSystem}`,
      `Missing assetType: ${missAssetType}`,
      `Missing actor: ${missActor}`,
      `Missing assetSource: ${missSource}`,
    ],
    actions:   totalGaps > 0
      ? ['Review HanumanasLedger.logKnowledgeAsset() call sites — ensure all fields are populated']
      : [],
    metadata:  { total, missSystem, missAssetType, missActor, missSource, totalGaps, coverage },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
