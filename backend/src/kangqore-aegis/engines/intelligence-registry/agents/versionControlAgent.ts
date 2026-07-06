import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

export async function runVersionControlAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  const assets: Array<{ assetId: string | null }> = await (prisma as any).aegisAuditLog.findMany({
    where:  { eventType: 'KNOWLEDGE_ASSET', assetId: { not: null } },
    select: { assetId: true },
  }).catch(() => [])

  // Count occurrences per assetId — assets with >1 occurrence have versions
  const idCount: Record<string, number> = {}
  for (const a of assets) {
    if (a.assetId) idCount[a.assetId] = (idCount[a.assetId] ?? 0) + 1
  }

  const total    = Object.keys(idCount).length
  const versioned = Object.entries(idCount).filter(([, c]) => c > 1)
  const maxVersions = versioned.reduce((m, [, c]) => Math.max(m, c), 0)

  return {
    agentId:  'registry.version-control',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict:  total > 0 ? 'PASS' : 'INFO',
    summary:  `Intelligence asset version registry: ${total} unique assets. ${versioned.length} assets have multiple versions (max: ${maxVersions} versions).`,
    findings: [
      `Unique asset IDs: ${total}`,
      `Versioned assets (multiple registrations): ${versioned.length}`,
      `Single-version assets: ${total - versioned.length}`,
      `Max versions on a single asset: ${maxVersions}`,
      ...versioned.slice(0, 5).map(([id, c]) => `Asset ${id}: ${c} versions`),
    ],
    actions:  [],
    metadata: { total, versioned: versioned.length, maxVersions },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
