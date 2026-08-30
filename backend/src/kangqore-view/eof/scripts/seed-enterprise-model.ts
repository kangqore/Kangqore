import { seedEnterpriseObjectModel } from '../EnterpriseObjectSeeder'
;(async () => {
  const r = await seedEnterpriseObjectModel()
  console.log('  types created :', r.typesCreated)
  console.log('  types updated :', r.typesUpdated)
  console.log('  schemas written:', r.schemasWritten)
  console.log('  cardinality rules:', r.cardinalityRules)
  if (r.skipped.length) console.log('  skipped:', r.skipped.join(', '))
  process.exit(0)
})()
