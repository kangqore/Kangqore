import { prisma }          from '../../../../lib/prisma'
import { AegisAgentResult, AgentContext } from '../../../agents/types'

const ENGINES = [
  'GOVERNANCE_OPS','SOVEREIGNTY','AUDIT_LEDGER','AUTONOMY_BOUNDARY',
  'ACCESS_SENTINEL','INTELLIGENCE_REGISTRY','EGRESS_CONTROL',
  'POLICY','TRUST_COMPLIANCE','RISK_INTELLIGENCE',
]

export async function runOperationalRiskAgent(ctx: AgentContext): Promise<AegisAgentResult> {
  const start  = Date.now()
  const last2h = new Date(Date.now() - 2  * 3_600_000)
  const last24h = new Date(Date.now() - 86_400_000)

  // Scheduler health: any agent run in last 2h?
  const recentRuns = await (prisma as any).aegisAgentRun
    .count({ where: { raisedAt: { gte: last2h } } }).catch(() => 0)

  // Engine silence: any engine with no run in last 24h
  const engineStatus = await Promise.all(ENGINES.map(async engine => {
    const lastRun = await (prisma as any).aegisAgentRun.findFirst({
      where:   { engine, raisedAt: { gte: last24h } },
      orderBy: { raisedAt: 'desc' },
      select:  { raisedAt: true },
    }).catch(() => null)
    return { engine, lastRun: lastRun?.raisedAt ?? null, silent: !lastRun }
  }))

  const silentEngines = engineStatus.filter(e => e.silent)
  const schedulerDown = recentRuns === 0

  const verdict = schedulerDown ? 'CRITICAL' : silentEngines.length > 3 ? 'WARN' : silentEngines.length > 0 ? 'WARN' : 'PASS'

  return {
    agentId:  'risk.operational-risk',
    engine:   'RISK_INTELLIGENCE',
    verdict,
    summary:  schedulerDown
      ? `CRITICAL: AEGIS scheduler appears silent — no agent runs in last 2h. Governance monitoring compromised.`
      : silentEngines.length > 0
        ? `Operational risk: ${silentEngines.length} engine(s) have not run in 24h: ${silentEngines.map(e => e.engine).join(', ')}.`
        : `Operational health: AEGIS scheduler active (${recentRuns} runs/2h). All 10 engines ran in last 24h.`,
    findings: [
      `AEGIS scheduler: ${schedulerDown ? 'SILENT (>2h)' : `Active (${recentRuns} runs in 2h)`}`,
      ...engineStatus.map(e => `${e.engine}: ${e.silent ? '✗ SILENT (>24h)' : `✓ ran at ${e.lastRun?.toISOString().slice(0, 16)}`}`),
    ],
    actions: schedulerDown
      ? ['CRITICAL: AEGIS scheduler is down — restart AegisScheduler.start() in backend/src/index.ts']
      : silentEngines.map(e => `Engine ${e.engine} is silent — trigger on-demand run via POST /admin/aegis/engines/${e.engine}/run`),
    metadata: { schedulerDown, recentRuns, silentEngines: silentEngines.length, engineStatus },
    durationMs: Date.now() - start,
    raisedAt:   new Date().toISOString(),
  }
}
