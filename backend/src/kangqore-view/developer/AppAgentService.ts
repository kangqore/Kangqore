// Phase 5.1 — Agent SDK backend.
//
// An app declares agents in its manifest. Rather than building a second
// execution path, each declared agent is materialised as a real KimmpAgent row
// at publish time and run through the existing KimmpAgentRuntime — so app
// agents appear in Agent Studio, use the same tool binding and LLM router, and
// are logged like every other agent.
//
// The binding table keeps manifest names stable across republishes.

import { prisma } from '../../lib/prisma'
import { KimmpAgentRuntime } from '../kimmp/agents/kimmpAgentRuntime.service'
import { GovernanceKernel } from './GovernanceKernel'
import type { KangqoreAppManifest, ManifestAgentDef } from './AppManifest'

export const AppAgentService = {
  /**
   * Materialise every manifest-declared agent as a KimmpAgent, idempotently.
   * Called at publish so a published app's agents are immediately runnable.
   */
  async syncAgentsFromManifest(appId: string, manifest: KangqoreAppManifest) {
    const declared: ManifestAgentDef[] = manifest?.agents ?? []
    const synced: Array<{ agentName: string; kimmpAgentId: string; created: boolean }> = []

    for (const def of declared) {
      if (!def?.name) continue

      const existing = await prisma.appAgentBinding.findUnique({
        where: { appId_agentName: { appId, agentName: def.name } },
      })

      const systemPrompt = [
        `You are "${def.name}", an agent provided by the Kangqore View app "${manifest.name}".`,
        def.role ? `Role: ${def.role}` : '',
        def.goal ? `Goal: ${def.goal}` : '',
        'You operate inside a governed sandbox. Every action you take is authorised, budgeted, and audited.',
      ].filter(Boolean).join('\n')

      if (existing) {
        await prisma.kimmpAgent.update({
          where: { id: existing.kimmpAgentId },
          data: {
            role: def.role || 'App Agent',
            description: def.goal || null,
            systemPrompt,
            tools: def.capabilities ?? [],
          },
        }).catch(() => null)
        synced.push({ agentName: def.name, kimmpAgentId: existing.kimmpAgentId, created: false })
        continue
      }

      const agent = await prisma.kimmpAgent.create({
        data: {
          name: `${manifest.name} · ${def.name}`,
          role: def.role || 'App Agent',
          description: def.goal || null,
          status: 'ACTIVE',
          tools: def.capabilities ?? [],
          systemPrompt,
        },
      })

      await prisma.appAgentBinding.create({
        data: { appId, agentName: def.name, kimmpAgentId: agent.id },
      })
      synced.push({ agentName: def.name, kimmpAgentId: agent.id, created: true })
    }

    return synced
  },

  /** Agents this app exposes, as declared in its manifest. */
  async listAgents(appId: string) {
    const app = await prisma.developerApp.findUnique({ where: { appId } })
    if (!app) return []
    const manifest = app.manifest as unknown as KangqoreAppManifest
    const bindings = await prisma.appAgentBinding.findMany({ where: { appId } })
    const boundNames = new Set(bindings.map(b => b.agentName))

    return (manifest?.agents ?? []).map(a => ({
      name: a.name,
      role: a.role,
      goal: a.goal,
      capabilities: a.capabilities ?? [],
      runnable: boundNames.has(a.name),
    }))
  },

  /**
   * Run an app agent. Authorisation goes through the governance kernel first,
   * so an agent run is gated, budgeted, and audited exactly like an action.
   * Agent runs cost more credit than a single action because they may fan out
   * into tool calls.
   */
  async runAgent(args: {
    appId: string
    agentName: string
    tenantId: string
    actorId: string
    prompt: string
    context?: Record<string, unknown>
  }) {
    const decision = await GovernanceKernel.authorize({
      appId: args.appId,
      tenantId: args.tenantId,
      actorId: args.actorId,
      actionName: `AGENT:${args.agentName}`,
      params: { prompt: args.prompt, context: args.context },
      creditCost: 5,
    })

    if (!decision.allowed) {
      return {
        allowed: false as const,
        auditId: decision.auditId,
        outcome: decision.outcome,
        reason: decision.reason,
        governance: decision,
      }
    }

    const binding = await prisma.appAgentBinding.findUnique({
      where: { appId_agentName: { appId: args.appId, agentName: args.agentName } },
    })

    if (!binding) {
      const msg = `Agent "${args.agentName}" is not declared in the manifest of "${args.appId}", or the app has not been published since declaring it.`
      await GovernanceKernel.recordResult(decision.auditId, null, msg)
      return { allowed: false as const, auditId: decision.auditId, outcome: 'ERROR' as const, reason: msg, governance: decision }
    }

    try {
      const input = args.context && Object.keys(args.context).length
        ? `${args.prompt}\n\nContext:\n${JSON.stringify(args.context, null, 2)}`
        : args.prompt

      const result = await KimmpAgentRuntime.run(binding.kimmpAgentId, input, args.actorId)
      await GovernanceKernel.recordResult(decision.auditId, {
        output: result.output?.slice(0, 4000),
        toolCalls: result.toolCalls?.length ?? 0,
        durationMs: result.durationMs,
      })

      return {
        allowed: true as const,
        auditId: decision.auditId,
        runId: result.logId ?? decision.auditId,
        agentName: args.agentName,
        status: result.success ? ('COMPLETED' as const) : ('FAILED' as const),
        output: result.output,
        toolCalls: result.toolCalls,
        durationMs: result.durationMs,
        creditsCharged: decision.billing.creditsCharged,
        creditsRemaining: decision.billing.creditsRemaining,
      }
    } catch (err: any) {
      await GovernanceKernel.recordResult(decision.auditId, null, err.message)
      return { allowed: false as const, auditId: decision.auditId, outcome: 'ERROR' as const, reason: err.message, governance: decision }
    }
  },
}
