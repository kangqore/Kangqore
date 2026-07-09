// Widget Runtime
// Generation III Runtime

import React, { useEffect, useState } from 'react';
import { WorkspaceManifest, WorkspaceMode, WorkspaceSection } from '../types/manifest';
import { PolicyAdapter } from '../workspace/PolicyAdapter';
import { RuntimeScheduler } from '../workspace/RuntimeScheduler';
import { WidgetDependencyResolver } from '../workspace/WidgetDependencyResolver';

interface WidgetRuntimeProps {
    manifest: WorkspaceManifest;
    context: any;
    policyAdapter: PolicyAdapter;
    scheduler: RuntimeScheduler;
    resolver: WidgetDependencyResolver;
}

import { WidgetRegistry } from './WidgetRegistry';

/**
 * The Upgraded Widget Runtime supporting Dynamic Sections, Modes, and WAANDA Orchestration.
 */
export const WidgetRuntime: React.FC<WidgetRuntimeProps> = ({ manifest, context, policyAdapter, scheduler, resolver }) => {
    const [renderedSections, setRenderedSections] = useState<Record<string, any[]>>({});
    const [currentMode, setCurrentMode] = useState<WorkspaceMode>('DEFAULT');

    useEffect(() => {
        setRenderedSections({}); // Prevent memory leak and widget accumulation on mode change
        
        const activeSectionIds = manifest.workspace.modes[currentMode] || [];
        const activeSections: WorkspaceSection[] = activeSectionIds
            .map(id => manifest.workspace.sections[id])
            .filter(Boolean);
            
        // Anchor the navigation section
        if (manifest.workspace.sections['navigation']) {
            activeSections.unshift(manifest.workspace.sections['navigation']);
        }

        activeSections.forEach(section => {
            section.widgets.forEach(widget => {
                scheduler.schedule(widget.priority || 'VISIBLE', async () => {
                    try {
                        const deps = await resolver.resolve(widget, context);
                        if (deps.authorized) {
                            setRenderedSections(prev => {
                                const sectionWidgets = prev[section.id] || [];
                                return {
                                    ...prev,
                                    [section.id]: [...sectionWidgets, { widget, deps }]
                                };
                            });
                        }
                    } catch (e) {
                        console.warn(`[WidgetRuntime] Blocked rendering of ${widget.id}:`, e);
                    }
                });
            });
        });
    }, [manifest, context, resolver, scheduler, currentMode]);

    return (
        <div className={`workspace-runtime mode-${currentMode.toLowerCase()}`}>
            <header className="workspace-header">
                <h2>{manifest.metadata.title}</h2>
                <div className="mode-selector">
                    <button onClick={() => setCurrentMode('FOCUS')}>Focus Mode</button>
                    <button onClick={() => setCurrentMode('MEETING')}>Meeting Mode</button>
                    <button onClick={() => setCurrentMode('DEFAULT')}>Default Mode</button>
                </div>
            </header>
            
            <div className="sections-container">
                {Object.entries(renderedSections).map(([sectionId, widgets]) => (
                    <section key={sectionId} className={`workspace-section section-${sectionId}`}>
                        <h3>{manifest.workspace.sections[sectionId]?.id.toUpperCase()}</h3>
                        <div className="widget-grid">
                            {widgets.map(({ widget, deps }) => {
                                const ResolvedComponent = WidgetRegistry[widget.component] || WidgetRegistry['widget.unknown'];
                                return (
                                    <div key={widget.id} className="widget-container" data-widget-id={widget.id}>
                                        <div className="widget-header">{widget.title}</div>
                                        <div className="widget-body">
                                            <ResolvedComponent widgetId={widget.id} context={context} deps={deps} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};
