// D7 — KimmpWorkflowMemory
// Every workflow execution stores structured lessons.
// Future planners and the Goal Engine read these to improve planning quality.

import { prisma } from '../../lib/prisma'
import { sonnet, textOf } from '../llm/kimmpLLMRouter'

export interface WorkflowLesson {
  runId:     string
  status:    string
  stepCount: number
  lessons:   string
  patterns:  string[]
  createdAt: Date
}

export class KimmpWorkflowMemory {

  static async record(
    runId:       string,
    stepResults: Record<string, any>,
    status:      string,
  ): Promise<void> {
    try {
      const run = await (prisma as any).kimmpWorkflowRun.findUnique({
        where:   { id: runId },
        include: { workflow: true },
      })
      if (!run) return

      const resultSummary = Object.entries(stepResults)
        .map(([stepId, result]) => `${stepId}: ${JSON.stringify(result).slice(0, 100)}`)
        .join('\n')

      const prompt = `A KIMMP autonomous workflow just completed with status: ${status}.

Workflow: "${run.workflow?.name}"
Steps completed: ${Object.keys(stepResults).length}
Step results:
${resultSummary.slice(0, 600)}

Extract 1-3 concise lessons and patterns that future planners should know.
Return JSON: { "lessons": "concise paragraph", "patterns": ["pattern 1", "pattern 2"] }`

      let lessons  = `Workflow "${run.workflow?.name}" completed with status ${status}.`
      let patterns: string[] = []

      const res   = await sonnet('You are KIMMP memory engine.', prompt, 400, { agentType: 'MEMORY_WRITE', tags: ['workflow'] })
      const raw   = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        lessons  = parsed.lessons  ?? lessons
        patterns = parsed.patterns ?? []
      }

      // Write to workflow run record
      await (prisma as any).kimmpWorkflowRun.update({
        where: { id: runId },
        data:  { lessons, outcome: status },
      })

      // Write to KIMMP memory store
      await (prisma as any).kimmpMemory.create({
        data: {
          type:    'LESSON',
          content: `[Workflow: ${run.workflow?.name}] ${lessons}`,
          tags:    ['workflow', status.toLowerCase(), ...patterns.slice(0, 3)],
        },
      })

    } catch {}
  }

  static async getRecentLessons(limit = 10): Promise<WorkflowLesson[]> {
    try {
      const runs = await (prisma as any).kimmpWorkflowRun.findMany({
        where:   { lessons: { not: null } },
        orderBy: { completedAt: 'desc' },
        take:    limit,
        select:  { id: true, status: true, lessons: true, stepResults: true, startedAt: true },
        include: { workflow: { select: { name: true } } },
      })
      return runs.map((r: any) => ({
        runId:     r.id,
        status:    r.status,
        stepCount: Object.keys(r.stepResults ?? {}).length,
        lessons:   r.lessons ?? '',
        patterns:  [],
        createdAt: r.startedAt,
      }))
    } catch {
      return []
    }
  }
}
