import { prisma } from '../../lib/prisma'

export type SimulationType = 'REVENUE_IMPACT' | 'CAPACITY_IMPACT' | 'RISK_PROPAGATION' | 'DEPENDENCY_CHAIN'

export interface SimulationResult {
  type:        SimulationType
  scenario:    string           // what was simulated
  findings:    string[]         // bullet-point findings
  impact:      {
    severity:    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    headline:    string          // e.g. "£45,000 ARR at risk"
    numeric?:    number
    unit?:       string          // '£', '%', 'days', 'users'
  }
  affectedIds:  string[]        // entity IDs that are affected
  confidence:   number          // 0–100
  simulatedAt:  Date
}

// ── Revenue Impact ────────────────────────────────────────────────────────────
// "If we lose client X, what's the financial effect?"

export async function simulateRevenueImpact(params: {
  clientId?: string
  projectId?: string
  scenario: string
}): Promise<SimulationResult> {
  const findings: string[] = []
  let totalAtRisk = 0
  const affected: string[] = []

  if (params.clientId) {
    // Find CRM client ARR
    const crm = await prisma.clientCRM.findUnique({ where: { id: params.clientId } }).catch(() => null)
    if (crm) {
      totalAtRisk += crm.arr
      affected.push(params.clientId)
      findings.push(`Client "${crm.name}" ARR: £${crm.arr.toLocaleString()}`)
      findings.push(`Client health: ${crm.health} · Status: ${crm.status}`)
    }

    // Find linked invoices
    const invoices = await prisma.invoice.findMany({
      where: { clientId: params.clientId, status: { in: ['DRAFT', 'SENT', 'OVERDUE'] } },
      select: { id: true, amount: true, status: true, dueDate: true },
    })
    const invoiceTotal = invoices.reduce((s, i) => s + Number(i.amount), 0)
    if (invoiceTotal > 0) {
      findings.push(`${invoices.length} open invoice(s) totalling £${invoiceTotal.toLocaleString()} would be at risk`)
      totalAtRisk += invoiceTotal
      affected.push(...invoices.map(i => i.id))
    }

    // Find projects
    const projects = await prisma.project.findMany({
      where: { clientId: params.clientId },
      select: { id: true, title: true, status: true, budget: true, spend: true, health: true },
    })
    if (projects.length > 0) {
      const projectBudget = projects.reduce((s, p) => s + Number(p.budget ?? 0), 0)
      findings.push(`${projects.length} active project(s) — total budget £${projectBudget.toLocaleString()}`)
      affected.push(...projects.map(p => p.id))
    }
  } else if (params.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      select: { id: true, title: true, budget: true, spend: true, health: true, status: true },
    })
    if (project) {
      totalAtRisk = Number(project.budget ?? 0)
      affected.push(project.id)
      findings.push(`Project "${project.title}" — Budget: £${Number(project.budget ?? 0).toLocaleString()}`)
      findings.push(`Spent so far: £${Number(project.spend ?? 0).toLocaleString()} · Health: ${project.health}`)
    }
  }

  // Pipeline opportunity cost
  const pipelineLeads = await prisma.eqoreLead.findMany({
    where: { status: { in: ['QUALIFIED', 'PROPOSAL'] } },
    select: { id: true, projectedValue: true },
    take: 20,
  })
  const pipelineValue = pipelineLeads.reduce((s, l) => s + Number(l.projectedValue ?? 0), 0)
  if (pipelineValue > 0) findings.push(`Active pipeline value for context: £${pipelineValue.toLocaleString()}`)

  const severity: SimulationResult['impact']['severity'] =
    totalAtRisk > 100000 ? 'CRITICAL' : totalAtRisk > 50000 ? 'HIGH' : totalAtRisk > 10000 ? 'MEDIUM' : 'LOW'

  return {
    type: 'REVENUE_IMPACT',
    scenario: params.scenario,
    findings,
    impact: {
      severity,
      headline: `£${totalAtRisk.toLocaleString()} at risk`,
      numeric: totalAtRisk,
      unit: '£',
    },
    affectedIds: affected,
    confidence: 75,
    simulatedAt: new Date(),
  }
}

// ── Capacity Impact ───────────────────────────────────────────────────────────
// "If we add project X, are we over capacity?"

export async function simulateCapacityImpact(params: {
  projectId?: string
  scenario: string
  estimatedWeeks?: number
}): Promise<SimulationResult> {
  const findings: string[] = []
  const affected: string[] = []

  const tasks = await prisma.task.findMany({
    where: { status: { in: ['TODO', 'IN_PROGRESS'] } },
    select: { id: true, partnerId: true, dueDate: true },
    take: 200,
  })

  // Count tasks per assignee (partnerId)
  const byAssignee = new Map<string, number>()
  for (const t of tasks) {
    if (t.partnerId) byAssignee.set(t.partnerId, (byAssignee.get(t.partnerId) ?? 0) + 1)
  }

  const overloaded = [...byAssignee.entries()].filter(([, c]) => c > 10)
  const totalActive = tasks.length

  findings.push(`${totalActive} open tasks across the team`)
  if (overloaded.length > 0) {
    findings.push(`${overloaded.length} team member(s) have >10 open tasks (capacity risk)`)
    affected.push(...overloaded.map(([id]) => id))
  }

  const overdueCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length
  if (overdueCount > 0) findings.push(`${overdueCount} task(s) are already overdue`)

  const weekEstimate = params.estimatedWeeks ?? 4
  findings.push(`Adding a ${weekEstimate}-week project would require approximately ${weekEstimate * 40}h of capacity`)

  const severity: SimulationResult['impact']['severity'] =
    overloaded.length > 3 ? 'CRITICAL' : overloaded.length > 1 ? 'HIGH' : overdueCount > 5 ? 'MEDIUM' : 'LOW'

  return {
    type: 'CAPACITY_IMPACT',
    scenario: params.scenario,
    findings,
    impact: {
      severity,
      headline: overloaded.length > 0 ? `${overloaded.length} team member(s) at capacity` : 'Capacity available',
      numeric: overloaded.length,
      unit: 'members over capacity',
    },
    affectedIds: affected,
    confidence: 65,
    simulatedAt: new Date(),
  }
}

