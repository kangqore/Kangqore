import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PARTNERS = [
  {
    name: 'Codebridge Studio', type: 'agency', tier: 'platinum', status: 'active',
    country: 'United Kingdom', specialisms: ['React', 'Node.js', 'TypeScript', 'AWS', 'Mobile'],
    rating: 4.8, projectIds: ['pj1', 'pj5'],
    contactName: 'Tom Ashford', contactRole: 'Lead Developer', contactEmail: 'tom@codebridge.io', contactPhone: '+44 7700 800001',
    joinDate: new Date('2025-06-01'), totalEarned: 148000, pendingPayment: 22000, activeTasks: 6, completedProjects: 4,
    description: 'Full-stack agency specialising in React + Node delivery. Primary partner for Alpha CRM and FinTrack.',
    logo: 'CB', hourlyRate: 185,
  },
  {
    name: 'Pixel & Co.', type: 'agency', tier: 'gold', status: 'active',
    country: 'Portugal', specialisms: ['UI/UX Design', 'Figma', 'Motion', 'Design Systems', 'Brand'],
    rating: 4.6, projectIds: ['pj3', 'pj4'],
    contactName: 'Ana Rodrigues', contactRole: 'Creative Director', contactEmail: 'ana@pixelco.pt', contactPhone: '+351 91 234 5678',
    joinDate: new Date('2025-09-15'), totalEarned: 62000, pendingPayment: 8500, activeTasks: 4, completedProjects: 3,
    description: 'Award-winning design studio handling UI/UX for Nexus Portal and OS Dashboard.',
    logo: 'PX', hourlyRate: 145,
  },
  {
    name: 'DataNexus AI', type: 'consultancy', tier: 'platinum', status: 'active',
    country: 'India', specialisms: ['Python', 'ML/AI', 'LangChain', 'RAG', 'Data Engineering', 'FastAPI'],
    rating: 4.9, projectIds: ['pj2'],
    contactName: 'Arjun Mehta', contactRole: 'Principal Consultant', contactEmail: 'arjun@datanexus.in', contactPhone: '+91 98765 43210',
    joinDate: new Date('2025-07-01'), totalEarned: 210000, pendingPayment: 34000, activeTasks: 5, completedProjects: 2,
    description: 'AI/ML consultancy powering eQORE RAG pipeline, lead scoring, and KIMMP signal engine.',
    logo: 'DN', hourlyRate: 160,
  },
  {
    name: 'Infra.Works', type: 'freelancer', tier: 'silver', status: 'active',
    country: 'Germany', specialisms: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Security'],
    rating: 4.4, projectIds: ['pj2', 'pj4'],
    contactName: 'Klaus Weber', contactRole: 'DevOps Engineer', contactEmail: 'k.weber@infra.works',
    joinDate: new Date('2025-11-01'), totalEarned: 38500, pendingPayment: 7200, activeTasks: 3, completedProjects: 2,
    description: 'Infrastructure and DevOps specialist. Manages all AWS environments and CI/CD pipelines.',
    logo: 'IW', hourlyRate: 175,
  },
  {
    name: 'ContentFirst', type: 'freelancer', tier: 'associate', status: 'active',
    country: 'United Kingdom', specialisms: ['Content Strategy', 'SEO', 'Copywriting', 'Email Marketing'],
    rating: 4.2, projectIds: [],
    contactName: 'Jess Palmer', contactRole: 'Content Strategist', contactEmail: 'jess@contentfirst.co.uk',
    joinDate: new Date('2026-01-15'), totalEarned: 12000, pendingPayment: 3500, activeTasks: 2, completedProjects: 1,
    description: 'Content and SEO support for Kangqore marketing and SEA launch materials.',
    logo: 'CF', hourlyRate: 95,
  },
  {
    name: 'QA Hive', type: 'subcontractor', tier: 'silver', status: 'paused',
    country: 'Ukraine', specialisms: ['QA Testing', 'Playwright', 'Cypress', 'Test Strategy', 'Automation'],
    rating: 4.5, projectIds: ['pj1'],
    contactName: 'Olena Kovalenko', contactRole: 'QA Lead', contactEmail: 'olena@qahive.io',
    joinDate: new Date('2025-10-01'), totalEarned: 24000, pendingPayment: 0, activeTasks: 0, completedProjects: 3,
    description: 'QA and test automation partner. Currently paused — resumes when Sprint 4 begins.',
    logo: 'QH', hourlyRate: 85,
  },
]

async function main() {
  console.log('Seeding partner CRM...')

  const existing = await prisma.partnerCRM.count()
  if (existing > 0) {
    console.log(`Skipped — ${existing} partners already exist.`)
    return
  }

  await prisma.partnerCRM.createMany({ data: PARTNERS })
  console.log(`Created ${PARTNERS.length} partners.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
