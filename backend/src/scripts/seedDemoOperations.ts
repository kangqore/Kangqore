/**
 * Idempotent demo operations seed.
 * Seeds all records needed by client + partner portal pages so they show
 * real data instead of falling back to mock arrays.
 *
 * Run: npx tsx src/scripts/seedDemoOperations.ts (from /backend)
 */
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../utils/password'

const p = new PrismaClient()

const CLIENT_ID  = 'cmqf7eg8e00011yiw9chbycrq' // client@kangqore.com — Dr. Priya Rao
const ADMIN_ID   = 'cmq6u3bde000023hp4qcnixm3' // mahesh@kangqore.com
const PROJECTS   = [
  { id: 'cmr3chjos000dk7fsvrasjwe5', title: 'Digital Transformation'  },
  { id: 'cmr3chjov000hk7fs2yggiwkl', title: 'Platform Integration'    },
  { id: 'cmr3chjoy000lk7fss52b5nc4', title: 'Data Migration'          },
  { id: 'cmr3chjp0000pk7fsjbdxo8nv', title: 'Compliance Review'       },
]
const PROJECT_CR_FEEDBACK = PROJECTS[3].id // Compliance Review — used for CRs + Feedback

function log(symbol: string, label: string, detail = '') {
  console.log(`${symbol} ${label}${detail ? ' — ' + detail : ''}`)
}

// ── Round 1: already seeded ──────────────────────────────────────────────────

async function seedMeetings() {
  const defs = [
    {
      id: 'demo-meeting-001',
      title: 'Q3 Project Kickoff — Compliance Review',
      type: 'VIDEO', platform: 'ZOOM', status: 'SCHEDULED',
      startTime: new Date('2026-07-10T10:00:00Z'),
      endTime:   new Date('2026-07-10T11:00:00Z'),
      timezone:  'Europe/London',
      joinLink:  'https://zoom.us/j/demo-001',
      clientId:  CLIENT_ID, createdBy: ADMIN_ID,
    },
    {
      id: 'demo-meeting-002',
      title: 'Monthly Progress Review — Digital Transformation',
      type: 'VIDEO', platform: 'TEAMS', status: 'COMPLETED',
      startTime: new Date('2026-06-15T14:00:00Z'),
      endTime:   new Date('2026-06-15T15:00:00Z'),
      timezone:  'Europe/London',
      clientId:  CLIENT_ID, createdBy: ADMIN_ID,
    },
  ]
  for (const def of defs) {
    const existing = await p.meeting.findFirst({ where: { id: def.id } })
    if (existing) { log('⏭', 'Meeting', def.title); continue }
    await p.meeting.create({ data: def })
    log('✓', 'Meeting', def.title)
  }
}

async function seedTasks() {
  const defs = [
    { title: 'Define project scope and success metrics', status: 'done',        projectId: PROJECTS[0].id, clientId: CLIENT_ID, dueDate: new Date('2026-06-30T00:00:00Z') },
    { title: 'API integration testing — Phase 1',        status: 'in-progress', projectId: PROJECTS[1].id, clientId: CLIENT_ID, dueDate: new Date('2026-07-15T00:00:00Z') },
    { title: 'Data mapping and validation review',        status: 'todo',        projectId: PROJECTS[2].id, clientId: CLIENT_ID, dueDate: new Date('2026-07-20T00:00:00Z') },
    { title: 'Review updated compliance documentation',   status: 'in-progress', projectId: PROJECTS[3].id, clientId: CLIENT_ID, dueDate: new Date('2026-07-12T00:00:00Z') },
  ]
  for (const def of defs) {
    const existing = await p.task.findFirst({ where: { title: def.title, projectId: def.projectId } })
    if (existing) { log('⏭', 'Task', def.title); continue }
    await p.task.create({ data: def })
    log('✓', 'Task', def.title)
  }
}

