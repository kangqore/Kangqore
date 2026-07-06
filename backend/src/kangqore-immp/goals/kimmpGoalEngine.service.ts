// D9 — KimmpGoalEngine
// Continuous goal evaluation loop.
// Runs on a schedule (or can be triggered manually).
// For each active goal: builds context, evaluates whether action is needed,
// and if yes — plans + compiles + executes a workflow.

import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'
import { KimmpContextAssembler } from '../context/kimmpContextAssembler.service'
import { KimmpGoalPlanner } from '../planner/kimmpGoalPlanner.service'
import { KimmpWorkflowCompiler } from '../workflow/kimmpWorkflowCompiler.service'
import { KimmpExecutionEngine } from '../workflow/kimmpExecutionEngine.service'
import { sonnet, textOf } from '../llm/kimmpLLMRouter'

export interface GoalEvaluationResult {
  goalId:        string
  objective:     string
  needsAction:   boolean
  reasoning:     string
  workflowRunId?: string
  evaluatedAt:   Date
}

export class KimmpGoalEngine {

  // Evaluate a single goal: does it need autonomous action right now?
  static async evaluateGoal(goalId: string, actorUserId: string): Promise<GoalEvaluationResult> {
    const goal = await (prisma as any).kimmpGoal.findUnique({ where: { id: goalId } })
    if (!goal) throw new Error(`Goal ${goalId} not found`)

    const ctx = await KimmpContextAssembler.build({
      userId: actorUserId,
      goalId,
      skipGraph: true,
    })

    const ctxSummary = KimmpContextAssembler.summarise(ctx)

    const prompt = `You are KIMMP's Goal Engine evaluating whether autonomous action is needed.

Goal: "${goal.objective}"
Progress: ${goal.progressPct}%
Status: ${goal.status}
Deadline: ${goal.deadline ?? 'none'}

Current enterprise context:
${ctxSummary}

Recent goal evaluations suggest: evaluate honestly whether this goal needs an autonomous workflow to be triggered right now.

Return JSON: { "needsAction": true, "reasoning": "why action is or isn't needed" }`

    let needsAction = false
    let reasoning   = 'No action required at this time.'

    try {
      const res   = await sonnet('You are KIMMP Goal Engine.', prompt, 400, { agentType: 'GOAL_CHECK', tags: ['goal_engine'] })
      const raw   = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        needsAction = parsed.needsAction ?? false
        reasoning   = parsed.reasoning   ?? reasoning
      }
    } catch {}

    // Persist evaluation record
    const evaluation = await (prisma as any).kimmpGoalEvaluation.create({
      data: { goalId, needsAction, reasoning },
    }).catch(() => null)

    let workflowRunId: string | undefined

    if (needsAction) {
      logger.info(`[GOAL_ENGINE] Goal "${goal.objective}" needs action — launching workflow`)
      try {
        const plan     = await KimmpGoalPlanner.plan(goal.objective, ctx)
        const compiled = await KimmpWorkflowCompiler.compile(plan, ctx, 'GOAL_ENGINE')
        const result   = await KimmpExecutionEngine.run(compiled, ctx)
        workflowRunId  = result.runId

        // Update evaluation with run reference
        if (evaluation) {
          await (prisma as any).kimmpGoalEvaluation.update({
            where: { id: evaluation.id },
            data:  { workflowRunId: result.runId },
          }).catch(() => {})
        }

        // Update goal progress estimate
        await (prisma as any).kimmpGoal.update({
          where: { id: goalId },
          data:  { progressPct: Math.min(goal.progressPct + 5, 95) },
        }).catch(() => {})

      } catch (err) {
        logger.error(`[GOAL_ENGINE] Workflow failed for goal ${goalId}: ${err}`)
      }
    }

    return {
      goalId,
      objective:    goal.objective,
      needsAction,
      reasoning,
      workflowRunId,
      evaluatedAt:  new Date(),
    }
  }

  // Evaluate ALL active goals
  static async runCycle(actorUserId: string): Promise<GoalEvaluationResult[]> {
    const goals = await (prisma as any).kimmpGoal.findMany({
      where: { status: { in: ['ACTIVE', 'APPROVED', 'IN_PROGRESS'] } },
      select: { id: true, objective: true, progressPct: true, status: true },
    }).catch(() => [])

    logger.info(`[GOAL_ENGINE] Evaluating ${goals.length} active goals`)

    const results: GoalEvaluationResult[] = []
    for (const goal of goals) {
      try {
        const result = await KimmpGoalEngine.evaluateGoal(goal.id, actorUserId)
        results.push(result)
      } catch (err) {
        logger.warn(`[GOAL_ENGINE] Failed to evaluate goal ${goal.id}: ${err}`)
      }
    }
    return results
  }

  // Get recent evaluations
  static async getEvaluations(goalId?: string, limit = 20): Promise<any[]> {
    return (prisma as any).kimmpGoalEvaluation.findMany({
      where:   goalId ? { goalId } : {},
      orderBy: { evaluatedAt: 'desc' },
      take:    limit,
    }).catch(() => [])
  }
}
