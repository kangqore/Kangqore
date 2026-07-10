import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const MyKnowledgeWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const briefings: any[] = viewModel.systemBriefings ?? viewModel.briefings ?? [];
    return (
        <div className="my-knowledge-widget">
            <h3>My Knowledge</h3>
            {briefings.length === 0 ? (
                <p className="empty-state">No briefings available</p>
            ) : (
                <ul className="briefing-list">
                    {briefings.slice(0, 4).map((b: any, i: number) => (
                        <li key={i} className={`briefing-item priority-${(b.priority ?? 'normal').toLowerCase()}`}>
                            <span className="briefing-summary">{b.summary ?? b.title ?? 'Briefing'}</span>
                            <span className="briefing-confidence">{((b.confidence ?? 0) * 100).toFixed(0)}%</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const MyKnowledgeWidget = withWidgetContext(MyKnowledgeWidgetCore);
