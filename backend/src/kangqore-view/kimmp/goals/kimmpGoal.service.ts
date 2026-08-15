import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { prisma } from '../../../lib/prisma'
import { SignalLedger } from '../signals/signalLedger.service'
import { KimmpActionsService } from '../actions/kimmpActions.service'
import { KimmpResearchService } from '../research/kimmpResearch.service'
import { SCOUT_SOURCES, KimmpScoutService } from '../scout/kimmpScout.service'
import logger from '../../../utils/logger'

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

// Hours of CEO time each task type saves when KIMMP executes it
const LEVERAGE_HOURS: Record<string, number> = {
  QUERY_LEADS:    0.25,
  QUERY_PROJECTS: 0.25,
  QUERY_CLIENTS:  0.25,
  RESEARCH_QUERY: 2.0,
  SCOUT_RUN:      0.5,
  EMIT_SIGNAL:    0.1,
  MANUAL:         0,
}

export interface GoalTask {
  step:         number
  title:        string
  description:  string
  actionType:   string | null
  actionParams: Record<string, any> | null
  agentHint:    string | null
  dueDays:      number
}

export class KimmpGoalEngine {

  // ── Create a goal: Claude decomposes → persists as PENDING_APPROVAL ──────────
  static async create(objective: string, deadline?: string, ownerId?: string): Promise<any> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY required for goal decomposition')
    }

    const decomposed = await this.decompose(objective, deadline)

    const now   = new Date()
    const tasks = decomposed.tasks.map((t: GoalTask) => {
      const due = new Date(now)
      due.setDate(due.getDate() + (t.dueDays ?? 7))
      return {
        step:         t.step,
        title:        t.title,
        description:  t.description,
        actionType:   t.actionType ?? null,
        actionParams: t.actionParams ?? null,
        agentHint:    t.agentHint   ?? null,
        status:       'PENDING',
        dueDate:      due,
      }
    })

    const goal = await (prisma as any).kimmpGoal.create({
      data: {
        objective,
        deadline:    deadline ? new Date(deadline) : null,
        owner:       ownerId ?? null,
        status:      'PENDING_APPROVAL',
        strategy:    decomposed.strategy,
        progressPct: 0,
        tasks: { create: tasks },
      },
      include: { tasks: { orderBy: { step: 'asc' } } },
    })

    await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'GOAL_CREATED',
      signalCategory: 'SYSTEM',
      signalValue:    `New goal pending approval: ${objective.slice(0, 150)}`,
      severity:       'MODERATE',
      confidence:     90,
      metadata:       { goalId: goal.id },
    }).catch(() => {})

    return goal
  }

  // ── Decompose objective → strategy + tasks via Claude Sonnet ─────────────────
  private static async decompose(objective: string, deadline?: string): Promise<{ strategy: string; tasks: GoalTask[] }> {
    const res = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2000,
      temperature: 0.1,
      system: `You are KIMMP's Goal Decomposition Engine for Kangqore — an Indian B2B tech firm (digital transformation, school ITPx programs, MSME services, AI consulting).

Break the objective into a strategic plan and concrete executable tasks.

Return ONLY valid JSON:
{
  "strategy": "3-4 paragraph executive strategy in markdown — approach, rationale, success metrics",
  "tasks": [
    {
      "step": 1,
      "title": "Short task title (5-8 words)",
      "description": "Specific action — who does what, what the output is",
      "actionType": "QUERY_LEADS|QUERY_PROJECTS|QUERY_CLIENTS|RESEARCH_QUERY|SCOUT_RUN|EMIT_SIGNAL|MANUAL",
      "actionParams": {},
      "agentHint": "which KIMMP capability or human action",
      "dueDays": 7
    }
  ]
}

actionType rules:
- QUERY_LEADS: search/filter leads in CRM (actionParams: { status?, search?, limit? })
- QUERY_PROJECTS: check project status (actionParams: { status?, limit? })
- RESEARCH_QUERY: deep competitive/market research (actionParams: { question: "...", domain?: "..." })
- SCOUT_RUN: trigger external intelligence scan for a named source (actionParams: { sourceName: "Competitor Monitor|Government Tenders|Market Intelligence|Partnership Radar|Regulatory Watch|Tech Radar" })
- EMIT_SIGNAL: record a signal in the ledger (actionParams: { signalType, signalValue, severity? })
- MANUAL: requires ADMIN human action (actionParams: { instruction: "what the human must do" })

Rules:
- Generate 5-8 tasks ordered by dependency (earlier tasks inform later ones)
- Mix KIMMP-automated (QUERY_*, RESEARCH_QUERY, SCOUT_RUN) with MANUAL tasks
- At least one MANUAL task (final review or sign-off)
- dueDays: days from today when this task should be done (1–90)
- Be Kangqore-specific: reference ITPx, school partnerships, MSME, Jamshedpur where relevant`,
      messages: [{ role: 'user', content: `Objective: "${objective}"${deadline ? `\nDeadline: ${deadline}` : ''}` }],
    })

    const raw   = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Goal decomposition: no JSON returned')

    const parsed = JSON.parse(match[0])
    if (!parsed.strategy || !Array.isArray(parsed.tasks)) {
      throw new Error('Goal decomposition: invalid structure')
    }
    return parsed
  }

  // ── Approve: PENDING_APPROVAL → ACTIVE, start first task ─────────────────────
  static async approve(goalId: string, adminId: string): Promise<any> {
    const goal = await (prisma as any).kimmpGoal.update({
      where: { id: goalId },
      data:  { status: 'ACTIVE', approvedAt: new Date(), approvedBy: adminId },
      include: { tasks: { orderBy: { step: 'asc' } } },
    })

    // Mark first task IN_PROGRESS
    const firstTask = goal.tasks.find((t: any) => t.status === 'PENDING')
    if (firstTask) {
      await (prisma as any).kimmpGoalTask.update({
        where: { id: firstTask.id },
        data:  { status: 'IN_PROGRESS' },
      })
      // Auto-execute if KIMMP can handle it
      this.executeTask(goal, { ...firstTask, status: 'IN_PROGRESS' }).catch(() => {})
    }

    await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'GOAL_APPROVED',
      signalCategory: 'SYSTEM',
      signalValue:    `Goal approved and active: ${goal.objective.slice(0, 150)}`,
      severity:       'MODERATE',
      confidence:     95,
      metadata:       { goalId, approvedBy: adminId },
    }).catch(() => {})

    return goal
  }

  // ── Complete a task and advance the goal ──────────────────────────────────────
  static async completeTask(goalId: string, taskId: string, result?: string): Promise<any> {
    const task = await (prisma as any).kimmpGoalTask.update({
      where: { id: taskId },
      data:  { status: 'DONE', completedAt: new Date(), result: result ?? null },
    })

    // Log leverage hours saved
    const hours = LEVERAGE_HOURS[task.actionType ?? ''] ?? 0
    if (hours > 0) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)
      await (prisma as any).kimmpLeverageLog.create({
        data: {
          goalId,
          weekStarting:   weekStart,
          hoursRemoved:   hours,
          tasksCompleted: 1,
          description:    `${task.title} (${task.actionType ?? 'MANUAL'})`,
        },
      }).catch(() => {})
    }

    // Recalculate progress and find next task
    const allTasks = await (prisma as any).kimmpGoalTask.findMany({ where: { goalId }, orderBy: { step: 'asc' } })
    const done = allTasks.filter((t: any) => t.status === 'DONE').length
    const pct  = Math.round((done / allTasks.length) * 100)

    const nextTask = allTasks.find((t: any) => t.status === 'PENDING')

    if (!nextTask) {
      // All tasks done → complete the goal
      const goal = await (prisma as any).kimmpGoal.update({
        where: { id: goalId },
        data:  { status: 'COMPLETED', progressPct: 100 },
        include: { tasks: { orderBy: { step: 'asc' } } },
      })
      await SignalLedger.record({
        sourceModule:   'kimmp',
        signalType:     'GOAL_COMPLETED',
        signalCategory: 'SYSTEM',
        signalValue:    `Goal completed: ${goal.objective.slice(0, 150)}`,
        severity:       'HIGH',
        confidence:     100,
        metadata:       { goalId, progressPct: 100 },
      }).catch(() => {})
      return goal
    }

    // Advance to next task
    await (prisma as any).kimmpGoalTask.update({ where: { id: nextTask.id }, data: { status: 'IN_PROGRESS' } })
    const goal = await (prisma as any).kimmpGoal.update({
      where: { id: goalId },
      data:  { progressPct: pct },
      include: { tasks: { orderBy: { step: 'asc' } } },
    })

    // Auto-execute next task if KIMMP-automated
    this.executeTask(goal, nextTask).catch(() => {})
    return goal
  }

  // ── Scheduled tick: check overdue tasks, advance stalled goals ───────────────
  static async tick(): Promise<void> {
    let activeGoals: any[] = []
    try {
      activeGoals = await (prisma as any).kimmpGoal.findMany({
        where:   { status: 'ACTIVE' },
        include: { tasks: { orderBy: { step: 'asc' } } },
      })
    } catch { return }

    for (const goal of activeGoals) {
      const now         = new Date()
      const inProgress  = goal.tasks.filter((t: any) => t.status === 'IN_PROGRESS')
      const pending     = goal.tasks.filter((t: any) => t.status === 'PENDING')

      // Check overdue IN_PROGRESS tasks
      for (const task of inProgress) {
        if (task.dueDate && new Date(task.dueDate) < now) {
          await SignalLedger.record({
            sourceModule:   'kimmp',
            signalType:     'GOAL_TASK_OVERDUE',
            signalCategory: 'RISK',
            signalValue:    `Goal task overdue: "${task.title}" — ${goal.objective.slice(0, 100)}`,
            severity:       'HIGH',
            confidence:     95,
            metadata:       { goalId: goal.id, taskId: task.id },
          }).catch(() => {})
        }
      }

      // If no task is IN_PROGRESS, start the next PENDING one
      if (inProgress.length === 0 && pending.length > 0) {
        const next = pending[0]
        await (prisma as any).kimmpGoalTask.update({ where: { id: next.id }, data: { status: 'IN_PROGRESS' } })
        this.executeTask(goal, next).catch(() => {})
      }

      // Check if goal deadline is approaching (within 7 days)
      if (goal.deadline) {
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - now.getTime()) / 86_400_000)
        if (daysLeft > 0 && daysLeft <= 7) {
          const done = goal.tasks.filter((t: any) => t.status === 'DONE').length
          const pct  = Math.round((done / goal.tasks.length) * 100)
          if (pct < 70) {
            await SignalLedger.record({
              sourceModule:   'kimmp',
              signalType:     'GOAL_AT_RISK',
              signalCategory: 'RISK',
              signalValue:    `Goal deadline in ${daysLeft}d at ${pct}% complete: ${goal.objective.slice(0, 120)}`,
              severity:       daysLeft <= 3 ? 'CRITICAL' : 'HIGH',
              confidence:     90,
              metadata:       { goalId: goal.id, daysLeft, progressPct: pct },
            }).catch(() => {})
          }
        }
      }
    }
    logger.info(`[KIMMP:GOALS] Tick complete — ${activeGoals.length} active goals checked`)
  }

  // ── Execute a specific task if KIMMP-automated ────────────────────────────────
  private static async executeTask(goal: any, task: any): Promise<void> {
    if (!task.actionType || task.actionType === 'MANUAL') return

    try {
      let result = ''

      if (task.actionType === 'RESEARCH_QUERY') {
        const params = task.actionParams ?? {}
        const res    = await KimmpResearchService.query(params.question ?? goal.objective, params.domain)
        result = `Research complete: ${res.summary?.slice(0, 300)}`

      } else if (task.actionType === 'SCOUT_RUN') {
        const sourceName = task.actionParams?.sourceName ?? ''
        const source     = SCOUT_SOURCES.find(s => s.name === sourceName)
        if (source) {
          const { signals } = await KimmpScoutService.runSource(source)
          result = `Scout scan complete: ${signals} signals from "${sourceName}"`
        } else {
          // Run all if no specific source
          await KimmpScoutService.runAll()
          result = 'Full scout scan triggered'
        }

      } else {
        // QUERY_LEADS, QUERY_PROJECTS, QUERY_CLIENTS, EMIT_SIGNAL
        const validTypes = ['QUERY_LEADS','QUERY_PROJECTS','QUERY_CLIENTS','EMIT_SIGNAL','CREATE_LEAD','SCHEDULE_TASK','SEND_NOTIFICATION','UPDATE_LEAD_STATUS']
        if (validTypes.includes(task.actionType)) {
          const res = await KimmpActionsService.execute(task.actionType, task.actionParams ?? {})
          result = res.summary ?? 'Completed'
        }
      }

      if (result) {
        await this.completeTask(goal.id, task.id, result)
      }
    } catch (err: any) {
      logger.warn(`[KIMMP:GOALS] Task execution failed (${task.title}): ${err.message}`)
      await (prisma as any).kimmpGoalTask.update({
        where: { id: task.id },
        data:  { status: 'FAILED', result: `Error: ${err.message?.slice(0, 200)}` },
      }).catch(() => {})
    }
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────────
  static async list(limit = 20): Promise<any[]> {
    return (prisma as any).kimmpGoal.findMany({
      orderBy: { createdAt: 'desc' },
      take:    limit,
      include: { tasks: { orderBy: { step: 'asc' } } },
    }).catch(() => [])
  }

  static async getById(id: string): Promise<any | null> {
    return (prisma as any).kimmpGoal.findUnique({
      where:   { id },
      include: { tasks: { orderBy: { step: 'asc' } } },
    }).catch(() => null)
  }

  static async cancel(goalId: string): Promise<void> {
    await (prisma as any).kimmpGoal.update({
      where: { id: goalId },
      data:  { status: 'CANCELLED' },
    })
    await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'GOAL_CANCELLED',
      signalCategory: 'SYSTEM',
      signalValue:    `Goal cancelled: id=${goalId}`,
      severity:       'LOW',
      confidence:     100,
      metadata:       { goalId },
    }).catch(() => {})
  }

  // ── Executive Leverage Score — hours removed this week ────────────────────────
  static async getLeverageScore(): Promise<{ hoursThisWeek: number; hoursTotal: number; tasksCompleted: number; topGoals: any[] }> {
    try {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const [weekly, allTime] = await Promise.all([
        (prisma as any).kimmpLeverageLog.aggregate({
          where: { weekStarting: { gte: weekStart } },
          _sum:  { hoursRemoved: true, tasksCompleted: true },
        }),
        (prisma as any).kimmpLeverageLog.aggregate({
          _sum: { hoursRemoved: true, tasksCompleted: true },
        }),
      ])

      const topGoals = await (prisma as any).kimmpGoal.findMany({
        where:   { status: { in: ['ACTIVE', 'COMPLETED'] } },
        orderBy: { progressPct: 'desc' },
        take:    3,
        select:  { id: true, objective: true, status: true, progressPct: true, deadline: true },
      })

      return {
        hoursThisWeek:  Number(weekly._sum.hoursRemoved  ?? 0),
        hoursTotal:     Number(allTime._sum.hoursRemoved  ?? 0),
        tasksCompleted: Number(allTime._sum.tasksCompleted ?? 0),
        topGoals,
      }
    } catch {
      return { hoursThisWeek: 0, hoursTotal: 0, tasksCompleted: 0, topGoals: [] }
    }
  }
}
