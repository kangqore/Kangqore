// S300 — Canvas ↔ Ontology Bridge
// "Everything is one graph. Every view is a projection." Creating a canvas
// node creates an OntologyObject; wiring onSuccess/onFailure between two
// bridged nodes creates an OntologyRelationship. The canvas becomes a visual
// editor for the live ontology — not a separate system that happens to look
// similar.
//
// Reality check against the actual data model: there is no WorkflowStep or
// WorkflowEdge table. `OsWorkflow.steps` is a single Json array
// (frontend/src/os/features/workflows/types.ts#WorkflowStep), and edges are
// flattened into each step's onSuccess/onFailure (next step id) at save time
// — see WorkflowCanvas.tsx's deploy stage. This service bridges that reality,
// not the roadmap doc's literal (and here, nonexistent) relational schema.

import { prisma } from '../../lib/prisma'

export interface BridgeStep {
  id: string
  type: string
  name: string
  description?: string
  onSuccess?: string
  onFailure?: string
  ontologyObjectId?: string
  [key: string]: any
}

// Only "thinking" and "enterprise architecture" node types represent ontology
// concepts. Operational nodes (notify/wait/agent/...) and agent-pipeline nodes
// (trigger/tool/store/...) are automation wiring, not business objects.
export const BRIDGED_TYPE_CFG: Record<string, { displayName: string; icon: string; color: string; description: string }> = {
  goal:       { displayName: 'Goal',       icon: 'Target',      color: '#f43f5e', description: 'What a workflow is trying to achieve' },
  context:    { displayName: 'Context',    icon: 'Database',    color: '#06b6d4', description: 'What the system knows right now' },
  analyze:    { displayName: 'Analysis',   icon: 'ChartBar',    color: '#6366f1', description: 'Facts and patterns extracted from context' },
  insight:    { displayName: 'Insight',    icon: 'Lightbulb',   color: '#f59e0b', description: 'Why something matters — causal interpretation' },
  hypothesis: { displayName: 'Hypothesis', icon: 'Flask',       color: '#84cc16', description: 'A testable claim' },
  simulate:   { displayName: 'Simulation', icon: 'Dice',        color: '#f97316', description: 'What happens if we do X' },
  decision:   { displayName: 'Decision',   icon: 'Scales',      color: '#8b5cf6', description: 'What should be done' },
  policy:     { displayName: 'Policy',     icon: 'Shield',      color: '#ef4444', description: 'A rule that constrains execution' },
  execute:    { displayName: 'Execution',  icon: 'Lightning',   color: '#84cc16', description: 'The action taken' },
  learn:      { displayName: 'Learning',   icon: 'BookOpen',    color: '#14b8a6', description: 'Recorded outcome — enterprise memory' },
  kpi:        { displayName: 'KPI',        icon: 'TrendUp',     color: '#eab308', description: 'A strategic outcome measure' },
  department: { displayName: 'Department', icon: 'Buildings',   color: '#2563eb', description: 'An organizational unit or division' },
  team:       { displayName: 'Team',       icon: 'Users',       color: '#059669', description: 'A squad or working group' },
  objective:  { displayName: 'Objective',  icon: 'Crosshair',   color: '#6366f1', description: 'A measurable OKR or strategic objective' },
  budget:     { displayName: 'Budget',     icon: 'Wallet',      color: '#d97706', description: 'A cost center or budget allocation' },
  risk:       { displayName: 'Risk',       icon: 'Warning',     color: '#ef4444', description: 'A business risk or exposure item' },
  milestone:  { displayName: 'Milestone',  icon: 'Flag',        color: '#f97316', description: 'A key delivery checkpoint' },
}

export const BRIDGED_TYPES = new Set(Object.keys(BRIDGED_TYPE_CFG))

