// S322 — Tool + Action Binding for data-driven KimmpAgent runs.
//
// KimmpAgent.tools is a free-text String[] of tool names. This resolves that
// list against the same two registries commandService.ts already merges for
// the /command endpoint (S313-S315's OntologyActionToolRegistry, S318's
// KnowledgeSearchTool) plus LogicToolRegistry's calculators — so a DB-defined
// agent can be given real business actions, not just read-only calculators.
// An agent with an empty tools[] gets none — no implicit "all tools" default.

import type Anthropic from '@anthropic-ai/sdk'
import { LogicToolRegistry } from '../tools/logicToolRegistry'
import { OntologyActionToolRegistry } from '../../kangqore-view/automation/OntologyActionToolRegistry'
import { KnowledgeSearchTool } from '../../services/knowledgeSearchTool.service'

export interface ResolvedAgentTools {
  tools: Anthropic.Tool[]
  toolExecutor: (name: string, input: any) => any
}

export async function resolveAgentTools(toolNames: string[]): Promise<ResolvedAgentTools> {
  if (!toolNames?.length) {
    return { tools: [], toolExecutor: () => JSON.stringify({ error: 'No tools bound to this agent' }) }
  }

  const allowed = new Set(toolNames)
  const ontologyTools = await OntologyActionToolRegistry.getTools().catch(() => [])
  const ontologyNames = new Set(ontologyTools.map(t => t.name))
  const searchTool = KnowledgeSearchTool.getTool()
  const combined = [...LogicToolRegistry.getTools('all'), ...ontologyTools, searchTool]

  const tools = combined.filter(t => allowed.has(t.name))
  const toolExecutor = (name: string, input: any) =>
    ontologyNames.has(name) ? OntologyActionToolRegistry.executor(name, input)
    : KnowledgeSearchTool.isKnowledgeSearchTool(name) ? KnowledgeSearchTool.executor(name, input)
    : LogicToolRegistry.auditedExecutor(name, input)

  return { tools, toolExecutor }
}

// ─── KimmpTool catalog sync ──────────────────────────────────────────────────
// KimmpTool started as an 11-row static reference table of KimmpActionsService
// ActionTypes, disconnected from the tools actually bindable above. This
// upserts real entries for every calculator + toolCallable ontology action so
// the Agent Studio builder's tool picker (reading GET /authority/tools) shows
// what an agent can actually be given — additive only, the original 11 rows
// are untouched.

export async function syncToolCatalog(): Promise<{ added: number; total: number }> {
  const { prisma } = await import('../../lib/prisma')

  const calculatorTools = LogicToolRegistry.getTools('all')
  const ontologyTools = await OntologyActionToolRegistry.getTools().catch(() => [])

  const rows = [
    ...calculatorTools.map(t => ({ name: t.name, description: t.description ?? '', category: 'CALCULATOR', defaultLevel: 0 })),
    ...ontologyTools.map(t => ({ name: t.name, description: t.description ?? '', category: 'ONTOLOGY_ACTION', defaultLevel: 3 })),
    { name: 'search_knowledge_base', description: 'Semantic search over the public knowledge base and system RAG stores', category: 'CALCULATOR', defaultLevel: 0 },
  ]

  let added = 0
  for (const row of rows) {
    const existing = await (prisma as any).kimmpTool.findUnique({ where: { name: row.name } })
    if (!existing) {
      await (prisma as any).kimmpTool.create({ data: row })
      added++
    }
  }
  const total = await (prisma as any).kimmpTool.count()
  return { added, total }
}
