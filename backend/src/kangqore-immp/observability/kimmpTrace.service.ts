// D8 — KimmpTrace
// Distributed tracing for enterprise AI workflows.
// Every step, agent call, and external API hit creates a trace event.
// Stored in KimmpWorkflowRun.trace (JSON array).

import { prisma } from '../../lib/prisma'

export type TraceEventType =
  | 'RUN_START'
  | 'RUN_COMPLETE'
  | 'RUN_FAILED'
  | 'STEP_START'
  | 'STEP_COMPLETE'
  | 'STEP_FAILED'
  | 'STEP_RETRY'
  | 'AGENT_CALL'
  | 'AGENT_RESULT'
  | 'EXTERNAL_API'
  | 'POLICY_CHECK'
  | 'APPROVAL_WAIT'
  | 'APPROVAL_RECEIVED'
  | 'CHECKPOINT'
  | 'COMPENSATE'
  | 'MEMORY_WRITE'

export interface TraceEvent {
  ts:         string           // ISO timestamp
  event:      TraceEventType
  stepId?:    string
  agentType?: string
  platform?:  string
  durationMs?: number
  data?:      Record<string, any>
  error?:     string
}

export class KimmpTrace {

  static event(type: TraceEventType, extra: Omit<TraceEvent, 'ts' | 'event'> = {}): TraceEvent {
    return { ts: new Date().toISOString(), event: type, ...extra }
  }

  static async append(runId: string, events: TraceEvent[]): Promise<void> {
    try {
      const run = await (prisma as any).kimmpWorkflowRun.findUnique({
        where: { id: runId },
        select: { trace: true },
      })
      if (!run) return
      const existing: TraceEvent[] = Array.isArray(run.trace) ? run.trace : []
      await (prisma as any).kimmpWorkflowRun.update({
        where: { id: runId },
        data:  { trace: [...existing, ...events] },
      })
    } catch {}
  }

  static async checkpoint(runId: string, stepId: string, stepResults: Record<string, any>): Promise<void> {
    try {
      const run = await (prisma as any).kimmpWorkflowRun.findUnique({
        where: { id: runId },
        select: { checkpoints: true },
      })
      const existing: any[] = Array.isArray(run?.checkpoints) ? run.checkpoints : []
      await (prisma as any).kimmpWorkflowRun.update({
        where: { id: runId },
        data:  {
          checkpoints: [...existing, { ts: new Date().toISOString(), stepId, stepResults }],
          currentStep: stepId,
        },
      })
      // Record the checkpoint in the trace so observability checks can find it
      await KimmpTrace.append(runId, [KimmpTrace.event('CHECKPOINT', { stepId, data: { stepCount: Object.keys(stepResults).length } })])
    } catch {}
  }

  // Compact summary for frontend display
  static summarise(trace: TraceEvent[]): {
    stepCount: number
    agentCalls: number
    apiCalls: number
    totalMs: number
    errors: string[]
  } {
    const start  = trace.find(e => e.event === 'RUN_START')
    const end    = trace.find(e => e.event === 'RUN_COMPLETE' || e.event === 'RUN_FAILED')
    const startMs = start ? new Date(start.ts).getTime() : 0
    const endMs   = end   ? new Date(end.ts).getTime()   : Date.now()

    return {
      stepCount:  trace.filter(e => e.event === 'STEP_START').length,
      agentCalls: trace.filter(e => e.event === 'AGENT_CALL').length,
      apiCalls:   trace.filter(e => e.event === 'EXTERNAL_API').length,
      totalMs:    endMs - startMs,
      errors:     trace.filter(e => e.error).map(e => e.error!),
    }
  }
}
