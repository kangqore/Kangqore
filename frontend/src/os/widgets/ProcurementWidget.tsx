import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';
const Core: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const all: any[] = Array.isArray(viewModel.pendingExecutionApprovals) ? viewModel.pendingExecutionApprovals : [];
    const items = all.slice(0, 4);
    return (
        <div>
            <h3>Procurement</h3>
            <div className="focus-card">
                <span className="count">{all.length}</span>
                <label>Pending Actions</label>
            </div>
            {items.length === 0 ? (
                <p className="empty-state">No pending procurement actions</p>
            ) : (
                items.map((a: any, i: number) => (
                    <div key={a.id ?? i} className="mission-item">
                        <span className="mission-goal">{a.description ?? a.actionType ?? 'Action Required'}</span>
                        <button onClick={() => onAction('approve', { id: a.id })} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', background: 'rgba(37,99,235,0.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.2)' }}>
                            Review
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};
export const ProcurementWidget = withWidgetContext(Core);
