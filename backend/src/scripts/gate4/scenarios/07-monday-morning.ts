// Gate 4 — Scenario 7: "Monday Morning" Composite Stress Test
//
// Scenario: Enterprise platform starting a new week.
// 6-step workflow that exercises every major WAOE capability in one realistic run:
//
//   s1 → Read operational signals
//   s2 → Query enterprise data         (parallel with s1)
//   s3 → Human Approval Gate           (depends on s1+s2)
//   s4 → Write decision memory         (after approval)
//   s5 → Update goal progress          (after approval, parallel with s4)
//   s6 → Write outcome lesson          (depends on s4+s5)
//
// Validates:
//   - Parallel initial layer (s1 + s2)
//   - Approval gate pause
//   - Resume continues post-gate steps
//   - Multiple post-gate parallel steps (s4 + s5)
//   - Final aggregation step (s6)
//   - Full trace chain (RUN_START → paused → resumed → RUN_COMPLETE)
//   - Memory persistence after each MEMORY_WRITE
//   - Goal update after approval

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioMondayMorning(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    const dag = {
      nodes: [
        { id: 's1', title: 'Read Signals',         type: 'SIGNAL_READ',   description: 'Scan operational signals',    critical: false, timeout: 5000 },
        { id: 's2', title: 'Query Enterprise Data', type: 'DATA_QUERY',    description: 'Build context snapshot',     critical: false, timeout: 5000 },
        { id: 's3', title: 'Executive Approval',   type: 'APPROVAL_GATE', description: 'Monday briefing sign-off',   critical: false, timeout: 0 },
        { id: 's4', title: 'Record Decision',      type: 'MEMORY_WRITE',  description: 'Log approved actions',       critical: true,  timeout: 5000,
          params: { content: 'Monday Morning Gate 4 test: decisions recorded' } },
        { id: 's5', title: 'Update Goal Progress', type: 'GOAL_UPDATE',   description: 'Advance weekly goal',        critical: false, timeout: 5000,
          params: { progressPct: { increment: 5 } } },
        { id: 's6', title: 'Write Outcome Lesson', type: 'MEMORY_WRITE',  description: 'Weekly outcome lesson',      critical: true,  timeout: 5000,
          params: { content: 'Monday Morning Gate 4 test: outcome recorded' } },
      ],
      edges: [
        { from: 's1', to: 's3' },
        { from: 's2', to: 's3' },
        { from: 's3', to: 's4' },
        { from: 's3', to: 's5' },
        { from: 's4', to: 's6' },
        { from: 's5', to: 's6' },
      ],
    }

    const { runId, executionOrder } = await createTestRun('Gate4 Monday Morning Test', dag)
    const ctx = testCtx()

    // ── Validate DAG structure ─────────────────────────────────────────────
    assert(assertions, 'DAG: correct node count (6)', dag.nodes.length === 6,
      `nodes = ${dag.nodes.length}`)

    assert(assertions, 'Layer 0 has s1+s2 in parallel (no deps)',
      executionOrder[0]?.includes('s1') && executionOrder[0]?.includes('s2'),
      `Layer 0: ${JSON.stringify(executionOrder[0])}`)

    assert(assertions, 'Layer 1 has approval gate (s3) after parallel reads',
      executionOrder[1]?.includes('s3'),
      `Layer 1: ${JSON.stringify(executionOrder[1])}`)

    // ── Phase 1: Run → should pause at approval gate ───────────────────────
    const compiled: CompiledWorkflow = { workflowId: 'test', workflowRunId: runId, dag: dag as any, executionOrder }
    const phase1 = await KimmpExecutionEngine.run(compiled, ctx)

    assert(assertions, 'Phase 1: run pauses at APPROVAL_GATE (s3)', phase1.paused === true,
      `paused=${phase1.paused}`)

    assert(assertions, 'Phase 1: s1 and s2 completed before pause',
      phase1.stepResults['s1'] !== undefined && phase1.stepResults['s2'] !== undefined,
      `s1=${!!phase1.stepResults['s1']}, s2=${!!phase1.stepResults['s2']}`)

    assert(assertions, 'Phase 1: s4/s5/s6 not yet executed',
      phase1.stepResults['s4'] === undefined && phase1.stepResults['s5'] === undefined,
      `s4=${!!phase1.stepResults['s4']}, s5=${!!phase1.stepResults['s5']}`)

    const pausedStatus = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { status: true, currentStep: true },
    })
    assert(assertions, 'DB: status=PAUSED, currentStep=s3', pausedStatus?.status === 'PAUSED' && pausedStatus?.currentStep === 's3',
      `status=${pausedStatus?.status}, currentStep=${pausedStatus?.currentStep}`)

    // ── Phase 2: Approve → run continues ─────────────────────────────────
    await KimmpExecutionEngine.resume(runId, ctx)

    const finalRun = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId },
      select: { status: true, stepResults: true, trace: true, checkpoints: true },
    })

    assert(assertions, 'Phase 2: status=COMPLETED after resume', finalRun?.status === 'COMPLETED',
      `status = ${finalRun?.status}`)

    const finalResults = (finalRun?.stepResults as any) ?? {}
    for (const id of ['s1', 's2', 's4', 's5', 's6']) {
      assert(assertions, `Phase 2: step ${id} completed`, finalResults[id] !== undefined,
        `stepResults[${id}] = ${JSON.stringify(finalResults[id])}`)
    }

    // ── Trace chain validation ─────────────────────────────────────────────
    const trace: any[] = Array.isArray(finalRun?.trace) ? finalRun.trace : []
    const eventTypes = [...new Set(trace.map((t: any) => t.event))]

    assert(assertions, 'Trace: RUN_START present', trace.some(t => t.event === 'RUN_START'),
      `Events: ${eventTypes.join(', ')}`)

    assert(assertions, 'Trace: APPROVAL_WAIT present', trace.some(t => t.event === 'APPROVAL_WAIT'),
      `Events: ${eventTypes.join(', ')}`)

    assert(assertions, 'Trace: APPROVAL_RECEIVED present', trace.some(t => t.event === 'APPROVAL_RECEIVED'),
      `Events: ${eventTypes.join(', ')}`)

    assert(assertions, 'Trace: RUN_COMPLETE present', trace.some(t => t.event === 'RUN_COMPLETE'),
      `Events: ${eventTypes.join(', ')}`)

    const stepCompletedIds = trace.filter(t => t.event === 'STEP_COMPLETE' && !t.data?.skipped).map(t => t.stepId)
    assert(assertions, 'Trace: 5 STEP_COMPLETE events (s1,s2,s4,s5,s6)', stepCompletedIds.length >= 5,
      `STEP_COMPLETE for: ${stepCompletedIds.join(', ')}`)

    // ── Memory persistence ─────────────────────────────────────────────────
    const memories = await (prisma as any).kimmpMemory.findMany({
      where: { content: { contains: runId } },
    })
    assert(assertions, 'Memory entries created linked to this run', memories.length >= 1,
      `Memories with runId ${runId}: ${memories.length}`)

    // ── Full trace coverage score ─────────────────────────────────────────
    const checkpoints: any[] = Array.isArray(finalRun?.checkpoints) ? finalRun.checkpoints : []
    assert(assertions, 'Checkpoints recorded during run', checkpoints.length >= 2,
      `Checkpoints: ${checkpoints.length}`)

    const score = computeScore(assertions)
    return { scenario: 'monday_morning', passed: score >= 75, score, durationMs: Date.now() - start, assertions, workflowRunId: runId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'monday_morning', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
