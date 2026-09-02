import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const now = Date.now()
const h = (n: number) => now - n * 60 * 60 * 1000
const m = (n: number) => now - n * 60 * 1000

const events: Array<{
  id: string; type: string; title: string; value?: string; sub?: string
  color: string; ts: number; announced: boolean; raw: Record<string, any>
}> = [
  // ── SIGNALS ──────────────────────────────────────────────────────────────────
  {
    id: 'ev-001', type: 'signal', color: '#e2445c', ts: h(1.2), announced: true,
    title: 'Pipeline velocity drop detected', value: '−18%', sub: 'Sales · Q2 pipeline',
    raw: {
      module: 'Sales Intelligence', entity: 'Q2 Pipeline', confidence: 87,
      trend: 'declining', delta: '−18%', baseline: '£2.4M avg (90-day)', current: '£1.97M',
      trigger: '7-day rolling velocity dropped across 5 active deals — all stalled at Negotiation stage',
      recommendation: 'Schedule pipeline review with Sales Lead this week. Prioritise Orion Corp (£420K, 78% churn risk) and Meridian Group (£380K, missed 2 follow-ups).',
      affectedEntities: ['Orion Corp Deal', 'Meridian Group', 'TechCo Proposal'],
      kimmpCorrelation: 'ISS-003', urgency: 'high', correlationStrength: 94,
    },
  },
  {
    id: 'ev-002', type: 'signal', color: '#fdab3d', ts: h(3.5), announced: true,
    title: 'Client Axiom Corp NPS dropped to 42', value: '42', sub: 'CX · retention risk',
    raw: {
      module: 'Client Experience', entity: 'Axiom Corp', confidence: 82,
      trend: 'declining', delta: '−11 pts', baseline: 'NPS 53 (prev quarter)', current: 'NPS 42',
      trigger: 'Post-delivery survey returned 42 — driven by 3 detractors citing slow response times and unclear deliverables',
      recommendation: 'Assign dedicated CSM for 30 days. Schedule executive check-in within 48h. Review SLA performance for last quarter.',
      affectedEntities: ['Axiom Corp', 'Project Nexus', 'Q2 Delivery'],
      kimmpCorrelation: 'ISS-007', urgency: 'high', correlationStrength: 88,
    },
  },
  {
    id: 'ev-003', type: 'signal', color: '#00c875', ts: h(6), announced: true,
    title: 'Project Phoenix sprint velocity recovering', value: '+12%', sub: 'Delivery · 3-week trend',
    raw: {
      module: 'Delivery Intelligence', entity: 'Project Phoenix', confidence: 79,
      trend: 'improving', delta: '+12%', baseline: 'Sprint velocity avg 24 pts (prev 3 weeks)', current: '27 pts this sprint',
      trigger: 'Team re-onboarding after senior dev replacement complete; pair programming protocol restored velocity',
      recommendation: 'Maintain current team structure through delivery. Consider buffer for last sprint — scope creep risk remains at 23%.',
      affectedEntities: ['Project Phoenix', 'Orion Delivery', 'Engineering Team'],
      kimmpCorrelation: null, urgency: 'low', correlationStrength: null,
    },
  },
  {
    id: 'ev-004', type: 'signal', color: '#fdab3d', ts: h(14), announced: true,
    title: 'Cash runway signal — 94 days remaining', value: '94d', sub: 'Finance · burn rate',
    raw: {
      module: 'Finance Intelligence', entity: 'Treasury', confidence: 95,
      trend: 'declining', delta: '−8 days vs last month', baseline: '102 days (prev month)', current: '94 days',
      trigger: 'Burn rate increased 9% due to R&D contractor spend. AR collections 12 days slower than Q1 average.',
      recommendation: 'Chase 3 overdue invoices totalling £42K. Review contractor utilisation before next sprint planning.',
      affectedEntities: ['Treasury', 'Finance · AR', 'Meridian Ltd Invoice'],
      kimmpCorrelation: 'ISS-002', urgency: 'medium', correlationStrength: 91,
    },
  },
  {
    id: 'ev-005', type: 'signal', color: '#00c875', ts: h(22), announced: true,
    title: 'Recurring revenue hit monthly high', value: '$248K MRR', sub: 'Finance · milestone',
    raw: {
      module: 'Finance Intelligence', entity: 'Revenue', confidence: 98,
      trend: 'improving', delta: '+8.7%', baseline: '$228K MRR (prev month)', current: '$248K MRR',
      trigger: 'Two new enterprise clients onboarded at higher ACV + renewal uplift from TechCo (+15% YoY)',
      recommendation: 'Lock in Q3 enterprise pipeline now. This momentum window typically lasts 6-8 weeks — sales focus critical.',
      affectedEntities: ['Revenue', 'Enterprise Clients', 'TechCo Renewal'],
      kimmpCorrelation: null, urgency: 'low', correlationStrength: null,
    },
  },
  {
    id: 'ev-006', type: 'signal', color: '#e2445c', ts: h(28), announced: false,
    title: 'Support ticket backlog up 34%', value: '+34%', sub: 'Ops · 7-day trend',
    raw: {
      module: 'Operations Intelligence', entity: 'Support Backlog', confidence: 84,
      trend: 'declining', delta: '+34%', baseline: '41 open tickets (7-day avg)', current: '55 open tickets',
      trigger: 'Two support engineers on leave simultaneously with no cover. Ticket inflow spike from Axiom Corp (7 tickets this week).',
      recommendation: 'Re-assign 2 delivery engineers to support rotation for 5 days. Escalate Axiom Corp tickets to CSM immediately.',
      affectedEntities: ['Support Queue', 'Axiom Corp', 'Delivery Team'],
      kimmpCorrelation: 'ISS-007', urgency: 'high', correlationStrength: 76,
    },
  },
  {
    id: 'ev-007', type: 'signal', color: '#fdab3d', ts: h(36), announced: true,
    title: 'Team utilisation at 94% — near capacity', value: '94%', sub: 'People · capacity risk',
    raw: {
      module: 'People Intelligence', entity: 'Delivery Team', confidence: 88,
      trend: 'stable', delta: '+2%', baseline: '92% avg (prev 4 weeks)', current: '94%',
      trigger: 'Three concurrent deliveries running. One unplanned urgent support request absorbed 2 engineers for 3 days.',
      recommendation: 'Freeze new project intake for 2 weeks. Delay Orion Corp kickoff by 1 week to reduce capacity risk.',
      affectedEntities: ['Delivery Team', 'Project Phoenix', 'Orion Corp'],
      kimmpCorrelation: 'ISS-004', urgency: 'medium', correlationStrength: 83,
    },
  },
  {
    id: 'ev-008', type: 'signal', color: '#e2445c', ts: h(48), announced: true,
    title: 'Churn probability up for 3 clients', value: '3 clients', sub: 'CX · KIMMP model',
    raw: {
      module: 'Client Intelligence', entity: 'Client Portfolio', confidence: 91,
      trend: 'declining', delta: '+3 clients at risk', baseline: '1 client at risk (prev month)', current: '4 clients at risk',
      trigger: 'KIMMP churn model updated with new behavioural signals: reduced engagement, missed check-ins, support escalations',
      recommendation: 'Assign retention workflow to Axiom Corp (highest risk, NPS 42). Schedule proactive reviews for TechStar and Nova Consulting.',
      affectedEntities: ['Axiom Corp', 'TechStar Ltd', 'Nova Consulting'],
      kimmpCorrelation: 'ISS-007', urgency: 'high', correlationStrength: 89,
    },
  },

  // ── ALERTS ───────────────────────────────────────────────────────────────────
  {
    id: 'ev-009', type: 'alert', color: '#e2445c', ts: m(45), announced: true,
    title: 'SLA breach — GlobalTech contract 4h overdue', value: 'P1 · 4h breach', sub: 'Contract KQ-2026-044',
    raw: {
      severity: 'P1', slaTarget: '4h response SLA', breachedAt: '2026-06-21T06:00:00Z',
      overdueBy: '4h 23m', client: 'GlobalTech', contract: 'KQ-2026-044',
      owner: 'Delivery Lead', escalatedTo: 'Board',
      resolutionSteps: [
        'Call GlobalTech account manager within 30 minutes — acknowledge breach formally',
        'Expedite Phase 2 delivery milestone — reassign 1 senior engineer immediately',
        'Issue formal breach notification with revised delivery date and root cause',
        'Escalate to Board if client rejects revised timeline within 4h',
      ],
      relatedIssue: 'ISS-001', kimmpActive: true,
    },
  },
  {
    id: 'ev-010', type: 'alert', color: '#fdab3d', ts: h(2), announced: true,
    title: 'Invoice #INV-2841 overdue by 21 days', value: '£12,400', sub: 'Finance · Meridian Ltd',
    raw: {
      severity: 'P2', slaTarget: '30-day payment terms', breachedAt: '2026-06-01T00:00:00Z',
      overdueBy: '21 days', client: 'Meridian Ltd', contract: 'INV-2841',
      owner: 'Finance Team', escalatedTo: null,
      resolutionSteps: [
        'Send formal overdue notice via email — copy to MD',
        'Call Meridian accounts payable — flag as urgent, request payment date',
        'If unpaid in 7 days, pause active work and escalate to legal',
      ],
      relatedIssue: 'ISS-002', kimmpActive: false,
    },
  },
  {
    id: 'ev-011', type: 'alert', color: '#e2445c', ts: h(5), announced: false,
    title: 'Approval queue stalled — 7 items >48h', value: '7 items', sub: 'Workflow · needs review',
    raw: {
      severity: 'P2', slaTarget: '48h approval SLA', breachedAt: '2026-06-19T09:00:00Z',
      overdueBy: '48h+', client: 'Internal', contract: 'Workflow Queue',
      owner: 'Operations', escalatedTo: null,
      resolutionSteps: [
        'Identify approvers for each stalled item — assign deputy if primary is OOO',
        'Clear all P1 and P2 approvals within 4h',
        'Review approval queue SLA — consider reducing timeout from 48h to 24h',
      ],
      relatedIssue: null, kimmpActive: false,
    },
  },
  {
    id: 'ev-012', type: 'alert', color: '#fdab3d', ts: h(18), announced: true,
    title: 'Vendor contract expiry in 8 days', value: '8 days', sub: 'Procurement · AWS reseller',
    raw: {
      severity: 'P2', slaTarget: 'Renew before expiry', breachedAt: null,
      overdueBy: 'Expires in 8 days', client: 'AWS Reseller', contract: 'VENDOR-AWS-2024',
      owner: 'Procurement', escalatedTo: null,
      resolutionSteps: [
        'Contact AWS reseller for renewal quote by EOD — flag urgency',
        'Review usage vs new pricing tiers — potential 12% saving available on committed use',
        'Route to Finance for PO approval — allow 3 business days minimum',
      ],
      relatedIssue: null, kimmpActive: false,
    },
  },
  {
    id: 'ev-013', type: 'alert', color: '#e2445c', ts: h(30), announced: true,
    title: 'HANUMANAS: Access review overdue — CC6.3', value: 'SOC2 at risk', sub: 'Compliance · 14d overdue',
    raw: {
      severity: 'P1', slaTarget: 'SOC 2 CC6.3 — quarterly access review', breachedAt: '2026-06-07T00:00:00Z',
      overdueBy: '14 days', client: 'Compliance / HANUMANAS', contract: 'SOC2-CC6.3 + ISO A.9.4.1 + NIST PR.AC-1',
      owner: 'GovernanceOps Agent', escalatedTo: 'CISO',
      resolutionSteps: [
        'Run GovernanceOps access review agent immediately (auto-queued)',
        'Revoke 3 dormant accounts flagged by KIMMP (>90 days inactive)',
        'Document review completion in HANUMANAS audit log with timestamp',
        'Generate SOC 2 evidence package and upload to auditor portal',
      ],
      relatedIssue: 'ISS-005', kimmpActive: true,
    },
  },
  {
    id: 'ev-014', type: 'alert', color: '#fdab3d', ts: h(42), announced: false,
    title: 'Project deadline risk — Orion build 72% complete', value: '72%', sub: 'Delivery · 6 days remain',
    raw: {
      severity: 'P2', slaTarget: 'Contractual delivery: 27 Jun 2026', breachedAt: null,
      overdueBy: '6 days to deadline at 72% complete', client: 'Orion Corp', contract: 'KQ-2026-031',
      owner: 'Project Lead', escalatedTo: null,
      resolutionSteps: [
        'Reduce scope of Phase 3 features to meet deadline — confirm descoping with client',
        'Add 1 engineer from bench to accelerate final integration',
        'Daily standups with PM attendance starting tomorrow',
      ],
      relatedIssue: 'ISS-006', kimmpActive: false,
    },
  },

  // ── AGENTS ───────────────────────────────────────────────────────────────────
  {
    id: 'ev-015', type: 'agent', color: '#9747ff', ts: m(20), announced: false,
    title: 'GovernanceOps ran quarterly access review', value: '47 users audited', sub: 'HANUMANAS · automated',
    raw: {
      agent: 'GovernanceOps', engine: 'Compliance Engine', trigger: 'scheduled',
      startedAt: '2026-06-22T09:45:00Z', completedAt: '2026-06-22T09:47:34Z', duration: '2m 34s',
      result: 'success', actionsPerformed: 47,
      entitiesAffected: ['Active Users (47)', 'Access Groups (12)', 'Admin Permissions (8)'],
      findings: '3 dormant accounts flagged for deactivation (>90 days inactive). 1 user retaining elevated permissions beyond role change date. Access review log exported to HANUMANAS audit trail.',
      nextScheduledRun: '2026-07-01', approvalRequired: false, logsAvailable: true,
    },
  },
  {
    id: 'ev-016', type: 'agent', color: '#9747ff', ts: h(1.5), announced: false,
    title: 'FinanceOps closed 3 AR items automatically', value: '£28,750 cleared', sub: 'Finance · auto-reconciled',
    raw: {
      agent: 'FinanceOps', engine: 'Finance Engine', trigger: 'scheduled',
      startedAt: '2026-06-22T08:00:00Z', completedAt: '2026-06-22T08:08:14Z', duration: '8m 14s',
      result: 'success', actionsPerformed: 3,
      entitiesAffected: ['INV-2798 (£9,200)', 'INV-2812 (£11,350)', 'INV-2819 (£8,200)'],
      findings: '3 invoices matched to bank receipt confirmations and auto-closed. Remaining AR balance: £26,400 across 4 open invoices. INV-2841 (Meridian, £12,400) flagged as overdue — manual action required.',
      nextScheduledRun: 'Daily at 08:00', approvalRequired: false, logsAvailable: true,
    },
  },
  {
    id: 'ev-017', type: 'agent', color: '#9747ff', ts: h(4), announced: false,
    title: 'CommsAgent sent board report — 12 recipients', value: '12 sent', sub: 'Comms · scheduled',
    raw: {
      agent: 'CommsAgent', engine: 'Comms Engine', trigger: 'scheduled',
      startedAt: '2026-06-22T07:00:00Z', completedAt: '2026-06-22T07:04:22Z', duration: '4m 22s',
      result: 'success', actionsPerformed: 12,
      entitiesAffected: ['Board Members (4)', 'Investors (5)', 'Observers (3)'],
      findings: 'Monthly board report sent to 12 recipients. Coverage: MRR ($248K record), pipeline update, 2 key risks (ISS-001 SLA breach, ISS-002 cash runway). KIMMP synthesis section included with 4 strategic signals.',
      nextScheduledRun: 'Monthly — 1st of month', approvalRequired: false, logsAvailable: false,
    },
  },
  {
    id: 'ev-018', type: 'agent', color: '#9747ff', ts: h(8), announced: false,
    title: 'SalesOps enriched 28 leads from Scout', value: '28 leads', sub: 'Scout · web intelligence',
    raw: {
      agent: 'SalesOps', engine: 'Scout Engine', trigger: 'scheduled',
      startedAt: '2026-06-22T06:30:00Z', completedAt: '2026-06-22T06:42:58Z', duration: '12m 58s',
      result: 'success', actionsPerformed: 28,
      entitiesAffected: ['Lead Database', 'eQORE CRM', 'Scout Job: UK SME Tech'],
      findings: '28 leads enriched with LinkedIn data, company size, tech stack, and intent signals. 6 flagged as high priority (tech stack match + active hiring signal). 1 competitor mention detected: Salesforce pitching to Orion Corp — flag for Sales Lead.',
      nextScheduledRun: 'Daily at 06:30', approvalRequired: false, logsAvailable: true,
    },
  },
  {
    id: 'ev-019', type: 'agent', color: '#9747ff', ts: h(16), announced: true,
    title: 'RiskAgent flagged 2 contract clauses for review', value: '2 clauses', sub: 'Legal · KIMMP review',
    raw: {
      agent: 'RiskAgent', engine: 'Legal Intelligence Engine', trigger: 'event_driven',
      startedAt: '2026-06-22T05:15:00Z', completedAt: '2026-06-22T05:17:44Z', duration: '2m 44s',
      result: 'partial', actionsPerformed: 2,
      entitiesAffected: ['Contract KQ-2026-044 (GlobalTech)', 'Contract KQ-2026-038 (Meridian)'],
      findings: 'Clause 14.3 in KQ-2026-044: liability cap below standard threshold — recommend renegotiation before next renewal. Clause 8.1 in KQ-2026-038: IP assignment ambiguous for AI-generated deliverables — legal review required before signing.',
      nextScheduledRun: 'On contract upload', approvalRequired: true, logsAvailable: true,
    },
  },
  {
    id: 'ev-020', type: 'agent', color: '#9747ff', ts: h(26), announced: false,
    title: 'ScheduleAgent auto-booked 3 onboarding calls', value: '3 bookings', sub: 'Scheduling · new clients',
    raw: {
      agent: 'ScheduleAgent', engine: 'Scheduling Engine', trigger: 'event_driven',
      startedAt: '2026-06-22T10:05:00Z', completedAt: '2026-06-22T10:05:47Z', duration: '47s',
      result: 'success', actionsPerformed: 3,
      entitiesAffected: ['TechStart Ltd (new client)', 'Finova Corp (new client)', 'BlueWave Group (new client)'],
      findings: 'Onboarding calls booked: TechStart (24 Jun 10:00), Finova Corp (25 Jun 14:00), BlueWave Group (26 Jun 09:30). Calendar invites sent. CSM assigned to each based on capacity and industry match.',
      nextScheduledRun: 'On new client creation', approvalRequired: false, logsAvailable: false,
    },
  },

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  {
    id: 'ev-021', type: 'kpi', color: '#00c875', ts: h(2.5), announced: false,
    title: 'CSAT score updated — 4.6/5.0', value: '4.6', sub: 'CX · monthly aggregate',
    raw: {
      metric: 'Customer Satisfaction Score', current: 4.6, previous: 4.3, target: 4.5, unit: '/5.0',
      variance: '+7%', trend: 'improving', period: 'May 2026',
      dataSource: 'Intercom NPS + Post-delivery surveys', sampleSize: 142,
      breakdown: { 'Promoters (9–10)': '68%', 'Passives (7–8)': '24%', 'Detractors (1–6)': '8%' },
      insight: 'Response speed cited in 71% of positive responses. Detractors cluster around deliverable clarity — brief quality review recommended.',
    },
  },
  {
    id: 'ev-022', type: 'kpi', color: '#00c875', ts: h(10), announced: false,
    title: 'Active client count reached 47', value: '47', sub: 'Growth · +3 this week',
    raw: {
      metric: 'Active Client Count', current: 47, previous: 44, target: 50, unit: ' clients',
      variance: '+7%', trend: 'improving', period: 'Week ending 20 Jun 2026',
      dataSource: 'CRM — Kangqore OS', sampleSize: null,
      breakdown: { 'Enterprise': '8', 'Mid-market': '24', 'SME': '15' },
      insight: '3 new clients onboarded this week — all via referral. Referral channel now accounts for 34% of new business. Nurture programme showing clear ROI.',
    },
  },
  {
    id: 'ev-023', type: 'kpi', color: '#fdab3d', ts: h(20), announced: false,
    title: 'Average deal size dropped to £38K', value: '£38K', sub: 'Sales · 30-day avg',
    raw: {
      metric: 'Average Deal Size', current: 38000, previous: 44000, target: 45000, unit: '£',
      variance: '−14%', trend: 'declining', period: 'Rolling 30 days',
      dataSource: 'eQORE Sales Pipeline', sampleSize: 12,
      breakdown: { 'Enterprise deals': '£94K avg', 'Mid-market deals': '£41K avg', 'SME deals': '£18K avg' },
      insight: 'Decline driven by 3 SME deals closing below target ACV. Enterprise pipeline remains strong. Focus Q3 outreach on mid-market to recover blended average.',
    },
  },
  {
    id: 'ev-024', type: 'kpi', color: '#00c875', ts: h(32), announced: false,
    title: 'Employee engagement score 7.4/10', value: '7.4', sub: 'People · quarterly pulse',
    raw: {
      metric: 'Employee Engagement Score', current: 7.4, previous: 7.1, target: 8.0, unit: '/10',
      variance: '+4%', trend: 'improving', period: 'Q2 2026 Pulse Survey',
      dataSource: 'Anonymous pulse survey (Typeform)', sampleSize: 14,
      breakdown: { 'Remote setup': '8.2', 'Team culture': '8.1', 'Work clarity': '7.6', 'Growth opportunities': '6.9' },
      insight: 'Growth opportunities rated lowest at 6.9. Two team members have flagged interest in senior roles — succession planning conversation is overdue.',
    },
  },
  {
    id: 'ev-025', type: 'kpi', color: '#00c875', ts: h(46), announced: true,
    title: 'Gross margin at 62.4% — record high', value: '62.4%', sub: 'Finance · this month',
    raw: {
      metric: 'Gross Margin', current: 62.4, previous: 59.8, target: 60.0, unit: '%',
      variance: '+4.3%', trend: 'improving', period: 'June 2026 (MTD)',
      dataSource: 'Finance — Xero + internal cost tracking', sampleSize: null,
      breakdown: { 'Delivery margin': '64%', 'Tooling margin': '71%', 'Overhead allocation': '−12.6%' },
      insight: 'Record driven by reduced contractor spend (−18%) and higher-margin enterprise work. Protect this mix into Q3.',
    },
  },
  {
    id: 'ev-026', type: 'kpi', color: '#fdab3d', ts: h(58), announced: false,
    title: 'Project delivery on-time rate 71%', value: '71%', sub: 'Delivery · rolling 90d',
    raw: {
      metric: 'Project On-Time Delivery Rate', current: 71, previous: 78, target: 85, unit: '%',
      variance: '−9%', trend: 'declining', period: 'Rolling 90 days',
      dataSource: 'PMO — Kangqore OS project tracker', sampleSize: 21,
      breakdown: { 'On time': '15 projects', '1–5 days late': '4 projects', '5+ days late': '2 projects' },
      insight: '2 late projects (Orion KQ-031, GlobalTech KQ-044) account for all P1 delivery issues. Both share the same senior engineer — resource dependency risk flagged in ISS-004.',
    },
  },

  // ── SYSTEM ───────────────────────────────────────────────────────────────────
  {
    id: 'ev-027', type: 'system', color: '#579bfc', ts: m(5), announced: false,
    title: 'WAANDA Event Log connected to database', value: 'Persistent', sub: 'Architecture upgrade',
    raw: {
      component: 'WAANDA Event Store', status: 'complete', duration: '0.8s',
      operation: 'Migrate event storage from localStorage to PostgreSQL persistence',
      trigger: 'Platform upgrade — Claude Code', schemaVersion: 'v14',
      impactScope: 'All WAANDA events now persisted across sessions and devices',
      details: 'waanda_events table added to Prisma schema. Events written to DB with localStorage as local fallback. Historical events migrated on first authenticated load.',
      tablesAffected: ['waanda_events'], rollbackAvailable: false,
    },
  },
  {
    id: 'ev-028', type: 'system', color: '#579bfc', ts: h(7), announced: false,
    title: 'KIMMP correlation engine processed 1,204 signals', value: '1,204', sub: 'Daily digest',
    raw: {
      component: 'KIMMP Correlation Engine', status: 'complete', duration: '4m 12s',
      operation: 'Daily signal processing digest — L1 → L5 pyramid computation',
      trigger: 'Scheduled — daily at 00:00 UTC', schemaVersion: null,
      impactScope: '12 entity correlations, 4 CEO-level decisions queued',
      details: 'Processed: 1,204 raw signals → 847 filtered → 203 L2 signals → 38 L3 correlations → 12 L4 intelligence items → 4 L5 CEO decisions queued for morning briefing.',
      tablesAffected: [], rollbackAvailable: false,
    },
  },
  {
    id: 'ev-029', type: 'system', color: '#579bfc', ts: h(12), announced: false,
    title: 'Ops Centre module activated', value: 'Phase 0', sub: 'Enterprise expansion',
    raw: {
      component: 'Operations Centre Module (BOI)', status: 'complete', duration: '—',
      operation: 'Module activation — Business Operations Intelligence, Sprint 0',
      trigger: 'Enterprise expansion plan — Sprint 0', schemaVersion: null,
      impactScope: '5 new views: Issues, Root Cause, Commitments, Entity Graph, Change Log',
      details: 'Ops Centre replaces IT-centric ITSM with entity-horizontal BOI. Signal Pyramid widget makes KIMMP L1→L5 processing visible at CEO level. Positioned as direct ServiceNow competitor.',
      tablesAffected: [], rollbackAvailable: true,
    },
  },
  {
    id: 'ev-030', type: 'system', color: '#579bfc', ts: h(24), announced: false,
    title: 'HANUMANAS Compliance Monitor baseline set — 73%', value: '73%', sub: 'SOC2 · ISO27001 · NIST',
    raw: {
      component: 'HANUMANAS Compliance Monitor', status: 'complete', duration: '—',
      operation: 'Baseline assessment — 20 controls across SOC 2, ISO 27001, NIST CSF',
      trigger: 'Enterprise expansion plan — Sprint 0', schemaVersion: null,
      impactScope: 'SOC 2 (8 controls), ISO 27001 (8 controls), NIST CSF (4 functions)',
      details: 'Baseline score: 73/100. Breach readiness: 73%. 3 FAIL controls (CC6.3, A.9.4.1, PR.AC-1) all linked to ISS-005 access review — one remediation closes all three. Audit evidence export pipeline active.',
      tablesAffected: [], rollbackAvailable: false,
    },
  },
  {
    id: 'ev-031', type: 'system', color: '#579bfc', ts: h(40), announced: false,
    title: 'Scout web intelligence active — Serper API', value: '6 sources', sub: 'Research engine',
    raw: {
      component: 'Scout Web Intelligence', status: 'complete', duration: '—',
      operation: 'API activation — Serper.dev search engine configured',
      trigger: 'Environment configuration — SERPER_API_KEY added to .env', schemaVersion: null,
      impactScope: '6 active intelligence sources across 3 scan categories',
      details: 'Serper.dev primary search active. Tavily fallback configured. Active scan jobs: Competitor Monitor, Market Intelligence, Regulatory Watch, Government Tenders, Partnership Radar, Tech Radar. Runs every 5 minutes.',
      tablesAffected: [], rollbackAvailable: false,
    },
  },
  {
    id: 'ev-032', type: 'system', color: '#579bfc', ts: h(52), announced: false,
    title: 'Entity Graph indexed 127 business entities', value: '127', sub: 'BOI · auto-discovery',
    raw: {
      component: 'Business Entity Graph', status: 'complete', duration: '1.2s',
      operation: 'Initial entity discovery and indexing — Ops Centre activation',
      trigger: 'Ops Centre activation — auto-discovery on boot', schemaVersion: null,
      impactScope: '127 entities, 340 dependency edges across 6 entity types',
      details: 'Indexed: 31 Clients, 28 Projects, 22 Resources, 18 Vendors, 16 Finance entities, 12 Contracts. 340 dependency edges mapped. Real-time KIMMP signal injection active on all nodes.',
      tablesAffected: [], rollbackAvailable: false,
    },
  },
  {
    id: 'ev-033', type: 'system', color: '#579bfc', ts: h(60), announced: false,
    title: 'Prisma migration complete — waanda_events table', value: 'Production', sub: 'DB · schema v14',
    raw: {
      component: 'PostgreSQL', status: 'complete', duration: '3.2s',
      operation: 'Prisma schema migration — waanda_events table creation',
      trigger: 'CLI — npx prisma db push', schemaVersion: 'v14',
      impactScope: 'New table: waanda_events with 2 performance indexes',
      details: 'Schema version 14. Fields: id (CUID), type, title, value, sub, color, ts (BigInt unix-ms), announced, raw (Json), createdAt. Indexes on (type, createdAt) and (createdAt) for fast filtered queries.',
      tablesAffected: ['waanda_events'], rollbackAvailable: true, indexesCreated: 2,
    },
  },

  // ── RECENT ───────────────────────────────────────────────────────────────────
  {
    id: 'ev-034', type: 'signal', color: '#e2445c', ts: m(38), announced: true,
    title: 'KIMMP detected unusual login pattern — 2 accounts', value: '2 accounts', sub: 'Security · HANUMANAS flagged',
    raw: {
      module: 'HANUMANAS Security Intelligence', entity: 'Authentication', confidence: 73,
      trend: 'stable', delta: '2 anomalous sessions', baseline: 'Normal: single-device, business hours only',
      current: 'Off-hours logins from 2 unrecognised devices',
      trigger: 'Two admin accounts authenticated from unrecognised devices at 02:17 and 02:34 UTC. Different IP ranges. MFA was not challenged on either.',
      recommendation: 'Force re-authentication on both accounts immediately. Review HANUMANAS audit log for all actions taken during the suspicious sessions. Enable geo-blocking for off-hours access.',
      affectedEntities: ['Admin Account A', 'Admin Account B'],
      kimmpCorrelation: 'HANUMANAS-CC6.3', urgency: 'high', correlationStrength: 73,
    },
  },
  {
    id: 'ev-035', type: 'agent', color: '#9747ff', ts: m(55), announced: false,
    title: 'MarketingOps published Q3 campaign brief', value: '1 brief', sub: 'Marketing · auto-distributed',
    raw: {
      agent: 'MarketingOps', engine: 'Marketing Engine', trigger: 'scheduled',
      startedAt: '2026-06-22T09:10:00Z', completedAt: '2026-06-22T09:12:55Z', duration: '2m 55s',
      result: 'success', actionsPerformed: 1,
      entitiesAffected: ['Q3 Campaign Brief', 'Marketing Team (4)', 'LinkedIn Channel'],
      findings: 'Q3 campaign brief published to shared drive and distributed to marketing team. Theme: AI-Powered Operations at Enterprise Scale. Launch date: 14 Jul 2026. Budget allocation: £18K.',
      nextScheduledRun: 'Quarterly', approvalRequired: false, logsAvailable: false,
    },
  },
  {
    id: 'ev-036', type: 'kpi', color: '#00c875', ts: m(12), announced: false,
    title: 'Support SLA resolution rate 89%', value: '89%', sub: 'Ops · week to date',
    raw: {
      metric: 'Support SLA Resolution Rate', current: 89, previous: 84, target: 90, unit: '%',
      variance: '+6%', trend: 'improving', period: 'Week to date (Jun 2026)',
      dataSource: 'Support ticketing — Zendesk', sampleSize: 27,
      breakdown: { 'P1 (resolved <4h)': '100%', 'P2 (resolved <8h)': '91%', 'P3 (resolved <2d)': '84%' },
      insight: 'P3 tickets dragging overall rate — 4 tickets aged >48h. Backlog spike last week is now clearing. On track to hit 90% target by end of week.',
    },
  },
]

async function main() {
  console.log(`Seeding ${events.length} WAANDA events with rich raw data...`)
  let upserted = 0
  for (const ev of events) {
    await prisma.waandaEvent.upsert({
      where:  { id: ev.id },
      update: { raw: ev.raw },
      create: {
        id: ev.id, type: ev.type, title: ev.title,
        value: ev.value ?? null, sub: ev.sub ?? null,
        color: ev.color, ts: BigInt(Math.round(ev.ts)),
        announced: ev.announced, raw: ev.raw,
      },
    })
    upserted++
  }
  console.log(`✓ Upserted ${upserted} events`)
  const count = await prisma.waandaEvent.count()
  console.log(`✓ Total waanda_events rows: ${count}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
