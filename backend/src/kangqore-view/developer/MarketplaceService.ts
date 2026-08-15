// Phase 5.4 — App Marketplace Catalog & Certification Engine
// Manages marketplace categories, app listings, security governance badge scoring, installation, and reviews.

import { AppCategory, KangqoreAppManifest } from './AppManifest'

export interface MarketplaceAppListing {
  appId: string
  name: string
  version: string
  category: AppCategory
  publisher: string
  description: string
  icon: string
  rating: number
  downloads: number
  governanceScore: number // 0–100 Security & Governance audit score
  certifiedBadge: boolean
  features: string[]
  permissionsRequired: string[]
  manifest: KangqoreAppManifest
}

export const CANONICAL_MARKETPLACE_APPS: MarketplaceAppListing[] = [
  {
    appId: 'app-salesforce-sync',
    name: 'Salesforce Enterprise Sync',
    version: '2.4.0',
    category: 'ENTERPRISE_READY',
    publisher: 'Kangqore Official',
    description: 'Bi-directional real-time account, lead, opportunity, and custom object sync with Ontology object mapping.',
    icon: 'Cloud',
    rating: 4.9,
    downloads: 14200,
    governanceScore: 100,
    certifiedBadge: true,
    features: ['Ontology Auto-mapping', 'AEGIS RBAC Sync', 'Real-time Webhook Triggers'],
    permissionsRequired: ['READ:Salesforce', 'WRITE:OntologyObject', 'EXECUTE:Action'],
    manifest: {
      manifestVersion: '1.0',
      appId: 'app-salesforce-sync',
      name: 'Salesforce Enterprise Sync',
      version: '2.4.0',
      category: 'ENTERPRISE_READY',
      publisher: { name: 'Kangqore Official', email: 'dev@kangqore.com' },
      description: 'Bi-directional Salesforce sync',
      permissions: [
        { resource: 'SalesforceAccount', action: 'READ', reason: 'Sync accounts to Ontology' },
        { resource: 'OntologyObject', action: 'WRITE', reason: 'Write accounts to Ontology' },
      ],
      ontologyBindings: [{ objectType: 'CustomerAccount', relationshipTypes: ['belongsTo', 'ownsOrder'] }],
      actions: [
        { name: 'syncAccount', displayName: 'Sync Account', description: 'Triggers sync for specific Account ID', parameters: [{ name: 'accountId', type: 'string', required: true }] },
      ],
    },
  },
  {
    appId: 'app-jira-agile',
    name: 'Jira Software & Service Desk Bridge',
    version: '3.1.0',
    category: 'CERTIFIED',
    publisher: 'Atlassian Certified Partner',
    description: 'Connect Jira projects, sprints, epics, and issues directly to Kangqore WorkItems and Dependency Graphs.',
    icon: 'Kanban',
    rating: 4.8,
    downloads: 18900,
    governanceScore: 98,
    certifiedBadge: true,
    features: ['Sprint to Portfolio Rollup', 'WorkItem Synchronization', 'Automated Issue Triage'],
    permissionsRequired: ['READ:JiraIssue', 'WRITE:WorkItem', 'EXECUTE:Action'],
    manifest: {
      manifestVersion: '1.0',
      appId: 'app-jira-agile',
      name: 'Jira Software & Service Desk Bridge',
      version: '3.1.0',
      category: 'CERTIFIED',
      publisher: { name: 'Atlassian Certified Partner', email: 'integrations@atlassian.com' },
      description: 'Jira issue integration',
      permissions: [{ resource: 'WorkItem', action: 'WRITE', reason: 'Create WorkItems from Jira' }],
      ontologyBindings: [{ objectType: 'WorkItem', relationshipTypes: ['blocks', 'dependsOn'] }],
      actions: [
        { name: 'createJiraIssue', displayName: 'Create Jira Issue', description: 'Creates issue in Jira', parameters: [{ name: 'summary', type: 'string', required: true }] },
      ],
    },
  },
  {
    appId: 'app-ai-copilot-studio',
    name: 'Autonomous AI Agent Studio',
    version: '1.8.0',
    category: 'AI_NATIVE',
    publisher: 'Kangqore AI Labs',
    description: 'Build, benchmark, and deploy custom autonomous AI agent personas with AEGIS budget limits and tool registries.',
    icon: 'Robot',
    rating: 5.0,
    downloads: 24500,
    governanceScore: 100,
    certifiedBadge: true,
    features: ['Custom Persona Prompt Registry', 'AEGIS Budget Guardrails', 'Multi-Agent Debate Framework'],
    permissionsRequired: ['EXECUTE:Agent', 'READ:KnowledgeGraph', 'WRITE:AutonomousLog'],
    manifest: {
      manifestVersion: '1.0',
      appId: 'app-ai-copilot-studio',
      name: 'Autonomous AI Agent Studio',
      version: '1.8.0',
      category: 'AI_NATIVE',
      publisher: { name: 'Kangqore AI Labs', email: 'ai@kangqore.com' },
      description: 'Autonomous AI Agent Studio',
      permissions: [{ resource: 'Agent', action: 'EXECUTE', reason: 'Run agent reasoning cycles' }],
      ontologyBindings: [{ objectType: 'AgentPersona' }],
      actions: [
        { name: 'runAgentTask', displayName: 'Run Agent Task', description: 'Executes autonomous task cycle', parameters: [{ name: 'prompt', type: 'string', required: true }] },
      ],
    },
  },
  {
    appId: 'app-servicenow-itsm',
    name: 'ServiceNow ITSM & Incident Governor',
    version: '2.1.0',
    category: 'GOVERNED',
    publisher: 'Enterprise Solutions Inc',
    description: 'Governed incident response, change management approvals, and ITIL v4 SLA escalation framework.',
    icon: 'ShieldCheck',
    rating: 4.7,
    downloads: 9400,
    governanceScore: 99,
    certifiedBadge: true,
    features: ['ITIL v4 Governance', 'PendingApproval Lock', 'Automated Root Cause Triage'],
    permissionsRequired: ['READ:Incident', 'WRITE:ChangeRequest', 'EXECUTE:Approval'],
    manifest: {
      manifestVersion: '1.0',
      appId: 'app-servicenow-itsm',
      name: 'ServiceNow ITSM & Incident Governor',
      version: '2.1.0',
      category: 'GOVERNED',
      publisher: { name: 'Enterprise Solutions Inc', email: 'support@esi.com' },
      description: 'ServiceNow ITSM Governor',
      permissions: [{ resource: 'Incident', action: 'WRITE', reason: 'Manage ServiceNow incidents' }],
      ontologyBindings: [{ objectType: 'IncidentReport' }],
      actions: [
        { name: 'escalateIncident', displayName: 'Escalate Incident', description: 'Escalates incident to SEV1', parameters: [{ name: 'incidentId', type: 'string', required: true }] },
      ],
    },
  },
]

export const MarketplaceService = {
  listApps(category?: AppCategory, search?: string): MarketplaceAppListing[] {
    let result = [...CANONICAL_MARKETPLACE_APPS]
    if (category) {
      result = result.filter(app => app.category === category)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(app => app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q))
    }
    return result
  },

  getApp(appId: string): MarketplaceAppListing | undefined {
    return CANONICAL_MARKETPLACE_APPS.find(app => app.appId === appId)
  },

  getCategoryStats(): Record<string, number> {
    const stats: Record<string, number> = {
      ALL: CANONICAL_MARKETPLACE_APPS.length,
      CERTIFIED: 0,
      GOVERNED: 0,
      AI_NATIVE: 0,
      ENTERPRISE_READY: 0,
      COMMUNITY: 0,
      PARTNER: 0,
    }
    for (const app of CANONICAL_MARKETPLACE_APPS) {
      if (stats[app.category] !== undefined) {
        stats[app.category]++
      }
    }
    return stats
  },
}
