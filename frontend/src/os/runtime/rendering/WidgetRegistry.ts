// Widget Registry — Generation III Runtime
// Maps component names declared in WorkspaceManifest sections to React components.

import React from 'react';

// ── Gen I ──────────────────────────────────────────────────────────────────
import { MyDayWidget }          from '../../widgets/MyDayWidget';
import { WorkQueueWidget }      from '../../widgets/WorkQueueWidget';
import { InsightsWidget }       from '../../widgets/InsightsWidget';
import { RecommendationWidget } from '../../widgets/RecommendationWidget';
import { KnowledgeWidget }      from '../../widgets/KnowledgeWidget';
import { NotificationWidget }   from '../../widgets/NotificationWidget';
import { WaandaWidget }         from '../../widgets/WaandaWidget';
import { MemoryWidget }         from '../../widgets/MemoryWidget';
import { ContextWidget }        from '../../widgets/ContextWidget';
import { MissionWidget }        from '../../widgets/MissionWidget';
import { DecisionWidget }       from '../../widgets/DecisionWidget';
import { TimelineWidget }       from '../../widgets/TimelineWidget';
import { AnalyticsWidget }      from '../../widgets/AnalyticsWidget';
import { RiskWidget }           from '../../widgets/RiskWidget';
import { EvidenceWidget }       from '../../widgets/EvidenceWidget';
import { PeopleWidget }         from '../../widgets/PeopleWidget';
import { RevenueOverviewWidget } from '../../widgets/RevenueOverviewWidget';
import { PipelineWidget }       from '../../widgets/PipelineWidget';
import { DealDeskWidget }       from '../../widgets/DealDeskWidget';
import { LeadQueueWidget }      from '../../widgets/LeadQueueWidget';

// ── Phase 5.1 — Personal ──────────────────────────────────────────────────
import { MyMissionsWidget }      from '../../widgets/MyMissionsWidget';
import { MyTasksWidget }         from '../../widgets/MyTasksWidget';
import { MyCalendarWidget }      from '../../widgets/MyCalendarWidget';
import { MyApprovalsWidget }     from '../../widgets/MyApprovalsWidget';
import { MyKnowledgeWidget }     from '../../widgets/MyKnowledgeWidget';
import { MyNotificationsWidget } from '../../widgets/MyNotificationsWidget';

// ── Phase 5.2 — Executive ─────────────────────────────────────────────────
import { EnterpriseHealthWidget }   from '../../widgets/EnterpriseHealthWidget';
import { DecisionCenterWidget }     from '../../widgets/DecisionCenterWidget';
import { GoalsWidget }              from '../../widgets/GoalsWidget';
import { StrategyCenterWidget }     from '../../widgets/StrategyCenterWidget';
import { MissionCenterWidget }      from '../../widgets/MissionCenterWidget';
import { OptimizationCenterWidget } from '../../widgets/OptimizationCenterWidget';

// ── Phase 5.3 — Revenue ───────────────────────────────────────────────────
import { AccountsWidget }            from '../../widgets/AccountsWidget';
import { CustomerHealthWidget }      from '../../widgets/CustomerHealthWidget';
import { ForecastWidget }            from '../../widgets/ForecastWidget';
import { RevenueIntelligenceWidget } from '../../widgets/RevenueIntelligenceWidget';
import { PricingWidget }             from '../../widgets/PricingWidget';
import { QuotationsWidget }          from '../../widgets/QuotationsWidget';
import { RevenueOptimizationWidget } from '../../widgets/RevenueOptimizationWidget';

// ── Phase 5.4 — Operations ────────────────────────────────────────────────
import { OperationsCenterWidget } from '../../widgets/OperationsCenterWidget';
import { ResourceTrackerWidget }  from '../../widgets/ResourceTrackerWidget';
import { SupplyChainWidget }      from '../../widgets/SupplyChainWidget';
import { ProcurementWidget }      from '../../widgets/ProcurementWidget';
import { WorkflowRunnerWidget }   from '../../widgets/WorkflowRunnerWidget';
import { AutomationHubWidget }    from '../../widgets/AutomationHubWidget';
import { AssetManagerWidget }     from '../../widgets/AssetManagerWidget';

// ── Phase 5.5 — Intelligence ──────────────────────────────────────────────
import { AnalyticsDashboardWidget } from '../../widgets/AnalyticsDashboardWidget';
import { PredictionCenterWidget }   from '../../widgets/PredictionCenterWidget';
import { SimulationLabWidget }      from '../../widgets/SimulationLabWidget';
import { OptimizerWidget }          from '../../widgets/OptimizerWidget';
import { InsightsExplorerWidget }   from '../../widgets/InsightsExplorerWidget';
import { PatternExplorerWidget }    from '../../widgets/PatternExplorerWidget';
import { KnowledgeGraphWidget }     from '../../widgets/KnowledgeGraphWidget';
import { DataLineageWidget }        from '../../widgets/DataLineageWidget';
import { ReportsWidget }            from '../../widgets/ReportsWidget';

