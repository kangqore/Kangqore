import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const HubSpoke = () => {
  const [hubs, setHubs] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/architecture/hubs', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { hubs: [] }))
      .then((d) => setHubs(d.hubs ?? []))
      .catch(() => setHubs([]));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Hub & Spoke Topology"
      description="Departments are hubs. Services and case studies are spokes. Industries cross-cut."
    >
      {hubs === null ? (
        <EmptyState title="Loading hubs…" />
      ) : hubs.length === 0 ? (
        <EmptyState
          title="No hubs yet"
          hint="Run the entity importer to bootstrap from departments and industries."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {hubs.map((hub) => (
            <div key={hub.id} className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
              <div className="font-medium">{hub.name}</div>
              <div className="text-xs text-gray-500">{hub.url}</div>
              <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                {(hub.spokes ?? []).map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
                {(hub.spokes ?? []).length === 0 ? (
                  <li className="text-gray-400 list-none">No spokes yet</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default HubSpoke;
