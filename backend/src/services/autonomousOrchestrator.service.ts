// Layer 4 — Autonomous Intelligence: "Execute it."
//
// Implements the full Reason → Propose → Govern → Approve → Execute → Observe → Learn
// state machine using real KIMMP reasoning, real ActionEngine execution, and
// AEGIS policy for mandatory human-in-loop on high-impact decisions.
//
// Each autonomous cycle is one AutonomousExecution row, updated as it transitions
// through states. On failure at any gate, the row is marked FAILED with errorMessage.

import { prisma } from '../lib/prisma'
import { routedCall } from '../kangqore-immp/llm/kimmpLLMRouter'
import { ActionEngine } from './actionEngine.service'
import { checkPolicy } from './policyEngine.service'

const KIMMP_ACTOR_ID = 'kimmp-autonomous'

type AEStatus =
  | 'REASONING' | 'PROPOSING' | 'GOVERNING'
  | 'PENDING_APPROVAL' | 'EXECUTING' | 'OBSERVING'
  | 'LEARNING' | 'COMPLETE' | 'FAILED'

interface AERow {
  id: string
  status: AEStatus
  context: any
  reasoning?: string | null
  proposal?: any
  governanceVerdict?: string | null
  policyName?: string | null
  pendingApprovalId?: string | null
  executionId?: string | null
  outcome?: any
  learned: boolean
  learnNote?: string | null
  errorMessage?: string | null
  durationMs: number
  startedAt: Date
  completedAt?: Date | null
}

async function transition(id: string, patch: Partial<AERow>): Promise<void> {
  await (prisma as any).autonomousExecution.update({ where: { id }, data: patch })
}

function fail(id: string, errorMessage: string, startedAt: Date): Promise<void> {
  return transition(id, {
    status: 'FAILED', errorMessage,
    completedAt: new Date(),
    durationMs: Date.now() - startedAt.getTime(),
  })
}

// ── Reasoning ────────────────────────────────────────────────────────────────

async function reason(context: any): Promise<string> {
  const result = await routedCall(
    'claude-sonnet-4-6',
    `You are KIMMP, Kangqore's autonomous intelligence engine. You are given an operational signal or recommendation.
Analyse the situation, identify the root cause, and decide on the single best corrective action available in the system.
Be concise, actionable, and evidence-driven. Output plain text analysis (2–4 paragraphs max).`,
    `Signal context:\n${JSON.stringify(context, null, 2)}`,
    800,
    { agentType: 'AutonomousOrchestrator', agentSystem: 'autonomousOrchestrator.reasoning' },
  )
  return result.content[0]?.text ?? ''
}

interface Proposal {
  actionName: string
  actionId: string | null
  params: Record<string, any>
  rationale: string
  confidence: number  // 0–100
}

async function propose(reasoning: string, context: any): Promise<Proposal | null> {
  // Load available executable actions for KIMMP to choose from
  const actions = await prisma.ontologyAction.findMany({
    select: { id: true, name: true, description: true },
    take: 30,
  })

  const proposeResult = await routedCall(
    'claude-sonnet-4-6',
    `You are KIMMP. Based on your reasoning, choose ONE action to execute from the available actions list.
Respond with ONLY a JSON object:
{
  "actionName": "EXACT_ACTION_NAME",
  "actionId": "id_from_list_or_null",
  "params": { "key": "value" },
  "rationale": "one sentence why",
  "confidence": 0-100
}
If no action is appropriate, respond: {"actionName": null, "actionId": null, "params": {}, "rationale": "no action warranted", "confidence": 0}`,
    `Reasoning:\n${reasoning}\n\nContext:\n${JSON.stringify(context, null, 2)}\n\nAvailable actions:\n${JSON.stringify(actions.map(a => ({ id: a.id, name: a.name, description: a.description })), null, 2)}`,
    400,
    { agentType: 'AutonomousOrchestrator', agentSystem: 'autonomousOrchestrator.proposing' },
  )
  const proposeText = proposeResult.content[0]?.text ?? ''

  try {
    const json = proposeText.match(/\{[\s\S]*\}/)?.[0]
    if (!json) return null
    const p: Proposal = JSON.parse(json)
    return p.actionName ? p : null
  } catch {
    return null
  }
}

