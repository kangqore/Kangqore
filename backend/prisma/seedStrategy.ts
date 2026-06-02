// Seed script for Strategy (pillars, objectives, key results, programs)
// and Resources (staff members, allocations).
//
// Run: npx ts-node --skip-project prisma/seedStrategy.ts
// Data is idempotent — safe to re-run; upserts on fixed IDs.

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding strategy and resources data…')

  // ─── Strategic Pillars ─────────────────────────────────────────────────────
  const pillars = [
    { id: 'p1', name: 'Market Expansion',       color: '#2564ea', owner: 'Mahesh Kumar',  health: 'on-track', budget: 850000, spent: 420000, description: 'Scale into new verticals and geographies through targeted client acquisition and partner networks.' },
    { id: 'p2', name: 'Product Excellence',     color: '#2563eb', owner: 'Anika Roy',     health: 'at-risk',  budget: 620000, spent: 390000, description: 'Deliver flagship-tier products across all service lines with measurable quality benchmarks.' },
    { id: 'p3', name: 'Operational Efficiency', color: '#059669', owner: 'Dev Patel',     health: 'on-track', budget: 410000, spent: 180000, description: 'Reduce delivery cost and cycle time through automation, KIMMP intelligence, and lean workflows.' },
    { id: 'p4', name: 'Talent & Culture',       color: '#d97706', owner: 'Priya Sharma',  health: 'behind',   budget: 280000, spent: 210000, description: 'Build a high-performance team with clear career paths, strong culture, and competitive compensation.' },
    { id: 'p5', name: 'Innovation & IP',        color: '#dc2626', owner: 'Ravi Nair',     health: 'on-track', budget: 500000, spent: 195000, description: 'Invest in proprietary technology, KIMMP capabilities, and defensible intellectual property.' },
  ]

  for (const p of pillars) {
    await prisma.strategicPillar.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    })
  }

  // ─── Strategic Objectives + Key Results ───────────────────────────────────
  const objectives = [
    {
      id: 'o1', pillarId: 'p1', quarter: 'Q2 2026', owner: 'Mahesh Kumar', status: 'on-track', progress: 52,
      title: 'Establish presence in 3 new international markets',
      description: 'Open offices or signed partners in SG, MY, and one GCC country.',
      keyResults: [
        { id: 'kr1', title: 'Signed partner agreements',      current: 6,      target: 12,      unit: 'partners', status: 'on-track' },
        { id: 'kr2', title: 'Revenue from new markets',       current: 185000, target: 400000,  unit: '$',        status: 'at-risk'  },
        { id: 'kr3', title: 'Inbound leads from new regions', current: 38,     target: 60,      unit: 'leads',    status: 'on-track' },
      ],
    },
    {
      id: 'o2', pillarId: 'p1', quarter: 'Q2 2026', owner: 'Anika Roy', status: 'at-risk', progress: 41,
      title: 'Grow pipeline to £2M ARR equivalent',
      description: 'Qualified sales pipeline sufficient to support 2x growth.',
      keyResults: [
        { id: 'kr4', title: 'Qualified pipeline value',      current: 820000, target: 2000000, unit: '£',     status: 'at-risk' },
        { id: 'kr5', title: 'Enterprise deals in late-stage',current: 3,      target: 8,       unit: 'deals', status: 'behind'  },
      ],
    },
    {
      id: 'o3', pillarId: 'p2', quarter: 'Q2 2026', owner: 'Ravi Nair', status: 'at-risk', progress: 67,
      title: 'Ship eQORE v2 with 95% uptime SLA',
      description: 'Complete eQORE rebuild with lead scoring and RAG capabilities.',
      keyResults: [
        { id: 'kr6', title: 'Feature completion vs spec', current: 67, target: 100, unit: '%',    status: 'at-risk'  },
        { id: 'kr7', title: 'P0 bugs resolved',           current: 18, target: 22,  unit: 'bugs', status: 'on-track' },
        { id: 'kr8', title: 'Test coverage',              current: 74, target: 90,  unit: '%',    status: 'on-track' },
      ],
    },
    {
      id: 'o4', pillarId: 'p3', quarter: 'Q2 2026', owner: 'Dev Patel', status: 'on-track', progress: 58,
      title: 'Reduce delivery cycle time by 30%',
      description: 'Automate handoffs and reduce average project cycle time.',
      keyResults: [
        { id: 'kr9',  title: 'Avg cycle time (days)',          current: 28, target: 21, unit: 'days',      status: 'on-track' },
        { id: 'kr10', title: 'Automated workflows deployed',   current: 7,  target: 12, unit: 'workflows', status: 'on-track' },
      ],
    },
    {
      id: 'o5', pillarId: 'p4', quarter: 'Q2 2026', owner: 'Priya Sharma', status: 'behind', progress: 30,
      title: 'Hire 10 key roles by end of Q2',
      description: 'Fill critical gaps across engineering, BD, and delivery.',
      keyResults: [
        { id: 'kr11', title: 'Roles filled',             current: 3,  target: 10, unit: 'hires', status: 'behind' },
        { id: 'kr12', title: 'Avg time-to-hire (days)',  current: 42, target: 30, unit: 'days',  status: 'behind' },
      ],
    },
    {
      id: 'o6', pillarId: 'p5', quarter: 'Q2 2026', owner: 'Ravi Nair', status: 'on-track', progress: 80,
      title: 'File 2 patents and complete KIMMP Phase 3–5',
      description: 'Protect core IP and advance KIMMP to production-grade intelligence.',
      keyResults: [
        { id: 'kr13', title: 'Patent applications filed', current: 1, target: 2, unit: 'patents', status: 'at-risk'   },
        { id: 'kr14', title: 'KIMMP phases completed',    current: 5, target: 5, unit: 'phases',  status: 'completed' },
      ],
    },
  ]

  for (const obj of objectives) {
    const { keyResults, ...objData } = obj
    await prisma.strategicObjective.upsert({
      where: { id: obj.id },
      update: { ...objData },
      create: { ...objData },
    })
    for (const kr of keyResults) {
      await prisma.keyResult.upsert({
        where: { id: kr.id },
        update: { ...kr, objectiveId: obj.id },
        create: { ...kr, objectiveId: obj.id },
      })
    }
  }

  // ─── Strategic Programs ────────────────────────────────────────────────────
  const programs = [
    { id: 'pr1',  pillarId: 'p1', name: 'Southeast Asia Entry',       status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 220000, spent: 95000,  progress: 43, teamSize: 6,  startDate: new Date('2026-01-15'), endDate: new Date('2026-09-30'), description: 'Launch Kangqore services in SG, MY, ID markets.' },
    { id: 'pr2',  pillarId: 'p1', name: 'Enterprise Sales Program',   status: 'active',    health: 'on-track', owner: 'Anika Roy',     budget: 180000, spent: 110000, progress: 61, teamSize: 4,  startDate: new Date('2026-02-01'), endDate: new Date('2026-07-31'), description: 'Build dedicated enterprise sales motion and playbook.' },
    { id: 'pr3',  pillarId: 'p1', name: 'Partner Network Expansion',  status: 'active',    health: 'at-risk',  owner: 'Dev Patel',     budget: 260000, spent: 140000, progress: 38, teamSize: 3,  startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), description: 'Onboard 20 certified delivery partners globally.' },
    { id: 'pr4',  pillarId: 'p1', name: 'Brand & Demand Gen',         status: 'planned',   health: 'on-track', owner: 'Priya Sharma',  budget: 190000, spent: 75000,  progress: 25, teamSize: 5,  startDate: new Date('2026-04-01'), endDate: new Date('2026-12-31'), description: 'Increase inbound pipeline through content and SEO.' },
    { id: 'pr5',  pillarId: 'p2', name: 'eQORE v2 Platform',          status: 'active',    health: 'at-risk',  owner: 'Ravi Nair',     budget: 310000, spent: 240000, progress: 72, teamSize: 8,  startDate: new Date('2025-11-01'), endDate: new Date('2026-06-30'), description: 'Rebuild eQORE with lead scoring, RAG, and real-time sync.' },
    { id: 'pr6',  pillarId: 'p2', name: 'Client Portal Rebuild',      status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 180000, spent: 95000,  progress: 55, teamSize: 5,  startDate: new Date('2026-03-01'), endDate: new Date('2026-10-31'), description: 'Redesign all 5 portals as unified Company OS.' },
    { id: 'pr7',  pillarId: 'p2', name: 'QA & Delivery Standards',    status: 'planned',   health: 'on-track', owner: 'Anika Roy',     budget: 130000, spent: 55000,  progress: 18, teamSize: 3,  startDate: new Date('2026-05-01'), endDate: new Date('2026-12-31'), description: 'Define and enforce quality gates across all services.' },
    { id: 'pr8',  pillarId: 'p3', name: 'KIMMP Full Rollout',         status: 'active',    health: 'on-track', owner: 'Ravi Nair',     budget: 160000, spent: 72000,  progress: 48, teamSize: 4,  startDate: new Date('2026-02-15'), endDate: new Date('2026-09-30'), description: 'Deploy KIMMP signal engine across all business units.' },
    { id: 'pr9',  pillarId: 'p3', name: 'Workflow Automation Suite',  status: 'planned',   health: 'on-track', owner: 'Dev Patel',     budget: 140000, spent: 60000,  progress: 20, teamSize: 3,  startDate: new Date('2026-06-01'), endDate: new Date('2026-12-31'), description: 'Automate repetitive ops tasks with trigger-based rules.' },
    { id: 'pr10', pillarId: 'p3', name: 'Finance & Billing Ops',      status: 'active',    health: 'on-track', owner: 'Priya Sharma',  budget: 110000, spent: 48000,  progress: 35, teamSize: 2,  startDate: new Date('2026-03-01'), endDate: new Date('2026-08-31'), description: 'Centralize invoicing, burn tracking, and cash flow.' },
    { id: 'pr11', pillarId: 'p4', name: 'Hiring Plan 2026',           status: 'active',    health: 'behind',   owner: 'Priya Sharma',  budget: 160000, spent: 140000, progress: 28, teamSize: 2,  startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), description: 'Recruit 18 key roles across engineering, sales, ops.' },
    { id: 'pr12', pillarId: 'p4', name: 'L&D and Career Tracks',      status: 'planned',   health: 'at-risk',  owner: 'Anika Roy',     budget: 120000, spent: 70000,  progress: 15, teamSize: 2,  startDate: new Date('2026-05-01'), endDate: new Date('2026-12-31'), description: 'Build learning paths and promotion criteria for all roles.' },
    { id: 'pr13', pillarId: 'p5', name: 'KIMMP Phase 3–5',            status: 'completed', health: 'completed',owner: 'Ravi Nair',     budget: 200000, spent: 198000, progress: 100,teamSize: 5,  startDate: new Date('2025-09-01'), endDate: new Date('2026-03-31'), description: 'Advance KIMMP to predictive intelligence and governance.' },
    { id: 'pr14', pillarId: 'p5', name: 'IP Portfolio & Patents',     status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 300000, spent: 97000,  progress: 30, teamSize: 2,  startDate: new Date('2026-04-01'), endDate: new Date('2026-12-31'), description: 'File patents for KIMMP signal engine and eQORE RAG.' },
  ]

  for (const p of programs) {
    await prisma.strategicProgram.upsert({ where: { id: p.id }, update: p, create: p })
  }

  // ─── Staff Members ─────────────────────────────────────────────────────────
  const staff = [
    { id: 'm1', name: 'Mahesh Kumar',  role: 'CEO / Lead Architect',         department: 'Engineering', email: 'mahesh@kangqore.com', location: 'London, UK',       skills: ['Strategy','Architecture','React','Node.js','AI/ML'],               status: 'active',    utilization: 88,  availability: 40, billableRate: 250, joinDate: new Date('2023-01-01') },
    { id: 'm2', name: 'Anika Roy',     role: 'Head of Design',               department: 'Design',      email: 'anika@kangqore.com',  location: 'London, UK',       skills: ['Figma','UX Research','Design Systems','Prototyping'],              status: 'active',    utilization: 75,  availability: 40, billableRate: 185, joinDate: new Date('2023-03-15') },
    { id: 'm3', name: 'Dev Patel',     role: 'Senior Full-Stack Engineer',   department: 'Engineering', email: 'dev@kangqore.com',    location: 'Manchester, UK',   skills: ['TypeScript','React','Python','PostgreSQL','Docker'],               status: 'active',    utilization: 95,  availability: 40, billableRate: 195, joinDate: new Date('2023-06-01') },
    { id: 'm4', name: 'Priya Sharma',  role: 'Product Manager',             department: 'Product',     email: 'priya@kangqore.com',  location: 'Birmingham, UK',   skills: ['Product Strategy','Roadmapping','Agile','JIRA','Analytics'],       status: 'active',    utilization: 82,  availability: 40, billableRate: 170, joinDate: new Date('2023-09-01') },
    { id: 'm5', name: 'Ravi Nair',     role: 'AI/ML Engineer',              department: 'Engineering', email: 'ravi@kangqore.com',   location: 'Remote (India)',   skills: ['Python','LangChain','Pinecone','FastAPI','RAG','ML'],              status: 'active',    utilization: 100, availability: 40, billableRate: 160, joinDate: new Date('2024-01-15') },
    { id: 'm6', name: 'Sofia Mendez',  role: 'Business Development Manager', department: 'Sales',       email: 'sofia@kangqore.com',  location: 'London, UK',       skills: ['CRM','B2B Sales','Proposal Writing','Negotiation'],               status: 'active',    utilization: 65,  availability: 40, billableRate: 145, joinDate: new Date('2024-03-01') },
    { id: 'm7', name: 'James Okafor',  role: 'DevOps / Infrastructure',      department: 'Engineering', email: 'james@kangqore.com',  location: 'London, UK',       skills: ['AWS','Terraform','Kubernetes','CI/CD','Monitoring'],              status: 'part-time', utilization: 50,  availability: 20, billableRate: 175, joinDate: new Date('2024-06-01') },
    { id: 'm8', name: 'Nina Tan',      role: 'Finance & Operations',         department: 'Finance',     email: 'nina@kangqore.com',   location: 'Singapore',        skills: ['Financial Modelling','Excel','Xero','Reporting'],                 status: 'active',    utilization: 40,  availability: 40, billableRate: 120, joinDate: new Date('2024-08-01') },
  ]

  for (const m of staff) {
    await prisma.staffMember.upsert({ where: { id: m.id }, update: m, create: m })
  }

  // ─── Staff Allocations ─────────────────────────────────────────────────────
  const allocations = [
    { id: 'a1',  memberId: 'm1', projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 8,  allocationPct: 20, startDate: new Date('2026-01-10'), endDate: new Date('2026-07-31') },
    { id: 'a2',  memberId: 'm1', projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 10, allocationPct: 25, startDate: new Date('2025-11-01'), endDate: new Date('2026-06-30') },
    { id: 'a3',  memberId: 'm1', projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 16, allocationPct: 40, startDate: new Date('2026-03-01'), endDate: new Date('2026-10-31') },
    { id: 'a4',  memberId: 'm2', projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 16, allocationPct: 40, startDate: new Date('2026-01-10'), endDate: new Date('2026-07-31') },
    { id: 'a5',  memberId: 'm2', projectId: 'pj3', projectName: 'Nexus Partner Portal',     projectColor: '#059669', hoursPerWeek: 12, allocationPct: 30, startDate: new Date('2026-02-15'), endDate: new Date('2026-05-31') },
    { id: 'a6',  memberId: 'm3', projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 20, allocationPct: 50, startDate: new Date('2026-01-10'), endDate: new Date('2026-07-31') },
    { id: 'a7',  memberId: 'm3', projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 12, allocationPct: 30, startDate: new Date('2025-11-01'), endDate: new Date('2026-06-30') },
    { id: 'a8',  memberId: 'm3', projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 6,  allocationPct: 15, startDate: new Date('2026-03-01'), endDate: new Date('2026-10-31') },
    { id: 'a9',  memberId: 'm4', projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 16, allocationPct: 40, startDate: new Date('2026-03-01'), endDate: new Date('2026-10-31') },
    { id: 'a10', memberId: 'm4', projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 16, allocationPct: 40, startDate: new Date('2026-03-15'), endDate: new Date('2026-08-15') },
    { id: 'a11', memberId: 'm5', projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 24, allocationPct: 60, startDate: new Date('2025-11-01'), endDate: new Date('2026-06-30') },
    { id: 'a12', memberId: 'm5', projectId: 'pj3', projectName: 'Nexus Partner Portal',     projectColor: '#059669', hoursPerWeek: 8,  allocationPct: 20, startDate: new Date('2026-02-15'), endDate: new Date('2026-05-31') },
    { id: 'a13', memberId: 'm5', projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 8,  allocationPct: 20, startDate: new Date('2026-03-15'), endDate: new Date('2026-08-15') },
    { id: 'a14', memberId: 'm6', projectId: 'pj6', projectName: 'GlobeMed Patient Portal',  projectColor: '#dc2626', hoursPerWeek: 10, allocationPct: 25, startDate: new Date('2026-06-01'), endDate: new Date('2026-12-31') },
    { id: 'a15', memberId: 'm7', projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 16, allocationPct: 80, startDate: new Date('2025-11-01'), endDate: new Date('2026-06-30') },
    { id: 'a16', memberId: 'm8', projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 16, allocationPct: 40, startDate: new Date('2026-03-15'), endDate: new Date('2026-08-15') },
  ]

  for (const a of allocations) {
    await prisma.staffAllocation.upsert({ where: { id: a.id }, update: a, create: a })
  }

  console.log('Done — strategy and resources seeded.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
