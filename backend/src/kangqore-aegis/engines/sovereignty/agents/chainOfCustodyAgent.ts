import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

export async function runChainOfCustodyAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()

  const assets: Array<{ assetId: string | null; assetSource: string | null; dispatchId: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'KNOWLEDGE_ASSET' },
      select: { assetId: true, assetSource: true, dispatchId: true },
      orderBy: { createdAt: 'desc' },
      take:   500,
    }).catch(() => [])

  const total              = assets.length
  const withDispatch       = assets.filter(a => a.dispatchId).length
  const withSource         = assets.filter(a => a.assetSource).length
  const withFullChain      = assets.filter(a => a.dispatchId && a.assetSource && a.assetId).length
  const orphaned           = total - withFullChain
  const chainIntegrity     = total > 0 ? Math.round((withFullChain / total) * 100) : 100

  const verdict = chainIntegrity < 80 ? 'WARN' : chainIntegrity < 100 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.chain-of-custody',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   `Chain of custody integrity: ${chainIntegrity}%. ${withFullChain}/${total} assets have complete custody chains.`,
    findings: [
      `Total assets: ${total}`,
      `Full chain (assetId + source + dispatch): ${withFullChain} (${chainIntegrity}%)`,
      `With dispatchId: ${withDispatch}`,
      `With assetSource: ${withSource}`,
      `Broken chains: ${orphaned}`,
    ],
    actions:   orphaned > 0
      ? ['Review SystemRAG.autoIndexBriefing() — ensure dispatchId is passed', 'Check assetSource is set as dispatch:${dispatchId}']
      : [],
    metadata:  { total, withFullChain, withDispatch, withSource, orphaned, chainIntegrity },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
