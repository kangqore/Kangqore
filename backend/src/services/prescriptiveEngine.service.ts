// Layer 3 — Prescriptive Intelligence: "What should happen?"
//
// Reads Layer 1 + Layer 2 outputs in a single pass, generates ranked
// PrescriptiveRecommendation rows, and surfaces the top N for the UI.
//
// Recommendation types map 1:1 to executable OntologyActions where an action
// exists — actionId is set so the UI can offer one-click execution.

import { prisma } from '../lib/prisma'
import { IntelligenceSignalEngine } from './intelligenceSignalEngine.service'
import { PredictiveEngine } from './predictiveEngine.service'

export type RecommendationType =
  | 'REALLOCATE_RESOURCES'
  | 'ESCALATE_ISSUE'
  | 'CONTACT_CUSTOMER'
  | 'REBALANCE_WORKLOAD'
  | 'CHANGE_PRIORITY'
  | 'APPROVE_PROCUREMENT'
  | 'RESCHEDULE_DEADLINE'
  | 'ASSIGN_BACKUP'
  | 'TRIGGER_RENEWAL_PLAY'

interface RecommendationInput {
  priority: number
  type: RecommendationType
  title: string
  rationale: string
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  entityType?: string
  entityId?: string
  entityName?: string
  metadata?: Record<string, any>
}

// Resolve OntologyAction.id by name (best-effort — null if action not seeded)
async function resolveActionId(name: string): Promise<string | null> {
  const a = await prisma.ontologyAction.findFirst({ where: { name }, select: { id: true } })
  return a?.id ?? null
}

async function persist(inputs: RecommendationInput[]): Promise<void> {
  for (const r of inputs) {
    const actionId = await resolveActionId(r.type)
    await (prisma as any).prescriptiveRecommendation.upsert({
      where: {
        // deduplicate: same type + same entity within PENDING status
        // Prisma doesn't support compound unique here, so use findFirst pattern
        id: '__noop__',
      },
      create: {},
      update: {},
    }).catch(() => {})

    // findFirst deduplicate — avoid flooding DB with same recommendation
    const existing = await (prisma as any).prescriptiveRecommendation.findFirst({
      where: {
        type: r.type,
        entityId: r.entityId ?? null,
        status: 'PENDING',
      },
    })
    if (existing) continue  // already surfaced and not yet acted on

    await (prisma as any).prescriptiveRecommendation.create({
      data: {
        priority: r.priority,
        type: r.type,
        title: r.title,
        rationale: r.rationale,
        impact: r.impact,
        entityType: r.entityType,
        entityId: r.entityId,
        entityName: r.entityName,
        actionId,
        metadata: r.metadata ?? {},
      },
    })
  }
}

// ── Signal → Recommendation mapping ─────────────────────────────────────────

async function fromDescriptive(): Promise<RecommendationInput[]> {
  const snap = await IntelligenceSignalEngine.computeDescriptive()
  const recs: RecommendationInput[] = []

  // Critical / overdue projects → escalate
  for (const p of snap.projects.filter(p => p.severity === 'CRITICAL' || p.flag === 'OVERDUE')) {
    recs.push({
      priority: 1,
      type: 'ESCALATE_ISSUE',
      title: `Escalate "${p.title}" — ${p.flag}`,
      rationale: `Project is ${p.flag.toLowerCase()} (health ${p.health}%, ${p.daysUntilDue !== null ? `${Math.abs(p.daysUntilDue)}d ${p.daysUntilDue < 0 ? 'overdue' : 'left'}` : 'no due date'}). Immediate senior intervention required.`,
      impact: 'CRITICAL',
      entityType: 'Project',
      entityId: p.id,
      entityName: p.title,
      metadata: { flag: p.flag, health: p.health, daysUntilDue: p.daysUntilDue },
    })
  }

  // At-risk clients → customer contact
  for (const c of snap.clients.filter(c => c.severity !== 'LOW')) {
    recs.push({
      priority: c.severity === 'CRITICAL' ? 1 : 2,
      type: 'CONTACT_CUSTOMER',
      title: `Contact ${c.name} — ${c.flag}`,
      rationale: `Customer health tier: ${c.tier}, OIS delta ${c.oisDelta > 0 ? '+' : ''}${c.oisDelta}. Renewal in ${c.renewalProximityDays}d. CSM outreach needed within 48h.`,
      impact: c.severity as any,
      entityType: 'Customer',
      entityId: c.id,
      entityName: c.name,
      metadata: { tier: c.tier, oisDelta: c.oisDelta, renewalDays: c.renewalProximityDays },
    })
  }

  // Overloaded staff → rebalance
  for (const t of snap.teams.filter(t => t.severity !== 'LOW')) {
    recs.push({
      priority: 2,
      type: 'REBALANCE_WORKLOAD',
      title: `Rebalance ${t.name}'s workload (${t.utilization}% utilization)`,
      rationale: `${t.name} (${t.role}, ${t.department}) is ${t.flag.toLowerCase()} with ${t.allocations} active allocations at ${t.utilization}% utilization.`,
      impact: t.severity as any,
      entityType: 'StaffMember',
      entityId: t.id,
      entityName: t.name,
      metadata: { utilization: t.utilization, allocations: t.allocations },
    })
  }

  // SLA breaches → escalate
  for (const s of snap.sla.filter(s => s.severity === 'CRITICAL' || s.breached)) {
    recs.push({
      priority: 1,
      type: 'ESCALATE_ISSUE',
      title: `${s.breached ? 'SLA BREACHED' : 'SLA at risk'}: ${s.title ?? s.metric}`,
      rationale: `${s.flag}: ${s.title ?? s.metric} — status ${s.status}. Breach requires immediate escalation and customer notification.`,
      impact: 'CRITICAL',
      entityType: 'SlaIncident',
      entityId: s.id,
      entityName: s.title ?? s.metric,
      metadata: { breached: s.breached, priority: s.priority },
    })
  }

  return recs
}

