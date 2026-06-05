import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WORKFLOWS = [
  {
    name: 'New Lead Qualification', category: 'sales', status: 'active',
    description: 'Automatically scores and routes new leads from all sources. Notifies owner and queues into eQORE.',
    triggerType: 'event', triggerConfig: 'On: lead.created',
    owner: 'Sofia Mendez', lastRun: new Date('2026-05-31T14:22:00Z'),
    runsTotal: 142, runsSuccess: 138, runsFailed: 4, avgDuration: 2,
    tags: ['crm', 'eqore', 'auto'],
    steps: [
      { id: 's1', order: 1, type: 'action',       name: 'Score with eQORE',         description: 'Run eQORE composite scoring model on lead data.' },
      { id: 's2', order: 2, type: 'condition',    name: 'Score ≥ 60?',               description: 'Route based on lead quality score.' },
      { id: 's3', order: 3, type: 'notification', name: 'Notify owner (high-score)', description: 'Slack + email to assigned owner.' },
      { id: 's4', order: 4, type: 'action',       name: 'Enrol in nurture sequence', description: 'Add to appropriate nurture track based on ICP tag.' },
      { id: 's5', order: 5, type: 'action',       name: 'Create CRM record',         description: 'Sync to leads pipeline with stage = Qualified.' },
    ],
  },
  {
    name: 'Monthly Investor Update', category: 'finance', status: 'active',
    description: 'Compiles metrics from all modules and drafts the monthly investor update for review.',
    triggerType: 'schedule', triggerConfig: '1st of month, 08:00',
    owner: 'Mahesh Kumar',
    lastRun: new Date('2026-06-01T08:00:00Z'), nextRun: new Date('2026-07-01T08:00:00Z'),
    runsTotal: 5, runsSuccess: 5, runsFailed: 0, avgDuration: 8,
    tags: ['investors', 'reporting', 'scheduled'],
    steps: [
      { id: 's1', order: 1, type: 'action',   name: 'Pull MRR & ARR metrics',  description: 'Aggregate from Finance module.' },
      { id: 's2', order: 2, type: 'action',   name: 'Pull pipeline value',      description: 'Aggregate from Leads module.' },
      { id: 's3', order: 3, type: 'action',   name: 'Draft update with KIMMP',  description: 'AI drafts narrative section.' },
      { id: 's4', order: 4, type: 'approval', name: 'CEO review & approve',     description: 'Mahesh reviews and approves draft.' },
      { id: 's5', order: 5, type: 'action',   name: 'Send to investor list',    description: 'Email sent to all committed investors.' },
    ],
  },
  {
    name: 'Client Onboarding', category: 'delivery', status: 'active',
    description: 'Triggers when a deal is marked Won. Creates project, assigns delivery team, and sends welcome pack.',
    triggerType: 'event', triggerConfig: 'On: lead.stage = won',
    owner: 'Ravi Nair', lastRun: new Date('2026-05-28T10:15:00Z'),
    runsTotal: 9, runsSuccess: 9, runsFailed: 0, avgDuration: 5,
    tags: ['delivery', 'onboarding', 'auto'],
    steps: [
      { id: 's1', order: 1, type: 'action',      name: 'Create project record',     description: 'Auto-create project in Projects module.' },
      { id: 's2', order: 2, type: 'action',      name: 'Assign delivery lead',      description: 'Round-robin assignment from delivery team.' },
      { id: 's3', order: 3, type: 'integration', name: 'Send welcome pack (email)', description: 'Trigger branded onboarding email sequence.' },
      { id: 's4', order: 4, type: 'action',      name: 'Create client profile',     description: 'Create record in Clients module.' },
      { id: 's5', order: 5, type: 'notification',name: 'Notify Slack #new-clients', description: 'Post deal win announcement to team Slack.' },
    ],
  },
  {
    name: 'Invoice Overdue Escalation', category: 'finance', status: 'active',
    description: 'Monitors invoice due dates. Sends automated reminders and escalates to account owner after 14 days.',
    triggerType: 'schedule', triggerConfig: 'Daily at 09:00',
    owner: 'Mahesh Kumar',
    lastRun: new Date('2026-06-01T09:00:00Z'), nextRun: new Date('2026-06-02T09:00:00Z'),
    runsTotal: 92, runsSuccess: 91, runsFailed: 1, avgDuration: 1,
    tags: ['finance', 'ar', 'auto'],
    steps: [
      { id: 's1', order: 1, type: 'action',       name: 'Fetch overdue invoices',     description: 'Query invoices past due date.' },
      { id: 's2', order: 2, type: 'condition',    name: '7-day overdue?',              description: 'Split by days overdue.' },
      { id: 's3', order: 3, type: 'notification', name: 'Send client reminder email', description: 'Automated polite reminder to client.' },
      { id: 's4', order: 4, type: 'condition',    name: '14-day overdue?',             description: 'Further escalation check.' },
      { id: 's5', order: 5, type: 'notification', name: 'Escalate to account owner',  description: 'Notify owner + CEO for invoices >14 days.' },
    ],
  },
  {
    name: 'Sprint Kickoff Automation', category: 'ops', status: 'active',
    description: 'Every 2 weeks, sets up sprint board, moves planned issues, and notifies the engineering team.',
    triggerType: 'schedule', triggerConfig: 'Every 2 weeks, Monday 09:00',
    owner: 'Dev Patel',
    lastRun: new Date('2026-05-27T09:00:00Z'), nextRun: new Date('2026-06-10T09:00:00Z'),
    runsTotal: 18, runsSuccess: 18, runsFailed: 0, avgDuration: 3,
    tags: ['engineering', 'agile', 'scheduled'],
    steps: [
      { id: 's1', order: 1, type: 'action',       name: 'Archive completed sprint', description: 'Move done issues to archive.' },
      { id: 's2', order: 2, type: 'action',       name: 'Create new sprint',        description: 'Create sprint in Projects module.' },
      { id: 's3', order: 3, type: 'action',       name: 'Move backlog items',       description: 'Pull prioritised backlog items into sprint.' },
      { id: 's4', order: 4, type: 'notification', name: 'Notify team via Slack',    description: 'Post sprint plan to #engineering channel.' },
    ],
  },
  {
    name: 'Candidate Pipeline Review', category: 'hr', status: 'draft',
    description: 'Weekly review of all open role applicants. Scores CVs and routes to hiring managers.',
    triggerType: 'schedule', triggerConfig: 'Weekly, Monday 08:00',
    owner: 'Anika Roy',
    runsTotal: 0, runsSuccess: 0, runsFailed: 0, avgDuration: 0,
    tags: ['hr', 'hiring', 'draft'],
    steps: [
      { id: 's1', order: 1, type: 'action',       name: 'Pull new applicants',       description: 'Fetch from careers portal.' },
      { id: 's2', order: 2, type: 'action',       name: 'KIMMP CV scoring',          description: 'AI scores CVs against job spec.' },
      { id: 's3', order: 3, type: 'notification', name: 'Send shortlist to manager', description: 'Email shortlist to hiring manager.' },
    ],
  },
]

