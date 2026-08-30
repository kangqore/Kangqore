import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../llm/krisnamAnthropic'
import { KimmpActionsService, ActionType } from './kimmpActions.service'
import { ACTION_LEVELS } from '../authority/kimmpAuthority.service'
import logger from '../../../utils/logger'

const anthropic = withKrisnam(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

// Maps proactive alert category → best action to propose
const ALERT_ACTION_MAP: Record<string, { type: ActionType; descriptionTemplate: (title: string) => string; paramsBuilder: (title: string, meta: any) => Record<string, any> }> = {
  OPPORTUNITY: {
    type: 'CREATE_GOAL',
    descriptionTemplate: t => `Create goal to pursue: ${t}`,
    paramsBuilder:       (t, _m) => ({ objective: `Pursue opportunity: ${t}`, source: 'KIMMP_PROACTIVE' }),
  },
  LEAD: {
    type: 'DRAFT_EMAIL',
    descriptionTemplate: t => `Draft re-engagement email for cold lead: ${t}`,
    paramsBuilder:       (t, m) => ({ to: m?.leadEmail ?? 'lead', context: `Cold lead re-engagement: ${t}`, description: t }),
  },
  PIPELINE: {
    type: 'DRAFT_EMAIL',
    descriptionTemplate: t => `Draft pipeline revival outreach: ${t}`,
    paramsBuilder:       (t, _m) => ({ to: 'high-score leads', context: `Pipeline drought — revive: ${t}`, description: t }),
  },
  FINANCE: {
    type: 'GENERATE_REPORT',
    descriptionTemplate: t => `Generate financial report for: ${t}`,
    paramsBuilder:       (_t, _m) => ({ type: 'MONTHLY_BOARD' }),
  },
  COMPETITOR: {
    type: 'LOG_DECISION',
    descriptionTemplate: t => `Log competitor move: ${t}`,
    paramsBuilder:       (t, _m) => ({ description: `Competitor intelligence noted: ${t}`, status: 'NOTED' }),
  },
  GOAL: {
    type: 'ADD_MEMORY',
    descriptionTemplate: t => `Record goal risk: ${t}`,
    paramsBuilder:       (t, _m) => ({ key: `goal_risk_${Date.now()}`, value: t, memoryType: 'ORG_KNOWLEDGE' }),
  },
  INTELLIGENCE: {
    type: 'CREATE_GOAL',
    descriptionTemplate: t => `Create strategic response goal: ${t}`,
    paramsBuilder:       (t, _m) => ({ objective: `Strategic response: ${t}`, source: 'KIMMP_INTELLIGENCE' }),
  },
  // ── Cross-module loops ──────────────────────────────────────────────────────
  DEMAND: {
    type: 'TRIGGER_ALIS_RESPONSE',
    descriptionTemplate: t => `Reprioritise ALIS leads for demand spike: ${t}`,
    paramsBuilder:       (t, m) => ({ department: m?.department ?? t, severity: m?.severity ?? 'MODERATE', metadata: m }),
  },
  MARKET: {
    type: 'TRIGGER_ALIS_RESPONSE',
    descriptionTemplate: t => `Act on market demand signal: ${t}`,
    paramsBuilder:       (t, m) => ({ department: m?.department ?? t, severity: m?.severity ?? 'MODERATE', metadata: m }),
  },
  CONTENT: {
    type: 'UPDATE_VIS_OPPORTUNITY',
    descriptionTemplate: t => `Action content gap opportunity: ${t}`,
    paramsBuilder:       (t, m) => ({ slug: m?.slug ?? t, opportunityId: m?.opportunityId, action: 'IN_PROGRESS', notes: 'Actioned by KIMMP from CONTENT_GAP signal' }),
  },
}

export class KimmpActionProposer {

  // Called by ProactiveEngine after a new alert fires
  static async proposeFromAlert(category: string, title: string, metadata?: Record<string, any>): Promise<void> {
    const mapping = ALERT_ACTION_MAP[category]
    if (!mapping) return

    const description = mapping.descriptionTemplate(title.slice(0, 100))
    const params      = mapping.paramsBuilder(title, metadata ?? {})
    const level       = ACTION_LEVELS[mapping.type] ?? 3

    await KimmpActionsService.queue({ type: mapping.type, description, params, level })
    logger.info(`[KIMMP:PROPOSER] Proposed ${mapping.type} from ${category} alert`)
  }

  // Called by Orchestrator with the top next step from synthesis
  static async proposeFromNextStep(nextStep: string, intent: string): Promise<void> {
    if (!nextStep?.trim()) return
    if (!process.env.ANTHROPIC_API_KEY) return

    try {
      const res = await anthropic.messages.create({
        model:       'claude-haiku-4-5-20251001',
        max_tokens:  250,
        temperature: 0.1,
        system: `You are KIMMP action mapper. Map a next step to an executable action type. Return JSON or null.

Valid action types:
- CREATE_GOAL: creating an objective, goal, strategy, bid, or program
- DRAFT_EMAIL: contacting someone, sending a message, outreach, follow-up
- GENERATE_REPORT: generating a report, briefing, or analysis
- SCHEDULE_TASK: scheduling, planning a specific task or meeting
- ADD_MEMORY: noting, recording, or flagging information
- LOG_DECISION: recording a decision or strategic choice
- null: step requires human action (review, attend meeting, read document, etc.)

Return: { "type": "ACTION_TYPE", "params": {}, "description": "one sentence" }
Or: null`,
        messages: [{ role: 'user', content: `Intent: ${intent}\nNext step: "${nextStep}"` }],
      })

      const raw   = res.content[0]?.type === 'text' ? res.content[0].text.trim() : ''
      if (!raw || raw === 'null') return

      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) return

      const parsed = JSON.parse(match[0])
      if (!parsed?.type || parsed.type === 'null') return

      const level = ACTION_LEVELS[parsed.type] ?? 3

      await KimmpActionsService.queue({
        type:        parsed.type as ActionType,
        description: parsed.description ?? nextStep.slice(0, 100),
        params:      { ...(parsed.params ?? {}), source: 'KIMMP_ORCHESTRATION', intent },
        level,
      })

      logger.info(`[KIMMP:PROPOSER] Proposed ${parsed.type} from orchestration next step`)
    } catch (err: any) {
      logger.warn(`[KIMMP:PROPOSER] proposeFromNextStep failed: ${err.message}`)
    }
  }

  // Called from POST /actions/propose — ADMIN or KIMMP describes an action in natural language
  static async proposeFromDescription(description: string, context?: string): Promise<{
    queued:         boolean
    pendingAction?: any
    result?:        any
    type?:          string
  }> {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { queued: false, result: { success: false, summary: 'ANTHROPIC_API_KEY not set' } }
    }

    const res = await anthropic.messages.create({
      model:       'claude-haiku-4-5-20251001',
      max_tokens:  300,
      temperature: 0.1,
      system: `You are KIMMP action interpreter. Convert a natural language instruction into a structured action. Return JSON only.

Valid types and their params:
- CREATE_GOAL: params { objective, deadline? }
- DRAFT_EMAIL: params { to, context }
- UPDATE_LEAD_STATUS: params { leadId, status } — only if specific lead ID is known
- GENERATE_REPORT: params { type: "DAILY_BRIEFING|WEEKLY_EXECUTIVE|MONTHLY_BOARD|SALES_PIPELINE" }
- SCHEDULE_TASK: params { task, dueDate? }
- ADD_MEMORY: params { key, value, memoryType: "ORG_KNOWLEDGE" }
- LOG_DECISION: params { description, status: "NOTED|ACTIONED" }
- EMIT_SIGNAL: params { signalType, signalValue, severity: "LOW|MODERATE|HIGH" }
- SEND_NOTIFICATION: params { message }
- DISMISS_ALERT: params { alertId } — only if specific alertId known

Return: { "type": "ACTION_TYPE", "params": {}, "description": "..." }`,
      messages: [{ role: 'user', content: `Instruction: "${description}"${context ? `\nContext: ${context}` : ''}` }],
    })

    const raw   = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return { queued: false, result: { success: false, summary: 'Could not interpret action' } }

    const parsed = JSON.parse(match[0])
    const level  = ACTION_LEVELS[parsed.type] ?? 3

    const outcome = await KimmpActionsService.queue({
      type:        parsed.type as ActionType,
      description: parsed.description ?? description,
      params:      parsed.params ?? {},
      level,
    })

    return { ...outcome, type: parsed.type }
  }
}
