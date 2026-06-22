import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS. Assess this AI governance system\'s readiness for an external audit and produce a concise readiness brief.'

const EVENT_TYPES = ['ACTIVATION','AUTONOMOUS','POLICY_VIOLATION','ACCESS_DENIED','KNOWLEDGE_ASSET','EGRESS'] as const

export async function runAuditReadinessAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start   = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const rawCounts = await Promise.all(
    EVENT_TYPES.map(et =>
      (prisma as any).aegisAuditLog.count({ where: { eventType: et, createdAt: { gte: last30d } } }).catch(() => 0) as Promise<number>
    )
  )
  const counts: Record<string, number> = Object.fromEntries(EVENT_TYPES.map((et, i) => [et, rawCounts[i]]))
  const covered     = rawCounts.filter(c => c > 0).length
  const totalEvents = rawCounts.reduce((s, c) => s + c, 0)

  const recentCritical = await (prisma as any).aegisAgentRun
    .count({ where: { verdict: 'CRITICAL', raisedAt: { gte: new Date(Date.now() - 7 * 86_400_000) } } }).catch(() => 0) as number

  const readinessScore = Math.min(100, Math.max(0,
    covered * 15 +
    (totalEvents > 100 ? 10 : totalEvents > 0 ? 5 : 0) -
    (recentCritical * 5) +
    (counts['POLICY_VIOLATION'] === 0 ? 10 : 0)
  ))

  const summaryBlock = EVENT_TYPES.map(et => `${et}: ${counts[et]}`).join(', ')
  const narrative = await callLLM(
    SYSTEM,
    `AEGIS 30-day audit evidence: ${summaryBlock}. Readiness score: ${readinessScore}/100. Recent CRITICAL findings (7d): ${recentCritical}. Event type coverage: ${covered}/6.\n\nWrite 2-3 sentences: readiness assessment and top gap for an external auditor.`,
    350,
  )

  return {
    agentId:  'compliance.audit-readiness',
    engine:   'TRUST_COMPLIANCE',
    verdict:  readinessScore < 60 ? 'WARN' : 'PASS',
    summary:  narrative || `Audit readiness score: ${readinessScore}/100. ${covered}/6 event types evidenced (30d). Recent CRITICAL findings: ${recentCritical}.`,
    findings: [
      `Audit readiness score: ${readinessScore}/100`,
      `Event type coverage (30d): ${covered}/6`,
      `Total audit events (30d): ${totalEvents}`,
      ...EVENT_TYPES.map(et => `${et}: ${counts[et]} events`),
      `Recent CRITICAL agent findings (7d): ${recentCritical}`,
    ],
    actions:  readinessScore < 60 ? ['Audit readiness below 60 — address coverage gaps before external review'] : [],
    metadata: { readinessScore, covered, totalEvents, counts, recentCritical },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
