import { AgentRegistry } from './AgentRegistry'
import { AgentContext, AgentResult, AgentStatus } from '../contracts/types'

export class AgentExecutor {
  constructor(private registry: AgentRegistry = AgentRegistry.getInstance()) {}

  async execute(agentId: string, context: AgentContext): Promise<AgentResult> {
    const agent = this.registry.get(agentId)
    if (!agent) {
      return {
        agentId,
        requestId: context.requestId,
        status: 'FAILED' as AgentStatus,
        outputs: {},
        confidenceScore: 0,
        durationMs: 0,
        errors: [`Agent '${agentId}' not found in registry`],
      }
    }

    if (!agent.validate(context)) {
      return {
        agentId,
        requestId: context.requestId,
        status: 'FAILED' as AgentStatus,
        outputs: {},
        confidenceScore: 0,
        durationMs: 0,
        errors: [`Agent '${agentId}' validation failed for context`],
      }
    }

    const start = Date.now()
    try {
      const result = await Promise.race([
        agent.execute(context),
        this._timeout(context.timeoutMs ?? 30_000, agentId, context.requestId),
      ])
      return result
    } catch (err: any) {
      return {
        agentId,
        requestId: context.requestId,
        status: 'FAILED' as AgentStatus,
        outputs: {},
        confidenceScore: 0,
        durationMs: Date.now() - start,
        errors: [err?.message ?? 'Unknown error'],
      }
    }
  }

  private _timeout(ms: number, agentId: string, requestId: string): Promise<AgentResult> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Agent '${agentId}' timed out after ${ms}ms`)), ms)
    )
  }
}
