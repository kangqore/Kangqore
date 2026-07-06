import type { Client, Interaction, SLAMetric, Milestone, GovernanceItem } from './types'

export const CLIENTS: Client[] = [
  {
    id: 'c1', name: 'TechNova Inc.', industry: 'Technology', country: 'United Kingdom',
    tier: 'strategic', status: 'active', health: 'good', arr: 180000,
    contractStart: '2026-01-10', contractEnd: '2027-01-09',
    owner: 'C.O.D.E.', projectIds: ['pj1'], satisfactionScore: 78, lastActivity: '2026-05-27',
    description: 'Enterprise CRM platform build — full-stack delivery from discovery to launch. Highest ARR client.',
    logo: 'TN',
    contacts: [
      { id: 'ct1', clientId: 'c1', name: 'Sarah Mitchell', role: 'CTO',              email: 'sarah@technova.io',  phone: '+44 7700 900001', isPrimary: true  },
      { id: 'ct2', clientId: 'c1', name: 'James Park',     role: 'Product Director', email: 'james@technova.io',  phone: '+44 7700 900002', isPrimary: false },
      { id: 'ct3', clientId: 'c1', name: 'Lisa Chen',      role: 'Finance Lead',     email: 'lisa@technova.io',   phone: '+44 7700 900003', isPrimary: false },
    ],
  },
  {
    id: 'c2', name: 'Nexus Partners', industry: 'Professional Services', country: 'United Kingdom',
    tier: 'enterprise', status: 'active', health: 'at-risk', arr: 90000,
    contractStart: '2026-02-15', contractEnd: '2026-11-14',
    owner: 'Anika Roy', projectIds: ['pj3'], satisfactionScore: 62, lastActivity: '2026-05-20',
    description: 'Partner portal with task management and earnings tracking. Invoice overdue — relationship at risk.',
    logo: 'NP',
    contacts: [
      { id: 'ct4', clientId: 'c2', name: 'Oliver Grant',   role: 'CEO',              email: 'oliver@nexus.co.uk', phone: '+44 7700 900010', isPrimary: true  },
      { id: 'ct5', clientId: 'c2', name: 'Priya Desai',    role: 'Operations Lead',  email: 'priya@nexus.co.uk',  phone: '+44 7700 900011', isPrimary: false },
    ],
  },
  {
    id: 'c3', name: 'Meridian Capital', industry: 'Financial Services', country: 'United Kingdom',
    tier: 'enterprise', status: 'active', health: 'good', arr: 140000,
    contractStart: '2026-03-15', contractEnd: '2026-12-14',
    owner: 'Priya Sharma', projectIds: ['pj5'], satisfactionScore: 84, lastActivity: '2026-05-25',
    description: 'Financial analytics suite — P&L dashboards, cash flow, forecasting for a mid-market PE fund.',
    logo: 'MC',
    contacts: [
      { id: 'ct6', clientId: 'c3', name: 'David Harrington', role: 'Managing Partner', email: 'david@meridian.com', phone: '+44 7700 900020', isPrimary: true  },
      { id: 'ct7', clientId: 'c3', name: 'Alicia Wang',       role: 'CFO',              email: 'alicia@meridian.com',phone: '+44 7700 900021', isPrimary: false },
    ],
  },
  {
    id: 'c4', name: 'GlobeMed Group', industry: 'Healthcare', country: 'Singapore',
    tier: 'strategic', status: 'onboarding', health: 'excellent', arr: 220000,
    contractStart: '2026-06-01', contractEnd: '2027-05-31',
    owner: 'Dev Patel', projectIds: ['pj6'], satisfactionScore: 92, lastActivity: '2026-05-28',
    description: 'HIPAA-compliant patient portal — largest single contract. Currently in discovery phase.',
    logo: 'GM',
    contacts: [
      { id: 'ct8', clientId: 'c4', name: 'Dr. Anand Rao',   role: 'CIO',              email: 'anand@globemed.sg',  phone: '+65 9000 1001', isPrimary: true  },
      { id: 'ct9', clientId: 'c4', name: 'Mei Lin Toh',     role: 'Project Sponsor',  email: 'mei@globemed.sg',    phone: '+65 9000 1002', isPrimary: false },
    ],
  },
  {
    id: 'c5', name: 'Vantage Retail', industry: 'Retail & E-commerce', country: 'United Arab Emirates',
    tier: 'standard', status: 'active', health: 'good', arr: 65000,
    contractStart: '2025-11-01', contractEnd: '2026-10-31',
    owner: 'Sofia Mendez', projectIds: [], satisfactionScore: 76, lastActivity: '2026-05-15',
    description: 'Ongoing retainer — UX/UI design and frontend support for their D2C platform.',
    logo: 'VR',
    contacts: [
      { id: 'ct10', clientId: 'c5', name: 'Khalid Al-Rashid', role: 'Head of Digital', email: 'khalid@vantage.ae', phone: '+971 50 123 4567', isPrimary: true },
    ],
  },
  {
    id: 'c6', name: 'PulseHR', industry: 'HR Technology', country: 'United Kingdom',
    tier: 'starter', status: 'paused', health: 'critical', arr: 28000,
    contractStart: '2025-08-01', contractEnd: '2026-07-31',
    owner: 'Anika Roy', projectIds: [], satisfactionScore: 41, lastActivity: '2026-04-10',
    description: 'HR platform MVP — paused due to client budget freeze. Risk of churn.',
    logo: 'PH',
    contacts: [
      { id: 'ct11', clientId: 'c6', name: 'Emma Clarke', role: 'Founder', email: 'emma@pulsehr.com', phone: '+44 7700 900030', isPrimary: true },
    ],
  },
]

