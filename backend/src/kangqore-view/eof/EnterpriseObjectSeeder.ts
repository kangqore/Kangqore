// Materialises the Universal Enterprise Object Model into NOLAN.
//
// Idempotent: safe to run on every boot. Types are upserted, schemas are
// refreshed, and cardinality rules are upserted — so editing
// EnterpriseObjectModel.ts and re-running is the whole update path.
//
// Existing types (Client, Project, Risk) are *enriched*, never replaced: they
// already carry live instances, and dropping a schema onto them would be a
// silent migration of real data.

import { prisma } from '../../lib/prisma'
import {
  ENTERPRISE_OBJECTS, ENTERPRISE_RELATIONSHIPS, schemaFor,
} from './EnterpriseObjectModel'

export interface SeedReport {
  typesCreated: number
  typesUpdated: number
  schemasWritten: number
  cardinalityRules: number
  skipped: string[]
}

export async function seedEnterpriseObjectModel(): Promise<SeedReport> {
  const report: SeedReport = {
    typesCreated: 0, typesUpdated: 0, schemasWritten: 0,
    cardinalityRules: 0, skipped: [],
  }

  // ── 1. Object types + schemas ──────────────────────────────────────────────
  for (const def of ENTERPRISE_OBJECTS) {
    const schema = schemaFor(def)
    const existing = await prisma.ontologyObjectType.findUnique({ where: { name: def.name } })

    if (existing) {
      await prisma.ontologyObjectType.update({
        where: { name: def.name },
        data: {
          displayName: def.displayName,
          icon: def.icon,
          color: def.color,
          description: def.description,
          schema: schema as any,
        },
      })
      report.typesUpdated++
    } else {
      await prisma.ontologyObjectType.create({
        data: {
          name: def.name,
          displayName: def.displayName,
          icon: def.icon,
          color: def.color,
          description: def.description,
          schema: schema as any,
        },
      })
      report.typesCreated++
    }
    report.schemasWritten++
  }

  // ── 2. Enrich the three types that predate this model ──────────────────────
  // They hold live instances (Client 6, Project 17), so they get the universal
  // schema without their identity or data being touched.
  const ALIASES: Array<{ existing: string; modelledAs: string }> = [
    { existing: 'Client', modelledAs: 'Customer' },
    { existing: 'Project', modelledAs: 'Program' },   // Project sits at tier 5
    { existing: 'Risk', modelledAs: 'Incident' },
  ]

  for (const a of ALIASES) {
    const type = await prisma.ontologyObjectType.findUnique({ where: { name: a.existing } })
    if (!type) { report.skipped.push(`${a.existing} — type not present`); continue }

    const model = ENTERPRISE_OBJECTS.find(o => o.name === a.modelledAs)
    if (!model) { report.skipped.push(`${a.existing} — no model for ${a.modelledAs}`); continue }

    const current = (type.schema ?? {}) as Record<string, any>
    // Only fill gaps. Anything already declared on the live type wins, so an
    // existing definition is never overwritten by the generic one.
    const merged = { ...schemaFor({ ...model, name: a.existing }), ...current }

    await prisma.ontologyObjectType.update({
      where: { name: a.existing },
      data: { schema: merged as any },
    })
    report.schemasWritten++
  }

  // ── 3. Cardinality rules ───────────────────────────────────────────────────
  // These are what stop the graph from being made invalid — CardinalityEngine
  // enforces them on every relationship write, including from SYSTEM actors.
  for (const rel of ENTERPRISE_RELATIONSHIPS) {
    await prisma.ontologyCardinalityRule.upsert({
      where: {
        sourceType_targetType_relationshipType: {
          sourceType: rel.sourceType,
          targetType: rel.targetType,
          relationshipType: rel.relationshipType,
        },
      },
      create: {
        sourceType: rel.sourceType,
        targetType: rel.targetType,
        relationshipType: rel.relationshipType,
        cardinality: rel.cardinality,
      },
      // `description` lives on RelationshipDef for readability in the model
      // file; the table has no column for it, so it is not persisted.
      update: {
        cardinality: rel.cardinality,
      },
    })
    report.cardinalityRules++
  }

  return report
}
