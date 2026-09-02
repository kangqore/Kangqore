import { prisma }          from '../../../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { HanumanasAgentResult, AgentContext } from '../../../agents/types'
import { HANUMANAS } from '../../../identity'

const SYSTEM = `You are ${HANUMANAS.name}, Kangqore\'s governance AI. Assess intelligence sovereignty — ownership, custody, attribution, and approval chains for all knowledge assets. Flag any unapproved actors or breaches. Write 2 sentences.`

export async function runApprovalAgent(ctx: AgentContext): Promise<HanumanasAgentResult> {
  const start = Date.now()

  // Approval = every KNOWLEDGE_ASSET ingest was triggered through an ADMIN-approved ACTIVATION
  // Proxy: assets where dispatchId is set (came through a proper KIMMP dispatch)
  const [total, withDispatch, withoutDispatch] = await Promise.all([
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET' } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', NOT: { dispatchId: null } } }).catch(() => 0),
    (prisma as any).hanumanasAuditLog.count({ where: { eventType: 'KNOWLEDGE_ASSET', dispatchId: null } }).catch(() => 0),
  ])

  const approvalRate = total > 0 ? Math.round((withDispatch / total) * 100) : 100
  const verdict      = withoutDispatch > 0 ? 'WARN' : total > 0 ? 'PASS' : 'INFO'

  return {
    agentId:   'sovereignty.approval',
    engine:    'SOVEREIGNTY',
    verdict,
    summary:   `Approval rate: ${approvalRate}%. ${withDispatch}/${total} assets registered via approved KIMMP dispatches.`,
    findings: [
      `Total assets: ${total}`,
      `With dispatch approval: ${withDispatch} (${approvalRate}%)`,
      `Without dispatch link: ${withoutDispatch}`,
    ],
    actions:   withoutDispatch > 0
      ? ['Investigate assets without dispatchId — may be manually injected outside KIMMP pipeline']
      : [],
    metadata:  { total, withDispatch, withoutDispatch, approvalRate },
    durationMs: Date.now() - start,
    raisedAt:  new Date().toISOString(),
  }
}
