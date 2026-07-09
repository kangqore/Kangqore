// Executive Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const ExecutiveWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.executive',
    version: '2.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.executive',
        title: 'Executive Workspace',
        description: 'Flagship portal into the Executive Cognition Framework.',
        version: '2.0.0',
        category: 'EXECUTIVE',
        icon: 'briefcase'
    },
    workspace: {
        adaptive: true,
        personality: 'STRATEGIC',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'EXECUTIVE',
        modes: {
            DEFAULT:     ['strategy', 'intelligence', 'governance'],
            FOCUS:       ['strategy'],
            MEETING:     ['strategy', 'governance', 'stakeholders'],
            TRAVEL:      ['strategy', 'intelligence'],
            OFFLINE:     ['strategy'],
            INCIDENT:    ['intelligence', 'governance'],
            APPROVAL:    ['governance'],
            LEARNING:    ['intelligence'],
            FORECASTING: ['intelligence', 'strategy'],
        },
        sections: {
            strategy: {
                id: 'strategy',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.health', title: 'Enterprise Health', component: 'AnalyticsWidget', permissions: ['role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.executive.missions', title: 'Active Strategy', component: 'MissionWidget', permissions: ['role.executive'], priority: 'HIGH' },
                    { id: 'wid.executive.decisions', title: 'Decision Queue', component: 'DecisionWidget', permissions: ['role.executive'], priority: 'HIGH' }
                ]
            },
            intelligence: {
                id: 'intelligence',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.risks', title: 'Critical Risks', component: 'RiskWidget', permissions: ['role.executive'], priority: 'HIGH' },
                    { id: 'wid.executive.evidence', title: 'Evidence Feed', component: 'EvidenceWidget', permissions: ['role.executive'], priority: 'NORMAL' },
                    { id: 'wid.executive.timeline', title: 'Activity Timeline', component: 'TimelineWidget', permissions: ['role.executive'], priority: 'NORMAL' }
                ]
            },
            governance: {
                id: 'governance',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.waanda', title: 'Executive WAANDA', component: 'WaandaWidget', permissions: ['role.executive'], priority: 'CRITICAL', requiredCapabilities: ['cap.ai.plan'] }
                ]
            },
            stakeholders: {
                id: 'stakeholders',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.people', title: 'Key Stakeholders', component: 'PeopleWidget', permissions: ['role.executive'], priority: 'NORMAL' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.executive.context', title: 'Current Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: [],
        subscriptions: [],
        memory: []
    }
};

