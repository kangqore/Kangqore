// Governance Workspace Package
// Generation III Runtime

import { WorkspaceManifest } from '../sdk';

export const GovernanceWorkspaceManifest: WorkspaceManifest = {
    id: 'wksp.governance',
    version: '1.0.0',
    apiVersion: '1.0.0',
    runtimeVersion: '>=3.0.0',
    sdkVersion: '1.0.0',
    metadata: {
        id: 'wksp.governance',
        title: 'Governance Workspace',
        description: 'Policy center, AEGIS governance, risk dashboard, compliance, audit explorer, all ledgers, access & identity, and data lineage.',
        version: '1.0.0',
        category: 'GOVERNANCE',
        icon: 'shield-check'
    },
    workspace: {
        adaptive: true,
        personality: 'SOVEREIGN',
        layoutEngine: 'DYNAMIC_SECTION',
        scheduler: 'predictive',
        cognitiveStateType: 'GOVERNANCE',
        modes: {
            DEFAULT:     ['policy', 'risk', 'audit'],
            FOCUS:       ['policy'],
            MEETING:     ['policy', 'risk'],
            TRAVEL:      ['risk'],
            OFFLINE:     ['policy'],
            INCIDENT:    ['risk', 'audit', 'identity'],
            APPROVAL:    ['policy', 'identity'],
            LEARNING:    ['policy'],
            FORECASTING: ['risk']
        },
        sections: {
            policy: {
                id: 'policy',
                priority: 100,
                collapsible: false,
                adaptive: true,
                widgets: [
                    { id: 'wid.gov.policy',  title: 'Policy Center',    component: 'PolicyCenterWidget',    permissions: ['role.governance', 'role.executive'], priority: 'CRITICAL', refreshPolicy: 'PERIODIC' },
                    { id: 'wid.gov.aegis',   title: 'AEGIS Governance', component: 'AegisGovernanceWidget', permissions: ['role.governance'], priority: 'CRITICAL', refreshPolicy: 'LIVE' },
                    { id: 'wid.gov.waanda',  title: 'Governance WAANDA', component: 'WaandaWidget',         permissions: ['role.governance'], priority: 'HIGH', requiredCapabilities: ['cap.governance.read'] }
                ]
            },
            risk: {
                id: 'risk',
                priority: 90,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.gov.risk',       title: 'Risk Dashboard',    component: 'RiskDashboardWidget',    permissions: ['role.governance', 'role.executive'], priority: 'HIGH', refreshPolicy: 'LIVE' },
                    { id: 'wid.gov.compliance', title: 'Compliance Center', component: 'ComplianceCenterWidget', permissions: ['role.governance'], priority: 'HIGH', refreshPolicy: 'PERIODIC' }
                ]
            },
            audit: {
                id: 'audit',
                priority: 80,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.gov.audit',        title: 'Audit Explorer',        component: 'AuditExplorerWidget',       permissions: ['role.governance'], priority: 'HIGH' },
                    { id: 'wid.gov.decision',     title: 'Decision Ledger',       component: 'DecisionLedgerWidget',      permissions: ['role.governance', 'role.executive'], priority: 'NORMAL' },
                    { id: 'wid.gov.prediction',   title: 'Prediction Ledger',     component: 'PredictionLedgerWidget',    permissions: ['role.governance'], priority: 'NORMAL' },
                    { id: 'wid.gov.simulation',   title: 'Simulation Ledger',     component: 'SimulationLedgerWidget',    permissions: ['role.governance'], priority: 'NORMAL' },
                    { id: 'wid.gov.optimization', title: 'Optimization Ledger',   component: 'OptimizationLedgerWidget',  permissions: ['role.governance'], priority: 'NORMAL' }
                ]
            },
            identity: {
                id: 'identity',
                priority: 70,
                collapsible: true,
                adaptive: true,
                widgets: [
                    { id: 'wid.gov.identity', title: 'Access & Identity', component: 'AccessIdentityWidget', permissions: ['role.governance'], priority: 'HIGH' },
                    { id: 'wid.gov.lineage',  title: 'Data Lineage',      component: 'DataLineageWidget',    permissions: ['role.governance'], priority: 'NORMAL' }
                ]
            },
            navigation: {
                id: 'navigation',
                priority: 1000,
                collapsible: false,
                adaptive: false,
                widgets: [
                    { id: 'wid.gov.context', title: 'Governance Context', component: 'ContextWidget', permissions: [], priority: 'CRITICAL' }
                ]
            }
        },
        policies: [],
        capabilities: ['cap.governance.read', 'cap.aegis.audit', 'cap.policy.manage', 'cap.identity.read'],
        subscriptions: ['event.policy.violated', 'event.risk.escalated', 'event.aegis.alert'],
        memory: ['activeComplianceFilter', 'lastAuditQuery']
    }
};
