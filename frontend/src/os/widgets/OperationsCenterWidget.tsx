import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const approvals: any[] = Array.isArray(viewModel.pendingExecutionApprovals) ? viewModel.pendingExecutionApprovals : [];
    const count: number = viewModel.pendingApprovalCount ?? approvals.length;
    return (
        <div>
            <h3>Operations Center</h3>
            <div className="focus-grid">
                <div className="focus-card"><span className="count">{count}</span><label>Pending</label></div>
                <div className="focus-card"><span className="count">{viewModel.confidence != null ? (viewModel.confidence * 100).toFixed(0) + '%' : '—'}</span><label>Confidence</label></div>
            </div>
            {approvals.slice(0, 3).map((a: any, i: number) => (
                <div key={i} className="mission-item">
                    <span className="mission-goal">{a.description ?? a.actionType ?? 'Action'}</span>
                    <button onClick={() => onAction('review', { id: a.id })}>Review</button>
                </div>
            ))}
        </div>
    );
};
export const OperationsCenterWidget = withWidgetContext(Core);
