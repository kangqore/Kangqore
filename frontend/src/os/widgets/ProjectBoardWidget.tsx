import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.ecosystemDomains) ? viewModel.ecosystemDomains : [];
    return (
        <div>
            <h3>Project Board</h3>
            {domains.length===0?<p className="empty-state">No projects</p>:domains.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status" style={{color:d.ready?'var(--os-success)':'var(--os-text-4)'}}>{d.ready?'Active':'Pending'}</span>
                </div>
            ))}
        </div>
    );
};
export const ProjectBoardWidget = withWidgetContext(Core);
