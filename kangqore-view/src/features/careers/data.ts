import type { JobRole, Candidate } from './types'

export const JOB_ROLES: JobRole[] = [
  {
    id: 'j1', title: 'Senior Backend Engineer', department: 'engineering', type: 'full-time',
    status: 'interview', location: 'London, UK', remote: true,
    salaryMin: 80, salaryMax: 100, postedDate: '2026-05-01', targetStartDate: '2026-06-09',
    hiringManager: 'Dev Patel', applications: 34, inPipeline: 4,
    description: 'Own backend architecture for Kangqore OS. Node.js, PostgreSQL, Redis, AWS.',
    requirements: ['5+ yrs Node.js / TypeScript', 'PostgreSQL + Redis', 'AWS (ECS/RDS/Lambda)', 'RESTful + GraphQL APIs', 'Strong system design'],
    tags: ['backend', 'senior', 'immediate'],
  },
  {
    id: 'j2', title: 'Account Executive (Enterprise)', department: 'sales', type: 'full-time',
    status: 'open', location: 'London, UK', remote: false,
    salaryMin: 55, salaryMax: 75, postedDate: '2026-05-15', targetStartDate: '2026-07-01',
    hiringManager: 'Sofia Mendez', applications: 18, inPipeline: 2,
    description: 'Drive enterprise new business. Own full cycle from prospecting to close. OTE £120k.',
    requirements: ['4+ yrs enterprise SaaS sales', 'Consistent £500k+ quota attainment', 'MEDDIC / SPIN methodology', 'Vertical: healthcare or fintech preferred'],
    tags: ['sales', 'enterprise', 'high-ote'],
  },
  {
    id: 'j3', title: 'Product Designer', department: 'design', type: 'full-time',
    status: 'open', location: 'London, UK', remote: true,
    salaryMin: 60, salaryMax: 78, postedDate: '2026-05-20',
    hiringManager: 'Anika Roy', applications: 22, inPipeline: 3,
    description: 'Shape the Kangqore OS experience. Own design for 2–3 modules end-to-end.',
    requirements: ['3+ yrs product design', 'Figma proficiency', 'Design system experience', 'B2B SaaS background preferred'],
    tags: ['design', 'figma', 'ux'],
  },
  {
    id: 'j4', title: 'DevOps / Platform Engineer', department: 'engineering', type: 'full-time',
    status: 'on-hold', location: 'Remote', remote: true,
    salaryMin: 75, salaryMax: 95, postedDate: '2026-04-10',
    hiringManager: 'Dev Patel', applications: 12, inPipeline: 0,
    description: 'Own CI/CD, Kubernetes, and cloud infrastructure. On hold pending Series A close.',
    requirements: ['Kubernetes / EKS', 'Terraform', 'CI/CD pipelines', 'AWS expertise', 'Security-first mindset'],
    tags: ['devops', 'infra', 'on-hold-series-a'],
  },
]

export const CANDIDATES: Candidate[] = [
  { id: 'ca1', roleId: 'j1', name: 'Kwame Asante',    email: 'k.asante@gmail.com',       location: 'London, UK',    stage: 'final',     appliedDate: '2026-05-05', lastActivity: '2026-05-28', cvScore: 87, notes: 'Strong system design. Final interview 30 May.', tags: ['strong', 'nodejs'], source: 'linkedin' },
  { id: 'ca2', roleId: 'j1', name: 'Mia Johansson',   email: 'mia.j@outlook.com',        location: 'Stockholm, SE', stage: 'technical', appliedDate: '2026-05-08', lastActivity: '2026-05-22', cvScore: 79, notes: 'Solid backend skills, less distributed systems.', tags: ['backend', 'remote-ok'], source: 'careers-page' },
  { id: 'ca3', roleId: 'j1', name: 'Raj Mehta',       email: 'r.mehta@protonmail.com',   location: 'Manchester, UK',stage: 'offer',     appliedDate: '2026-05-03', lastActivity: '2026-05-30', cvScore: 92, notes: 'Offer extended £95k. Awaiting response.', tags: ['top-pick', 'offer-out'], source: 'referral' },
  { id: 'ca4', roleId: 'j1', name: 'Sofia B.',        email: 'sofia.b@dev.io',           location: 'Berlin, DE',    stage: 'screening', appliedDate: '2026-05-18', lastActivity: '2026-05-20', cvScore: 65, notes: 'CV screen passed. Phone screen scheduled.', tags: [], source: 'linkedin' },
  { id: 'ca5', roleId: 'j2', name: 'Chris Donovan',   email: 'c.donovan@salesmail.com',  location: 'London, UK',    stage: 'screening', appliedDate: '2026-05-20', lastActivity: '2026-05-25', cvScore: 71, notes: '6 yrs enterprise SaaS. Quota attainment unclear.', tags: ['saas', 'enterprise'], source: 'linkedin' },
  { id: 'ca6', roleId: 'j2', name: 'Priyanka Nair',   email: 'priyanka.n@email.com',     location: 'London, UK',    stage: 'applied',   appliedDate: '2026-05-28', lastActivity: '2026-05-28', cvScore: 68, notes: 'CV received. Initial screen pending.', tags: ['healthcare-bg'], source: 'careers-page' },
  { id: 'ca7', roleId: 'j3', name: 'Lucas Webb',      email: 'lucas.w@design.io',        location: 'London, UK',    stage: 'technical', appliedDate: '2026-05-22', lastActivity: '2026-05-29', cvScore: 84, notes: 'Portfolio review done — strong B2B work.', tags: ['portfolio-strong'], source: 'linkedin' },
  { id: 'ca8', roleId: 'j3', name: 'Ana García',      email: 'ana.g@creativeweb.es',     location: 'Madrid, ES',    stage: 'applied',   appliedDate: '2026-05-27', lastActivity: '2026-05-27', cvScore: 72, notes: 'Remote application. CV impressive.', tags: ['remote', 'ux'], source: 'direct' },
  { id: 'ca9', roleId: 'j3', name: 'Tom Park',        email: 't.park@studio.io',         location: 'London, UK',    stage: 'screening', appliedDate: '2026-05-24', lastActivity: '2026-05-26', cvScore: 76, notes: 'Agency send. Design system experience noted.', tags: ['design-system'], source: 'agency' },
]
