import type { ActionPackManifest } from '../ActionPack'

export const SERVICENOW_PACK: ActionPackManifest = {
  pack:        'kangqore/servicenow-v1',
  version:     '1.0.0',
  description: 'ServiceNow ITSM — incidents, changes, problems, CMDB, service catalog, knowledge',
  author:      'Kangqore',
  category: {
    name:        'ServiceNow',
    displayName: 'ServiceNow',
    icon:        'Lightning',
    color:       '#62d84e',
    description: 'ServiceNow ITSM lifecycle. Requires SERVICENOW_INSTANCE + SERVICENOW_USER + SERVICENOW_PASSWORD.',
  },
  actions: [
    {
      name: 'CREATE_SN_INCIDENT', displayName: 'Create ServiceNow Incident',
      description: 'Create a new incident in ServiceNow.',
      parameters: [
        { name: 'shortDescription', type: 'string', required: true,  description: 'Incident short description' },
        { name: 'description',      type: 'string', required: false, description: 'Detailed description' },
        { name: 'urgency',          type: 'enum',   required: true,  enum: ['1', '2', '3'], description: 'Urgency (1=High, 2=Medium, 3=Low)' },
        { name: 'impact',           type: 'enum',   required: true,  enum: ['1', '2', '3'], description: 'Impact (1=High, 2=Medium, 3=Low)' },
        { name: 'category',         type: 'string', required: false, description: 'Incident category' },
        { name: 'assignmentGroup',  type: 'string', required: false, description: 'Assignment group name' },
        { name: 'caller',           type: 'string', required: false, description: 'Caller user ID or email' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'UPDATE_SN_INCIDENT', displayName: 'Update ServiceNow Incident',
      description: 'Update fields on an existing ServiceNow incident.',
      parameters: [
        { name: 'incidentId',    type: 'string', required: true,  description: 'Incident sys_id or number' },
        { name: 'field',         type: 'string', required: true,  description: 'Field to update' },
        { name: 'value',         type: 'string', required: true,  description: 'New value' },
        { name: 'workNotes',     type: 'string', required: false, description: 'Work notes to add' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'RESOLVE_SN_INCIDENT', displayName: 'Resolve ServiceNow Incident',
      description: 'Mark a ServiceNow incident as resolved with resolution notes.',
      parameters: [
        { name: 'incidentId',   type: 'string', required: true,  description: 'Incident sys_id or number' },
        { name: 'resolutionCode',type: 'enum',  required: true,  enum: ['Solved (Work Around)', 'Solved (Permanently)', 'Not Solved (Not Reproducible)', 'Closed/Resolved by Caller', 'Solved Remotely (Work Around)', 'Solved Remotely (Permanently)'], description: 'Resolution code' },
        { name: 'resolutionNotes',type: 'string',required: true, description: 'Resolution notes' },
        { name: 'knowledgeBase', type: 'boolean',required: false, description: 'Create a KB article from this resolution' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ASSIGN_SN_INCIDENT', displayName: 'Assign ServiceNow Incident',
      description: 'Assign a ServiceNow incident to an agent or group.',
      parameters: [
        { name: 'incidentId',      type: 'string', required: true,  description: 'Incident sys_id or number' },
        { name: 'assignee',        type: 'string', required: false, description: 'Assignee user ID or name' },
        { name: 'assignmentGroup', type: 'string', required: false, description: 'Assignment group' },
        { name: 'workNotes',       type: 'string', required: false, description: 'Assignment notes' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_SN_CHANGE', displayName: 'Create ServiceNow Change Request',
      description: 'Raise a change request in ServiceNow.',
      parameters: [
        { name: 'shortDescription', type: 'string', required: true,  description: 'Change short description' },
        { name: 'description',      type: 'string', required: false, description: 'Detailed description' },
        { name: 'type',             type: 'enum',   required: true,  enum: ['normal', 'emergency', 'standard'], description: 'Change type' },
        { name: 'risk',             type: 'enum',   required: true,  enum: ['1', '2', '3', '4'], description: 'Risk level (1=Critical, 2=High, 3=Moderate, 4=Low)' },
        { name: 'category',         type: 'string', required: false, description: 'Change category' },
        { name: 'assignmentGroup',  type: 'string', required: false, description: 'Assignment group' },
        { name: 'plannedStart',     type: 'date',   required: false, description: 'Planned start date' },
        { name: 'plannedEnd',       type: 'date',   required: false, description: 'Planned end date' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'APPROVE_SN_CHANGE', displayName: 'Approve ServiceNow Change',
      description: 'Approve a pending change request in ServiceNow.',
      parameters: [
        { name: 'changeId', type: 'string', required: true,  description: 'Change request sys_id or number' },
        { name: 'comments', type: 'string', required: false, description: 'Approval comments' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'IMPLEMENT_SN_CHANGE', displayName: 'Implement ServiceNow Change',
      description: 'Move a ServiceNow change to Implementation state.',
      parameters: [
        { name: 'changeId',  type: 'string', required: true,  description: 'Change sys_id or number' },
        { name: 'workNotes', type: 'string', required: false, description: 'Implementation work notes' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CLOSE_SN_CHANGE', displayName: 'Close ServiceNow Change',
      description: 'Close an implemented ServiceNow change request.',
      parameters: [
        { name: 'changeId',       type: 'string', required: true,  description: 'Change sys_id or number' },
        { name: 'closeCode',      type: 'enum',   required: true,  enum: ['successful', 'successful_issues', 'unsuccessful'], description: 'Close code' },
        { name: 'closeNotes',     type: 'string', required: true,  description: 'Closure notes' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'CREATE_SN_PROBLEM', displayName: 'Create ServiceNow Problem',
      description: 'Create a problem record for root cause analysis.',
      parameters: [
        { name: 'shortDescription', type: 'string', required: true,  description: 'Problem short description' },
        { name: 'description',      type: 'string', required: false, description: 'Problem details' },
        { name: 'category',         type: 'string', required: false, description: 'Category' },
        { name: 'assignmentGroup',  type: 'string', required: false, description: 'Assignment group' },
        { name: 'relatedIncidents', type: 'string', required: false, description: 'Related incident numbers (comma-separated)' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'UPDATE_SN_CI', displayName: 'Update ServiceNow CMDB CI',
      description: 'Update a Configuration Item in the ServiceNow CMDB.',
      parameters: [
        { name: 'ciId',    type: 'string', required: true,  description: 'CI sys_id or name' },
        { name: 'field',   type: 'string', required: true,  description: 'CI field to update' },
        { name: 'value',   type: 'string', required: true,  description: 'New value' },
        { name: 'reason',  type: 'string', required: true,  description: 'Change reason for CMDB audit' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'CREATE_SN_SERVICE_REQUEST', displayName: 'Create SN Service Request',
      description: 'Submit a service catalog request in ServiceNow.',
      parameters: [
        { name: 'catalogItemId', type: 'string', required: true,  description: 'Catalog item sys_id' },
        { name: 'requestedFor',  type: 'string', required: false, description: 'User ID the request is for' },
        { name: 'quantity',      type: 'number', required: false, min: 1, description: 'Quantity' },
        { name: 'variables',     type: 'string', required: false, description: 'Catalog item variables as JSON' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'APPROVE_SN_SERVICE_REQUEST', displayName: 'Approve SN Service Request',
      description: 'Approve a pending ServiceNow service request.',
      parameters: [
        { name: 'requestId', type: 'string', required: true,  description: 'Request sys_id or number' },
        { name: 'comments',  type: 'string', required: false, description: 'Approval comments' },
      ],
      allowedRoles: ['ADMIN'], toolCallable: true,
    },
    {
      name: 'CREATE_SN_KB_ARTICLE', displayName: 'Create SN Knowledge Article',
      description: 'Create a knowledge base article in ServiceNow.',
      parameters: [
        { name: 'shortDescription', type: 'string', required: true,  description: 'Article title' },
        { name: 'text',             type: 'string', required: true,  description: 'Article body' },
        { name: 'category',         type: 'string', required: false, description: 'KB category' },
        { name: 'knowledgeBase',    type: 'string', required: false, description: 'Knowledge base name' },
        { name: 'tags',             type: 'string', required: false, description: 'Comma-separated tags' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
    {
      name: 'ADD_SN_WORK_NOTES', displayName: 'Add SN Work Notes',
      description: 'Add internal work notes to any ServiceNow record.',
      parameters: [
        { name: 'tableName', type: 'string', required: true,  description: 'Table name (e.g. incident, change_request)' },
        { name: 'sysId',     type: 'string', required: true,  description: 'Record sys_id' },
        { name: 'workNotes', type: 'string', required: true,  description: 'Work notes to add' },
      ],
      allowedRoles: ['ADMIN', 'TEAM'], toolCallable: true,
    },
  ],
}
