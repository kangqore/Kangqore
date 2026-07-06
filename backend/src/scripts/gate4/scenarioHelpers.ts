// Shared helpers for Gate 4 scenario tests

import { prisma } from '../../lib/prisma'
import type { EnterpriseContext } from '../../kangqore-immp/context/kimmpContextAssembler.service'
import type { WorkflowDAG } from '../../kangqore-immp/workflow/kimmpWorkflowCompiler.service'

export interface Assertion {
  name:   string
  passed: boolean
  detail: string
}

export interface ScenarioResult {
  scenario:      string
  passed:        boolean
  score:         number
  durationMs:    number
  assertions:    Assertion[]
  workflowRunId?: string
}

// Minimal valid EnterpriseContext for test scenarios
export function testCtx(userId = 'gate4-test'): EnterpriseContext {
  return {
    currentTime:  new Date(),
    userId,
    userProfile:  { id: userId, email: 'gate4@test.local', role: 'ADMIN' },
    signals:      [],
    goals:        [],
    graph:        { objects: [], relationships: [] },
    decisions:    [],
    policies:     [],
    integrations: [],
    memories:     [],
    riskProfile:  { atRiskClients: 0, unhealthyProjects: 0, overdueInvoices: 0, openRisks: 0, criticalSignals: 0 },
  } as any
}

// Create a KimmpWorkflow + KimmpWorkflowRun in DB and return the run + compiled info
export async function createTestRun(
  name: string,
  dag: WorkflowDAG,
  userId = 'gate4-test',
): Promise<{ workflowId: string; runId: string; executionOrder: string[][] }> {
  // Topological sort — derive parallel layers from edges
  const inDegree = new Map<string, number>()
  const adjList  = new Map<string, string[]>()
  for (const n of dag.nodes) { inDegree.set(n.id, 0); adjList.set(n.id, []) }
  for (const e of dag.edges) {
    adjList.set(e.from, [...(adjList.get(e.from) ?? []), e.to])
    inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1)
  }

  const layers: string[][] = []
  let remaining = new Set(dag.nodes.map(n => n.id))
  while (remaining.size > 0) {
    const layer = [...remaining].filter(id => (inDegree.get(id) ?? 0) === 0)
    if (layer.length === 0) break
    layers.push(layer)
    for (const id of layer) {
      remaining.delete(id)
      for (const next of adjList.get(id) ?? []) inDegree.set(next, (inDegree.get(next) ?? 1) - 1)
    }
  }

  const workflow = await (prisma as any).kimmpWorkflow.create({
    data: { name, dag, trigger: 'MANUAL', createdBy: userId, status: 'ACTIVE' },
  })

  const run = await (prisma as any).kimmpWorkflowRun.create({
    data: {
      workflowId:      workflow.id,
      triggeredBy:     userId,
      status:          'PENDING',
      contextSnapshot: {},
      stepResults:     {},
      trace:           [],
      checkpoints:     [],
    },
  })

  return { workflowId: workflow.id, runId: run.id, executionOrder: layers }
}

// Score a list of assertions: 0–100 based on pass ratio
export function computeScore(assertions: Assertion[]): number {
  if (!assertions.length) return 0
  return Math.round((assertions.filter(a => a.passed).length / assertions.length) * 100)
}

// Assert helper
export function assert(assertions: Assertion[], name: string, condition: boolean, detail: string) {
  assertions.push({ name, passed: condition, detail })
}
