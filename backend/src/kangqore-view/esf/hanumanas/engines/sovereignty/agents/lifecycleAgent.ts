import { AegisSovereignty } from '../../../hanumanasSovereignty.service'
import { callLLM }           from '../../../agents/llm'
import { prisma }            from '../../../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Analyse intelligence asset lifecycle states — retention, expiry, and sovereignty health.'

export async function runLifecycleAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start    = Date.now()
  const now      = new Date()
  const day90    = new Date(now.getTime() - 90  * 86_400_000)
  const day180   = new Date(now.getTime() - 180 * 86_400_000)
  const day365   = new Date(now.getTime() - 365 * 86_400_000)

  // Query assets by age bucket
  const [total, age90, age180, age365] = await Promise.all([
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', createdAt: { lte: day90  } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', createdAt: { lte: day180 } } }).catch(() => 0),
    (prisma as any).aegisAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', createdAt: { lte: day365 } } }).catch(() => 0),
  ])

  const summary = await AegisSovereignty.ownershipSummary()
  const restricted = summary.restrictedAssets ?? 0

  const stale    = age365 // assets > 1 year — approaching RESTRICTED 730d limit for some types
  const ageing   = age180 - stale // 180-365 days
  const mature   = age90  - ageing - stale // 90-180 days
  const fresh    = total  - age90 // < 90 days

  const narrative = await callLLM(
    SYSTEM,
    `Asset lifecycle snapshot: ${total} total, ${fresh} fresh (<90d), ${mature} mature (90-180d), ${ageing} ageing (180-365d), ${stale} stale (>365d). ${restricted} RESTRICTED.\n\nWrite 2 sentences on lifecycle health and any retention actions needed.`,
    250,
  )

  const verdict = stale > 10 ? 'WARN' : 'PASS'

  return {
    agentId:   'sovereignty.lifecycle',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   narrative || `${total} total assets — ${fresh} fresh, ${mature} mature, ${ageing} ageing, ${stale} stale (>365d).`,
    findings: [
      `Total assets: ${total}`,
      `Fresh (<90d): ${fresh}`,
      `Mature (90–180d): ${mature}`,
      `Ageing (180–365d): ${ageing}`,
      `Stale (>365d): ${stale}`,
      `RESTRICTED assets: ${restricted}`,
    ],
    actions:   stale > 10 ? ['Review stale assets — consider re-ingestion or archival'] : [],
    metadata:  { total, fresh, mature, ageing, stale, restricted },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
