import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_HS_CONTACT', 'UPDATE_HS_CONTACT', 'MERGE_HS_CONTACTS',
  'CREATE_HS_COMPANY', 'CREATE_HS_DEAL', 'UPDATE_HS_DEAL', 'MOVE_HS_DEAL_STAGE',
  'CREATE_HS_TICKET', 'CLOSE_HS_TICKET', 'ADD_TO_HS_LIST', 'ENROLL_HS_WORKFLOW',
  'LOG_HS_CALL', 'CREATE_HS_TASK',
])

// Requires: HUBSPOT_ACCESS_TOKEN
export const HubSpotConnector: Connector = {
  name: 'hubspot',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const token = process.env.HUBSPOT_ACCESS_TOKEN

    if (!token) {
      logger.warn(`[HS:MOCK] ${actionName} — HUBSPOT_ACCESS_TOKEN not configured`)
      return { connector: 'hubspot', status: 'SKIPPED', message: 'HUBSPOT_ACCESS_TOKEN not configured' }
    }

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    const api     = 'https://api.hubapi.com/crm/v3'

    try {
      if (actionName === 'CREATE_HS_CONTACT') {
        const body = { properties: { email: params.email, firstname: params.firstName, lastname: params.lastName, phone: params.phone, company: params.company, jobtitle: params.jobTitle, hubspot_owner_id: params.ownerId, lifecyclestage: params.lifecycleStage } }
        const res = await axios.post(`${api}/objects/contacts`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Contact created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'UPDATE_HS_CONTACT') {
        const body = { properties: { [params.property]: params.value } }
        const res = await axios.patch(`${api}/objects/contacts/${params.contactId}`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Contact ${params.contactId} updated` }
      }

      if (actionName === 'MERGE_HS_CONTACTS') {
        const res = await axios.post(`${api}/objects/contacts/merge`, { primaryObjectId: params.primaryContactId, objectIdToMerge: params.duplicateContactId }, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS contacts merged into ${params.primaryContactId}` }
      }

      if (actionName === 'CREATE_HS_COMPANY') {
        const body = { properties: { name: params.name, domain: params.domain, industry: params.industry, numberofemployees: params.size, annualrevenue: params.revenue, country: params.country, hubspot_owner_id: params.ownerId } }
        const res = await axios.post(`${api}/objects/companies`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Company created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_HS_DEAL') {
        const body = { properties: { dealname: params.name, amount: params.amount, dealstage: params.stage, closedate: params.closeDate, hubspot_owner_id: params.ownerId, pipeline: params.pipeline ?? 'default' } }
        const res = await axios.post(`${api}/objects/deals`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Deal created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'UPDATE_HS_DEAL' || actionName === 'MOVE_HS_DEAL_STAGE') {
        const prop = actionName === 'MOVE_HS_DEAL_STAGE' ? 'dealstage' : params.property
        const val  = actionName === 'MOVE_HS_DEAL_STAGE' ? params.stageId : params.value
        const body = { properties: { [prop]: val } }
        await axios.patch(`${api}/objects/deals/${params.dealId}`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Deal ${params.dealId} updated` }
      }

      if (actionName === 'CREATE_HS_TICKET') {
        const body = { properties: { subject: params.subject, content: params.description, hs_ticket_priority: params.priority, hs_pipeline_stage: params.status, hubspot_owner_id: params.ownerId } }
        const res = await axios.post(`${api}/objects/tickets`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS Ticket created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'LOG_HS_CALL') {
        const body = {
          properties: {
            hs_call_body:       params.notes,
            hs_call_duration:   params.duration ? params.duration * 60000 : undefined,
            hs_call_disposition: params.outcome,
            hs_call_direction:   params.direction,
            hs_timestamp:        Date.now(),
          },
        }
        const res = await axios.post(`${api}/objects/calls`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS call logged: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_HS_TASK') {
        const body = { properties: { hs_task_subject: params.subject, hs_task_body: params.body, hs_timestamp: params.dueDate ? new Date(params.dueDate).getTime() : undefined, hs_task_priority: params.priority, hs_task_type: params.type, hubspot_owner_id: params.ownerId } }
        const res = await axios.post(`${api}/objects/tasks`, body, { headers, timeout: 10_000 })
        return { connector: 'hubspot', status: 'OK', message: `HS task created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'ENROLL_HS_WORKFLOW') {
        const enrollId = params.contactId ?? params.companyId
        const res = await axios.post(`https://api.hubapi.com/automation/v2/workflows/${params.workflowId}/enrollments/contacts/${enrollId}`, {}, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'hubspot', status: 'OK', message: `Enrolled in HS workflow ${params.workflowId}` }
          : { connector: 'hubspot', status: 'ERROR', message: `HS workflow ${res.status}: ${JSON.stringify(res.data)}` }
      }

      logger.warn(`[HS] No explicit handler for ${actionName}`)
      return { connector: 'hubspot', status: 'SKIPPED', message: `No real handler for ${actionName}` }
    } catch (e: any) {
      const msg = e.response?.data?.message ?? e.message
      return { connector: 'hubspot', status: 'ERROR', message: msg }
    }
  },
}
