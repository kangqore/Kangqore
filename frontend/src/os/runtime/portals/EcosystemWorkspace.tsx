// Ecosystem Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const EcosystemWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.ecosystem',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.ecosystem',
        title: 'Ecosystem Workspace',
        description: 'Customer portals, vendor/supplier portals, partner hubs, investor portals, and public APIs.',
        version: '1.0.0',
        category: 'ECOSYSTEM',
        icon: 'globe-2'
    },
    workspace: {
        adaptive: true,
        personality: 'RELATIONAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'ECOSYSTEM',
        modes: {
            DEFAULT:     ['portals', 'external'],
            FOCUS:       ['portals'],
            MEETING:     ['portals', 'api'],
            TRAVEL:      ['portals'],
            OFFLINE:     ['portals'],
            INCIDENT:    ['portals', 'external'],
            APPROVAL:    ['portals', 'api'],
            LEARNING:    ['external'],
            FORECASTING: ['external']
        },
        sections: {
            portals: {
                id: 'portals',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.eco.customer', title: 'Customer Portals', component: 'CustomerPortalWidget', permissions: ['role.ecosystem', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.eco.partners', title: 'Partner Hubs',     component: 'PartnerHubWidget',     permissions: ['role.ecosystem'], priority: 'HIGH' },
                    { id: 'wid.eco.waanda',   title: 'Ecosystem WAANDA', component: 'WaandaWidget',         permissions: ['role.ecosystem'], priority: 'HIGH', requiredCapabilities: ['cap.ecosystem.manage'] }
                ]
            },
            external: {
                id: 'external',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.eco.vendors',   title: 'Vendor & Supplier Portals', component: 'VendorPortalWidget',    permissions: ['role.ecosystem'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.eco.investors', title: 'Investor Portals',           component: 'InvestorPortalWidget',  permissions: ['role.ecosystem', 'role.executive'], priority: 'NORMAL' }
                ]
            },
            api: {
                id: 'api',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.eco.publicapi', title: 'Public APIs',      component: 'PublicApiWidget',     permissions: ['role.ecosystem'], priority: 'NORMAL' },
                    { id: 'wid.eco.webhooks',  title: 'Webhook Config',   component: 'WebhookConfigWidget', permissions: ['role.ecosystem'], priority: 'LOW' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.eco.context', title: 'Ecosystem Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.ecosystem.read', 'cap.portals.manage', 'cap.api.publish'],
        subscriptions: ['event.external.session.started', 'event.partner.request', 'event.investor.view'],
        memory: ['lastPortalView', 'activePartnerFilter']
    }
};
