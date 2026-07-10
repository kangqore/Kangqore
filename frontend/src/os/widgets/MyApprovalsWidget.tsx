import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyApprovalsWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const approvals: any[] = viewModel.pendingApprovals ?? viewModel.pendingDecisions ?? [];
    return (
        <div className="my-approvals-widget">
            <h3>My Approvals</h3>
            {approvals.length === 0 ? (
                <p className="empty-state">No pending approvals</p>
            ) : (
                <ul className="approval-list">
                    {approvals.slice(0, 5).map((a: any, i: number) => (
                        <li key={i} className="approval-item">
                            <span className="approval-desc">{a.description ?? a.actionType ?? 'Approval required'}</span>
                            <div className="approval-actions">
                                <button onClick={() => onAction('approve', { id: a.id })}>Approve</button>
                                <button onClick={() => onAction('reject', { id: a.id })}>Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {approvals.length > 5 && (
                <p className="overflow-count">+{approvals.length - 5} more</p>
            )}
        </div>
    );
};

export const MyApprovalsWidget = withWidgetContext(MyApprovalsWidgetCore);
