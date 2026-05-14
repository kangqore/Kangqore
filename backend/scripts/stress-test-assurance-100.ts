import { prisma } from '../src/lib/prisma';
import { EqoreAssuranceService } from '../src/eqore/assurance/assuranceEngine.service';
import * as fs from 'fs';
import * as path from 'path';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function withRetry(fn: () => Promise<any>, retries = 3, delayMs = 65000): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try { return await fn(); }
    catch (err: any) {
      if (i < retries && err.message?.includes('429')) {
        console.log(`  Rate limited, waiting ${delayMs/1000}s before retry ${i+1}/${retries}...`);
        await sleep(delayMs);
      } else throw err;
    }
  }
}

async function runStressTest() {
  console.log('--- eQORE Phase 8C: 100-Scenario Assurance Stress Test ---');
  
  const scenarios = await prisma.eqoreAssuranceScenario.findMany({
    where: { isActive: true }, orderBy: { id: 'asc' }
  });
  console.log(`Loaded ${scenarios.length} scenarios for testing.`);

  const results: any[] = [];
  const startTime = Date.now();

  // Sequential with rate-limit-aware delays
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`[${i+1}/${scenarios.length}] Testing: ${scenario.question.substring(0, 60)}...`);
    const testStart = Date.now();
    try {
      const result = await withRetry(() => EqoreAssuranceService.process(scenario.question));
      results.push({
        scenarioId: scenario.id,
        matchedScenarioId: result.metadata?.matchedScenarioId,
        urgencyLevel: result.metadata?.urgencyLevel,
        assuranceCategory: result.metadata?.assuranceCategory,
        matchScore: result.metadata?.matchedScenarioScore,
        status: result.status,
        latencyMs: Date.now() - testStart,
        error: result.error
      });
    } catch (err: any) {
      results.push({
        scenarioId: scenario.id,
        status: 'EXCEPTION',
        latencyMs: Date.now() - testStart,
        error: err.message
      });
    }
    // Pace at ~2 req/min to stay within 30k input tokens/min
    if (i < scenarios.length - 1) await sleep(32000);
  }

  const totalTime = Date.now() - startTime;
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const failedCount = results.filter(r => r.status !== 'SUCCESS').length;

  const report = {
    testTimestamp: new Date().toISOString(),
    totalScenarios: scenarios.length,
    successCount, failedCount,
    successRate: ((successCount / scenarios.length) * 100).toFixed(1) + '%',
    averageLatencyMs: Math.round(totalTime / scenarios.length),
    totalDurationMs: totalTime,
    results
  };

  const dir = path.join(__dirname, '../artifacts');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const reportPath = path.join(dir, 'stress_test_report_100.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n--- Stress Test Complete ---');
  console.log(`Success: ${successCount}/${scenarios.length} (${report.successRate})`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Report: ${reportPath}`);
}

runStressTest()
  .catch(err => { console.error('Stress test failed:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
