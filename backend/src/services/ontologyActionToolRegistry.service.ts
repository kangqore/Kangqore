// S314 — OntologyActionToolRegistry + Execution Bridge.
//
// A LogicToolRegistry-parallel registry (see
// kangqore-immp/tools/logicToolRegistry.ts) for ontology actions. Passed into
// the router's existing tools/toolExecutor options — no changes to the
// tool_use loop itself, which already works in production. The executor
// routes back to the real ActionEngine.execute(): validation rules, effects,
// and PendingApproval human-in-the-loop gating all apply exactly as they do
// today for human-triggered actions. Only actions with toolCallable=true are
// ever exposed — the DB row is the allowlist, mirroring allowedRoles.

import type Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../lib/prisma'
import { ActionEngine } from './actionEngine.service'
import { OntologyToolSchema } from './ontologyToolSchema.service'

export const OntologyActionToolRegistry = {
  async getTools(): Promise<Anthropic.Tool[]> {
    return OntologyToolSchema.generateToolSchemas()
  },

  async executor(name: string, input: any): Promise<string> {
    const action = await prisma.ontologyAction.findFirst({ where: { name, toolCallable: true } })
    if (!action) throw new Error(`Unknown or non-tool-callable ontology action: "${name}"`)

    const { objectId, ...params } = (input ?? {}) as Record<string, unknown>
    const execution = await ActionEngine.execute({
      actionId:     action.id,
      params,
      objectId:     (objectId as string) ?? null,
      actorType:    'KIMMP',
      sourceModule: 'OntologyActionToolRegistry',
      reasoning:    'Invoked by Claude via tool-use',
    })

    return JSON.stringify({
      executionId: execution.id,
      status: execution.status,
      effectsApplied: execution.effectsApplied,
      errorMessage: execution.errorMessage,
    })
  },
}
