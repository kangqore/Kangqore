import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_SN_INCIDENT', 'UPDATE_SN_INCIDENT', 'RESOLVE_SN_INCIDENT', 'ASSIGN_SN_INCIDENT',
  'CREATE_SN_CHANGE', 'APPROVE_SN_CHANGE', 'IMPLEMENT_SN_CHANGE', 'CLOSE_SN_CHANGE',
  'CREATE_SN_PROBLEM', 'UPDATE_SN_CI', 'CREATE_SN_SERVICE_REQUEST', 'APPROVE_SN_SERVICE_REQUEST',
  'CREATE_SN_KB_ARTICLE', 'ADD_SN_WORK_NOTES',
])

// Requires: SERVICENOW_INSTANCE (e.g. https://dev12345.service-now.com), SERVICENOW_USER, SERVICENOW_PASSWORD
export const ServiceNowConnector: Connector = {
  name: 'servicenow',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const instance = process.env.SERVICENOW_INSTANCE
    const user     = process.env.SERVICENOW_USER
    const password = process.env.SERVICENOW_PASSWORD

    if (!instance || !user || !password) {
      logger.warn(`[SN:MOCK] ${actionName} — env not configured`)
      return { connector: 'servicenow', status: 'SKIPPED', message: 'SERVICENOW_INSTANCE / SERVICENOW_USER / SERVICENOW_PASSWORD not configured' }
    }

    const auth    = Buffer.from(`${user}:${password}`).toString('base64')
    const headers = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', Accept: 'application/json' }
    const api     = `${instance}/api/now`

    try {
      if (actionName === 'CREATE_SN_INCIDENT') {
        const body = {
          short_description: params.shortDescription,
          description:       params.description,
          urgency:           params.urgency,
          impact:            params.impact,
          category:          params.category,
          assignment_group:  params.assignmentGroup,
          caller_id:         params.caller,
        }
        const res = await axios.post(`${api}/table/incident`, body, { headers, timeout: 10_000 })
        const rec = res.data.result
        return { connector: 'servicenow', status: 'OK', message: `SN Incident created: ${rec.number}`, data: { sys_id: rec.sys_id, number: rec.number } }
      }

      if (actionName === 'ADD_SN_WORK_NOTES') {
        const res = await axios.patch(`${api}/table/${params.tableName}/${params.sysId}`, { work_notes: params.workNotes }, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'servicenow', status: 'OK', message: `Work notes added to ${params.tableName}/${params.sysId}` }
          : { connector: 'servicenow', status: 'ERROR', message: `SN ${res.status}: ${JSON.stringify(res.data)}` }
      }

      if (actionName === 'RESOLVE_SN_INCIDENT') {
        const body = {
          state: '6',
          close_code: params.resolutionCode,
          close_notes: params.resolutionNotes,
        }
        const res = await axios.patch(`${api}/table/incident/${params.incidentId}`, body, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'servicenow', status: 'OK', message: `SN Incident ${params.incidentId} resolved` }
          : { connector: 'servicenow', status: 'ERROR', message: `SN ${res.status}: ${JSON.stringify(res.data)}` }
      }

      if (actionName === 'CREATE_SN_CHANGE') {
        const body = {
          short_description: params.shortDescription,
          description:       params.description,
          type:              params.type,
          risk:              params.risk,
          category:          params.category,
          assignment_group:  params.assignmentGroup,
          start_date:        params.plannedStart,
          end_date:          params.plannedEnd,
        }
        const res = await axios.post(`${api}/table/change_request`, body, { headers, timeout: 10_000 })
        const rec = res.data.result
        return { connector: 'servicenow', status: 'OK', message: `SN Change ${rec.number} created`, data: { sys_id: rec.sys_id, number: rec.number } }
      }

      if (actionName === 'CREATE_SN_KB_ARTICLE') {
        const body = { short_description: params.shortDescription, text: params.text, kb_category: params.category, kb_knowledge_base: params.knowledgeBase }
        const res = await axios.post(`${api}/table/kb_knowledge`, body, { headers, timeout: 10_000 })
        const rec = res.data.result
        return { connector: 'servicenow', status: 'OK', message: `SN KB article created: ${rec.number}`, data: { sys_id: rec.sys_id } }
      }

      // Generic PATCH for update/approve/implement/close actions
      const tableMap: Record<string, string> = {
        UPDATE_SN_INCIDENT: 'incident', ASSIGN_SN_INCIDENT: 'incident',
        APPROVE_SN_CHANGE: 'change_request', IMPLEMENT_SN_CHANGE: 'change_request', CLOSE_SN_CHANGE: 'change_request',
        CREATE_SN_PROBLEM: 'problem', UPDATE_SN_CI: 'cmdb_ci',
      }
      const table = tableMap[actionName]
      if (table) {
        const recordId = params.incidentId ?? params.changeId ?? params.ciId ?? params.sysId ?? params.recordId
        if (!recordId) return { connector: 'servicenow', status: 'ERROR', message: 'No record ID provided' }
        const res = await axios.patch(`${api}/table/${table}/${recordId}`, params, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'servicenow', status: 'OK', message: `${actionName} applied to ${table}/${recordId}` }
          : { connector: 'servicenow', status: 'ERROR', message: `SN ${res.status}: ${JSON.stringify(res.data)}` }
      }

      logger.warn(`[SN] No explicit handler for ${actionName}`)
      return { connector: 'servicenow', status: 'SKIPPED', message: `No real handler for ${actionName}` }
    } catch (e: any) {
      return { connector: 'servicenow', status: 'ERROR', message: e.message }
    }
  },
}