async function seedInvoices() {
  const defs = [
    {
      invoiceNumber: 'INV-2026-001', amount: 12500.00, currency: 'GBP', status: 'PAID',
      issueDate: new Date('2026-05-01T00:00:00Z'), dueDate: new Date('2026-05-31T00:00:00Z'),
      paidAt: new Date('2026-05-28T00:00:00Z'),
      clientId: CLIENT_ID, projectId: PROJECTS[0].id,
      notes: 'Phase 1 delivery — Digital Transformation',
    },
    {
      invoiceNumber: 'INV-2026-002', amount: 8750.00, currency: 'GBP', status: 'PENDING',
      issueDate: new Date('2026-06-01T00:00:00Z'), dueDate: new Date('2026-06-30T00:00:00Z'),
      clientId: CLIENT_ID, projectId: PROJECTS[3].id,
      notes: 'Compliance Review — initial advisory',
    },
  ]
  for (const def of defs) {
    const existing = await p.invoice.findFirst({ where: { invoiceNumber: def.invoiceNumber } })
    if (existing) { log('⏭', 'Invoice', def.invoiceNumber); continue }
    await p.invoice.create({ data: def })
    log('✓', 'Invoice', def.invoiceNumber)
  }
}

async function seedContacts() {
  const defs = [
    { name: 'James Whitfield', email: 'j.whitfield@horizonco.com', subject: 'Enquiry about BIDS™ Platform', message: 'We are exploring AI-native solutions for our operations team. Could you provide more detail on the BIDS™ Intelligence Suite?', source: 'website', status: 'NEW' as const, organization: 'Horizon Co.', inquiryType: 'PRODUCT' },
    { name: 'Anika Sharma', email: 'anika.s@vertexgroup.io', subject: 'Partnership enquiry', message: 'We are interested in a potential partnership arrangement for delivering Kangqore services to our client base.', source: 'referral', status: 'NEW' as const, organization: 'Vertex Group', inquiryType: 'PARTNERSHIP' },
  ]
  for (const def of defs) {
    const existing = await p.contact.findFirst({ where: { email: def.email } })
    if (existing) { log('⏭', 'Contact', def.email); continue }
    await p.contact.create({ data: def })
    log('✓', 'Contact', def.email)
  }
}

// ── Round 2: client portal gaps (ClientTasks/Support/CRs/Feedback) ───────────

async function seedTickets() {
  const defs = [
    { subject: 'Reports dashboard slow on mobile',     category: 'Performance',    priority: 'medium', status: 'open',     clientId: CLIENT_ID },
    { subject: 'Request: export deliverables to PDF',  category: 'Feature Request', priority: 'low',   status: 'resolved', clientId: CLIENT_ID },
  ]
  for (const def of defs) {
    const existing = await p.ticket.findFirst({ where: { subject: def.subject, clientId: def.clientId } })
    if (existing) { log('⏭', 'Ticket', def.subject); continue }
    await p.ticket.create({ data: def })
    log('✓', 'Ticket', def.subject)
  }
}

async function seedChangeRequests() {
  const defs = [
    {
      title: 'Add GDPR audit trail module',
      description: 'Full audit trail capturing all data access and modification events for GDPR Article 30 compliance.',
      status: 'PROPOSED', priority: 'HIGH', decisionType: 'SCOPE_CHANGE',
      projectId: PROJECT_CR_FEEDBACK, clientId: CLIENT_ID,
    },
    {
      title: 'Expand scope: ISO 27001 gap assessment',
      description: 'Widen the compliance review to include an ISO 27001 information security gap assessment alongside the existing GDPR workstream.',
      status: 'APPROVED', priority: 'MEDIUM', decisionType: 'SCOPE_CHANGE',
      projectId: PROJECT_CR_FEEDBACK, clientId: CLIENT_ID,
    },
  ]
  for (const def of defs) {
    const existing = await p.changeRequest.findFirst({ where: { title: def.title, projectId: def.projectId } })
    if (existing) { log('⏭', 'ChangeRequest', def.title); continue }
    await p.changeRequest.create({ data: def })
    log('✓', 'ChangeRequest', def.title)
  }
}

