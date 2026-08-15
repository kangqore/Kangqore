import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { prisma } from '../../../lib/prisma'
import { SignalLedger } from '../signals/signalLedger.service'
import { KimmpAuthorityEngine, ACTION_LEVELS } from '../authority/kimmpAuthority.service'
import { KimmpMemoryService } from '../memory/kimmpMemory.service'
import { KimmpReportService } from '../reports/kimmpReport.service'
import { AlisDemandResponder } from '../../../kangqore-alis/services/alisDemandResponder.service'
import { VisContentActioner } from '../../../kangqore-vis/services/visContentActioner.service'
import { KimmpToolDispatch } from './kimmpToolDispatch.service'
import type { Platform } from '../../../integrations/types'
import { checkPolicy } from '../../esf/PolicyEngine'

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

export type ActionType =
  // L0 — auto-execute, pure reads or safe KIMMP-internal writes
  | 'EXTERNAL_API_CALL'
  | 'QUERY_LEADS'
  | 'QUERY_PROJECTS'
  | 'QUERY_CLIENTS'
  | 'EMIT_SIGNAL'
  | 'ADD_MEMORY'
  | 'LOG_DECISION'
  | 'DISMISS_ALERT'
  // L1 — auto-execute, safe writes to Kangqore data
  | 'CREATE_LEAD'
  | 'SCHEDULE_TASK'
  | 'COMPLETE_GOAL_TASK'
  | 'CREATE_GOAL'
  | 'CREATE_GOAL_TASK'
  | 'GENERATE_REPORT'
  // L2 — auto-execute with notification (DRAFT only, not send)
  | 'SEND_NOTIFICATION'
  | 'UPDATE_LEAD_STATUS'
  // L1 — cross-module return channels (auto-execute)
  | 'TRIGGER_ALIS_RESPONSE'
  | 'UPDATE_VIS_OPPORTUNITY'
  // L3 — requires ADMIN approval
  | 'UPDATE_PROJECT_STATUS'
  | 'DRAFT_EMAIL'

export interface PendingAction {
  id:                  string
  type:                ActionType
  description:         string
  params:              Record<string, any>
  level:               number
  requiresConfirmation: boolean
}

export interface ActionResult {
  success: boolean
  summary: string
  data?:   any
}

export class KimmpActionsService {

  static parseAction(raw: any): { type: ActionType; description: string; params: Record<string,any>; level: number } | null {
    if (!raw?.type) return null
    const validTypes: ActionType[] = [
      'EXTERNAL_API_CALL',
      'QUERY_LEADS','QUERY_PROJECTS','QUERY_CLIENTS','EMIT_SIGNAL',
      'CREATE_LEAD','SCHEDULE_TASK','SEND_NOTIFICATION','UPDATE_LEAD_STATUS',
      'ADD_MEMORY','LOG_DECISION','DISMISS_ALERT',
      'COMPLETE_GOAL_TASK','CREATE_GOAL','CREATE_GOAL_TASK','GENERATE_REPORT',
      'TRIGGER_ALIS_RESPONSE','UPDATE_VIS_OPPORTUNITY',
      'UPDATE_PROJECT_STATUS','DRAFT_EMAIL',
    ]
    if (!validTypes.includes(raw.type)) return null
    return {
      type:        raw.type as ActionType,
      description: raw.description ?? raw.type,
      params:      raw.params ?? {},
      level:       ACTION_LEVELS[raw.type] ?? 3,
    }
  }

