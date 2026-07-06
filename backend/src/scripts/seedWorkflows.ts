/**
 * Seed the nine Commercial Engineering workflow templates.
 *
 * Delivery (4):
 *   1. Project Kick-off
 *   2. Milestone Review
 *   3. Risk Escalation
 *   4. Project Closure
 *
 * Finance (3):
 *   5. Invoice Approval
 *   6. Collections Escalation
 *   7. Budget Variance Alert
 *
 * Sales (2):
 *   8. Lead Qualification Flow
 *   9. Proposal Follow-up
 *
 * Run: npx ts-node -e "require('./src/scripts/seedWorkflows')"
 * Or:  npx tsx src/scripts/seedWorkflows.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── DAG builder helpers ──────────────────────────────────────────────────────

type NodeType = 'AGENT_INVOKE' | 'APPROVAL_GATE' | 'NOTIFY' | 'MEMORY_WRITE' |
                'DATA_QUERY'   | 'DECISION'      | 'WAIT'   | 'GOAL_UPDATE'   | 'EXTERNAL_API'

interface N {
  id: string; title: string; type: NodeType; description: string
  agentHint?: string; params?: Record<string, unknown>
  critical?: boolean; timeout?: number
}

function node(n: N) {
  return { critical: false, timeout: 30000, ...n }
}

function edge(from: string, to: string) {
  return { from, to }
}

// ─── Workflow definitions ─────────────────────────────────────────────────────

const WORKFLOWS = [

  // ── 1. Project Kick-off ───────────────────────────────────────────────────
  {
    name:        'Project Kick-off',
    description: 'Triggered when a new project is created. Briefs WAANDA, sets enterprise goals, creates milestone plan, assigns initial risks, and notifies the client.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Brief WAANDA', type: 'AGENT_INVOKE', description: 'PROJECT_HEALTH agent reads project scope and generates initial health assessment and risk pre-scan.', agentHint: 'PROJECT_HEALTH', critical: true, timeout: 45000 }),
        node({ id: 's2', title: 'Set Project Goals', type: 'GOAL_UPDATE', description: 'Create KIMMP goals for this project: delivery SLA, milestone on-time rate, risk count target.', params: { source: 'project_kickoff' } }),
        node({ id: 's3', title: 'Generate Milestone Plan', type: 'AGENT_INVOKE', description: 'DELIVERY_MONITOR proposes a milestone breakdown from project scope and due date.', agentHint: 'DELIVERY_MONITOR' }),
        node({ id: 's4', title: 'Assign Initial Risks', type: 'DATA_QUERY', description: 'Query risk templates for this project type and seed initial risk register.', params: { query: 'risk_templates', filter: 'project_kickoff' } }),
        node({ id: 's5', title: 'Record in Memory', type: 'MEMORY_WRITE', description: 'Store kick-off context — project scope, goals, initial risks — in KIMMP memory for future decisions.', params: { type: 'DECISION', tags: ['kickoff', 'project'] } }),
        node({ id: 's6', title: 'Notify Client', type: 'NOTIFY', description: 'Send kick-off confirmation to client contact with project summary and first milestone date.', params: { channel: 'client', templateId: 'project_kickoff_confirmation' } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 2. Milestone Review ───────────────────────────────────────────────────
  {
    name:        'Milestone Review',
    description: 'Triggered 7 days before a milestone due date. Runs health check, collects status update, flags blockers, and sends client update.',
    trigger:     'SCHEDULE',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Health Check', type: 'AGENT_INVOKE', description: 'PROJECT_HEALTH agent assesses current milestone completion, open tasks, and blocker count.', agentHint: 'PROJECT_HEALTH', critical: true }),
        node({ id: 's2', title: 'WAANDA Decision', type: 'DECISION', description: 'DELIVERY_MONITOR evaluates: on-track (green) → notify client; at-risk (amber) → internal flag; off-track (red) → escalation path.', agentHint: 'DELIVERY_MONITOR' }),
        node({ id: 's3', title: 'Flag Blockers', type: 'AGENT_INVOKE', description: 'If blockers exist, DELIVERY_MONITOR proposes resolution actions and creates L2 decision proposals.', agentHint: 'DELIVERY_MONITOR', params: { focus: 'blockers' } }),
        node({ id: 's4', title: 'Internal Update', type: 'NOTIFY', description: 'Notify internal delivery lead with health summary and WAANDA recommendation.', params: { channel: 'internal', role: 'DELIVERY_LEAD' } }),
        node({ id: 's5', title: 'Client Update', type: 'NOTIFY', description: 'Send milestone progress update to client with current status and any adjusted timeline.', params: { channel: 'client', templateId: 'milestone_update' } }),
        node({ id: 's6', title: 'Record Review', type: 'MEMORY_WRITE', description: 'Log milestone review outcome — health score, blockers, client notified — for pattern recognition.', params: { type: 'OUTCOME', tags: ['milestone', 'review'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 3. Risk Escalation ────────────────────────────────────────────────────
  {
    name:        'Risk Escalation',
    description: 'Triggered when a risk severity is set to CRITICAL. Runs assessment, requires L3 admin approval, and notifies the client after decision.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Risk Assessment', type: 'AGENT_INVOKE', description: 'PROJECT_HEALTH agent evaluates blast radius: which milestones, deliverables, and client SLAs are affected.', agentHint: 'PROJECT_HEALTH', critical: true, timeout: 60000 }),
        node({ id: 's2', title: 'Internal Escalation', type: 'NOTIFY', description: 'Immediately alert delivery lead and project owner with full risk context.', params: { channel: 'internal', priority: 'URGENT' } }),
        node({ id: 's3', title: 'Decision Proposal', type: 'AGENT_INVOKE', description: 'DELIVERY_MONITOR proposes three resolution options with timeline and resource implications for each.', agentHint: 'DELIVERY_MONITOR' }),
        node({ id: 's4', title: 'L3 Approval Gate', type: 'APPROVAL_GATE', description: 'Escalation decision requires senior approval before client is informed.', critical: true, params: { level: 3, reason: 'CRITICAL risk requires senior decision' } }),
        node({ id: 's5', title: 'Client Notification', type: 'NOTIFY', description: 'Notify client of the risk and approved resolution plan with revised timeline if applicable.', params: { channel: 'client', templateId: 'risk_escalation' } }),
        node({ id: 's6', title: 'Log Escalation', type: 'MEMORY_WRITE', description: 'Record escalation pattern — risk type, resolution chosen, outcome — for Enterprise Coach pattern recognition.', params: { type: 'PATTERN', tags: ['risk', 'escalation', 'critical'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 4. Project Closure ────────────────────────────────────────────────────
  {
    name:        'Project Closure',
    description: 'Triggered when all deliverables are marked complete. Runs quality check, client sign-off, COIG snapshot, and captures lessons learned.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Quality Check', type: 'DATA_QUERY', description: 'Verify all deliverables are complete, all milestones closed, and no open critical issues.', params: { check: 'closure_readiness' }, critical: true }),
        node({ id: 's2', title: 'WAANDA Closure Brief', type: 'AGENT_INVOKE', description: 'PROJECT_HEALTH generates closure summary: health history, SLA adherence, risk outcomes, COIG contribution.', agentHint: 'PROJECT_HEALTH' }),
        node({ id: 's3', title: 'Client Sign-off', type: 'APPROVAL_GATE', description: 'Send closure document to client and wait for sign-off confirmation.', params: { level: 2, reason: 'Client sign-off required before closure', channel: 'client' } }),
        node({ id: 's4', title: 'COIG Checkpoint', type: 'AGENT_INVOKE', description: 'Save a CHECKPOINT Gate 8 snapshot capturing OIS improvement attributable to this project delivery.', agentHint: 'ENTERPRISE_COACH', params: { label: 'CHECKPOINT', reason: 'project_closure' } }),
        node({ id: 's5', title: 'Lessons Learned', type: 'MEMORY_WRITE', description: 'WAANDA synthesises what worked and what didn\'t into a LESSON memory entry for future project intelligence.', params: { type: 'LESSON', tags: ['project', 'closure', 'learning'] } }),
        node({ id: 's6', title: 'Archive Notify', type: 'NOTIFY', description: 'Notify internal team that project is closed and archived with COIG delta.', params: { channel: 'internal', templateId: 'project_closure' } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 5. Invoice Approval ───────────────────────────────────────────────────
  {
    name:        'Invoice Approval',
    description: 'Triggered on invoice creation above threshold. WAANDA validates, routes to L3 approval gate, then updates invoice status.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Invoice Validation', type: 'AGENT_INVOKE', description: 'INVOICE_INTELLIGENCE validates: amount vs contract, milestone alignment, outstanding balance, payment history.', agentHint: 'INVOICE_INTELLIGENCE', critical: true }),
        node({ id: 's2', title: 'Pre-Deadline Review', type: 'DATA_QUERY', description: 'Check that all deliverables billable under this invoice are confirmed complete.', params: { check: 'invoice_deliverable_match' } }),
        node({ id: 's3', title: 'L3 Approval Gate', type: 'APPROVAL_GATE', description: 'Finance approval required before invoice is dispatched to client.', critical: true, params: { level: 3, reason: 'Invoice above approval threshold' } }),
        node({ id: 's4', title: 'Update Invoice Status', type: 'GOAL_UPDATE', description: 'Mark invoice as APPROVED and trigger dispatch workflow.', params: { entity: 'invoice', targetStatus: 'APPROVED' } }),
        node({ id: 's5', title: 'Notify Finance', type: 'NOTIFY', description: 'Alert finance team that invoice is approved and ready for dispatch.', params: { channel: 'internal', role: 'FINANCE' } }),
        node({ id: 's6', title: 'Log Approval', type: 'MEMORY_WRITE', description: 'Record approval cycle time for Enterprise Coach payment pattern analysis.', params: { type: 'OUTCOME', tags: ['invoice', 'approval', 'finance'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 6. Collections Escalation ─────────────────────────────────────────────
  {
    name:        'Collections Escalation',
    description: 'Triggered when an invoice is overdue by more than 14 days. WAANDA drafts client message, routes to L2 approval, then sends.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Overdue Assessment', type: 'AGENT_INVOKE', description: 'COLLECTIONS_AGENT assesses overdue amount, days outstanding, client payment history, and relationship risk.', agentHint: 'COLLECTIONS_AGENT', critical: true }),
        node({ id: 's2', title: 'Draft Collections Message', type: 'AGENT_INVOKE', description: 'COLLECTIONS_AGENT drafts a client collections message calibrated to relationship strength and overdue severity.', agentHint: 'COLLECTIONS_AGENT', params: { output: 'draft_message' } }),
        node({ id: 's3', title: 'L2 Approval', type: 'APPROVAL_GATE', description: 'Collections message requires L2 approval before sending.', params: { level: 2, reason: 'Collections communication requires human review' } }),
        node({ id: 's4', title: 'Send Collections Message', type: 'EXTERNAL_API', description: 'Dispatch collections message via email integration.', params: { platform: 'email', action: 'sendMessage', templateId: 'collections_escalation' } }),
        node({ id: 's5', title: 'Log Escalation', type: 'MEMORY_WRITE', description: 'Record collection event — amount, days overdue, message sent — for cash flow pattern tracking.', params: { type: 'PATTERN', tags: ['invoice', 'collections', 'overdue'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
      ],
    },
  },

  // ── 7. Budget Variance Alert ──────────────────────────────────────────────
  {
    name:        'Budget Variance Alert',
    description: 'Triggered weekly. FINANCIAL_SNAPSHOT scans actuals vs plan and escalates if variance exceeds 10%.',
    trigger:     'SCHEDULE',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Financial Snapshot', type: 'AGENT_INVOKE', description: 'INVOICE_INTELLIGENCE compares actual revenue and costs against planned figures for the period.', agentHint: 'INVOICE_INTELLIGENCE', params: { mode: 'variance_scan' } }),
        node({ id: 's2', title: 'Variance Decision', type: 'DECISION', description: 'If variance < 10%: log and close. If 10–20%: internal alert. If > 20%: escalate to decision proposal.', params: { thresholds: { low: 10, high: 20 } } }),
        node({ id: 's3', title: 'Decision Proposal', type: 'AGENT_INVOKE', description: 'DEAL_COACH proposes corrective actions: pipeline acceleration, cost reduction, scope renegotiation.', agentHint: 'DEAL_COACH', params: { context: 'budget_variance' } }),
        node({ id: 's4', title: 'Finance Alert', type: 'NOTIFY', description: 'Notify finance lead and COO with variance summary and proposed actions.', params: { channel: 'internal', roles: ['FINANCE', 'COO'] } }),
        node({ id: 's5', title: 'Log Variance', type: 'MEMORY_WRITE', description: 'Record variance event for trend detection — recurring variances trigger Enterprise Coach pattern.', params: { type: 'PATTERN', tags: ['budget', 'variance', 'finance'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
      ],
    },
  },

  // ── 8. Lead Qualification Flow ────────────────────────────────────────────
  {
    name:        'Lead Qualification Flow',
    description: 'Triggered on new lead creation. LEAD_ANALYSIS scores and proposes accept / decline / nurture. Auto-creates tasks on acceptance.',
    trigger:     'SIGNAL',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Lead Analysis', type: 'AGENT_INVOKE', description: 'DEAL_COACH scores lead: ICP fit, company size, budget signals, deal velocity, competitive landscape.', agentHint: 'DEAL_COACH', critical: true }),
        node({ id: 's2', title: 'Qualification Decision', type: 'DECISION', description: 'Score ≥ 70 → ACCEPT (auto-proceed). 40–69 → NURTURE (L2 review). < 40 → DECLINE (L2 confirmation).', params: { thresholds: { accept: 70, nurture: 40 } } }),
        node({ id: 's3', title: 'L2 Review Gate', type: 'APPROVAL_GATE', description: 'For NURTURE and DECLINE decisions, require L2 confirmation before updating lead status.', params: { level: 2, reason: 'Lead qualification decision requires human confirmation' } }),
        node({ id: 's4', title: 'Update Lead Status', type: 'GOAL_UPDATE', description: 'Update lead status to QUALIFIED / NURTURING / DECLINED based on decision.', params: { entity: 'lead' } }),
        node({ id: 's5', title: 'Create Follow-up Tasks', type: 'AGENT_INVOKE', description: 'For QUALIFIED leads: DEAL_COACH creates discovery call task, proposal deadline, and decision timeline.', agentHint: 'DEAL_COACH', params: { mode: 'create_tasks' } }),
        node({ id: 's6', title: 'Log Qualification', type: 'MEMORY_WRITE', description: 'Record qualification outcome and signal strength for win-rate pattern analysis.', params: { type: 'OUTCOME', tags: ['lead', 'qualification', 'sales'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

  // ── 9. Proposal Follow-up ─────────────────────────────────────────────────
  {
    name:        'Proposal Follow-up',
    description: 'Triggered 5 days after a proposal is sent with no response. WAANDA drafts a follow-up — L1 auto-send or L2 review based on deal size.',
    trigger:     'SCHEDULE',
    dag: {
      nodes: [
        node({ id: 's1', title: 'Proposal Status Check', type: 'DATA_QUERY', description: 'Confirm proposal is still in SENT status with no client response after 5 days.', params: { check: 'proposal_no_response', dayThreshold: 5 } }),
        node({ id: 's2', title: 'Draft Follow-up', type: 'AGENT_INVOKE', description: 'DEAL_COACH drafts a follow-up message referencing proposal highlights and requesting a decision timeline.', agentHint: 'DEAL_COACH', params: { mode: 'proposal_followup' } }),
        node({ id: 's3', title: 'Size-Based Routing', type: 'DECISION', description: 'Deal < ₹5L → L1 auto-send approved. Deal ≥ ₹5L → L2 human review required before sending.', params: { thresholds: { autoSendBelow: 500000 } } }),
        node({ id: 's4', title: 'L2 Review Gate', type: 'APPROVAL_GATE', description: 'For large deals, require account manager review and approval of the follow-up message.', params: { level: 2, reason: 'Large deal follow-up requires human review' } }),
        node({ id: 's5', title: 'Send Follow-up', type: 'EXTERNAL_API', description: 'Dispatch the approved follow-up message to the prospect via email.', params: { platform: 'email', action: 'sendMessage', templateId: 'proposal_followup' } }),
        node({ id: 's6', title: 'Log Follow-up', type: 'MEMORY_WRITE', description: 'Record follow-up event — deal size, days to send, outcome — for pipeline velocity analysis.', params: { type: 'OUTCOME', tags: ['proposal', 'followup', 'sales'] } }),
      ],
      edges: [
        edge('s1', 's2'),
        edge('s2', 's3'),
        edge('s3', 's4'),
        edge('s4', 's5'),
        edge('s5', 's6'),
      ],
    },
  },

]

// ─── Seed runner ──────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding Commercial Engineering workflow templates…\n')

  for (const wf of WORKFLOWS) {
    const existing = await prisma.kimmpWorkflow.findFirst({
      where: { name: wf.name },
    })

    if (existing) {
      console.log(`  ⏭  ${wf.name} — already exists (id: ${existing.id})`)
      continue
    }

    const created = await prisma.kimmpWorkflow.create({
      data: {
        name:        wf.name,
        description: wf.description,
        trigger:     wf.trigger,
        dag:         wf.dag as any,
        status:      'ACTIVE',
        createdBy:   'SYSTEM',
      },
    })
    console.log(`  ✓  ${wf.name} — created (id: ${created.id})`)
  }

  console.log('\nDone.')
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
