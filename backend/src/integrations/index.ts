// Connector Hub — F6 Enterprise Connector Framework
// All connectors self-register via ConnectorRegistry.
// KIMMP queries capabilities; never hardcodes platform names.

import { ConnectorRegistry }   from './registry'
import { SlackAdapter }        from './slack'
import { JiraAdapter }         from './jira'
import { GitHubAdapter }       from './github'
import { SalesforceAdapter }   from './salesforce'
import { HubSpotAdapter }      from './hubspot'
import { TeamsAdapter }        from './teams'
import { LinearAdapter }       from './linear'
import { ZendeskAdapter }      from './zendesk'
import type {
  IntegrationConfig, IntegrationResult, IntegrationTestResult,
} from './types'

export { ConnectorRegistry } from './registry'
export type { ConnectorManifest, ConnectorCategory } from './registry'
export type { Platform, IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from './types'

// ── Register all connectors ───────────────────────────────────────────────────

ConnectorRegistry.register({
  platform:    'slack',
  displayName: 'Slack',
  icon:        '💬',
  category:    'COMMUNICATION',
  description: 'Send messages, blocks, and files to Slack channels and users.',
  version:     '1.0.0',
  authFields: [
    { key: 'webhookUrl', label: 'Incoming Webhook URL', secret: true, placeholder: 'https://hooks.slack.com/services/…', description: 'Generate from Slack App → Incoming Webhooks' },
  ],
  capabilities: SlackAdapter.actions(),
  entityTypes: [],
}, SlackAdapter)

ConnectorRegistry.register({
  platform:    'jira',
  displayName: 'Jira',
  icon:        '📋',
  category:    'PROJECT_MANAGEMENT',
  description: 'Create and manage issues, sprints, and projects in Jira Cloud.',
  version:     '1.0.0',
  authFields: [
    { key: 'baseUrl',  label: 'Jira Base URL',  secret: false, placeholder: 'https://yourorg.atlassian.net' },
    { key: 'email',    label: 'Email',           secret: false, placeholder: 'you@yourorg.com' },
    { key: 'apiToken', label: 'API Token',       secret: true,  description: 'Generate at id.atlassian.com/manage-profile/security/api-tokens' },
  ],
  capabilities: JiraAdapter.actions(),
  entityTypes: [
    { externalType: 'Issue',   suggestedOntologyType: 'TASK',    description: 'Jira issues map to internal tasks/deliverables' },
    { externalType: 'Project', suggestedOntologyType: 'PROJECT', description: 'Jira projects map to internal projects' },
  ],
}, JiraAdapter)

ConnectorRegistry.register({
  platform:    'github',
  displayName: 'GitHub',
  icon:        '🐙',
  category:    'VERSION_CONTROL',
  description: 'Manage issues, pull requests, and repositories on GitHub.',
  version:     '1.0.0',
  authFields: [
    { key: 'token',        label: 'Personal Access Token', secret: true,  description: 'Create at github.com/settings/tokens with repo + issues scope' },
    { key: 'defaultOwner', label: 'Default Owner / Org',   secret: false, placeholder: 'my-org' },
    { key: 'defaultRepo',  label: 'Default Repository',    secret: false, placeholder: 'my-repo' },
  ],
  capabilities: GitHubAdapter.actions(),
  entityTypes: [
    { externalType: 'Issue', suggestedOntologyType: 'TASK', description: 'GitHub issues map to internal deliverables' },
  ],
}, GitHubAdapter)

ConnectorRegistry.register({
  platform:    'salesforce',
  displayName: 'Salesforce',
  icon:        '☁️',
  category:    'CRM',
  description: 'Read and write Leads, Opportunities, Contacts, and Accounts in Salesforce CRM.',
  version:     '1.0.0',
  authFields: [
    { key: 'accessToken', label: 'Access Token',  secret: true },
    { key: 'instanceUrl', label: 'Instance URL',  secret: false, placeholder: 'https://yourorg.my.salesforce.com' },
  ],
  capabilities: SalesforceAdapter.actions(),
  entityTypes: [
    { externalType: 'Account', suggestedOntologyType: 'CLIENT', description: 'Salesforce Accounts map to internal Clients' },
    { externalType: 'Contact', suggestedOntologyType: 'PERSON', description: 'Salesforce Contacts map to internal persons' },
    { externalType: 'Lead',    suggestedOntologyType: 'LEAD',   description: 'Salesforce Leads map to internal leads' },
  ],
}, SalesforceAdapter)

ConnectorRegistry.register({
  platform:    'hubspot',
  displayName: 'HubSpot',
  icon:        '🟠',
  category:    'CRM',
  description: 'Manage Contacts, Deals, and Notes in HubSpot CRM.',
  version:     '1.0.0',
  authFields: [
    { key: 'accessToken', label: 'Private App Access Token', secret: true, description: 'Create at app.hubspot.com/private-apps' },
  ],
  capabilities: HubSpotAdapter.actions(),
  entityTypes: [
    { externalType: 'Contact', suggestedOntologyType: 'PERSON',  description: 'HubSpot Contacts map to internal persons' },
    { externalType: 'Deal',    suggestedOntologyType: 'LEAD',    description: 'HubSpot Deals map to internal leads/opportunities' },
    { externalType: 'Company', suggestedOntologyType: 'CLIENT',  description: 'HubSpot Companies map to internal clients' },
  ],
}, HubSpotAdapter)

ConnectorRegistry.register({
  platform:    'teams',
  displayName: 'Microsoft Teams',
  icon:        '🔷',
  category:    'COMMUNICATION',
  description: 'Send messages and adaptive cards to Microsoft Teams channels.',
  version:     '1.0.0',
  authFields: [
    { key: 'webhookUrl', label: 'Incoming Webhook URL', secret: true, placeholder: 'https://outlook.office.com/webhook/…', description: 'Add Incoming Webhook connector to a Teams channel' },
  ],
  capabilities: TeamsAdapter.actions(),
  entityTypes: [],
}, TeamsAdapter)

ConnectorRegistry.register({
  platform:    'linear',
  displayName: 'Linear',
  icon:        '🔺',
  category:    'PROJECT_MANAGEMENT',
  description: 'Create and update issues in Linear. Built for engineering teams.',
  version:     '1.0.0',
  authFields: [
    { key: 'apiKey', label: 'API Key', secret: true, description: 'Generate at linear.app/settings/api' },
  ],
  capabilities: LinearAdapter.actions(),
  entityTypes: [
    { externalType: 'Issue', suggestedOntologyType: 'TASK', description: 'Linear issues map to internal deliverables' },
    { externalType: 'Team',  suggestedOntologyType: 'TEAM', description: 'Linear teams map to internal teams' },
  ],
}, LinearAdapter)

ConnectorRegistry.register({
  platform:    'zendesk',
  displayName: 'Zendesk',
  icon:        '🎫',
  category:    'HELPDESK',
  description: 'Create and manage support tickets in Zendesk Support.',
  version:     '1.0.0',
  authFields: [
    { key: 'subdomain', label: 'Subdomain',  secret: false, placeholder: 'yourorg (from yourorg.zendesk.com)' },
    { key: 'email',     label: 'Agent Email', secret: false },
    { key: 'apiToken',  label: 'API Token',   secret: true, description: 'Generate at Admin → Apps & Integrations → APIs → Zendesk API' },
  ],
  capabilities: ZendeskAdapter.actions(),
  entityTypes: [
    { externalType: 'Ticket', suggestedOntologyType: 'INCIDENT', description: 'Zendesk tickets map to internal incidents/support cases' },
  ],
}, ZendeskAdapter)

// ── Health tracker (in-memory, per-process) ───────────────────────────────────

export interface HealthStatus {
  connected:    boolean
  lastSuccess:  Date | null
  lastFailure:  Date | null
  latencyMs:    number | null
  rateLimitHit: boolean
  errorCount:   number
  successCount: number
}

const healthMap = new Map<string, HealthStatus>()

function healthKey(userId: string, platform: string) { return `${userId}::${platform}` }

export function getHealth(userId: string, platform: string): HealthStatus {
  return healthMap.get(healthKey(userId, platform)) ?? {
    connected: false, lastSuccess: null, lastFailure: null,
    latencyMs: null, rateLimitHit: false, errorCount: 0, successCount: 0,
  }
}

function recordHealth(userId: string, platform: string, ok: boolean, latencyMs: number, rateLimitHit = false) {
  const key  = healthKey(userId, platform)
  const prev = healthMap.get(key) ?? { connected: false, lastSuccess: null, lastFailure: null, latencyMs: null, rateLimitHit: false, errorCount: 0, successCount: 0 }
  healthMap.set(key, {
    connected:    ok,
    lastSuccess:  ok  ? new Date() : prev.lastSuccess,
    lastFailure:  !ok ? new Date() : prev.lastFailure,
    latencyMs,
    rateLimitHit,
    errorCount:   ok  ? prev.errorCount   : prev.errorCount + 1,
    successCount: ok  ? prev.successCount + 1 : prev.successCount,
  })
}

// ── Capability queries ────────────────────────────────────────────────────────

export function whoCanDo(capability: string): string[] { return ConnectorRegistry.whoCanDo(capability) }
export function allCapabilities() { return ConnectorRegistry.allCapabilities() }
export function getManifests() { return ConnectorRegistry.list() }

// ── Test with health recording ────────────────────────────────────────────────

export async function testIntegration(platform: string, config: IntegrationConfig, userId: string): Promise<IntegrationTestResult> {
  const t0 = Date.now()
  const result = await ConnectorRegistry.test(platform, config, userId)
  recordHealth(userId, platform, result.ok, Date.now() - t0)
  return result
}

// ── Execute with retry + dead-letter ─────────────────────────────────────────

const MAX_RETRIES = 3
const BASE_DELAY  = 500

const deadLetterQueue: Array<{ platform: string; action: string; params: any; error: string; attempts: number; firedAt: Date; idempotencyKey?: string }> = []
export function getDeadLetterQueue() { return [...deadLetterQueue] }

function isRetryable(result: IntegrationResult): boolean {
  if (!result.error) return false
  return !['MISSING_CONFIG', 'UNKNOWN_ACTION', 'MISSING_ID', 'UNSUPPORTED', 'UNKNOWN_PLATFORM'].includes(result.error)
}

export async function executeIntegration(
  platform:       string,
  action:         string,
  params:         Record<string, any>,
  config:         IntegrationConfig,
  userId:         string,
  idempotencyKey?: string,
): Promise<IntegrationResult> {
  let lastResult: IntegrationResult = { ok: false, summary: 'Not attempted', error: 'INIT' }
  const t0 = Date.now()

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    lastResult = await ConnectorRegistry.execute(platform, action, params, config)
    const latency = Date.now() - t0
    recordHealth(userId, platform, lastResult.ok, latency, lastResult.error === 'RATE_LIMIT')

    if (lastResult.ok) return lastResult
    if (!isRetryable(lastResult)) break
    if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, BASE_DELAY * Math.pow(2, attempt - 1)))
  }

  deadLetterQueue.push({ platform, action, params, attempts: MAX_RETRIES, error: lastResult.error ?? 'UNKNOWN', firedAt: new Date(), idempotencyKey })
  if (deadLetterQueue.length > 500) deadLetterQueue.shift()
  return lastResult
}