// ── Governance gate ───────────────────────────────────────────────────────────

async function govern(proposal: Proposal): Promise<{
  verdict: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'
  policyName?: string | null
  pendingId?: string
}> {
  if (!proposal.actionId) return { verdict: 'ALLOW' }

  const policy = await checkPolicy({
    trigger: proposal.actionName,
    params: proposal.params,
    actorId: KIMMP_ACTOR_ID,
  })

  if (policy.effect === 'DENY') {
    return { verdict: 'DENY', policyName: policy.policyName }
  }

  if (policy.effect === 'REQUIRE_APPROVAL') {
    const pending = await prisma.pendingApproval.create({
      data: {
        actionId: proposal.actionId,
        actorId: KIMMP_ACTOR_ID,
        actorType: 'KIMMP',
        params: proposal.params,
        policyId: policy.policyId ?? undefined,
        policyName: policy.policyName ?? undefined,
        reason: `Autonomous action: ${proposal.actionName} — ${proposal.rationale}`,
      },
    })
    return { verdict: 'REQUIRE_APPROVAL', policyName: policy.policyName, pendingId: pending.id }
  }

  return { verdict: 'ALLOW', policyName: policy.policyName }
}

// ── Learn ─────────────────────────────────────────────────────────────────────

async function learn(reasoning: string, proposal: Proposal, outcome: any): Promise<string> {
  const learnResult = await routedCall(
    'claude-haiku-4-5-20251001',
    'You are KIMMP. Write 1–2 sentences: what did this autonomous action teach you? What would you do differently or the same next time?',
    `Reasoning was:\n${reasoning}\n\nAction: ${proposal.actionName}\nOutcome: ${JSON.stringify(outcome)}`,
    200,
    { agentType: 'AutonomousOrchestrator', agentSystem: 'autonomousOrchestrator.learning' },
  )
  return (learnResult.content[0]?.text ?? '').trim()
}

// ── Public API ────────────────────────────────────────────────────────────────