// Inferred relationshipType per (sourceStepType, targetStepType) pair —
// mirrors the OODA-style flow the intelligence canvas is built around.
const RELATIONSHIP_INFERENCE: Record<string, string> = {
  'goal->context':       'CONTEXTUALIZES',
  'context->analyze':    'INFORMS',
  'analyze->insight':    'REVEALS',
  'insight->hypothesis': 'GENERATES',
  'hypothesis->simulate':'TESTED_BY',
  'simulate->decision':  'SUPPORTS',
  'decision->policy':    'CONSTRAINED_BY',
  'decision->execute':   'TRIGGERS',
  'policy->execute':     'GOVERNS',
  'execute->learn':      'FEEDS',
  'learn->kpi':          'MEASURES',
  'kpi->goal':           'ANCHORS',
  'department->team':    'CONTAINS',
  'team->objective':     'OWNS',
  'objective->budget':   'FUNDED_BY',
  'objective->milestone':'TRACKED_BY',
  'risk->objective':     'THREATENS',
  'budget->risk':        'EXPOSES',
}
function inferRelationshipType(sourceType: string, targetType: string): string {
  return RELATIONSHIP_INFERENCE[`${sourceType}->${targetType}`] ?? 'FLOWS_TO'
}

export const CanvasOntologyBridge = {
  /** Idempotently seed the 17 canvas-concept OntologyObjectTypes. Reuses "Risk" if admin-ontology's DEFAULT_TYPES already created it. */
  async seedCanvasTypes(): Promise<Array<{ created: boolean; name: string }>> {
    const results: Array<{ created: boolean; name: string }> = []
    for (const [type, cfg] of Object.entries(BRIDGED_TYPE_CFG)) {
      const name = cfg.displayName
      const existing = await prisma.ontologyObjectType.findUnique({ where: { name } })
      if (existing) { results.push({ created: false, name }); continue }
      await prisma.ontologyObjectType.create({
        data: { name, displayName: cfg.displayName, icon: cfg.icon, color: cfg.color, description: cfg.description, schema: {} },
      })
      results.push({ created: true, name })
    }
    return results
  },

  async typeIdFor(stepType: string): Promise<string | null> {
    const cfg = BRIDGED_TYPE_CFG[stepType]
    if (!cfg) return null
    const type = await prisma.ontologyObjectType.findUnique({ where: { name: cfg.displayName } })
    return type?.id ?? null
  },

  /**
   * Reconciles a workflow's steps against the ontology:
   *  - bridged steps without an ontologyObjectId get one created
   *  - bridged steps whose name/description changed get their OntologyObject updated
   *  - bridged steps present in `previousSteps` but missing from `newSteps` get soft-deleted (validTo = now())
   *  - onSuccess/onFailure links between two bridged steps become an OntologyRelationship
   * Returns the steps array with ontologyObjectId populated, ready to persist.
   */
  async syncWorkflowSteps(workflowId: string, newSteps: BridgeStep[], previousSteps: BridgeStep[] = []): Promise<BridgeStep[]> {
    const synced: BridgeStep[] = []
    const newIds = new Set(newSteps.map(s => s.id))

    for (const step of newSteps) {
      if (!BRIDGED_TYPES.has(step.type)) { synced.push(step); continue }

      if (step.ontologyObjectId) {
        await prisma.ontologyObject.update({
          where: { id: step.ontologyObjectId },
          data: { properties: { name: step.name, description: step.description ?? '', workflowId, stepId: step.id, stepType: step.type } },
        }).catch(() => {}) // object may have been deleted out-of-band — don't fail the save
        synced.push(step)
        continue
      }

      const typeId = await this.typeIdFor(step.type)
      if (!typeId) { synced.push(step); continue }
      const created = await prisma.ontologyObject.create({
        data: {
          typeId,
          externalId: `${workflowId}:${step.id}`,
          properties: { name: step.name, description: step.description ?? '', workflowId, stepId: step.id, stepType: step.type },
        },
      })
      synced.push({ ...step, ontologyObjectId: created.id })
    }

    // Soft-delete objects for bridged steps that were removed from the canvas
    const removed = previousSteps.filter(s => BRIDGED_TYPES.has(s.type) && s.ontologyObjectId && !newIds.has(s.id))
    if (removed.length > 0) {
      await prisma.ontologyObject.updateMany({
        where: { id: { in: removed.map(s => s.ontologyObjectId!) }, validTo: null },
        data: { validTo: new Date() },
      })
    }

    // Wire onSuccess/onFailure between bridged steps into OntologyRelationships
    const byId = new Map(synced.map(s => [s.id, s]))
    for (const step of synced) {
      if (!BRIDGED_TYPES.has(step.type) || !step.ontologyObjectId) continue
      for (const targetStepId of [step.onSuccess, step.onFailure]) {
        if (!targetStepId) continue
        const target = byId.get(targetStepId)
        if (!target || !BRIDGED_TYPES.has(target.type) || !target.ontologyObjectId) continue
        const relationshipType = inferRelationshipType(step.type, target.type)
        await prisma.ontologyRelationship.upsert({
          where: { sourceId_targetId_relationshipType: { sourceId: step.ontologyObjectId, targetId: target.ontologyObjectId, relationshipType } },
          create: {
            sourceId: step.ontologyObjectId, targetId: target.ontologyObjectId,
            sourceType: BRIDGED_TYPE_CFG[step.type].displayName, targetType: BRIDGED_TYPE_CFG[target.type].displayName,
            relationshipType, confidence: 1.0, inferredBy: 'USER',
            reason: `Canvas edge: "${step.name}" → "${target.name}"`,
          },
          update: {},
        }).catch(() => {}) // relationship may already exist under a different inferred type — non-fatal
      }
    }

    return synced
  },

  /** Backfill: link every bridged step in every workflow that doesn't have an ontologyObjectId yet. Non-destructive, idempotent. */
  async backfillAll(): Promise<Array<{ workflowId: string; linked: number }>> {
    const workflows = await prisma.osWorkflow.findMany({ select: { id: true, steps: true } })
    const results: Array<{ workflowId: string; linked: number }> = []
    for (const wf of workflows) {
      const steps = (wf.steps as unknown as BridgeStep[]) ?? []
      const before = steps.filter(s => BRIDGED_TYPES.has(s.type) && s.ontologyObjectId).length
      const synced = await this.syncWorkflowSteps(wf.id, steps, steps)
      const after = synced.filter(s => BRIDGED_TYPES.has(s.type) && s.ontologyObjectId).length
      if (after !== before) {
        await prisma.osWorkflow.update({ where: { id: wf.id }, data: { steps: synced as any } })
      }
      results.push({ workflowId: wf.id, linked: after - before })
    }
    return results
  },

  /** All bridged objects + relationships for one workflow — powers the canvas's "Graph View" mode. */
  async getWorkflowGraph(workflowId: string) {
    const objects = await prisma.ontologyObject.findMany({
      where: { validTo: null, properties: { path: ['workflowId'], equals: workflowId } },
      include: { type: { select: { name: true, displayName: true, icon: true, color: true } } },
    })
    const ids = objects.map(o => o.id)
    const relationships = ids.length
      ? await prisma.ontologyRelationship.findMany({
          where: { sourceId: { in: ids }, targetId: { in: ids }, validTo: null },
        })
      : []
    return { objects, relationships }
  },

  /**
   * S302 — every bridged object across every workflow, with the relationships
   * that connect them and each object's degree centrality. Includes soft-
   * deleted objects/relationships too (with their validTo) so the frontend can
   * scrub a temporal replay slider without a second round trip.
   */
  async getEnterpriseGraph() {
    const bridgedTypeNames = Object.values(BRIDGED_TYPE_CFG).map(c => c.displayName)
    const [workflows, bridgedTypes] = await Promise.all([
      prisma.osWorkflow.findMany({ select: { id: true, name: true, category: true, status: true } }),
      prisma.ontologyObjectType.findMany({ where: { name: { in: bridgedTypeNames } }, select: { id: true } }),
    ])
    const objects = await prisma.ontologyObject.findMany({
      where: { typeId: { in: bridgedTypes.map(t => t.id) } },
      include: { type: { select: { name: true, displayName: true, icon: true, color: true } } },
    })
    const ids = objects.map(o => o.id)
    const relationships = ids.length
      ? await prisma.ontologyRelationship.findMany({ where: { sourceId: { in: ids }, targetId: { in: ids } } })
      : []

    const degree = new Map<string, number>()
    for (const r of relationships) {
      degree.set(r.sourceId, (degree.get(r.sourceId) ?? 0) + 1)
      degree.set(r.targetId, (degree.get(r.targetId) ?? 0) + 1)
    }
    const workflowById = new Map(workflows.map(w => [w.id, w]))

    return {
      workflows,
      objects: objects.map(o => ({
        ...o,
        workflowId: (o.properties as any)?.workflowId ?? null,
        workflowName: workflowById.get((o.properties as any)?.workflowId)?.name ?? null,
        degree: degree.get(o.id) ?? 0,
      })),
      relationships,
    }
  },
}
