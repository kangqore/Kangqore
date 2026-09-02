// The last link: Decision → Governed Action → Outcome.
//
// DecisionEngine produces an outcome-risk assessment — exposure, ranked threats,
// recommended actions. On its own that is a report. This turns it into a
// mission, so "Execute recovery plan?" runs through the machinery Phase 6
// already built: HANUMANAS policy, human approval, ActionEngine execution, and a
// verification pass that re-measures whether the risk actually fell.
//
// The reason to route through AgentMissionEngine rather than executing directly:
// a recommendation that reassigns people or moves committed dates is exactly the
// class of change that must not happen because a dashboard suggested it. The
// mission is durable, so the plan survives the hours or days between being
// proposed and being approved.

import { prisma } from '../../lib/prisma'
import { DecisionEngine, OutcomeAssessment } from './DecisionEngine'
import { IntelligenceEngine } from './IntelligenceEngine'

export interface RecoveryPlan {
  missionId: string
  status: string
  assessment: OutcomeAssessment
  proposedCount: number
}

/**
 * Map a recommendation onto one of the four registered recovery actions
 * (see RecoveryActionSeeder). Deliberately conservative: an unrecognised
 * recommendation becomes a non-mutating review rather than a guess, because
 * guessing which action a sentence means is how automation does damage.
 */
function actionNameFor(recommendation: string): string {
  const r = recommendation.toLowerCase()
  if (/re-baseline|move the date|extend|timeline/.test(r)) return 'REBASELINE_TIMELINE'
  if (/add capacity|reassign|resource|staff/.test(r))      return 'FLAG_CAPACITY_REQUEST'
  if (/escalate|resolve|unblock|gates this|blocker/.test(r)) return 'ESCALATE_ITEM'
  return 'REVIEW_ITEM'
}

/** The parameters each action needs, drawn from the assessment — never invented. */
function paramsFor(actionName: string, recommendation: string, rationale: string, forecast: string | null) {
  switch (actionName) {
    case 'REBASELINE_TIMELINE':
      // Only meaningful with a forecast date. Callers downgrade to REVIEW_ITEM
      // when there is none, rather than moving a date to a made-up value.
      return { newDueDate: forecast, recommendation }
    case 'ESCALATE_ITEM':
    case 'FLAG_CAPACITY_REQUEST':
      return { reason: rationale }
    default:
      return { recommendation }
  }
}

