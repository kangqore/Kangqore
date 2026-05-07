
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Pass@123', 10)

  const testUsers = [
    {
      email: 'client@kangqore.com',
      name: 'Test Client',
      role: Role.CLIENT,
      password: hashedPassword,
      company: 'Client Corp',
    },
    {
      email: 'partner@kangqore.com',
      name: 'Test Partner',
      role: Role.PARTNER,
      password: hashedPassword,
      company: 'Partner Solutions',
    },
    {
      email: 'investor@kangqore.com',
      name: 'Test Investor',
      role: Role.INVESTOR,
      password: hashedPassword,
      company: 'Venture Capital',
    },
    {
      email: 'jobseeker@user.com', // Using generic domain for job seeker
      name: 'Test Candidate',
      role: Role.JOB_SEEKER, // Enum is JOB_SEEKER
      password: hashedPassword,
      profession: 'Software Engineer',
    },
  ]

  console.log('Start seeding test users...')

  for (const user of testUsers) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: user.password,
        role: user.role,
        name: user.name, // Ensure names/roles are updated if they exist
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
        company: user.company,
        profession: user.profession,
      },
    })
    console.log(`Upserted user: ${upsertedUser.email} with role ${upsertedUser.role}`)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
