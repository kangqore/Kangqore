import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/admin/kangqore-vis/overview', label: 'Overview' },
  { to: '/admin/kangqore-vis/blueprints', label: 'Blueprints' },
  { to: '/admin/kangqore-vis/hub-spoke', label: 'Hub & Spoke' },
  { to: '/admin/kangqore-vis/schemas', label: 'Schemas' },
  { to: '/admin/kangqore-vis/entities', label: 'Entities' },
  { to: '/admin/kangqore-vis/faqs', label: 'FAQ Bank' },
  { to: '/admin/kangqore-vis/concierge', label: 'Concierge' },
  { to: '/admin/kangqore-vis/governance', label: 'Governance' },
  { to: '/admin/kangqore-vis/performance', label: 'Performance' },
  { to: '/admin/kangqore-vis/authority', label: 'Authority' },
  { to: '/admin/kangqore-vis/backlinks', label: 'Backlinks' },
  { to: '/admin/kangqore-vis/sources', label: 'Sources & Cron' },
];

const KangqoreVisAdminShell = ({ title, description, children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
            <span>KangqoreVis</span>
            <span>·</span>
            <span>Visibility Intelligence</span>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-1">{title}</h1>
          {description ? <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p> : null}
        </header>

        <nav className="border-b border-gray-200 mb-6 overflow-x-auto">
          <ul className="flex gap-1 text-sm">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`block px-4 py-2 whitespace-nowrap border-b-2 -mb-px ${
                      active
                        ? 'border-brand-blue text-brand-blue font-medium'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
};

export const EmptyState = ({ title, hint, cta }) => (
  <div className="rounded-lg border border-dashed border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 p-8 text-center">
    <div className="text-gray-700 dark:text-gray-300 font-medium">{title}</div>
    {hint ? <div className="text-sm text-gray-500 mt-2">{hint}</div> : null}
    {cta ? <div className="mt-4">{cta}</div> : null}
  </div>
);

export const Card = ({ title, value, subtitle, status }) => (
  <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 p-4">
    <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
    <div className="mt-2 flex items-baseline gap-2">
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value === null || value === undefined ? '—' : value}
      </div>
      {status === 'unconnected' ? (
        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">unconnected</span>
      ) : null}
      {status === 'live' ? (
        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">live</span>
      ) : null}
    </div>
    {subtitle ? <div className="text-xs text-gray-500 mt-1">{subtitle}</div> : null}
  </div>
);

export default KangqoreVisAdminShell;
