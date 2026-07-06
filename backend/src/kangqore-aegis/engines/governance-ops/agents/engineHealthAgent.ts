import { prisma }          from '../../../../lib/prisma'
import { callLLM }         from '../../../agents/llm'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const SYSTEM = 'You are AEGIS, Kangqore\'s governance AI. Provide executive governance summaries — direct, no fluff, 2 sentences.'

const ENGINES = [
  'SOVEREIGNTY', 'AUDIT_LEDGER', 'AUTONOMY_BOUNDARY', 'ACCESS_SENTINEL',
  'INTELLIGENCE_REGISTRY', 'EGRESS_CONTROL', 'POLICY', 'TRUST_COMPLIANCE',
  'RISK_INTELLIGENCE', 'GOVERNANCE_OPS',
]
const WARN_HOURS     = 12
const CRITICAL_HOURS = 24

export async function runEngineHealthAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start = Date.now()
  const now   = Date.now()

  const healthMap: Record<string, { lastRun: Date | null; stale: boolean; critical: boolean }> = {}

  await Promise.all(ENGINES.map(async engine => {
    const row = await (prisma as any).aegisAgentRun.findFirst({
      where:   { engine },
      orderBy: { raisedAt: 'desc' },
      select:  { raisedAt: true },
    }).catch(() => null)

    const lastRun    = row?.raisedAt ?? null
    const hoursSince = lastRun ? (now - (lastRun as Date).getTime()) / 3_600_000 : Infinity

    healthMap[engine] = {
      lastRun,
      stale:    hoursSince > WARN_HOURS,
      critical: hoursSince > CRITICAL_HOURS,
    }
  }))

  const criticalEngines = ENGINES.filter(e => healthMap[e].critical)
  const staleEngines    = ENGINES.filter(e => healthMap[e].stale && !healthMap[e].critical)
  const healthyEngines  = ENGINES.filter(e => !healthMap[e].stale)

  const verdict = criticalEngines.length > 0 ? 'CRITICAL' : staleEngines.length > 0 ? 'WARN' : 'PASS'

  const llmSummary = await callLLM(SYSTEM, `AEGIS Engine Health: ${healthyEngines.length}/${ENGINES.length} engines healthy. Stale (>${WARN_HOURS}h): ${staleEngines.length > 0 ? staleEngines.join(', ') : 'none'}. Critical (>${CRITICAL_HOURS}h): ${criticalEngines.length > 0 ? criticalEngines.join(', ') : 'none'}.\n\nWrite 2 sentences: current status and whether ADMIN action is needed.`, 300)

  return {
    agentId:   'govops.engine-health',
    engine:    'GOVERNANCE_OPS',
    verdict,
    summary:   criticalEngines.length > 0
      ? `${criticalEngines.length} engines have not run in ${CRITICAL_HOURS}h — immediate investigation required.`
      : staleEngines.length > 0
        ? `${staleEngines.length} engines are stale (>${WARN_HOURS}h). ${healthyEngines.length}/${ENGINES.length} healthy.`
        : `All ${ENGINES.length} AEGIS engines are healthy and running on schedule.`,
    findings: [
      `${healthyEngines.length}/${ENGINES.length} engines healthy`,
      ...staleEngines.map(e    => `${e}: no run in ${WARN_HOURS}h+ — WARN`),
      ...criticalEngines.map(e => `${e}: no run in ${CRITICAL_HOURS}h+ — CRITICAL`),
    ],
    actions: [
      ...criticalEngines.map(e => `Investigate why ${e} has not run — trigger manual run`),
      ...staleEngines.map(e    => `Check ${e} engine scheduler — may need restart`),
    ],
    metadata:   { healthMap, healthyCount: healthyEngines.length, staleCount: staleEngines.length, criticalCount: criticalEngines.length },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
