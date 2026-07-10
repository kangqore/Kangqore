// Revenue Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const RevenueWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.revenue',
    version: '2.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.revenue',
        title: 'Revenue Workspace',
        description: 'Accounts, pipeline, forecast, pricing, quotations, customer health, revenue intelligence, and revenue optimization — spanning Customer, Sales, Marketing, Product, and Finance domains.',
        version: '2.0.0',
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
            DEFAULT:     ['accounts', 'pipeline', 'forecast'],
            FOCUS:       ['pipeline'],
            MEETING:     ['accounts', 'commercial'],
            TRAVEL:      ['pipeline', 'forecast'],
            OFFLINE:     ['accounts'],
            INCIDENT:    ['pipeline', 'accounts'],
            APPROVAL:    ['commercial', 'accounts'],
            LEARNING:    ['forecast', 'ai'],
            FORECASTING: ['forecast', 'optimization'],
        },
        sections: {
            accounts: {
                id: 'accounts',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.accounts',       title: 'Accounts',         component: 'AccountsWidget',       permissions: ['role.sales', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.revenue.customerhealth', title: 'Customer Health',  component: 'CustomerHealthWidget', permissions: ['role.sales', 'role.executive'], priority: 'HIGH',     refreshPolicy: 'PERIODIC' }
                ]
            },
            pipeline: {
                id: 'pipeline',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.pipeline', title: 'Pipeline',    component: 'PipelineWidget',   permissions: ['role.sales', 'role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.revenue.leads',    title: 'Lead Queue',  component: 'LeadQueueWidget',  permissions: ['role.sales'], priority: 'NORMAL' }
                ]
            },
            forecast: {
                id: 'forecast',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.forecast',      title: 'Forecast',              component: 'ForecastWidget',              permissions: ['role.sales', 'role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.revenue.intelligence',  title: 'Revenue Intelligence',  component: 'RevenueIntelligenceWidget',   permissions: ['role.sales', 'role.executive'], priority: 'HIGH' }
                ]
            },
            commercial: {
                id: 'commercial',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.pricing',     title: 'Pricing',      component: 'PricingWidget',     permissions: ['role.sales'], priority: 'NORMAL' },
                    { id: 'wid.revenue.quotations',  title: 'Quotations',   component: 'QuotationsWidget',  permissions: ['role.sales'], priority: 'NORMAL' }
                ]
            },
            optimization: {
                id: 'optimization',
                priority: 60,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.optimization', title: 'Revenue Optimization', component: 'RevenueOptimizationWidget', permissions: ['role.sales', 'role.executive'], priority: 'NORMAL', refreshPolicy: 'ON_DEMAND' }
                ]
            },
            ai: {
                id: 'ai',
                priority: 85,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.revenue.ai', title: 'Revenue WAANDA', component: 'WaandaWidget', permissions: ['role.sales'], priority: 'HIGH', requiredCapabilities: ['cap.ai.forecast'] }
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
        capabilities: ['cap.revenue.read', 'cap.pipeline.manage', 'cap.deals.approve', 'cap.forecast.read', 'cap.pricing.manage'],
        subscriptions: ['event.deal.created', 'event.deal.updated', 'event.lead.qualified', 'event.account.updated', 'event.forecast.updated'],
        memory: ['lastPipelineView', 'forecastSnapshot']
    }
};
