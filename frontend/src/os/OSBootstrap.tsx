// OS Bootstrap Entrypoint
// Generation III Runtime

import React, { useEffect, useState } from 'react';
import { WaandaProvider } from './runtime/orchestration/WaandaKernel';
import { WorkspaceOrchestrator } from './runtime/orchestration/WorkspaceOrchestrator';
import { RuntimeContainer } from './runtime/core/RuntimeContainer';
import { ExperienceAPI } from './runtime/experience/ExperienceAPI';
import { CapabilityBroker } from './runtime/workspace/CapabilityBroker';
import { PolicyAdapter } from './runtime/workspace/PolicyAdapter';
import { RuntimeHealth } from './runtime/core/RuntimeHealth';
import { EventBus } from './runtime/workspace/EventBus';
import { SessionManager } from './runtime/workspace/SessionManager';
import { ActivityRuntime } from './runtime/workspace/ActivityRuntime';
import { NotificationRuntime } from './runtime/workspace/NotificationRuntime';
import { NavigationGraph } from './runtime/workspace/NavigationGraph';
import { LayoutEngine } from './runtime/workspace/LayoutEngine';
import { SyncRuntime } from './runtime/workspace/SyncRuntime';
import { CompositionEngine } from './runtime/workspace/CompositionEngine';
import { LifecycleEngine } from './runtime/workspace/LifecycleEngine';
import { DependencyGraph } from './runtime/workspace/DependencyGraph';
import { WaandaAIProvider } from './runtime/workspace/WaandaAIProvider';
import { useAuthStore, UserRole } from './store/auth';
import './os.css';

const ROLE_POLICIES: Record<UserRole, string[]> = {
  ADMIN: [
    'role.admin', 'role.executive', 'role.sales',
    'role.ops', 'role.analyst', 'role.platform',
    'role.member', 'role.governance', 'role.ecosystem',
    'cap.ai.plan', 'cap.ai.forecast', 'cap.ai.simulate',
    'cap.ai.analyze',        // Intelligence workspace WAANDA
    'cap.ops.execute',       // Operations workspace WAANDA
    'cap.collab.facilitate', // Collaboration workspace WAANDA
    'cap.platform.admin',    // Platform workspace WAANDA
    'cap.ecosystem.manage',  // Ecosystem workspace WAANDA
  ],
  EXECUTIVE:  ['role.executive', 'role.sales', 'cap.ai.plan', 'cap.ai.forecast'],
  TEAM:       ['role.team', 'role.member', 'cap.ai.plan'],
  ANALYST:    ['role.analyst', 'cap.ai.forecast'],
  CLIENT:     ['role.client'],
  PARTNER:    ['role.partner'],
  INVESTOR:   ['role.investor'],
  JOB_SEEKER: ['role.job_seeker'],
  JOURNALIST: ['role.journalist'],
};

/**
 * The root entrypoint for the Kangqore Enterprise OS.
 * This mounts the WAANDA Kernel (Supreme Intelligence) at the absolute top,
 * which then renders the Workspace Orchestrator (Shell Manager).
 */
export const OSBootstrap: React.FC = () => {
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        // Formally Bootstrap the Composition Root
        const container = RuntimeContainer.getInstance();
        
        const eventBus = new EventBus();
        const dependencyGraph = new DependencyGraph();
        const policyAdapter = new PolicyAdapter();
        const health = RuntimeHealth.getInstance();

        const user = useAuthStore.getState().user;
        const policies = user ? (ROLE_POLICIES[user.role] ?? ['role.viewer']) : ['role.viewer'];
        policyAdapter.loadPolicies(policies);
        
        container.register('ExperienceAPI', ExperienceAPI.getInstance());

        // Register CapabilityBroker and wire all WAANDA AI providers at boot time.
        // One provider per capability ID — all route to POST /api/admin/waanda/query.
        const capabilityBroker = new CapabilityBroker();
        const AI_CAPABILITIES = [
          'cap.ai.plan', 'cap.ai.forecast', 'cap.ai.simulate',
          'cap.ai.analyze', 'ecf.waanda', 'epf.tasks', 'edf.search',
        ];
        for (const capId of AI_CAPABILITIES) {
          capabilityBroker.registerProvider(capId, new WaandaAIProvider(capId));
        }
        container.register('CapabilityBroker', capabilityBroker);

        container.register('PolicyAdapter', policyAdapter);
        container.register('RuntimeHealth', health);
        
        // Phase 5.27 P1 Fix: Register all workspace core services
        container.register('EventBus', eventBus);
        container.register('DependencyGraph', dependencyGraph);
        container.register('SessionManager', new SessionManager());
        container.register('ActivityRuntime', new ActivityRuntime());
        container.register('NotificationRuntime', new NotificationRuntime());
        container.register('NavigationGraph', new NavigationGraph());
        container.register('LayoutEngine', new LayoutEngine());
        container.register('SyncRuntime', new SyncRuntime());
        container.register('CompositionEngine', new CompositionEngine(dependencyGraph, policyAdapter));
        container.register('LifecycleEngine', new LifecycleEngine(eventBus, health));

        console.log(`[OSBootstrap] Generation III Runtime booted with services:`, container.getRegisteredKeys());
        setBooted(true);
    }, []);

    if (!booted) return <div className="os-boot-screen">Booting Kangqore OS...</div>;

    return (
        <WaandaProvider>
            <WorkspaceOrchestrator />
        </WaandaProvider>
    );
};

export default OSBootstrap;
