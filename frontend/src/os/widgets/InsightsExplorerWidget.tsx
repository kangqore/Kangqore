import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = Array.isArray(viewModel.analyticsBriefings) ? viewModel.analyticsBriefings : [];
    return (
        <div>
            <h3>Insights Explorer</h3>
            {briefings.length===0?<p className="empty-state">No insights available</p>:briefings.map((b:any,i:number)=>(
                <div key={i} className="mission-item" style={{flexDirection:'column',alignItems:'flex-start',gap:4}}>
                    <span className="mission-goal">{b.summary}</span>
                    <span className="mission-status">{(b.confidence*100).toFixed(0)}% · {b.priority}</span>
                </div>
            ))}
        </div>
    );
};
export const InsightsExplorerWidget = withWidgetContext(Core);