  static async queue(parsed: { type: ActionType; description: string; params: Record<string,any>; level: number }, actorId?: string): Promise<{
    queued:        boolean
    pendingAction?: PendingAction
    result?:       ActionResult
    policyDenied?: boolean
    policyReason?: string
  }> {
    // ── Policy check (before execution or queueing) ────────────────────────
    const policy = await checkPolicy({ trigger: parsed.type, params: parsed.params, actorId }).catch(() => null)
    if (policy?.effect === 'DENY') {
      return {
        queued: false, policyDenied: true, policyReason: policy.reason,
        result: { success: false, summary: `Blocked by policy: ${policy.reason}` },
      }
    }
    // REQUIRE_APPROVAL from policy always escalates regardless of agent level
    const effectiveLevel = policy?.effect === 'REQUIRE_APPROVAL' ? 3 : parsed.level

    if (effectiveLevel <= 2) {
      const result = await this.execute(parsed.type, parsed.params)
      return { queued: false, result }
    }
    const approvalId = await KimmpAuthorityEngine.createApprovalRequest({  // effectiveLevel is L3
      tool:        parsed.type,
      action:      parsed.type,
      description: parsed.description,
      input:       { type: parsed.type, params: parsed.params },
      level:       parsed.level,
    })
    return {
      queued: true,
      pendingAction: {
        id:                  approvalId,
        type:                parsed.type,
        description:         parsed.description,
        params:              parsed.params,
        level:               parsed.level,
        requiresConfirmation: true,
      },
    }
  }

  static async confirm(approvalId: string, adminId: string): Promise<ActionResult> {
    const approved = await KimmpAuthorityEngine.approve(approvalId, adminId)
    if (!approved) return { success: false, summary: 'Approval request not found or already reviewed' }
    return this.execute(approved.action as ActionType, approved.input?.params ?? {})
  }

  static async execute(type: ActionType, params: Record<string, any>, context?: { adminId?: string }): Promise<ActionResult> {
    try {
      switch (type) {
        // ── L3 — External integrations (requires admin approval, then executes) ──
        case 'EXTERNAL_API_CALL': return await this.externalApiCall(params, context?.adminId)
        // ── L0 ──────────────────────────────────────────────────────────────
        case 'QUERY_LEADS':        return await this.queryLeads(params)
        case 'QUERY_PROJECTS':     return await this.queryProjects(params)
        case 'QUERY_CLIENTS':      return await this.queryClients(params)
        case 'EMIT_SIGNAL':        return await this.emitSignal(params)
        case 'ADD_MEMORY':         return await this.addMemory(params)
        case 'LOG_DECISION':       return await this.logDecision(params)
        case 'DISMISS_ALERT':      return await this.dismissAlert(params)
        // ── L1 ──────────────────────────────────────────────────────────────
        case 'CREATE_LEAD':        return await this.createLead(params)
        case 'SCHEDULE_TASK':      return await this.scheduleTask(params)
        case 'COMPLETE_GOAL_TASK': return await this.completeGoalTask(params)
        case 'CREATE_GOAL':              return await this.createGoal(params)
        case 'CREATE_GOAL_TASK':         return await this.createGoalTask(params)
        case 'GENERATE_REPORT':          return await this.generateReport(params)
        case 'TRIGGER_ALIS_RESPONSE':    return await this.triggerAlisResponse(params)
        case 'UPDATE_VIS_OPPORTUNITY':   return await this.updateVisOpportunity(params)
        // ── L2 ──────────────────────────────────────────────────────────────
        case 'UPDATE_LEAD_STATUS': return await this.updateLeadStatus(params)
        case 'SEND_NOTIFICATION':  return await this.sendNotification(params)
        // ── L3 (executed post-approval) ──────────────────────────────────────
        case 'UPDATE_PROJECT_STATUS': return await this.updateProjectStatus(params)
        case 'DRAFT_EMAIL':           return await this.draftEmail(params)
        default: return { success: false, summary: `Unknown action: ${type}` }
      }
    } catch (e: any) {
      return { success: false, summary: `Action failed: ${e.message}` }
    }
  }

  // ── L0 executors ────────────────────────────────────────────────────────────

