// Track H — Enterprise Solution Framework: Pack Registry
// Packs are installable units that bundle ontology types, workflow definitions,
// and other OS configurations. Similar to VS Code extensions or Terraform modules.
//
// The registry holds available packs in-memory (defined in code).
// Installation state (installed/uninstalled) is persisted to PackManifest table.

import { prisma } from '../lib/prisma'

export type PackCategory = 'ONTOLOGY' | 'WORKFLOW' | 'POLICY' | 'AGENT' | 'INDUSTRY'

export interface OntologyTypeSpec {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  schema: Record<string, { type: string; required?: boolean; description?: string }>
}

export interface WorkflowSpec {
  name: string
  displayName: string
  description: string
  category: string
  triggerType: string
  triggerConfig: string
  tags: string[]
  owner: string
  steps: Array<{
    id: string
    name: string
    type: string
    description?: string
    config: Record<string, any>
    onSuccess?: string
    onFailure?: string
  }>
}

export interface PolicySpec {
  name: string
  description?: string
  trigger: string
  condition: Record<string, any>
  effect: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'NOTIFY'
  priority: number
}

export interface AgentSpec {
  name: string
  role: string
  description?: string
  maxLevel: number
  tools: string[]
  model: string
  systemPrompt: string
}

export interface PackDefinition {
  packId: string
  name: string
  version: string
  description: string
  author: string
  category: PackCategory
  tags: string[]
  icon: string
  ontologyTypes?: OntologyTypeSpec[]
  workflows?: WorkflowSpec[]
  policies?: PolicySpec[]
  agents?: AgentSpec[]
  install(installedBy?: string): Promise<void>
  uninstall?(): Promise<void>
}

// ── Built-in Pack Definitions ─────────────────────────────────────────────────

