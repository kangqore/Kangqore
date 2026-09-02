import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

export async function runAssetCatalogAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const bySystem: Array<{ system: string | null; _count: { _all: number } }> =
    await (prisma as any).hanumanasAuditLog.groupBy({
      by:     ['system'],
      _count: { _all: true },
      where:  { eventType: 'KNOWLEDGE_ASSET' },
    }).catch(() => [])

  const byType: Array<{ assetType: string | null; _count: { _all: number } }> =
    await (prisma as any).hanumanasAuditLog.groupBy({
      by:     ['assetType'],
      _count: { _all: true },
      where:  { eventType: 'KNOWLEDGE_ASSET' },
    }).catch(() => [])

  const total    = bySystem.reduce((s, r) => s + r._count._all, 0)
  const systemMap = Object.fromEntries(bySystem.map(s => [s.system ?? 'UNKNOWN', s._count._all]))
  const typeMap   = Object.fromEntries(byType.map(t => [t.assetType ?? 'UNKNOWN', t._count._all]))

  return {
    agentId:  'registry.asset-catalog',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict:  total > 0 ? 'PASS' : 'INFO',
    summary:  `Intelligence asset catalog: ${total} total assets registered across ${Object.keys(systemMap).length} systems and ${Object.keys(typeMap).length} asset types.`,
    findings: [
      `Total registered assets: ${total}`,
      `Systems contributing assets: ${Object.keys(systemMap).length}`,
      ...Object.entries(systemMap).map(([sys, cnt]) => `System ${sys}: ${cnt} assets`),
      `Asset types: ${Object.keys(typeMap).join(', ')}`,
      ...Object.entries(typeMap).map(([type, cnt]) => `Type ${type}: ${cnt} assets`),
    ],
    actions:  total === 0 ? ['No intelligence assets registered — verify KIMMP KNOWLEDGE_ASSET logging'] : [],
    metadata: { total, systemMap, typeMap },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
