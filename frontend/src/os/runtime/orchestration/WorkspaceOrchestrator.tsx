// Workspace Orchestrator — Generation III Runtime
// Full KEOS shell: workspace rail + mode selector + live workspace page routing.
// S79: WEE projection replaced with direct React Query workspace pages.

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWaanda } from './WaandaKernel';
import { OrchestrationEngine } from './OrchestrationEngine';
import { WorkspaceTransitionManager } from './WorkspaceTransitionManager';
import { WorkspaceMode } from '../types/manifest';
import { User, Briefcase, TrendingUp, Wrench, Brain, Terminal, Globe, Users, ShieldCheck } from 'lucide-react';
import './keos.css';

// ── Manifest registry (metadata + modes only) ────────────────────────────────
import { PersonalWorkspaceManifest }               from '../portals/PersonalWorkspace';
import { ExecutiveWorkspaceManifest }              from '../portals/ExecutiveWorkspace';
import { RevenueWorkspaceManifest }                from '../portals/RevenueWorkspace';
import { OperationsWorkspaceManifest }             from '../portals/OperationsWorkspace';
import { EnterpriseIntelligenceWorkspaceManifest } from '../portals/EnterpriseIntelligenceWorkspace';
import { PlatformWorkspaceManifest }               from '../portals/PlatformWorkspace';
import { CollaborationWorkspaceManifest }          from '../portals/CollaborationWorkspace';
import { GovernanceWorkspaceManifest }             from '../portals/GovernanceWorkspace';
import { EcosystemWorkspaceManifest }              from '../portals/EcosystemWorkspace';

// ── S79: Production workspace page components ────────────────────────────────
import { PersonalWorkspacePage }      from '../portals/pages/PersonalWorkspacePage';
import { ExecutiveWorkspacePage }     from '../portals/pages/ExecutiveWorkspacePage';
import { RevenueWorkspacePage }       from '../portals/pages/RevenueWorkspacePage';
import { OperationsWorkspacePage }    from '../portals/pages/OperationsWorkspacePage';
import { IntelligenceWorkspacePage }  from '../portals/pages/IntelligenceWorkspacePage';
import { PlatformWorkspacePage }      from '../portals/pages/PlatformWorkspacePage';
import { EcosystemWorkspacePage }     from '../portals/pages/EcosystemWorkspacePage';
import { CollaborationWorkspacePage } from '../portals/pages/CollaborationWorkspacePage';
import { GovernanceWorkspacePage }    from '../portals/pages/GovernanceWorkspacePage';

const WORKSPACE_ICONS = {
  'wksp.personal':      User,
  'wksp.executive':     Briefcase,
  'wksp.revenue':       TrendingUp,
  'wksp.operations':    Wrench,
  'wksp.intelligence':  Brain,
  'wksp.platform':      Terminal,
  'wksp.ecosystem':     Globe,
  'wksp.collaboration': Users,
  'wksp.governance':    ShieldCheck,
} as const;

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

const WORKSPACE_PAGES: Record<string, React.ComponentType> = {
  'wksp.personal':      PersonalWorkspacePage,
  'wksp.executive':     ExecutiveWorkspacePage,
  'wksp.revenue':       RevenueWorkspacePage,
  'wksp.operations':    OperationsWorkspacePage,
  'wksp.intelligence':  IntelligenceWorkspacePage,
  'wksp.platform':      PlatformWorkspacePage,
  'wksp.ecosystem':     EcosystemWorkspacePage,
  'wksp.collaboration': CollaborationWorkspacePage,
  'wksp.governance':    GovernanceWorkspacePage,
};

type WorkspaceId = keyof typeof registry;

export const WorkspaceOrchestrator: React.FC = () => {
  const waanda = useWaanda();
  const [engine]        = useState(() => new OrchestrationEngine());
  const [transitionMgr] = useState(() => new WorkspaceTransitionManager());

  const [searchParams] = useSearchParams();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>(() => {
    const ws = `wksp.${searchParams.get('workspace')}` as WorkspaceId;
    return ws in registry ? ws : 'wksp.personal';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentMode, setCurrentMode]          = useState<WorkspaceMode>('DEFAULT');

  useEffect(() => {
    const ws = `wksp.${searchParams.get('workspace')}` as WorkspaceId;
    if (ws in registry && ws !== activeWorkspaceId) void performTransition(ws);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: Event) => {
      const { directive, payload } = (e as CustomEvent).detail;
      if (directive === 'SWITCH_WORKSPACE' && payload.workspaceId in registry) {
        void performTransition(payload.workspaceId as WorkspaceId);
      }
    };
    window.addEventListener('WAANDA_DIRECTIVE', handler);
    return () => window.removeEventListener('WAANDA_DIRECTIVE', handler);
  }, [activeWorkspaceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const performTransition = async (targetId: WorkspaceId) => {
    if (!(targetId in registry) || targetId === activeWorkspaceId) return;
    setIsTransitioning(true);
    await transitionMgr.prepareTransition(activeWorkspaceId, targetId, waanda.state);
    setActiveWorkspaceId(targetId);
    setCurrentMode('DEFAULT');
    setIsTransitioning(false);
  };

  const activeManifest = registry[activeWorkspaceId];
  const availableModes = Object.keys(activeManifest.workspace.modes) as WorkspaceMode[];
  const WsIcon         = WORKSPACE_ICONS[activeWorkspaceId] || Brain;
  const ActivePage     = WORKSPACE_PAGES[activeWorkspaceId] ?? PersonalWorkspacePage;

  return (
    <div className="keos-shell admin-bento-theme">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#e0ebff] via-[#f0f8ff] to-[#f5ffd8]" />

      <div className="keos-main">

        {/* Page Header */}
        <header className="keos-header">
          <div className="keos-header-left">
            <span className="keos-breadcrumb">KEOS</span>
            <span className="keos-breadcrumb-sep">›</span>
            <div className="flex items-center gap-2">
              <WsIcon className="w-5 h-5 text-blue-600/80" />
              <h1 className="keos-ws-title">{activeManifest.metadata.title}</h1>
            </div>
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

        {/* Viewport — renders the live workspace page */}
        <main className={`keos-viewport${isTransitioning ? ' transitioning' : ''}`}>
          {isTransitioning ? (
            <div className="keos-boot">
              <div className="keos-boot-ring" />
              <span>Switching to {activeManifest.metadata.title}…</span>
            </div>
          ) : (
            <ActivePage />
          )}
        </main>

      </div>
    </div>
  );
};
