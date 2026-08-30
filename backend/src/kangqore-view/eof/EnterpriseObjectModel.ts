// The Universal Enterprise Object Model.
//
//   Enterprise → Ontology → Objects → Relationships → Work →
//   Intelligence → Decision → Governed Action → Outcome
//
// Monday's insight is that one primitive — the item — can represent a task, a
// deal, a contact, a ticket or a campaign, so the product never forces a rigid
// application model. This takes that flexibility and puts it on the ontology,
// so an item is an OntologyObject rather than a row in a bespoke table.
//
// The difference that buys: every object participates in the same graph, so
// People + Status + Time + Relationships + Documents + Events + Actions +
// Intelligence apply uniformly — and a question like "which engineering delay
// threatens the Acme renewal" is a graph traversal rather than a join nobody
// wrote.
//
// Every type carries four classes of column:
//   CORE          identity, title, description
//   ENTERPRISE    owner, budget, SLA, compliance — the operating facts
//   INTELLIGENCE  predicted risk, next best action, root cause — what KIMMP infers
//   GOVERNANCE    policy, approval state, classification, evidence — what AEGIS enforces
//
// The last two are what make a board an enterprise decision surface instead of
// a work table.

export type ColumnClass = 'CORE' | 'ENTERPRISE' | 'INTELLIGENCE' | 'GOVERNANCE'

export interface PropertyDef {
  type: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'object-ref' | 'currency' | 'percent'
  required?: boolean
  description: string
  /** Which class this column belongs to — drives board column grouping. */
  columnClass: ColumnClass
  /** Board display metadata — a superset of the existing ColumnDef shape. */
  label?: string
  columnType?: 'text' | 'select' | 'date' | 'badge' | 'number'
  options?: string[]
  colorMap?: Record<string, string>
  order?: number
  hidden?: boolean
}

export type ObjectSchema = Record<string, PropertyDef>

// ── The twelve-state work machine (§8) ────────────────────────────────────────
// Monday ships three states. Work in an enterprise has twelve, and the ones
// that matter most — Blocked, At Risk, Awaiting Approval — are exactly the ones
// a three-state model cannot express.

export const WORK_STATES = [
  'DRAFT', 'QUEUED', 'READY', 'IN_PROGRESS', 'BLOCKED', 'AT_RISK',
  'AWAITING_APPROVAL', 'AWAITING_CUSTOMER', 'UNDER_REVIEW', 'ESCALATED',
  'COMPLETED', 'CANCELLED',
] as const

export const STATE_COLORS: Record<string, string> = {
  DRAFT: '#94a3b8', QUEUED: '#64748b', READY: '#0ea5e9', IN_PROGRESS: '#f59e0b',
  BLOCKED: '#ef4444', AT_RISK: '#f97316', AWAITING_APPROVAL: '#8b5cf6',
  AWAITING_CUSTOMER: '#06b6d4', UNDER_REVIEW: '#6366f1', ESCALATED: '#dc2626',
  COMPLETED: '#10b981', CANCELLED: '#6b7280',
}

// ── Responsibility model (§9) ─────────────────────────────────────────────────
// One assignee cannot express "owned by a PM, executed by an AI agent, approved
// by the CFO, governed by AEGIS". Ownership is plural.

export const RESPONSIBILITY_ROLES = [
  'owner', 'responsible', 'approver', 'reviewer',
  'stakeholder', 'aiAgent', 'backupOwner', 'escalationOwner',
] as const

function responsibilityColumns(startOrder: number): ObjectSchema {
  const labels: Record<string, string> = {
    owner: 'Owner', responsible: 'Responsible', approver: 'Approver',
    reviewer: 'Reviewer', stakeholder: 'Stakeholder', aiAgent: 'AI Agent',
    backupOwner: 'Backup owner', escalationOwner: 'Escalation owner',
  }
  const out: ObjectSchema = {}
  RESPONSIBILITY_ROLES.forEach((r, i) => {
    out[r] = {
      type: 'object-ref',
      description: `${labels[r]} — a User, StaffMember, or KimmpAgent id`,
      columnClass: 'ENTERPRISE',
      label: labels[r],
      columnType: 'text',
      order: startOrder + i,
      hidden: !['owner', 'approver', 'aiAgent'].includes(r),
    }
  })
  return out
}

