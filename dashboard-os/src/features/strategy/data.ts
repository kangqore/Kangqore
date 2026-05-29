import type { Pillar, Program, Objective } from './types'

export const PILLARS: Pillar[] = [
  {
    id: 'p1', name: 'Market Expansion', color: '#2564ea',
    description: 'Scale into new verticals and geographies through targeted client acquisition and partner networks.',
    owner: 'Mahesh Kumar', health: 'on-track', programCount: 4, okrCount: 6, budget: 850000, spent: 420000,
  },
  {
    id: 'p2', name: 'Product Excellence', color: '#2563eb',
    description: 'Deliver flagship-tier products across all service lines with measurable quality benchmarks.',
    owner: 'Anika Roy', health: 'at-risk', programCount: 3, okrCount: 5, budget: 620000, spent: 390000,
  },
  {
    id: 'p3', name: 'Operational Efficiency', color: '#059669',
    description: 'Reduce delivery cost and cycle time through automation, KIMMP intelligence, and lean workflows.',
    owner: 'Dev Patel', health: 'on-track', programCount: 3, okrCount: 4, budget: 410000, spent: 180000,
  },
  {
    id: 'p4', name: 'Talent & Culture', color: '#d97706',
    description: 'Build a high-performance team with clear career paths, strong culture, and competitive compensation.',
    owner: 'Priya Sharma', health: 'behind', programCount: 2, okrCount: 3, budget: 280000, spent: 210000,
  },
  {
    id: 'p5', name: 'Innovation & IP', color: '#dc2626',
    description: 'Invest in proprietary technology, KIMMP capabilities, and defensible intellectual property.',
    owner: 'Ravi Nair', health: 'on-track', programCount: 2, okrCount: 4, budget: 500000, spent: 195000,
  },
]

