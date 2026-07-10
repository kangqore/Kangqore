import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : [];
    return (
        <div>
            <h3>Reports</h3>
            <div className="focus-card"><span className="count">{briefings.length}</span><label>Available Reports</label></div>
            {briefings.slice(0,4).map((b:any,i:number)=>(
                <div key={i} className="mission-item">
                    <span className="mission-goal">{b.summary?.slice(0,50)??'Report'}</span>
                    <span className="mission-status">{b.priority}</span>
                </div>
            ))}
        </div>
    );
};
export const ReportsWidget = withWidgetContext(Core);