// ── Temporal model (§10) ──────────────────────────────────────────────────────
// Plan vs current vs predicted. Without all three you can report that something
// is late; you cannot report that something *will be* late while there is still
// time to act.

const TEMPORAL: ObjectSchema = {
  startDate:           { type: 'date', description: 'Planned start', columnClass: 'ENTERPRISE', label: 'Start', columnType: 'date', order: 30 },
  dueDate:             { type: 'date', description: 'Committed deadline', columnClass: 'ENTERPRISE', label: 'Due', columnType: 'date', order: 31 },
  slaDate:             { type: 'date', description: 'Contractual SLA date, where one applies', columnClass: 'ENTERPRISE', label: 'SLA', columnType: 'date', order: 32, hidden: true },
  expectedCompletion:  { type: 'date', description: 'Current expectation from the owner', columnClass: 'ENTERPRISE', label: 'Expected', columnType: 'date', order: 33, hidden: true },
  predictedCompletion: { type: 'date', description: 'KIMMP forecast from observed velocity — not a human estimate', columnClass: 'INTELLIGENCE', label: 'Predicted', columnType: 'date', order: 34 },
  actualCompletion:    { type: 'date', description: 'When it actually finished', columnClass: 'ENTERPRISE', label: 'Actual', columnType: 'date', order: 35, hidden: true },
}

// ── Intelligence columns (§6) ────────────────────────────────────────────────
// Everything here is inferred, never typed by a human. Each carries confidence
// so a reader can tell a strong signal from a guess.

const INTELLIGENCE: ObjectSchema = {
  aiConfidence:      { type: 'percent', description: 'Confidence in that recommendation, 0–1', columnClass: 'INTELLIGENCE', label: 'Confidence', columnType: 'number', order: 51 },
  predictedRisk:     { type: 'percent', description: 'Probability this misses its commitment', columnClass: 'INTELLIGENCE', label: 'Predicted risk', columnType: 'number', order: 52 },
  nextBestAction:    { type: 'string',  description: 'The single highest-value next move', columnClass: 'INTELLIGENCE', label: 'Next best action', columnType: 'text', order: 53 },
  anomalyScore:      { type: 'number',  description: 'How far this deviates from comparable objects', columnClass: 'INTELLIGENCE', label: 'Anomaly', columnType: 'number', order: 55, hidden: true },
  rootCause:         { type: 'string',  description: 'Why it is in its current state', columnClass: 'INTELLIGENCE', label: 'Root cause', columnType: 'text', order: 57 },
  businessImpact:    { type: 'currency', description: 'Value at stake', columnClass: 'INTELLIGENCE', label: 'Business impact', columnType: 'number', order: 59 },
}

// ── Governance columns (§6) ──────────────────────────────────────────────────
// These are what AEGIS reads. They are on every object because governance that
// applies to only some objects is not governance.

