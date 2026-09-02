// S321 — Data-Driven Agent Execution Path.
//
// KimmpAgent has the right columns (name, role, tools, model, systemPrompt)
// and is already populated by the pack-install flow (packRegistry.service.ts,
// blueprintService.ts) — but until now nothing ever read a row back out at
// call time. Every real agent (38 KIMMP + 80 HANUMANAS) is a hardcoded TS
// function with its own bespoke domain logic (queries leads/projects/
// invoices, etc.) baked in alongside the LLM call — this doesn't replace
// those, it ships alongside them as a second, generic execution path for
// agents that are just "a system prompt + a model + some tools," which is
// what every DB-defined agent created via Agent Studio actually is.

import { prisma } from '../../../lib/prisma'
import { routedCall, textOf, RouterMeta } from '../llm/kimmpLLMRouter'
import { resolveAgentTools } from './agentToolBinding.service'

export interface AgentRunResult {
  output:      string
  success:     boolean
  durationMs:  number
  toolCalls:   Array<{ name: string; input: any; result: string }>
  logId:       string | null
}

export class KimmpAgentRuntime {
  static async run(agentId: string, input: string, userId?: string): Promise<AgentRunResult> {
    const agent = await prisma.kimmpAgent.findUnique({ where: { id: agentId } })
    if (!agent) throw new Error('Agent not found')
    if (agent.status !== 'ACTIVE') throw new Error(`Agent is ${agent.status.toLowerCase()} — activate it before running`)

    const start = Date.now()
    const systemPrompt = agent.systemPrompt?.trim() || `You are ${agent.name}, ${agent.role}. Respond helpfully and concisely.`
    const { tools, toolExecutor } = await resolveAgentTools(agent.tools)

    let output = ''
    let success = true
    let toolCalls: Array<{ name: string; input: any; result: string }> = []

    try {
      const meta: RouterMeta = {
        agentType:   agent.name,
        agentSystem: 'AGENT_STUDIO',
        tags:        ['agent-studio', agent.role],
        ...(agent.promptName ? { promptName: agent.promptName } : {}),
      }
      const result = await routedCall(
        agent.model, systemPrompt, input, 1200, meta,
        tools.length ? { tools, toolExecutor } : {},
      )
      output = textOf(result)
      toolCalls = result._routerMeta.toolCalls ?? []
    } catch (err: any) {
      output = `Error: ${err.message}`
      success = false
    }

    const durationMs = Date.now() - start

    const log = await (prisma as any).kimmpAgentLog.create({
      data: {
        agentId:    agent.id,
        action:     'RUN',
        input:      { query: input, userId: userId ?? null },
        output:     { text: output, toolCalls },
        level:      agent.maxLevel,
        status:     success ? 'COMPLETED' : 'FAILED',
        durationMs,
      },
    }).catch(() => null)

    return { output, success, durationMs, toolCalls, logId: log?.id ?? null }
  }
}
