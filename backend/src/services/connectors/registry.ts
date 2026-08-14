import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'
import { SlackConnector } from './slack.connector'
import { GitHubConnector } from './github.connector'
import { EmailConnector } from './email.connector'
import { EngineeringConnector } from './engineering.connector'

// All registered connectors. Order doesn't matter — each connector declares
// which action names it supports via supports().
const CONNECTORS: Connector[] = [
  EmailConnector,
  SlackConnector,
  GitHubConnector,
  EngineeringConnector,
]

// Dispatch an action to every connector that supports it. Returns one result
// per matching connector. Actions with no matching connector return an empty array.
export async function dispatchToConnectors(
  actionName: string,
  params: Record<string, any>,
  actorId?: string | null,
  actorType?: string,
): Promise<ConnectorResult[]> {
  const matching = CONNECTORS.filter(c => c.supports(actionName))
  if (!matching.length) return []

  const ctx: ConnectorContext = { actionName, params, actorId, actorType }

  const results = await Promise.allSettled(matching.map(c => c.execute(ctx)))
  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    logger.error(`[Connector:${matching[i].name}] Unexpected error for ${actionName}: ${r.reason?.message}`)
    return { connector: matching[i].name, status: 'ERROR' as const, message: r.reason?.message ?? 'Connector threw' }
  })
}

// List all registered connectors with their supported action names.
export function listConnectors(): Array<{ name: string; actions: string[] }> {
  const sampleActions = [
    'SEND_EMAIL', 'SEND_SLACK_MESSAGE', 'SEND_TEAMS_MESSAGE', 'SEND_RELAY_MESSAGE',
    'CREATE_GITHUB_ISSUE', 'CREATE_PULL_REQUEST',
    'DEPLOY_SERVICE', 'ROLLBACK_DEPLOYMENT', 'RESTART_SERVICE',
    'CREATE_INCIDENT', 'SCALE_RESOURCE', 'ROTATE_SECRET',
  ]
  return CONNECTORS.map(c => ({
    name: c.name,
    actions: sampleActions.filter(a => c.supports(a)),
  }))
}

// Check which connector env vars are configured.
export function connectorHealth(): Record<string, { configured: boolean; vars: string[] }> {
  return {
    slack: {
      configured: !!(process.env.SLACK_WEBHOOK_URL),
      vars: ['SLACK_WEBHOOK_URL'],
    },
    teams: {
      configured: !!(process.env.TEAMS_WEBHOOK_URL),
      vars: ['TEAMS_WEBHOOK_URL'],
    },
    github: {
      configured: !!(process.env.GITHUB_TOKEN),
      vars: ['GITHUB_TOKEN', 'GITHUB_DEFAULT_REPO'],
    },
    email: {
      configured: !!(process.env.SENDGRID_API_KEY),
      vars: ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'],
    },
    engineering: {
      configured: !!(process.env.DEPLOY_WEBHOOK_URL || process.env.PAGERDUTY_ROUTING_KEY),
      vars: ['DEPLOY_WEBHOOK_URL', 'INCIDENT_WEBHOOK_URL', 'PAGERDUTY_ROUTING_KEY'],
    },
  }
}
