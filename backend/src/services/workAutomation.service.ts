// Work Automation service — trigger → condition → action engine for WorkItems.
// Automations fire when WorkItem mutations match the trigger type.
// Actions can set fields, assign items, notify, or call AI.

import { prisma } from '../lib/prisma'
import { WorkItemService } from './workItem.service'

export interface AutomationTrigger {
  type: 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'ASSIGNED' | 'DUE_DATE_PASSED' | 'CREATED' | 'PROGRESS_REACHED'
  config: Record<string, any>  // { from?, to?, field?, value? }
}

export interface AutomationCondition {
  field: string; op: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'contains' | 'in'; value: any
}

export type AutomationActionType =
  | 'SET_STATUS' | 'SET_PRIORITY' | 'SET_ASSIGNEE'
  | 'SET_FIELD' | 'NOTIFY' | 'CREATE_SUBITEM' | 'MARK_BLOCKED'

export interface AutomationAction {
  type: AutomationActionType
  params: Record<string, any>
}

function evalCondition(cond: AutomationCondition, item: any): boolean {
  const val = item[cond.field]
  switch (cond.op) {
    case 'eq':       return val === cond.value
    case 'neq':      return val !== cond.value
    case 'gt':       return val > cond.value
    case 'gte':      return val >= cond.value
    case 'lt':       return val < cond.value
    case 'contains': return typeof val === 'string' && val.includes(cond.value)
    case 'in':       return Array.isArray(cond.value) && cond.value.includes(val)
    default:         return false
  }
}

async function applyAction(action: AutomationAction, item: any): Promise<void> {
  switch (action.type) {
    case 'SET_STATUS':
      await WorkItemService.move(item.id, action.params.status)
      break
    case 'SET_PRIORITY':
      await WorkItemService.update(item.id, { priority: action.params.priority })
      break
    case 'SET_ASSIGNEE':
      await WorkItemService.update(item.id, { assigneeId: action.params.assigneeId })
      break
    case 'SET_FIELD':
      await WorkItemService.update(item.id, { customFields: { ...item.customFields, [action.params.field]: action.params.value } })
      break
    case 'MARK_BLOCKED':
      await WorkItemService.move(item.id, 'BLOCKED')
      break
    case 'CREATE_SUBITEM':
      await WorkItemService.create({
        title: action.params.title ?? `Sub-task of ${item.title}`,
        parentId: item.id,
        projectId: item.projectId,
        status: 'TODO',
        priority: item.priority,
      })
      break
    case 'NOTIFY':
      // Emit a signal for notification — consumed by SignalEngine
      await (prisma as any).kimmpSignal?.create({ data: { type: 'WORK_AUTOMATION_NOTIFY', payload: { itemId: item.id, message: action.params.message } } }).catch(() => {})
      break
  }
}

export const WorkAutomationService = {

  async run(triggerType: string, item: any, context?: Record<string, any>) {
    const automations = await (prisma as any).workAutomation.findMany({
      where: {
        enabled: true,
        OR: [
          { scope: 'GLOBAL' },
          { scope: 'PROJECT',   scopeId: item.projectId },
          { scope: 'PORTFOLIO', scopeId: item.portfolioId },
        ],
      },
    })

    for (const auto of automations) {
      const trigger = auto.trigger as AutomationTrigger
      if (trigger.type !== triggerType) continue

      // Check trigger config match
      if (triggerType === 'STATUS_CHANGE') {
        if (trigger.config.from && trigger.config.from !== context?.from) continue
        if (trigger.config.to   && trigger.config.to   !== context?.to)   continue
      }

      // Check conditions
      const conditions = (auto.conditions ?? []) as AutomationCondition[]
      if (!conditions.every(c => evalCondition(c, item))) continue

      // Apply all actions
      const actions = auto.actions as AutomationAction[]
      let lastResult: any = null
      try {
        for (const action of actions) await applyAction(action, item)
        lastResult = { ok: true, appliedAt: new Date().toISOString() }
      } catch (err: any) {
        lastResult = { ok: false, error: err?.message }
      }

      await (prisma as any).workAutomation.update({
        where: { id: auto.id },
        data: { runCount: { increment: 1 }, lastRunAt: new Date(), lastResult },
      })
    }
  },

  async list() {
    return (prisma as any).workAutomation.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async create(data: {
    name: string; description?: string; scope?: string; scopeId?: string
    trigger: AutomationTrigger; conditions?: AutomationCondition[]; actions: AutomationAction[]
  }) {
    return (prisma as any).workAutomation.create({
      data: {
        name: data.name, description: data.description,
        scope: data.scope ?? 'GLOBAL', scopeId: data.scopeId,
        trigger: data.trigger, conditions: data.conditions ?? [], actions: data.actions,
      },
    })
  },

  async toggle(id: string) {
    const a = await (prisma as any).workAutomation.findUnique({ where: { id } })
    if (!a) throw new Error('Automation not found')
    return (prisma as any).workAutomation.update({ where: { id }, data: { enabled: !a.enabled } })
  },

  async delete(id: string) {
    return (prisma as any).workAutomation.delete({ where: { id } })
  },
}
