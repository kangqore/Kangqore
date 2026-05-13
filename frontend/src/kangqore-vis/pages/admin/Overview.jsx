import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { Card, EmptyState } from './KangqoreVisAdminShell';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/kpi/overview', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Overview"
      description="Visibility intelligence at a glance. Each card declares its source — connect to light up."
    >
      {loading ? (
        <EmptyState title="Loading KPI overview…" />
      ) : !data ? (
        <EmptyState title="Could not load KPIs" hint="Sign in as an admin to view this dashboard." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.kpis.map((kpi) => (
              <Card
                key={kpi.metric}
                title={kpi.label}
                value={kpi.value}
                subtitle={`source: ${kpi.source}`}
                status={kpi.status === 'live' ? 'live' : kpi.status === 'unconnected' ? 'unconnected' : undefined}
              />
            ))}
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Connected sources</div>
              {data.connected.length === 0 ? (
                <div className="text-sm text-gray-500">None yet. KangqoreVis is wired and ready — connect adapters to flow data.</div>
              ) : (
                <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                  {data.connected.map((c) => <li key={c}>{c}</li>)}
                </ul>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Pending sources</div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                {data.unconnected.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
          </div>
        </>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Overview;
