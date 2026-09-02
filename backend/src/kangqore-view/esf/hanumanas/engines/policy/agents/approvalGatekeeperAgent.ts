import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess policy compliance and enforcement. Flag violations, exceptions, and decisions requiring ADMIN review. Write 2 sentences, direct.'

// High-sensitivity triggers that must come from ADMIN or SCHEDULER
const SENSITIVE_TRIGGERS = /^event\.(KNOWLEDGE_ASSET|EGRESS|CRITICAL_ACTIVATION)/
const ADMIN_ACTORS       = new Set(['ADMIN', 'SCHEDULER'])

export async function runApprovalGatekeeperAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last6h = new Date(Date.now() - 6 * 3_600_000)

  const events: Array<{ actor: string; trigger: string | null; system: string | null; priority: string | null }> =
    await (prisma as any).aegisAuditLog.findMany({
      where:  { eventType: 'ACTIVATION', createdAt: { gte: last6h } },
      select: { actor: true, trigger: true, system: true, priority: true },
    }).catch(() => [])

  // Sensitive = high priority or sensitive trigger, not from approved actors
  const unapproved = events.filter(e =>
    (e.priority === 'HIGH' || (e.trigger && SENSITIVE_TRIGGERS.test(e.trigger))) &&
    !ADMIN_ACTORS.has(e.actor)
  )

  const total   = events.length
  const verdict = unapproved.length > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:  'policy.approval-gatekeeper',
    engine:   'POLICY',
    verdict,
    summary:  unapproved.length > 0
      ? `${unapproved.length} high-sensitivity operations ran without ADMIN/SCHEDULER approval (6h).`
      : `Approval gate clean — all ${total} activations (6h) cleared or non-sensitive.`,
    findings: [
      `Total activations (6h): ${total}`,
      `Sensitive/high-priority activations: ${events.filter(e => e.priority === 'HIGH').length}`,
      `Without approval gate: ${unapproved.length}`,
      ...unapproved.map(e => `Unapproved: actor=${e.actor}  trigger=${e.trigger}  priority=${e.priority}  system=${e.system}`),
    ],
    actions:  unapproved.map(e => `Review unapproved high-priority activation — actor: ${e.actor}, system: ${e.system}`),
    metadata: { total, unapproved: unapproved.length, unapprovedEvents: unapproved },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
