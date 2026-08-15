import { seedDefaultPolicies } from '../src/kangqore-view/esf/PolicyEngine'
import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
async function main() {
  await seedDefaultPolicies()
  const count   = await p.kimmpPolicy.count()
  const all     = await p.kimmpPolicy.findMany({ select: { name: true, trigger: true, effect: true, priority: true }, orderBy: { priority: 'desc' } })
  console.log(`Policies in DB: ${count}`)
  all.forEach(pol => console.log(`  [${pol.effect.padEnd(16)}] P${pol.priority} · ${pol.trigger} — ${pol.name}`))
  await p.$disconnect()
}
main().catch(e => { console.error(e.message); process.exit(1) })
