import type { TeamMember, Allocation } from './types'

export const TEAM: TeamMember[] = [
  {
    id: 'm1', name: 'Mahesh Kumar',  role: 'CEO / Lead Architect',    department: 'Engineering',
    email: 'mahesh@kangqore.com',   location: 'London, UK',
    skills: ['Strategy', 'Architecture', 'React', 'Node.js', 'AI/ML'],
    status: 'active',    utilization: 88, availability: 40, billableRate: 250,
    projectIds: ['pj1','pj2','pj4','pj6'], joinDate: '2023-01-01',
  },
  {
    id: 'm2', name: 'Anika Roy',     role: 'Head of Design',           department: 'Design',
    email: 'anika@kangqore.com',    location: 'London, UK',
    skills: ['Figma', 'UX Research', 'Design Systems', 'Prototyping'],
    status: 'active',    utilization: 75, availability: 40, billableRate: 185,
    projectIds: ['pj1','pj3','pj5'], joinDate: '2023-03-15',
  },
  {
    id: 'm3', name: 'Dev Patel',     role: 'Senior Full-Stack Engineer', department: 'Engineering',
    email: 'dev@kangqore.com',      location: 'Manchester, UK',
    skills: ['TypeScript', 'React', 'Python', 'PostgreSQL', 'Docker'],
    status: 'active',    utilization: 95, availability: 40, billableRate: 195,
    projectIds: ['pj1','pj2','pj4'], joinDate: '2023-06-01',
  },
  {
    id: 'm4', name: 'Priya Sharma',  role: 'Product Manager',          department: 'Product',
    email: 'priya@kangqore.com',    location: 'Birmingham, UK',
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'JIRA', 'Analytics'],
    status: 'active',    utilization: 82, availability: 40, billableRate: 170,
    projectIds: ['pj4','pj5','pj8'], joinDate: '2023-09-01',
  },
  {
    id: 'm5', name: 'Ravi Nair',     role: 'AI/ML Engineer',           department: 'Engineering',
    email: 'ravi@kangqore.com',     location: 'Remote (India)',
    skills: ['Python', 'LangChain', 'Pinecone', 'FastAPI', 'RAG', 'ML'],
    status: 'active',    utilization: 100, availability: 40, billableRate: 160,
    projectIds: ['pj2','pj3','pj5'], joinDate: '2024-01-15',
  },
  {
    id: 'm6', name: 'Sofia Mendez',  role: 'Business Development Manager', department: 'Sales',
    email: 'sofia@kangqore.com',    location: 'London, UK',
    skills: ['CRM', 'B2B Sales', 'Proposal Writing', 'Negotiation'],
    status: 'active',    utilization: 65, availability: 40, billableRate: 145,
    projectIds: ['pj6'], joinDate: '2024-03-01',
  },
  {
    id: 'm7', name: 'James Okafor',  role: 'DevOps / Infrastructure',  department: 'Engineering',
    email: 'james@kangqore.com',    location: 'London, UK',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Monitoring'],
    status: 'part-time', utilization: 50, availability: 20, billableRate: 175,
    projectIds: ['pj2'], joinDate: '2024-06-01',
  },
  {
    id: 'm8', name: 'Nina Tan',      role: 'Finance & Operations',     department: 'Finance',
    email: 'nina@kangqore.com',     location: 'Singapore',
    skills: ['Financial Modelling', 'Excel', 'Xero', 'Reporting'],
    status: 'active',    utilization: 40, availability: 40, billableRate: 120,
    projectIds: ['pj5'], joinDate: '2024-08-01',
  },
]

