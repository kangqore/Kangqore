import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const ForecastWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const predictions: any[] = viewModel.capacityForecasts ?? viewModel.predictions ?? [];
    const revPrediction = predictions.find((p: any) =>
        (p.target ?? '').toLowerCase().includes('revenue')
    ) ?? predictions[0];
    return (
        <div className="forecast-widget">
            <h3>Forecast</h3>
            {revPrediction ? (
                <div className="forecast-card">
                    <p className="forecast-target">{revPrediction.target ?? 'Revenue'}</p>
                    <p className="forecast-horizon">{revPrediction.horizon ?? '--'}</p>
                    <p className="forecast-confidence">
                        {((revPrediction.confidence ?? 0) * 100).toFixed(0)}% confidence
                    </p>
                    {revPrediction.driftDetected && (
                        <span className="drift-badge">Drift Detected</span>
                    )}
                </div>
            ) : (
                <p className="empty-state">No revenue forecast available</p>
            )}
            <p className="prediction-count">{predictions.length} total predictions</p>
        </div>
    );
};

export const ForecastWidget = withWidgetContext(ForecastWidgetCore);
