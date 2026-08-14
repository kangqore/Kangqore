import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ActionParamDef {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object-ref' | 'object-set'
  required?: boolean
  enum?: string[]
  min?: number
  max?: number
  description?: string
}

interface ValidationRuleDef {
  condition: object
  errorMessage: string
  severity: 'WARN' | 'BLOCK'
  order: number
}

interface ActionDef {
  name: string
  displayName: string
  description: string
  parameters: ActionParamDef[]
  allowedRoles: string[]
  toolCallable: boolean
  validationRules?: ValidationRuleDef[]
}

interface CategoryDef {
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  actions: ActionDef[]
}

export const ACTION_LIBRARY: CategoryDef[] = [
  {
    name: 'Enterprise',
    displayName: 'Enterprise',
    icon: 'Buildings',
    color: '#579bfc',
    description: 'Core business operations — customers, CRM, contracts, tickets, invoices',
    actions: [
      {
        name: 'CREATE_CUSTOMER',
        displayName: 'Create Customer',
        description: 'Provision a new customer account with tier and industry classification.',
        parameters: [
          { name: 'name',     type: 'string', required: true,  description: 'Customer legal name' },
          { name: 'email',    type: 'string', required: true,  description: 'Primary contact email' },
          { name: 'tier',     type: 'enum',   required: true,  enum: ['SMB', 'ENTERPRISE', 'PARTNER'], description: 'Account tier' },
          { name: 'industry', type: 'string', required: false, description: 'Industry vertical' },
          { name: 'region',   type: 'enum',   required: false, enum: ['UK', 'US', 'EU', 'APAC', 'MENA'], description: 'Account region' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { op: 'contains', field: 'params.email', value: '@' } },
            errorMessage: 'Email must be a valid address',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'UPDATE_CRM',
        displayName: 'Update CRM Record',
        description: 'Update a specific field on a CRM contact or account record.',
        parameters: [
          { name: 'customerId', type: 'object-ref', required: true,  description: 'Target customer ID' },
          { name: 'field',      type: 'string',     required: true,  description: 'Field name to update' },
          { name: 'value',      type: 'string',     required: true,  description: 'New field value' },
          { name: 'reason',     type: 'string',     required: false, description: 'Reason for update (audit)' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CREATE_CONTRACT',
        displayName: 'Create Contract',
        description: 'Draft a new contract for a customer with value and term.',
        parameters: [
          { name: 'customerId',    type: 'object-ref', required: true,  description: 'Customer ID' },
          { name: 'contractType',  type: 'enum',       required: true,  enum: ['MSA', 'SOW', 'NDA', 'RENEWAL', 'AMENDMENT'], description: 'Contract type' },
          { name: 'startDate',     type: 'date',       required: true,  description: 'Contract start date' },
          { name: 'endDate',       type: 'date',       required: false, description: 'Contract end date' },
          { name: 'value',         type: 'number',     required: true,  min: 0, description: 'Contract value (£)' },
          { name: 'currency',      type: 'enum',       required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Currency' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { op: 'gte', field: 'params.value', value: 0 } },
            errorMessage: 'Contract value must be 0 or greater',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'APPROVE_PURCHASE',
        displayName: 'Approve Purchase',
        description: 'Approve a pending purchase request and authorize spend.',
        parameters: [
          { name: 'purchaseRequestId', type: 'object-ref', required: true,  description: 'Purchase request ID' },
          { name: 'approvedAmount',    type: 'number',     required: false, min: 0, description: 'Approved amount (may differ from requested)' },
          { name: 'approvedBy',        type: 'string',     required: true,  description: 'Approver name' },
          { name: 'notes',             type: 'string',     required: false, description: 'Approval notes' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CHANGE_EMPLOYEE',
        displayName: 'Change Employee Record',
        description: 'Apply a structural change to an employee record — role, department, salary, or status.',
        parameters: [
          { name: 'employeeId',    type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'changeType',    type: 'enum',       required: true,  enum: ['ROLE', 'DEPARTMENT', 'SALARY', 'STATUS', 'MANAGER'], description: 'Type of change' },
          { name: 'newValue',      type: 'string',     required: true,  description: 'New value for the changed field' },
          { name: 'effectiveDate', type: 'date',       required: false, description: 'When the change takes effect' },
          { name: 'reason',        type: 'string',     required: true,  description: 'Business reason for change' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_TICKET',
        displayName: 'Create Support Ticket',
        description: 'Open a new support or internal ticket and assign to a queue.',
        parameters: [
          { name: 'title',       type: 'string',     required: true,  description: 'Ticket title' },
          { name: 'priority',    type: 'enum',       required: true,  enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Priority level' },
          { name: 'queue',       type: 'enum',       required: false, enum: ['SUPPORT', 'ENGINEERING', 'PRODUCT', 'SALES', 'INTERNAL'], description: 'Queue' },
          { name: 'assigneeId',  type: 'object-ref', required: false, description: 'Assignee user ID' },
          { name: 'description', type: 'string',     required: false, description: 'Full description' },
          { name: 'customerId',  type: 'object-ref', required: false, description: 'Related customer' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE', 'CLIENT'],
        toolCallable: true,
      },
      {
        name: 'CREATE_ENTERPRISE_INVOICE',
        displayName: 'Create Invoice',
        description: 'Generate an invoice for a customer with line items and due date.',
        parameters: [
          { name: 'customerId',  type: 'object-ref', required: true,  description: 'Customer ID' },
          { name: 'amount',      type: 'number',     required: true,  min: 0, description: 'Total invoice amount' },
          { name: 'currency',    type: 'enum',       required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Invoice currency' },
          { name: 'dueDate',     type: 'date',       required: true,  description: 'Payment due date' },
          { name: 'description', type: 'string',     required: false, description: 'Line item summary' },
          { name: 'reference',   type: 'string',     required: false, description: 'PO or reference number' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'Communication',
    displayName: 'Communication',
    icon: 'ChatText',
    color: '#00c875',
    description: 'Messaging, meetings, and report delivery across channels',
    actions: [
      {
        name: 'SEND_EMAIL',
        displayName: 'Send Email',
        description: 'Compose and send an email via the configured mail provider.',
        parameters: [
          { name: 'to',         type: 'string', required: true,  description: 'Recipient email(s), comma-separated' },
          { name: 'subject',    type: 'string', required: true,  description: 'Subject line' },
          { name: 'body',       type: 'string', required: true,  description: 'Email body (plain text or HTML)' },
          { name: 'cc',         type: 'string', required: false, description: 'CC recipients' },
          { name: 'templateId', type: 'string', required: false, description: 'Email template ID' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { op: 'contains', field: 'params.to', value: '@' } },
            errorMessage: 'Recipient must be a valid email address',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'SEND_TEAMS_MESSAGE',
        displayName: 'Send Teams Message',
        description: 'Post a message to a Microsoft Teams channel.',
        parameters: [
          { name: 'channelId',  type: 'string',  required: true,  description: 'Teams channel ID or incoming webhook URL' },
          { name: 'message',    type: 'string',  required: true,  description: 'Message content' },
          { name: 'mentionAll', type: 'boolean', required: false, description: 'Mention @channel' },
          { name: 'urgent',     type: 'boolean', required: false, description: 'Mark as urgent' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SEND_SLACK_MESSAGE',
        displayName: 'Send Slack Message',
        description: 'Post a message to a Slack channel or user DM.',
        parameters: [
          { name: 'channel',  type: 'string',  required: true,  description: 'Channel (#name) or user ID' },
          { name: 'message',  type: 'string',  required: true,  description: 'Message text' },
          { name: 'urgent',   type: 'boolean', required: false, description: 'Mark as urgent' },
          { name: 'threadTs', type: 'string',  required: false, description: 'Thread timestamp to reply to' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SEND_RELAY_MESSAGE',
        displayName: 'Send RELAY Message',
        description: 'Send a secure in-platform RELAY message to a user.',
        parameters: [
          { name: 'recipientId',  type: 'object-ref', required: true,  description: 'Recipient user ID' },
          { name: 'message',      type: 'string',     required: true,  description: 'Message content' },
          { name: 'priority',     type: 'enum',       required: false, enum: ['NORMAL', 'HIGH', 'CRITICAL'], description: 'Message priority' },
          { name: 'attachmentId', type: 'string',     required: false, description: 'Ontology object ID to attach as context' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE', 'CLIENT'],
        toolCallable: true,
      },
      {
        name: 'SCHEDULE_MEETING',
        displayName: 'Schedule Meeting',
        description: 'Create a calendar event and invite attendees.',
        parameters: [
          { name: 'title',           type: 'string', required: true,  description: 'Meeting title' },
          { name: 'attendees',       type: 'string', required: true,  description: 'Attendee emails, comma-separated' },
          { name: 'startTime',       type: 'date',   required: true,  description: 'Meeting start (ISO 8601)' },
          { name: 'durationMinutes', type: 'number', required: true,  min: 15, max: 480, description: 'Duration in minutes' },
          { name: 'location',        type: 'string', required: false, description: 'Location or video URL' },
          { name: 'agenda',          type: 'string', required: false, description: 'Meeting agenda' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'GENERATE_REPORT',
        displayName: 'Generate Report',
        description: 'Generate a structured report for an entity and optionally deliver it.',
        parameters: [
          { name: 'reportType',     type: 'enum',       required: true,  enum: ['CLIENT_HEALTH', 'PROJECT_STATUS', 'FINANCIAL_SUMMARY', 'BIDS_DIAGNOSTIC', 'COIG_REPORT', 'CUSTOM'], description: 'Report template' },
          { name: 'entityId',       type: 'object-ref', required: false, description: 'Target entity ID' },
          { name: 'format',         type: 'enum',       required: false, enum: ['PDF', 'XLSX', 'JSON', 'HTML'], description: 'Output format' },
          { name: 'recipientEmail', type: 'string',     required: false, description: 'Deliver report to this email' },
          { name: 'dateFrom',       type: 'date',       required: false, description: 'Period start' },
          { name: 'dateTo',         type: 'date',       required: false, description: 'Period end' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE', 'TEAM'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'Engineering',
    displayName: 'Engineering',
    icon: 'GitBranch',
    color: '#e2445c',
    description: 'Software development lifecycle — issues, PRs, deployments, incidents',
    actions: [
      {
        name: 'CREATE_GITHUB_ISSUE',
        displayName: 'Create GitHub Issue',
        description: 'Open a new issue in a GitHub repository.',
        parameters: [
          { name: 'repo',      type: 'string', required: true,  description: 'Repository in org/repo format' },
          { name: 'title',     type: 'string', required: true,  description: 'Issue title' },
          { name: 'body',      type: 'string', required: false, description: 'Issue body (Markdown)' },
          { name: 'labels',    type: 'string', required: false, description: 'Comma-separated labels' },
          { name: 'assignee',  type: 'string', required: false, description: 'GitHub username' },
          { name: 'milestone', type: 'string', required: false, description: 'Milestone number' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { op: 'contains', field: 'params.repo', value: '/' } },
            errorMessage: 'Repository must be in org/repo format (e.g. kangqore/backend)',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'CREATE_PULL_REQUEST',
        displayName: 'Create Pull Request',
        description: 'Open a pull request between two branches in a GitHub repository.',
        parameters: [
          { name: 'repo',         type: 'string',  required: true,  description: 'Repository in org/repo format' },
          { name: 'title',        type: 'string',  required: true,  description: 'PR title' },
          { name: 'sourceBranch', type: 'string',  required: true,  description: 'Head/source branch' },
          { name: 'targetBranch', type: 'string',  required: true,  description: 'Base/target branch' },
          { name: 'body',         type: 'string',  required: false, description: 'PR description (Markdown)' },
          { name: 'draft',        type: 'boolean', required: false, description: 'Open as draft PR' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'DEPLOY_SERVICE',
        displayName: 'Deploy Service',
        description: 'Trigger a deployment of a service to a target environment.',
        parameters: [
          { name: 'service',       type: 'string', required: true,  description: 'Service name' },
          { name: 'environment',   type: 'enum',   required: true,  enum: ['development', 'staging', 'production'], description: 'Target environment' },
          { name: 'version',       type: 'string', required: true,  description: 'Version/tag/SHA to deploy' },
          { name: 'reason',        type: 'string', required: false, description: 'Deployment reason (audit)' },
          { name: 'notifyChannel', type: 'string', required: false, description: 'Slack channel to notify' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
        validationRules: [
          {
            condition: {
              or: [
                { leaf: { op: 'neq', field: 'params.environment', value: 'production' } },
                { leaf: { op: 'exists', field: 'params.reason' } },
              ],
            },
            errorMessage: 'Production deployments require a reason',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'ROLLBACK_DEPLOYMENT',
        displayName: 'Rollback Deployment',
        description: 'Roll a service back to a previous known-good version.',
        parameters: [
          { name: 'service',       type: 'string',  required: true,  description: 'Service name' },
          { name: 'targetVersion', type: 'string',  required: true,  description: 'Version to roll back to' },
          { name: 'reason',        type: 'string',  required: true,  description: 'Why the rollback is needed' },
          { name: 'immediate',     type: 'boolean', required: false, description: 'Skip pre-flight checks' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_INCIDENT',
        displayName: 'Create Incident',
        description: 'Declare a production incident and page the on-call team.',
        parameters: [
          { name: 'severity',          type: 'enum',   required: true,  enum: ['SEV1', 'SEV2', 'SEV3', 'SEV4'], description: 'Severity level' },
          { name: 'title',             type: 'string', required: true,  description: 'Incident title' },
          { name: 'description',       type: 'string', required: false, description: 'What is happening' },
          { name: 'affectedService',   type: 'string', required: false, description: 'Affected service name' },
          { name: 'incidentCommander', type: 'string', required: false, description: 'Incident commander name' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'RESTART_SERVICE',
        displayName: 'Restart Service',
        description: 'Gracefully restart a running service pod or container.',
        parameters: [
          { name: 'service',      type: 'string',  required: true,  description: 'Service name' },
          { name: 'reason',       type: 'string',  required: true,  description: 'Why the restart is needed' },
          { name: 'notifyTeam',   type: 'boolean', required: false, description: 'Send Slack notification before restarting' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'Cloud',
    displayName: 'Cloud',
    icon: 'Cloud',
    color: '#9f72e8',
    description: 'Cloud infrastructure — resources, environments, secrets, configuration',
    actions: [
      {
        name: 'CREATE_CLOUD_RESOURCE',
        displayName: 'Create Cloud Resource',
        description: 'Provision a new cloud resource on the configured provider.',
        parameters: [
          { name: 'provider',      type: 'enum',   required: true,  enum: ['AWS', 'GCP', 'AZURE'], description: 'Cloud provider' },
          { name: 'resourceType',  type: 'string', required: true,  description: 'Resource type (e.g. s3, compute, database)' },
          { name: 'region',        type: 'string', required: true,  description: 'Target region' },
          { name: 'name',          type: 'string', required: true,  description: 'Resource name' },
          { name: 'config',        type: 'string', required: false, description: 'Configuration JSON (provider-specific)' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'SCALE_RESOURCE',
        displayName: 'Scale Resource',
        description: 'Scale a running cloud resource up or down.',
        parameters: [
          { name: 'resourceId', type: 'string', required: true,  description: 'Resource identifier' },
          { name: 'targetSize', type: 'string', required: true,  description: 'Target size (e.g. t3.large, 3 replicas)' },
          { name: 'direction',  type: 'enum',   required: true,  enum: ['UP', 'DOWN'], description: 'Scale direction' },
          { name: 'reason',     type: 'string', required: false, description: 'Reason for scaling' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'ROTATE_SECRET',
        displayName: 'Rotate Secret',
        description: 'Trigger rotation of a secret stored in the secrets manager.',
        parameters: [
          { name: 'secretName',    type: 'string',  required: true,  description: 'Secret name or ARN/path' },
          { name: 'provider',      type: 'enum',    required: true,  enum: ['AWS_SSM', 'AWS_SECRETS_MANAGER', 'GCP_SECRET_MANAGER', 'AZURE_KEY_VAULT', 'HASHICORP_VAULT'], description: 'Secrets provider' },
          { name: 'notifyOwner',   type: 'boolean', required: false, description: 'Notify secret owner by email' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_ENVIRONMENT',
        displayName: 'Create Environment',
        description: 'Spin up a new isolated deployment environment.',
        parameters: [
          { name: 'name',      type: 'string', required: true,  description: 'Environment name (e.g. feature-x, sprint-42)' },
          { name: 'type',      type: 'enum',   required: true,  enum: ['development', 'staging', 'production', 'review'], description: 'Environment type' },
          { name: 'baseFrom',  type: 'string', required: false, description: 'Clone config from this environment' },
          { name: 'ttlHours',  type: 'number', required: false, min: 1, max: 720, description: 'Auto-destroy after N hours (0 = permanent)' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'MODIFY_CONFIGURATION',
        displayName: 'Modify Configuration',
        description: 'Update a runtime configuration value for a service.',
        parameters: [
          { name: 'service',         type: 'string',  required: true,  description: 'Service name' },
          { name: 'key',             type: 'string',  required: true,  description: 'Configuration key' },
          { name: 'value',           type: 'string',  required: true,  description: 'New value' },
          { name: 'reason',          type: 'string',  required: true,  description: 'Why this configuration is changing' },
          { name: 'restartRequired', type: 'boolean', required: false, description: 'Service restart needed after change' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'Finance',
    displayName: 'Finance',
    icon: 'CurrencyDollar',
    color: '#fdcb2f',
    description: 'Financial operations — invoice approval, transaction review, purchase requests',
    actions: [
      {
        name: 'APPROVE_INVOICE',
        displayName: 'Approve Invoice',
        description: 'Approve a pending invoice for payment.',
        parameters: [
          { name: 'invoiceId',      type: 'object-ref', required: true,  description: 'Invoice ID' },
          { name: 'approvedAmount', type: 'number',     required: false, min: 0, description: 'Approved amount (blank = full amount)' },
          { name: 'paymentMethod',  type: 'enum',       required: false, enum: ['BANK_TRANSFER', 'CARD', 'CHEQUE', 'CRYPTO'], description: 'Payment method' },
          { name: 'notes',          type: 'string',     required: false, description: 'Approval notes' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'FLAG_TRANSACTION',
        displayName: 'Flag Transaction',
        description: 'Flag a transaction for review with a reason code.',
        parameters: [
          { name: 'transactionId', type: 'string', required: true,  description: 'Transaction reference' },
          { name: 'reason',        type: 'enum',   required: true,  enum: ['FRAUD', 'DUPLICATE', 'ERROR', 'DISPUTE', 'COMPLIANCE'], description: 'Flag reason' },
          { name: 'notes',         type: 'string', required: true,  description: 'Details about why the transaction is flagged' },
          { name: 'freeze',        type: 'boolean',required: false, description: 'Freeze the transaction immediately' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CREATE_PURCHASE_REQUEST',
        displayName: 'Create Purchase Request',
        description: 'Submit a purchase request for internal approval.',
        parameters: [
          { name: 'item',          type: 'string', required: true,  description: 'What is being purchased' },
          { name: 'amount',        type: 'number', required: true,  min: 0, description: 'Requested amount' },
          { name: 'currency',      type: 'enum',   required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Currency' },
          { name: 'vendor',        type: 'string', required: false, description: 'Vendor name' },
          { name: 'justification', type: 'string', required: true,  description: 'Business justification' },
          { name: 'urgency',       type: 'enum',   required: false, enum: ['STANDARD', 'URGENT', 'CRITICAL'], description: 'Urgency level' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'RECONCILE_ACCOUNT',
        displayName: 'Reconcile Account',
        description: 'Trigger account reconciliation for a specified period.',
        parameters: [
          { name: 'accountId',  type: 'string', required: true,  description: 'Account identifier' },
          { name: 'periodFrom', type: 'date',   required: true,  description: 'Period start' },
          { name: 'periodTo',   type: 'date',   required: true,  description: 'Period end' },
          { name: 'tolerance',  type: 'number', required: false, min: 0, max: 100, description: 'Acceptable variance % before flagging' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'HR',
    displayName: 'HR',
    icon: 'Users',
    color: '#ff7575',
    description: 'People operations — onboarding, leave, employee cases, training',
    actions: [
      {
        name: 'CREATE_ONBOARDING',
        displayName: 'Create Onboarding',
        description: 'Initiate the onboarding flow for a new employee.',
        parameters: [
          { name: 'employeeId',       type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'startDate',        type: 'date',       required: true,  description: 'First day of employment' },
          { name: 'role',             type: 'string',     required: true,  description: 'Job role/title' },
          { name: 'department',       type: 'string',     required: false, description: 'Department' },
          { name: 'managerId',        type: 'object-ref', required: false, description: 'Reporting manager ID' },
          { name: 'equipmentProfile', type: 'enum',       required: false, enum: ['STANDARD', 'ENGINEERING', 'EXECUTIVE', 'FIELD'], description: 'Equipment bundle' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'APPROVE_LEAVE',
        displayName: 'Approve Leave Request',
        description: 'Approve or decline a pending leave request.',
        parameters: [
          { name: 'requestId',   type: 'object-ref', required: true,  description: 'Leave request ID' },
          { name: 'decision',    type: 'enum',       required: true,  enum: ['APPROVED', 'DECLINED', 'PARTIAL'], description: 'Decision' },
          { name: 'approvedDays',type: 'number',     required: false, min: 0, description: 'If PARTIAL, days approved' },
          { name: 'notes',       type: 'string',     required: false, description: 'Notes for the employee' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_EMPLOYEE_CASE',
        displayName: 'Create Employee Case',
        description: 'Open a formal HR case for an employee.',
        parameters: [
          { name: 'employeeId',   type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'caseType',     type: 'enum',       required: true,  enum: ['PERFORMANCE', 'GRIEVANCE', 'ABSENCE', 'CONDUCT', 'WELLBEING'], description: 'Case type' },
          { name: 'description',  type: 'string',     required: true,  description: 'Case description' },
          { name: 'confidential', type: 'boolean',    required: false, description: 'Restrict visibility to HR only' },
          { name: 'assignedTo',   type: 'string',     required: false, description: 'HR case manager name' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'TRIGGER_TRAINING',
        displayName: 'Trigger Training',
        description: 'Assign a training course to an employee with optional deadline.',
        parameters: [
          { name: 'employeeId',     type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'courseId',       type: 'string',     required: true,  description: 'Training course identifier' },
          { name: 'deadline',       type: 'date',       required: false, description: 'Completion deadline' },
          { name: 'mandatory',      type: 'boolean',    required: false, description: 'Is completion required?' },
          { name: 'notifyEmployee', type: 'boolean',    required: false, description: 'Send notification to employee' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
    ],
  },

  {
    name: 'AI',
    displayName: 'AI',
    icon: 'Brain',
    color: '#b05ef7',
    description: 'AI operations — model execution, classification, summarization, prediction',
    actions: [
      {
        name: 'RUN_AI_MODEL',
        displayName: 'Run AI Model',
        description: 'Execute an AI model with a structured input and capture the output.',
        parameters: [
          { name: 'modelId',      type: 'string', required: true,  description: 'Model ID (e.g. waandax-gen2, claude-sonnet-5)' },
          { name: 'input',        type: 'string', required: true,  description: 'Model input (prompt or structured data)' },
          { name: 'outputFormat', type: 'enum',   required: false, enum: ['TEXT', 'JSON', 'STRUCTURED', 'MARKDOWN'], description: 'Output format' },
          { name: 'maxTokens',    type: 'number', required: false, min: 1, max: 100000, description: 'Max tokens in response' },
          { name: 'temperature',  type: 'number', required: false, min: 0, max: 2, description: 'Temperature (0=deterministic)' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'SUMMARIZE_EVIDENCE',
        displayName: 'Summarize Evidence',
        description: 'Generate an AI summary of all evidence associated with an entity.',
        parameters: [
          { name: 'entityType',     type: 'string',     required: true,  description: 'Entity type (e.g. Client, Project, Decision)' },
          { name: 'entityId',       type: 'object-ref', required: true,  description: 'Entity ID' },
          { name: 'focus',          type: 'string',     required: false, description: 'What aspect to focus the summary on' },
          { name: 'maxLength',      type: 'number',     required: false, min: 50, max: 5000, description: 'Max summary length in words' },
          { name: 'includeTimeline',type: 'boolean',    required: false, description: 'Include chronological timeline' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CLASSIFY_CASE',
        displayName: 'Classify Case',
        description: 'Apply AI classification to a case using a named taxonomy.',
        parameters: [
          { name: 'caseId',     type: 'object-ref', required: true,  description: 'Case/entity ID' },
          { name: 'taxonomy',   type: 'string',     required: true,  description: 'Classification taxonomy name' },
          { name: 'confidence', type: 'number',     required: false, min: 0, max: 100, description: 'Minimum confidence threshold (%)' },
          { name: 'explain',    type: 'boolean',    required: false, description: 'Return explanation alongside classification' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'GENERATE_RECOMMENDATION',
        displayName: 'Generate Recommendation',
        description: 'Generate a KIMMP prescriptive recommendation for an entity.',
        parameters: [
          { name: 'entityId', type: 'object-ref', required: true,  description: 'Target entity ID' },
          { name: 'context',  type: 'string',     required: false, description: 'Additional context for the recommendation' },
          { name: 'priority', type: 'enum',       required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Recommended action priority' },
          { name: 'draftOnly',type: 'boolean',    required: false, description: 'Return as draft (do not persist)' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'RUN_PREDICTION',
        displayName: 'Run Prediction',
        description: 'Run a predictive model for a specified entity and time horizon.',
        parameters: [
          { name: 'modelId',      type: 'string',     required: true,  description: 'Prediction model identifier' },
          { name: 'horizon',      type: 'string',     required: true,  description: 'Prediction horizon (e.g. 30d, 90d, 1y)' },
          { name: 'entityId',     type: 'object-ref', required: false, description: 'Entity to run prediction for' },
          { name: 'outputFormat', type: 'enum',       required: false, enum: ['JSON', 'SUMMARY', 'CHART_DATA'], description: 'Output format' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
    ],
  },
]

export async function seedEnterpriseActions(): Promise<{ created: number; skipped: number; categories: string[] }> {
  let created = 0
  let skipped = 0

  for (const category of ACTION_LIBRARY) {
    const type = await prisma.ontologyObjectType.upsert({
      where: { name: category.name },
      create: {
        name: category.name,
        displayName: category.displayName,
        icon: category.icon,
        color: category.color,
        description: category.description,
      },
      update: {
        displayName: category.displayName,
        icon: category.icon,
        color: category.color,
        description: category.description,
      },
    })

    for (const action of category.actions) {
      const existing = await prisma.ontologyAction.findUnique({
        where: { typeId_name: { typeId: type.id, name: action.name } },
      })

      if (existing) {
        // Sync toolCallable flag on existing actions (safe update)
        if (existing.toolCallable !== action.toolCallable) {
          await prisma.ontologyAction.update({
            where: { id: existing.id },
            data: { toolCallable: action.toolCallable },
          })
        }
        skipped++
        continue
      }

      const created_ = await prisma.ontologyAction.create({
        data: {
          typeId: type.id,
          name: action.name,
          displayName: action.displayName,
          description: action.description,
          parameters: action.parameters as any,
          allowedRoles: action.allowedRoles,
          toolCallable: action.toolCallable,
          executions: 0,
        },
      })

      if (action.validationRules) {
        await prisma.actionValidationRule.createMany({
          data: action.validationRules.map(r => ({
            actionId: created_.id,
            condition: r.condition as any,
            errorMessage: r.errorMessage,
            severity: r.severity,
            order: r.order,
          })),
        })
      }

      created++
    }
  }

  return { created, skipped, categories: ACTION_LIBRARY.map(c => c.name) }
}
