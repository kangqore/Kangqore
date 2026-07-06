import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

const ACTIONS = ['createLead', 'updateOpportunity', 'createTask', 'addNote', 'readContact'] as const

async function sfFetch(
  path: string, config: IntegrationConfig, init?: RequestInit,
): Promise<Response> {
  const instanceUrl = config.instanceUrl?.replace(/\/$/, '') ?? ''
  return fetch(`${instanceUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

const API = '/services/data/v59.0'

export const SalesforceAdapter: IntegrationAdapter = {
  actions: () => [...ACTIONS],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.accessToken || !config.instanceUrl) {
      return { ok: false, message: 'accessToken and instanceUrl are required' }
    }
    try {
      const res = await sfFetch(`${API}/limits`, config)
      if (!res.ok) return { ok: false, message: `Salesforce returned HTTP ${res.status}` }
      const data = await res.json() as any
      const remaining = data?.DailyApiRequests?.Remaining
      return { ok: true, message: `Connected · ${remaining ?? '?'} API calls remaining today` }
    } catch (e: any) {
      return { ok: false, message: `Connection failed: ${e.message}` }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    switch (action) {
      case 'createLead': {
        const body = {
          LastName:    params.lastName ?? params.name ?? 'Unknown',
          FirstName:   params.firstName,
          Company:     params.company ?? params.companyName ?? 'Unknown',
          Email:       params.email,
          Phone:       params.phone,
          LeadSource:  params.source ?? 'Kangqore OS',
          Description: params.description,
          Status:      params.status ?? 'Open - Not Contacted',
        }
        const res = await sfFetch(`${API}/sobjects/Lead`, config, { method: 'POST', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create SF Lead', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Created SF Lead: ${body.FirstName ?? ''} ${body.LastName} (${body.Company})`, data }
      }
      case 'updateOpportunity': {
        const { id, ...fields } = params
        if (!id) return { ok: false, summary: 'Opportunity id required', error: 'MISSING_ID' }
        const body: any = {}
        if (fields.stage)       body.StageName   = fields.stage
        if (fields.amount)      body.Amount       = fields.amount
        if (fields.closeDate)   body.CloseDate    = fields.closeDate
        if (fields.probability) body.Probability  = fields.probability
        if (fields.description) body.Description  = fields.description
        const res = await sfFetch(`${API}/sobjects/Opportunity/${id}`, config, { method: 'PATCH', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: `Failed to update Opportunity ${id}`, error: await res.text() }
        return { ok: true, summary: `SF Opportunity ${id} updated` }
      }
      case 'createTask': {
        const body = {
          Subject:      params.subject ?? params.title ?? 'Task from Kangqore OS',
          WhoId:        params.contactId,
          WhatId:       params.relatedId,
          ActivityDate: params.dueDate,
          Description:  params.description,
          Status:       params.status ?? 'Not Started',
          Priority:     params.priority ?? 'Normal',
        }
        const res = await sfFetch(`${API}/sobjects/Task`, config, { method: 'POST', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create SF Task', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Created SF Task: "${body.Subject}"`, data }
      }
      case 'addNote': {
        const body = {
          Title:   params.title ?? 'Note from Kangqore OS',
          Body:    params.body ?? params.content,
          ParentId: params.parentId,
        }
        const res = await sfFetch(`${API}/sobjects/Note`, config, { method: 'POST', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create SF Note', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Note added to SF record ${params.parentId}`, data }
      }
      case 'readContact': {
        const id = params.id ?? params.contactId
        if (!id) return { ok: false, summary: 'Contact id required', error: 'MISSING_ID' }
        const res = await sfFetch(`${API}/sobjects/Contact/${id}`, config)
        if (!res.ok) return { ok: false, summary: `Contact ${id} not found`, error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Retrieved SF Contact: ${data.Name}`, data }
      }
      default:
        return { ok: false, summary: `Unknown Salesforce action: ${action}`, error: 'UNKNOWN_ACTION' }
    }
  },
}
