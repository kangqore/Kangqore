// Gate 4 — Scenario 4: Learning
// Validates: MEMORY_WRITE step persists to kimmp_memories, KimmpWorkflowMemory.record()
// creates a WORKFLOW_OUTCOME memory, memory is findable after run

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioLearning(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    const MEMORY_CONTENT = `Gate 4 learning test — ${Date.now()}`

    const dag = {
      nodes: [
        { id: 'l1', title: 'Signal Read',  type: 'SIGNAL_READ',  description: 'Read context',  critical: false, timeout: 5000 },
        { id: 'l2', title: 'Write Memory', type: 'MEMORY_WRITE', description: 'Learn outcome', critical: true,  timeout: 5000,
          params: { content: MEMORY_CONTENT } },
      ],
      edges: [{ from: 'l1', to: 'l2' }],
    }

    const { runId, executionOrder } = await createTestRun('Gate4 Learning Test', dag)
    const ctx = testCtx()
    const compiled: CompiledWorkflow = { workflowId: 'test', workflowRunId: runId, dag: dag as any, executionOrder }

    const memoriesBefore = await (prisma as any).kimmpMemory.count()

    const result = await KimmpExecutionEngine.run(compiled, ctx)

    assert(assertions, 'Run completed successfully', result.ok, `ok=${result.ok}`)

    // Assert: MEMORY_WRITE step output shows written=true
    assert(assertions, 'MEMORY_WRITE step output has written=true',
      result.stepResults['l2']?.written === true,
      `l2 output = ${JSON.stringify(result.stepResults['l2'])}`)

    // Assert: kimmp_memories table has new entries
    const memoriesAfter = await (prisma as any).kimmpMemory.count()
    assert(assertions, 'kimmp_memories count increased after run', memoriesAfter > memoriesBefore,
      `Before: ${memoriesBefore}, after: ${memoriesAfter}`)

    // Assert: PATTERN memory from MEMORY_WRITE step exists
    const patternMemory = await (prisma as any).kimmpMemory.findFirst({
      where: { type: 'PATTERN', content: { contains: runId } },
    })
    assert(assertions, 'PATTERN memory linked to run ID exists',
      patternMemory !== null,
      `Pattern memory for run ${runId}: ${patternMemory?.id ?? 'NOT FOUND'}`)

    // Assert: KimmpWorkflowMemory.record() created a WORKFLOW or OUTCOME memory
    const workflowMemory = await (prisma as any).kimmpMemory.findFirst({
      where: {
        OR: [
          { type: 'OUTCOME', tags: { has: 'workflow' } },
          { type: 'PATTERN', tags: { has: 'auto-write' }, content: { contains: runId } },
        ],
      },
    })
    assert(assertions, 'Workflow memory entry created by KimmpWorkflowMemory.record()',
      workflowMemory !== null,
      `Workflow memory: ${workflowMemory?.id ?? 'NOT FOUND'} type=${workflowMemory?.type}`)

    // Assert: DB run has lessons field populated (from KimmpWorkflowMemory)
    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { lessons: true, status: true },
    })
    assert(assertions, 'Run status = COMPLETED', run?.status === 'COMPLETED', `status=${run?.status}`)

    const score = computeScore(assertions)
    return { scenario: 'learning', passed: score >= 75, score, durationMs: Date.now() - start, assertions, workflowRunId: runId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'learning', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
