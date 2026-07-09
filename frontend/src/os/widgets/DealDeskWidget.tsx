// Deal Desk Widget
// Core Enterprise Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const DealDeskWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const pendingDeals = viewModel.pendingApprovals || [];

    return (
        <div className="dealdesk-widget">
            <div className="dealdesk-header">
                <h3>Deal Desk</h3>
                <span className="dealdesk-badge">{pendingDeals.length} pending</span>
            </div>
            <div className="dealdesk-list">
                {pendingDeals.map((deal: any) => (
                    <div key={deal.id} className={`dealdesk-card urgency-${deal.urgency?.toLowerCase() || 'normal'}`}>
                        <div className="dealdesk-card-header">
                            <span className="dealdesk-client">{deal.clientName}</span>
                            <span className="dealdesk-value">{deal.formattedValue}</span>
                        </div>
                        <div className="dealdesk-card-body">
                            <span className="dealdesk-type">{deal.dealType}</span>
                            <span className="dealdesk-discount">{deal.discountRequested}% discount requested</span>
                        </div>
                        <div className="dealdesk-actions">
                            <button
                                className="dealdesk-approve"
                                onClick={() => onAction('APPROVE_DEAL', { dealId: deal.id })}
                            >
                                Approve
                            </button>
                            <button
                                className="dealdesk-reject"
                                onClick={() => onAction('REJECT_DEAL', { dealId: deal.id })}
                            >
                                Reject
                            </button>
                            <button
                                className="dealdesk-escalate"
                                onClick={() => onAction('ESCALATE_DEAL', { dealId: deal.id })}
                            >
                                Escalate
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DealDeskWidget = withWidgetContext(DealDeskWidgetCore);
