// Revenue Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const RevenueWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.revenue',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.revenue',
        title: 'Revenue Workspace',
        description: 'Sales pipeline, forecasting, deal orchestration, and revenue operations.',
        version: '1.0.0',
        category: 'REVENUE',
        icon: 'trending-up'
    },
    workspace: {
        adaptive: true,
        personality: 'COMMERCIAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'REVENUE',
        modes: {
            DEFAULT: ['overview', 'pipeline', 'actions'],
            FOCUS: ['overview', 'pipeline'],
            MEETING: ['overview', 'actions'],
            TRAVEL: ['overview'],
            OFFLINE: ['overview'],
            INCIDENT: ['overview', 'pipeline', 'actions'],
            APPROVAL: ['actions'],
            LEARNING: ['overview'],
            FORECASTING: ['overview', 'pipeline']
        },
        sections: {
            overview: {
                id: 'overview',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.overview', title: 'Revenue Overview', component: 'RevenueOverviewWidget', permissions: ['role.sales', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.revenue.waanda', title: 'Revenue WAANDA', component: 'WaandaWidget', permissions: ['role.sales'], priority: 'HIGH', requiredCapabilities: ['cap.ai.forecast'] }
                ]
            },
            pipeline: {
                id: 'pipeline',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.pipeline', title: 'Sales Pipeline', component: 'PipelineWidget', permissions: ['role.sales', 'role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.revenue.leads', title: 'Lead Queue', component: 'LeadQueueWidget', permissions: ['role.sales'], priority: 'NORMAL' }
                ]
            },
            actions: {
                id: 'actions',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.dealdesk', title: 'Deal Desk', component: 'DealDeskWidget', permissions: ['role.sales', 'role.executive'], priority: 'HIGH' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.revenue.context', title: 'Revenue Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.revenue.read', 'cap.pipeline.manage', 'cap.deals.approve'],
        subscriptions: ['event.deal.created', 'event.deal.updated', 'event.lead.qualified'],
        memory: ['lastPipelineView', 'forecastSnapshot']
    }
};
