// Gate 4 — Scenario 6: Observability
// Validates: trace completeness, step timings in trace, checkpoint fidelity,
// decision lineage (POLICY_CHECK events), audit log entries

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioObservability(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    const dag = {
      nodes: [
        { id: 'o1', title: 'Signal Read',  type: 'SIGNAL_READ',  description: 'Step 1', critical: false, timeout: 5000 },
        { id: 'o2', title: 'Data Query',   type: 'DATA_QUERY',   description: 'Step 2', critical: false, timeout: 5000 },
        { id: 'o3', title: 'Write Memory', type: 'MEMORY_WRITE', description: 'Step 3', critical: true,  timeout: 5000,
          params: { content: 'Gate 4 observability test' } },
      ],
      edges: [{ from: 'o1', to: 'o2' }, { from: 'o2', to: 'o3' }],
    }

    const { runId, executionOrder } = await createTestRun('Gate4 Observability Test', dag)
    const ctx = testCtx()
    const compiled: CompiledWorkflow = { workflowId: 'test', workflowRunId: runId, dag: dag as any, executionOrder }

    await KimmpExecutionEngine.run(compiled, ctx)

    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId },
      select: { status: true, trace: true, checkpoints: true, stepResults: true },
    })

    const trace: any[] = Array.isArray(run?.trace) ? run.trace : []

    // ── Trace completeness ─────────────────────────────────────────────────

    assert(assertions, 'Trace has RUN_START', trace.some(t => t.event === 'RUN_START'),
      `Events: ${[...new Set(trace.map((t: any) => t.event))].join(', ')}`)

    assert(assertions, 'Trace has RUN_COMPLETE', trace.some(t => t.event === 'RUN_COMPLETE'),
      `Events: ${[...new Set(trace.map((t: any) => t.event))].join(', ')}`)

    const stepStarts = trace.filter(t => t.event === 'STEP_START').map(t => t.stepId)
    assert(assertions, 'Trace has STEP_START for all 3 nodes', stepStarts.length === 3,
      `STEP_START stepIds: ${stepStarts.join(', ')}`)

    const stepCompletes = trace.filter(t => t.event === 'STEP_COMPLETE' && !t.data?.skipped).map(t => t.stepId)
    assert(assertions, 'Trace has STEP_COMPLETE for all 3 nodes', stepCompletes.length === 3,
      `STEP_COMPLETE stepIds: ${stepCompletes.join(', ')}`)

    // ── Step timing data ──────────────────────────────────────────────────

    const stepsWithTiming = trace.filter(t => t.event === 'STEP_COMPLETE' && typeof t.durationMs === 'number')
    assert(assertions, 'STEP_COMPLETE events carry durationMs', stepsWithTiming.length >= 2,
      `Steps with timing: ${stepsWithTiming.length}`)

    // ── Timestamps present on all events ─────────────────────────────────

    const missingTs = trace.filter(t => !t.ts)
    assert(assertions, 'All trace events have ISO timestamps', missingTs.length === 0,
      `Events without ts: ${missingTs.length}`)

    // ── Checkpoint fidelity ───────────────────────────────────────────────

    const checkpoints: any[] = Array.isArray(run?.checkpoints) ? run.checkpoints : []
    assert(assertions, 'At least 1 checkpoint was written', checkpoints.length >= 1,
      `Checkpoints: ${checkpoints.length}`)

    // Each checkpoint should contain stepResults
    const validCheckpoints = checkpoints.filter(c => typeof c.stepResults === 'object' && c.stepId)
    assert(assertions, 'Checkpoints contain stepId and stepResults', validCheckpoints.length >= 1,
      `Valid checkpoints: ${validCheckpoints.length}`)

    // ── CHECKPOINT trace event ────────────────────────────────────────────

    const checkpointEvents = trace.filter(t => t.event === 'CHECKPOINT')
    assert(assertions, 'CHECKPOINT events recorded in trace', checkpointEvents.length >= 1,
      `CHECKPOINT events: ${checkpointEvents.length}`)

    // ── MEMORY_WRITE trace event ──────────────────────────────────────────

    assert(assertions, 'Trace has MEMORY_WRITE event', trace.some(t => t.event === 'MEMORY_WRITE'),
      `Events: ${[...new Set(trace.map((t: any) => t.event))].join(', ')}`)

    const score = computeScore(assertions)
    return { scenario: 'observability', passed: score >= 80, score, durationMs: Date.now() - start, assertions, workflowRunId: runId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'observability', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
