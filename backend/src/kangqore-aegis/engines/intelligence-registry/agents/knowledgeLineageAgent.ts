import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

export async function runKnowledgeLineageAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  const assets: Array<{
    assetId: string | null; assetSource: string | null; dispatchId: string | null; actor: string
  }> = await (prisma as any).aegisAuditLog.findMany({
    where:  { eventType: 'KNOWLEDGE_ASSET' },
    select: { assetId: true, assetSource: true, dispatchId: true, actor: true },
  }).catch(() => [])

  const total = assets.length
  const withSource    = assets.filter(a => !!a.assetSource).length
  const withDispatch  = assets.filter(a => !!a.dispatchId).length
  const fullLineage   = assets.filter(a => !!a.assetSource && !!a.dispatchId && !!a.assetId).length

  const lineagePct   = total > 0 ? (fullLineage / total * 100) : 100
  const sourcePct    = total > 0 ? (withSource / total * 100) : 100

  const verdict = lineagePct < 70 ? 'WARN' : 'PASS'

  return {
    agentId:  'registry.knowledge-lineage',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  `Knowledge lineage audit: ${total} assets — ${fullLineage} have full lineage (assetId + assetSource + dispatchId). Coverage: ${lineagePct.toFixed(1)}%.`,
    findings: [
      `Total assets: ${total}`,
      `With assetSource: ${withSource} (${sourcePct.toFixed(1)}%)`,
      `With dispatchId: ${withDispatch} (${total > 0 ? (withDispatch / total * 100).toFixed(1) : 100}%)`,
      `Full lineage (all 3 fields): ${fullLineage} (${lineagePct.toFixed(1)}%)`,
    ],
    actions:  lineagePct < 70 ? ['Lineage coverage below 70% — ensure KIMMP stamps assetSource and dispatchId on every asset'] : [],
    metadata: { total, withSource, withDispatch, fullLineage, lineagePct, sourcePct },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
