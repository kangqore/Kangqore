import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

const ACTIONS = ['createIssue', 'createPR', 'addLabel', 'addComment', 'listRepos'] as const

function headers(config: IntegrationConfig) {
  return {
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
    Accept:         'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function ghFetch(path: string, config: IntegrationConfig, init?: RequestInit) {
  return fetch(`https://api.github.com${path}`, { ...init, headers: headers(config) })
}

export const GitHubAdapter: IntegrationAdapter = {
  actions: () => [...ACTIONS],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.token) return { ok: false, message: 'token is required' }
    try {
      const res = await ghFetch('/user', config)
      if (!res.ok) return { ok: false, message: `GitHub returned HTTP ${res.status}` }
      const data = await res.json() as any
      return { ok: true, message: `Connected as @${data.login}` }
    } catch (e: any) {
      return { ok: false, message: `Connection failed: ${e.message}` }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const owner = params.owner ?? config.defaultOwner
    const repo  = params.repo  ?? config.defaultRepo

    switch (action) {
      case 'createIssue': {
        const body = {
          title:  params.title ?? params.summary,
          body:   params.body ?? params.description,
          labels: params.labels,
        }
        const res = await ghFetch(`/repos/${owner}/${repo}/issues`, config, { method: 'POST', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create GitHub issue', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Created GitHub issue #${data.number}: ${data.title}`, data: { number: data.number, url: data.html_url } }
      }
      case 'createPR': {
        const body = {
          title: params.title,
          body:  params.body ?? '',
          head:  params.head,
          base:  params.base ?? 'main',
          draft: params.draft ?? false,
        }
        const res = await ghFetch(`/repos/${owner}/${repo}/pulls`, config, { method: 'POST', body: JSON.stringify(body) })
        if (!res.ok) return { ok: false, summary: 'Failed to create PR', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `Created PR #${data.number}: ${data.title}`, data: { number: data.number, url: data.html_url } }
      }
      case 'addLabel': {
        const res = await ghFetch(`/repos/${owner}/${repo}/issues/${params.issueNumber}/labels`, config, {
          method: 'POST',
          body:   JSON.stringify({ labels: Array.isArray(params.labels) ? params.labels : [params.labels] }),
        })
        if (!res.ok) return { ok: false, summary: `Failed to add label to #${params.issueNumber}`, error: await res.text() }
        return { ok: true, summary: `Label added to #${params.issueNumber}` }
      }
      case 'addComment': {
        const res = await ghFetch(`/repos/${owner}/${repo}/issues/${params.issueNumber}/comments`, config, {
          method: 'POST',
          body:   JSON.stringify({ body: params.comment ?? params.text }),
        })
        if (!res.ok) return { ok: false, summary: `Failed to add comment to #${params.issueNumber}`, error: await res.text() }
        return { ok: true, summary: `Comment added to #${params.issueNumber}` }
      }
      case 'listRepos': {
        const res = await ghFetch(`/user/repos?sort=updated&per_page=${params.limit ?? 20}`, config)
        if (!res.ok) return { ok: false, summary: 'Failed to list repos', error: await res.text() }
        const data = await res.json() as any
        return { ok: true, summary: `${data.length} repos`, data: data.map((r: any) => ({ name: r.name, fullName: r.full_name, url: r.html_url, private: r.private })) }
      }
      default:
        return { ok: false, summary: `Unknown GitHub action: ${action}`, error: 'UNKNOWN_ACTION' }
    }
  },
}
