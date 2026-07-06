// D2 — KimmpGoalPlanner
// Decomposes a goal or question into a structured Plan with typed steps.
// The Plan is then compiled by WorkflowCompiler into an executable DAG.

import { sonnet, textOf } from '../llm/kimmpLLMRouter'
import { EnterpriseContext, KimmpContextAssembler } from '../context/kimmpContextAssembler.service'

export type StepType =
  | 'SIGNAL_READ'
  | 'DATA_QUERY'
  | 'AGENT_INVOKE'
  | 'DECISION'
  | 'APPROVAL_GATE'
  | 'EXTERNAL_API'
  | 'NOTIFY'
  | 'MEMORY_WRITE'
  | 'GOAL_UPDATE'
  | 'WAIT'

export interface PlanStep {
  id:           string           // step-1, step-2 ...
  title:        string
  type:         StepType
  description:  string
  agentHint?:   string           // which KIMMP agent to invoke
  platform?:    string           // for EXTERNAL_API steps
  action?:      string           // for EXTERNAL_API steps
  params?:      Record<string, any>
  dependencies: string[]         // step ids that must complete before this
  critical:     boolean          // if true, failure halts workflow
  timeout?:     number           // ms
}

export interface GoalPlan {
  goal:       string
  intent:     string
  confidence: number
  steps:      PlanStep[]
  estimatedDurationMs: number
}

export class KimmpGoalPlanner {

  static async plan(goal: string, ctx: EnterpriseContext): Promise<GoalPlan> {
    const summary = KimmpContextAssembler.summarise(ctx)

    const prompt = `You are KIMMP's Autonomous Planning Engine — part of WAANDA (Kangqore's AI Operating System).

Goal: "${goal}"

Enterprise context:
${summary}

Decompose this goal into 3–8 concrete workflow steps.

Return ONLY valid JSON with this shape:
{
  "intent": "one-sentence description of what this plan achieves",
  "confidence": 75,
  "steps": [
    {
      "id": "step-1",
      "title": "Short step name",
      "type": "SIGNAL_READ|DATA_QUERY|AGENT_INVOKE|DECISION|APPROVAL_GATE|EXTERNAL_API|NOTIFY|MEMORY_WRITE|GOAL_UPDATE|WAIT",
      "description": "What this step does",
      "agentHint": "SIGNAL_READ|GOAL_CHECK|FINANCIAL_SNAPSHOT|LEAD_ANALYSIS|RISK_ANALYSIS|DECISION_ENGINE|STRATEGIST",
      "platform": "slack|jira|github|salesforce",
      "action": "sendMessage|createIssue|...",
      "params": {},
      "dependencies": [],
      "critical": true
    }
  ],
  "estimatedDurationMs": 30000
}

Rules:
- steps with no dependencies run in parallel
- APPROVAL_GATE should come before high-impact EXTERNAL_API steps
- use MEMORY_WRITE at the end to capture lessons
- critical=true means failure halts the whole workflow
- be specific to the goal and context — not generic`

    try {
      const res  = await sonnet('You are KIMMP. Return only valid JSON.', prompt, 2000, { agentType: 'PLANNER', tags: ['goal_plan'] })
      const raw  = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        return {
          goal,
          intent:     parsed.intent ?? goal,
          confidence: parsed.confidence ?? 60,
          steps:      (parsed.steps ?? []).map((s: any, i: number) => ({
            id:           s.id ?? `step-${i + 1}`,
            title:        s.title ?? `Step ${i + 1}`,
            type:         s.type ?? 'AGENT_INVOKE',
            description:  s.description ?? '',
            agentHint:    s.agentHint,
            platform:     s.platform,
            action:       s.action,
            params:       s.params ?? {},
            dependencies: s.dependencies ?? [],
            critical:     s.critical ?? false,
            timeout:      s.timeout ?? 30_000,
          })),
          estimatedDurationMs: parsed.estimatedDurationMs ?? 60_000,
        }
      }
    } catch {}

    // Fallback plan: always at least gather context + decide + notify
    return {
      goal,
      intent:     `Evaluate and act on: ${goal}`,
      confidence: 40,
      steps: [
        { id: 'step-1', title: 'Gather signals',    type: 'SIGNAL_READ',    description: 'Read current KIMMP signals', dependencies: [], critical: false },
        { id: 'step-2', title: 'Analyse situation', type: 'AGENT_INVOKE',   description: 'Run analysis agents',       dependencies: ['step-1'], agentHint: 'RISK_ANALYSIS', critical: false },
        { id: 'step-3', title: 'Generate decision', type: 'DECISION',       description: 'Produce structured decision', dependencies: ['step-2'], critical: true },
        { id: 'step-4', title: 'Record lessons',    type: 'MEMORY_WRITE',   description: 'Store outcome in memory',   dependencies: ['step-3'], critical: false },
      ],
      estimatedDurationMs: 45_000,
    }
  }
}
