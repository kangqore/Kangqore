// D4 — KimmpExecutionEngine
// Durable DAG execution with dependency resolution, retry, checkpoint, and rollback.
// Each step runs via the AgentCoordinator or ExternalAPI dispatcher.

import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'
import { CompiledWorkflow, WorkflowNode, WorkflowDAG } from './kimmpWorkflowCompiler.service'
import { EnterpriseContext } from '../context/kimmpContextAssembler.service'
import { KimmpTrace } from '../observability/kimmpTrace.service'
import { KimmpAgentCoordinator } from '../agents/kimmpAgentCoordinator.service'
import { KimmpToolDispatch } from '../actions/kimmpToolDispatch.service'
import { runStrategicDecision } from '../services/kimmpStrategicDecision.service'
import { KimmpWorkflowMemory } from './kimmpWorkflowMemory.service'
import { checkPolicy } from '../../../services/policyEngine.service'

const MAX_RETRIES  = 3
const BASE_DELAY   = 1_000 // ms

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function executeNode(
  node:      WorkflowNode,
  ctx:       EnterpriseContext,
  runId:     string,
  stepResults: Record<string, any>,
): Promise<{ ok: boolean; output: any; error?: string }> {
  const start = Date.now()
  await KimmpTrace.append(runId, [KimmpTrace.event('STEP_START', { stepId: node.id, agentType: node.agentHint })])

  try {
    let output: any

    switch (node.type) {
      case 'SIGNAL_READ': {
        const signals = ctx.signals.slice(0, 10)
        output = { signals, summary: `${signals.length} active signals` }
        break
      }

      case 'DATA_QUERY': {
        // Generic data query — returns a context summary
        output = {
          riskProfile: ctx.riskProfile,
          goals:       ctx.goals,
          summary:     `Queried enterprise context at ${ctx.currentTime.toISOString()}`,
        }
        break
      }

      case 'AGENT_INVOKE': {
        await KimmpTrace.append(runId, [KimmpTrace.event('AGENT_CALL', { stepId: node.id, agentType: node.agentHint })])
        const result = await KimmpAgentCoordinator.invokeAgent(
          (node.agentHint ?? 'SIGNAL_READ') as import('../agents/kimmpAgentCoordinator.service').SpecialistAgent,
          node.params ?? {},
          ctx,
          stepResults,
        )
        output = result
        await KimmpTrace.append(runId, [KimmpTrace.event('AGENT_RESULT', { stepId: node.id, agentType: node.agentHint, durationMs: Date.now() - start })])
        break
      }

      case 'DECISION': {
        // Policy gate before engaging Decision Engine
        const decPolicy = await checkPolicy({
          trigger: 'STRATEGIC_DECISION',
          params:  { question: node.params?.question ?? node.description, evidenceCount: 0, confidence: 50 },
          actorId: ctx.userId,
        }).catch(() => ({ effect: 'ALLOW' as const, policyId: null, policyName: null, reason: '' }))
        await KimmpTrace.append(runId, [KimmpTrace.event('POLICY_CHECK', { stepId: node.id, data: { effect: decPolicy.effect, policy: decPolicy.policyName } })])
        if (decPolicy.effect === 'DENY') throw new Error(`Decision blocked by policy: ${decPolicy.reason}`)

        const question = node.params?.question ?? node.description
        const dec = await runStrategicDecision(question, ctx.userId)
        output = { decision: dec, summary: dec.recommendation }
        break
      }

      case 'APPROVAL_GATE': {
        await KimmpTrace.append(runId, [KimmpTrace.event('APPROVAL_WAIT', { stepId: node.id })])
        // Set run to PAUSED — human must POST /runs/:id/approve to continue
        await (prisma as any).kimmpWorkflowRun.update({
          where: { id: runId },
          data:  { status: 'PAUSED', currentStep: node.id },
        })
        output = { paused: true, waitingFor: 'APPROVAL', stepId: node.id }
        return { ok: true, output }
      }

      case 'EXTERNAL_API': {
        if (!node.platform || !node.action) throw new Error('EXTERNAL_API step missing platform or action')
        // Policy gate before external dispatch
        const extPolicy = await checkPolicy({
          trigger: 'EXTERNAL_API_CALL',
          params:  { platform: node.platform, action: node.action, ...(node.params ?? {}) },
          actorId: ctx.userId,
        }).catch(() => ({ effect: 'ALLOW' as const, policyId: null, policyName: null, reason: '' }))
        await KimmpTrace.append(runId, [KimmpTrace.event('POLICY_CHECK', { stepId: node.id, data: { effect: extPolicy.effect, policy: extPolicy.policyName } })])
        if (extPolicy.effect === 'DENY') throw new Error(`External API call blocked by policy: ${extPolicy.reason}`)

        await KimmpTrace.append(runId, [KimmpTrace.event('EXTERNAL_API', { stepId: node.id, platform: node.platform })])
        const result = await KimmpToolDispatch.dispatch({
          userId:       ctx.userId,
          platform:     node.platform as any,
          action:       node.action,
          params:       node.params ?? {},
          kimmActionId: `run-${runId}-step-${node.id}`,
        })
        output = result
        break
      }

      case 'NOTIFY': {
        // Find a connected Slack integration; otherwise log
        const slack = ctx.integrations.find(i => i.platform === 'slack')
        if (slack && node.platform === 'slack') {
          await KimmpToolDispatch.dispatch({
            userId:   ctx.userId,
            platform: 'slack',
            action:   'sendMessage',
            params:   node.params ?? { text: node.description },
            idempotencyKey: `run-${runId}-step-${node.id}`,
          })
        }
        output = { notified: true, message: node.params?.text ?? node.description }
        break
      }

      case 'MEMORY_WRITE': {
        await KimmpTrace.append(runId, [KimmpTrace.event('MEMORY_WRITE', { stepId: node.id })])
        const content = node.params?.content ?? JSON.stringify(stepResults).slice(0, 300)
        await (prisma as any).kimmpMemory.create({
          data: {
            type:    'PATTERN',
            content: `Workflow run ${runId}: ${content}`,
            tags:    ['workflow', 'auto-write'],
          },
        }).catch(() => {})
        output = { written: true }
        break
      }

      case 'GOAL_UPDATE': {
        if (ctx.goalId) {
          await (prisma as any).kimmpGoal.update({
            where: { id: ctx.goalId },
            data:  node.params ?? { progressPct: { increment: 10 } },
          }).catch(() => {})
        }
        output = { updated: true, goalId: ctx.goalId }
        break
      }

      case 'WAIT': {
        const ms = node.params?.ms ?? 5_000
        await sleep(Math.min(ms, 30_000))
        output = { waited: ms }
        break
      }

      default:
        output = { skipped: true, type: node.type }
    }

    await KimmpTrace.append(runId, [KimmpTrace.event('STEP_COMPLETE', { stepId: node.id, durationMs: Date.now() - start })])
    return { ok: true, output }

  } catch (err: any) {
    await KimmpTrace.append(runId, [KimmpTrace.event('STEP_FAILED', { stepId: node.id, error: err.message, durationMs: Date.now() - start })])
    return { ok: false, output: null, error: err.message }
  }
}

