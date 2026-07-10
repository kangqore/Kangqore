import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = Array.isArray(viewModel.complianceBriefings) ? viewModel.complianceBriefings : [];
    const total: number = viewModel.totalBreachedKpis ?? 0;
    const status = total===0?'Compliant':'Non-Compliant';
    const color = total===0?'var(--os-success)':'var(--os-danger)';
    return (
        <div>
            <h3>Compliance Center</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count" style={{fontSize:12,color}}>{status}</span><label>Status</label></div>
                <div className="focus-card"><span className="count">{briefings.length}</span><label>Briefings</label></div>
            </div>
        </div>
    );
};
export const ComplianceCenterWidget = withWidgetContext(Core);