  private static async queryLeads(p: any): Promise<ActionResult> {
    const leads = await (prisma as any).eqoreLead.findMany({
      where: {
        ...(p.status ? { status: p.status } : {}),
        ...(p.search ? { OR: [
          { name:        { contains: p.search, mode: 'insensitive' } },
          { email:       { contains: p.search, mode: 'insensitive' } },
          { companyName: { contains: p.search, mode: 'insensitive' } },
        ]} : {}),
      },
      take:    Math.min(p.limit ?? 5, 20),
      orderBy: { createdAt: 'desc' },
      select:  { id:true, name:true, email:true, companyName:true, status:true, leadScore:true, primaryIntent:true },
    })
    return { success: true, summary: `Found ${leads.length} lead(s)`, data: leads }
  }

  private static async queryProjects(p: any): Promise<ActionResult> {
    const projects = await prisma.project.findMany({
      where:   { ...(p.status ? { status: p.status } : {}) },
      take:    Math.min(p.limit ?? 5, 20),
      orderBy: { createdAt: 'desc' },
      select:  { id:true, title:true, status:true, health:true, budget:true, spend:true },
    })
    return { success: true, summary: `Found ${projects.length} project(s)`, data: projects }
  }

  private static async queryClients(p: any): Promise<ActionResult> {
    try {
      const clients = await (prisma as any).clientCRM.findMany({ take: Math.min(p.limit ?? 5, 20) })
      return { success: true, summary: `Found ${clients.length} client(s)`, data: clients }
    } catch {
      return { success: true, summary: 'Client data unavailable', data: [] }
    }
  }