// ─── Compensation (reverse-side of rollback) ─────────────────────────────────

async function compensateNode(
  node: WorkflowNode,
  runId: string,
  ctx: EnterpriseContext,
  output: any,
): Promise<void> {
  await KimmpTrace.append(runId, [KimmpTrace.event('COMPENSATE', { stepId: node.id, data: { type: node.type } })])

  switch (node.type) {
    case 'MEMORY_WRITE':
      // Best-effort: delete the most recent PATTERN memory created by this run
      await (prisma as any).kimmpMemory.deleteMany({
        where: { content: { contains: `Workflow run ${runId}` }, type: 'PATTERN' },
      }).catch(() => {})
      break

    case 'GOAL_UPDATE':
      // Reverse the progress increment
      if (ctx.goalId && node.params?.progressPct?.increment) {
        await (prisma as any).kimmpGoal.update({
          where: { id: ctx.goalId },
          data:  { progressPct: { decrement: node.params.progressPct.increment } },
        }).catch(() => {})
      }
      break

    case 'EXTERNAL_API':
      // Log only — external API calls are not reversible in the general case
      logger.warn(`[WAOE:Compensate] External API step ${node.id} (${node.platform}/${node.action}) cannot be rolled back — manual intervention may be required`)
      break

    default:
      // Read/query/agent steps are naturally idempotent — no compensation needed
      break
  }
}

