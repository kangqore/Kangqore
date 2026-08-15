import logger from '../../../utils/logger'
import type { ActionConnector, ConnectorContext, ConnectorResult } from './connector.interface'
import { EmailConnector }       from './email.connector'
import { SlackConnector }       from './slack.connector'
import { GitHubConnector }      from './github.connector'
import { EngineeringConnector } from './engineering.connector'
import { JiraConnector }        from './jira.connector'
import { SalesforceConnector }  from './salesforce.connector'
import { ZendeskConnector }     from './zendesk.connector'
import { StripeConnector }      from './stripe.connector'
import { ServiceNowConnector }  from './servicenow.connector'
import { HubSpotConnector }     from './hubspot.connector'

const CONNECTORS: ActionConnector[] = [
  EmailConnector,
  SlackConnector,
  GitHubConnector,
  EngineeringConnector,
  JiraConnector,
  SalesforceConnector,
  ZendeskConnector,
  StripeConnector,
  ServiceNowConnector,
  HubSpotConnector,
]

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
    logger.error(`[Connector:${matching[i].name}] Unexpected error for ${actionName}: ${(r as PromiseRejectedResult).reason?.message}`)
    return { connector: matching[i].name, status: 'ERROR' as const, message: (r as PromiseRejectedResult).reason?.message ?? 'Connector threw' }
  })
}

export function listConnectors(): Array<{ name: string; actions: string[] }> {
  const sampleActions = [
    'SEND_EMAIL', 'SEND_SLACK_MESSAGE', 'SEND_TEAMS_MESSAGE', 'SEND_RELAY_MESSAGE',
    'CREATE_GITHUB_ISSUE', 'CREATE_PULL_REQUEST',
    'DEPLOY_SERVICE', 'ROLLBACK_DEPLOYMENT', 'RESTART_SERVICE',
    'CREATE_INCIDENT', 'SCALE_RESOURCE', 'ROTATE_SECRET',
    'CREATE_JIRA_ISSUE', 'ADD_JIRA_COMMENT',
    'CREATE_SF_LEAD', 'CREATE_SF_OPPORTUNITY',
    'CREATE_ZD_TICKET', 'SOLVE_ZD_TICKET',
    'CREATE_STRIPE_SUBSCRIPTION', 'CREATE_STRIPE_REFUND',
    'CREATE_SN_INCIDENT', 'CREATE_SN_CHANGE',
    'CREATE_HS_CONTACT', 'CREATE_HS_DEAL',
  ]
  return CONNECTORS.map(c => ({
    name:    c.name,
    actions: sampleActions.filter(a => c.supports(a)),
  }))
}

export function connectorHealth(): Record<string, { configured: boolean; vars: string[] }> {
  return {
    slack:       { configured: !!(process.env.SLACK_WEBHOOK_URL),          vars: ['SLACK_WEBHOOK_URL'] },
    teams:       { configured: !!(process.env.TEAMS_WEBHOOK_URL),          vars: ['TEAMS_WEBHOOK_URL'] },
    github:      { configured: !!(process.env.GITHUB_TOKEN),               vars: ['GITHUB_TOKEN', 'GITHUB_DEFAULT_REPO'] },
    email:       { configured: !!(process.env.SENDGRID_API_KEY),           vars: ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'] },
    engineering: { configured: !!(process.env.DEPLOY_WEBHOOK_URL || process.env.PAGERDUTY_ROUTING_KEY), vars: ['DEPLOY_WEBHOOK_URL', 'INCIDENT_WEBHOOK_URL', 'PAGERDUTY_ROUTING_KEY'] },
    jira:        { configured: !!(process.env.JIRA_BASE_URL && process.env.JIRA_API_TOKEN), vars: ['JIRA_BASE_URL', 'JIRA_API_TOKEN', 'JIRA_EMAIL'] },
    salesforce:  { configured: !!(process.env.SALESFORCE_ACCESS_TOKEN),    vars: ['SALESFORCE_ACCESS_TOKEN', 'SALESFORCE_INSTANCE_URL'] },
    zendesk:     { configured: !!(process.env.ZENDESK_SUBDOMAIN && process.env.ZENDESK_API_TOKEN), vars: ['ZENDESK_SUBDOMAIN', 'ZENDESK_EMAIL', 'ZENDESK_API_TOKEN'] },
    stripe:      { configured: !!(process.env.STRIPE_SECRET_KEY),          vars: ['STRIPE_SECRET_KEY'] },
    servicenow:  { configured: !!(process.env.SERVICENOW_INSTANCE),        vars: ['SERVICENOW_INSTANCE', 'SERVICENOW_USER', 'SERVICENOW_PASSWORD'] },
    hubspot:     { configured: !!(process.env.HUBSPOT_ACCESS_TOKEN),       vars: ['HUBSPOT_ACCESS_TOKEN'] },
  }
}
