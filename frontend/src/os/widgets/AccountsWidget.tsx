import React from 'react';
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget';

const AccountsWidgetCore: React.FC<WidgetProps> = ({ viewModel }) => {
    const sessions: any[] = viewModel.liveSessions ?? [];
    const totalAccounts: number = viewModel.totalAccounts ?? sessions.length;
    return (
        <div className="accounts-widget">
            <h3>Accounts</h3>
            <div className="account-count">
                <span className="count">{totalAccounts}</span>
                <label>Active Accounts</label>
            </div>
            {sessions.slice(0, 5).map((s: any, i: number) => (
                <div key={i} className="account-row">
                    <span className="account-name">{s.company ?? s.name ?? `Account ${i + 1}`}</span>
                    <span className="trust-score">{(s.trustScore ?? 0).toFixed(0)}%</span>
                </div>
            ))}
        </div>
    );
};

export const AccountsWidget = withWidgetContext(AccountsWidgetCore);
