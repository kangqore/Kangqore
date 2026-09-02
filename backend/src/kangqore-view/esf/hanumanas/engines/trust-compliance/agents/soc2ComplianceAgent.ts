import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess regulatory compliance posture — ISO 27001, SOC 2, GDPR, DPDP Act. Write 2 sentences: compliance status and whether ADMIN action is required.'

// SOC2 Type II Trust Service Criteria mapped to AEGIS capabilities
const CRITERIA = [
  { id: 'CC6', name: 'Security (Logical Access)',   check: 'ACCESS_DENIED' },
  { id: 'CC7', name: 'Operations Monitoring',       check: 'ACTIVATION' },
  { id: 'CC9', name: 'Risk Mitigation (Autonomy)',  check: 'AUTONOMOUS' },
  { id: 'P1',  name: 'Privacy (Data Handling)',     check: 'EGRESS' },
  { id: 'A1',  name: 'Availability (Audit Trail)',  check: 'KNOWLEDGE_ASSET' },
] as const

export async function runSoc2ComplianceAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start   = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const criteriaResults = await Promise.all(
    CRITERIA.map(async crit => {
      const count = await (prisma as any).aegisAuditLog
        .count({ where: { eventType: crit.check, createdAt: { gte: last30d } } }).catch(() => 0)
      return { ...crit, count, evidenced: count > 0 }
    })
  )

  // Availability: AEGIS scheduler must have run in last 2h
  const schedulerActive = await (prisma as any).aegisAgentRun
    .count({ where: { raisedAt: { gte: new Date(Date.now() - 2 * 3_600_000) } } }).catch(() => 0)

  const evidenced = criteriaResults.filter(c => c.evidenced).length + (schedulerActive > 0 ? 0 : 0)
  const gaps      = criteriaResults.filter(c => !c.evidenced)
  const score     = Math.round((evidenced / CRITERIA.length) * 100)

  return {
    agentId:  'compliance.soc2',
    engine:   'TRUST_COMPLIANCE',
    verdict:  gaps.length > 1 ? 'WARN' : 'PASS',
    summary:  `SOC2 Type II: ${evidenced}/${CRITERIA.length} trust service criteria evidenced (30d). Score: ${score}%.${!schedulerActive ? ' WARNING: AEGIS scheduler silent >2h.' : ''}`,
    findings: [
      ...criteriaResults.map(c => `${c.id} ${c.name}: ${c.evidenced ? `✓ ${c.count} events` : '✗ NO EVIDENCE'}`),
      `Continuous monitoring (AEGIS): ${schedulerActive > 0 ? `✓ Active (${schedulerActive} runs)` : '✗ SILENT >2h'}`,
    ],
    actions:  gaps.map(g => `SOC2 gap: "${g.name}" (${g.id}) — generate ${g.check} events`),
    metadata: { framework: 'SOC2 Type II', evidenced, total: CRITERIA.length, score, schedulerActive },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
