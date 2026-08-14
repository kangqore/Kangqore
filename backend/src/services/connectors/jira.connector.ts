import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_JIRA_ISSUE', 'UPDATE_JIRA_ISSUE', 'TRANSITION_JIRA_ISSUE', 'ADD_JIRA_COMMENT',
  'ASSIGN_JIRA_ISSUE', 'CLOSE_JIRA_ISSUE', 'ADD_JIRA_LABEL', 'CREATE_JIRA_SPRINT',
  'START_JIRA_SPRINT', 'COMPLETE_JIRA_SPRINT', 'ADD_TO_SPRINT', 'CREATE_JIRA_EPIC',
  'LINK_JIRA_ISSUES', 'LOG_JIRA_TIME', 'CREATE_JIRA_VERSION', 'CREATE_JIRA_PROJECT',
])

// Requires: JIRA_BASE_URL (e.g. https://yourorg.atlassian.net), JIRA_API_TOKEN, JIRA_EMAIL
export const JiraConnector: Connector = {
  name: 'jira',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const baseUrl = process.env.JIRA_BASE_URL
    const token   = process.env.JIRA_API_TOKEN
    const email   = process.env.JIRA_EMAIL

    if (!baseUrl || !token || !email) {
      logger.warn(`[JIRA:MOCK] ${actionName} — env not configured`)
      return { connector: 'jira', status: 'SKIPPED', message: 'JIRA_BASE_URL / JIRA_API_TOKEN / JIRA_EMAIL not configured' }
    }

    const auth   = Buffer.from(`${email}:${token}`).toString('base64')
    const headers = { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', Accept: 'application/json' }
    const api     = `${baseUrl}/rest/api/3`

    try {
      if (actionName === 'CREATE_JIRA_ISSUE') {
        const body = {
          fields: {
            project: { key: params.projectKey },
            summary: params.summary,
            description: params.description ? { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: params.description }] }] } : undefined,
            issuetype: { name: params.issueType ?? 'Task' },
            priority: params.priority ? { name: params.priority } : undefined,
            assignee: params.assigneeAccountId ? { accountId: params.assigneeAccountId } : undefined,
          },
        }
        const res = await axios.post(`${api}/issue`, body, { headers, timeout: 10_000 })
        return { connector: 'jira', status: 'OK', message: `Issue created: ${res.data.key}`, data: { key: res.data.key, id: res.data.id } }
      }

      if (actionName === 'ADD_JIRA_COMMENT') {
        const body = { body: { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: params.comment }] }] } }
        await axios.post(`${api}/issue/${params.issueKey}/comment`, body, { headers, timeout: 10_000 })
        return { connector: 'jira', status: 'OK', message: `Comment added to ${params.issueKey}` }
      }

      if (actionName === 'TRANSITION_JIRA_ISSUE') {
        const res = await axios.post(`${api}/issue/${params.issueKey}/transitions`, { transition: { id: params.transitionId } }, { headers, timeout: 10_000 })
        return { connector: 'jira', status: 'OK', message: `Issue ${params.issueKey} transitioned` }
      }

      if (actionName === 'ASSIGN_JIRA_ISSUE') {
        await axios.put(`${api}/issue/${params.issueKey}/assignee`, { accountId: params.assigneeAccountId ?? null }, { headers, timeout: 10_000 })
        return { connector: 'jira', status: 'OK', message: `Issue ${params.issueKey} assigned` }
      }

      // Generic POST for remaining actions
      const res = await axios.post(`${api}/issue`, { action: actionName, params }, { headers, timeout: 10_000, validateStatus: () => true })
      return res.status < 400
        ? { connector: 'jira', status: 'OK', message: `${actionName} dispatched` }
        : { connector: 'jira', status: 'ERROR', message: `Jira API ${res.status}: ${JSON.stringify(res.data)}` }
    } catch (e: any) {
      return { connector: 'jira', status: 'ERROR', message: e.message }
    }
  },
}
