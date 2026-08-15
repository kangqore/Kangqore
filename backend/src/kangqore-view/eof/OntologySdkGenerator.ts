// S306 — Ontology-Generated TypeScript + Python SDK.
//
// Reality check: OntologyObjectType.schema is almost always `{}` in this
// codebase today (DEFAULT_TYPES creates types with no schema at all — see
// admin-ontology.ts DEFAULT_TYPES). A generator that only trusted the
// declared schema would emit empty interfaces for nearly every real type.
// So field inference is two-tier: declared schema fields win when present,
// and any field observed on live OntologyObject.properties samples that
// isn't already declared gets appended as an inferred field. This mirrors
// how schema-on-read systems (and Palantir's own type inference from
// connected sources) actually work in practice.

import { prisma } from '../../lib/prisma'
import crypto from 'crypto'

type FieldType = 'string' | 'number' | 'boolean' | 'geopoint' | 'date' | 'unknown'

interface FieldDef {
  name: string
  type: FieldType
  required: boolean
  enumValues?: string[]
  inferred: boolean   // true if not present in OntologyObjectType.schema
}

interface TypeShape {
  id: string
  name: string
  displayName: string
  fields: FieldDef[]
}

interface ActionParamDef {
  name: string
  type: string
  required?: boolean
  enum?: string[]
  description?: string
}

interface ActionShape {
  id: string
  name: string
  displayName: string
  typeName: string
  parameters: ActionParamDef[]
}

interface ObjectSetShape {
  id: string
  name: string
  rootTypeName: string | null
}

const SAMPLE_SIZE = 25

function inferValueType(v: unknown): FieldType {
  if (v === null || v === undefined) return 'unknown'
  if (typeof v === 'string') {
    return /^\d{4}-\d{2}-\d{2}T/.test(v) ? 'date' : 'string'
  }
  if (typeof v === 'number') return 'number'
  if (typeof v === 'boolean') return 'boolean'
  if (typeof v === 'object' && !Array.isArray(v)) {
    const obj = v as Record<string, unknown>
    if (typeof obj.lat === 'number' && typeof obj.lng === 'number') return 'geopoint'
  }
  return 'unknown'
}

async function inferFieldsFromSamples(typeId: string, declared: Set<string>): Promise<FieldDef[]> {
  const samples = await prisma.ontologyObject.findMany({
    where: { typeId },
    select: { properties: true },
    take: SAMPLE_SIZE,
    orderBy: { createdAt: 'desc' },
  })

  const observed = new Map<string, FieldType>()
  const presentCount = new Map<string, number>()

  for (const s of samples) {
    const props = (s.properties ?? {}) as Record<string, unknown>
    for (const [key, val] of Object.entries(props)) {
      if (declared.has(key)) continue
      const t = inferValueType(val)
      if (t === 'unknown') continue
      presentCount.set(key, (presentCount.get(key) ?? 0) + 1)
      const existing = observed.get(key)
      if (!existing) observed.set(key, t)
      else if (existing !== t) observed.set(key, 'unknown') // conflicting types across samples
    }
  }

  return Array.from(observed.entries()).map(([name, type]) => ({
    name,
    type,
    required: (presentCount.get(name) ?? 0) === samples.length && samples.length > 0,
    inferred: true,
  }))
}

async function buildTypeShapes(): Promise<TypeShape[]> {
  const types = await prisma.ontologyObjectType.findMany({ orderBy: { name: 'asc' } })
  const shapes: TypeShape[] = []

  for (const t of types) {
    const declaredSchema = (t.schema ?? {}) as Record<string, { type?: string; required?: boolean; enumValues?: string[] }>
    const declaredFields: FieldDef[] = Object.entries(declaredSchema).map(([name, def]) => ({
      name,
      type: (['string', 'number', 'boolean', 'geopoint', 'date'].includes(def.type ?? '') ? def.type : 'unknown') as FieldType,
      required: !!def.required,
      enumValues: def.enumValues,
      inferred: false,
    }))

    const inferredFields = await inferFieldsFromSamples(t.id, new Set(declaredFields.map(f => f.name)))

    shapes.push({
      id: t.id,
      name: t.name,
      displayName: t.displayName,
      fields: [...declaredFields, ...inferredFields].sort((a, b) => a.name.localeCompare(b.name)),
    })
  }

  return shapes
}

