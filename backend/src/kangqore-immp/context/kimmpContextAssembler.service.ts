// D1 — KimmpContextAssembler
// Every reasoning, planning, and execution service receives EnterpriseContext.
// Nothing queries the DB directly in the reasoning layer — it calls this instead.

import { prisma } from '../../lib/prisma'
import { KimmpRag } from '../rag/kimmpRag.service'
import { SemanticMapper } from '../../services/semanticMapper.service'
import type { ExternalRef, ResolvedEntity } from '../../services/semanticMapper.service'
import { ObjectSetService } from '../../services/objectSet.service'

export interface EnterpriseContext {
  // Temporal
  currentTime: Date
  // User
  userId:       string
  userProfile:  { id: string; email: string; role: string } | null
  // Signals (HIGH/CRITICAL active)
  signals:      Array<{ id: string; signalType: string; signalValue: string; severity: string; createdAt: Date }>
  // Goals (ACTIVE/APPROVED)
  goals:        Array<{ id: string; objective: string; progressPct: number; status: string; deadline: Date | null }>
  // Graph snapshot (top ontology objects + relationships)
  graph: {
    objects:       Array<{ id: string; name: string; typeName: string; properties: any }>
    relationships: Array<{ id: string; sourceId: string; targetId: string; relationshipType: string; confidence: number }>
  }
  // Recent decisions (last 10)
  decisions:    Array<{ id: string; question: string; selected: string | null; confidence: number; createdAt: Date }>
  // Policies (enabled)
  policies:     Array<{ id: string; name: string; trigger: string; effect: string; condition: any }>
  // Integrations (connected)
  integrations: Array<{ platform: string; enabled: boolean; lastUsedAt: Date | null }>
  // Recent memories
  memories:     Array<{ id: string; type: string; content: string; tags: string[]; createdAt: Date }>
  // Risk profile
  riskProfile: {
    atRiskClients:   number
    unhealthyProjects: number
    overdueInvoices: number
    openRisks:       number
    criticalSignals: number
  }
  // Active workflow runs
  activeWorkflows: Array<{ id: string; workflowId: string; status: string; currentStep: string | null; startedAt: Date }>
  // RAG — KB chunks relevant to the current question (Phase 1)
  ragContext?:   string
  // OAG — resolved canonical entities from external system refs (Phase 2)
  resolvedEntities?: ResolvedEntity[]
  // S294 — named Object Sets matched into structured context instead of an ad-hoc filter
  objectSets?: Array<{ id: string; name: string; count: number; objectIds: string[] }>
  // Optional scoped entity IDs
  goalId?:       string
  workflowId?:   string
  organizationId?: string
}

export interface ContextOptions {
  userId:          string
  organizationId?: string
  goalId?:         string
  workflowId?:     string
  question?:       string
  // OAG — optional cross-system entity refs to resolve into canonical ontology objects
  entityRefs?:     ExternalRef[]
  // S294 — named Object Sets to run and inject as structured context (instead of ad-hoc filters)
  objectSetIds?:   string[]
  // Performance: skip expensive sections when not needed
  skipGraph?:      boolean
  skipDecisions?:  boolean
  skipMemories?:   boolean
}

export class KimmpContextAssembler {

  static async build(opts: ContextOptions): Promise<EnterpriseContext> {
    const now = new Date()

    const [
      userResult, signalsResult, goalsResult, graphResult,
      decisionsResult, policiesResult, integrationsResult,
      memoriesResult, riskResult, workflowsResult,
    ] = await Promise.allSettled([
      // User profile
      prisma.user.findUnique({
        where: { id: opts.userId },
        select: { id: true, email: true, role: true },
      }).catch(() => null),

      // Active HIGH/CRITICAL signals
      (prisma as any).kimmpSignal.findMany({
        where: { severity: { in: ['HIGH', 'CRITICAL'] }, status: 'NEW' },
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: { id: true, signalType: true, signalValue: true, severity: true, createdAt: true },
      }).catch(() => []),

      // Active / approved goals
      (prisma as any).kimmpGoal.findMany({
        where: { status: { in: ['ACTIVE', 'APPROVED', 'IN_PROGRESS'] } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, objective: true, progressPct: true, status: true, deadline: true },
      }).catch(() => []),

      // Ontology graph snapshot — KIMMP is an internal system actor; it may
      // read objects with no marking but must not surface CONFIDENTIAL/RESTRICTED
      // objects into AI context unless the owning user has that clearance.
      // We exclude marked objects from the AI snapshot entirely (fail-safe).
      opts.skipGraph ? Promise.resolve({ objects: [], relationships: [] }) :
      Promise.all([
        prisma.ontologyObject.findMany({
          where: { markings: { isEmpty: true } },
          take: 50,
          include: { type: true },
          orderBy: { createdAt: 'desc' },
        }).catch(() => []),
        prisma.ontologyRelationship.findMany({
          where: { validTo: null, validFrom: { lte: now } },
          take: 100,
          select: { id: true, sourceId: true, targetId: true, relationshipType: true, confidence: true },
        }).catch(() => []),
      ]).then(([objects, relationships]) => ({
        objects: objects.map((o: any) => ({
          id: o.id, name: o.name, typeName: (o.type as any)?.name ?? 'Unknown', properties: o.properties,
        })),
        relationships,
      })),

      // Recent strategic decisions
      opts.skipDecisions ? Promise.resolve([]) :
      (prisma as any).kimmpStrategicDecision.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, question: true, selected: true, confidence: true, createdAt: true },
      }).catch(() => []),

