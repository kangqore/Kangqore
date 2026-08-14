import { prisma } from '../lib/prisma'

// ── Action Pack manifest schema ───────────────────────────────────────────────
// Packs are portable JSON manifests that define new action categories without
// touching code. Installed via POST /api/admin/ontology/actions/packs/install.

export interface ActionPackParam {
  name:        string
  type:        string
  required?:   boolean
  description?: string
  enum?:       string[]
  min?:        number
  max?:        number
}

export interface ActionPackRule {
  condition:    object
  errorMessage: string
  severity:     'WARN' | 'BLOCK'
  order:        number
}

export interface ActionPackAction {
  name:           string
  displayName:    string
  description:    string
  parameters:     ActionPackParam[]
  allowedRoles:   string[]
  toolCallable?:  boolean
  validationRules?: ActionPackRule[]
}

export interface ActionPackCategory {
  name:        string
  displayName: string
  icon?:       string
  color?:      string
  description?: string
}

export interface ActionPackManifest {
  pack:        string                // unique pack identifier e.g. "kangqore/hr-v2"
  version:     string                // semver
  description: string
  author?:     string
  category:    ActionPackCategory
  actions:     ActionPackAction[]
}

export interface ActionPackInstallResult {
  pack:        string
  version:     string
  created:     number
  skipped:     number
  category:    string
  actions:     string[]
}

// ── Install ───────────────────────────────────────────────────────────────────

export async function installActionPack(manifest: ActionPackManifest): Promise<ActionPackInstallResult> {
  const { pack, version, category, actions } = manifest

  // Upsert the category object type
  const type = await prisma.ontologyObjectType.upsert({
    where: { name: category.name },
    create: {
      name:        category.name,
      displayName: category.displayName,
      icon:        category.icon  ?? 'Package',
      color:       category.color ?? '#64748b',
      description: category.description ?? '',
    },
    update: {
      displayName: category.displayName,
      icon:        category.icon  ?? 'Package',
      color:       category.color ?? '#64748b',
    },
  })

  let created = 0
  let skipped = 0
  const actionNames: string[] = []

  for (const action of actions) {
    const existing = await prisma.ontologyAction.findUnique({
      where: { typeId_name: { typeId: type.id, name: action.name } },
    })

    if (existing) {
      // Sync toolCallable and description on existing pack actions
      await prisma.ontologyAction.update({
        where: { id: existing.id },
        data: {
          toolCallable: action.toolCallable ?? false,
          description:  action.description,
          parameters:   action.parameters as any,
          allowedRoles: action.allowedRoles,
        },
      })
      // Sync validation rules
      if (action.validationRules) {
        await prisma.actionValidationRule.deleteMany({ where: { actionId: existing.id } })
        await prisma.actionValidationRule.createMany({
          data: action.validationRules.map(r => ({
            actionId:     existing.id,
            condition:    r.condition as any,
            errorMessage: r.errorMessage,
            severity:     r.severity,
            order:        r.order,
          })),
        })
      }
      skipped++
      actionNames.push(action.name)
      continue
    }

    const created_ = await prisma.ontologyAction.create({
      data: {
        typeId:       type.id,
        name:         action.name,
        displayName:  action.displayName,
        description:  action.description,
        parameters:   action.parameters as any,
        allowedRoles: action.allowedRoles,
        toolCallable: action.toolCallable ?? false,
        executions:   0,
      },
    })

    if (action.validationRules) {
      await prisma.actionValidationRule.createMany({
        data: action.validationRules.map(r => ({
          actionId:     created_.id,
          condition:    r.condition as any,
          errorMessage: r.errorMessage,
          severity:     r.severity,
          order:        r.order,
        })),
      })
    }

    created++
    actionNames.push(action.name)
  }

  // Record the installed pack in OntologyObjectType metadata
  await prisma.ontologyObjectType.update({
    where: { id: type.id },
    data: { description: `[Pack: ${pack} v${version}] ${category.description ?? ''}`.trim() },
  })

  return { pack, version, created, skipped, category: category.name, actions: actionNames }
}

