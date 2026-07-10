// Workspace Orchestrator — Generation III Runtime
// Full KEOS shell: workspace rail + mode selector + WEE projection pipeline.

import React, { useEffect, useRef, useState } from 'react';
import {
  UserIcon,
  BriefcaseIcon,
  TrendUpIcon,
  GearIcon,
  BrainIcon,
  HardDrivesIcon,
  UsersIcon,
  ScalesIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react';
import { useWaanda } from './WaandaKernel';
import { OrchestrationEngine } from './OrchestrationEngine';
import { WorkspaceTransitionManager } from './WorkspaceTransitionManager';
import { WidgetRuntime } from '../rendering/WidgetRuntime';
import {
  WaandaExperienceEngine,
  WaandaCognitiveMirror,
  bootWEE,
  ExperienceModel,
  DEFAULT_PROJECTION_POLICY,
} from '../wee';
import { WorkspaceMode } from '../types/manifest';
import './keos.css';

import { PersonalWorkspaceManifest }               from '../portals/PersonalWorkspace';
import { ExecutiveWorkspaceManifest }              from '../portals/ExecutiveWorkspace';
import { RevenueWorkspaceManifest }                from '../portals/RevenueWorkspace';
import { OperationsWorkspaceManifest }             from '../portals/OperationsWorkspace';
import { EnterpriseIntelligenceWorkspaceManifest } from '../portals/EnterpriseIntelligenceWorkspace';
import { PlatformWorkspaceManifest }               from '../portals/PlatformWorkspace';
import { CollaborationWorkspaceManifest }          from '../portals/CollaborationWorkspace';
import { GovernanceWorkspaceManifest }             from '../portals/GovernanceWorkspace';
import { EcosystemWorkspaceManifest }              from '../portals/EcosystemWorkspace';

const registry = {
  'wksp.personal':      PersonalWorkspaceManifest,
  'wksp.executive':     ExecutiveWorkspaceManifest,
  'wksp.revenue':       RevenueWorkspaceManifest,
  'wksp.operations':    OperationsWorkspaceManifest,
  'wksp.intelligence':  EnterpriseIntelligenceWorkspaceManifest,
  'wksp.platform':      PlatformWorkspaceManifest,
  'wksp.collaboration': CollaborationWorkspaceManifest,
  'wksp.governance':    GovernanceWorkspaceManifest,
  'wksp.ecosystem':     EcosystemWorkspaceManifest,
} as const;

type WorkspaceId = keyof typeof registry;

interface WorkspaceMeta {
  id: WorkspaceId;
  label: string;
  Icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'fill'; className?: string }>;
  color: string;
}

const WORKSPACE_META: WorkspaceMeta[] = [
  { id: 'wksp.personal',      label: 'Personal',      Icon: UserIcon,         color: '#2564ea' },
  { id: 'wksp.executive',     label: 'Executive',     Icon: BriefcaseIcon,    color: '#7c3aed' },
  { id: 'wksp.revenue',       label: 'Revenue',       Icon: TrendUpIcon,      color: '#059669' },
  { id: 'wksp.operations',    label: 'Operations',    Icon: GearIcon,         color: '#ea8b25' },
  { id: 'wksp.intelligence',  label: 'Intelligence',  Icon: BrainIcon,        color: '#4ab6d4' },
  { id: 'wksp.platform',      label: 'Platform',      Icon: HardDrivesIcon,   color: '#64748b' },
  { id: 'wksp.collaboration', label: 'Collaboration', Icon: UsersIcon,        color: '#0d9488' },
  { id: 'wksp.governance',    label: 'Governance',    Icon: ScalesIcon,       color: '#d97706' },
  { id: 'wksp.ecosystem',     label: 'Ecosystem',     Icon: ShareNetworkIcon, color: '#db2777' },
];

