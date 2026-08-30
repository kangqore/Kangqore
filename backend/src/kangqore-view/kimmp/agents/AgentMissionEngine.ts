// Phase 6 — Agents as the Primary UX.
//
//   intent → context → analysis → diagnosis → simulation → proposal →
//   policy → approval → execution → verification
//
// The mission is persisted at every stage rather than computed in one call,
// because the pipeline *pauses* at approval and may resume hours later in a
// different process. `plan()` runs up to the approval gate and stops.
// `approve()` then `execute()` resumes it. Nothing executes without a decision
// having been recorded.
//
// Every figure a stage reports is computed from real records. Where the data
// cannot support a conclusion, the stage says so rather than inventing one —
// this replaced a service that returned a fixed narrative about a project id
// that did not exist.

import { prisma } from '../../../lib/prisma'
import { checkPolicy } from '../../esf/PolicyEngine'
import { ActionEngine } from '../../automation/ActionEngine'
import { ProjectDelayAnalyzer, ProjectForecast, AT_RISK_BANDS } from './ProjectDelayAnalyzer'

export type MissionStage =
  | 'INTERPRET' | 'RESOLVE_CONTEXT' | 'ANALYZE' | 'DIAGNOSE' | 'SIMULATE'
  | 'PROPOSE' | 'POLICY' | 'APPROVAL' | 'EXECUTE' | 'VERIFY'

export interface MissionGoal {
  /** What the user wants done, normalised. */
  objective: 'RECOVER_AT_RISK_PROJECTS' | 'REPORT_STATUS' | 'UNKNOWN'
  entity: 'PROJECT'
  /** Whether the user asked for changes or only for information. */
  mutating: boolean
  /** Constraint extracted from the phrasing, e.g. a specific project name. */
  filter?: { titleContains?: string }
  rawIntent: string
}

/**
 * Deterministic intent parsing.
 *
 * Deliberately rule-based rather than LLM-backed: the classification decides
 * whether the pipeline is allowed to mutate anything, so it must be inspectable
 * and must not vary run to run. An LLM pass belongs *after* this, to enrich a
 * goal that has already been safely classified — not to decide the safety
 * question itself.
 */
