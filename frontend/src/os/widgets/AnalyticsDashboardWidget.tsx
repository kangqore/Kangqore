import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const total: number = viewModel.totalPredictions ?? 0;
    const high: number  = viewModel.highConfidencePredictions ?? 0;
    const drifts: number = viewModel.activeDrifts ?? 0;
    return (
        <div>
            <h3>Analytics Dashboard</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{total}</span><label>Predictions</label></div>
                <div className="focus-card"><span className="count">{high}</span><label>High-Conf</label></div>
                <div className="focus-card"><span className="count">{drifts}</span><label>Drifts</label></div>
                <div className="focus-card"><span className="count">{viewModel.confidence!=null?((viewModel.confidence as number)*100).toFixed(0)+'%':'—'}</span><label>Confidence</label></div>
            </div>
        </div>
    );
};
export const AnalyticsDashboardWidget = withWidgetContext(Core);
