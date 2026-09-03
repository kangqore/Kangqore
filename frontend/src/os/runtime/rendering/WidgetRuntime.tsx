// Widget Runtime — Generation III Runtime
// Renders active workspace sections and their widgets using the KEOS shell design.

import React, { useEffect, useState } from 'react';
import { WorkspaceManifest, WorkspaceMode, WorkspaceSection } from '../types/manifest';
import { PolicyAdapter } from '../workspace/PolicyAdapter';
import { RuntimeScheduler } from '../workspace/RuntimeScheduler';
import { WidgetDependencyResolver } from '../workspace/WidgetDependencyResolver';
import { WidgetRegistry } from './WidgetRegistry';

interface WidgetRuntimeProps {
  manifest: WorkspaceManifest;
  context: any;
  mode: WorkspaceMode;
  policyAdapter: PolicyAdapter;
  scheduler: RuntimeScheduler;
  resolver: WidgetDependencyResolver;
}

interface ResolvedWidget {
  widget: any;
  deps: any;
}

const SECTION_NAMES: Record<string, string> = {
  myday: 'My Day Plan',
  notifications: 'Live Notifications',
  ai: 'WAANDA Cognitive Assistant',
  calendar: 'Schedule & Events',
  knowledge: 'Enterprise Knowledge Hub',
  approvals: 'Awaiting Approvals',
  // Executive
  health: 'Enterprise Health Matrix',
  goals: 'Corporate Objectives',
  decisions: 'Decision Log',
  optimization: 'Efficiency Center',
  strategy: 'Strategic Focus',
  missions: 'Active Autonomous Missions',
  // Revenue
  accounts: 'Key Accounts',
  pipeline: 'Sales Pipeline',
  forecast: 'Revenue Forecast',
  pricing: 'Pricing Policy',
  quotations: 'Active Quotations',
  customerhealth: 'Customer Success KPI',
  revenueintel: 'Revenue Intelligence Feed',
  revenueopt: 'Revenue Optimization Engine',
  // Operations
  projects: 'Project Board',
  resources: 'Resource Allocation',
  opsCenter: 'Operations Console',
  assets: 'Physical & Digital Assets',
  procurement: 'Procurement Pipeline',
  supplyChain: 'Supply Chain Operations',
  automation: 'Autopilot Automation Logs',
  execution: 'Task Execution Metrics',
  // Intelligence
  analytics: 'Visual Analytics Panel',
  predictions: 'Forecast Models',
  simulations: 'What-If Simulation Sandbox',
  optimizationLab: 'Continuous Optimization Lab',
  insights: 'AI Synthesized Insights',
  knowledgeGraph: 'Enterprise Semantic Graph',
  search: 'Unified Enterprise Search',
  reports: 'Generated Reports Registry',
  // Platform
  domains: 'Business Domain Definitions',
  objects: 'Reality Object Mapping',
  policies: 'Hanumanas Active Policies',
  kore: 'KORE Subsystem Monitor',
  models: 'Registered AI Models',
  connectors: 'Integration Connectors',
  events: 'Event Bus Analytics',
  runtime: 'Runtime Health Console',
  observability: 'Telemetry Observability',
  security: 'Security Information (SIEM)',
  extensions: 'OS Extensions Store',
  // Collaboration
  chat: 'Workspace Chat Rooms',
  voice: 'Voice Channels',
  meetings: 'Virtual Meeting Rooms',
  missionRooms: 'Contextual Mission Hubs',
  decisionThreads: 'Decision Thread Context',
  sharedSimulations: 'Collaborative Simulation Rooms',
  sharedApprovals: 'Multi-signature Approvals',
  // Governance
  policyCenter: 'Active Governance Policies',
  hanumanasGovernance: 'Hanumanas Sentinel Logs',
  riskDashboard: 'Risk Management Console',
  complianceCenter: 'Regulatory Compliance Log',
  auditExplorer: 'Tamper-proof Ledger Auditor',
  decisionLedger: 'Decision Audit History',
  predictionLedger: 'Prediction Accuracy Ledger',
  simulationLedger: 'Simulation Outcome Ledger',
  optimizationLedger: 'Efficiency Saving Logs',
  accessIdentity: 'Identity & Access Control',
  dataLineage: 'Data Lineage Explorer',
  // Ecosystem
  customerPortals: 'External Customer Portals',
  vendorPortals: 'Vendor & Supplier Portals',
  partnerHubs: 'Strategic Partner Hubs',
  investorPortals: 'Investor Relations Portal',
  publicApis: 'Developer API Console',
};

export const WidgetRuntime: React.FC<WidgetRuntimeProps> = ({
  manifest, context, mode, scheduler, resolver,
}) => {
  const [renderedSections, setRenderedSections] = useState<Record<string, ResolvedWidget[]>>({});

  useEffect(() => {
    setRenderedSections({});

    const activeSectionIds: string[] = manifest.workspace.modes[mode] || [];
    const activeSections: WorkspaceSection[] = activeSectionIds
      .map(id => manifest.workspace.sections[id])
      .filter(Boolean);

    if (manifest.workspace.sections['navigation']) {
      activeSections.unshift(manifest.workspace.sections['navigation']);
    }

    activeSections.forEach(section => {
      section.widgets.forEach(widget => {
        scheduler.schedule(widget.priority || 'VISIBLE', async () => {
          try {
            const deps = await resolver.resolve(widget, context);
            if (deps.authorized) {
              setRenderedSections(prev => ({
                ...prev,
                [section.id]: [...(prev[section.id] || []), { widget, deps }],
              }));
            }
          } catch {
            // unauthorized or resolution failure — widget silently excluded
          }
        });
      });
    });
  }, [manifest, context, resolver, scheduler, mode]);

  const sectionOrder: string[] = [];
  if (manifest.workspace.sections['navigation']) sectionOrder.push('navigation');
  sectionOrder.push(...(manifest.workspace.modes[mode] || []));

  return (
    <>
      {sectionOrder.map(sectionId => {
        const section = manifest.workspace.sections[sectionId];
        if (!section) return null;

        const resolved   = renderedSections[sectionId] || [];
        const isNav      = sectionId === 'navigation';
        const isLoading  = resolved.length === 0;

        return (
          <div key={sectionId} className="keos-section">
            {!isNav && (
              <div className="keos-section-header">
                <span className="keos-section-label">
                  {SECTION_NAMES[sectionId] || sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).toUpperCase()}
                </span>
                <div className="keos-section-rule" />
              </div>
            )}
            <div className={`keos-widget-grid${isNav ? ' keos-widget-grid--nav' : ''}`}>
              {isLoading
                ? section.widgets.map(w => (
                    <div key={w.id} className="keos-widget-card">
                      <div className="keos-widget-card-header">
                        <span className="keos-widget-card-title">{w.title}</span>
                      </div>
                      <div className="keos-widget-card-body">
                        <div className="keos-widget-shimmer" />
                      </div>
                    </div>
                  ))
                : resolved.map(({ widget, deps }) => {
                    const Component = WidgetRegistry[widget.component] || WidgetRegistry['widget.unknown'];
                    return (
                      <div key={widget.id} className="keos-widget-card">
                        <div className="keos-widget-card-header">
                          <span className="keos-widget-card-title">{widget.title}</span>
                        </div>
                        <div className="keos-widget-card-body">
                          <Component widgetId={widget.id} context={context} deps={deps} />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        );
      })}
    </>
  );
};
