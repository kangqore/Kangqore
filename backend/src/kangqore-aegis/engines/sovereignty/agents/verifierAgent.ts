import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

export async function runVerifierAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  // Check for duplicate assetIds (re-ingested without deduplication)
  const allAssets: Array<{ assetId: string | null; system: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'KNOWLEDGE_ASSET' },
      select: { assetId: true, system: true },
    }).catch(() => [])

  const total       = allAssets.length
  const withAssetId = allAssets.filter(a => a.assetId).length
  const withSystem  = allAssets.filter(a => a.system).length

  // Count duplicate assetIds
  const idCounts: Record<string, number> = {}
  for (const a of allAssets) {
    if (a.assetId) idCounts[a.assetId] = (idCounts[a.assetId] ?? 0) + 1
  }
  const duplicates = Object.values(idCounts).filter(c => c > 1).length
  const orphaned   = total - withSystem // assets with no system attribution

  const verdict = duplicates > 0 ? 'WARN' : orphaned > 2 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.verifier',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   duplicates > 0
      ? `${duplicates} duplicate assetIds detected — possible re-ingestion without deduplication.`
      : `${total} assets verified. ${orphaned} orphaned (no system attribution).`,
    findings: [
      `Total assets: ${total}`,
      `With assetId: ${withAssetId}`,
      `With system attribution: ${withSystem}`,
      `Duplicate assetIds: ${duplicates}`,
      `Orphaned (no system): ${orphaned}`,
    ],
    actions: [
      ...(duplicates > 0 ? ['Review KIMMP SystemRAG deduplication logic — check contentHash'] : []),
      ...(orphaned   > 2 ? ['Ensure system is passed to AegisLedger.logKnowledgeAsset()']    : []),
    ],
    metadata:  { total, withAssetId, withSystem, duplicates, orphaned },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
