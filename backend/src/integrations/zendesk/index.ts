import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

function headers(config: IntegrationConfig) {
  const token = Buffer.from(`${config.email}/token:${config.apiToken}`).toString('base64')
  return { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' }
}

export const ZendeskAdapter: IntegrationAdapter = {
  actions: () => ['createTicket', 'updateTicket', 'addComment', 'closeTicket', 'searchTickets', 'listTickets'],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.subdomain || !config.email || !config.apiToken) return { ok: false, message: 'subdomain, email, and apiToken required' }
    try {
      const res = await fetch(`https://${config.subdomain}.zendesk.com/api/v2/users/me`, { headers: headers(config) })
      if (res.ok) { const d = await res.json() as any; return { ok: true, message: `Connected as ${d.user?.email}` } }
      return { ok: false, message: `HTTP ${res.status}` }
    } catch (e: any) { return { ok: false, message: e.message } }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const base = `https://${config.subdomain}.zendesk.com/api/v2`
    const h    = headers(config)

    try {
      switch (action) {
        case 'createTicket': {
          const res = await fetch(`${base}/tickets`, {
            method: 'POST', headers: h,
            body: JSON.stringify({ ticket: { subject: params.subject, comment: { body: params.description ?? params.subject }, priority: params.priority ?? 'normal', type: params.type ?? 'problem', tags: params.tags ?? [] } }),
          })
          const data = await res.json() as any
          return res.ok
            ? { ok: true, summary: `Ticket #${data.ticket?.id} created: ${params.subject}`, data: data.ticket }
            : { ok: false, summary: data.description ?? 'Failed', error: 'API_ERROR' }
        }

        case 'updateTicket': {
          if (!params.ticketId) return { ok: false, summary: 'ticketId required', error: 'MISSING_ID' }
          const res = await fetch(`${base}/tickets/${params.ticketId}`, {
            method: 'PUT', headers: h,
            body: JSON.stringify({ ticket: { status: params.status, priority: params.priority, assignee_id: params.assigneeId } }),
          })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: 'Ticket updated', data: data.ticket } : { ok: false, summary: data.description, error: 'API_ERROR' }
        }

        case 'addComment': {
          if (!params.ticketId || !params.body) return { ok: false, summary: 'ticketId and body required', error: 'MISSING_ID' }
          const res = await fetch(`${base}/tickets/${params.ticketId}`, {
            method: 'PUT', headers: h,
            body: JSON.stringify({ ticket: { comment: { body: params.body, public: params.public ?? false } } }),
          })
          return res.ok ? { ok: true, summary: 'Comment added' } : { ok: false, summary: `HTTP ${res.status}`, error: 'API_ERROR' }
        }

        case 'closeTicket': {
          if (!params.ticketId) return { ok: false, summary: 'ticketId required', error: 'MISSING_ID' }
          const res = await fetch(`${base}/tickets/${params.ticketId}`, {
            method: 'PUT', headers: h,
            body: JSON.stringify({ ticket: { status: 'closed' } }),
          })
          return res.ok ? { ok: true, summary: `Ticket #${params.ticketId} closed` } : { ok: false, summary: `HTTP ${res.status}`, error: 'API_ERROR' }
        }

        case 'searchTickets': {
          const q   = encodeURIComponent(params.query ?? '')
          const res = await fetch(`${base}/search?query=type:ticket ${q}&per_page=10`, { headers: h })
          const data = await res.json() as any
          return res.ok ? { ok: true, summary: `Found ${data.count ?? 0} tickets`, data: data.results } : { ok: false, summary: 'Search failed', error: 'API_ERROR' }
        }

        default:
          return { ok: false, summary: `Unknown action: ${action}`, error: 'UNKNOWN_ACTION' }
      }
    } catch (e: any) {
      return { ok: false, summary: `Zendesk error: ${e.message}`, error: 'EXCEPTION' }
    }
  },
}
