import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_ZD_TICKET', 'UPDATE_ZD_TICKET', 'SOLVE_ZD_TICKET', 'CLOSE_ZD_TICKET',
  'REOPEN_ZD_TICKET', 'ESCALATE_ZD_TICKET', 'ADD_ZD_COMMENT', 'ASSIGN_ZD_TICKET',
  'ADD_ZD_TAGS', 'MERGE_ZD_TICKETS', 'CREATE_ZD_USER', 'SUSPEND_ZD_USER',
  'APPLY_ZD_MACRO', 'PAUSE_ZD_SLA', 'CREATE_ZD_SATISFACTION_RATING',
])

// Requires: ZENDESK_SUBDOMAIN, ZENDESK_EMAIL, ZENDESK_API_TOKEN
export const ZendeskConnector: Connector = {
  name: 'zendesk',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const subdomain = process.env.ZENDESK_SUBDOMAIN
    const email     = process.env.ZENDESK_EMAIL
    const token     = process.env.ZENDESK_API_TOKEN

    if (!subdomain || !email || !token) {
      logger.warn(`[ZD:MOCK] ${actionName} — env not configured`)
      return { connector: 'zendesk', status: 'SKIPPED', message: 'ZENDESK_SUBDOMAIN / ZENDESK_EMAIL / ZENDESK_API_TOKEN not configured' }
    }

    const auth    = Buffer.from(`${email}/token:${token}`).toString('base64')
    const headers = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' }
    const api     = `https://${subdomain}.zendesk.com/api/v2`

    try {
      if (actionName === 'CREATE_ZD_TICKET') {
        const body = {
          ticket: {
            subject: params.subject, comment: { body: params.description },
            priority: params.priority, type: params.type,
            tags: params.tags ? params.tags.split(',').map((t: string) => t.trim()) : undefined,
            assignee_id: params.assigneeId, group_id: params.groupId,
            requester: params.requesterEmail ? { email: params.requesterEmail } : undefined,
          },
        }
        const res = await axios.post(`${api}/tickets`, body, { headers, timeout: 10_000 })
        return { connector: 'zendesk', status: 'OK', message: `ZD Ticket #${res.data.ticket.id} created`, data: { id: res.data.ticket.id } }
      }

      if (actionName === 'ADD_ZD_COMMENT') {
        const body = { ticket: { comment: { body: params.body, public: !params.internal, author_id: params.authorId } } }
        await axios.put(`${api}/tickets/${params.ticketId}`, body, { headers, timeout: 10_000 })
        return { connector: 'zendesk', status: 'OK', message: `Comment added to ZD ticket #${params.ticketId}` }
      }

      if (actionName === 'UPDATE_ZD_TICKET' || actionName === 'SOLVE_ZD_TICKET' || actionName === 'REOPEN_ZD_TICKET') {
        const update: any = {}
        if (params.status)     update.status = params.status
        if (params.priority)   update.priority = params.priority
        if (params.assigneeId) update.assignee_id = params.assigneeId
        if (params.groupId)    update.group_id = params.groupId
        if (actionName === 'SOLVE_ZD_TICKET')  update.status = 'solved'
        if (actionName === 'REOPEN_ZD_TICKET') update.status = 'open'
        if (params.comment) update.comment = { body: params.comment, public: !params.internal }
        const res = await axios.put(`${api}/tickets/${params.ticketId}`, { ticket: update }, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'zendesk', status: 'OK', message: `ZD ticket #${params.ticketId} updated` }
          : { connector: 'zendesk', status: 'ERROR', message: `ZD ${res.status}: ${JSON.stringify(res.data)}` }
      }

      if (actionName === 'ASSIGN_ZD_TICKET') {
        const body = { ticket: { assignee_id: params.assigneeId, group_id: params.groupId } }
        await axios.put(`${api}/tickets/${params.ticketId}`, body, { headers, timeout: 10_000 })
        return { connector: 'zendesk', status: 'OK', message: `ZD ticket #${params.ticketId} assigned` }
      }

      if (actionName === 'CREATE_ZD_USER') {
        const body = { user: { name: params.name, email: params.email, role: params.role, phone: params.phone, verified: params.verified } }
        const res = await axios.post(`${api}/users`, body, { headers, timeout: 10_000 })
        return { connector: 'zendesk', status: 'OK', message: `ZD user created: ${res.data.user.id}`, data: { id: res.data.user.id } }
      }

      if (actionName === 'APPLY_ZD_MACRO') {
        const res = await axios.get(`${api}/tickets/${params.ticketId}/macros/${params.macroId}/apply`, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 400
          ? { connector: 'zendesk', status: 'OK', message: `Macro applied to ZD ticket #${params.ticketId}` }
          : { connector: 'zendesk', status: 'ERROR', message: `ZD macro ${res.status}` }
      }

      logger.warn(`[ZD] No explicit handler for ${actionName}`)
      return { connector: 'zendesk', status: 'SKIPPED', message: `No real handler for ${actionName}` }
    } catch (e: any) {
      return { connector: 'zendesk', status: 'ERROR', message: e.message }
    }
  },
}
