import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { Card, EmptyState } from './KangqoreVisAdminShell';

const Performance = () => {
  const [budget, setBudget] = useState(null);
  const [rollups, setRollups] = useState({});

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/performance/budget', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setBudget);

    Promise.all(
      ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map((m) =>
        fetch(`/api/admin/kangqore-vis/performance/rollup/${m}`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => [m, data])
      )
    ).then((entries) => setRollups(Object.fromEntries(entries.filter(([, v]) => v !== null))));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Performance"
      description="Core Web Vitals telemetry from real users. Mount <WebVitalsReporter /> in App.js to enable."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {['LCP', 'INP', 'CLS', 'FCP', 'TTFB'].map((m) => {
          const r = rollups[m];
          return (
            <Card
              key={m}
              title={`${m} (p75)`}
              value={r?.samples ? Math.round(r.p75 * 100) / 100 : null}
              subtitle={r?.samples ? `${r.samples} samples` : 'no samples yet'}
              status={r?.samples ? 'live' : undefined}
            />
          );
        })}
      </div>
      {budget ? (
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
          <div className="text-sm font-medium mb-2">Performance budget</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pr-4 py-1">Metric</th>
                <th className="pr-4 py-1">Good</th>
                <th className="pr-4 py-1">Poor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(budget.thresholds).map(([metric, t]) => (
                <tr key={metric} className="border-t border-gray-100">
                  <td className="pr-4 py-1 font-medium">{metric}</td>
                  <td className="pr-4 py-1">{t.good}</td>
                  <td className="pr-4 py-1">{t.poor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="Loading budget…" />
      )}
    </KangqoreVisAdminShell>
  );
};

export default Performance;
