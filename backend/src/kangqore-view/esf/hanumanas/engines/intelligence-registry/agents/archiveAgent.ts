import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess knowledge asset registry health — coverage, metadata quality, retention. Write 2 sentences, direct ADMIN status.'

const ARCHIVE_THRESHOLD_DAYS = 180

export async function runArchiveAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start       = Date.now()
  const archiveCutoff = new Date(Date.now() - ARCHIVE_THRESHOLD_DAYS * 86_400_000)

  const [archivable, total] = await Promise.all([
    (prisma as any).aegisAuditLog.count({
      where: { eventType: 'KNOWLEDGE_ASSET', createdAt: { lt: archiveCutoff } },
    }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({
      where: { eventType: 'KNOWLEDGE_ASSET' },
    }).catch(() => 0),
  ])

  const archivablePct = total > 0 ? (archivable / total * 100).toFixed(1) : '0'
  const verdict = archivable > 50 ? 'WARN' : 'PASS'

  // Also get oldest asset date for reference
  const oldest: { createdAt: Date } | null = await (prisma as any).aegisAuditLog.findFirst({
    where:   { eventType: 'KNOWLEDGE_ASSET' },
    orderBy: { createdAt: 'asc' },
    select:  { createdAt: true },
  }).catch(() => null)

  return {
    agentId:  'registry.archive',
    engine:   'INTELLIGENCE_REGISTRY',
    verdict,
    summary:  `Archive scan: ${archivable} of ${total} intelligence assets (${archivablePct}%) exceed the ${ARCHIVE_THRESHOLD_DAYS}-day retention threshold and are eligible for archival.`,
    findings: [
      `Total assets: ${total}`,
      `Archivable (>${ARCHIVE_THRESHOLD_DAYS}d): ${archivable} (${archivablePct}%)`,
      `Active (≤${ARCHIVE_THRESHOLD_DAYS}d): ${total - archivable}`,
      ...(oldest ? [`Oldest registered asset: ${oldest.createdAt.toISOString().slice(0, 10)}`] : []),
    ],
    actions:  archivable > 50
      ? [`${archivable} assets eligible for archival — implement retention policy to reduce registry bloat`]
      : [],
    metadata: { total, archivable, archivablePct: Number(archivablePct), thresholdDays: ARCHIVE_THRESHOLD_DAYS },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
