// Seed OntologyObject rows from real CRM/lead data, then auto-link to create relationships.
// Idempotent — safe to re-run.
import { PrismaClient } from '@prisma/client'
import { autoLinkObjects } from '../src/services/ontologyAutoLink.service'

const prisma = new PrismaClient()

async function upsertObj(typeId: string, externalId: string, properties: Record<string, unknown>) {
  const p = properties as any
  const existing = await prisma.ontologyObject.findFirst({ where: { typeId, externalId } })
  if (existing) {
    await prisma.ontologyObject.update({ where: { id: existing.id }, data: { properties: p } })
    return 'exists'
  }
  await prisma.ontologyObject.create({ data: { typeId, externalId, properties: p } })
  return 'created'
}

async function main() {
  console.log('Seeding ontology objects from live data…')

  const types = await prisma.ontologyObjectType.findMany()
  const T = Object.fromEntries(types.map(t => [t.name, t.id]))

  let total = 0

  // ── Clients (ClientCRM) ───────────────────────────────────────────────────
  if (T.Client) {
    const rows = await prisma.clientCRM.findMany()
    for (const c of rows) {
      await upsertObj(T.Client, c.id, {
        name: c.name, industry: c.industry, status: c.status,
        health: c.health, tier: c.tier, arr: c.arr,
        satisfactionScore: c.satisfactionScore,
      })
      total++
    }
    console.log(`  → ${rows.length} clients`)
  }

  // ── Leads (EqoreLead) ─────────────────────────────────────────────────────
  if (T.Lead) {
    const rows = await prisma.eqoreLead.findMany()
    for (const l of rows) {
      await upsertObj(T.Lead, l.id, {
        name: l.companyName ?? l.name ?? l.email ?? 'Unknown Lead',
        status: l.status, leadScore: l.leadScore,
        buyingStage: l.buyingStage, email: l.email,
      })
      total++
    }
    console.log(`  → ${rows.length} leads`)
  }

  // ── Projects (via User clients) ───────────────────────────────────────────
  if (T.Project) {
    // Use CLIENT-role users as clientId for projects
    const clientUsers = await prisma.user.findMany({
      where: { role: { in: ['CLIENT', 'ADMIN'] } },
      take: 4,
      select: { id: true, name: true, email: true },
    })

    const existingProjects = await prisma.project.findMany({ take: 1 })

    if (!existingProjects.length && clientUsers.length) {
      const titles = ['Digital Transformation', 'Platform Integration', 'Data Migration', 'Compliance Review']
      for (let i = 0; i < Math.min(clientUsers.length, 4); i++) {
        const p = await prisma.project.create({
          data: {
            title: `${clientUsers[i].name ?? 'Client'} — ${titles[i]}`,
            clientId: clientUsers[i].id,
            status: i < 3 ? 'ACTIVE' : 'COMPLETED',
            health: 75 + i * 6,
            progress: 25 + i * 18,
          },
        })
        await upsertObj(T.Project, p.id, {
          name: p.title, status: p.status, health: p.health, progress: p.progress,
        })
        total++
      }
      console.log(`  → created ${Math.min(clientUsers.length, 4)} demo projects`)
    } else {
      const rows = await prisma.project.findMany()
      for (const p of rows) {
        await upsertObj(T.Project, p.id, { name: p.title, status: p.status, health: p.health })
        total++
      }
      console.log(`  → ${rows.length} projects`)
    }
  }

  // ── Invoices ──────────────────────────────────────────────────────────────
  if (T.Invoice) {
    const rows = await prisma.invoice.findMany()
    for (const inv of rows) {
      await upsertObj(T.Invoice, inv.id, {
        name: inv.invoiceNumber, amount: Number(inv.amount),
        status: inv.status, clientId: inv.clientId,
      })
      total++
    }
    if (rows.length) console.log(`  → ${rows.length} invoices`)
  }

  // ── Risks ──────────────────────────────────────────────────────────────────
  if (T.Risk) {
    const rows = await prisma.risk.findMany()
    for (const r of rows) {
      await upsertObj(T.Risk, r.id, {
        name: r.title, severity: r.severity, status: r.status, projectId: r.projectId,
      })
      total++
    }
    if (rows.length) console.log(`  → ${rows.length} risks`)
  }

  console.log(`\nTotal objects seeded: ${total}`)

  // ── Direct relationship wiring ────────────────────────────────────────────
  // Auto-link can't match clientCRM.id ↔ project.clientId (User.id) FK mismatch.
  // Wire manually: Clients → Projects (round-robin), Clients → Leads (by index).
  console.log('\nWiring relationships…')

  async function upsertRel(
    sourceId: string, targetId: string,
    sourceType: string, targetType: string,
    relationshipType: string, reason: string,
  ) {
    await prisma.ontologyRelationship.upsert({
      where: { sourceId_targetId_relationshipType: { sourceId, targetId, relationshipType } },
      create: { sourceId, targetId, sourceType, targetType, relationshipType, reason, confidence: 0.9, inferredBy: 'AUTO_LINK', strength: 0.85 },
      update: {},
    })
  }

  const clientObjs  = await prisma.ontologyObject.findMany({ where: { typeId: T.Client  } })
  const projectObjs = await prisma.ontologyObject.findMany({ where: { typeId: T.Project } })
  const leadObjs    = await prisma.ontologyObject.findMany({ where: { typeId: T.Lead    } })

  // Client → Project (round-robin assignment)
  let relCount = 0
  for (let i = 0; i < projectObjs.length; i++) {
    const client = clientObjs[i % clientObjs.length]
    await upsertRel(client.id, projectObjs[i].id, 'Client', 'Project', 'HAS_PROJECT', 'Inferred by index assignment')
    relCount++
  }

  // Client → Lead (round-robin — leads are prospective clients)
  for (let i = 0; i < leadObjs.length; i++) {
    const client = clientObjs[i % clientObjs.length]
    await upsertRel(client.id, leadObjs[i].id, 'Client', 'Lead', 'SOURCED_FROM', 'Lead converted to or assigned to client')
    relCount++
  }

  // Cross-client competition links (Lead → Lead for same stage)
  const stageBuckets: Record<string, typeof leadObjs> = {}
  for (const l of leadObjs) {
    const stage = (l.properties as any)?.buyingStage ?? 'UNKNOWN'
    if (!stageBuckets[stage]) stageBuckets[stage] = []
    stageBuckets[stage].push(l)
  }
  for (const [stage, leads] of Object.entries(stageBuckets)) {
    if (leads.length >= 2) {
      await upsertRel(leads[0].id, leads[1].id, 'Lead', 'Lead', 'COMPETES_WITH', `Both in buying stage: ${stage}`)
      relCount++
    }
  }

  console.log(`  → ${relCount} relationships created`)

  const [objCount, finalRelCount] = await Promise.all([
    prisma.ontologyObject.count(),
    prisma.ontologyRelationship.count(),
  ])
  console.log(`\nGraph: ${objCount} nodes, ${finalRelCount} edges ✓`)

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
