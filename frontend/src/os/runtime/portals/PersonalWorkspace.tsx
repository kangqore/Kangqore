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
        description: 'My Enterprise Universe — the homepage after login for the individual employee.',
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
            DEFAULT:     ['myday', 'notifications', 'ai'],
            FOCUS:       ['myday', 'ai'],
            MEETING:     ['calendar', 'myday'],
            TRAVEL:      ['myday', 'notifications'],
            OFFLINE:     ['myday', 'knowledge'],
            INCIDENT:    ['myday', 'notifications', 'approvals'],
            APPROVAL:    ['approvals', 'myday'],
            LEARNING:    ['knowledge', 'ai'],
            FORECASTING: ['ai'],
        },
        sections: {
            myday: {
                id: 'myday',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.myday',     title: 'My Day',      component: 'MyDayWidget',      permissions: [], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.personal.missions',  title: 'My Missions', component: 'MyMissionsWidget', permissions: [], priority: 'HIGH',     refreshPolicy: 'LIVE' },
                    { id: 'wid.personal.tasks',     title: 'My Tasks',    component: 'MyTasksWidget',    permissions: [], priority: 'HIGH',     refreshPolicy: 'PERIODIC' }
                ]
            },
            calendar: {
                id: 'calendar',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.calendar', title: 'My Calendar', component: 'MyCalendarWidget', permissions: [], priority: 'HIGH', refreshPolicy: 'PERIODIC' }
                ]
            },
            approvals: {
                id: 'approvals',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.approvals', title: 'My Approvals', component: 'MyApprovalsWidget', permissions: [], priority: 'HIGH', refreshPolicy: 'LIVE' }
                ]
            },
            knowledge: {
                id: 'knowledge',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.knowledge', title: 'My Knowledge', component: 'MyKnowledgeWidget', permissions: [], priority: 'NORMAL' }
                ]
            },
            notifications: {
                id: 'notifications',
                priority: 60,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.notifications', title: 'My Notifications', component: 'MyNotificationsWidget', permissions: [], priority: 'HIGH', refreshPolicy: 'LIVE' }
                ]
            },
            ai: {
                id: 'ai',
                priority: 95,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.personal.ai', title: 'My AI', component: 'WaandaWidget', permissions: [], priority: 'HIGH', requiredCapabilities: ['ecf.waanda'] }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.personal.context', title: 'Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['epf.tasks', 'edf.search', 'ecf.waanda'],
        subscriptions: ['event.task.assigned', 'event.approval.requested', 'event.notification.received'],
        memory: ['lastDayView', 'pendingTaskCount']
    }
};
