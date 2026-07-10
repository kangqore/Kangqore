import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = Array.isArray(viewModel.complianceBriefings) ? viewModel.complianceBriefings : [];
    return (
        <div>
            <h3>Policy Center</h3>
            <div className="focus-card"><span className="count">{briefings.length}</span><label>Active Policies</label></div>
            {briefings.map((b:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{b.summary?.slice(0,48)??'Policy'}</span>
                    <span className="mission-status">{b.priority}</span>
                </div>
            ))}
        </div>
    );
};
export const PolicyCenterWidget = withWidgetContext(Core);
