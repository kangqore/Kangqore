// Widget Registry
// Generation III Runtime

import React from 'react';

// Domain Widgets
import { MyDayWidget } from '../../widgets/MyDayWidget';
import { WorkQueueWidget } from '../../widgets/WorkQueueWidget';
import { InsightsWidget } from '../../widgets/InsightsWidget';
import { RecommendationWidget } from '../../widgets/RecommendationWidget';
import { KnowledgeWidget } from '../../widgets/KnowledgeWidget';
import { NotificationWidget } from '../../widgets/NotificationWidget';
import { WaandaWidget } from '../../widgets/WaandaWidget';
import { MemoryWidget } from '../../widgets/MemoryWidget';
import { ContextWidget } from '../../widgets/ContextWidget';
import { MissionWidget } from '../../widgets/MissionWidget';
import { DecisionWidget } from '../../widgets/DecisionWidget';
import { TimelineWidget } from '../../widgets/TimelineWidget';
import { AnalyticsWidget } from '../../widgets/AnalyticsWidget';
import { RiskWidget } from '../../widgets/RiskWidget';
import { EvidenceWidget } from '../../widgets/EvidenceWidget';
import { PeopleWidget } from '../../widgets/PeopleWidget';
import { RevenueOverviewWidget } from '../../widgets/RevenueOverviewWidget';
import { PipelineWidget } from '../../widgets/PipelineWidget';
import { DealDeskWidget } from '../../widgets/DealDeskWidget';
import { LeadQueueWidget } from '../../widgets/LeadQueueWidget';

/**
 * Maps component names from WorkspaceManifest to actual React Components.
 * Keys MUST match the `component` string declared in workspace section widgets.
 */
export const WidgetRegistry: Record<string, React.ComponentType<any>> = {
    // Personal Workspace Widgets
    'MyDayWidget': MyDayWidget,
    'WorkQueueWidget': WorkQueueWidget,
    'MissionWidget': MissionWidget,
    'DecisionWidget': DecisionWidget,
    'InsightsWidget': InsightsWidget,
    'RecommendationWidget': RecommendationWidget,
    'KnowledgeWidget': KnowledgeWidget,
    'WaandaWidget': WaandaWidget,
    'NotificationWidget': NotificationWidget,
    'TimelineWidget': TimelineWidget,
    'MemoryWidget': MemoryWidget,
    'ContextWidget': ContextWidget,
    
    // Executive Workspace Widgets
    'AnalyticsWidget': AnalyticsWidget,
    'RiskWidget': RiskWidget,
    'EvidenceWidget': EvidenceWidget,
    'PeopleWidget': PeopleWidget,
    
    // Revenue Workspace Widgets
    'RevenueOverviewWidget': RevenueOverviewWidget,
    'PipelineWidget': PipelineWidget,
    'DealDeskWidget': DealDeskWidget,
    'LeadQueueWidget': LeadQueueWidget,
    
    // Fallback for unknown widgets
    'widget.unknown': () => React.createElement('div', { className: 'widget-shell state-error' }, 'Unknown Widget Component')
};
