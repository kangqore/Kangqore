// Lead Queue Widget
// Core Enterprise Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const LeadQueueWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const leads = viewModel.prioritizedLeads || [];

    return (
        <div className="leadqueue-widget">
            <div className="leadqueue-header">
                <h3>Lead Queue</h3>
                <span className="leadqueue-badge">{leads.length} opportunities</span>
            </div>
            <div className="leadqueue-list">
                {leads.map((lead: any) => (
                    <div
                        key={lead.id}
                        className={`leadqueue-card score-${lead.scoreCategory?.toLowerCase() || 'medium'}`}
                        onClick={() => onAction('SELECT_LEAD', { leadId: lead.id })}
                    >
                        <div className="leadqueue-card-header">
                            <span className="leadqueue-name">{lead.companyName}</span>
                            <span className="leadqueue-score">{lead.score}</span>
                        </div>
                        <div className="leadqueue-card-body">
                            <span className="leadqueue-source">{lead.source}</span>
                            <span className="leadqueue-value">{lead.estimatedValue}</span>
                        </div>
                        <div className="leadqueue-card-footer">
                            <span className="leadqueue-contact">{lead.contactName}</span>
                            <span className="leadqueue-age">{lead.ageLabel}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const LeadQueueWidget = withWidgetContext(LeadQueueWidgetCore);
