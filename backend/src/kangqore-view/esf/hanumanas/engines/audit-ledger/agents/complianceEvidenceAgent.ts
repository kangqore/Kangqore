import { prisma }   from '../../../../../../lib/prisma'
import { callLLM }  from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const EVENT_TYPES = ['ACTIVATION', 'AUTONOMOUS', 'ACCESS_DENIED', 'KNOWLEDGE_ASSET', 'EGRESS', 'POLICY_VIOLATION'] as const
const SYSTEM = 'You are AEGIS. Write concise compliance evidence summaries — what is covered and what gaps exist.'

export async function runComplianceEvidenceAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last7d = new Date(Date.now() - 7 * 86_400_000)

  const counts = await Promise.all(
    EVENT_TYPES.map(type =>
      (prisma as any).hanumanasAuditLog.count({ where: { eventType: type, createdAt: { gte: last7d } } }).catch(() => 0)
    )
  )

  const coverage = EVENT_TYPES.map((type, i) => ({ type, count: counts[i], covered: counts[i] > 0 }))
  const coveredCount = coverage.filter(c => c.covered).length
  const gaps         = coverage.filter(c => !c.covered)

  const coverageBlock = coverage.map(c => `${c.type}: ${c.count} events (${c.covered ? 'COVERED' : 'GAP'})`).join('\n')

  const report = await callLLM(
    SYSTEM,
    `AEGIS 7-day audit evidence coverage:\n${coverageBlock}\n\n${coveredCount}/6 event types covered.\n\nWrite 2 sentences: overall evidence posture and what auditors would flag.`,
    280,
  )

  const verdict = coveredCount < 4 ? 'WARN' : coveredCount < 6 ? 'WARN' : 'PASS'

  return {
    agentId:   'audit.compliance-evidence',
    engine:    'AUDIT_LEDGER',
    verdict,
    summary:   report || `${coveredCount}/6 event types with audit evidence in 7 days. ${gaps.length} gaps.`,
    findings: [
      `Audit coverage: ${coveredCount}/6 event types`,
      ...coverage.map(c => `${c.type}: ${c.count} events — ${c.covered ? '✓ covered' : '✗ GAP'}`),
    ],
    actions:   gaps.map(g => `${g.type} has no entries in 7 days — verify this audit path is active`),
    metadata:  { coverage, coveredCount, gapTypes: gaps.map(g => g.type) },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