export const INTERACTIONS: Interaction[] = [
  { id: 'i1',  clientId: 'c1', type: 'meeting',   title: 'Sprint 4 Review',              summary: 'Demoed email integration and lead scoring. Client happy with progress. Requested CSV export by next sprint.',           date: '2026-05-26', owner: 'C.O.D.E.' },
  { id: 'i2',  clientId: 'c1', type: 'email',     title: 'Invoice KQ-2026-004 sent',     summary: 'Sent £44k invoice for Sprint 3-4 work. 30-day payment terms.',                                                          date: '2026-04-30', owner: 'C.O.D.E.' },
  { id: 'i3',  clientId: 'c1', type: 'call',      title: 'Stakeholder check-in',         summary: 'Sarah flagged concern about timeline — wants delivery pushed to July 15. Agreed to revised schedule.',                  date: '2026-05-10', owner: 'Anika Roy'    },
  { id: 'i4',  clientId: 'c1', type: 'milestone', title: 'Sprint 1 delivered ✓',         summary: 'Lead management flows, API foundation, and UI delivered on time.',                                                       date: '2026-04-14', owner: 'Dev Patel'    },
  { id: 'i5',  clientId: 'c2', type: 'email',     title: 'Overdue invoice reminder',     summary: 'Sent second reminder for KQ-2026-006 (£18.5k overdue). Oliver acknowledged, promised payment by 10 Jun.',              date: '2026-05-20', owner: 'Anika Roy'    },
  { id: 'i6',  clientId: 'c2', type: 'meeting',   title: 'Portal delivery review',       summary: 'Task board live, earnings dashboard 60% done. Client raised new requirement for bulk export — logged as change request.',date: '2026-05-12', owner: 'C.O.D.E.' },
  { id: 'i7',  clientId: 'c3', type: 'meeting',   title: 'Q2 Analytics Review',          summary: 'Demoed P&L dashboard and cash flow charts. David very positive. Alicia requested additional forecasting scenarios.',    date: '2026-05-25', owner: 'Priya Sharma' },
  { id: 'i8',  clientId: 'c3', type: 'note',      title: 'Upsell opportunity noted',     summary: 'Meridian interested in automated reporting + investor portal. Potential £45k expansion. Flagged to C.O.D.E..',            date: '2026-05-25', owner: 'Priya Sharma' },
  { id: 'i9',  clientId: 'c4', type: 'meeting',   title: 'Discovery kickoff',            summary: 'Day 1 of 5-day discovery. Mapped patient journey, identified 12 core flows, confirmed HIPAA scope.',                   date: '2026-06-03', owner: 'Dev Patel'    },
  { id: 'i10', clientId: 'c4', type: 'call',      title: 'Contract signed — onboarding', summary: 'Signed £220k contract. GlobeMed is our largest client. KOM scheduled for June 1.',                                    date: '2026-05-28', owner: 'C.O.D.E.' },
  { id: 'i11', clientId: 'c5', type: 'email',     title: 'Monthly retainer delivered',   summary: 'May design deliverables: 4 new PDP screens, checkout redesign, component updates.',                                    date: '2026-05-15', owner: 'Sofia Mendez' },
  { id: 'i12', clientId: 'c6', type: 'call',      title: 'Budget freeze discussion',     summary: 'Emma confirmed project pause due to Series A delays. Revisiting in Q3 2026.',                                          date: '2026-04-10', owner: 'Anika Roy'    },
]