const GOVERNANCE: ObjectSchema = {
  permission:        { type: 'string',  description: 'Access rule applied to this record', columnClass: 'GOVERNANCE', label: 'Permission', columnType: 'text', order: 70, hidden: true },
  policy:             { type: 'string', description: 'KimmpPolicy governing changes to this object', columnClass: 'GOVERNANCE', label: 'Policy', columnType: 'text', order: 70, hidden: true },
  approvalRequired:   { type: 'boolean', description: 'Whether changes need human approval', columnClass: 'GOVERNANCE', label: 'Approval required', columnType: 'badge', order: 71 },
  approvalState:      { type: 'select', description: 'Where the approval stands', columnClass: 'GOVERNANCE', label: 'Approval', columnType: 'badge', options: ['NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED'], colorMap: { NOT_REQUIRED: '#94a3b8', PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444' }, order: 72 },
  dataClassification: { type: 'select', description: 'Sensitivity — mirrors OntologyObject.markings', columnClass: 'GOVERNANCE', label: 'Classification', columnType: 'badge', options: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'], colorMap: { PUBLIC: '#10b981', INTERNAL: '#0ea5e9', CONFIDENTIAL: '#f59e0b', RESTRICTED: '#ef4444' }, order: 73 },
  auditState:         { type: 'select', description: 'Audit posture', columnClass: 'GOVERNANCE', label: 'Audit', columnType: 'badge', options: ['CLEAN', 'REVIEW_DUE', 'FINDING_OPEN'], order: 74, hidden: true },
  evidence:           { type: 'string', description: 'Link or reference substantiating the current state', columnClass: 'GOVERNANCE', label: 'Evidence', columnType: 'text', order: 75, hidden: true },
  complianceStatus:   { type: 'select', description: 'Compliance standing', columnClass: 'GOVERNANCE', label: 'Compliance', columnType: 'badge', options: ['COMPLIANT', 'AT_RISK', 'BREACH'], colorMap: { COMPLIANT: '#10b981', AT_RISK: '#f59e0b', BREACH: '#ef4444' }, order: 76, hidden: true },
}

/** Columns every enterprise object carries, whatever it represents. */
function universalSchema(): ObjectSchema {
  return {
    title:       { type: 'string', required: true, description: 'What this object is called', columnClass: 'CORE', label: 'Title', columnType: 'text', order: 0 },
    description: { type: 'string', description: 'Free-text detail', columnClass: 'CORE', label: 'Description', columnType: 'text', order: 1, hidden: true },
    status: {
      type: 'select', required: true, description: 'Current state in the work machine',
      columnClass: 'CORE', label: 'Status', columnType: 'badge',
      options: [...WORK_STATES], colorMap: STATE_COLORS, order: 2,
    },
    priority: { type: 'select', description: 'Relative urgency', columnClass: 'ENTERPRISE', label: 'Priority', columnType: 'badge', options: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], colorMap: { CRITICAL: '#dc2626', HIGH: '#f97316', MEDIUM: '#0ea5e9', LOW: '#94a3b8' }, order: 3 },
    progress: { type: 'percent', description: 'Completion, 0–100', columnClass: 'ENTERPRISE', label: 'Progress', columnType: 'number', order: 4 },
    ...responsibilityColumns(10),
    ...TEMPORAL,
    ...INTELLIGENCE,
    ...GOVERNANCE,
  }
}

export interface EnterpriseObjectDef {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  /** Where this sits in the work hierarchy (§7). Lower is more strategic. */
  tier?: number
  extra?: ObjectSchema
}

// ── The object catalogue (§3 + §7) ────────────────────────────────────────────

export const ENTERPRISE_OBJECTS: EnterpriseObjectDef[] = [
  // Strategy tier — the chain that lets KIMMP reason from CEO objective to execution
  { name: 'EnterpriseGoal', displayName: 'Enterprise Goal', icon: 'Target', color: '#7c3aed', tier: 1,
    description: 'Top-level company goal. The root of the execution chain.',
    extra: { horizon: { type: 'select', description: 'Time horizon', columnClass: 'ENTERPRISE', label: 'Horizon', columnType: 'badge', options: ['QUARTER', 'YEAR', 'MULTI_YEAR'], order: 5 } } },
  { name: 'StrategicObjective', displayName: 'Strategic Objective', icon: 'Crosshair', color: '#8b5cf6', tier: 2,
    description: 'A measurable objective serving an enterprise goal.' },
  { name: 'Initiative', displayName: 'Initiative', icon: 'Rocket', color: '#6366f1', tier: 3,
    description: 'A funded body of work advancing an objective.' },
  { name: 'Program', displayName: 'Program', icon: 'Layers', color: '#0ea5e9', tier: 4,
    description: 'A coordinated set of projects.' },
  { name: 'Project', displayName: 'Project', icon: 'FolderKanban', color: '#3b82f6', tier: 5,
    description: 'A bounded delivery with its own budget, dates and owner.',
    extra: { budget: { type: 'number', description: 'Committed budget', columnClass: 'ENTERPRISE', label: 'Budget', columnType: 'number', order: 5 } } },
  { name: 'Workstream', displayName: 'Workstream', icon: 'GitBranch', color: '#14b8a6', tier: 6,
    description: 'A parallel track of delivery inside a project.' },
  { name: 'Task', displayName: 'Task', icon: 'CheckSquare', color: '#22c55e', tier: 7,
    description: 'A unit of work someone completes.',
    extra: { estimatedHours: { type: 'number', description: 'Estimate in hours', columnClass: 'ENTERPRISE', label: 'Est. hours', columnType: 'number', order: 6 },
             actualHours:    { type: 'number', description: 'Hours actually spent', columnClass: 'ENTERPRISE', label: 'Actual hours', columnType: 'number', order: 7, hidden: true } } },
  { name: 'Action', displayName: 'Action', icon: 'Zap', color: '#84cc16', tier: 8,
    description: 'A single governed step executed by a human or an agent.' },
  { name: 'Evidence', displayName: 'Evidence', icon: 'FileCheck', color: '#64748b', tier: 9,
    description: 'Proof that an action produced its intended result.' },
  { name: 'Outcome', displayName: 'Outcome', icon: 'Trophy', color: '#f59e0b', tier: 10,
    description: 'The measured result of work — what the enterprise actually got.',
    extra: { achieved: { type: 'boolean', description: 'Whether the outcome was achieved', columnClass: 'ENTERPRISE', label: 'Achieved', columnType: 'badge', order: 5 },
             measuredValue: { type: 'currency', description: 'Value realised', columnClass: 'ENTERPRISE', label: 'Value', columnType: 'number', order: 6 } } },

  // Commercial tier
  { name: 'Customer', displayName: 'Customer', icon: 'Building2', color: '#0ea5e9',
    description: 'An organisation the enterprise serves.',
    extra: { tier:     { type: 'select', description: 'Account tier', columnClass: 'ENTERPRISE', label: 'Tier', columnType: 'badge', options: ['STRATEGIC', 'ENTERPRISE', 'STANDARD', 'STARTER'], order: 5 },
             arr:      { type: 'currency', description: 'Annual recurring revenue', columnClass: 'ENTERPRISE', label: 'ARR', columnType: 'number', order: 6 },
             health:   { type: 'select', description: 'Account health', columnClass: 'ENTERPRISE', label: 'Health', columnType: 'badge', options: ['EXCELLENT', 'GOOD', 'AT_RISK', 'CRITICAL'], colorMap: { EXCELLENT: '#10b981', GOOD: '#22c55e', AT_RISK: '#f59e0b', CRITICAL: '#ef4444' }, order: 7 } } },
  { name: 'Contract', displayName: 'Contract', icon: 'FileSignature', color: '#8b5cf6',
    description: 'A commercial agreement with a customer or vendor.',
    extra: { value:      { type: 'currency', description: 'Contract value', columnClass: 'ENTERPRISE', label: 'Value', columnType: 'number', order: 5 },
             renewalDate:{ type: 'date', description: 'Renewal or expiry date', columnClass: 'ENTERPRISE', label: 'Renewal', columnType: 'date', order: 6 } } },
  { name: 'Deal', displayName: 'Deal', icon: 'Handshake', color: '#10b981',
    description: 'A revenue opportunity in the pipeline.',
    extra: { stage:       { type: 'select', description: 'Pipeline stage', columnClass: 'ENTERPRISE', label: 'Stage', columnType: 'badge', options: ['NEW', 'QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'], order: 5 },
             value:       { type: 'currency', description: 'Deal value', columnClass: 'ENTERPRISE', label: 'Value', columnType: 'number', order: 6 } } },
  { name: 'Opportunity', displayName: 'Opportunity', icon: 'TrendingUp', color: '#22c55e',
    description: 'An identified chance to create value, before it becomes a deal.' },

  // Operational tier
  { name: 'Case', displayName: 'Case', icon: 'Briefcase', color: '#6366f1',
    description: 'A unit of service work — a claim, matter, or engagement.' },
  { name: 'Request', displayName: 'Request', icon: 'Inbox', color: '#0ea5e9',
    description: 'Something asked for that must be triaged and fulfilled.' },
  { name: 'Risk', displayName: 'Risk', icon: 'AlertTriangle', color: '#f97316',
    extra: {
      probability: { type: 'percent', description: 'Likelihood of occurring', columnClass: 'ENTERPRISE', label: 'Probability', columnType: 'number', order: 5 },
      impact:      { type: 'select',  description: 'Severity if it occurs', columnClass: 'ENTERPRISE', label: 'Impact', columnType: 'badge', options: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], order: 6 },
      mitigation:  { type: 'string',  description: 'Planned mitigation', columnClass: 'ENTERPRISE', label: 'Mitigation', columnType: 'text', order: 7 },
    },
    description: 'A probability of future loss, distinct from an Incident, which has already happened.' },
  { name: 'Incident', displayName: 'Incident', icon: 'AlertOctagon', color: '#ef4444',
    description: 'An unplanned disruption requiring response.',
    extra: { severity: { type: 'select', description: 'Incident severity', columnClass: 'ENTERPRISE', label: 'Severity', columnType: 'badge', options: ['SEV1', 'SEV2', 'SEV3', 'SEV4'], colorMap: { SEV1: '#dc2626', SEV2: '#f97316', SEV3: '#f59e0b', SEV4: '#94a3b8' }, order: 5 } } },

  // Resource tier
  { name: 'Employee', displayName: 'Employee', icon: 'User', color: '#14b8a6',
    description: 'A person who performs work.',
    extra: { department:  { type: 'string', description: 'Department', columnClass: 'ENTERPRISE', label: 'Department', columnType: 'text', order: 5 },
             utilization: { type: 'percent', description: 'Current allocation', columnClass: 'ENTERPRISE', label: 'Utilisation', columnType: 'number', order: 6 } } },
  { name: 'Vendor', displayName: 'Vendor', icon: 'Truck', color: '#f59e0b',
    description: 'An external supplier the enterprise depends on.' },
  { name: 'Asset', displayName: 'Asset', icon: 'Box', color: '#64748b',
    description: 'A thing the enterprise owns or operates.' },
]

// ── The relationship graph (§11) ──────────────────────────────────────────────
// Modelling only Task→Task gives a red line on a chart. Modelling
// Customer→Contract→Project→Task→Risk→Revenue is what lets the system answer
// "this engineering delay threatens the Acme renewal".

export interface RelationshipDef {
  sourceType: string
  targetType: string
  relationshipType: string
  cardinality: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY'
  description: string
}

export const ENTERPRISE_RELATIONSHIPS: RelationshipDef[] = [
  // The execution chain — CEO objective down to evidence (§7)
  { sourceType: 'StrategicObjective', targetType: 'EnterpriseGoal',     relationshipType: 'serves',      cardinality: 'MANY_TO_ONE', description: 'Objective serves a goal' },
  { sourceType: 'Initiative',         targetType: 'StrategicObjective', relationshipType: 'advances',    cardinality: 'MANY_TO_ONE', description: 'Initiative advances an objective' },
  { sourceType: 'Program',            targetType: 'Initiative',         relationshipType: 'partOf',      cardinality: 'MANY_TO_ONE', description: 'Program belongs to an initiative' },
  { sourceType: 'Project',            targetType: 'Program',            relationshipType: 'partOf',      cardinality: 'MANY_TO_ONE', description: 'Project belongs to a program' },
  { sourceType: 'Workstream',         targetType: 'Project',            relationshipType: 'partOf',      cardinality: 'MANY_TO_ONE', description: 'Workstream belongs to a project' },
  { sourceType: 'Task',               targetType: 'Workstream',         relationshipType: 'partOf',      cardinality: 'MANY_TO_ONE', description: 'Task belongs to a workstream' },
  { sourceType: 'Action',             targetType: 'Task',               relationshipType: 'executes',    cardinality: 'MANY_TO_ONE', description: 'Action executes part of a task' },
  { sourceType: 'Evidence',           targetType: 'Action',             relationshipType: 'evidences',   cardinality: 'MANY_TO_ONE', description: 'Evidence substantiates an action' },
  { sourceType: 'Outcome',            targetType: 'EnterpriseGoal',     relationshipType: 'realises',    cardinality: 'MANY_TO_ONE', description: 'Outcome realises a goal' },

  // Subitems — the generic hierarchy Monday calls a subitem
  { sourceType: 'Task',    targetType: 'Task',    relationshipType: 'subitemOf', cardinality: 'MANY_TO_ONE', description: 'Task is a subitem of another task' },
  { sourceType: 'Project', targetType: 'Project', relationshipType: 'subitemOf', cardinality: 'MANY_TO_ONE', description: 'Project is a sub-project' },

  // Dependencies — the primitive that makes a schedule real
  { sourceType: 'Task',    targetType: 'Task',    relationshipType: 'dependsOn', cardinality: 'MANY_TO_MANY', description: 'Cannot start until the target completes' },
  { sourceType: 'Task',    targetType: 'Task',    relationshipType: 'blocks',    cardinality: 'MANY_TO_MANY', description: 'Blocks the target from starting' },
  { sourceType: 'Project', targetType: 'Vendor',  relationshipType: 'dependsOn', cardinality: 'MANY_TO_MANY', description: 'Delivery depends on a vendor' },

  // The commercial chain — Customer → Contract → Project → Risk → Revenue
  { sourceType: 'Contract', targetType: 'Customer', relationshipType: 'heldBy',    cardinality: 'MANY_TO_ONE',  description: 'Contract is held by a customer' },
  { sourceType: 'Project',  targetType: 'Contract', relationshipType: 'deliversOn', cardinality: 'MANY_TO_ONE', description: 'Project delivers a contract' },
  { sourceType: 'Deal',     targetType: 'Customer', relationshipType: 'withCustomer', cardinality: 'MANY_TO_ONE', description: 'Deal is with a customer' },
  { sourceType: 'Deal',     targetType: 'Contract', relationshipType: 'becomes',   cardinality: 'ONE_TO_ONE',   description: 'A won deal becomes a contract' },
  { sourceType: 'Opportunity', targetType: 'Deal',  relationshipType: 'becomes',   cardinality: 'ONE_TO_ONE',   description: 'A qualified opportunity becomes a deal' },
  { sourceType: 'Outcome',  targetType: 'Contract', relationshipType: 'realisedOn', cardinality: 'MANY_TO_ONE', description: 'Outcome realised against a contract' },

  // Risk propagation — how a delay becomes a revenue problem
  { sourceType: 'Risk', targetType: 'Project',  relationshipType: 'threatens', cardinality: 'MANY_TO_MANY', description: 'Risk threatens delivery' },
  // A risk with no owned work attached is a register entry, not a control.
  { sourceType: 'Project', targetType: 'Risk', relationshipType: 'mitigates', cardinality: 'MANY_TO_ONE', description: 'Project mitigates a risk' },
  { sourceType: 'Risk', targetType: 'Contract', relationshipType: 'threatens', cardinality: 'MANY_TO_MANY', description: 'Risk threatens a contract' },
  { sourceType: 'Risk', targetType: 'Customer', relationshipType: 'threatens', cardinality: 'MANY_TO_MANY', description: 'Risk threatens the relationship' },
  { sourceType: 'Risk', targetType: 'Outcome',  relationshipType: 'threatens', cardinality: 'MANY_TO_MANY', description: 'Risk threatens an outcome' },

  // Service operations
  { sourceType: 'Case',     targetType: 'Customer', relationshipType: 'raisedBy',  cardinality: 'MANY_TO_ONE',  description: 'Case raised by a customer' },
  { sourceType: 'Request',  targetType: 'Customer', relationshipType: 'raisedBy',  cardinality: 'MANY_TO_ONE',  description: 'Request raised by a customer' },
  { sourceType: 'Incident', targetType: 'Asset',    relationshipType: 'affects',   cardinality: 'MANY_TO_MANY', description: 'Incident affects an asset' },
  { sourceType: 'Incident', targetType: 'Customer', relationshipType: 'affects',   cardinality: 'MANY_TO_MANY', description: 'Incident affects a customer' },

  // People
  { sourceType: 'Task',     targetType: 'Employee', relationshipType: 'assignedTo', cardinality: 'MANY_TO_MANY', description: 'Task assigned to a person' },
  { sourceType: 'Project',  targetType: 'Employee', relationshipType: 'ownedBy',    cardinality: 'MANY_TO_ONE',  description: 'Project owned by a person' },
  { sourceType: 'Employee', targetType: 'Employee', relationshipType: 'reportsTo',  cardinality: 'MANY_TO_ONE',  description: 'Reporting line' },
]

/** Full schema for one object type: universal columns plus its own. */
export function schemaFor(def: EnterpriseObjectDef): ObjectSchema {
  return { ...universalSchema(), ...(def.extra ?? {}) }
}

/** Columns of one class, ordered — how a board builds its default column set. */
export function columnsOfClass(schema: ObjectSchema, cls: ColumnClass) {
  return Object.entries(schema)
    .filter(([, d]) => d.columnClass === cls)
    .sort((a, b) => (a[1].order ?? 999) - (b[1].order ?? 999))
    .map(([field, d]) => ({ field, ...d }))
}
