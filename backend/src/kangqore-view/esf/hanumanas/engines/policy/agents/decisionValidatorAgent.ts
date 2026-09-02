import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

export async function runDecisionValidatorAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  // HIGH priority activations must have complete decision metadata
  const highPriority: Array<{
    trigger: string | null; priority: string | null; confidence: string | null; dispatchId: string | null; system: string | null
  }> = await (prisma as any).aegisAuditLog.findMany({
    where:  { eventType: 'ACTIVATION', priority: 'HIGH', createdAt: { gte: last6h } },
    select: { trigger: true, priority: true, confidence: true, dispatchId: true, system: true },
  }).catch(() => [])

  const total    = highPriority.length
  const invalid  = highPriority.filter(e => !e.trigger || !e.confidence || !e.dispatchId)
  const coverage = total > 0 ? ((total - invalid.length) / total * 100).toFixed(1) : '100'

  const verdict = invalid.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'policy.decision-validator',
    engine:   'POLICY',
    verdict,
    summary:  invalid.length > 0
      ? `${invalid.length} of ${total} HIGH-priority activations (6h) lack complete decision metadata. Coverage: ${coverage}%.`
      : `Decision validation: all ${total} high-priority activations (6h) have complete metadata.`,
    findings: [
      `HIGH-priority activations (6h): ${total}`,
      `Complete decision metadata: ${total - invalid.length} (${coverage}%)`,
      `Missing required fields: ${invalid.length}`,
      ...invalid.map(e => `System ${e.system}: trigger=${e.trigger} conf=${e.confidence} dispatch=${e.dispatchId}`),
    ],
    actions:  invalid.length > 0
      ? ['HIGH-priority activations missing decision metadata — ensure KIMMP logs trigger, confidence, dispatchId']
      : [],
    metadata: { total, invalid: invalid.length, coverage: Number(coverage) },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