export const PROGRAMS: Program[] = [
  { id: 'pr1',  pillarId: 'p1', pillarName: 'Market Expansion',     pillarColor: '#2564ea', name: 'Southeast Asia Entry',       description: 'Launch Kangqore services in SG, MY, ID markets.',           status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 220000, spent: 95000,  progress: 43, startDate: '2026-01-15', endDate: '2026-09-30', teamSize: 6  },
  { id: 'pr2',  pillarId: 'p1', pillarName: 'Market Expansion',     pillarColor: '#2564ea', name: 'Enterprise Sales Program',   description: 'Build dedicated enterprise sales motion and playbook.',     status: 'active',    health: 'on-track', owner: 'Anika Roy',     budget: 180000, spent: 110000, progress: 61, startDate: '2026-02-01', endDate: '2026-07-31', teamSize: 4  },
  { id: 'pr3',  pillarId: 'p1', pillarName: 'Market Expansion',     pillarColor: '#2564ea', name: 'Partner Network Expansion',  description: 'Onboard 20 certified delivery partners globally.',           status: 'active',    health: 'at-risk',  owner: 'Dev Patel',     budget: 260000, spent: 140000, progress: 38, startDate: '2026-01-01', endDate: '2026-12-31', teamSize: 3  },
  { id: 'pr4',  pillarId: 'p1', pillarName: 'Market Expansion',     pillarColor: '#2564ea', name: 'Brand & Demand Gen',         description: 'Increase inbound pipeline through content and SEO.',        status: 'planned',   health: 'on-track', owner: 'Priya Sharma',  budget: 190000, spent: 75000,  progress: 25, startDate: '2026-04-01', endDate: '2026-12-31', teamSize: 5  },
  { id: 'pr5',  pillarId: 'p2', pillarName: 'Product Excellence',   pillarColor: '#2563eb', name: 'eQORE v2 Platform',          description: 'Rebuild eQORE with lead scoring, RAG, and real-time sync.', status: 'active',    health: 'at-risk',  owner: 'Ravi Nair',     budget: 310000, spent: 240000, progress: 72, startDate: '2025-11-01', endDate: '2026-06-30', teamSize: 8  },
  { id: 'pr6',  pillarId: 'p2', pillarName: 'Product Excellence',   pillarColor: '#2563eb', name: 'Client Portal Rebuild',      description: 'Redesign all 5 portals as unified Company OS.',            status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 180000, spent: 95000,  progress: 55, startDate: '2026-03-01', endDate: '2026-10-31', teamSize: 5  },
  { id: 'pr7',  pillarId: 'p2', pillarName: 'Product Excellence',   pillarColor: '#2563eb', name: 'QA & Delivery Standards',    description: 'Define and enforce quality gates across all services.',     status: 'planned',   health: 'on-track', owner: 'Anika Roy',     budget: 130000, spent: 55000,  progress: 18, startDate: '2026-05-01', endDate: '2026-12-31', teamSize: 3  },
  { id: 'pr8',  pillarId: 'p3', pillarName: 'Operational Efficiency',pillarColor: '#059669', name: 'KIMMP Full Rollout',         description: 'Deploy KIMMP signal engine across all business units.',     status: 'active',    health: 'on-track', owner: 'Ravi Nair',     budget: 160000, spent: 72000,  progress: 48, startDate: '2026-02-15', endDate: '2026-09-30', teamSize: 4  },
  { id: 'pr9',  pillarId: 'p3', pillarName: 'Operational Efficiency',pillarColor: '#059669', name: 'Workflow Automation Suite',  description: 'Automate repetitive ops tasks with trigger-based rules.',   status: 'planned',   health: 'on-track', owner: 'Dev Patel',     budget: 140000, spent: 60000,  progress: 20, startDate: '2026-06-01', endDate: '2026-12-31', teamSize: 3  },
  { id: 'pr10', pillarId: 'p3', pillarName: 'Operational Efficiency',pillarColor: '#059669', name: 'Finance & Billing Ops',      description: 'Centralize invoicing, burn tracking, and cash flow.',      status: 'active',    health: 'on-track', owner: 'Priya Sharma',  budget: 110000, spent: 48000,  progress: 35, startDate: '2026-03-01', endDate: '2026-08-31', teamSize: 2  },
  { id: 'pr11', pillarId: 'p4', pillarName: 'Talent & Culture',     pillarColor: '#d97706', name: 'Hiring Plan 2026',           description: 'Recruit 18 key roles across engineering, sales, ops.',     status: 'active',    health: 'behind',   owner: 'Priya Sharma',  budget: 160000, spent: 140000, progress: 28, startDate: '2026-01-01', endDate: '2026-12-31', teamSize: 2  },
  { id: 'pr12', pillarId: 'p4', pillarName: 'Talent & Culture',     pillarColor: '#d97706', name: 'L&D and Career Tracks',      description: 'Build learning paths and promotion criteria for all roles.',status: 'planned',   health: 'at-risk',  owner: 'Anika Roy',     budget: 120000, spent: 70000,  progress: 15, startDate: '2026-05-01', endDate: '2026-12-31', teamSize: 2  },
  { id: 'pr13', pillarId: 'p5', pillarName: 'Innovation & IP',      pillarColor: '#dc2626', name: 'KIMMP Phase 3–5',            description: 'Advance KIMMP to predictive intelligence and governance.',  status: 'completed', health: 'completed',owner: 'Ravi Nair',     budget: 200000, spent: 198000, progress: 100,startDate: '2025-09-01', endDate: '2026-03-31', teamSize: 5  },
  { id: 'pr14', pillarId: 'p5', pillarName: 'Innovation & IP',      pillarColor: '#dc2626', name: 'IP Portfolio & Patents',     description: 'File patents for KIMMP signal engine and eQORE RAG.',     status: 'active',    health: 'on-track', owner: 'Mahesh Kumar',  budget: 300000, spent: 97000,  progress: 30, startDate: '2026-04-01', endDate: '2026-12-31', teamSize: 2  },
]

