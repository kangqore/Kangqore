import axios from 'axios'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set(['CREATE_GITHUB_ISSUE', 'CREATE_PULL_REQUEST'])

// GitHub REST API — set GITHUB_TOKEN and optionally GITHUB_ORG/GITHUB_DEFAULT_REPO in .env.
// Without GITHUB_TOKEN the connector gracefully skips.

const GH_API = 'https://api.github.com'

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function resolveRepo(params: Record<string, any>): { owner: string; repo: string } | null {
  // Accepts params.repository = "owner/repo", params.repo, or env fallback
  const raw = params.repository ?? params.repo ?? process.env.GITHUB_DEFAULT_REPO ?? ''
  const [owner, repo] = raw.split('/')
  if (!owner || !repo) return null
  return { owner, repo }
}

export const GitHubConnector: Connector = {
  name: 'github',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return { connector: 'github', status: 'SKIPPED', message: 'GITHUB_TOKEN not configured' }
    }

    const repoTarget = resolveRepo(params)
    if (!repoTarget) {
      return {
        connector: 'github',
        status: 'SKIPPED',
        message: 'Repository not specified — set params.repository = "owner/repo" or GITHUB_DEFAULT_REPO env var',
      }
    }

    const { owner, repo } = repoTarget

    if (actionName === 'CREATE_GITHUB_ISSUE') {
      const body: Record<string, any> = {
        title: params.title ?? params.summary ?? 'Issue from Kangqore View',
        body: params.description ?? params.body ?? '',
      }
      if (params.labels) body.labels = Array.isArray(params.labels) ? params.labels : [params.labels]
      if (params.assignees) body.assignees = Array.isArray(params.assignees) ? params.assignees : [params.assignees]
      if (params.milestone) body.milestone = params.milestone

      const res = await axios.post(`${GH_API}/repos/${owner}/${repo}/issues`, body, {
        headers: headers(token),
        timeout: 10_000,
        validateStatus: () => true,
      })

      if (res.status >= 400) {
        return { connector: 'github', status: 'ERROR', message: `GitHub API ${res.status}: ${res.data?.message ?? 'unknown error'}` }
      }
      return {
        connector: 'github',
        status: 'OK',
        message: `Issue #${res.data.number} created`,
        data: { number: res.data.number, url: res.data.html_url, id: res.data.id },
      }
    }

    if (actionName === 'CREATE_PULL_REQUEST') {
      const body = {
        title: params.title ?? 'PR from Kangqore View',
        body: params.description ?? params.body ?? '',
        head: params.head_branch ?? params.branch ?? 'main',
        base: params.base_branch ?? params.base ?? 'main',
        draft: params.draft === true,
      }

      const res = await axios.post(`${GH_API}/repos/${owner}/${repo}/pulls`, body, {
        headers: headers(token),
        timeout: 10_000,
        validateStatus: () => true,
      })

      if (res.status >= 400) {
        return { connector: 'github', status: 'ERROR', message: `GitHub API ${res.status}: ${res.data?.message ?? 'unknown error'}` }
      }
      return {
        connector: 'github',
        status: 'OK',
        message: `PR #${res.data.number} created`,
        data: { number: res.data.number, url: res.data.html_url, id: res.data.id },
      }
    }

    return { connector: 'github', status: 'ERROR', message: `Unhandled action: ${actionName}` }
  },
}
