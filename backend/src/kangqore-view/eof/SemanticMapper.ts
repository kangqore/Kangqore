// F5 — Semantic Mapper
// Translates external system entity references into canonical OntologyObjects.
// "SAP Customer:12345" → "Client:client-cuid-abc"
// "Salesforce Account:A67890" → same "Client:client-cuid-abc"
// WAANDA sees one unified business entity, regardless of source system.

import { prisma } from '../../lib/prisma'
import logger    from '../../utils/logger'

export interface ExternalRef {
  platform:     string  // 'salesforce' | 'jira' | 'hubspot' | ...
  externalType: string  // 'Account' | 'Contact' | 'Issue' | ...
  externalId:   string  // the ID in the external system
}

export interface ResolvedEntity {
  objectId:    string
  objectType:  string   // ontology type name, e.g. 'CLIENT'
  displayName: string
  confidence:  number
  inferredBy:  string
}

// ── Core resolution ───────────────────────────────────────────────────────────

export class SemanticMapper {

  // Resolve a single external ref → OntologyObject (null if unmapped)
  static async resolve(ref: ExternalRef): Promise<ResolvedEntity | null> {
    try {
      const row = await (prisma as any).externalEntityRef.findUnique({
        where: { platform_externalType_externalId: { platform: ref.platform, externalType: ref.externalType, externalId: ref.externalId } },
        include: { object: { include: { type: true } } },
      })
      if (!row) return null
      return {
        objectId:    row.objectId,
        objectType:  row.object.type.name,
        displayName: (row.object.properties as any)?.name ?? row.objectId,
        confidence:  row.confidence,
        inferredBy:  row.inferredBy,
      }
    } catch { return null }
  }

  // Resolve many refs in one DB round-trip
  static async resolveMany(refs: ExternalRef[]): Promise<Map<string, ResolvedEntity>> {
    const result = new Map<string, ResolvedEntity>()
    if (refs.length === 0) return result
    try {
      const rows = await (prisma as any).externalEntityRef.findMany({
        where: {
          OR: refs.map(r => ({ platform: r.platform, externalType: r.externalType, externalId: r.externalId })),
        },
        include: { object: { include: { type: true } } },
      })
      for (const row of rows) {
        const key = `${row.platform}:${row.externalType}:${row.externalId}`
        result.set(key, {
          objectId:    row.objectId,
          objectType:  row.object.type.name,
          displayName: (row.object.properties as any)?.name ?? row.objectId,
          confidence:  row.confidence,
          inferredBy:  row.inferredBy,
        })
      }
    } catch { /* return partial results */ }
    return result
  }

  // ── Type mapping ─────────────────────────────────────────────────────────────

  static async listTypeMappings(platform?: string) {
    try {
      return (prisma as any).semanticTypeMapping.findMany({
        where: platform ? { platform } : {},
        include: { ontologyType: { select: { id: true, name: true, displayName: true } } },
        orderBy: [{ platform: 'asc' }, { priority: 'desc' }],
      })
    } catch { return [] }
  }

  static async createTypeMapping(input: {
    platform:       string
    externalType:   string
    ontologyTypeId: string
    fieldMapping?:  Record<string, string>
    priority?:      number
  }) {
    return (prisma as any).semanticTypeMapping.upsert({
      where:  { platform_externalType: { platform: input.platform, externalType: input.externalType } },
      update: { ontologyTypeId: input.ontologyTypeId, fieldMapping: input.fieldMapping ?? {}, priority: input.priority ?? 0 },
      create: { ...input, fieldMapping: input.fieldMapping ?? {} },
      include: { ontologyType: { select: { id: true, name: true, displayName: true } } },
    })
  }

  static async deleteTypeMapping(id: string) {
    return (prisma as any).semanticTypeMapping.delete({ where: { id } })
  }

  // ── Instance mappings ─────────────────────────────────────────────────────────

  static async listRefs(opts: { platform?: string; externalType?: string; objectId?: string; limit?: number } = {}) {
    const where: any = {}
    if (opts.platform)     where.platform     = opts.platform
    if (opts.externalType) where.externalType = opts.externalType
    if (opts.objectId)     where.objectId     = opts.objectId
    try {
      return (prisma as any).externalEntityRef.findMany({
        where,
        include: { object: { include: { type: { select: { name: true, displayName: true } } } } },
        orderBy: { createdAt: 'desc' },
        take:    opts.limit ?? 100,
      })
    } catch { return [] }
  }