const RISK_MANAGEMENT_PACK: PackDefinition = {
  packId:      'kangqore/risk-management',
  name:        'Risk Management',
  version:     '1.0.0',
  description: 'Adds RiskItem, ControlMeasure, and RegulatoryRequirement ontology types for enterprise risk governance. Includes risk scoring, owner assignment, and regulatory mapping.',
  author:      'Kangqore',
  category:    'ONTOLOGY',
  tags:        ['risk', 'governance', 'compliance', 'GRC'],
  icon:        '🛡️',

  ontologyTypes: [
    {
      name: 'RiskItem',
      displayName: 'Risk Item',
      icon: 'ShieldAlert',
      color: '#e2445c',
      description: 'An identified risk with severity, likelihood, and owner',
      schema: {
        title:       { type: 'string',  required: true,  description: 'Short risk title' },
        description: { type: 'string',  description: 'Detailed risk description' },
        severity:    { type: 'select',  required: true,  description: 'CRITICAL | HIGH | MEDIUM | LOW' },
        likelihood:  { type: 'select',  required: true,  description: 'HIGH | MEDIUM | LOW' },
        riskScore:   { type: 'number',  description: 'Computed score (severity × likelihood)' },
        owner:       { type: 'string',  description: 'Risk owner name or ID' },
        status:      { type: 'select',  description: 'OPEN | MITIGATED | ACCEPTED | CLOSED' },
        dueDate:     { type: 'date',    description: 'Mitigation target date' },
        category:    { type: 'string',  description: 'Operational | Financial | Regulatory | Technical' },
      },
    },
    {
      name: 'ControlMeasure',
      displayName: 'Control Measure',
      icon: 'CheckShield',
      color: '#00c875',
      description: 'A mitigation control applied to one or more risks',
      schema: {
        title:         { type: 'string',  required: true },
        description:   { type: 'string' },
        controlType:   { type: 'select',  description: 'PREVENTIVE | DETECTIVE | CORRECTIVE | COMPENSATING' },
        effectiveness: { type: 'select',  description: 'HIGH | MEDIUM | LOW | UNKNOWN' },
        status:        { type: 'select',  description: 'ACTIVE | INACTIVE | UNDER_REVIEW' },
        owner:         { type: 'string' },
        lastTestDate:  { type: 'date' },
      },
    },
    {
      name: 'RegulatoryRequirement',
      displayName: 'Regulatory Requirement',
      icon: 'Scale',
      color: '#7c3aed',
      description: 'A legal or regulatory obligation the organisation must meet',
      schema: {
        title:         { type: 'string',  required: true },
        regulation:    { type: 'string',  description: 'GDPR | SOC2 | ISO27001 | PCI-DSS | HIPAA | Custom' },
        article:       { type: 'string',  description: 'Article or section reference' },
        description:   { type: 'string' },
        status:        { type: 'select',  description: 'COMPLIANT | NON_COMPLIANT | IN_PROGRESS | NOT_ASSESSED' },
        dueDate:       { type: 'date' },
        owner:         { type: 'string' },
        evidence:      { type: 'string',  description: 'Link or description of compliance evidence' },
      },
    },
  ],

  async install(installedBy?: string) {
    const types = RISK_MANAGEMENT_PACK.ontologyTypes ?? []
    for (const t of types) {
      await prisma.ontologyObjectType.upsert({
        where: { name: t.name },
        create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema },
        update: { displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema },
      })
    }
    await upsertPackRecord(RISK_MANAGEMENT_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: RISK_MANAGEMENT_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const CLIENT_LIFECYCLE_PACK: PackDefinition = {
  packId:      'kangqore/client-lifecycle',
  name:        'Client Lifecycle',
  version:     '1.0.0',
  description: 'Adds ClientJourney stage tracking and SuccessMetric health scoring to the ontology. Enables QBR-style account health dashboards and lifecycle milestone tracking.',
  author:      'Kangqore',
  category:    'ONTOLOGY',
  tags:        ['clients', 'success', 'lifecycle', 'health'],
  icon:        '🏆',

  ontologyTypes: [
    {
      name: 'ClientJourney',
      displayName: 'Client Journey Stage',
      icon: 'Map',
      color: '#579bfc',
      description: 'A named stage in the client lifecycle (Onboarding, Growth, Renewal, Churn Risk)',
      schema: {
        stage:      { type: 'select',  required: true,  description: 'ONBOARDING | ACTIVE | GROWTH | AT_RISK | RENEWAL | CHURNED' },
        startDate:  { type: 'date',    required: true },
        endDate:    { type: 'date' },
        notes:      { type: 'string' },
        csm:        { type: 'string',  description: 'Customer Success Manager name' },
        npsScore:   { type: 'number',  description: 'Net Promoter Score at stage entry' },
        mrr:        { type: 'number',  description: 'Monthly Recurring Revenue at this stage' },
      },
    },
    {
      name: 'SuccessMetric',
      displayName: 'Success Metric',
      icon: 'TrendingUp',
      color: '#00c875',
      description: 'A tracked KPI or health signal for a client account',
      schema: {
        metricName:  { type: 'string',  required: true },
        value:       { type: 'number',  required: true },
        unit:        { type: 'string',  description: 'e.g. %, count, $, days' },
        target:      { type: 'number' },
        trend:       { type: 'select',  description: 'UP | DOWN | STABLE' },
        period:      { type: 'string',  description: 'Monthly | Quarterly | Annual' },
        measuredAt:  { type: 'date' },
      },
    },
  ],

  async install(installedBy?: string) {
    const types = CLIENT_LIFECYCLE_PACK.ontologyTypes ?? []
    for (const t of types) {
      await prisma.ontologyObjectType.upsert({
        where: { name: t.name },
        create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema },
        update: { displayName: t.displayName, description: t.description },
      })
    }
    await upsertPackRecord(CLIENT_LIFECYCLE_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: CLIENT_LIFECYCLE_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const VENDOR_MANAGEMENT_PACK: PackDefinition = {
  packId:      'kangqore/vendor-management',
  name:        'Vendor Management',
  version:     '1.0.0',
  description: 'Adds Vendor, Contract, and SLA ontology types for procurement and third-party governance. Includes contract expiry tracking and SLA breach alerting hooks.',
  author:      'Kangqore',
  category:    'ONTOLOGY',
  tags:        ['vendor', 'procurement', 'contracts', 'SLA'],
  icon:        '📦',

  ontologyTypes: [
    {
      name: 'Vendor',
      displayName: 'Vendor',
      icon: 'Building',
      color: '#fdab3d',
      description: 'A third-party supplier or service provider',
      schema: {
        legalName:   { type: 'string',  required: true },
        category:    { type: 'string',  description: 'Software | Hardware | Services | Cloud | Professional' },
        tier:        { type: 'select',  description: 'STRATEGIC | PREFERRED | APPROVED | OCCASIONAL' },
        contactName: { type: 'string' },
        contactEmail:{ type: 'string' },
        status:      { type: 'select',  description: 'ACTIVE | UNDER_REVIEW | TERMINATED' },
        annualSpend: { type: 'number' },
        riskRating:  { type: 'select',  description: 'HIGH | MEDIUM | LOW' },
      },
    },
    {
      name: 'Contract',
      displayName: 'Contract',
      icon: 'FileSignature',
      color: '#0891b2',
      description: 'A legal agreement with a vendor or client',
      schema: {
        title:        { type: 'string',  required: true },
        contractType: { type: 'select',  description: 'MSA | SLA | NDA | SOW | PURCHASE_ORDER | SUBSCRIPTION' },
        value:        { type: 'number' },
        currency:     { type: 'string',  description: 'USD | GBP | EUR' },
        startDate:    { type: 'date',    required: true },
        endDate:      { type: 'date' },
        autoRenew:    { type: 'boolean' },
        status:       { type: 'select',  description: 'DRAFT | ACTIVE | EXPIRED | TERMINATED | UNDER_REVIEW' },
        owner:        { type: 'string' },
      },
    },
    {
      name: 'SLA',
      displayName: 'SLA',
      icon: 'Clock',
      color: '#e2445c',
      description: 'A service level agreement with defined targets and penalties',
      schema: {
        metric:      { type: 'string',  required: true,  description: 'e.g. Uptime, Response Time, Resolution Time' },
        target:      { type: 'number',  required: true },
        unit:        { type: 'string',  description: '% | hours | minutes | days' },
        period:      { type: 'string',  description: 'Monthly | Quarterly' },
        penalty:     { type: 'string',  description: 'Penalty clause for breach' },
        currentValue:{ type: 'number' },
        status:      { type: 'select',  description: 'ON_TRACK | AT_RISK | BREACHED' },
        lastReviewed:{ type: 'date' },
      },
    },
  ],

  async install(installedBy?: string) {
    const types = VENDOR_MANAGEMENT_PACK.ontologyTypes ?? []
    for (const t of types) {
      await prisma.ontologyObjectType.upsert({
        where: { name: t.name },
        create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema },
        update: { displayName: t.displayName, description: t.description },
      })
    }
    await upsertPackRecord(VENDOR_MANAGEMENT_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: VENDOR_MANAGEMENT_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const ONBOARDING_WORKFLOW_PACK: PackDefinition = {
  packId:      'kangqore/onboarding-workflows',
  name:        'Onboarding Workflows',
  version:     '1.0.0',
  description: 'Pre-built workflows for new client onboarding and team member setup. Includes a 6-step client onboarding sequence and a 4-step new hire checklist.',
  author:      'Kangqore',
  category:    'WORKFLOW',
  tags:        ['onboarding', 'clients', 'hr', 'automation'],
  icon:        '🚀',

  workflows: [
    {
      name:        'new-client-onboarding',
      displayName: 'New Client Onboarding',
      description: 'Automated sequence triggered when a new client is confirmed. Assigns an account manager, schedules kick-off, creates a project, and sends a welcome communication.',
      category:    'sales',
      triggerType: 'event',
      triggerConfig: JSON.stringify({ event: 'client.status_changed', condition: 'status === "ACTIVE"' }),
      tags:        ['onboarding', 'clients'],
      owner:       'Operations',
      steps: [
        { id: 'step-1', name: 'Notify account manager', type: 'NOTIFY_ADMINS', config: { message: 'New client confirmed — assign account manager', priority: 'HIGH' }, onSuccess: 'step-2' },
        { id: 'step-2', name: 'Create onboarding project', type: 'CREATE_OBJECT', config: { ontologyType: 'Project', properties: { status: 'PLANNING', template: 'client-onboarding' } }, onSuccess: 'step-3' },
        { id: 'step-3', name: 'Schedule kick-off meeting', type: 'EMIT_EVENT', config: { eventType: 'MEETING', description: 'Schedule 90-minute kick-off call within 5 business days' }, onSuccess: 'step-4' },
        { id: 'step-4', name: 'Send welcome pack', type: 'NOTIFY_ADMINS', config: { message: 'Send welcome pack and portal access to client', channel: 'email' }, onSuccess: 'step-5' },
        { id: 'step-5', name: 'Create 30-day milestone', type: 'EMIT_EVENT', config: { eventType: 'PROPOSAL', description: 'Set 30-day success milestone review' }, onSuccess: 'step-6' },
        { id: 'step-6', name: 'Mark onboarding started', type: 'EMIT_EVENT', config: { eventType: 'MEETING', description: 'Log onboarding initiation in AEGIS audit trail' } },
      ],
    },
    {
      name:        'invoice-approval',
      displayName: 'Invoice Approval',
      description: 'Routes new invoices above a threshold for manager approval before payment processing. Escalates if not approved within 48 hours.',
      category:    'finance',
      triggerType: 'event',
      triggerConfig: JSON.stringify({ event: 'invoice.created', condition: 'amount > 5000' }),
      tags:        ['invoices', 'finance', 'approval'],
      owner:       'Finance',
      steps: [
        { id: 'step-1', name: 'Flag for approval', type: 'NOTIFY_ADMINS', config: { message: 'Invoice above threshold requires approval', priority: 'MEDIUM' }, onSuccess: 'step-2' },
        { id: 'step-2', name: 'Wait for approval', type: 'WAIT_APPROVAL', config: { timeoutHours: 48, escalateOnTimeout: true }, onSuccess: 'step-3', onFailure: 'step-4' },
        { id: 'step-3', name: 'Mark approved', type: 'EMIT_EVENT', config: { eventType: 'INVOICE', description: 'Invoice approved — proceed to payment' } },
        { id: 'step-4', name: 'Escalate overdue', type: 'NOTIFY_ADMINS', config: { message: 'Invoice approval overdue — escalating to Finance Director', priority: 'HIGH' } },
      ],
    },
  ],

  async install(installedBy?: string) {
    const wfs = ONBOARDING_WORKFLOW_PACK.workflows ?? []
    for (const wf of wfs) {
      const existing = await prisma.osWorkflow.findFirst({ where: { name: wf.displayName } })
      if (!existing) {
        await prisma.osWorkflow.create({
          data: {
            name:          wf.displayName,
            description:   wf.description,
            category:      wf.category,
            status:        'draft',
            triggerType:   wf.triggerType,
            triggerConfig: wf.triggerConfig,
            tags:          wf.tags,
            owner:         wf.owner,
            steps:         wf.steps as any,
          },
        })
      }
    }
    await upsertPackRecord(ONBOARDING_WORKFLOW_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: ONBOARDING_WORKFLOW_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const FINANCE_APPROVAL_WORKFLOW_PACK: PackDefinition = {
  packId:      'kangqore/finance-approval-workflows',
  name:        'Finance Approval Workflows',
  version:     '1.0.0',
  description: 'Pre-built workflows for purchase order approval, expense reconciliation, and budget breach alerting. Includes configurable thresholds and escalation chains.',
  author:      'Kangqore',
  category:    'WORKFLOW',
  tags:        ['finance', 'approval', 'budget', 'PO'],
  icon:        '💰',

  workflows: [
    {
      name:        'purchase-order-approval',
      displayName: 'Purchase Order Approval',
      description: 'Routes POs through a 3-tier approval chain based on value. Under £1k: auto-approve. £1k–£10k: manager. Over £10k: Director + CFO.',
      category:    'finance',
      triggerType: 'event',
      triggerConfig: JSON.stringify({ event: 'purchase_order.submitted' }),
      tags:        ['PO', 'finance', 'approval'],
      owner:       'Finance',
      steps: [
        { id: 'step-1', name: 'Evaluate PO value', type: 'NOTIFY_ADMINS', config: { message: 'Purchase order submitted for approval routing', priority: 'LOW' }, onSuccess: 'step-2' },
        { id: 'step-2', name: 'Manager approval', type: 'WAIT_APPROVAL', config: { role: 'MANAGER', timeoutHours: 24 }, onSuccess: 'step-3', onFailure: 'step-5' },
        { id: 'step-3', name: 'Director approval (if >£10k)', type: 'WAIT_APPROVAL', config: { role: 'DIRECTOR', condition: 'amount > 10000', timeoutHours: 48 }, onSuccess: 'step-4', onFailure: 'step-5' },
        { id: 'step-4', name: 'Mark approved', type: 'EMIT_EVENT', config: { eventType: 'INVOICE', description: 'PO approved — proceed to procurement' } },
        { id: 'step-5', name: 'Reject and notify', type: 'NOTIFY_ADMINS', config: { message: 'Purchase order rejected or timed out', priority: 'HIGH' } },
      ],
    },
    {
      name:        'budget-breach-alert',
      displayName: 'Budget Breach Alert',
      description: 'Monitors budget consumption and alerts stakeholders when departmental spend reaches 80% and 100% of approved budget.',
      category:    'finance',
      triggerType: 'schedule',
      triggerConfig: JSON.stringify({ cron: '0 9 * * 1', description: 'Every Monday 9am' }),
      tags:        ['budget', 'finance', 'monitoring'],
      owner:       'Finance',
      steps: [
        { id: 'step-1', name: 'Check budget consumption', type: 'CALL_AGENT', config: { agent: 'FINANCIAL_ANALYST', prompt: 'Check current budget consumption vs approved budgets for all departments. Flag any at ≥80%.' }, onSuccess: 'step-2' },
        { id: 'step-2', name: 'Alert on breach', type: 'NOTIFY_ADMINS', config: { message: 'Weekly budget review complete — check WAANDA briefing for details', priority: 'LOW' } },
      ],
    },
  ],

  async install(installedBy?: string) {
    const wfs = FINANCE_APPROVAL_WORKFLOW_PACK.workflows ?? []
    for (const wf of wfs) {
      const existing = await prisma.osWorkflow.findFirst({ where: { name: wf.displayName } })
      if (!existing) {
        await prisma.osWorkflow.create({
          data: {
            name:          wf.displayName,
            description:   wf.description,
            category:      wf.category,
            status:        'draft',
            triggerType:   wf.triggerType,
            triggerConfig: wf.triggerConfig,
            tags:          wf.tags,
            owner:         wf.owner,
            steps:         wf.steps as any,
          },
        })
      }
    }
    await upsertPackRecord(FINANCE_APPROVAL_WORKFLOW_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: FINANCE_APPROVAL_WORKFLOW_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const GOVERNANCE_POLICIES_PACK: PackDefinition = {
  packId:      'kangqore/governance-policies',
  name:        'Governance Policies',
  version:     '1.0.0',
  description: 'Six foundational KIMMP governance policies covering deletion safeguards, approval gates for high-value actions, external communication controls, and low-signal alerts.',
  author:      'Kangqore',
  category:    'POLICY',
  tags:        ['governance', 'policy', 'compliance', 'safety', 'GRC'],
  icon:        '🔒',

  policies: [
    {
      name:        'Require Approval: Delete Any Record',
      description: 'Any DELETE_RECORD action must pass through L3 human approval before executing.',
      trigger:     'DELETE_RECORD',
      condition:   {},
      effect:      'REQUIRE_APPROVAL',
      priority:    100,
    },
    {
      name:        'Require Approval: External API Calls',
      description: 'All KIMMP-initiated calls to external platforms (Slack, Jira, Salesforce) require explicit admin approval.',
      trigger:     'EXTERNAL_API_CALL',
      condition:   {},
      effect:      'REQUIRE_APPROVAL',
      priority:    90,
    },
    {
      name:        'Require Approval: High-Value Proposals (>£50k)',
      description: 'Any proposal or quote above £50,000 must be reviewed and approved before being sent externally.',
      trigger:     'CREATE_PROPOSAL',
      condition:   { field: 'amount', operator: 'gt', value: 50000 },
      effect:      'REQUIRE_APPROVAL',
      priority:    80,
    },
    {
      name:        'Notify: Low Lead Score Alert',
      description: 'Emit a KIMMP notification whenever a new lead is created with a computed score below 30.',
      trigger:     'CREATE_LEAD',
      condition:   { field: 'score', operator: 'lt', value: 30 },
      effect:      'NOTIFY',
      priority:    50,
    },
    {
      name:        'Block: Large Unreviewed External Spend (>£100k)',
      description: 'Deny any external API action that carries an amount parameter exceeding £100,000 without a prior Director-level approval record.',
      trigger:     'EXTERNAL_API_CALL',
      condition:   { field: 'params.amount', operator: 'gt', value: 100000 },
      effect:      'DENY',
      priority:    95,
    },
    {
      name:        'Notify: All KIMMP Actions (Audit Mode)',
      description: 'Emit an audit notification for every KIMMP action. Designed for onboarding periods or compliance reviews. Disable once mature.',
      trigger:     '*',
      condition:   {},
      effect:      'NOTIFY',
      priority:    10,
    },
  ],

  async install(installedBy?: string) {
    const policies = GOVERNANCE_POLICIES_PACK.policies ?? []
    for (const p of policies) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) {
        await prisma.kimmpPolicy.create({
          data: {
            name:        p.name,
            description: p.description ?? null,
            trigger:     p.trigger,
            condition:   p.condition,
            effect:      p.effect,
            priority:    p.priority,
            enabled:     true,
          },
        })
      }
    }
    await upsertPackRecord(GOVERNANCE_POLICIES_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: GOVERNANCE_POLICIES_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const BASE_AGENTS_PACK: PackDefinition = {
  packId:      'kangqore/base-agents',
  name:        'Base Agent Suite',
  version:     '1.0.0',
  description: 'Five foundational KIMMP agents covering sales, risk, finance, HR, and client success. Each operates at L2 autonomy with targeted tool access and a focused system prompt.',
  author:      'Kangqore',
  category:    'AGENT',
  tags:        ['agents', 'KIMMP', 'automation', 'AI', 'core'],
  icon:        '🤖',

  agents: [
    {
      name:         'Deal Closer',
      role:         'SALES',
      description:  'Monitors pipeline velocity, flags at-risk deals, proposes outreach actions, and drafts follow-up comms for approval.',
      maxLevel:     2,
      tools:        ['READ_CRM', 'DRAFT_EMAIL', 'CREATE_PROPOSAL', 'NOTIFY_ADMINS'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are Deal Closer, Kangqore\'s sales intelligence agent. Monitor the active deals pipeline and identify stalled or at-risk opportunities. Propose targeted follow-up actions, draft approval-required communications, and flag deals that need human escalation. Never send external communications without approval.',
    },
    {
      name:         'Risk Watchdog',
      role:         'RISK_COMPLIANCE',
      description:  'Continuously reviews open risk items, control measure effectiveness, and regulatory deadlines. Escalates critical risks and suggests mitigation actions.',
      maxLevel:     2,
      tools:        ['READ_ONTOLOGY', 'CREATE_RISK', 'NOTIFY_ADMINS', 'DRAFT_REPORT'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are Risk Watchdog, Kangqore\'s risk and compliance agent. Scan the risk register for items that are overdue, escalating in severity, or lacking a control measure. Propose new control measures, alert on regulatory deadlines, and produce concise risk briefings for AEGIS audit. All DENY-level actions require explicit admin approval.',
    },
    {
      name:         'Finance Sentinel',
      role:         'FINANCIAL_ANALYST',
      description:  'Tracks budget consumption, invoice approval SLAs, cash flow signals, and PO anomalies. Raises alerts when thresholds are breached.',
      maxLevel:     2,
      tools:        ['READ_INVOICES', 'READ_BUDGETS', 'NOTIFY_ADMINS', 'DRAFT_REPORT'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are Finance Sentinel, Kangqore\'s financial monitoring agent. Check budget vs actual spend weekly, flag invoices approaching SLA breach, and identify unusual PO patterns. Produce a concise weekly brief for the Finance Director. Flag any anomaly above £10,000 immediately. Never approve payments — propose and escalate only.',
    },
    {
      name:         'HR Coordinator',
      role:         'HR',
      description:  'Manages onboarding checklists, leave request routing, and team capacity signals. Surfaces HR risks before they become incidents.',
      maxLevel:     2,
      tools:        ['READ_TEAM', 'NOTIFY_ADMINS', 'CREATE_TASK', 'DRAFT_EMAIL'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are HR Coordinator, Kangqore\'s people operations agent. Track onboarding task completion, flag overdue leave approvals, and monitor capacity utilisation across teams. Surface any team member who appears overloaded or has not completed mandatory training. Route all external communications through admin approval.',
    },
    {
      name:         'Client Success Manager',
      role:         'CLIENT_SUCCESS',
      description:  'Monitors NPS trends, milestone delivery, and renewal timelines. Proactively proposes QBR prep, escalation calls, and health-score interventions.',
      maxLevel:     2,
      tools:        ['READ_CRM', 'READ_PROJECTS', 'NOTIFY_ADMINS', 'DRAFT_EMAIL', 'CREATE_MEETING'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are Client Success Manager, Kangqore\'s account health agent. Review NPS scores, milestone delivery rates, and upcoming renewal dates weekly. Flag clients at churn risk, propose QBR scheduling, and draft intervention plans for at-risk accounts. All external client-facing communications require approval before dispatch.',
    },
  ],

  async install(installedBy?: string) {
    const agents = BASE_AGENTS_PACK.agents ?? []
    for (const a of agents) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) {
        await prisma.kimmpAgent.create({
          data: {
            name:         a.name,
            role:         a.role,
            description:  a.description ?? null,
            maxLevel:     a.maxLevel,
            tools:        a.tools,
            model:        a.model,
            systemPrompt: a.systemPrompt,
            status:       'ACTIVE',
          },
        })
      }
    }
    await upsertPackRecord(BASE_AGENTS_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: BASE_AGENTS_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

const PROFESSIONAL_SERVICES_PACK: PackDefinition = {
  packId:      'kangqore/professional-services',
  name:        'Professional Services',
  version:     '1.0.0',
  description: 'Full-stack industry pack for consulting and professional services firms. Bundles engagement ontology types, project kickoff and sign-off workflows, billing safeguard policies, and two specialist agents.',
  author:      'Kangqore',
  category:    'INDUSTRY',
  tags:        ['professional-services', 'consulting', 'engagements', 'timesheets', 'PSA'],
  icon:        '🏢',

  ontologyTypes: [
    {
      name:        'Engagement',
      displayName: 'Engagement',
      icon:        'Briefcase',
      color:       '#579bfc',
      description: 'A client engagement or consulting project with SOW, budget, and delivery timeline',
      schema: {
        title:          { type: 'string',  required: true },
        clientName:     { type: 'string',  required: true },
        sowReference:   { type: 'string',  description: 'Statement of Work document reference' },
        engagementType: { type: 'select',  description: 'FIXED_PRICE | TIME_AND_MATERIALS | RETAINER | ADVISORY' },
        budget:         { type: 'number',  description: 'Total approved budget in GBP' },
        currency:       { type: 'string',  description: 'USD | GBP | EUR' },
        startDate:      { type: 'date',    required: true },
        endDate:        { type: 'date' },
        status:         { type: 'select',  description: 'SCOPING | ACTIVE | ON_HOLD | COMPLETED | CANCELLED' },
        leadConsultant: { type: 'string',  description: 'Lead consultant name or user ID' },
        utilizationTarget: { type: 'number', description: 'Target billable utilisation % (e.g. 80)' },
      },
    },
    {
      name:        'Timesheet',
      displayName: 'Timesheet Entry',
      icon:        'Clock',
      color:       '#fdab3d',
      description: 'A billable or non-billable time entry linked to an engagement or internal project',
      schema: {
        consultantName: { type: 'string',  required: true },
        engagementRef:  { type: 'string',  description: 'Engagement or project reference' },
        date:           { type: 'date',    required: true },
        hours:          { type: 'number',  required: true, description: 'Hours worked' },
        billable:       { type: 'boolean', description: 'Is this time billable to the client?' },
        hourlyRate:     { type: 'number',  description: 'Effective hourly rate for billing' },
        activity:       { type: 'string',  description: 'e.g. Discovery, Development, Workshops, Admin' },
        approvedBy:     { type: 'string' },
        notes:          { type: 'string' },
      },
    },
    {
      name:        'Deliverable',
      displayName: 'Deliverable',
      icon:        'FileCheck',
      color:       '#00c875',
      description: 'A contractual deliverable or milestone artefact within an engagement',
      schema: {
        title:          { type: 'string',  required: true },
        engagementRef:  { type: 'string' },
        description:    { type: 'string' },
        type:           { type: 'select',  description: 'DOCUMENT | PRESENTATION | SOFTWARE | WORKSHOP | REPORT | STRATEGY' },
        dueDate:        { type: 'date',    required: true },
        status:         { type: 'select',  description: 'PENDING | IN_PROGRESS | SUBMITTED | APPROVED | REJECTED' },
        submittedAt:    { type: 'date' },
        approvedBy:     { type: 'string' },
        version:        { type: 'string',  description: 'e.g. v1.0, v2.3-draft' },
        value:          { type: 'number',  description: 'Contractual value tied to this deliverable milestone' },
      },
    },
  ],

  workflows: [
    {
      name:        'ps-project-kickoff',
      displayName: 'Project Kickoff',
      description: 'Triggers on engagement status changing to ACTIVE. Assigns a lead consultant, schedules a kickoff call, creates the engagement record, and sends the welcome comms to client.',
      category:    'operations',
      triggerType: 'event',
      triggerConfig: JSON.stringify({ event: 'engagement.status_changed', condition: 'status === "ACTIVE"' }),
      tags:        ['kickoff', 'onboarding', 'professional-services'],
      owner:       'Operations',
      steps: [
        { id: 'step-1', name: 'Notify engagement lead', type: 'NOTIFY_ADMINS', config: { message: 'New engagement activated — assign lead consultant and confirm SOW', priority: 'HIGH' }, onSuccess: 'step-2' },
        { id: 'step-2', name: 'Create engagement record', type: 'CREATE_OBJECT', config: { ontologyType: 'Engagement', properties: { status: 'ACTIVE' } }, onSuccess: 'step-3' },
        { id: 'step-3', name: 'Schedule kickoff call', type: 'EMIT_EVENT', config: { eventType: 'MEETING', description: 'Schedule 2-hour engagement kickoff within 3 business days' }, onSuccess: 'step-4' },
        { id: 'step-4', name: 'Send welcome communication', type: 'NOTIFY_ADMINS', config: { message: 'Draft and send client welcome communication with portal access and kickoff agenda', channel: 'email' }, onSuccess: 'step-5' },
        { id: 'step-5', name: 'Create deliverable plan', type: 'EMIT_EVENT', config: { eventType: 'PROPOSAL', description: 'Create initial deliverable schedule from SOW' } },
      ],
    },
    {
      name:        'ps-deliverable-sign-off',
      displayName: 'Deliverable Sign-off',
      description: 'Routes a submitted deliverable through internal QA then client approval. Flags billing trigger on approval.',
      category:    'operations',
      triggerType: 'event',
      triggerConfig: JSON.stringify({ event: 'deliverable.submitted' }),
      tags:        ['deliverable', 'sign-off', 'billing'],
      owner:       'Operations',
      steps: [
        { id: 'step-1', name: 'Internal QA review', type: 'WAIT_APPROVAL', config: { role: 'MANAGER', timeoutHours: 24, message: 'Deliverable submitted — internal QA review required' }, onSuccess: 'step-2', onFailure: 'step-4' },
        { id: 'step-2', name: 'Send to client for approval', type: 'NOTIFY_ADMINS', config: { message: 'QA passed — send deliverable to client for sign-off', channel: 'email' }, onSuccess: 'step-3' },
        { id: 'step-3', name: 'Trigger milestone billing', type: 'EMIT_EVENT', config: { eventType: 'INVOICE', description: 'Deliverable approved — trigger milestone invoice if contracted value attached' } },
        { id: 'step-4', name: 'Return for rework', type: 'NOTIFY_ADMINS', config: { message: 'Deliverable failed QA — returned to consultant for revision', priority: 'MEDIUM' } },
      ],
    },
  ],

  policies: [
    {
      name:        'Require Approval: New Engagement Billing',
      description: 'Any auto-billing action triggered by an engagement milestone must be approved before invoice creation.',
      trigger:     'CREATE_INVOICE',
      condition:   { field: 'source', operator: 'eq', value: 'engagement_milestone' },
      effect:      'REQUIRE_APPROVAL',
      priority:    85,
    },
    {
      name:        'Block: Auto-Invoice Without Signed Deliverable',
      description: 'Deny invoice creation if no approved deliverable record is linked to the billing event.',
      trigger:     'CREATE_INVOICE',
      condition:   { field: 'deliverableApproved', operator: 'eq', value: false },
      effect:      'DENY',
      priority:    90,
    },
  ],

  agents: [
    {
      name:         'PSA Analyst',
      role:         'PROFESSIONAL_SERVICES',
      description:  'Monitors engagement health, billable vs non-billable split, and deliverable delivery against contracted dates.',
      maxLevel:     2,
      tools:        ['READ_ONTOLOGY', 'READ_PROJECTS', 'NOTIFY_ADMINS', 'DRAFT_REPORT'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are PSA Analyst, Kangqore\'s professional services intelligence agent. Monitor all active engagements for scope creep, budget overrun risk, and deliverable delays. Produce a weekly engagement health report. Flag any engagement where billable utilisation has dropped below 70% for more than 2 consecutive weeks.',
    },
    {
      name:         'Utilization Optimizer',
      role:         'RESOURCE_PLANNING',
      description:  'Analyses timesheet data across all consultants to surface utilisation gaps, suggest rebalancing, and predict capacity bottlenecks.',
      maxLevel:     2,
      tools:        ['READ_ONTOLOGY', 'READ_TEAM', 'NOTIFY_ADMINS', 'DRAFT_REPORT'],
      model:        'claude-sonnet-4-6',
      systemPrompt: 'You are Utilization Optimizer, Kangqore\'s capacity planning agent. Analyse timesheet entries weekly to compute billable utilisation per consultant. Identify under-utilised consultants (< 60%) and over-capacity risks (> 90%). Suggest rebalancing recommendations and flag any consultant at risk of burn-out before it becomes a retention issue.',
    },
  ],

  async install(installedBy?: string) {
    // Ontology types
    const types = PROFESSIONAL_SERVICES_PACK.ontologyTypes ?? []
    for (const t of types) {
      await prisma.ontologyObjectType.upsert({
        where:  { name: t.name },
        create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema },
        update: { displayName: t.displayName, description: t.description },
      })
    }
    // Workflows
    const wfs = PROFESSIONAL_SERVICES_PACK.workflows ?? []
    for (const wf of wfs) {
      const existing = await prisma.osWorkflow.findFirst({ where: { name: wf.displayName } })
      if (!existing) {
        await prisma.osWorkflow.create({
          data: {
            name:          wf.displayName,
            description:   wf.description,
            category:      wf.category,
            status:        'draft',
            triggerType:   wf.triggerType,
            triggerConfig: wf.triggerConfig,
            tags:          wf.tags,
            owner:         wf.owner,
            steps:         wf.steps as any,
          },
        })
      }
    }
    // Policies
    const policies = PROFESSIONAL_SERVICES_PACK.policies ?? []
    for (const p of policies) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) {
        await prisma.kimmpPolicy.create({
          data: {
            name:        p.name,
            description: p.description ?? null,
            trigger:     p.trigger,
            condition:   p.condition,
            effect:      p.effect,
            priority:    p.priority,
            enabled:     true,
          },
        })
      }
    }
    // Agents
    const agents = PROFESSIONAL_SERVICES_PACK.agents ?? []
    for (const a of agents) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) {
        await prisma.kimmpAgent.create({
          data: {
            name:         a.name,
            role:         a.role,
            description:  a.description ?? null,
            maxLevel:     a.maxLevel,
            tools:        a.tools,
            model:        a.model,
            systemPrompt: a.systemPrompt,
            status:       'ACTIVE',
          },
        })
      }
    }
    await upsertPackRecord(PROFESSIONAL_SERVICES_PACK, installedBy)
  },

  async uninstall() {
    await prisma.packManifest.update({ where: { packId: PROFESSIONAL_SERVICES_PACK.packId }, data: { installed: false, installedAt: null } })
  },
}

// ── S97 Industry Packs ────────────────────────────────────────────────────────

const HEALTHCARE_PACK: PackDefinition = {
  packId: 'kangqore/healthcare', name: 'Healthcare Pack™', version: '1.0.0',
  description: 'Clinical operations, patient journey, regulatory compliance (HIPAA/CQC), care coordination, and clinical risk for healthcare organisations.',
  author: 'Kangqore', category: 'INDUSTRY',
  tags: ['healthcare', 'clinical', 'HIPAA', 'patient', 'care-coordination'],
  icon: '🏥',
  ontologyTypes: [
    { name: 'Patient', displayName: 'Patient Record', icon: 'User', color: '#0891b2',
      description: 'De-identified patient episode with care pathway and risk flags',
      schema: { episodeRef: { type: 'string', required: true }, pathway: { type: 'select', description: 'INPATIENT | OUTPATIENT | EMERGENCY | ELECTIVE' }, riskScore: { type: 'number' }, consultant: { type: 'string' }, admissionDate: { type: 'date' }, dischargeDate: { type: 'date' }, status: { type: 'select', description: 'ACTIVE | DISCHARGED | FOLLOW_UP | DECEASED' } } },
    { name: 'ClinicalIncident', displayName: 'Clinical Incident', icon: 'AlertTriangle', color: '#e2445c',
      description: 'A patient safety incident or near-miss requiring investigation',
      schema: { title: { type: 'string', required: true }, severity: { type: 'select', description: 'NEVER_EVENT | SERIOUS | MODERATE | MINOR | NEAR_MISS' }, reportedBy: { type: 'string' }, occurredAt: { type: 'date' }, rootCause: { type: 'string' }, status: { type: 'select', description: 'REPORTED | UNDER_REVIEW | CLOSED' } } },
    { name: 'CarePathway', displayName: 'Care Pathway', icon: 'GitBranch', color: '#7c3aed',
      description: 'A standardised clinical pathway for a diagnosis or procedure',
      schema: { name: { type: 'string', required: true }, indication: { type: 'string' }, expectedDuration: { type: 'string' }, steps: { type: 'string', description: 'JSON array of steps' }, owner: { type: 'string' }, lastReviewed: { type: 'date' } } },
  ],
  workflows: [
    { name: 'clinical-incident-report', displayName: 'Clinical Incident Reporting', description: 'Routes clinical incidents through initial triage, investigation, and closure. Escalates Never Events immediately.', category: 'compliance', triggerType: 'event', triggerConfig: JSON.stringify({ event: 'incident.reported' }), tags: ['clinical', 'safety'], owner: 'Clinical Governance',
      steps: [ { id: 'step-1', name: 'Triage severity', type: 'NOTIFY_ADMINS', config: { message: 'Clinical incident reported — triage and classify severity', priority: 'HIGH' }, onSuccess: 'step-2' }, { id: 'step-2', name: 'Assign investigator', type: 'WAIT_APPROVAL', config: { role: 'MANAGER', timeoutHours: 4 }, onSuccess: 'step-3' }, { id: 'step-3', name: 'Root cause analysis', type: 'EMIT_EVENT', config: { eventType: 'MEETING', description: 'Schedule RCA session within 72 hours' } } ] },
  ],
  policies: [
    { name: 'Block: Unreviewed Patient Data Export', description: 'Deny any bulk export of patient data without a signed data sharing agreement on record.', trigger: 'EXTERNAL_API_CALL', condition: { field: 'dataType', operator: 'eq', value: 'patient' }, effect: 'DENY', priority: 100 },
    { name: 'Notify: Never Event Reported', description: 'Immediate KIMMP alert when a Never Event severity incident is logged.', trigger: 'CREATE_CLINICAL_INCIDENT', condition: { field: 'severity', operator: 'eq', value: 'NEVER_EVENT' }, effect: 'NOTIFY', priority: 99 },
  ],
  agents: [
    { name: 'Clinical Safety Monitor', role: 'CLINICAL_SAFETY', description: 'Reviews open clinical incidents, flags overdue investigations, and produces weekly safety briefings.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are Clinical Safety Monitor, a healthcare intelligence agent. Review open clinical incidents weekly. Flag any incident that has not been investigated within SLA. Produce a concise safety briefing. Never access identifiable patient data directly — work from de-identified episode references only.' },
  ],
  async install(installedBy?: string) {
    for (const t of HEALTHCARE_PACK.ontologyTypes ?? []) {
      await prisma.ontologyObjectType.upsert({ where: { name: t.name }, create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema }, update: { displayName: t.displayName, description: t.description } })
    }
    for (const wf of HEALTHCARE_PACK.workflows ?? []) {
      const existing = await prisma.osWorkflow.findFirst({ where: { name: wf.displayName } })
      if (!existing) await prisma.osWorkflow.create({ data: { name: wf.displayName, description: wf.description, category: wf.category, status: 'draft', triggerType: wf.triggerType, triggerConfig: wf.triggerConfig, tags: wf.tags, owner: wf.owner, steps: wf.steps as any } })
    }
    for (const p of HEALTHCARE_PACK.policies ?? []) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) await prisma.kimmpPolicy.create({ data: { name: p.name, description: p.description ?? null, trigger: p.trigger, condition: p.condition, effect: p.effect, priority: p.priority, enabled: true } })
    }
    for (const a of HEALTHCARE_PACK.agents ?? []) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) await prisma.kimmpAgent.create({ data: { name: a.name, role: a.role, description: a.description ?? null, maxLevel: a.maxLevel, tools: a.tools, model: a.model, systemPrompt: a.systemPrompt, status: 'ACTIVE' } })
    }
    await upsertPackRecord(HEALTHCARE_PACK, installedBy)
  },
  async uninstall() { await prisma.packManifest.update({ where: { packId: HEALTHCARE_PACK.packId }, data: { installed: false, installedAt: null } }) },
}

const MANUFACTURING_PACK: PackDefinition = {
  packId: 'kangqore/manufacturing', name: 'Manufacturing Pack™', version: '1.0.0',
  description: 'Shop floor operations, production orders, quality control (ISO 9001), OEE tracking, defect management, and supply chain for manufacturers.',
  author: 'Kangqore', category: 'INDUSTRY',
  tags: ['manufacturing', 'shop-floor', 'OEE', 'ISO9001', 'production', 'quality'],
  icon: '🏭',
  ontologyTypes: [
    { name: 'ProductionOrder', displayName: 'Production Order', icon: 'Package', color: '#f59e0b',
      description: 'A manufacturing work order tied to a product, BOM, and schedule',
      schema: { orderRef: { type: 'string', required: true }, product: { type: 'string', required: true }, quantity: { type: 'number', required: true }, unit: { type: 'string' }, scheduledStart: { type: 'date' }, scheduledEnd: { type: 'date' }, status: { type: 'select', description: 'PLANNED | IN_PROGRESS | COMPLETED | SCRAPPED | ON_HOLD' }, line: { type: 'string', description: 'Production line ID' } } },
    { name: 'QualityDefect', displayName: 'Quality Defect', icon: 'AlertOctagon', color: '#e2445c',
      description: 'A defect found during production or quality inspection',
      schema: { title: { type: 'string', required: true }, productRef: { type: 'string' }, defectType: { type: 'select', description: 'DIMENSIONAL | SURFACE | FUNCTIONAL | PACKAGING | DOCUMENTATION' }, severity: { type: 'select', description: 'CRITICAL | MAJOR | MINOR' }, quantity: { type: 'number' }, discoveredAt: { type: 'date' }, disposition: { type: 'select', description: 'SCRAP | REWORK | ACCEPT | UNDER_REVIEW' }, rootCause: { type: 'string' } } },
    { name: 'MachineAsset', displayName: 'Machine Asset', icon: 'Settings', color: '#10b981',
      description: 'A production machine or line with OEE and maintenance tracking',
      schema: { assetId: { type: 'string', required: true }, name: { type: 'string', required: true }, line: { type: 'string' }, availability: { type: 'number', description: 'OEE availability %' }, performance: { type: 'number', description: 'OEE performance %' }, quality: { type: 'number', description: 'OEE quality %' }, oee: { type: 'number', description: 'Overall Equipment Effectiveness %' }, nextMaintenanceDate: { type: 'date' }, status: { type: 'select', description: 'RUNNING | STOPPED | MAINTENANCE | BREAKDOWN' } } },
  ],
  policies: [
    { name: 'Block: Ship Without Quality Sign-off', description: 'Deny shipment dispatch if no approved quality inspection record is linked to the production order.', trigger: 'CREATE_SHIPMENT', condition: { field: 'qualityApproved', operator: 'eq', value: false }, effect: 'DENY', priority: 95 },
    { name: 'Notify: OEE Below 70%', description: 'Alert operations when any machine OEE drops below 70% for 2 consecutive shifts.', trigger: 'OEE_THRESHOLD_BREACH', condition: { field: 'oee', operator: 'lt', value: 70 }, effect: 'NOTIFY', priority: 80 },
  ],
  agents: [
    { name: 'OEE Sentinel', role: 'OPERATIONS_ANALYST', description: 'Monitors production line OEE, flags downtime root causes, and proposes maintenance scheduling.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are OEE Sentinel, a manufacturing intelligence agent. Monitor production line OEE weekly. Flag any machine below 70% OEE. Identify top defect categories and propose root cause investigations. Surface any production order at risk of missing its schedule date.' },
  ],
  workflows: [],
  async install(installedBy?: string) {
    for (const t of MANUFACTURING_PACK.ontologyTypes ?? []) {
      await prisma.ontologyObjectType.upsert({ where: { name: t.name }, create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema }, update: { displayName: t.displayName, description: t.description } })
    }
    for (const p of MANUFACTURING_PACK.policies ?? []) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) await prisma.kimmpPolicy.create({ data: { name: p.name, description: p.description ?? null, trigger: p.trigger, condition: p.condition, effect: p.effect, priority: p.priority, enabled: true } })
    }
    for (const a of MANUFACTURING_PACK.agents ?? []) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) await prisma.kimmpAgent.create({ data: { name: a.name, role: a.role, description: a.description ?? null, maxLevel: a.maxLevel, tools: a.tools, model: a.model, systemPrompt: a.systemPrompt, status: 'ACTIVE' } })
    }
    await upsertPackRecord(MANUFACTURING_PACK, installedBy)
  },
  async uninstall() { await prisma.packManifest.update({ where: { packId: MANUFACTURING_PACK.packId }, data: { installed: false, installedAt: null } }) },
}

const BFSI_PACK: PackDefinition = {
  packId: 'kangqore/bfsi', name: 'BFSI Pack™', version: '1.0.0',
  description: 'Banking, Financial Services & Insurance: credit risk, regulatory reporting (Basel III/IFRS 9), AML/KYC workflows, audit trail, and compliance gatekeeping.',
  author: 'Kangqore', category: 'INDUSTRY',
  tags: ['banking', 'financial-services', 'insurance', 'AML', 'KYC', 'Basel', 'IFRS9'],
  icon: '🏦',
  ontologyTypes: [
    { name: 'CreditExposure', displayName: 'Credit Exposure', icon: 'TrendingDown', color: '#e2445c',
      description: 'A loan, facility, or counterparty exposure with risk rating and provisions',
      schema: { facilityRef: { type: 'string', required: true }, counterparty: { type: 'string', required: true }, exposure: { type: 'number', required: true, description: 'Outstanding balance in base currency' }, currency: { type: 'string' }, riskRating: { type: 'select', description: 'PERFORMING | WATCH | SUB_STANDARD | DOUBTFUL | LOSS' }, pd: { type: 'number', description: 'Probability of Default %' }, lgd: { type: 'number', description: 'Loss Given Default %' }, provision: { type: 'number', description: 'IFRS 9 expected credit loss provision' }, maturityDate: { type: 'date' } } },
    { name: 'RegulatoryFiling', displayName: 'Regulatory Filing', icon: 'FileText', color: '#7c3aed',
      description: 'A statutory regulatory submission (COREP, FINREP, CCAR, MAS, etc.)',
      schema: { filingType: { type: 'string', required: true, description: 'e.g. COREP, FINREP, CCAR' }, regulator: { type: 'string', required: true }, period: { type: 'string', description: 'e.g. 2026-Q1' }, dueDate: { type: 'date', required: true }, submittedAt: { type: 'date' }, status: { type: 'select', description: 'PENDING | SUBMITTED | ACCEPTED | QUERIED | REJECTED' }, owner: { type: 'string' } } },
    { name: 'AMLAlert', displayName: 'AML Alert', icon: 'ShieldAlert', color: '#f59e0b',
      description: 'An anti-money laundering transaction alert requiring investigation',
      schema: { alertRef: { type: 'string', required: true }, transactionRef: { type: 'string' }, amount: { type: 'number' }, currency: { type: 'string' }, ruleTriggered: { type: 'string' }, riskScore: { type: 'number' }, status: { type: 'select', description: 'OPEN | UNDER_REVIEW | ESCALATED | CLEARED | SAR_FILED' }, analyst: { type: 'string' } } },
  ],
  policies: [
    { name: 'Require Approval: SAR Filing', description: 'Any Suspicious Activity Report must be reviewed by the MLRO before submission.', trigger: 'FILE_SAR', condition: {}, effect: 'REQUIRE_APPROVAL', priority: 100 },
    { name: 'Block: Uncleared AML Alert — Transaction Above Threshold', description: 'Deny processing transactions above £50,000 where an open AML alert exists for the counterparty.', trigger: 'PROCESS_TRANSACTION', condition: { field: 'openAmlAlerts', operator: 'gt', value: 0 }, effect: 'DENY', priority: 98 },
  ],
  agents: [
    { name: 'Credit Risk Analyst', role: 'RISK_COMPLIANCE', description: 'Monitors credit exposures, flags stage migrations under IFRS 9, and produces weekly credit risk briefings.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are Credit Risk Analyst, a banking intelligence agent. Review credit exposures weekly for rating downgrades, PD increases, and provision gaps. Flag any stage 2→3 migration under IFRS 9. Produce a concise credit risk briefing for the Chief Risk Officer. Never approve credit decisions — analyse and escalate only.' },
    { name: 'Regulatory Compliance Monitor', role: 'REGULATORY', description: 'Tracks regulatory filing deadlines, flags overdue submissions, and monitors AML alert resolution SLAs.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are Regulatory Compliance Monitor, tracking all regulatory filings and AML alerts. Flag filings approaching their due date. Escalate AML alerts that have been open beyond SLA. Produce a weekly compliance status report for the Chief Compliance Officer.' },
  ],
  workflows: [],
  async install(installedBy?: string) {
    for (const t of BFSI_PACK.ontologyTypes ?? []) {
      await prisma.ontologyObjectType.upsert({ where: { name: t.name }, create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema }, update: { displayName: t.displayName, description: t.description } })
    }
    for (const p of BFSI_PACK.policies ?? []) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) await prisma.kimmpPolicy.create({ data: { name: p.name, description: p.description ?? null, trigger: p.trigger, condition: p.condition, effect: p.effect, priority: p.priority, enabled: true } })
    }
    for (const a of BFSI_PACK.agents ?? []) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) await prisma.kimmpAgent.create({ data: { name: a.name, role: a.role, description: a.description ?? null, maxLevel: a.maxLevel, tools: a.tools, model: a.model, systemPrompt: a.systemPrompt, status: 'ACTIVE' } })
    }
    await upsertPackRecord(BFSI_PACK, installedBy)
  },
  async uninstall() { await prisma.packManifest.update({ where: { packId: BFSI_PACK.packId }, data: { installed: false, installedAt: null } }) },
}

