// Workspace Orchestrator — Generation III Runtime
// Full KEOS shell: workspace rail + mode selector + WEE projection pipeline.

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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


export const WorkspaceOrchestrator: React.FC = () => {
  const waanda = useWaanda();
  const [engine]        = useState(() => new OrchestrationEngine());
  const [transitionMgr] = useState(() => new WorkspaceTransitionManager());
  const booted = useRef(false);

  const [searchParams] = useSearchParams();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>(() => {
    const ws = `wksp.${searchParams.get('workspace')}` as WorkspaceId;
    return ws in registry ? ws : 'wksp.personal';
  });
  const [isTransitioning, setIsTransitioning]     = useState(false);
  const [experienceModel, setExperienceModel]      = useState<ExperienceModel | null>(null);
  const [currentMode, setCurrentMode]              = useState<WorkspaceMode>('DEFAULT');

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootWEE();
    return () => WaandaCognitiveMirror.stop();
  }, []);

  const project = (id: WorkspaceId) => {
    const manifest = registry[id];
    const contract = {
      id: `contract.${id}`,
      projectionScope: manifest.workspace.cognitiveStateType,
      persona: 'OPERATOR' as const,
      requiredCapabilities: manifest.workspace.capabilities,
      context: { workspaceId: id, workspaceTitle: manifest.metadata.title },
    };
    void WaandaExperienceEngine.project(contract, DEFAULT_PROJECTION_POLICY)
      .then(model => setExperienceModel(model));
  };

  useEffect(() => {
    const ws = `wksp.${searchParams.get('workspace')}` as WorkspaceId;
    if (ws in registry && ws !== activeWorkspaceId) void performTransition(ws);
  }, [searchParams]);

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
