import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const phases: any[] = Array.isArray(viewModel.phases) ? viewModel.phases : [];
    return (
        <div>
            <h3>Log Explorer</h3>
            {phases.length===0?<p className="empty-state">No log entries</p>:phases.map((p:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{p.name}</span>
                    <span className="mission-status" style={{color:p.status==='PASS'?'var(--os-success)':p.status==='WARN'?'var(--os-warning)':'var(--os-danger)'}}>{p.status}{p.duration?` ${p.duration}ms`:''}</span>
                </div>
            ))}
        </div>
    );
};
export const LogExplorerWidget = withWidgetContext(Core);