const LOGISTICS_PACK: PackDefinition = {
  packId: 'kangqore/logistics', name: 'Logistics Pack™', version: '1.0.0',
  description: 'Supply chain visibility, shipment tracking, carrier management, customs compliance, and last-mile delivery intelligence for logistics operators.',
  author: 'Kangqore', category: 'INDUSTRY',
  tags: ['logistics', 'supply-chain', 'shipment', 'carrier', 'customs', 'last-mile'],
  icon: '🚢',
  ontologyTypes: [
    { name: 'Shipment', displayName: 'Shipment', icon: 'Package', color: '#0891b2',
      description: 'A tracked shipment from origin to destination with carrier and customs data',
      schema: { trackingRef: { type: 'string', required: true }, origin: { type: 'string', required: true }, destination: { type: 'string', required: true }, carrier: { type: 'string' }, mode: { type: 'select', description: 'SEA | AIR | ROAD | RAIL | MULTIMODAL' }, etd: { type: 'date' }, eta: { type: 'date' }, actualArrival: { type: 'date' }, status: { type: 'select', description: 'BOOKED | IN_TRANSIT | CUSTOMS | DELIVERED | EXCEPTION' }, value: { type: 'number' }, currency: { type: 'string' }, customsClearedAt: { type: 'date' } } },
    { name: 'CarrierContract', displayName: 'Carrier Contract', icon: 'FileSignature', color: '#7c3aed',
      description: 'A rate agreement with a logistics carrier including SLA and lane details',
      schema: { carrier: { type: 'string', required: true }, lanes: { type: 'string', description: 'Origin–destination lanes covered' }, rateType: { type: 'select', description: 'SPOT | CONTRACT | TENDER' }, validFrom: { type: 'date' }, validTo: { type: 'date' }, currency: { type: 'string' }, slaOnTime: { type: 'number', description: 'Contracted on-time delivery %' }, status: { type: 'select', description: 'ACTIVE | UNDER_REVIEW | EXPIRED | TERMINATED' } } },
  ],
  policies: [
    { name: 'Notify: Shipment Exception — ETA Missed', description: 'Alert operations when a shipment has missed its ETA by more than 24 hours with no update.', trigger: 'SHIPMENT_ETA_MISSED', condition: { field: 'delayHours', operator: 'gt', value: 24 }, effect: 'NOTIFY', priority: 85 },
  ],
  agents: [
    { name: 'Supply Chain Watcher', role: 'OPERATIONS_ANALYST', description: 'Monitors active shipments for exceptions, carrier SLA breaches, and customs holds.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are Supply Chain Watcher, a logistics intelligence agent. Monitor all active shipments daily. Flag exceptions: customs delays > 48h, carrier SLA breaches, missing tracking updates > 12h. Produce a daily exception report. Suggest carrier reallocation when SLA breach patterns emerge.' },
  ],
  workflows: [],
  async install(installedBy?: string) {
    for (const t of LOGISTICS_PACK.ontologyTypes ?? []) {
      await prisma.ontologyObjectType.upsert({ where: { name: t.name }, create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema }, update: { displayName: t.displayName, description: t.description } })
    }
    for (const p of LOGISTICS_PACK.policies ?? []) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) await prisma.kimmpPolicy.create({ data: { name: p.name, description: p.description ?? null, trigger: p.trigger, condition: p.condition, effect: p.effect, priority: p.priority, enabled: true } })
    }
    for (const a of LOGISTICS_PACK.agents ?? []) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) await prisma.kimmpAgent.create({ data: { name: a.name, role: a.role, description: a.description ?? null, maxLevel: a.maxLevel, tools: a.tools, model: a.model, systemPrompt: a.systemPrompt, status: 'ACTIVE' } })
    }
    await upsertPackRecord(LOGISTICS_PACK, installedBy)
  },
  async uninstall() { await prisma.packManifest.update({ where: { packId: LOGISTICS_PACK.packId }, data: { installed: false, installedAt: null } }) },
}

