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
                <span className="keos-section-label">{sectionId}</span>
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
