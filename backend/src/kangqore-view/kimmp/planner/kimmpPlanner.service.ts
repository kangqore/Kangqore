import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../llm/krisnamAnthropic'

export interface PlanStep {
  step: number
  description: string
  type: 'query' | 'analyze' | 'action' | 'synthesize'
  status: 'pending' | 'running' | 'done' | 'failed'
  result?: string
}

const PLAN_TRIGGERS = [
  /analyze.*(and|then)/i,
  /compare.*quarter/i,
  /plan.*for.*next/i,
  /risk.*next/i,
  /full.*report/i,
  /find.*(then|and also)/i,
  /across.*all/i,
  /step.?by.?step/i,
  /break.*down/i,
  /deep.?dive/i,
  /comprehensive/i,
]

export class KimmpPlannerService {
  static needsPlanning(query: string): boolean {
    return PLAN_TRIGGERS.some(t => t.test(query))
  }

  static async decompose(query: string, signalSummary: string): Promise<PlanStep[]> {
    try {
      const client = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))
      const r = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are KIMMP's planning engine. Decompose the operator query into 2-4 executable steps.
Return ONLY a valid JSON array: [{"step": 1, "description": "Short step description", "type": "query|analyze|action|synthesize"}]
Types: query=fetch data, analyze=examine data, action=do something, synthesize=combine results into final answer.`,
        messages: [{ role: 'user', content: `Query: "${query}"\nAvailable signal context: ${signalSummary.slice(0, 300)}` }],
      })
      const raw = r.content[0]?.type === 'text' ? r.content[0].text : '[]'
      const match = raw.match(/\[[\s\S]*\]/)
      if (!match) return []
      const steps = JSON.parse(match[0]) as any[]
      return steps.slice(0, 4).map((s, i) => ({
        step: i + 1,
        description: String(s.description ?? `Step ${i + 1}`),
        type: (['query', 'analyze', 'action', 'synthesize'].includes(s.type) ? s.type : 'analyze') as PlanStep['type'],
        status: 'pending' as const,
      }))
    } catch {
      return []
    }
  }
}