// ── Phase 5.6 — Platform ──────────────────────────────────────────────────
import { DomainRegistryWidget }    from '../../widgets/DomainRegistryWidget';
import { KoreRuntimeWidget }       from '../../widgets/KoreRuntimeWidget';
import { ModelRegistryWidget }     from '../../widgets/ModelRegistryWidget';
import { PolicyRegistryWidget }    from '../../widgets/PolicyRegistryWidget';
import { HealthMonitorWidget }     from '../../widgets/HealthMonitorWidget';
import { LogExplorerWidget }       from '../../widgets/LogExplorerWidget';
import { CapabilityRegistryWidget } from '../../widgets/CapabilityRegistryWidget';
import { ObjectCatalogWidget }     from '../../widgets/ObjectCatalogWidget';
import { SecurityCenterWidget }    from '../../widgets/SecurityCenterWidget';
import { EventBusWidget }          from '../../widgets/EventBusWidget';
import { ExtensionsWidget }        from '../../widgets/ExtensionsWidget';
import { ConnectorsWidget }        from '../../widgets/ConnectorsWidget';
import { WebhookConfigWidget }     from '../../widgets/WebhookConfigWidget';

// ── Phase 5.7 — Collaboration ─────────────────────────────────────────────
import { ChatWidget }              from '../../widgets/ChatWidget';
import { MissionRoomsWidget }      from '../../widgets/MissionRoomsWidget';
import { VoiceWidget }             from '../../widgets/VoiceWidget';
import { MeetingsWidget }          from '../../widgets/MeetingsWidget';
import { SharedSimulationsWidget } from '../../widgets/SharedSimulationsWidget';
import { SharedApprovalsWidget }   from '../../widgets/SharedApprovalsWidget';
import { EscalationWidget }        from '../../widgets/EscalationWidget';
import { DecisionThreadWidget }    from '../../widgets/DecisionThreadWidget';

// ── Phase 5.8 — Governance ────────────────────────────────────────────────
import { PolicyCenterWidget }      from '../../widgets/PolicyCenterWidget';
import { RiskDashboardWidget }     from '../../widgets/RiskDashboardWidget';
import { AuditExplorerWidget }     from '../../widgets/AuditExplorerWidget';
import { DecisionLedgerWidget }    from '../../widgets/DecisionLedgerWidget';
import { SimulationLedgerWidget }  from '../../widgets/SimulationLedgerWidget';
import { OptimizationLedgerWidget } from '../../widgets/OptimizationLedgerWidget';
import { AccessIdentityWidget }    from '../../widgets/AccessIdentityWidget';
import { ComplianceCenterWidget }  from '../../widgets/ComplianceCenterWidget';
import { ThreatMonitorWidget }     from '../../widgets/ThreatMonitorWidget';
import { RiskSignalWidget }        from '../../widgets/RiskSignalWidget';
import { AegisGovernanceWidget }   from '../../widgets/AegisGovernanceWidget';

// ── Phase 5.9 — Ecosystem ─────────────────────────────────────────────────
import { CustomerPortalWidget }   from '../../widgets/CustomerPortalWidget';
import { PartnerHubWidget }       from '../../widgets/PartnerHubWidget';
import { VendorPortalWidget }     from '../../widgets/VendorPortalWidget';
import { InvestorPortalWidget }   from '../../widgets/InvestorPortalWidget';
import { PublicApiWidget }        from '../../widgets/PublicApiWidget';
import { ProjectBoardWidget }     from '../../widgets/ProjectBoardWidget';
import { EnterpriseSearchWidget } from '../../widgets/EnterpriseSearchWidget';
import { WhatIfWidget }           from '../../widgets/WhatIfWidget';
import { PredictionLedgerWidget } from '../../widgets/PredictionLedgerWidget';