export const ALLOCATIONS: Allocation[] = [
  { id: 'a1',  memberId: 'm1', memberName: 'Mahesh Kumar',  projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 8,  startDate: '2026-01-10', endDate: '2026-07-31', allocationPct: 20 },
  { id: 'a2',  memberId: 'm1', memberName: 'Mahesh Kumar',  projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 10, startDate: '2025-11-01', endDate: '2026-06-30', allocationPct: 25 },
  { id: 'a3',  memberId: 'm1', memberName: 'Mahesh Kumar',  projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 16, startDate: '2026-03-01', endDate: '2026-10-31', allocationPct: 40 },
  { id: 'a4',  memberId: 'm2', memberName: 'Anika Roy',     projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 16, startDate: '2026-01-10', endDate: '2026-07-31', allocationPct: 40 },
  { id: 'a5',  memberId: 'm2', memberName: 'Anika Roy',     projectId: 'pj3', projectName: 'Nexus Partner Portal',     projectColor: '#059669', hoursPerWeek: 12, startDate: '2026-02-15', endDate: '2026-05-31', allocationPct: 30 },
  { id: 'a6',  memberId: 'm3', memberName: 'Dev Patel',     projectId: 'pj1', projectName: 'Alpha CRM Platform',      projectColor: '#2564ea', hoursPerWeek: 20, startDate: '2026-01-10', endDate: '2026-07-31', allocationPct: 50 },
  { id: 'a7',  memberId: 'm3', memberName: 'Dev Patel',     projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 12, startDate: '2025-11-01', endDate: '2026-06-30', allocationPct: 30 },
  { id: 'a8',  memberId: 'm3', memberName: 'Dev Patel',     projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 6,  startDate: '2026-03-01', endDate: '2026-10-31', allocationPct: 15 },
  { id: 'a9',  memberId: 'm4', memberName: 'Priya Sharma',  projectId: 'pj4', projectName: 'Kangqore OS Dashboard',    projectColor: '#2564ea', hoursPerWeek: 16, startDate: '2026-03-01', endDate: '2026-10-31', allocationPct: 40 },
  { id: 'a10', memberId: 'm4', memberName: 'Priya Sharma',  projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 16, startDate: '2026-03-15', endDate: '2026-08-15', allocationPct: 40 },
  { id: 'a11', memberId: 'm5', memberName: 'Ravi Nair',     projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 24, startDate: '2025-11-01', endDate: '2026-06-30', allocationPct: 60 },
  { id: 'a12', memberId: 'm5', memberName: 'Ravi Nair',     projectId: 'pj3', projectName: 'Nexus Partner Portal',     projectColor: '#059669', hoursPerWeek: 8,  startDate: '2026-02-15', endDate: '2026-05-31', allocationPct: 20 },
  { id: 'a13', memberId: 'm5', memberName: 'Ravi Nair',     projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 8,  startDate: '2026-03-15', endDate: '2026-08-15', allocationPct: 20 },
  { id: 'a14', memberId: 'm6', memberName: 'Sofia Mendez',  projectId: 'pj6', projectName: 'GlobeMed Patient Portal',  projectColor: '#dc2626', hoursPerWeek: 10, startDate: '2026-06-01', endDate: '2026-12-31', allocationPct: 25 },
  { id: 'a15', memberId: 'm7', memberName: 'James Okafor',  projectId: 'pj2', projectName: 'eQORE v2 Rebuild',         projectColor: '#2563eb', hoursPerWeek: 16, startDate: '2025-11-01', endDate: '2026-06-30', allocationPct: 80 },
  { id: 'a16', memberId: 'm8', memberName: 'Nina Tan',      projectId: 'pj5', projectName: 'FinTrack Analytics Suite', projectColor: '#d97706', hoursPerWeek: 16, startDate: '2026-03-15', endDate: '2026-08-15', allocationPct: 40 },
]

export const UTIL_HISTORY = [
  { week: 'W18', 'm1': 88, 'm2': 70, 'm3': 90, 'm4': 75, 'm5': 100, 'm6': 60, 'm7': 50, 'm8': 35 },
  { week: 'W19', 'm1': 85, 'm2': 72, 'm3': 95, 'm4': 80, 'm5': 100, 'm6': 62, 'm7': 48, 'm8': 38 },
  { week: 'W20', 'm1': 90, 'm2': 75, 'm3': 95, 'm4': 82, 'm5': 100, 'm6': 65, 'm7': 50, 'm8': 40 },
  { week: 'W21', 'm1': 88, 'm2': 75, 'm3': 95, 'm4': 82, 'm5': 100, 'm6': 65, 'm7': 50, 'm8': 40 },
]