      // Enabled policies
      (prisma as any).kimmpPolicy.findMany({
        where: { enabled: true },
        orderBy: { priority: 'desc' },
        select: { id: true, name: true, trigger: true, effect: true, condition: true },
      }).catch(() => []),

      // Connected integrations
      (prisma as any).orgIntegrationConfig.findMany({
        where: { userId: opts.userId, enabled: true },
        select: { platform: true, enabled: true, lastUsedAt: true },
      }).catch(() => []),

      // Recent memories
      opts.skipMemories ? Promise.resolve([]) :
      (prisma as any).kimmpMemory.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, type: true, content: true, tags: true, createdAt: true },
      }).catch(() => []),

      // Risk profile
      Promise.all([
        prisma.clientCRM.count({ where: { health: { in: ['at-risk', 'critical'] } } }).catch(() => 0),
        prisma.project.count({ where: { health: { lt: 60 } } }).catch(() => 0),
        prisma.invoice.count({ where: { status: 'OVERDUE' } }).catch(() => 0),
        (prisma as any).risk?.count({ where: { status: 'OPEN', severity: { in: ['HIGH', 'CRITICAL'] } } }).catch(() => 0) ?? 0,
      ]).then(([atRiskClients, unhealthyProjects, overdueInvoices, openRisks]) => ({
        atRiskClients, unhealthyProjects, overdueInvoices, openRisks: openRisks ?? 0, criticalSignals: 0,
      })),

      // Active workflow runs
      (prisma as any).kimmpWorkflowRun.findMany({
        where: { status: { in: ['PENDING', 'RUNNING', 'PAUSED'] } },
        orderBy: { startedAt: 'desc' },
        take: 10,
        select: { id: true, workflowId: true, status: true, currentStep: true, startedAt: true },
      }).catch(() => []),
    ])

    const signals    = signalsResult.status    === 'fulfilled' ? signalsResult.value    : []
    const rp         = riskResult.status       === 'fulfilled' ? riskResult.value       : { atRiskClients: 0, unhealthyProjects: 0, overdueInvoices: 0, openRisks: 0, criticalSignals: 0 }
    const graphData  = graphResult.status      === 'fulfilled' ? graphResult.value      : { objects: [], relationships: [] }

    // Phase 1 — RAG: retrieve KB context for the question (if enabled + question provided)
    let ragContext: string | undefined
    if (opts.question) {
      const { contextBlock } = await KimmpRag.query(opts.question, 3)
      if (contextBlock) ragContext = contextBlock
    }

    // Phase 2 — OAG: resolve external entity refs to canonical ontology objects
    let resolvedEntities: ResolvedEntity[] | undefined
    if (opts.entityRefs && opts.entityRefs.length > 0) {
      const resolved = await SemanticMapper.resolveMany(opts.entityRefs)
      if (resolved.size > 0) resolvedEntities = Array.from(resolved.values())
    }

    // S294 — resolve named Object Sets into structured context (matched object IDs)
    let objectSets: EnterpriseContext['objectSets']
    if (opts.objectSetIds && opts.objectSetIds.length > 0) {
      const resolved = await Promise.all(opts.objectSetIds.map(async id => {
        try {
          const set = await prisma.objectSet.findUnique({ where: { id }, select: { id: true, name: true } })
          if (!set) return null
          const { objects } = await ObjectSetService.execute(id)
          return { id: set.id, name: set.name, count: objects.length, objectIds: objects.map((o: any) => o.id) }
        } catch { return null }
      }))
      const present = resolved.filter((r): r is NonNullable<typeof r> => r !== null)
      if (present.length > 0) objectSets = present
    }

    return {
      currentTime:      now,
      userId:           opts.userId,
      userProfile:      userResult.status === 'fulfilled' ? userResult.value : null,
      signals,
      goals:            goalsResult.status        === 'fulfilled' ? goalsResult.value        : [],
      graph:            graphData,
      decisions:        decisionsResult.status    === 'fulfilled' ? decisionsResult.value    : [],
      policies:         policiesResult.status     === 'fulfilled' ? policiesResult.value     : [],
      integrations:     integrationsResult.status === 'fulfilled' ? integrationsResult.value : [],
      memories:         memoriesResult.status     === 'fulfilled' ? memoriesResult.value     : [],
      riskProfile:      { ...rp, criticalSignals: signals.filter((s: any) => s.severity === 'CRITICAL').length },
      activeWorkflows:  workflowsResult.status    === 'fulfilled' ? workflowsResult.value    : [],
      ragContext,
      resolvedEntities,
      objectSets,
      goalId:           opts.goalId,
      workflowId:       opts.workflowId,
      organizationId:   opts.organizationId,
    }
  }

  // ── Phase 2: Format the entity graph as a human-readable context block ────────
  private static formatGraph(
    objects:       EnterpriseContext['graph']['objects'],
    relationships: EnterpriseContext['graph']['relationships'],
    organizationId?: string,
  ): string {
    if (objects.length === 0) return ''

    // Build a lookup from object id → object
    const byId = new Map(objects.map(o => [o.id, o]))

    // Scope to org if provided — filter objects whose properties.organizationId matches
    const scoped = organizationId
      ? objects.filter(o => !o.properties?.organizationId || o.properties.organizationId === organizationId)
      : objects.slice(0, 30)

    if (scoped.length === 0) return ''

    // Build adjacency: for each object, list what it links to
    const adjacency = new Map<string, Array<{ rel: string; target: string }>>()
    for (const r of relationships) {
      if (!adjacency.has(r.sourceId)) adjacency.set(r.sourceId, [])
      const target = byId.get(r.targetId)
      if (target) adjacency.get(r.sourceId)!.push({ rel: r.relationshipType, target: `${target.name} [${target.typeName}]` })
    }

    const lines: string[] = ['Active business graph:']
    for (const obj of scoped.slice(0, 20)) {
      const links = adjacency.get(obj.id) ?? []
      const props = obj.properties ?? {}
      const meta: string[] = []
      if (props.health !== undefined)  meta.push(`health ${props.health}%`)
      if (props.status !== undefined)  meta.push(`status ${props.status}`)
      if (props.amount !== undefined)  meta.push(`£${props.amount}`)
      lines.push(`• ${obj.name} [${obj.typeName}]${meta.length ? ' — ' + meta.join(', ') : ''}`)
      for (const lnk of links.slice(0, 4)) {
        lines.push(`  └─ ${lnk.rel.replace(/_/g, ' ')} → ${lnk.target}`)
      }
    }

    return lines.join('\n')
  }

  // Summarise context into a compact string for LLM prompts
  static summarise(ctx: EnterpriseContext): string {
    const lines: string[] = [
      `Time: ${ctx.currentTime.toISOString()}`,
    ]
    if (ctx.riskProfile.criticalSignals > 0) lines.push(`CRITICAL SIGNALS: ${ctx.riskProfile.criticalSignals}`)
    if (ctx.signals.length > 0) lines.push(`Active signals: ${ctx.signals.slice(0, 5).map(s => `${s.signalType}:${s.signalValue}`).join(', ')}`)
    if (ctx.goals.length > 0)   lines.push(`Active goals: ${ctx.goals.map(g => `"${g.objective}" (${g.progressPct}%)`).join(', ')}`)
    if (ctx.riskProfile.atRiskClients > 0)    lines.push(`At-risk clients: ${ctx.riskProfile.atRiskClients}`)
    if (ctx.riskProfile.unhealthyProjects > 0) lines.push(`Unhealthy projects: ${ctx.riskProfile.unhealthyProjects}`)
    if (ctx.riskProfile.overdueInvoices > 0)  lines.push(`Overdue invoices: ${ctx.riskProfile.overdueInvoices}`)
    if (ctx.integrations.length > 0) lines.push(`Integrations: ${ctx.integrations.map(i => i.platform).join(', ')}`)
    if (ctx.activeWorkflows.length > 0) lines.push(`Running workflows: ${ctx.activeWorkflows.length}`)

    // Phase 2 — OAG: resolved cross-system entities
    if (ctx.resolvedEntities && ctx.resolvedEntities.length > 0) {
      lines.push(`Resolved entities: ${ctx.resolvedEntities.map(e => `${e.displayName} [${e.objectType}]`).join(', ')}`)
    }

    // S294 — named Object Sets matched for this run
    if (ctx.objectSets && ctx.objectSets.length > 0) {
      lines.push(`Object Sets in scope: ${ctx.objectSets.map(s => `"${s.name}" (${s.count} objects)`).join(', ')}`)
    }

    // Phase 2 — OAG: entity graph (scoped, human-readable)
    const graphBlock = KimmpContextAssembler.formatGraph(
      ctx.graph.objects,
      ctx.graph.relationships,
      ctx.organizationId,
    )
    if (graphBlock) lines.push('\n' + graphBlock)

    // Phase 1 — RAG: KB context block (appended last so it's close to the question)
    if (ctx.ragContext) lines.push('\n' + ctx.ragContext)

    return lines.join('\n')
  }
}
