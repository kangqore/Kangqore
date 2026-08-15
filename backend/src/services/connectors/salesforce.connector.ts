import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_SF_LEAD', 'CONVERT_SF_LEAD', 'UPDATE_SF_LEAD',
  'CREATE_SF_OPPORTUNITY', 'UPDATE_SF_OPPORTUNITY', 'CLOSE_SF_OPPORTUNITY',
  'CREATE_SF_CONTACT', 'CREATE_SF_ACCOUNT', 'CREATE_SF_CASE', 'CLOSE_SF_CASE',
  'LOG_SF_CALL', 'CREATE_SF_TASK', 'TRIGGER_SF_FLOW', 'ESCALATE_SF_CASE', 'ADD_TO_SF_CAMPAIGN',
])

// Requires: SALESFORCE_ACCESS_TOKEN, SALESFORCE_INSTANCE_URL (e.g. https://yourorg.my.salesforce.com)
export const SalesforceConnector: Connector = {
  name: 'salesforce',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const token       = process.env.SALESFORCE_ACCESS_TOKEN
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL

    if (!token || !instanceUrl) {
      logger.warn(`[SF:MOCK] ${actionName} — env not configured`)
      return { connector: 'salesforce', status: 'SKIPPED', message: 'SALESFORCE_ACCESS_TOKEN / SALESFORCE_INSTANCE_URL not configured' }
    }

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    const api     = `${instanceUrl}/services/data/v58.0/sobjects`

    try {
      if (actionName === 'CREATE_SF_LEAD') {
        const body = { FirstName: params.firstName, LastName: params.lastName, Email: params.email, Company: params.company, Phone: params.phone, Status: params.status ?? 'Open - Not Contacted' }
        const res = await axios.post(`${api}/Lead`, body, { headers, timeout: 10_000 })
        return { connector: 'salesforce', status: 'OK', message: `SF Lead created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_SF_OPPORTUNITY') {
        const body = { Name: params.name, AccountId: params.accountId, StageName: params.stage, CloseDate: params.closeDate, Amount: params.amount }
        const res = await axios.post(`${api}/Opportunity`, body, { headers, timeout: 10_000 })
        return { connector: 'salesforce', status: 'OK', message: `SF Opportunity created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_SF_CONTACT') {
        const body = { FirstName: params.firstName, LastName: params.lastName, Email: params.email, AccountId: params.accountId, Phone: params.phone, Title: params.title }
        const res = await axios.post(`${api}/Contact`, body, { headers, timeout: 10_000 })
        return { connector: 'salesforce', status: 'OK', message: `SF Contact created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_SF_CASE') {
        const body = { Subject: params.subject, Description: params.description, Priority: params.priority ?? 'Medium', Status: 'New', ContactId: params.contactId, AccountId: params.accountId }
        const res = await axios.post(`${api}/Case`, body, { headers, timeout: 10_000 })
        return { connector: 'salesforce', status: 'OK', message: `SF Case created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'TRIGGER_SF_FLOW') {
        const res = await axios.post(`${instanceUrl}/services/data/v58.0/actions/custom/flow/${params.flowApiName}`, { inputs: params.inputs ? JSON.parse(params.inputs) : [{}] }, { headers, timeout: 15_000, validateStatus: () => true })
        return res.status < 400
          ? { connector: 'salesforce', status: 'OK', message: `SF Flow ${params.flowApiName} triggered` }
          : { connector: 'salesforce', status: 'ERROR', message: `SF Flow ${res.status}: ${JSON.stringify(res.data)}` }
      }

      // Generic update / close via PATCH
      if (actionName === 'UPDATE_SF_LEAD' || actionName === 'UPDATE_SF_OPPORTUNITY' || actionName === 'CLOSE_SF_CASE' || actionName === 'CLOSE_SF_OPPORTUNITY') {
        const objectType = actionName.includes('LEAD') ? 'Lead' : actionName.includes('OPPORTUNITY') ? 'Opportunity' : 'Case'
        const id = params.recordId ?? params.leadId ?? params.opportunityId ?? params.caseId
        const patchBody = { ...params }
        delete patchBody.recordId; delete patchBody.leadId; delete patchBody.opportunityId; delete patchBody.caseId
        const res = await axios.patch(`${api}/${objectType}/${id}`, patchBody, { headers, timeout: 10_000, validateStatus: () => true })
        return res.status < 300
          ? { connector: 'salesforce', status: 'OK', message: `${objectType} ${id} updated` }
          : { connector: 'salesforce', status: 'ERROR', message: `SF ${res.status}: ${JSON.stringify(res.data)}` }
      }

      logger.warn(`[SF] No explicit handler for ${actionName} — using generic stub`)
      return { connector: 'salesforce', status: 'SKIPPED', message: `No real handler for ${actionName} — implement in salesforce.connector.ts` }
    } catch (e: any) {
      return { connector: 'salesforce', status: 'ERROR', message: e.message }
    }
  },
}
