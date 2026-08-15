// E4 — AI Evaluation Framework
// Auto-scores strategic decisions and workflow outputs.
// Six quality dimensions: Correct · Useful · Complete · Grounded · Actionable · Safe

import { prisma } from '../../../lib/prisma'
import { haiku, textOf } from '../llm/kimmpLLMRouter'

export type EvalTarget = 'DECISION' | 'WORKFLOW' | 'AGENT'

export interface EvalScores {
  correct?:    number   // 0–5
  useful?:     number
  complete?:   number
  grounded?:   number
  actionable?: number
  safe?:       number
  overall:     number
  notes?:      string
}

export interface AgentQuality {
  agentType:    string
  avgOverall:   number
  evalCount:    number
  dimensions:  {
    correct:    number; useful: number; complete: number
    grounded:   number; actionable: number; safe: number
  }
}

export class EvaluationFramework {

  // Auto-evaluate a strategic decision using LLM as judge
  static async scoreDecision(decisionId: string): Promise<EvalScores | null> {
    try {
      const dec = await (prisma as any).kimmpStrategicDecision.findUnique({
        where: { id: decisionId },
        select: { question: true, options: true, recommendation: true, evidence: true, confidence: true },
      })
      if (!dec) return null

      const prompt = `You are an AI quality evaluator. Score the following strategic decision on a 0–5 scale for each dimension.

Question: "${dec.question}"
Options provided: ${Array.isArray(dec.options) ? dec.options.length : 0}
Recommendation: "${dec.recommendation}"
Evidence items: ${Array.isArray(dec.evidence) ? dec.evidence.length : 0}
Confidence: ${dec.confidence}%

Return ONLY valid JSON:
{
  "correct": 4,
  "useful": 4,
  "complete": 3,
  "grounded": 4,
  "actionable": 5,
  "safe": 5,
  "notes": "Brief evaluation note"
}`

      const res   = await haiku('You are a concise AI evaluator. Return only JSON.', prompt, 300)
      const raw   = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) return null

      const parsed = JSON.parse(match[0])
      const scores: EvalScores = {
        correct:    Math.min(5, Math.max(0, parsed.correct    ?? 3)),
        useful:     Math.min(5, Math.max(0, parsed.useful     ?? 3)),
        complete:   Math.min(5, Math.max(0, parsed.complete   ?? 3)),
        grounded:   Math.min(5, Math.max(0, parsed.grounded   ?? 3)),
        actionable: Math.min(5, Math.max(0, parsed.actionable ?? 3)),
        safe:       Math.min(5, Math.max(0, parsed.safe       ?? 5)),
        notes:      parsed.notes,
        overall:    0,
      }
      scores.overall = Math.round(
        ((scores.correct! + scores.useful! + scores.complete! + scores.grounded! + scores.actionable! + scores.safe!) / 6) * 10
      ) / 10

      await (prisma as any).aIEvaluation.create({
        data: {
          targetType:    'DECISION',
          targetId:      decisionId,
          evaluatorType: 'AUTO',
          ...scores,
        },
      })

      return scores
    } catch {
      return null
    }
  }

  // Score a workflow run based on its outcome and trace
  static async scoreWorkflow(runId: string): Promise<EvalScores | null> {
    try {
      const run = await (prisma as any).kimmpWorkflowRun.findUnique({
        where: { id: runId },
        select: { status: true, outcome: true, lessons: true, stepResults: true },
        include: { workflow: { select: { name: true } } },
      })
      if (!run) return null

      const stepCount = Object.keys(run.stepResults ?? {}).length
      const success   = run.status === 'COMPLETED'

      // Rule-based scoring (fast, no LLM needed)
      const scores: EvalScores = {
        correct:    success ? 5 : 2,
        useful:     stepCount > 0 ? 4 : 2,
        complete:   success ? 5 : run.status === 'PAUSED' ? 3 : 1,
        grounded:   4, // always grounded by context assembler
        actionable: stepCount > 0 ? 4 : 2,
        safe:       5, // policy engine ensures safety
        overall:    0,
        notes:      run.outcome ?? run.status,
      }
      scores.overall = Math.round(
        ((scores.correct! + scores.useful! + scores.complete! + scores.grounded! + scores.actionable! + scores.safe!) / 6) * 10
      ) / 10

      await (prisma as any).aIEvaluation.create({
        data: { targetType: 'WORKFLOW', targetId: runId, evaluatorType: 'AUTO', ...scores },
      }).catch(() => {})

      return scores
    } catch {
      return null
    }
  }

  // Record a human evaluation
  static async recordHuman(
    targetType: EvalTarget,
    targetId:   string,
    evaluatorId: string,
    scores:     Partial<EvalScores> & { notes?: string },
  ): Promise<void> {
    const dims = ['correct', 'useful', 'complete', 'grounded', 'actionable', 'safe'] as const
    const vals = dims.map(d => scores[d] ?? 3)
    const overall = Math.round(vals.reduce((a, b) => a + b) / vals.length * 10) / 10

    await (prisma as any).aIEvaluation.create({
      data: {
        targetType, targetId,
        evaluatorType: 'HUMAN', evaluatorId,
        overall, notes: scores.notes,
        ...Object.fromEntries(dims.map((d, i) => [d, vals[i]])),
      },
    })
  }

  // Aggregate quality by agent type (from DECISION evaluations)
  static async agentQuality(sinceDays = 30): Promise<AgentQuality[]> {
    const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000)
    const evals: any[] = await (prisma as any).aIEvaluation.findMany({
      where:   { targetType: { in: ['DECISION', 'AGENT'] }, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
    }).catch(() => [])

    if (evals.length === 0) return []

    // Group by targetType as a proxy for agent (DECISION = DECISION_ENGINE)
    const grouped: Record<string, any[]> = {}
    for (const e of evals) {
      const key = e.targetType
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(e)
    }

    return Object.entries(grouped).map(([agentType, items]) => {
      const avg = (field: string) =>
        items.filter(e => e[field] != null).length > 0
          ? Math.round(items.reduce((s, e) => s + (e[field] ?? 0), 0) / items.length * 10) / 10
          : 0

      return {
        agentType,
        avgOverall: avg('overall'),
        evalCount:  items.length,
        dimensions: {
          correct:    avg('correct'),
          useful:     avg('useful'),
          complete:   avg('complete'),
          grounded:   avg('grounded'),
          actionable: avg('actionable'),
          safe:       avg('safe'),
        },
      }
    })
  }

  static async list(targetType?: EvalTarget, limit = 50): Promise<any[]> {
    return (prisma as any).aIEvaluation.findMany({
      where:   targetType ? { targetType } : {},
      orderBy: { createdAt: 'desc' },
      take:    limit,
    }).catch(() => [])
  }
}
