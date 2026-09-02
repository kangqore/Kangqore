import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are HANUMANAS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

const VALID_CLASSIFICATIONS = new Set(['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'])

export async function runClassificationRegistryAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  const byClass: Array<{ classification: string | null; _count: { _all: number } }> =
    await (prisma as any).hanumanasAuditLog.groupBy({
      by:     ['classification'],
      _count: { _all: true },
      where:  { eventType: 'KNOWLEDGE_ASSET' },
    }).catch(() => [])

  const total          = byClass.reduce((s, r) => s + r._count._all, 0)
  const unclassified   = byClass.filter(r => !r.classification || !VALID_CLASSIFICATIONS.has(r.classification))
  const unclassifiedCt = unclassified.reduce((s, r) => s + r._count._all, 0)
  const classMap       = Object.fromEntries(byClass.map(r => [r.classification ?? 'NULL', r._count._all]))

  const verdict = unclassifiedCt > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'registry.classification-registry',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  unclassifiedCt > 0
      ? `${unclassifiedCt} of ${total} intelligence assets lack valid classification labels.`
      : `All ${total} intelligence assets carry valid classification labels across ${Object.keys(classMap).length} classes.`,
    findings: [
      `Total assets: ${total}`,
      ...Object.entries(classMap).map(([cls, cnt]) => `${cls}: ${cnt} assets`),
      ...(unclassifiedCt > 0 ? [`Unclassified/invalid: ${unclassifiedCt}`] : []),
    ],
    actions:  unclassifiedCt > 0
      ? [`${unclassifiedCt} assets without valid classification — stamp with INTERNAL at minimum`]
      : [],
    metadata: { total, classMap, unclassified: unclassifiedCt },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
