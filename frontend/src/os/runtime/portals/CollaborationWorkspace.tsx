// Collaboration Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const CollaborationWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.collaboration',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.collaboration',
        title: 'Collaboration Workspace',
        description: 'Chat, voice, meetings, mission rooms, decision threads, shared simulations, and approvals.',
        version: '1.0.0',
        category: 'COLLABORATION',
        icon: 'users-2'
    },
    workspace: {
        adaptive: true,
        personality: 'RELATIONAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'COLLABORATION',
        modes: {
            DEFAULT:     ['comms', 'missions'],
            FOCUS:       ['comms'],
            MEETING:     ['comms', 'approvals'],
            TRAVEL:      ['comms'],
            OFFLINE:     ['comms'],
            INCIDENT:    ['comms', 'approvals'],
            APPROVAL:    ['approvals', 'missions'],
            LEARNING:    ['comms'],
            FORECASTING: ['missions']
        },
        sections: {
            comms: {
                id: 'comms',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.collab.chat',     title: 'Chat',      component: 'ChatWidget',     permissions: ['role.member'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.collab.meetings', title: 'Meetings',  component: 'MeetingsWidget', permissions: ['role.member'], priority: 'HIGH' },
                    { id: 'wid.collab.voice',    title: 'Voice',     component: 'VoiceWidget',    permissions: ['role.member'], priority: 'HIGH' },
                    { id: 'wid.collab.waanda',   title: 'Collaboration WAANDA', component: 'WaandaWidget', permissions: ['role.member'], priority: 'HIGH', requiredCapabilities: ['cap.collab.facilitate'] }
                ]
            },
            missions: {
                id: 'missions',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.collab.rooms',      title: 'Mission Rooms',     component: 'MissionRoomsWidget',   permissions: ['role.member', 'role.executive'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.collab.decisions',  title: 'Decision Threads',  component: 'DecisionThreadWidget', permissions: ['role.member'], priority: 'HIGH' }
                ]
            },
            simulations: {
                id: 'simulations',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.collab.simulations', title: 'Shared Simulations', component: 'SharedSimulationsWidget', permissions: ['role.member', 'role.analyst'], priority: 'NORMAL' }
                ]
            },
            approvals: {
                id: 'approvals',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.collab.approvals',   title: 'Shared Approvals', component: 'SharedApprovalsWidget', permissions: ['role.member', 'role.executive'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.collab.escalations', title: 'Escalations',      component: 'EscalationWidget',      permissions: ['role.executive'], priority: 'NORMAL' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.collab.context', title: 'Collaboration Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.collab.read', 'cap.approvals.manage', 'cap.meetings.schedule'],
        subscriptions: ['event.mission.room.created', 'event.approval.requested', 'event.message.received'],
        memory: ['lastRoomVisited', 'pendingApprovalCount']
    }
};
