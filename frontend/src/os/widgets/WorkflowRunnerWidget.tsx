import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = Array.isArray(viewModel.operationalDomains) ? viewModel.operationalDomains : [];
    const synthesis: string|null = viewModel.kimmSynthesis ?? null;
    return (
        <div>
            <h3>Workflow Runner</h3>
            {synthesis && <p className="empty-state" style={{color:'var(--os-cyan)',fontSize:11}}>{synthesis}</p>}
            {domains.slice(0,4).map((d:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{d.name}</span>
                    <span className="mission-status">{d.ready?'Active':'Idle'}</span>
                </div>
            ))}
        </div>
    );
};
export const WorkflowRunnerWidget = withWidgetContext(Core);
