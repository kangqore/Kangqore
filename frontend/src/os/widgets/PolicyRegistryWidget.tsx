import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const subsystems: Record<string,string> = (viewModel.subsystems as any) ?? {};
    const entries = Object.entries(subsystems);
    return (
        <div>
            <h3>Policy Registry</h3>
            <div className="focus-card"><span className="count">{entries.length}</span><label>Governed Subsystems</label></div>
            {entries.slice(0,5).map(([k,v],i)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{k}</span>
                    <span className="mission-status" style={{color:v==='OPERATIONAL'?'var(--os-success)':'var(--os-warning)'}}>{v}</span>
                </div>
            ))}
        </div>
    );
};
export const PolicyRegistryWidget = withWidgetContext(Core);