export const WorkspaceOrchestrator: React.FC = () => {
  const waanda = useWaanda();
  const [engine]        = useState(() => new OrchestrationEngine());
  const [transitionMgr] = useState(() => new WorkspaceTransitionManager());
  const booted = useRef(false);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>('wksp.personal');
  const [isTransitioning, setIsTransitioning]     = useState(false);
  const [experienceModel, setExperienceModel]      = useState<ExperienceModel | null>(null);
  const [currentMode, setCurrentMode]              = useState<WorkspaceMode>('DEFAULT');

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootWEE();
  }, []);

  const project = (id: WorkspaceId) => {
    const manifest = registry[id];
    const contract = {
      id: `contract.${id}`,
      projectionScope: manifest.workspace.cognitiveStateType,
      persona: 'OPERATOR' as const,
      requiredCapabilities: manifest.workspace.capabilities,
      context: {},
    };
    void WaandaExperienceEngine.project(contract, DEFAULT_PROJECTION_POLICY)
      .then(model => setExperienceModel(model));
  };

  useEffect(() => { project(activeWorkspaceId); }, [activeWorkspaceId]);

  useEffect(() => {
    const unsub = WaandaCognitiveMirror.subscribe(() => project(activeWorkspaceId));
    return unsub;
  }, [activeWorkspaceId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { directive, payload } = (e as CustomEvent).detail;
      if (directive === 'SWITCH_WORKSPACE' && payload.workspaceId in registry) {
        void performTransition(payload.workspaceId as WorkspaceId);
      }
    };
    window.addEventListener('WAANDA_DIRECTIVE', handler);
    return () => window.removeEventListener('WAANDA_DIRECTIVE', handler);
  }, [activeWorkspaceId]);

  const performTransition = async (targetId: WorkspaceId) => {
    if (!(targetId in registry) || targetId === activeWorkspaceId) return;
    setIsTransitioning(true);
    setExperienceModel(null);
    await transitionMgr.prepareTransition(activeWorkspaceId, targetId, waanda.state);
    setActiveWorkspaceId(targetId);
    setCurrentMode('DEFAULT');
    setIsTransitioning(false);
  };

  const activeManifest  = registry[activeWorkspaceId];
  const availableModes  = Object.keys(activeManifest.workspace.modes) as WorkspaceMode[];

  return (
    <div className="keos-shell">

      {/* ── Left Workspace Rail ── */}
      <nav className="keos-rail">
        <div className="keos-rail-eyebrow">Workspaces</div>
        {WORKSPACE_META.map(ws => {
          const isActive = activeWorkspaceId === ws.id;
          return (
            <button
              key={ws.id}
              className={`keos-ws-btn${isActive ? ' active' : ''}`}
              style={{ '--keos-ws-color': ws.color } as React.CSSProperties}
              onClick={() => void performTransition(ws.id)}
              title={ws.label}
            >
              <ws.Icon
                size={15}
                weight={isActive ? 'fill' : 'regular'}
                className="keos-ws-icon"
              />
              <span className="keos-ws-label">{ws.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Main Content ── */}
      <div className="keos-main">

        {/* Page Header */}
        <header className="keos-header">
          <div className="keos-header-left">
            <span className="keos-breadcrumb">KEOS</span>
            <span className="keos-breadcrumb-sep">›</span>
            <h1 className="keos-ws-title">{activeManifest.metadata.title}</h1>
            {isTransitioning && <span className="keos-transition-dot" />}
          </div>
          <div className="keos-mode-strip">
            {availableModes.map(mode => (
              <button
                key={mode}
                className={`keos-mode-pill${currentMode === mode ? ' active' : ''}`}
                onClick={() => setCurrentMode(mode)}
              >
                {mode.charAt(0) + mode.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Viewport */}
        <main className={`keos-viewport${isTransitioning ? ' transitioning' : ''}`}>
          {!experienceModel ? (
            <div className="keos-boot">
              <div className="keos-boot-ring" />
              <span>Projecting {activeManifest.metadata.title}…</span>
            </div>
          ) : (
            <WidgetRuntime
              manifest={activeManifest}
              context={experienceModel.payload ?? {}}
              mode={currentMode}
              policyAdapter={engine.getPolicyAdapter()}
              scheduler={engine.getScheduler()}
              resolver={engine.getResolver()}
            />
          )}
        </main>

      </div>
    </div>
  );
};