export const SLA_METRICS: SLAMetric[] = [
  { id: 's1',  clientId: 'c1', metric: 'Sprint delivery on time',  target: 95, current: 100, unit: '%',  period: 'Q2 2026',   status: 'met',      trend: 'stable' },
  { id: 's2',  clientId: 'c1', metric: 'Bug fix SLA (P1 < 4h)',    target: 95, current: 88,  unit: '%',  period: 'Q2 2026',   status: 'at-risk',  trend: 'down'   },
  { id: 's3',  clientId: 'c1', metric: 'Weekly update sent',       target: 100,current: 100, unit: '%',  period: 'Q2 2026',   status: 'met',      trend: 'stable' },
  { id: 's4',  clientId: 'c1', metric: 'Uptime (staging env)',     target: 99, current: 99.7,unit: '%',  period: 'May 2026',  status: 'met',      trend: 'stable' },
  { id: 's5',  clientId: 'c2', metric: 'Milestone delivery rate',  target: 90, current: 75,  unit: '%',  period: 'Q2 2026',   status: 'at-risk',  trend: 'down'   },
  { id: 's6',  clientId: 'c2', metric: 'Response time (support)',  target: 4,  current: 6.2, unit: 'hrs',period: 'May 2026',  status: 'breached', trend: 'down'   },
  { id: 's7',  clientId: 'c2', metric: 'Invoice payment SLA',      target: 30, current: 45,  unit: 'days',period: 'Apr 2026', status: 'breached', trend: 'down'   },
  { id: 's8',  clientId: 'c3', metric: 'Dashboard accuracy',       target: 99, current: 99.8,unit: '%',  period: 'Q2 2026',   status: 'met',      trend: 'up'     },
  { id: 's9',  clientId: 'c3', metric: 'Feature delivery pace',    target: 90, current: 94,  unit: '%',  period: 'Q2 2026',   status: 'met',      trend: 'up'     },
  { id: 's10', clientId: 'c3', metric: 'Response time (support)',  target: 4,  current: 2.1, unit: 'hrs',period: 'May 2026',  status: 'met',      trend: 'stable' },
  { id: 's11', clientId: 'c4', metric: 'Discovery documentation',  target: 100,current: 40,  unit: '%',  period: 'Jun 2026',  status: 'at-risk',  trend: 'up'     },
  { id: 's12', clientId: 'c5', metric: 'Monthly deliverables met', target: 100,current: 100, unit: '%',  period: 'Q2 2026',   status: 'met',      trend: 'stable' },
]

export const MILESTONES: Milestone[] = [
  { id: 'm1',  clientId: 'c1', projectId: 'pj1', title: 'Sprint 1 — Core lead management',   description: 'Lead pipeline, API foundation, authentication.',   dueDate: '2026-04-14', completedDate: '2026-04-14', status: 'completed',   owner: 'Dev Patel'    },
  { id: 'm2',  clientId: 'c1', projectId: 'pj1', title: 'Sprint 2 — Client profiles & email',description: 'Client 360, email integration, analytics widgets.',  dueDate: '2026-05-12', completedDate: '2026-05-14', status: 'completed',   owner: 'Anika Roy'    },
  { id: 'm3',  clientId: 'c1', projectId: 'pj1', title: 'Sprint 3 — Reporting & bulk ops',   description: 'CSV import/export, bulk actions, report builder.',  dueDate: '2026-06-09', status: 'in-progress', owner: 'Dev Patel'    },
  { id: 'm4',  clientId: 'c1', projectId: 'pj1', title: 'Sprint 4 — E2E testing & UAT',      description: 'Full test suite, UAT with client, bug fixes.',      dueDate: '2026-07-15', status: 'upcoming',    owner: 'Ravi Nair'    },
  { id: 'm5',  clientId: 'c1', projectId: 'pj1', title: 'Go-live & handover',                 description: 'Production deploy, training, documentation.',       dueDate: '2026-07-31', status: 'upcoming',    owner: 'C.O.D.E.' },
  { id: 'm6',  clientId: 'c2', projectId: 'pj3', title: 'Phase 1 — Task board',              description: 'Partner task board and basic dashboard.',           dueDate: '2026-04-01', completedDate: '2026-04-01', status: 'completed',   owner: 'C.O.D.E.' },
  { id: 'm7',  clientId: 'c2', projectId: 'pj3', title: 'Phase 2 — Earnings & documents',    description: 'Earnings dashboard, document vault.',               dueDate: '2026-05-20', status: 'delayed',     owner: 'Ravi Nair'    },
  { id: 'm8',  clientId: 'c2', projectId: 'pj3', title: 'Phase 3 — Launch & training',       description: 'Live launch, partner onboarding, training.',        dueDate: '2026-06-15', status: 'upcoming',    owner: 'Anika Roy'    },
  { id: 'm9',  clientId: 'c3', projectId: 'pj5', title: 'Phase 1 — Core analytics',          description: 'P&L, cash flow, balance sheet dashboards.',         dueDate: '2026-05-15', completedDate: '2026-05-13', status: 'completed',   owner: 'Priya Sharma' },
  { id: 'm10', clientId: 'c3', projectId: 'pj5', title: 'Phase 2 — Forecasting module',      description: 'Multi-scenario forecasting and stress tests.',      dueDate: '2026-07-01', status: 'in-progress', owner: 'Ravi Nair'    },
  { id: 'm11', clientId: 'c3', projectId: 'pj5', title: 'Phase 3 — Investor reporting',      description: 'Automated investor reports and PDF export.',        dueDate: '2026-08-15', status: 'upcoming',    owner: 'Nina Tan'     },
  { id: 'm12', clientId: 'c4', projectId: 'pj6', title: 'Discovery & requirements',          description: 'Full requirements doc, flow mapping, HIPAA audit.',  dueDate: '2026-06-30', status: 'in-progress', owner: 'Dev Patel'    },
]

