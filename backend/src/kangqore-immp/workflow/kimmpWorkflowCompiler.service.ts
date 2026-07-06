// D3 — WorkflowCompiler
// Turns a GoalPlan into a persisted KimmpWorkflow (DAG) + creates a KimmpWorkflowRun.
// The DAG is stored as JSON so it can be replayed, inspected, and versioned.

import { prisma } from '../../lib/prisma'
import { GoalPlan } from '../planner/kimmpGoalPlanner.service'
import { EnterpriseContext } from '../context/kimmpContextAssembler.service'

export interface WorkflowNode {
  id:           string
  title:        string
  type:         string
  description:  string
  agentHint?:   string
  platform?:    string
  action?:      string
  params?:      Record<string, any>
  critical:     boolean
  timeout:      number
}

export interface WorkflowEdge {
  from: string   // step id
  to:   string   // step id
}

export interface WorkflowDAG {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export interface CompiledWorkflow {
  workflowId:    string
  workflowRunId: string
  dag:           WorkflowDAG
  executionOrder: string[][]  // topologically sorted layers (parallel batches)
}

export class KimmpWorkflowCompiler {

  // Topological sort → returns layers of step ids that can run in parallel
  static topoSort(plan: GoalPlan): string[][] {
    const inDegree = new Map<string, number>()
    const adjList  = new Map<string, string[]>()

    for (const step of plan.steps) {
      if (!inDegree.has(step.id)) inDegree.set(step.id, 0)
      if (!adjList.has(step.id))  adjList.set(step.id, [])
    }

    for (const step of plan.steps) {
      for (const dep of step.dependencies) {
        const existing = adjList.get(dep) ?? []
        existing.push(step.id)
        adjList.set(dep, existing)
        inDegree.set(step.id, (inDegree.get(step.id) ?? 0) + 1)
      }
    }

    const layers: string[][] = []
    let remaining = new Set(plan.steps.map(s => s.id))

    while (remaining.size > 0) {
      const layer = [...remaining].filter(id => (inDegree.get(id) ?? 0) === 0)
      if (layer.length === 0) break // cycle guard
      layers.push(layer)
      for (const id of layer) {
        remaining.delete(id)
        for (const next of adjList.get(id) ?? []) {
          inDegree.set(next, (inDegree.get(next) ?? 1) - 1)
        }
      }
    }

    return layers
  }

  static async compile(
    plan:        GoalPlan,
    ctx:         EnterpriseContext,
    triggeredBy: string,
  ): Promise<CompiledWorkflow> {
    const dag: WorkflowDAG = {
      nodes: plan.steps.map(s => ({
        id:          s.id,
        title:       s.title,
        type:        s.type,
        description: s.description,
        agentHint:   s.agentHint,
        platform:    s.platform,
        action:      s.action,
        params:      s.params ?? {},
        critical:    s.critical,
        timeout:     s.timeout ?? 30_000,
      })),
      edges: plan.steps.flatMap(s =>
        s.dependencies.map(dep => ({ from: dep, to: s.id }))
      ),
    }

    const executionOrder = KimmpWorkflowCompiler.topoSort(plan)

    // Persist workflow definition
    const workflow = await (prisma as any).kimmpWorkflow.create({
      data: {
        name:      plan.goal.slice(0, 120),
        description: plan.intent,
        goalId:    ctx.goalId ?? null,
        trigger:   ctx.goalId ? 'GOAL' : 'MANUAL',
        dag,
        createdBy: ctx.userId,
      },
    })

    // Persist execution record (context snapshot stripped to essentials for size)
    const contextSnapshot = {
      signals:     ctx.signals.slice(0, 5),
      goals:       ctx.goals.slice(0, 5),
      riskProfile: ctx.riskProfile,
      currentTime: ctx.currentTime,
    }

    const run = await (prisma as any).kimmpWorkflowRun.create({
      data: {
        workflowId:      workflow.id,
        goalId:          ctx.goalId ?? null,
        triggeredBy,
        status:          'PENDING',
        contextSnapshot,
        stepResults:     {},
        trace:           [{ ts: new Date(), event: 'COMPILED', data: { plan: plan.intent } }],
      },
    })

    return {
      workflowId:     workflow.id,
      workflowRunId:  run.id,
      dag,
      executionOrder,
    }
  }
}
