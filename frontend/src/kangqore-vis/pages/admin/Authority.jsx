import React, { useEffect, useState } from 'react';
import KangqoreVisAdminShell, { EmptyState } from './KangqoreVisAdminShell';

const Authority = () => {
  const [campaigns, setCampaigns] = useState(null);

  useEffect(() => {
    fetch('/api/admin/kangqore-vis/authority/outreach', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { campaigns: [] }))
      .then((d) => setCampaigns(d.campaigns ?? []))
      .catch(() => setCampaigns([]));
  }, []);

  return (
    <KangqoreVisAdminShell
      title="Authority"
      description="Outreach campaigns, mentions, partner pages. Real authority compounds slowly — track here."
    >
      {campaigns === null ? (
        <EmptyState title="Loading…" />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No outreach campaigns yet"
          hint="Register campaigns via POST /api/admin/kangqore-vis/authority — outreach should be intentional, not algorithmic."
        />
      ) : (
        <div className="space-y-2">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">
                started {c.startedAt} · {c.prospects} prospects · {c.responses} responses · {c.placements} placements
              </div>
            </div>
          ))}
        </div>
      )}
    </KangqoreVisAdminShell>
  );
};

export default Authority;
