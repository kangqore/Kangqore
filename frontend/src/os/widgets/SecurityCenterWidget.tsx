import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const health: any = viewModel.platformHealth ?? {};
    const status: string = viewModel.bootStatus ?? 'UNKNOWN';
    const conf: number = (viewModel.confidence as number) ?? 0;
    return (
        <div>
            <h3>Security Center</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{fontSize:12,color:status==='OPERATIONAL'?'var(--os-success)':'var(--os-warning)'}}>{status}</span><label>Platform</label></div>
                <div className="focus-card"><span className="count">{(conf*100).toFixed(0)}%</span><label>Trust</label></div>
            </div>
        </div>
    );
};
export const SecurityCenterWidget = withWidgetContext(Core);