  static async createRef(input: {
    platform:     string
    externalType: string
    externalId:   string
    objectId:     string
    confidence?:  number
    inferredBy?:  string
  }) {
    return (prisma as any).externalEntityRef.upsert({
      where: { platform_externalType_externalId: { platform: input.platform, externalType: input.externalType, externalId: input.externalId } },
      update: { objectId: input.objectId, confidence: input.confidence ?? 1.0, inferredBy: input.inferredBy ?? 'USER' },
      create: { ...input, confidence: input.confidence ?? 1.0, inferredBy: input.inferredBy ?? 'USER' },
      include: { object: { include: { type: { select: { name: true } } } } },
    })
  }

  static async deleteRef(id: string) {
    return (prisma as any).externalEntityRef.delete({ where: { id } })
  }

  // ── Auto-link ─────────────────────────────────────────────────────────────────
  // Given an external entity and its properties, find the best-matching OntologyObject
  // by name similarity. Creates a ref with confidence < 1 if matched automatically.

  static async autoLink(input: {
    platform:     string
    externalType: string
    externalId:   string
    properties:   Record<string, any>  // { name, email, domain, ... }
  }): Promise<{ created: boolean; objectId: string | null; confidence: number }> {
    // First check if already mapped
    const existing = await SemanticMapper.resolve(input)
    if (existing) return { created: false, objectId: existing.objectId, confidence: existing.confidence }

    // Find ontology type for this platform+externalType
    const typeMapping = await (prisma as any).semanticTypeMapping.findUnique({
      where: { platform_externalType: { platform: input.platform, externalType: input.externalType } },
    }).catch(() => null)

    if (!typeMapping) return { created: false, objectId: null, confidence: 0 }

    // Find candidate objects of that type
    const candidates = await (prisma as any).ontologyObject.findMany({
      where: { typeId: typeMapping.ontologyTypeId },
      select: { id: true, properties: true },
      take: 200,
    }).catch(() => [])

    const name  = (input.properties.name  ?? input.properties.Name  ?? '').toLowerCase().trim()
    const email = (input.properties.email ?? input.properties.Email ?? '').toLowerCase().trim()

    let bestId:   string | null = null
    let bestScore = 0

    for (const candidate of candidates) {
      const props: any = candidate.properties ?? {}
      let score = 0

      if (name && props.name && props.name.toLowerCase().includes(name))  score += 0.6
      if (email && props.email && props.email.toLowerCase() === email)    score += 0.9
      if (name && props.name && name.includes(props.name.toLowerCase()))  score += 0.4

      if (score > bestScore) { bestScore = score; bestId = candidate.id }
    }

    if (bestId && bestScore >= 0.4) {
      await SemanticMapper.createRef({ ...input, objectId: bestId, confidence: Math.min(bestScore, 0.95), inferredBy: 'AUTO_LINK' })
      return { created: true, objectId: bestId, confidence: bestScore }
    }

    return { created: false, objectId: null, confidence: 0 }
  }

  // Run auto-link for all objects of a given platform+type
  static async runAutoLinkBatch(platform: string, externalType: string, entities: Array<{ externalId: string; properties: Record<string, any> }>) {
    let linked = 0
    for (const entity of entities) {
      const result = await SemanticMapper.autoLink({ platform, externalType, externalId: entity.externalId, properties: entity.properties })
      if (result.created) linked++
    }
    logger.info(`[SemanticMapper] Auto-linked ${linked}/${entities.length} ${platform}.${externalType} entities`)
    return { total: entities.length, linked }
  }

  // ── Context enrichment ────────────────────────────────────────────────────────
  // Returns a compact summary of how an OntologyObject is referenced externally.
  // Used by KimmpContextAssembler to annotate graph objects.

  static async getExternalIdentities(objectId: string): Promise<Array<{ platform: string; externalType: string; externalId: string; confidence: number }>> {
    try {
      const rows = await (prisma as any).externalEntityRef.findMany({
        where: { objectId },
        select: { platform: true, externalType: true, externalId: true, confidence: true },
      })
      return rows
    } catch { return [] }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────────
  static async stats() {
    try {
      const [typeMappings, totalRefs, confirmedRefs, autoRefs, platformCounts] = await Promise.all([
        (prisma as any).semanticTypeMapping.count(),
        (prisma as any).externalEntityRef.count(),
        (prisma as any).externalEntityRef.count({ where: { inferredBy: 'USER' } }),
        (prisma as any).externalEntityRef.count({ where: { inferredBy: 'AUTO_LINK' } }),
        (prisma as any).externalEntityRef.groupBy({ by: ['platform'], _count: { _all: true } }).catch(() => []),
      ])
      const byPlatform: Record<string, number> = {}
      for (const row of platformCounts as any[]) {
        byPlatform[row.platform] = row._count._all
      }
      return { typeMappings, totalRefs, confirmedRefs, autoRefs, byPlatform }
    } catch {
      return { typeMappings: 0, totalRefs: 0, confirmedRefs: 0, autoRefs: 0, byPlatform: {} }
    }
  }
}
