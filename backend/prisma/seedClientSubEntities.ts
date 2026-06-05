import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding client sub-entities...')

  if (await prisma.clientInteraction.count() > 0) {
    console.log('Skipped — already seeded.'); return
  }

  // Build name→id map from the already-seeded ClientCRM records
  const clients = await prisma.clientCRM.findMany({ select: { id: true, name: true } })
  const id = (name: string) => {
    const c = clients.find(c => c.name === name)
    if (!c) throw new Error(`Client not found: ${name}`)
    return c.id
  }

  const c1 = id('TechNova Inc.')
  const c2 = id('Nexus Partners')
  const c3 = id('Meridian Capital')
  const c4 = id('GlobeMed Group')
  const c5 = id('Vantage Retail')
  const c6 = id('PulseHR')

  // ── Interactions ────────────────────────────────────────────────────────────
  await prisma.clientInteraction.createMany({ data: [
    { clientId: c1, type: 'meeting',   title: 'Sprint 4 Review',              summary: 'Demoed email integration and lead scoring. Client happy with progress. Requested CSV export by next sprint.',           date: new Date('2026-05-26'), owner: 'Mahesh Kumar' },
    { clientId: c1, type: 'email',     title: 'Invoice KQ-2026-004 sent',     summary: 'Sent £44k invoice for Sprint 3-4 work. 30-day payment terms.',                                                          date: new Date('2026-04-30'), owner: 'Mahesh Kumar' },
    { clientId: c1, type: 'call',      title: 'Stakeholder check-in',         summary: 'Sarah flagged concern about timeline — wants delivery pushed to July 15. Agreed to revised schedule.',                  date: new Date('2026-05-10'), owner: 'Anika Roy'    },
    { clientId: c1, type: 'milestone', title: 'Sprint 1 delivered ✓',         summary: 'Lead management flows, API foundation, and UI delivered on time.',                                                       date: new Date('2026-04-14'), owner: 'Dev Patel'    },
    { clientId: c2, type: 'email',     title: 'Overdue invoice reminder',     summary: 'Sent second reminder for KQ-2026-006 (£18.5k overdue). Oliver acknowledged, promised payment by 10 Jun.',              date: new Date('2026-05-20'), owner: 'Anika Roy'    },
    { clientId: c2, type: 'meeting',   title: 'Portal delivery review',       summary: 'Task board live, earnings dashboard 60% done. Client raised new requirement for bulk export — logged as change request.',date: new Date('2026-05-12'), owner: 'Mahesh Kumar' },
    { clientId: c3, type: 'meeting',   title: 'Q2 Analytics Review',          summary: 'Demoed P&L dashboard and cash flow charts. David very positive. Alicia requested additional forecasting scenarios.',    date: new Date('2026-05-25'), owner: 'Priya Sharma' },
    { clientId: c3, type: 'note',      title: 'Upsell opportunity noted',     summary: 'Meridian interested in automated reporting + investor portal. Potential £45k expansion. Flagged to Mahesh.',            date: new Date('2026-05-25'), owner: 'Priya Sharma' },
    { clientId: c4, type: 'meeting',   title: 'Discovery kickoff',            summary: 'Day 1 of 5-day discovery. Mapped patient journey, identified 12 core flows, confirmed HIPAA scope.',                   date: new Date('2026-06-03'), owner: 'Dev Patel'    },
    { clientId: c4, type: 'call',      title: 'Contract signed — onboarding', summary: 'Signed £220k contract. GlobeMed is our largest client. KOM scheduled for June 1.',                                    date: new Date('2026-05-28'), owner: 'Mahesh Kumar' },
    { clientId: c5, type: 'email',     title: 'Monthly retainer delivered',   summary: 'May design deliverables: 4 new PDP screens, checkout redesign, component updates.',                                    date: new Date('2026-05-15'), owner: 'Sofia Mendez' },
    { clientId: c6, type: 'call',      title: 'Budget freeze discussion',     summary: 'Emma confirmed project pause due to Series A delays. Revisiting in Q3 2026.',                                          date: new Date('2026-04-10'), owner: 'Anika Roy'    },
  ]})

  // ── SLA Metrics ─────────────────────────────────────────────────────────────
  await prisma.clientSLA.createMany({ data: [
    { clientId: c1, metric: 'Sprint delivery on time',  target: 95,  current: 100,  unit: '%',   period: 'Q2 2026',  status: 'met',      trend: 'stable' },
    { clientId: c1, metric: 'Bug fix SLA (P1 < 4h)',    target: 95,  current: 88,   unit: '%',   period: 'Q2 2026',  status: 'at-risk',  trend: 'down'   },
    { clientId: c1, metric: 'Weekly update sent',       target: 100, current: 100,  unit: '%',   period: 'Q2 2026',  status: 'met',      trend: 'stable' },
    { clientId: c1, metric: 'Uptime (staging env)',     target: 99,  current: 99.7, unit: '%',   period: 'May 2026', status: 'met',      trend: 'stable' },
    { clientId: c2, metric: 'Milestone delivery rate',  target: 90,  current: 75,   unit: '%',   period: 'Q2 2026',  status: 'at-risk',  trend: 'down'   },
    { clientId: c2, metric: 'Response time (support)',  target: 4,   current: 6.2,  unit: 'hrs', period: 'May 2026', status: 'breached', trend: 'down'   },
    { clientId: c2, metric: 'Invoice payment SLA',      target: 30,  current: 45,   unit: 'days',period: 'Apr 2026', status: 'breached', trend: 'down'   },
    { clientId: c3, metric: 'Dashboard accuracy',       target: 99,  current: 99.8, unit: '%',   period: 'Q2 2026',  status: 'met',      trend: 'up'     },
    { clientId: c3, metric: 'Feature delivery pace',    target: 90,  current: 94,   unit: '%',   period: 'Q2 2026',  status: 'met',      trend: 'up'     },
    { clientId: c3, metric: 'Response time (support)',  target: 4,   current: 2.1,  unit: 'hrs', period: 'May 2026', status: 'met',      trend: 'stable' },
    { clientId: c4, metric: 'Discovery documentation',  target: 100, current: 40,   unit: '%',   period: 'Jun 2026', status: 'at-risk',  trend: 'up'     },
    { clientId: c5, metric: 'Monthly deliverables met', target: 100, current: 100,  unit: '%',   period: 'Q2 2026',  status: 'met',      trend: 'stable' },
  ]})

  // ── Milestones ───────────────────────────────────────────────────────────────
  await prisma.clientMilestone.createMany({ data: [
    { clientId: c1, projectId: 'pj1', title: 'Sprint 1 — Core lead management',   description: 'Lead pipeline, API foundation, authentication.',   dueDate: new Date('2026-04-14'), completedDate: new Date('2026-04-14'), status: 'completed',   owner: 'Dev Patel'    },
    { clientId: c1, projectId: 'pj1', title: 'Sprint 2 — Client profiles & email',description: 'Client 360, email integration, analytics widgets.',  dueDate: new Date('2026-05-12'), completedDate: new Date('2026-05-14'), status: 'completed',   owner: 'Anika Roy'    },
    { clientId: c1, projectId: 'pj1', title: 'Sprint 3 — Reporting & bulk ops',   description: 'CSV import/export, bulk actions, report builder.',  dueDate: new Date('2026-06-09'), status: 'in-progress', owner: 'Dev Patel'    },
    { clientId: c1, projectId: 'pj1', title: 'Sprint 4 — E2E testing & UAT',      description: 'Full test suite, UAT with client, bug fixes.',      dueDate: new Date('2026-07-15'), status: 'upcoming',    owner: 'Ravi Nair'    },
    { clientId: c1, projectId: 'pj1', title: 'Go-live & handover',                description: 'Production deploy, training, documentation.',       dueDate: new Date('2026-07-31'), status: 'upcoming',    owner: 'Mahesh Kumar' },
    { clientId: c2, projectId: 'pj3', title: 'Phase 1 — Task board',              description: 'Partner task board and basic dashboard.',           dueDate: new Date('2026-04-01'), completedDate: new Date('2026-04-01'), status: 'completed',   owner: 'Mahesh Kumar' },
    { clientId: c2, projectId: 'pj3', title: 'Phase 2 — Earnings & documents',    description: 'Earnings dashboard, document vault.',               dueDate: new Date('2026-05-20'), status: 'delayed',     owner: 'Ravi Nair'    },
    { clientId: c2, projectId: 'pj3', title: 'Phase 3 — Launch & training',       description: 'Live launch, partner onboarding, training.',        dueDate: new Date('2026-06-15'), status: 'upcoming',    owner: 'Anika Roy'    },
    { clientId: c3, projectId: 'pj5', title: 'Phase 1 — Core analytics',          description: 'P&L, cash flow, balance sheet dashboards.',         dueDate: new Date('2026-05-15'), completedDate: new Date('2026-05-13'), status: 'completed',   owner: 'Priya Sharma' },
    { clientId: c3, projectId: 'pj5', title: 'Phase 2 — Forecasting module',      description: 'Multi-scenario forecasting and stress tests.',      dueDate: new Date('2026-07-01'), status: 'in-progress', owner: 'Ravi Nair'    },
    { clientId: c3, projectId: 'pj5', title: 'Phase 3 — Investor reporting',      description: 'Automated investor reports and PDF export.',        dueDate: new Date('2026-08-15'), status: 'upcoming',    owner: 'Nina Tan'     },
    { clientId: c4, projectId: 'pj6', title: 'Discovery & requirements',           description: 'Full requirements doc, flow mapping, HIPAA audit.', dueDate: new Date('2026-06-30'), status: 'in-progress', owner: 'Dev Patel'    },
  ]})

  // ── Governance ───────────────────────────────────────────────────────────────
  await prisma.clientGovernanceItem.createMany({ data: [
    { clientId: c1, type: 'change-request', title: 'Add CSV export to lead list',        description: 'Client requests bulk CSV export with custom field mapping.',    status: 'approved', owner: 'Mahesh Kumar', date: new Date('2026-05-26'), priority: 'medium', resolution: 'Approved in scope, added to Sprint 3 backlog. No cost impact.' },
    { clientId: c1, type: 'decision',       title: 'Push go-live to July 15',            description: 'Go-live moved from July 1 to July 15 at client request.',      status: 'approved', owner: 'Mahesh Kumar', date: new Date('2026-05-10'), priority: 'high',   resolution: 'Timeline extended by 2 weeks. No additional cost.' },
    { clientId: c1, type: 'steering',       title: 'Q2 steering committee',              description: 'Quarterly review of delivery, budget, and roadmap alignment.',  status: 'closed',   owner: 'Mahesh Kumar', date: new Date('2026-04-15'), priority: 'medium', resolution: 'All Q2 milestones confirmed. Budget on track at 54%.' },
    { clientId: c2, type: 'escalation',     title: 'Overdue invoice — cash flow risk',   description: 'KQ-2026-006 (£18.5k) is 15 days overdue. CEO contacted.',      status: 'open',     owner: 'Anika Roy',    date: new Date('2026-05-15'), priority: 'critical' },
    { clientId: c2, type: 'change-request', title: 'Bulk export feature request',        description: 'Client wants bulk task export to Excel from portal.',           status: 'pending',  owner: 'Anika Roy',    date: new Date('2026-05-12'), priority: 'low' },
    { clientId: c2, type: 'decision',       title: 'Phase 2 delay — scope vs timeline',  description: 'Phase 2 delayed 2 weeks — choose: cut scope or extend timeline.', status: 'open',   owner: 'Mahesh Kumar', date: new Date('2026-05-18'), priority: 'high' },
    { clientId: c3, type: 'steering',       title: 'Q2 delivery review — Meridian',      description: 'Phase 1 delivered. Signed off Phase 2 SOW.',                   status: 'closed',   owner: 'Priya Sharma', date: new Date('2026-05-25'), priority: 'medium', resolution: 'Phase 1 accepted. Phase 2 SOW signed. £28k invoice approved.' },
    { clientId: c3, type: 'decision',       title: 'Upsell: investor portal scope',      description: 'Meridian interested in £45k expansion for investor reporting.', status: 'pending',  owner: 'Mahesh Kumar', date: new Date('2026-05-25'), priority: 'high' },
    { clientId: c4, type: 'decision',       title: 'HIPAA BAA signed',                  description: 'Business Associate Agreement executed prior to data access.',   status: 'approved', owner: 'Dev Patel',    date: new Date('2026-05-28'), priority: 'critical', resolution: 'BAA signed by both parties. Legal cleared for data handling.' },
    { clientId: c4, type: 'change-request', title: 'Add telehealth module to scope',     description: 'GlobeMed wants video consultation booking in scope.',           status: 'pending',  owner: 'Dev Patel',    date: new Date('2026-06-05'), priority: 'high' },
    { clientId: c6, type: 'escalation',     title: 'Churn risk — project paused 6 weeks',description: 'PulseHR paused. No communication in 6 weeks. Churn risk.',    status: 'open',     owner: 'Anika Roy',    date: new Date('2026-05-22'), priority: 'critical' },
  ]})

  console.log('Seeded: 12 interactions, 12 SLAs, 12 milestones, 11 governance items.')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
