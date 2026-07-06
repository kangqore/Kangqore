// WAOE — WAANDA Autonomous Operations Engine
// The central entry point for autonomous goal execution.
// Orchestrates: Context → Plan → Compile → Execute → Monitor → Learn

import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'
import { KimmpContextAssembler } from '../context/kimmpContextAssembler.service'
import { KimmpGoalPlanner } from '../planner/kimmpGoalPlanner.service'
import { KimmpWorkflowCompiler } from '../workflow/kimmpWorkflowCompiler.service'
import { KimmpExecutionEngine } from '../workflow/kimmpExecutionEngine.service'
import { KimmpAgentCoordinator, SpecialistAgent } from '../agents/kimmpAgentCoordinator.service'
import { KimmpGoalEngine } from '../goals/kimmpGoalEngine.service'
import { KimmpCollaboration, CommentType } from '../workflow/kimmpCollaboration.service'
import { KimmpWorkflowMemory } from '../workflow/kimmpWorkflowMemory.service'
import { KimmpTrace } from '../observability/kimmpTrace.service'

export interface WAOERunRequest {
  goal:          string
  userId:        string
  goalId?:       string
  organizationId?: string
  // Optional multi-agent coordination before planning
  coordinateAgents?: SpecialistAgent[]
  // Direct execution without compilation (quick run)
  quick?: boolean
}

export interface WAOERunResult {
  ok:            boolean
  workflowId?:   string
  runId?:        string
  plan?:         any
  coordination?: any
  stepResults?:  Record<string, any>
  paused?:       boolean
  failedStep?:   string
  summary:       string
  durationMs:    number
}

export class WAOE {
  static readonly VERSION = '1.0.0'
  static readonly NAME    = 'WAANDA Autonomous Operations Engine'

  // ── Main entry: goal → plan → compile → execute ───────────────────────────
  static async run(req: WAOERunRequest): Promise<WAOERunResult> {
    const start = Date.now()
    logger.info(`[WAOE] Starting: "${req.goal.slice(0, 80)}" for user=${req.userId}`)

    // D1: Build enterprise context
    const ctx = await KimmpContextAssembler.build({
      userId:         req.userId,
      organizationId: req.organizationId,
      goalId:         req.goalId,
    })

    // D5: Optional multi-agent coordination before planning
    let coordination: any
    if (req.coordinateAgents?.length) {
      coordination = await KimmpAgentCoordinator.coordinate(req.coordinateAgents, req.goal, ctx)
    }

    // D2: Plan
    const plan = await KimmpGoalPlanner.plan(req.goal, ctx)

    // D3: Compile to DAG
    const compiled = await KimmpWorkflowCompiler.compile(plan, ctx, req.userId)

    // D4: Execute
    const result = await KimmpExecutionEngine.run(compiled, ctx)

    const durationMs = Date.now() - start
    logger.info(`[WAOE] Done: ${result.ok ? 'OK' : 'FAILED'} — ${durationMs}ms`)

    return {
      ok:           result.ok,
      workflowId:   compiled.workflowId,
      runId:        result.runId,
      plan,
      coordination,
      stepResults:  result.stepResults,
      paused:       result.paused,
      failedStep:   result.failedStep,
      summary:      result.ok
        ? `Completed ${Object.keys(result.stepResults ?? {}).length} steps`
        : `Failed at step: ${result.failedStep}`,
      durationMs,
    }
  }

  // ── Goal Engine: evaluate all active goals ────────────────────────────────
  static async runGoalCycle(actorUserId: string) {
    return KimmpGoalEngine.runCycle(actorUserId)
  }

  static async evaluateGoal(goalId: string, actorUserId: string) {
    return KimmpGoalEngine.evaluateGoal(goalId, actorUserId)
  }

  // ── Workflow management ───────────────────────────────────────────────────
  static async listWorkflows(limit = 20) {
    return (prisma as any).kimmpWorkflow.findMany({
      where:   { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take:    limit,
      include: { runs: { take: 1, orderBy: { startedAt: 'desc' }, select: { id: true, status: true, startedAt: true, completedAt: true } } },
    }).catch(() => [])
  }

  static async getWorkflow(id: string) {
    return (prisma as any).kimmpWorkflow.findUnique({
      where:   { id },
      include: { runs: { orderBy: { startedAt: 'desc' }, take: 10, select: { id: true, status: true, startedAt: true, completedAt: true, failedAt: true, outcome: true } } },
    }).catch(() => null)
  }

  // ── Run management ────────────────────────────────────────────────────────
  static async listRuns(workflowId?: string, limit = 20) {
    return (prisma as any).kimmpWorkflowRun.findMany({
      where:   workflowId ? { workflowId } : {},
      orderBy: { startedAt: 'desc' },
      take:    limit,
      select:  { id: true, workflowId: true, status: true, triggeredBy: true, currentStep: true, startedAt: true, completedAt: true, failedAt: true, outcome: true, retryCount: true },
      include: { workflow: { select: { name: true } } },
    }).catch(() => [])
  }

  static async getRun(id: string) {
    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where:   { id },
      include: {
        workflow: { select: { id: true, name: true, dag: true } },
        comments: { orderBy: { createdAt: 'asc' } },
      },
    }).catch(() => null)

    if (!run) return null

    const traceSummary = KimmpTrace.summarise(Array.isArray(run.trace) ? run.trace : [])
    return { ...run, traceSummary }
  }

  // ── Resume a paused run after human approval ─────────────────────────────
  static async approveAndResume(runId: string, userId: string, note?: string) {
    await KimmpCollaboration.approve(runId, userId, note)
    const ctx = await KimmpContextAssembler.build({ userId })
    await KimmpExecutionEngine.resume(runId, ctx)
    return { resumed: true, runId }
  }

  // ── Human collaboration ───────────────────────────────────────────────────
  static async addComment(runId: string, userId: string, content: string, type: CommentType = 'COMMENT') {
    return KimmpCollaboration.addComment(runId, userId, content, type)
  }

  static async rejectRun(runId: string, userId: string, reason: string) {
    return KimmpCollaboration.reject(runId, userId, reason)
  }

  // ── Memory ────────────────────────────────────────────────────────────────
  static async getRecentLessons(limit = 10) {
    return KimmpWorkflowMemory.getRecentLessons(limit)
  }

  // ── Goal evaluations ──────────────────────────────────────────────────────
  static async getGoalEvaluations(goalId?: string, limit = 20) {
    return KimmpGoalEngine.getEvaluations(goalId, limit)
  }

  // ── Status ────────────────────────────────────────────────────────────────
  static async status() {
    const [activeRuns, totalWorkflows, totalRuns, recentEvals] = await Promise.all([
      (prisma as any).kimmpWorkflowRun.count({ where: { status: { in: ['RUNNING', 'PAUSED'] } } }).catch(() => 0),
      (prisma as any).kimmpWorkflow.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
      (prisma as any).kimmpWorkflowRun.count().catch(() => 0),
      (prisma as any).kimmpGoalEvaluation.count({ where: { needsAction: true } }).catch(() => 0),
    ])
    return {
      engine:         WAOE.NAME,
      version:        WAOE.VERSION,
      activeRuns,
      totalWorkflows,
      totalRuns,
      recentActionableEvals: recentEvals,
    }
  }
}