export const GOVERNANCE: GovernanceItem[] = [
  { id: 'g1',  clientId: 'c1', type: 'change-request', title: 'Add CSV export to lead list',         description: 'Client requests bulk CSV export with custom field mapping.',   status: 'approved', owner: 'C.O.D.E.', date: '2026-05-26', priority: 'medium', resolution: 'Approved in scope, added to Sprint 3 backlog. No cost impact.' },
  { id: 'g2',  clientId: 'c1', type: 'decision',       title: 'Push go-live to July 15',             description: 'Go-live moved from July 1 to July 15 at client request.',     status: 'approved', owner: 'C.O.D.E.', date: '2026-05-10', priority: 'high',   resolution: 'Timeline extended by 2 weeks. No additional cost.' },
  { id: 'g3',  clientId: 'c1', type: 'steering',       title: 'Q2 steering committee',               description: 'Quarterly review of delivery, budget, and roadmap alignment.',status: 'closed',   owner: 'C.O.D.E.', date: '2026-04-15', priority: 'medium', resolution: 'All Q2 milestones confirmed. Budget on track at 54%.' },
  { id: 'g4',  clientId: 'c2', type: 'escalation',     title: 'Overdue invoice — cash flow risk',    description: 'KQ-2026-006 (£18.5k) is 15 days overdue. CEO contacted.',     status: 'open',     owner: 'Anika Roy',    date: '2026-05-15', priority: 'critical' },
  { id: 'g5',  clientId: 'c2', type: 'change-request', title: 'Bulk export feature request',         description: 'Client wants bulk task export to Excel from portal.',          status: 'pending',  owner: 'Anika Roy',    date: '2026-05-12', priority: 'low' },
  { id: 'g6',  clientId: 'c2', type: 'decision',       title: 'Phase 2 delay — scope vs timeline',  description: 'Phase 2 delayed 2 weeks — choose: cut scope or extend timeline.', status: 'open',  owner: 'C.O.D.E.', date: '2026-05-18', priority: 'high' },
  { id: 'g7',  clientId: 'c3', type: 'steering',       title: 'Q2 delivery review — Meridian',       description: 'Phase 1 delivered. Signed off Phase 2 SOW.',                  status: 'closed',   owner: 'Priya Sharma', date: '2026-05-25', priority: 'medium', resolution: 'Phase 1 accepted. Phase 2 SOW signed. £28k invoice approved.' },
  { id: 'g8',  clientId: 'c3', type: 'decision',       title: 'Upsell: investor portal scope',       description: 'Meridian interested in £45k expansion for investor reporting.', status: 'pending', owner: 'C.O.D.E.', date: '2026-05-25', priority: 'high' },
  { id: 'g9',  clientId: 'c4', type: 'decision',       title: 'HIPAA BAA signed',                   description: 'Business Associate Agreement executed prior to data access.',  status: 'approved', owner: 'Dev Patel',    date: '2026-05-28', priority: 'critical', resolution: 'BAA signed by both parties. Legal cleared for data handling.' },
  { id: 'g10', clientId: 'c4', type: 'change-request', title: 'Add telehealth module to scope',      description: 'GlobeMed wants video consultation booking in scope.',          status: 'pending',  owner: 'Dev Patel',    date: '2026-06-05', priority: 'high' },
  { id: 'g11', clientId: 'c6', type: 'escalation',     title: 'Churn risk — project paused 6 weeks', description: 'PulseHR paused. No communication in 6 weeks. Churn risk.',   status: 'open',     owner: 'Anika Roy',    date: '2026-05-22', priority: 'critical' },
]
