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
        description: 'Flagship portal into the Executive Cognition Framework — Enterprise Health, Goals, Decisions, Optimization, Strategy, and Missions.',
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
            DEFAULT:     ['health', 'decisions', 'strategy'],
            FOCUS:       ['strategy', 'decisions'],
            MEETING:     ['health', 'strategy', 'missions'],
            TRAVEL:      ['health', 'decisions'],
            OFFLINE:     ['strategy'],
            INCIDENT:    ['health', 'decisions', 'optimization'],
            APPROVAL:    ['decisions'],
            LEARNING:    ['strategy', 'missions'],
            FORECASTING: ['optimization', 'health'],
        },
        sections: {
            health: {
                id: 'health',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.health', title: 'Enterprise Health', component: 'EnterpriseHealthWidget', permissions: ['role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' }
                ]
            },
            decisions: {
                id: 'decisions',
                priority: 95,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.decisions', title: 'Decision Center', component: 'DecisionCenterWidget', permissions: ['role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' }
                ]
            },
            strategy: {
                id: 'strategy',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.goals',    title: 'Goals',           component: 'GoalsWidget',         permissions: ['role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.executive.strategy', title: 'Strategy Center', component: 'StrategyCenterWidget', permissions: ['role.executive'], priority: 'HIGH' }
                ]
            },
            missions: {
                id: 'missions',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.missions', title: 'Mission Center', component: 'MissionCenterWidget', permissions: ['role.executive'], priority: 'HIGH', refreshPolicy: 'LIVE' }
                ]
            },
            optimization: {
                id: 'optimization',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.optimization', title: 'Optimization Center', component: 'OptimizationCenterWidget', permissions: ['role.executive'], priority: 'NORMAL', refreshPolicy: 'PERIODIC' }
                ]
            },
            ai: {
                id: 'ai',
                priority: 85,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.executive.ai', title: 'Executive WAANDA', component: 'WaandaWidget', permissions: ['role.executive'], priority: 'CRITICAL', requiredCapabilities: ['cap.ai.plan'] }
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
        capabilities: ['ecf.health', 'ecf.decisions', 'ecf.goals', 'ecf.optimization', 'ecf.strategy', 'ecf.missions'],
        subscriptions: ['event.decision.created', 'event.goal.updated', 'event.mission.completed'],
        memory: ['lastHealthSnapshot', 'activeDecisionFilter']
    }
};
