// Enterprise Intelligence Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const EnterpriseIntelligenceWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.intelligence',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.intelligence',
        title: 'Enterprise Intelligence Workspace',
        description: 'Analytics, predictions, simulations, optimization, insights, knowledge graph, and enterprise search.',
        version: '1.0.0',
        category: 'INTELLIGENCE',
        icon: 'brain-circuit'
    },
    workspace: {
        adaptive: true,
        personality: 'ANALYTICAL',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'INTELLIGENCE',
        modes: {
            DEFAULT:     ['analytics', 'predictions'],
            FOCUS:       ['analytics'],
            MEETING:     ['analytics', 'insights'],
            TRAVEL:      ['analytics'],
            OFFLINE:     ['analytics'],
            INCIDENT:    ['analytics', 'predictions'],
            APPROVAL:    ['insights'],
            LEARNING:    ['knowledge'],
            FORECASTING: ['predictions', 'simulation']
        },
        sections: {
            analytics: {
                id: 'analytics',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.analytics',  title: 'Analytics Dashboard',  component: 'AnalyticsDashboardWidget',  permissions: ['role.analyst', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.intel.patterns',   title: 'Pattern Explorer',     component: 'PatternExplorerWidget',     permissions: ['role.analyst'], priority: 'HIGH' },
                    { id: 'wid.intel.reports',    title: 'Reports',              component: 'ReportsWidget',             permissions: ['role.analyst', 'role.executive'], priority: 'NORMAL', refreshPolicy: 'ON_DEMAND' },
                    { id: 'wid.intel.waanda',     title: 'Intelligence WAANDA',  component: 'WaandaWidget',              permissions: ['role.analyst'], priority: 'HIGH', requiredCapabilities: ['cap.ai.analyze'] }
                ]
            },
            predictions: {
                id: 'predictions',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.predictions', title: 'Prediction Center', component: 'PredictionCenterWidget', permissions: ['role.analyst', 'role.executive'], priority: 'HIGH', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.intel.risk',        title: 'Risk Signals',      component: 'RiskSignalWidget',       permissions: ['role.analyst'], priority: 'HIGH', refreshPolicy: 'LIVE' }
                ]
            },
            simulation: {
                id: 'simulation',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.simulation', title: 'Simulation Lab',   component: 'SimulationLabWidget', permissions: ['role.analyst', 'role.executive'], priority: 'NORMAL' },
                    { id: 'wid.intel.whatif',     title: 'What-If Engine',   component: 'WhatIfWidget',        permissions: ['role.analyst'], priority: 'NORMAL' }
                ]
            },
            optimization: {
                id: 'optimization',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.optimization', title: 'Optimization Center', component: 'OptimizationCenterWidget', permissions: ['role.analyst', 'role.executive'], priority: 'NORMAL' },
                    { id: 'wid.intel.optimizer',    title: 'Optimizer',           component: 'OptimizerWidget',         permissions: ['role.analyst'], priority: 'LOW' }
                ]
            },
            insights: {
                id: 'insights',
                priority: 60,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.insights', title: 'Insights Explorer', component: 'InsightsExplorerWidget', permissions: ['role.analyst', 'role.executive'], priority: 'NORMAL' }
                ]
            },
            knowledge: {
                id: 'knowledge',
                priority: 50,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.intel.graph',  title: 'Knowledge Graph',    component: 'KnowledgeGraphWidget',   permissions: ['role.analyst'], priority: 'NORMAL' },
                    { id: 'wid.intel.search', title: 'Enterprise Search',  component: 'EnterpriseSearchWidget', permissions: ['role.analyst', 'role.executive'], priority: 'NORMAL' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.intel.context', title: 'Intelligence Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['epf.predictions', 'esf.simulation', 'eof.optimization', 'edf.search'],
        subscriptions: ['event.prediction.published', 'event.drift.detected', 'event.insight.generated'],
        memory: ['lastAnalyticsView', 'activeSimulation']
    }
};