async function fromPredictive(): Promise<RecommendationInput[]> {
  const snap = await PredictiveEngine.computePredictions()
  const recs: RecommendationInput[] = []

  // High miss-probability → reschedule or reallocate
  for (const d of snap.deadlinePredictions.filter(d => d.severity !== 'LOW')) {
    const type: RecommendationType = d.missProb > 0.7 ? 'RESCHEDULE_DEADLINE' : 'REALLOCATE_RESOURCES'
    recs.push({
      priority: d.severity === 'CRITICAL' ? 1 : 2,
      type,
      title: `${type === 'RESCHEDULE_DEADLINE' ? 'Reschedule' : 'Add resources to'} "${d.title}" (${Math.round(d.missProb * 100)}% miss risk)`,
      rationale: `At current velocity (${d.velocityPerDay} pts/day), project is ${d.progressDeficit}% behind schedule. ${d.estimatedCompletionDays ? `ETA: ${d.estimatedCompletionDays}d, but deadline is in ${d.daysLeft}d.` : 'Completion timeline indeterminate.'} Confidence: ${d.confidence}.`,
      impact: d.severity as any,
      entityType: 'Project',
      entityId: d.projectId,
      entityName: d.title,
      metadata: { missProb: d.missProb, velocityPerDay: d.velocityPerDay, daysLeft: d.daysLeft },
    })
  }

  // Churn risk → renewal play
  for (const c of snap.churnPredictions.filter(c => c.severity !== 'LOW')) {
    recs.push({
      priority: c.severity === 'CRITICAL' ? 1 : 2,
      type: 'TRIGGER_RENEWAL_PLAY',
      title: `Trigger renewal play for ${c.customerName ?? c.customerId}`,
      rationale: `Renewal likelihood: ${c.renewalLikelihood}%. Health tier: ${c.healthTier ?? 'unknown'}. ${c.riskFactors.length > 0 ? `Risk factors: ${c.riskFactors.slice(0, 2).join(', ')}.` : ''} ${c.daysUntilRenewal}d until renewal.`,
      impact: c.severity as any,
      entityType: 'Customer',
      entityId: c.customerId,
      entityName: c.customerName,
      metadata: { renewalLikelihood: c.renewalLikelihood, riskFactors: c.riskFactors },
    })
  }

  // Projected overload → assign backup
  for (const o of snap.overloadPredictions.filter(o => o.severity !== 'LOW')) {
    recs.push({
      priority: 2,
      type: 'ASSIGN_BACKUP',
      title: `Assign backup for ${o.name} (projected ${o.projectedUtilization}%)`,
      rationale: `${o.name} (${o.role}) has ${o.upcomingAllocations} allocations in ${o.riskWindow} totalling ${o.hoursPerWeekCommitted}h/week. Current utilization: ${o.currentUtilization}%. Projected: ${o.projectedUtilization}%.`,
      impact: o.severity as any,
      entityType: 'StaffMember',
      entityId: o.staffId,
      entityName: o.name,
      metadata: { projectedUtilization: o.projectedUtilization, hoursPerWeekCommitted: o.hoursPerWeekCommitted },
    })
  }

  return recs
}

// ── Public API ───────────────────────────────────────────────────────────────

export const PrescriptiveEngine = {

  async generateRecommendations(): Promise<{ generated: number }> {
    const [desc, pred] = await Promise.all([fromDescriptive(), fromPredictive()])
    const all = [...desc, ...pred].sort((a, b) => a.priority - b.priority)
    await persist(all)
    return { generated: all.length }
  },

  async listRecommendations(filter?: { status?: string; impact?: string; limit?: number }) {
    return (prisma as any).prescriptiveRecommendation.findMany({
      where: {
        status: filter?.status ?? 'PENDING',
        ...(filter?.impact ? { impact: filter.impact } : {}),
      },
      orderBy: [{ priority: 'asc' }, { impact: 'asc' }, { createdAt: 'asc' }],
      take: filter?.limit ?? 20,
    })
  },

  async accept(id: string, userId: string): Promise<any> {
    return (prisma as any).prescriptiveRecommendation.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    })
  },

  async dismiss(id: string, userId: string, reason?: string): Promise<any> {
    return (prisma as any).prescriptiveRecommendation.update({
      where: { id },
      data: { status: 'DISMISSED', dismissedBy: userId, dismissReason: reason ?? null },
    })
  },

  async expire(): Promise<void> {
    // Mark PENDING recommendations older than 7 days as EXPIRED
    const cutoff = new Date(Date.now() - 86_400_000 * 7)
    await (prisma as any).prescriptiveRecommendation.updateMany({
      where: { status: 'PENDING', createdAt: { lt: cutoff } },
      data: { status: 'EXPIRED' },
    })
  },
}
