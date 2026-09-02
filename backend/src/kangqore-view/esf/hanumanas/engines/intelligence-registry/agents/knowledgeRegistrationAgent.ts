import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

export async function runKnowledgeRegistrationAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const recent: Array<{
    assetId: string | null; assetType: string | null; system: string | null;
    classification: string | null; assetSource: string | null
  }> = await (prisma as any).aegisAuditLog.findMany({
    where:  { eventType: 'KNOWLEDGE_ASSET', createdAt: { gte: last24h } },
    select: { assetId: true, assetType: true, system: true, classification: true, assetSource: true },
  }).catch(() => [])

  const total     = recent.length
  const incomplete = recent.filter(a =>
    !a.assetId || !a.assetType || !a.system || !a.classification || !a.assetSource
  )
  const coveragePct = total > 0 ? ((total - incomplete.length) / total * 100).toFixed(1) : '100'

  const verdict = incomplete.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'registry.knowledge-registration',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  `${total} intelligence assets registered (24h). Registration completeness: ${coveragePct}%. ${incomplete.length > 0 ? `${incomplete.length} assets missing required fields.` : 'All fields present.'}`,
    findings: [
      `Assets registered (24h): ${total}`,
      `Complete registrations: ${total - incomplete.length}`,
      `Incomplete (missing fields): ${incomplete.length}`,
      `Coverage: ${coveragePct}%`,
      ...(incomplete.length > 0 ? [`Example gaps: ${incomplete.slice(0, 3).map(a => `assetId=${a.assetId} type=${a.assetType}`).join(', ')}`] : []),
    ],
    actions:  incomplete.length > 0
      ? [`${incomplete.length} assets have incomplete registration — check KIMMP KNOWLEDGE_ASSET event logging`]
      : [],
    metadata: { total, incomplete: incomplete.length, coveragePct },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
