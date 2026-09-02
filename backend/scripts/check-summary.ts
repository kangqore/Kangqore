import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const since24h = new Date(Date.now() - 86_400_000);
  const since7d = new Date(Date.now() - 7 * 86_400_000);
  const allEngines = [
    'GOVERNANCE_OPS','SOVEREIGNTY','AUDIT_LEDGER','AUTONOMY_BOUNDARY',
    'ACCESS_SENTINEL','INTELLIGENCE_REGISTRY','EGRESS_CONTROL',
    'POLICY','TRUST_COMPLIANCE','RISK_INTELLIGENCE',
  ];

  const [engineLatest, critical24h, warn24h, reportRun] = await Promise.all([
    Promise.all(allEngines.map(async engine => {
      const row = await (prisma as any).hanumanasAgentRun.findFirst({
        where:   { engine, raisedAt: { gte: since7d } },
        orderBy: { raisedAt: 'desc' },
        select:  { verdict: true, raisedAt: true, agentId: true, summary: true },
      }).catch(() => null);
      return { engine, latest: row ?? null };
    })),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'CRITICAL', raisedAt: { gte: since24h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.count({ where: { verdict: 'WARN',     raisedAt: { gte: since24h } } }).catch(() => 0),
    (prisma as any).hanumanasAgentRun.findFirst({
      where:   { agentId: 'govops.reporting' },
      orderBy: { raisedAt: 'desc' },
      select:  { metadata: true, verdict: true, raisedAt: true },
    }).catch(() => null),
  ]);

  const healthScore = (reportRun?.metadata as any)?.healthScore ?? null;
  const hasCritical = engineLatest.some(e => e.latest?.verdict === 'CRITICAL') || critical24h > 0;
  const hasWarn     = engineLatest.some(e => e.latest?.verdict === 'WARN')     || warn24h > 0;
  const overallVerdict = hasCritical ? 'CRITICAL' : hasWarn ? 'WARN' : 'PASS';

  console.log('Result summary:', {
    overallVerdict,
    healthScore,
    critical24h,
    warn24h,
    enginesLength: engineLatest.length,
    engines: JSON.stringify(engineLatest, null, 2)
  });
}

main().finally(() => prisma.$disconnect());
