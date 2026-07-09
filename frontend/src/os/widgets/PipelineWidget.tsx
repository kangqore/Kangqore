// Pipeline Widget
// Core Enterprise Widget — Revenue Workspace

import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PipelineWidgetCore: React.FC<WidgetProps> = ({ viewModel, onAction }) => {
    const stages = viewModel.pipelineStages || [];
    const totalValue = viewModel.pipelineTotalValue || '—';
    const dealCount = viewModel.pipelineDealCount || 0;

    return (
        <div className="pipeline-widget">
            <div className="pipeline-header">
                <h3>Sales Pipeline</h3>
                <div className="pipeline-summary">
                    <span className="pipeline-total">{totalValue}</span>
                    <span className="pipeline-count">{dealCount} deals</span>
                </div>
            </div>
            <div className="pipeline-funnel">
                {stages.map((stage: any) => (
                    <div
                        key={stage.id}
                        className={`pipeline-stage stage-${stage.health?.toLowerCase() || 'normal'}`}
                        onClick={() => onAction('SELECT_PIPELINE_STAGE', { stageId: stage.id })}
                    >
                        <div className="stage-bar">
                            <div className="stage-fill" style={{ width: `${stage.fillPercent || 0}%` }} />
                        </div>
                        <div className="stage-info">
                            <span className="stage-name">{stage.name}</span>
                            <span className="stage-value">{stage.formattedValue}</span>
                            <span className="stage-count">{stage.count} deals</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PipelineWidget = withWidgetContext(PipelineWidgetCore);
