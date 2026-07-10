import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const preds: any[] = Array.isArray(viewModel.predictions) ? viewModel.predictions : [];
    return (
        <div>
            <h3>Prediction Center</h3>
            {preds.length===0?<p className="empty-state">No predictions</p>:preds.slice(0,4).map((p:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{p.target} — {p.horizon}</span>
                    <span className={`mission-status`}>{(p.confidence*100).toFixed(0)}%{p.driftDetected?' ⚠':''}</span>
                </div>
            ))}
        </div>
    );
};
export const PredictionCenterWidget = withWidgetContext(Core);
