import { prisma } from '../../lib/prisma'

interface AutoLinkResult {
  created: number
  skipped: number
  errors:  number
  details: string[]
}

async function upsertRel(
  sourceId: string, targetId: string,
  sourceType: string, targetType: string,
  relationshipType: string, reason: string,
): Promise<'created' | 'exists'> {
  const existing = await prisma.ontologyRelationship.findUnique({
    where: { sourceId_targetId_relationshipType: { sourceId, targetId, relationshipType } },
  })
  if (existing) return 'exists'

  await prisma.ontologyRelationship.create({
    data: {
      sourceId, targetId, sourceType, targetType, relationshipType,
      confidence: 0.85, inferredBy: 'AUTO_LINK', reason, strength: 0.8,
    },
  })
  return 'created'
}

export async function autoLinkObjects(): Promise<AutoLinkResult> {
  let created = 0, skipped = 0, errors = 0
  const details: string[] = []

  // Load all ontology objects keyed by externalId + type name
  const objects = await prisma.ontologyObject.findMany({
    where: { externalId: { not: null } },
    include: { type: true },
  })

  const byTypeAndExtId = new Map<string, { id: string; typeName: string }>()
  for (const obj of objects) {
    byTypeAndExtId.set(`${(obj.type as any).name}::${obj.externalId}`, {
      id: obj.id, typeName: (obj.type as any).name,
    })
  }

  // ── Rule 1: Client HAS_PROJECT Project (via project.clientId) ────────────
  try {
    const projects = await prisma.project.findMany({
      select: { id: true, clientId: true },
    })
    for (const p of projects) {
      const srcObj = byTypeAndExtId.get(`Client::${p.clientId}`)
      const tgtObj = byTypeAndExtId.get(`Project::${p.id}`)
      if (!srcObj || !tgtObj) { skipped++; continue }
      const r = await upsertRel(srcObj.id, tgtObj.id, 'Client', 'Project', 'HAS_PROJECT', 'Inferred from project.clientId FK')
      r === 'created' ? created++ : skipped++
    }
    details.push(`Rule 1 (Client→Project): processed ${projects.length} projects`)
  } catch (e: any) { errors++; details.push(`Rule 1 error: ${e.message}`) }

  // ── Rule 2: Project OWNS_INVOICE Invoice (via invoice.projectId) ─────────
  try {
    const invoices = await prisma.invoice.findMany({
      where: { projectId: { not: null } },
      select: { id: true, projectId: true },
    })
    for (const inv of invoices) {
      const srcObj = byTypeAndExtId.get(`Project::${inv.projectId}`)
      const tgtObj = byTypeAndExtId.get(`Invoice::${inv.id}`)
      if (!srcObj || !tgtObj) { skipped++; continue }
      const r = await upsertRel(srcObj.id, tgtObj.id, 'Project', 'Invoice', 'OWNS_INVOICE', 'Inferred from invoice.projectId FK')
      r === 'created' ? created++ : skipped++
    }
    details.push(`Rule 2 (Project→Invoice): processed ${invoices.length} invoices`)
  } catch (e: any) { errors++; details.push(`Rule 2 error: ${e.message}`) }

  // ── Rule 3: Client OWNS_INVOICE Invoice (via invoice.clientId) ───────────
  try {
    const invoices = await prisma.invoice.findMany({
      select: { id: true, clientId: true },
    })
    for (const inv of invoices) {
      const srcObj = byTypeAndExtId.get(`Client::${inv.clientId}`)
      const tgtObj = byTypeAndExtId.get(`Invoice::${inv.id}`)
      if (!srcObj || !tgtObj) { skipped++; continue }
      const r = await upsertRel(srcObj.id, tgtObj.id, 'Client', 'Invoice', 'OWNS_INVOICE', 'Inferred from invoice.clientId FK')
      r === 'created' ? created++ : skipped++
    }
    details.push(`Rule 3 (Client→Invoice): processed ${invoices.length} invoices`)
  } catch (e: any) { errors++; details.push(`Rule 3 error: ${e.message}`) }

  // ── Rule 4: Project HAS_LEAD User (via project.leadId) ──────────────────
  try {
    const projects = await prisma.project.findMany({
      where: { leadId: { not: null } },
      select: { id: true, leadId: true },
    })
    for (const p of projects) {
      const srcObj = byTypeAndExtId.get(`Project::${p.id}`)
      const tgtObj = byTypeAndExtId.get(`User::${p.leadId}`)
      if (!srcObj || !tgtObj) { skipped++; continue }
      const r = await upsertRel(srcObj.id, tgtObj.id, 'Project', 'User', 'HAS_LEAD', 'Inferred from project.leadId FK')
      r === 'created' ? created++ : skipped++
    }
    details.push(`Rule 4 (Project→Lead): processed ${projects.length} projects`)
  } catch (e: any) { errors++; details.push(`Rule 4 error: ${e.message}`) }

  // ── Rule 5: Same-domain email inference (Client SAME_ORG Client) ─────────
  // Uses ClientContact.email since ClientCRM has no direct email field
  try {
    const clientObjs = objects.filter(o => (o.type as any).name === 'Client' && o.externalId)
    const clientExtIds = clientObjs.map(o => o.externalId!).filter(Boolean)
    const contacts = await prisma.clientContact.findMany({
      where: { clientId: { in: clientExtIds } },
      select: { clientId: true, email: true },
    })
    const domainMap = new Map<string, string[]>()
    for (const c of contacts) {
      if (!c.email) continue
      const domain = c.email.split('@')[1]
      if (!domain) continue
      if (!domainMap.has(domain)) domainMap.set(domain, [])
      if (!domainMap.get(domain)!.includes(c.clientId)) domainMap.get(domain)!.push(c.clientId)
    }
    const GENERIC = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
    for (const [domain, ids] of domainMap) {
      if (ids.length < 2 || GENERIC.includes(domain)) continue
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const srcObj = byTypeAndExtId.get(`Client::${ids[i]}`)
          const tgtObj = byTypeAndExtId.get(`Client::${ids[j]}`)
          if (!srcObj || !tgtObj) continue
          const r = await upsertRel(srcObj.id, tgtObj.id, 'Client', 'Client', 'SAME_ORG',
            `Same email domain @${domain}`)
          r === 'created' ? created++ : skipped++
        }
      }
    }
    details.push(`Rule 5 (same-domain): processed ${domainMap.size} domains`)
  } catch (e: any) { errors++; details.push(`Rule 5 error: ${e.message}`) }

  return { created, skipped, errors, details }
}
