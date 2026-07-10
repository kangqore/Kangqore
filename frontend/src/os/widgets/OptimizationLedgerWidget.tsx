import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const total: number = viewModel.totalBreachedKpis ?? 0;
    const conf: number  = viewModel.platformConfidence ?? 0;
    return (
        <div>
            <h3>Optimization Ledger</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{total}</span><label>Open Items</label></div>
                <div className="focus-card"><span className="count">{(conf*100).toFixed(0)}%</span><label>Platform Health</label></div>
            </div>
        </div>
    );
};
export const OptimizationLedgerWidget = withWidgetContext(Core);
