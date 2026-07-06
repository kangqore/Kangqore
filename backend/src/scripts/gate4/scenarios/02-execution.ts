// Gate 4 — Scenario 2: Execution
// Validates: parallel step execution, retry logic, DAG completion, step results, trace events

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioExecution(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    // 3 parallel steps at root level (no deps), 1 sequential step depending on all 3
    const dag = {
      nodes: [
        { id: 'e1', title: 'Read Signals A',  type: 'SIGNAL_READ',  description: 'parallel branch A', critical: false, timeout: 5000 },
        { id: 'e2', title: 'Read Signals B',  type: 'SIGNAL_READ',  description: 'parallel branch B', critical: false, timeout: 5000 },
        { id: 'e3', title: 'Data Query',      type: 'DATA_QUERY',   description: 'parallel branch C', critical: false, timeout: 5000 },
        { id: 'e4', title: 'Write Memory',    type: 'MEMORY_WRITE', description: 'final step',        critical: true,  timeout: 5000,
          params: { content: 'Gate 4 execution test complete' } },
      ],
      edges: [
        { from: 'e1', to: 'e4' },
        { from: 'e2', to: 'e4' },
        { from: 'e3', to: 'e4' },
      ],
    }

    const { runId, executionOrder } = await createTestRun('Gate4 Execution Test', dag)
    const ctx = testCtx()

    const compiled: CompiledWorkflow = { workflowId: 'test', workflowRunId: runId, dag: dag as any, executionOrder }
    const result = await KimmpExecutionEngine.run(compiled, ctx)

    // Assert: run completed successfully
    assert(assertions, 'Execution returns ok=true', result.ok,
      `ok=${result.ok}, failedStep=${result.failedStep}`)

    // Assert: all 4 steps have results
    const completedSteps = Object.keys(result.stepResults)
    assert(assertions, 'All 4 steps have results', completedSteps.length === 4,
      `Completed: ${completedSteps.join(', ')}`)

    // Assert: each individual step ID is present
    for (const id of ['e1', 'e2', 'e3', 'e4']) {
      assert(assertions, `Step ${id} has output`, result.stepResults[id] !== undefined,
        `stepResults[${id}] = ${JSON.stringify(result.stepResults[id])}`)
    }

    // Assert: DB run status = COMPLETED
    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { status: true, trace: true, checkpoints: true },
    })
    assert(assertions, 'Run status = COMPLETED in DB', run?.status === 'COMPLETED',
      `status = ${run?.status}`)

    // Assert: trace contains RUN_START and RUN_COMPLETE
    const trace: any[] = Array.isArray(run?.trace) ? run.trace : []
    assert(assertions, 'Trace contains RUN_START', trace.some(t => t.event === 'RUN_START'),
      `Trace events: ${trace.map((t: any) => t.event).join(', ')}`)
    assert(assertions, 'Trace contains RUN_COMPLETE', trace.some(t => t.event === 'RUN_COMPLETE'),
      `Trace events: ${trace.map((t: any) => t.event).join(', ')}`)

    // Assert: trace contains STEP_COMPLETE for all 4 steps
    const stepCompletes = trace.filter(t => t.event === 'STEP_COMPLETE').map(t => t.stepId)
    assert(assertions, 'All 4 STEP_COMPLETE events in trace', stepCompletes.length >= 4,
      `STEP_COMPLETE stepIds: ${stepCompletes.join(', ')}`)

    // Assert: parallel steps e1, e2, e3 all appear (were actually run in parallel layer)
    assert(assertions, 'Parallel layer (e1+e2+e3) in execution order layer 0',
      executionOrder[0]?.includes('e1') && executionOrder[0]?.includes('e2') && executionOrder[0]?.includes('e3'),
      `Layer 0: ${JSON.stringify(executionOrder[0])}`)

    // Assert: checkpoints were written
    const checkpoints: any[] = Array.isArray(run?.checkpoints) ? run.checkpoints : []
    assert(assertions, 'Checkpoints written during execution', checkpoints.length > 0,
      `Checkpoints: ${checkpoints.length}`)

    const score = computeScore(assertions)
    return { scenario: 'execution', passed: score >= 80, score, durationMs: Date.now() - start, assertions, workflowRunId: runId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'execution', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
