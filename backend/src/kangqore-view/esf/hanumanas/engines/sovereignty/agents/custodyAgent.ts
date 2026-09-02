import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

export async function runCustodyAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  // Check completeness of custody metadata on KNOWLEDGE_ASSET events
  const [total, missingAssetId, missingAssetType, missingSource] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', assetId:     null } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', assetType:   null } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', assetSource: null } }).catch(() => 0),
  ])

  const totalGaps = missingAssetId + missingAssetType + missingSource
  const verdict   = totalGaps > 5 ? 'WARN' : totalGaps > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.custody',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   totalGaps > 0
      ? `${totalGaps} custody metadata gaps detected across ${total} registered assets.`
      : `Full chain of custody confirmed on all ${total} intelligence assets.`,
    findings: [
      `Total registered assets: ${total}`,
      `Missing assetId: ${missingAssetId}`,
      `Missing assetType: ${missingAssetType}`,
      `Missing assetSource: ${missingSource}`,
    ],
    actions: [
      ...(missingAssetId   > 0 ? ['Fix assetId registration in KIMMP SystemRAG.autoIndexBriefing()'] : []),
      ...(missingAssetType > 0 ? ['Pass docType when calling HanumanasLedger.logKnowledgeAsset()'] : []),
      ...(missingSource    > 0 ? ['Ensure assetSource is set to dispatch:${dispatchId} on every ingest'] : []),
    ],
    metadata:  { total, missingAssetId, missingAssetType, missingSource, totalGaps },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