const GOVERNMENT_PACK: PackDefinition = {
  packId: 'kangqore/government', name: 'Government Pack™', version: '1.0.0',
  description: 'Public sector: procurement governance (OJEU/G-Cloud), FOI request management, policy lifecycle, ministerial briefings, and public accountability reporting.',
  author: 'Kangqore', category: 'INDUSTRY',
  tags: ['government', 'public-sector', 'procurement', 'FOI', 'policy', 'transparency'],
  icon: '🏛️',
  ontologyTypes: [
    { name: 'ProcurementCase', displayName: 'Procurement Case', icon: 'ShoppingCart', color: '#0891b2',
      description: 'A public procurement exercise with route-to-market, evaluation, and award',
      schema: { reference: { type: 'string', required: true }, title: { type: 'string', required: true }, routeToMarket: { type: 'select', description: 'OJEU_OPEN | OJEU_RESTRICTED | G_CLOUD | DPS | DIRECT_AWARD | FRAMEWORK | PIN' }, estimatedValue: { type: 'number' }, currency: { type: 'string' }, publicationDate: { type: 'date' }, awardDate: { type: 'date' }, status: { type: 'select', description: 'PLANNING | PUBLISHED | EVALUATION | AWARDED | CANCELLED | CHALLENGED' }, awardedSupplier: { type: 'string' }, standstillEnd: { type: 'date' } } },
    { name: 'FOIRequest', displayName: 'FOI Request', icon: 'Eye', color: '#7c3aed',
      description: 'A Freedom of Information or Subject Access Request with deadline and disclosure decision',
      schema: { reference: { type: 'string', required: true }, requestedBy: { type: 'string' }, summary: { type: 'string', required: true }, receivedDate: { type: 'date', required: true }, deadline: { type: 'date', required: true }, extension: { type: 'boolean' }, decision: { type: 'select', description: 'PENDING | FULLY_DISCLOSED | PARTIALLY_DISCLOSED | REFUSED | TRANSFERRED' }, exemptionsApplied: { type: 'string' }, closedAt: { type: 'date' } } },
    { name: 'PolicyDocument', displayName: 'Policy Document', icon: 'FileText', color: '#10b981',
      description: 'A ministerial or departmental policy document with review cycle and stakeholder clearance',
      schema: { title: { type: 'string', required: true }, policyOwner: { type: 'string' }, status: { type: 'select', description: 'DRAFT | CONSULTATION | CLEARANCE | APPROVED | ARCHIVED' }, version: { type: 'string' }, effectiveDate: { type: 'date' }, reviewDate: { type: 'date' }, clearanceLevel: { type: 'select', description: 'INTERNAL | OFFICIAL | SENSITIVE | SECRET' } } },
  ],
  policies: [
    { name: 'Require Approval: Contract Award Above £100k', description: 'Any procurement contract award above £100,000 must pass accounting officer approval before notification.', trigger: 'AWARD_CONTRACT', condition: { field: 'value', operator: 'gt', value: 100000 }, effect: 'REQUIRE_APPROVAL', priority: 95 },
    { name: 'Notify: FOI Deadline Within 5 Days', description: 'Alert the information governance team when a FOI response deadline is within 5 calendar days.', trigger: 'FOI_DEADLINE_APPROACHING', condition: { field: 'daysRemaining', operator: 'lte', value: 5 }, effect: 'NOTIFY', priority: 90 },
  ],
  agents: [
    { name: 'Public Accountability Monitor', role: 'GOVERNANCE', description: 'Tracks FOI deadlines, procurement award notices, and policy review cycles. Flags compliance risks.', maxLevel: 2, tools: ['READ_ONTOLOGY', 'NOTIFY_ADMINS', 'DRAFT_REPORT'], model: 'claude-sonnet-4-6', systemPrompt: 'You are Public Accountability Monitor, a public sector governance agent. Track all open FOI requests with deadlines approaching. Flag procurement cases in standstill period. Surface policy documents approaching their review date. Produce a weekly compliance dashboard for the permanent secretary. All outputs should reflect public accountability standards.' },
  ],
  workflows: [],
  async install(installedBy?: string) {
    for (const t of GOVERNMENT_PACK.ontologyTypes ?? []) {
      await prisma.ontologyObjectType.upsert({ where: { name: t.name }, create: { name: t.name, displayName: t.displayName, icon: t.icon, color: t.color, description: t.description, schema: t.schema }, update: { displayName: t.displayName, description: t.description } })
    }
    for (const p of GOVERNMENT_PACK.policies ?? []) {
      const existing = await prisma.kimmpPolicy.findFirst({ where: { name: p.name } })
      if (!existing) await prisma.kimmpPolicy.create({ data: { name: p.name, description: p.description ?? null, trigger: p.trigger, condition: p.condition, effect: p.effect, priority: p.priority, enabled: true } })
    }
    for (const a of GOVERNMENT_PACK.agents ?? []) {
      const existing = await prisma.kimmpAgent.findFirst({ where: { name: a.name } })
      if (!existing) await prisma.kimmpAgent.create({ data: { name: a.name, role: a.role, description: a.description ?? null, maxLevel: a.maxLevel, tools: a.tools, model: a.model, systemPrompt: a.systemPrompt, status: 'ACTIVE' } })
    }
    await upsertPackRecord(GOVERNMENT_PACK, installedBy)
  },
  async uninstall() { await prisma.packManifest.update({ where: { packId: GOVERNMENT_PACK.packId }, data: { installed: false, installedAt: null } }) },
}

