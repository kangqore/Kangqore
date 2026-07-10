import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const RevenueIntelligenceWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = viewModel.analyticsBriefings ?? viewModel.systemBriefings ?? [];
    const topBriefing = briefings[0];
    return (
        <div className="revenue-intelligence-widget">
            <h3>Revenue Intelligence</h3>
            {topBriefing ? (
                <div className="intelligence-card">
                    <p className="briefing-summary">{topBriefing.summary ?? 'Intelligence briefing'}</p>
                    {topBriefing.recommendations?.slice(0, 2).map((r: string, i: number) => (
                        <p key={i} className="recommendation">↗ {r}</p>
                    ))}
                </div>
            ) : (
                <p className="empty-state">No intelligence briefings available</p>
            )}
            <p className="briefing-count">{briefings.length} briefing{briefings.length !== 1 ? 's' : ''}</p>
        </div>
    );
};

export const RevenueIntelligenceWidget = withWidgetContext(RevenueIntelligenceWidgetCore);
