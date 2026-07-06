// Gate 4 — Scenario 1: Planning
// Validates: goal decomposition, DAG generation, topological sort, parallel layers, critical path

import { assert, computeScore, createTestRun, testCtx, type Assertion, type ScenarioResult } from '../scenarioHelpers'
import { KimmpWorkflowCompiler } from '../../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'
import type { GoalPlan } from '../../../kangqore-immp/planner/kimmpGoalPlanner.service'

export async function scenarioPlanning(): Promise<ScenarioResult> {
  const start = Date.now()
  const assertions: Assertion[] = []

  try {
    // Build a GoalPlan with a diamond dependency structure:
    //   s1 → s2, s3 → s4  (s2 and s3 run in parallel, s4 waits for both)
    const plan: GoalPlan = {
      goal:   'Gate 4 Planning Test',
      intent: 'Validate DAG compilation and topological sort',
      confidence: 1.0,
      estimatedDurationMs: 5000,
      steps: [
        { id: 's1', title: 'Signal Read',  type: 'SIGNAL_READ', description: 'Read signals',      dependencies: [],        critical: false, timeout: 5000, agentHint: undefined, platform: undefined, action: undefined },
        { id: 's2', title: 'Analyze A',    type: 'DATA_QUERY',  description: 'Analyze branch A',  dependencies: ['s1'],    critical: false, timeout: 5000, agentHint: undefined, platform: undefined, action: undefined },
        { id: 's3', title: 'Analyze B',    type: 'DATA_QUERY',  description: 'Analyze branch B',  dependencies: ['s1'],    critical: false, timeout: 5000, agentHint: undefined, platform: undefined, action: undefined },
        { id: 's4', title: 'Write Memory', type: 'MEMORY_WRITE', description: 'Record findings',   dependencies: ['s2', 's3'], critical: true, timeout: 5000, params: { content: 'Gate 4 planning test' }, agentHint: undefined, platform: undefined, action: undefined },
      ],
    }

    const ctx = testCtx()
    const compiled = await KimmpWorkflowCompiler.compile(plan, ctx, 'gate4-test')

    // Assert: DAG has 4 nodes
    assert(assertions, 'DAG has correct node count', compiled.dag.nodes.length === 4,
      `Expected 4 nodes, got ${compiled.dag.nodes.length}`)

    // Assert: DAG has 3 edges (s1→s2, s1→s3, s2→s4, s3→s4) = 4 edges
    assert(assertions, 'DAG has correct edge count', compiled.dag.edges.length === 4,
      `Expected 4 edges, got ${compiled.dag.edges.length}`)

    // Assert: execution order has 3 layers: [s1], [s2, s3], [s4]
    assert(assertions, 'Topological sort produces 3 layers', compiled.executionOrder.length === 3,
      `Expected 3 layers, got ${compiled.executionOrder.length}: ${JSON.stringify(compiled.executionOrder)}`)

    // Assert: layer 0 contains only s1
    assert(assertions, 'Layer 0 is s1 (no dependencies)', compiled.executionOrder[0]?.includes('s1'),
      `Layer 0: ${JSON.stringify(compiled.executionOrder[0])}`)

    // Assert: layer 1 contains s2 and s3 (parallel)
    const layer1 = compiled.executionOrder[1] ?? []
    assert(assertions, 'Layer 1 has s2 and s3 in parallel', layer1.includes('s2') && layer1.includes('s3'),
      `Layer 1: ${JSON.stringify(layer1)}`)

    // Assert: layer 2 contains s4 (depends on s2+s3)
    assert(assertions, 'Layer 2 is s4 (waits for both branches)', compiled.executionOrder[2]?.includes('s4'),
      `Layer 2: ${JSON.stringify(compiled.executionOrder[2])}`)

    // Assert: critical path node s4 is marked critical
    const s4 = compiled.dag.nodes.find(n => n.id === 's4')
    assert(assertions, 'Critical path node s4 has critical=true', s4?.critical === true,
      `s4.critical = ${s4?.critical}`)

    // Assert: workflow and run records persisted
    assert(assertions, 'Workflow persisted to DB', !!compiled.workflowId,
      `workflowId = ${compiled.workflowId}`)
    assert(assertions, 'Workflow run created with PENDING status', !!compiled.workflowRunId,
      `runId = ${compiled.workflowRunId}`)

    // Verify run status in DB
    const run = await (require('../../../lib/prisma').prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: compiled.workflowRunId }, select: { status: true },
    })
    assert(assertions, 'Run status is PENDING after compile', run?.status === 'PENDING',
      `status = ${run?.status}`)

    const score = computeScore(assertions)
    return { scenario: 'planning', passed: score >= 80, score, durationMs: Date.now() - start, assertions, workflowRunId: compiled.workflowRunId }

  } catch (err: any) {
    assertions.push({ name: 'Scenario completed without crash', passed: false, detail: err.message })
    return { scenario: 'planning', passed: false, score: 0, durationMs: Date.now() - start, assertions }
  }
}
