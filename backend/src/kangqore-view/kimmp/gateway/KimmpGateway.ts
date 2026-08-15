// S308-S310 — KIMMP Intelligence Gateway: the explicit, richer entrypoint
// (complete()) for new call sites that want real budget enforcement (a real
// userId) and PII REDACT/BLOCK — not just AUDIT. See kimmpGatewayCore.ts for
// the logging/PII/budget primitives, which the router and withWaandax also
// use directly for passive, near-total coverage of the ~85 existing call
// sites without rewriting them all (see kimmpLLMRouter.ts routedCall() and
// kangqore-immp/llm/waandaxAnthropic.ts withWaandax() for those call sites).

import { routedCall, type RouterMeta } from '../../../kangqore-immp/llm/kimmpLLMRouter'
import {
  logCall, scanPii, checkBudget, estimateCost, GATEWAY_MODEL_MAP,
  GatewayBlockedError, GatewayBudgetExceededError, type PiiScanResult,
} from './KimmpGatewayCore'

export interface CompleteOptions {
  model: string
  system: string
  user: string
  maxTokens?: number
  userId?: string
  actorType: string
  taskType?: string
  agentRole?: string
  referencedObjectIds?: string[]
}

export async function complete(opts: CompleteOptions): Promise<string> {
  const start = Date.now()

  if (opts.userId) {
    const budget = await checkBudget(opts.userId)
    if (!budget.allowed) {
      await logCall({
        userId: opts.userId, actorType: opts.actorType, model: opts.model, provider: 'none',
        prompt: opts.system + '\n' + opts.user, response: '', taskType: opts.taskType, agentRole: opts.agentRole,
        status: 'BLOCKED', errorMessage: budget.reason, latencyMs: Date.now() - start,
      })
      // S326 — emit on the shared CDC bus so any registered
      // KimmpOperationalSubscription with 'budget.exceeded' fires.
      // Fire-and-forget: a webhook delivery failure must never block the caller.
      import('../../../lib/cdc/cdcService').then(({ CdcService }) =>
        CdcService.emit('token_budgets', 'UPDATE', null, { userId: opts.userId, usedTokens: budget.usedTokens, limitTokens: budget.limitTokens, reason: budget.reason, at: new Date().toISOString() }),
      ).catch(() => {})
      throw new GatewayBudgetExceededError(budget.reason ?? 'Budget exceeded')
    }
  }

  let scan: PiiScanResult
  try {
    scan = await scanPii(opts.system + '\n' + opts.user, true)
  } catch (err) {
    await logCall({
      userId: opts.userId, actorType: opts.actorType, model: opts.model, provider: 'none',
      prompt: opts.system + '\n' + opts.user, response: '', taskType: opts.taskType, agentRole: opts.agentRole,
      status: 'BLOCKED', errorMessage: (err as Error).message, piiDetected: true, latencyMs: Date.now() - start,
    })
    throw err
  }

  const meta: RouterMeta = { agentType: opts.agentRole, agentSystem: opts.actorType, tags: opts.taskType ? [opts.taskType] : [] }
  try {
    const result = await routedCall(opts.model, opts.system, scan.text, opts.maxTokens ?? 900, meta, { skipGatewayLog: true })
    const text = result.content[0]?.text ?? ''

    await logCall({
      userId: opts.userId, actorType: opts.actorType, model: result._routerMeta.usedModel, provider: result._routerMeta.provider,
      promptTokens: result._routerMeta.inputTokens, completionTokens: result._routerMeta.outputTokens,
      latencyMs: result._routerMeta.durationMs, prompt: opts.system + '\n' + opts.user, response: text,
      referencedObjectIds: opts.referencedObjectIds, taskType: opts.taskType, agentRole: opts.agentRole,
      sourceModule: 'kimmpGateway.complete', status: 'SUCCESS', piiDetected: scan.detected, piiPatterns: scan.patterns,
    })
    return text
  } catch (err) {
    await logCall({
      userId: opts.userId, actorType: opts.actorType, model: opts.model, provider: 'none',
      prompt: opts.system + '\n' + opts.user, response: '', taskType: opts.taskType, agentRole: opts.agentRole,
      sourceModule: 'kimmpGateway.complete', status: 'ERROR', errorMessage: (err as Error).message,
      latencyMs: Date.now() - start,
    })
    throw err
  }
}

export { logCall, scanPii, checkBudget, estimateCost, GATEWAY_MODEL_MAP, GatewayBlockedError, GatewayBudgetExceededError }
export const KimmpGateway = { logCall, scanPii, checkBudget, complete, estimateCost, GATEWAY_MODEL_MAP }
