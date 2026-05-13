import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const InternalLinkBlock = ({ blueprintId, title = 'Related' }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!blueprintId) return;
    fetch(`/api/kangqore-vis/internal-linking/suggestions/${blueprintId}`)
      .then((r) => (r.ok ? r.json() : { suggestions: [] }))
      .then((data) => setItems(data?.suggestions ?? []))
      .catch(() => setItems([]));
  }, [blueprintId]);

  const trackClick = (url, anchorText) => {
    fetch('/api/kangqore-vis/links/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceUrl: window.location.pathname,
        targetUrl: url,
        anchorText,
        position: 'internal-link-block',
      }),
      keepalive: true,
    }).catch(() => {});
  };

  if (!items.length) return null;

  return (
    <section className="mt-8">
      <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-3">{title}</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.url}>
            <Link
              to={item.url}
              onClick={() => trackClick(item.url, item.pageName)}
              className="block px-4 py-3 border border-gray-200 rounded-md hover:border-brand-blue/40 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">{item.pageName}</div>
              <div className="text-xs text-gray-500">{item.reason}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default InternalLinkBlock;
