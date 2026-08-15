/**
 * Seeds the Gate 8 BASELINE snapshot.
 * Run once: npx tsx prisma/seedGate8Baseline.ts
 */
import { createGate8Snapshot } from '../src/kangqore-view/waanda/intelligence/gate8.service'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('[Gate8] Computing OIS and creating BASELINE snapshot...')
  const snapshot = await createGate8Snapshot('MANUAL', undefined, 'BASELINE') as any
  console.log('[Gate8] BASELINE snapshot created:')
  console.log(`  id:          ${snapshot.id}`)
  console.log(`  oisScore:    ${snapshot.oisScore}`)
  console.log(`  label:       ${snapshot.label}`)
  console.log(`  triggeredBy: ${snapshot.triggeredBy}`)
  console.log(`  createdAt:   ${snapshot.createdAt}`)
  console.log('')
  console.log('[Gate8] COIG denominator is now set. Reflection page OII/COIG will populate on next load.')
}

main()
  .catch(e => { console.error('[Gate8] Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