export const WidgetRegistry: Record<string, React.ComponentType<any>> = {
  // Gen I
  'MyDayWidget': MyDayWidget, 'WorkQueueWidget': WorkQueueWidget,
  'MissionWidget': MissionWidget, 'DecisionWidget': DecisionWidget,
  'InsightsWidget': InsightsWidget, 'RecommendationWidget': RecommendationWidget,
  'KnowledgeWidget': KnowledgeWidget, 'WaandaWidget': WaandaWidget,
  'NotificationWidget': NotificationWidget, 'TimelineWidget': TimelineWidget,
  'MemoryWidget': MemoryWidget, 'ContextWidget': ContextWidget,
  'AnalyticsWidget': AnalyticsWidget, 'RiskWidget': RiskWidget,
  'EvidenceWidget': EvidenceWidget, 'PeopleWidget': PeopleWidget,
  'RevenueOverviewWidget': RevenueOverviewWidget, 'PipelineWidget': PipelineWidget,
  'DealDeskWidget': DealDeskWidget, 'LeadQueueWidget': LeadQueueWidget,

  // 5.1 Personal
  'MyMissionsWidget': MyMissionsWidget, 'MyTasksWidget': MyTasksWidget,
  'MyCalendarWidget': MyCalendarWidget, 'MyApprovalsWidget': MyApprovalsWidget,
  'MyKnowledgeWidget': MyKnowledgeWidget, 'MyNotificationsWidget': MyNotificationsWidget,

  // 5.2 Executive
  'EnterpriseHealthWidget': EnterpriseHealthWidget, 'DecisionCenterWidget': DecisionCenterWidget,
  'GoalsWidget': GoalsWidget, 'StrategyCenterWidget': StrategyCenterWidget,
  'MissionCenterWidget': MissionCenterWidget, 'OptimizationCenterWidget': OptimizationCenterWidget,

  // 5.3 Revenue
  'AccountsWidget': AccountsWidget, 'CustomerHealthWidget': CustomerHealthWidget,
  'ForecastWidget': ForecastWidget, 'RevenueIntelligenceWidget': RevenueIntelligenceWidget,
  'PricingWidget': PricingWidget, 'QuotationsWidget': QuotationsWidget,
  'RevenueOptimizationWidget': RevenueOptimizationWidget,

  // 5.4 Operations
  'OperationsCenterWidget': OperationsCenterWidget, 'ResourceTrackerWidget': ResourceTrackerWidget,
  'SupplyChainWidget': SupplyChainWidget, 'ProcurementWidget': ProcurementWidget,
  'WorkflowRunnerWidget': WorkflowRunnerWidget, 'AutomationHubWidget': AutomationHubWidget,
  'AssetManagerWidget': AssetManagerWidget,

  // 5.5 Intelligence
  'AnalyticsDashboardWidget': AnalyticsDashboardWidget, 'PredictionCenterWidget': PredictionCenterWidget,
  'SimulationLabWidget': SimulationLabWidget, 'OptimizerWidget': OptimizerWidget,
  'InsightsExplorerWidget': InsightsExplorerWidget, 'PatternExplorerWidget': PatternExplorerWidget,
  'KnowledgeGraphWidget': KnowledgeGraphWidget, 'DataLineageWidget': DataLineageWidget,
  'ReportsWidget': ReportsWidget,

  // 5.6 Platform
  'DomainRegistryWidget': DomainRegistryWidget, 'KoreRuntimeWidget': KoreRuntimeWidget,
  'ModelRegistryWidget': ModelRegistryWidget, 'PolicyRegistryWidget': PolicyRegistryWidget,
  'HealthMonitorWidget': HealthMonitorWidget, 'LogExplorerWidget': LogExplorerWidget,
  'CapabilityRegistryWidget': CapabilityRegistryWidget, 'ObjectCatalogWidget': ObjectCatalogWidget,
  'SecurityCenterWidget': SecurityCenterWidget, 'EventBusWidget': EventBusWidget,
  'ExtensionsWidget': ExtensionsWidget, 'ConnectorsWidget': ConnectorsWidget,
  'WebhookConfigWidget': WebhookConfigWidget,

  // 5.7 Collaboration
  'ChatWidget': ChatWidget, 'MissionRoomsWidget': MissionRoomsWidget,
  'VoiceWidget': VoiceWidget, 'MeetingsWidget': MeetingsWidget,
  'SharedSimulationsWidget': SharedSimulationsWidget, 'SharedApprovalsWidget': SharedApprovalsWidget,
  'EscalationWidget': EscalationWidget, 'DecisionThreadWidget': DecisionThreadWidget,

  // 5.8 Governance
  'PolicyCenterWidget': PolicyCenterWidget, 'RiskDashboardWidget': RiskDashboardWidget,
  'AuditExplorerWidget': AuditExplorerWidget, 'DecisionLedgerWidget': DecisionLedgerWidget,
  'SimulationLedgerWidget': SimulationLedgerWidget, 'OptimizationLedgerWidget': OptimizationLedgerWidget,
  'AccessIdentityWidget': AccessIdentityWidget, 'ComplianceCenterWidget': ComplianceCenterWidget,
  'ThreatMonitorWidget': ThreatMonitorWidget, 'RiskSignalWidget': RiskSignalWidget,
  'AegisGovernanceWidget': AegisGovernanceWidget,

  // 5.9 Ecosystem
  'CustomerPortalWidget': CustomerPortalWidget, 'PartnerHubWidget': PartnerHubWidget,
  'VendorPortalWidget': VendorPortalWidget, 'InvestorPortalWidget': InvestorPortalWidget,
  'PublicApiWidget': PublicApiWidget, 'ProjectBoardWidget': ProjectBoardWidget,
  'EnterpriseSearchWidget': EnterpriseSearchWidget, 'WhatIfWidget': WhatIfWidget,
  'PredictionLedgerWidget': PredictionLedgerWidget,

  // Fallback
  'widget.unknown': () => React.createElement(
    'div', { className: 'widget-shell state-error' }, 'Widget not implemented'
  ),
};
