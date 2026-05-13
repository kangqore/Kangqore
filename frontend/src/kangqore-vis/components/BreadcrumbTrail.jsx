import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbTrail = () => {
  const location = useLocation();
  if (!location.pathname || location.pathname === '/') return null;

  const segments = location.pathname.split('/').filter(Boolean);
  let current = '';

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-500 py-2">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        {segments.map((segment, idx) => {
          current += `/${segment}`;
          const name = segment
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          const isLast = idx === segments.length - 1;
          return (
            <React.Fragment key={current}>
              <li aria-hidden="true">/</li>
              <li>
                {isLast ? (
                  <span aria-current="page">{name}</span>
                ) : (
                  <Link to={current} className="hover:underline">
                    {name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;
