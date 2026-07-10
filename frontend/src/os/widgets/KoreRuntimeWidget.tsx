import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const status: string = viewModel.bootStatus ?? 'UNKNOWN';
    const phases: any[] = Array.isArray(viewModel.phases) ? viewModel.phases : [];
    const health: any = viewModel.platformHealth ?? {};
    return (
        <div>
            <h3>KORE Runtime</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{fontSize:13,color:status==='OPERATIONAL'?'var(--os-success)':'var(--os-warning)'}}>{status}</span><label>Status</label></div>
                <div className="focus-card"><span className="count">{health.healthPercent??0}%</span><label>Health</label></div>
            </div>
            {phases.slice(0,4).map((p:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{p.name}</span>
                    <span className="mission-status" style={{color:p.status==='PASS'?'var(--os-success)':'var(--os-danger)'}}>{p.status}</span>
                </div>
            ))}
        </div>
    );
};
export const KoreRuntimeWidget = withWidgetContext(Core);