export class KimmpExecutionEngine {

  static async run(compiled: CompiledWorkflow, ctx: EnterpriseContext): Promise<{
    ok:          boolean
    runId:       string
    stepResults: Record<string, any>
    failedStep?: string
    paused?:     boolean
  }> {
    const { workflowRunId: runId, dag, executionOrder } = compiled
    let failedStep: string | undefined

    // Load any existing stepResults from DB — enables idempotent replay after partial runs
    const existingRun = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId }, select: { stepResults: true }
    })
    const stepResults: Record<string, any> = (existingRun?.stepResults as any) ?? {}

    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runId },
      data:  { status: 'RUNNING' },
    })
    await KimmpTrace.append(runId, [KimmpTrace.event('RUN_START', { data: { layers: executionOrder.length } })])

    const nodeMap = new Map(dag.nodes.map(n => [n.id, n]))

    for (const layer of executionOrder) {
      // Run all steps in this layer in parallel
      const layerResults = await Promise.all(
        layer.map(async stepId => {
          const node = nodeMap.get(stepId)
          if (!node) return { stepId, ok: true, output: null }

          // Idempotency guard — skip steps already completed in a prior run/checkpoint
          if (stepResults[stepId] !== undefined) {
            await KimmpTrace.append(runId, [KimmpTrace.event('STEP_COMPLETE', { stepId, data: { skipped: true, reason: 'idempotent-replay' } })])
            return { stepId, ok: true, output: stepResults[stepId] }
          }

          let lastError: string | undefined
          for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            if (attempt > 0) {
              const delay = BASE_DELAY * Math.pow(2, attempt - 1)
              await sleep(delay)
              await KimmpTrace.append(runId, [KimmpTrace.event('STEP_RETRY', { stepId, data: { attempt } })])
            }
            const result = await executeNode(node, ctx, runId, stepResults)
            if (result.ok) {
              // APPROVAL_GATE returns paused=true — do not store output or advance
              if (result.output?.paused) {
                return { stepId, ok: true, output: result.output, paused: true }
              }
              stepResults[stepId] = result.output
              await KimmpTrace.checkpoint(runId, stepId, stepResults)
              return { stepId, ok: true, output: result.output }
            }
            lastError = result.error
          }
          return { stepId, ok: false, error: lastError }
        })
      )

      // Check for paused state
      const pausedStep = layerResults.find(r => (r as any).paused)
      if (pausedStep) {
        await (prisma as any).kimmpWorkflowRun.update({
          where: { id: runId },
          data:  { stepResults, status: 'PAUSED' },
        })
        return { ok: true, runId, stepResults, paused: true }
      }

      // Check for critical failures
      for (const r of layerResults) {
        if (!r.ok) {
          const node = nodeMap.get(r.stepId)
          if (node?.critical) {
            failedStep = r.stepId
            logger.warn(`[WAOE] Critical step ${r.stepId} failed: ${r.error}`)
            break
          }
          logger.warn(`[WAOE] Non-critical step ${r.stepId} failed — continuing`)
        }
      }

      if (failedStep) break
    }

    const finalStatus = failedStep ? 'FAILED' : 'COMPLETED'
    const now = new Date()

    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runId },
      data:  {
        status:      finalStatus,
        stepResults,
        currentStep: null,
        completedAt: finalStatus === 'COMPLETED' ? now : undefined,
        failedAt:    finalStatus === 'FAILED'    ? now : undefined,
      },
    })

    await KimmpTrace.append(runId, [
      KimmpTrace.event(finalStatus === 'COMPLETED' ? 'RUN_COMPLETE' : 'RUN_FAILED', {
        data: { stepCount: Object.keys(stepResults).length, failedStep },
      }),
    ])

    // Write workflow memory
    await KimmpWorkflowMemory.record(runId, stepResults, finalStatus)

    return { ok: !failedStep, runId, stepResults, failedStep }
  }

  // Rollback a FAILED run — applies compensation in reverse execution order
  static async rollback(runId: string, ctx: EnterpriseContext): Promise<void> {
    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId },
      include: { workflow: true },
    })
    if (!run) throw new Error(`Run ${runId} not found`)
    if (!['FAILED', 'COMPENSATING'].includes(run.status)) throw new Error(`Run ${runId} is not in a FAILED state (status: ${run.status})`)

    await (prisma as any).kimmpWorkflowRun.update({ where: { id: runId }, data: { status: 'COMPENSATING' } })
    await KimmpTrace.append(runId, [KimmpTrace.event('COMPENSATE', { data: { by: ctx.userId, phase: 'start' } })])

    const dag = run.workflow.dag as WorkflowDAG
    const completedStepIds = Object.keys(run.stepResults ?? {})

    // Reverse order: compensate most-recently-completed steps first
    const completedNodes = dag.nodes
      .filter(n => completedStepIds.includes(n.id))
      .reverse()

    for (const node of completedNodes) {
      const output = (run.stepResults as any)[node.id]
      try {
        await compensateNode(node, runId, ctx, output)
      } catch (err: any) {
        logger.warn(`[WAOE] Compensation of ${node.id} failed: ${err.message}`)
      }
    }

    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runId },
      data:  { status: 'FAILED', outcome: 'COMPENSATED', completedAt: new Date() },
    })
    await KimmpTrace.append(runId, [KimmpTrace.event('COMPENSATE', { data: { by: ctx.userId, phase: 'complete', stepsCompensated: completedNodes.length } })])
  }

  // Resume a PAUSED run after approval
  static async resume(runId: string, ctx: EnterpriseContext): Promise<void> {
    const run = await (prisma as any).kimmpWorkflowRun.findUnique({
      where: { id: runId },
      include: { workflow: true },
    })
    if (!run || run.status !== 'PAUSED') throw new Error('Run not found or not paused')

    await KimmpTrace.append(runId, [KimmpTrace.event('APPROVAL_RECEIVED', { data: { by: ctx.userId } })])

    const dag = run.workflow.dag as any

    // Mark the approval gate itself as done (it's been approved)
    const approvalStepId = run.currentStep
    const priorResults: Record<string, any> = (run.stepResults as any) ?? {}
    const updatedResults: Record<string, any> = {
      ...priorResults,
      ...(approvalStepId
        ? { [approvalStepId]: { approved: true, approvedBy: ctx.userId, approvedAt: new Date().toISOString() } }
        : {}),
    }

    // Persist the approved state so the engine loads it via DB stepResults
    await (prisma as any).kimmpWorkflowRun.update({
      where: { id: runId },
      data:  { status: 'PAUSED', stepResults: updatedResults },
    })

    // Re-derive topological execution order for remaining steps
    const done       = new Set(Object.keys(updatedResults))
    const remaining  = dag.nodes.filter((n: any) => !done.has(n.id))
    const remainIds  = new Set(remaining.map((n: any) => n.id))

    // Kahn's algorithm on the remaining subgraph (done nodes satisfy their outgoing edges)
    const inDegree = new Map<string, number>(remaining.map((n: any) => [n.id, 0]))
    const adjList  = new Map<string, string[]>(remaining.map((n: any) => [n.id, []]))

    for (const e of (dag.edges ?? [])) {
      if (!remainIds.has(e.to)) continue
      if (done.has(e.from)) continue  // from-node already done — doesn't block
      if (!remainIds.has(e.from)) continue
      adjList.get(e.from)!.push(e.to)
      inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1)
    }

    const layers: string[][] = []
    let queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([id]) => id)
    while (queue.length > 0) {
      layers.push(queue)
      const next: string[] = []
      for (const id of queue) {
        for (const neighbor of adjList.get(id) ?? []) {
          const nd = (inDegree.get(neighbor) ?? 0) - 1
          inDegree.set(neighbor, nd)
          if (nd === 0) next.push(neighbor)
        }
      }
      queue = next
    }

    const compiled: CompiledWorkflow = {
      workflowId:    run.workflowId,
      workflowRunId: runId,
      dag:           dag,
      executionOrder: layers.length > 0 ? layers : [remaining.map((n: any) => n.id)],
    }

    await KimmpExecutionEngine.run(compiled, ctx)
  }
}
