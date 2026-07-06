import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

const GQL = async (token: string, query: string, variables?: any) => {
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { Authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return res.json() as Promise<any>
}

export const LinearAdapter: IntegrationAdapter = {
  actions: () => ['createIssue', 'updateIssue', 'addComment', 'listIssues', 'getTeams'],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.apiKey) return { ok: false, message: 'Missing API key' }
    try {
      const data = await GQL(config.apiKey, '{ viewer { id email } }')
      if (data.data?.viewer?.email) return { ok: true, message: `Connected as ${data.data.viewer.email}` }
      return { ok: false, message: data.errors?.[0]?.message ?? 'Auth failed' }
    } catch (e: any) {
      return { ok: false, message: e.message }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    try {
      switch (action) {
        case 'createIssue': {
          const data = await GQL(config.apiKey, `
            mutation CreateIssue($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title url } } }
          `, { input: { title: params.title, description: params.description, teamId: params.teamId, priority: params.priority ?? 3, labelIds: params.labelIds } })
          const issue = data.data?.issueCreate?.issue
          return issue
            ? { ok: true, summary: `Issue created: ${issue.identifier} — ${issue.title}`, data: issue }
            : { ok: false, summary: data.errors?.[0]?.message ?? 'Issue creation failed', error: 'API_ERROR' }
        }

        case 'updateIssue': {
          if (!params.issueId) return { ok: false, summary: 'issueId required', error: 'MISSING_ID' }
          const data = await GQL(config.apiKey, `
            mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }
          `, { id: params.issueId, input: { stateId: params.stateId, priority: params.priority, assigneeId: params.assigneeId } })
          return data.data?.issueUpdate?.success
            ? { ok: true, summary: 'Issue updated' }
            : { ok: false, summary: 'Update failed', error: 'API_ERROR' }
        }

        case 'addComment': {
          if (!params.issueId || !params.body) return { ok: false, summary: 'issueId and body required', error: 'MISSING_ID' }
          const data = await GQL(config.apiKey, `
            mutation AddComment($input: CommentCreateInput!) { commentCreate(input: $input) { success } }
          `, { input: { issueId: params.issueId, body: params.body } })
          return data.data?.commentCreate?.success ? { ok: true, summary: 'Comment added' } : { ok: false, summary: 'Comment failed', error: 'API_ERROR' }
        }

        case 'getTeams': {
          const data = await GQL(config.apiKey, '{ teams { nodes { id name key } } }')
          return { ok: true, summary: `${data.data?.teams?.nodes?.length ?? 0} teams`, data: data.data?.teams?.nodes }
        }

        default:
          return { ok: false, summary: `Unknown action: ${action}`, error: 'UNKNOWN_ACTION' }
      }
    } catch (e: any) {
      return { ok: false, summary: `Linear error: ${e.message}`, error: 'EXCEPTION' }
    }
  },
}
