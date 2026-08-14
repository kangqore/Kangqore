import type { ActionPackManifest } from '../actionPack.service'

export const JIRA_PACK: ActionPackManifest = {
  pack:        'kangqore/jira-v1',
  version:     '1.0.0',
  description: 'Jira Software integration — issues, sprints, epics, projects, releases',
  author:      'Kangqore',
  category: {
    name:        'Jira',
    displayName: 'Jira',
    icon:        'Kanban',
    color:       '#0052cc',
    description: 'Full Jira lifecycle: issues, sprints, epics, versions, projects. Requires JIRA_BASE_URL + JIRA_API_TOKEN.',
  },
  actions: [
    {
      name: 'CREATE_JIRA_ISSUE', displayName: 'Create Jira Issue',
      description: 'Create a new Jira issue (bug, story, task, epic, sub-task).',
      parameters: [
        { name: 'project',     type: 'string', required: true,  description: 'Jira project key (e.g. KAN)' },
        { name: 'title',       type: 'string', required: true,  description: 'Issue summary' },
        { name: 'type',        type: 'enum',   required: true,  enum: ['Bug', 'Story', 'Task', 'Epic', 'Sub-task'], description: 'Issue type' },
        { name: 'description', type: 'string', required: false, description: 'Issue description (Markdown)' },
        { name: 'priority',    type: 'enum',   required: false, enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest'], description: 'Priority' },
        { name: 'assignee',    type: 'string', required: false, description: 'Assignee account ID or email' },
        { name: 'labels',      type: 'string', required: false, description: 'Comma-separated labels' },
        { name: 'sprint',      type: 'string', required: false, description: 'Sprint name to add to' },
        { name: 'storyPoints', type: 'number', required: false, min: 0, max: 100, description: 'Story points estimate' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'UPDATE_JIRA_ISSUE', displayName: 'Update Jira Issue',
      description: 'Update fields on an existing Jira issue.',
      parameters: [
        { name: 'issueKey',    type: 'string', required: true,  description: 'Jira issue key (e.g. KAN-42)' },
        { name: 'title',       type: 'string', required: false, description: 'New summary' },
        { name: 'description', type: 'string', required: false, description: 'New description' },
        { name: 'priority',    type: 'enum',   required: false, enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest'], description: 'New priority' },
        { name: 'assignee',    type: 'string', required: false, description: 'New assignee account ID or email' },
        { name: 'storyPoints', type: 'number', required: false, min: 0, description: 'Updated story points' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'TRANSITION_JIRA_ISSUE', displayName: 'Transition Jira Issue',
      description: 'Move a Jira issue to a new workflow status.',
      parameters: [
        { name: 'issueKey',   type: 'string', required: true,  description: 'Jira issue key' },
        { name: 'transition', type: 'enum',   required: true,  enum: ['To Do', 'In Progress', 'In Review', 'Done', 'Blocked', 'Cancelled'], description: 'Target status' },
        { name: 'comment',    type: 'string', required: false, description: 'Optional transition comment' },
        { name: 'resolution', type: 'enum',   required: false, enum: ['Done', 'Wont Do', 'Duplicate', 'Cannot Reproduce'], description: 'Resolution (for Done)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_JIRA_COMMENT', displayName: 'Add Jira Comment',
      description: 'Post a comment on a Jira issue.',
      parameters: [
        { name: 'issueKey', type: 'string',  required: true,  description: 'Jira issue key' },
        { name: 'body',     type: 'string',  required: true,  description: 'Comment body (Markdown)' },
        { name: 'internal', type: 'boolean', required: false, description: 'Mark as internal (visible to team only)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ASSIGN_JIRA_ISSUE', displayName: 'Assign Jira Issue',
      description: 'Assign a Jira issue to a team member.',
      parameters: [
        { name: 'issueKey', type: 'string', required: true,  description: 'Jira issue key' },
        { name: 'assignee', type: 'string', required: true,  description: 'Assignee account ID, email, or "unassigned"' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CLOSE_JIRA_ISSUE', displayName: 'Close Jira Issue',
      description: 'Close a Jira issue with a resolution.',
      parameters: [
        { name: 'issueKey',   type: 'string', required: true,  description: 'Jira issue key' },
        { name: 'resolution', type: 'enum',   required: true,  enum: ['Done', 'Wont Do', 'Duplicate', 'Cannot Reproduce'], description: 'Resolution' },
        { name: 'comment',    type: 'string', required: false, description: 'Closing comment' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_JIRA_LABEL', displayName: 'Add Jira Label',
      description: 'Add labels to a Jira issue.',
      parameters: [
        { name: 'issueKey', type: 'string', required: true,  description: 'Jira issue key' },
        { name: 'labels',   type: 'string', required: true,  description: 'Comma-separated label names' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_JIRA_SPRINT', displayName: 'Create Jira Sprint',
      description: 'Create a new sprint in a Jira board.',
      parameters: [
        { name: 'boardId',   type: 'string', required: true,  description: 'Jira board ID' },
        { name: 'name',      type: 'string', required: true,  description: 'Sprint name (e.g. Sprint 42)' },
        { name: 'startDate', type: 'date',   required: false, description: 'Sprint start date' },
        { name: 'endDate',   type: 'date',   required: false, description: 'Sprint end date' },
        { name: 'goal',      type: 'string', required: false, description: 'Sprint goal' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'START_JIRA_SPRINT', displayName: 'Start Jira Sprint',
      description: 'Activate a Jira sprint to begin the sprint cycle.',
      parameters: [
        { name: 'sprintId',  type: 'string', required: true,  description: 'Sprint ID' },
        { name: 'startDate', type: 'date',   required: false, description: 'Start date (default: today)' },
        { name: 'endDate',   type: 'date',   required: false, description: 'End date' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'COMPLETE_JIRA_SPRINT', displayName: 'Complete Jira Sprint',
      description: 'Close a Jira sprint and move incomplete issues.',
      parameters: [
        { name: 'sprintId',    type: 'string', required: true,  description: 'Sprint ID' },
        { name: 'moveToSprint',type: 'string', required: false, description: 'Sprint ID to move incomplete issues to (blank = backlog)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_TO_SPRINT', displayName: 'Add Issues to Sprint',
      description: 'Move one or more issues into a Jira sprint.',
      parameters: [
        { name: 'sprintId',  type: 'string', required: true,  description: 'Target sprint ID' },
        { name: 'issueKeys', type: 'string', required: true,  description: 'Comma-separated Jira issue keys' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_JIRA_EPIC', displayName: 'Create Jira Epic',
      description: 'Create a new epic for grouping related stories.',
      parameters: [
        { name: 'project',  type: 'string', required: true,  description: 'Project key' },
        { name: 'title',    type: 'string', required: true,  description: 'Epic name' },
        { name: 'summary',  type: 'string', required: false, description: 'Epic description' },
        { name: 'dueDate',  type: 'date',   required: false, description: 'Target completion date' },
        { name: 'color',    type: 'enum',   required: false, enum: ['blue', 'green', 'red', 'yellow', 'purple'], description: 'Epic color' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'LINK_JIRA_ISSUES', displayName: 'Link Jira Issues',
      description: 'Create a link between two Jira issues.',
      parameters: [
        { name: 'inwardIssue',  type: 'string', required: true,  description: 'Source issue key' },
        { name: 'outwardIssue', type: 'string', required: true,  description: 'Target issue key' },
        { name: 'linkType',     type: 'enum',   required: true,  enum: ['blocks', 'clones', 'duplicates', 'is blocked by', 'relates to'], description: 'Link relationship' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'LOG_JIRA_TIME', displayName: 'Log Time on Jira Issue',
      description: 'Log a time entry against a Jira issue.',
      parameters: [
        { name: 'issueKey',   type: 'string', required: true,  description: 'Jira issue key' },
        { name: 'timeSpent',  type: 'string', required: true,  description: 'Time spent (Jira format, e.g. 2h 30m)' },
        { name: 'comment',    type: 'string', required: false, description: 'Work log comment' },
        { name: 'startedAt',  type: 'date',   required: false, description: 'When work started (default: now)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_JIRA_VERSION', displayName: 'Create Jira Version',
      description: 'Create a fix version or release version in a Jira project.',
      parameters: [
        { name: 'project',      type: 'string',  required: true,  description: 'Project key' },
        { name: 'name',         type: 'string',  required: true,  description: 'Version name (e.g. v2.1.0)' },
        { name: 'description',  type: 'string',  required: false, description: 'Version description' },
        { name: 'releaseDate',  type: 'date',    required: false, description: 'Target release date' },
        { name: 'released',     type: 'boolean', required: false, description: 'Mark as already released' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_JIRA_PROJECT', displayName: 'Create Jira Project',
      description: 'Create a new Jira project.',
      parameters: [
        { name: 'name',         type: 'string', required: true,  description: 'Project name' },
        { name: 'key',          type: 'string', required: true,  description: 'Project key (uppercase, 2-10 chars)' },
        { name: 'type',         type: 'enum',   required: true,  enum: ['scrum', 'kanban', 'business'], description: 'Project type' },
        { name: 'description',  type: 'string', required: false, description: 'Project description' },
        { name: 'lead',         type: 'string', required: false, description: 'Project lead account ID or email' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
  ],
}
