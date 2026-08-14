import type { ActionPackManifest } from '../ActionPack'

export const LINEAR_PACK: ActionPackManifest = {
  pack:        'kangqore/linear-v1',
  version:     '1.0.0',
  description: 'Linear — issues, cycles, projects, labels, comments, estimates',
  author:      'Kangqore',
  category: {
    name:        'Linear',
    displayName: 'Linear',
    icon:        'ArrowsClockwise',
    color:       '#5e6ad2',
    description: 'Linear issue tracker. Requires LINEAR_API_KEY.',
  },
  actions: [
    {
      name: 'CREATE_LINEAR_ISSUE', displayName: 'Create Linear Issue',
      description: 'Create a new issue in a Linear team.',
      parameters: [
        { name: 'teamId',      type: 'string', required: true,  description: 'Linear team ID or key' },
        { name: 'title',       type: 'string', required: true,  description: 'Issue title' },
        { name: 'description', type: 'string', required: false, description: 'Issue description (Markdown)' },
        { name: 'priority',    type: 'enum',   required: false, enum: ['0', '1', '2', '3', '4'], description: 'Priority (0=no priority, 1=urgent, 2=high, 3=medium, 4=low)' },
        { name: 'stateId',     type: 'string', required: false, description: 'Workflow state ID' },
        { name: 'assigneeId',  type: 'string', required: false, description: 'Assignee user ID' },
        { name: 'labelIds',    type: 'string', required: false, description: 'Comma-separated label IDs' },
        { name: 'estimate',    type: 'number', required: false, min: 0, description: 'Story point estimate' },
        { name: 'cycleId',     type: 'string', required: false, description: 'Cycle ID to add to' },
        { name: 'projectId',   type: 'string', required: false, description: 'Project ID to link' },
        { name: 'dueDate',     type: 'date',   required: false, description: 'Issue due date' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'UPDATE_LINEAR_ISSUE', displayName: 'Update Linear Issue',
      description: 'Update an existing Linear issue.',
      parameters: [
        { name: 'issueId',     type: 'string', required: true,  description: 'Linear issue ID' },
        { name: 'title',       type: 'string', required: false, description: 'New title' },
        { name: 'description', type: 'string', required: false, description: 'New description' },
        { name: 'priority',    type: 'enum',   required: false, enum: ['0', '1', '2', '3', '4'], description: 'New priority' },
        { name: 'stateId',     type: 'string', required: false, description: 'New workflow state ID' },
        { name: 'assigneeId',  type: 'string', required: false, description: 'New assignee' },
        { name: 'estimate',    type: 'number', required: false, min: 0, description: 'New estimate' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CLOSE_LINEAR_ISSUE', displayName: 'Close Linear Issue',
      description: 'Mark a Linear issue as completed.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'comment', type: 'string', required: false, description: 'Closing comment' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CANCEL_LINEAR_ISSUE', displayName: 'Cancel Linear Issue',
      description: 'Mark a Linear issue as cancelled.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'reason',  type: 'string', required: false, description: 'Cancellation reason' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ASSIGN_LINEAR_ISSUE', displayName: 'Assign Linear Issue',
      description: 'Assign a Linear issue to a team member.',
      parameters: [
        { name: 'issueId',    type: 'string', required: true,  description: 'Issue ID' },
        { name: 'assigneeId', type: 'string', required: true,  description: 'Assignee user ID (null to unassign)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'SET_LINEAR_PRIORITY', displayName: 'Set Linear Priority',
      description: 'Change the priority of a Linear issue.',
      parameters: [
        { name: 'issueId',  type: 'string', required: true,  description: 'Issue ID' },
        { name: 'priority', type: 'enum',   required: true,  enum: ['0', '1', '2', '3', '4'], description: 'Priority (0=none, 1=urgent, 2=high, 3=medium, 4=low)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_LINEAR_LABEL', displayName: 'Add Linear Label',
      description: 'Add a label to a Linear issue.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'labelId', type: 'string', required: true,  description: 'Label ID to add' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_LINEAR_CYCLE', displayName: 'Create Linear Cycle',
      description: 'Create a new cycle (sprint) for a Linear team.',
      parameters: [
        { name: 'teamId',    type: 'string', required: true,  description: 'Team ID' },
        { name: 'startDate', type: 'date',   required: true,  description: 'Cycle start date' },
        { name: 'endDate',   type: 'date',   required: true,  description: 'Cycle end date' },
        { name: 'name',      type: 'string', required: false, description: 'Cycle name' },
        { name: 'description',type: 'string',required: false, description: 'Cycle description / goal' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_TO_LINEAR_CYCLE', displayName: 'Add Issue to Linear Cycle',
      description: 'Add a Linear issue to a cycle.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'cycleId', type: 'string', required: true,  description: 'Cycle ID' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_LINEAR_PROJECT', displayName: 'Create Linear Project',
      description: 'Create a new project in Linear.',
      parameters: [
        { name: 'name',        type: 'string', required: true,  description: 'Project name' },
        { name: 'description', type: 'string', required: false, description: 'Project description' },
        { name: 'teamIds',     type: 'string', required: true,  description: 'Comma-separated team IDs' },
        { name: 'targetDate',  type: 'date',   required: false, description: 'Target completion date' },
        { name: 'color',       type: 'string', required: false, description: 'Project color (hex)' },
        { name: 'leadId',      type: 'string', required: false, description: 'Project lead user ID' },
        { name: 'status',      type: 'enum',   required: false, enum: ['backlog', 'planned', 'inProgress', 'paused', 'completed', 'cancelled'], description: 'Project status' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_LINEAR_COMMENT', displayName: 'Add Linear Comment',
      description: 'Post a comment on a Linear issue.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'body',    type: 'string', required: true,  description: 'Comment body (Markdown)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'SET_LINEAR_ESTIMATE', displayName: 'Set Linear Estimate',
      description: 'Set or update the story point estimate on a Linear issue.',
      parameters: [
        { name: 'issueId',  type: 'string', required: true,  description: 'Issue ID' },
        { name: 'estimate', type: 'number', required: true,  min: 0, description: 'New estimate (points)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'MOVE_LINEAR_ISSUE_STATE', displayName: 'Move Linear Issue State',
      description: 'Move a Linear issue to a specific workflow state.',
      parameters: [
        { name: 'issueId', type: 'string', required: true,  description: 'Issue ID' },
        { name: 'stateId', type: 'string', required: true,  description: 'Target workflow state ID' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_LINEAR_RELATION', displayName: 'Add Linear Issue Relation',
      description: 'Create a relationship between two Linear issues.',
      parameters: [
        { name: 'issueId',        type: 'string', required: true,  description: 'Source issue ID' },
        { name: 'relatedIssueId', type: 'string', required: true,  description: 'Related issue ID' },
        { name: 'type',           type: 'enum',   required: true,  enum: ['blocks', 'duplicate', 'related'], description: 'Relation type' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
  ],
}
