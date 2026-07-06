import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

export const HubSpotAdapter: IntegrationAdapter = {
  actions: () => ['createContact', 'updateContact', 'createDeal', 'updateDeal', 'createNote', 'addActivity', 'searchContacts', 'listDeals'],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.accessToken) return { ok: false, message: 'Missing access token' }
    try {
      const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
        headers: { Authorization: `Bearer ${config.accessToken}`, 'Content-Type': 'application/json' },
      })
      if (res.ok) return { ok: true, message: 'HubSpot connected successfully' }
      const body = await res.json().catch(() => ({})) as any
      return { ok: false, message: body.message ?? `HTTP ${res.status}` }
    } catch (e: any) {
      return { ok: false, message: e.message }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const base    = 'https://api.hubapi.com'
    const headers = { Authorization: `Bearer ${config.accessToken}`, 'Content-Type': 'application/json' }

    try {
      switch (action) {
        case 'createContact': {
          const res = await fetch(`${base}/crm/v3/objects/contacts`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ properties: { email: params.email, firstname: params.firstName, lastname: params.lastName, phone: params.phone, company: params.company } }),
          })
          const data = await res.json() as any
          if (!res.ok) return { ok: false, summary: data.message ?? 'Failed to create contact', error: 'API_ERROR', data }
          return { ok: true, summary: `Contact created: ${params.email}`, data }
        }

        case 'updateContact': {
          if (!params.contactId) return { ok: false, summary: 'contactId required', error: 'MISSING_ID' }
          const res = await fetch(`${base}/crm/v3/objects/contacts/${params.contactId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ properties: params.properties ?? {} }),
          })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: 'Contact updated', data } : { ok: false, summary: data.message, error: 'API_ERROR' }
        }

        case 'createDeal': {
          const res = await fetch(`${base}/crm/v3/objects/deals`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ properties: { dealname: params.name, amount: params.amount, dealstage: params.stage ?? 'appointmentscheduled', closedate: params.closeDate, pipeline: params.pipeline ?? 'default' } }),
          })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: `Deal created: ${params.name}`, data } : { ok: false, summary: data.message, error: 'API_ERROR' }
        }

        case 'createNote': {
          if (!params.body) return { ok: false, summary: 'body required', error: 'MISSING_ID' }
          const res = await fetch(`${base}/crm/v3/objects/notes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ properties: { hs_note_body: params.body, hs_timestamp: Date.now() } }),
          })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: 'Note created', data } : { ok: false, summary: data.message, error: 'API_ERROR' }
        }

        case 'searchContacts': {
          const res = await fetch(`${base}/crm/v3/objects/contacts/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query: params.query, limit: params.limit ?? 10 }),
          })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: `Found ${data.total ?? 0} contacts`, data } : { ok: false, summary: data.message, error: 'API_ERROR' }
        }

        default:
          return { ok: false, summary: `Unknown action: ${action}`, error: 'UNKNOWN_ACTION' }
      }
    } catch (e: any) {
      return { ok: false, summary: `HubSpot error: ${e.message}`, error: 'EXCEPTION' }
    }
  },
}
