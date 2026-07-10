import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const QuotationsWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const approvals: any[] = viewModel.pendingApprovals ?? viewModel.pendingDecisions ?? [];
    const quoteApprovals   = approvals.filter((a: any) =>
        (a.actionType ?? '').toLowerCase().includes('quote') ||
        (a.description ?? '').toLowerCase().includes('quote')
    );
    return (
        <div className="quotations-widget">
            <h3>Quotations</h3>
            <div className="quote-count">
                <span className="count">{quoteApprovals.length || approvals.length}</span>
                <label>Pending Quotes</label>
            </div>
            {(quoteApprovals.length ? quoteApprovals : approvals).slice(0, 3).map((q: any, i: number) => (
                <div key={i} className="quote-row">
                    <span className="quote-desc">{q.description ?? q.actionType ?? 'Quotation'}</span>
                    <button onClick={() => onAction('review_quote', { id: q.id })}>Review</button>
                </div>
            ))}
        </div>
    );
};

export const QuotationsWidget = withWidgetContext(QuotationsWidgetCore);