async function seedClientFeedback() {
  const existing = await p.clientFeedback.findFirst({ where: { projectId: PROJECT_CR_FEEDBACK, clientId: CLIENT_ID } })
  if (existing) { log('⏭', 'ClientFeedback', 'client@kangqore.com'); return }
  await p.clientFeedback.create({
    data: {
      projectId: PROJECT_CR_FEEDBACK,
      clientId:  CLIENT_ID,
      npsScore:  9,
      comment:   'Excellent support and clear communication throughout the engagement. The team consistently delivered on time.',
      status:    'APPROVED',
    },
  })
  log('✓', 'ClientFeedback', 'client@kangqore.com')
}

// ── Round 2: partner portal (all pages) ──────────────────────────────────────

async function seedPartner() {
  // Step 1 — Create PARTNER user
  let partner = await p.user.findFirst({ where: { email: 'partner@kangqore.com' } })
  if (!partner) {
    const hashed = await hashPassword('Partner@2026')
    partner = await p.user.create({
      data: {
        email:    'partner@kangqore.com',
        name:     'Atlas Consulting',
        role:     'PARTNER',
        password: hashed,
      },
    })
    log('✓', 'Partner user', 'partner@kangqore.com')
  } else {
    log('⏭', 'Partner user', 'partner@kangqore.com')
  }

  // Step 2 — Link 2 projects to this partner (only if unlinked)
  for (const proj of [PROJECTS[0], PROJECTS[3]]) {
    const current = await p.project.findFirst({ where: { id: proj.id }, select: { partnerId: true, title: true } })
    if (current && !current.partnerId) {
      await p.project.update({ where: { id: proj.id }, data: { partnerId: partner.id } })
      log('✓', 'Project linked', proj.title)
    } else {
      log('⏭', 'Project link', proj.title)
    }
  }

  // Step 3 — Seed 1 partner meeting
  const PARTNER_MEETING_ID = 'demo-meeting-partner-001'
  const existingMtg = await p.meeting.findFirst({ where: { id: PARTNER_MEETING_ID } })
  if (!existingMtg) {
    await p.meeting.create({
      data: {
        id:        PARTNER_MEETING_ID,
        title:     'Partner Delivery Sync — Q3',
        type:      'VIDEO', platform: 'ZOOM', status: 'SCHEDULED',
        startTime: new Date('2026-07-17T10:00:00Z'),
        endTime:   new Date('2026-07-17T11:00:00Z'),
        timezone:  'Europe/London',
        partnerId: partner.id,
        createdBy: ADMIN_ID,
      },
    })
    log('✓', 'Meeting', 'Partner Delivery Sync — Q3')
  } else {
    log('⏭', 'Meeting', 'Partner Delivery Sync — Q3')
  }

  // Step 4 — Seed 1 Deliverable on partner-linked project
  const DELIV_TITLE = 'Compliance Framework v1.0 — Draft'
  const existingDeliv = await p.deliverable.findFirst({ where: { title: DELIV_TITLE, projectId: PROJECTS[3].id } })
  if (!existingDeliv) {
    await p.deliverable.create({
      data: {
        title:     DELIV_TITLE,
        status:    'IN_REVIEW',
        projectId: PROJECTS[3].id,
        clientId:  CLIENT_ID,
        dueDate:   new Date('2026-07-31T00:00:00Z'),
      },
    })
    log('✓', 'Deliverable', DELIV_TITLE)
  } else {
    log('⏭', 'Deliverable', DELIV_TITLE)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n── Demo Operations Seed ──────────────────────────────')
  console.log('  Full client + partner portal coverage')
  console.log('──────────────────────────────────────────────────────\n')

  // Round 1 (previously seeded — idempotent)
  await seedMeetings()
  await seedTasks()
  await seedInvoices()
  await seedContacts()

  // Round 2 — client portal gaps
  await seedTickets()
  await seedChangeRequests()
  await seedClientFeedback()

  // Round 2 — partner portal
  await seedPartner()

  console.log('\n──────────────────────────────────────────────────────')
  console.log('  Done.\n')
  await p.$disconnect()
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