export const OBJECTIVES: Objective[] = [
  {
    id: 'o1', pillarId: 'p1', pillarName: 'Market Expansion', pillarColor: '#2564ea',
    quarter: 'Q2 2026', title: 'Establish presence in 3 new international markets',
    description: 'Open offices or signed partners in SG, MY, and one GCC country.',
    owner: 'Mahesh Kumar', status: 'on-track', progress: 52,
    keyResults: [
      { id: 'kr1', objectiveId: 'o1', title: 'Signed partner agreements', current: 6, target: 12, unit: 'partners', progress: 50, status: 'on-track' },
      { id: 'kr2', objectiveId: 'o1', title: 'Revenue from new markets', current: 185000, target: 400000, unit: '$', progress: 46, status: 'at-risk' },
      { id: 'kr3', objectiveId: 'o1', title: 'Inbound leads from new regions', current: 38, target: 60, unit: 'leads', progress: 63, status: 'on-track' },
    ],
  },
  {
    id: 'o2', pillarId: 'p1', pillarName: 'Market Expansion', pillarColor: '#2564ea',
    quarter: 'Q2 2026', title: 'Grow pipeline to £2M ARR equivalent',
    description: 'Qualified sales pipeline sufficient to support 2x growth.',
    owner: 'Anika Roy', status: 'at-risk', progress: 41,
    keyResults: [
      { id: 'kr4', objectiveId: 'o2', title: 'Qualified pipeline value', current: 820000, target: 2000000, unit: '£', progress: 41, status: 'at-risk' },
      { id: 'kr5', objectiveId: 'o2', title: 'Enterprise deals in late-stage', current: 3, target: 8, unit: 'deals', progress: 37, status: 'behind' },
    ],
  },
  {
    id: 'o3', pillarId: 'p2', pillarName: 'Product Excellence', pillarColor: '#2563eb',
    quarter: 'Q2 2026', title: 'Ship eQORE v2 with 95% uptime SLA',
    description: 'Complete eQORE rebuild with lead scoring and RAG capabilities.',
    owner: 'Ravi Nair', status: 'at-risk', progress: 67,
    keyResults: [
      { id: 'kr6', objectiveId: 'o3', title: 'Feature completion vs spec', current: 67, target: 100, unit: '%', progress: 67, status: 'at-risk' },
      { id: 'kr7', objectiveId: 'o3', title: 'P0 bugs resolved', current: 18, target: 22, unit: 'bugs', progress: 82, status: 'on-track' },
      { id: 'kr8', objectiveId: 'o3', title: 'Test coverage', current: 74, target: 90, unit: '%', progress: 82, status: 'on-track' },
    ],
  },
  {
    id: 'o4', pillarId: 'p3', pillarName: 'Operational Efficiency', pillarColor: '#059669',
    quarter: 'Q2 2026', title: 'Reduce delivery cycle time by 30%',
    description: 'Automate handoffs and reduce average project cycle time.',
    owner: 'Dev Patel', status: 'on-track', progress: 58,
    keyResults: [
      { id: 'kr9',  objectiveId: 'o4', title: 'Avg cycle time (days)', current: 28, target: 21, unit: 'days', progress: 58, status: 'on-track' },
      { id: 'kr10', objectiveId: 'o4', title: 'Automated workflows deployed', current: 7, target: 12, unit: 'workflows', progress: 58, status: 'on-track' },
    ],
  },
  {
    id: 'o5', pillarId: 'p4', pillarName: 'Talent & Culture', pillarColor: '#d97706',
    quarter: 'Q2 2026', title: 'Hire 10 key roles by end of Q2',
    description: 'Fill critical gaps across engineering, BD, and delivery.',
    owner: 'Priya Sharma', status: 'behind', progress: 30,
    keyResults: [
      { id: 'kr11', objectiveId: 'o5', title: 'Roles filled', current: 3, target: 10, unit: 'hires', progress: 30, status: 'behind' },
      { id: 'kr12', objectiveId: 'o5', title: 'Avg time-to-hire (days)', current: 42, target: 30, unit: 'days', progress: 28, status: 'behind' },
    ],
  },
  {
    id: 'o6', pillarId: 'p5', pillarName: 'Innovation & IP', pillarColor: '#dc2626',
    quarter: 'Q2 2026', title: 'File 2 patents and complete KIMMP Phase 3–5',
    description: 'Protect core IP and advance KIMMP to production-grade intelligence.',
    owner: 'Ravi Nair', status: 'on-track', progress: 80,
    keyResults: [
      { id: 'kr13', objectiveId: 'o6', title: 'Patent applications filed', current: 1, target: 2, unit: 'patents', progress: 50, status: 'at-risk' },
      { id: 'kr14', objectiveId: 'o6', title: 'KIMMP phases completed', current: 5, target: 5, unit: 'phases', progress: 100, status: 'completed' },
    ],
  },
]
