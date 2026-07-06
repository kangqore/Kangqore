import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

const ACTIONS = ['createIssue', 'updateIssue', 'addComment', 'transitionIssue', 'searchIssues'] as const

function headers(config: IntegrationConfig) {
  const creds = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64')
  return {
    Authorization: `Basic ${creds}`,
    'Content-Type': 'application/json',
    Accept:         'application/json',
  }
}

function base(config: IntegrationConfig, path: string) {
  return `${config.baseUrl.replace(/\/$/, '')}/rest/api/3${path}`
}

export const JiraAdapter: IntegrationAdapter = {
  actions: () => [...ACTIONS],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.baseUrl || !config.email || !config.apiToken) {
      return { ok: false, message: 'baseUrl, email, and apiToken are required' }
    }
    try {
      const res = await fetch(base(config, '/myself'), { headers: headers(config) })
      if (!res.ok) return { ok: false, message: `Jira returned HTTP ${res.status}` }
      const data = await res.json() as any
      return { ok: true, message: `Connected as ${data.displayName ?? data.emailAddress}` }
    } catch (e: any) {
      return { ok: false, message: `Connection failed: ${e.message}` }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const h = headers(config)

    switch (action) {
      case 'createIssue': {
        const body = {
          fields: {
            project:     { key: params.project },
            summary:     params.summary,
            description: params.description ? {
              type:    'doc',
              version: 1,
              content: [{ type: 'paragraph', content: [{ type: 'text', text: params.description }] }],
            } : undefined,
            issuetype:   { name: params.issueType ?? 'Task' },
            priority:    params.priority ? { name: params.priority } : undefined,
            labels:      params.labels ?? [],
          },
        }
        const res = await fetch(base(config, '/issue'), { method: 'POST', headers: h, body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create Jira issue', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Created Jira issue ${data.key}: ${params.summary}`, data }
      }
      case 'updateIssue': {
        const body = { fields: { summary: params.summary, priority: params.priority ? { name: params.priority } : undefined } }
        const res = await fetch(base(config, `/issue/${params.issueKey}`), { method: 'PUT', headers: h, body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: `Failed to update ${params.issueKey}`, error: await res.text() }
        return { ok: true, summary: `Updated Jira issue ${params.issueKey}` }
      }
      case 'addComment': {
        const body = {
          body: {
            type:    'doc',
            version: 1,
            content: [{ type: 'paragraph', content: [{ type: 'text', text: params.comment ?? params.text }] }],
          },
        }
        const res = await fetch(base(config, `/issue/${params.issueKey}/comment`), { method: 'POST', headers: h, body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: `Failed to add comment to ${params.issueKey}`, error: await res.text() }
        return { ok: true, summary: `Comment added to ${params.issueKey}` }
      }
      case 'transitionIssue': {
        // Get available transitions first
        const tRes = await fetch(base(config, `/issue/${params.issueKey}/transitions`), { headers: h })
        const tData = await tRes.json() as any
        const t = tData.transitions?.find((tr: any) =>
          tr.name.toLowerCase() === (params.transitionName ?? '').toLowerCase()
        )
        if (!t) return { ok: false, summary: `Transition "${params.transitionName}" not found`, error: 'TRANSITION_NOT_FOUND' }
        const res = await fetch(base(config, `/issue/${params.issueKey}/transitions`), {
          method: 'POST', headers: h,
          body: JSON.stringify({ transition: { id: t.id } }),
        })
        if (!res.ok) return { ok: false, summary: `Transition failed for ${params.issueKey}`, error: await res.text() }
        return { ok: true, summary: `${params.issueKey} transitioned to "${params.transitionName}"` }
      }
      case 'searchIssues': {
        const jql = params.jql ?? `project = "${params.project}" ORDER BY created DESC`
        const res = await fetch(base(config, `/search?jql=${encodeURIComponent(jql)}&maxResults=${params.limit ?? 10}`), { headers: h })
        if (!res.ok) return { ok: false, summary: 'Jira search failed', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Found ${data.total} issues`, data: data.issues }
      }
      default:
        return { ok: false, summary: `Unknown Jira action: ${action}`, error: 'UNKNOWN_ACTION' }
    }
  },
}
