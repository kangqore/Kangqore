import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Sources = () => {
  const [sources, setSources] = useState(null);
  const [jobs, setJobs] = useState(null);

  const loadSources = () =>
    fetch('/api/admin/kangqore-vis/sources', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { sources: [] }))
      .then((d) => setSources(d.sources ?? []))
      .catch(() => setSources([]));

  const loadJobs = () =>
    fetch('/api/admin/kangqore-vis/cron', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { jobs: [] }))
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => setJobs([]));

  useEffect(() => {
    loadSources();
    loadJobs();
  }, []);

  const toggle = async (id, enabled) => {
    await fetch(`/api/admin/kangqore-vis/cron/${id}/${enabled ? 'disable' : 'enable'}`, {
      method: 'POST',
      credentials: 'include',
    });
    await loadJobs();
  };

  const runNow = async (id) => {
    await fetch(`/api/admin/kangqore-vis/cron/${id}/run-now`, { method: 'POST', credentials: 'include' });
  };

  return (
    <KangqoreVisAdminShell
      title="Sources & Cron"
      description="Connect data sources and toggle scheduled jobs. Everything starts unconnected/disabled — flip switches as you go."
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h3>
          {sources === null ? (
            <EmptyState title="Loading sources…" />
          ) : (
            <ul className="space-y-2">
              {sources.map((s) => (
                <li
                  key={s.name}
                  className="rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.kind}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      s.status === 'connected'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cron Jobs</h3>
          {jobs === null ? (
            <EmptyState title="Loading jobs…" />
          ) : (
            <ul className="space-y-2">
              {jobs.map((j) => (
                <li key={j.id} className="rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{j.id}</div>
                      <div className="text-xs text-gray-500">
                        {j.cron} · {j.description}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => runNow(j.id)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                      >
                        Run now
                      </button>
                      <button
                        onClick={() => toggle(j.id, j.enabled)}
                        className={`text-xs px-2 py-1 rounded ${
                          j.enabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {j.enabled ? 'enabled' : 'disabled'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </KangqoreVisAdminShell>
  );
};

export default Sources;
