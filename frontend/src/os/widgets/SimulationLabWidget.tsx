import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const drifts: number = viewModel.activeDrifts ?? 0;
    const preds: any[] = Array.isArray(viewModel.predictions) ? viewModel.predictions : [];
    const driftItems = preds.filter((p:any)=>p.driftDetected);
    return (
        <div>
            <h3>Simulation Lab</h3>
            <div className="focus-card"><span className="count">{drifts}</span><label>Active Drifts</label></div>
            {driftItems.slice(0,3).map((p:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{p.target}</span>
                    <span className="mission-status" style={{color:'var(--os-warning)'}}>DRIFT</span>
                </div>
            ))}
            {driftItems.length===0&&<p className="empty-state">No active drifts</p>}
        </div>
    );
};
export const SimulationLabWidget = withWidgetContext(Core);