export const RecoveryPlanService = {
  /**
   * Assess an outcome and stage the recovery as a mission awaiting approval.
   * Nothing is changed by this call.
   */
  async propose(args: { targetId?: string; typeName?: string; actorId: string; tenantId?: string }): Promise<RecoveryPlan> {
    const assessment = await DecisionEngine.assess({
      targetId: args.targetId,
      typeName: args.typeName,
    })

    const label = assessment.target?.title ?? assessment.scope
    const mission = await prisma.agentMission.create({
      data: {
        intentText: `Recover outcome: ${label}`,
        actorId: args.actorId,
        tenantId: args.tenantId ?? 'default',
        status: 'PLANNING',
        goal: { objective: 'RECOVER_OUTCOME', entity: 'OUTCOME', mutating: true, rawIntent: label } as any,
        contextSummary: {
          contributorsExamined: assessment.summary.contributorsExamined,
          atRisk: assessment.summary.atRisk,
        } as any,
        findings: {
          exposure: assessment.exposure,
          threats: assessment.threats.slice(0, 10).map(t => ({
            objectId: t.objectId, title: t.title, risk: t.predictedRisk,
            exposure: t.exposure, cause: t.rootCause,
          })),
          caveat: assessment.caveat,
        } as any,
      },
    })

    let ordinal = 0
    const step = (stage: string, title: string, detail: string, data?: any) =>
      prisma.agentMissionStep.create({
        data: { missionId: mission.id, ordinal: ++ordinal, stage, title, detail, data: data ?? undefined },
      })

    await step('INTERPRET', 'Assess outcome risk',
      `Assessed ${assessment.scope}.`, { target: assessment.target })
    await step('RESOLVE_CONTEXT', 'Walk the contribution graph',
      `Examined ${assessment.summary.contributorsExamined} contributor(s) reachable from the target.`,
      assessment.summary)
    await step('ANALYZE', 'Score every contributor',
      assessment.exposure.quantified > 0
        ? `${assessment.summary.atRisk} at risk, ${assessment.exposure.quantified.toLocaleString()} of value exposed.`
        : `${assessment.summary.atRisk} at risk. No exposure could be priced.`,
      { threats: assessment.threats, confidence: assessment.confidence })

    if (assessment.caveat) {
      await step('DIAGNOSE', 'Limits of this assessment', assessment.caveat)
    }

    // ── Proposals ────────────────────────────────────────────────────────────
    if (!assessment.recommendedActions.length) {
      await step('PROPOSE', 'Nothing to recommend',
        'No contributor is at risk, so there is no recovery to plan.')
      await prisma.agentMission.update({
        where: { id: mission.id },
        data: { status: 'NO_ACTION', completedAt: new Date(), plannedAt: new Date() },
      })
      return { missionId: mission.id, status: 'NO_ACTION', assessment, proposedCount: 0 }
    }

    // Risk at proposal time, so verify() can later measure movement rather than
    // assert it. Without this the verification step would be decorative.
    const riskAtProposal = new Map(assessment.threats.map(t => [t.objectId, t.predictedRisk]))

    // Forecast dates come from the Intelligence layer, so a re-baseline moves a
    // date to a computed value rather than an arbitrary one.
    const forecasts = new Map<string, string | null>()
    for (const r of assessment.recommendedActions) {
      if (forecasts.has(r.targetObjectId)) continue
      const inf = await IntelligenceEngine.infer(r.targetObjectId)
      forecasts.set(r.targetObjectId, inf?.predictedCompletion ?? null)
    }

    const proposals = assessment.recommendedActions.map((r, i) => {
      const forecast = forecasts.get(r.targetObjectId) ?? null
      let actionName = actionNameFor(r.action)
      // A re-baseline with nothing to re-baseline to is a review, not a guess.
      if (actionName === 'REBASELINE_TIMELINE' && !forecast) actionName = 'REVIEW_ITEM'

      return {
        missionId: mission.id,
        ordinal: i + 1,
        actionName,
        params: {
          ...paramsFor(actionName, r.action, r.rationale, forecast),
          objectId: r.targetObjectId,
          _riskBefore: riskAtProposal.get(r.targetObjectId) ?? null,
        } as any,
        targetType: 'OntologyObject',
        targetId: r.targetObjectId,
        rationale: `${r.targetTitle} — ${r.rationale}`,
        expectedImpact: r.protects !== null
          ? `Protects ${r.protects.toLocaleString()} of exposed value.`
          : 'Value at stake could not be priced.',
        status: 'PROPOSED',
      }
    })
    await prisma.agentProposedAction.createMany({ data: proposals })

    await step('PROPOSE', 'Recommend a recovery plan',
      `Proposed ${proposals.length} change(s), each bound to a real object.`,
      { proposals: proposals.map(p => ({ actionName: p.actionName, targetId: p.targetId })) })

    // ── Approval gate ────────────────────────────────────────────────────────
    // A recovery plan always requires a human. It moves dates and people.
    await step('POLICY', 'Evaluate governance',
      'Recovery plans modify committed dates and assignments, so human approval is always required.',
      { requiresApproval: true })
    await step('APPROVAL', 'Awaiting approval',
      `Holding ${proposals.length} change(s). Nothing has been modified.`)

    await prisma.agentMission.update({
      where: { id: mission.id },
      data: { status: 'AWAITING_APPROVAL', plannedAt: new Date() },
    })
    await prisma.agentProposedAction.updateMany({
      where: { missionId: mission.id }, data: { status: 'AWAITING_APPROVAL' },
    })

    return {
      missionId: mission.id,
      status: 'AWAITING_APPROVAL',
      assessment,
      proposedCount: proposals.length,
    }
  },

  /**
   * Verify a completed recovery: re-run inference on the objects that were
   * touched and report whether risk actually fell. The Outcome step — did the
   * action produce the intended result, rather than merely execute.
   */
  async verify(missionId: string) {
    const actions = await prisma.agentProposedAction.findMany({
      where: { missionId, status: 'EXECUTED' },
    })
    if (!actions.length) return { missionId, verified: 0, improved: 0, outcomes: [] }

    const outcomes = []
    for (const a of actions) {
      if (!a.targetId) continue
      const raw = (a.params as any)?._riskBefore
      const before = typeof raw === 'number' ? raw : null
      const now = await IntelligenceEngine.infer(a.targetId)
      if (!now) continue
      outcomes.push({
        objectId: a.targetId,
        title: now.title,
        riskBefore: before,
        riskAfter: now.predictedRisk,
        improved: before !== null ? now.predictedRisk < before : null,
        rootCause: now.rootCause,
      })
    }

    const improved = outcomes.filter(o => o.improved === true).length
    await prisma.agentMission.update({
      where: { id: missionId },
      data: { verification: { outcomes, improved, verified: outcomes.length } as any },
    }).catch(() => null)

    return { missionId, verified: outcomes.length, improved, outcomes }
  },
}
