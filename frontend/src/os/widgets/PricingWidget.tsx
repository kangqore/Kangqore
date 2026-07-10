import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const PricingWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const domains: any[] = viewModel.operationalDomains ?? viewModel.ecosystemDomains ?? [];
    const pricingDomain  = domains.find((d: any) => (d.name ?? '').toLowerCase().includes('sales')) ?? domains[0];
    return (
        <div className="pricing-widget">
            <h3>Pricing</h3>
            {pricingDomain ? (
                <div className="pricing-summary">
                    <p className="domain-name">{pricingDomain.name} Domain</p>
                    <div className="kpi-list">
                        {(pricingDomain.kpis ?? []).slice(0, 3).map((k: any, i: number) => (
                            <div key={i} className="kpi-row">
                                <span className="kpi-name">{k.name}</span>
                                <span className={`kpi-value ${k.current > k.target ? 'over' : 'on-track'}`}>
                                    {k.current} / {k.target}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="empty-state">Pricing data loading</p>
            )}
        </div>
    );
};

export const PricingWidget = withWidgetContext(PricingWidgetCore);
