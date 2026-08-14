import { prisma } from '../../lib/prisma'

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
            condition: { leaf: { source: 'param', op: 'contains', field: 'email', value: '@' } },
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
            condition: { leaf: { source: 'param', op: 'gte', field: 'value', value: 0 } },
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
      {
        name: 'ARCHIVE_CUSTOMER',
        displayName: 'Archive Customer',
        description: 'Mark a customer account as inactive and archive all linked records.',
        parameters: [
          { name: 'customerId', type: 'object-ref', required: true,  description: 'Customer ID' },
          { name: 'reason',     type: 'enum',       required: true,  enum: ['CHURNED', 'MERGED', 'DUPLICATE', 'NON_PAYMENT', 'MUTUAL_AGREEMENT'], description: 'Archive reason' },
          { name: 'notes',      type: 'string',     required: false, description: 'Additional notes' },
          { name: 'notifyTeam', type: 'boolean',    required: false, description: 'Notify account team' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CREATE_PROPOSAL',
        displayName: 'Create Proposal',
        description: 'Generate a commercial proposal document for a prospect or customer.',
        parameters: [
          { name: 'customerId',    type: 'object-ref', required: true,  description: 'Target customer or prospect ID' },
          { name: 'proposalType',  type: 'enum',       required: true,  enum: ['NEW_BUSINESS', 'RENEWAL', 'EXPANSION', 'CUSTOM'], description: 'Proposal type' },
          { name: 'value',         type: 'number',     required: false, min: 0, description: 'Proposed contract value' },
          { name: 'validDays',     type: 'number',     required: false, min: 1, max: 90, description: 'Days proposal is valid' },
          { name: 'templateId',    type: 'string',     required: false, description: 'Proposal template ID' },
          { name: 'assignedAE',    type: 'object-ref', required: false, description: 'Account Executive user ID' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'REGISTER_PARTNER',
        displayName: 'Register Partner',
        description: 'Onboard a new partner to the partner program with tier and agreements.',
        parameters: [
          { name: 'partnerName',    type: 'string', required: true,  description: 'Partner organisation name' },
          { name: 'contactEmail',   type: 'string', required: true,  description: 'Primary contact email' },
          { name: 'partnerTier',    type: 'enum',   required: true,  enum: ['REFERRAL', 'RESELLER', 'OEM', 'TECHNOLOGY'], description: 'Partner tier' },
          { name: 'region',         type: 'enum',   required: false, enum: ['UK', 'US', 'EU', 'APAC', 'MENA'], description: 'Primary region' },
          { name: 'revenueShare',   type: 'number', required: false, min: 0, max: 50, description: 'Revenue share % agreed' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { source: 'param', op: 'contains', field: 'contactEmail', value: '@' } },
            errorMessage: 'Contact email must be a valid address',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'LOG_CUSTOMER_CALL',
        displayName: 'Log Customer Call',
        description: 'Record a customer call or meeting interaction in the CRM.',
        parameters: [
          { name: 'customerId',   type: 'object-ref', required: true,  description: 'Customer ID' },
          { name: 'callType',     type: 'enum',       required: true,  enum: ['DISCOVERY', 'DEMO', 'QBR', 'SUPPORT', 'RENEWAL', 'EXECUTIVE_SPONSOR', 'CHECK_IN'], description: 'Call type' },
          { name: 'duration',     type: 'number',     required: false, min: 1, description: 'Duration in minutes' },
          { name: 'summary',      type: 'string',     required: true,  description: 'Call summary' },
          { name: 'nextSteps',    type: 'string',     required: false, description: 'Agreed next steps' },
          { name: 'sentiment',    type: 'enum',       required: false, enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AT_RISK'], description: 'Customer sentiment' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SEND_CONTRACT_FOR_SIGNATURE',
        displayName: 'Send Contract for Signature',
        description: 'Send a contract to a customer for e-signature via DocuSign or HelloSign.',
        parameters: [
          { name: 'customerId',    type: 'object-ref', required: true,  description: 'Customer ID' },
          { name: 'contractId',    type: 'object-ref', required: true,  description: 'Contract document ID' },
          { name: 'signerEmail',   type: 'string',     required: true,  description: 'Signer email address' },
          { name: 'signerName',    type: 'string',     required: false, description: 'Signer full name' },
          { name: 'provider',      type: 'enum',       required: false, enum: ['DOCUSIGN', 'HELLOSIGN', 'ADOBE_SIGN', 'NATIVE'], description: 'E-signature provider' },
          { name: 'deadline',      type: 'date',       required: false, description: 'Signature deadline' },
          { name: 'message',       type: 'string',     required: false, description: 'Custom message to the signer' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { source: 'param', op: 'contains', field: 'signerEmail', value: '@' } },
            errorMessage: 'Signer email must be a valid address',
            severity: 'BLOCK', order: 0,
          },
        ],
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
            condition: { leaf: { source: 'param', op: 'contains', field: 'to', value: '@' } },
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
      {
        name: 'SEND_BULK_EMAIL',
        displayName: 'Send Bulk Email',
        description: 'Send a mass email to a customer segment or list.',
        parameters: [
          { name: 'segment',     type: 'string',  required: true,  description: 'Recipient segment (e.g. "churned_risk", "enterprise_tier")' },
          { name: 'subject',     type: 'string',  required: true,  description: 'Email subject line' },
          { name: 'templateId',  type: 'string',  required: true,  description: 'Email template ID' },
          { name: 'scheduledAt', type: 'date',    required: false, description: 'Scheduled send time (blank = send now)' },
          { name: 'trackOpens',  type: 'boolean', required: false, description: 'Track open rate' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'POST_ANNOUNCEMENT',
        displayName: 'Post Announcement',
        description: 'Publish a platform-wide announcement visible in the OS.',
        parameters: [
          { name: 'title',     type: 'string', required: true,  description: 'Announcement title' },
          { name: 'body',      type: 'string', required: true,  description: 'Announcement body (Markdown)' },
          { name: 'audience',  type: 'enum',   required: true,  enum: ['ALL', 'ADMIN', 'TEAM', 'EXECUTIVE', 'CLIENT', 'PARTNER'], description: 'Target audience' },
          { name: 'expiresAt', type: 'date',   required: false, description: 'Announcement expiry date' },
          { name: 'pinned',    type: 'boolean',required: false, description: 'Pin to top of announcements feed' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SEND_SURVEY',
        displayName: 'Send Survey',
        description: 'Dispatch a survey to a customer contact or employee.',
        parameters: [
          { name: 'surveyId',   type: 'string',     required: true,  description: 'Survey template ID' },
          { name: 'recipientId',type: 'object-ref', required: true,  description: 'Recipient user or contact ID' },
          { name: 'channel',    type: 'enum',       required: false, enum: ['EMAIL', 'SLACK', 'IN_APP'], description: 'Delivery channel' },
          { name: 'deadline',   type: 'date',       required: false, description: 'Survey completion deadline' },
          { name: 'anonymous',  type: 'boolean',    required: false, description: 'Anonymize responses' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'CREATE_WEBHOOK',
        displayName: 'Create Webhook Subscription',
        description: 'Register a webhook endpoint to receive real-time event notifications.',
        parameters: [
          { name: 'url',       type: 'string', required: true,  description: 'Target webhook URL (HTTPS)' },
          { name: 'events',    type: 'string', required: true,  description: 'Comma-separated event types to subscribe to' },
          { name: 'secret',    type: 'string', required: false, description: 'HMAC secret for payload signing' },
          { name: 'retries',   type: 'number', required: false, min: 0, max: 5, description: 'Retry attempts on failure' },
          { name: 'active',    type: 'boolean',required: false, description: 'Activate immediately' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { source: 'param', op: 'startsWith', field: 'url', value: 'https://' } },
            errorMessage: 'Webhook URL must use HTTPS',
            severity: 'BLOCK', order: 0,
          },
        ],
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
            condition: { leaf: { source: 'param', op: 'contains', field: 'repo', value: '/' } },
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
                { leaf: { source: 'param', op: 'neq', field: 'environment', value: 'production' } },
                { leaf: { source: 'param', op: 'exists', field: 'reason' } },
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
      {
        name: 'MERGE_PULL_REQUEST',
        displayName: 'Merge Pull Request',
        description: 'Merge an approved pull request into the target branch.',
        parameters: [
          { name: 'repo',        type: 'string', required: true,  description: 'Repository in org/repo format' },
          { name: 'prNumber',    type: 'number', required: true,  min: 1, description: 'Pull request number' },
          { name: 'mergeMethod', type: 'enum',   required: false, enum: ['merge', 'squash', 'rebase'], description: 'Merge strategy' },
          { name: 'deleteSourceBranch', type: 'boolean', required: false, description: 'Delete head branch after merge' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'CLOSE_GITHUB_ISSUE',
        displayName: 'Close GitHub Issue',
        description: 'Close an open GitHub issue with an optional resolution comment.',
        parameters: [
          { name: 'repo',       type: 'string', required: true,  description: 'Repository in org/repo format' },
          { name: 'issueNumber',type: 'number', required: true,  min: 1, description: 'Issue number' },
          { name: 'comment',    type: 'string', required: false, description: 'Closing comment' },
          { name: 'reason',     type: 'enum',   required: false, enum: ['completed', 'not_planned'], description: 'Close reason' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'ADD_GITHUB_LABEL',
        displayName: 'Add GitHub Label',
        description: 'Add one or more labels to a GitHub issue or pull request.',
        parameters: [
          { name: 'repo',       type: 'string', required: true,  description: 'Repository in org/repo format' },
          { name: 'number',     type: 'number', required: true,  min: 1, description: 'Issue or PR number' },
          { name: 'labels',     type: 'string', required: true,  description: 'Comma-separated label names' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'CREATE_RELEASE',
        displayName: 'Create GitHub Release',
        description: 'Tag a release in GitHub with release notes.',
        parameters: [
          { name: 'repo',         type: 'string',  required: true,  description: 'Repository in org/repo format' },
          { name: 'tag',          type: 'string',  required: true,  description: 'Version tag (e.g. v1.2.0)' },
          { name: 'name',         type: 'string',  required: false, description: 'Release title' },
          { name: 'body',         type: 'string',  required: false, description: 'Release notes (Markdown)' },
          { name: 'draft',        type: 'boolean', required: false, description: 'Save as draft' },
          { name: 'prerelease',   type: 'boolean', required: false, description: 'Mark as pre-release' },
          { name: 'targetBranch', type: 'string',  required: false, description: 'Branch or commit SHA' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'RUN_CI_PIPELINE',
        displayName: 'Run CI Pipeline',
        description: 'Trigger a CI/CD pipeline run for a repository.',
        parameters: [
          { name: 'repo',       type: 'string', required: true,  description: 'Repository in org/repo format' },
          { name: 'pipeline',   type: 'string', required: true,  description: 'Pipeline name or workflow file' },
          { name: 'branch',     type: 'string', required: false, description: 'Branch to run on (default: main)' },
          { name: 'inputs',     type: 'string', required: false, description: 'Pipeline inputs as JSON' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'APPROVE_PIPELINE_GATE',
        displayName: 'Approve Pipeline Gate',
        description: 'Approve a blocked pipeline gate to allow progression to the next stage.',
        parameters: [
          { name: 'pipelineId', type: 'string', required: true,  description: 'Pipeline run ID' },
          { name: 'gateName',   type: 'string', required: true,  description: 'Gate or environment name' },
          { name: 'notes',      type: 'string', required: false, description: 'Approval notes' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_FEATURE_FLAG',
        displayName: 'Create Feature Flag',
        description: 'Create a new feature flag in the feature management system.',
        parameters: [
          { name: 'key',         type: 'string',  required: true,  description: 'Feature flag key (e.g. new_billing_flow)' },
          { name: 'description', type: 'string',  required: false, description: 'What this flag controls' },
          { name: 'enabled',     type: 'boolean', required: false, description: 'Enable by default' },
          { name: 'percentage',  type: 'number',  required: false, min: 0, max: 100, description: 'Rollout percentage' },
          { name: 'environments',type: 'string',  required: false, description: 'Target environments (comma-separated)' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
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
      {
        name: 'CREATE_SECRET',
        displayName: 'Create Secret',
        description: 'Store a new secret in the secrets manager.',
        parameters: [
          { name: 'name',        type: 'string', required: true,  description: 'Secret name' },
          { name: 'value',       type: 'string', required: true,  description: 'Secret value (will be encrypted at rest)' },
          { name: 'provider',    type: 'enum',   required: true,  enum: ['AWS_SECRETS_MANAGER', 'AWS_SSM', 'GCP_SECRET_MANAGER', 'AZURE_KEY_VAULT', 'HASHICORP_VAULT'], description: 'Secrets provider' },
          { name: 'description', type: 'string', required: false, description: 'What this secret is for' },
          { name: 'tags',        type: 'string', required: false, description: 'Comma-separated key=value tags' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'DELETE_RESOURCE',
        displayName: 'Delete Cloud Resource',
        description: 'Permanently delete a cloud resource after safety checks.',
        parameters: [
          { name: 'resourceId',   type: 'string',  required: true,  description: 'Resource identifier' },
          { name: 'provider',     type: 'enum',    required: true,  enum: ['AWS', 'GCP', 'AZURE'], description: 'Cloud provider' },
          { name: 'reason',       type: 'string',  required: true,  description: 'Deletion reason for audit trail' },
          { name: 'snapshotFirst',type: 'boolean', required: false, description: 'Take a snapshot before deleting' },
          { name: 'force',        type: 'boolean', required: false, description: 'Force delete without draining' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_SNAPSHOT',
        displayName: 'Create Resource Snapshot',
        description: 'Take a point-in-time snapshot of a cloud resource.',
        parameters: [
          { name: 'resourceId',  type: 'string', required: true,  description: 'Resource to snapshot' },
          { name: 'provider',    type: 'enum',   required: true,  enum: ['AWS', 'GCP', 'AZURE'], description: 'Cloud provider' },
          { name: 'label',       type: 'string', required: false, description: 'Snapshot label for identification' },
          { name: 'retainDays',  type: 'number', required: false, min: 1, max: 365, description: 'Auto-delete after N days (0 = keep forever)' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'ENABLE_AUTOSCALING',
        displayName: 'Enable Autoscaling',
        description: 'Configure autoscaling rules for a compute resource.',
        parameters: [
          { name: 'resourceId', type: 'string', required: true,  description: 'Resource or autoscaling group ID' },
          { name: 'minReplicas',type: 'number', required: true,  min: 0, description: 'Minimum replicas / instances' },
          { name: 'maxReplicas',type: 'number', required: true,  min: 1, description: 'Maximum replicas / instances' },
          { name: 'metric',     type: 'enum',   required: false, enum: ['CPU', 'MEMORY', 'REQUESTS_PER_SECOND', 'QUEUE_DEPTH'], description: 'Scaling trigger metric' },
          { name: 'threshold',  type: 'number', required: false, min: 1, max: 100, description: 'Scale-out threshold %' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'SET_RESOURCE_TAG',
        displayName: 'Set Resource Tag',
        description: 'Apply metadata tags to a cloud resource for cost allocation or governance.',
        parameters: [
          { name: 'resourceId', type: 'string', required: true,  description: 'Resource ARN, ID, or path' },
          { name: 'provider',   type: 'enum',   required: true,  enum: ['AWS', 'GCP', 'AZURE'], description: 'Cloud provider' },
          { name: 'tags',       type: 'string', required: true,  description: 'Tags as JSON (key:value pairs)' },
          { name: 'overwrite',  type: 'boolean',required: false, description: 'Overwrite existing tags with same key' },
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
      {
        name: 'APPROVE_BUDGET',
        displayName: 'Approve Budget',
        description: 'Approve a departmental or project budget submission.',
        parameters: [
          { name: 'budgetId',       type: 'object-ref', required: true,  description: 'Budget request ID' },
          { name: 'approvedAmount', type: 'number',     required: false, min: 0, description: 'Approved budget (blank = requested amount)' },
          { name: 'period',         type: 'string',     required: true,  description: 'Budget period (e.g. FY2026-Q3)' },
          { name: 'conditions',     type: 'string',     required: false, description: 'Conditions or restrictions on the approved budget' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'PROCESS_REFUND',
        displayName: 'Process Refund',
        description: 'Issue a full or partial refund against an invoice or payment.',
        parameters: [
          { name: 'paymentId',  type: 'object-ref', required: true,  description: 'Original payment or invoice ID' },
          { name: 'amount',     type: 'number',     required: true,  min: 0, description: 'Refund amount' },
          { name: 'reason',     type: 'enum',       required: true,  enum: ['CANCELLATION', 'DUPLICATE', 'SERVICE_FAILURE', 'GOODWILL', 'ERROR'], description: 'Refund reason' },
          { name: 'notes',      type: 'string',     required: false, description: 'Additional notes for finance' },
          { name: 'notifyCustomer', type: 'boolean', required: false, description: 'Send refund confirmation to customer' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { source: 'param', op: 'gte', field: 'amount', value: 0.01 } },
            errorMessage: 'Refund amount must be at least 0.01',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'CREATE_EXPENSE_REPORT',
        displayName: 'Create Expense Report',
        description: 'Submit an employee expense report for approval.',
        parameters: [
          { name: 'employeeId',  type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'totalAmount', type: 'number',     required: true,  min: 0, description: 'Total expense amount' },
          { name: 'currency',    type: 'enum',       required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Currency' },
          { name: 'period',      type: 'string',     required: true,  description: 'Expense period (e.g. August 2026)' },
          { name: 'category',    type: 'enum',       required: false, enum: ['TRAVEL', 'MEALS', 'EQUIPMENT', 'SOFTWARE', 'TRAINING', 'OTHER'], description: 'Expense category' },
          { name: 'receipts',    type: 'string',     required: false, description: 'Comma-separated receipt URLs or IDs' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SET_BUDGET_ALERT',
        displayName: 'Set Budget Alert',
        description: 'Configure a budget alert to notify when spending approaches a threshold.',
        parameters: [
          { name: 'budgetId',        type: 'object-ref', required: true,  description: 'Budget ID to monitor' },
          { name: 'thresholdPct',    type: 'number',     required: true,  min: 1, max: 100, description: 'Alert at this % of budget consumed' },
          { name: 'notifyEmail',     type: 'string',     required: true,  description: 'Email to notify' },
          { name: 'notifySlack',     type: 'string',     required: false, description: 'Slack channel for alert' },
          { name: 'frequency',       type: 'enum',       required: false, enum: ['DAILY', 'WEEKLY', 'ON_BREACH'], description: 'Alert frequency' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'WRITE_OFF_DEBT',
        displayName: 'Write Off Debt',
        description: 'Mark an unpayable invoice or debt as written off for accounting.',
        parameters: [
          { name: 'invoiceId',   type: 'object-ref', required: true,  description: 'Invoice or debt ID' },
          { name: 'amount',      type: 'number',     required: true,  min: 0, description: 'Amount to write off' },
          { name: 'reason',      type: 'enum',       required: true,  enum: ['UNCOLLECTABLE', 'BANKRUPTCY', 'DISPUTE_SETTLED', 'GOODWILL', 'ERROR'], description: 'Write-off reason' },
          { name: 'accountingCode', type: 'string',  required: false, description: 'GL account code' },
          { name: 'notifyCustomer', type: 'boolean', required: false, description: 'Notify customer of write-off' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'GENERATE_FINANCIAL_STATEMENT',
        displayName: 'Generate Financial Statement',
        description: 'Produce a P&L, balance sheet, or cash flow statement for a period.',
        parameters: [
          { name: 'statementType', type: 'enum',   required: true,  enum: ['PROFIT_LOSS', 'BALANCE_SHEET', 'CASH_FLOW', 'TRIAL_BALANCE'], description: 'Statement type' },
          { name: 'periodFrom',    type: 'date',   required: true,  description: 'Period start' },
          { name: 'periodTo',      type: 'date',   required: true,  description: 'Period end' },
          { name: 'format',        type: 'enum',   required: false, enum: ['PDF', 'XLSX', 'JSON'], description: 'Output format' },
          { name: 'deliverTo',     type: 'string', required: false, description: 'Email to deliver to' },
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
      {
        name: 'OFFBOARD_EMPLOYEE',
        displayName: 'Offboard Employee',
        description: 'Initiate the offboarding workflow for a departing employee.',
        parameters: [
          { name: 'employeeId',     type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'lastDay',        type: 'date',       required: true,  description: 'Last working day' },
          { name: 'departureType',  type: 'enum',       required: true,  enum: ['RESIGNATION', 'REDUNDANCY', 'TERMINATION', 'RETIREMENT', 'CONTRACT_END'], description: 'Departure type' },
          { name: 'eligible',       type: 'boolean',    required: false, description: 'Eligible for rehire' },
          { name: 'revokeAccess',   type: 'boolean',    required: false, description: 'Immediately revoke all system access' },
          { name: 'exitInterview',  type: 'boolean',    required: false, description: 'Schedule exit interview' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'UPDATE_COMPENSATION',
        displayName: 'Update Compensation',
        description: 'Process a salary or compensation change for an employee.',
        parameters: [
          { name: 'employeeId',    type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'changeType',    type: 'enum',       required: true,  enum: ['SALARY_INCREASE', 'SALARY_DECREASE', 'BONUS', 'EQUITY_GRANT', 'BENEFIT_CHANGE'], description: 'Change type' },
          { name: 'newAmount',     type: 'number',     required: true,  min: 0, description: 'New compensation value' },
          { name: 'currency',      type: 'enum',       required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Currency' },
          { name: 'effectiveDate', type: 'date',       required: true,  description: 'Effective date' },
          { name: 'reason',        type: 'string',     required: true,  description: 'Reason for change' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_PERFORMANCE_REVIEW',
        displayName: 'Create Performance Review',
        description: 'Open a formal performance review cycle for an employee.',
        parameters: [
          { name: 'employeeId',  type: 'object-ref', required: true,  description: 'Employee ID' },
          { name: 'reviewType',  type: 'enum',       required: true,  enum: ['ANNUAL', 'MID_YEAR', 'PROBATION', 'PROMOTION', 'PIP'], description: 'Review type' },
          { name: 'dueDate',     type: 'date',       required: true,  description: 'Review completion deadline' },
          { name: 'managerId',   type: 'object-ref', required: false, description: 'Reviewer manager ID' },
          { name: 'goals',       type: 'string',     required: false, description: 'Goals or objectives to evaluate against' },
          { name: 'selfReview',  type: 'boolean',    required: false, description: 'Include self-assessment' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'SEND_OFFER_LETTER',
        displayName: 'Send Offer Letter',
        description: 'Generate and send an employment offer letter to a candidate.',
        parameters: [
          { name: 'candidateName',  type: 'string', required: true,  description: 'Candidate full name' },
          { name: 'candidateEmail', type: 'string', required: true,  description: 'Candidate email' },
          { name: 'role',           type: 'string', required: true,  description: 'Offered role/title' },
          { name: 'salary',         type: 'number', required: true,  min: 0, description: 'Offered base salary' },
          { name: 'currency',       type: 'enum',   required: false, enum: ['GBP', 'USD', 'EUR'], description: 'Salary currency' },
          { name: 'startDate',      type: 'date',   required: true,  description: 'Proposed start date' },
          { name: 'templateId',     type: 'string', required: false, description: 'Offer letter template ID' },
          { name: 'expiresAt',      type: 'date',   required: false, description: 'Offer expiry date' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
        validationRules: [
          {
            condition: { leaf: { source: 'param', op: 'contains', field: 'candidateEmail', value: '@' } },
            errorMessage: 'Candidate email must be a valid address',
            severity: 'BLOCK', order: 0,
          },
        ],
      },
      {
        name: 'CREATE_HEADCOUNT_REQUEST',
        displayName: 'Create Headcount Request',
        description: 'Submit a request to open a new headcount position.',
        parameters: [
          { name: 'department',    type: 'string', required: true,  description: 'Hiring department' },
          { name: 'role',          type: 'string', required: true,  description: 'Role/title requested' },
          { name: 'level',         type: 'enum',   required: false, enum: ['JUNIOR', 'MID', 'SENIOR', 'PRINCIPAL', 'DIRECTOR', 'VP'], description: 'Seniority level' },
          { name: 'headcount',     type: 'number', required: true,  min: 1, description: 'Number of positions' },
          { name: 'justification', type: 'string', required: true,  description: 'Business justification' },
          { name: 'targetDate',    type: 'date',   required: false, description: 'Target start date' },
          { name: 'budgetCode',    type: 'string', required: false, description: 'Budget code for the role' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
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
      {
        name: 'EMBED_DOCUMENT',
        displayName: 'Embed Document',
        description: 'Generate vector embeddings for a document and store in the knowledge index.',
        parameters: [
          { name: 'documentId',  type: 'object-ref', required: true,  description: 'Document or ontology object ID' },
          { name: 'model',       type: 'enum',       required: false, enum: ['text-embedding-3-large', 'text-embedding-3-small', 'waandax-embed'], description: 'Embedding model' },
          { name: 'chunkSize',   type: 'number',     required: false, min: 128, max: 4096, description: 'Token chunk size' },
          { name: 'namespace',   type: 'string',     required: false, description: 'Vector namespace for scoped retrieval' },
          { name: 'overwrite',   type: 'boolean',    required: false, description: 'Re-embed if already exists' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'ANALYZE_SENTIMENT',
        displayName: 'Analyze Sentiment',
        description: 'Run sentiment analysis on a text input or entity communications.',
        parameters: [
          { name: 'text',        type: 'string',     required: false, description: 'Raw text to analyze (mutually exclusive with entityId)' },
          { name: 'entityId',    type: 'object-ref', required: false, description: 'Entity whose communications to analyze' },
          { name: 'granularity', type: 'enum',       required: false, enum: ['DOCUMENT', 'SENTENCE', 'ASPECT'], description: 'Analysis granularity' },
          { name: 'aspects',     type: 'string',     required: false, description: 'Specific aspects to analyze (e.g. "support,product,pricing")' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'EXTRACT_ENTITIES',
        displayName: 'Extract Entities',
        description: 'Run named entity recognition on a document or text block.',
        parameters: [
          { name: 'text',        type: 'string', required: true,  description: 'Text to extract entities from' },
          { name: 'entityTypes', type: 'string', required: false, description: 'Entity types to extract (e.g. "PERSON,ORG,DATE,MONEY")' },
          { name: 'linkToGraph', type: 'boolean',required: false, description: 'Auto-link extracted entities to Ontology objects' },
          { name: 'confidence',  type: 'number', required: false, min: 0, max: 100, description: 'Minimum extraction confidence %' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'TRANSLATE_CONTENT',
        displayName: 'Translate Content',
        description: 'Translate text or a document into a target language using AI.',
        parameters: [
          { name: 'text',           type: 'string',     required: false, description: 'Text to translate' },
          { name: 'documentId',     type: 'object-ref', required: false, description: 'Document to translate' },
          { name: 'targetLanguage', type: 'string',     required: true,  description: 'Target language code (e.g. fr, de, ja, ar)' },
          { name: 'sourceLanguage', type: 'string',     required: false, description: 'Source language (auto-detect if blank)' },
          { name: 'preserveFormat', type: 'boolean',    required: false, description: 'Preserve original formatting' },
        ],
        allowedRoles: ['ADMIN', 'TEAM', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CREATE_FINE_TUNE_JOB',
        displayName: 'Create Fine-Tune Job',
        description: 'Submit a fine-tuning job to train a model on custom data.',
        parameters: [
          { name: 'baseModel',    type: 'string', required: true,  description: 'Base model to fine-tune (e.g. waandax-gen2)' },
          { name: 'datasetId',    type: 'string', required: true,  description: 'Training dataset ID' },
          { name: 'epochs',       type: 'number', required: false, min: 1, max: 10, description: 'Training epochs' },
          { name: 'learningRate', type: 'number', required: false, min: 0.00001, max: 0.1, description: 'Learning rate' },
          { name: 'jobName',      type: 'string', required: false, description: 'Fine-tune job name for tracking' },
          { name: 'notifyEmail',  type: 'string', required: false, description: 'Notify when complete' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
    ],
  },

  // ── Security ─────────────────────────────────────────────────────────────────
  {
    name: 'Security',
    displayName: 'Security',
    icon: 'ShieldCheck',
    color: '#e44332',
    description: 'Access control, threat response, compliance enforcement, and audit',
    actions: [
      {
        name: 'REVOKE_ACCESS',
        displayName: 'Revoke Access',
        description: 'Immediately revoke a user\'s access to a system or resource.',
        parameters: [
          { name: 'userId',      type: 'object-ref', required: true,  description: 'User ID whose access to revoke' },
          { name: 'scope',       type: 'enum',       required: true,  enum: ['ALL', 'APPLICATION', 'ENVIRONMENT', 'RESOURCE'], description: 'Revocation scope' },
          { name: 'resource',    type: 'string',     required: false, description: 'Specific resource or application name' },
          { name: 'reason',      type: 'string',     required: true,  description: 'Reason for revocation (audit)' },
          { name: 'notify',      type: 'boolean',    required: false, description: 'Notify the user\'s manager' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'GRANT_PERMISSION',
        displayName: 'Grant Permission',
        description: 'Grant a user or role access to a resource or system.',
        parameters: [
          { name: 'userId',      type: 'object-ref', required: true,  description: 'User ID to grant access to' },
          { name: 'permission',  type: 'string',     required: true,  description: 'Permission or role to grant' },
          { name: 'resource',    type: 'string',     required: false, description: 'Resource or application' },
          { name: 'expiresAt',   type: 'date',       required: false, description: 'Access expiry (blank = permanent)' },
          { name: 'reason',      type: 'string',     required: true,  description: 'Business justification' },
          { name: 'approvedBy',  type: 'string',     required: false, description: 'Approver name for audit' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'FORCE_MFA_RESET',
        displayName: 'Force MFA Reset',
        description: 'Force a user to re-enrol their MFA device.',
        parameters: [
          { name: 'userId',  type: 'object-ref', required: true,  description: 'User ID' },
          { name: 'reason',  type: 'string',     required: true,  description: 'Reason (e.g. device lost, suspicious activity)' },
          { name: 'notify',  type: 'boolean',    required: false, description: 'Notify the user by email' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'QUARANTINE_DEVICE',
        displayName: 'Quarantine Device',
        description: 'Isolate a device from the network due to security risk.',
        parameters: [
          { name: 'deviceId',      type: 'string',  required: true,  description: 'Device MDM ID or hostname' },
          { name: 'reason',        type: 'enum',    required: true,  enum: ['MALWARE', 'LOST', 'STOLEN', 'COMPROMISED', 'POLICY_VIOLATION'], description: 'Quarantine reason' },
          { name: 'notifyOwner',   type: 'boolean', required: false, description: 'Notify device owner' },
          { name: 'wipeOnConfirm', type: 'boolean', required: false, description: 'Queue remote wipe pending confirmation' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_SECURITY_ALERT',
        displayName: 'Create Security Alert',
        description: 'Raise a security alert and notify the security team.',
        parameters: [
          { name: 'severity',    type: 'enum',   required: true,  enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Alert severity' },
          { name: 'title',       type: 'string', required: true,  description: 'Alert title' },
          { name: 'description', type: 'string', required: true,  description: 'What was detected' },
          { name: 'entityId',    type: 'string', required: false, description: 'Affected entity or resource' },
          { name: 'source',      type: 'string', required: false, description: 'Detection source (e.g. SIEM, WAF, manual)' },
          { name: 'pagerDuty',   type: 'boolean',required: false, description: 'Page on-call via PagerDuty' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'RUN_VULNERABILITY_SCAN',
        displayName: 'Run Vulnerability Scan',
        description: 'Trigger a security vulnerability scan on a target.',
        parameters: [
          { name: 'target',    type: 'string', required: true,  description: 'Scan target (hostname, IP, or repo name)' },
          { name: 'scanType',  type: 'enum',   required: true,  enum: ['DAST', 'SAST', 'CONTAINER', 'NETWORK', 'DEPENDENCY'], description: 'Scan type' },
          { name: 'profile',   type: 'enum',   required: false, enum: ['QUICK', 'STANDARD', 'DEEP'], description: 'Scan depth' },
          { name: 'notifyEmail',type: 'string',required: false, description: 'Email for scan results' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'APPROVE_ACCESS_REQUEST',
        displayName: 'Approve Access Request',
        description: 'Approve a pending access request from a user.',
        parameters: [
          { name: 'requestId',  type: 'object-ref', required: true,  description: 'Access request ID' },
          { name: 'expiresAt',  type: 'date',       required: false, description: 'Grant access until this date' },
          { name: 'conditions', type: 'string',     required: false, description: 'Any conditions on the approval' },
          { name: 'notes',      type: 'string',     required: false, description: 'Approval notes' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_FIREWALL_RULE',
        displayName: 'Create Firewall Rule',
        description: 'Add a new firewall or WAF rule to a security group.',
        parameters: [
          { name: 'ruleType',    type: 'enum',    required: true,  enum: ['ALLOW', 'DENY', 'RATE_LIMIT', 'GEO_BLOCK'], description: 'Rule type' },
          { name: 'source',      type: 'string',  required: false, description: 'Source CIDR, IP, or "ANY"' },
          { name: 'destination', type: 'string',  required: false, description: 'Destination CIDR or resource' },
          { name: 'port',        type: 'string',  required: false, description: 'Port or port range (e.g. 443, 8000-8099)' },
          { name: 'protocol',    type: 'enum',    required: false, enum: ['TCP', 'UDP', 'ICMP', 'ANY'], description: 'Protocol' },
          { name: 'reason',      type: 'string',  required: true,  description: 'Business reason for the rule' },
          { name: 'temporary',   type: 'boolean', required: false, description: 'Temporary rule (expires in 24h)' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'ROTATE_API_KEY',
        displayName: 'Rotate API Key',
        description: 'Rotate an API key and update dependent consumers.',
        parameters: [
          { name: 'keyId',         type: 'string',  required: true,  description: 'API key identifier' },
          { name: 'service',       type: 'string',  required: true,  description: 'Service that owns the key' },
          { name: 'notifyOwner',   type: 'boolean', required: false, description: 'Notify key owner' },
          { name: 'gracePeriodHrs',type: 'number',  required: false, min: 0, max: 72, description: 'Hours old key remains valid (0 = immediate)' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'GENERATE_SECURITY_REPORT',
        displayName: 'Generate Security Report',
        description: 'Produce a security posture or audit report.',
        parameters: [
          { name: 'reportType', type: 'enum',   required: true,  enum: ['POSTURE_SUMMARY', 'VULN_REPORT', 'ACCESS_AUDIT', 'INCIDENT_REPORT', 'PENETRATION_TEST'], description: 'Report type' },
          { name: 'periodFrom', type: 'date',   required: false, description: 'Report period start' },
          { name: 'periodTo',   type: 'date',   required: false, description: 'Report period end' },
          { name: 'format',     type: 'enum',   required: false, enum: ['PDF', 'JSON', 'XLSX'], description: 'Output format' },
          { name: 'deliverTo',  type: 'string', required: false, description: 'Email recipient' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
    ],
  },

  // ── Compliance ────────────────────────────────────────────────────────────────
  {
    name: 'Compliance',
    displayName: 'Compliance',
    icon: 'Scales',
    color: '#ff9800',
    description: 'Regulatory compliance, risk management, and policy governance',
    actions: [
      {
        name: 'RUN_COMPLIANCE_AUDIT',
        displayName: 'Run Compliance Audit',
        description: 'Trigger an automated compliance audit against a regulatory framework.',
        parameters: [
          { name: 'framework',  type: 'enum',   required: true,  enum: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS', 'FCA', 'NIST_CSF'], description: 'Regulatory framework' },
          { name: 'scope',      type: 'string', required: false, description: 'Audit scope (blank = full platform)' },
          { name: 'notifyEmail',type: 'string', required: false, description: 'Email for audit results' },
          { name: 'scheduledAt',type: 'date',   required: false, description: 'Schedule for later (blank = run now)' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'GENERATE_COMPLIANCE_REPORT',
        displayName: 'Generate Compliance Report',
        description: 'Produce a compliance attestation or evidence report for a framework.',
        parameters: [
          { name: 'framework',  type: 'enum',   required: true,  enum: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS', 'FCA', 'NIST_CSF'], description: 'Regulatory framework' },
          { name: 'format',     type: 'enum',   required: false, enum: ['PDF', 'XLSX', 'JSON'], description: 'Output format' },
          { name: 'periodFrom', type: 'date',   required: false, description: 'Audit period start' },
          { name: 'periodTo',   type: 'date',   required: false, description: 'Audit period end' },
          { name: 'deliverTo',  type: 'string', required: false, description: 'Email recipient' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'FLAG_COMPLIANCE_RISK',
        displayName: 'Flag Compliance Risk',
        description: 'Record a compliance risk finding and assign it for remediation.',
        parameters: [
          { name: 'framework',   type: 'enum',   required: true,  enum: ['SOC2', 'ISO27001', 'GDPR', 'HIPAA', 'PCI_DSS', 'FCA', 'NIST_CSF', 'OTHER'], description: 'Applicable framework' },
          { name: 'severity',    type: 'enum',   required: true,  enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Risk severity' },
          { name: 'description', type: 'string', required: true,  description: 'Risk description' },
          { name: 'control',     type: 'string', required: false, description: 'Control reference (e.g. CC6.1, A.8.1)' },
          { name: 'owner',       type: 'string', required: false, description: 'Risk owner name or email' },
          { name: 'dueDate',     type: 'date',   required: false, description: 'Remediation due date' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'APPROVE_POLICY_EXCEPTION',
        displayName: 'Approve Policy Exception',
        description: 'Grant a time-limited exception to a security or compliance policy.',
        parameters: [
          { name: 'policyId',    type: 'object-ref', required: true,  description: 'Policy ID' },
          { name: 'requestorId', type: 'object-ref', required: true,  description: 'Requestor user ID' },
          { name: 'reason',      type: 'string',     required: true,  description: 'Exception justification' },
          { name: 'expiresAt',   type: 'date',       required: true,  description: 'Exception expiry date' },
          { name: 'conditions',  type: 'string',     required: false, description: 'Conditions on the exception' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'SCHEDULE_COMPLIANCE_REVIEW',
        displayName: 'Schedule Compliance Review',
        description: 'Schedule a periodic compliance control review.',
        parameters: [
          { name: 'controlId',    type: 'string', required: true,  description: 'Control or policy ID' },
          { name: 'reviewDate',   type: 'date',   required: true,  description: 'Review date' },
          { name: 'reviewerEmail',type: 'string', required: true,  description: 'Reviewer email' },
          { name: 'frequency',    type: 'enum',   required: false, enum: ['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'], description: 'Recurring frequency' },
          { name: 'notes',        type: 'string', required: false, description: 'Preparation notes' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'SIGN_DPA',
        displayName: 'Sign Data Processing Agreement',
        description: 'Execute a DPA with a vendor or customer as required by GDPR.',
        parameters: [
          { name: 'counterpartyId', type: 'object-ref', required: true,  description: 'Vendor or customer ID' },
          { name: 'dpaTemplate',    type: 'string',     required: false, description: 'DPA template ID' },
          { name: 'signerName',     type: 'string',     required: true,  description: 'Signatory name' },
          { name: 'signerEmail',    type: 'string',     required: true,  description: 'Signatory email' },
          { name: 'effectiveDate',  type: 'date',       required: false, description: 'Agreement effective date' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'CREATE_RISK_REGISTER_ENTRY',
        displayName: 'Create Risk Register Entry',
        description: 'Add a new risk to the enterprise risk register.',
        parameters: [
          { name: 'title',       type: 'string', required: true,  description: 'Risk title' },
          { name: 'category',    type: 'enum',   required: true,  enum: ['OPERATIONAL', 'FINANCIAL', 'STRATEGIC', 'CYBER', 'REGULATORY', 'REPUTATIONAL'], description: 'Risk category' },
          { name: 'likelihood',  type: 'enum',   required: true,  enum: ['RARE', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'ALMOST_CERTAIN'], description: 'Likelihood' },
          { name: 'impact',      type: 'enum',   required: true,  enum: ['NEGLIGIBLE', 'MINOR', 'MODERATE', 'MAJOR', 'CATASTROPHIC'], description: 'Impact level' },
          { name: 'owner',       type: 'string', required: false, description: 'Risk owner name' },
          { name: 'treatment',   type: 'enum',   required: false, enum: ['ACCEPT', 'MITIGATE', 'TRANSFER', 'AVOID'], description: 'Treatment strategy' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'ATTEST_CONTROL',
        displayName: 'Attest Control',
        description: 'Record a formal attestation that a control is operating effectively.',
        parameters: [
          { name: 'controlId',   type: 'string', required: true,  description: 'Control ID (e.g. CC6.1, A.12.4)' },
          { name: 'status',      type: 'enum',   required: true,  enum: ['EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'NOT_TESTED'], description: 'Effectiveness status' },
          { name: 'attestorId',  type: 'object-ref', required: true,  description: 'Attestor user ID' },
          { name: 'evidence',    type: 'string', required: false, description: 'Evidence links or notes' },
          { name: 'attestedAt',  type: 'date',   required: false, description: 'Attestation date (blank = now)' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
    ],
  },

  // ── Data ──────────────────────────────────────────────────────────────────────
  {
    name: 'Data',
    displayName: 'Data',
    icon: 'Database',
    color: '#4a9d9c',
    description: 'Data operations — pipelines, exports, quality, access, archiving',
    actions: [
      {
        name: 'RUN_ETL_JOB',
        displayName: 'Run ETL Job',
        description: 'Execute an extract-transform-load pipeline.',
        parameters: [
          { name: 'jobId',      type: 'string', required: true,  description: 'ETL job name or ID' },
          { name: 'source',     type: 'string', required: false, description: 'Source system override' },
          { name: 'destination',type: 'string', required: false, description: 'Destination override' },
          { name: 'mode',       type: 'enum',   required: false, enum: ['FULL', 'INCREMENTAL', 'DELTA'], description: 'Load mode' },
          { name: 'notifyEmail',type: 'string', required: false, description: 'Email on completion' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'CREATE_DATA_SNAPSHOT',
        displayName: 'Create Data Snapshot',
        description: 'Take a versioned snapshot of a dataset or database.',
        parameters: [
          { name: 'datasetId', type: 'string', required: true,  description: 'Dataset or database identifier' },
          { name: 'label',     type: 'string', required: false, description: 'Snapshot label' },
          { name: 'retainDays',type: 'number', required: false, min: 1, max: 365, description: 'Retention period in days' },
          { name: 'encrypted', type: 'boolean',required: false, description: 'Encrypt the snapshot at rest' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'EXPORT_DATASET',
        displayName: 'Export Dataset',
        description: 'Export a dataset to an external destination or file format.',
        parameters: [
          { name: 'datasetId',   type: 'string', required: true,  description: 'Dataset identifier' },
          { name: 'format',      type: 'enum',   required: true,  enum: ['CSV', 'PARQUET', 'JSON', 'AVRO', 'XLSX'], description: 'Export format' },
          { name: 'destination', type: 'string', required: false, description: 'Destination URI (S3, GCS, SFTP, or email)' },
          { name: 'filter',      type: 'string', required: false, description: 'Row filter (SQL WHERE clause)' },
          { name: 'encrypted',   type: 'boolean',required: false, description: 'Encrypt exported file' },
          { name: 'compress',    type: 'boolean',required: false, description: 'Compress with gzip' },
        ],
        allowedRoles: ['ADMIN', 'EXECUTIVE'],
        toolCallable: true,
      },
      {
        name: 'ANONYMIZE_DATA',
        displayName: 'Anonymize Data',
        description: 'Apply anonymization or pseudonymization to a dataset for GDPR compliance.',
        parameters: [
          { name: 'datasetId',  type: 'string', required: true,  description: 'Dataset identifier' },
          { name: 'method',     type: 'enum',   required: true,  enum: ['PSEUDONYMIZE', 'ANONYMIZE', 'MASK', 'TOKENIZE', 'GENERALIZE'], description: 'Anonymization method' },
          { name: 'fields',     type: 'string', required: true,  description: 'Comma-separated PII field names' },
          { name: 'outputId',   type: 'string', required: false, description: 'Output dataset ID (blank = in-place)' },
          { name: 'auditLog',   type: 'boolean',required: false, description: 'Log the anonymization action for GDPR audit' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'VALIDATE_DATA_QUALITY',
        displayName: 'Validate Data Quality',
        description: 'Run data quality checks on a dataset and produce a quality report.',
        parameters: [
          { name: 'datasetId',   type: 'string',  required: true,  description: 'Dataset identifier' },
          { name: 'rules',       type: 'string',  required: false, description: 'Quality rule set ID (blank = default)' },
          { name: 'threshold',   type: 'number',  required: false, min: 0, max: 100, description: 'Acceptable failure rate % before alerting' },
          { name: 'alertEmail',  type: 'string',  required: false, description: 'Alert email if quality below threshold' },
          { name: 'blockPipeline',type: 'boolean',required: false, description: 'Block downstream pipeline if quality fails' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'CREATE_DATA_ACCESS_REQUEST',
        displayName: 'Create Data Access Request',
        description: 'Raise a formal request for access to a restricted dataset.',
        parameters: [
          { name: 'datasetId',     type: 'string',     required: true,  description: 'Dataset to request access to' },
          { name: 'requestorId',   type: 'object-ref', required: true,  description: 'Requestor user ID' },
          { name: 'accessLevel',   type: 'enum',       required: true,  enum: ['READ', 'WRITE', 'ADMIN'], description: 'Access level requested' },
          { name: 'justification', type: 'string',     required: true,  description: 'Business justification' },
          { name: 'duration',      type: 'string',     required: false, description: 'Access duration (e.g. 30d, permanent)' },
        ],
        allowedRoles: ['ADMIN', 'TEAM'],
        toolCallable: true,
      },
      {
        name: 'ARCHIVE_DATASET',
        displayName: 'Archive Dataset',
        description: 'Move a dataset to cold storage and update metadata.',
        parameters: [
          { name: 'datasetId',     type: 'string',  required: true,  description: 'Dataset identifier' },
          { name: 'storageClass',  type: 'enum',    required: false, enum: ['COLD', 'GLACIER', 'NEARLINE', 'ARCHIVE'], description: 'Storage tier' },
          { name: 'retainUntil',   type: 'date',    required: false, description: 'Minimum retention date' },
          { name: 'deleteOriginal',type: 'boolean', required: false, description: 'Delete original after archiving' },
          { name: 'reason',        type: 'string',  required: true,  description: 'Archive reason for compliance record' },
        ],
        allowedRoles: ['ADMIN'],
        toolCallable: true,
      },
      {
        name: 'CREATE_DATA_PIPELINE',
        displayName: 'Create Data Pipeline',
        description: 'Define and activate a new data pipeline between systems.',
        parameters: [
          { name: 'name',        type: 'string', required: true,  description: 'Pipeline name' },
          { name: 'source',      type: 'string', required: true,  description: 'Source system or endpoint' },
          { name: 'destination', type: 'string', required: true,  description: 'Destination system or endpoint' },
          { name: 'schedule',    type: 'string', required: false, description: 'Cron expression (blank = event-triggered)' },
          { name: 'transform',   type: 'string', required: false, description: 'Transformation logic ID or SQL' },
          { name: 'alertEmail',  type: 'string', required: false, description: 'Failure alert email' },
        ],
        allowedRoles: ['ADMIN'],
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
        // Sync validation rules — delete stale and re-insert from manifest
        if (action.validationRules) {
          await prisma.actionValidationRule.deleteMany({ where: { actionId: existing.id } })
          await prisma.actionValidationRule.createMany({
            data: action.validationRules.map(r => ({
              actionId: existing.id,
              condition: r.condition as any,
              errorMessage: r.errorMessage,
              severity: r.severity,
              order: r.order,
            })),
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
