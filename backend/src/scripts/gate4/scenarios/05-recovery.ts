// Gate 4 — Scenario 5: Recovery
// Validates: idempotent replay (already-completed steps are skipped),
// checkpoint restore, and rollback (COMPENSATE trace events on FAILED run)

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioRecovery(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    // ── Part A: Idempotent replay ─────────────────────────────────────────
    // Pre-populate stepResults with r1 already done, then run.
    // r2 should execute; r1 should be skipped (idempotency guard).

    const dagA = {
      nodes: [
        { id: 'r1', title: 'Step 1 (pre-completed)', type: 'SIGNAL_READ', description: 'Already done', critical: false, timeout: 5000 },
        { id: 'r2', title: 'Step 2 (new)',             type: 'DATA_QUERY', description: 'Run fresh',    critical: false, timeout: 5000 },
      ],
      edges: [{ from: 'r1', to: 'r2' }],
    }

    const { runId: runIdA, executionOrder: orderA } = await createTestRun('Gate4 Recovery Idempotency Test', dagA)

    // Simulate a prior partial run: r1 is already in stepResults
    const previousOutput = { signals: [], summary: 'pre-completed' }
    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runIdA },
      data:  { stepResults: { r1: previousOutput } },
    })

    const traceBeforeCount = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runIdA }, select: { trace: true },
    }).then((r: any) => (Array.isArray(r?.trace) ? r.trace.length : 0))

    const ctx = testCtx()
    const compiledA: CompiledWorkflow = { workflowId: 'test', workflowRunId: runIdA, dag: dagA as any, executionOrder: orderA }
    const resultA = await KimmpExecutionEngine.run(compiledA, ctx)

    assert(assertions, 'Idempotent: run completes ok with pre-existing step', resultA.ok,
      `ok=${resultA.ok}`)

    // r1's output should still be the pre-completed value (not re-executed)
    assert(assertions, 'Idempotent: r1 output unchanged (not re-executed)',
      JSON.stringify(resultA.stepResults['r1']) === JSON.stringify(previousOutput),
      `r1 = ${JSON.stringify(resultA.stepResults['r1'])}`)

    // r2 should have new output
    assert(assertions, 'Idempotent: r2 executed fresh (new output)',
      resultA.stepResults['r2'] !== undefined,
      `r2 = ${JSON.stringify(resultA.stepResults['r2'])}`)

    // Trace should contain idempotent-replay skip for r1
    const traceA: any[] = (await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runIdA }, select: { trace: true },
    }))?.trace ?? []
    const skipEvent = traceA.find((t: any) => t.event === 'STEP_COMPLETE' && t.data?.reason === 'idempotent-replay')
    assert(assertions, 'Trace shows idempotent-replay skip event for r1', !!skipEvent,
      `Trace events: ${traceA.map((t: any) => `${t.event}(${t.stepId ?? ''})`).join(', ')}`)

    // ── Part B: Rollback / Compensation ──────────────────────────────────
    const dagB = {
      nodes: [
        { id: 'c1', title: 'Signal Read',  type: 'SIGNAL_READ',  description: 'Step 1', critical: false, timeout: 5000 },
        { id: 'c2', title: 'Write Memory', type: 'MEMORY_WRITE', description: 'Step 2', critical: false, timeout: 5000,
          params: { content: 'Gate 4 rollback test — will be compensated' } },
      ],
      edges: [{ from: 'c1', to: 'c2' }],
    }

    const { runId: runIdB, executionOrder: orderB } = await createTestRun('Gate4 Rollback Test', dagB)
    const compiledB: CompiledWorkflow = { workflowId: 'test', workflowRunId: runIdB, dag: dagB as any, executionOrder: orderB }

    // Run to completion first
    await KimmpExecutionEngine.run(compiledB, ctx)

    // Force to FAILED so rollback can be triggered
    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runIdB }, data: { status: 'FAILED' },
    })

    // Call rollback
    await KimmpExecutionEngine.rollback(runIdB, ctx)

    const runB = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runIdB }, select: { status: true, outcome: true, trace: true },
    })

    assert(assertions, 'Rollback sets status = FAILED with outcome = COMPENSATED',
      runB?.status === 'FAILED' && runB?.outcome === 'COMPENSATED',
      `status=${runB?.status}, outcome=${runB?.outcome}`)

    const traceB: any[] = Array.isArray(runB?.trace) ? runB.trace : []
    const compensateEvents = traceB.filter(t => t.event === 'COMPENSATE')
    assert(assertions, 'Trace contains COMPENSATE events', compensateEvents.length >= 2,
      `COMPENSATE events: ${compensateEvents.length} — ${JSON.stringify(compensateEvents.map(t => t.data))}`)

    const score = computeScore(assertions)
    return {
      scenario: 'recovery',
      passed: score >= 75,
      score,
      durationMs: Date.now() - start,
      assertions,
      workflowRunId: runIdA,
    }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'recovery', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
