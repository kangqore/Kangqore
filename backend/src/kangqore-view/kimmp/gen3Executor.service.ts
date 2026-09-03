/**
 * Gen3Executor — Auto-execution engine for PlanDecompositionTree
 * S80: removes manual Advance gate; executes subtasks sequentially,
 * emits PLAN_PROGRESS via socket, handles failure loop + timeout guard.
 * S92: replaced simulateSubtask() with real KIMMP LLM dispatch per agentRole.
 */

import { prisma } from '../../lib/prisma';
import { emitToAdmins } from '../../socket';
import { sonnet, textOf } from './llm/kimmpLLMRouter';

const MAX_CONCURRENT     = parseInt(process.env.GEN3_MAX_CONCURRENT_PLANS ?? '3', 10);
const SUBTASK_TIMEOUT_MS = 10 * 60 * 1000; // 10 min → auto-FAILED

// In-memory tracking so we never double-execute a plan in this process
const executing = new Set<string>();

interface Subtask {
  id:      string;
  label:   string;
  status:  string;
  agentRole: string;
  steps:   string[];
  result?: string;
}

function defaultSubtasks(): Subtask[] {
  return [
    { id: '1', label: 'Understand objective', status: 'PENDING', agentRole: 'RESEARCH',    steps: ['Parse goal semantics', 'Retrieve relevant memory', 'Identify constraints'] },
    { id: '2', label: 'Gather evidence',       status: 'PENDING', agentRole: 'DIAGNOSTICS', steps: ['Signal analysis', 'CRM context pull', 'OIS baseline check'] },
    { id: '3', label: 'Form hypothesis',       status: 'PENDING', agentRole: 'RESEARCH',    steps: ['Synthesise evidence', 'Generate alternatives', 'Score confidence'] },
    { id: '4', label: 'Simulate outcomes',     status: 'PENDING', agentRole: 'EXECUTION',   steps: ['Run decision simulation', 'Evaluate ROI per path', 'Risk-weight outcomes'] },
    { id: '5', label: 'Execute best path',     status: 'PENDING', agentRole: 'EXECUTION',   steps: ['KIMMP approval gate', 'Dispatch MissionDispatcher', 'Monitor completion'] },
    { id: '6', label: 'Capture learning',      status: 'PENDING', agentRole: 'COACH',       steps: ['Record outcome', 'Update KimmpMemory', 'Adjust future priors'] },
  ];
}

const ROLE_SYSTEM: Record<string, string> = {
  RESEARCH: `You are KIMMP's Research Agent. Given a strategic goal and subtask, retrieve context, identify constraints, and synthesise a concise intelligence brief. Be specific and structured.`,
  DIAGNOSTICS: `You are KIMMP's Diagnostics Agent. Analyse available signals and context to gather evidence relevant to the given goal. Surface risks, gaps, and confidence levels.`,
  EXECUTION: `You are KIMMP's Execution Agent. Given a strategy and context, determine the optimal execution path. Evaluate ROI, sequence dependencies, and surface the clearest next action.`,
  COACH: `You are KIMMP's Learning Agent. After plan execution, capture what was learned. Update priors, record outcome patterns, and produce a structured learning record for future runs.`,
}

// S116 — Sequential Multi-Agent Pipeline: dispatchSubtask accepts prior results for context chaining
async function dispatchSubtask(task: Subtask, goal: string, priorResults: string[] = []): Promise<{ status: 'DONE' | 'FAILED'; result: string }> {
  const system = ROLE_SYSTEM[task.agentRole] ?? ROLE_SYSTEM['RESEARCH'];

  const priorContext = priorResults.length > 0
    ? `\n\nPrior agent outputs (use as context):\n${priorResults.map((r, i) => `[Step ${i + 1}]: ${r}`).join('\n\n')}`
    : '';

  const user = `Goal: ${goal}\n\nSubtask: ${task.label}\nSteps: ${task.steps.join(', ')}${priorContext}\n\nComplete this subtask, building on prior agent work. Return a concise structured result (3–5 sentences).`;

  const res  = await sonnet(system, user, 800, { agentType: task.agentRole, tags: ['gen3', 'auto-exec', 'chained'] });
  const text = textOf(res);
  return { status: 'DONE', result: text };
}

