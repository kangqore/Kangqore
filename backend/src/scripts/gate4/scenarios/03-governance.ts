// Gate 4 — Scenario 3: Human Governance
// Validates: APPROVAL_GATE pauses run, approve resumes correctly, trace records transition

import { prisma } from '../../../lib/prisma'
import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpExecutionEngine } from '../../../kangqore-immp/workflow/kimmpExecutionEngine.service'
import type { CompiledWorkflow } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export async function scenarioGovernance(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    // Workflow: step before gate → APPROVAL_GATE → step after gate
    const dag = {
      nodes: [
        { id: 'g1', title: 'Pre-approval work',  type: 'SIGNAL_READ',   description: 'Read state before approval', critical: false, timeout: 5000 },
        { id: 'g2', title: 'Human Approval Gate', type: 'APPROVAL_GATE', description: 'Requires human approval',    critical: false, timeout: 0 },
        { id: 'g3', title: 'Post-approval work',  type: 'MEMORY_WRITE',  description: 'Continue after approval',   critical: true,  timeout: 5000,
          params: { content: 'Gate 4 governance test: approved' } },
      ],
      edges: [{ from: 'g1', to: 'g2' }, { from: 'g2', to: 'g3' }],
    }

    const { runId, executionOrder } = await createTestRun('Gate4 Governance Test', dag)
    const ctx = testCtx()
    const compiled: CompiledWorkflow = { workflowId: 'test', workflowRunId: runId, dag: dag as any, executionOrder }

    // ── Phase 1: Execute → should pause at APPROVAL_GATE ───────────────────
    const runResult = await KimmpExecutionEngine.run(compiled, ctx)

    assert(assertions, 'Run pauses at APPROVAL_GATE', runResult.paused === true,
      `paused=${runResult.paused}, ok=${runResult.ok}`)

    const pausedRun = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { status: true, currentStep: true, trace: true },
    })
    assert(assertions, 'DB status = PAUSED after APPROVAL_GATE', pausedRun?.status === 'PAUSED',
      `status = ${pausedRun?.status}`)

    assert(assertions, 'currentStep points to APPROVAL_GATE (g2)', pausedRun?.currentStep === 'g2',
      `currentStep = ${pausedRun?.currentStep}`)

    // Assert: trace has APPROVAL_WAIT event
    const trace1: any[] = Array.isArray(pausedRun?.trace) ? pausedRun.trace : []
    assert(assertions, 'Trace contains APPROVAL_WAIT', trace1.some(t => t.event === 'APPROVAL_WAIT'),
      `Trace: ${trace1.map((t: any) => t.event).join(', ')}`)

    // Assert: g1 completed before pause
    assert(assertions, 'Pre-approval step g1 completed before pause',
      runResult.stepResults['g1'] !== undefined,
      `g1 result = ${JSON.stringify(runResult.stepResults['g1'])}`)

    // Assert: g3 NOT yet in stepResults (not run yet)
    assert(assertions, 'Post-approval step g3 not yet executed',
      runResult.stepResults['g3'] === undefined,
      `g3 was already in stepResults (should not be)`)

    // ── Phase 2: Approve → should complete ────────────────────────────────
    await KimmpExecutionEngine.resume(runId, ctx)

    const completedRun = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { status: true, stepResults: true, trace: true },
    })
    assert(assertions, 'DB status = COMPLETED after resume', completedRun?.status === 'COMPLETED',
      `status = ${completedRun?.status}`)

    // Assert: g3 now in stepResults
    const stepResults = (completedRun?.stepResults as any) ?? {}
    assert(assertions, 'Post-approval step g3 executed after resume', stepResults['g3'] !== undefined,
      `stepResults keys: ${Object.keys(stepResults).join(', ')}`)

    // Assert: trace has APPROVAL_RECEIVED
    const trace2: any[] = Array.isArray(completedRun?.trace) ? completedRun.trace : []
    assert(assertions, 'Trace contains APPROVAL_RECEIVED', trace2.some(t => t.event === 'APPROVAL_RECEIVED'),
      `Trace: ${trace2.map((t: any) => t.event).join(', ')}`)

    const score = computeScore(assertions)
    return { scenario: 'governance', passed: score >= 80, score, durationMs: Date.now() - start, assertions, workflowRunId: runId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'governance', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
