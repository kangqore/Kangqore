import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const exposure: any[] = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : [];
    const conf: number = viewModel.platformConfidence ?? 0;
    return (
        <div>
            <h3>Simulation Ledger</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{exposure.length}</span><label>Scenarios</label></div>
                <div className="focus-card"><span className="count">{(conf*100).toFixed(0)}%</span><label>Confidence</label></div>
            </div>
        </div>
    );
};
export const SimulationLedgerWidget = withWidgetContext(Core);