async function buildActionShapes(): Promise<ActionShape[]> {
  const actions = await prisma.ontologyAction.findMany({
    include: { type: { select: { name: true } } },
    orderBy: { name: 'asc' },
  })
  return actions.map(a => ({
    id: a.id,
    name: a.name,
    displayName: a.displayName,
    typeName: a.type?.name ?? 'Unknown',
    parameters: (a.parameters ?? []) as unknown as ActionParamDef[],
  }))
}

async function buildObjectSetShapes(): Promise<ObjectSetShape[]> {
  const sets = await prisma.objectSet.findMany({
    include: { rootType: { select: { name: true } } },
    orderBy: { name: 'asc' },
  })
  return sets.map(s => ({ id: s.id, name: s.name, rootTypeName: s.rootType?.name ?? null }))
}

function pascalCase(name: string): string {
  return name.replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase())
}

function camelCase(name: string): string {
  const p = pascalCase(name)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

function tsType(f: FieldDef): string {
  if (f.enumValues?.length) return f.enumValues.map(v => `'${v}'`).join(' | ')
  switch (f.type) {
    case 'string':   return 'string'
    case 'number':   return 'number'
    case 'boolean':  return 'boolean'
    case 'date':     return 'string'
    case 'geopoint': return '{ lat: number; lng: number }'
    default:         return 'unknown'
  }
}

function tsParamType(p: ActionParamDef): string {
  if (p.enum?.length) return p.enum.map(v => `'${v}'`).join(' | ')
  switch (p.type) {
    case 'number':  return 'number'
    case 'boolean': return 'boolean'
    case 'date':    return 'string'
    case 'object-ref':
    case 'object-set':
    case 'string':
    default:        return 'string'
  }
}

function pyType(f: FieldDef): string {
  if (f.enumValues?.length) return 'str'
  switch (f.type) {
    case 'string':   return 'str'
    case 'number':   return 'float'
    case 'boolean':  return 'bool'
    case 'date':     return 'str'
    case 'geopoint': return 'Dict[str, float]'
    default:         return 'Any'
  }
}

// S326 — the operational surface (Gateway/Registry/Eval/Agent Studio), read
// APIs only, appended to the same generated file. There's no live shape to
// infer here the way object types are — v1/kimmpOps.ts's response shapes are
// fixed and metadata-scoped (no prompt/response text, no prompt content, no
// systemPrompt), so this is hand-written once rather than generated per-field.
function generateOperationalTypeScript(): string {
  return `// ── KIMMP Operations Client — Gateway, Prompt Registry, Eval, Agent Studio ──
// Read-only, metadata-scoped: call rows expose cost/latency/status (never
// prompt/response text), prompts expose name/version (never content), agents
// expose role/model (never systemPrompt). Same auth as OntologyClient above.

export interface KimmpCallSummary {
  id: string; actorType: string; model: string; provider: string
  promptTokens: number; completionTokens: number; totalCost: number; latencyMs: number
  taskType: string | null; agentRole: string | null; status: string
  promptName: string | null; promptVersion: number | null; createdAt: string
}
export interface KimmpCostSummary { days: number; totalCost: number; totalTokens: number; callCount: number }
export interface KimmpPromptSummary { name: string; activeVersion: number; totalVersions: number }
export interface KimmpReadiness {
  benchmark: { score: number; passCount: number; driftAlert: boolean; at: string } | null
  runtime35: { score: number; passCount: number; failCount: number; at: string } | null
}
export interface KimmpAgentSummary {
  id: string; name: string; role: string; description: string | null
  status: string; model: string; tools: string[]; maxLevel: number; createdAt: string
}

export class KimmpOperationsClient {
  private readonly headers: Record<string, string>
  private readonly base: string

  constructor({ apiKey, baseUrl = 'https://yourdomain.com' }: OntologyClientOptions) {
    this.base = baseUrl.replace(/\\/$/, '') + '/api/v1/kimmp'
    this.headers = { Authorization: \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' }
  }

  private async req<T>(path: string): Promise<T> {
    const res = await fetch(this.base + path, { headers: this.headers })
    if (!res.ok) throw new Error(\`Kangqore KIMMP Ops API error \${res.status}: \${await res.text()}\`)
    return res.json() as Promise<T>
  }

  calls(opts: { page?: number; limit?: number; status?: string } = {}): Promise<{ data: KimmpCallSummary[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams(opts as Record<string, string>).toString()
    return this.req(\`/calls\${params ? '?' + params : ''}\`)
  }

  cost(days = 30): Promise<{ data: KimmpCostSummary }> {
    return this.req(\`/cost?days=\${days}\`)
  }

  prompts(): Promise<{ data: KimmpPromptSummary[]; count: number }> {
    return this.req('/prompts')
  }

  readiness(): Promise<{ data: KimmpReadiness }> {
    return this.req('/readiness')
  }

  agents(): Promise<{ data: KimmpAgentSummary[]; count: number }> {
    return this.req('/agents')
  }
}
`
}

function generateOperationalPython(): string {
  return `

# ── KIMMP Operations Client — Gateway, Prompt Registry, Eval, Agent Studio ──
# Read-only, metadata-scoped: same fields as the TypeScript KimmpOperationsClient.

class KimmpOperationsClient:
    def __init__(self, api_key: str, base_url: str = "https://yourdomain.com"):
        self._base = base_url.rstrip("/") + "/api/v1/kimmp"
        self._headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    def _get(self, path: str) -> Dict:
        r = requests.get(self._base + path, headers=self._headers)
        r.raise_for_status()
        return r.json()

    def calls(self, page: int = 1, limit: int = 20, status: Optional[str] = None) -> Dict:
        params = {"page": page, "limit": limit}
        if status:
            params["status"] = status
        r = requests.get(self._base + "/calls", headers=self._headers, params=params)
        r.raise_for_status()
        return r.json()

    def cost(self, days: int = 30) -> Dict:
        return self._get(f"/cost?days={days}")

    def prompts(self) -> Dict:
        return self._get("/prompts")

    def readiness(self) -> Dict:
        return self._get("/readiness")

    def agents(self) -> Dict:
        return self._get("/agents")
`
}

export function generateTypeScript(types: TypeShape[], actions: ActionShape[], objectSets: ObjectSetShape[]): string {
  const interfaces = types.map(t => {
    const fields = t.fields.map(f => `  ${f.name}${f.required ? '' : '?'}: ${tsType(f)}${f.inferred ? '  // inferred from live data' : ''}`).join('\n')
    return `export interface ${pascalCase(t.name)} {\n  id: string\n${fields}\n}`
  }).join('\n\n')

  const actionParamInterfaces = actions.map(a => {
    const fields = a.parameters.map(p => `  ${p.name}${p.required ? '' : '?'}: ${tsParamType(p)}`).join('\n')
    return `export interface ${pascalCase(a.name)}Params {\n${fields || '  [key: string]: unknown'}\n}`
  }).join('\n\n')

  const objectApis = types.map(t => `    ${t.name}: {
      where: (filter: Record<string, unknown> = {}) => ({
        execute: () => this.listObjects<${pascalCase(t.name)}>('${t.name}', filter),
      }),
      get: (id: string) => this.getObject<${pascalCase(t.name)}>('${t.name}', id),
    },`).join('\n')

  const actionApis = actions.map(a =>
    `    ${a.name}: { execute: (params: ${pascalCase(a.name)}Params, objectId?: string) => this.executeAction('${a.id}', params, objectId) },`
  ).join('\n')

  const objectSetApis = objectSets.map(s =>
    `    // '${s.name}' → ${s.rootTypeName ?? 'mixed'}\n    '${s.id}': { execute: () => this.executeObjectSet('${s.id}') },`
  ).join('\n')

  return `/**
 * Kangqore SDK — TypeScript
 * Ontology surface generated live from OntologyObjectType / OntologyAction /
 * ObjectSet definitions; KIMMP Operations surface (Gateway, Prompt Registry,
 * Eval, Agent Studio) is read-only and metadata-scoped — see S326.
 * Regenerate any time via GET /admin/ontology/sdk/typescript — do not hand-edit.
 */

// ── Object Type Interfaces ──────────────────────────────────────────────────

${interfaces || '// No object types defined yet — seed types via POST /admin/ontology/types/seed'}

// ── Action Parameter Interfaces ─────────────────────────────────────────────

${actionParamInterfaces || '// No actions defined yet'}

// ── Client ───────────────────────────────────────────────────────────────────

export interface OntologyClientOptions {
  apiKey: string
  baseUrl?: string
}

export class OntologyClient {
  private readonly headers: Record<string, string>
  private readonly base: string

  constructor({ apiKey, baseUrl = 'https://yourdomain.com' }: OntologyClientOptions) {
    this.base = baseUrl.replace(/\\/$/, '') + '/api/v1/ontology'
    this.headers = { Authorization: \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' }
  }

  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.base + path, { method, headers: this.headers, body: body ? JSON.stringify(body) : undefined })
    if (!res.ok) throw new Error(\`Kangqore Ontology API error \${res.status}: \${await res.text()}\`)
    return res.json() as Promise<T>
  }

  listObjects<T>(typeName: string, filter: Record<string, unknown> = {}): Promise<{ objects: T[]; count: number }> {
    return this.req('POST', \`/objects/\${typeName}/query\`, { filter })
  }

  getObject<T>(typeName: string, id: string): Promise<{ object: T }> {
    return this.req('GET', \`/objects/\${typeName}/\${id}\`)
  }

  executeAction(actionId: string, params: Record<string, unknown>, objectId?: string): Promise<{ execution: unknown }> {
    return this.req('POST', \`/actions/\${actionId}/execute\`, { params, objectId })
  }

  executeObjectSet(objectSetId: string): Promise<{ objects: unknown[]; count: number }> {
    return this.req('POST', \`/object-sets/\${objectSetId}/execute\`)
  }

  objects = {
${objectApis || '    // no object types yet'}
  }

  actions = {
${actionApis || '    // no actions yet'}
  }

  objectSets = {
${objectSetApis || '    // no object sets yet'}
  }
}

${generateOperationalTypeScript()}
/* Quick-start:

import { OntologyClient, KimmpOperationsClient } from './kangqore-ontology-sdk'

const ontology = new OntologyClient({ apiKey: 'kq_live_YOUR_PARTNER_KEY' })
const kimmp    = new KimmpOperationsClient({ apiKey: 'kq_live_YOUR_PARTNER_KEY' })

const { objects } = await ontology.objects.Client.where({ tier: 'ENTERPRISE' }).execute()
const highRisk = await ontology.objectSets['<object-set-id>'].execute()
await ontology.actions.ApproveRenewal.execute({ reason: 'On-time payment history' }, '<clientObjectId>')

const { data: recentCalls } = await kimmp.calls({ limit: 10 })
const { data: readiness }   = await kimmp.readiness()

*/
`
}

export function generatePython(types: TypeShape[], actions: ActionShape[]): string {
  const dataclasses = types.map(t => {
    const fields = t.fields.map(f => `    ${f.name}: Optional[${pyType(f)}] = None${f.inferred ? '  # inferred from live data' : ''}`).join('\n')
    return `@dataclass\nclass ${pascalCase(t.name)}:\n    id: str\n${fields}`
  }).join('\n\n\n')

  const actionMethods = actions.map(a => {
    const pyName = a.name.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()
    return `    def execute_${pyName}(self, params: Dict[str, Any], object_id: Optional[str] = None) -> Dict:\n        return self._post(f"/actions/${a.id}/execute", {"params": params, "objectId": object_id})`
  }).join('\n\n')

  return `"""
Kangqore Ontology SDK — Python
Generated live from OntologyObjectType / OntologyAction definitions.
Regenerate any time via GET /admin/ontology/sdk/python — do not hand-edit.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import requests


${dataclasses || '# No object types defined yet'}


class OntologyClient:
    def __init__(self, api_key: str, base_url: str = "https://yourdomain.com"):
        self._base = base_url.rstrip("/") + "/api/v1/ontology"
        self._headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    def _get(self, path: str) -> Dict:
        r = requests.get(self._base + path, headers=self._headers)
        r.raise_for_status()
        return r.json()

    def _post(self, path: str, body: Dict) -> Dict:
        r = requests.post(self._base + path, headers=self._headers, json=body)
        r.raise_for_status()
        return r.json()

    def list_objects(self, type_name: str, filter: Optional[Dict] = None) -> Dict:
        return self._post(f"/objects/{type_name}/query", {"filter": filter or {}})

    def get_object(self, type_name: str, object_id: str) -> Dict:
        return self._get(f"/objects/{type_name}/{object_id}")

    def execute_object_set(self, object_set_id: str) -> Dict:
        return self._post(f"/object-sets/{object_set_id}/execute", {})

${actionMethods || '    # No actions defined yet'}
${generateOperationalPython()}`
}

function computeSchemaHash(types: TypeShape[], actions: ActionShape[], objectSets: ObjectSetShape[]): string {
  const fingerprint = {
    types: types.map(t => ({ name: t.name, fields: t.fields.map(f => `${f.name}:${f.type}:${f.required}`) })),
    actions: actions.map(a => ({ name: a.name, params: a.parameters.map(p => `${p.name}:${p.type}`) })),
    objectSets: objectSets.map(s => s.id),
  }
  return crypto.createHash('sha256').update(JSON.stringify(fingerprint)).digest('hex')
}

function diffTypeLists(prev: any, curr: { types: TypeShape[]; actions: ActionShape[] }) {
  const prevTypeNames: string[] = prev?.typeNames ?? []
  const prevActionNames: string[] = prev?.actionNames ?? []
  const currTypeNames = curr.types.map(t => t.name)
  const currActionNames = curr.actions.map(a => a.name)

  return {
    typesAdded: currTypeNames.filter(n => !prevTypeNames.includes(n)),
    typesRemoved: prevTypeNames.filter(n => !currTypeNames.includes(n)),
    actionsAdded: currActionNames.filter(n => !prevActionNames.includes(n)),
    actionsRemoved: prevActionNames.filter(n => !currActionNames.includes(n)),
    typeNames: currTypeNames,
    actionNames: currActionNames,
  }
}

export const OntologySdkGenerator = {
  async buildShapes() {
    const [types, actions, objectSets] = await Promise.all([
      buildTypeShapes(),
      buildActionShapes(),
      buildObjectSetShapes(),
    ])
    return { types, actions, objectSets }
  },

  async typescript(): Promise<string> {
    const { types, actions, objectSets } = await this.buildShapes()
    return generateTypeScript(types, actions, objectSets)
  },

  async python(): Promise<string> {
    const { types, actions } = await this.buildShapes()
    return generatePython(types, actions)
  },

  async schema() {
    return this.buildShapes()
  },

  // Records a new OntologySdkVersion if the live schema changed since the last
  // recorded version; always returns the current + latest-known diff either way.
  async recordVersionIfChanged() {
    const { types, actions, objectSets } = await this.buildShapes()
    const schemaHash = computeSchemaHash(types, actions, objectSets)

    const latest = await prisma.ontologySdkVersion.findFirst({ orderBy: { createdAt: 'desc' } })
    if (latest?.schemaHash === schemaHash) return latest

    const diff = diffTypeLists(latest?.diffFromPrevious, { types, actions })
    const version = await prisma.ontologySdkVersion.create({
      data: {
        schemaHash,
        typesCount: types.length,
        actionsCount: actions.length,
        objectSetsCount: objectSets.length,
        diffFromPrevious: diff,
      },
    })
    return version
  },

  async changelog(limit = 20) {
    return prisma.ontologySdkVersion.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
  },
}
