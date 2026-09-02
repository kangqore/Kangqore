import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.`

// Approved sources for autonomous KIMMP actions
const APPROVED_AUTONOMOUS_ACTORS  = new Set(['SCHEDULER', 'KIMMP'])
const APPROVED_AUTONOMOUS_TRIGGERS = /^schedule\.|^event\./

export async function runSelfInitiationAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const events: Array<{ actor: string; trigger: string | null; system: string | null }> =
    await (prisma as any).hanumanasAuditLog.findMany({
      where:  { autonomous: true, createdAt: { gte: last24h } },
      select: { actor: true, trigger: true, system: true },
    }).catch(() => [])

  // Check for autonomous events that are NOT from approved actors or approved triggers
  const suspicious = events.filter(e =>
    !APPROVED_AUTONOMOUS_ACTORS.has(e.actor) ||
    (e.trigger && !APPROVED_AUTONOMOUS_TRIGGERS.test(e.trigger))
  )

  const total   = events.length
  const verdict = suspicious.length > 0 ? 'CRITICAL' : total > 0 ? 'PASS' : 'INFO'

  const llmSummary = await callLLM(SYSTEM,
    `Self-initiation check (24h): ${total} autonomous actions. ${suspicious.length} suspicious (unapproved actor or trigger). Approved actors: SCHEDULER, KIMMP. Approved triggers: schedule.* / event.*. Verdict: ${verdict}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`,
    300)

  return {
    agentId:   'autonomy.self-initiation',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   llmSummary || (suspicious.length > 0
      ? `CRITICAL: ${suspicious.length} suspicious self-initiating autonomous actions detected. KIMMP may be acting outside scheduler authority.`
      : `All ${total} autonomous actions (24h) originate from approved actors and triggers.`),
    findings: [
      `Autonomous actions (24h): ${total}`,
      `Suspicious (unapproved actor/trigger): ${suspicious.length}`,
      ...suspicious.map(e => `Actor: ${e.actor}  Trigger: ${e.trigger}  System: ${e.system}`),
    ],
    actions:   suspicious.length > 0
      ? ['CRITICAL: Investigate KIMMP self-initiation — check loopScheduler.ts and agent trigger assignments']
      : [],
    metadata:  { total, suspicious: suspicious.length, suspiciousEvents: suspicious },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