async function executePlan(planId: string): Promise<void> {
  executing.add(planId);
  try {
    const plan = await (prisma as any).planDecompositionTree.findUnique({ where: { id: planId } });
    if (!plan) return;

    let subtasks: Subtask[] = plan.subtasks as Subtask[];
    let consecutiveFails = 0;
    // S116 — accumulate results for context chaining
    const priorResults: string[] = [];

    // Mark plan ACTIVE
    await (prisma as any).planDecompositionTree.update({ where: { id: planId }, data: { status: 'ACTIVE' } });

    for (let i = 0; i < subtasks.length; i++) {
      const task = subtasks[i];
      if (task.status === 'DONE') { if (task.result) priorResults.push(task.result); continue; }

      // ── PENDING → ACTIVE ──
      subtasks = subtasks.map((t, idx) => idx === i ? { ...t, status: 'ACTIVE' } : t);
      await (prisma as any).planDecompositionTree.update({ where: { id: planId }, data: { subtasks } });
      emitToAdmins('PLAN_PROGRESS', {
        type: 'SUBTASK_ACTIVE', planId, goal: plan.goal,
        subtasks, subtaskId: task.id, planStatus: 'ACTIVE',
        priorResultCount: priorResults.length,
        ts: new Date().toISOString(),
      });

      // ── Execute with timeout guard (S116: pass priorResults for chaining) ──
      const timeoutPromise = new Promise<{ status: 'FAILED'; result: string }>(resolve =>
        setTimeout(() => resolve({ status: 'FAILED', result: 'Subtask exceeded 10-minute timeout' }), SUBTASK_TIMEOUT_MS)
      );
      const dispatched = await Promise.race([
        dispatchSubtask(task, plan.goal, priorResults).catch((err: Error) => ({ status: 'FAILED' as const, result: err?.message ?? 'Dispatch error' })),
        timeoutPromise,
      ]);
      const result = dispatched.status;

      // ── ACTIVE → DONE / FAILED ──
      subtasks = subtasks.map((t, idx) => idx === i ? { ...t, status: result, result: dispatched.result } : t);
      await (prisma as any).planDecompositionTree.update({ where: { id: planId }, data: { subtasks } });
      // S116: accumulate successful results for next subtask context
      if (result === 'DONE' && dispatched.result) priorResults.push(dispatched.result);
      emitToAdmins('PLAN_PROGRESS', {
        type: `SUBTASK_${result}`, planId, goal: plan.goal,
        subtasks, subtaskId: task.id, planStatus: 'ACTIVE',
        priorResultCount: priorResults.length,
        ts: new Date().toISOString(),
      });

      if (result === 'FAILED') {
        consecutiveFails++;
        if (consecutiveFails >= 3) {
          // ── Failure loop: 3 consecutive failures → re-decompose ──
          const failedLabels = subtasks
            .filter(t => t.status === 'FAILED')
            .map(t => t.label)
            .join(', ');
          const newGoal = `[Re-plan: failures at ${failedLabels}] ${plan.goal}`;
          const newPlan = await (prisma as any).planDecompositionTree.create({
            data: {
              goal: newGoal,
              subtasks: defaultSubtasks(),
              status: 'PENDING',
              krisnamModelId: plan.krisnamModelId,
              createdBy: plan.createdBy,
              replannedAt: new Date(),
            },
          });
          await (prisma as any).planDecompositionTree.update({
            where: { id: planId },
            data: { status: 'FAILED', failureCount: consecutiveFails, completedAt: new Date() },
          });
          await (prisma as any).kimmpSignal.create({
            data: {
              type: 'GEN3_REPLAN', priority: 'high',
              title: `Gen3 Re-Plan triggered: ${plan.goal.slice(0, 80)}`,
              summary: `3 consecutive subtask failures at [${failedLabels}]. New plan: ${newPlan.id}`,
              module: 'Gen3', confidence: 85,
            },
          }).catch(() => {});
          emitToAdmins('PLAN_PROGRESS', {
            type: 'PLAN_REPLANNED', planId, newPlanId: newPlan.id, goal: plan.goal,
            planStatus: 'FAILED', ts: new Date().toISOString(),
          });
          // Drain concurrency slot before enqueuing replacement
          executing.delete(planId);
          enqueue(newPlan);
          return;
        }
      } else {
        consecutiveFails = 0;
      }
    }

    // ── All subtasks finished — close out plan ──
    const finalStatus = subtasks.every(t => t.status === 'DONE') ? 'DONE' : 'FAILED';
    await (prisma as any).planDecompositionTree.update({
      where: { id: planId },
      data: { status: finalStatus, completedAt: new Date(), failureCount: consecutiveFails },
    });
    await (prisma as any).kimmpSignal.create({
      data: {
        type: 'GEN3_PLAN_' + finalStatus,
        priority: finalStatus === 'FAILED' ? 'high' : 'medium',
        title: `Gen3 Plan ${finalStatus === 'DONE' ? 'completed' : 'failed'}: ${plan.goal.slice(0, 80)}`,
        summary: `PlanDecompositionTree ${planId} → ${finalStatus}`,
        module: 'Gen3', confidence: 95,
      },
    }).catch(() => {});
    emitToAdmins('PLAN_PROGRESS', {
      type: 'PLAN_COMPLETE', planId, goal: plan.goal,
      subtasks, planStatus: finalStatus,
      ts: new Date().toISOString(),
    });
  } finally {
    executing.delete(planId);
    // Pick up next PENDING plan (natural queue drain)
    const next = await (prisma as any).planDecompositionTree.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    }).catch(() => null);
    if (next) enqueue(next);
  }
}

export function enqueue(plan: any): void {
  if (executing.has(plan.id)) return;

  // Concurrency check (async, fire-and-forget pattern)
  ;(async () => {
    const activeCount = await (prisma as any).planDecompositionTree.count({ where: { status: 'ACTIVE' } });
    if (activeCount >= MAX_CONCURRENT) {
      console.log(`[Gen3Executor] Concurrency limit (${MAX_CONCURRENT}) reached — plan ${plan.id} queued`);
      return;
    }
    executePlan(plan.id).catch(err => {
      console.error(`[Gen3Executor] Plan ${plan.id} error:`, err.message);
      executing.delete(plan.id);
    });
  })();
}