  private static async emitSignal(p: any): Promise<ActionResult> {
    const id = await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     p.signalType ?? 'OPERATOR_ACTION',
      signalCategory: 'SYSTEM',
      signalValue:    p.signalValue ?? 'Signal emitted by KIMMP',
      severity:       p.severity ?? 'LOW',
      confidence:     p.confidence ?? 90,
    })
    return { success: true, summary: 'Signal emitted', data: { id } }
  }

  private static async addMemory(p: any): Promise<ActionResult> {
    await KimmpMemoryService.store({
      memoryType: p.memoryType ?? 'ORG_KNOWLEDGE',
      key:        p.key ?? `kimmp_action_${Date.now()}`,
      value:      p.value ?? p.content ?? '',
      confidence: p.confidence ?? 0.85,
      source:     'KIMMP_ACTION',
      userId:     p.userId,
    })
    return { success: true, summary: 'Memory stored', data: { key: p.key } }
  }

  private static async logDecision(p: any): Promise<ActionResult> {
    try {
      const row = await (prisma as any).kimmpDecision.create({
        data: {
          description: p.description ?? 'KIMMP decision logged',
          status:      p.status ?? 'NOTED',
          rationale:   p.rationale ?? null,
          source:      'KIMMP_ACTION',
        },
      })
      return { success: true, summary: 'Decision logged', data: { id: row.id } }
    } catch {
      // kimmpDecision table schema may differ — fallback to memory
      await KimmpMemoryService.store({
        memoryType: 'ORG_KNOWLEDGE',
        key:        `decision_${Date.now()}`,
        value:      p.description ?? 'Decision noted',
        confidence: 0.9,
        source:     'KIMMP_ACTION',
      })
      return { success: true, summary: 'Decision logged (via memory fallback)', data: {} }
    }
  }

  private static async dismissAlert(p: any): Promise<ActionResult> {
    if (!p.alertId) return { success: false, summary: 'alertId required' }
    await (prisma as any).kimmpProactiveAlert.update({
      where: { id: p.alertId },
      data:  { dismissed: true },
    }).catch(() => {})
    return { success: true, summary: 'Alert dismissed', data: { alertId: p.alertId } }
  }

  // ── L1 executors ────────────────────────────────────────────────────────────

  private static async createLead(p: any): Promise<ActionResult> {
    const lead = await (prisma as any).eqoreLead.create({
      data: {
        name:          p.name ?? 'Unknown',
        email:         p.email ?? null,
        companyName:   p.company ?? null,
        status:        'NEW',
        leadScore:     50,
        sessionId:     `kimmp-${Date.now()}`,
        conversationId:`kimmp-${Date.now()}`,
        sourcePage:    '/os/admin/kimmp',
      },
    })
    return { success: true, summary: `Lead created: ${p.name ?? 'Unknown'}`, data: { id: lead.id } }
  }

  private static async scheduleTask(p: any): Promise<ActionResult> {
    const id = await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'TASK_SCHEDULED',
      signalCategory: 'SYSTEM',
      signalValue:    `Task: ${p.task ?? 'Follow-up'} — due ${p.dueDate ?? 'soon'}`,
      severity:       'MODERATE',
      confidence:     100,
    })
    return { success: true, summary: `Task scheduled: ${p.task ?? 'Follow-up'}`, data: { signalId: id } }
  }

  private static async completeGoalTask(p: any): Promise<ActionResult> {
    if (!p.goalId || !p.taskId) return { success: false, summary: 'goalId and taskId required' }
    await (prisma as any).kimmpGoalTask.update({
      where: { id: p.taskId },
      data:  { status: 'DONE', completedAt: new Date(), result: p.result ?? 'Completed by KIMMP action' },
    }).catch(() => {})
    await SignalLedger.record({
      sourceModule: 'kimmp', signalType: 'GOAL_TASK_COMPLETED', signalCategory: 'SYSTEM',
      signalValue: `Task ${p.taskId} marked complete`, severity: 'LOW', confidence: 90,
    }).catch(() => {})
    return { success: true, summary: 'Goal task completed', data: { taskId: p.taskId } }
  }

  private static async createGoal(p: any): Promise<ActionResult> {
    if (!p.objective) return { success: false, summary: '`objective` is required' }
    const goal = await (prisma as any).kimmpGoal.create({
      data: {
        objective:     p.objective,
        deadline:      p.deadline ? new Date(p.deadline) : null,
        status:        'PENDING_APPROVAL',
        strategy:      p.strategy ?? 'Strategy to be defined by KIMMP Goal Engine upon approval.',
        tasks:         [],
        progressPct:   0,
        leverageScore: 0,
      },
    })
    await SignalLedger.record({
      sourceModule: 'kimmp', signalType: 'GOAL_CREATED', signalCategory: 'SYSTEM',
      signalValue: `Goal created (pending approval): ${p.objective.slice(0, 100)}`,
      severity: 'LOW', confidence: 80,
    }).catch(() => {})
    return { success: true, summary: `Goal created — awaiting ADMIN approval`, data: { id: goal.id, objective: p.objective } }
  }

  private static async createGoalTask(p: any): Promise<ActionResult> {
    if (!p.goalId || !p.title) return { success: false, summary: '`goalId` and `title` required' }
    const task = await (prisma as any).kimmpGoalTask.create({
      data: {
        goalId:    p.goalId,
        title:     p.title,
        status:    'PENDING',
        taskType:  p.taskType ?? 'MANUAL',
        dueDate:   p.dueDate ? new Date(p.dueDate) : null,
        notes:     p.notes ?? null,
      },
    })
    return { success: true, summary: `Task added to goal`, data: { taskId: task.id } }
  }

  private static async generateReport(p: any): Promise<ActionResult> {
    const validTypes = ['DAILY_BRIEFING','WEEKLY_EXECUTIVE','MONTHLY_BOARD','SALES_PIPELINE']
    const type       = validTypes.includes(p.type) ? p.type : 'DAILY_BRIEFING'
    const report     = await KimmpReportService.generate(type as any, p.userId)
    return { success: true, summary: `${type} report generated`, data: { id: (report as any).id } }
  }

  // ── L2 executors ────────────────────────────────────────────────────────────

  private static async updateLeadStatus(p: any): Promise<ActionResult> {
    if (!p.leadId || !p.status) return { success: false, summary: '`leadId` and `status` required' }
    await (prisma as any).eqoreLead.updateMany({ where: { id: p.leadId }, data: { status: p.status } })
    return { success: true, summary: `Lead status → ${p.status}`, data: { leadId: p.leadId } }
  }

  private static async sendNotification(p: any): Promise<ActionResult> {
    const id = await SignalLedger.record({
      sourceModule:   'kimmp',
      signalType:     'INTERNAL_NOTIFICATION',
      signalCategory: 'SYSTEM',
      signalValue:    p.message ?? 'KIMMP notification',
      severity:       'LOW',
      confidence:     100,
    })
    return { success: true, summary: 'Notification sent', data: { signalId: id } }
  }

  // ── L3 executors (run post-ADMIN-approval) ───────────────────────────────────

  private static async updateProjectStatus(p: any): Promise<ActionResult> {
    if (!p.projectId || !p.status) return { success: false, summary: '`projectId` and `status` required' }
    await (prisma as any).project.update({ where: { id: p.projectId }, data: { status: p.status } })
    return { success: true, summary: `Project status → ${p.status}`, data: { projectId: p.projectId } }
  }

  private static async draftEmail(p: any): Promise<ActionResult> {
    let subject = p.subject ?? ''
    let body    = p.body ?? ''

    if ((!subject || !body) && process.env.ANTHROPIC_API_KEY) {
      const res = await anthropic.messages.create({
        model:       'claude-haiku-4-5-20251001',
        max_tokens:  400,
        temperature: 0.2,
        system:      'Write a professional, concise email for an Indian B2B tech firm (Kangqore). Return JSON only: { "subject": "...", "body": "..." }',
        messages:    [{ role: 'user', content: `To: ${p.to ?? 'recipient'}\nContext: ${p.context ?? p.description ?? 'Business follow-up'}` }],
      })
      const raw   = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        subject = parsed.subject ?? subject
        body    = parsed.body    ?? body
      }
    }

    // Store draft in memory for retrieval
    await KimmpMemoryService.store({
      memoryType: 'ORG_KNOWLEDGE',
      key:        `email_draft_${Date.now()}`,
      value:      `To: ${p.to ?? 'TBD'} | Subject: ${subject} | Body: ${body.slice(0, 200)}`,
      confidence: 0.9,
      source:     'KIMMP_ACTION',
    }).catch(() => {})

    return {
      success: true,
      summary: `Email draft ready — "${subject}"`,
      data:    { to: p.to, subject, body },
    }
  }

  // ── External API calls (via Integration Hub) ─────────────────────────────────

  private static async externalApiCall(p: any, adminId?: string): Promise<ActionResult> {
    const platform = p.platform as Platform
    const action   = p.action as string
    const params   = p.params ?? {}

    if (!platform || !action) {
      return { success: false, summary: 'EXTERNAL_API_CALL requires platform and action' }
    }

    // Resolve the userId: adminId (from approval), or fall back to the first admin user
    let userId = adminId ?? p.userId
    if (!userId) {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } })
      userId = admin?.id ?? ''
    }

    const result = await KimmpToolDispatch.dispatch({ platform, action, params, userId })
    return {
      success: result.ok,
      summary: result.summary,
      data:    result.data,
    }
  }

  // ── Cross-module return channels ─────────────────────────────────────────────

  private static async triggerAlisResponse(p: any): Promise<ActionResult> {
    const department = p.department ?? p.dept ?? 'General'
    const severity   = p.severity  ?? 'MODERATE'
    const result     = await AlisDemandResponder.respond(department, severity, p.metadata ?? {})
    return {
      success: result.signalEmitted,
      summary: `ALIS response triggered for "${department}" — ${result.leadsUpdated} leads reprioritised`,
      data:    result,
    }
  }

  private static async updateVisOpportunity(p: any): Promise<ActionResult> {
    const result = await VisContentActioner.action({
      opportunityId: p.opportunityId,
      slug:          p.slug,
      action:        p.action ?? 'ACTIONED',
      notes:         p.notes,
      assignedTo:    p.assignedTo,
    })
    return {
      success: result.signalEmitted,
      summary: `VIS opportunity "${p.slug ?? p.opportunityId}" → ${result.newStatus}`,
      data:    result,
    }
  }
}
