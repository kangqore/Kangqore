// The template library — playbooks that materialise work.
//
// The distinction that matters: a Monday template copies a board's columns and
// groups. These create real OntologyObjects and the edges between them, so
// applying one leaves the graph genuinely fuller — milestones and tasks the
// Intelligence layer can score and the Decision layer can walk.
//
// Declared in code and seeded to the database, matching EnterpriseObjectModel:
// editing this file and restarting is the whole update path.
//
// Every node's `typeName` must exist in ENTERPRISE_OBJECTS and every edge must
// satisfy a rule in ENTERPRISE_RELATIONSHIPS — the seeder verifies both, so a
// template that would be rejected at apply time fails loudly at boot instead.

export interface TemplateNode {
  /** Template-local name that edges refer to. */
  ref: string
  typeName: string
  properties: Record<string, any>
  /** Due date, in days from the application date. */
  offsetDays?: number
}

export interface TemplateEdge {
  from: string
  to: string
  relationshipType: string
}

export interface WorkTemplateDef {
  key: string
  name: string
  description: string
  category: 'Delivery' | 'Commercial' | 'People' | 'Risk'
  icon: string
  color: string
  rootTypeName: string
  nodes: TemplateNode[]
  edges: TemplateEdge[]
  board?: { name: string; groupByField?: string; showClasses?: string[] }
}

/** Every task in a delivery playbook shares this shape. */
const task = (ref: string, title: string, offsetDays: number, extra: Record<string, any> = {}): TemplateNode => ({
  ref,
  typeName: 'Task',
  properties: { title, status: 'QUEUED', progress: 0, priority: 'MEDIUM', ...extra },
  offsetDays,
})

