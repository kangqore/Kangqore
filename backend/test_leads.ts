import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const leads = await prisma.eqoreLead.findMany({ take: 5 })
  console.log(JSON.stringify(leads, null, 2))
}
main().finally(() => prisma.$disconnect())
