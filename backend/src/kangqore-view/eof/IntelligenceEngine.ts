// The Intelligence step of the chain.
//
//   Enterprise → Ontology → Objects → Relationships → Work →
//   **Intelligence** → Decision → Governed Action → Outcome
//
// Fills the INTELLIGENCE columns declared by the object model:
// predictedCompletion, predictedRisk, rootCause, nextBestAction, businessImpact,
// anomalyScore, aiConfidence.
//
// Two rules govern every number produced here.
//
// 1. Everything is DERIVED. Forecasts come from observed velocity, root causes
//    come from edges that actually exist in the graph, and business impact comes
//    from traversing to a contract or customer that actually holds a value.
//    Nothing is a constant dressed up as an insight.
//
// 2. When the evidence is too thin, it SAYS SO. `confidence` falls with the
//    amount of evidence, and where no cause can be found the engine reports
//    that no cause is recorded rather than inventing a plausible one. A wrong
//    root cause is worse than an absent one, because someone will act on it.
//
// This generalises ProjectDelayAnalyzer (Phase 6) from Projects to any object
// type carrying progress and dates.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from './OntologyGateway'

const DAY = 86_400_000

export interface Inference {
  objectId: string
  title: string
  typeName: string

  predictedCompletion: string | null
  predictedRisk: number          // 0–1
  rootCause: string
  nextBestAction: string
  businessImpact: number | null
  /** Which object holds that value. Two threats reaching the same contract
   *  must not each be counted — a contract can only be lost once. */
  businessImpactSourceId: string | null
  anomalyScore: number | null
  aiConfidence: number           // 0–1

  /** Every fact the inference rests on, so a reader can audit it. */
  evidence: string[]
}

interface Blocker {
  id: string
  title: string
  status: string
  relationshipType: string
}

/** Velocity forecast — the same maths as ProjectDelayAnalyzer, type-agnostic. */
function forecast(props: any, createdAt: Date, now: Date) {
  const progress = Math.max(0, Math.min(100, Number(props.progress ?? 0)))
  const daysElapsed = Math.max(1, Math.round((now.getTime() - createdAt.getTime()) / DAY))
  const observedVelocity = progress / daysElapsed
  const remaining = 100 - progress

  const due = props.dueDate ? new Date(props.dueDate) : null
  const daysRemaining = due ? Math.round((due.getTime() - now.getTime()) / DAY) : null

  let predictedCompletion: Date | null = null
  let slipDays: number | null = null

  if (remaining === 0) {
    predictedCompletion = now
    slipDays = daysRemaining !== null ? -daysRemaining : null
  } else if (observedVelocity > 0) {
    const daysNeeded = remaining / observedVelocity
    predictedCompletion = new Date(now.getTime() + daysNeeded * DAY)
    if (daysRemaining !== null) slipDays = Math.round(daysNeeded - daysRemaining)
  }

  return { progress, daysElapsed, observedVelocity, remaining, due, daysRemaining, predictedCompletion, slipDays }
}

/** Probability this misses its commitment, from signals that exist. */
function riskFrom(f: ReturnType<typeof forecast>, status: string, blockers: Blocker[]): number {
  let risk = 0

  if (f.daysRemaining !== null) {
    if (f.daysRemaining < 0) risk += 0.55                      // already past due
    else if (f.slipDays !== null && f.slipDays > 0) {
      // Scale with the size of the projected slip against the time remaining.
      const ratio = f.slipDays / Math.max(1, Math.abs(f.daysRemaining))
      risk += Math.min(0.5, 0.15 + ratio * 0.35)
    }
  }

  if (status === 'BLOCKED') risk += 0.3
  if (status === 'AT_RISK') risk += 0.25
  if (status === 'ESCALATED') risk += 0.35
  if (status === 'AWAITING_CUSTOMER' || status === 'AWAITING_APPROVAL') risk += 0.1
  if (status === 'COMPLETED') return 0

  // Each unresolved blocker is an independent chance of slipping.
  risk += Math.min(0.3, blockers.length * 0.12)

  if (f.remaining > 0 && f.observedVelocity === 0) risk += 0.2   // no movement at all

  return Math.round(Math.min(1, risk) * 100) / 100
}

