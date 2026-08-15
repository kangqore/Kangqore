// ---------------------------------------------------------------------------
// Migration Accelerator — Overshadow Roadmap P7.2.
//
// "The 'Together' pattern the playbook recommends for most modules — tooling
// that reads from an existing ServiceNow CMDB/module export and populates
// Kangqore View's ontology, so the sales motion is genuinely 'coexist first',
// not a forced rip-and-replace pitch."
//
// A generic CSV → OntologyObject importer, marketed for the ServiceNow CMDB
// coexistence use case but genuinely works for any CSV: paste/upload, map
// columns to a target OntologyObjectType's schema, upsert objects matched by
// an optional externalId column, and record a batch for provenance. This is
// the one-shot counterpart to OntologyPipeline's recurring INTERNAL runs —
// OntologyPipeline.sourceType already reserved "CSV" but the run() path
// threw for anything but INTERNAL. This is that gap, closed for real.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'
import { parseCsv } from '../../utils/csv'
import { autoLinkObjects } from './OntologyAutoLink'

export interface ColumnMapping {
  [ontologyPropertyName: string]: string // -> CSV header name
}

export async function previewCsv(text: string) {
  const { headers, rows } = parseCsv(text)
  return { headers, sampleRows: rows.slice(0, 10), rowCount: rows.length }
}

export async function runCsvImport(params: {
  text: string
  typeId: string
  columnMapping: ColumnMapping
  externalIdColumn?: string
  objectSetName?: string
  fileName?: string
  importedBy?: string
}) {
  const { text, typeId, columnMapping, externalIdColumn, objectSetName, fileName, importedBy } = params

  const type = await prisma.ontologyObjectType.findUniqueOrThrow({ where: { id: typeId } })
  const { rows } = parseCsv(text)

  let objectSet = null as Awaited<ReturnType<typeof prisma.objectSet.findFirst>> | null
  if (objectSetName?.trim()) {
    objectSet = await prisma.objectSet.findFirst({ where: { name: objectSetName.trim() } })
    if (!objectSet) {
      objectSet = await prisma.objectSet.create({
        data: {
          name: objectSetName.trim(),
          description: `Populated by the Migration Accelerator (Overshadow Roadmap P7.2) from a CSV import into ${type.displayName}.`,
          rootTypeId: typeId, query: {}, tags: ['csv-import', 'servicenow-migration'], isSystem: true,
        },
      })
    }
  }

  let createdCount = 0
  let updatedCount = 0
  const errors: Array<{ row: number; message: string }> = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    try {
      const properties: Record<string, any> = {}
      for (const [ontologyField, csvColumn] of Object.entries(columnMapping)) {
        const v = row[csvColumn]
        if (v !== undefined && v !== '') properties[ontologyField] = v
      }

      const externalId = externalIdColumn ? row[externalIdColumn] || null : null
      const existing = externalId
        ? await prisma.ontologyObject.findFirst({ where: { typeId, externalId } })
        : null

      let obj
      if (existing) {
        obj = await prisma.ontologyObject.update({
          where: { id: existing.id },
          data: { properties: { ...(existing.properties as object), ...properties } },
        })
        updatedCount++
      } else {
        obj = await prisma.ontologyObject.create({ data: { typeId, externalId, properties } })
        createdCount++
      }

      if (objectSet) {
        await prisma.objectSetMembership.upsert({
          where: { objectSetId_objectId: { objectSetId: objectSet.id, objectId: obj.id } },
          create: { objectSetId: objectSet.id, objectId: obj.id },
          update: {},
        })
      }
    } catch (err: any) {
      errors.push({ row: i + 1, message: err.message })
    }
  }

  if (objectSet) {
    const count = await prisma.objectSetMembership.count({ where: { objectSetId: objectSet.id } })
    await prisma.objectSet.update({ where: { id: objectSet.id }, data: { lastRunAt: new Date(), lastCount: count } })
  }

  const batch = await prisma.ontologyCsvImportBatch.create({
    data: {
      typeId, objectSetId: objectSet?.id ?? null, sourceLabel: 'CSV Import', fileName: fileName ?? null,
      rowCount: rows.length, createdCount, updatedCount, errorCount: errors.length,
      errors: errors as any, importedBy: importedBy ?? null,
    },
  })

  await autoLinkObjects().catch(() => {}) // best-effort, same posture as OntologyPipelineService.run()

  return { batch, createdCount, updatedCount, errorCount: errors.length, errors }
}

export async function listImportBatches() {
  return prisma.ontologyCsvImportBatch.findMany({
    include: {
      type: { select: { name: true, displayName: true, icon: true, color: true } },
      objectSet: { select: { name: true, lastCount: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}
