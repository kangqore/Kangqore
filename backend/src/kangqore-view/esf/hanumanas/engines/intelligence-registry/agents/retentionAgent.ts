import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

const STALE_DAYS  = 180
const AGEING_DAYS = 90
const MATURE_DAYS = 30

export async function runRetentionAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()
  const now   = Date.now()

  const assets: Array<{ assetId: string | null; createdAt: Date; classification: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'KNOWLEDGE_ASSET' },
      select: { assetId: true, createdAt: true, classification: true },
      orderBy: { createdAt: 'asc' },
    }).catch(() => [])

  // Use the OLDEST entry per assetId as registration date
  const assetDates: Record<string, Date> = {}
  for (const a of assets) {
    if (a.assetId && (!assetDates[a.assetId] || a.createdAt < assetDates[a.assetId])) {
      assetDates[a.assetId] = a.createdAt
    }
  }

  const buckets = { fresh: 0, mature: 0, ageing: 0, stale: 0 }
  for (const date of Object.values(assetDates)) {
    const ageDays = (now - date.getTime()) / 86_400_000
    if      (ageDays <= MATURE_DAYS)  buckets.fresh++
    else if (ageDays <= AGEING_DAYS)  buckets.mature++
    else if (ageDays <= STALE_DAYS)   buckets.ageing++
    else                              buckets.stale++
  }

  const total  = Object.values(buckets).reduce((s, c) => s + c, 0)
  const verdict = buckets.stale > 10 ? 'WARN' : 'PASS'

  return {
    agentId:  'registry.retention',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  `Asset retention audit: ${total} unique assets — ${buckets.fresh} fresh, ${buckets.mature} mature, ${buckets.ageing} ageing, ${buckets.stale} stale (>${STALE_DAYS}d).`,
    findings: [
      `Total unique assets: ${total}`,
      `Fresh (<${MATURE_DAYS}d): ${buckets.fresh}`,
      `Mature (${MATURE_DAYS}-${AGEING_DAYS}d): ${buckets.mature}`,
      `Ageing (${AGEING_DAYS}-${STALE_DAYS}d): ${buckets.ageing}`,
      `Stale (>${STALE_DAYS}d): ${buckets.stale}`,
    ],
    actions:  buckets.stale > 10 ? [`${buckets.stale} assets exceed ${STALE_DAYS}-day retention threshold — review archival policy`] : [],
    metadata: { total, ...buckets },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
