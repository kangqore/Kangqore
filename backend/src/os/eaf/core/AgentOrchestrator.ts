import { AgentExecutor } from './AgentExecutor'
import { AgentRegistry } from './AgentRegistry'
import {
  AgentOrchestrationPlan,
  AgentOrchestrationResult,
  AgentResult,
} from '../contracts/types'

export class AgentOrchestrator {
  private executor: AgentExecutor

  constructor(registry: AgentRegistry = AgentRegistry.getInstance()) {
    this.executor = new AgentExecutor(registry)
  }

  async execute(plan: AgentOrchestrationPlan): Promise<AgentOrchestrationResult> {
    const start = Date.now()
    let results: AgentResult[]

    if (plan.executionOrder === 'PARALLEL') {
      results = await Promise.all(
        plan.agents.map(id => this.executor.execute(id, plan.context))
      )
    } else if (plan.executionOrder === 'PIPELINE') {
      results = []
      let pipelineContext = { ...plan.context }
      for (const agentId of plan.agents) {
        const result = await this.executor.execute(agentId, pipelineContext)
        results.push(result)
        // Each agent's outputs feed into the next agent's inputs
        pipelineContext = { ...pipelineContext, inputs: { ...pipelineContext.inputs, ...result.outputs } }
        if (result.status === 'FAILED') break
      }
    } else {
      // SEQUENTIAL — independent, no output chaining
      results = []
      for (const agentId of plan.agents) {
        results.push(await this.executor.execute(agentId, plan.context))
      }
    }

    const failed = results.filter(r => r.status === 'FAILED').length
    const aggregatedOutputs = results.reduce((acc, r) => ({ ...acc, ...r.outputs }), {} as Record<string, unknown>)

    return {
      planId: plan.planId,
      results,
      aggregatedOutputs,
      overallStatus: failed > 0 ? 'FAILED' : 'COMPLETED',
      totalDurationMs: Date.now() - start,
    }
  }
}
