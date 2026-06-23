import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PASSWORD = 'password123'

const users = [
  { email: 'client@kangqore.com',    name: 'Dr. Priya Rao',      role: 'CLIENT'     as const, company: 'Synapse Health'       },
  { email: 'partner@kangqore.com',   name: 'Dev Patel',           role: 'PARTNER'    as const, company: 'Apex Technologies'    },
  { email: 'investor@kangqore.com',  name: 'James Whitfield',     role: 'INVESTOR'   as const, company: 'Whitfield Ventures'   },
  { email: 'jobs@kangqore.com',      name: 'Mia Johansson',       role: 'JOB_SEEKER' as const, company: null                  },
  { email: 'press@kangqore.com',     name: 'Ananya Singh',        role: 'JOURNALIST' as const, company: 'The Press Desk'      },
  { email: 'analyst@kangqore.com',   name: 'Ravi Mehta',          role: 'ANALYST'    as const, company: 'Meridian Insights'   },
  { email: 'team@kangqore.com',      name: 'Arjun Sharma',        role: 'TEAM'       as const, company: 'Kangqore'            },
  { email: 'exec@kangqore.com',      name: 'Vikram Nair',         role: 'EXECUTIVE'  as const, company: 'Kangqore'            },
  { email: 'admin@kangqore.com',     name: 'Mahesh Kumar',        role: 'ADMIN'      as const, company: 'Kangqore'            },
]

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10)

  for (const u of users) {
    const user = await prisma.user.upsert({
      where:  { email: u.email },
      update: { role: u.role, status: 'ACTIVE', password: hash, name: u.name },
      create: {
        email:    u.email,
        name:     u.name,
        password: hash,
        role:     u.role,
        status:   'ACTIVE',
        ...(u.company ? { company: u.company } : {}),
      },
    })

    // CLIENT needs a ClientProfile for the portal to work
    if (u.role === 'CLIENT') {
      await prisma.clientProfile.upsert({
        where:  { userId: user.id },
        create: { userId: user.id, interestedServices: [] },
        update: {},
      })
    }

    console.log(`✅  ${u.role.padEnd(10)} ${u.email}`)
  }

  console.log(`\nAll accounts ready. Password: ${PASSWORD}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())