async function main() {
  console.log('Seeding OS workflows...')

  // Idempotent: skip if already seeded
  const existing = await prisma.osWorkflow.count()
  if (existing > 0) {
    console.log(`Skipped — ${existing} workflows already exist.`)
    return
  }

  const created = await Promise.all(
    WORKFLOWS.map(w =>
      prisma.osWorkflow.create({
        data: {
          name:         w.name,
          description:  w.description,
          category:     w.category,
          status:       w.status,
          triggerType:  w.triggerType,
          triggerConfig: w.triggerConfig,
          steps:        w.steps as any,
          lastRun:      w.lastRun ?? null,
          nextRun:      (w as any).nextRun ?? null,
          runsTotal:    w.runsTotal,
          runsSuccess:  w.runsSuccess,
          runsFailed:   w.runsFailed,
          avgDuration:  w.avgDuration,
          owner:        w.owner,
          tags:         w.tags,
        },
      })
    )
  )

  console.log(`Created ${created.length} workflows.`)

  // Seed run history for the active workflows
  const wfMap = Object.fromEntries(created.map(w => [w.name, w.id]))

  const runs = [
    { name: 'New Lead Qualification',     status: 'completed', startedAt: new Date('2026-05-31T14:22:00Z'), completedAt: new Date('2026-05-31T14:24:05Z'), duration: 125, triggeredBy: 'Event: l12 created',  stepsCompleted: 5, stepsTotal: 5 },
    { name: 'Monthly Investor Update',    status: 'completed', startedAt: new Date('2026-06-01T08:00:00Z'), completedAt: new Date('2026-06-01T08:08:22Z'), duration: 502, triggeredBy: 'Schedule',           stepsCompleted: 5, stepsTotal: 5 },
    { name: 'Client Onboarding',          status: 'completed', startedAt: new Date('2026-05-28T10:15:00Z'), completedAt: new Date('2026-05-28T10:20:14Z'), duration: 314, triggeredBy: 'Event: l2 won',      stepsCompleted: 5, stepsTotal: 5 },
    { name: 'Invoice Overdue Escalation', status: 'completed', startedAt: new Date('2026-06-01T09:00:00Z'), completedAt: new Date('2026-06-01T09:01:12Z'), duration: 72,  triggeredBy: 'Schedule',           stepsCompleted: 5, stepsTotal: 5 },
    { name: 'Sprint Kickoff Automation',  status: 'completed', startedAt: new Date('2026-05-27T09:00:00Z'), completedAt: new Date('2026-05-27T09:03:45Z'), duration: 225, triggeredBy: 'Schedule',           stepsCompleted: 4, stepsTotal: 4 },
    { name: 'New Lead Qualification',     status: 'failed',    startedAt: new Date('2026-05-29T11:05:00Z'), completedAt: new Date('2026-05-29T11:05:30Z'), duration: 30,  triggeredBy: 'Event: l9 created',  stepsCompleted: 1, stepsTotal: 5, errorMessage: 'eQORE scoring timeout — lead scored manually' },
    { name: 'New Lead Qualification',     status: 'completed', startedAt: new Date('2026-05-28T16:42:00Z'), completedAt: new Date('2026-05-28T16:44:10Z'), duration: 130, triggeredBy: 'Event: l11 created', stepsCompleted: 5, stepsTotal: 5 },
    { name: 'Invoice Overdue Escalation', status: 'completed', startedAt: new Date('2026-05-31T09:00:00Z'), completedAt: new Date('2026-05-31T09:01:05Z'), duration: 65,  triggeredBy: 'Schedule',           stepsCompleted: 5, stepsTotal: 5 },
  ]

  let runsCreated = 0
  for (const run of runs) {
    const workflowId = wfMap[run.name]
    if (!workflowId) continue
    await prisma.osWorkflowRun.create({
      data: {
        workflowId,
        workflowName: run.name,
        status:       run.status,
        startedAt:    run.startedAt,
        completedAt:  run.completedAt ?? null,
        duration:     run.duration ?? null,
        triggeredBy:  run.triggeredBy,
        stepsCompleted: run.stepsCompleted,
        stepsTotal:   run.stepsTotal,
        errorMessage: (run as any).errorMessage ?? null,
      },
    })
    runsCreated++
  }

  console.log(`Created ${runsCreated} workflow runs.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
