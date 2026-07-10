import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const preds: any[] = Array.isArray(viewModel.predictions) ? viewModel.predictions : [];
    const drifts = preds.filter((p:any)=>p.driftDetected);
    const targets = [...new Set(preds.map((p:any)=>p.target))];
    return (
        <div>
            <h3>Pattern Explorer</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{targets.length}</span><label>Targets</label></div>
                <div className="focus-card"><span className="count">{drifts.length}</span><label>Drift Patterns</label></div>
            </div>
            {targets.slice(0,4).map((t:string,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{t}</span>
                    <span className="mission-status">{preds.filter((p:any)=>p.target===t).length} signals</span>
                </div>
            ))}
        </div>
    );
};
export const PatternExplorerWidget = withWidgetContext(Core);
