// Platform Workspace Package (DevX)
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const PlatformWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.platform',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.platform',
        title: 'Platform Workspace',
        description: 'Domains, objects, policies, KORE runtime, models, connectors, events, observability, security, and extensions.',
        version: '1.0.0',
        category: 'PLATFORM',
        icon: 'layers'
    },
    workspace: {
        adaptive: true,
        personality: 'TECHNICAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'PLATFORM',
        modes: {
            DEFAULT:     ['domains', 'runtime', 'observability'],
            FOCUS:       ['domains'],
            MEETING:     ['domains', 'models'],
            TRAVEL:      ['observability'],
            OFFLINE:     ['domains'],
            INCIDENT:    ['observability', 'runtime'],
            APPROVAL:    ['policies', 'security'],
            LEARNING:    ['models'],
            FORECASTING: ['models', 'domains']
        },
        sections: {
            domains: {
                id: 'domains',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.domains',  title: 'Domain Registry',    component: 'DomainRegistryWidget',    permissions: ['role.platform', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.platform.objects',  title: 'Object Catalog',     component: 'ObjectCatalogWidget',     permissions: ['role.platform'], priority: 'HIGH' },
                    { id: 'wid.platform.waanda',   title: 'Platform WAANDA',    component: 'WaandaWidget',            permissions: ['role.platform'], priority: 'HIGH', requiredCapabilities: ['cap.platform.admin'] }
                ]
            },
            runtime: {
                id: 'runtime',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.kore',       title: 'KORE Runtime',   component: 'KoreRuntimeWidget',   permissions: ['role.platform'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.platform.events',     title: 'Event Bus',      component: 'EventBusWidget',      permissions: ['role.platform'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.platform.connectors', title: 'Connectors',     component: 'ConnectorsWidget',    permissions: ['role.platform'], priority: 'NORMAL' },
                    { id: 'wid.platform.extensions', title: 'Extensions',     component: 'ExtensionsWidget',    permissions: ['role.platform'], priority: 'LOW' }
                ]
            },
            models: {
                id: 'models',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.models',       title: 'Model Registry',      component: 'ModelRegistryWidget',      permissions: ['role.platform', 'role.executive'], priority: 'HIGH' },
                    { id: 'wid.platform.capabilities', title: 'Capability Registry', component: 'CapabilityRegistryWidget', permissions: ['role.platform'], priority: 'NORMAL' }
                ]
            },
            policies: {
                id: 'policies',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.policies', title: 'Policy Registry', component: 'PolicyRegistryWidget', permissions: ['role.platform'], priority: 'NORMAL' }
                ]
            },
            observability: {
                id: 'observability',
                priority: 60,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.health', title: 'Health Monitor', component: 'HealthMonitorWidget', permissions: ['role.platform'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.platform.logs',   title: 'Log Explorer',   component: 'LogExplorerWidget',   permissions: ['role.platform'], priority: 'NORMAL' }
                ]
            },
            security: {
                id: 'security',
                priority: 50,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.platform.security', title: 'Security Center', component: 'SecurityCenterWidget', permissions: ['role.platform'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.platform.threats',  title: 'Threat Monitor',  component: 'ThreatMonitorWidget',  permissions: ['role.platform'], priority: 'HIGH', refreshPolicy: 'LIVE' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.platform.context', title: 'Platform Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.platform.read', 'cap.domains.manage', 'cap.models.deploy', 'cap.runtime.observe'],
        subscriptions: ['event.domain.registered', 'event.model.deployed', 'event.runtime.alert'],
        memory: ['activeDomainFilter', 'lastRuntimeView']
    }
};