// ── List installed packs ──────────────────────────────────────────────────────

export async function listInstalledPacks(): Promise<Array<{ category: string; displayName: string; actionCount: number; description: string }>> {
  const types = await prisma.ontologyObjectType.findMany({
    where: { description: { startsWith: '[Pack:' } },
    include: { _count: { select: { actions: true } } },
    orderBy: { createdAt: 'asc' },
  })
  return types.map(t => ({
    category:    t.name,
    displayName: t.displayName,
    actionCount: t._count.actions,
    description: t.description ?? '',
  }))
}

// ── Example pack — ITSM ───────────────────────────────────────────────────────
// Reference manifest for testing. POST to /actions/packs/install with this body.

export const ITSM_PACK: ActionPackManifest = {
  pack:        'kangqore/itsm-v1',
  version:     '1.0.0',
  description: 'IT Service Management actions — tickets, changes, CMDB, SLA',
  author:      'Kangqore',
  category: {
    name:        'ITSM',
    displayName: 'IT Service Mgmt',
    icon:        'Wrench',
    color:       '#f59e0b',
    description: 'ITSM — change management, CMDB, SLA, service requests',
  },
  actions: [
    {
      name:         'CREATE_CHANGE_REQUEST',
      displayName:  'Create Change Request',
      description:  'Raise a formal change request in the ITSM system (CAB review).',
      parameters:   [
        { name: 'title',       type: 'string',  required: true,  description: 'Change title' },
        { name: 'description', type: 'string',  required: true,  description: 'Change description and impact' },
        { name: 'type',        type: 'enum',    required: true,  enum: ['STANDARD', 'NORMAL', 'EMERGENCY'], description: 'Change type' },
        { name: 'riskLevel',   type: 'enum',    required: true,  enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Risk level' },
        { name: 'plannedDate', type: 'date',    required: false, description: 'Planned implementation date' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'],
      toolCallable: true,
    },
    {
      name:         'UPDATE_CMDB',
      displayName:  'Update CMDB Record',
      description:  'Update a configuration item in the CMDB.',
      parameters:   [
        { name: 'ciId',       type: 'string', required: true,  description: 'Configuration item ID' },
        { name: 'field',      type: 'string', required: true,  description: 'Field to update' },
        { name: 'value',      type: 'string', required: true,  description: 'New value' },
        { name: 'reason',     type: 'string', required: false, description: 'Reason for update' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'],
      toolCallable: true,
    },
    {
      name:         'ESCALATE_TICKET',
      displayName:  'Escalate Ticket',
      description:  'Escalate a support ticket to a higher-tier team.',
      parameters:   [
        { name: 'ticketId',   type: 'string', required: true,  description: 'Ticket ID' },
        { name: 'tier',       type: 'enum',   required: true,  enum: ['L2', 'L3', 'ENGINEERING', 'VENDOR'], description: 'Escalation tier' },
        { name: 'reason',     type: 'string', required: true,  description: 'Escalation reason' },
        { name: 'priority',   type: 'enum',   required: false, enum: ['HIGH', 'CRITICAL'], description: 'New priority after escalation' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'],
      toolCallable: true,
    },
    {
      name:         'RESOLVE_SLA_BREACH',
      displayName:  'Resolve SLA Breach',
      description:  'Record SLA breach resolution and root cause.',
      parameters:   [
        { name: 'ticketId',   type: 'string', required: true,  description: 'Breached ticket ID' },
        { name: 'rootCause',  type: 'string', required: true,  description: 'Root cause analysis' },
        { name: 'resolution', type: 'string', required: true,  description: 'What was done to resolve' },
        { name: 'prevention', type: 'string', required: false, description: 'Preventive measure going forward' },
      ],
      allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
      toolCallable: true,
    },
  ],
}
