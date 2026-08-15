// S313 — OntologyAction -> Anthropic Tool schema generator.
//
// The tool_use loop already exists and is live in production (LogicToolRegistry
// in kangqore-immp/tools/logicToolRegistry.ts, wired into commandService.ts).
// Every existing tool is a read-only calculator. This is the bridge that turns
// a real, typed, validated OntologyAction into something Claude can call —
// same live-schema source of truth the S306 SDK generator reads from
// (OntologyAction.parameters), just emitted as an Anthropic Tool.input_schema
// instead of a TypeScript interface.

import type Anthropic from '@anthropic-ai/sdk'
import { prisma } from '../../lib/prisma'
import type { ActionParameterDef, ParamType } from './ActionEngine'

function paramToJsonSchema(param: ActionParameterDef): Record<string, unknown> {
  if (param.enum?.length) {
    return { type: 'string', enum: param.enum, description: param.description }
  }
  const base: Record<string, unknown> = { description: param.description }
  const typeMap: Record<ParamType, string> = {
    string: 'string', number: 'number', boolean: 'boolean', date: 'string',
    enum: 'string', 'object-ref': 'string', 'object-set': 'string',
  }
  base.type = typeMap[param.type] ?? 'string'
  if (param.type === 'number') {
    if (param.min !== undefined) base.minimum = param.min
    if (param.max !== undefined) base.maximum = param.max
  }
  if (param.type === 'string' && param.regex) base.pattern = param.regex
  if (param.type === 'date') base.description = `${param.description ?? ''} (ISO 8601 date string)`.trim()
  if (param.type === 'object-ref') base.description = `${param.description ?? ''} (an OntologyObject id)`.trim()
  if (param.type === 'object-set') base.description = `${param.description ?? ''} (an ObjectSet id)`.trim()
  return base
}

export interface ToolCallableAction {
  id: string
  name: string
  displayName: string
  description: string | null
  typeName: string
  parameters: ActionParameterDef[]
}

async function getToolCallableActions(): Promise<ToolCallableAction[]> {
  const actions = await prisma.ontologyAction.findMany({
    where: { toolCallable: true },
    include: { type: { select: { name: true } } },
    orderBy: { name: 'asc' },
  })
  return actions.map(a => ({
    id: a.id, name: a.name, displayName: a.displayName, description: a.description,
    typeName: a.type?.name ?? 'Unknown', parameters: (a.parameters ?? []) as unknown as ActionParameterDef[],
  }))
}

function buildToolSchema(action: ToolCallableAction): Anthropic.Tool {
  const properties: Record<string, unknown> = {
    objectId: { type: 'string', description: `The OntologyObject id (a ${action.typeName}) this action targets, if applicable` },
  }
  const required: string[] = []
  for (const param of action.parameters) {
    properties[param.name] = paramToJsonSchema(param)
    if (param.required) required.push(param.name)
  }

  return {
    name: action.name,
    description: `${action.displayName}${action.description ? ' — ' + action.description : ''} (acts on ${action.typeName} objects)`,
    input_schema: { type: 'object', properties, required },
  }
}

export const OntologyToolSchema = {
  getToolCallableActions,
  buildToolSchema,
  async generateToolSchemas(): Promise<Anthropic.Tool[]> {
    const actions = await getToolCallableActions()
    return actions.map(buildToolSchema)
  },
}
