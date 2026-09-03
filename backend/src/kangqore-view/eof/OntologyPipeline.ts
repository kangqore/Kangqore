// S305 — Data Pipelines: Live Object Population
// "The ontology is no longer manually curated. It stays alive automatically."
// INTERNAL pipelines read straight from our own Prisma tables (ClientCRM,
// Project, User) and upsert one OntologyObject per row, matched by
// externalId. ON_CHANGE is implemented as an explicit single-record sync
// callable from any mutation route — triggerForRecord() — wired into one
// representative touch point (client health/status updates) rather than
// every write path in the codebase, the same scoping choice made for HANUMANAS
// governance events in S298.

import { prisma } from '../../lib/prisma'
import { autoLinkObjects } from './OntologyAutoLink'

type SourceModel = 'clientCRM' | 'project' | 'user'

// ontologyPropertyName -> source row field name
const BUILTIN_PIPELINES: Array<{ name: string; sourceModel: SourceModel; typeName: string; fieldMapping: Record<string, string> }> = [
  { name: 'Clients → Client',         sourceModel: 'clientCRM', typeName: 'Client',   fieldMapping: { name: 'name', health: 'health', tier: 'tier', status: 'status', arr: 'arr' } },
  { name: 'Projects → Project',       sourceModel: 'project',   typeName: 'Project',  fieldMapping: { name: 'title', status: 'status', progress: 'progress', dueDate: 'dueDate' } },
  { name: 'Users → Resource',         sourceModel: 'user',      typeName: 'Resource', fieldMapping: { name: 'name', role: 'role', department: 'company' } },
]

function resolveValue(row: Record<string, any>, sourceField: string): any {
  const v = row[sourceField]
  if (v === null || v === undefined) return null
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'object' && typeof v.toNumber === 'function') return v.toNumber() // Prisma Decimal
  return v
}

async function fetchSourceRows(sourceModel: SourceModel): Promise<Array<Record<string, any>>> {
  switch (sourceModel) {
    case 'clientCRM': return prisma.clientCRM.findMany()
    case 'project':   return prisma.project.findMany()
    case 'user':      return prisma.user.findMany()
    default: return []
  }
}

async function fetchSourceRow(sourceModel: SourceModel, id: string): Promise<Record<string, any> | null> {
  switch (sourceModel) {
    case 'clientCRM': return prisma.clientCRM.findUnique({ where: { id } })
    case 'project':   return prisma.project.findUnique({ where: { id } })
    case 'user':      return prisma.user.findUnique({ where: { id } })
    default: return null
  }
}

export const OntologyPipelineService = {
  BUILTIN_PIPELINES,

  async seedBuiltins(): Promise<Array<{ created: boolean; name: string }>> {
    const results: Array<{ created: boolean; name: string }> = []
    for (const def of BUILTIN_PIPELINES) {
      const existing = await prisma.ontologyPipeline.findUnique({ where: { name: def.name } })
      if (existing) { results.push({ created: false, name: def.name }); continue }
      const type = await prisma.ontologyObjectType.findUnique({ where: { name: def.typeName } })
      if (!type) { results.push({ created: false, name: def.name }); continue } // run /types/seed first
      await prisma.ontologyPipeline.create({
        data: {
          name: def.name, sourceType: 'INTERNAL', sourceQuery: { model: def.sourceModel },
          targetTypeId: type.id, fieldMapping: def.fieldMapping, schedule: 'ON_CHANGE',
        },
      })
      results.push({ created: true, name: def.name })
    }
    return results
  },

  async run(pipelineId: string): Promise<{ objectCount: number }> {
    const pipeline = await prisma.ontologyPipeline.findUniqueOrThrow({ where: { id: pipelineId } })
    if (pipeline.sourceType !== 'INTERNAL') throw new Error(`Pipeline source type "${pipeline.sourceType}" not yet supported — only INTERNAL is wired`)

    const sourceModel = (pipeline.sourceQuery as any)?.model as SourceModel
    const fieldMapping = (pipeline.fieldMapping as Record<string, string>) ?? {}
    const rows = await fetchSourceRows(sourceModel)

    let count = 0
    for (const row of rows) {
      const properties: Record<string, any> = {}
      for (const [ontologyField, sourceField] of Object.entries(fieldMapping)) properties[ontologyField] = resolveValue(row, sourceField)

      const existing = await prisma.ontologyObject.findFirst({ where: { typeId: pipeline.targetTypeId, externalId: row.id } })
      if (existing) {
        await prisma.ontologyObject.update({ where: { id: existing.id }, data: { properties: { ...(existing.properties as object), ...properties } } })
      } else {
        await prisma.ontologyObject.create({ data: { typeId: pipeline.targetTypeId, externalId: row.id, properties } })
      }
      count++
    }

    await prisma.ontologyPipeline.update({ where: { id: pipelineId }, data: { lastRunAt: new Date(), lastObjectCount: count } })
    await autoLinkObjects().catch(() => {}) // best-effort — don't fail the pipeline run over relationship inference

    return { objectCount: count }
  },

  async runAll(): Promise<Array<{ pipelineId: string; name: string; objectCount: number }>> {
    const pipelines = await prisma.ontologyPipeline.findMany({ where: { enabled: true } })
    const results: Array<{ pipelineId: string; name: string; objectCount: number }> = []
    for (const p of pipelines) {
      const { objectCount } = await this.run(p.id).catch(() => ({ objectCount: 0 }))
      results.push({ pipelineId: p.id, name: p.name, objectCount })
    }
    return results
  },

  /** ON_CHANGE — sync a single record right after it mutates, without waiting for the next scheduled run. */
  async triggerForRecord(sourceModel: SourceModel, recordId: string): Promise<void> {
    const def = BUILTIN_PIPELINES.find(p => p.sourceModel === sourceModel)
    if (!def) return
    const pipeline = await prisma.ontologyPipeline.findUnique({ where: { name: def.name } })
    if (!pipeline || !pipeline.enabled) return

    const row = await fetchSourceRow(sourceModel, recordId)
    if (!row) return
    const fieldMapping = (pipeline.fieldMapping as Record<string, string>) ?? {}
    const properties: Record<string, any> = {}
    for (const [ontologyField, sourceField] of Object.entries(fieldMapping)) properties[ontologyField] = resolveValue(row, sourceField)

    const existing = await prisma.ontologyObject.findFirst({ where: { typeId: pipeline.targetTypeId, externalId: recordId } })
    if (existing) {
      await prisma.ontologyObject.update({ where: { id: existing.id }, data: { properties: { ...(existing.properties as object), ...properties } } })
    } else {
      await prisma.ontologyObject.create({ data: { typeId: pipeline.targetTypeId, externalId: recordId, properties } })
    }
  },
}