export const AutonomousOrchestrator = {

  async trigger(opts: {
    triggerId?: string
    triggerType?: string
    context: Record<string, any>
  }): Promise<AERow> {
    const startedAt = new Date()
    const ae = await (prisma as any).autonomousExecution.create({
      data: {
        triggerId:   opts.triggerId ?? null,
        triggerType: opts.triggerType ?? 'MANUAL',
        status:      'REASONING',
        context:     opts.context,
        startedAt,
      },
    })

    // ── REASONING ──────────────────────────────────────────────────────────
    let reasoning: string
    try {
      reasoning = await reason(opts.context)
    } catch (err: any) {
      await fail(ae.id, `REASONING failed: ${err?.message}`, startedAt)
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }
    await transition(ae.id, { status: 'PROPOSING', reasoning })

    // ── PROPOSING ──────────────────────────────────────────────────────────
    let proposal: Proposal | null
    try {
      proposal = await propose(reasoning, opts.context)
    } catch (err: any) {
      await fail(ae.id, `PROPOSING failed: ${err?.message}`, startedAt)
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    if (!proposal) {
      await transition(ae.id, {
        status: 'COMPLETE',
        proposal: null,
        governanceVerdict: 'ALLOW',
        durationMs: Date.now() - startedAt.getTime(),
        completedAt: new Date(),
        learned: true,
        learnNote: 'No executable action identified — signal noted for future correlation.',
      })
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    await transition(ae.id, { status: 'GOVERNING', proposal })

    // ── GOVERNING ──────────────────────────────────────────────────────────
    let governance: Awaited<ReturnType<typeof govern>>
    try {
      governance = await govern(proposal)
    } catch (err: any) {
      await fail(ae.id, `GOVERNING failed: ${err?.message}`, startedAt)
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    if (governance.verdict === 'DENY') {
      await transition(ae.id, {
        status: 'FAILED',
        governanceVerdict: 'DENY',
        policyName: governance.policyName,
        errorMessage: `Action denied by policy: ${governance.policyName}`,
        durationMs: Date.now() - startedAt.getTime(),
        completedAt: new Date(),
      })
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    if (governance.verdict === 'REQUIRE_APPROVAL') {
      await transition(ae.id, {
        status: 'PENDING_APPROVAL',
        governanceVerdict: 'REQUIRE_APPROVAL',
        policyName: governance.policyName,
        pendingApprovalId: governance.pendingId,
      })
      // Execution resumes in resumeAfterApproval() once a human approves
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    // ── EXECUTING ──────────────────────────────────────────────────────────
    await transition(ae.id, { status: 'EXECUTING', governanceVerdict: 'ALLOW' })

    let execution: any
    try {
      if (!proposal.actionId) throw new Error('No actionId — cannot execute')
      execution = await ActionEngine.execute({
        actionId:     proposal.actionId,
        params:       proposal.params,
        actorId:      KIMMP_ACTOR_ID,
        actorType:    'KIMMP',
        confidence:   proposal.confidence,
        agentsMixed:  ['AutonomousOrchestrator'],
        sourceModule: 'autonomousOrchestrator',
        reasoning,
      })
    } catch (err: any) {
      await fail(ae.id, `EXECUTING failed: ${err?.message}`, startedAt)
      return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
    }

    await transition(ae.id, { status: 'OBSERVING', executionId: execution.id })

    // ── OBSERVING ─────────────────────────────────────────────────────────
    const outcome = {
      executionStatus: execution.status,
      effectsApplied:  execution.effectsApplied ?? [],
      errorMessage:    execution.errorMessage ?? null,
    }

    // ── LEARNING ──────────────────────────────────────────────────────────
    await transition(ae.id, { status: 'LEARNING', outcome })
    let learnNote = ''
    try {
      learnNote = await learn(reasoning, proposal, outcome)
    } catch {
      learnNote = 'Learning step skipped due to LLM unavailability.'
    }

    // ── COMPLETE ──────────────────────────────────────────────────────────
    await transition(ae.id, {
      status: 'COMPLETE',
      learned: true,
      learnNote,
      durationMs: Date.now() - startedAt.getTime(),
      completedAt: new Date(),
    })

    return (prisma as any).autonomousExecution.findUnique({ where: { id: ae.id } })
  },

  // Called by the approval webhook once a PendingApproval is approved
  async resumeAfterApproval(executionId: string): Promise<void> {
    const ae: AERow = await (prisma as any).autonomousExecution.findUniqueOrThrow({ where: { id: executionId } })
    if (ae.status !== 'PENDING_APPROVAL' || !ae.proposal) return

    const proposal: Proposal = ae.proposal as any
    await transition(ae.id, { status: 'EXECUTING' })

    try {
      if (!proposal.actionId) throw new Error('No actionId')
      const execution = await ActionEngine.execute({
        actionId:     proposal.actionId,
        params:       proposal.params,
        actorId:      KIMMP_ACTOR_ID,
        actorType:    'KIMMP',
        confidence:   proposal.confidence,
        agentsMixed:  ['AutonomousOrchestrator'],
        sourceModule: 'autonomousOrchestrator',
        reasoning:    ae.reasoning ?? undefined,
      })
      await transition(ae.id, { status: 'OBSERVING', executionId: execution.id })

      const outcome = {
        executionStatus: execution.status,
        effectsApplied:  execution.effectsApplied ?? [],
        errorMessage:    execution.errorMessage ?? null,
      }
      await transition(ae.id, { status: 'LEARNING', outcome })

      let learnNote = ''
      try {
        learnNote = await learn(ae.reasoning ?? '', proposal, outcome)
      } catch { learnNote = 'Learning step skipped.' }

      await transition(ae.id, {
        status: 'COMPLETE', learned: true, learnNote,
        durationMs: Date.now() - ae.startedAt.getTime(),
        completedAt: new Date(),
      })
    } catch (err: any) {
      await fail(ae.id, `Post-approval EXECUTING failed: ${err?.message}`, ae.startedAt)
    }
  },

  async list(opts?: { status?: string; limit?: number }) {
    return (prisma as any).autonomousExecution.findMany({
      where: opts?.status ? { status: opts.status } : {},
      orderBy: { startedAt: 'desc' },
      take: opts?.limit ?? 20,
    })
  },

  async get(id: string) {
    return (prisma as any).autonomousExecution.findUnique({ where: { id } })
  },
}