// ── Registry ──────────────────────────────────────────────────────────────────

const BUILT_IN_PACKS: PackDefinition[] = [
  RISK_MANAGEMENT_PACK,
  CLIENT_LIFECYCLE_PACK,
  VENDOR_MANAGEMENT_PACK,
  ONBOARDING_WORKFLOW_PACK,
  FINANCE_APPROVAL_WORKFLOW_PACK,
  GOVERNANCE_POLICIES_PACK,
  BASE_AGENTS_PACK,
  PROFESSIONAL_SERVICES_PACK,
  HEALTHCARE_PACK,
  MANUFACTURING_PACK,
  BFSI_PACK,
  LOGISTICS_PACK,
  GOVERNMENT_PACK,
]

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertPackRecord(pack: PackDefinition, installedBy?: string) {
  await prisma.packManifest.upsert({
    where: { packId: pack.packId },
    create: {
      packId:      pack.packId,
      name:        pack.name,
      version:     pack.version,
      description: pack.description,
      author:      pack.author,
      category:    pack.category,
      tags:        pack.tags,
      icon:        pack.icon,
      installed:   true,
      installedAt: new Date(),
      installedBy: installedBy ?? null,
    },
    update: {
      version:     pack.version,
      installed:   true,
      installedAt: new Date(),
      installedBy: installedBy ?? null,
    },
  })
}

