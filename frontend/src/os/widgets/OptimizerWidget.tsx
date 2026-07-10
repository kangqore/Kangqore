import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const high: number = viewModel.highConfidencePredictions ?? 0;
    const total: number = viewModel.totalPredictions ?? 0;
    const pct = total>0?Math.round((high/total)*100):0;
    return (
        <div>
            <h3>Optimizer</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{pct}%</span><label>Signal Quality</label></div>
                <div className="focus-card"><span className="count">{high}</span><label>Actionable</label></div>
            </div>
        </div>
    );
};
export const OptimizerWidget = withWidgetContext(Core);
