import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const StrategyCenterWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const synthesis: string | null = viewModel.latestSynthesis ?? viewModel.kimmSynthesis ?? null;
    const phase: string = viewModel.waandaPhase ?? 'OBSERVE';
    return (
        <div className="strategy-center-widget">
            <h3>Strategy Center</h3>
            <div className="cognitive-phase">
                <span className="phase-label">Cognitive Phase</span>
                <span className={`phase-value phase-${phase.toLowerCase()}`}>{phase}</span>
            </div>
            {synthesis ? (
                <div className="strategy-synthesis">
                    <p className="synthesis-text">{synthesis}</p>
                </div>
            ) : (
                <p className="empty-state">Awaiting WAANDA strategic synthesis</p>
            )}
        </div>
    );
};

export const StrategyCenterWidget = withWidgetContext(StrategyCenterWidgetCore);