// ── Service ───────────────────────────────────────────────────────────────────

export const PackRegistry = {

  // Returns all available packs merged with their DB installation state
  async list(category?: PackCategory) {
    const dbRecords = await prisma.packManifest.findMany()
    const dbMap = new Map(dbRecords.map(r => [r.packId, r]))

    let packs = BUILT_IN_PACKS
    if (category) packs = packs.filter(p => p.category === category)

    return packs.map(p => {
      const db = dbMap.get(p.packId)
      return {
        packId:      p.packId,
        name:        p.name,
        version:     p.version,
        description: p.description,
        author:      p.author,
        category:    p.category,
        tags:        p.tags,
        icon:        p.icon,
        installed:   db?.installed ?? false,
        installedAt: db?.installedAt ?? null,
        installedBy: db?.installedBy ?? null,
        ontologyTypeCount: p.ontologyTypes?.length ?? 0,
        workflowCount:     p.workflows?.length     ?? 0,
        policyCount:       p.policies?.length      ?? 0,
        agentCount:        p.agents?.length        ?? 0,
        contents: {
          ontologyTypes: p.ontologyTypes?.map(t => ({ name: t.name, displayName: t.displayName, description: t.description })) ?? [],
          workflows:     p.workflows?.map(w => ({ name: w.displayName, description: w.description, triggerType: w.triggerType, stepCount: w.steps.length })) ?? [],
          policies:      p.policies?.map(pol => ({ name: pol.name, description: pol.description, trigger: pol.trigger, effect: pol.effect, priority: pol.priority })) ?? [],
          agents:        p.agents?.map(a => ({ name: a.name, role: a.role, description: a.description, maxLevel: a.maxLevel })) ?? [],
        },
      }
    })
  },

  async install(packId: string, installedBy?: string) {
    const pack = BUILT_IN_PACKS.find(p => p.packId === packId)
    if (!pack) throw new Error(`Unknown pack: ${packId}`)
    await pack.install(installedBy)
  },

  async uninstall(packId: string) {
    const pack = BUILT_IN_PACKS.find(p => p.packId === packId)
    if (!pack) throw new Error(`Unknown pack: ${packId}`)
    if (!pack.uninstall) throw new Error(`Pack ${packId} does not support uninstall`)
    await pack.uninstall()
  },

  async stats() {
    const all   = BUILT_IN_PACKS.length
    const dbRec = await prisma.packManifest.findMany({ where: { installed: true } })
    const installed = dbRec.length
    const byCategory: Record<string, number> = {}
    for (const p of BUILT_IN_PACKS) {
      byCategory[p.category] = (byCategory[p.category] ?? 0) + 1
    }
    return { total: all, installed, available: all - installed, byCategory }
  },
}
