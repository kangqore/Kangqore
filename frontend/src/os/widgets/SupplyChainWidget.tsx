import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const forecasts: any[] = Array.isArray(viewModel.capacityForecasts) ? viewModel.capacityForecasts : [];
    return (
        <div>
            <h3>Supply Chain</h3>
            {forecasts.length === 0 ? <p className="empty-state">No capacity forecasts</p> : forecasts.slice(0,4).map((f:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{f.target} — {f.horizon}</span>
                    <span className={`mission-status`}>{(f.confidence*100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};
export const SupplyChainWidget = withWidgetContext(Core);