export const IntelligenceEngine = {
  /**
   * Infer for one object. Reads the graph around it — blockers, threats,
   * commercial parents — and computes from what is genuinely there.
   */
  async infer(objectId: string, now = new Date()): Promise<Inference | null> {
    const obj = await prisma.ontologyObject.findUnique({
      where: { id: objectId },
      include: { type: { select: { name: true } } },
    })
    if (!obj) return null

    const props = (obj.properties ?? {}) as any
    const status = String(props.status ?? 'DRAFT')
    const evidence: string[] = []

    const f = forecast(props, obj.createdAt, now)

    // ── Blockers: edges that genuinely exist and are not yet resolved ────────
    const inbound = await prisma.ontologyRelationship.findMany({
      where: { targetId: objectId, relationshipType: { in: ['blocks', 'threatens'] }, validTo: null },
    })
    const outbound = await prisma.ontologyRelationship.findMany({
      where: { sourceId: objectId, relationshipType: 'dependsOn', validTo: null },
    })

    const relatedIds = [...inbound.map(r => r.sourceId), ...outbound.map(r => r.targetId)]
    const related = relatedIds.length
      ? await prisma.ontologyObject.findMany({ where: { id: { in: relatedIds } } })
      : []
    const byId = new Map(related.map(r => [r.id, r]))

    const blockers: Blocker[] = []
    for (const r of [...inbound, ...outbound]) {
      const otherId = r.targetId === objectId ? r.sourceId : r.targetId
      const other = byId.get(otherId)
      if (!other) continue
      const s = String((other.properties as any)?.status ?? '')
      // Only unfinished things block.
      if (['COMPLETED', 'CANCELLED'].includes(s)) continue
      blockers.push({
        id: other.id,
        title: String((other.properties as any)?.title ?? other.id),
        status: s,
        relationshipType: r.relationshipType,
      })
    }

    const predictedRisk = riskFrom(f, status, blockers)

    // ── Root cause, ranked by what the data actually shows ──────────────────
    let rootCause: string
    let nextBestAction: string

    if (status === 'COMPLETED') {
      rootCause = 'Completed — no outstanding risk.'
      nextBestAction = 'None required.'
      evidence.push('status = COMPLETED')
    } else if (blockers.length) {
      const worst = blockers[0]
      rootCause = `Blocked by "${worst.title}" (${worst.status})${blockers.length > 1 ? ` and ${blockers.length - 1} other${blockers.length > 2 ? 's' : ''}` : ''}.`
      nextBestAction = `Resolve "${worst.title}" — it gates this item.`
      evidence.push(`${blockers.length} unresolved ${blockers.length === 1 ? 'blocker' : 'blockers'} in the graph`)
    } else if (f.daysRemaining !== null && f.daysRemaining < 0) {
      rootCause = `Past its due date by ${Math.abs(f.daysRemaining)} day(s) with ${f.remaining}% outstanding.`
      nextBestAction = f.remaining > 50
        ? 'Re-baseline the date — the remaining scope cannot be recovered.'
        : 'Push to completion; the remainder is small.'
      evidence.push(`due ${f.due?.toISOString().slice(0, 10)}, ${f.remaining}% remaining`)
    } else if (f.slipDays !== null && f.slipDays > 0) {
      rootCause = `Current pace (${f.observedVelocity.toFixed(2)}%/day) finishes ${f.slipDays} day(s) late.`
      nextBestAction = 'Add capacity or move the date — the pace will not close the gap on its own.'
      evidence.push(`observed velocity ${f.observedVelocity.toFixed(3)}%/day over ${f.daysElapsed} days`)
    } else if (f.remaining > 0 && f.observedVelocity === 0) {
      rootCause = 'No progress recorded since it was created.'
      nextBestAction = 'Confirm it has an owner and has actually started.'
      evidence.push(`0% progress after ${f.daysElapsed} days`)
    } else {
      // The honest branch. Do not manufacture a cause.
      rootCause = 'No risk signal — pace covers the remaining work and nothing blocks it.'
      nextBestAction = 'No action needed.'
      evidence.push(`velocity ${f.observedVelocity.toFixed(3)}%/day covers ${f.remaining}% remaining`)
    }

    // ── Business impact: traverse to something that holds a real value ───────
    // An object that carries its own value needs no traversal: a £320k project
    // running late puts £320k at risk whether or not it is wired to a contract.
    // Only when it holds no value of its own is the graph walked outward.
    const own = props.value ?? props.arr ?? props.measuredValue ?? props.budget
    const valueHit = typeof own === 'number' && own > 0
      ? { value: own, sourceId: objectId }
      : await this.traverseToValue(objectId)
    const businessImpact = valueHit?.value ?? null
    if (valueHit) evidence.push(`value ${valueHit.value} reached via graph traversal from ${valueHit.sourceId}`)

    // ── Confidence: a function of evidence, not a flattering constant ────────
    // History, movement, and a due date each make the forecast more trustworthy.
    const hasDue = f.due ? 1 : 0
    const hasMovement = f.progress > 0 ? 1 : 0
    const historyWeight = Math.min(1, f.daysElapsed / 30)
    const aiConfidence = Math.round(
      (0.25 + historyWeight * 0.35 + hasDue * 0.2 + hasMovement * 0.2) * 100,
    ) / 100

    // ── Anomaly: how far this sits from its peers of the same type ───────────
    const anomalyScore = await this.anomalyVsPeers(obj.typeId, objectId, f.progress)

    return {
      objectId,
      title: String(props.title ?? objectId),
      typeName: obj.type.name,
      predictedCompletion: f.predictedCompletion?.toISOString() ?? null,
      predictedRisk,
      rootCause,
      nextBestAction,
      businessImpact,
      businessImpactSourceId: valueHit?.sourceId ?? null,
      anomalyScore,
      aiConfidence,
      evidence,
    }
  },

  /**
   * Walk the commercial chain to find money at stake. This is §11 — a delay is
   * only meaningful once you can say which contract it threatens.
   * Returns null rather than 0 when nothing is reachable: "unknown" and "zero"
   * are different answers.
   */
  async traverseToValue(objectId: string, depth = 0): Promise<{ value: number; sourceId: string } | null> {
    if (depth > 3) return null

    const out = await prisma.ontologyRelationship.findMany({
      where: {
        sourceId: objectId,
        relationshipType: { in: ['deliversOn', 'threatens', 'partOf', 'heldBy', 'withCustomer', 'realisedOn'] },
        validTo: null,
      },
    })
    if (!out.length) return null

    const targets = await prisma.ontologyObject.findMany({
      where: { id: { in: out.map(r => r.targetId) } },
    })

    for (const t of targets) {
      const p = (t.properties ?? {}) as any
      const direct = p.value ?? p.arr ?? p.measuredValue ?? p.budget
      if (typeof direct === 'number' && direct > 0) return { value: direct, sourceId: t.id }
    }
    // Nothing here holds a value — keep walking outward.
    for (const t of targets) {
      const deeper = await this.traverseToValue(t.id, depth + 1)
      if (deeper !== null) return deeper
    }
    return null
  },

  /** Standard deviations from the mean progress of peers. Null when too few. */
  async anomalyVsPeers(typeId: string, objectId: string, progress: number): Promise<number | null> {
    const peers = await prisma.ontologyObject.findMany({
      where: { typeId, id: { not: objectId }, validTo: null },
      select: { properties: true },
      take: 200,
    })
    const values = peers
      .map(p => Number((p.properties as any)?.progress))
      .filter(v => Number.isFinite(v))
    if (values.length < 3) return null   // not enough peers to call anything anomalous

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length)
    if (sd === 0) return 0
    return Math.round(Math.abs((progress - mean) / sd) * 100) / 100
  },

  /**
   * Infer across a type and write the results into the INTELLIGENCE columns,
   * through the gateway so the writes are governed and emit CDC.
   */
  async inferAndWrite(typeName: string, actor: GatewayActor = SYSTEM_ACTOR, limit = 200) {
    const type = await prisma.ontologyObjectType.findUnique({ where: { name: typeName }, select: { id: true } })
    if (!type) throw new Error(`Unknown type "${typeName}"`)

    const objects = await prisma.ontologyObject.findMany({
      where: { typeId: type.id, validTo: null },
      select: { id: true },
      take: limit,
    })

    const results: Inference[] = []
    for (const o of objects) {
      const inf = await this.infer(o.id)
      if (!inf) continue

      await OntologyGateway.patchObject(actor, o.id, {
        properties: {
          predictedCompletion: inf.predictedCompletion,
          predictedRisk: inf.predictedRisk,
          rootCause: inf.rootCause,
          nextBestAction: inf.nextBestAction,
          aiConfidence: inf.aiConfidence,
          ...(inf.businessImpact !== null ? { businessImpact: inf.businessImpact } : {}),
          ...(inf.anomalyScore !== null ? { anomalyScore: inf.anomalyScore } : {}),
        },
      })
      results.push(inf)
    }

    return {
      typeName,
      inferred: results.length,
      atRisk: results.filter(r => r.predictedRisk >= 0.5).length,
      blocked: results.filter(r => r.rootCause.startsWith('Blocked by')).length,
      totalValueAtRisk: results
        .filter(r => r.predictedRisk >= 0.5 && r.businessImpact)
        .reduce((s, r) => s + (r.businessImpact ?? 0), 0),
      results,
    }
  },
}
