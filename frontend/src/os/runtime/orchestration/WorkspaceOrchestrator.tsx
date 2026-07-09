// Workspace Orchestrator — Generation III Runtime
// Owns workspace switching, WEE projection per workspace render cycle.

import React, { useEffect, useRef, useState } from 'react';
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

import { PersonalWorkspaceManifest } from '../portals/PersonalWorkspace';
import { ExecutiveWorkspaceManifest } from '../portals/ExecutiveWorkspace';
import { RevenueWorkspaceManifest } from '../portals/RevenueWorkspace';

const registry = {
  'wksp.personal':  PersonalWorkspaceManifest,
  'wksp.executive': ExecutiveWorkspaceManifest,
  'wksp.revenue':   RevenueWorkspaceManifest,
} as const;

type WorkspaceId = keyof typeof registry;

export const WorkspaceOrchestrator: React.FC = () => {
  const waanda = useWaanda();
  const [engine]        = useState(() => new OrchestrationEngine());
  const [transitionMgr] = useState(() => new WorkspaceTransitionManager());
  const booted = useRef(false);

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>('wksp.personal');
  const [isTransitioning, setIsTransitioning]     = useState(false);
  const [experienceModel, setExperienceModel]      = useState<ExperienceModel | null>(null);

  // Boot WEE once — registers adapters + starts WaandaCognitiveMirror polling.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    bootWEE();
  }, []);

  // Re-project whenever the active workspace changes or WAANDA state is updated.
  useEffect(() => {
    const manifest = registry[activeWorkspaceId];
    const contract = {
      id: `contract.${activeWorkspaceId}`,
      projectionScope: manifest.workspace.cognitiveStateType,
      persona: 'OPERATOR' as const,
      requiredCapabilities: manifest.workspace.capabilities,
      context: {},
    };

    void WaandaExperienceEngine.project(contract, DEFAULT_PROJECTION_POLICY)
      .then(model => setExperienceModel(model));
  }, [activeWorkspaceId]);

  // Subscribe to WaandaCognitiveMirror so each poll re-projects the active workspace.
  useEffect(() => {
    const unsub = WaandaCognitiveMirror.subscribe(() => {
      const manifest = registry[activeWorkspaceId];
      const contract = {
        id: `contract.${activeWorkspaceId}`,
        projectionScope: manifest.workspace.cognitiveStateType,
        persona: 'OPERATOR' as const,
        requiredCapabilities: manifest.workspace.capabilities,
        context: {},
      };
      void WaandaExperienceEngine.project(contract, DEFAULT_PROJECTION_POLICY)
        .then(model => setExperienceModel(model));
    });
    return unsub;
  }, [activeWorkspaceId]);

  // Listen for WAANDA directive to switch workspaces.
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
    if (!(targetId in registry)) return;
    setIsTransitioning(true);
    await transitionMgr.prepareTransition(activeWorkspaceId, targetId, waanda.state);
    setActiveWorkspaceId(targetId);
    setIsTransitioning(false);
  };

  const activeManifest = registry[activeWorkspaceId];

  return (
    <div className="workspace-orchestrator">
      <nav className="os-workspace-switcher">
        <button onClick={() => void performTransition('wksp.personal')}  className={activeWorkspaceId === 'wksp.personal'  ? 'active' : ''}>Personal</button>
        <button onClick={() => void performTransition('wksp.executive')} className={activeWorkspaceId === 'wksp.executive' ? 'active' : ''}>Executive</button>
        <button onClick={() => void performTransition('wksp.revenue')}   className={activeWorkspaceId === 'wksp.revenue'   ? 'active' : ''}>Revenue</button>
      </nav>

      <main className={`workspace-viewport ${isTransitioning ? 'transitioning' : ''}`}>
        {activeManifest && (
          <WidgetRuntime
            manifest={activeManifest}
            context={experienceModel?.payload ?? {}}
            policyAdapter={engine.getPolicyAdapter()}
            scheduler={engine.getScheduler()}
            resolver={engine.getResolver()}
          />
        )}
      </main>
    </div>
  );
};
