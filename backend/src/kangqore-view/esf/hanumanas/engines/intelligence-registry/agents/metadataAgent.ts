import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.`

const REQUIRED_FIELDS = ['assetId', 'assetType', 'system', 'classification', 'assetSource', 'actor'] as const

export async function runMetadataAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const assets: Array<Record<string, string | null>> = await (prisma as any).hanumanasAuditLog.findMany({
    where:  { eventType: 'KNOWLEDGE_ASSET' },
    select: { assetId: true, assetType: true, system: true, classification: true, assetSource: true, actor: true },
  }).catch(() => [])

  const total = assets.length
  const fieldCoverage: Record<string, number> = {}
  for (const field of REQUIRED_FIELDS) {
    fieldCoverage[field] = assets.filter(a => !!a[field]).length
  }

  const fieldPcts = Object.fromEntries(
    REQUIRED_FIELDS.map(f => [f, total > 0 ? ((fieldCoverage[f] / total) * 100).toFixed(1) : '100'])
  )
  const lowestPct = total > 0
    ? Math.min(...REQUIRED_FIELDS.map(f => fieldCoverage[f] / total * 100))
    : 100

  const verdict = lowestPct < 70 ? 'WARN' : lowestPct < 90 ? 'PASS' : 'PASS'

  return {
    agentId:  'registry.metadata',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  `Metadata completeness across ${total} intelligence assets. Lowest field coverage: ${lowestPct.toFixed(1)}%.`,
    findings: [
      `Total assets analysed: ${total}`,
      ...REQUIRED_FIELDS.map(f => `${f}: ${fieldCoverage[f]}/${total} (${fieldPcts[f]}%)`),
    ],
    actions:  lowestPct < 70 ? ['Metadata coverage below 70% — check KIMMP KNOWLEDGE_ASSET event structure'] : [],
    metadata: { total, fieldCoverage, fieldPcts, lowestPct },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
