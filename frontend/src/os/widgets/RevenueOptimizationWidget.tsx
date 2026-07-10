import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RevenueOptimizationWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const highConf: number  = viewModel.highConfidencePredictions ?? 0;
    const drifts: number    = viewModel.activeDrifts ?? 0;
    const totalPred: number = viewModel.totalPredictions ?? 0;
    const briefings: any[]  = viewModel.analyticsBriefings ?? [];
    return (
        <div className="revenue-optimization-widget">
            <h3>Revenue Optimization</h3>
            <div className="optimization-metrics">
                <div className="metric">
                    <span className="value">{highConf}</span>
                    <label>High-Confidence Signals</label>
                </div>
                <div className="metric">
                    <span className="value">{drifts}</span>
                    <label>Active Drifts</label>
                </div>
            </div>
            {briefings[0]?.recommendations?.slice(0, 2).map((r: string, i: number) => (
                <p key={i} className="optimization-rec">↗ {r}</p>
            ))}
            {totalPred > 0 && <p className="total-pred">{totalPred} predictions analyzed</p>}
        </div>
    );
};

export const RevenueOptimizationWidget = withWidgetContext(RevenueOptimizationWidgetCore);