// ── Risk Propagation ──────────────────────────────────────────────────────────
// "If CI item X fails, what's the blast radius?" — traverses ontology graph

export async function simulateRiskPropagation(params: {
  rootId: string
  scenario: string
  maxDepth?: number
}): Promise<SimulationResult> {
  const findings: string[] = []
  const affected = new Set<string>()
  const queue    = [params.rootId]
  const depth    = params.maxDepth ?? 3

  async function traverse(id: string, d: number) {
    if (d === 0 || affected.has(id)) return
    affected.add(id)
    const rels = await prisma.ontologyRelationship.findMany({
      where: { OR: [{ sourceId: id }, { targetId: id }], validTo: null },
      take: 20,
    }).catch(() => [])
    for (const r of rels) {
      const next = r.sourceId === id ? r.targetId : r.sourceId
      await traverse(next, d - 1)
    }
  }

  for (const id of queue) await traverse(id, depth)

  const affectedArr = [...affected]
  const objects = await prisma.ontologyObject.findMany({
    where: { id: { in: affectedArr } },
    include: { type: true },
    take: 50,
  }).catch(() => [])

  const byType = new Map<string, number>()
  for (const o of objects) byType.set((o.type as any).name, (byType.get((o.type as any).name) ?? 0) + 1)

  findings.push(`${affectedArr.length} entities potentially affected`)
  for (const [type, count] of byType) findings.push(`${count} ${type}(s) in blast radius`)

  const severity: SimulationResult['impact']['severity'] =
    affectedArr.length > 20 ? 'CRITICAL' : affectedArr.length > 10 ? 'HIGH' : affectedArr.length > 4 ? 'MEDIUM' : 'LOW'

  return {
    type: 'RISK_PROPAGATION',
    scenario: params.scenario,
    findings,
    impact: {
      severity,
      headline: `${affectedArr.length} connected entities in blast radius`,
      numeric: affectedArr.length,
      unit: 'entities',
    },
    affectedIds: affectedArr,
    confidence: 70,
    simulatedAt: new Date(),
  }
}

// ── Dependency Chain ──────────────────────────────────────────────────────────
// "What breaks if supplier X fails?"

export async function simulateDependencyChain(params: {
  projectId?: string
  scenario: string
}): Promise<SimulationResult> {
  const findings: string[] = []
  const affected: string[] = []

  if (params.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: { tasks: { where: { status: { in: ['TODO', 'IN_PROGRESS'] } }, select: { id: true, title: true, dueDate: true } },
                 deliverables: { where: { status: { notIn: ['delivered', 'approved'] } }, select: { id: true, title: true, dueDate: true } } },
    }).catch(() => null)

    if (project) {
      affected.push(project.id)
      findings.push(`Project "${project.title}" — Health: ${project.health}%`)

      const overdueTasks = (project.tasks ?? []).filter(t => t.dueDate && new Date(t.dueDate) < new Date())
      findings.push(`${(project.tasks ?? []).length} open tasks, ${overdueTasks.length} overdue`)

      const overdueDelivs = (project.deliverables ?? []).filter(d => d.dueDate && new Date(d.dueDate) < new Date())
      findings.push(`${(project.deliverables ?? []).length} pending deliverables, ${overdueDelivs.length} overdue`)

      affected.push(...(project.tasks ?? []).map(t => t.id))
      affected.push(...(project.deliverables ?? []).map(d => d.id))

      // Downstream invoices
      const invoices = await prisma.invoice.findMany({
        where: { projectId: params.projectId, status: { in: ['DRAFT', 'SENT'] } },
        select: { id: true, amount: true },
      })
      if (invoices.length > 0) {
        const total = invoices.reduce((s, i) => s + Number(i.amount), 0)
        findings.push(`${invoices.length} pending invoice(s) totalling £${total.toLocaleString()} depend on this project`)
        affected.push(...invoices.map(i => i.id))
      }
    }
  }

  const severity: SimulationResult['impact']['severity'] =
    affected.length > 15 ? 'CRITICAL' : affected.length > 8 ? 'HIGH' : affected.length > 3 ? 'MEDIUM' : 'LOW'

  return {
    type: 'DEPENDENCY_CHAIN',
    scenario: params.scenario,
    findings,
    impact: {
      severity,
      headline: `${affected.length} downstream items depend on this`,
      numeric: affected.length,
      unit: 'dependent items',
    },
    affectedIds: affected,
    confidence: 80,
    simulatedAt: new Date(),
  }
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

export async function runSimulation(
  type: SimulationType,
  params: Record<string, any>,
): Promise<SimulationResult> {
  switch (type) {
    case 'REVENUE_IMPACT':    return simulateRevenueImpact(params as any)
    case 'CAPACITY_IMPACT':   return simulateCapacityImpact(params as any)
    case 'RISK_PROPAGATION':  return simulateRiskPropagation(params as any)
    case 'DEPENDENCY_CHAIN':  return simulateDependencyChain(params as any)
    default:
      throw new Error(`Unknown simulation type: ${type}`)
  }
}