export const WORK_TEMPLATES: WorkTemplateDef[] = [
  // ── Commercial ────────────────────────────────────────────────────────────
  {
    key: 'client-onboarding',
    name: 'Client Onboarding',
    description:
      'Takes a signed client from contract to steady state. Creates the workstreams and tasks the delivery team actually runs, so progress is measured rather than asserted.',
    category: 'Commercial',
    icon: 'UserPlus',
    color: '#0ea5e9',
    rootTypeName: 'Project',
    nodes: [
      { ref: 'root', typeName: 'Project',
        properties: { title: 'Client onboarding', status: 'IN_PROGRESS', progress: 0, priority: 'HIGH' },
        offsetDays: 60 },

      { ref: 'ws-setup', typeName: 'Workstream',
        properties: { title: 'Commercial setup', status: 'IN_PROGRESS', progress: 0 }, offsetDays: 14 },
      { ref: 'ws-tech', typeName: 'Workstream',
        properties: { title: 'Technical enablement', status: 'QUEUED', progress: 0 }, offsetDays: 45 },
      { ref: 'ws-live', typeName: 'Workstream',
        properties: { title: 'Go-live and handover', status: 'QUEUED', progress: 0 }, offsetDays: 60 },

      task('t-contract', 'Countersign contract and file it', 3, { priority: 'CRITICAL' }),
      task('t-kickoff', 'Run kickoff call with the client sponsor', 7, { priority: 'HIGH' }),
      task('t-contacts', 'Record billing and escalation contacts', 7),
      task('t-access', 'Provision portal access for the client team', 14),
      task('t-discovery', 'Technical discovery and systems inventory', 21),
      task('t-integrate', 'Configure integrations and data import', 35),
      task('t-train', 'Deliver training for the client team', 45),
      task('t-golive', 'Go live', 55, { priority: 'CRITICAL' }),
      task('t-review', 'Thirty-day success review', 60),

      // Evidence hangs off an Action, which executes a Task — the model's real
      // chain. Attaching Evidence straight to a Task has no rule and would be
      // rejected at apply time.
      { ref: 'a-golive', typeName: 'Action',
        properties: { title: 'Confirm go-live sign-off', status: 'QUEUED' }, offsetDays: 55 },
      { ref: 'ev-golive', typeName: 'Evidence',
        properties: { title: 'Go-live acceptance record', status: 'QUEUED' }, offsetDays: 55 },
    ],
    edges: [
      { from: 'ws-setup', to: 'root', relationshipType: 'partOf' },
      { from: 'ws-tech', to: 'root', relationshipType: 'partOf' },
      { from: 'ws-live', to: 'root', relationshipType: 'partOf' },

      { from: 't-contract', to: 'ws-setup', relationshipType: 'partOf' },
      { from: 't-kickoff', to: 'ws-setup', relationshipType: 'partOf' },
      { from: 't-contacts', to: 'ws-setup', relationshipType: 'partOf' },
      { from: 't-access', to: 'ws-setup', relationshipType: 'partOf' },
      { from: 't-discovery', to: 'ws-tech', relationshipType: 'partOf' },
      { from: 't-integrate', to: 'ws-tech', relationshipType: 'partOf' },
      { from: 't-train', to: 'ws-tech', relationshipType: 'partOf' },
      { from: 't-golive', to: 'ws-live', relationshipType: 'partOf' },
      { from: 't-review', to: 'ws-live', relationshipType: 'partOf' },

      // Real ordering, so a slip upstream is visible downstream rather than
      // being a line on a chart.
      { from: 't-kickoff', to: 't-contract', relationshipType: 'dependsOn' },
      { from: 't-access', to: 't-contacts', relationshipType: 'dependsOn' },
      { from: 't-integrate', to: 't-discovery', relationshipType: 'dependsOn' },
      { from: 't-train', to: 't-integrate', relationshipType: 'dependsOn' },
      { from: 't-golive', to: 't-train', relationshipType: 'dependsOn' },
      { from: 't-review', to: 't-golive', relationshipType: 'dependsOn' },

      { from: 'a-golive', to: 't-golive', relationshipType: 'executes' },
      { from: 'ev-golive', to: 'a-golive', relationshipType: 'evidences' },
    ],
    board: { name: 'Client Onboarding', groupByField: 'status' },
  },

  // ── Delivery ──────────────────────────────────────────────────────────────
  {
    key: 'project-delivery',
    name: 'Project Delivery',
    description:
      'The standard shape of a client engagement: discovery, build, launch, with the evidence needed to close it out.',
    category: 'Delivery',
    icon: 'FolderKanban',
    color: '#3b82f6',
    rootTypeName: 'Project',
    nodes: [
      { ref: 'root', typeName: 'Project',
        properties: { title: 'New project', status: 'IN_PROGRESS', progress: 0, priority: 'HIGH' },
        offsetDays: 90 },

      { ref: 'ws-discover', typeName: 'Workstream',
        properties: { title: 'Discovery', status: 'IN_PROGRESS', progress: 0 }, offsetDays: 21 },
      { ref: 'ws-build', typeName: 'Workstream',
        properties: { title: 'Build', status: 'QUEUED', progress: 0 }, offsetDays: 70 },
      { ref: 'ws-launch', typeName: 'Workstream',
        properties: { title: 'Launch', status: 'QUEUED', progress: 0 }, offsetDays: 90 },

      task('t-scope', 'Agree scope and success criteria', 10, { priority: 'CRITICAL' }),
      task('t-plan', 'Produce the delivery plan and estimate', 21),
      task('t-build', 'Build the agreed scope', 60),
      task('t-qa', 'Quality assurance and fixes', 75),
      task('t-uat', 'Client acceptance testing', 82, { status: 'QUEUED' }),
      task('t-launch', 'Launch to production', 88, { priority: 'CRITICAL' }),
      task('t-retro', 'Retrospective and lessons learned', 90),

      { ref: 'a-accept', typeName: 'Action',
        properties: { title: 'Record client acceptance', status: 'QUEUED' }, offsetDays: 85 },
      { ref: 'ev-signoff', typeName: 'Evidence',
        properties: { title: 'Client sign-off', status: 'QUEUED' }, offsetDays: 88 },
    ],
    edges: [
      { from: 'ws-discover', to: 'root', relationshipType: 'partOf' },
      { from: 'ws-build', to: 'root', relationshipType: 'partOf' },
      { from: 'ws-launch', to: 'root', relationshipType: 'partOf' },

      { from: 't-scope', to: 'ws-discover', relationshipType: 'partOf' },
      { from: 't-plan', to: 'ws-discover', relationshipType: 'partOf' },
      { from: 't-build', to: 'ws-build', relationshipType: 'partOf' },
      { from: 't-qa', to: 'ws-build', relationshipType: 'partOf' },
      { from: 't-uat', to: 'ws-launch', relationshipType: 'partOf' },
      { from: 't-launch', to: 'ws-launch', relationshipType: 'partOf' },
      { from: 't-retro', to: 'ws-launch', relationshipType: 'partOf' },

      { from: 't-plan', to: 't-scope', relationshipType: 'dependsOn' },
      { from: 't-build', to: 't-plan', relationshipType: 'dependsOn' },
      { from: 't-qa', to: 't-build', relationshipType: 'dependsOn' },
      { from: 't-uat', to: 't-qa', relationshipType: 'dependsOn' },
      { from: 't-launch', to: 't-uat', relationshipType: 'dependsOn' },

      { from: 'a-accept', to: 't-uat', relationshipType: 'executes' },
      { from: 'ev-signoff', to: 'a-accept', relationshipType: 'evidences' },
    ],
    board: { name: 'Project Delivery', groupByField: 'status' },
  },

  // ── Risk ──────────────────────────────────────────────────────────────────
  {
    key: 'risk-review',
    name: 'Risk Review',
    description:
      'Stands up a risk with its mitigation work attached, so a logged risk carries owned actions rather than sitting in a register nobody reads.',
    category: 'Risk',
    icon: 'AlertTriangle',
    color: '#f97316',
    rootTypeName: 'Risk',
    nodes: [
      { ref: 'root', typeName: 'Risk',
        properties: {
          title: 'New risk', status: 'IN_PROGRESS', probability: 50,
          impact: 'HIGH', mitigation: 'To be agreed', priority: 'HIGH',
        },
        offsetDays: 30 },

      { ref: 'plan', typeName: 'Project',
        properties: { title: 'Mitigation plan', status: 'IN_PROGRESS', progress: 0, priority: 'HIGH' },
        offsetDays: 30 },
      { ref: 'ws', typeName: 'Workstream',
        properties: { title: 'Mitigation', status: 'IN_PROGRESS', progress: 0 }, offsetDays: 30 },

      task('t-assess', 'Assess likelihood and impact with the owner', 7, { priority: 'HIGH' }),
      task('t-mitigate', 'Agree and document the mitigation', 14),
      task('t-implement', 'Implement the mitigation', 28),
      task('t-verify', 'Verify the risk has actually reduced', 30),

      { ref: 'a-verify', typeName: 'Action',
        properties: { title: 'Re-score the risk', status: 'QUEUED' }, offsetDays: 30 },
      { ref: 'ev-review', typeName: 'Evidence',
        properties: { title: 'Risk review record', status: 'QUEUED' }, offsetDays: 30 },
    ],
    edges: [
      { from: 'plan', to: 'root', relationshipType: 'mitigates' },
      { from: 'ws', to: 'plan', relationshipType: 'partOf' },
      { from: 't-assess', to: 'ws', relationshipType: 'partOf' },
      { from: 't-mitigate', to: 'ws', relationshipType: 'partOf' },
      { from: 't-implement', to: 'ws', relationshipType: 'partOf' },
      { from: 't-verify', to: 'ws', relationshipType: 'partOf' },

      { from: 't-mitigate', to: 't-assess', relationshipType: 'dependsOn' },
      { from: 't-implement', to: 't-mitigate', relationshipType: 'dependsOn' },
      { from: 't-verify', to: 't-implement', relationshipType: 'dependsOn' },
      { from: 'a-verify', to: 't-verify', relationshipType: 'executes' },
      { from: 'ev-review', to: 'a-verify', relationshipType: 'evidences' },
    ],
    board: { name: 'Risk Register', groupByField: 'status', showClasses: ['CORE', 'ENTERPRISE', 'INTELLIGENCE'] },
  },

  // ── People ────────────────────────────────────────────────────────────────
  {
    key: 'employee-onboarding',
    name: 'Employee Onboarding',
    description:
      'First thirty days for a new starter, with the compliance steps that have to be evidenced rather than remembered.',
    category: 'People',
    icon: 'Users',
    color: '#14b8a6',
    rootTypeName: 'Project',
    nodes: [
      { ref: 'root', typeName: 'Project',
        properties: { title: 'New starter onboarding', status: 'IN_PROGRESS', progress: 0, priority: 'HIGH' },
        offsetDays: 30 },

      { ref: 'ws', typeName: 'Workstream',
        properties: { title: 'First thirty days', status: 'IN_PROGRESS', progress: 0 }, offsetDays: 30 },

      task('t-offer', 'Signed offer and right-to-work check', 1, { priority: 'CRITICAL' }),
      task('t-equipment', 'Order equipment and provision accounts', 3),
      task('t-day1', 'Day one induction', 7),
      task('t-policies', 'Policy and security training completed', 14),
      task('t-buddy', 'Assign a buddy and set 30-day goals', 14),
      task('t-review', 'Thirty-day check-in', 30),

      { ref: 'a-rtw', typeName: 'Action',
        properties: { title: 'File right-to-work check', status: 'QUEUED' }, offsetDays: 1 },
      { ref: 'ev-rtw', typeName: 'Evidence',
        properties: { title: 'Right-to-work evidence', status: 'QUEUED' }, offsetDays: 1 },
    ],
    edges: [
      { from: 'ws', to: 'root', relationshipType: 'partOf' },
      { from: 't-offer', to: 'ws', relationshipType: 'partOf' },
      { from: 't-equipment', to: 'ws', relationshipType: 'partOf' },
      { from: 't-day1', to: 'ws', relationshipType: 'partOf' },
      { from: 't-policies', to: 'ws', relationshipType: 'partOf' },
      { from: 't-buddy', to: 'ws', relationshipType: 'partOf' },
      { from: 't-review', to: 'ws', relationshipType: 'partOf' },

      { from: 't-equipment', to: 't-offer', relationshipType: 'dependsOn' },
      { from: 't-day1', to: 't-equipment', relationshipType: 'dependsOn' },
      { from: 't-policies', to: 't-day1', relationshipType: 'dependsOn' },
      { from: 't-review', to: 't-buddy', relationshipType: 'dependsOn' },
      { from: 'a-rtw', to: 't-offer', relationshipType: 'executes' },
      { from: 'ev-rtw', to: 'a-rtw', relationshipType: 'evidences' },
    ],
    board: { name: 'Onboarding', groupByField: 'status' },
  },
]
