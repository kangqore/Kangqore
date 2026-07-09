// Base Widget — Generation III Runtime
// Higher-order component wrapping all widgets.
// Receives viewModel from WEE-projected context — never fetches independently.

import React, { useState, useEffect } from 'react';
import { WidgetState } from '../types/manifest';
import { RuntimeContainer } from '../core/RuntimeContainer';
import { RuntimeHealth } from '../core/RuntimeHealth';

export interface WidgetProps {
  viewModel: any;
  capabilities: Record<string, (inputs: any) => Promise<any>>;
  onAction: (actionType: string, payload: any) => void;
  widgetState: WidgetState;
}

export function withWidgetContext<P extends WidgetProps>(WrappedComponent: React.ComponentType<P>) {
  return function WidgetWrapper(
    props: Omit<P, keyof WidgetProps> & { widgetId: string; context: Record<string, unknown>; deps: any }
  ) {
    const { widgetId, context, deps, ...rest } = props;
    const [widgetState, setWidgetState] = useState<WidgetState>('LOADING');
    const [viewModel, setViewModel] = useState<any>(null);

    useEffect(() => {
      if (!deps.authorized) {
        setWidgetState('UNAUTHORIZED');
        return;
      }

      const container = RuntimeContainer.getInstance();
      const health = container.resolve<RuntimeHealth>('RuntimeHealth');
      health.recordPolicyCheck();

      const start = performance.now();

      // context is ExperienceModel.payload projected by WEE — no API call here.
      // Scope by widgetId first; fall back to the full workspace payload.
      const data = (context[widgetId] ?? context) as Record<string, unknown>;
      health.recordViewModelLatency(performance.now() - start);

      if (!data || Object.keys(data).length === 0) {
        setWidgetState('EMPTY');
      } else {
        setViewModel(data);
        setWidgetState('NORMAL');
      }
    }, [widgetId, context, deps.authorized]);

    const handleAction = async (actionType: string, payload: any) => {
      const fn = deps.capabilities?.[actionType];
      if (fn) {
        const container = RuntimeContainer.getInstance();
        const health = container.resolve<RuntimeHealth>('RuntimeHealth');
        health.recordCommandStart();
        try {
          await fn(payload);
        } catch (error) {
          console.error(`[BaseWidget] Action ${actionType} failed`, error);
        } finally {
          health.recordCommandEnd();
        }
      }
    };

    if (widgetState === 'LOADING')      return <div className="widget-shell state-loading">Loading…</div>;
    if (widgetState === 'UNAUTHORIZED') return <div className="widget-shell state-unauthorized">Unauthorized</div>;
    if (widgetState === 'OFFLINE')      return <div className="widget-shell state-offline">Offline</div>;
    if (widgetState === 'ERROR')        return <div className="widget-shell state-error">Error Loading Widget</div>;
    if (widgetState === 'EMPTY')        return <div className="widget-shell state-empty">No Data Available</div>;

    return (
      <div className={`widget-shell state-${widgetState.toLowerCase()}`}>
        <WrappedComponent
          {...(rest as unknown as P)}
          viewModel={viewModel}
          capabilities={deps.capabilities ?? {}}
          onAction={handleAction}
          widgetState={widgetState}
        />
      </div>
    );
  };
}
