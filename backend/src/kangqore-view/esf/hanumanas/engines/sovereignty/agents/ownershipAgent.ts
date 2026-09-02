import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.'

// KIMMP, SYSTEM, and SCHEDULER are approved system actors for knowledge asset
// registration — only truly unknown actors constitute a sovereignty breach.
const APPROVED_ACTORS = ['ADMIN', 'KIMMP', 'SYSTEM', 'SCHEDULER']

export async function runOwnershipAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [total, recentTotal, allActors] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'KNOWLEDGE_ASSET' },
      select: { actor: true },
    }).catch(() => []) as Promise<{ actor: string | null }[]>,
  ])

  const unapproved = (allActors as { actor: string | null }[])
    .filter(r => !APPROVED_ACTORS.includes(r.actor ?? ''))
    .length

  const verdict = unapproved > 0 ? 'CRITICAL' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.ownership',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   unapproved > 0
      ? `CRITICAL: ${unapproved} intelligence assets registered by unapproved actor. Sovereignty breach detected.`
      : `All ${total} intelligence assets registered by approved actors (ADMIN/KIMMP/SYSTEM). ${recentTotal} new in 24h.`,
    findings: [
      `Total assets under sovereignty: ${total}`,
      `New assets (24h): ${recentTotal}`,
      `Approved actors: ${APPROVED_ACTORS.join(', ')}`,
      ...(unapproved > 0 ? [`BREACH: ${unapproved} assets registered by unapproved actor`] : []),
    ],
    actions:   unapproved > 0 ? ['Investigate unapproved actor in the Assets tab'] : [],
    metadata:  { total, unapproved, recentTotal, approvedActors: APPROVED_ACTORS },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
