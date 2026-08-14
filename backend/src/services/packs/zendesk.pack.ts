import type { ActionPackManifest } from '../actionPack.service'

export const ZENDESK_PACK: ActionPackManifest = {
  pack:        'kangqore/zendesk-v1',
  version:     '1.0.0',
  description: 'Zendesk Support — tickets, users, SLA, macros, satisfaction',
  author:      'Kangqore',
  category: {
    name:        'Zendesk',
    displayName: 'Zendesk',
    icon:        'Headset',
    color:       '#03363d',
    description: 'Full Zendesk lifecycle. Requires ZENDESK_SUBDOMAIN + ZENDESK_API_TOKEN + ZENDESK_EMAIL.',
  },
  actions: [
    {
      name: 'CREATE_ZD_TICKET', displayName: 'Create Zendesk Ticket',
      description: 'Create a new Zendesk support ticket.',
      parameters: [
        { name: 'subject',     type: 'string', required: true,  description: 'Ticket subject' },
        { name: 'description', type: 'string', required: true,  description: 'Ticket body' },
        { name: 'priority',    type: 'enum',   required: false, enum: ['low', 'normal', 'high', 'urgent'], description: 'Priority' },
        { name: 'type',        type: 'enum',   required: false, enum: ['problem', 'incident', 'question', 'task'], description: 'Ticket type' },
        { name: 'requesterEmail',type: 'string',required: false, description: 'Requester email' },
        { name: 'tags',        type: 'string', required: false, description: 'Comma-separated tags' },
        { name: 'assigneeId',  type: 'number', required: false, description: 'Assignee user ID' },
        { name: 'groupId',     type: 'number', required: false, description: 'Group ID to assign to' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'UPDATE_ZD_TICKET', displayName: 'Update Zendesk Ticket',
      description: 'Update fields on an existing Zendesk ticket.',
      parameters: [
        { name: 'ticketId',   type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'subject',    type: 'string', required: false, description: 'Updated subject' },
        { name: 'status',     type: 'enum',   required: false, enum: ['open', 'pending', 'hold', 'solved', 'closed'], description: 'New status' },
        { name: 'priority',   type: 'enum',   required: false, enum: ['low', 'normal', 'high', 'urgent'], description: 'New priority' },
        { name: 'assigneeId', type: 'number', required: false, description: 'New assignee user ID' },
        { name: 'groupId',    type: 'number', required: false, description: 'New group ID' },
        { name: 'tags',       type: 'string', required: false, description: 'Tags to add (comma-separated)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'SOLVE_ZD_TICKET', displayName: 'Solve Zendesk Ticket',
      description: 'Mark a Zendesk ticket as solved with an optional public reply.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'comment',  type: 'string', required: false, description: 'Public resolution comment to the requester' },
        { name: 'internal', type: 'boolean',required: false, description: 'Make the comment internal (default: public)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CLOSE_ZD_TICKET', displayName: 'Close Zendesk Ticket',
      description: 'Permanently close a solved Zendesk ticket.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true, description: 'Ticket ID' },
        { name: 'reason',   type: 'string', required: false, description: 'Close reason note' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'REOPEN_ZD_TICKET', displayName: 'Reopen Zendesk Ticket',
      description: 'Reopen a solved or closed Zendesk ticket.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'comment',  type: 'string', required: false, description: 'Reason for reopening' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ESCALATE_ZD_TICKET', displayName: 'Escalate Zendesk Ticket',
      description: 'Escalate a Zendesk ticket to a higher-priority group.',
      parameters: [
        { name: 'ticketId',    type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'groupId',     type: 'number', required: true,  description: 'Escalation group ID' },
        { name: 'reason',      type: 'string', required: true,  description: 'Escalation reason' },
        { name: 'newPriority', type: 'enum',   required: false, enum: ['high', 'urgent'], description: 'New priority level' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_ZD_COMMENT', displayName: 'Add Zendesk Comment',
      description: 'Add a public or internal comment to a Zendesk ticket.',
      parameters: [
        { name: 'ticketId', type: 'number',  required: true,  description: 'Ticket ID' },
        { name: 'body',     type: 'string',  required: true,  description: 'Comment text' },
        { name: 'internal', type: 'boolean', required: false, description: 'Internal note (default: public reply)' },
        { name: 'authorId', type: 'number',  required: false, description: 'Author agent ID (default: API user)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ASSIGN_ZD_TICKET', displayName: 'Assign Zendesk Ticket',
      description: 'Assign a Zendesk ticket to an agent or group.',
      parameters: [
        { name: 'ticketId',   type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'assigneeId', type: 'number', required: false, description: 'Agent user ID' },
        { name: 'groupId',    type: 'number', required: false, description: 'Group ID' },
        { name: 'comment',    type: 'string', required: false, description: 'Internal note on assignment' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_ZD_TAGS', displayName: 'Add Zendesk Tags',
      description: 'Add tags to a Zendesk ticket.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'tags',     type: 'string', required: true,  description: 'Comma-separated tags to add' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'MERGE_ZD_TICKETS', displayName: 'Merge Zendesk Tickets',
      description: 'Merge one Zendesk ticket into another.',
      parameters: [
        { name: 'sourceTicketId', type: 'number', required: true,  description: 'Ticket to merge from (will be closed)' },
        { name: 'targetTicketId', type: 'number', required: true,  description: 'Ticket to merge into' },
        { name: 'reason',         type: 'string', required: false, description: 'Merge reason' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'CREATE_ZD_USER', displayName: 'Create Zendesk User',
      description: 'Create a new agent or end-user in Zendesk.',
      parameters: [
        { name: 'name',   type: 'string',  required: true,  description: 'Full name' },
        { name: 'email',  type: 'string',  required: true,  description: 'Email address' },
        { name: 'role',   type: 'enum',    required: true,  enum: ['end-user', 'agent', 'admin'], description: 'User role' },
        { name: 'phone',  type: 'string',  required: false, description: 'Phone number' },
        { name: 'groupId',type: 'number',  required: false, description: 'Group to assign agent to' },
        { name: 'verified',type: 'boolean',required: false, description: 'Mark email as verified' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'SUSPEND_ZD_USER', displayName: 'Suspend Zendesk User',
      description: 'Suspend a Zendesk end-user to prevent new ticket submissions.',
      parameters: [
        { name: 'userId', type: 'number', required: true,  description: 'Zendesk user ID' },
        { name: 'reason', type: 'string', required: true,  description: 'Suspension reason' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'APPLY_ZD_MACRO', displayName: 'Apply Zendesk Macro',
      description: 'Apply a Zendesk macro to a ticket for bulk updates.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'macroId',  type: 'number', required: true,  description: 'Macro ID to apply' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'PAUSE_ZD_SLA', displayName: 'Pause Zendesk SLA',
      description: 'Pause SLA timer on a Zendesk ticket.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'reason',   type: 'string', required: true,  description: 'Reason for pausing SLA' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_ZD_SATISFACTION_RATING', displayName: 'Request Satisfaction Rating',
      description: 'Send a CSAT survey request to a Zendesk ticket requester.',
      parameters: [
        { name: 'ticketId', type: 'number', required: true,  description: 'Ticket ID' },
        { name: 'comment',  type: 'string', required: false, description: 'Personal message with the survey' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
  ],
}
