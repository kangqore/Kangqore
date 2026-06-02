// Seed script for Departments, OrgNodes, DeptBudgets, Campaigns, ContentPieces, MarketingMetrics.
// Run: npx ts-node --skip-project prisma/seedDepartmentsMarketing.ts
// Idempotent — safe to re-run; upserts on fixed IDs.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding departments and marketing data…')

  // ─── Departments ────────────────────────────────────────────────────────────
  const depts = [
    { id: 'd1', name: 'Engineering',      head: 'Dev Patel',      headTitle: 'CTO',              status: 'scaling', headcount: 6,  openRoles: 2, budget: 620, spent: 285, budgetStatus: 'on-track', costCenter: 'CC-ENG', description: 'Full-stack product engineering, infrastructure, and AI/ML platform.', tags: ['product','platform','ai'],       kpis: [{ metric: 'Sprint velocity', value: '42 pts/sprint', trend: 'up' },{ metric: 'Deploy frequency', value: '4.2/week', trend: 'up' },{ metric: 'Bug backlog', value: '18 open', trend: 'down' }] },
    { id: 'd2', name: 'Design & Product', head: 'Anika Roy',      headTitle: 'Head of Product',  status: 'active',  headcount: 3,  openRoles: 1, budget: 220, spent: 98,  budgetStatus: 'on-track', costCenter: 'CC-PRD', description: 'Product strategy, UX design, and design system ownership.',                tags: ['ux','design-system','product-strategy'], kpis: [{ metric: 'Features shipped', value: '8 this quarter', trend: 'up' },{ metric: 'Design debt tickets', value: '12 open', trend: 'neutral' },{ metric: 'User feedback score', value: '4.3 / 5', trend: 'up' }] },
    { id: 'd3', name: 'Sales & GTM',      head: 'Sofia Mendez',   headTitle: 'Head of Sales',    status: 'scaling', headcount: 3,  openRoles: 1, budget: 310, spent: 160, budgetStatus: 'at-risk',  costCenter: 'CC-SAL', description: 'Pipeline development, AE coverage, and go-to-market execution.',      tags: ['pipeline','outbound','enterprise'],       kpis: [{ metric: 'Pipeline value', value: '£1.43M', trend: 'up' },{ metric: 'Deals closed (QTD)', value: '3', trend: 'up' },{ metric: 'Average sales cycle', value: '47 days', trend: 'neutral' }] },
    { id: 'd4', name: 'Client Delivery',  head: 'Ravi Nair',      headTitle: 'Head of Delivery', status: 'active',  headcount: 4,  openRoles: 0, budget: 280, spent: 130, budgetStatus: 'on-track', costCenter: 'CC-DEL', description: 'Client project delivery, SLAs, and account management.',              tags: ['delivery','sla','account-management'],    kpis: [{ metric: 'On-time delivery', value: '91%', trend: 'up' },{ metric: 'NPS (client)', value: '72', trend: 'up' },{ metric: 'Active projects', value: '6', trend: 'neutral' }] },
    { id: 'd5', name: 'Finance & Ops',    head: 'Mahesh Kumar',   headTitle: 'CEO / CFO',        status: 'active',  headcount: 2,  openRoles: 0, budget: 120, spent: 54,  budgetStatus: 'under',    costCenter: 'CC-FIN', description: 'Financial reporting, cash management, legal, and company operations.', tags: ['finance','legal','ops'],                  kpis: [{ metric: 'Runway', value: '16 months', trend: 'neutral' },{ metric: 'Cash burn / month', value: '£57k', trend: 'neutral' },{ metric: 'AR outstanding', value: '£145k', trend: 'down' }] },
  ]

  for (const d of depts) {
    await prisma.department.upsert({ where: { id: d.id }, update: d, create: d })
  }

  // ─── OrgNodes ───────────────────────────────────────────────────────────────
  const nodes = [
    { id: 'o1',  name: 'Mahesh Kumar',  title: 'CEO',               deptName: 'Finance & Ops',   departmentId: 'd5', level: 0 },
    { id: 'o2',  name: 'Dev Patel',     title: 'CTO',               deptName: 'Engineering',     departmentId: 'd1', level: 1, reportsTo: 'o1', headcount: 6 },
    { id: 'o3',  name: 'Anika Roy',     title: 'Head of Product',   deptName: 'Design & Product',departmentId: 'd2', level: 1, reportsTo: 'o1', headcount: 3 },
    { id: 'o4',  name: 'Sofia Mendez',  title: 'Head of Sales',     deptName: 'Sales & GTM',     departmentId: 'd3', level: 1, reportsTo: 'o1', headcount: 3 },
    { id: 'o5',  name: 'Ravi Nair',     title: 'Head of Delivery',  deptName: 'Client Delivery', departmentId: 'd4', level: 1, reportsTo: 'o1', headcount: 4 },
    { id: 'o6',  name: 'Priya Chen',    title: 'Senior Engineer',   deptName: 'Engineering',     departmentId: 'd1', level: 2, reportsTo: 'o2' },
    { id: 'o7',  name: 'Jake Morton',   title: 'Backend Engineer',  deptName: 'Engineering',     departmentId: 'd1', level: 2, reportsTo: 'o2' },
    { id: 'o8',  name: 'Sara Lin',      title: 'Frontend Engineer', deptName: 'Engineering',     departmentId: 'd1', level: 2, reportsTo: 'o2' },
    { id: 'o9',  name: 'Tom Hughes',    title: 'DevOps Engineer',   deptName: 'Engineering',     departmentId: 'd1', level: 2, reportsTo: 'o2' },
    { id: 'o10', name: 'Leila Amara',   title: 'Product Designer',  deptName: 'Design & Product',departmentId: 'd2', level: 2, reportsTo: 'o3' },
    { id: 'o11', name: 'Chris Ward',    title: 'AE — Enterprise',   deptName: 'Sales & GTM',     departmentId: 'd3', level: 2, reportsTo: 'o4' },
    { id: 'o12', name: 'Natasha Bloom', title: 'SDR',               deptName: 'Sales & GTM',     departmentId: 'd3', level: 3, reportsTo: 'o4' },
    { id: 'o13', name: 'Omar Khalid',   title: 'Delivery Lead',     deptName: 'Client Delivery', departmentId: 'd4', level: 2, reportsTo: 'o5' },
    { id: 'o14', name: 'Amy Tan',       title: 'QA Engineer',       deptName: 'Client Delivery', departmentId: 'd4', level: 3, reportsTo: 'o5' },
  ]

  for (const n of nodes) {
    await prisma.orgNode.upsert({ where: { id: n.id }, update: n, create: n })
  }

  // ─── DeptBudgets ─────────────────────────────────────────────────────────────
  const budgets = [
    { id: 'db1', departmentId: 'd1', annual: 620, q1: 155, q1Spent: 148, q2: 155, q2Spent: 137, q3: 155, q3Budget: 155, q4: 155, q4Budget: 155, categories: [{ name: 'Salaries', budget: 480, spent: 220 },{ name: 'Cloud / Infra', budget: 72, spent: 38 },{ name: 'Tools & Licences', budget: 38, spent: 18 },{ name: 'Training', budget: 30, spent: 9 }] },
    { id: 'db2', departmentId: 'd2', annual: 220, q1: 55,  q1Spent: 51,  q2: 55,  q2Spent: 47,  q3: 55,  q3Budget: 55,  q4: 55,  q4Budget: 55,  categories: [{ name: 'Salaries', budget: 180, spent: 83 },{ name: 'Design Tools', budget: 22, spent: 9 },{ name: 'User Research', budget: 18, spent: 6 }] },
    { id: 'db3', departmentId: 'd3', annual: 310, q1: 78,  q1Spent: 82,  q2: 78,  q2Spent: 78,  q3: 77,  q3Budget: 77,  q4: 77,  q4Budget: 77,  categories: [{ name: 'Salaries & OTE', budget: 220, spent: 108 },{ name: 'Marketing Spend', budget: 50, spent: 34 },{ name: 'Travel & Events', budget: 25, spent: 15 },{ name: 'CRM & Tools', budget: 15, spent: 3 }] },
    { id: 'db4', departmentId: 'd4', annual: 280, q1: 70,  q1Spent: 66,  q2: 70,  q2Spent: 64,  q3: 70,  q3Budget: 70,  q4: 70,  q4Budget: 70,  categories: [{ name: 'Salaries', budget: 240, spent: 112 },{ name: 'Subcontractors', budget: 30, spent: 16 },{ name: 'Tools', budget: 10, spent: 2 }] },
  ]

  for (const b of budgets) {
    await prisma.deptBudget.upsert({ where: { id: b.id }, update: b, create: b })
  }

  // ─── Campaigns ───────────────────────────────────────────────────────────────
  const campaigns = [
    { id: 'c1', name: 'LinkedIn Thought Leadership',  channel: 'linkedin',     status: 'active',    startDate: new Date('2026-04-01'), budget: 2500, spent: 1200, impressions: 48200, clicks: 1840, leads: 12, mqls: 7,  sqls: 3, revenue: 245000, owner: 'Sofia Mendez', description: 'CEO and CTO thought leadership posts. Case study amplification.',                    tags: ['brand','awareness','b2b'] },
    { id: 'c2', name: 'Healthcare Vertical Campaign', channel: 'content',      status: 'active',    startDate: new Date('2026-03-15'), budget: 4000, spent: 2600, impressions: 22400, clicks: 890,  leads: 18, mqls: 11, sqls: 5, revenue: 420000, owner: 'Anika Roy',    description: 'Whitepapers, case studies and targeted content for healthcare decision-makers.',      tags: ['healthcare','vertical','content'] },
    { id: 'c3', name: 'Google Ads — Enterprise SaaS', channel: 'paid-search',  status: 'active',    startDate: new Date('2026-05-01'), budget: 3000, spent: 1450, impressions: 31600, clicks: 720,  leads: 9,  mqls: 4,  sqls: 2, revenue: 175000, owner: 'Sofia Mendez', description: 'Paid search targeting enterprise software decision-makers in UK & EU.',               tags: ['paid','saas','uk-eu'] },
    { id: 'c4', name: 'HealthTech Europe Event',      channel: 'event',        status: 'completed', startDate: new Date('2026-05-14'), endDate: new Date('2026-05-15'), budget: 3500, spent: 3480, impressions: 1200, clicks: 0, leads: 4, mqls: 2, sqls: 1, revenue: 120000, owner: 'Mahesh Kumar', description: 'Sponsorship and speaking slot at HealthTech Europe, Stockholm.',             tags: ['event','healthcare','eu'] },
    { id: 'c5', name: 'Partner Referral Programme',   channel: 'partner',      status: 'active',    startDate: new Date('2026-02-01'), budget: 5000, spent: 1800, impressions: 0,     clicks: 0,    leads: 7,  mqls: 6,  sqls: 4, revenue: 635000, owner: 'Ravi Nair',    description: 'Referral incentive programme for existing clients and delivery partners.',             tags: ['referral','partner','high-roi'] },
    { id: 'c6', name: 'Q3 Fintech Campaign',          channel: 'content',      status: 'scheduled', startDate: new Date('2026-07-01'), budget: 4500, spent: 0,    impressions: 0,     clicks: 0,    leads: 0,  mqls: 0,  sqls: 0, revenue: 0,      owner: 'Anika Roy',    description: 'Content campaign targeting CFOs and CDOs in financial services.',                     tags: ['fintech','q3','planned'] },
  ]

  for (const c of campaigns) {
    await prisma.campaign.upsert({ where: { id: c.id }, update: c, create: c })
  }

  // ─── ContentPieces ───────────────────────────────────────────────────────────
  const content = [
    { id: 'cp1', title: 'How Kangqore helped GlobeMed cut onboarding time by 60%',  type: 'case-study',  status: 'published', publishDate: new Date('2026-04-15'), author: 'Anika Roy',     views: 2840, leads: 8,  tags: ['healthcare','case-study'] },
    { id: 'cp2', title: 'Building HIPAA-compliant patient portals: a technical guide', type: 'whitepaper', status: 'published', publishDate: new Date('2026-03-28'), author: 'Dev Patel',     views: 1920, leads: 14, tags: ['healthcare','technical','compliance'] },
    { id: 'cp3', title: 'The AI-driven CRM: why intent scoring changes everything',   type: 'blog',        status: 'published', publishDate: new Date('2026-05-10'), author: 'Mahesh Kumar',  views: 3450, leads: 6,  tags: ['crm','ai','thought-leadership'] },
    { id: 'cp4', title: 'Kangqore OS: from strategy to delivery in one platform',    type: 'video',       status: 'published', publishDate: new Date('2026-04-28'), author: 'Anika Roy',     views: 1240, leads: 3,  tags: ['product','demo'] },
    { id: 'cp5', title: 'Investor reporting automation: 3 hours to 10 minutes',      type: 'blog',        status: 'published', publishDate: new Date('2026-05-20'), author: 'Mahesh Kumar',  views: 2100, leads: 5,  tags: ['finance','automation'] },
    { id: 'cp6', title: 'Fintech compliance dashboard — product launch webinar',      type: 'webinar',     status: 'scheduled', publishDate: new Date('2026-06-18'), author: 'Dev Patel',     views: 0,    leads: 0,  tags: ['fintech','webinar','upcoming'] },
    { id: 'cp7', title: 'Q3 Fintech Decision-Maker Research Report',                 type: 'whitepaper',  status: 'draft',     author: 'Anika Roy',     views: 0, leads: 0, tags: ['fintech','research','q3'] },
  ]

  for (const p of content) {
    await prisma.contentPiece.upsert({ where: { id: p.id }, update: p, create: p })
  }

  // ─── MarketingMetrics ─────────────────────────────────────────────────────────
  const metrics = [
    { id: 'mm1', month: 'Jan 2026', spend: 4200, mqls: 8,  sqls: 3, websiteVisits: 3400, conversionRate: 2.1, cpl: 525, cac: 14000 },
    { id: 'mm2', month: 'Feb 2026', spend: 5100, mqls: 11, sqls: 4, websiteVisits: 4200, conversionRate: 2.4, cpl: 464, cac: 12750 },
    { id: 'mm3', month: 'Mar 2026', spend: 6200, mqls: 14, sqls: 5, websiteVisits: 5100, conversionRate: 2.7, cpl: 443, cac: 12400 },
    { id: 'mm4', month: 'Apr 2026', spend: 7400, mqls: 18, sqls: 7, websiteVisits: 6300, conversionRate: 2.9, cpl: 411, cac: 10571 },
    { id: 'mm5', month: 'May 2026', spend: 8100, mqls: 22, sqls: 8, websiteVisits: 7200, conversionRate: 3.1, cpl: 368, cac: 10125 },
  ]

  for (const m of metrics) {
    await prisma.marketingMetric.upsert({ where: { id: m.id }, update: m, create: m })
  }

  console.log('Done — departments and marketing seeded.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
