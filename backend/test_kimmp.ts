import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const c = await prisma.kimmpFlag.findMany()
  console.log(c)
}
main().finally(() => prisma.$disconnect())
