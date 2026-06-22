import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Analyse intelligence disclosure patterns and report concisely on risk to the ADMIN.'

export async function runDisclosureTrackerAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const days: Array<{ date: string; count: number; actors: string }> = []
  for (let i = 6; i >= 0; i--) {
    const from  = new Date(Date.now() - (i + 1) * 86_400_000)
    const to    = new Date(Date.now() - i       * 86_400_000)
    const rows: Array<{ actor: string; assetId: string | null }> = await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'EGRESS', createdAt: { gte: from, lt: to } },
      select: { actor: true, assetId: true },
    }).catch(() => [])
    const uniqueActors = [...new Set(rows.map(r => r.actor))].join(',')
    days.push({ date: from.toISOString().slice(0, 10), count: rows.length, actors: uniqueActors })
  }

  const trendBlock = days.map(d => `${d.date}: ${d.count} egress to [${d.actors || 'none'}]`).join('\n')
  const total7d    = days.reduce((s, d) => s + d.count, 0)
  const recent3d   = days.slice(-3).reduce((s, d) => s + d.count, 0)
  const earlier3d  = days.slice(0, 3).reduce((s, d) => s + d.count, 0)
  const increasing = recent3d > earlier3d * 1.5 && earlier3d > 0

  const narrative = await callLLM(
    SYSTEM,
    `Intelligence disclosure (egress) 7-day trend:\n${trendBlock}\n\nWrite 2 sentences: is disclosure stable or increasing, and what are the primary risk considerations for ADMIN.`,
    280,
  )

  return {
    agentId:  'egress.disclosure-tracker',
    engine:   'EGRESS_CONTROL',
    verdict:  increasing ? 'WARN' : 'INFO',
    summary:  narrative || `Disclosure tracker (7d): ${total7d} total EGRESS events. ${increasing ? 'Increasing trend detected.' : 'Stable pattern.'}`,
    findings: days.map(d => `${d.date}: ${d.count} disclosures${d.actors ? ` to ${d.actors}` : ''}`),
    actions:  increasing ? ['Disclosure volume increasing — verify new egress recipients are authorized'] : [],
    metadata: { total7d, recent3d, earlier3d, increasing, days },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
