import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const health: any = viewModel.platformHealth ?? {};
    const pct: number = health.healthPercent ?? 0;
    const color = pct>=80?'var(--os-success)':pct>=50?'var(--os-warning)':'var(--os-danger)';
    return (
        <div>
            <h3>Health Monitor</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{color}}>{pct}%</span><label>Health</label></div>
                <div className="focus-card"><span className="count">{health.nominal??0}/{health.total??0}</span><label>Phases OK</label></div>
            </div>
        </div>
    );
};
export const HealthMonitorWidget = withWidgetContext(Core);
