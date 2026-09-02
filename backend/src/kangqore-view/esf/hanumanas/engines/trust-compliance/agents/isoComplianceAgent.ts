import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Assess regulatory compliance posture — ISO 27001, SOC 2, GDPR, DPDP Act. Write 2 sentences: compliance status and whether ADMIN action is required.'

// ISO 27001 (InfoSec) + ISO 42001 (AI Governance) control domains mapped to AEGIS events
const CONTROLS = [
  { name: 'A.8  Asset Management',     eventType: 'KNOWLEDGE_ASSET', label: 'Intelligence asset registration' },
  { name: 'A.9  Access Control',       eventType: 'ACCESS_DENIED',   label: 'Access control enforcement' },
  { name: 'A.12 Operations Security',  eventType: 'ACTIVATION',      label: 'KIMMP operational logging' },
  { name: 'A.16 Incident Management',  eventType: 'POLICY_VIOLATION',label: 'Policy violation logging' },
  { name: 'A.18 Compliance',           eventType: 'EGRESS',          label: 'Intelligence egress control' },
  { name: '42001 AI Accountability',   eventType: 'AUTONOMOUS',      label: 'Autonomous AI action logging' },
] as const

export async function runIsoComplianceAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start  = Date.now()
  const last30d = new Date(Date.now() - 30 * 86_400_000)

  const controlResults = await Promise.all(
    CONTROLS.map(async ctrl => {
      const count = await (prisma as any).aegisAuditLog
        .count({ where: { eventType: ctrl.eventType, createdAt: { gte: last30d } } }).catch(() => 0)
      return { ...ctrl, count, covered: count > 0 }
    })
  )

  const covered  = controlResults.filter(c => c.covered).length
  const score    = Math.round((covered / CONTROLS.length) * 100)
  const gaps     = controlResults.filter(c => !c.covered)

  return {
    agentId:  'compliance.iso',
    engine:   'TRUST_COMPLIANCE',
    verdict:  gaps.length > 0 ? 'WARN' : 'PASS',
    summary:  `ISO 27001/42001 compliance: ${covered}/${CONTROLS.length} controls evidenced (30d). Coverage score: ${score}%.${gaps.length > 0 ? ` Gaps: ${gaps.map(g => g.name).join(', ')}.` : ''}`,
    findings: controlResults.map(c => `${c.name}: ${c.covered ? `✓ ${c.count} events` : '✗ NO EVIDENCE'} (${c.label})`),
    actions:  gaps.map(g => `Generate evidence for ISO control "${g.name}" — enable AEGIS ${g.eventType} logging`),
    metadata: { framework: 'ISO 27001/42001', covered, total: CONTROLS.length, score, gaps: gaps.map(g => g.name) },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
