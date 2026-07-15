import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const forecasts: any[] = Array.isArray(viewModel.capacityForecasts) ? viewModel.capacityForecasts : [];
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    const readyCount = domains.filter((d: any) => d.ready).length;
    return (
        <div>
            <h3>Supply & Capacity</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{readyCount}</span><label>Domains Ready</label></div>
                <div className="focus-card"><span className="count">{forecasts.length}</span><label>Forecasts</label></div>
            </div>
            {forecasts.length === 0 ? (
                <p className="empty-state">No capacity forecasts available</p>
            ) : (
                forecasts.slice(0, 4).map((f: any, i: number) => (
                    <div key={f.id ?? i} className="mission-item">
                        <span className="mission-goal">{f.target}{f.horizon ? ` · ${f.horizon}` : ''}</span>
                        <span className="mission-status">
                            {f.confidence != null ? `${(f.confidence * 100).toFixed(0)}%` : '—'}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};
export const SupplyChainWidget = withWidgetContext(Core);
