import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CLIENTS = [
  {
    name: 'TechNova Inc.', industry: 'Technology', country: 'United Kingdom',
    tier: 'strategic', status: 'active', health: 'good', arr: 180000,
    contractStart: new Date('2026-01-10'), contractEnd: new Date('2027-01-09'),
    accountManager: 'Mahesh Kumar', satisfactionScore: 78, logo: 'TN',
    description: 'Enterprise CRM platform build — full-stack delivery from discovery to launch. Highest ARR client.',
    contacts: [
      { name: 'Sarah Mitchell', role: 'CTO',              email: 'sarah@technova.io',  phone: '+44 7700 900001', isPrimary: true  },
      { name: 'James Park',     role: 'Product Director', email: 'james@technova.io',  phone: '+44 7700 900002', isPrimary: false },
      { name: 'Lisa Chen',      role: 'Finance Lead',     email: 'lisa@technova.io',   phone: '+44 7700 900003', isPrimary: false },
    ],
  },
  {
    name: 'Nexus Partners', industry: 'Professional Services', country: 'United Kingdom',
    tier: 'enterprise', status: 'active', health: 'at-risk', arr: 90000,
    contractStart: new Date('2026-02-15'), contractEnd: new Date('2026-11-14'),
    accountManager: 'Anika Roy', satisfactionScore: 62, logo: 'NP',
    description: 'Partner portal with task management and earnings tracking. Invoice overdue — relationship at risk.',
    contacts: [
      { name: 'Oliver Grant', role: 'CEO',            email: 'oliver@nexus.co.uk', phone: '+44 7700 900010', isPrimary: true  },
      { name: 'Priya Desai',  role: 'Operations Lead',email: 'priya@nexus.co.uk',  phone: '+44 7700 900011', isPrimary: false },
    ],
  },
  {
    name: 'Meridian Capital', industry: 'Financial Services', country: 'United Kingdom',
    tier: 'enterprise', status: 'active', health: 'good', arr: 140000,
    contractStart: new Date('2026-03-15'), contractEnd: new Date('2026-12-14'),
    accountManager: 'Priya Sharma', satisfactionScore: 84, logo: 'MC',
    description: 'Financial analytics suite — P&L dashboards, cash flow, forecasting for a mid-market PE fund.',
    contacts: [
      { name: 'David Harrington', role: 'Managing Partner', email: 'david@meridian.com',  phone: '+44 7700 900020', isPrimary: true  },
      { name: 'Alicia Wang',      role: 'CFO',               email: 'alicia@meridian.com', phone: '+44 7700 900021', isPrimary: false },
    ],
  },
  {
    name: 'GlobeMed Group', industry: 'Healthcare', country: 'Singapore',
    tier: 'strategic', status: 'onboarding', health: 'excellent', arr: 220000,
    contractStart: new Date('2026-06-01'), contractEnd: new Date('2027-05-31'),
    accountManager: 'Dev Patel', satisfactionScore: 92, logo: 'GM',
    description: 'HIPAA-compliant patient portal — largest single contract. Currently in discovery phase.',
    contacts: [
      { name: 'Dr. Anand Rao', role: 'CIO',            email: 'anand@globemed.sg', phone: '+65 9000 1001', isPrimary: true  },
      { name: 'Mei Lin Toh',   role: 'Project Sponsor', email: 'mei@globemed.sg',   phone: '+65 9000 1002', isPrimary: false },
    ],
  },
  {
    name: 'Vantage Retail', industry: 'Retail & E-commerce', country: 'United Arab Emirates',
    tier: 'standard', status: 'active', health: 'good', arr: 65000,
    contractStart: new Date('2025-11-01'), contractEnd: new Date('2026-10-31'),
    accountManager: 'Sofia Mendez', satisfactionScore: 76, logo: 'VR',
    description: 'Ongoing retainer — UX/UI design and frontend support for their D2C platform.',
    contacts: [
      { name: 'Khalid Al-Rashid', role: 'Head of Digital', email: 'khalid@vantage.ae', phone: '+971 50 123 4567', isPrimary: true },
    ],
  },
  {
    name: 'PulseHR', industry: 'HR Technology', country: 'United Kingdom',
    tier: 'starter', status: 'paused', health: 'critical', arr: 28000,
    contractStart: new Date('2025-08-01'), contractEnd: new Date('2026-07-31'),
    accountManager: 'Anika Roy', satisfactionScore: 41, logo: 'PH',
    description: 'HR platform MVP — paused due to client budget freeze. Risk of churn.',
    contacts: [
      { name: 'Emma Clarke', role: 'Founder', email: 'emma@pulsehr.com', phone: '+44 7700 900030', isPrimary: true },
    ],
  },
]

async function main() {
  console.log('Seeding client CRM...')

  const existing = await prisma.clientCRM.count()
  if (existing > 0) {
    console.log(`Skipped — ${existing} clients already exist.`)
    return
  }

  for (const c of CLIENTS) {
    const { contacts, ...clientData } = c
    await prisma.clientCRM.create({
      data: {
        ...clientData,
        contacts: { create: contacts },
      },
    })
  }

  console.log(`Created ${CLIENTS.length} clients with their contacts.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
