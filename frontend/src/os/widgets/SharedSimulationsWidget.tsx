import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const evidence: any[] = Array.isArray(viewModel.evidenceLedger) ? viewModel.evidenceLedger : [];
    return (
        <div>
            <h3>Shared Simulations</h3>
            <div className="focus-card"><span className="count">{evidence.length}</span><label>Evidence Records</label></div>
            {evidence.slice(0,3).map((e:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{e.factKey}</span>
                    <span className="mission-status">{(e.confidence*100).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};
export const SharedSimulationsWidget = withWidgetContext(Core);
