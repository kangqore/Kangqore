// D5 — KimmpAgentCoordinator
// Multi-agent structured output + consensus.
// Each specialist agent contributes a typed finding.
// The coordinator merges and produces a consensus recommendation.

import { sonnet, haiku, textOf } from '../llm/kimmpLLMRouter'
import { EnterpriseContext, KimmpContextAssembler } from '../context/kimmpContextAssembler.service'

export type SpecialistAgent =
  | 'SIGNAL_READ'
  | 'GOAL_CHECK'
  | 'FINANCIAL_SNAPSHOT'
  | 'LEAD_ANALYSIS'
  | 'RISK_ANALYSIS'
  | 'DECISION_ENGINE'
  | 'STRATEGIST'
  | 'ADVISOR'
  | 'COMPLIANCE'
  | 'OPERATIONS'
  | 'FORECAST'

export interface AgentFinding {
  agent:        SpecialistAgent
  summary:      string
  data:         any
  confidence:   number
  flags:        string[]   // issues or highlights
  durationMs:   number
}

export interface CoordinationResult {
  findings:       AgentFinding[]
  consensus:      string         // merged recommendation
  confidence:     number
  conflicting:    string[]       // agents that disagreed
  actionRequired: boolean
}

const AGENT_SYSTEM: Record<SpecialistAgent, string> = {
  SIGNAL_READ:         'You are a signal intelligence analyst. Assess the current alert/signal state.',
  GOAL_CHECK:          'You are a goal alignment specialist. Assess whether current actions support active goals.',
  FINANCIAL_SNAPSHOT:  'You are a CFO-level analyst. Assess revenue, invoices, ARR, and financial health.',
  LEAD_ANALYSIS:       'You are a sales intelligence analyst. Assess the sales pipeline and lead quality.',
  RISK_ANALYSIS:       'You are a risk management specialist. Identify threats and their likelihood.',
  DECISION_ENGINE:     'You are a strategic decision analyst. Evaluate options and recommend the best path.',
  STRATEGIST:          'You are a corporate strategist. Provide scenario-based strategic guidance.',
  ADVISOR:             'You are an executive advisor. Provide balanced, practical recommendations.',
  COMPLIANCE:          'You are a compliance officer. Flag any regulatory, legal, or governance risks.',
  OPERATIONS:          'You are an operations specialist. Assess capacity, delivery, and execution risks.',
  FORECAST:            'You are a business forecaster. Project likely outcomes over the next 90 days.',
}

export class KimmpAgentCoordinator {

  static async invokeAgent(
    agent:       SpecialistAgent,
    params:      Record<string, any>,
    ctx:         EnterpriseContext,
    priorResults: Record<string, any> = {},
  ): Promise<AgentFinding> {
    const start = Date.now()
    const summary = KimmpContextAssembler.summarise(ctx)
    const priorCtx = Object.keys(priorResults).length > 0
      ? `\n\nPrior step outputs:\n${JSON.stringify(priorResults).slice(0, 500)}`
      : ''

    const prompt = `Context:\n${summary}${priorCtx}\n\nTask: ${params.task ?? params.question ?? 'Analyse current state and flag key concerns.'}\n\nReturn a concise JSON: { "summary": "...", "confidence": 70, "flags": ["..."], "data": {} }`

    const system = AGENT_SYSTEM[agent] ?? 'You are a KIMMP specialist agent.'

    try {
      const res = await haiku(system, prompt, 600, { agentType: agent })
      const raw = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        return {
          agent,
          summary:    parsed.summary ?? raw.slice(0, 200),
          data:       parsed.data ?? {},
          confidence: parsed.confidence ?? 60,
          flags:      parsed.flags ?? [],
          durationMs: Date.now() - start,
        }
      }
    } catch {}

    return {
      agent,
      summary:    'Analysis incomplete — insufficient context.',
      data:       {},
      confidence: 20,
      flags:      ['LOW_CONFIDENCE'],
      durationMs: Date.now() - start,
    }
  }

  // Invoke multiple specialist agents + produce consensus
  static async coordinate(
    agents:   SpecialistAgent[],
    question: string,
    ctx:      EnterpriseContext,
  ): Promise<CoordinationResult> {
    const params = { task: question }
    const findings = await Promise.all(
      agents.map(a => KimmpAgentCoordinator.invokeAgent(a, params, ctx))
    )

    // Detect conflicting agents (confidence spread > 30 with opposing flags)
    const avgConf  = findings.reduce((s, f) => s + f.confidence, 0) / findings.length
    const conflicting = findings
      .filter(f => Math.abs(f.confidence - avgConf) > 30)
      .map(f => f.agent as string)

    const findingText = findings
      .map(f => `${f.agent} (conf:${f.confidence}%): ${f.summary}`)
      .join('\n')

    const consensusPrompt = `You are KIMMP's Coordination Engine. Multiple specialist agents have analysed the same question.

Question: "${question}"

Agent findings:
${findingText}

Conflicting agents (if any): ${conflicting.join(', ') || 'none'}

Produce a single consensus recommendation that integrates all findings. Be specific. Return JSON:
{ "consensus": "...", "confidence": 72, "actionRequired": true }`

    let consensus    = 'Analysis complete. Review individual agent findings.'
    let consConf     = avgConf
    let actionRequired = false

    try {
      const res   = await sonnet('You are KIMMP Coordination Engine.', consensusPrompt, 800, { agentType: 'ADVISOR', promptName: 'consensus_system' })
      const raw   = textOf(res)
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        consensus      = parsed.consensus ?? consensus
        consConf       = parsed.confidence ?? consConf
        actionRequired = parsed.actionRequired ?? false
      }
    } catch {}

    return { findings, consensus, confidence: consConf, conflicting, actionRequired }
  }
}
