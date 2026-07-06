/**
 * Foundation onboarding seed — tenant-agnostic.
 *
 * Creates:
 *   1. Base ontology object types (10 PS entity types)
 *   2. Enterprise definition with default PS goals
 *   3. Enterprise policies (5 governance rules)
 *   4. All 9 Commercial Engineering workflow templates
 *   5. A KIMMP goal for each enterprise goal (operational layer)
 *
 * Safe to run multiple times — idempotent on name/pillar.
 *
 * Usage:
 *   npx tsx src/scripts/seedFoundation.ts
 *   npx tsx src/scripts/seedFoundation.ts --org <organizationId>  (future multi-tenant)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ENTITY_TYPES = [
  { name: 'Client',        color: '#579bfc', icon: 'building2',     description: 'An organization purchasing professional services.' },
  { name: 'Project',       color: '#00c875', icon: 'folder-kanban', description: 'A scoped engagement delivered for a client.' },
  { name: 'Deliverable',   color: '#0ea5e9', icon: 'file-check',    description: 'A specific output or artifact within a project.' },
  { name: 'Milestone',     color: '#a855f7', icon: 'flag',          description: 'A time-bound checkpoint within a project.' },
  { name: 'Invoice',       color: '#fdab3d', icon: 'receipt',       description: 'A billing document issued to a client.' },
  { name: 'Risk',          color: '#e2445c', icon: 'alert-triangle', description: 'A potential issue affecting delivery or revenue.' },
  { name: 'Lead',          color: '#7c3aed', icon: 'user-plus',     description: 'A prospective client in the sales pipeline.' },
  { name: 'Proposal',      color: '#eab308', icon: 'file-text',     description: 'A formal commercial proposal to a prospect.' },
  { name: 'Resource',      color: '#66ccff', icon: 'user-check',    description: 'A person or capacity unit assigned to work.' },
  { name: 'ChangeRequest', color: '#f97316', icon: 'git-pull-request', description: 'A formal scope, timeline, or budget change request.' },
]

const ENTERPRISE_GOALS = [
  { pillar: 'REVENUE',      label: 'Annual Revenue',        target: 10,  unit: '₹ Cr', weight: 1.5 },
  { pillar: 'MARGIN',       label: 'Project Margin',        target: 35,  unit: '%',    weight: 1.3 },
  { pillar: 'NPS',          label: 'Client NPS',            target: 75,  unit: 'score',weight: 1.0 },
  { pillar: 'DELIVERY_SLA', label: 'Delivery SLA Adherence',target: 98,  unit: '%',    weight: 1.2 },
  { pillar: 'UTILIZATION',  label: 'Employee Utilization',  target: 82,  unit: '%',    weight: 1.0 },
]

const POLICIES = [
  { name: 'Block unauthorised external writes',  description: 'Any EXTERNAL_API_CALL must pass L3 approval.',                    trigger: 'EXTERNAL_API_CALL', condition: {},                                            effect: 'REQUIRE_APPROVAL', priority: 100 },
  { name: 'Notify on critical risk',             description: 'CRITICAL risks must trigger an internal notification.',             trigger: 'CREATE_RISK',       condition: { field: 'severity', operator: 'eq', value: 'CRITICAL' }, effect: 'NOTIFY',            priority: 90  },
  { name: 'Require approval for large invoices', description: 'Invoices above ₹5 lakh require L3 approval.',                     trigger: 'CREATE_INVOICE',    condition: { field: 'amount',   operator: 'gte', value: 500000   }, effect: 'REQUIRE_APPROVAL', priority: 80  },
  { name: 'Block record deletion',               description: 'WAANDA may never delete records — only archive.',                  trigger: 'DELETE_RECORD',     condition: {},                                            effect: 'DENY',              priority: 200 },
  { name: 'Notify on low-quality lead advance',  description: 'Alert if a lead with score < 30 advances to PROPOSAL.',           trigger: 'UPDATE_LEAD_STATUS',condition: { field: 'score',    operator: 'lt',  value: 30       }, effect: 'NOTIFY',            priority: 70  },
]

const WORKFLOWS: Array<{ name: string; description: string; trigger: string; dag: object }> = [
  {
    name: 'Project Kick-off', trigger: 'SIGNAL',
    description: 'Triggered on new project creation. Briefs WAANDA, sets goals, creates milestone plan, assigns risks, notifies client.',
    dag: { nodes: [
      { id: 's1', title: 'Brief WAANDA',          type: 'AGENT_INVOKE',   description: 'PROJECT_HEALTH generates initial health assessment.', agentHint: 'PROJECT_HEALTH', critical: true,  timeout: 45000 },
      { id: 's2', title: 'Set Project Goals',     type: 'GOAL_UPDATE',    description: 'Create KimmpGoals for delivery SLA and risk targets.', params: { source: 'project_kickoff' }, critical: false, timeout: 30000 },
      { id: 's3', title: 'Generate Milestones',   type: 'AGENT_INVOKE',   description: 'DELIVERY_MONITOR proposes milestone breakdown.', agentHint: 'DELIVERY_MONITOR', critical: false, timeout: 30000 },
      { id: 's4', title: 'Seed Risk Register',    type: 'DATA_QUERY',     description: 'Query risk templates and seed initial register.', params: { query: 'risk_templates', filter: 'project_kickoff' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Record in Memory',      type: 'MEMORY_WRITE',   description: 'Store kick-off context in KIMMP memory.', params: { type: 'DECISION', tags: ['kickoff', 'project'] }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Notify Client',         type: 'NOTIFY',         description: 'Send kick-off confirmation to client.', params: { channel: 'client', templateId: 'project_kickoff_confirmation' }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Milestone Review', trigger: 'SCHEDULE',
    description: '7-day pre-milestone health check. Routes to internal flag or client update based on project status.',
    dag: { nodes: [
      { id: 's1', title: 'Health Check',      type: 'AGENT_INVOKE', description: 'PROJECT_HEALTH assesses milestone completion and blockers.', agentHint: 'PROJECT_HEALTH', critical: true, timeout: 30000 },
      { id: 's2', title: 'WAANDA Decision',   type: 'DECISION',     description: 'Route: green → notify client; amber → flag; red → escalate.', agentHint: 'DELIVERY_MONITOR', critical: false, timeout: 30000 },
      { id: 's3', title: 'Flag Blockers',     type: 'AGENT_INVOKE', description: 'Propose resolutions for open blockers.', agentHint: 'DELIVERY_MONITOR', params: { focus: 'blockers' }, critical: false, timeout: 30000 },
      { id: 's4', title: 'Internal Update',   type: 'NOTIFY',       description: 'Notify delivery lead with health summary.', params: { channel: 'internal', role: 'DELIVERY_LEAD' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Client Update',     type: 'NOTIFY',       description: 'Send milestone progress update to client.', params: { channel: 'client', templateId: 'milestone_update' }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Record Review',     type: 'MEMORY_WRITE', description: 'Log review outcome for pattern recognition.', params: { type: 'OUTCOME', tags: ['milestone', 'review'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Risk Escalation', trigger: 'SIGNAL',
    description: 'CRITICAL risk triggers blast-radius assessment, L3 approval, then client notification.',
    dag: { nodes: [
      { id: 's1', title: 'Risk Assessment',    type: 'AGENT_INVOKE',   description: 'Evaluate blast radius across milestones and SLAs.', agentHint: 'PROJECT_HEALTH', critical: true, timeout: 60000 },
      { id: 's2', title: 'Internal Escalation',type: 'NOTIFY',         description: 'Alert delivery lead and project owner immediately.', params: { channel: 'internal', priority: 'URGENT' }, critical: false, timeout: 30000 },
      { id: 's3', title: 'Decision Proposal',  type: 'AGENT_INVOKE',   description: 'Propose three resolution options with timeline implications.', agentHint: 'DELIVERY_MONITOR', critical: false, timeout: 30000 },
      { id: 's4', title: 'L3 Approval Gate',   type: 'APPROVAL_GATE',  description: 'Senior approval required before client is informed.', params: { level: 3, reason: 'CRITICAL risk requires senior decision' }, critical: true, timeout: 86400000 },
      { id: 's5', title: 'Client Notification',type: 'NOTIFY',         description: 'Notify client of risk and approved resolution plan.', params: { channel: 'client', templateId: 'risk_escalation' }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Log Escalation',     type: 'MEMORY_WRITE',   description: 'Record pattern for Enterprise Coach.', params: { type: 'PATTERN', tags: ['risk', 'escalation', 'critical'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Project Closure', trigger: 'SIGNAL',
    description: 'All deliverables complete. Quality check → client sign-off → COIG checkpoint → lessons learned.',
    dag: { nodes: [
      { id: 's1', title: 'Quality Check',       type: 'DATA_QUERY',    description: 'Verify all deliverables complete and no open critical issues.', params: { check: 'closure_readiness' }, critical: true, timeout: 30000 },
      { id: 's2', title: 'WAANDA Closure Brief',type: 'AGENT_INVOKE',  description: 'Generate closure summary: health history, SLA, COIG contribution.', agentHint: 'PROJECT_HEALTH', critical: false, timeout: 45000 },
      { id: 's3', title: 'Client Sign-off',     type: 'APPROVAL_GATE', description: 'Client sign-off required before closure.', params: { level: 2, reason: 'Client sign-off required', channel: 'client' }, critical: true, timeout: 259200000 },
      { id: 's4', title: 'COIG Checkpoint',     type: 'AGENT_INVOKE',  description: 'Save CHECKPOINT Gate 8 snapshot.', agentHint: 'ENTERPRISE_COACH', params: { label: 'CHECKPOINT', reason: 'project_closure' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Lessons Learned',     type: 'MEMORY_WRITE',  description: 'Synthesise LESSON memory entry.', params: { type: 'LESSON', tags: ['project', 'closure', 'learning'] }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Archive Notify',      type: 'NOTIFY',        description: 'Notify team that project is closed with COIG delta.', params: { channel: 'internal', templateId: 'project_closure' }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Invoice Approval', trigger: 'SIGNAL',
    description: 'Invoice created above threshold. WAANDA validates → L3 approval → status update.',
    dag: { nodes: [
      { id: 's1', title: 'Invoice Validation',  type: 'AGENT_INVOKE',  description: 'Validate amount vs contract, deliverable alignment, payment history.', agentHint: 'INVOICE_INTELLIGENCE', critical: true, timeout: 45000 },
      { id: 's2', title: 'Deliverable Check',   type: 'DATA_QUERY',    description: 'Confirm billable deliverables are confirmed complete.', params: { check: 'invoice_deliverable_match' }, critical: false, timeout: 30000 },
      { id: 's3', title: 'L3 Approval Gate',    type: 'APPROVAL_GATE', description: 'Finance approval required before dispatch.', params: { level: 3, reason: 'Invoice above approval threshold' }, critical: true, timeout: 86400000 },
      { id: 's4', title: 'Update Status',       type: 'GOAL_UPDATE',   description: 'Mark invoice APPROVED and trigger dispatch.', params: { entity: 'invoice', targetStatus: 'APPROVED' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Notify Finance',      type: 'NOTIFY',        description: 'Alert finance team invoice is approved.', params: { channel: 'internal', role: 'FINANCE' }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Log Approval',        type: 'MEMORY_WRITE',  description: 'Record approval cycle time for Coach pattern analysis.', params: { type: 'OUTCOME', tags: ['invoice', 'approval'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Collections Escalation', trigger: 'SIGNAL',
    description: '14-day overdue invoice. WAANDA drafts collections message → L2 approval → send.',
    dag: { nodes: [
      { id: 's1', title: 'Overdue Assessment',    type: 'AGENT_INVOKE', description: 'Assess amount, days outstanding, payment history, relationship risk.', agentHint: 'COLLECTIONS_AGENT', critical: true, timeout: 45000 },
      { id: 's2', title: 'Draft Collections Msg', type: 'AGENT_INVOKE', description: 'Draft calibrated collections message.', agentHint: 'COLLECTIONS_AGENT', params: { output: 'draft_message' }, critical: false, timeout: 45000 },
      { id: 's3', title: 'L2 Approval',           type: 'APPROVAL_GATE',description: 'Collections message requires human review.', params: { level: 2, reason: 'Collections communication requires human review' }, critical: false, timeout: 86400000 },
      { id: 's4', title: 'Send Message',           type: 'EXTERNAL_API', description: 'Dispatch via email integration.', params: { platform: 'email', action: 'sendMessage', templateId: 'collections_escalation' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Log Escalation',         type: 'MEMORY_WRITE', description: 'Record collection event for cash flow pattern tracking.', params: { type: 'PATTERN', tags: ['invoice', 'collections'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }] },
  },
  {
    name: 'Budget Variance Alert', trigger: 'SCHEDULE',
    description: 'Weekly actuals vs plan scan. Routes by severity: log / internal alert / decision proposal.',
    dag: { nodes: [
      { id: 's1', title: 'Financial Snapshot', type: 'AGENT_INVOKE', description: 'Compare actual revenue and costs vs plan.', agentHint: 'INVOICE_INTELLIGENCE', params: { mode: 'variance_scan' }, critical: false, timeout: 45000 },
      { id: 's2', title: 'Variance Decision',  type: 'DECISION',     description: '< 10%: log. 10–20%: alert. > 20%: escalate.', params: { thresholds: { low: 10, high: 20 } }, critical: false, timeout: 30000 },
      { id: 's3', title: 'Decision Proposal',  type: 'AGENT_INVOKE', description: 'Propose corrective actions.', agentHint: 'DEAL_COACH', params: { context: 'budget_variance' }, critical: false, timeout: 45000 },
      { id: 's4', title: 'Finance Alert',      type: 'NOTIFY',       description: 'Notify finance lead and COO.', params: { channel: 'internal', roles: ['FINANCE', 'COO'] }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Log Variance',       type: 'MEMORY_WRITE', description: 'Record variance event for trend detection.', params: { type: 'PATTERN', tags: ['budget', 'variance'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }] },
  },
  {
    name: 'Lead Qualification Flow', trigger: 'SIGNAL',
    description: 'New lead. DEAL_COACH scores → proposes accept/nurture/decline → creates tasks on qualification.',
    dag: { nodes: [
      { id: 's1', title: 'Lead Analysis',         type: 'AGENT_INVOKE',  description: 'Score: ICP fit, budget, deal velocity, competitive landscape.', agentHint: 'DEAL_COACH', critical: true, timeout: 45000 },
      { id: 's2', title: 'Qualification Decision', type: 'DECISION',      description: '≥ 70 → ACCEPT. 40–69 → NURTURE (L2). < 40 → DECLINE (L2).', params: { thresholds: { accept: 70, nurture: 40 } }, critical: false, timeout: 30000 },
      { id: 's3', title: 'L2 Review Gate',         type: 'APPROVAL_GATE', description: 'NURTURE and DECLINE require confirmation.', params: { level: 2, reason: 'Lead qualification decision requires confirmation' }, critical: false, timeout: 86400000 },
      { id: 's4', title: 'Update Lead Status',     type: 'GOAL_UPDATE',   description: 'Set QUALIFIED / NURTURING / DECLINED.', params: { entity: 'lead' }, critical: false, timeout: 30000 },
      { id: 's5', title: 'Create Follow-up Tasks', type: 'AGENT_INVOKE',  description: 'For QUALIFIED: create discovery call, proposal deadline, decision timeline.', agentHint: 'DEAL_COACH', params: { mode: 'create_tasks' }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Log Qualification',      type: 'MEMORY_WRITE',  description: 'Record outcome for win-rate pattern analysis.', params: { type: 'OUTCOME', tags: ['lead', 'qualification'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
  {
    name: 'Proposal Follow-up', trigger: 'SCHEDULE',
    description: '5-day no-response trigger. DEAL_COACH drafts follow-up — auto-send < ₹5L, L2 review ≥ ₹5L.',
    dag: { nodes: [
      { id: 's1', title: 'Status Check',     type: 'DATA_QUERY',    description: 'Confirm proposal still in SENT with no response after 5 days.', params: { check: 'proposal_no_response', dayThreshold: 5 }, critical: false, timeout: 30000 },
      { id: 's2', title: 'Draft Follow-up',  type: 'AGENT_INVOKE',  description: 'Draft follow-up referencing proposal highlights.', agentHint: 'DEAL_COACH', params: { mode: 'proposal_followup' }, critical: false, timeout: 45000 },
      { id: 's3', title: 'Size Routing',     type: 'DECISION',      description: 'Deal < ₹5L → auto-send. ≥ ₹5L → L2 review.', params: { thresholds: { autoSendBelow: 500000 } }, critical: false, timeout: 30000 },
      { id: 's4', title: 'L2 Review Gate',   type: 'APPROVAL_GATE', description: 'Large deals require account manager review.', params: { level: 2, reason: 'Large deal follow-up requires human review' }, critical: false, timeout: 86400000 },
      { id: 's5', title: 'Send Follow-up',   type: 'EXTERNAL_API',  description: 'Dispatch follow-up message via email.', params: { platform: 'email', action: 'sendMessage', templateId: 'proposal_followup' }, critical: false, timeout: 30000 },
      { id: 's6', title: 'Log Follow-up',    type: 'MEMORY_WRITE',  description: 'Record event for pipeline velocity analysis.', params: { type: 'OUTCOME', tags: ['proposal', 'followup'] }, critical: false, timeout: 30000 },
    ], edges: [{ from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' }, { from: 's5', to: 's6' }] },
  },
]

async function main() {
  console.log('\n🌱 Kangqore Foundation Onboarding Seed\n')

  // 1. Ontology object types
  console.log('1. Ontology entity types…')
  for (const t of ENTITY_TYPES) {
    const existing = await prisma.ontologyObjectType.findFirst({ where: { name: t.name } })
    if (existing) { console.log(`   ⏭  ${t.name}`); continue }
    await prisma.ontologyObjectType.create({ data: { name: t.name, displayName: t.name, color: t.color, icon: t.icon, description: t.description } })
    console.log(`   ✓  ${t.name}`)
  }

  // 2. Enterprise definition (skip if one already active)
  console.log('\n2. Enterprise definition…')
  const existingDef = await prisma.enterpriseDefinition.findFirst({ where: { isActive: true } })
  if (existingDef) {
    console.log(`   ⏭  Active definition already exists: "${existingDef.name}"`)
  } else {
    const def = await prisma.enterpriseDefinition.create({
      data: {
        name:     'Foundation — Professional Services',
        isActive: true,
        goals:    { create: ENTERPRISE_GOALS },
      },
    })
    console.log(`   ✓  Created "${def.name}" with ${ENTERPRISE_GOALS.length} goals`)
  }

  // 3. Enterprise policies
  console.log('\n3. Governance policies…')
  for (const p of POLICIES) {
    const existing = await prisma.enterprisePolicy.findFirst({ where: { name: p.name } })
    if (existing) { console.log(`   ⏭  ${p.name}`); continue }
    await prisma.enterprisePolicy.create({ data: { ...p, condition: p.condition as any } })
    console.log(`   ✓  ${p.name}`)
  }

  // 4. Workflow templates
  console.log('\n4. Workflow templates…')
  for (const wf of WORKFLOWS) {
    const existing = await prisma.kimmpWorkflow.findFirst({ where: { name: wf.name } })
    if (existing) { console.log(`   ⏭  ${wf.name}`); continue }
    await prisma.kimmpWorkflow.create({
      data: { name: wf.name, description: wf.description, trigger: wf.trigger, dag: wf.dag as any, status: 'ACTIVE', createdBy: 'SYSTEM' },
    })
    console.log(`   ✓  ${wf.name}`)
  }

  // 5. KimmpGoals aligned to enterprise goals (one operational goal per pillar)
  console.log('\n5. Enterprise-aligned KIMMP goals…')
  const kimmpGoalSeeds = [
    { objective: 'Hit annual revenue target',                        strategy: 'Track invoiced revenue vs ₹10Cr annual target. Accelerate collection velocity and upsell to existing clients.' },
    { objective: 'Maintain project margin above threshold',          strategy: 'Monitor cost vs revenue per project weekly. Flag scope creep and utilization gaps early.' },
    { objective: 'Achieve Delivery SLA target across all projects',  strategy: 'Enforce milestone tracking and risk escalation. Zero surprise overruns through proactive flagging.' },
    { objective: 'Reach employee utilization target',                strategy: 'Match resource capacity to pipeline demand. Reduce bench time through proactive lead qualification.' },
  ]
  for (const g of kimmpGoalSeeds) {
    const existing = await prisma.kimmpGoal.findFirst({ where: { objective: g.objective } })
    if (existing) { console.log(`   ⏭  ${g.objective}`); continue }
    await prisma.kimmpGoal.create({
      data: {
        objective:   g.objective,
        strategy:    g.strategy,
        status:      'ACTIVE',
        progressPct: 0,
      },
    })
    console.log(`   ✓  ${g.objective}`)
  }

  console.log('\n✅ Foundation seed complete.\n')
  console.log('Next steps:')
  console.log('  1. Set a COIG baseline: POST /admin/gate8/baseline')
  console.log('  2. Run auto-link:       POST /admin/ontology/graph/auto-link')
  console.log('  3. Run project sweep:   POST /admin/projects/ops/sweep')
  console.log('  4. Trigger Gate 8:      POST /admin/gate8/run\n')

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
