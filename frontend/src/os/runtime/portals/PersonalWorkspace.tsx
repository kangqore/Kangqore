// Personal Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const PersonalWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.personal',
    version: '2.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.personal',
        title: 'Personal Workspace',
        description: 'My Enterprise Universe',
        version: '2.0.0',
        category: 'PERSONAL',
        icon: 'planet'
    },
    workspace: {
        adaptive: true,
        personality: 'PROACTIVE',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'PERSONAL',
        modes: {
            DEFAULT:     ['focus', 'intelligence', 'communication'],
            FOCUS:       ['focus', 'memory'],
            MEETING:     ['planning', 'communication', 'knowledge'],
            TRAVEL:      ['focus', 'communication'],
            OFFLINE:     ['memory', 'focus'],
            INCIDENT:    ['communication', 'intelligence'],
            APPROVAL:    ['focus'],
            LEARNING:    ['intelligence', 'knowledge'],
            FORECASTING: ['intelligence'],
        },
        sections: {
            focus: {
                id: 'focus',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.myday', title: 'My Day', component: 'MyDayWidget', permissions: [] },
                    { id: 'wid.personal.workqueue', title: 'Work Queue', component: 'WorkQueueWidget', permissions: [] }
                ]
            },
            intelligence: {
                id: 'intelligence',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intelligence.insights', title: 'Insights', component: 'InsightsWidget', permissions: [] },
                    { id: 'wid.intelligence.recommendation', title: 'Recommendations', component: 'RecommendationWidget', permissions: [] }
                ]
            },
            knowledge: {
                id: 'knowledge',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.knowledge.base', title: 'Knowledge Base', component: 'KnowledgeWidget', permissions: [] }
                ]
            },
            waanda: {
                id: 'waanda',
                priority: 95, // High priority
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.waanda.assistant', title: 'WAANDA', component: 'WaandaWidget', permissions: [] }
                ]
            },
            communication: {
                id: 'communication',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.communication.notifications', title: 'Notifications', component: 'NotificationWidget', permissions: [] }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.navigation.context', title: 'Context', component: 'ContextWidget', permissions: [] }
                ]
            },
            memory: {
                id: 'memory',
                priority: 60,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.memory.recent', title: 'Recent Activity', component: 'MemoryWidget', permissions: [] }
                ]
            }
        },
        policies: [],
        capabilities: [
            'epf.tasks',
            'edf.search',
            'ecf.waanda'
        ],
        subscriptions: [],
        memory: []
    }
};
