import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const AUTONOMOUS_RATIO_WARN = 0.75 // warn if > 75% of all activations are autonomous

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess KIMMP autonomy boundary — whether autonomous AI behaviour is within acceptable limits. Write 2 sentences, direct and specific.`

export async function runDetectorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last24h = new Date(Date.now() - 86_400_000)

  const [total, autonomous, adminTriggered] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: true,  createdAt: { gte: last24h } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'ACTIVATION', autonomous: false, createdAt: { gte: last24h } } }).catch(() => 0),
  ])

  const ratio   = total > 0 ? autonomous / total : 0
  const verdict = ratio > AUTONOMOUS_RATIO_WARN ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  const llmSummary = await callLLM(SYSTEM, `KIMMP activations (24h): ${total} total, ${autonomous} autonomous (${Math.round(ratio * 100)}%), ${adminTriggered} ADMIN-triggered. Autonomy ratio threshold: ${Math.round(AUTONOMOUS_RATIO_WARN * 100)}%.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'autonomy.detector',
    engine:    'AUTONOMY_BOUNDARY',
    verdict,
    summary:   llmSummary || `${autonomous}/${total} KIMMP activations (24h) were autonomous (${Math.round(ratio * 100)}%).`,
    findings: [
      `Total activations (24h): ${total}`,
      `Autonomous: ${autonomous} (${Math.round(ratio * 100)}%)`,
      `ADMIN-triggered: ${adminTriggered}`,
      `Ratio threshold: ${Math.round(AUTONOMOUS_RATIO_WARN * 100)}%`,
    ],
    actions:   ratio > AUTONOMOUS_RATIO_WARN
      ? ['High autonomous rate — verify LoopScheduler is within expected cadence']
      : [],
    metadata:  { total, autonomous, adminTriggered, autonomousRatio: ratio },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
