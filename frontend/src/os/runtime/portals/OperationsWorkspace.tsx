// Operations Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const OperationsWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.operations',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.operations',
        title: 'Operations Workspace',
        description: 'Projects, resources, assets, procurement, supply chain, and execution automation.',
        version: '1.0.0',
        category: 'OPERATIONS',
        icon: 'settings-2'
    },
    workspace: {
        adaptive: true,
        personality: 'OPERATIONAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'OPERATIONS',
        modes: {
            DEFAULT:     ['execution', 'supply', 'automation'],
            FOCUS:       ['execution'],
            MEETING:     ['execution', 'automation'],
            TRAVEL:      ['execution'],
            OFFLINE:     ['execution'],
            INCIDENT:    ['execution', 'automation'],
            APPROVAL:    ['execution', 'supply'],
            LEARNING:    ['execution'],
            FORECASTING: ['supply', 'execution']
        },
        sections: {
            execution: {
                id: 'execution',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.ops.center',    title: 'Operations Center',  component: 'OperationsCenterWidget',  permissions: ['role.ops', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.ops.resources', title: 'Resource Tracker',   component: 'ResourceTrackerWidget',   permissions: ['role.ops'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.ops.projects',  title: 'Project Board',      component: 'ProjectBoardWidget',      permissions: ['role.ops', 'role.executive'], priority: 'HIGH' },
                    { id: 'wid.ops.waanda',    title: 'Operations WAANDA',  component: 'WaandaWidget',            permissions: ['role.ops'], priority: 'HIGH', requiredCapabilities: ['cap.ops.execute'] }
                ]
            },
            supply: {
                id: 'supply',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.ops.supply',      title: 'Supply Chain',   component: 'SupplyChainWidget',    permissions: ['role.ops', 'role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.ops.procurement', title: 'Procurement',    component: 'ProcurementWidget',    permissions: ['role.ops'], priority: 'NORMAL' },
                    { id: 'wid.ops.assets',      title: 'Asset Manager',  component: 'AssetManagerWidget',   permissions: ['role.ops'], priority: 'NORMAL' }
                ]
            },
            automation: {
                id: 'automation',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.ops.automation', title: 'Automation Hub',    component: 'AutomationHubWidget',    permissions: ['role.ops'], priority: 'NORMAL' },
                    { id: 'wid.ops.workflow',   title: 'Workflow Runner',   component: 'WorkflowRunnerWidget',   permissions: ['role.ops'], priority: 'NORMAL' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.ops.context', title: 'Operations Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.ops.read', 'cap.projects.manage', 'cap.assets.read', 'cap.supply.read', 'epf.capacity'],
        subscriptions: ['event.project.updated', 'event.asset.alert', 'event.supply.disruption'],
        memory: ['lastProjectView', 'activeResourceFilter']
    }
};
