import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // ── Jobs ──────────────────────────────────────────────────────────────────
  const jobs = [
    { id: 'job-1', title: 'Senior Backend Engineer',  description: 'Build and scale the core platform API and data pipeline.',                   department: 'engineering', type: 'full-time', location: 'London, UK / Remote', status: 'OPEN',      requirements: ['5+ years Node.js', 'PostgreSQL', 'REST API design'],         salaryRange: '£80k–£110k'    },
    { id: 'job-2', title: 'Product Designer',         description: 'Own the design system and drive the next generation of WAANDA UI.',           department: 'design',      type: 'full-time', location: 'Remote',              status: 'OPEN',      requirements: ['Figma proficiency', 'Design systems', '3+ years SaaS'],      salaryRange: '£60k–£80k'     },
    { id: 'job-3', title: 'Growth Marketing Manager', description: 'Lead demand generation and growth experiments for B2B enterprise market.',     department: 'sales',       type: 'full-time', location: 'London, UK',          status: 'OPEN',      requirements: ['B2B SaaS marketing', 'SEO/SEM', 'HubSpot or Salesforce'],   salaryRange: '£55k–£75k'     },
    { id: 'job-4', title: 'AI/ML Engineer',           description: 'Build and train the WAANDA Gen2 native reasoning engine.',                     department: 'engineering', type: 'full-time', location: 'Remote',              status: 'OPEN',      requirements: ['Python', 'PyTorch or TensorFlow', 'LLM fine-tuning'],       salaryRange: '£90k–£130k'    },
    { id: 'job-5', title: 'Client Success Manager',   description: 'Own onboarding and retention for strategic enterprise accounts.',              department: 'delivery',    type: 'full-time', location: 'London, UK',          status: 'interview', requirements: ['B2B SaaS CS', 'Stakeholder management', 'Data-driven'],     salaryRange: '£50k–£65k'     },
    { id: 'job-6', title: 'Delivery Lead',            description: 'Lead cross-functional delivery teams on enterprise client engagements.',       department: 'delivery',    type: 'contract',  location: 'London, UK / Remote', status: 'OPEN',      requirements: ['Agile delivery', 'Client-facing', '5+ years PM'],           salaryRange: '£500–£650/day' },
  ]

  for (const job of jobs) {
    await prisma.job.upsert({ where: { id: job.id }, create: { ...job, updatedAt: new Date() }, update: { title: job.title, status: job.status } })
  }
  console.log(`✅ Seeded ${jobs.length} jobs`)

  // ── Job applications ──────────────────────────────────────────────────────
  const apps = [
    { id: 'app-1', jobId: 'job-1', position: 'Senior Backend Engineer', name: 'Aryan Gupta',   email: 'aryan@example.com',  status: 'REVIEWING' as const,    createdAt: new Date('2026-06-20') },
    { id: 'app-2', jobId: 'job-1', position: 'Senior Backend Engineer', name: 'Sara Wilson',   email: 'sara@example.com',   status: 'INTERVIEWING' as const, createdAt: new Date('2026-06-22') },
    { id: 'app-3', jobId: 'job-2', position: 'Product Designer',        name: 'Mia Johansson', email: 'mia@example.com',    status: 'SHORTLISTED' as const,  createdAt: new Date('2026-07-01') },
    { id: 'app-4', jobId: 'job-4', position: 'AI/ML Engineer',          name: 'Rahul Das',     email: 'rahul@example.com',  status: 'RECEIVED' as const,     createdAt: new Date('2026-07-05') },
    { id: 'app-5', jobId: 'job-5', position: 'Client Success Manager',  name: 'Claire Martin', email: 'claire@example.com', status: 'OFFERED' as const,      createdAt: new Date('2026-06-15') },
  ]
  for (const app of apps) {
    const { jobId, ...rest } = app
    await prisma.jobApplication.upsert({
      where: { id: app.id },
      create: { ...rest, updatedAt: new Date(), job: { connect: { id: jobId } } },
      update: { status: app.status },
    })
  }
  console.log(`✅ Seeded ${apps.length} job applications`)

  // ── Consultations ─────────────────────────────────────────────────────────
  const consultations = [
    { id: 'con-1', name: 'Alex Thompson',    email: 'alex@acme.com',      company: 'Acme Corp',       service: 'BIDS Platform Demo', topic: 'Enterprise AI Automation',    status: 'PENDING' as const,     createdAt: new Date('2026-07-08'), updatedAt: new Date() },
    { id: 'con-2', name: 'Priya Sharma',     email: 'priya@nexus.io',     company: 'Nexus Tech',      service: 'Custom Integration',  topic: 'API & Workflow Automation',   status: 'CONTACTED' as const,   createdAt: new Date('2026-07-07'), updatedAt: new Date() },
    { id: 'con-3', name: 'James Whitfield',  email: 'james@venture.vc',   company: 'Whitfield Capital',service: 'Enterprise Plan',    topic: 'Investor Relations Module',   status: 'SCHEDULED' as const,   createdAt: new Date('2026-07-06'), updatedAt: new Date(), scheduledAt: new Date('2026-07-14T10:00:00Z'), preferredDate: '2026-07-14' },
    { id: 'con-4', name: 'Sarah Chen',       email: 'sarah@globalops.com', company: 'GlobalOps',       service: 'Team Training',       topic: 'Onboarding & Delivery Suite', status: 'PENDING' as const,     createdAt: new Date('2026-07-09'), updatedAt: new Date() },
    { id: 'con-5', name: 'Ravi Mehta',       email: 'ravi@meridian.co',   company: 'Meridian Insights',service: 'Analytics Module',   topic: 'WVIS Intelligence Canvas',    status: 'RESCHEDULED' as const, createdAt: new Date('2026-07-05'), updatedAt: new Date() },
    { id: 'con-6', name: 'Emma Clarke',      email: 'emma@buildfast.io',  company: 'BuildFast',       service: 'BIDS Platform Demo',  topic: 'Startup Growth Automation',   status: 'COMPLETED' as const,   createdAt: new Date('2026-07-03'), updatedAt: new Date() },
    { id: 'con-7', name: 'Michael Santos',   email: 'mike@synapse.ai',    company: 'Synapse AI',      service: 'Custom Integration',  topic: 'AI Agent Deployment',         status: 'PENDING' as const,     createdAt: new Date('2026-07-10'), updatedAt: new Date() },
  ]
  for (const c of consultations) {
    await prisma.consultation.upsert({ where: { id: c.id }, create: c, update: { status: c.status } })
  }
  console.log(`✅ Seeded ${consultations.length} consultations`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