export function interpretIntent(intentText: string): MissionGoal {
  const t = intentText.toLowerCase()

  const mentionsRisk =
    /\b(miss|missing|late|overdue|slip|behind|deadline|at risk|at-risk|delay)\b/.test(t)
  const wantsChange =
    /\b(fix|resolve|recover|correct|sort|rescue|unblock|reassign|repair)\b/.test(t)
  const wantsReport =
    /\b(show|list|report|which|what|status|tell me|summar)\b/.test(t)

  // Pull a quoted or "for X" project name if the user named one.
  const quoted = intentText.match(/["“']([^"”']{3,60})["”']/)?.[1]
  const forNamed = intentText.match(/\bfor\s+([A-Z][\w'’\- ]{2,40})/)?.[1]
  const titleContains = (quoted || forNamed)?.trim()

  let objective: MissionGoal['objective'] = 'UNKNOWN'
  if (mentionsRisk && wantsChange) objective = 'RECOVER_AT_RISK_PROJECTS'
  else if (mentionsRisk) objective = 'REPORT_STATUS'
  else if (wantsReport) objective = 'REPORT_STATUS'

  return {
    objective,
    entity: 'PROJECT',
    mutating: objective === 'RECOVER_AT_RISK_PROJECTS',
    filter: titleContains ? { titleContains } : undefined,
    rawIntent: intentText,
  }
}

async function addStep(
  missionId: string,
  ordinal: number,
  stage: MissionStage,
  title: string,
  detail: string,
  data?: unknown,
  durationMs?: number,
) {
  await prisma.agentMissionStep.create({
    data: { missionId, ordinal, stage, title, detail, data: (data ?? undefined) as any, durationMs },
  })
}

/** Scenario modelling driven by the forecast, not by hand-written outcomes. */
function buildScenarios(forecasts: ProjectForecast[]) {
  const totalSlip = forecasts.reduce((s, f) => s + Math.max(0, f.projectedSlipDays ?? 0), 0)
  const avgConfidence =
    forecasts.length ? forecasts.reduce((s, f) => s + f.confidence, 0) / forecasts.length : 0

  // Adding capacity raises achievable velocity; the resulting slip is recomputed
  // from each project's own remaining work rather than assumed.
  const withUplift = (factor: number) =>
    forecasts.reduce((sum, f) => {
      if (!f.dueDate || f.projectedSlipDays === null) return sum
      const remaining = 100 - f.progress
      const v = f.observedVelocity * factor
      if (v <= 0) return sum + Math.max(0, f.projectedSlipDays)
      const days = remaining / v
      return sum + Math.max(0, Math.round(days - (f.daysRemaining ?? 0)))
    }, 0)

  const scenarios = [
    {
      name: 'No intervention',
      description: 'Continue at the currently observed delivery pace.',
      projectedTotalSlipDays: totalSlip,
      capacityChange: '0%',
      recommended: false,
    },
    {
      name: 'Add 50% delivery capacity',
      description: 'Reallocate people onto the at-risk projects, raising pace by half.',
      projectedTotalSlipDays: withUplift(1.5),
      capacityChange: '+50%',
      recommended: false,
    },
    {
      name: 'Double delivery capacity',
      description: 'Significant reallocation onto the at-risk projects.',
      projectedTotalSlipDays: withUplift(2),
      capacityChange: '+100%',
      recommended: false,
    },
    {
      name: 'Re-baseline the dates',
      description: 'Accept the forecast and move the committed dates to match it.',
      projectedTotalSlipDays: 0,
      capacityChange: '0% (dates move instead)',
      recommended: false,
    },
  ]

  // Recommend the cheapest option that removes most of the slip; if capacity
  // cannot close the gap, re-baselining is the honest recommendation.
  const capacityOptions = scenarios.filter(s => s.capacityChange.startsWith('+'))
  const best = capacityOptions.find(s => s.projectedTotalSlipDays <= Math.max(2, totalSlip * 0.25))
  const chosen = best ?? scenarios[scenarios.length - 1]
  chosen.recommended = true

  return { scenarios, totalSlip, avgConfidence: Math.round(avgConfidence * 100) / 100, recommended: chosen }
}

export const AgentMissionEngine = {
  interpretIntent,

  /**
   * Run the pipeline up to the approval gate. Returns the mission with every
   * stage persisted. Nothing is mutated by this call.
   */
  async plan(args: { intentText: string; actorId: string; tenantId?: string }) {
    const started = Date.now()
    const mission = await prisma.agentMission.create({
      data: {
        intentText: args.intentText,
        actorId: args.actorId,
        tenantId: args.tenantId ?? 'default',
        status: 'PLANNING',
      },
    })
    const id = mission.id
    let ordinal = 0

    // ── 1. Interpret ─────────────────────────────────────────────────────────
    const t1 = Date.now()
    const goal = interpretIntent(args.intentText)
    await prisma.agentMission.update({ where: { id }, data: { goal: goal as any } })
    await addStep(id, ++ordinal, 'INTERPRET', 'Understand the request',
      goal.objective === 'UNKNOWN'
        ? 'Could not classify this request into a known objective.'
        : `Classified as ${goal.objective}${goal.mutating ? ' — this may change records.' : ' — read-only.'}`,
      goal, Date.now() - t1)

    if (goal.objective === 'UNKNOWN') {
      await prisma.agentMission.update({
        where: { id },
        data: { status: 'NO_ACTION', completedAt: new Date(), failureReason: 'Intent not understood' },
      })
      return this.get(id)
    }

    // ── 2. Resolve context ───────────────────────────────────────────────────
    const t2 = Date.now()
    let forecasts = await ProjectDelayAnalyzer.forecastAll()
    if (goal.filter?.titleContains) {
      const needle = goal.filter.titleContains.toLowerCase()
      forecasts = forecasts.filter(f => f.title.toLowerCase().includes(needle))
    }
    await addStep(id, ++ordinal, 'RESOLVE_CONTEXT', 'Resolve the projects in scope',
      `Loaded ${forecasts.length} active project(s)${goal.filter?.titleContains ? ` matching "${goal.filter.titleContains}"` : ''}.`,
      { count: forecasts.length, projects: forecasts.map(f => ({ id: f.projectId, title: f.title })) },
      Date.now() - t2)

    if (!forecasts.length) {
      await prisma.agentMission.update({
        where: { id },
        data: { status: 'NO_ACTION', completedAt: new Date(), failureReason: 'No projects matched the request' },
      })
      return this.get(id)
    }

    // ── 3. Analyze ───────────────────────────────────────────────────────────
    const t3 = Date.now()
    const atRisk = forecasts.filter(f => AT_RISK_BANDS.includes(f.riskBand))
    await addStep(id, ++ordinal, 'ANALYZE', 'Forecast which projects will miss',
      atRisk.length
        ? `${atRisk.length} of ${forecasts.length} project(s) are forecast to miss their date, by comparing required against observed delivery velocity.`
        : `No project is forecast to miss. Every project's observed pace covers its remaining work.`,
      {
        atRisk: atRisk.map(f => ({
          projectId: f.projectId, title: f.title, riskBand: f.riskBand,
          progress: f.progress, daysRemaining: f.daysRemaining,
          observedVelocity: f.observedVelocity, requiredVelocity: f.requiredVelocity,
          velocityRatio: f.velocityRatio, projectedSlipDays: f.projectedSlipDays,
          confidence: f.confidence, reasons: f.reasons,
        })),
        onTrack: forecasts.length - atRisk.length,
      },
      Date.now() - t3)

    if (!atRisk.length) {
      await prisma.agentMission.update({
        where: { id },
        data: {
          status: 'NO_ACTION', completedAt: new Date(),
          findings: { atRisk: 0, checked: forecasts.length } as any,
          failureReason: null,
        },
      })
      return this.get(id)
    }

    // ── 4. Diagnose ──────────────────────────────────────────────────────────
    const t4 = Date.now()
    const diagnoses = await Promise.all(atRisk.map(f => ProjectDelayAnalyzer.diagnose(f.projectId)))
    const evidenced = diagnoses.filter(d =>
      d.counts.openRisks + d.counts.overdueTasks + d.counts.openDeliverables > 0)
    await addStep(id, ++ordinal, 'DIAGNOSE', 'Determine root causes',
      evidenced.length
        ? `Found recorded blockers on ${evidenced.length} of ${atRisk.length} at-risk project(s).`
        : `No risks, overdue tasks, or open deliverables are recorded against these projects — the slip shows only in the velocity trend, which may mean the schedule itself was unrealistic.`,
      { diagnoses }, Date.now() - t4)

    // ── 5. Simulate ──────────────────────────────────────────────────────────
    const t5 = Date.now()
    const sim = buildScenarios(atRisk)
    await addStep(id, ++ordinal, 'SIMULATE', 'Model the interventions',
      `Modelled ${sim.scenarios.length} scenarios against ${sim.totalSlip} day(s) of combined forecast slip. Recommended: ${sim.recommended.name}.`,
      sim, Date.now() - t5)

    // ── 6. Propose ───────────────────────────────────────────────────────────
    const t6 = Date.now()
    const proposals = atRisk.map((f, i) => {
      const newDate = f.forecastCompletion ?? f.dueDate
      return {
        ordinal: i + 1,
        actionName: 'UPDATE_PROJECT_SCHEDULE',
        params: {
          projectId: f.projectId,
          currentDueDate: f.dueDate?.toISOString() ?? null,
          proposedDueDate: newDate?.toISOString() ?? null,
        },
        targetType: 'Project',
        targetId: f.projectId,
        rationale: `${f.title} is ${f.riskBand}. ${f.reasons[0]}`,
        expectedImpact:
          f.projectedSlipDays !== null
            ? `Re-baselines a ${f.projectedSlipDays}-day forecast slip to a date the observed pace can meet.`
            : 'Aligns the committed date with the forecast.',
      }
    })

    await prisma.agentProposedAction.createMany({
      data: proposals.map(p => ({
        missionId: id,
        ordinal: p.ordinal,
        actionName: p.actionName,
        params: p.params as any,
        targetType: p.targetType,
        targetId: p.targetId,
        rationale: p.rationale,
        expectedImpact: p.expectedImpact,
        status: 'PROPOSED',
      })),
    })
    await addStep(id, ++ordinal, 'PROPOSE', 'Recommend concrete changes',
      `Proposed ${proposals.length} change(s), each bound to a real project record.`,
      { proposals }, Date.now() - t6)

    // ── 7. Policy ────────────────────────────────────────────────────────────
    const t7 = Date.now()
    const policy = await checkPolicy({
      trigger: `AGENT_MISSION:${goal.objective}`,
      params: { projectCount: atRisk.length, mutating: goal.mutating },
      actorId: args.actorId,
    })

    // A mutating mission always needs a human decision, whatever policy says.
    // Policy can only make the gate stricter, never remove it.
    const requiresApproval = goal.mutating || policy.effect === 'REQUIRE_APPROVAL'
    const denied = policy.effect === 'DENY'

    await addStep(id, ++ordinal, 'POLICY', 'Evaluate governance policy',
      denied
        ? `Denied by policy "${policy.policyName}": ${policy.reason}`
        : requiresApproval
          ? `Human approval required before anything is changed${policy.policyName ? ` (policy "${policy.policyName}")` : ' (mission would modify records)'}.`
          : `Policy allows this to proceed without approval — the mission is read-only.`,
      { effect: policy.effect, policyId: policy.policyId, policyName: policy.policyName, requiresApproval },
      Date.now() - t7)

    if (denied) {
      await prisma.agentMission.update({
        where: { id },
        data: {
          status: 'REJECTED', completedAt: new Date(),
          policyId: policy.policyId, policyName: policy.policyName, policyEffect: policy.effect,
          failureReason: `Policy denied: ${policy.reason}`,
        },
      })
      await prisma.agentProposedAction.updateMany({ where: { missionId: id }, data: { status: 'REJECTED' } })
      return this.get(id)
    }

    // ── 8. Approval gate ─────────────────────────────────────────────────────
    await addStep(id, ++ordinal, 'APPROVAL', 'Request approval',
      requiresApproval
        ? `Holding ${proposals.length} change(s). Nothing has been modified.`
        : 'No approval needed.',
      { requiresApproval, pendingActions: proposals.length })

    await prisma.agentMission.update({
      where: { id },
      data: {
        status: requiresApproval ? 'AWAITING_APPROVAL' : 'APPROVED',
        plannedAt: new Date(),
        policyId: policy.policyId, policyName: policy.policyName, policyEffect: policy.effect,
        contextSummary: { projectsChecked: forecasts.length, atRisk: atRisk.length } as any,
        findings: { atRisk: atRisk.map(f => ({ projectId: f.projectId, title: f.title, riskBand: f.riskBand, projectedSlipDays: f.projectedSlipDays })), diagnoses } as any,
        simulations: sim as any,
      },
    })
    if (requiresApproval) {
      await prisma.agentProposedAction.updateMany({
        where: { missionId: id }, data: { status: 'AWAITING_APPROVAL' },
      })
    }

    void (Date.now() - started)
    return this.get(id)
  },

  /** Record a human decision. Only a mission awaiting approval can be decided. */
  async decide(missionId: string, approve: boolean, deciderId: string) {
    const mission = await prisma.agentMission.findUnique({ where: { id: missionId } })
    if (!mission) throw new Error('Mission not found')
    if (mission.status !== 'AWAITING_APPROVAL') {
      throw new Error(`Mission is ${mission.status}, not AWAITING_APPROVAL`)
    }

    await prisma.agentMission.update({
      where: { id: missionId },
      data: {
        status: approve ? 'APPROVED' : 'REJECTED',
        approvedAt: approve ? new Date() : null,
        approvedBy: deciderId,
        completedAt: approve ? null : new Date(),
        failureReason: approve ? null : 'Rejected by approver',
      },
    })
    await prisma.agentProposedAction.updateMany({
      where: { missionId, status: 'AWAITING_APPROVAL' },
      data: { status: approve ? 'APPROVED' : 'REJECTED' },
    })

    const count = await prisma.agentMissionStep.count({ where: { missionId } })
    await addStep(missionId, count + 1, 'APPROVAL',
      approve ? 'Approved' : 'Rejected',
      approve ? `Approved by ${deciderId}. Execution may proceed.` : `Rejected by ${deciderId}. Nothing was changed.`,
      { deciderId, approve })

    return this.get(missionId)
  },

  /**
   * Execute the approved actions and verify the outcome. Refuses unless the
   * mission is APPROVED — the approval gate cannot be bypassed by calling this
   * directly.
   */
  async execute(missionId: string, actorId: string) {
    const mission = await prisma.agentMission.findUnique({ where: { id: missionId } })
    if (!mission) throw new Error('Mission not found')
    if (mission.status !== 'APPROVED') {
      throw new Error(`Mission is ${mission.status} — only an APPROVED mission can execute`)
    }

    await prisma.agentMission.update({ where: { id: missionId }, data: { status: 'EXECUTING' } })
    const actions = await prisma.agentProposedAction.findMany({
      where: { missionId, status: 'APPROVED' }, orderBy: { ordinal: 'asc' },
    })

    let executed = 0
    let failed = 0

    for (const a of actions) {
      const t = Date.now()
      try {
        // An action is registered per object type, so prefer the one bound to
        // the type of the object being acted on. Falling straight back to a
        // name match would let a Task-scoped action be applied to a Contract.
        const onObject = a.targetType === 'OntologyObject' && a.targetId
          ? await prisma.ontologyObject.findUnique({ where: { id: a.targetId }, select: { typeId: true } })
          : null
        const registered = onObject
          ? await prisma.ontologyAction.findUnique({
              where: { typeId_name: { typeId: onObject.typeId, name: a.actionName } },
            })
          : await prisma.ontologyAction.findFirst({ where: { name: a.actionName } })

        if (registered) {
          const result: any = await ActionEngine.execute({
            actionId: registered.id,
            params: a.params as any,
            // Effects such as UPDATE_OBJECT need the object in context; without
            // this every ontology-scoped action fails on "requires an object".
            objectId: onObject ? a.targetId : (a.params as any)?.objectId ?? null,
            actorId,
            actorType: 'KIMMP',
          })
          // ActionEngine.execute returns the ActionExecution row itself: the
          // outcome is `status`, and the audit id is `id`. Reading a `success`
          // field that does not exist made every failure look like a success.
          const ok = result?.status === 'SUCCESS'
          await prisma.agentProposedAction.update({
            where: { id: a.id },
            data: {
              status: ok ? 'EXECUTED' : 'FAILED',
              executionId: result?.id ?? null,
              resultSummary: ok
                ? `Executed via ActionEngine (${(result?.effectsApplied as any[])?.length ?? 0} effect(s))`
                : null,
              errorMessage: ok ? null : String(result?.errorMessage ?? 'Action failed'),
              executedAt: new Date(),
            },
          })
          ok ? executed++ : failed++
        } else if (a.targetType === 'Project' && a.targetId && (a.params as any)?.proposedDueDate) {
          // The schedule change has a direct, auditable effect even where no
          // ontology action is registered for it yet.
          await prisma.project.update({
            where: { id: a.targetId },
            data: { dueDate: new Date((a.params as any).proposedDueDate) },
          })
          await prisma.agentProposedAction.update({
            where: { id: a.id },
            data: {
              status: 'EXECUTED',
              resultSummary: `Project due date set to ${(a.params as any).proposedDueDate}`,
              executedAt: new Date(),
            },
          })
          executed++
        } else {
          await prisma.agentProposedAction.update({
            where: { id: a.id },
            data: {
              status: 'SKIPPED',
              errorMessage: `No registered action "${a.actionName}" and no direct handler for ${a.targetType}`,
            },
          })
        }
      } catch (err: any) {
        failed++
        await prisma.agentProposedAction.update({
          where: { id: a.id },
          data: { status: 'FAILED', errorMessage: err.message, executedAt: new Date() },
        })
      } finally {
        void (Date.now() - t)
      }
    }

    const stepCount = await prisma.agentMissionStep.count({ where: { missionId } })
    await addStep(missionId, stepCount + 1, 'EXECUTE', 'Apply the approved changes',
      `${executed} executed, ${failed} failed, ${actions.length - executed - failed} skipped.`,
      { executed, failed, total: actions.length })

    // ── Verify ───────────────────────────────────────────────────────────────
    await prisma.agentMission.update({ where: { id: missionId }, data: { status: 'VERIFYING' } })
    const targetIds = actions.map(a => a.targetId).filter(Boolean) as string[]
    const after = await ProjectDelayAnalyzer.forecastAll()
    const verified = after.filter(f => targetIds.includes(f.projectId))
    const stillAtRisk = verified.filter(f => AT_RISK_BANDS.includes(f.riskBand))

    const verification = {
      projectsTouched: targetIds.length,
      stillAtRisk: stillAtRisk.length,
      resolved: verified.length - stillAtRisk.length,
      outcome: verified.map(f => ({
        projectId: f.projectId, title: f.title, riskBand: f.riskBand,
        projectedSlipDays: f.projectedSlipDays,
      })),
    }

    await addStep(missionId, stepCount + 2, 'VERIFY', 'Verify the outcome',
      `Re-forecast after execution: ${verification.resolved} of ${verified.length} project(s) are no longer at risk.`,
      verification)

    await prisma.agentMission.update({
      where: { id: missionId },
      data: {
        status: failed > 0 ? 'FAILED' : 'COMPLETED',
        verification: verification as any,
        completedAt: new Date(),
        failureReason: failed > 0 ? `${failed} action(s) failed` : null,
      },
    })

    return this.get(missionId)
  },

  async get(missionId: string) {
    return prisma.agentMission.findUnique({
      where: { id: missionId },
      include: {
        steps: { orderBy: { ordinal: 'asc' } },
        actions: { orderBy: { ordinal: 'asc' } },
      },
    })
  },

  async list(actorId?: string, limit = 25) {
    return prisma.agentMission.findMany({
      where: actorId ? { actorId } : undefined,
      orderBy: { startedAt: 'desc' },
      take: Math.min(limit, 100),
      include: { actions: { select: { id: true, status: true } } },
    })
  },
}
